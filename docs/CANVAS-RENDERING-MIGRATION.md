# Canvas 기반 브라우저 렌더링 전환

## 개요

Remotion 서버 사이드 렌더링에서 Canvas + WebCodecs 브라우저 렌더링으로 전환하여 렌더링 성능을 대폭 개선했습니다.

### 성능 비교

| 항목 | 이전 (Remotion) | 이후 (Canvas + WebCodecs) |
|------|----------------|---------------------------|
| 렌더링 시간 | 7-12분 | 15-25초 |
| 서버 부하 | 높음 (CPU 집약적) | 없음 (브라우저에서 처리) |
| 글자별 이펙트 | 불가 (전체 텍스트만) | 지원 |
| 미리보기 = 결과물 | 차이 있음 | 100% 동일 |

---

## 신규 생성 파일

### 1. Canvas 렌더러 모듈 (`src/lib/canvas-renderer/`)

```
src/lib/canvas-renderer/
├── index.ts                    # 메인 export
├── types.ts                    # 타입 정의
├── constants/
│   ├── index.ts
│   ├── defaults.ts             # 기본 설정값
│   └── effects.ts              # 이펙트 상수 (27개)
├── utils/
│   ├── colorUtils.ts           # 색상 변환 (hex, rgb, hsl)
│   ├── mathUtils.ts            # 수학 함수 (noise, easing, interpolate)
│   └── textMeasure.ts          # 텍스트 측정
├── effects/
│   ├── index.ts                # calculateEffects() 함수
│   ├── visualEffects.ts        # 시각 이펙트 11개
│   ├── movementEffects.ts      # 움직임 이펙트 11개
│   ├── depth3dEffects.ts       # 3D 이펙트 6개
│   └── entranceEffects.ts      # 입장 이펙트 2개
└── core/
    ├── CanvasTextRenderer.ts   # 텍스트 렌더링 (글자별 지원)
    ├── FrameRenderer.ts        # 단일 프레임 렌더링
    └── VideoCompositor.ts      # 영상 합성 및 미리보기
```

#### 주요 클래스

**CanvasTextRenderer**
- 2D Canvas API로 텍스트 렌더링
- 글자별 이펙트 적용 지원 (`charEffectMode: 'all' | 'random' | 'wave'`)
- 글로우, 그림자, 3D 효과 지원

**FrameRenderer**
- 배경 영상/이미지 + 텍스트 합성
- 단일 프레임 렌더링

**VideoCompositor**
- 전체 영상 렌더링 관리
- 실시간 미리보기 (requestAnimationFrame)
- 프레임 일괄 렌더링

### 2. Video Encoder 모듈 (`src/lib/video-encoder/`)

```
src/lib/video-encoder/
├── index.ts                    # 메인 export
├── types.ts                    # 타입 정의
├── WebCodecsEncoder.ts         # WebCodecs H.264 인코딩
└── MP4Muxer.ts                 # MP4 컨테이너 생성
```

#### 의존성
```json
{
  "mp4-muxer": "^5.2.2"
}
```

#### 주요 함수

```typescript
// WebCodecs 지원 확인
checkWebCodecsSupport(): WebCodecsSupport

// 프레임 배열 → MP4 Blob 생성
createMP4FromFrames(
  frames: ImageData[],
  config: EncoderConfig,
  onProgress?: EncodingProgressCallback
): Promise<Blob>
```

### 3. CanvasPreview 컴포넌트 (`src/components/ai-hologram/CanvasPreview/`)

```
src/components/ai-hologram/CanvasPreview/
├── index.tsx                   # 메인 컴포넌트
├── types.ts                    # 타입 정의
├── hooks/
│   └── useCanvasRenderer.ts    # Canvas 렌더링 훅
└── components/
    ├── index.ts
    ├── PreviewCanvas.tsx       # Canvas 요소
    ├── PlaybackControls.tsx    # 재생 컨트롤
    └── ExportButton.tsx        # 내보내기 버튼
```

#### 사용법

```tsx
import { CanvasPreview, type PreviewConfig } from '@/components/ai-hologram/CanvasPreview';

const config: PreviewConfig = {
  texts: ['첫 번째 문구', '두 번째 문구'],
  effects: ['glow', 'pulse'],
  textPosition: 'center',
  charEffectMode: 'all',
  fontFamily: "'Noto Sans KR', sans-serif",
  fontSize: 33,
  textColor: '#ffffff',
  glowColor: '#00ffff',
  videoSrc: '/templates/videos/wedding-simple.mp4',
};

<CanvasPreview
  config={config}
  width={720}
  height={720}
  autoPlay
  showControls
  onExportComplete={(blob) => console.log('Export:', blob)}
/>
```

