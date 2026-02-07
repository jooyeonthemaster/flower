'use client';

import { motion } from 'framer-motion';
import {
  PREMIUM_COLOR,
  GenerationPhase,
  GenerationState,
  categoryLabels,
  styleLabels,
  CompositionData,
} from './constants';

interface ProgressPanelProps {
  generationPhase: GenerationPhase;
  state: GenerationState;
  totalProgress: number;
  elapsedTime: number;
  errorMessage: string;
  data: CompositionData;
  onBack: () => void;
  onRegenerate: () => void;
  onCancel: () => void;
}

export function ProgressPanel({
  generationPhase,
  state,
  totalProgress,
  elapsedTime,
  errorMessage,
  data,
  onBack,
  onRegenerate,
  onCancel,
}: ProgressPanelProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col min-h-0"
    >
      <div className="flex-1 bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex flex-col gap-4">
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: PREMIUM_COLOR }}
          >
            2
          </span>
          <h3 className="text-xl font-bold text-gray-900">진행 상황</h3>
        </div>

        {/* 진행 정보 */}
        <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-200 flex flex-col gap-4 overflow-y-auto custom-scrollbar-light">
          {/* 전체 진행률 */}
          <div>
            <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
              <span>Total Progress</span>
              <span style={{ color: PREMIUM_COLOR }}>{Math.round(totalProgress)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500 ease-out"
                style={{
                  width: `${totalProgress}%`,
                  backgroundColor: PREMIUM_COLOR,
                  boxShadow: `0 0 10px ${PREMIUM_COLOR}60`,
                }}
              />
            </div>

            <div className="mt-3 space-y-1">
              {generationPhase !== 'idle' && generationPhase !== 'done' && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">경과 시간: <span className="text-gray-700 font-mono">{formatTime(elapsedTime)}</span></span>
                  <span className="text-gray-500">전체 예상: <span className="text-green-600">약 5~10분</span></span>
                </div>
              )}
              {generationPhase === 'done' && (
                <div className="text-xs text-green-600">
                  ✓ 총 소요 시간: <span className="font-mono">{formatTime(elapsedTime)}</span>
                </div>
              )}
            </div>
          </div>

          {/* 현재 상태 표시 */}
          <div
            className={`rounded-xl p-4 border-2 transition-all ${
              generationPhase !== 'idle' && generationPhase !== 'done'
                ? 'bg-white'
                : 'bg-transparent border-transparent opacity-60'
            }`}
            style={{
              borderColor: generationPhase !== 'idle' && generationPhase !== 'done' ? `${PREMIUM_COLOR}50` : 'transparent',
            }}
          >
            <p className="text-xs text-gray-500 mb-2 font-bold uppercase">현재 단계</p>
            <div className="flex items-center gap-3">
              {generationPhase !== 'done' && generationPhase !== 'idle' ? (
                <div
                  className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: `${PREMIUM_COLOR} transparent ${PREMIUM_COLOR} ${PREMIUM_COLOR}` }}
                />
              ) : generationPhase === 'done' ? (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500">
                  <span className="text-xl text-white">✓</span>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200">
                  <span className="text-xl">⏸️</span>
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">
                  {generationPhase === 'idle' && '대기 중'}
                  {(generationPhase === 'background' || generationPhase === 'textframe') && 'AI 이미지 생성 중'}
                  {generationPhase === 'images-completed' && '영상 생성 준비 중'}
                  {generationPhase === 'generating-videos' && 'AI 영상 생성 중'}
                  {generationPhase === 'merging-videos' && '최종 합성 중'}
                  {generationPhase === 'done' && '완료'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {generationPhase === 'idle' && '시작 버튼을 눌러주세요'}
                  {(generationPhase === 'background' || generationPhase === 'textframe') && '배경과 텍스트 프레임을 생성합니다'}
                  {generationPhase === 'images-completed' && '잠시 후 자동으로 시작됩니다'}
                  {generationPhase === 'generating-videos' && '각 장면을 영상으로 변환합니다'}
                  {generationPhase === 'merging-videos' && '모든 영상을 하나로 연결합니다'}
                  {generationPhase === 'done' && '모든 작업이 완료되었습니다'}
                </p>
              </div>
            </div>
          </div>

          {/* 설정 정보 */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-xs text-gray-500 mb-2 font-bold uppercase">생성 설정</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">카테고리</p>
                <p className="text-sm font-bold text-gray-700">{categoryLabels[data.category]}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">스타일</p>
                <p className="text-sm font-bold" style={{ color: PREMIUM_COLOR }}>{styleLabels[data.style]}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-1">문구 개수</p>
              <p className="text-sm font-bold text-gray-700">{data.messages.length}개</p>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        {state === 'error' && errorMessage && (
          <div className="flex-none bg-red-50 border border-red-200 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 mr-2">
              <span className="text-lg flex-shrink-0">⚠️</span>
              <span className="text-red-600 text-sm font-bold line-clamp-1">{errorMessage}</span>
            </div>
            <button
              onClick={onRegenerate}
              className="px-3 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
            >
              다시 시도
            </button>
          </div>
        )}

        {generationPhase === 'idle' && (
          <button
            onClick={onBack}
            className="w-full px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
          >
            뒤로가기
          </button>
        )}

        {generationPhase !== 'idle' && generationPhase !== 'done' && state !== 'error' && (
          <div className="flex-none bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 mr-2">
              <span className="text-lg flex-shrink-0">⚠️</span>
              <span className="text-orange-700 text-sm font-bold">생성 중단 시 진행 상황이 저장되지 않습니다</span>
            </div>
            <button
              onClick={onCancel}
              className="px-3 py-2 bg-[#E66B33] text-white text-sm font-bold rounded-lg hover:bg-[#d55a28] transition-colors whitespace-nowrap"
            >
              중단
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
