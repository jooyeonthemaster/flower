# 새로운 접근법: Start/End Frame 기반 영상 생성

## 개요

기존의 복잡한 파이프라인(Three.js 텍스트 → AI 배경 → 텍스트 영상 → 오버레이)을 버리고,
**AI가 직접 3D 텍스트를 생성**하는 더 단순하고 효과적인 방식으로 전환.

---

## 기존 방식의 문제점

```
[기존 플로우 - 복잡하고 품질 한계]

Phase 1: Three.js로 3D 텍스트 이미지 캡처 (Pseudo-3D, 품질 한계)
Phase 2: AI 배경 이미지 생성 (참조 이미지 포함)
Phase 3: 텍스트 이미지 → Higgsfield → 텍스트 영상
Phase 4: Remotion으로 배경 + 텍스트 영상 오버레이
Phase 5: 영상 합성

문제:
- Three.js 텍스트가 단조롭고 AI 생성 배경과 스타일 불일치
- 4-5단계 파이프라인으로 복잡하고 오류 발생 가능성 높음
- 텍스트와 배경이 "붙어있는" 느낌
```

---

## 새로운 접근법: Start/End Frame

### 핵심 아이디어

AI가 **두 개의 이미지**를 생성:
1. **Start Frame**: 배경만 (텍스트 없음)
2. **End Frame**: 배경 + 3D 텍스트

이 두 프레임을 기반으로 영상을 생성하면, **텍스트가 자연스럽게 나타나는 애니메이션**이 생성됨.

### 장점

| 항목 | 기존 방식 | 새로운 방식 |
|------|----------|------------|
| 텍스트 품질 | Three.js Pseudo-3D (단조로움) | AI 생성 3D 타이포그래피 (고품질) |
| 스타일 일관성 | 텍스트/배경 별도 생성 (불일치 가능) | 동일 AI가 함께 생성 (완벽 일치) |
| 파이프라인 | 4-5단계 | 2-3단계 |
| 애니메이션 | 오버레이 (정적) | Frame Interpolation (자연스러움) |

---

## 이미지 생성 방식 옵션

### Option A: 단일 이미지 분할 방식 (사용자 테스트 완료)

```
[프롬프트 예시]
"엄청 화려한 디지털 펑크 배경으로 '개업축하합니다' 메시지를 3d 입체 타이포그래피로
표현해줘 절반에는 똑같은 배경에 텍스트는 없는 이미지로 생성해줘.
좌우로 텍스트 있는 이미지와 없는 이미지가 배치되도록 생성해"

[생성 결과]
┌─────────────────┬─────────────────┐
│                 │                 │
│  텍스트 + 배경   │    배경만       │
│   (End Frame)   │  (Start Frame)  │
│                 │                 │
└─────────────────┴─────────────────┘

[후처리]
1. 이미지를 좌우로 분할
2. 왼쪽 → End Frame
3. 오른쪽 → Start Frame
```

**장점:**
- 단일 API 호출로 두 이미지 생성
- 배경 일관성 보장 (같은 생성에서 나옴)

**단점:**
- 해상도가 절반으로 줄어듦 (1024→512 per frame)
- 프롬프트가 복잡해짐

### Option B: 두 번의 이미지 생성 (대안)

```
[1단계: 배경 + 텍스트 이미지 생성]
프롬프트: "화려한 디지털 펑크 배경에 '개업축하합니다' 3D 타이포그래피"
→ End Frame

[2단계: 배경만 이미지 생성]
프롬프트: "1단계와 동일한 배경, 텍스트 제외" + seed 고정
→ Start Frame
```

**장점:**
- 각 프레임 풀 해상도
- 더 정교한 컨트롤

**단점:**
- 두 번의 API 호출 (비용 2배)
- 배경 일관성 보장 어려움 (seed 고정해도 미세 차이 가능)

### 권장: Option A (단일 이미지 분할)

사용자가 이미 테스트하여 품질 검증 완료.

---

## 새로운 플로우

```
┌────────────────────────────────────────────────────────────┐
│                    새로운 AI 영상 합성 플로우                │
└────────────────────────────────────────────────────────────┘

Phase 1: AI 이미지 생성 (좌우 분할)
  ├─ 입력: 행사, 스타일, 참조이미지, 텍스트
  ├─ 프롬프트: "좌측에 텍스트+배경, 우측에 배경만"
  └─ 출력: 2048x1024 이미지 (또는 1024x512 x2)

Phase 2: 이미지 분할
  ├─ 좌측 절반 → End Frame (텍스트 있음)
  └─ 우측 절반 → Start Frame (텍스트 없음)

Phase 3: Start/End Frame 영상 생성
  ├─ 입력: Start Frame, End Frame
  ├─ API: Higgsfield 또는 유사 서비스
  └─ 출력: 텍스트가 나타나는 5초 영상

Phase 4: 영상 합성 (멀티 장면)
  └─ 여러 장면 이어붙이기 (기존 merge-videos API)
```

