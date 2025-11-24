import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sourceImageUrl, prompt } = body;

    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      console.error('API Key missing in generate-video');
      return NextResponse.json(
        { success: false, error: 'API Key not configured' },
        { status: 500 }
      );
    }

    const client = new GoogleGenAI({ apiKey });

    const imagePath = path.join(process.cwd(), 'public', sourceImageUrl);
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Source image not found at ${imagePath}`);
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString('base64');

    console.log('Starting Veo generation with prompt:', prompt);
    
    // 2. Veo 3.1 영상 생성 요청 (16:9 비율 강제)
    let operation = await client.models.generateVideos({
      model: "veo-3.1-generate-preview",
      prompt: prompt || "Make this hologram animated, slow 360 degree rotation, glowing particles, 8k resolution, cinematic lighting",
      image: {
        imageBytes: imageBase64,
        mimeType: "image/png",
      },
      config: {
        aspectRatio: "16:9", // 가로형(Landscape) 비율 설정
        // resolution: "720p" // 기본값
      }
    });

    console.log('Video operation started:', operation);

    const startTime = Date.now();
    const MAX_WAIT_TIME = 180000;
    
    while (!operation.done) {
      if (Date.now() - startTime > MAX_WAIT_TIME) {
        throw new Error('Video generation timed out');
      }
      
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log('Polling video status...');
      
      operation = await client.operations.getVideosOperation({
        operation: operation,
      });
    }

    console.log('Video generation complete. Response:', JSON.stringify(operation.response, null, 2));

    if (operation.response?.generatedVideos?.[0]?.video) {
      const videoFile = operation.response.generatedVideos[0].video;
      const filename = `hologram_video_${Date.now()}.mp4`;
      const saveDir = path.join(process.cwd(), 'public', 'generated', 'videos');
      
      if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir, { recursive: true });
      }

      const filepath = path.join(saveDir, filename);

      await client.files.download({
        file: videoFile,
        downloadPath: filepath
      });
      
      const videoUrl = `/generated/videos/${filename}`;
      
      return NextResponse.json({ 
        success: true, 
        videoUrl: videoUrl 
      });
    } else {
      throw new Error('Video generation completed but no video data found');
    }

  } catch (error: unknown) {
    console.error('Generate Video Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
