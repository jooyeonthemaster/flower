/**
 * 비디오 버퍼 상태 모니터링 유틸리티
 */

interface BufferHealth {
  isStalled: boolean;
  stalledDuration: number;
}

/**
 * 버퍼 상태 체크
 */
export function checkBufferHealth(
  video: HTMLVideoElement,
  frameIndex: number
): BufferHealth {
  const currentTime = video.currentTime;
  const buffered = video.buffered;
  let isStalled = false;
  let stalledDuration = 0;

  let isCurrentTimeBuffered = false;
  for (let i = 0; i < buffered.length; i++) {
    if (currentTime >= buffered.start(i) && currentTime < buffered.end(i)) {
      isCurrentTimeBuffered = true;
      break;
    }
  }

  if (!isCurrentTimeBuffered && buffered.length > 0) {
    isStalled = true;
    const lastBufferEnd = buffered.end(buffered.length - 1);
    const gapSize = currentTime - lastBufferEnd;
    stalledDuration = Math.min(gapSize * 1000, 5000);
  }

  return { isStalled, stalledDuration };
}

/**
 * 버퍼 회복 대기
 */
export async function waitForBufferRecovery(
  video: HTMLVideoElement,
  timeout: number
): Promise<void> {
  const startTime = Date.now();

  return new Promise<void>((resolve, reject) => {
    const checkBuffer = () => {
      const currentTime = video.currentTime;
      const buffered = video.buffered;

      for (let i = 0; i < buffered.length; i++) {
        if (currentTime >= buffered.start(i) && currentTime < buffered.end(i)) {
          resolve();
          return;
        }
      }

      if (Date.now() - startTime > timeout) {
        reject(new Error('Buffer recovery timeout'));
        return;
      }

      setTimeout(checkBuffer, 100);
    };

    checkBuffer();
  });
}
