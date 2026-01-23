/**
 * 리소스 로딩 유틸리티
 */

/**
 * 상대 경로를 절대 URL로 변환
 */
export function resolveUrl(src: string): string {
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('blob:')) {
    return src;
  }
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  const path = src.startsWith('/') ? src : `/${src}`;
  return `${base}${path}`;
}

/**
 * 비디오 로드 (fetch + blob 방식)
 */
export async function loadVideoElement(videoSrc: string): Promise<HTMLVideoElement> {
  const resolvedUrl = resolveUrl(videoSrc);

  const response = await fetch(resolvedUrl);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const videoElement = document.createElement('video');
    videoElement.muted = true;
    videoElement.playsInline = true;
    videoElement.preload = 'auto';

    const timeout = setTimeout(() => {
      reject(new Error(`Video load timeout: ${videoSrc}`));
    }, 30000);

    videoElement.onloadeddata = () => {
      clearTimeout(timeout);
      resolve(videoElement);
    };

    videoElement.onerror = () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(blobUrl);

      const mediaError = videoElement.error;
      const codeDescription = mediaError?.code === 1 ? 'MEDIA_ERR_ABORTED' :
        mediaError?.code === 2 ? 'MEDIA_ERR_NETWORK' :
        mediaError?.code === 3 ? 'MEDIA_ERR_DECODE' :
        mediaError?.code === 4 ? 'MEDIA_ERR_SRC_NOT_SUPPORTED' :
        'UNKNOWN';

      reject(new Error(`Failed to load video: ${videoSrc} (${codeDescription}: ${mediaError?.message || 'Unknown'})`));
    };

    videoElement.src = blobUrl;
    videoElement.load();
  });
}

/**
 * 이미지 로드 (fetch + blob 방식, DataURL 지원)
 */
export async function loadImageElement(imageSrc: string): Promise<HTMLImageElement> {
  const isDataUrl = imageSrc.startsWith('data:');

  if (isDataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      const timeout = setTimeout(() => {
        reject(new Error(`Image load timeout (DataURL)`));
      }, 15000);

      img.onload = () => {
        clearTimeout(timeout);
        resolve(img);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error(`Failed to load image from DataURL`));
      };

      img.src = imageSrc;
    });
  }

  const resolvedUrl = resolveUrl(imageSrc);

  const response = await fetch(resolvedUrl);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const img = new Image();

    const timeout = setTimeout(() => {
      reject(new Error(`Image load timeout: ${imageSrc}`));
    }, 15000);

    img.onload = () => {
      clearTimeout(timeout);
      resolve(img);
    };

    img.onerror = () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(blobUrl);
      reject(new Error(`Failed to load image: ${imageSrc}`));
    };

    img.src = blobUrl;
  });
}
