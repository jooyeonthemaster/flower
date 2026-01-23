import { uploadImageToStorage } from '../utils/imageUpload';

/**
 * Start/End Frame 영상 생성 (클라이언트 폴링 방식)
 */
export const generateStartEndVideo = async (
  startFrame: string,
  endFrame: string,
  _text: string,
  index: number,
  sceneCount: number,
  model: string,
  style: string,
  category: string
): Promise<string> => {
  console.log(
    `[Phase 1] Starting video generation ${index + 1}/${sceneCount} with model: ${model}, style: ${style}, category: ${category}`
  );

  // 0. 이미지를 먼저 Firebase Storage에 업로드 (413 에러 방지)
  const timestamp = Date.now();
  console.log(`[Phase 1] Uploading images to Firebase Storage...`);
  console.log(`[Phase 1] Start Frame Length: ${startFrame.length}, End Frame Length: ${endFrame.length}`);

  let startImageUrl: string;
  let endImageUrl: string;

  try {
    [startImageUrl, endImageUrl] = await Promise.all([
      uploadImageToStorage(startFrame, `start-${index}-${timestamp}.png`),
      uploadImageToStorage(endFrame, `end-${index}-${timestamp}.png`),
    ]);
    console.log(
      `[Phase 1] Upload success. Start URL: ${startImageUrl.substring(0, 50)}..., End URL: ${endImageUrl.substring(0, 50)}...`
    );
  } catch (error) {
    console.error('Firebase Upload Error:', error);
    throw new Error(`이미지 업로드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }

  // Critical Check: 413 에러 방지를 위해 Data URL인지 확인
  if (startImageUrl.startsWith('data:') || endImageUrl.startsWith('data:')) {
    console.error('Critical: Data URL detected, aborting API call');
    throw new Error('이미지가 정상적으로 업로드되지 않았습니다. (Data URL 감지됨)');
  }

  // 1. Job 시작 요청 (URL만 전송하여 413 에러 방지)
  console.log('[Phase 1] Sending API Request...');
  const startResponse = await fetch('/api/ai/generate-video-startend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      startImageUrl,
      endImageUrl,
      model,
      motionStrength: 0.6,
      duration: 10,
      style,
      category,
    }),
  });

  if (startResponse.status === 413) {
    throw new Error(
      `요청 용량 초과 (413 Payload Too Large) - 이미지가 제대로 업로드되지 않았을 수 있습니다. URL 길이: ${startImageUrl.length}`
    );
  }

  if (!startResponse.ok) {
    const errText = await startResponse.text();
    console.error('API Error Body:', errText);
    throw new Error(`영상 생성 시작 실패 (${index + 1}번째): ${startResponse.status} ${startResponse.statusText}`);
  }

  const startResult = await startResponse.json();
  if (!startResult.success) {
    throw new Error(startResult.error || `영상 생성 시작 실패 (${index + 1}번째)`);
  }

  const { statusUrl } = startResult;
  console.log(`[Phase 1] Job queued for video ${index + 1}, polling status...`);

  // 2. 클라이언트에서 직접 폴링 (타임아웃 없음)
  const POLL_INTERVAL = 5000; // 5초마다 확인
  const MAX_POLLS = 120; // 최대 10분 (5초 * 120)
  let pollCount = 0;

  while (pollCount < MAX_POLLS) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
    pollCount++;

    try {
      const statusResponse = await fetch('/api/ai/check-video-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusUrl }),
      });

      if (!statusResponse.ok) {
        console.warn(`Status check failed for video ${index + 1}, retrying...`);
        continue;
      }

      const statusResult = await statusResponse.json();
      console.log(`[Polling ${pollCount}] Video ${index + 1} status: ${statusResult.status}`);

      if (statusResult.status === 'completed') {
        console.log(`[Phase 1] Video ${index + 1} completed!`);
        return statusResult.videoUrl;
      }

      if (statusResult.status === 'failed') {
        throw new Error(statusResult.error || `영상 생성 실패 (${index + 1}번째)`);
      }

      // 'queued' 또는 'in_progress'면 계속 폴링
    } catch (pollError) {
      console.warn(`Poll error for video ${index + 1}:`, pollError);
      // 네트워크 오류 등은 무시하고 재시도
    }
  }

  throw new Error(`영상 생성 시간 초과 (${index + 1}번째) - 10분 초과`);
};
