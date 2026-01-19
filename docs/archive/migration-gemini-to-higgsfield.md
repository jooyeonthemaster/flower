# 이미지 생성 API 마이그레이션: Gemini → Higgsfield (가정)

**작성일**: 2026-01-12
**목적**: 이미지 생성 API를 Gemini에서 Higgsfield로 변경하기 위한 수정 가이드
**상태**: ⚠️ **Higgsfield Text-to-Image API 스펙 확인 필요**

---

## 전제 조건 확인 필요

### 1. Higgsfield에 Text-to-Image API가 있는지 확인
- 현재 확인된 것: `higgsfield-ai/dop/lite` (Image-to-Video 모델)
- 필요한 것: Text-to-Image 또는 Prompt-to-Image 모델

### 2. API 스펙 확인 필요 사항
- 모델 ID (예: `higgsfield-ai/text-to-image/v1`)
- 입력 파라미터 형식
- 출력 형식 (URL or Base64)
- 비동기 vs 동기 처리
- 참조 이미지 지원 여부

---

## 현재 코드 구조

### 이미지 생성 API 호출 위치

1. **MultiSceneStep.tsx** (Line 152-165)
   ```typescript
   const response = await fetch('/api/ai/generate-image', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       prompt,
       category,
       style,
       referenceImage: previewUrl,
       aspectRatio: '1:1'
     })
   });
   ```

2. **TextPreviewStep.tsx** (Line 92-103)
   ```typescript
   const response = await fetch('/api/ai/generate-image', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       prompt,
       category: sceneData.category,
       style: sceneData.style,
       referenceImage: sceneData.referenceImage,
       aspectRatio: '1:1'
     })
   });
   ```

**핵심**: `/api/ai/generate-image` 엔드포인트만 수정하면 프론트엔드는 수정 불필요

---

## 수정 계획 (Higgsfield API 스펙에 따라 달라짐)

### Option A: Higgsfield가 동기적 Text-to-Image를 제공하는 경우

**난이도**: ⭐⭐ (쉬움)

#### 수정할 파일
- `src/app/api/ai/generate-image/route.ts` (전체 교체)

#### 주요 변경사항
1. Google GenAI SDK 제거 → Higgsfield Fetch API
2. 프롬프트 구조 변경 (Higgsfield 스펙에 맞춤)
3. 참조 이미지 처리 (Data URL → Firebase 업로드)
4. 응답 파싱 변경

