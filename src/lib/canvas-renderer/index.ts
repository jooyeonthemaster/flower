/**
 * Canvas 렌더러 메인 export
 */

// Types
export type {
  EffectType,
  TextPosition,
  CharEffectMode,
  RendererConfig,
  TextStyle,
  TextScene,
  RenderConfig,
  EffectResult,
  ExtraLayer,
  EffectContext,
  FrameData,
  ExportProgress,
  ExportProgressCallback,
} from './types';

// Constants
export {
  DEFAULT_RENDERER_CONFIG,
  DEFAULT_TEXT_STYLE,
  SCENE_DURATION_SECONDS,
  ENTRANCE_DURATION_SECONDS,
  EXIT_DURATION_SECONDS,
  EFFECT_DURATION_SECONDS,
  FADEOUT_START_SECONDS,
  POSITION_TOP,
  POSITION_CENTER,
  POSITION_BOTTOM,
} from './constants';

export {
  ALL_EFFECTS,
  VISUAL_EFFECTS,
  MOVEMENT_EFFECTS,
  DEPTH_3D_EFFECTS,
  ENTRANCE_EFFECTS,
  LETTER_EFFECTS,
  EFFECT_LABELS,
} from './constants';

// Utils
export {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  applyHueRotate,
  darkenColor,
  lightenColor,
  rgba,
} from './utils/colorUtils';

export {
  noise2D,
  noise3D,
  noise2DString,
  interpolate,
  clamp,
  random,
  Easing,
  degToRad,
  radToDeg,
  setNoiseSeed,
} from './utils/mathUtils';

export {
  measureTextWidth,
  measureTextHeight,
  measureCharWidths,
  calculateCharPositions,
  wrapText,
  calculateTextBounds,
} from './utils/textMeasure';

// Effects
export { calculateEffects, isLetterEffect } from './effects';

// Core
export { CanvasTextRenderer } from './core/CanvasTextRenderer';
export { FrameRenderer } from './core/FrameRenderer';
export { VideoCompositor } from './core/VideoCompositor';
