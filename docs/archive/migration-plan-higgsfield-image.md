# Higgsfield Text-to-Image API 마이그레이션 계획

**작성일**: 2026-01-12
**목적**: 이미지 생성 API를 Gemini에서 Higgsfield로 통합
**상태**: ✅ Higgsfield Text-to-Image API 확인 완료

---

## 확인된 Higgsfield Text-to-Image 스펙

### 모델 정보
- **모델 ID**: `bytedance/seedream/v4/text-to-image`
- **Soul by Higgsfield**: 고품질 사실적 이미지 생성 (2025년 6월 출시)
- **특징**:
  - 프롬프트 자동 개선 (prompt enhancement)
  - 사전 설정된 프리셋
  - 복잡한 프롬프트 엔지니어링 불필요

### API 파라미터
```typescript
{
  prompt: string;           // 텍스트 프롬프트
  resolution: string;       // "1024x1024" 등
  aspect_ratio: string;     // "1:1", "16:9" 등
  camera_settings?: object; // 선택적 카메라 설정
}
```

### 참고 자료
- [Higgsfield AI 공식 사이트](https://higgsfield.ai/)
- [Python SDK](https://github.com/higgsfield-ai/higgsfield-client)
- [Soul 이미지 모델 리뷰](https://blog.segmind.com/higgsfield-soul-enhances-ai-image-realism/)

---

## 마이그레이션 이유

### 1. 통합 관리 (Primary)
- 영상 생성이 이미 Higgsfield 사용 중
- 단일 플랫폼으로 관리 간소화
- 크레딧 통합 관리

### 2. 비용 투명성
- Google Gemini: 무료 티어 50 requests/day 후 유료 (요금 불명확)
- Higgsfield: 크레딧 기반 명확한 요금제

### 3. 할당량 문제 해결
- Gemini 무료 티어는 프로덕션에 부족
- Higgsfield는 크레딧 충전으로 유연한 확장

---

## 수정할 파일

### 1개 파일만 수정하면 됨!
- ✅ `src/app/api/ai/generate-image/route.ts`

**프론트엔드 수정 불필요** (API 인터페이스 동일하게 유지)

---

## 상세 수정 계획

### Step 1: 환경 변수 확인

**파일**: `.env.local`

**현재**:
```env
GOOGLE_GENAI_API_KEY=your_gemini_key
HIGGSFIELD_API_KEY=your_higgsfield_key
HIGGSFIELD_API_SECRET=your_higgsfield_secret
```

**변경 후**: 동일 (이미 Higgsfield 키 있음)

---

### Step 2: API Route 전체 교체

**파일**: `src/app/api/ai/generate-image/route.ts`

#### Before (Gemini - 202 lines)
```typescript
import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({ apiKey });
const response = await client.models.generateContent({
  model: "gemini-3-pro-image-preview",
  contents: [{ parts }]
});
```

#### After (Higgsfield - 예상 ~250 lines)
```typescript
// 1. Higgsfield API 호출
const HIGGSFIELD_API_BASE = 'https://platform.higgsfield.ai';
const MODEL_ID = 'bytedance/seedream/v4/text-to-image';

// 2. 참조 이미지 처리 (Firebase 업로드)
if (referenceImage?.startsWith('data:')) {
  const uploadResponse = await fetch('/api/upload-image', { ... });
  referenceImageUrl = uploadResult.url;
}

// 3. 비동기 생성 (폴링)
const generateResponse = await fetch(`${HIGGSFIELD_API_BASE}/${MODEL_ID}`, {
  method: 'POST',
  headers: {
    'Authorization': `Key ${apiKey}:${apiSecret}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: buildPrompt(style, category),
    reference_image_url: referenceImageUrl,
    resolution: "1024x1024",
    aspect_ratio: aspectRatio // "1:1" or "16:9"
  })
});

// 4. 폴링으로 완료 대기
// ... (generate-video-higgsfield와 유사)
```

---

## 핵심 변경사항

### 1. 동기 → 비동기 처리

**현재 (Gemini)**: 즉시 응답
```typescript
const response = await client.models.generateContent({ ... });
// 즉시 이미지 반환
```

**변경 후 (Higgsfield)**: 폴링 필요
```typescript
// 1. 요청 제출 → queued
const queuedResult = await fetch(...);

