'use client';

import Image from 'next/image';
import { GeneratedDualFrame, GenerationState, GenerationPhase } from '../types';

interface PreviewPanelProps {
  state: GenerationState;
  generatedFrames: GeneratedDualFrame[];
  selectedIndex: number;
  messageCount: number;
  generationPhase: GenerationPhase;
  completedBackgrounds: number;
  completedTextFrames: number;
  totalProgress: number;
  errorMessage: string;
  onGenerateImages: () => void;
  onRegenerate: () => void;
  onSelectIndex: (index: number) => void;
}

export default function PreviewPanel({
  state,
  generatedFrames,
  selectedIndex,
  messageCount,
  generationPhase,
  completedBackgrounds,
  completedTextFrames,
  totalProgress,
  errorMessage,
  onGenerateImages,
  onRegenerate,
  onSelectIndex,
}: PreviewPanelProps) {
  return (
    <div className="w-full h-full flex flex-col relative z-10">
      {/* State Switcher */}
      <div className="w-full h-full flex flex-col items-center justify-center p-4">

        {state === 'idle' && (
          <IdleView messageCount={messageCount} onGenerate={onGenerateImages} />
        )}

        {state === 'generating' && (
          <GeneratingView
            generationPhase={generationPhase}
            completedBackgrounds={completedBackgrounds}
            completedTextFrames={completedTextFrames}
            messageCount={messageCount}
            totalProgress={totalProgress}
          />
        )}

        {state === 'error' && (
          <ErrorView errorMessage={errorMessage} onRetry={onRegenerate} />
        )}

        {(state === 'completed' || (state === 'generating' && generatedFrames.length > 0)) && generatedFrames.length > 0 && (
          <ImageViewer
            generatedFrames={generatedFrames}
            selectedIndex={selectedIndex}
            messageCount={messageCount}
            isGenerating={state === 'generating'}
            onSelectIndex={onSelectIndex}
          />
        )}
      </div>
    </div>
  );
}

function IdleView({ messageCount, onGenerate }: { messageCount: number; onGenerate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center animate-fadeIn">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 flex items-center justify-center mb-6 shadow-[0_0_50px_-10px_rgba(245,158,11,0.2)]">
        <span className="text-5xl filter drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">🎨</span>
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">AI 이미지 생성 준비</h3>
      <p className="text-gray-400 max-w-sm mb-10 leading-relaxed text-sm">
        입력하신 <span className="text-amber-400 font-bold">{messageCount}개의 문구</span>를 분석하여<br />
        가장 완벽한 3D 아트웍을 생성합니다.
      </p>
      <button
        onClick={onGenerate}
        className="px-12 py-5 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black font-extrabold text-lg shadow-[0_0_30px_-5px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_-5px_rgba(245,158,11,0.6)] hover:scale-105 transition-all"
      >
        에셋 생성 시작 (START)
      </button>
    </div>
  );
}

function GeneratingView({
  generationPhase,
  completedBackgrounds,
  completedTextFrames,
  messageCount,
  totalProgress,
}: {
  generationPhase: GenerationPhase;
  completedBackgrounds: number;
  completedTextFrames: number;
  messageCount: number;
  totalProgress: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center animate-fadeIn w-full max-w-md">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-amber-500/10"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-500 animate-spin"></div>
        <div className="absolute inset-4 rounded-full bg-amber-500/5 flex items-center justify-center backdrop-blur-sm">
          <span className="text-4xl animate-pulse">✨</span>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-white mb-2">AI 에셋 생성 중...</h3>
      <p className="text-amber-500/80 mb-6 font-mono text-sm tracking-wider uppercase">
        {generationPhase === 'background' ? '1단계. 배경 생성 분석 (BACKGROUND)' : '2단계. 텍스트 합성 처리 (COMPOSITING)'}
      </p>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-white/5 mb-2">
        <div
          className="h-full bg-gradient-to-r from-amber-600 to-amber-400 relative overflow-hidden"
          style={{ width: `${totalProgress}%`, transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_1s_infinite] skew-x-[-20deg]"></div>
        </div>
      </div>
      <div className="flex justify-between w-full text-xs font-mono text-gray-500">
        <span>처리 중 (PROCESSING)</span>
        <span>{Math.round(totalProgress)}%</span>
      </div>
    </div>
  );
}

function ErrorView({ errorMessage, onRetry }: { errorMessage: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center animate-fadeIn">
      <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6">
        <span className="text-4xl">⚠️</span>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">생성 실패</h3>
      <p className="text-red-400 max-w-md mb-8 text-sm bg-red-950/30 px-4 py-2 rounded">
        {errorMessage || '알 수 없는 오류가 발생했습니다.'}
      </p>
      <button
        onClick={onRetry}
        className="px-8 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all font-bold"
      >
        다시 시도
      </button>
    </div>
  );
}

function ImageViewer({
  generatedFrames,
  selectedIndex,
  messageCount,
  isGenerating,
  onSelectIndex,
}: {
  generatedFrames: GeneratedDualFrame[];
  selectedIndex: number;
  messageCount: number;
  isGenerating: boolean;
  onSelectIndex: (index: number) => void;
}) {
  return (
    <div className="w-full h-full flex flex-col gap-4 animate-fadeIn">
      {/* Main Image - Full Size */}
      <div className="flex-1 relative flex items-center justify-center bg-black/40 rounded-xl overflow-hidden group border border-white/5">
        <div className="relative w-full h-full max-h-full aspect-square">
          <Image
            src={generatedFrames[selectedIndex].endFrameUrl}
            alt={`Scene ${selectedIndex + 1}`}
            fill
            className="object-contain"
          />
        </div>

        {/* Navigation Overlays */}
        <button
          onClick={() => onSelectIndex(Math.max(0, selectedIndex - 1))}
          disabled={selectedIndex === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 text-white backdrop-blur-md border border-white/5 hover:bg-amber-500/20 hover:border-amber-500/50 disabled:hidden transition-all group/nav"
        >
          <span className="group-hover/nav:-translate-x-1 transition-transform block">←</span>
        </button>
        <button
          onClick={() => onSelectIndex(Math.min(generatedFrames.length - 1, selectedIndex + 1))}
          disabled={selectedIndex === generatedFrames.length - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 text-white backdrop-blur-md border border-white/5 hover:bg-amber-500/20 hover:border-amber-500/50 disabled:hidden transition-all group/nav"
        >
          <span className="group-hover/nav:translate-x-1 transition-transform block">→</span>
        </button>
      </div>

      {/* Thumbnails */}
      <div className="h-24 flex-none flex gap-3 overflow-x-auto custom-scrollbar px-1 py-1">
        {generatedFrames.map((frame, index) => (
          <button
            key={index}
            onClick={() => onSelectIndex(index)}
            className={`relative aspect-square h-full rounded-lg overflow-hidden border-2 transition-all ${selectedIndex === index
              ? 'border-amber-500 ring-2 ring-amber-500/20 scale-[1.05] z-10'
              : 'border-white/10 opacity-60 hover:opacity-100'
              }`}
          >
            <Image
              src={frame.endFrameUrl}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
            <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">
              {index + 1}
            </div>
          </button>
        ))}
        {isGenerating && Array.from({ length: messageCount - generatedFrames.length }).map((_, i) => (
          <div key={`idx-${i}`} className="aspect-square h-full rounded-lg bg-white/5 border border-white/5 flex items-center justify-center animate-pulse">
            <div className="w-5 h-5 border-2 border-white/10 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
