/**
 * 이펙트 계산 유틸리티
 */

import { interpolate, Easing, random } from 'remotion';
import { noise2D, noise3D } from '@remotion/noise';
import { EffectFlags, EffectValues } from '../types';

interface EffectCalculatorParams {
  effects: string[];
  frame: number;
  localFrame: number;
  seed: number;
  fps: number;
  baseUnit: number;
  text: string;
  glowColor: string;
}

/**
 * 이펙트 플래그 생성
 */
export function createEffectFlags(effects: string[]): EffectFlags {
  return {
    hasDrift: effects.includes('drift'),
    hasRotate3d: effects.includes('rotate3d'),
    hasGlitch: effects.includes('glitch'),
    hasStrobe: effects.includes('strobe'),
    hasGlow: effects.includes('glow'),
    hasPulse: effects.includes('pulse'),
    hasWave: effects.includes('wave'),
    hasZoom: effects.includes('zoom'),
    hasBlur: effects.includes('blur'),
    hasChromatic: effects.includes('chromatic'),
    hasHologram: effects.includes('hologram'),
    hasPixelate: effects.includes('pixelate'),
    hasRainbow: effects.includes('rainbow'),
    hasBounce: effects.includes('bounce'),
    hasSpin: effects.includes('spin'),
    hasSpiral: effects.includes('spiral'),
    hasSwing: effects.includes('swing'),
    hasSlide: effects.includes('slide'),
    hasOrbit: effects.includes('orbit'),
    hasZoomIn: effects.includes('zoomIn'),
    hasFlipUp: effects.includes('flipUp'),
    hasSpiral3d: effects.includes('spiral3d'),
    hasWave3d: effects.includes('wave3d'),
    hasTumble: effects.includes('tumble'),
    hasExtrude: effects.includes('extrude'),
    hasTypewriter: effects.includes('typewriter'),
    hasShake: effects.includes('shake'),
    hasNeon: effects.includes('neon'),
    hasFloat: effects.includes('float'),
    hasElastic: effects.includes('elastic'),
  };
}

/**
 * 3D Extrude 그림자 계산
 */
function calculateExtrudeShadow(glowColor: string): string {
  const layers = [];
  const depth = 30;
  const angleRadX = (135 * Math.PI) / 180;
  const angleRadY = (135 * Math.PI) / 180;

  const baseR = parseInt(glowColor.slice(1, 3), 16);
  const baseG = parseInt(glowColor.slice(3, 5), 16);
  const baseB = parseInt(glowColor.slice(5, 7), 16);

  for (let i = 1; i <= depth; i++) {
    const offsetX = Math.cos(angleRadX) * i * 0.7;
    const offsetY = Math.sin(angleRadY) * i * 0.7;
    const progress = i / depth;
    const darkenFactor = 1 - progress * 0.85;

    const r = Math.floor(baseR * darkenFactor);
    const g = Math.floor(baseG * darkenFactor);
    const b = Math.floor(baseB * darkenFactor);
    const blur = i > depth * 0.7 ? 1 : 0;

    const shadowColor = `rgb(${r}, ${g}, ${b})`;
    layers.push(`${offsetX}px ${offsetY}px ${blur}px ${shadowColor}`);
  }

  return layers.join(', ');
}

/**
 * 모든 이펙트 값 계산
 */