// 2. 폴링 (2-3초 간격)
while (status !== 'completed') {
  await sleep(2000);
  const statusResult = await fetch(queuedResult.status_url);
}

// 3. 이미지 다운로드
const imageUrl = completedResult.image.url;
```

### 2. 참조 이미지 처리

**현재 (Gemini)**: Base64 직접 전송
```typescript
parts.push({
  inlineData: {
    mimeType: 'image/png',
    data: base64Data
  }
});
```

**변경 후 (Higgsfield)**: Firebase 업로드 후 URL
```typescript
// 참조 이미지가 Data URL이면 Firebase 업로드
if (referenceImage?.startsWith('data:')) {
  const uploadResponse = await fetch('/api/upload-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dataUrl: referenceImage,
      filename: `higgsfield-ref-${Date.now()}.png`,
    }),
  });

  const uploadResult = await uploadResponse.json();
  referenceImageUrl = uploadResult.url;
}

// API 호출 시 URL 전달
body: JSON.stringify({
  reference_image_url: referenceImageUrl,
  // ...
})
```

### 3. 프롬프트 구조 변경

**현재 (Gemini)**: 매우 상세한 영어 프롬프트
```typescript
const systemPrompt = `
  Task: Generate a high-quality 3D Hologram Wreath BACKGROUND image...
  ${selectedStyle}
  ${selectedTheme}
  CRITICAL REQUIREMENTS:
  1. ABSOLUTELY NO TEXT - Do not generate any text...
  2. BACKGROUND: Pure Black (#000000)...
  ...
`;
```

**변경 후 (Higgsfield)**: 간결하게 조정 (Soul 모델이 자동 개선)
```typescript
// Higgsfield Soul 모델은 프롬프트를 자동으로 개선함
const prompt = buildSimplifiedPrompt(style, category, referenceImageUrl);

// 예: "Cyberpunk neon holographic explosion with particles, black background, 1:1 square, ultra high quality"
```

### 4. maxDuration 설정

**추가 필요**:
```typescript
// 파일 상단에 추가
export const maxDuration = 60; // 이미지 생성은 60초면 충분
```

### 5. 응답 형식

**현재 (Gemini)**: Base64 직접 반환
```typescript
const imageBase64 = responseTyped.generatedImages[0].image.imageBytes;
const dataUrl = `data:image/png;base64,${imageBase64}`;

return NextResponse.json({
  success: true,
  imageUrl: dataUrl
});
```

**변경 후 (Higgsfield)**: URL → 다운로드 → Base64
```typescript
// 1. 완료된 이미지 URL 받기
const imageUrl = completedResult.image.url;

// 2. 이미지 다운로드
const imageResponse = await fetch(imageUrl);
const imageBuffer = await imageResponse.arrayBuffer();

// 3. Base64 변환
const imageBase64 = Buffer.from(imageBuffer).toString('base64');
const dataUrl = `data:image/png;base64,${imageBase64}`;

return NextResponse.json({
  success: true,
  imageUrl: dataUrl,
  externalUrl: imageUrl // 외부 URL도 함께 (디버깅용)
});
```

---

## 전체 코드 구조 (Pseudo Code)

```typescript
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

