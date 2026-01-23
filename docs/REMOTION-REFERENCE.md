# Remotion 레퍼런스 가이드

> LED 홀로그램 팬 프로젝트에서 활용한 Remotion 패키지 및 기능 정리

---

## 설치된 패키지

```bash
npm install @remotion/noise @remotion/animation-utils @remotion/transitions @remotion/three @remotion/bundler @remotion/renderer
```

| 패키지 | 버전 | 용도 |
|--------|------|------|
| `remotion` | 4.x | 코어 라이브러리 |
| `@remotion/noise` | 4.x | noise2D, noise3D 자연스러운 랜덤 |
| `@remotion/animation-utils` | 4.x | makeTransform 등 애니메이션 유틸 |
| `@remotion/transitions` | 4.x | Sequence 기반 전환 효과 |
| `@remotion/three` | 4.x | Three.js 3D 렌더링 |
| `@remotion/bundler` | 4.x | 서버사이드 번들링 |
| `@remotion/renderer` | 4.x | 서버사이드 렌더링 |

---

## 1. @remotion/noise

자연스러운 움직임을 위한 노이즈 함수 제공

### noise2D

```typescript
import { noise2D } from '@remotion/noise';

// 2D Perlin noise (-1 ~ 1 범위)
const value = noise2D('seed-string', x, y);

// 사용 예시: 떠다니는 효과
const driftX = noise2D('drift-x', frame * 0.02, seed) * 50;
const driftY = noise2D('drift-y', frame * 0.025, seed + 10) * 30;
```

### noise3D

```typescript
import { noise3D } from '@remotion/noise';

// 3D Perlin noise (-1 ~ 1 범위)
const value = noise3D('seed-string', x, y, z);

// 사용 예시: 홀로그램 스캔라인
const scanlineNoise = noise3D('hologram', x * 0.1, y * 0.1, frame * 0.05);
```

### 프로젝트 적용 예시

```typescript
// 글리치 효과
const glitchNoise = noise2D('glitch', frame * 0.1, seed);
const isGlitching = glitchNoise > 0.7;

// 흔들림 효과
const shakeX = noise2D('shake-x', frame * 0.5, seed) * 8;
const shakeY = noise2D('shake-y', frame * 0.5, seed + 10) * 8;

// 네온 깜빡임
const neonFlicker = noise2D('neon', frame * 0.2, seed) > 0.3 ? 1 : 0.4;
```

---

## 2. @remotion/animation-utils

### makeTransform

여러 transform 속성을 안전하게 합성

```typescript
import { makeTransform, rotate, scale, translateX, translateY } from '@remotion/animation-utils';

const transform = makeTransform([
  translateX(xOffset),
  translateY(yOffset),
  rotate(rotation),
  scale(scaleValue),
]);

// 결과: "translateX(10px) translateY(20px) rotate(45deg) scale(1.2)"
```

### 개별 transform 함수

```typescript
import { rotate, rotateX, rotateY, rotateZ, scale, translateX, translateY, translateZ } from '@remotion/animation-utils';

// 3D 회전
const style = {
  transform: makeTransform([
    rotateX(angleX),
    rotateY(angleY),
    rotateZ(angleZ),
  ]),
  transformStyle: 'preserve-3d',
};
```

---

## 3. Core Remotion APIs

### interpolate

숫자 값을 다른 범위로 매핑

```typescript
import { interpolate, Easing } from 'remotion';

// 기본 사용
const opacity = interpolate(frame, [0, 30], [0, 1]);

// 옵션
const value = interpolate(
  frame,
  [0, 30, 60, 90],  // 입력 범위
  [0, 1, 1, 0],     // 출력 범위
  {
    extrapolateLeft: 'clamp',   // 범위 밖 처리
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),  // 이징 함수
  }
);
```

### Easing 함수

```typescript
import { Easing } from 'remotion';

// 내장 이징
Easing.linear
Easing.ease
Easing.quad
Easing.cubic
Easing.sin
Easing.exp
Easing.circle
Easing.bounce
Easing.elastic(bounciness)  // 탄성 효과

// 조합
Easing.in(Easing.cubic)
Easing.out(Easing.cubic)
Easing.inOut(Easing.cubic)

// 커스텀 베지어
Easing.bezier(0.25, 0.1, 0.25, 1)
```

