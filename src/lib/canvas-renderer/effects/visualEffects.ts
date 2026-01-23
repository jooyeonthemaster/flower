/**
 * 시각 효과 (Visual Effects)
 * glow, pulse, glitch, strobe, hologram, blur, chromatic, pixelate, rainbow, neon, extrude
 */

import type { EffectContext, EffectResult, ExtraLayer } from '../types';
import { noise2D, noise3D, random } from '../utils/mathUtils';
import { hexToRgb, rgba } from '../utils/colorUtils';
import {
  GLOW_RADII,
  EXTRUDE_DEPTH,
  EXTRUDE_ANGLE_X,
  EXTRUDE_ANGLE_Y,
  EXTRUDE_DARKEN_FACTOR,
  CHROMATIC_MAX_OFFSET,
  GLITCH_THRESHOLD,
  GLITCH_OFFSET_MULTIPLIER,
  STROBE_PROBABILITY,
  STROBE_DIM_OPACITY,
  NEON_FLICKER_THRESHOLD,
  NEON_DIM_OPACITY,
} from '../constants/effects';
import {
  EFFECT_DURATION_SECONDS,
  FADEOUT_START_SECONDS,
} from '../constants/defaults';

/**
 * Glow 효과 - 글로우
 */
export function applyGlow(
  ctx: EffectContext,
  result: EffectResult,
  fadeoutFactor: number
): void {
  const { glowColor } = ctx;

  // 여러 반경의 그림자로 글로우 생성
  const shadows = GLOW_RADII.map(r => `0 0 ${r}px ${glowColor}`).join(', ');
  result.textShadow = appendShadow(result.textShadow, shadows);
}

/**
 * Pulse 효과 - 펄스 (박동)
 */
export function applyPulse(
  ctx: EffectContext,
  result: EffectResult,
  repeatPhase: number,
  fadeoutFactor: number
): void {
  const { glowColor } = ctx;

  const intensity = (Math.sin(repeatPhase) * 0.3 * fadeoutFactor) + 0.9 + (0.1 * (1 - fadeoutFactor));

  const pulseShadow = [
    `0 0 ${10 * intensity}px ${glowColor}`,
    `0 0 ${20 * intensity}px ${glowColor}`,
    `0 0 ${40 * intensity}px ${glowColor}`,
  ].join(', ');

  result.textShadow = appendShadow(result.textShadow, pulseShadow);
}

/**
 * Glitch 효과 - 글리치
 */
export function applyGlitch(
  ctx: EffectContext,
  result: EffectResult,
  fadeoutFactor: number
): void {
  const { frame, seed, width } = ctx;
  const baseUnit = width / 1080;

  const glitchNoise = noise2D(frame * 0.15, seed, Math.floor(seed * 1000));
  const isGlitching = glitchNoise > GLITCH_THRESHOLD;

  if (isGlitching) {
    const offset = noise2D(frame * 0.3, seed + 100, Math.floor(seed * 1000)) *
      GLITCH_OFFSET_MULTIPLIER * baseUnit;

    result.translateX += offset;
    result.blur = 4;
    result.hueRotate = 90;

    // RGB 분리 레이어
    result.extraLayers = result.extraLayers || [];
    result.extraLayers.push(
      {
        color: '#ff0055',
        offsetX: -12 * baseUnit,
        offsetY: -8 * baseUnit,
        opacity: 0.8,
        blendMode: 'screen',
      },
      {
        color: '#00ccff',
        offsetX: 12 * baseUnit,
        offsetY: 8 * baseUnit,
        opacity: 0.8,
        blendMode: 'screen',
      }
    );
  }
}

/**
 * Strobe 효과 - 스트로브 (깜빡임)
 */
export function applyStrobe(
  ctx: EffectContext,
  result: EffectResult
): void {
  const { frame, seed } = ctx;

  const strobeValue = random(frame + seed * 2);
  if (strobeValue > STROBE_PROBABILITY) {
    result.opacity *= STROBE_DIM_OPACITY;
  }
}

/**
 * Hologram 효과 - 홀로그램 스캔라인
 */
export function applyHologram(
  ctx: EffectContext,
  result: EffectResult,
  repeatProgress: number,
  fadeoutFactor: number
): void {
  const { frame, seed, width } = ctx;
  const baseUnit = width / 1080;

  const hologramNoise = noise3D(frame * 0.08, seed * 0.1, repeatProgress);
  const hologramOffset = hologramNoise * 12 * baseUnit * fadeoutFactor;

  const flickerNoise = noise2D(frame * 0.12, seed, Math.floor(seed * 1000));
  const hologramOpacity = 1 - (0.4 - flickerNoise * 0.35) * fadeoutFactor;

  result.translateX += hologramOffset;
  result.opacity *= hologramOpacity;
}

