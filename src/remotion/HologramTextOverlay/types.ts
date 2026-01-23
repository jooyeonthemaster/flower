/**
 * HologramTextOverlay 타입 정의
 */

export interface TextScene {
  text: string;
  startFrame: number;
  endFrame: number;
  seed: number;
}

export interface HologramTextOverlayProps {
  videoSrc: string;
  imageSrc?: string;
  referenceImageSrc?: string;
  texts: string[];
  fontFamily?: string;
  fontSize?: number;
  textColor?: string;
  glowColor?: string;
  effects?: string[];
  textPosition?: TextPositionType;
}

export type TextPositionType = 'random' | 'top' | 'center' | 'bottom';

export interface KineticTextProps {
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  glowColor: string;
  opacity: number;
  frame: number;
  localFrame: number;
  seed: number;
  effects: string[];
  textPosition: TextPositionType;
}

export interface TextSceneContentProps {
  scene: TextScene;
  fontSize: number;
  fontFamily: string;
  textColor: string;
  glowColor: string;
  effects: string[];
  textPosition: TextPositionType;
}

export interface EffectFlags {
  hasDrift: boolean;
  hasRotate3d: boolean;
  hasGlitch: boolean;
  hasStrobe: boolean;
  hasGlow: boolean;
  hasPulse: boolean;
  hasWave: boolean;
  hasZoom: boolean;
  hasBlur: boolean;
  hasChromatic: boolean;
  hasHologram: boolean;
  hasPixelate: boolean;
  hasRainbow: boolean;
  hasBounce: boolean;
  hasSpin: boolean;
  hasSpiral: boolean;
  hasSwing: boolean;
  hasSlide: boolean;
  hasOrbit: boolean;
  hasZoomIn: boolean;
  hasFlipUp: boolean;
  hasSpiral3d: boolean;
  hasWave3d: boolean;
  hasTumble: boolean;
  hasExtrude: boolean;
  hasTypewriter: boolean;
  hasShake: boolean;
  hasNeon: boolean;
  hasFloat: boolean;
  hasElastic: boolean;
}

export interface EffectValues {
  // Transform values
  driftX: number;
  driftY: number;
  rotateX: number;
  rotateY: number;
  glitchOffset: number;
  isGlitching: boolean;
  strobe: number;
  pulseIntensity: number;
  pulseShadow: string;
  dynamicGlow: string;
  waveY: number;
  waveRotate: number;
  zoomScale: number;
  blurAmount: number;
  chromaticOffset: number;
  hologramOffset: number;
  hologramOpacity: number;
  pixelateScale: number;
  rainbowHue: number;
  extrudeShadow: string;
  bounceY: number;
  spinRotation: number;
  spiralX: number;
  spiralY: number;
  swingX: number;
  swingRotate: number;
  slideX: number;
  orbitX: number;
  orbitY: number;
  zoomInZ: number;
  zoomInScale: number;
  flipUpRotateX: number;
  flipUpY: number;
  flipUpZ: number;
  spiral3dRotateX: number;
  spiral3dRotateY: number;
  spiral3dZ: number;
  wave3dRotateX: number;
  wave3dZ: number;
  wave3dY: number;
  tumbleRotateX: number;
  tumbleRotateY: number;
  tumbleZ: number;
  depthShadow: string;
  displayText: string;
  shakeX: number;
  shakeY: number;
  neonFlicker: number;
  neonGlow: string;
  floatY: number;
  elasticScale: number;
}
