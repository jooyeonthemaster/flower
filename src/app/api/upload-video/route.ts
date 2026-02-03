import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

// Firebase Admin 초기화 (서버사이드용)
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

export async function POST(req: NextRequest) {
  try {
    console.log('[Upload Video] API called');

    // Content-Type 확인하여 FormData 또는 JSON 처리
    const contentType = req.headers.get('content-type') || '';
    let buffer: Buffer;
    let folder: string;

    if (contentType.includes('application/json')) {
      // JSON (Base64) 방식 - AI 버전과 동일
      const body = await req.json();
      const { videoDataUrl, folder: requestFolder } = body;
      folder = requestFolder || 'generated-videos';

      if (!videoDataUrl) {
        console.error('[Upload Video] No videoDataUrl provided');
        return NextResponse.json(
          { success: false, error: 'videoDataUrl이 필요합니다.' },
          { status: 400 }
        );
      }

      // Base64 디코딩
      if (videoDataUrl.startsWith('data:')) {
        const matches = videoDataUrl.match(/^data:video\/([^;]+);base64,(.+)$/);
        if (!matches) {
          throw new Error('Invalid video data URL format');
        }
        const base64Data = matches[2];
        buffer = Buffer.from(base64Data, 'base64');
        console.log('[Upload Video] Base64 decoded, size:', buffer.length, 'bytes');
      } else {
        throw new Error('videoDataUrl must be a data URL');
      }
    } else {
      // FormData 방식 (기존 방식)
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      folder = (formData.get('folder') as string) || 'generated-videos';

      if (!file) {
        console.error('[Upload Video] No file provided');
        return NextResponse.json(
          { success: false, error: '파일이 필요합니다.' },
          { status: 400 }
        );
      }

      // File을 Buffer로 변환
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      console.log('[Upload Video] File size:', buffer.length, 'bytes');
    }

    // 파일명 생성
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const filename = `${folder}/hologram-${timestamp}-${randomId}.mp4`;
    console.log('[Upload Video] Target path:', filename);

    // Firebase Storage에 업로드
    const bucket = getStorage().bucket();
    console.log('[Upload Video] Bucket name:', bucket.name);

    const storageFile = bucket.file(filename);

    await storageFile.save(buffer, {
      metadata: {
        contentType: 'video/mp4',
      },
    });
    console.log('[Upload Video] File saved');

    // 파일을 공개로 설정
    await storageFile.makePublic();
    console.log('[Upload Video] File made public');

    // 공개 URL 생성
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    console.log('[Upload Video] SUCCESS:', publicUrl);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filename,
    });

  } catch (error: unknown) {
    console.error('[Upload Video] ERROR:', error);
    if (error instanceof Error) {
      console.error('[Upload Video] Error message:', error.message);
    }
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
