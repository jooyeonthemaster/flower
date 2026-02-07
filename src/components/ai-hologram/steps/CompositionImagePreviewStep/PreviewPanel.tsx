'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { PREMIUM_COLOR, GenerationPhase, GeneratedDualFrame } from './constants';

interface PreviewPanelProps {
  generationPhase: GenerationPhase;
  generatedFrames: GeneratedDualFrame[];
  messageCount: number;
  onStartGeneration: () => void;
}

export function PreviewPanel({
  generationPhase,
  generatedFrames,
  messageCount,
  onStartGeneration,
}: PreviewPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-col min-h-0"
    >
      <div className="flex-1 bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex flex-col gap-4">
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: PREMIUM_COLOR }}
          >
            1
          </span>
          <h3 className="text-xl font-bold text-gray-900">미리보기</h3>
        </div>

        {/* 미리보기 내용 */}
        <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden relative flex items-center justify-center min-h-[400px]">
          {/* Idle 상태 */}
          {generationPhase === 'idle' && (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mb-4 shadow-sm">
                <span className="text-4xl">🎨</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI 영상 생성 준비</h3>
              <p className="text-gray-500 text-sm max-w-md mb-6">
                {messageCount}개의 문구로 맞춤형 홀로그램 영상을 생성합니다
              </p>
              <button
                onClick={onStartGeneration}
                className="px-8 py-3 rounded-xl bg-[#E66B33] text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                생성 시작
              </button>
            </div>
          )}

          {/* 생성 중 */}
          {generationPhase !== 'idle' && generationPhase !== 'done' && (
            <div className="w-full h-full flex flex-col items-center justify-center p-6">
              {generatedFrames.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="relative w-20 h-20 mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#E66B33] animate-spin"></div>
                    <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                      <span className="text-2xl animate-pulse">✨</span>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">AI 생성 중...</h3>
                  <p className="text-gray-500 text-sm">잠시만 기다려주세요</p>
                </div>
              ) : (
                <div className="relative w-full h-full rounded-lg overflow-hidden shadow-sm border border-gray-200 group">
                  <Image
                    src={generatedFrames[0].endFrameUrl}
                    alt="Preview"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                        style={{ borderColor: `${PREMIUM_COLOR} transparent ${PREMIUM_COLOR} ${PREMIUM_COLOR}` }}
                      />
                      <div>
                        <p className="text-white font-bold text-sm">미리보기</p>
                        <p className="text-gray-200 text-xs line-clamp-1">{generatedFrames[0].message}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 완료 상태 */}
          {generationPhase === 'done' && generatedFrames.length > 0 && (
            <div className="w-full h-full p-6 flex items-center justify-center">
              <div className="relative w-full h-full rounded-lg overflow-hidden shadow-sm border border-gray-200 group">
                <Image
                  src={generatedFrames[0].endFrameUrl}
                  alt="Final Preview"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: PREMIUM_COLOR }}
                    >
                      <span className="text-lg text-white">✓</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">생성 완료!</p>
                      <p className="text-gray-200 text-xs">영상이 준비되었습니다</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
