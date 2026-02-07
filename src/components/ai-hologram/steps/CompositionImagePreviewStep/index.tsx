'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useVideoGeneration } from '../CompositionGenerationStep/hooks/useVideoGeneration';
import { PreviewPanel } from './PreviewPanel';
import { ProgressPanel } from './ProgressPanel';
import { usePageExitWarning, useElapsedTimer } from './hooks';
import { generateImages } from './imageGeneration';
import {
  CompositionData,
  GeneratedDualFrame,
  GenerationPhase,
  GenerationState,
  SceneProgress,
} from './constants';

// Re-export types for backward compatibility
export type { CompositionData, GeneratedDualFrame };

interface CompositionImagePreviewStepProps {
  data: CompositionData;
  onNext: (videoUrl: string, messages: string[]) => void;
  onBack: () => void;
}

export default function CompositionImagePreviewStep({ data, onNext, onBack }: CompositionImagePreviewStepProps) {
  const [generationPhase, setGenerationPhase] = useState<GenerationPhase>('idle');
  const [state, setState] = useState<GenerationState>('idle');
  const [backgroundProgress, setBackgroundProgress] = useState<boolean[]>(data.messages.map(() => false));
  const [textFrameProgress, setTextFrameProgress] = useState<boolean[]>(data.messages.map(() => false));
  const [generatedFrames, setGeneratedFrames] = useState<GeneratedDualFrame[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [videoProgress, setVideoProgress] = useState<SceneProgress[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const generationStartedRef = useRef(false);

  const messageCount = data.messages.length;

  // Custom hooks
  usePageExitWarning(generationPhase);
  useElapsedTimer(generationPhase, startTimeRef, setElapsedTime);

  // 진행률 계산
  const completedBackgrounds = backgroundProgress.filter(Boolean).length;
  const completedTextFrames = textFrameProgress.filter(Boolean).length;
  const completedVideos = videoProgress.filter(p => p.videoGenerated).length;

  const imageProgress = ((completedBackgrounds + completedTextFrames) / (messageCount * 2)) * 40;
  const videoGenerationProgress = (completedVideos / messageCount) * 50;
  const mergeProgress = generationPhase === 'merging-videos' ? 5 : generationPhase === 'done' ? 10 : 0;

  const totalProgress = imageProgress + videoGenerationProgress + mergeProgress;

  // 영상 생성 훅 사용
  const { runMainProcess } = useVideoGeneration({
    generatedFrames,
    model: 'kling-2.5-turbo-pro',
    style: data.style,
    category: data.category,
    setPhase: (phase) => {
      if (phase === 'generating-video') setGenerationPhase('generating-videos');
      if (phase === 'merging') setGenerationPhase('merging-videos');
      if (phase === 'completed') setGenerationPhase('done');
      if (phase === 'error') {
        setState('error');
        setGenerationPhase('idle');
      }
    },
    setProgress: setVideoProgress,
    setErrorMessage: (msg) => {
      setErrorMessage(`영상 생성 실패: ${msg}`);
      setState('error');
    },
    onComplete: (videoUrl, messages) => {
      onNext(videoUrl, messages);
    },
  });

  // 이미지 생성 완료 시 자동으로 영상 생성 시작
  useEffect(() => {
    if (generationPhase === 'images-completed' && generatedFrames.length > 0) {
      const timer = setTimeout(() => {
        console.log('[자동 진행] 영상 생성 시작...');
        setGenerationPhase('generating-videos');
        setVideoProgress(generatedFrames.map(() => ({ videoGenerated: false })));
        runMainProcess();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [generationPhase, generatedFrames, runMainProcess]);

  // 이미지 생성 로직
  const handleGenerateImages = useCallback(async () => {
    if (generationStartedRef.current) return;
    generationStartedRef.current = true;
    startTimeRef.current = Date.now();

    setState('generating');
    setGenerationPhase('background');

    try {
      const frames = await generateImages({
        data,
        setBackgroundProgress,
        setTextFrameProgress,
        onPhaseChange: (phase) => setGenerationPhase(phase),
      });

      setGeneratedFrames(frames);
      setGenerationPhase('images-completed');
      setState('completed');

    } catch (error) {
      console.error('이미지 생성 오류:', error);
      setState('error');
      setGenerationPhase('idle');
      setErrorMessage(error instanceof Error ? error.message : '이미지 생성에 실패했습니다.');
    }
  }, [data]);

  // 다시 시도
  const handleRegenerate = () => {
    generationStartedRef.current = false;
    setGenerationPhase('idle');
    setState('idle');
    setErrorMessage('');
    setBackgroundProgress(data.messages.map(() => false));
    setTextFrameProgress(data.messages.map(() => false));
    setGeneratedFrames([]);
    setVideoProgress([]);
    setElapsedTime(0);
  };

  // 취소 핸들러
  const handleCancel = () => {
    const confirmed = window.confirm(
      '생성을 중단하시겠습니까?\n지금까지의 진행 상황은 저장되지 않습니다.'
    );

    if (confirmed) {
      setState('idle');
      setGenerationPhase('idle');
      onBack();
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar-light p-4 md:p-6 lg:p-8 pb-32">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-none mb-6 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="headline-step text-[#E66B33]">PREMIUM</span>
            <span className="text-xl text-gray-300">✦</span>
            <span className="headline-step text-gray-900">AI 영상 생성</span>
          </div>
          <p className="text-gray-500 text-sm md:text-base">
            AI가 이미지와 영상을 자동으로 생성합니다
          </p>
        </motion.div>

        {/* 메인 2단 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 min-h-[600px]">
          {/* 1. 미리보기 패널 */}
          <PreviewPanel
            generationPhase={generationPhase}
            generatedFrames={generatedFrames}
            messageCount={messageCount}
            onStartGeneration={handleGenerateImages}
          />

          {/* 2. 진행 상황 패널 */}
          <ProgressPanel
            generationPhase={generationPhase}
            state={state}
            totalProgress={totalProgress}
            elapsedTime={elapsedTime}
            errorMessage={errorMessage}
            data={data}
            onBack={onBack}
            onRegenerate={handleRegenerate}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
