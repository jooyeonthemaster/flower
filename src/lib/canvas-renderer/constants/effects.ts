/**
 * 이펙트 관련 상수
 */

import type { EffectType } from '../types';

// 모든 이펙트 목록
export const ALL_EFFECTS: EffectType[] = [
  // 시각 효과
  'glow',
  'pulse',
  'glitch',
  'strobe',
  'hologram',
  'blur',
  'chromatic',
  'pixelate',
  'rainbow',
  'neon',
  'extrude',
  // 움직임 효과
  'drift',
  'wave',
  'bounce',
  'spin',
  'spiral',
  'swing',
  'slide',
  'orbit',
  'zoom',
  'float',
  'shake',
  // 3D 깊이 효과
  'rotate3d',
  'zoomIn',
  'flipUp',
  'spiral3d',
  'wave3d',
  'tumble',
  // 진입 효과
  'typewriter',
  'elastic',
  // 글자별 이펙트
  'letterDrop',
  'letterWave',
  'letterBounce',
  'letterSpin',
  'letterScatter',
  'letterJump',
  'letterZoom',
  'letterFlip',
  'letterSlide',
  'letterPop',
  'letterRain',
];

// 이펙트 카테고리별 분류
export const VISUAL_EFFECTS: EffectType[] = [
  'glow', 'pulse', 'glitch', 'strobe', 'hologram',
  'blur', 'chromatic', 'pixelate', 'rainbow', 'neon', 'extrude',
];

export const MOVEMENT_EFFECTS: EffectType[] = [
  'drift', 'wave', 'bounce', 'spin', 'spiral',
  'swing', 'slide', 'orbit', 'zoom', 'float', 'shake',
];

export const DEPTH_3D_EFFECTS: EffectType[] = [
  'rotate3d', 'zoomIn', 'flipUp', 'spiral3d', 'wave3d', 'tumble',
];

export const ENTRANCE_EFFECTS: EffectType[] = [
  'typewriter', 'elastic',
];

export const LETTER_EFFECTS: EffectType[] = [
  'letterDrop', 'letterWave', 'letterBounce', 'letterSpin', 'letterScatter',
  'letterJump', 'letterZoom', 'letterFlip', 'letterSlide', 'letterPop', 'letterRain',
];

// 글로우 레이어 반경
export const GLOW_RADII = [15, 30, 60, 100, 150];

// Extrude 설정
export const EXTRUDE_DEPTH = 30;
export const EXTRUDE_ANGLE_X = 135;
export const EXTRUDE_ANGLE_Y = 135;
export const EXTRUDE_DARKEN_FACTOR = 0.85;

// Chromatic 오프셋 최대값
export const CHROMATIC_MAX_OFFSET = 10;

// Glitch 확률 임계값
export const GLITCH_THRESHOLD = 0.6;
export const GLITCH_OFFSET_MULTIPLIER = 30;

// Strobe 확률
export const STROBE_PROBABILITY = 0.85;
export const STROBE_DIM_OPACITY = 0.3;

// Neon 깜빡임 임계값
export const NEON_FLICKER_THRESHOLD = 0.3;
export const NEON_DIM_OPACITY = 0.4;

// 이펙트별 한글 이름 (UI용)
export const EFFECT_LABELS: Record<EffectType, string> = {
  glow: '글로우',
  pulse: '펄스',
  glitch: '글리치',
  strobe: '스트로브',
  hologram: '홀로그램',
  blur: '블러',
  chromatic: '색수차',
  pixelate: '픽셀화',
  rainbow: '무지개',
  neon: '네온',
  extrude: '3D 입체',
  drift: '드리프트',
  wave: '물결',
  bounce: '바운스',
  spin: '스핀',
  spiral: '나선',
  swing: '스윙',
  slide: '슬라이드',
  orbit: '궤도',
  zoom: '줌',
  float: '부유',
  shake: '흔들림',
  rotate3d: '3D 회전',
  zoomIn: '줌 인',
  flipUp: '플립 업',
  spiral3d: '3D 나선',
  wave3d: '3D 물결',
  tumble: '텀블',
  typewriter: '타이핑',
  elastic: '탄성',
  // 글자별 이펙트
  letterDrop: '글자 낙하',
  letterWave: '글자 물결',
  letterBounce: '글자 바운스',
  letterSpin: '글자 회전',
  letterScatter: '글자 흩어짐',
  letterJump: '글자 점프',
  letterZoom: '글자 확대',
  letterFlip: '글자 뒤집기',
  letterSlide: '글자 슬라이드',
  letterPop: '글자 팡',
  letterRain: '글자 비',
};
