/**
 * Animation Frame Rendering Strategy
 * requestAnimationFrame Fallback
 */

/**
 * Animation frame rendering context
 */
export interface AnimationFrameRenderContext {
  videoElement: HTMLVideoElement;
  fps: number;
  renderFrame: (frameNumber: number) => ImageData;
}

/**
 * requestAnimationFrame을 사용한 폴백 렌더링
 */
export async function* renderWithAnimationFrame(
  context: AnimationFrameRenderContext,
  totalFrames: number,
  onProgress?: (current: number, total: number) => void
): AsyncGenerator<ImageData, void, unknown> {
  const { videoElement: video, fps, renderFrame } = context;

  await video.play();

  // playing 상태 확인
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Video play timeout')), 5000);
    const onPlaying = () => {
      clearTimeout(timeout);
      video.removeEventListener('playing', onPlaying);
      resolve();
    };

    if (!video.paused && video.readyState >= 3) {
      clearTimeout(timeout);
      resolve();
    } else {
      video.addEventListener('playing', onPlaying);
    }
  });

  for (let i = 0; i < totalFrames; i++) {
    const targetTime = i / fps;
    const frameDuration = 1000 / fps;
    const maxWaitTime = frameDuration * 2 + 3000; // 2프레임 + 3초 여유
    const startTime = Date.now();

    // Loop 탈출 조건 개선
    while (video.currentTime < targetTime - 0.001) { // 0.001초 허용 오차
      // 타임아웃 체크
      if (Date.now() - startTime > maxWaitTime) {
        throw new Error(
          `Frame ${i} timeout: video stuck at ${video.currentTime.toFixed(3)}s (target: ${targetTime.toFixed(3)}s)`
        );
      }

      // 비디오 중지 감지
      if (video.paused || video.ended) {
        throw new Error(`Video playback stopped at frame ${i}`);
      }

      await new Promise(resolve => requestAnimationFrame(resolve));
    }

    // 프레임 렌더링
    const imageData = renderFrame(i);

    if (onProgress) {
      onProgress(i + 1, totalFrames);
    }

    yield imageData;
  }

  video.pause();
}
