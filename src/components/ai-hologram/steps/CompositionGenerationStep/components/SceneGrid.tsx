'use client'

import Image from 'next/image';
import { GeneratedDualFrame } from '../../CompositionImagePreviewStep';
import { GenerationPhase, SceneProgress } from '../types';

// Premium 모드 색상
const PREMIUM_COLOR = '#E66B33';

interface SceneGridProps {
  generatedFrames: GeneratedDualFrame[];
  progress: SceneProgress[];
  phase: GenerationPhase;
  sceneCount: number;
}

export default function SceneGrid({ generatedFrames, progress, phase, sceneCount }: SceneGridProps) {
  return (
    <div className="lg:col-span-7 flex flex-col min-h-0">
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 flex-1 flex flex-col shadow-lg overflow-hidden">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ backgroundColor: PREMIUM_COLOR }}
          >
            S
          </span>
          실시간 장면 생성 현황
        </h3>

        <div className="flex-1 overflow-y-auto custom-scrollbar-light pr-2">
          <div className="grid grid-cols-2 gap-4">
            {generatedFrames.map((frame, index) => (
              <div
                key={index}
                className={`relative aspect-video rounded-xl border-2 overflow-hidden transition-all group ${
                  progress[index].videoGenerated
                    ? 'border-green-500/50 shadow-[0_0_15px_-5px_rgba(34,197,94,0.3)]'
                    : phase === 'generating-video'
                      ? 'border-[#E66B33]/50 shadow-[0_0_15px_-5px_rgba(230,107,51,0.3)]'
                      : 'border-gray-300 opacity-60'
                }`}
              >
                <Image
                  src={frame.endFrameUrl}
                  alt={`Scene ${index + 1}`}
                  fill
                  className={`object-cover transition-transform duration-700 ${progress[index].videoGenerated ? 'grayscale-0' : 'grayscale'}`}
                />

                {/* Status Overlay */}
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-2 text-center transition-opacity duration-300">
                  {progress[index].videoGenerated ? (
                    <>
                      <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mb-1 shadow-lg transform scale-100 group-hover:scale-110 transition-transform">
                        ✓
                      </div>
                      <span className="text-green-300 text-xs font-bold">생성 완료</span>
                    </>
                  ) : (
                    <>
                      <div
                        className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mb-2"
                        style={{ borderColor: `${PREMIUM_COLOR} transparent ${PREMIUM_COLOR} ${PREMIUM_COLOR}` }}
                      />
                      <span className="text-xs font-bold animate-pulse" style={{ color: PREMIUM_COLOR }}>
                        작업 중...
                      </span>
                    </>
                  )}
                </div>

                {/* Scene Badge */}
                <div className="absolute top-2 left-2 px-2 py-1 rounded bg-white/90 backdrop-blur-sm border border-gray-300 text-[10px] text-gray-900 font-bold">
                  Scene {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
          <span>총 {sceneCount}개 장면 처리 중</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: PREMIUM_COLOR }} />
            AI Processing Active
          </span>
        </div>
      </div>
    </div>
  );
}
