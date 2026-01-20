'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { CompositionData } from './CompositionInputStep';
import { GeneratedDualFrame } from './CompositionImagePreviewStep';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// 테스트 모드에서 사용할 모델
// 지원 모델: dop-lite, dop-preview, dop-turbo, kling-2.5-turbo-pro
const TEST_MODEL = 'kling-2.5-turbo-pro';

// Data URL을 Firebase Storage에 업로드하고 공개 URL 반환
const uploadImageToStorage = async (dataUrl: string, filename: string): Promise<string> => {
  // Data URL을 Blob으로 변환
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  // Firebase Storage에 업로드
  const storageRef = ref(storage, `ai-videos/${filename}`);
  await uploadBytes(storageRef, blob);

  // 다운로드 URL 가져오기
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
};

interface CompositionGenerationStepProps {
  data: CompositionData;
  generatedFrames: GeneratedDualFrame[];
  onComplete: (videoUrl: string, messages: string[]) => void;
  onBack: () => void;
}

/**
 * 새로운 Start/End Frame 플로우:
 *
 * Phase 1: Start/End Frame 기반 영상 생성 (이미지는 이전 단계에서 이미 생성됨)
 * Phase 2: 영상 합성 (멀티 장면)
 */
type GenerationPhase = 'generating-video' | 'merging' | 'completed' | 'error';

interface SceneProgress {
  videoGenerated: boolean;
  videoUrl?: string;
}

