/**
 * Firebase Storage CORS 설정 스크립트
 * 실행: node scripts/set-cors.js
 */

const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

// Firebase Admin SDK 키 파일 경로
const serviceAccountPath = path.join(__dirname, '..', 'flower-63624-firebase-adminsdk-fbsvc-e0b1cf0f43.json');

// Storage bucket name
const bucketName = 'flower-63624.firebasestorage.app';

async function setCors() {
  console.log('=== Firebase Storage CORS 설정 ===\n');

  if (!fs.existsSync(serviceAccountPath)) {
    console.error('Firebase Admin SDK 키 파일이 없습니다:', serviceAccountPath);
    process.exit(1);
  }

  // Google Cloud Storage 클라이언트 초기화
  const storage = new Storage({
    keyFilename: serviceAccountPath,
  });

  const bucket = storage.bucket(bucketName);

  // CORS 설정
  const corsConfiguration = [
    {
      origin: [
        'https://www.flower-signage.com',
        'https://flower-signage.com',
        'https://flower-9mhvx2mld-jooyoens-projects-59877186.vercel.app',
        'https://flower-livid-zeta.vercel.app',
        'http://localhost:3000',
        'http://localhost:3001',
      ],
      method: ['GET', 'HEAD', 'OPTIONS'],
      maxAgeSeconds: 3600,
      responseHeader: ['Content-Type', 'Content-Length', 'Content-Range', 'Accept-Ranges'],
    },
  ];

  try {
    await bucket.setCorsConfiguration(corsConfiguration);
    console.log('CORS 설정 완료!');
    console.log('적용된 origin:', corsConfiguration[0].origin);

    // 확인
    const [metadata] = await bucket.getMetadata();
    console.log('\n현재 CORS 설정:', JSON.stringify(metadata.cors, null, 2));
  } catch (error) {
    console.error('CORS 설정 실패:', error.message);
    process.exit(1);
  }
}

setCors();
