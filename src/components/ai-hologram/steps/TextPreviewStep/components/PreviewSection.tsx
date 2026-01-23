'use client';

import { useMemo } from 'react';
import { CanvasPreview, type PreviewConfig } from '../../../CanvasPreview';
import type { EffectType, TextPosition, CharEffectMode } from '@/lib/canvas-renderer';
import { SceneData } from '../../MultiSceneStep';
import { CustomSettings } from '../types';

interface PreviewSectionProps {
  previewVideoUrl: string;
  referenceImage?: string;
  scenes: SceneData[];
  customSettings: CustomSettings;
  filledCount: number;
  onBack: () => void;
  onNext: () => void;
  hideButtons?: boolean;
}

export default function PreviewSection({
  previewVideoUrl,
  referenceImage,
  scenes,
  customSettings,
  filledCount,
  onBack,
  onNext,
  hideButtons = false,
}: PreviewSectionProps) {
  // Canvas 미리보기 설정
  const previewConfig: PreviewConfig = useMemo(() => ({
    texts: scenes.map(s => s.text),
    effects: [
      ...(customSettings.effects || []),
      ...(customSettings.letterEffect && customSettings.letterEffect !== 'none' ? [customSettings.letterEffect] : [])
    ] as EffectType[],
    textPosition: customSettings.textPosition as TextPosition,
    charEffectMode: 'all' as CharEffectMode,
    fontFamily: customSettings.fontFamily,
    fontSize: customSettings.fontSize || 50,
    textColor: customSettings.textColor,
    glowColor: customSettings.glowColor,
    videoSrc: previewVideoUrl,
    referenceImageSrc: referenceImage,
  }), [scenes, customSettings, previewVideoUrl, referenceImage]);

  return (
    <div className="w-full h-full flex flex-col">
      {!hideButtons && (
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2 flex-none">
          <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">3</span>
          실시간 미리보기
        </h3>
      )}

      <div className="flex-1 flex items-center justify-center overflow-hidden">
        {previewVideoUrl && (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-full max-w-[500px] aspect-square shadow-2xl rounded-xl overflow-hidden ring-1 ring-white/10 group">
              <CanvasPreview
                config={previewConfig}
                width={1080}
                height={1080}
                autoPlay
                showControls={false}
              />
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          </div>
        )}
      </div>

      {/* 액션 버튼 (hideButtons가 false일 때만 표시) */}
      {!hideButtons && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-blue-500/10 flex-none">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors bg-white/5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={onNext}
            disabled={filledCount === 0}
            className={`flex-1 h-10 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${filledCount === 0
              ? 'bg-slate-800/50 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white hover:scale-[1.02] shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)]'
              }`}
          >
            영상 생성하기
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