export function calculateEffectValues(params: EffectCalculatorParams): EffectValues {
  const { effects, frame, localFrame, seed, fps, baseUnit, text, glowColor } = params;
  const flags = createEffectFlags(effects);

  // 반복 움직임 공통 타이밍
  const effectDuration = fps * 4;
  const repeatProgress = Math.min(localFrame / effectDuration, 1);
  const repeatPhase = repeatProgress * Math.PI * 4;

  // Fadeout 계산
  const fadeoutStart = fps * 3.5;
  const fadeoutFactor = interpolate(
    localFrame,
    [fadeoutStart, effectDuration],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Drift
  const driftNoiseX = flags.hasDrift ? noise2D('drift-x', frame * 0.03, seed) : 0;
  const driftNoiseY = flags.hasDrift ? noise2D('drift-y', frame * 0.025, seed + 50) : 0;
  const driftX = flags.hasDrift ? driftNoiseX * 90 * baseUnit * fadeoutFactor : 0;
  const driftY = flags.hasDrift ? driftNoiseY * 55 * baseUnit * fadeoutFactor : 0;

  // 3D Rotation
  const rotateX = flags.hasRotate3d ? Math.sin(repeatPhase + seed) * 20 * fadeoutFactor : 0;
  const rotateY = flags.hasRotate3d ? Math.cos(repeatPhase + seed) * 30 * fadeoutFactor : 0;

  // Glitch
  const glitchNoise = flags.hasGlitch ? noise2D('glitch', frame * 0.15, seed) : 0;
  const isGlitching = flags.hasGlitch ? glitchNoise > 0.6 : false;
  const glitchOffset = isGlitching ? noise2D('glitch-offset', frame * 0.3, seed + 100) * 30 * baseUnit : 0;

  // Strobe
  const strobe = flags.hasStrobe ? (random(frame + seed * 2) > 0.85 ? 0.3 : 1) : 1;

  // Pulse
  const pulseIntensity = flags.hasPulse ? (Math.sin(repeatPhase) * 0.3 * fadeoutFactor) + 0.9 + (0.1 * (1 - fadeoutFactor)) : 1.0;
  const pulseShadow = flags.hasPulse
    ? `0 0 ${10 * pulseIntensity}px ${glowColor}, 0 0 ${20 * pulseIntensity}px ${glowColor}, 0 0 ${40 * pulseIntensity}px ${glowColor}`
    : '';

  // Glow
  const dynamicGlow = flags.hasGlow
    ? `0 0 15px ${glowColor}, 0 0 30px ${glowColor}, 0 0 60px ${glowColor}, 0 0 100px ${glowColor}, 0 0 150px ${glowColor}`
    : '';

  // Wave
  const waveY = flags.hasWave ? Math.sin(repeatPhase + seed) * 30 * baseUnit * fadeoutFactor : 0;
  const waveRotate = flags.hasWave ? Math.sin(repeatPhase + seed) * 5 * fadeoutFactor : 0;

  // Zoom
  const zoomScale = flags.hasZoom ? 1 + Math.sin(repeatPhase + seed) * 0.25 * fadeoutFactor : 1;

  // Blur
  const blurAmount = flags.hasBlur ? Math.abs(Math.sin(repeatPhase + seed)) * 5 * fadeoutFactor : 0;

  // Chromatic
  const chromaticOffset = flags.hasChromatic ? Math.sin(repeatPhase + seed) * 10 * baseUnit * fadeoutFactor : 0;

  // Hologram
  const hologramNoise = flags.hasHologram ? noise3D('hologram', frame * 0.08, seed * 0.1, repeatProgress) : 0;
  const hologramOffset = flags.hasHologram ? hologramNoise * 12 * baseUnit * fadeoutFactor : 0;
  const hologramFlicker = flags.hasHologram ? noise2D('holo-flicker', frame * 0.12, seed) : 0;
  const hologramOpacity = flags.hasHologram ? 1 - (0.4 - hologramFlicker * 0.35) * fadeoutFactor : 1;

  // Pixelate
  const pixelateScale = flags.hasPixelate ? 1 + Math.sin(repeatPhase) * 0.5 * fadeoutFactor : 1;

  // Rainbow
  const rainbowHue = flags.hasRainbow ? ((repeatProgress * 720) % 360) * fadeoutFactor : 0;

  // Extrude
  const extrudeShadow = flags.hasExtrude ? calculateExtrudeShadow(glowColor) : '';

  // Bounce
  const bounceY = flags.hasBounce ? Math.abs(Math.sin(repeatPhase + seed)) * 50 * baseUnit * fadeoutFactor : 0;

  // Spin
  const spinRotation = flags.hasSpin ? repeatProgress * 720 : 0;

  // Spiral
  const spiralRadius = flags.hasSpiral ? (30 + Math.sin(repeatPhase + seed) * 20) * baseUnit * fadeoutFactor : 0;
  const spiralX = flags.hasSpiral ? Math.cos(repeatPhase + seed) * spiralRadius : 0;
  const spiralY = flags.hasSpiral ? Math.sin(repeatPhase + seed) * spiralRadius : 0;

  // Swing
  const swingX = flags.hasSwing ? Math.sin(repeatPhase + seed) * 60 * baseUnit * fadeoutFactor : 0;
  const swingRotate = flags.hasSwing ? Math.sin(repeatPhase + seed) * 15 * fadeoutFactor : 0;

  // Slide
  const slideX = flags.hasSlide ? Math.sin(repeatPhase + seed) * 80 * baseUnit * fadeoutFactor : 0;

  // Orbit
  const orbitRadius = 35 * baseUnit * fadeoutFactor;
  const orbitX = flags.hasOrbit ? Math.cos(repeatPhase + seed) * orbitRadius : 0;
  const orbitY = flags.hasOrbit ? Math.sin(repeatPhase + seed) * orbitRadius : 0;

  // Zoom In (3D)
  const zoomInProgress = flags.hasZoomIn
    ? interpolate(localFrame, [0, fps * 2.5], [1, 0], { extrapolateRight: 'clamp' })
    : 0;
  const zoomInZ = flags.hasZoomIn ? zoomInProgress * -800 * baseUnit : 0;
  const zoomInScale = flags.hasZoomIn ? 1 - zoomInProgress * 0.5 : 1;

  // Flip Up
  const flipUpProgress = flags.hasFlipUp
    ? interpolate(localFrame, [0, fps * 2], [1, 0], { extrapolateRight: 'clamp' })
    : 0;
  const flipUpRotateX = flags.hasFlipUp ? flipUpProgress * 120 : 0;
  const flipUpY = flags.hasFlipUp ? flipUpProgress * 400 * baseUnit : 0;
  const flipUpZ = flags.hasFlipUp ? flipUpProgress * -600 * baseUnit : 0;

  // Spiral 3D
  const spiral3dRotateX = flags.hasSpiral3d ? Math.sin(repeatPhase) * 30 * fadeoutFactor : 0;
  const spiral3dRotateY = flags.hasSpiral3d ? Math.cos(repeatPhase) * 40 * fadeoutFactor : 0;
  const spiral3dZ = flags.hasSpiral3d ? Math.sin(repeatPhase * 2) * 150 * baseUnit * fadeoutFactor : 0;

  // Wave 3D
  const wave3dRotateX = flags.hasWave3d ? Math.sin(repeatPhase) * 25 * fadeoutFactor : 0;
  const wave3dZ = flags.hasWave3d ? Math.sin(repeatPhase + Math.PI / 2) * 200 * baseUnit * fadeoutFactor : 0;
  const wave3dY = flags.hasWave3d ? Math.cos(repeatPhase) * 30 * baseUnit * fadeoutFactor : 0;

  // Tumble
  const tumbleRotateX = flags.hasTumble ? repeatProgress * 720 : 0;
  const tumbleRotateY = flags.hasTumble ? repeatProgress * 360 : 0;
  const tumbleZ = flags.hasTumble ? Math.sin(repeatPhase) * 100 * baseUnit * fadeoutFactor : 0;

  // Depth Shadow
  const totalZDepth = Math.abs(zoomInZ + flipUpZ + spiral3dZ + wave3dZ + tumbleZ);
  const depthShadowIntensity = totalZDepth / 300;
  const depthShadow = depthShadowIntensity > 0.1
    ? `0 ${depthShadowIntensity * 30}px ${depthShadowIntensity * 80}px rgba(0,0,0,${0.3 + depthShadowIntensity * 0.4})`
    : '';

  // Typewriter
  const typewriterChars = flags.hasTypewriter
    ? Math.floor(interpolate(localFrame, [0, fps * 2], [0, text.length], { extrapolateRight: 'clamp' }))
    : text.length;
  const displayText = flags.hasTypewriter ? text.slice(0, typewriterChars) : text;

  // Shake
  const shakeX = flags.hasShake ? noise2D('shake-x', frame * 0.5, seed) * 8 * baseUnit * fadeoutFactor : 0;
  const shakeY = flags.hasShake ? noise2D('shake-y', frame * 0.5, seed + 10) * 8 * baseUnit * fadeoutFactor : 0;

  // Neon
  const neonNoise = flags.hasNeon ? noise2D('neon', frame * 0.2, seed) : 0;
  const neonFlicker = flags.hasNeon ? (neonNoise > 0.3 ? 1 : 0.4) : 1;
  const neonGlow = flags.hasNeon
    ? `0 0 10px ${glowColor}, 0 0 20px ${glowColor}, 0 0 40px ${glowColor}, 0 0 80px ${glowColor}`
    : '';

  // Float
  const floatY = flags.hasFloat ? Math.sin(repeatPhase * 0.5) * 25 * baseUnit * fadeoutFactor : 0;

  // Elastic
  const elasticScale = flags.hasElastic
    ? interpolate(localFrame, [0, fps * 1.2], [0.3, 1], { extrapolateRight: 'clamp', easing: Easing.elastic(1.5) })
    : 1;

  return {
    driftX,
    driftY,
    rotateX,
    rotateY,
    glitchOffset,
    isGlitching,
    strobe,
    pulseIntensity,
    pulseShadow,
    dynamicGlow,
    waveY,
    waveRotate,
    zoomScale,
    blurAmount,
    chromaticOffset,
    hologramOffset,
    hologramOpacity,
    pixelateScale,
    rainbowHue,
    extrudeShadow,
    bounceY,
    spinRotation,
    spiralX,
    spiralY,
    swingX,
    swingRotate,
    slideX,
    orbitX,
    orbitY,
    zoomInZ,
    zoomInScale,
    flipUpRotateX,
    flipUpY,
    flipUpZ,
    spiral3dRotateX,
    spiral3dRotateY,
    spiral3dZ,
    wave3dRotateX,
    wave3dZ,
    wave3dY,
    tumbleRotateX,
    tumbleRotateY,
    tumbleZ,
    depthShadow,
    displayText,
    shakeX,
    shakeY,
    neonFlicker,
    neonGlow,
    floatY,
    elasticScale,
  };
}

/**
 * 텍스트 위치 계산
 */
export function calculateTextPosition(
  textPosition: 'random' | 'top' | 'center' | 'bottom',
  seed: number
): { topPos: string; leftPos: string } {
  const leftPos = '50%';
  let topPos = '68%';

  if (textPosition === 'random') {
    const randVal = seed % 1;
    if (randVal < 0.33) {
      topPos = '30%';
    } else if (randVal < 0.66) {
      topPos = '50%';
    } else {
      topPos = '68%';
    }
  } else if (textPosition === 'top') {
    topPos = '30%';
  } else if (textPosition === 'center') {
    topPos = '50%';
  } else if (textPosition === 'bottom') {
    topPos = '68%';
  }

  return { topPos, leftPos };
}

/**
 * Y/X 오프셋 클램프 계산
 */
export function calculateClampedOffsets(
  effectValues: EffectValues,
  topPos: string,
  baseUnit: number
): { clampedXOffset: number; clampedYOffset: number } {
  const rawYOffset = effectValues.driftY + effectValues.waveY + effectValues.bounceY +
    effectValues.spiralY + effectValues.orbitY + effectValues.flipUpY +
    effectValues.wave3dY + effectValues.floatY + effectValues.shakeY;

  const rawXOffset = effectValues.driftX + effectValues.spiralX + effectValues.swingX +
    effectValues.slideX + effectValues.orbitX + effectValues.shakeX;

  let maxYUp = -250 * baseUnit;
  let maxYDown = 250 * baseUnit;

  if (topPos === '30%') {
    maxYUp = -120 * baseUnit;
    maxYDown = 200 * baseUnit;
  } else if (topPos === '68%') {
    maxYUp = -200 * baseUnit;
    maxYDown = 120 * baseUnit;
  }

  const clampedYOffset = Math.max(maxYUp, Math.min(maxYDown, rawYOffset));
  const clampedXOffset = Math.max(-150 * baseUnit, Math.min(150 * baseUnit, rawXOffset));

  return { clampedXOffset, clampedYOffset };
}
