/**
 * 글자별 이펙트 (Letter Effects)
 * 각 글자가 개별적으로 애니메이션되는 이펙트
 */

import type { EffectContext, EffectResult } from '../types';
import { interpolate, Easing, random } from '../utils/mathUtils';

/**
 * 글자별 이펙트인지 확인
 */
export const LETTER_EFFECTS = [
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
] as const;

export function isLetterEffect(effect: string): boolean {
  return LETTER_EFFECTS.includes(effect as typeof LETTER_EFFECTS[number]);
}

/**
 * letterDrop - 글자가 위에서 하나씩 떨어짐
 */
export function applyLetterDrop(
  ctx: EffectContext,
  result: EffectResult
): void {
  const { localFrame, fps, charIndex = 0, totalChars = 1, height } = ctx;

  const delay = charIndex * 3; // 각 글자 3프레임 딜레이
  const dropDuration = fps * 0.5; // 0.5초간 떨어짐
  const adjustedFrame = Math.max(0, localFrame - delay);

  const progress = Math.min(adjustedFrame / dropDuration, 1);
  const easedProgress = Easing.easeOutBounce(progress);

  // 위에서 떨어짐
  const startY = -height * 0.3;
  result.translateY += interpolate(easedProgress, [0, 1], [startY, 0]);
  result.opacity *= progress > 0 ? 1 : 0;
}

/**
 * letterWave - 각 글자가 시차를 두고 물결처럼 출렁
 */
export function applyLetterWave(
  ctx: EffectContext,
  result: EffectResult,
  repeatPhase: number
): void {
  const { charIndex = 0, height } = ctx;

  const phaseOffset = charIndex * 0.5;
  const waveY = Math.sin(repeatPhase + phaseOffset) * height * 0.05;

  result.translateY += waveY;
}

/**
 * letterBounce - 글자가 순서대로 통통 튀어오름
 */
export function applyLetterBounce(
  ctx: EffectContext,
  result: EffectResult,
  repeatPhase: number
): void {
  const { charIndex = 0, height } = ctx;

  const phaseOffset = charIndex * 0.8;
  const bounceY = Math.abs(Math.sin(repeatPhase + phaseOffset)) * height * 0.08;

  result.translateY -= bounceY;
}

/**
 * letterSpin - 각 글자가 회전하며 등장
 */
export function applyLetterSpin(
  ctx: EffectContext,
  result: EffectResult
): void {
  const { localFrame, fps, charIndex = 0 } = ctx;

  const delay = charIndex * 4;
  const spinDuration = fps * 0.8;
  const adjustedFrame = Math.max(0, localFrame - delay);

  const progress = Math.min(adjustedFrame / spinDuration, 1);
  const easedProgress = Easing.easeOutCubic(progress);

  // 회전하며 등장
  const rotation = interpolate(easedProgress, [0, 1], [360, 0]);
  const scale = interpolate(easedProgress, [0, 1], [0, 1]);

  result.rotateZ += rotation;
  result.scale *= scale;
  result.opacity *= progress > 0 ? 1 : 0;
}

/**
 * letterScatter - 글자들이 흩어진 곳에서 모여듦
 */
export function applyLetterScatter(
  ctx: EffectContext,
  result: EffectResult
): void {
  const { localFrame, fps, charIndex = 0, seed, width, height } = ctx;

  const gatherDuration = fps * 1.2;
  const progress = Math.min(localFrame / gatherDuration, 1);
  const easedProgress = Easing.easeOutCubic(progress);

  // 각 글자마다 다른 시작 위치 (seed + charIndex로 결정)
  const angle = random(seed + charIndex) * Math.PI * 2;
  const distance = width * 0.5;

  const startX = Math.cos(angle) * distance;
  const startY = Math.sin(angle) * distance;

  result.translateX += interpolate(easedProgress, [0, 1], [startX, 0]);
  result.translateY += interpolate(easedProgress, [0, 1], [startY, 0]);
  result.opacity *= easedProgress;
}

/**
 * letterJump - 각 글자가 순서대로 위로 점프
 */