### useCurrentFrame & useVideoConfig

```typescript
import { useCurrentFrame, useVideoConfig } from 'remotion';

const MyComponent = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  // 초 단위로 변환
  const seconds = frame / fps;

  // 진행률 (0~1)
  const progress = frame / durationInFrames;
};
```

### Sequence

특정 프레임부터 컴포넌트 표시

```typescript
import { Sequence } from 'remotion';

<Sequence from={0} durationInFrames={150}>
  <Scene1 />
</Sequence>
<Sequence from={150} durationInFrames={150}>
  <Scene2 />
</Sequence>
```

### AbsoluteFill

전체 화면을 채우는 컨테이너

```typescript
import { AbsoluteFill } from 'remotion';

<AbsoluteFill style={{ backgroundColor: 'black' }}>
  <Content />
</AbsoluteFill>
```

### Video & OffthreadVideo

```typescript
import { Video, OffthreadVideo } from 'remotion';

// 기본 비디오 (Chrome에서 재생)
<Video src={videoUrl} />

// 오프스레드 비디오 (더 안정적, 권장)
<OffthreadVideo src={videoUrl} />
```

---

## 4. @remotion/three

Three.js와 Remotion 통합

### ThreeCanvas

```typescript
import { ThreeCanvas } from '@remotion/three';

<ThreeCanvas
  width={1080}
  height={1080}
  camera={{ position: [0, 0, 5], fov: 50 }}
  style={{ backgroundColor: 'transparent' }}
>
  <Scene />
</ThreeCanvas>
```

### @react-three/drei 연동

```typescript
import { Text } from '@react-three/drei';

<Text
  fontSize={1}
  color="#ffffff"
  anchorX="center"
  anchorY="middle"
  font="/fonts/NotoSansKR.woff2"
  outlineWidth={0.02}
  outlineColor="#00ffff"
>
  3D 텍스트
</Text>
```

---

## 5. @remotion/bundler & @remotion/renderer

서버사이드 렌더링용

### bundle (번들 생성)

```typescript
import { bundle } from '@remotion/bundler';

const bundlePath = await bundle({
  entryPoint: './src/remotion/index.ts',
  outDir: '/tmp/remotion-bundle',
  onProgress: (progress) => console.log(`${progress}%`),
});
```

### selectComposition (컴포지션 선택)

```typescript
import { selectComposition } from '@remotion/renderer';

const composition = await selectComposition({
  serveUrl: bundlePath,
  id: 'MyComposition',
  inputProps: { /* props */ },
  browserExecutable: chromiumPath,  // Vercel용
  timeoutInMilliseconds: 300000,    // 5분
});
```

### renderMedia (렌더링)

```typescript
import { renderMedia } from '@remotion/renderer';

await renderMedia({
  composition,
  serveUrl: bundlePath,
  codec: 'h264',
  outputLocation: '/tmp/output.mp4',
  inputProps: { /* props */ },

  // 최적화 옵션
  x264Preset: 'veryfast',  // 인코딩 속도 (ultrafast ~ veryslow)
  crf: 23,                 // 품질 (0=무손실, 51=최저, 권장: 18~28)
  concurrency: 4,          // 동시 렌더링 스레드

  // 타임아웃
  timeoutInMilliseconds: 1200000,  // 20분

  // 진행률
  onProgress: ({ progress }) => {
    console.log(`${Math.round(progress * 100)}%`);
  },
});
```

---

## 6. 렌더링 최적화

### 해상도 & FPS

| 설정 | 원본 | 최적화 | 효과 |
|------|------|--------|------|
| 해상도 | 1080x1080 | 720x720 | 렌더링 56% 단축 |
| FPS | 30 | 24~30 | 프레임 수 감소 |

### x264 Preset

| Preset | 속도 | 품질 | 권장 |
|--------|------|------|------|
| ultrafast | 가장 빠름 | 낮음 | 테스트용 |
| veryfast | 빠름 | 중간 | **프로덕션** |
| fast | 보통 | 좋음 | 여유 있을 때 |
| medium | 느림 | 매우 좋음 | 기본값 |
| slow | 매우 느림 | 최고 | 최종 출력 |

