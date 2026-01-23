# 이미지 생성 플로우 변경 계획: AI 2회 생성 방식

## 문제 정의
현재 16:9 듀얼 프레임 이미지 생성 시 **4분할 문제**가 빈번하게 발생.
- Google Gemini가 좌/우 분할 대신 2x2 그리드로 생성하는 경우가 있음
- `splitImage()` 함수가 잘못된 영역을 크롭하여 의도하지 않은 결과 발생

---

## 해결책: AI 2회 생성 방식
1:1 비율 이미지를 2번 별도로 생성하여 4분할 문제를 원천 차단

---

## 현재 vs 새로운 플로우 비교

### 현재 플로우
```
1. generate-dual-frame API 호출
   → Google Gemini가 16:9 이미지 1개 생성
   → 좌측: 배경+텍스트, 우측: 배경만

2. splitImage() 함수 (Canvas)
   → 16:9 이미지를 좌/우로 분할
   → 각각 1:1로 크롭
   → startFrameUrl (우측, 배경만)
   → endFrameUrl (좌측, 배경+텍스트)

3. 영상 생성 API 호출
   → image_url: startFrameUrl (배경만)
   → last_image_url: endFrameUrl (배경+텍스트)
```

### 새로운 플로우
```
1. generate-background API 호출 (새 API)
   → Google Gemini가 1:1 배경 이미지 생성 (텍스트 없음)
   → startFrameUrl 획득

2. generate-text-frame API 호출 (새 API)
   → 첫 번째 이미지를 참조로 전달
   → 동일한 배경에 텍스트 추가된 1:1 이미지 생성
   → endFrameUrl 획득

3. 영상 생성 API 호출 (변경 없음)
   → image_url: startFrameUrl (배경만)
   → last_image_url: endFrameUrl (배경+텍스트)
```

---

## 수정해야 할 파일

### 1. 새 API 생성: `src/app/api/ai/generate-background/route.ts`

**목적:** 1:1 비율 배경 이미지 생성 (텍스트 없음)

**핵심 변경점:**
- `aspectRatio: '16:9'` → `aspectRatio: '1:1'`
- 프롬프트에서 텍스트 관련 내용 제거
- 듀얼 프레임 레이아웃 지시 제거

**프롬프트 구조:**
```
Generate a 1:1 square image for hologram display:

VISUAL STYLE (${style}):
- [스타일별 설정]

OCCASION (${category}):
- Mood: ${categoryConfig.mood}
- Elements: ${categoryConfig.elements}

BACKGROUND:
- Base color: Pure black (#000000)
- Dynamic visual effects, light rays, particles
- NO TEXT anywhere in the image
- Leave center area clear for text overlay later

${referenceInstruction} // 로고 있으면 중앙 상단에 배치

QUALITY:
Ultra HD, professional CGI, cinematic lighting
```

**반환값:**
```typescript
{
  success: true,
  imageUrl: string, // 1:1 배경 이미지 Data URL
}
```

---

### 2. 새 API 생성: `src/app/api/ai/generate-text-frame/route.ts`

**목적:** 배경 이미지에 텍스트를 추가한 1:1 이미지 생성

**입력값:**
```typescript
{
  text: string,           // 표시할 텍스트
  backgroundImage: string, // 첫 번째 이미지 (참조용)
  category: string,
  style: string,
  referenceImage?: string, // 로고 (선택)
}
```

**프롬프트 구조:**
```
Generate a 1:1 square image based on the provided background:

REFERENCE IMAGE:
The attached image is the background. Create the EXACT SAME background
with the following 3D text added in the center.

TEXT TO ADD:
"${text}"

3D TEXT STYLING:
- Style: ${style === 'simple' ? 'Clean modern 3D' : 'Bold ornate 3D, glowing'}
- Position: Centered
- The background must remain IDENTICAL to the reference

CRITICAL:
1. Background must be pixel-perfect match to reference
2. Only add the 3D text, nothing else changed
3. Text should be prominent and readable
```

**반환값:**
```typescript
{
  success: true,
  imageUrl: string, // 1:1 배경+텍스트 이미지 Data URL
}
```

---

### 3. 수정: `src/components/ai-hologram/steps/CompositionImagePreviewStep.tsx`

**삭제할 코드:**
- `splitImage()` 함수 전체 (라인 63-112)

**수정할 코드:**

#### 3-1. 새로운 이미지 생성 함수들

```typescript
// 배경 이미지 생성 (텍스트 없음)
const generateBackgroundImage = async (): Promise<string> => {
  const response = await fetch('/api/ai/generate-background', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      category: data.category,
      style: data.style,
      referenceImage: data.referenceImage,
    }),
  });

  if (!response.ok) {
    throw new Error('배경 이미지 생성 실패');
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || '배경 이미지 생성 실패');
  }

  return result.imageUrl;
};

// 텍스트 프레임 생성 (배경 + 텍스트)
const generateTextFrame = async (text: string, backgroundImage: string): Promise<string> => {
  const response = await fetch('/api/ai/generate-text-frame', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      backgroundImage,
      category: data.category,
      style: data.style,
      referenceImage: data.referenceImage,
    }),
  });

  if (!response.ok) {
    throw new Error('텍스트 프레임 생성 실패');
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || '텍스트 프레임 생성 실패');
  }

  return result.imageUrl;
};
```

#### 3-2. handleGenerateImages 수정

