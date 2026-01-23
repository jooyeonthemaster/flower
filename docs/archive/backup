# 템플릿 모드 참조 이미지 기능 백업

**상태**: 2026-01-23 기준 비활성화됨 (배포 우선)
**이유**: 최종 영상에서 참조 이미지가 표시되지 않는 버그 미해결

---

## 비활성화된 기능 목록

### 1. MultiSceneStep.tsx - 참조 이미지 업로드 UI
```typescript
// 파일: src/components/ai-hologram/steps/MultiSceneStep.tsx
// 위치: Line 310-373 근처

{/* 로고 업로드 */}
<div>
  <label className="block text-sm font-bold text-gray-300 mb-2">참조 이미지 (선택)</label>
  <div
    onClick={() => !isRemovingBackground && fileInputRef.current?.click()}
    // ... 업로드 UI 코드
  >
    {/* 배경 제거 진행 중, 완료, 미업로드 상태 UI */}
  </div>
</div>
```

### 2. PreviewCanvas.tsx - 참조 이미지 렌더링
```typescript
// 파일: src/components/ai-hologram/CanvasPreview/components/PreviewCanvas.tsx
// 위치: Line 149-175 근처

{/* 참조 이미지 (다크 오버레이 위, 텍스트 아래) */}
{referenceImageSrc && (
  <div
    className="absolute pointer-events-none flex items-center justify-center"
    style={{
      zIndex: 3,
      top: '30%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '35%',
    }}
  >
    <img
      src={referenceImageSrc}
      alt="Reference"
      // ... 스타일
    />
  </div>
)}
```

### 3. FrameRenderer.ts - 참조 이미지 로드 및 렌더링
```typescript
// 파일: src/lib/canvas-renderer/core/FrameRenderer.ts

// Line 39-40: 참조 이미지 변수
private referenceImage: HTMLImageElement | null = null;

// Line 145-230: loadReferenceImage() 메서드
async loadReferenceImage(imageSrc: string): Promise<void> {
  // Data URL 또는 HTTP URL 로드 로직
}

// Line 242-244: loadResources()에서 호출
if (this.config.referenceImageSrc) {
  promises.push(this.loadReferenceImage(this.config.referenceImageSrc));
}

// Line 269-271: renderFrame()에서 호출
if (this.referenceImage) {
  this.renderReferenceImage();
}

// Line 340-367: renderReferenceImage() 메서드
private renderReferenceImage(): void {
  // Canvas에 참조 이미지 그리기
  const imgWidth = width * 0.35;
  const y = height * 0.3 - imgHeight / 2;
  ctx.drawImage(this.referenceImage, x, y, imgWidth, imgHeight);
}
```

---

## 데이터 흐름

```
MultiSceneStep
  ↓ handleFileChange() - 파일 선택 후 배경 제거
  ↓ removeBackground() - @imgly/background-removal
  ↓ previewUrl (Data URL)
  ↓ onNext({ referenceImage: previewUrl })

HologramWizard
  ↓ setSceneData({ referenceImage })

TextPreviewStep
  ↓ sceneData.referenceImage → PreviewSection

PreviewSection
  ↓ previewConfig.referenceImageSrc = referenceImage

CanvasPreview → PreviewCanvas
  ↓ DOM <img> 태그로 미리보기 표시 ✅

MultiSceneGenerationStep
  ↓ createRenderConfig().referenceImageSrc = sceneData.referenceImage

VideoCompositor → FrameRenderer
  ↓ loadReferenceImage() - 이미지 로드
  ↓ renderReferenceImage() - Canvas에 그리기 ❌ (문제 발생)
```

---

## 발견된 문제

1. **React 상태 업데이트 타이밍 문제**
   - `handlePreviewComplete`에서 클로저 캡처로 `referenceImage` 누락
   - 해결책: 함수형 상태 업데이트 사용

2. **미리보기 vs 최종 영상 렌더링 방식 차이**
   - 미리보기: HTML DOM (`<img>` 태그)
   - 최종 영상: Canvas API (`drawImage()`)
   - 위치 불일치: 미리보기 25% vs 최종 40%

3. **비디오 로드 에러** (원인 불명)
   - 참조 이미지 기능 추가 후 비디오 로드 실패 발생
   - `Failed to load video element: /templates/videos/wedding-fancy.mp4`

---

## 복원 시 필요한 작업

1. MultiSceneStep.tsx - 참조 이미지 업로드 UI 복원
2. PreviewCanvas.tsx - 참조 이미지 렌더링 복원
3. FrameRenderer.ts - loadReferenceImage(), renderReferenceImage() 활성화
4. 위치 동기화 (미리보기 30%, 최종 영상 30%)
5. HologramWizard.tsx - 함수형 상태 업데이트 유지

---

## 관련 파일

- `src/components/ai-hologram/steps/MultiSceneStep.tsx`
- `src/components/ai-hologram/CanvasPreview/components/PreviewCanvas.tsx`
- `src/components/ai-hologram/steps/TextPreviewStep/components/PreviewSection.tsx`
- `src/lib/canvas-renderer/core/FrameRenderer.ts`
- `src/lib/canvas-renderer/types.ts` (RenderConfig.referenceImageSrc)
- `docs/TEMPLATE-REFERENCE-IMAGE-FIX.md`