### CRF (Constant Rate Factor)

| CRF | 품질 | 파일 크기 | 권장 |
|-----|------|----------|------|
| 18 | 거의 무손실 | 매우 큼 | 아카이브 |
| 23 | 좋음 | 중간 | **프로덕션** |
| 28 | 보통 | 작음 | 웹 스트리밍 |

### Concurrency

```typescript
// Vercel 서버리스 환경
concurrency: 4  // 메모리 2GB 기준 최적값

// 로컬 개발 환경
concurrency: os.cpus().length  // CPU 코어 수
```

---

## 7. 주의사항

### TransitionSeries 사용 금지

```typescript
// ❌ 사용 금지 - 템플릿 영상과 타이밍 불일치 발생
import { TransitionSeries } from '@remotion/transitions';

// ✅ 대신 Sequence 사용
import { Sequence } from 'remotion';
```

### CameraMotionBlur 사용 금지

```typescript
// ❌ 사용 금지 - 렌더링 시간 8배 증가
import { CameraMotionBlur } from '@remotion/motion-blur';

// ✅ 대신 CSS opacity/blur로 간단한 모션 블러 구현
```

### Vercel 서버리스 제한

| 플랜 | 최대 실행 시간 | Remotion 적합성 |
|------|---------------|----------------|
| Hobby | 10초 | ❌ 불가능 |
| Pro | 300초 (5분) | ⚠️ 최적화 필수 |
| Enterprise | 900초 (15분) | ✅ 가능 |

---

## 8. 프로젝트 구현 이펙트 (29개)

### 기본 이펙트
- `glow` - 글로우 (text-shadow)
- `glitch` - 글리치 (noise2D + RGB 분리)
- `drift` - 떠다님 (noise2D 기반 유기적 움직임)
- `pulse` - 펄스 (크기 + 글로우 맥동)
- `hologram` - 홀로그램 (noise3D 스캔라인)
- `strobe` - 스트로브 (깜빡임)
- `wave` - 웨이브 (Y축 물결)
- `zoom` - 줌 (크기 변화)
- `blur` - 블러 (filter blur)
- `chromatic` - 색수차 (RGB 분리)
- `pixelate` - 픽셀화 (scale + image-rendering)
- `rainbow` - 레인보우 (hue-rotate)
- `rotate3d` - 3D 회전

### 움직임 이펙트
- `bounce` - 바운스 (Y축)
- `spin` - 스핀 (Z축 회전)
- `spiral` - 나선형 (X+Y 원운동)
- `swing` - 스윙 (X축 흔들림)
- `slide` - 슬라이드 (X축 좌우)
- `orbit` - 궤도 (원형 궤도)

### 3D 깊이 이펙트
- `zoomIn` - 줌인 3D (Z축 확대)
- `flipUp` - 플립업 (X축 회전 진입)
- `spiral3d` - 3D 나선 (Z축 + 회전)
- `wave3d` - 3D 웨이브 (Z축 물결)
- `tumble` - 텀블 (복합 3D 회전)
- `extrude` - 입체돌출 (다중 text-shadow)

### 신규 이펙트 (2024-01)
- `typewriter` - 타이핑 (글자 순차 등장)
- `shake` - 흔들림 (noise2D 떨림)
- `neon` - 네온 (깜빡이는 글로우)
- `float` - 부유 (부드러운 상하 움직임)
- `elastic` - 탄성 (Easing.elastic 진입)

---

## 9. 참고 링크

- [Remotion 공식 문서](https://www.remotion.dev/docs/)
- [@remotion/noise](https://www.remotion.dev/docs/noise)
- [@remotion/animation-utils](https://www.remotion.dev/docs/animation-utils)
- [@remotion/three](https://www.remotion.dev/docs/three)
- [@remotion/renderer](https://www.remotion.dev/docs/renderer)
- [Easing 함수](https://www.remotion.dev/docs/easing)
- [interpolate](https://www.remotion.dev/docs/interpolate)
- [서버사이드 렌더링](https://www.remotion.dev/docs/ssr)

---

*마지막 업데이트: 2024-01*