/**
 * Blur 효과 - 블러
 */
export function applyBlur(
  ctx: EffectContext,
  result: EffectResult,
  repeatPhase: number,
  fadeoutFactor: number
): void {
  const { seed } = ctx;

  const blurAmount = Math.abs(Math.sin(repeatPhase + seed)) * 5 * fadeoutFactor;
  result.blur = Math.max(result.blur, blurAmount);
}

/**
 * Chromatic 효과 - 색수차
 */
export function applyChromatic(
  ctx: EffectContext,
  result: EffectResult,
  repeatPhase: number,
  fadeoutFactor: number
): void {
  const { seed, width } = ctx;
  const baseUnit = width / 1080;

  const offset = Math.sin(repeatPhase + seed) * CHROMATIC_MAX_OFFSET * baseUnit * fadeoutFactor;

  result.extraLayers = result.extraLayers || [];
  result.extraLayers.push(
    {
      color: '#ff0000',
      offsetX: -offset,
      offsetY: 0,
      opacity: 0.6,
      blendMode: 'screen',
    },
    {
      color: '#00ff00',
      offsetX: 0,
      offsetY: 0,
      opacity: 0.6,
      blendMode: 'screen',
    },
    {
      color: '#0000ff',
      offsetX: offset,
      offsetY: 0,
      opacity: 0.6,
      blendMode: 'screen',
    }
  );
}

/**
 * Pixelate 효과 - 픽셀화
 */
export function applyPixelate(
  ctx: EffectContext,
  result: EffectResult,
  repeatPhase: number,
  fadeoutFactor: number
): void {
  const pixelateScale = 1 + Math.sin(repeatPhase) * 0.5 * fadeoutFactor;
  result.scale *= pixelateScale;
}

/**
 * Rainbow 효과 - 무지개 색상 변화
 */
export function applyRainbow(
  ctx: EffectContext,
  result: EffectResult,
  repeatProgress: number,
  fadeoutFactor: number
): void {
  const rainbowHue = ((repeatProgress * 720) % 360) * fadeoutFactor;
  result.hueRotate = rainbowHue;
}

/**
 * Neon 효과 - 네온 깜빡임
 */
export function applyNeon(
  ctx: EffectContext,
  result: EffectResult,
  fadeoutFactor: number
): void {
  const { frame, seed, glowColor } = ctx;

  const neonNoise = noise2D(frame * 0.2, seed, Math.floor(seed * 1000));
  const neonFlicker = neonNoise > NEON_FLICKER_THRESHOLD ? 1 : NEON_DIM_OPACITY;

  result.opacity *= neonFlicker;

  const neonGlow = [
    `0 0 10px ${glowColor}`,
    `0 0 20px ${glowColor}`,
    `0 0 40px ${glowColor}`,
    `0 0 80px ${glowColor}`,
  ].join(', ');

  result.textShadow = appendShadow(result.textShadow, neonGlow);
}

/**
 * Extrude 효과 - 3D 입체
 */
export function applyExtrude(
  ctx: EffectContext,
  result: EffectResult
): void {
  const { glowColor } = ctx;
  const rgb = hexToRgb(glowColor);

  const angleRadX = (EXTRUDE_ANGLE_X * Math.PI) / 180;
  const angleRadY = (EXTRUDE_ANGLE_Y * Math.PI) / 180;

  const layers: string[] = [];

  for (let i = 1; i <= EXTRUDE_DEPTH; i++) {
    const offsetX = Math.cos(angleRadX) * i * 0.7;
    const offsetY = Math.sin(angleRadY) * i * 0.7;

    const progress = i / EXTRUDE_DEPTH;
    const darkenFactor = 1 - progress * EXTRUDE_DARKEN_FACTOR;

    const r = Math.floor(rgb.r * darkenFactor);
    const g = Math.floor(rgb.g * darkenFactor);
    const b = Math.floor(rgb.b * darkenFactor);

    const blur = i > EXTRUDE_DEPTH * 0.7 ? 1 : 0;
    layers.push(`${offsetX}px ${offsetY}px ${blur}px rgb(${r}, ${g}, ${b})`);
  }

  result.textShadow = appendShadow(result.textShadow, layers.join(', '));
}

/**
 * 그림자 문자열 합치기 헬퍼
 */
function appendShadow(existing: string, newShadow: string): string {
  if (!existing || existing === 'none') {
    return newShadow;
  }
  return `${existing}, ${newShadow}`;
}
