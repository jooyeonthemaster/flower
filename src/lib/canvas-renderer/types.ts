/**
 * Canvas 렌더러 타입 정의
 */

// 이펙트 타입
export type EffectType =
  // 시각 효과
  | 'glow'
  | 'pulse'
  | 'glitch'
  | 'strobe'
  | 'hologram'
  | 'blur'
  | 'chromatic'
  | 'pixelate'
  | 'rainbow'
  | 'neon'
  | 'extrude'
  // 움직임 효과
  | 'drift'
  | 'wave'
  | 'bounce'
  | 'spin'
  | 'spiral'
  | 'swing'
  | 'slide'
  | 'orbit'
  | 'zoom'
  | 'float'
  | 'shake'
  // 3D 깊이 효과
  | 'rotate3d'
  | 'zoomIn'
  | 'flipUp'
  | 'spiral3d'
  | 'wave3d'
  | 'tumble'
  // 진입 효과
  | 'typewriter'
  | 'elastic'
  // 글자별 이펙트
  | 'letterDrop'
  | 'letterWave'
  | 'letterBounce'
  | 'letterSpin'
  | 'letterScatter'
  | 'letterJump'
  | 'letterZoom'
  | 'letterFlip'
  | 'letterSlide'
  | 'letterPop'
  | 'letterRain';

// 텍스트 위치
export type TextPosition = 'random' | 'top' | 'center' | 'bottom';

// 글자별 이펙트 모드
export type CharEffectMode = 'all' | 'whole' | 'perChar';

// 렌더러 설정
export interface RendererConfig {
  width: number;
  height: number;
  fps: number;
  duration: number; // 초 단위
  backgroundColor: string;
}

// 텍스트 스타일
export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  glowColor: string;
  textAlign: CanvasTextAlign;
}

// 텍스트 씬 (각 텍스트별 설정)
export interface TextScene {
  text: string;
  startFrame: number;
  endFrame: number;
  seed: number;
  position: TextPosition;
}

// 전체 렌더링 설정
export interface RenderConfig {
  renderer: RendererConfig;
  textStyle: TextStyle;
  effects: EffectType[];
  charEffectMode: CharEffectMode;
  texts: string[];
  textPosition: TextPosition;
  videoSrc?: string;
  referenceImageSrc?: string;
}

// 이펙트 계산 결과
export interface EffectResult {
  // 위치 변환
  translateX: number;
  translateY: number;
  translateZ: number;
  // 회전
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  // 크기
  scale: number;
  // 투명도
  opacity: number;
  // 필터
  blur: number;
  hueRotate: number;
  // 텍스트 그림자
  textShadow: string;
  // 추가 렌더링 (chromatic, glitch 등)
  extraLayers?: ExtraLayer[];
  // 표시할 텍스트 (typewriter용)
  displayText?: string;
}

// 추가 레이어 (chromatic, glitch 등)
export interface ExtraLayer {
  color: string;
  offsetX: number;
  offsetY: number;
  opacity: number;
  blendMode: GlobalCompositeOperation;
}

// 이펙트 컨텍스트 (계산에 필요한 정보)
export interface EffectContext {
  frame: number;
  localFrame: number;
  fps: number;
  seed: number;
  width: number;
  height: number;
  text: string;
  glowColor: string;
  // 글자별 이펙트용
  charIndex?: number;
  totalChars?: number;
}

// 프레임 렌더링 결과
export interface FrameData {
  imageData: ImageData;
  frameNumber: number;
}

// 내보내기 진행 상황
export interface ExportProgress {
  phase: 'preparing' | 'rendering' | 'encoding' | 'finalizing' | 'complete';
  current: number;
  total: number;
  percentage: number;
}

// 내보내기 콜백
export type ExportProgressCallback = (progress: ExportProgress) => void;
