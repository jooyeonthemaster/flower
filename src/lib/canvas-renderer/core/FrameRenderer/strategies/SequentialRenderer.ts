/**
 * Sequential Rendering Strategy
 * requestVideoFrameCallback 사용 렌더링 (적응형 타임아웃 + 버퍼 모니터링)
 */

import { DEBUG } from '../constants';
import { checkBufferHealth, waitForBufferRecovery } from '../utils/bufferHealthChecker';

/**
 * Sequential rendering context
 */
export interface SequentialRenderContext {
  videoElement: HTMLVideoElement;
  fps: number;
  renderFrame: (frameNumber: number) => ImageData;
}

/**
 * requestVideoFrameCallback를 사용한 순차 렌더링
 */
export async function* renderWithVideoFrameCallback(
  context: SequentialRenderContext,
  totalFrames: number,
  onProgress?: (current: number, total: number) => void
): AsyncGenerator<ImageData, void, unknown> {
  const { videoElement: video, fps, renderFrame } = context;
  const frameDuration = 1000 / fps;

  // 동적 타임아웃 계산 (첫 프레임은 더 오래 걸릴 수 있음)
  const baseTimeout = 10000; // 10초로 증가
  const bufferMargin = 3000;
  const dynamicTimeout = Math.max(
    baseTimeout,
    (frameDuration * 2) + bufferMargin
  );

  // play() 예외 처리
  try {
    await video.play();
  } catch (error) {
    throw new Error(`Failed to play video: ${error}`);
  }

  // playing 상태 확인
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Video play timeout - not in playing state'));
    }, 5000);

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

  if (DEBUG) {
    console.log('[Sequential Playback] Video playing started:', {
      currentTime: video.currentTime.toFixed(3),
      readyState: video.readyState,
      paused: video.paused,
      ended: video.ended,
      playbackRate: video.playbackRate,
      buffered: video.buffered.length > 0 ? `${video.buffered.end(0).toFixed(3)}s` : '0s',
      duration: video.duration.toFixed(3),
    });
  }

  // 프레임 렌더링
  for (let i = 0; i < totalFrames; i++) {
    // 비디오 종료 체크 - 종료된 경우 마지막 프레임 재사용
    if (video.ended) {
      if (DEBUG) {
        console.warn(`[Frame ${i}] Video ended, using last frame for remaining ${totalFrames - i} frames`);
      }

      // requestVideoFrameCallback 없이 바로 렌더링 (마지막 프레임 재사용)
      const imageData = renderFrame(i);

      if (onProgress) {
        onProgress(i + 1, totalFrames);
      }

      yield imageData;
      continue; // 다음 프레임으로 (requestVideoFrameCallback 건너뛰기)
    }

    // 버퍼 상태 모니터링
    const bufferStatus = checkBufferHealth(video, i);

    if (bufferStatus.isStalled) {
      try {
        await waitForBufferRecovery(video, baseTimeout);
      } catch (error) {
        // 버퍼 회복 실패 시에도 진행 시도 (타임아웃 증가)
        console.warn(`Buffer recovery timeout at frame ${i}, continuing...`);
      }
    }

    // 프레임당 동적 타임아웃
    const frameTimeout = baseTimeout + (bufferStatus.stalledDuration || 0);

    // 첫 프레임 진단 로깅
    if (i === 0 && DEBUG) {
      console.log('[Frame 0] Before requestVideoFrameCallback:', {
        currentTime: video.currentTime.toFixed(3),
        readyState: video.readyState,
        paused: video.paused,
        ended: video.ended,
        buffered: video.buffered.length > 0 ? `${video.buffered.end(0).toFixed(3)}s` : '0s',
        timeout: frameTimeout,
      });
    }

    // requestVideoFrameCallback with adaptive timeout
    try {
      await Promise.race([
        new Promise<void>(resolve => {
          (video as any).requestVideoFrameCallback(() => {
            if (i === 0 && DEBUG) {
              console.log('[Frame 0] requestVideoFrameCallback called successfully');
            }
            resolve();
          });
        }),
        new Promise<void>((_, reject) =>
          setTimeout(() => reject(new Error(`Frame ${i} callback timeout`)), frameTimeout)
        )
      ]);
    } catch (error) {
      // ✅ 마지막 프레임 또는 비디오 종료 체크
      const isLastFrames = i >= totalFrames - 5; // 마지막 5프레임
      const isNearEnd = video.currentTime >= video.duration - 0.1; // duration 0.1초 이내

      if (video.ended || isLastFrames || isNearEnd) {
        if (DEBUG) {
          console.warn(
            `[Frame ${i}/${totalFrames}] Video near end ` +
            `(ended: ${video.ended}, currentTime: ${video.currentTime.toFixed(3)}s/${video.duration.toFixed(3)}s), ` +
            `using last frame`
          );
        }
        const imageData = renderFrame(i);
        if (onProgress) {
          onProgress(i + 1, totalFrames);
        }
        yield imageData;
        continue;
      }
      throw new Error(`requestVideoFrameCallback failed at frame ${i}: ${error}`);
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
