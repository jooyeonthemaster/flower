'use client';

import { useState, useEffect, useRef } from 'react';
import { CompositionGenerationStepProps, GenerationPhase, SceneProgress } from './types';
import { useVideoGeneration } from './hooks/useVideoGeneration';
import SceneGrid from './components/SceneGrid';
import ProgressPanel from './components/ProgressPanel';

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

  return (
    <div className="animate-fade-in h-full flex flex-col overflow-hidden">
      {/* 상단 헤더 */}
      <div className="flex-none mb-6 text-center lg:text-left">
        <h1 className="text-3xl font-extrabold text-white mb-2 drop-shadow-sm">
          <span className="text-amber-500 mr-2">Premium</span>
          영상 생성 진행
        </h1>
        <p className="text-gray-400 text-sm">여러 개의 장면을 동시에 생성하고 하나로 연결합니다.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        <SceneGrid generatedFrames={generatedFrames} progress={progress} phase={phase} sceneCount={sceneCount} />
        <ProgressPanel phase={phase} progress={progress} sceneCount={sceneCount} errorMessage={errorMessage} onBack={onBack} />
      </div>
    </div>
  );
}
