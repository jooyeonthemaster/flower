/**
 * 텍스트 위치 계산 유틸리티
 */

import type { TextPosition } from '../../../types';
import {
  POSITION_TOP,
  POSITION_CENTER,
  POSITION_BOTTOM,
} from '../../../constants/defaults';

/**
 * Y 위치 계산
 */
export function calculatePositionY(
  position: TextPosition,
  seed: number,
  height: number
): number {
  if (position === 'random') {
    const randVal = seed % 1;
    if (randVal < 0.33) return height * (POSITION_TOP - 0.5);
    if (randVal < 0.66) return height * (POSITION_CENTER - 0.5);
    return height * (POSITION_BOTTOM - 0.5);
  }

  switch (position) {
    case 'top': return height * (POSITION_TOP - 0.5);
    case 'center': return height * (POSITION_CENTER - 0.5);
    case 'bottom': return height * (POSITION_BOTTOM - 0.5);
    default: return height * (POSITION_BOTTOM - 0.5);
  }
}
