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

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'generated-videos';

    if (!file) {
      console.error('[Upload Video] No file provided');
      return NextResponse.json(
        { success: false, error: '파일이 필요합니다.' },
        { status: 400 }
      );
    }

    // File을 Buffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log('[Upload Video] File size:', buffer.length, 'bytes');

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
