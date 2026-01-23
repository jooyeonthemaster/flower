const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Firebase Admin SDK 초기화
const serviceAccount = require('../flower-63624-firebase-adminsdk-fbsvc-e0b1cf0f43.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'flower-63624.firebasestorage.app'
});

const bucket = admin.storage().bucket();

// 업로드할 영상 목록
const videos = [
  'opening-fancy.mp4',
  'opening-simple.mp4',
  'wedding-fancy.mp4',
  'wedding-simple.mp4',
  'event-fancy.mp4',
  'event-simple.mp4',
];

async function uploadVideos() {
  const uploadedUrls = {};

  for (const video of videos) {
    const localPath = path.join(__dirname, '../public/templates/videos', video);
    const destination = `templates/videos/${video}`;

    console.log(`Uploading ${video}...`);

    try {
      await bucket.upload(localPath, {
        destination,
        metadata: {
          contentType: 'video/mp4',
          cacheControl: 'public, max-age=31536000', // 1년 캐시
        },
      });

      // 파일을 공개로 설정
      const file = bucket.file(destination);
      await file.makePublic();

      // 공개 URL 생성
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
      uploadedUrls[video] = publicUrl;

      console.log(`✓ ${video} uploaded: ${publicUrl}`);
    } catch (error) {
      console.error(`✗ Failed to upload ${video}:`, error.message);
    }
  }

  console.log('\n=== Uploaded URLs ===');
  console.log(JSON.stringify(uploadedUrls, null, 2));

  // URL을 파일로 저장
  const outputPath = path.join(__dirname, 'template-video-urls.json');
  fs.writeFileSync(outputPath, JSON.stringify(uploadedUrls, null, 2));
  console.log(`\nURLs saved to: ${outputPath}`);
}

uploadVideos().catch(console.error);
