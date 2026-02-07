import { interpolate } from 'remotion';
import {
  POSITION_VALUES,
  MAX_Y_UP_DEFAULT,
  MAX_Y_DOWN_DEFAULT,
  MAX_Y_UP_TOP,
  MAX_Y_DOWN_TOP,
  MAX_Y_UP_BOTTOM,
  MAX_Y_DOWN_BOTTOM,
  MAX_X_OFFSET,
  FADEOUT_START_SECONDS,
  EFFECT_DURATION_SECONDS,
} from './constants';

/**
 * Calculate the base unit for resolution-based scaling
 * @param width Current video width
 * @returns Base unit multiplier (1080px reference)
 */
export function calculateBaseUnit(width: number): number {
  return width / 1080;
}

/**
 * Calculate fadeout factor for smooth effect stopping
 * @param localFrame Current local frame
 * @param fps Frames per second
 * @returns Fadeout factor (0-1)
 */
export function calculateFadeoutFactor(localFrame: number, fps: number): number {
  const fadeoutStart = fps * FADEOUT_START_SECONDS;
  const effectDuration = fps * EFFECT_DURATION_SECONDS;
  return interpolate(
    localFrame,
    [fadeoutStart, effectDuration],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
}

/**
 * Calculate repeat phase for cyclical animations
 * @param localFrame Current local frame
 * @param fps Frames per second
 * @returns Object containing repeatProgress and repeatPhase
 */
export function calculateRepeatPhase(localFrame: number, fps: number) {
  const effectDuration = fps * EFFECT_DURATION_SECONDS;
  const repeatProgress = Math.min(localFrame / effectDuration, 1);
  const repeatPhase = repeatProgress * Math.PI * 4; // 2 cycles (4π)
  return { repeatProgress, repeatPhase };
}

/**
 * Determine top position based on text position setting and seed
 * @param textPosition Position configuration
 * @param seed Random seed for 'random' mode
 * @returns CSS top position percentage
 */
export function getTopPosition(
  textPosition: 'random' | 'top' | 'center' | 'bottom',
  seed: number
): string {
  if (textPosition === 'random') {
    const randVal = seed % 1;
    if (randVal < 0.33) return POSITION_VALUES.top;
    if (randVal < 0.66) return POSITION_VALUES.center;
    return POSITION_VALUES.bottom;
  }
  return POSITION_VALUES[textPosition];
}

/**
 * Clamp Y offset based on position to prevent text from going off-screen
 * @param rawYOffset Raw calculated Y offset
 * @param topPos Top position percentage
 * @param baseUnit Base unit for scaling
 * @returns Clamped Y offset
 */
export function clampYOffset(rawYOffset: number, topPos: string, baseUnit: number): number {
  let maxYUp = MAX_Y_UP_DEFAULT * baseUnit;
  let maxYDown = MAX_Y_DOWN_DEFAULT * baseUnit;

  if (topPos === POSITION_VALUES.top) {
    maxYUp = MAX_Y_UP_TOP * baseUnit;
    maxYDown = MAX_Y_DOWN_TOP * baseUnit;
  } else if (topPos === POSITION_VALUES.bottom) {
    maxYUp = MAX_Y_UP_BOTTOM * baseUnit;
    maxYDown = MAX_Y_DOWN_BOTTOM * baseUnit;
  }

  return Math.max(maxYUp, Math.min(maxYDown, rawYOffset));
}

/**
 * Clamp X offset to prevent text from going off-screen
 * @param rawXOffset Raw calculated X offset
 * @param baseUnit Base unit for scaling
 * @returns Clamped X offset
 */
export function clampXOffset(rawXOffset: number, baseUnit: number): number {
  return Math.max(-MAX_X_OFFSET * baseUnit, Math.min(MAX_X_OFFSET * baseUnit, rawXOffset));
}

/**
 * Generate extrude shadow layers for 3D text effect
 * @param glowColor Glow color hex code
 * @returns CSS text-shadow string
 */
export function generateExtrudeShadow(glowColor: string): string {
  const layers = [];
  const depth = 10; // Optimized
  const angleX = 135;
  const angleY = 135;
  const angleRadX = (angleX * Math.PI) / 180;
  const angleRadY = (angleY * Math.PI) / 180;

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

    const blur = 0; // Optimized: no blur for better performance

    const shadowColor = `rgb(${r}, ${g}, ${b})`;
    layers.push(`${offsetX}px ${offsetY}px ${blur}px ${shadowColor}`);
  }

  return layers.join(', ');
}

/**
 * Combine text shadow effects
 * @param shadows Array of shadow strings
 * @returns Combined CSS text-shadow string
 */
export function combineTextShadows(shadows: string[]): string {
  const filtered = shadows.filter(s => s !== '');
  return filtered.length > 0 ? filtered.join(', ') : 'none';
}

/**
 * Combine filter effects
 * @param filters Array of filter objects
 * @returns Combined CSS filter string
 */
export function combineFilters(filters: Array<{ enabled: boolean; value: string }>): string {
  const activeFilters = filters.filter(f => f.enabled).map(f => f.value);
  return activeFilters.length > 0 ? activeFilters.join(' ') : 'none';
}