const HIGGSFIELD_API_BASE = 'https://platform.higgsfield.ai';
const MODEL_ID = 'bytedance/seedream/v4/text-to-image';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, category, style, referenceImage, aspectRatio } = body;

    // 1. API 키 확인
    const apiKey = process.env.HIGGSFIELD_API_KEY;
    const apiSecret = process.env.HIGGSFIELD_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { success: false, error: 'Higgsfield API credentials not configured' },
        { status: 500 }
      );
    }

    // 2. 참조 이미지 처리 (필요 시 Firebase 업로드)
    let referenceImageUrl = null;
    if (referenceImage && referenceImage.startsWith('data:')) {
      console.log('Uploading reference image to Firebase...');

      const uploadResponse = await fetch(new URL('/api/upload-image', req.url).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataUrl: referenceImage,
          filename: `higgsfield-ref-${Date.now()}.png`,
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error('참조 이미지 업로드 실패');
      }

      const uploadResult = await uploadResponse.json();
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || '참조 이미지 업로드 실패');
      }

      referenceImageUrl = uploadResult.url;
      console.log('Reference image uploaded:', referenceImageUrl);
    }

    // 3. 프롬프트 생성 (스타일/카테고리 기반)
    const enhancedPrompt = buildPrompt(style, category, prompt);

    console.log('Starting Higgsfield image generation:', {
      prompt: enhancedPrompt,
      aspectRatio,
      hasReferenceImage: !!referenceImageUrl
    });

    // 4. 이미지 생성 요청 제출
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30초 타임아웃

    let queuedResult;
    try {
      const generateResponse = await fetch(`${HIGGSFIELD_API_BASE}/${MODEL_ID}`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${apiKey}:${apiSecret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          reference_image_url: referenceImageUrl,
          resolution: aspectRatio === '1:1' ? '1024x1024' : '1920x1080',
          aspect_ratio: aspectRatio || '1:1',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!generateResponse.ok) {
        const errorText = await generateResponse.text();
        console.error('Higgsfield API error:', errorText);
        throw new Error(`Higgsfield API 요청 실패 (${generateResponse.status})`);
      }

      queuedResult = await generateResponse.json();
      console.log('Request queued:', queuedResult.request_id);

    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        throw new Error('이미지 생성 요청 타임아웃');
      }
      throw fetchError;
    }

    // 5. 폴링으로 완료 대기
    const startTime = Date.now();
    const MAX_WAIT_TIME = 50000; // 50초
    const POLL_INTERVAL = 2000; // 2초마다 확인

    let statusResult;

    while (true) {
      if (Date.now() - startTime > MAX_WAIT_TIME) {
        throw new Error('이미지 생성 시간 초과');
      }

      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));

      const statusResponse = await fetch(queuedResult.status_url, {
        headers: {
          'Authorization': `Key ${apiKey}:${apiSecret}`,
        },
      });

      if (!statusResponse.ok) {
        console.error('Status check failed:', statusResponse.status);
        continue;
      }

      statusResult = await statusResponse.json();
      console.log('Status check:', statusResult.status);

      if (statusResult.status === 'completed') {
        break;
      } else if (statusResult.status === 'failed') {
        throw new Error('이미지 생성 실패');
      } else if (statusResult.status === 'nsfw') {
        throw new Error('콘텐츠 정책 위반으로 이미지 생성이 차단되었습니다.');
      }
    }

    // 6. 완료된 이미지 다운로드
    const completedResult = statusResult;
    if (!completedResult.image?.url) {
      throw new Error('이미지 URL이 응답에 없습니다.');
    }

    console.log('Image generation completed:', completedResult.image.url);

    // 7. 이미지를 다운로드하여 Base64로 변환 (기존 코드와 호환성 유지)
    const imageResponse = await fetch(completedResult.image.url);
    if (!imageResponse.ok) {
      throw new Error('이미지 다운로드 실패');
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');
    const dataUrl = `data:image/png;base64,${imageBase64}`;

    console.log(`Image downloaded. Size: ${imageBuffer.byteLength} bytes`);

    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
      externalUrl: completedResult.image.url, // 외부 URL도 함께 반환
    });

  } catch (error) {
    console.error('Higgsfield Generate Image Error:', error);

    let message = 'Internal Server Error';
    if (error instanceof Error) {
      message = error.message;

      // 특정 에러 메시지 처리
      if (message.includes('quota') || message.includes('Quota')) {
        message = 'API 할당량 초과. 잠시 후 다시 시도해주세요.';
      } else if (message.includes('API_KEY_INVALID')) {
        message = 'API 키가 올바르지 않습니다. 관리자에게 문의하세요.';
      }
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// 헬퍼 함수: 프롬프트 생성
function buildPrompt(style: string, category: string, basePrompt?: string): string {
  // 스타일별 키워드 (간결하게 - Soul 모델이 자동 개선함)
  const styleKeywords: Record<string, string> = {
    neon: 'cyberpunk neon glowing particles explosion',
    elegant: 'elegant floral holographic sparkles',
    luxury: 'luxury gold diamond sparkle burst',
    traditional: 'traditional Korean palace fireworks',
    minimal: 'minimal geometric light rays',
    fantasy: 'mystical magical energy burst',
    nature: 'bioluminescent nature energy',
    ice: 'crystal ice frozen particles',
    fire: 'blazing fire plasma explosion',
    artdeco: 'art deco gold geometric burst',
    space: 'galaxy supernova cosmic energy',
    sketch: 'wireframe light sketch explosion',
  };

  const categoryKeywords: Record<string, string> = {
    wedding: 'romantic hearts roses soft petals',
    opening: 'celebration success prosperity ribbons',
    event: 'festive elegant decorative stars',
  };

  const styleText = styleKeywords[style] || styleKeywords['neon'];
  const categoryText = categoryKeywords[category] || categoryKeywords['wedding'];

  // Soul 모델은 간결한 프롬프트를 자동으로 개선하므로 간단하게
  return `${styleText}, ${categoryText}, spectacular radial burst from center, particles spreading outward, black background, ultra high quality hologram effect, no text, square composition`;
}
```

---

## 의존성 변경

### package.json

**제거**:
```json
"@google/genai": "^1.30.0"
```

**추가**: 없음 (Fetch API 사용)

**설치 명령**:
```bash
npm uninstall @google/genai
```

---

## 테스트 계획

### 1. 로컬 테스트
1. `.env.local`에 Higgsfield API 키 확인
2. 개발 서버 실행: `npm run dev`
3. **AI 영상 합성** 모드로 이미지 생성 테스트
4. 참조 이미지 있는 경우/없는 경우 모두 테스트

### 2. 검증 항목
- [ ] 이미지 생성 성공 (콘솔 로그 확인)
- [ ] 생성 시간: 10-30초 내 완료
- [ ] 이미지 품질: Gemini와 비교
- [ ] 참조 이미지 처리: Firebase 업로드 및 배경 제거
- [ ] 에러 처리: 타임아웃, NSFW, API 오류

### 3. 성능 비교

| 항목 | Gemini | Higgsfield |
|-----|--------|-----------|
| 생성 시간 | ~5-10초 | ~10-30초 |
| 할당량 | 50/day 무료 | 크레딧 기반 |
| 품질 | 높음 | 확인 필요 |
| 프롬프트 | 복잡 | 간결 (자동 개선) |

---

## Rollback 계획

문제 발생 시 Gemini로 즉시 복구:

### 1. package.json 복구
```bash
npm install @google/genai@^1.30.0
```

### 2. route.ts 복구
Git에서 이전 버전 복구:
```bash
git checkout HEAD~1 src/app/api/ai/generate-image/route.ts
```

또는 백업 파일 사용:
```bash
cp docs/backup/generate-image-gemini-backup.ts src/app/api/ai/generate-image/route.ts
```

---

## 예상 효과

### Before (Gemini)
- ✅ 빠른 생성 (~5초)
- ✅ 매우 상세한 프롬프트 제어
- ❌ 할당량 제한 (50/day 무료)
- ❌ 분산된 관리 (Google 별도)
- ❌ 비용 불투명

### After (Higgsfield)
- ⚠️ 약간 느릴 수 있음 (~10-30초, 폴링)
- ✅ 자동 프롬프트 개선 (Soul 모델)
- ✅ 크레딧 기반 유연한 확장
- ✅ 통합 관리 (영상 + 이미지)
- ✅ 명확한 비용 구조

---

## 다음 단계

1. **백업 생성** (안전장치)
   ```bash
   cp src/app/api/ai/generate-image/route.ts docs/backup/generate-image-gemini-backup.ts
   ```

2. **새 코드 작성** (위의 Pseudo Code 기반)

3. **로컬 테스트** (개발 환경)

4. **A/B 테스트** (품질 비교)

5. **점진적 배포** (Vercel Preview 환경)

6. **프로덕션 배포** (문제 없으면)

---

**준비 완료되면 시작하겠습니다!** 🚀