export function applyLetterJump(
  ctx: EffectContext,
  result: EffectResult,
  repeatPhase: number
): void {
  const { charIndex = 0, height } = ctx;

  const phaseOffset = charIndex * 0.6;
  const jumpPhase = (repeatPhase + phaseOffset) % (Math.PI * 2);

  // 점프 동작 (위로 올라갔다 내려옴)
  const jumpY = jumpPhase < Math.PI
    ? Math.sin(jumpPhase) * height * 0.1
    : 0;

  result.translateY -= jumpY;
}

/**
 * letterZoom - 각 글자가 확대되며 순서대로 등장
 */
export function applyLetterZoom(
  ctx: EffectContext,
  result: EffectResult
): void {
  const { localFrame, fps, charIndex = 0 } = ctx;

  const delay = charIndex * 3;
  const zoomDuration = fps * 0.4;
  const adjustedFrame = Math.max(0, localFrame - delay);

  const progress = Math.min(adjustedFrame / zoomDuration, 1);
  const easedProgress = Easing.easeOutCubic(progress);

  const scale = interpolate(easedProgress, [0, 1], [0, 1]);

  result.scale *= scale;
  result.opacity *= progress > 0 ? 1 : 0;
}

/**
 * letterFlip - 각 글자가 카드 뒤집듯 등장
 */
export function applyLetterFlip(
  ctx: EffectContext,
  result: EffectResult
): void {
  const { localFrame, fps, charIndex = 0 } = ctx;

  const delay = charIndex * 4;
  const flipDuration = fps * 0.5;
  const adjustedFrame = Math.max(0, localFrame - delay);

  const progress = Math.min(adjustedFrame / flipDuration, 1);
  const easedProgress = Easing.easeOutCubic(progress);

  // Y축 회전 (카드 뒤집기)
  const rotateY = interpolate(easedProgress, [0, 1], [90, 0]);

  result.rotateY += rotateY;
  result.opacity *= progress > 0 ? (easedProgress > 0.5 ? 1 : 0) : 0;
}

/**
 * letterSlide - 각 글자가 옆에서 미끄러지며 등장
 */
export function applyLetterSlide(
  ctx: EffectContext,
  result: EffectResult
): void {
  const { localFrame, fps, charIndex = 0, width } = ctx;

  const delay = charIndex * 2;
  const slideDuration = fps * 0.4;
  const adjustedFrame = Math.max(0, localFrame - delay);

  const progress = Math.min(adjustedFrame / slideDuration, 1);
  const easedProgress = Easing.easeOutCubic(progress);

  // 오른쪽에서 슬라이드인
  const startX = width * 0.3;
  result.translateX += interpolate(easedProgress, [0, 1], [startX, 0]);
  result.opacity *= easedProgress;
}

/**
 * letterPop - 각 글자가 팡! 터지듯 등장 (탄성)
 */
export function applyLetterPop(
  ctx: EffectContext,
  result: EffectResult
): void {
  const { localFrame, fps, charIndex = 0 } = ctx;

  const delay = charIndex * 3;
  const popDuration = fps * 0.6;
  const adjustedFrame = Math.max(0, localFrame - delay);

  const progress = Math.min(adjustedFrame / popDuration, 1);
  const easedProgress = Easing.elastic(1.2)(progress);

  // 0에서 1.2까지 갔다가 1로 (탄성)
  const scale = easedProgress;

  result.scale *= scale;
  result.opacity *= progress > 0 ? 1 : 0;
}

/**
 * letterRain - 글자가 비처럼 랜덤 타이밍에 떨어짐
 */
export function applyLetterRain(
  ctx: EffectContext,
  result: EffectResult
): void {
  const { localFrame, fps, charIndex = 0, seed, height } = ctx;

  // 각 글자마다 랜덤 딜레이
  const randomDelay = Math.floor(random(seed + charIndex * 7) * fps * 0.8);
  const dropDuration = fps * 0.6;
  const adjustedFrame = Math.max(0, localFrame - randomDelay);

  const progress = Math.min(adjustedFrame / dropDuration, 1);
  const easedProgress = Easing.easeOutQuad(progress);

  const startY = -height * 0.4;
  result.translateY += interpolate(easedProgress, [0, 1], [startY, 0]);
  result.opacity *= progress > 0 ? easedProgress : 0;
}
