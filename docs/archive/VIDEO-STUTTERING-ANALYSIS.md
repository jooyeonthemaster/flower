# 영상 끊김(버벅임) 버그 분석 보고서

> 작성일: 2026-01-22
> 최종 수정: 2026-01-22
> 상태: 대부분 해결 (모니터링 중)

---

## 1. 문제 요약

**증상:** Git에 푸시된 코드는 정상 작동하지만, 로컬에서 수정한 코드에서 영상 끊김(버벅임) 발생

**영향 범위:** 템플릿 버전 텍스트 오버레이 렌더링

---

## 2. 분석 과정

### 2.1 파일 비교 대상

| 파일 | 역할 |
|------|------|
| `src/remotion/HologramTextOverlay.tsx` | 텍스트 오버레이 렌더링 컴포넌트 |
| `src/remotion/Root.tsx` | Remotion 컴포지션 정의 |
| `src/app/api/ai/render-text-overlay/route.ts` | 렌더링 API 엔드포인트 |
| `src/app/api/ai/render-text-overlay/services/remotionRenderer.ts` | Remotion 렌더링 서비스 (로컬만) |

### 2.2 분석 방법

1. `git show HEAD:<파일경로>` - Git에 푸시된 코드 확인
2. 로컬 파일 직접 읽기 - 현재 코드 확인
3. `git diff HEAD -- <파일경로>` - 차이점 상세 비교
4. Remotion 공식 문서 참조 - Sequence/useCurrentFrame 동작 확인

---

## 3. Git vs 로컬 코드 전체 차이점

### 3.1 렌더링 방식 변경

| 항목 | Git (정상) | 로컬 (문제) |
|------|-----------|------------|
| 텍스트 컴포넌트 | `TextSceneComponent` | `TextSceneContent` |
| 렌더링 방식 | 직접 렌더링 + 프레임 체크 | `Sequence` 래핑 |
| 프레임 범위 체크 | `if (frame < startFrame...) return null` | 없음 (Sequence가 관리) |
| localFrame 계산 | `frame - scene.startFrame` | `frame` (상대 프레임) |
| duration | `scene.endFrame - scene.startFrame` | `fps * 5` (고정) |

**Git 코드:**
```typescript
const TextSceneComponent = ({ scene, ... }) => {
  const frame = useCurrentFrame();  // 전체 컴포지션 프레임 (0~899)

  // 프레임 범위 체크로 가시성 제어
  if (frame < scene.startFrame || frame >= scene.endFrame) return null;

  const localFrame = frame - scene.startFrame;  // 명시적 계산
  const duration = scene.endFrame - scene.startFrame;
  ...
};

// 모든 컴포넌트 동시 렌더링 (프레임 체크로 하나만 표시)
{textScenes.map((scene, index) => (
  <TextSceneComponent key={index} scene={scene} ... />
))}
```

**로컬 코드:**
```typescript
const TextSceneContent = ({ scene, ... }) => {
  const frame = useCurrentFrame();  // Sequence 기준 상대 프레임 (0~149)

  const localFrame = frame;  // Sequence 내부이므로 이미 상대 프레임
  const duration = fps * 5;
  ...
};

// Sequence로 타이밍 제어
{textScenes.map((scene, index) => (
  <Sequence key={index} from={index * sceneDurationInFrames} durationInFrames={...}>
    <TextSceneContent scene={scene} ... />
  </Sequence>
))}
```

---

### 3.2 미리보기/렌더링 비율 불일치 문제 ✅ 해결됨

**문제:** 미리보기와 최종 렌더링의 해상도/폰트 크기가 달라 결과물이 다르게 보임

| 항목 | 미리보기 (수정 전) | 렌더링 (수정 전) | 통일 후 |
|------|-------------------|-----------------|---------|
| 해상도 | 1080x1080 | 720x720 | **720x720** |
| fontSize | 50px | 40px | **33px** |
| 컨테이너 | 1000px 고정 | 1000px 고정 | **90% 비율** |

**수정 파일:**
- `PreviewSection.tsx`: compositionWidth/Height 720, fontSize 33
- `Root.tsx`: fontSize 33
- `TextPreviewStep/index.tsx`: customSettings.fontSize 33
- `MultiSceneGenerationStep.tsx`: API 호출 시 fontSize 33
- `HologramTextOverlay.tsx`: 컨테이너 width/maxWidth 90%, baseUnit 적용

