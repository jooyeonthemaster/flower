import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

// Firebase Admin 초기화
if (!getApps().length) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim();

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    initializeApp({
      credential: cert(serviceAccount),
      storageBucket: storageBucket,
    });
  } else {
    initializeApp({
      projectId: projectId,
      storageBucket: storageBucket,
    });
  }
}

// Vercel Pro plan: 60초 (상태 체크 + 영상 다운로드 + Firebase 업로드)
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

      console.log('Video generation completed, downloading and uploading to Firebase...');

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
      const buffer = Buffer.from(videoBuffer);
      console.log(`Video downloaded. Size: ${(buffer.length / 1024 / 1024).toFixed(1)}MB`);

      // Firebase Storage에 업로드 (413 에러 방지)
      let finalVideoUrl: string;
      try {
        const bucket = getStorage().bucket();
        const timestamp = Date.now();
        const uploadPath = `generated-videos/scene_${timestamp}.mp4`;
        const file = bucket.file(uploadPath);

        await file.save(buffer, {
          metadata: { contentType: 'video/mp4' },
        });
        await file.makePublic();

        finalVideoUrl = `https://storage.googleapis.com/${bucket.name}/${uploadPath}`;
        console.log(`Uploaded to Firebase: ${finalVideoUrl}`);
      } catch (uploadError) {
        console.error('Firebase upload failed:', uploadError);
        // 업로드 실패 시 외부 URL 직접 반환 (Higgsfield URL)
        finalVideoUrl = completedResult.video.url;
        console.log(`Using external URL fallback: ${finalVideoUrl}`);
      }

      return NextResponse.json({
        success: true,
        status: 'completed',
        videoUrl: finalVideoUrl,
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
