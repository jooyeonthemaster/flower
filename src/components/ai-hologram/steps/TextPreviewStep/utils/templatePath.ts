export const getTemplateVideoPath = (category: string, style: string): string => {
  // 로컬 public 폴더에서 템플릿 영상 로드 (CORS 이슈 방지)
  return `/templates/videos/${category}-${style}.mp4`;
};