**baseUnit 비율 계수:**
```typescript
const { width } = useVideoConfig();
const baseUnit = width / 1080;  // 720p에서 0.667, 1080p에서 1.0

// 모든 이펙트 이동량에 적용
const driftX = hasDrift ? driftNoiseX * 90 * baseUnit * fadeoutFactor : 0;
const bounceY = hasBounce ? Math.abs(Math.sin(repeatPhase + seed)) * 50 * baseUnit * fadeoutFactor : 0;
// ... 등
```

---

### 3.3 Video 컴포넌트 변경

```typescript
// Git (정상)
<Video src={videoSrc} style={...} delayRenderTimeoutInMilliseconds={60000} />

// 로컬 (문제)
<Video src={videoSrc} style={...} delayRenderTimeoutInMilliseconds={60000} loop />
//                                                                          ^^^^
```

**`loop` 속성 추가됨!**

---

### 3.4 해상도 변경 (Git vs 로컬 비교)

| 항목 | Git | 로컬 (수정 전) | 현재 (통일) |
|------|-----|---------------|-------------|
| Root.tsx width/height | 1080x1080 | 720x720 | 720x720 |
| fontSize (defaultProps) | 48px | 40px | **33px** |
| HologramTextOverlay fontSize | 50px | 65px | **33px** |

---

### 3.5 이펙트 타이밍 변경

```typescript
// Git
const repeatProgress = Math.min(localFrame / (fps * 3), 1); // 3초 반복 + 2초 정지

// 로컬
const effectDuration = fps * 4;
const repeatProgress = Math.min(localFrame / effectDuration, 1); // 4초 반복
const fadeoutStart = fps * 3.5;
const fadeoutFactor = interpolate(localFrame, [fadeoutStart, effectDuration], [1, 0], ...);
```

**fadeoutFactor가 모든 이펙트에 곱해짐** → 이펙트가 4초 후 점점 감소

---

### 3.6 움직임 계산 방식 변경

```typescript
// Git - Math.sin/cos 기반
const driftX = hasDrift ? Math.sin(repeatPhase + seed) * 80 : 0;
const isGlitching = hasGlitch ? random(frame + seed) > 0.8 : false;

// 로컬 - noise2D 기반
const driftNoiseX = hasDrift ? noise2D('drift-x', frame * 0.03, seed) : 0;
const glitchNoise = hasGlitch ? noise2D('glitch', frame * 0.15, seed) : 0;
```

**중요:** Sequence 내부에서 `frame`은 상대 프레임(0~149)이므로:
- 텍스트 1: frame 0~149 → noise2D 값
- 텍스트 2: frame 0~149 → **동일한 noise2D 값!**
- 모든 텍스트에서 **동일한 움직임 패턴 반복**

---

### 3.7 FFmpeg 변환 추가 (route.ts)

```typescript
// Git - FFmpeg 변환 없음
// Base64 → 임시 파일 → HTTP URL 직접 사용

// 로컬 - FFmpeg CFR 변환 추가
await execFileAsync(ffmpegPath, [
  '-y', '-i', rawVideoPath,
  '-c:v', 'libx264',
  '-preset', 'fast',
  '-crf', '18',
  '-r', '30',                 // CFR 30fps
  '-g', '30',                 // GOP 30
  '-vf', 'scale=720:720',     // 720p 스케일링!
  '-sc_threshold', '0',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  '-an',
  tempVideoPath
]);
```

---

### 3.8 새 이펙트 추가 (로컬만)

- `typewriter`, `shake`, `neon`, `float`, `elastic`

---

### 3.9 extrude depth 감소

- Git: `depth = 60`
- 로컬: `depth = 30` (렌더링 최적화)

---

## 4. 버벅임 원인 분석 (우선순위)

### 4.1 1순위: Video `loop` 속성 ✅ 해결됨

30초 템플릿 영상에 `loop`가 있으면:
1. 영상이 30초에 도달할 때 처음으로 되돌아감
2. Remotion 렌더링 중 seeking 발생
3. 프레임 불연속성 → **버벅임**

**해결:** `loop` 속성 제거

### 4.2 2순위: FFmpeg 720p 스케일링

원본 템플릿이 1080p인데 720p로 축소:
- 품질 손실
- 해상도 불일치 (컴포지션 720x720 vs 원본)

### 4.3 3순위: noise2D + Sequence 조합 ✅ 해결됨

