/**
 * 이미지 압축 함수 (PNG → JPEG 변환 + 품질 압축)
 * Vercel 서버리스 함수의 4.5MB body 제한을 우회하기 위해 필요
 */
export const compressImage = async (
  dataUrl: string,
  quality = 0.85,
  maxSize = 1024
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      // 이미지 크기 조정 (너무 크면 리사이즈)
      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      // PNG → JPEG 변환으로 크기 대폭 감소
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

      const originalSize = Math.round(dataUrl.length / 1024);
      const compressedSize = Math.round(compressedDataUrl.length / 1024);
      console.log(
        `[Image Compression] ${originalSize}KB → ${compressedSize}KB (${Math.round((1 - compressedSize / originalSize) * 100)}% 감소)`
      );

      resolve(compressedDataUrl);
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = dataUrl;
  });
};
