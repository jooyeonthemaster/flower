'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { CompositionData } from './CompositionInputStep';

// Three.js 컴포넌트는 클라이언트에서만 로드
const Text3DRenderer = dynamic(
  () => import('../Text3DRenderer'),
  { ssr: false, loading: () => <div className="w-full aspect-video bg-black/50 animate-pulse rounded-xl" /> }
);

export interface CompositionCustomSettings {
  primaryColor?: string;
  secondaryColor?: string;
  glowColor?: string;
}

interface CompositionPreviewStepProps {
  data: CompositionData;
  onNext: (customSettings: CompositionCustomSettings) => void;
  onBack: () => void;
}

// 스타일별 기본 색상
const styleDefaultColors: Record<string, CompositionCustomSettings> = {
  elegant: { primaryColor: '#FFD700', secondaryColor: '#FF69B4', glowColor: '#FFB6C1' },
  luxury: { primaryColor: '#FFD700', secondaryColor: '#DAA520', glowColor: '#FFA500' },
  neon: { primaryColor: '#00FFFF', secondaryColor: '#FF00FF', glowColor: '#00FF00' },
  traditional: { primaryColor: '#FF4444', secondaryColor: '#FFD700', glowColor: '#FF6B6B' },
  fantasy: { primaryColor: '#8B5CF6', secondaryColor: '#06B6D4', glowColor: '#A855F7' },
  space: { primaryColor: '#E879F9', secondaryColor: '#7C3AED', glowColor: '#F0ABFC' },
};

export default function CompositionPreviewStep({ data, onNext, onBack }: CompositionPreviewStepProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [customSettings, setCustomSettings] = useState<CompositionCustomSettings>(
    styleDefaultColors[data.style] || styleDefaultColors.elegant
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleColorChange = (key: keyof CompositionCustomSettings, value: string) => {
    setCustomSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    setIsGenerating(true);
    onNext(customSettings);
  };

  const colorInputs = [
    { key: 'primaryColor' as const, label: '메인 색상', desc: '텍스트 주 색상' },
    { key: 'secondaryColor' as const, label: '보조 색상', desc: '테두리/그라데이션' },
    { key: 'glowColor' as const, label: '글로우 색상', desc: '발광 효과' },
  ];

  return (
    <div className="animate-fade-in h-full flex flex-col">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-hidden">

        {/* Left Column: 미리보기 */}
        <div className="lg:col-span-8 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white">3D 텍스트 미리보기</h2>
            <p className="text-purple-200 text-sm">각 장면의 3D 텍스트를 확인하고 색상을 조절하세요</p>
          </div>

          {/* 메인 프리뷰 */}
          <div className="bg-black/50 rounded-2xl p-4 border border-white/10">
            <div className="text-sm text-gray-400 mb-2">
              장면 {selectedIndex + 1} / {data.messages.length}
            </div>
            <Suspense fallback={<div className="w-full aspect-video bg-black/50 animate-pulse rounded-xl" />}>
              <Text3DRenderer
                key={`preview-${selectedIndex}-${JSON.stringify(customSettings)}`}
                text={data.messages[selectedIndex]}
                style={data.style}
                customColors={{
                  primary: customSettings.primaryColor,
                  secondary: customSettings.secondaryColor,
                  glow: customSettings.glowColor,
                }}
                preview={true}
              />
            </Suspense>
            <div className="mt-3 text-center">
              <p className="text-white font-medium">{data.messages[selectedIndex]}</p>
            </div>
          </div>

          {/* 썸네일 선택 */}
          <div className="grid grid-cols-4 gap-3">
            {data.messages.map((message, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                  selectedIndex === index
                    ? 'border-purple-500 ring-2 ring-purple-500/50'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="aspect-video bg-black/80 flex items-center justify-center p-2">
                  <span className="text-xs text-white text-center line-clamp-2">
                    {message.slice(0, 20)}...
                  </span>
                </div>
                <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold text-white">
                  {index + 1}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: 설정 */}
        <div className="lg:col-span-4 space-y-4 overflow-y-auto custom-scrollbar">
          {/* 색상 커스터마이징 */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">색상 커스터마이징</h3>
            <div className="space-y-4">
              {colorInputs.map(({ key, label, desc }) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-white">{label}</label>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                    <div className="relative">
                      <input
                        type="color"
                        value={customSettings[key] || '#FFFFFF'}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border-2 border-white/20"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 프리셋 버튼 */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-400 mb-2">빠른 프리셋</p>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(styleDefaultColors).map(([styleId, colors]) => (
                  <button
                    key={styleId}
                    onClick={() => setCustomSettings(colors)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      data.style === styleId
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {styleId}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 생성 정보 */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <h4 className="font-medium text-purple-200 mb-2">생성 정보</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>• 이미지 4개 생성 (AI 배경 + 3D 텍스트)</li>
              <li>• 영상 4개 생성 (각 5-6초)</li>
              <li>• 최종 영상 합성 (20-24초)</li>
              <li>• 예상 소요 시간: 3-5분</li>
            </ul>
          </div>

          {/* 버튼들 */}
          <div className="space-y-3">
            <button
              onClick={handleNext}
              disabled={isGenerating}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                isGenerating
                  ? 'bg-gray-700 text-gray-400 cursor-wait'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-purple-500/40 hover:-translate-y-1'
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  준비 중...
                </span>
              ) : (
                '영상 생성 시작'
              )}
            </button>

            <button
              onClick={onBack}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              이전 단계로
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
