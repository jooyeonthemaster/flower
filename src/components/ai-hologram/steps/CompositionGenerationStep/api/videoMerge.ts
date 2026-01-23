/**
 * 영상 합성 API 호출
 */
export const mergeVideos = async (videoUrls: string[]): Promise<string> => {
  console.log(`[Phase 2] Merging ${videoUrls.length} videos`);

  const response = await fetch('/api/ai/merge-videos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      videoDataUrls: videoUrls,
      outputRatio: '1:1',
    }),
  });

  if (!response.ok) {
    throw new Error('영상 합성 실패');
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || '영상 합성 실패');
  }

  return result.videoUrl;
};
