/**
 * 이펙트 모듈 통합
 * 모든 이펙트를 계산하여 EffectResult 반환
 */

import type { EffectType, EffectContext, EffectResult } from '../types';
import { interpolate } from '../utils/mathUtils';
import {
  EFFECT_DURATION_SECONDS,
  FADEOUT_START_SECONDS,
} from '../constants/defaults';

// 시각 효과
import {
  applyGlow,
  applyPulse,
  applyGlitch,
  applyStrobe,
  applyHologram,
  applyBlur,
  applyChromatic,
  applyPixelate,
  applyRainbow,
  applyNeon,
  applyExtrude,
} from './visualEffects';

// 움직임 효과
import {
  applyDrift,
  applyWave,
  applyBounce,
  applySpin,
  applySpiral,
  applySwing,
  applySlide,
  applyOrbit,
  applyZoom,
  applyFloat,
  applyShake,
} from './movementEffects';

// 3D 깊이 효과
import {
  applyRotate3d,
  applyZoomIn,
  applyFlipUp,
  applySpiral3d,
  applyWave3d,
  applyTumble,
  calculateDepthShadow,
} from './depth3dEffects';

// 진입 효과
import {
  applyTypewriter,
  applyElastic,
} from './entranceEffects';

// 글자별 효과
import {
  isLetterEffect,
  applyLetterDrop,
  applyLetterWave,
  applyLetterBounce,
  applyLetterSpin,
  applyLetterScatter,
  applyLetterJump,
  applyLetterZoom,
  applyLetterFlip,
  applyLetterSlide,
  applyLetterPop,
  applyLetterRain,
} from './letterEffects';

/**
 * 기본 EffectResult 생성
 */
function createDefaultResult(): EffectResult {
  return {
    translateX: 0,
    translateY: 0,
    translateZ: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1,
    opacity: 1,
    blur: 0,
    hueRotate: 0,
    textShadow: 'none',
    extraLayers: [],
    displayText: undefined,
  };
}

/**
 * 모든 이펙트 계산
 */
export function calculateEffects(
  effects: EffectType[],
  ctx: EffectContext
): EffectResult {
  const result = createDefaultResult();
  const { fps, localFrame } = ctx;

  // 이펙트 타이밍 계산
  const effectDuration = EFFECT_DURATION_SECONDS * fps;
  const repeatProgress = Math.min(localFrame / effectDuration, 1);
  const repeatPhase = repeatProgress * Math.PI * 4; // 2주기

  // Fadeout 계산 (3.5초부터 시작)
  const fadeoutStart = FADEOUT_START_SECONDS * fps;
  const fadeoutFactor = interpolate(
    localFrame,
    [fadeoutStart, effectDuration],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 각 이펙트 적용
  for (const effect of effects) {
    switch (effect) {
      // 시각 효과
      case 'glow':
        applyGlow(ctx, result, fadeoutFactor);
        break;
      case 'pulse':
        applyPulse(ctx, result, repeatPhase, fadeoutFactor);
        break;
      case 'glitch':
        applyGlitch(ctx, result, fadeoutFactor);
        break;
      case 'strobe':
        applyStrobe(ctx, result);
        break;
      case 'hologram':
        applyHologram(ctx, result, repeatProgress, fadeoutFactor);
        break;
      case 'blur':
        applyBlur(ctx, result, repeatPhase, fadeoutFactor);
        break;
      case 'chromatic':
        applyChromatic(ctx, result, repeatPhase, fadeoutFactor);
        break;
      case 'pixelate':
        applyPixelate(ctx, result, repeatPhase, fadeoutFactor);
        break;
      case 'rainbow':
        applyRainbow(ctx, result, repeatProgress, fadeoutFactor);
        break;
      case 'neon':
        applyNeon(ctx, result, fadeoutFactor);
        break;
      case 'extrude':
        applyExtrude(ctx, result);
        break;

      // 움직임 효과
      case 'drift':
        applyDrift(ctx, result, fadeoutFactor);
        break;
      case 'wave':
        applyWave(ctx, result, repeatPhase, fadeoutFactor);
        break;
      case 'bounce':
        applyBounce(ctx, result, repeatPhase, fadeoutFactor);
        break;
      case 'spin':
        applySpin(ctx, result, repeatProgress);
        break;
      case 'spiral':
        applySpiral(ctx, result, repeatPhase, fadeoutFactor);
        break;
      case 'swing':
        applySwing(ctx, result, repeatPhase, fadeoutFactor);
        break;
      case 'slide':
        applySlide(ctx, result, repeatPhase, fadeoutFactor);
        break;
      case 'orbit':
        applyOrbit(ctx, result, repeatPhase, fadeoutFactor);
        break;
      case 'zoom':
        applyZoom(ctx, result, repeatPhase, fadeoutFactor);
        break;
      case 'float':
        applyFloat(ctx, result, repeatPhase, fadeoutFactor);
        break;
      case 'shake':
        applyShake(ctx, result, fadeoutFactor);
        break;

      // 3D 깊이 효과
      case 'rotate3d':
        applyRotate3d(ctx, result, repeatPhase, fadeoutFactor);
        break;
      case 'zoomIn':
        applyZoomIn(ctx, result);
        break;
      case 'flipUp':
        applyFlipUp(ctx, result);
        break;
      case 'spiral3d':
        applySpiral3d(ctx, result, repeatPhase, fadeoutFactor);
        break;
      case 'wave3d':
        applyWave3d(ctx, result, repeatPhase, fadeoutFactor);
        break;
      case 'tumble':
        applyTumble(ctx, result, repeatProgress, repeatPhase, fadeoutFactor);
        break;

      // 진입 효과
      case 'typewriter':
        applyTypewriter(ctx, result);
        break;
      case 'elastic':
        applyElastic(ctx, result);
        break;

      // 글자별 효과
      case 'letterDrop':
        applyLetterDrop(ctx, result);
        break;
      case 'letterWave':
        applyLetterWave(ctx, result, repeatPhase);
        break;
      case 'letterBounce':
        applyLetterBounce(ctx, result, repeatPhase);
        break;
      case 'letterSpin':
        applyLetterSpin(ctx, result);
        break;
      case 'letterScatter':
        applyLetterScatter(ctx, result);
        break;
      case 'letterJump':
        applyLetterJump(ctx, result, repeatPhase);
        break;
      case 'letterZoom':
        applyLetterZoom(ctx, result);
        break;
      case 'letterFlip':
        applyLetterFlip(ctx, result);
        break;
      case 'letterSlide':
        applyLetterSlide(ctx, result);
        break;
      case 'letterPop':
        applyLetterPop(ctx, result);
        break;
      case 'letterRain':
        applyLetterRain(ctx, result);
        break;
    }
  }

  // 3D 깊이 그림자 추가
  const depthShadow = calculateDepthShadow(result);
  if (depthShadow) {
    if (result.textShadow === 'none') {
      result.textShadow = depthShadow;
    } else {
      result.textShadow = `${result.textShadow}, ${depthShadow}`;
    }
  }

  return result;
}

// Re-export individual effect functions for testing/custom use
export * from './visualEffects';
export * from './movementEffects';
export * from './depth3dEffects';
export * from './entranceEffects';
export * from './letterEffects';
