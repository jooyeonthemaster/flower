/**
 * 진입 효과 (Entrance Effects)
 * typewriter, elastic
 */

import type { EffectContext, EffectResult } from '../types';
import { interpolate, Easing } from '../utils/mathUtils';

/**
 * Typewriter 효과 - 타이핑 효과
 * 2초 동안 글자가 하나씩 나타남
 */
export function applyTypewriter(
  ctx: EffectContext,
  result: EffectResult,
  fadeoutFactor: number = 1
): void {
  const { localFrame, fps, text } = ctx;

  // 3초 동안 천천히 타이핑
  const typewriterDuration = fps * 3.0;
  const typewriterChars = Math.floor(
    interpolate(
      localFrame,
      [0, typewriterDuration],
      [0, text.length],
      { extrapolateRight: 'clamp' }
    )
  );

  // fadeout 시에는 전체 텍스트 표시
  result.displayText = fadeoutFactor < 1 ? text : text.slice(0, typewriterChars);
}

/**
 * Elastic 효과 - 탄성 진입
 * 더 강한 탄성 바운스로 등장
 */
export function applyElastic(
  ctx: EffectContext,
  result: EffectResult
): void {
  const { localFrame, fps } = ctx;

  // 1.2초 동안 탄성 진입
  const elasticScale = interpolate(
    localFrame,
    [0, fps * 1.2],
    [0.3, 1],
    { extrapolateRight: 'clamp' }
  );

  // Elastic easing 적용
  const t = Math.min(localFrame / (fps * 1.2), 1);
  const easedScale = Easing.elastic(1.5)(t) * 0.7 + 0.3;

  result.scale *= Math.max(0.3, Math.min(1.2, easedScale));
}
