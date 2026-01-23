/**
 * 움직임 효과 (Movement Effects)
 * drift, wave, bounce, spin, spiral, swing, slide, orbit, zoom, float, shake
 */

import type { EffectContext, EffectResult } from '../types';
import { noise2D } from '../utils/mathUtils';

/**
 * Drift 효과 - noise 기반 유기적 움직임
 */
export function applyDrift(
  ctx: EffectContext,
  result: EffectResult,
  fadeoutFactor: number
): void {
  const { frame, seed, width } = ctx;
  const baseUnit = width / 1080;

  const driftNoiseX = noise2D(frame * 0.03, seed, Math.floor(seed * 1000));
  const driftNoiseY = noise2D(frame * 0.025, seed + 50, Math.floor(seed * 1000));

  result.translateX += driftNoiseX * 90 * baseUnit * fadeoutFactor;
  result.translateY += driftNoiseY * 55 * baseUnit * fadeoutFactor;
}

/**
 * Wave 효과 - 물결 움직임
 */
export function applyWave(
  ctx: EffectContext,
  result: EffectResult,
  repeatPhase: number,
  fadeoutFactor: number
): void {
  const { seed, width } = ctx;
  const baseUnit = width / 1080;

  const waveY = Math.sin(repeatPhase + seed) * 30 * baseUnit * fadeoutFactor;
  const waveRotate = Math.sin(repeatPhase + seed) * 5 * fadeoutFactor;

  result.translateY += waveY;
  result.rotateZ += waveRotate;
}

/**
 * Bounce 효과 - 위아래 바운스
 */
export function applyBounce(
  ctx: EffectContext,
  result: EffectResult,
  repeatPhase: number,
  fadeoutFactor: number
): void {
  const { seed, width } = ctx;
  const baseUnit = width / 1080;

  const bounceY = Math.abs(Math.sin(repeatPhase + seed)) * 50 * baseUnit * fadeoutFactor;
  result.translateY += bounceY;
}

/**
 * Spin 효과 - 2D 평면 회전
 */
export function applySpin(
  ctx: EffectContext,
  result: EffectResult,
  repeatProgress: number
): void {
  // 4초 동안 720도(=0도) 완료 후 정지
  // progressive 회전은 fadeout하면 역회전되므로 fadeout 미적용
  const spinRotation = repeatProgress * 720;
  result.rotateZ += spinRotation;
}

/**
 * Spiral 효과 - 나선형 움직임
 */
export function applySpiral(
  ctx: EffectContext,
  result: EffectResult,
  repeatPhase: number,
  fadeoutFactor: number
): void {
  const { seed, width } = ctx;
  const baseUnit = width / 1080;

  const radius = (30 + Math.sin(repeatPhase + seed) * 20) * baseUnit * fadeoutFactor;
  const spiralX = Math.cos(repeatPhase + seed) * radius;
  const spiralY = Math.sin(repeatPhase + seed) * radius;

  result.translateX += spiralX;
  result.translateY += spiralY;
}

/**
 * Swing 효과 - 좌우 스윙
 */
export function applySwing(
  ctx: EffectContext,
  result: EffectResult,
  repeatPhase: number,
  fadeoutFactor: number
): void {
  const { seed, width } = ctx;
  const baseUnit = width / 1080;

  const swingX = Math.sin(repeatPhase + seed) * 60 * baseUnit * fadeoutFactor;
  const swingRotate = Math.sin(repeatPhase + seed) * 15 * fadeoutFactor;

  result.translateX += swingX;
  result.rotateZ += swingRotate;
}

/**
 * Slide 효과 - 좌우 슬라이드
 */
export function applySlide(
  ctx: EffectContext,
  result: EffectResult,
  repeatPhase: number,
  fadeoutFactor: number
): void {
  const { seed, width } = ctx;
  const baseUnit = width / 1080;

  const slideX = Math.sin(repeatPhase + seed) * 80 * baseUnit * fadeoutFactor;
  result.translateX += slideX;
}

/**
 * Orbit 효과 - 원형 궤도 움직임
 */
export function applyOrbit(
  ctx: EffectContext,
  result: EffectResult,
  repeatPhase: number,
  fadeoutFactor: number
): void {
  const { seed, width } = ctx;
  const baseUnit = width / 1080;

  const orbitRadius = 35 * baseUnit * fadeoutFactor;
  const orbitX = Math.cos(repeatPhase + seed) * orbitRadius;
  const orbitY = Math.sin(repeatPhase + seed) * orbitRadius;

  result.translateX += orbitX;
  result.translateY += orbitY;
}

/**
 * Zoom 효과 - 확대/축소
 */
export function applyZoom(
  ctx: EffectContext,
  result: EffectResult,
  repeatPhase: number,
  fadeoutFactor: number
): void {
  const { seed } = ctx;

  const zoomScale = 1 + Math.sin(repeatPhase + seed) * 0.25 * fadeoutFactor;
  result.scale *= zoomScale;
}

/**
 * Float 효과 - 부유 (부드럽게 위아래로 떠다님)
 */
export function applyFloat(
  ctx: EffectContext,
  result: EffectResult,
  repeatPhase: number,
  fadeoutFactor: number
): void {
  const { width } = ctx;
  const baseUnit = width / 1080;

  const floatY = Math.sin(repeatPhase * 0.5) * 25 * baseUnit * fadeoutFactor;
  result.translateY += floatY;
}

/**
 * Shake 효과 - 흔들림
 */
export function applyShake(
  ctx: EffectContext,
  result: EffectResult,
  fadeoutFactor: number
): void {
  const { frame, seed, width } = ctx;
  const baseUnit = width / 1080;

  const shakeX = noise2D(frame * 0.5, seed, Math.floor(seed * 1000)) * 8 * baseUnit * fadeoutFactor;
  const shakeY = noise2D(frame * 0.5, seed + 10, Math.floor(seed * 1000)) * 8 * baseUnit * fadeoutFactor;

  result.translateX += shakeX;
  result.translateY += shakeY;
}
