# 템플릿 모드 참조 이미지 오류 수정 기록

## 현재 상태
- ✅ 미리보기에서 참조 이미지 표시됨
- ⚠️ 최종 영상에서 참조 이미지 표시 여부 확인 필요
- ✅ 참조 이미지 없는 템플릿 모드는 정상 작동

---

## 수정된 파일 목록

### 1. FrameRenderer.ts (최종 영상 렌더링)
**경로**: `src/lib/canvas-renderer/core/FrameRenderer.ts`

**수정 내용**: `renderReferenceImage()` 메서드 블렌딩 모드 변경

```typescript
// Before (문제 있던 코드)
ctx.globalCompositeOperation = 'screen';  // 어두운 색 투명화
ctx.globalAlpha = 0.8;

// After (수정된 코드)
ctx.globalCompositeOperation = 'source-over';  // 기본 블렌딩
ctx.globalAlpha = 1;
```

**문제 원인**:
- `screen` 블렌딩 모드는 어두운 색을 투명하게 만듦
- 배경 제거된 PNG에서 어두운 색상 부분이 안 보이게 됨

---

### 2. PreviewCanvas.tsx (미리보기 렌더링)
**경로**: `src/components/ai-hologram/CanvasPreview/components/PreviewCanvas.tsx`

**수정 내용 1**: 블렌딩 모드 변경

```typescript
// Before
mixBlendMode: 'screen'
opacity: 0.9

// After
mixBlendMode: 'normal'
opacity: 1
```

**수정 내용 2**: z-index 레이어 순서 정리

```typescript
// 레이어 순서 (낮은 값이 뒤쪽)
video: zIndex 1
darkOverlay: zIndex 2
referenceImage: zIndex 3  // 원래 10이었음
textCanvas: zIndex 4
```

**문제 원인**:
- 참조 이미지 z-index가 10으로 텍스트보다 위에 있었음
- CSS z-index는 정수여야 함 (2.5 같은 값은 안됨)

---

### 3. WebCodecsEncoder.ts (영상 인코딩)
**경로**: `src/lib/video-encoder/WebCodecsEncoder.ts`

**수정 내용**: H.264 코덱 프로파일 변경 (1080p 지원)

```typescript
// Before (720p까지만 지원)
return 'avc1.42001f';  // H.264 Baseline Level 3.1

// After (1080p 지원)
return 'avc1.4d0028';  // H.264 Main Profile Level 4.0
```

**문제 원인**:
- H.264 Baseline Level 3.1은 1080p 해상도 미지원
- 1080p 렌더링으로 변경 후 코덱 오류 발생

---

### 4. PreviewSection.tsx (미리보기 설정)
**경로**: `src/components/ai-hologram/steps/TextPreviewStep/components/PreviewSection.tsx`

**수정 내용**: letterEffect를 effects 배열에 포함

```typescript
effects: [
  ...(customSettings.effects || []),
  ...(customSettings.letterEffect && customSettings.letterEffect !== 'none'
    ? [customSettings.letterEffect] : [])
] as EffectType[],
```

---

### 5. MultiSceneGenerationStep.tsx (영상 생성)
**경로**: `src/components/ai-hologram/steps/MultiSceneGenerationStep.tsx`

**수정 내용 1**: 해상도 변경

```typescript
// Before
renderer: { width: 720, height: 720, fps: 30 }

// After
renderer: { width: 1080, height: 1080, fps: 30 }
```

**수정 내용 2**: letterEffect를 effects 배열에 포함

```typescript
effects: [
  ...(settings?.effects || []),
  ...(settings?.letterEffect && settings.letterEffect !== 'none'
    ? [settings.letterEffect] : [])
] as EffectType[],
```

---

## 참조 이미지 데이터 흐름

```
1. CompositionImagePreviewStep
   └─ 배경 제거 API 호출
   └─ Data URL 형태로 저장 (base64 PNG)

2. TextPreviewStep
   └─ sceneData.referenceImage로 전달받음
   └─ PreviewSection으로 전달
   └─ CanvasPreview의 referenceImageSrc로 전달

3. MultiSceneGenerationStep
   └─ referenceImage 프롭으로 전달받음
   └─ generateCompositionVideo()에서 referenceImageSrc로 사용
   └─ FrameRenderer.loadReferenceImage()에서 로드

4. FrameRenderer (최종 렌더링)
   └─ loadReferenceImage(): Data URL에서 Image 객체 생성
   └─ renderReferenceImage(): 캔버스에 그리기
```

---

## 디버깅 로그 위치

### PreviewCanvas.tsx
```typescript
console.log('[PreviewCanvas] referenceImageSrc:', referenceImageSrc ? 'exists' : 'none');
console.log('[PreviewCanvas] referenceImageSrc length:', referenceImageSrc?.length);
```

### FrameRenderer.ts
```typescript
console.log('[FrameRenderer] loadVideo() called with:', videoSrc);
console.log('[FrameRenderer] loadReferenceImage() loading...');
console.log('[FrameRenderer] Reference image loaded:', this.referenceImage?.width, 'x', this.referenceImage?.height);
```

---

## 남은 확인 사항

1. [ ] 최종 영상에서 참조 이미지 실제 표시 확인
2. [ ] 다양한 참조 이미지로 테스트 (밝은 이미지, 어두운 이미지)
3. [ ] 참조 이미지 위치/크기 조정 필요 여부 확인

---

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2026-01-23 | 초기 문서 작성 |
| 2026-01-23 | FrameRenderer 블렌딩 모드 수정 (screen → source-over) |
| 2026-01-23 | PreviewCanvas z-index 및 블렌딩 모드 수정 |
| 2026-01-23 | WebCodecsEncoder 코덱 변경 (1080p 지원) |
| 2026-01-23 | letterEffect 분리 및 effects 배열 병합 로직 추가 |