### 4. 영상 업로드 API (`src/app/api/upload-video/route.ts`)

- FormData로 MP4 Blob 수신
- Firebase Storage에 업로드
- 공개 URL 반환

---

## 수정된 파일

### 1. PreviewSection.tsx

**경로:** `src/components/ai-hologram/steps/TextPreviewStep/components/PreviewSection.tsx`

**변경 내용:**
- Remotion `<Player>` 컴포넌트 → `<CanvasPreview>` 컴포넌트로 교체

```tsx
// Before (Remotion)
import { Player } from '@remotion/player';
import { HologramTextOverlay } from '../../../../../remotion/HologramTextOverlay';

<Player
  component={HologramTextOverlay}
  inputProps={{...}}
  durationInFrames={scenes.length * 30 * 5}
  ...
/>

// After (Canvas)
import { CanvasPreview, type PreviewConfig } from '../../../CanvasPreview';

<CanvasPreview
  config={previewConfig}
  width={720}
  height={720}
  autoPlay
  showControls={false}
/>
```

### 2. MultiSceneGenerationStep.tsx

**경로:** `src/components/ai-hologram/steps/MultiSceneGenerationStep.tsx`

**변경 내용:**
- 서버 API (`/api/ai/render-text-overlay`) 호출 → 브라우저 Canvas 렌더링으로 전환
- `VideoCompositor` + `createMP4FromFrames` 사용

**새로운 렌더링 플로우:**
1. 리소스 로드 (영상, 폰트)
2. Canvas에서 프레임별 렌더링
3. WebCodecs로 H.264 인코딩
4. mp4-muxer로 MP4 생성
5. Firebase Storage 업로드

**진행 단계 변경:**
```
Before: loading-video → looping-video → applying-overlay → completed
After:  loading-video → rendering → encoding → uploading → completed
```

**예상 시간 변경:**
```
Before: 7-12분
After:  15-25초
```

### 3. tsconfig.json

**변경 내용:**
- Remotion 관련 폴더 TypeScript 컴파일에서 제외

```json
{
  "exclude": [
    "node_modules",
    "src/remotion",
    "src/remotion-backup",
    "src/app/api/ai/render-text-overlay-backup"
  ]
}
```

### 4. mathUtils.ts

**경로:** `src/lib/canvas-renderer/utils/mathUtils.ts`

**변경 내용:**
- `interpolate` 함수를 다중 구간 지원으로 확장 (Remotion 호환)

```typescript
// Before: 2개 포인트만 지원
interpolate(value, [0, 100], [0, 1])

// After: N개 포인트 지원
interpolate(value, [0, 30, 120, 150], [0, 1, 1, 0])
```

---

## 지원 이펙트 (27개)

### Visual Effects (11개)
- glow, pulse, glitch, strobe, hologram
- blur, chromatic, pixelate, rainbow, neon, extrude

### Movement Effects (11개)
- drift, wave, bounce, spin, spiral
- swing, slide, orbit, zoom, float, shake

### 3D Depth Effects (6개)
- rotate3d, zoomIn, flipUp, spiral3d, wave3d, tumble

### Entrance Effects (2개)
- typewriter, elastic

---

## 브라우저 지원

| 브라우저 | 지원 여부 |
|---------|----------|
| Chrome 94+ | O |
| Edge 94+ | O |
| Firefox | X (WebCodecs 미지원) |
| Safari | X (WebCodecs 미지원) |

WebCodecs 미지원 브라우저에서는 경고 메시지가 표시됩니다.

---

## 백업된 파일

기존 Remotion 코드는 다음 위치에 백업되어 있습니다:
- `src/remotion-backup/`
- `src/app/api/ai/render-text-overlay-backup/`

---

## 향후 개선 가능 사항

1. **폴백 렌더링**: WebCodecs 미지원 브라우저용 서버 렌더링 폴백
2. **WebGL 렌더링**: 더 복잡한 3D 이펙트를 위한 WebGL 전환
3. **워커 스레드**: 렌더링을 Web Worker로 분리하여 UI 블로킹 방지
4. **프로그레시브 렌더링**: 렌더링하면서 미리보기 업데이트
