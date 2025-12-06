import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';
import os from 'os';

// Vercel Pro plan: 최대 300초 (5분)
export const maxDuration = 300;

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

    // Data URL 또는 파일 경로 처리
    let imageBase64: string;
    let mimeType = 'image/png';

    if (sourceImageUrl.startsWith('data:')) {
      // Data URL에서 base64 추출
      const matches = sourceImageUrl.match(/^data:(.+);base64,(.+)$/);
      if (!matches) {
        throw new Error('Invalid data URL format');
      }
      mimeType = matches[1];
      imageBase64 = matches[2];
    } else {
      // 파일 경로 처리 (로컬 개발용)
      const imagePath = path.join(process.cwd(), 'public', sourceImageUrl);
      if (!fs.existsSync(imagePath)) {
        throw new Error(`Source image not found at ${imagePath}`);
      }
      const imageBuffer = fs.readFileSync(imagePath);
      imageBase64 = imageBuffer.toString('base64');
    }

    console.log('Starting Veo generation with prompt:', prompt);

    // 2. Veo 3.1 영상 생성 요청 (16:9 비율 강제)
    let operation = await client.models.generateVideos({
      model: "veo-3.1-generate-preview",
      prompt: prompt || "Create a seamless loop holographic video. Keep center image and text STATIC. Only animate the ring - it must rotate like a SPINNING WHEEL around its center axis while staying FLAT and facing the camera. NO 3D flipping. Clockwise rotation like a loading spinner.",
      image: {
        imageBytes: imageBase64,
        mimeType: mimeType,
      },
      config: {
        aspectRatio: "16:9", // 가로형(Landscape) 비율 설정
        // resolution: "720p" // 기본값
      }
    });

    console.log('Video operation started:', operation);

    const startTime = Date.now();
    // Vercel Pro 최대 300초, 여유를 둬서 280초로 설정
    const MAX_WAIT_TIME = 280000;
    
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = operation.response as any;

    // RAI (Responsible AI) 콘텐츠 필터링 체크
    if (response?.raiMediaFilteredReasons?.length > 0) {
      const reason = response.raiMediaFilteredReasons[0];
      console.error('Video filtered by RAI:', reason);

      // 유명인 감지 에러를 사용자 친화적 메시지로 변환
      if (reason.includes('celebrity')) {
        throw new Error('이미지에서 유명인이 감지되어 영상 생성이 제한되었습니다. 로고나 제품 이미지를 사용해주세요.');
      }
      throw new Error(`콘텐츠 정책으로 인해 영상 생성이 제한되었습니다: ${reason}`);
    }

    if (response?.generatedVideos?.[0]?.video) {
      const videoFile = response.generatedVideos[0].video;
      const filename = `hologram_video_${Date.now()}.mp4`;

      // OS별 임시 디렉토리 사용 (Windows: AppData/Local/Temp, Linux/Vercel: /tmp)
      const saveDir = os.tmpdir();
      const filepath = path.join(saveDir, filename);
      console.log('Saving video to:', filepath);

      await client.files.download({
        file: videoFile,
        downloadPath: filepath
      });

      // 파일을 base64로 읽어서 data URL로 반환
      const videoBuffer = fs.readFileSync(filepath);
      const videoBase64 = videoBuffer.toString('base64');
      const videoDataUrl = `data:video/mp4;base64,${videoBase64}`;

      // /tmp 파일 삭제 (정리)
      fs.unlinkSync(filepath);

      return NextResponse.json({
        success: true,
        videoUrl: videoDataUrl
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
