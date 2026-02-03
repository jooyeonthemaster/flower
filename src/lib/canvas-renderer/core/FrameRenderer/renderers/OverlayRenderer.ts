/**
 * 시네마틱 오버레이 렌더러
 */

/**
 * 시네마틱 오버레이 렌더링
 */
export function renderCinematicOverlays(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  // 1. 노이즈/그레인 (간소화)
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.globalCompositeOperation = 'overlay';

  // 간단한 노이즈 패턴
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
