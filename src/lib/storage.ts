/**
 * Firebase Storage 유틸리티
 * 이미지/비디오 업로드 및 URL 관리
 */

import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Base64 데이터를 Blob으로 변환
 */
function base64ToBlob(base64: string, mimeType: string): Blob {
  // data:video/mp4;base64,xxxxx 형식에서 base64 부분만 추출
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Base64 데이터 URL에서 MIME 타입 추출
 */
function getMimeType(dataUrl: string): string {
  const match = dataUrl.match(/data:([^;]+);/);
  return match ? match[1] : 'application/octet-stream';
}

/**
 * 생성된 이미지를 Firebase Storage에 업로드
 */
export async function uploadGeneratedImage(
  userId: string,
  imageData: string, // base64 data URL
  orderId?: string
): Promise<string> {
  if (!imageData || !imageData.startsWith('data:')) {
    // 이미 URL인 경우 그대로 반환
    return imageData;
  }

  const mimeType = getMimeType(imageData);
  const extension = mimeType.split('/')[1] || 'png';
  const blob = base64ToBlob(imageData, mimeType);

  const timestamp = Date.now();
  const fileName = orderId
    ? `generated-images/${userId}/${orderId}/image.${extension}`
    : `generated-images/${userId}/${timestamp}/image.${extension}`;

  const storageRef = ref(storage, fileName);

  await uploadBytes(storageRef, blob, {
    contentType: mimeType,
  });

  return getDownloadURL(storageRef);
}

/**
 * 생성된 비디오를 Firebase Storage에 업로드
 */
export async function uploadGeneratedVideo(
  userId: string,
  videoData: string, // base64 data URL
  orderId?: string
): Promise<string> {
  if (!videoData || !videoData.startsWith('data:')) {
    // 이미 URL인 경우 그대로 반환
    return videoData;
  }

  const mimeType = getMimeType(videoData);
  const extension = mimeType.split('/')[1] || 'mp4';
  const blob = base64ToBlob(videoData, mimeType);

  const timestamp = Date.now();
  const fileName = orderId
    ? `generated-videos/${userId}/${orderId}/video.${extension}`
    : `generated-videos/${userId}/${timestamp}/video.${extension}`;

  const storageRef = ref(storage, fileName);

  await uploadBytes(storageRef, blob, {
    contentType: mimeType,
  });

  return getDownloadURL(storageRef);
}

/**
 * 이미지와 비디오 모두 업로드
 */
export async function uploadGeneratedMedia(
  userId: string,
  imageData: string | null,
  videoData: string | null,
  orderId?: string
): Promise<{ imageUrl: string; videoUrl: string }> {
  const [imageUrl, videoUrl] = await Promise.all([
    imageData ? uploadGeneratedImage(userId, imageData, orderId) : Promise.resolve(''),
    videoData ? uploadGeneratedVideo(userId, videoData, orderId) : Promise.resolve(''),
  ]);

  return { imageUrl, videoUrl };
}
