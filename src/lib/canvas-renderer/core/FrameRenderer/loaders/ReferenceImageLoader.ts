/**
 * 참조 이미지 로더
 */

import { resolveUrl } from '../utils/urlResolver';
import { DEBUG } from '../constants';

/**
 * 참조 이미지 로드 (fetch + blob 방식으로 안정적 로드)
 */
export async function loadReferenceImage(imageSrc: string): Promise<HTMLImageElement> {
  // Data URL인 경우 fetch 없이 직접 로드
  const isDataUrl = imageSrc.startsWith('data:');

  if (DEBUG) {
    console.log('[FrameRenderer] loadReferenceImage 시작:', {
      isDataUrl,
      srcLength: imageSrc.length,
      srcPreview: imageSrc.substring(0, 100),
    });
  }

  if (isDataUrl) {
    // Data URL은 직접 Image에 설정
    return new Promise((resolve, reject) => {
      const referenceImage = new Image();

      const timeout = setTimeout(() => {
        reject(new Error(`Image load timeout (DataURL)`));
      }, 15000);

      referenceImage.onload = () => {
        clearTimeout(timeout);
        if (DEBUG) {
          console.log('[FrameRenderer] 참조 이미지 로드 성공 (DataURL):', {
            width: referenceImage.width,
            height: referenceImage.height,
          });
        }
        resolve(referenceImage);
      };

      referenceImage.onerror = (e) => {
        clearTimeout(timeout);
        console.error('[FrameRenderer] 참조 이미지 로드 실패 (DataURL):', e);
        reject(new Error(`Failed to load image from DataURL`));
      };

      referenceImage.src = imageSrc;
    });
  }

  const resolvedUrl = resolveUrl(imageSrc);

  try {
    // fetch로 이미지 데이터 가져오기
    const response = await fetch(resolvedUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    return new Promise((resolve, reject) => {
      const referenceImage = new Image();

      const timeout = setTimeout(() => {
        reject(new Error(`Image load timeout: ${imageSrc}`));
      }, 15000); // 15초 타임아웃

      referenceImage.onload = () => {
        clearTimeout(timeout);
        if (DEBUG) {
          console.log('[FrameRenderer] 참조 이미지 로드 성공 (URL):', {
            width: referenceImage.width,
            height: referenceImage.height,
          });
        }
        resolve(referenceImage);
      };

      referenceImage.onerror = (e) => {
        clearTimeout(timeout);
        URL.revokeObjectURL(blobUrl);
        console.error('[FrameRenderer] 참조 이미지 로드 실패 (URL):', { imageSrc, error: e });
        reject(new Error(`Failed to load image element: ${imageSrc}`));
      };

      referenceImage.src = blobUrl;
    });
  } catch (error) {
    console.error('Image fetch error:', error, resolvedUrl);
    throw new Error(`Failed to fetch image: ${imageSrc} (${error})`);
  }
}
