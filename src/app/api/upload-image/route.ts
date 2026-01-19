import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

// Firebase Admin 초기화 (서버사이드용)
if (!getApps().length) {
  // 환경변수에서 서비스 계정 정보 가져오기 또는 기본 설정 사용
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // 서비스 계정 키가 있는 경우
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    // private_key의 \\n을 실제 줄바꿈으로 변환
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    initializeApp({
      credential: cert(serviceAccount),
      storageBucket: storageBucket,
    });
  } else {
    // 기본 초기화 (로컬 개발용 - Application Default Credentials 사용)
    initializeApp({
      projectId: projectId,
      storageBucket: storageBucket,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('[Upload Image] API called');

    const body = await req.json();
    const { dataUrl, filename } = body;

    if (!dataUrl || !dataUrl.startsWith('data:')) {
      console.error('[Upload Image] Invalid Data URL');
      return NextResponse.json(
        { success: false, error: '유효한 Data URL이 필요합니다.' },
        { status: 400 }
      );
    }

    // Data URL 파싱
    const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      console.error('[Upload Image] Data URL format error');
      return NextResponse.json(
        { success: false, error: 'Data URL 형식이 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    console.log('[Upload Image] Parsed, buffer size:', buffer.length, 'bytes');

    // 파일명 생성
    const timestamp = Date.now();
    const extension = mimeType.split('/')[1] || 'png';
    const finalFilename = filename || `ai-generated-${timestamp}.${extension}`;
    const filePath = `ai-images/${finalFilename}`;
    console.log('[Upload Image] Target path:', filePath);

    // Firebase Storage에 업로드
    console.log('[Upload Image] Getting Storage bucket...');
    const bucket = getStorage().bucket();
    console.log('[Upload Image] Bucket name:', bucket.name);

    const file = bucket.file(filePath);
    console.log('[Upload Image] Saving file...');

    await file.save(buffer, {
      metadata: {
        contentType: mimeType,
      },
    });
    console.log('[Upload Image] File saved, making public...');

    // 파일을 공개로 설정
    await file.makePublic();
    console.log('[Upload Image] File made public');

    // 공개 URL 생성
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

    console.log('[Upload Image] SUCCESS:', publicUrl);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath,
    });

  } catch (error: unknown) {
    console.error('[Upload Image] ERROR:', error);
    if (error instanceof Error) {
      console.error('[Upload Image] Error message:', error.message);
      console.error('[Upload Image] Error stack:', error.stack);
    }
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
