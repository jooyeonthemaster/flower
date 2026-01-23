'use client';

import { CompositionImagePreviewStepProps } from './types';
import { useImageGeneration } from './hooks/useImageGeneration';
import PreviewPanel from './components/PreviewPanel';
import ProgressPanel from './components/ProgressPanel';

export type { GeneratedDualFrame } from './types';

export default function CompositionImagePreviewStep({
  data,
  onNext,
  onBack,
}: CompositionImagePreviewStepProps) {
  const {
    state,
    generatedFrames,
    selectedIndex,
    errorMessage,
    generationPhase,
    backgroundProgress,
    textFrameProgress,
    elapsedTime,
    totalProgress,
    messageCount,
    completedBackgrounds,
    completedTextFrames,
    handleGenerateImages,
    handleRegenerate,
    setSelectedIndex,
    formatTime,
  } = useImageGeneration(data);

  const handleNext = () => {
    onNext(generatedFrames);
  };

  return (
    <div className="w-full h-full flex flex-col items-center">

      {/* 타이틀 */}
      <div className="text-center mb-8 animate-fadeIn">
        <h2 className="text-3xl font-display font-bold mb-2 text-gradient-gold">AI 에셋 생성 확인</h2>
        <p className="text-amber-500/60 font-light">AI가 생성한 홀로그램 에셋을 확인하세요.</p>
      </div>

      {/* 메인 2분할 레이아웃 - Dashboard Style (Gold) */}
      <div className="w-full max-w-[1920px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-[calc(100vh-250px)] min-h-[600px]">

        {/* LEFT: Live Preview (7 Col) */}
        <div className="lg:col-span-7 h-full flex flex-col gap-6">
          <div className="flex-1 glass-panel border-amber-500/20 rounded-2xl p-1 overflow-hidden animate-fadeIn relative flex flex-col" style={{ animationDelay: '0.1s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent pointer-events-none"></div>

            <PreviewPanel
              state={state}
              generatedFrames={generatedFrames}
              selectedIndex={selectedIndex}
              messageCount={messageCount}
              generationPhase={generationPhase}
              completedBackgrounds={completedBackgrounds}
              completedTextFrames={completedTextFrames}
              totalProgress={totalProgress}
              errorMessage={errorMessage}
              onGenerateImages={handleGenerateImages}
              onRegenerate={handleRegenerate}
              onSelectIndex={setSelectedIndex}
            />
          </div>
        </div>

        {/* RIGHT: Progress & List (5 Col) */}
        <div className="lg:col-span-5 h-full glass-panel border-amber-500/20 rounded-2xl overflow-hidden flex flex-col animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="p-5 border-b border-amber-500/10 bg-amber-500/5">
            <h3 className="font-display font-bold text-amber-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              생성 대기열 <span className="text-[10px] opacity-50 ml-1 font-normal tracking-widest">QUEUE</span>
            </h3>
          </div>
          <div className="flex-1 overflow-hidden p-6 relative">
            <ProgressPanel
              data={data}
              state={state}
              generatedFrames={generatedFrames}
              selectedIndex={selectedIndex}
              messageCount={messageCount}
              backgroundProgress={backgroundProgress}
              textFrameProgress={textFrameProgress}
              totalProgress={totalProgress}
              elapsedTime={elapsedTime}
              formatTime={formatTime}
              onSelectIndex={setSelectedIndex}
              onBack={onBack}
              onNext={handleNext}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
