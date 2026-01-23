/**
 * 수학 관련 유틸리티 함수 (noise, easing, interpolate 등)
 */

// Simplex Noise 구현 (2D)
// https://github.com/jwagner/simplex-noise.js 기반 간소화

const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;

const grad3 = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
];

// 시드 기반 permutation 테이블 생성
function buildPermutationTable(seed: number): Uint8Array {
  const perm = new Uint8Array(512);
  const p = new Uint8Array(256);

  for (let i = 0; i < 256; i++) {
    p[i] = i;
  }

  // Fisher-Yates shuffle with seed
  let s = seed;
  for (let i = 255; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }

  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
  }

  return perm;
}

// 전역 permutation 테이블 (기본 시드)
let globalPerm = buildPermutationTable(12345);

/**
 * 노이즈 시드 설정
 */
export function setNoiseSeed(seed: number): void {
  globalPerm = buildPermutationTable(seed);
}

/**
 * 2D Simplex Noise (-1 ~ 1)
 */
export function noise2D(x: number, y: number, seed?: number): number {
  const perm = seed !== undefined ? buildPermutationTable(seed) : globalPerm;

  let n0, n1, n2;

  const s = (x + y) * F2;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);

  const t = (i + j) * G2;
  const X0 = i - t;
  const Y0 = j - t;
  const x0 = x - X0;
  const y0 = y - Y0;

  let i1, j1;
  if (x0 > y0) {
    i1 = 1;
    j1 = 0;
  } else {
    i1 = 0;
    j1 = 1;
  }

  const x1 = x0 - i1 + G2;
  const y1 = y0 - j1 + G2;
  const x2 = x0 - 1 + 2 * G2;
  const y2 = y0 - 1 + 2 * G2;

  const ii = i & 255;
  const jj = j & 255;

  const gi0 = perm[ii + perm[jj]] % 12;
  const gi1 = perm[ii + i1 + perm[jj + j1]] % 12;
  const gi2 = perm[ii + 1 + perm[jj + 1]] % 12;

  let t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 < 0) {
    n0 = 0;
  } else {
    t0 *= t0;
    n0 = t0 * t0 * (grad3[gi0][0] * x0 + grad3[gi0][1] * y0);
  }

  let t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 < 0) {
    n1 = 0;
  } else {
    t1 *= t1;
    n1 = t1 * t1 * (grad3[gi1][0] * x1 + grad3[gi1][1] * y1);
  }

  let t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 < 0) {
    n2 = 0;
  } else {
    t2 *= t2;
    n2 = t2 * t2 * (grad3[gi2][0] * x2 + grad3[gi2][1] * y2);
  }

  return 70 * (n0 + n1 + n2);
}

/**
 * 3D Simplex Noise (-1 ~ 1)
 */
export function noise3D(x: number, y: number, z: number, seed?: number): number {
  // 간소화: 2D noise의 조합으로 근사
  const n1 = noise2D(x, y, seed);
  const n2 = noise2D(y, z, seed !== undefined ? seed + 1000 : undefined);
  const n3 = noise2D(x, z, seed !== undefined ? seed + 2000 : undefined);
  return (n1 + n2 + n3) / 3;
}

/**
 * 문자열 기반 noise2D (Remotion 호환)
 */
export function noise2DString(key: string, x: number, y: number): number {
  // 문자열을 숫자 시드로 변환
  let seed = 0;
  for (let i = 0; i < key.length; i++) {
    seed = ((seed << 5) - seed) + key.charCodeAt(i);
    seed = seed & seed;
  }
  return noise2D(x + seed * 0.001, y + seed * 0.001);
}

/**
 * 선형 보간 (interpolate) - Remotion 호환
 * 다중 구간 지원 (inputRange와 outputRange가 같은 길이여야 함)
 */
export function interpolate(
  value: number,
  inputRange: number[],
  outputRange: number[],
  options?: { extrapolateLeft?: 'clamp' | 'extend'; extrapolateRight?: 'clamp' | 'extend' }
): number {
  if (inputRange.length !== outputRange.length) {
    throw new Error('inputRange and outputRange must have the same length');
  }
  if (inputRange.length < 2) {
    throw new Error('inputRange must have at least 2 elements');
  }

  // 범위 외 처리
  if (value <= inputRange[0]) {
    if (options?.extrapolateLeft === 'clamp') {
      return outputRange[0];
    }
    // extend: 첫 구간의 기울기로 외삽
    const slope = (outputRange[1] - outputRange[0]) / (inputRange[1] - inputRange[0]);
    return outputRange[0] + slope * (value - inputRange[0]);
  }

  if (value >= inputRange[inputRange.length - 1]) {
    if (options?.extrapolateRight === 'clamp') {
      return outputRange[outputRange.length - 1];
    }
    // extend: 마지막 구간의 기울기로 외삽
    const lastIdx = inputRange.length - 1;
    const slope = (outputRange[lastIdx] - outputRange[lastIdx - 1]) / (inputRange[lastIdx] - inputRange[lastIdx - 1]);
    return outputRange[lastIdx] + slope * (value - inputRange[lastIdx]);
  }

  // 해당 구간 찾기
  for (let i = 1; i < inputRange.length; i++) {
    if (value <= inputRange[i]) {
      const inputMin = inputRange[i - 1];
      const inputMax = inputRange[i];
      const outputMin = outputRange[i - 1];
      const outputMax = outputRange[i];

      const t = (value - inputMin) / (inputMax - inputMin);
      return outputMin + t * (outputMax - outputMin);
    }
  }

  // fallback
  return outputRange[outputRange.length - 1];
}

/**
 * 클램프
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * 랜덤 (시드 기반)
 */
export function random(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// Easing 함수들
export const Easing = {
  linear: (t: number) => t,

  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  easeInSin: (t: number) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSin: (t: number) => Math.sin((t * Math.PI) / 2),
  easeInOutSin: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,

  easeInExpo: (t: number) => t === 0 ? 0 : Math.pow(2, 10 * t - 10),
  easeOutExpo: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),

  easeInElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 :
      -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  },

  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 :
      Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },

  easeOutBounce: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },

  elastic: (bounciness: number = 1) => (t: number) => {
    const p = 0.3;
    return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) * bounciness + 1;
  },
};

/**
 * 각도를 라디안으로 변환
 */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * 라디안을 각도로 변환
 */
export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI);
}
