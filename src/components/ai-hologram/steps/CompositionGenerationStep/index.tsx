'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CompositionGenerationStepProps, GenerationPhase, SceneProgress } from './types';
import { useVideoGeneration } from './hooks/useVideoGeneration';
import SceneGrid from './components/SceneGrid';
import ProgressPanel from './components/ProgressPanel';

// Premium 모드 색상
const PREMIUM_COLOR = '#E66B33';

// 테스트 모드에서 사용할 모델
const TEST_MODEL = 'kling-2.5-turbo-pro';

export default function CompositionGenerationStep({ data, generatedFrames, onComplete, onBack }: CompositionGenerationStepProps) {
  const [phase, setPhase] = useState<GenerationPhase>('generating-video');
  const [progress, setProgress] = useState<SceneProgress[]>(
    generatedFrames.map(() => ({
      videoGenerated: false,
    }))
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedModel] = useState(TEST_MODEL);
  const generationStartedRef = useRef(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const historyPushedRef = useRef(false);

  const sceneCount = generatedFrames.length;

  const { runMainProcess } = useVideoGeneration({
    generatedFrames,
    model: selectedModel,
    style: data.style || 'fancy',
    category: data.category || 'event',
    setPhase,
    setProgress,
    setErrorMessage,
    onComplete,
  });

  // 컴포넌트 마운트 시 생성 시작
  useEffect(() => {
    if (!generationStartedRef.current) {
      generationStartedRef.current = true;
      runMainProcess();
    }
  }, [runMainProcess]);

  // 경과 시간 타이머
  useEffect(() => {
    if (phase === 'completed' || phase === 'error') return;

    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  // 화면 이탈 경고 (생성 중일 때) - 탭 닫기, 새로고침
  useEffect(() => {
    const isGenerating = phase === 'generating-video' || phase === 'merging';
    if (!isGenerating) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '영상 생성이 진행 중입니다. 페이지를 떠나면 생성이 중단됩니다.';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [phase]);

  // 화면 이탈 경고 (생성 중일 때) - 뒤로가기 버튼
  useEffect(() => {
    const isGenerating = phase === 'generating-video' || phase === 'merging';
    if (!isGenerating) {
      historyPushedRef.current = false;
      return;
    }

    // 더미 히스토리 한 번만 추가
    if (!historyPushedRef.current) {
      window.history.pushState({ generating: true }, '');
      historyPushedRef.current = true;
    }

    const handlePopState = () => {
      const confirmed = window.confirm(
        '영상 생성이 진행 중입니다. 페이지를 떠나면 생성이 중단됩니다.\n\n정말 나가시겠습니까?'
      );
      if (confirmed) {
        window.removeEventListener('popstate', handlePopState);
        historyPushedRef.current = false;
        window.history.back();
      } else {
        window.history.pushState({ generating: true }, '');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [phase]);

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 lg:p-8 overflow-auto">
      {/* 상단 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-none mb-6 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="headline-step" style={{ color: PREMIUM_COLOR }}>PREMIUM</span>
          <span className="text-xl text-gray-300">✦</span>
          <span className="headline-step text-gray-900">영상 생성</span>
        </div>
        <p className="text-gray-500 text-sm md:text-base">여러 개의 장면을 동시에 생성하고 하나로 연결합니다.</p>
      </motion.div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        <SceneGrid generatedFrames={generatedFrames} progress={progress} phase={phase} sceneCount={sceneCount} />
        <ProgressPanel phase={phase} progress={progress} sceneCount={sceneCount} errorMessage={errorMessage} onBack={onBack} elapsedTime={elapsedTime} />
      </div>
    </div>
  );
}