---

## 기술적 검토 필요 사항

### 1. Higgsfield Start/End Frame 지원 확인 ✅

**지원 확인됨!** (2025년 5월 출시, Pro/Ultimate 플랜)

현재 API:
```typescript
body: JSON.stringify({
  image_url: imageUrl,    // 단일 이미지
  prompt: prompt,
  duration: duration,
})
```

**새로운 API (Start/End Frame):**
```typescript
body: JSON.stringify({
  input_images: [startFrameUrl],      // 시작 프레임 (배경만)
  input_images_end: [endFrameUrl],    // 종료 프레임 (배경 + 텍스트)
  prompt: prompt,
  seed: 12345,                        // 재현성을 위한 시드
  motions_strength: 0.5,              // 모션 강도 (0-1)
  enhance_prompt: true,               // 프롬프트 자동 최적화
})
```

**API 파라미터 상세:**
| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `input_images` | string[] | 시작 프레임 URL 배열 (1개) |
| `input_images_end` | string[] | 종료 프레임 URL 배열 (1개) |
| `prompt` | string | 영상 생성 프롬프트 |
| `seed` | number (1-1,000,000) | 재현 가능한 결과를 위한 시드 |
| `motions_strength` | number (0-1) | 모션 효과 강도 |
| `enhance_prompt` | boolean | 프롬프트 자동 최적화 |

