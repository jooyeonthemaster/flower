import { compressImage } from './imageCompression';

/**
 * Data URL을 서버 API를 통해 Firebase Storage에 업로드하고 공개 URL 반환
 * (클라이언트 직접 업로드는 Firebase Security Rules에 의해 차단됨)
 */
export const uploadImageToStorage = async (
  dataUrl: string,
  filename: string
): Promise<string> => {
  // 업로드 전 이미지 압축 (Vercel 4.5MB 제한 우회)
  const compressedDataUrl = await compressImage(dataUrl);

  const response = await fetch('/api/upload-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dataUrl: compressedDataUrl,
      filename: `ai-videos/${filename.replace('.png', '.jpg')}`,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`이미지 업로드 실패: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || '이미지 업로드 실패');
  }

  return result.url;
};