#### 예상 코드 구조
```typescript
export async function POST(req: NextRequest) {
  const { prompt, category, style, referenceImage } = await req.json();

  // 1. Higgsfield API 키 확인
  const apiKey = process.env.HIGGSFIELD_API_KEY;
  const apiSecret = process.env.HIGGSFIELD_API_SECRET;

  // 2. 참조 이미지 처리 (필요 시 Firebase 업로드)
  let referenceImageUrl = null;
  if (referenceImage && referenceImage.startsWith('data:')) {
    // Firebase Storage 업로드 (generate-video-higgsfield와 동일)
    const uploadResponse = await fetch('/api/upload-image', { ... });
    referenceImageUrl = uploadResult.url;
  }

  // 3. Higgsfield API 호출
  const response = await fetch(`https://platform.higgsfield.ai/text-to-image-model`, {
    method: 'POST',
    headers: {
      'Authorization': `Key ${apiKey}:${apiSecret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: buildPrompt(style, category),
      reference_image: referenceImageUrl,
      aspect_ratio: '1:1',
      // ... 기타 파라미터
    })
  });

  // 4. 응답 처리
  const result = await response.json();
  const imageUrl = result.image_url; // or result.image_data

  // 5. Base64 변환 (필요 시)
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.arrayBuffer();
  const imageBase64 = Buffer.from(imageBuffer).toString('base64');
  const dataUrl = `data:image/png;base64,${imageBase64}`;

  return NextResponse.json({
    success: true,
    imageUrl: dataUrl
  });
}
```

---

### Option B: Higgsfield가 비동기적 Text-to-Image를 제공하는 경우 (영상 생성과 동일)

**난이도**: ⭐⭐⭐ (중간)

#### 수정할 파일
- `src/app/api/ai/generate-image/route.ts` (전체 교체)

#### 주요 변경사항
1. 비동기 폴링 로직 추가 (`generate-video-higgsfield/route.ts`와 유사)
2. maxDuration 설정 (60초 정도?)
3. 폴링 간격 조정 (이미지는 영상보다 빠르므로 2-3초)

#### 예상 코드 구조
```typescript
export const maxDuration = 60; // 이미지 생성은 60초면 충분

export async function POST(req: NextRequest) {
  // 1. 생성 요청 제출
  const generateResponse = await fetch(`${HIGGSFIELD_API_BASE}/text-to-image-model`, {
    method: 'POST',
    // ...
  });

  const queuedResult = await generateResponse.json(); // { status: 'queued', request_id, status_url }

  // 2. 폴링으로 완료 대기 (영상보다 짧게)
  const MAX_WAIT_TIME = 50000; // 50초
  const POLL_INTERVAL = 2000; // 2초마다 확인

  while (true) {
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));

    const statusResponse = await fetch(queuedResult.status_url, { ... });
    const statusResult = await statusResponse.json();

    if (statusResult.status === 'completed') {
      break;
    } else if (statusResult.status === 'failed') {
      throw new Error('이미지 생성 실패');
    }
  }

  // 3. 완료된 이미지 다운로드 및 Base64 변환
  // ...
}
```

---

### Option C: Higgsfield에 Text-to-Image가 없는 경우

**대안 API 고려**:

1. **Stability AI (SDXL, SD3)** - 추천
   - 비용: 저렴 ($0.02/image)
   - 품질: 높음
   - 속도: 빠름 (2-5초)
   - 한글 지원: 제한적 (영어 프롬프트 필요)

2. **Replicate (Flux, SDXL)**
   - 비용: 중간 ($0.01-0.04/image)
   - 품질: 매우 높음
   - 속도: 중간 (5-15초)
   - 한글 지원: 제한적

3. **OpenAI DALL-E 3**
   - 비용: 비쌈 ($0.04-0.08/image)
   - 품질: 매우 높음
   - 속도: 빠름 (5-10초)
   - 한글 지원: 좋음

---

## 상세 수정 체크리스트 (Higgsfield 기준)

### 1. 환경 변수 설정
- [ ] `.env.local`에 `HIGGSFIELD_API_KEY` 추가 (기존 것 재사용 가능)
- [ ] `.env.local`에 `HIGGSFIELD_API_SECRET` 추가 (기존 것 재사용 가능)

### 2. API 엔드포인트 수정
- [ ] `src/app/api/ai/generate-image/route.ts` 전체 교체
- [ ] Google GenAI SDK import 제거
- [ ] Higgsfield API 호출 로직 추가
- [ ] 프롬프트 변환 로직 수정

### 3. 프롬프트 구조 변경
**현재 (Gemini)**: 매우 상세한 영어 프롬프트 (Line 76-106)
```typescript
const systemPrompt = `
  Task: Generate a high-quality 3D Hologram Wreath BACKGROUND image...
  ${selectedStyle}
  ${selectedTheme}
  CRITICAL REQUIREMENTS: ...
`;
```

**변경 후 (Higgsfield)**: API 스펙에 맞춰 조정
- 프롬프트 길이 제한 확인
- 지원 언어 확인 (한글 vs 영어)
- 네거티브 프롬프트 지원 여부

### 4. 참조 이미지 처리
**현재 (Gemini)**: Base64 inlineData 직접 전송
```typescript
parts.push({
  inlineData: {
    mimeType: mimeType,
    data: base64Data
  }
});
```

**변경 후 (Higgsfield)**: Firebase Storage 업로드 후 URL 전달
```typescript
if (referenceImage.startsWith('data:')) {
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
```

### 5. 응답 파싱 변경
**현재 (Gemini)**: 복잡한 응답 구조
```typescript
if (responseTyped.generatedImages?.[0]?.image?.imageBytes) {
  imageBase64 = responseTyped.generatedImages[0].image.imageBytes;
} else if (responseTyped.candidates?.[0]?.content?.parts) {
  // ...
}
```

**변경 후 (Higgsfield)**: Higgsfield 스펙에 맞춤
```typescript
// 동기적인 경우
const result = await response.json();
const imageUrl = result.image?.url || result.url;

// 비동기적인 경우
const completedResult = statusResult as CompletedResponse;
const imageUrl = completedResult.image?.url;
```

### 6. 에러 처리
- [ ] Higgsfield 특유의 에러 코드 처리
  - NSFW 차단
  - 크레딧 부족
  - API 할당량 초과
- [ ] 폴링 타임아웃 처리 (비동기인 경우)

### 7. 스타일 프롬프트 최적화
**현재**: 12가지 스타일 (neon, elegant, minimal, fantasy, luxury, traditional, nature, ice, fire, artdeco, space, sketch)

**고려사항**:
- Higgsfield가 Gemini와 다른 스타일 해석을 할 수 있음
- 프롬프트 최적화 필요 (A/B 테스트)
- 한글 프롬프트가 안 되면 영어 번역 필요

---

## 예상 효과

### Before (Gemini API)
- ✅ 동기적 생성 (빠름)
- ✅ 참조 이미지 간편한 처리 (Base64)
- ✅ 매우 상세한 프롬프트 지원
- ❓ 비용: 알 수 없음 (Google 요금제에 따라)

### After (Higgsfield API - 가정)
- ❓ 동기 vs 비동기 (스펙에 따라)
- ❓ 참조 이미지 처리 복잡해짐 (Firebase 업로드 필요)
- ❓ 프롬프트 제약 가능
- ✅ 비용 절감 가능? (Higgsfield 요금제 확인 필요)
- ✅ 영상 생성과 동일 플랫폼 (관리 편의성)

---

## 필요한 정보

변경 전에 다음 정보를 확인해주세요:

1. **Higgsfield Text-to-Image API**
   - 모델 ID: `?`
   - API 엔드포인트: `?`
   - 문서 URL: `?`

2. **API 스펙**
   - 입력 파라미터 형식
   - 최대 프롬프트 길이
   - 한글 지원 여부
   - 참조 이미지 지원 방식
   - 동기 vs 비동기

3. **비용 비교**
   - Gemini 현재 비용: `?`
   - Higgsfield 예상 비용: `?`

4. **품질 비교**
   - 테스트 이미지 생성해서 비교 필요
   - 특히 한글 텍스트 처리 (우리는 텍스트 없는 배경만 생성하지만)

---

## 대안: 혼합 전략 (Fallback)

만약 Higgsfield가 맞지 않으면:

```typescript
// 우선순위: Higgsfield → Gemini (fallback)
export async function POST(req: NextRequest) {
  try {
    // Higgsfield 시도
    return await generateWithHiggsfield(req);
  } catch (error) {
    console.warn('Higgsfield failed, falling back to Gemini:', error);
    // Gemini로 fallback
    return await generateWithGemini(req);
  }
}
```

**장점**:
- 안정성 보장
- 비용 최적화 (Higgsfield 우선, 실패 시 Gemini)
- 점진적 마이그레이션 가능

---

## 결론

Higgsfield로 변경하기 전에:

1. ✅ **Higgsfield Text-to-Image API 존재 여부 확인**
2. ✅ API 스펙 문서 확인
3. ✅ 테스트 이미지 생성 및 품질 비교
4. ✅ 비용 계산
5. ✅ 위의 체크리스트에 따라 수정

**추천**: Higgsfield에 Text-to-Image가 없다면 **Stability AI (SDXL)** 추천
- 비용 효율적
- 품질 우수
- 빠른 생성 속도
- 커뮤니티 및 문서 풍부
