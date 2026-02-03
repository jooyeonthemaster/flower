/**
 * URL 해결 유틸리티
 */

/**
 * 상대 경로를 절대 URL로 변환
 */
export function resolveUrl(src: string): string {
  // 이미 절대 URL이면 그대로 반환
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('blob:')) {
    return src;
  }
  // 상대 경로면 현재 origin 추가
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  // /로 시작하지 않으면 / 추가
  const path = src.startsWith('/') ? src : `/${src}`;
  return `${base}${path}`;
}
