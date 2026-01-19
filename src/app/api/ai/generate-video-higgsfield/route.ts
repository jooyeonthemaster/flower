import { NextRequest, NextResponse } from 'next/server';

// Vercel Pro plan: 최대 300초 (5분)
export const maxDuration = 300;

// Higgsfield Cloud Platform API
const HIGGSFIELD_API_BASE = 'https://platform.higgsfield.ai';
// Image-to-Video 모델 ID (DoP Lite - 크레딧 소모 가장 적음)
const MODEL_ID = 'higgsfield-ai/dop/lite';

interface HiggsFieldQueuedResponse {
  status: 'queued';
  request_id: string;
  status_url: string;
  cancel_url: string;
}

interface HiggsFieldCompletedResponse {
  status: 'completed';
  request_id: string;
  video: {
    url: string;
  };
}

interface HiggsFieldErrorResponse {
  status: 'failed' | 'nsfw';
  request_id: string;
  error?: string;
}

type HiggsFieldStatusResponse =
  | HiggsFieldQueuedResponse
  | HiggsFieldCompletedResponse
  | HiggsFieldErrorResponse
  | { status: 'in_progress'; request_id: string };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sourceImageUrl, prompt, duration = 5 } = body;

    // Higgsfield API 키 확인
    const apiKey = process.env.HIGGSFIELD_API_KEY;
    const apiSecret = process.env.HIGGSFIELD_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.error('Higgsfield API credentials missing');
      return NextResponse.json(
        { success: false, error: 'Higgsfield API credentials not configured' },
        { status: 500 }
      );
    }

    // 이미지 URL 준비
    let imageUrl: string;

    if (sourceImageUrl.startsWith('data:')) {
      // Data URL인 경우 Firebase Storage에 업로드
      console.log('Uploading image to Firebase Storage...');

      const uploadResponse = await fetch(new URL('/api/upload-image', req.url).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataUrl: sourceImageUrl,
          filename: `higgsfield-input-${Date.now()}.png`,
        }),
      });

      if (!uploadResponse.ok) {
        const uploadError = await uploadResponse.text();
        throw new Error(`이미지 업로드 실패: ${uploadError}`);
      }

      const uploadResult = await uploadResponse.json();
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || '이미지 업로드 실패');
      }

      imageUrl = uploadResult.url;
      console.log('Image uploaded:', imageUrl);
    } else {
      imageUrl = sourceImageUrl;
    }

    console.log('Starting Higgsfield video generation:', { imageUrl, prompt, duration });

    // 1. 영상 생성 요청 제출
    // AbortController로 명시적 타임아웃 설정 (60초)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    let queuedResult: HiggsFieldQueuedResponse;

    try {
      const generateResponse = await fetch(`${HIGGSFIELD_API_BASE}/${MODEL_ID}`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${apiKey}:${apiSecret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: imageUrl,
          prompt: prompt || 'Spectacular holographic explosion: energy and particles bursting outward from center in all directions like fireworks, glowing sparkles radiating and expanding, pulsating waves spreading outward, NO rotation or spinning, only radial burst effects, celebration fireworks aesthetic, ultra high quality',
          duration: duration, // 5초
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!generateResponse.ok) {
        const errorText = await generateResponse.text();
        console.error('Higgsfield API error:', {
          status: generateResponse.status,
          statusText: generateResponse.statusText,
          headers: Object.fromEntries(generateResponse.headers.entries()),
          body: errorText
        });
        throw new Error(`Higgsfield API 요청 실패 (${generateResponse.status}): ${errorText.substring(0, 200)}`);
      }

      queuedResult = await generateResponse.json() as HiggsFieldQueuedResponse;
      console.log('Request queued:', queuedResult);

      if (queuedResult.status !== 'queued') {
        throw new Error(`예상치 못한 응답 상태: ${queuedResult.status}`);
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error('Higgsfield API 요청 타임아웃 (60초 초과). 서버 응답이 없습니다.');
      }
      throw fetchError;
    }

    // 2. 폴링으로 완료 대기
    const startTime = Date.now();
    const MAX_WAIT_TIME = 280000; // 280초 (Vercel 타임아웃 여유)
    const POLL_INTERVAL = 5000; // 5초마다 확인

    let statusResult: HiggsFieldStatusResponse;

    while (true) {
      if (Date.now() - startTime > MAX_WAIT_TIME) {
        throw new Error('영상 생성 시간 초과');
      }

      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));

      const statusResponse = await fetch(queuedResult.status_url, {
        headers: {
          'Authorization': `Key ${apiKey}:${apiSecret}`,
        },
      });

      if (!statusResponse.ok) {
        console.error('Status check failed:', statusResponse.status);
        continue;
      }

      statusResult = await statusResponse.json() as HiggsFieldStatusResponse;
      console.log('Status check:', statusResult.status);

      if (statusResult.status === 'completed') {
        break;
      } else if (statusResult.status === 'failed') {
        throw new Error('영상 생성 실패');
      } else if (statusResult.status === 'nsfw') {
        throw new Error('콘텐츠 정책 위반으로 영상 생성이 차단되었습니다.');
      }
      // queued 또는 in_progress면 계속 대기
    }

    // 3. 완료된 영상 URL 반환
    const completedResult = statusResult as HiggsFieldCompletedResponse;

    if (!completedResult.video?.url) {
      throw new Error('영상 URL이 응답에 없습니다.');
    }

    console.log('Video generation completed:', completedResult.video.url);

    // 영상을 다운로드하여 base64로 변환 (기존 코드와 호환성 유지)
    const videoResponse = await fetch(completedResult.video.url);
    if (!videoResponse.ok) {
      throw new Error('영상 다운로드 실패');
    }

    const videoBuffer = await videoResponse.arrayBuffer();
    const videoBase64 = Buffer.from(videoBuffer).toString('base64');
    const videoDataUrl = `data:video/mp4;base64,${videoBase64}`;

    console.log(`Video downloaded. Size: ${videoBuffer.byteLength} bytes`);

    return NextResponse.json({
      success: true,
      videoUrl: videoDataUrl,
      externalUrl: completedResult.video.url, // 외부 URL도 함께 반환
    });

  } catch (error: unknown) {
    console.error('Higgsfield Generate Video Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