**참고:** [Higgsfield Blog - Start & End Frames](https://higgsfield.ai/blog/Storytelling-with-Start-End-Frames-by-Higgsfield)

### 2. 이미지 분할 처리

```typescript
// 클라이언트 또는 서버에서 Canvas로 분할
const splitImage = (fullImageUrl: string): Promise<{startFrame: string, endFrame: string}> => {
  const img = await loadImage(fullImageUrl);
  const width = img.width / 2;
  const height = img.height;

  // 좌측 (End Frame - 텍스트 있음)
  const endCanvas = createCanvas(width, height);
  endCanvas.getContext('2d').drawImage(img, 0, 0, width, height, 0, 0, width, height);

  // 우측 (Start Frame - 텍스트 없음)
  const startCanvas = createCanvas(width, height);
  startCanvas.getContext('2d').drawImage(img, width, 0, width, height, 0, 0, width, height);

  return {
    startFrame: startCanvas.toDataURL(),
    endFrame: endCanvas.toDataURL(),
  };
};
```

### 3. 프롬프트 템플릿 설계

```typescript
const generateDualFramePrompt = (params: {
  category: string;
  style: string;
  text: string;
  referenceImageDescription?: string;
}) => {
  return `
Create a side-by-side image composition:

LEFT HALF (with text):
- Spectacular ${params.style} holographic background
- "${params.text}" displayed as stunning 3D typography
- Text should be large, centered, and highly visible
- ${params.category} celebration theme
${params.referenceImageDescription ? `- Incorporate: ${params.referenceImageDescription}` : ''}

RIGHT HALF (without text):
- EXACT SAME background as left half
- NO text, NO typography, NO letters
- Perfectly matching colors, effects, and composition
- Clean background only

CRITICAL:
- Both halves MUST have identical backgrounds
- Only difference: left has text, right has no text
- Professional quality, 3D depth effects
`;
};
```

---

## 구현 계획

### Step 1: API 검증 ✅
- [x] Higgsfield start/end frame API 지원 확인
- [x] `input_images` + `input_images_end` 파라미터 확인

### Step 2: 이미지 생성 수정
**파일:** `src/app/api/ai/generate-image/route.ts`

- [ ] 새로운 모드 추가: `dualFrame: true`
- [ ] 듀얼 프레임 프롬프트 템플릿 구현
  ```typescript
  // 예시 프롬프트
  "Create side-by-side: LEFT with '축하합니다' 3D text, RIGHT same background without text"
  ```
- [ ] 이미지 분할 로직 구현 (Canvas API 사용)
  ```typescript
  const splitDualFrameImage = (imageUrl: string) => {
    // 좌측 → endFrame (텍스트 있음)
    // 우측 → startFrame (텍스트 없음)
  };
  ```

### Step 3: 영상 생성 API 신규
**새 파일:** `src/app/api/ai/generate-video-startend/route.ts`

- [ ] Start/End Frame 기반 영상 생성 API 구현
  ```typescript
  // API 호출
  fetch(`${HIGGSFIELD_API_BASE}/${MODEL_ID}`, {
    method: 'POST',
    body: JSON.stringify({
      input_images: [startFrameUrl],
      input_images_end: [endFrameUrl],
      prompt: "Smooth text reveal animation, 3D typography appearing...",
      motions_strength: 0.6,
    }),
  });
  ```
- [ ] 기존 `generate-video-higgsfield` 호환성 유지

### Step 4: 프론트엔드 수정
**파일:** `src/components/ai-hologram/steps/CompositionGenerationStep.tsx`

- [ ] 새로운 플로우로 전환:
  ```
  Phase 1: 듀얼 프레임 이미지 생성
  Phase 2: 이미지 분할 (start/end)
  Phase 3: Start/End Frame 영상 생성
  Phase 4: 영상 합성 (멀티 장면)
  ```
- [ ] UI 상태 메시지 업데이트
- [ ] 진행 바 단계 조정

### Step 5: 테스트 및 검증
- [ ] 다양한 스타일/행사 조합 테스트
- [ ] 품질 검증 (기존 방식 대비)
- [ ] 에러 핸들링 테스트

---

## 파일 변경 목록

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/app/api/ai/generate-image/route.ts` | 수정 | 듀얼 프레임 모드 추가 |
| `src/app/api/ai/generate-video-startend/route.ts` | **신규** | Start/End Frame 영상 생성 API |
| `src/components/ai-hologram/steps/CompositionGenerationStep.tsx` | 수정 | 새 플로우 적용 |
| `src/lib/imageUtils.ts` | **신규** (선택) | 이미지 분할 유틸리티 |

---

## 롤백 계획

기존 코드는 그대로 유지하고 새 API/컴포넌트 추가 방식으로 진행.
문제 발생 시 `CompositionGenerationStep`에서 기존 플로우로 즉시 전환 가능.

---

## 예상 결과 비교

### Before (기존 방식)
```
- Three.js 텍스트: 단조롭고 스타일 제한적
- 텍스트/배경 불일치 가능
- 복잡한 파이프라인으로 오류 발생 가능
```

### After (새로운 방식)
```
- AI 생성 3D 타이포그래피: 고품질, 다양한 스타일
- 텍스트/배경 완벽 일관성 (동일 생성)
- 단순한 파이프라인으로 안정성 향상
- 자연스러운 텍스트 등장 애니메이션
```

---

## 작성일
2026-01-15

## 상태
✅ **구현 완료** (2026-01-15)

---

## 구현 완료 내역

### 생성된 파일
| 파일 | 설명 |
|------|------|
| `src/app/api/ai/generate-video-startend/route.ts` | Start/End Frame 영상 생성 API (8개 모델 지원) |
| `src/app/api/ai/generate-dual-frame/route.ts` | 듀얼 프레임 이미지 생성 API |

### 수정된 파일
| 파일 | 설명 |
|------|------|
| `src/components/ai-hologram/steps/CompositionGenerationStep.tsx` | 새로운 Start/End Frame 플로우 적용 |

### 지원 모델 (테스트용)
```typescript
const SUPPORTED_MODELS = {
  'dop-lite': 'Higgsfield DoP Lite - 빠르고 저렴 (기본)',
  'dop-preview': 'Higgsfield DoP Preview - 중간 품질',
  'dop-turbo': 'Higgsfield DoP Turbo - 고품질',
  'kling-1.6-pro': 'Kling 1.6 Pro - 안정적인 품질',
  'kling-2.0-master': 'Kling 2.0 Master - 향상된 품질',
  'kling-2.5-turbo': 'Kling 2.5 Turbo - 최신, Start/End Frame 최적화',
  'runway-gen3-turbo': 'Runway Gen3 Turbo - 시네마틱 스타일',
  'minimax-video-01': 'Minimax Video 01 - 다양한 스타일',
};
```

### 테스트 방법
1. `CompositionGenerationStep.tsx`에서 `TEST_MODEL` 상수 변경
2. `npm run dev`로 개발 서버 실행
3. AI 홀로그램 → AI 영상 합성 모드 선택
4. 영상 생성 테스트