```typescript
const handleGenerateImages = async () => {
  setState('generating');
  setErrorMessage('');
  setGeneratedFrames([]);

  try {
    const frames: GeneratedDualFrame[] = [];

    for (let i = 0; i < messageCount; i++) {
      setCurrentGenerating(i);
      const message = data.messages[i];

      // Step 1: 배경 이미지 생성 (텍스트 없음)
      console.log(`[${i + 1}/${messageCount}] 배경 이미지 생성 중...`);
      const backgroundUrl = await generateBackgroundImage();

      // Step 2: 텍스트 프레임 생성 (배경 + 텍스트)
      console.log(`[${i + 1}/${messageCount}] 텍스트 프레임 생성 중...`);
      const textFrameUrl = await generateTextFrame(message, backgroundUrl);

      frames.push({
        message,
        fullImageUrl: textFrameUrl, // 미리보기용 (텍스트 있는 이미지)
        startFrameUrl: backgroundUrl,    // Start Frame = 배경만
        endFrameUrl: textFrameUrl,       // End Frame = 배경+텍스트
      });

      setGeneratedFrames([...frames]);
    }

    setState('completed');
  } catch (error) {
    console.error('Image generation error:', error);
    setState('error');
    setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
  }
};
```

---

### 4. 기존 API 보존/삭제

| 파일 | 조치 |
|------|------|
| `generate-dual-frame/route.ts` | 삭제 또는 deprecated 처리 |
| `generate-background/route.ts` | 새로 생성 |
| `generate-text-frame/route.ts` | 새로 생성 |
| `generate-video-startend/route.ts` | 변경 없음 |

---

## 영상 생성 흐름 확인

### 현재 영상 생성 API 파라미터 (변경 없음)

```typescript
// generate-video-startend/route.ts
const requestBody = {
  image_url: startUrl,        // Start Frame (배경만) ✓
  last_image_url: endUrl,     // End Frame (배경+텍스트) ✓
  prompt: defaultPrompt,
  duration: 10,
  cfg_scale: 0.6,
  aspect_ratio: '1:1',        // LED 팬 홀로그램용 ✓
};
```

**확인 사항:**
- `image_url` = Start Frame (배경만, 텍스트 없음) → 영상 시작점
- `last_image_url` = End Frame (배경+텍스트) → 영상 끝점
- Kling AI가 두 프레임 사이를 자연스럽게 보간
- 텍스트가 나타나는 애니메이션 효과 자동 생성

---

## 비용 분석

| 항목 | 현재 | 새 방식 | 차이 |
|------|------|---------|------|
| 이미지 API 호출 | 1회/씬 | 2회/씬 | +1회 |
| 이미지 비용 | $0.134/씬 | $0.268/씬 | **+$0.134 (2배)** |
| 영상 비용 | $0.90/씬 | $0.90/씬 | - |
| **총 비용** | $1.03/씬 | $1.17/씬 | **+$0.14 (+13%)** |
| **3씬 기준** | $3.10 | $3.50 | **+$0.40** |

---

## 시간 분석

| 단계 | 현재 | 새 방식 |
|------|------|---------|
| 이미지 생성 | 30-60초 (1회) | 60-120초 (2회, 순차) |
| 영상 생성 | 2-5분 | 2-5분 |
| **총합** | 2.5-6분 | 3-7분 |
| **차이** | - | **+30초~1분** |

### 병렬 처리 최적화 (선택)

두 이미지를 동시에 생성하면 시간 단축 가능:
- 배경 이미지와 텍스트 프레임을 순차가 아닌 병렬로 생성
- 단, 텍스트 프레임이 배경을 참조해야 하므로 순차 생성이 더 안정적

---

## 장점 정리

1. **4분할 문제 완전 해결**: 1:1 이미지를 직접 생성하므로 분할 오류 불가능
2. **배경 일관성**: 첫 이미지를 참조로 사용하여 동일한 배경 보장
3. **코드 단순화**: `splitImage()` 함수 및 Canvas 로직 제거
4. **디버깅 용이**: 각 단계가 독립적이어서 문제 추적 쉬움
5. **품질 향상**: AI가 1:1 비율에 최적화된 이미지 생성

---

## 주의사항

1. **배경 일관성 보장**
   - 두 번째 API에서 첫 번째 이미지를 참조로 전달 필수
   - 프롬프트에서 "동일한 배경 유지" 강조

2. **API 타임아웃**
   - 각 API는 `maxDuration = 300` 유지 (5분)
   - 순차 호출 시 총 최대 10분 소요 가능

3. **에러 처리**
   - 첫 번째 이미지 생성 실패 시 재시도
   - 두 번째 이미지 생성 실패 시 첫 번째 이미지로 fallback 고려

---

## 검증 방법

1. **로컬 테스트**
   - `npm run dev`로 개발 서버 실행
   - AI 홀로그램 프리미엄 플로우 진입
   - 이미지 생성 후 Start/End Frame 확인

2. **콘솔 로그 확인**
   - `[1/3] 배경 이미지 생성 중...` 출력 확인
   - `[1/3] 텍스트 프레임 생성 중...` 출력 확인
   - 생성된 이미지 URL 확인

3. **영상 생성 테스트**
   - 최종 영상에서 텍스트가 자연스럽게 나타나는지 확인
   - Start Frame → End Frame 전환이 부드러운지 확인

4. **비용 모니터링**
   - Google AI Studio 대시보드에서 API 호출 횟수 확인
   - 예상 비용과 실제 비용 비교

---

## 파일 변경 요약

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/app/api/ai/generate-background/route.ts` | **새로 생성** | 1:1 배경 이미지 API |
| `src/app/api/ai/generate-text-frame/route.ts` | **새로 생성** | 배경+텍스트 이미지 API |
| `src/components/ai-hologram/steps/CompositionImagePreviewStep.tsx` | **수정** | 2회 호출 로직, splitImage 제거 |
| `src/app/api/ai/generate-dual-frame/route.ts` | **삭제 예정** | 더 이상 사용 안함 |
