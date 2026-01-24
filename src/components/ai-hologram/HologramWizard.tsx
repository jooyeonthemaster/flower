'use client'

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ResultStep from './steps/ResultStep';
import MultiSceneStep, { SceneData } from './steps/MultiSceneStep';
import TextPreviewStep, { CustomSettings } from './steps/TextPreviewStep';
import MultiSceneGenerationStep from './steps/MultiSceneGenerationStep';
import CompositionInputStep, { CompositionData } from './steps/CompositionInputStep';
import CompositionImagePreviewStep, { GeneratedDualFrame } from './steps/CompositionImagePreviewStep';
import CompositionGenerationStep from './steps/CompositionGenerationStep/index';
import ModeSelectLanding from './ModeSelectLanding';
import { FanProgressCompact } from './components/FanProgressIndicator';
import FanSpinTransition from './transitions/FanSpinTransition';
import { useBackgroundMorph } from './hooks/useBackgroundMorph';

// 단일 영상 생성 모드용 (30초, 6개 문구)
interface SceneDataType {
  scenes: SceneData[];
  category: string;
  style: string;
  referenceImage?: string;
  previewImageUrl?: string;
  customSettings?: CustomSettings;
}

type WizardMode = 'select' | 'single' | 'composition';

export default function HologramWizard() {
  const [mode, setMode] = useState<WizardMode>('select');
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [sceneData, setSceneData] = useState<SceneDataType | null>(null);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string>('');
  const [isExiting, setIsExiting] = useState(false); // exit 애니메이션 상태
  const [exitingMode, setExitingMode] = useState<WizardMode>('select'); // exit 중 이전 모드 보존

  // Composition 모드용 상태
  const [compositionData, setCompositionData] = useState<CompositionData | null>(null);
  const [compositionFrames, setCompositionFrames] = useState<GeneratedDualFrame[] | null>(null);
  const [compositionMessages, setCompositionMessages] = useState<string[] | null>(null);

  // Background morph hook
  const { containerClass, isDark } = useBackgroundMorph({ currentStep: step, mode });

  // Step navigation helpers
  const goToStep = useCallback((newStep: number) => {
    setDirection(newStep > step ? 'forward' : 'backward');
    setStep(newStep);
  }, [step]);

  // 모드 선택
  const handleModeSelect = (selectedMode: 'single' | 'composition') => {
    setMode(selectedMode);
    setStep(0);
    setDirection('forward');
  };

  // 장면 입력 완료
  const handleSceneSubmit = (data: SceneDataType) => {
    setSceneData(data);
    goToStep(1);
  };

  // 텍스트 프리뷰 완료
  const handlePreviewComplete = (previewImageUrl: string, customSettings: CustomSettings, scenes: SceneData[]) => {
    setSceneData((prevSceneData) => {
      if (!prevSceneData) return prevSceneData;
      return {
        ...prevSceneData,
        scenes,
        previewImageUrl,
        customSettings,
      };
    });
    goToStep(2);
  };

  // 영상 생성 완료 핸들러
  const handleGenerationComplete = (videoUrl: string) => {
    setFinalVideoUrl(videoUrl);
    goToStep(3);
  };

  // Composition 모드 핸들러들
  const handleCompositionInput = (data: CompositionData) => {
    setCompositionData(data);
    goToStep(1);
  };

  const handleCompositionImageComplete = (frames: GeneratedDualFrame[]) => {
    setCompositionFrames(frames);
    goToStep(2);
  };

  const handleCompositionGenerationComplete = (videoUrl: string, messages: string[]) => {
    setFinalVideoUrl(videoUrl);
    setCompositionMessages(messages);
    goToStep(3);
  };

  const handleReset = () => {
    // 뒤로가기 애니메이션을 위해 direction을 backward로 설정하고 현재 모드 보존
    setDirection('backward');
    setExitingMode(mode);
    setIsExiting(true);

    // exit 애니메이션 완료 후 모드 변경 (애니메이션 시간: 500ms)
    setTimeout(() => {
      setMode('select');
      setStep(0);
      setSceneData(null);
      setFinalVideoUrl('');
      setCompositionData(null);
      setCompositionFrames(null);
      setCompositionMessages(null);
      setIsExiting(false);
    }, 550);
  };

  // Step labels
  const stepLabels = ['설정 입력', '미리보기', '생성 중', '완료'];
  // exit 애니메이션 중에는 이전 모드 사용
  const activeMode = isExiting ? exitingMode : mode;
  const isPremium = activeMode === 'composition';

  // Render step content
  const renderStepContent = () => {
    if (activeMode === 'single') {
      switch (step) {
        case 0:
          return (
            <MultiSceneStep
              onNext={handleSceneSubmit}
              initialData={sceneData || undefined}
              onBack={() => setMode('select')}
            />
          );
        case 1:
          return sceneData ? (
            <TextPreviewStep
              sceneData={sceneData}
              onNext={handlePreviewComplete}
              onBack={() => goToStep(0)}
            />
          ) : null;
        case 2:
          return sceneData ? (
            <MultiSceneGenerationStep
              sceneData={sceneData}
              onComplete={handleGenerationComplete}
              onBack={() => goToStep(1)}
            />
          ) : null;
        case 3:
          return (
            <ResultStep
              videoUrl={finalVideoUrl}
              onReset={handleReset}
            />
          );
      }
    }

    if (activeMode === 'composition') {
      switch (step) {
        case 0:
          return (
            <CompositionInputStep
              onNext={handleCompositionInput}
              initialData={compositionData || undefined}
              onBack={() => setMode('select')}
            />
          );
        case 1:
          return compositionData ? (
            <CompositionImagePreviewStep
              data={compositionData}
              onNext={handleCompositionImageComplete}
              onBack={() => goToStep(0)}
            />
          ) : null;
        case 2:
          return compositionData && compositionFrames ? (
            <CompositionGenerationStep
              data={compositionData}
              generatedFrames={compositionFrames}
              onComplete={handleCompositionGenerationComplete}
              onBack={() => goToStep(1)}
            />
          ) : null;
        case 3:
          return (
            <ResultStep
              videoUrl={finalVideoUrl}
              onReset={handleReset}
              scenes={compositionMessages?.map((msg, i) => ({ id: i + 1, text: msg, type: 'message' as const })) || undefined}
              isCompositionMode={true}
            />
          );
      }
    }

    return null;
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ${mode === 'select' ? 'bg-cream' : containerClass}`}>

      {/* 모드 선택 화면 */}
      {mode === 'select' && !isExiting && (
        <ModeSelectLanding onSelectMode={handleModeSelect} />
      )}

      {/* Wizard Steps */}
      {(mode !== 'select' || isExiting) && (
        <div className="min-h-screen flex flex-col">

          {/* Header */}
          <header className={`flex-none px-4 md:px-6 py-3 md:py-4 flex items-center justify-between border-b z-50 transition-colors duration-500 ${
            isDark
              ? 'border-white/10 bg-black/50 backdrop-blur-md'
              : 'border-gray-200 bg-white/80 backdrop-blur-md'
          }`}>
            {/* Logo & Mode */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset}>
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                style={{
                  backgroundColor: isPremium ? 'rgba(230, 107, 51, 0.1)' : 'rgba(138, 154, 91, 0.1)',
                  border: `1px solid ${isPremium ? 'rgba(230, 107, 51, 0.3)' : 'rgba(138, 154, 91, 0.3)'}`,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPremium ? (
                  <span className="text-xl">✨</span>
                ) : (
                  <span className="text-xl">💠</span>
                )}
              </motion.div>
              <div>
                <h1 className={`text-base md:text-lg font-bold tracking-tight leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  FLOWER HOLOGRAM
                </h1>
                <span
                  className="text-[10px] font-mono tracking-widest"
                  style={{ color: isPremium ? '#E66B33' : '#8A9A5B' }}
                >
                  {isPremium ? 'PREMIUM AI ENGINE' : 'STANDARD TEMPLATE'}
                </span>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="hidden md:flex items-center gap-4">
              <FanProgressCompact
                currentStep={step}
                totalSteps={4}
                isPremium={isPremium}
              />
            </div>

            {/* Exit Button */}
            <motion.button
              onClick={handleReset}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                isDark
                  ? 'text-gray-400 hover:text-white border border-white/10 hover:bg-white/5'
                  : 'text-gray-500 hover:text-gray-900 border border-gray-200 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              나가기
            </motion.button>
          </header>

          {/* Step Label (Mobile) */}
          <div className="md:hidden flex items-center justify-center py-3 border-b border-gray-200/50">
            <FanProgressCompact
              currentStep={step}
              totalSteps={4}
              isPremium={isPremium}
            />
            <span className={`ml-3 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>
              {stepLabels[step]}
            </span>
          </div>

          {/* Main Content */}
          <main className="flex-1 relative overflow-hidden">
            <FanSpinTransition
              stepKey={isExiting ? `${activeMode}-exit` : `${activeMode}-${step}`}
              direction={direction}
              isPremium={isPremium}
            >
              <div className="w-full h-full">
                {renderStepContent()}
              </div>
            </FanSpinTransition>
          </main>
        </div>
      )}
    </div>
  );
}
