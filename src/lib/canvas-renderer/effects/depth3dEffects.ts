/**
 * 3D 깊이 효과 (Depth 3D Effects)
 * rotate3d, zoomIn, flipUp, spiral3d, wave3d, tumble
 */

import type { EffectContext, EffectResult } from '../types';
import { interpolate } from '../utils/mathUtils';

/**
 * Rotate3D 효과 - 3D 회전 (X/Y축)
 */
export function applyRotate3d(
  ctx: EffectContext,
  result: EffectResult,
  repeatPhase: number,
  fadeoutFactor: number
): void {
  const { seed } = ctx;

  const rotateX = Math.sin(repeatPhase + seed) * 20 * fadeoutFactor;
  const rotateY = Math.cos(repeatPhase + seed) * 30 * fadeoutFactor;

  result.rotateX += rotateX;
  result.rotateY += rotateY;
}

/**
 * ZoomIn 효과 - 멀리서 다가오는 효과 (translateZ)
 */
export function applyZoomIn(
  ctx: EffectContext,
  result: EffectResult
): void {
  const { localFrame, fps, width } = ctx;
  const baseUnit = width / 1080;

  // 2.5초 동안 진행
  const progress = interpolate(
    localFrame,
    [0, fps * 2.5],
    [1, 0],
    { extrapolateRight: 'clamp' }
  );

  const zoomInZ = progress * -800 * baseUnit;
  const zoomInScale = 1 - progress * 0.5;

  result.translateZ += zoomInZ;
  result.scale *= zoomInScale;
}

/**
 * FlipUp 효과 - 밑에서 휘어서 올라오는 효과
 */
export function applyFlipUp(
  ctx: EffectContext,
  result: EffectResult
): void {
  const { localFrame, fps, width } = ctx;
  const baseUnit = width / 1080;

  // 2초 동안 진행
  const progress = interpolate(
    localFrame,
    [0, fps * 2],
    [1, 0],
    { extrapolateRight: 'clamp' }
  );

  const flipUpRotateX = progress * 120; // 120도 회전
  const flipUpY = progress * 400 * baseUnit;
  const flipUpZ = progress * -600 * baseUnit;

  result.rotateX += flipUpRotateX;
  result.translateY += flipUpY;
  result.translateZ += flipUpZ;
}

/**
 * Spiral3D 효과 - 나선형 3D 회전
 */
export function applySpiral3d(
  ctx: EffectContext,
  result: EffectResult,
  repeatPhase: number,
  fadeoutFactor: number
): void {
  const { width } = ctx;
  const baseUnit = width / 1080;

  const spiral3dRotateX = Math.sin(repeatPhase) * 30 * fadeoutFactor;
  const spiral3dRotateY = Math.cos(repeatPhase) * 40 * fadeoutFactor;
  const spiral3dZ = Math.sin(repeatPhase * 2) * 150 * baseUnit * fadeoutFactor;

  result.rotateX += spiral3dRotateX;
  result.rotateY += spiral3dRotateY;
  result.translateZ += spiral3dZ;
}

/**
 * Wave3D 효과 - 3D 파도 움직임
 */
export function applyWave3d(
  ctx: EffectContext,
  result: EffectResult,
  repeatPhase: number,
  fadeoutFactor: number
): void {
  const { width } = ctx;
  const baseUnit = width / 1080;

  const wave3dRotateX = Math.sin(repeatPhase) * 25 * fadeoutFactor;
  const wave3dZ = Math.sin(repeatPhase + Math.PI / 2) * 200 * baseUnit * fadeoutFactor;
  const wave3dY = Math.cos(repeatPhase) * 30 * baseUnit * fadeoutFactor;

  result.rotateX += wave3dRotateX;
  result.translateZ += wave3dZ;
  result.translateY += wave3dY;
}

/**
 * Tumble 효과 - 공중제비/텀블링
 */
export function applyTumble(
  ctx: EffectContext,
  result: EffectResult,
  repeatProgress: number,
  repeatPhase: number,
  fadeoutFactor: number
): void {
  const { width } = ctx;
  const baseUnit = width / 1080;

  // 4초 동안 회전 완료 후 정지
  // 720도=0도, 360도=0도 (완전 회전 = 제자리)
  const tumbleRotateX = repeatProgress * 720;
  const tumbleRotateY = repeatProgress * 360;
  const tumbleZ = Math.sin(repeatPhase) * 100 * baseUnit * fadeoutFactor;

  result.rotateX += tumbleRotateX;
  result.rotateY += tumbleRotateY;
  result.translateZ += tumbleZ;
}

/**
 * 3D 깊이 그림자 계산 (자동)
 * Z축 깊이에 따라 그림자 자동 생성
 */
export function calculateDepthShadow(result: EffectResult): string {
  const totalZDepth = Math.abs(result.translateZ);
  const intensity = totalZDepth / 300;

  if (intensity > 0.1) {
    const blur = intensity * 80;
    const offsetY = intensity * 30;
    const alpha = 0.3 + intensity * 0.4;
    return `0 ${offsetY}px ${blur}px rgba(0,0,0,${alpha})`;
  }

  return '';
}
