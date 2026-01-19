# AI 영상 합성 모드 수정 기록

## 문제 히스토리

### 반복된 실수
1. 참조 이미지를 배경에 "은은하게" 처리하려 함 → 사용자 의도 아님
2. 참조 이미지와 3D 텍스트를 Canvas에서 단순 합성 → 겹침 문제

---

## 사용자가 원하는 정확한 플로우

```
[Step 1] AI 배경 이미지 생성
- 입력: 행사 유형, 스타일, 참조 이미지
- 출력: 참조 이미지가 명확히 포함된 홀로그램 배경 이미지
- 단일 영상 생성과 동일한 방식

[Step 2] 3D 텍스트 이미지 생성
- 입력: 행사 유형, 스타일, 텍스트 내용
- 출력: 검은 배경 + 화려한 3D 텍스트 이미지 (PNG)
- Three.js로 클라이언트에서 렌더링

[Step 3] AI 텍스트 영상 생성
- 입력: 3D 텍스트 이미지
- 출력: 모션 이펙트가 적용된 텍스트 영상 (검은 배경)
- Higgsfield image-to-video 사용
- 텍스트가 빛나고, 글로우가 펄럭이는 등 동적 효과

[Step 4] 배경 이미지 + 텍스트 영상 오버레이
- 배경 이미지: 정적 또는 별도 영상화
- 텍스트 영상: screen 블렌딩으로 검은 배경 제거
- 최종 출력: 참조 이미지가 보이는 배경 위에 움직이는 3D 텍스트
```

---

## 핵심 포인트

### 1. 참조 이미지 처리
- **올바른 방식**: AI가 배경 이미지 생성할 때 참조 이미지를 명확히 포함
- **잘못된 방식**: 참조 이미지를 투명하게 또는 배경에 은은하게 처리

### 2. 3D 텍스트와 배경의 분리
- **올바른 방식**: 텍스트를 별도 영상으로 생성 → 배경 위에 오버레이
- **잘못된 방식**: 텍스트 이미지를 배경과 합성한 후 영상 변환

### 3. 단일 영상 생성과의 차이점
| 항목 | 단일 영상 생성 | AI 영상 합성 |
|------|---------------|-------------|
| 텍스트 처리 | Remotion HTML/CSS 오버레이 | Higgsfield로 텍스트 영상 생성 |
| 배경 | AI 이미지 → 영상 변환 | AI 이미지 (정적) |
| 최종 합성 | Remotion 렌더링 | 배경 + 텍스트 영상 오버레이 |

---

## 현재 코드의 문제점

### CompositionGenerationStep.tsx 현재 플로우 (잘못됨)
```
1. 3D 텍스트 이미지 캡처
2. AI 배경 이미지 생성
3. Canvas로 배경 + 텍스트 합성 (정적 이미지)
4. 합성된 이미지를 Higgsfield로 영상 변환
```

### 문제점
- Step 3에서 텍스트와 배경이 하나의 이미지로 합성됨
- Step 4에서 텍스트도 배경처럼 변형되어 버림
- 참조 이미지와 텍스트가 "붙어있는" 것처럼 보임

---

## 수정 계획

### 새로운 플로우

```typescript
// CompositionGenerationStep.tsx 수정된 플로우

// Phase 1: 3D 텍스트 이미지 캡처 (기존 유지)
const textImages = await captureTextImages();

// Phase 2: AI 배경 이미지 생성 (기존 유지)
const backgroundImages = await generateBackgrounds();

// Phase 3: 3D 텍스트 이미지 → 텍스트 영상 생성 (NEW!)
const textVideos = await generateTextVideos(textImages);
// Higgsfield로 텍스트 이미지를 모션 영상으로 변환
// 프롬프트: "glowing 3D text animation, pulsating, floating effect"

// Phase 4: 배경 이미지 + 텍스트 영상 오버레이 (NEW!)
const finalVideos = await overlayTextOnBackground(backgroundImages, textVideos);
// Remotion 또는 FFmpeg로 screen 블렌딩 합성
// 검은 배경의 텍스트 영상이 배경 위에 투명하게 오버레이

// Phase 5: 영상 합성 (기존 유지)
const finalVideo = await mergeVideos(finalVideos);
```

### 필요한 변경사항

1. **CompositionGenerationStep.tsx**
   - `generateVideo()` 함수 분리: 텍스트 영상 생성용
   - `overlayTextOnBackground()` 함수 추가
   - 기존 `compositeImages()` 함수 제거

2. **새 API: `/api/ai/overlay-video`**
   - 배경 이미지 + 텍스트 영상을 screen 블렌딩으로 합성
   - Remotion 또는 FFmpeg 사용

---

## 구현 순서

1. [x] MD 파일 작성
2. [x] CompositionGenerationStep.tsx 플로우 재설계
3. [x] generateTextVideo() 함수 구현 (텍스트 이미지 → 텍스트 영상)
4. [x] overlay-video-on-image API 구현 (배경 + 텍스트 영상 합성)
5. [x] 빌드 테스트 통과 (2026-01-15)

---

## 구현된 파일 목록

### 신규 생성
- `src/remotion/VideoOnImageOverlay.tsx` - 배경+텍스트 영상 오버레이 Remotion composition
- `src/app/api/ai/overlay-video-on-image/route.ts` - 오버레이 렌더링 API

### 수정
- `src/remotion/Root.tsx` - VideoOnImageOverlay composition 등록
- `src/components/ai-hologram/steps/CompositionGenerationStep.tsx` - 5단계 플로우 전체 재작성

---

## 검증 체크리스트

- [ ] 참조 이미지가 배경에 명확히 표시되는가?
- [ ] 3D 텍스트가 배경과 분리되어 보이는가?
- [ ] 텍스트에 모션 이펙트가 적용되었는가?
- [ ] 최종 영상에서 참조 이미지와 텍스트가 겹치지 않고 잘 구분되는가?

---

## 새로운 플로우 상세 (구현 완료)

```
Phase 1: 3D 텍스트 이미지 캡처 (Three.js)
  → Text3DRenderer로 검은 배경 + 3D 텍스트 PNG 생성

Phase 2: AI 배경 이미지 생성
  → /api/ai/generate-image API 호출
  → 참조 이미지가 중앙에 명확하게 포함됨 (단일 영상과 동일)

Phase 3: 텍스트 영상 생성 (NEW!)
  → /api/ai/generate-video-higgsfield API 호출
  → 3D 텍스트 이미지 → 모션 이펙트가 적용된 영상
  → 프롬프트: "Glowing 3D text animation with pulsating light effects..."

Phase 4: 배경 + 텍스트 영상 오버레이 (NEW!)
  → /api/ai/overlay-video-on-image API 호출
  → Remotion VideoOnImageOverlay composition 사용
  → screen 블렌딩으로 검은 배경 제거, 텍스트만 표시

Phase 5: 영상 합성
  → /api/ai/merge-videos API 호출 (여러 장면 이어붙이기)
```
