'use client';

import { useState } from 'react';
import ResultStep from './steps/ResultStep';
import MultiSceneStep, { SceneData } from './steps/MultiSceneStep';
import TextPreviewStep, { CustomSettings } from './steps/TextPreviewStep';
import MultiSceneGenerationStep from './steps/MultiSceneGenerationStep';
import CompositionInputStep, { CompositionData } from './steps/CompositionInputStep';
import CompositionImagePreviewStep, { GeneratedDualFrame } from './steps/CompositionImagePreviewStep';
import CompositionGenerationStep from './steps/CompositionGenerationStep/index';
import ModeSelectLanding from './ModeSelectLanding';

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
  const [sceneData, setSceneData] = useState<SceneDataType | null>(null);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string>('');

  // Composition 모드용 상태
  const [compositionData, setCompositionData] = useState<CompositionData | null>(null);
  const [compositionFrames, setCompositionFrames] = useState<GeneratedDualFrame[] | null>(null);
  const [compositionMessages, setCompositionMessages] = useState<string[] | null>(null);

  // 모드 선택
  const handleModeSelect = (selectedMode: 'single' | 'composition') => {
    setMode(selectedMode);
    setStep(0);
  };

  // 장면 입력 완료
  const handleSceneSubmit = (data: SceneDataType) => {
    setSceneData(data);
    setStep(1); // 텍스트 프리뷰로 이동
  };

  // 텍스트 프리뷰 완료 (이미지 URL, 커스텀 설정, 수정된 scenes 받아서 저장)
  const handlePreviewComplete = (previewImageUrl: string, customSettings: CustomSettings, scenes: SceneData[]) => {
    setSceneData((prevSceneData) => {
      if (!prevSceneData) return prevSceneData;
      return {
        ...prevSceneData,
        scenes, // 수정된 scenes 업데이트
        previewImageUrl,
        customSettings,
      };
    });
    setStep(2); // 영상 생성으로 이동
  };

  // 영상 생성 완료 핸들러
  const handleGenerationComplete = (videoUrl: string) => {
    setFinalVideoUrl(videoUrl);
    setStep(3); // 결과 화면으로 이동
  };

  // Composition 모드 핸들러들
  const handleCompositionInput = (data: CompositionData) => {
    setCompositionData(data);
    setStep(1); // 이미지 생성/미리보기로 이동
  };

  // 이미지 생성 완료
  const handleCompositionImageComplete = (frames: GeneratedDualFrame[]) => {
    setCompositionFrames(frames);
    setStep(2); // 영상 생성으로 이동
  };

  const handleCompositionGenerationComplete = (videoUrl: string, messages: string[]) => {
    setFinalVideoUrl(videoUrl);
    setCompositionMessages(messages);
    setStep(3); // 결과 화면으로 이동
  };

  const handleReset = () => {
    setMode('select');
    setStep(0);
    setSceneData(null);
    setFinalVideoUrl('');
    // Composition 모드 상태도 초기화
    setCompositionData(null);
    setCompositionFrames(null);
    setCompositionMessages(null);
  };

  // Background style based on mode
  const getBackgroundGradient = () => {
    if (mode === 'composition') return 'bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-[#050505] to-[#050505]';
    if (mode === 'single') return 'bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050505] to-[#050505]';
    return 'bg-[#050505]';
  };

  return (
    <div className={`min-h-screen text-white relative overflow-hidden font-sans selection:bg-blue-500/30 selection:text-white ${getBackgroundGradient()}`}>

      {/* Global Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Animated Aurora */}
        <div className="absolute top-[-50%] left-[-20%] w-[150%] h-[150%] bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-transparent blur-[120px] animate-aurora-flow opacity-60"></div>
        {mode === 'composition' && (
          <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-gradient-to-tl from-amber-600/5 to-transparent blur-[120px] animate-pulse-slow"></div>
        )}

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Navigation / Header (Only visible if not in select mode) */}
        {mode !== 'select' && (
          <header className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6 lg:px-8 border-b border-white/5 backdrop-blur-xl bg-black/50">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
                <span className="text-lg">💠</span>
              </div>
              <span className="font-bold text-lg tracking-tight font-display text-white/90 group-hover:text-white transition-colors">
                FLOWER <span className="font-light text-white/40">HOLOGRAM</span>
              </span>
            </div>

            {/* Progress Steps */}
            <div className="hidden lg:flex items-center gap-1">
              {['설정 입력', '미리보기', '영상 생성', '완료'].map((label, idx) => {
                const isActive = step >= idx;
                const isCurrent = step === idx;
                return (
                  <div key={idx} className="flex items-center">
                    <div className={`
                      flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300
                      ${isCurrent ? 'bg-white/10 text-white border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : isActive ? 'text-white/60' : 'text-white/20'}
                    `}>
                      <div className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-blue-400 animate-pulse' : isActive ? 'bg-white/60' : 'bg-white/20'}`} />
                      {label}
                    </div>
                    {idx < 3 && <div className="w-8 h-[1px] bg-white/5 mx-1" />}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-white/30 px-2 py-1 rounded border border-white/5">
                {mode === 'composition' ? 'PREMIUM AI' : 'STANDARD TEMPLATE'}
              </span>
            </div>
          </header>
        )}

        {/* Main Content Area */}
        <main className={`flex-1 flex flex-col ${mode !== 'select' ? 'pt-20 lg:pt-24 pb-12 px-4 lg:px-12 max-w-[1920px] mx-auto w-full' : ''}`}>

          {/* Animated Transition Wrapper */}
          <div className="w-full h-full flex flex-col animate-fadeIn">

            {/* 모드 선택 화면 */}
            {mode === 'select' && (
              <ModeSelectLanding onSelectMode={handleModeSelect} />
            )}

            {/* 단일 영상 생성 모드 */}
            {mode === 'single' && (
              <>
                {step === 0 && (
                  <MultiSceneStep
                    onNext={handleSceneSubmit}
                    initialData={sceneData || undefined}
                    onBack={() => setMode('select')}
                  />
                )}
                {step === 1 && sceneData && (
                  <TextPreviewStep
                    sceneData={sceneData}
                    onNext={handlePreviewComplete}
                    onBack={() => setStep(0)}
                  />
                )}
                {step === 2 && sceneData && (
                  <MultiSceneGenerationStep
                    sceneData={sceneData}
                    onComplete={handleGenerationComplete}
                    onBack={() => setStep(1)}
                  />
                )}
                {step === 3 && (
                  <ResultStep
                    videoUrl={finalVideoUrl}
                    onReset={handleReset}
                  />
                )}
              </>
            )}

            {/* AI 영상 합성 모드 */}
            {mode === 'composition' && (
              <>
                {step === 0 && (
                  <CompositionInputStep
                    onNext={handleCompositionInput}
                    initialData={compositionData || undefined}
                    onBack={() => setMode('select')}
                  />
                )}
                {step === 1 && compositionData && (
                  <CompositionImagePreviewStep
                    data={compositionData}
                    onNext={handleCompositionImageComplete}
                    onBack={() => setStep(0)}
                  />
                )}
                {step === 2 && compositionData && compositionFrames && (
                  <CompositionGenerationStep
                    data={compositionData}
                    generatedFrames={compositionFrames}
                    onComplete={handleCompositionGenerationComplete}
                    onBack={() => setStep(1)}
                  />
                )}
                {step === 3 && (
                  <ResultStep
                    videoUrl={finalVideoUrl}
                    onReset={handleReset}
                    scenes={compositionMessages?.map((msg, i) => ({ id: i + 1, text: msg, type: 'message' as const })) || undefined}
                    isCompositionMode={true}
                  />
                )}
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
