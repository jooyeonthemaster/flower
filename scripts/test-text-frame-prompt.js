/**
 * generate-text-frame 테스트 모드 실행 스크립트
 *
 * 사용법:
 * 1. 먼저 서버 실행: npm run dev
 * 2. 다른 터미널에서: node scripts/test-text-frame-prompt.js
 */

const http = require('http');

const testCases = [
  { text: '축하합니다', category: 'wedding', style: 'fancy' },
  { text: '개업을 축하합니다', category: 'opening', style: 'fancy' },
  { text: '감사합니다', category: 'event', style: 'simple' },
];

async function testPrompt(testCase) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      text: testCase.text,
      backgroundImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      category: testCase.category,
      style: testCase.style,
      testMode: true  // API 호출 없이 프롬프트만 반환
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/ai/generate-text-frame',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve(json);
        } catch (e) {
          reject(new Error(`Parse error: ${body}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('========================================');
  console.log('generate-text-frame 프롬프트 테스트');
  console.log('========================================\n');

  for (const testCase of testCases) {
    console.log(`\n--- Test: ${testCase.text} (${testCase.category}, ${testCase.style}) ---\n`);

    try {
      const result = await testPrompt(testCase);

      if (result.testMode) {
        console.log('✅ Test Mode Active');
        console.log('\n📝 PROMPT:');
        console.log('─'.repeat(50));
        console.log(result.prompt);
        console.log('─'.repeat(50));
        console.log('\n🎨 Text Style:');
        console.log(result.textStyleDescription);
      } else {
        console.log('❌ Test mode not active:', result);
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      console.log('서버가 실행 중인지 확인하세요 (npm run dev)');
      break;
    }

    console.log('\n');
  }
}

main();
