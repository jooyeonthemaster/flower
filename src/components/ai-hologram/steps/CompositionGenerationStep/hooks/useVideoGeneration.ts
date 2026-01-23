import { useCallback } from 'react';
import { GeneratedDualFrame } from '../../CompositionImagePreviewStep';
import { GenerationPhase, SceneProgress, VideoGenerationResult } from '../types';
import { generateStartEndVideo } from '../api/videoGeneration';
import { mergeVideos } from '../api/videoMerge';

interface UseVideoGenerationParams {
  generatedFrames: GeneratedDualFrame[];
  model: string;
  style: string;
  category: string;
  setPhase: (phase: GenerationPhase) => void;
  setProgress: React.Dispatch<React.SetStateAction<SceneProgress[]>>;
  setErrorMessage: (message: string) => void;
  onComplete: (videoUrl: string, messages: string[]) => void;
}

export const useVideoGeneration = ({
  generatedFrames,
  model,
  style,
  category,
  setPhase,
  setProgress,
  setErrorMessage,
  onComplete,
}: UseVideoGenerationParams) => {
  const sceneCount = generatedFrames.length;

  const runMainProcess = useCallback(async () => {
    try {
      setPhase('generating-video');

      // Phase 1: 모든 영상을 병렬로 생성
      console.log(`[Phase 1] Starting parallel video generation for ${sceneCount} scenes`);

      const videoPromises = generatedFrames.map(async (frame, index): Promise<VideoGenerationResult> => {
        try {
          const videoUrl = await generateStartEndVideo(
            frame.startFrameUrl,
            frame.endFrameUrl,
            frame.message,
            index,
            sceneCount,
            model,
            style,
            category
          );

          // 각 영상 완료시 progress 업데이트
          setProgress((prev) => {
            const newProgress = [...prev];
            newProgress[index] = { videoGenerated: true, videoUrl };
            return newProgress;
          });

          return { index, videoUrl, success: true };
        } catch (error) {
          console.error(`Video ${index + 1} generation failed:`, error);
          return { index, videoUrl: '', success: false, error };
        }
      });

      // 모든 영상 생성 완료 대기
      const results = await Promise.all(videoPromises);

      // 실패한 영상이 있는지 확인
      const failedResults = results.filter((r) => !r.success);
      if (failedResults.length > 0) {
        throw new Error(`${failedResults.length}개 영상 생성 실패`);
      }

      // 순서대로 videoUrls 배열 생성
      const videoUrls = results.sort((a, b) => a.index - b.index).map((r) => r.videoUrl);

      // Phase 2: 영상 합성 (1개면 스킵)
      let finalVideoUrl: string;

      if (videoUrls.length === 1) {
        console.log('Single video, skipping merge');
        finalVideoUrl = videoUrls[0];
      } else {
        setPhase('merging');
        finalVideoUrl = await mergeVideos(videoUrls);
      }

      // 완료
      setPhase('completed');
      onComplete(
        finalVideoUrl,
        generatedFrames.map((f) => f.message)
      );
    } catch (error) {
      console.error('Generation error:', error);
      setPhase('error');
      setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    }
  }, [sceneCount, generatedFrames, model, style, category, setPhase, setProgress, setErrorMessage, onComplete]);

  return { runMainProcess };
};
