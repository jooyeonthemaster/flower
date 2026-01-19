import { NextRequest, NextResponse } from 'next/server';

// Vercel Pro plan: 60초 (상태 체크 + 영상 다운로드)
export const maxDuration = 60;

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
  | { status: 'queued'; request_id: string }
  | { status: 'in_progress'; request_id: string }
  | HiggsFieldCompletedResponse
  | HiggsFieldErrorResponse;

/**
 * 영상 생성 상태 확인 API
 * 클라이언트에서 직접 폴링할 때 사용
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { statusUrl } = body;

    if (!statusUrl) {
      return NextResponse.json(
        { success: false, error: 'statusUrl이 필요합니다.' },
        { status: 400 }
      );
    }

    // Higgsfield API 키 확인
    const apiKey = process.env.HIGGSFIELD_API_KEY;
    const apiSecret = process.env.HIGGSFIELD_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { success: false, error: 'API credentials not configured' },
        { status: 500 }
      );
    }

    // 상태 확인
    const statusResponse = await fetch(statusUrl, {
      headers: {
        'hf-api-key': apiKey,
        'hf-secret': apiSecret,
      },
    });

    if (!statusResponse.ok) {
      return NextResponse.json({
        success: true,
        status: 'checking',
        message: 'Status check failed, will retry',
      });
    }

    const statusResult = await statusResponse.json() as HiggsFieldStatusResponse;
    console.log('Status check:', statusResult.status);

    // 완료된 경우: 영상 다운로드 및 base64 변환
    if (statusResult.status === 'completed') {
      const completedResult = statusResult as HiggsFieldCompletedResponse;

      if (!completedResult.video?.url) {
        return NextResponse.json({
          success: false,
          status: 'failed',
          error: '영상 URL이 응답에 없습니다.',
        });
      }

      console.log('Video generation completed, downloading...');

      // 영상 다운로드
      const videoResponse = await fetch(completedResult.video.url);
      if (!videoResponse.ok) {
        return NextResponse.json({
          success: false,
          status: 'failed',
          error: '영상 다운로드 실패',
        });
      }

      const videoBuffer = await videoResponse.arrayBuffer();
      const videoBase64 = Buffer.from(videoBuffer).toString('base64');
      const videoDataUrl = `data:video/mp4;base64,${videoBase64}`;

      console.log(`Video downloaded. Size: ${videoBuffer.byteLength} bytes`);

      return NextResponse.json({
        success: true,
        status: 'completed',
        videoUrl: videoDataUrl,
        externalUrl: completedResult.video.url,
      });
    }

    // 실패한 경우
    if (statusResult.status === 'failed') {
      const errorResult = statusResult as HiggsFieldErrorResponse;
      return NextResponse.json({
        success: false,
        status: 'failed',
        error: errorResult.error || '영상 생성 실패',
      });
    }

    // NSFW 차단
    if (statusResult.status === 'nsfw') {
      return NextResponse.json({
        success: false,
        status: 'failed',
        error: '콘텐츠 정책 위반으로 영상 생성이 차단되었습니다.',
      });
    }

    // 진행 중인 경우
    return NextResponse.json({
      success: true,
      status: statusResult.status, // 'queued' 또는 'in_progress'
    });

  } catch (error: unknown) {
    console.error('Check Video Status Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
