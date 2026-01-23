/**
 * FFmpeg drawtext 필터용 텍스트 이스케이프 유틸리티
 */

/**
 * 텍스트 이스케이프 (FFmpeg drawtext 특수문자 처리)
 */
export function escapeTextForFFmpeg(text: string): string {
  return text
    .replace(/\\/g, '\\\\\\\\')    // 백슬래시
    .replace(/'/g, "'\\\\\\''")    // 작은따옴표
    .replace(/:/g, '\\:')          // 콜론
    .replace(/%/g, '\\%')          // 퍼센트
    .replace(/\n/g, ' ')           // 줄바꿈 → 공백
    .replace(/\r/g, '');           // 캐리지 리턴 제거
}

/**
 * 글로우 색상 변환 (hex → FFmpeg 색상)
 */
export function convertColorForFFmpeg(hexColor: string): string {
  if (hexColor.startsWith('#')) {
    return '0x' + hexColor.substring(1);
  }
  return hexColor;
}

/**
 * Y 위치 계산
 */
export function getYPosition(textPosition: string, index: number): string {
  switch (textPosition) {
    case 'top':
      return 'h*0.3';
    case 'center':
      return '(h-text_h)/2';
    case 'bottom':
      return 'h*0.68';
    case 'random':
    default:
      const positions = ['h*0.3', '(h-text_h)/2', 'h*0.68'];
      return positions[index % 3];
  }
}
