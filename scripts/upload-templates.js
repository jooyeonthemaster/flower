/**
 * 템플릿 영상 Firebase Storage 업로드 스크립트
 * 실행: node scripts/upload-templates.js
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const fs = require('fs');
const path = require('path');

// Firebase Admin SDK 키 파일 경로
const serviceAccountPath = path.join(__dirname, '..', 'flower-63624-firebase-adminsdk-fbsvc-e0b1cf0f43.json');

// Storage bucket
const storageBucket = 'flower-63624.firebasestorage.app';

// 업로드할 템플릿 영상 목록
const templateVideos = [
  'wedding-fancy.mp4',
  'wedding-simple.mp4',
  'opening-fancy.mp4',
  'opening-simple.mp4',
  'event-fancy.mp4',
  'event-simple.mp4',
];

async function uploadTemplates() {
  console.log('=== Firebase Storage 템플릿 업로드 시작 ===\n');

  // Firebase Admin 초기화
  if (!fs.existsSync(serviceAccountPath)) {
    console.error('Firebase Admin SDK 키 파일이 없습니다:', serviceAccountPath);
    process.exit(1);
  }

  const serviceAccount = require(serviceAccountPath);

  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: storageBucket,
  });

  const bucket = getStorage().bucket();
  const videosDir = path.join(__dirname, '..', 'public', 'templates', 'videos');
  const uploadedUrls = {};

  for (const videoFile of templateVideos) {
    const localPath = path.join(videosDir, videoFile);

    if (!fs.existsSync(localPath)) {
      console.log(`[SKIP] ${videoFile} - 파일 없음`);
      continue;
    }

    const stats = fs.statSync(localPath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);

    console.log(`[UPLOAD] ${videoFile} (${sizeMB}MB)...`);

    try {
      const storagePath = `templates/videos/${videoFile}`;
      const file = bucket.file(storagePath);

      await file.save(fs.readFileSync(localPath), {
        metadata: {
          contentType: 'video/mp4',
        },
      });

      await file.makePublic();

      const publicUrl = `https://storage.googleapis.com/${storageBucket}/${storagePath}`;
      uploadedUrls[videoFile] = publicUrl;

      console.log(`[SUCCESS] ${videoFile} -> ${publicUrl}\n`);
    } catch (error) {
      console.error(`[ERROR] ${videoFile}:`, error.message);
    }
  }

  console.log('\n=== 업로드 완료 ===');
  console.log('\n업로드된 URL 목록:');
  console.log(JSON.stringify(uploadedUrls, null, 2));

  // URL 매핑 파일 생성
  const urlMapPath = path.join(__dirname, 'template-urls.json');
  fs.writeFileSync(urlMapPath, JSON.stringify(uploadedUrls, null, 2));
  console.log(`\nURL 매핑 저장됨: ${urlMapPath}`);
}

uploadTemplates().catch(console.error);
