/**
 * 오버레이 렌더링 유틸리티
 */

interface RendererDimensions {
  width: number;
  height: number;
}

/**
 * 다크 오버레이 렌더링 (상하단 그라디언트)
 */
export function renderDarkOverlay(ctx: CanvasRenderingContext2D, dimensions: RendererDimensions): void {
  const { width, height } = dimensions;

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, 'rgba(0,0,0,0.4)');
  gradient.addColorStop(0.4, 'rgba(0,0,0,0.1)');
  gradient.addColorStop(0.6, 'rgba(0,0,0,0.1)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.4)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * 참조 이미지 렌더링
 */
export function renderReferenceImage(
  ctx: CanvasRenderingContext2D,
  dimensions: RendererDimensions,
  referenceImage: HTMLImageElement
): void {
  const { width, height } = dimensions;

  // 이미지 크기 계산 (35% 너비)
  const imgWidth = width * 0.35;
  const imgHeight = (referenceImage.height / referenceImage.width) * imgWidth;

  // 위치 (상단 30%, 가운데)
  const x = (width - imgWidth) / 2;
  const y = height * 0.3 - imgHeight / 2;

  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;

  // 그림자 효과
  ctx.shadowColor = 'rgba(255,255,255,0.5)';
  ctx.shadowBlur = 20;

  ctx.drawImage(referenceImage, x, y, imgWidth, imgHeight);
  ctx.restore();
}

/**
 * 시네마틱 오버레이 렌더링 (노이즈, 스캔라인, 비네팅)
 */
export function renderCinematicOverlays(ctx: CanvasRenderingContext2D, dimensions: RendererDimensions): void {
  const { width, height } = dimensions;

  // 1. 노이즈/그레인
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.globalCompositeOperation = 'overlay';

  for (let i = 0; i < 100; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 2 + 1;
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5})`;
    ctx.fillRect(x, y, size, size);
  }
  ctx.restore();

  // 2. 스캔라인
  ctx.save();
  ctx.globalAlpha = 0.03;
  ctx.globalCompositeOperation = 'color-dodge';
  ctx.strokeStyle = '#00ffff';
  ctx.lineWidth = 1;

  for (let y = 0; y < height; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();

  // 3. 비네팅
  ctx.save();
  const vignette = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, width * 0.8
  );
  vignette.addColorStop(0, 'transparent');
  vignette.addColorStop(1, 'rgba(0,0,0,0.7)');

  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}
