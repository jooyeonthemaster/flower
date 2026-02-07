'use client';

import { motion } from 'framer-motion';
import { SceneData } from '../MultiSceneStep';
import {
  STANDARD_COLOR,
  formatTime,
  getEstimatedTime,
  getTotalEstimatedTime,
  isPhaseComplete,
  isPhaseActive,
  phases,
  type GenerationPhase,
} from './constants';

interface ProgressDisplayProps {
  currentPhase: GenerationPhase;
  overallProgress: number;
  elapsedTime: number;
  scenes: SceneData[];
  errorMessage: string;
  onBack: () => void;
}

export default function ProgressDisplay({
  currentPhase,
  overallProgress,
  elapsedTime,
  scenes,
  errorMessage,
  onBack,
}: ProgressDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col items-center justify-center min-h-0 w-full"
    >
      <div className="w-full max-w-[600px] flex flex-col gap-4 min-h-0">
        <div className="flex-1 flex flex-col bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-xl min-h-0">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: STANDARD_COLOR }}
              >
                i
              </span>
              진행 상황
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar-light p-5 space-y-6">
            {/* Overall Progress Bar */}
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
                <span>Total Progress</span>
                <span style={{ color: STANDARD_COLOR }}>{Math.round(overallProgress)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500 ease-out"
                  style={{
                    width: `${overallProgress}%`,
                    backgroundColor: STANDARD_COLOR,
                    boxShadow: `0 0 10px ${STANDARD_COLOR}60`,
                  }}
                />
              </div>

              <div className="mt-3 space-y-1">
                {currentPhase !== 'completed' && currentPhase !== 'error' && (
                  <>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">경과 시간: <span className="text-gray-700 font-mono">{formatTime(elapsedTime)}</span></span>
                      <span className="text-gray-500">전체 예상: <span className="text-green-600">{getTotalEstimatedTime()}</span></span>
                    </div>
                    {getEstimatedTime(currentPhase) && (
                      <div className="text-xs text-gray-500">
                        현재 단계 예상: <span style={{ color: STANDARD_COLOR }}>{getEstimatedTime(currentPhase)}</span>
                      </div>
                    )}
                  </>
                )}
                {currentPhase === 'completed' && (
                  <div className="text-xs text-green-600">
                    ✓ 총 소요 시간: <span className="font-mono">{formatTime(elapsedTime)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Steps List */}
            <div className="space-y-3">
              {phases.map((phase) => {
                const isActive = isPhaseActive(currentPhase, phase.id);
                const isDone = isPhaseComplete(currentPhase, phase.id);

                return (
                  <div
                    key={phase.id}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gray-50 border-2'
                        : 'bg-transparent border-2 border-transparent opacity-60'
                    }`}
                    style={{
                      borderColor: isActive ? `${STANDARD_COLOR}50` : 'transparent',
                    }}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm ${
                        isDone
                          ? 'text-white'
                          : isActive
                            ? 'text-white animate-pulse'
                            : 'bg-gray-200 text-gray-500'
                      }`}
                      style={{
                        backgroundColor: isDone || isActive ? STANDARD_COLOR : undefined,
                      }}
                    >
                      {isDone ? '✓' : phase.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{phase.label}</p>
                      {isActive && (
                        <p className="text-xs mt-0.5 animate-pulse" style={{ color: STANDARD_COLOR }}>
                          작업 진행 중...
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Text Info */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-2 font-bold uppercase">포함된 문구</p>
              <div className="space-y-1">
                {scenes.map((scene, idx) => (
                  <div key={idx} className="flex gap-2 text-sm text-gray-600 items-start">
                    <span style={{ color: STANDARD_COLOR }} className="font-bold">{idx + 1}.</span>
                    <span className="opacity-80 line-clamp-1">{scene.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 오류 발생 시 버튼 */}
        {currentPhase === 'error' && (
          <div className="flex-none bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4 flex items-center justify-between">
            <span className="text-red-400 text-sm font-bold flex items-center gap-2">⚠️ {errorMessage}</span>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors"
            >
              돌아가기
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
