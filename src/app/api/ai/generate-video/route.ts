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
    const { sourceImageUrl, prompt, aspectRatio = '16:9' } = body;

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

    // 2. Veo 3.1 영상 생성 요청
    // 중요: Veo 3.1은 1:1 비율을 지원하지 않음 (16:9, 9:16만 지원)
    // 1:1이 필요한 경우 16:9로 생성 후 영상 합성 단계에서 FFmpeg로 크롭
    const videoAspectRatio = aspectRatio === '9:16' ? '9:16' : '16:9';

    console.log(`Requested aspectRatio: ${aspectRatio}, Using videoAspectRatio: ${videoAspectRatio}`);

    // 화려한 폭죽/확산 효과 기본 프롬프트 (회전 효과 제거)
    const defaultPrompt = `Animate this holographic image with SPECTACULAR EXPLOSIVE EFFECTS:
- Energy and particles BURSTING OUTWARD from the center in all directions like fireworks
- Glowing sparkles and light rays RADIATING and EXPANDING from center
- Pulsating energy waves spreading outward rhythmically
- Particle trails following the outward motion, creating depth
- Bright glowing core in the center with explosive particle fountains
- NO rotation, NO spinning - ONLY radial burst and expansion effects
- Think: celebration fireworks, energy explosion, magical burst
- Ultra high quality, 8k resolution, cinematic lighting, volumetric effects
- Smooth animation with multiple particle layers at different speeds`;

    let operation = await client.models.generateVideos({
      model: "veo-3.1-generate-preview",
      prompt: prompt || defaultPrompt,
      image: {
        imageBytes: imageBase64,
        mimeType: mimeType,
      },
      config: {
        aspectRatio: videoAspectRatio,
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

    // 상세 응답 로깅
    console.log('Video generation complete.');
    console.log('Operation response keys:', Object.keys(operation.response || {}));
    console.log('Full response:', JSON.stringify(operation.response, null, 2));

    // 응답 구조 분석 (타입 캐스팅으로 유연하게 처리)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = operation.response as any;
    const generatedVideos = response?.generatedVideos;

    // 에러 응답 확인
    if (response?.error) {
      throw new Error(`Veo API 에러: ${JSON.stringify(response.error)}`);
    }

    // 콘텐츠 필터링 확인 (RAI = Responsible AI)
    if (response?.raiMediaFilteredCount > 0) {
      const reasons = response?.raiMediaFilteredReasons || [];
      const reasonText = reasons.join(', ');

      // 사용자 친화적 에러 메시지로 변환
      let userMessage = '콘텐츠 정책으로 인해 영상을 생성할 수 없습니다.';

      if (reasonText.includes('celebrity')) {
        userMessage = '이미지에 유명인 또는 유사한 얼굴이 포함되어 영상 생성이 차단되었습니다. 다른 이미지를 사용해주세요.';
      } else if (reasonText.includes('violence') || reasonText.includes('harmful')) {
        userMessage = '이미지에 부적절한 콘텐츠가 감지되었습니다. 다른 이미지를 사용해주세요.';
      } else if (reasonText.includes('copyright')) {
        userMessage = '저작권 관련 콘텐츠가 감지되었습니다. 다른 이미지를 사용해주세요.';
      }

      console.error(`RAI Filter: ${reasonText}`);
      throw new Error(userMessage);
    }

    // 생성된 영상 배열 확인
    if (!generatedVideos || generatedVideos.length === 0) {
      // 알 수 없는 이유로 영상이 없는 경우
      const responseStr = JSON.stringify(response).substring(0, 500);
      throw new Error(`영상 생성에 실패했습니다. 다시 시도해주세요. (${responseStr})`);
    }

    const firstVideo = generatedVideos[0];
    console.log('First video object:', JSON.stringify(firstVideo, null, 2));

    // video 필드 확인 (다양한 경로 시도)
    const videoFile = firstVideo?.video || firstVideo?.uri || firstVideo?.videoUri;

    if (!videoFile) {
      // 영상 객체는 있지만 video 필드가 없는 경우
      const videoStr = JSON.stringify(firstVideo).substring(0, 500);
      throw new Error(`영상 파일 참조 없음. Video object: ${videoStr}`);
    }

    const filename = `hologram_video_${Date.now()}.mp4`;

    // OS에 맞는 임시 디렉토리 사용 (Windows: AppData\Local\Temp, Linux/Vercel: /tmp)
    const saveDir = os.tmpdir();
    const filepath = path.join(saveDir, filename);

    console.log(`Downloading video to: ${filepath}`);

    await client.files.download({
      file: videoFile,
      downloadPath: filepath
    });

    // 파일 존재 확인
    if (!fs.existsSync(filepath)) {
      throw new Error(`다운로드된 파일이 존재하지 않음: ${filepath}`);
    }

    // 파일을 base64로 읽어서 data URL로 반환
    const videoBuffer = fs.readFileSync(filepath);
    const videoBase64 = videoBuffer.toString('base64');
    const videoDataUrl = `data:video/mp4;base64,${videoBase64}`;

    console.log(`Video downloaded successfully. Size: ${videoBuffer.length} bytes`);

    // 임시 파일 삭제 (정리)
    fs.unlinkSync(filepath);

    return NextResponse.json({
      success: true,
      videoUrl: videoDataUrl
    });

  } catch (error: unknown) {
    console.error('Generate Video Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