export default function CompositionGenerationStep({
  data: _data,
  generatedFrames,
  onComplete,
  onBack,
}: CompositionGenerationStepProps) {
  // data는 향후 확장에 사용 예정
  void _data;
  const [phase, setPhase] = useState<GenerationPhase>('generating-video');
  const [progress, setProgress] = useState<SceneProgress[]>(
    generatedFrames.map(() => ({
      videoGenerated: false,
    }))
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedModel] = useState(TEST_MODEL);
  const generationStartedRef = useRef(false);

  const sceneCount = generatedFrames.length;

  // [Phase 1] Start/End Frame 영상 생성 (클라이언트 폴링 방식)
  const generateStartEndVideo = async (
    startFrame: string,
    endFrame: string,
    _text: string,
    index: number,
    style: string,
    category: string
  ): Promise<string> => {
    console.log(`[Phase 1] Starting video generation ${index + 1}/${sceneCount} with model: ${selectedModel}, style: ${style}, category: ${category}`);

    // 0. 이미지를 먼저 Firebase Storage에 업로드 (413 에러 방지)
    const timestamp = Date.now();
    console.log(`[Phase 1] Uploading images to Firebase Storage...`);

    const [startImageUrl, endImageUrl] = await Promise.all([
      uploadImageToStorage(startFrame, `start-${index}-${timestamp}.png`),
      uploadImageToStorage(endFrame, `end-${index}-${timestamp}.png`),
    ]);

    console.log(`[Phase 1] Images uploaded:`, { startImageUrl, endImageUrl });

    // 1. Job 시작 요청 (URL만 전송하여 413 에러 방지)
    const startResponse = await fetch('/api/ai/generate-video-startend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startImageUrl,
        endImageUrl,
        model: selectedModel,
        motionStrength: 0.6,
        duration: 10,
        style,    // 추가: 스타일 전달
        category, // 추가: 카테고리 전달
      }),
    });

    if (!startResponse.ok) {
      throw new Error(`영상 생성 시작 실패 (${index + 1}번째)`);
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
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
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

  // [Phase 2] 영상 합성
  const mergeVideos = async (videoUrls: string[]): Promise<string> => {
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

  // 메인 생성 프로세스 (병렬 처리)
  const runMainProcess = useCallback(async () => {
    try {
      setPhase('generating-video');

      // Phase 1: 모든 영상을 병렬로 생성
      console.log(`[Phase 1] Starting parallel video generation for ${sceneCount} scenes`);

      const videoPromises = generatedFrames.map(async (frame, index) => {
        try {
          const videoUrl = await generateStartEndVideo(
            frame.startFrameUrl,
            frame.endFrameUrl,
            frame.message,
            index,
            _data.style || 'fancy',    // style 전달
            _data.category || 'event'  // category 전달
          );

          // 각 영상 완료시 progress 업데이트
          setProgress(prev => {
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
      const failedResults = results.filter(r => !r.success);
      if (failedResults.length > 0) {
        throw new Error(`${failedResults.length}개 영상 생성 실패`);
      }

      // 순서대로 videoUrls 배열 생성
      const videoUrls = results
        .sort((a, b) => a.index - b.index)
        .map(r => r.videoUrl);

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
      onComplete(finalVideoUrl, generatedFrames.map(f => f.message));

    } catch (error) {
      console.error('Generation error:', error);
      setPhase('error');
      setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    }
  }, [sceneCount, generatedFrames, selectedModel, onComplete, _data.style, _data.category]);

  // 컴포넌트 마운트 시 생성 시작
  useEffect(() => {
    if (!generationStartedRef.current) {
      generationStartedRef.current = true;
      runMainProcess();
    }
  }, [runMainProcess]);

  // 진행 상황 계산
  const totalSteps = sceneCount + (sceneCount > 1 ? 1 : 0);
  const completedSteps =
    progress.filter(p => p.videoGenerated).length +
    (phase === 'completed' && sceneCount > 1 ? 1 : 0);
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  // 완료된 영상 개수
  const completedCount = progress.filter(p => p.videoGenerated).length;

  // 현재 상태 메시지
  const getStatusMessage = () => {
    switch (phase) {
      case 'generating-video':
        return `영상 생성 중 (${completedCount}/${sceneCount} 완료)`;
      case 'merging':
        return '영상 합성 중...';
      case 'completed':
        return '생성 완료!';
      case 'error':
        return '오류 발생';
      default:
        return '';
    }
  };

  // 단계 설명
  const getPhaseDescription = () => {
    switch (phase) {
      case 'generating-video':
        return `${sceneCount}개 장면의 영상을 생성하고 있습니다`;
      case 'merging':
        return '영상을 하나로 합치는 중...';
      default:
        return '';
    }
  };

  return (

    <div className="animate-fade-in h-full flex flex-col overflow-hidden">
      {/* 상단 헤더 */}
      <div className="flex-none mb-6 text-center lg:text-left">
        <h1 className="text-3xl font-extrabold text-white mb-2 drop-shadow-sm">
          <span className="text-amber-500 mr-2">Premium</span>
          영상 생성 진행
        </h1>
        <p className="text-gray-400 text-sm">
          여러 개의 장면을 동시에 생성하고 하나로 연결합니다.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">

        {/* Left Side: Real-time Scene Grid (7/12) */}
        <div className="lg:col-span-7 flex flex-col min-h-0">
          <div className="bg-gradient-to-br from-slate-900/80 to-black/80 border border-amber-500/20 rounded-[1.5rem] p-6 backdrop-blur-md flex-1 flex flex-col shadow-[0_0_40px_-10px_rgba(251,191,36,0.05)] overflow-hidden">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold border border-amber-500/20">S</span>
              실시간 장면 생성 현황
            </h3>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              <div className="grid grid-cols-2 gap-4">
                {generatedFrames.map((frame, index) => (
                  <div
                    key={index}
                    className={`relative aspect-video rounded-xl border overflow-hidden transition-all group ${progress[index].videoGenerated
                      ? 'border-green-500/50 shadow-[0_0_15px_-5px_rgba(34,197,94,0.3)]'
                      : phase === 'generating-video'
                        ? 'border-amber-500/50 shadow-[0_0_15px_-5px_rgba(245,158,11,0.3)]'
                        : 'border-white/10 opacity-60'
                      }`}
                  >
                    <Image
                      src={frame.endFrameUrl}
                      alt={`Scene ${index + 1}`}
                      fill
                      className={`object-cover transition-transform duration-700 ${progress[index].videoGenerated ? 'grayscale-0' : 'grayscale'}`}
                    />

                    {/* Status Overlay */}
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2 text-center transition-opacity duration-300">
                      {progress[index].videoGenerated ? (
                        <>
                          <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mb-1 shadow-lg transform scale-100 group-hover:scale-110 transition-transform">✓</div>
                          <span className="text-green-400 text-xs font-bold">생성 완료</span>
                        </>
                      ) : (
                        <>
                          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                          <span className="text-amber-400 text-xs font-bold animate-pulse">작업 중...</span>
                        </>
                      )}
                    </div>

                    {/* Scene Badge */}
                    <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/70 backdrop-blur-sm border border-white/10 text-[10px] text-white font-bold">
                      Scene {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500">
              <span>총 {sceneCount}개 장면 처리 중</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                AI Processing Active
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Overall Progress (5/12) */}
        <div className="lg:col-span-5 flex flex-col h-full gap-4 min-h-0">
          <div className="flex-1 flex flex-col bg-slate-900 border border-amber-500/10 rounded-[1.5rem] overflow-hidden shadow-2xl min-h-0">
            <div className="p-6 pb-4 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-white/5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-amber-500/20 text-white flex items-center justify-center text-sm font-bold border border-amber-500/20">i</span>
                전체 진행 상황
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-4 space-y-8">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm font-bold text-gray-400 mb-2">
                  <span>Total Progress</span>
                  <span className="text-amber-500">{progressPercent}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500 ease-out shadow-[0_0_15px_-2px_rgba(245,158,11,0.5)]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Status Steps */}
              <div className="space-y-4">
                {/* Step 1: Video Gen */}
                <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${phase === 'generating-video' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-transparent border-transparent opacity-50'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${completedCount === sceneCount ? 'bg-green-500 text-white' : phase === 'generating-video' ? 'bg-amber-500 text-black animate-pulse' : 'bg-gray-800 text-gray-500'}`}>
                    {completedCount === sceneCount ? '✓' : '🎬'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">개별 장면 영상 생성</p>
                    <p className="text-xs text-gray-400">{completedCount} / {sceneCount} 완료</p>
                  </div>
                </div>

                {/* Step 2: Merging */}
                <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${phase === 'merging' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-transparent border-transparent opacity-50'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${phase === 'completed' ? 'bg-green-500 text-white' : phase === 'merging' ? 'bg-amber-500 text-black animate-pulse' : 'bg-gray-800 text-gray-500'}`}>
                    {phase === 'completed' ? '✓' : '🔗'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">영상 연결 및 합성</p>
                    <p className="text-xs text-gray-400">{phase === 'completed' ? '완료' : phase === 'merging' ? '처리 중...' : '대기 중'}</p>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-400 leading-relaxed">
                  <span className="text-amber-500 font-bold">Tip:</span> 프리미엄 모드에서는 각 장면을 10초 분량의 고품질 영상으로 생성한 후, 자연스럽게 연결하여 하나의 스토리 영상으로 완성합니다.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions (Error Case) */}
          {phase === 'error' && (
            <div className="flex-none bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <span className="text-red-400 text-sm font-bold line-clamp-1">{errorMessage}</span>
              </div>
              <button
                onClick={onBack}
                className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors"
              >
                돌아가기
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
