'use client';

import Image from 'next/image';
import { CompositionData } from '../../CompositionInputStep';
import { GeneratedDualFrame, GenerationState } from '../types';
import { categoryLabels, styleLabels, TEST_MODE } from '../constants';

interface ProgressPanelProps {
  data: CompositionData;
  state: GenerationState;
  generatedFrames: GeneratedDualFrame[];
  selectedIndex: number;
  messageCount: number;
  backgroundProgress: boolean[];
  textFrameProgress: boolean[];
  totalProgress: number;
  elapsedTime: number;
  formatTime: (seconds: number) => string;
  onSelectIndex: (index: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function ProgressPanel({
  data,
  state,
  generatedFrames,
  selectedIndex,
  messageCount,
  backgroundProgress,
  textFrameProgress,
  totalProgress,
  elapsedTime,
  formatTime,
  onSelectIndex,
  onBack,
  onNext,
}: ProgressPanelProps) {
  return (
    <div className="flex flex-col h-full w-full gap-4">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-5 px-1">

        {/* Progress Bar (Generating only) */}
        {state === 'generating' && (
          <ProgressBar
            totalProgress={totalProgress}
            elapsedTime={elapsedTime}
            formatTime={formatTime}
          />
        )}

        {/* Info Summary */}
        <InfoSummary category={data.category} style={data.style} />

        {/* Processing Queue List */}
        <ProcessingQueue
          messages={data.messages}
          messageCount={messageCount}
          state={state}
          backgroundProgress={backgroundProgress}
          textFrameProgress={textFrameProgress}
          generatedFrames={generatedFrames}
          selectedIndex={selectedIndex}
          onSelectIndex={onSelectIndex}
        />

        {/* Success Message */}
        {state === 'completed' && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2 animate-fadeIn">
            <span className="text-green-400">✓</span>
            <div className="text-xs">
              <span className="text-gray-300">작업 완료</span>
              <span className="text-gray-500 mx-2">|</span>
              <span className="text-green-400 font-mono">{formatTime(elapsedTime)}</span>
            </div>
          </div>
        )}

        {/* Test Mode Warning */}
        {TEST_MODE && (
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300/80 leading-relaxed">
            <span className="font-bold mr-1">ⓘ TEST MODE:</span>
            Single frame generation for optimization.
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <ActionButtons
        state={state}
        onBack={onBack}
        onNext={onNext}
      />
    </div>
  );
}

function ProgressBar({
  totalProgress,
  elapsedTime,
  formatTime,
}: {
  totalProgress: number;
  elapsedTime: number;
  formatTime: (seconds: number) => string;
}) {
  return (
    <div className="bg-black/20 rounded-xl p-4 border border-white/5 animate-fadeIn">
      <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
        <span>진행률 (Progress)</span>
        <span className="text-amber-500">{Math.round(totalProgress)}%</span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden border border-white/5 mb-3">
        <div
          className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]"
          style={{ width: `${totalProgress}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-500 font-mono">
        <span>TIME: <span className="text-gray-300">{formatTime(elapsedTime)}</span></span>
        <span>EST: <span className="text-gray-300">~60s</span></span>
      </div>
    </div>
  );
}

function InfoSummary({ category, style }: { category: string; style: string }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">카테고리</p>
        <p className="text-sm font-bold text-gray-200">{categoryLabels[category]}</p>
      </div>
      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">스타일</p>
        <p className="text-sm font-bold text-amber-500">{styleLabels[style]}</p>
      </div>
    </div>
  );
}

function ProcessingQueue({
  messages,
  messageCount,
  state,
  backgroundProgress,
  textFrameProgress,
  generatedFrames,
  selectedIndex,
  onSelectIndex,
}: {
  messages: string[];
  messageCount: number;
  state: GenerationState;
  backgroundProgress: boolean[];
  textFrameProgress: boolean[];
  generatedFrames: GeneratedDualFrame[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
}) {
  return (
    <div>
      <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-3 flex items-center justify-between tracking-wider">
        <span>대기열 상태 (Queue)</span>
        <span className={generatedFrames.length === messageCount ? 'text-green-500' : 'text-amber-500'}>
          {generatedFrames.length} / {messageCount}
        </span>
      </h4>
      <div className="space-y-2">
        {messages.slice(0, messageCount).map((msg, idx) => {
          const bgDone = backgroundProgress[idx];
          const textDone = textFrameProgress[idx];
          const isProcessing = state === 'generating' && (!bgDone || !textDone);
          const hasFrame = generatedFrames[idx];

          return (
            <div
              key={idx}
              onClick={() => hasFrame && onSelectIndex(idx)}
              className={`group p-3 rounded-xl border flex items-center gap-3 transition-all ${hasFrame
                ? selectedIndex === idx
                  ? 'bg-amber-500/20 border-amber-500/50'
                  : 'bg-white/5 border-transparent hover:bg-white/10 cursor-pointer'
                : isProcessing
                  ? 'bg-amber-500/5 border-amber-500/20'
                  : 'bg-white/5 border-transparent opacity-40'
                }`}
            >
              {/* Status Icon */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all flex-none ${hasFrame ? 'bg-amber-500 text-black shadow-lg scale-105' : 'bg-gray-800 text-gray-500'
                }`}>
                {hasFrame ? '✓' : idx + 1}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${hasFrame ? 'text-gray-200' : 'text-gray-500'}`}>{msg}</p>
                {state === 'generating' && !hasFrame && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                    <p className="text-[10px] text-amber-500/80">
                      {!bgDone ? '기본 이미지 생성 중...' : '텍스트 합성 중...'}
                    </p>
                  </div>
                )}
              </div>

              {/* Thumbnail Preview */}
              {hasFrame && (
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 relative flex-none group-hover:border-white/30 transition-colors">
                  <Image src={generatedFrames[idx].endFrameUrl} alt="" fill className="object-cover" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActionButtons({
  state,
  onBack,
  onNext,
}: {
  state: GenerationState;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex gap-3 pt-2">
      <button
        onClick={onBack}
        disabled={state === 'generating'}
        className="h-14 px-6 rounded-xl flex items-center justify-center border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
      >
        이전
      </button>
      <button
        onClick={onNext}
        disabled={state !== 'completed'}
        className={`flex-1 h-14 rounded-xl font-bold text-base shadow-lg flex items-center justify-center gap-2 transition-all ${state === 'completed'
          ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)] hover:scale-[1.02] hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.5)]'
          : 'bg-slate-800 text-gray-500 cursor-not-allowed border border-white/5'
          }`}
      >
        <span>최종 영상 생성</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      </button>
    </div>
  );
}
