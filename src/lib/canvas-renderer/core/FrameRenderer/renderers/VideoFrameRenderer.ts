/**
 * 비디오 프레임 렌더러
 */

import type { RenderConfig } from '../../../types';

/**
 * 비디오 프레임 렌더링
 */
export async function renderVideoFrame(
  videoElement: HTMLVideoElement,
  frameNumber: number,
  config: RenderConfig,
  ctx: CanvasRenderingContext2D
): Promise<void> {
  const { fps } = config.renderer;
  const targetTime = frameNumber / fps;

  // 비디오 시간 설정
  videoElement.currentTime = targetTime % videoElement.duration;

  // 시크 완료 대기
  await new Promise<void>(resolve => {
    const onSeeked = () => {
      videoElement.removeEventListener('seeked', onSeeked);
      resolve();
    };
    videoElement.addEventListener('seeked', onSeeked);
  });

  // 비디오 프레임 그리기
  ctx.drawImage(
    videoElement,
    0, 0,
    config.renderer.width,
    config.renderer.height
  );
}

/**
 * 다크 오버레이 렌더링
 */
export function renderDarkOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, 'rgba(0,0,0,0.4)');
  gradient.addColorStop(0.4, 'rgba(0,0,0,0.1)');
  gradient.addColorStop(0.6, 'rgba(0,0,0,0.1)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.4)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}