Sequence 내부에서 `frame`이 상대 프레임이므로:
- 모든 텍스트에서 동일한 noise 패턴 → **globalFrame 적용으로 해결**
- "단조로움"은 있지만 "버벅임"의 직접 원인은 아닐 가능성

**해결:** `globalFrame = scene.startFrame + frame`을 계산하여 KineticText에 전달

### 4.4 4순위: fadeoutFactor

이펙트가 4초 후 점점 감소 → "멈춤"처럼 보일 수 있음

---

## 5. 수정 계획

### 5.1 접근법 A: 최소 수정 (권장)

#### Step 1: Video loop 속성 제거 ✅ 완료

**파일:** `src/remotion/HologramTextOverlay.tsx` (라인 600)

```typescript
// 변경 전
loop // 30초 ping-pong 영상이 끝나면 처음부터 반복

// 변경 후
// loop 속성 제거
```

#### Step 2: 테스트 후 추가 수정 결정

---

### 5.2 접근법 B: Git 방식 복원 (문제 지속 시)

1. Sequence 제거 → 직접 렌더링
2. `localFrame = frame - scene.startFrame` 복원
3. 프레임 범위 체크 추가
4. Video loop 제거

---

### 5.3 접근법 C: noise2D 전역 프레임 사용 ✅ 완료

Sequence 사용 유지하면서 noise2D에 전역 프레임 전달:

```typescript
// TextSceneContent에서 전역 프레임 계산
const frame = useCurrentFrame();  // Sequence 내부 상대 프레임 (0~149)
const globalFrame = scene.startFrame + frame;  // 전역 프레임 계산

// KineticText에 전역 프레임 전달
<KineticText
  frame={globalFrame}  // 전역 프레임 (noise2D용 - 텍스트별 고유 패턴)
  ...
/>

// KineticText에서 noise2D에 전역 프레임 사용
const driftNoiseX = hasDrift ? noise2D('drift-x', frame * 0.03, seed) : 0;  // frame = globalFrame
```

**결과:** 각 텍스트마다 고유한 움직임 패턴 생성됨

---

## 6. 수정 이력

| 날짜 | 수정 내용 | 상태 |
|------|----------|------|
| 2026-01-22 | Video `loop` 속성 제거 | ✅ 완료 |
| 2026-01-22 | **720p 통일** - 미리보기/렌더링 해상도 1080→720 통일 | ✅ 완료 |
| 2026-01-22 | **fontSize 33px** - 720p 기준 폰트 사이즈 조정 (50→33) | ✅ 완료 |
| 2026-01-22 | **컨테이너 90%** - 고정 1000px → 90% 비율 기반 | ✅ 완료 |
| 2026-01-22 | **baseUnit 적용** - 이펙트 이동량을 `width/1080` 비율 기반으로 변경 | ✅ 완료 |
| 2026-01-22 | **globalFrame 적용** - noise2D에 전역 프레임 전달 (텍스트별 고유 패턴) | ✅ 완료 |
| - | FFmpeg 스케일링 1080p 변경 | 대기 (필요 시) |
| - | Git 방식 복원 | 대기 (필요 시) |

---

## 7. 검증 방법

1. 텍스트 오버레이 렌더링 테스트 (웹 UI에서)
2. 각 텍스트 전환 시점(5초, 10초, 15초, 20초, 25초)에서 끊김 확인
3. 30초 시점에서 영상 끝 처리 확인 (loop 제거 후)
4. 이펙트 애니메이션이 각 텍스트마다 자연스럽게 작동하는지 확인

---

## 8. 참고 문서

- [Remotion Sequence 문서](https://www.remotion.dev/docs/sequence) - Sequence 내부 useCurrentFrame() 동작 확인
- [Remotion useCurrentFrame 문서](https://www.remotion.dev/docs/use-current-frame) - 프레임 계산 방식
- [docs/archive/video-stuttering-vfr-fix.md](./archive/video-stuttering-vfr-fix.md) - VFR→CFR 변환 관련 이전 수정 기록

---

## 9. 관련 파일 목록

- `src/remotion/HologramTextOverlay.tsx` - 텍스트 오버레이 컴포넌트
- `src/remotion/Root.tsx` - Remotion 컴포지션 정의
- `src/app/api/ai/render-text-overlay/route.ts` - 렌더링 API
- `src/app/api/ai/render-text-overlay/services/remotionRenderer.ts` - Remotion 서비스
