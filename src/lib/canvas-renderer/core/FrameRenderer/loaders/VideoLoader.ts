/**
 * 비디오 로더
 */

import { resolveUrl } from '../utils/urlResolver';
import { DEBUG } from '../constants';

/**
 * 비디오 완전 로드 대기
 */
async function waitForFullyLoaded(video: HTMLVideoElement): Promise<void> {
  return new Promise<void>((resolveReady) => {
    const check = () => {
      // readyState 4 (HAVE_ENOUGH_DATA) 확인
      if (video.readyState < 4) {
        return; // 아직 부족
      }

      // buffered 범위 확인 (전체 duration 커버 여부)
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration;

        // 전체 비디오의 95% 이상 버퍼링되면 OK
        if (bufferedEnd >= duration * 0.95) {
          video.removeEventListener('canplaythrough', check);
          video.removeEventListener('progress', check);
          resolveReady();
        }
      }
    };

    // 즉시 체크
    check();

    // 이벤트 리스너 등록
    video.addEventListener('canplaythrough', check);
    video.addEventListener('progress', check);
  });
}

/**
 * 비디오 로드 (fetch + blob 방식으로 안정적 로드)
 */
export async function loadVideo(videoSrc: string): Promise<HTMLVideoElement> {
  const resolvedUrl = resolveUrl(videoSrc);

  if (DEBUG) {
    console.log('[FrameRenderer] loadVideo 시작:', {
      videoSrc,
      resolvedUrl,
    });
  }

  try {
    // fetch로 비디오 데이터 가져오기
    const response = await fetch(resolvedUrl);

    if (DEBUG) {
      console.log('[FrameRenderer] fetch 응답:', {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length'),
      });
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    if (DEBUG) {
      console.log('[FrameRenderer] blob 생성 완료:', {
        blobSize: blob.size,
        blobType: blob.type,
        blobUrl,
      });
    }

    return new Promise((resolve, reject) => {
      const videoElement = document.createElement('video');
      videoElement.muted = true;
      videoElement.playsInline = true;
      videoElement.preload = 'auto';

      const timeout = setTimeout(() => {
        reject(new Error(`Video load timeout: ${videoSrc}`));
      }, 30000);

      Promise.race([
        waitForFullyLoaded(videoElement),
        new Promise<void>((_, rejectTimeout) =>
          setTimeout(() => rejectTimeout(new Error('Video full load timeout (readyState 4 + buffered 95%)')), 30000)
        )
      ]).then(() => {
        clearTimeout(timeout);

        if (DEBUG) {
          console.log('[FrameRenderer] Video fully loaded:', {
            readyState: videoElement.readyState,
            bufferedEnd: videoElement.buffered.length > 0
              ? videoElement.buffered.end(0).toFixed(3)
              : '0',
            duration: videoElement.duration.toFixed(3),
          });
        }

        resolve(videoElement);
      }).catch((error) => {
        clearTimeout(timeout);
        reject(error);
      });

      videoElement.onerror = () => {
        clearTimeout(timeout);
        URL.revokeObjectURL(blobUrl);

        const mediaError = videoElement.error;
        const errorInfo = {
          code: mediaError?.code,
          message: mediaError?.message,
          codeDescription: mediaError?.code === 1 ? 'MEDIA_ERR_ABORTED' :
            mediaError?.code === 2 ? 'MEDIA_ERR_NETWORK' :
              mediaError?.code === 3 ? 'MEDIA_ERR_DECODE' :
                mediaError?.code === 4 ? 'MEDIA_ERR_SRC_NOT_SUPPORTED' :
                  'UNKNOWN',
          videoSrc,
          readyState: videoElement.readyState,
          networkState: videoElement.networkState,
        };

        console.error('Video element error:', errorInfo);
        reject(new Error(`Failed to load video element: ${videoSrc} (${errorInfo.codeDescription}: ${mediaError?.message || 'Unknown error'})`));
      };

      videoElement.src = blobUrl;
      videoElement.load();
    });
  } catch (error) {
    console.error('Video fetch error:', error, resolvedUrl);
    throw new Error(`Failed to fetch video: ${videoSrc} (${error})`);
  }
}
