import { CompositionData, GeneratedDualFrame, TEST_MODE } from './constants';

interface GenerateImagesParams {
  data: CompositionData;
  setBackgroundProgress: React.Dispatch<React.SetStateAction<boolean[]>>;
  setTextFrameProgress: React.Dispatch<React.SetStateAction<boolean[]>>;
  onPhaseChange?: (phase: 'background' | 'textframe') => void;
}

export async function generateImages({
  data,
  setBackgroundProgress,
  setTextFrameProgress,
  onPhaseChange,
}: GenerateImagesParams): Promise<GeneratedDualFrame[]> {
  // 테스트 모드: constants.ts의 TEST_MODE를 true로 설정하면 첫 번째 장면만 생성
  const messagesToProcess = TEST_MODE ? data.messages.slice(0, 1) : data.messages;

  // Phase 1: 배경 이미지 생성
  onPhaseChange?.('background');
  const backgroundRequests = messagesToProcess.map(async (message, idx) => {
    try {
      const response = await fetch('/api/ai/generate-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: data.category, style: data.style }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`배경 생성 API 오류 (${idx + 1}):`, {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          body: errorText.substring(0, 500),
        });
        throw new Error(`배경 생성 실패 (${idx + 1}): ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      setBackgroundProgress(prev => {
        const newProg = [...prev];
        newProg[idx] = true;
        return newProg;
      });

      return result.imageUrl;
    } catch (error) {
      console.error(`배경 생성 예외 (${idx + 1}):`, error);
      throw error;
    }
  });

  const backgroundUrls = await Promise.all(backgroundRequests);

  // Phase 2: 텍스트 프레임 생성
  onPhaseChange?.('textframe');
  const textFrameRequests = messagesToProcess.map(async (message, idx) => {
    try {
      const response = await fetch('/api/ai/generate-text-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: message,
          backgroundImage: backgroundUrls[idx],
          category: data.category,
          style: data.style,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`텍스트 프레임 API 오류 (${idx + 1}):`, {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          body: errorText.substring(0, 500),
        });
        throw new Error(`텍스트 프레임 생성 실패 (${idx + 1}): ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      setTextFrameProgress(prev => {
        const newProg = [...prev];
        newProg[idx] = true;
        return newProg;
      });

      return {
        startFrameUrl: backgroundUrls[idx],  // 배경 이미지 (텍스트 없음)
        endFrameUrl: result.imageUrl,        // 텍스트 프레임 (배경 + 텍스트)
        message,
      };
    } catch (error) {
      console.error(`텍스트 프레임 예외 (${idx + 1}):`, error);
      throw error;
    }
  });

  return await Promise.all(textFrameRequests);
}
