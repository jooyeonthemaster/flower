'use client'

import { useState } from 'react';
import ResultStep from './steps/ResultStep';
import MultiSceneStep, { SceneData } from './steps/MultiSceneStep';
import TextPreviewStep, { CustomSettings } from './steps/TextPreviewStep';
import MultiSceneGenerationStep from './steps/MultiSceneGenerationStep';
import CompositionInputStep, { CompositionData } from './steps/CompositionInputStep';
import CompositionImagePreviewStep, { GeneratedDualFrame } from './steps/CompositionImagePreviewStep';
import CompositionGenerationStep from './steps/CompositionGenerationStep';
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
    if (sceneData) {
      setSceneData({
        ...sceneData,
        scenes, // 수정된 scenes 업데이트
        previewImageUrl,
        customSettings,
      });
    }
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

  // 이미지 생성 완료 (새로운 핸들러)
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className={`relative z-10 w-full px-6 py-8 max-w-[1800px] mx-auto flex flex-col ${mode === 'select' ? 'min-h-screen' : 'h-[calc(100vh-60px)]'}`}>
        {/* Header */}
        <header className="flex-none flex items-center justify-between mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">AI Custom Hologram</h1>
              <p className="text-xs text-gray-500 tracking-wider">나만의 홀로그램 만들기</p>
            </div>
          </div>

          {/* Step Indicators - 모드에 따라 다르게 표시 */}
          <div className="flex items-center space-x-2">
            {mode !== 'select' && [0, 1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${step === s ? 'bg-blue-500 scale-125' :
                  step > s ? 'bg-blue-900' : 'bg-gray-800'
                  }`}
              />
            ))}
          </div>
        </header>

        {/* Content Area */}
        <main className={`flex-1 flex flex-col ${mode === 'select' ? '' : 'min-h-0 overflow-hidden'}`}>
          {/* 모드 선택 화면 */}
          {mode === 'select' && (
            <ModeSelectLanding onSelectMode={handleModeSelect} />
          )}

          {/* 단일 영상 생성 모드 */}
          {mode === 'single' && step === 0 && (
            <MultiSceneStep
              onNext={handleSceneSubmit}
              initialData={sceneData || undefined}
              onBack={() => setMode('select')}
            />
          )}

          {mode === 'single' && step === 1 && sceneData && (
            <TextPreviewStep
              sceneData={sceneData}
              onNext={handlePreviewComplete}
              onBack={() => setStep(0)}
            />
          )}

          {mode === 'single' && step === 2 && sceneData && (
            <MultiSceneGenerationStep
              sceneData={sceneData}
              onComplete={handleGenerationComplete}
              onBack={() => setStep(1)}
            />
          )}

          {mode === 'single' && step === 3 && (
            <ResultStep
              videoUrl={finalVideoUrl}
              onReset={handleReset}
            />
          )}

          {/* AI 영상 합성 모드 */}
          {mode === 'composition' && step === 0 && (
            <CompositionInputStep
              onNext={handleCompositionInput}
              initialData={compositionData || undefined}
              onBack={() => setMode('select')}
            />
          )}

          {/* Step 1: AI 이미지 생성 + 미리보기 (새로운 컴포넌트) */}
          {mode === 'composition' && step === 1 && compositionData && (
            <CompositionImagePreviewStep
              data={compositionData}
              onNext={handleCompositionImageComplete}
              onBack={() => setStep(0)}
            />
          )}

          {/* Step 2: 영상 생성 (이미지는 이미 생성됨) */}
          {mode === 'composition' && step === 2 && compositionData && compositionFrames && (
            <CompositionGenerationStep
              data={compositionData}
              generatedFrames={compositionFrames}
              onComplete={handleCompositionGenerationComplete}
              onBack={() => setStep(1)}
            />
          )}

          {mode === 'composition' && step === 3 && (
            <ResultStep
              videoUrl={finalVideoUrl}
              onReset={handleReset}
              scenes={compositionMessages?.map((msg, i) => ({ id: i + 1, text: msg, type: 'message' as const })) || undefined}
              isCompositionMode={true}
            />
          )}
        </main>


      </div>
    </div>
  );
}
