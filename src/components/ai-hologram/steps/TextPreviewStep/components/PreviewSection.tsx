'use client';

import { useMemo } from 'react';
import { CanvasPreview, type PreviewConfig } from '../../../CanvasPreview';
import type { EffectType, TextPosition, CharEffectMode } from '@/lib/canvas-renderer';
import { SceneData } from '../../MultiSceneStep';
import { CustomSettings } from '../types';

// Standard 모드 색상
const STANDARD_COLOR = '#8A9A5B';

interface PreviewSectionProps {
  previewVideoUrl: string;
  referenceImage?: string;
  scenes: SceneData[];
  customSettings: CustomSettings;
  filledCount: number;
  onBack: () => void;
  onNext: () => void;
}

export default function PreviewSection({
  previewVideoUrl,
  referenceImage,
  scenes,
  customSettings,
  filledCount,
  onBack,
  onNext,
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
    <div className="h-full bg-white rounded-2xl p-5 flex flex-col shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
          style={{ backgroundColor: STANDARD_COLOR }}
        >
          3
        </span>
        <h3 className="text-xl font-bold text-gray-900">실시간 미리보기</h3>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-xl border-2 border-gray-200 overflow-hidden p-2">
        {previewVideoUrl && (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-full max-w-[360px] aspect-square shadow-xl rounded-xl overflow-hidden ring-2 ring-gray-200">
              <CanvasPreview
                config={previewConfig}
                width={1080}
                height={1080}
                autoPlay
                showControls={false}
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

