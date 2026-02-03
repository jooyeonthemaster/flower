/**
 * 참조 이미지 렌더러
 */

/**
 * 참조 이미지 렌더링 (Screen 블렌딩)
 */
export function renderReferenceImage(
  referenceImage: HTMLImageElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  // 이미지 크기 계산 (35% 너비)
  const imgWidth = width * 0.35;
  const imgHeight = (referenceImage.height / referenceImage.width) * imgWidth;

  // 위치 (상단 30%, 가운데) - PreviewCanvas.tsx와 동기화
  const x = (width - imgWidth) / 2;
  const y = height * 0.3 - imgHeight / 2;

  ctx.save();

  // 기본 블렌딩 (source-over)
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;

  // 그림자 효과
  ctx.shadowColor = 'rgba(255,255,255,0.5)';
  ctx.shadowBlur = 20;

  ctx.drawImage(referenceImage, x, y, imgWidth, imgHeight);

  ctx.restore();
}
