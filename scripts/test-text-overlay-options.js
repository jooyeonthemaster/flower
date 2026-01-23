// 텍스트 오버레이 옵션 테스트 스크립트
const fs = require('fs');
const path = require('path');

async function testTextOverlayOptions() {
  const videoPath = path.join(__dirname, '..', 'public', 'templates', 'videos', 'opening-simple.mp4');

  if (!fs.existsSync(videoPath)) {
    console.error('Video file not found:', videoPath);
    process.exit(1);
  }

  const videoBuffer = fs.readFileSync(videoPath);
  const videoBase64 = videoBuffer.toString('base64');
  const videoDataUrl = `data:video/mp4;base64,${videoBase64}`;

  console.log(`Video size: ${(videoBuffer.length / 1024 / 1024).toFixed(2)}MB`);

  // 사용자가 설정할 수 있는 옵션들 테스트
  const requestBody = {
    videoDataUrl,
    texts: [
      '두 분의 결혼을',
      '진심으로 축하합니다',
      '행복한 가정 이루시길',
      '바랍니다',
      '오래오래 행복하세요',
      '축 결 혼'
    ],
    // 커스텀 설정
    fontSize: 80,  // 기본값 50보다 큰 값
    fontFamily: "'SF레몬빙수', sans-serif",  // 다른 폰트
    textColor: '#ff0000',  // 빨간색
    glowColor: '#00ff00',  // 초록색 글로우
    effects: ['glow'],  // 글로우 이펙트 활성화
    textPosition: 'center'
  };

  console.log('\n========== 테스트 설정 ==========');
  console.log('fontSize:', requestBody.fontSize, '(기본값: 50)');
  console.log('fontFamily:', requestBody.fontFamily);
  console.log('textColor:', requestBody.textColor, '(기본값: #ffffff)');
  console.log('glowColor:', requestBody.glowColor, '(기본값: #00ffff)');
  console.log('effects:', requestBody.effects);
  console.log('textPosition:', requestBody.textPosition);
  console.log('=================================\n');

  console.log('Sending request to API...');

  try {
    const port = process.env.PORT || 3001;
    const response = await fetch(`http://localhost:${port}/api/ai/render-text-overlay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (result.success) {
      console.log('\n✅ Success!');
      console.log('Text count:', result.textCount);
      console.log('Engine:', result.engine);

      // 결과 비디오 저장
      const outputPath = path.join(__dirname, '..', 'test-output-options.mp4');
      const base64Data = result.videoUrl.replace(/^data:video\/mp4;base64,/, '');
      fs.writeFileSync(outputPath, Buffer.from(base64Data, 'base64'));
      console.log('Output saved to:', outputPath);
      console.log('\n=> 영상을 열어서 빨간색 텍스트, 초록색 글로우, 80px 폰트가 적용되었는지 확인하세요!');
    } else {
      console.error('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testTextOverlayOptions();
