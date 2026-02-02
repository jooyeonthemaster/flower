// Firebase Storage 템플릿 영상 URL
const STORAGE_BASE_URL = `https://storage.googleapis.com/${(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'flower-63624.firebasestorage.app').trim()}`;

export const getTemplateVideoPath = (category: string, style: string): string => {
  // Firebase Storage에서 템플릿 영상 로드
  return `${STORAGE_BASE_URL}/templates/videos/${category}-${style}.mp4`;
};
