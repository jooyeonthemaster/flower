'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Remotion Player는 클라이언트 사이드에서만 로드
const HologramPreviewPlayer = dynamic(
  () => import('../HologramPreviewPlayer'),
  { ssr: false, loading: () => <div className="w-full aspect-square bg-gray-800 rounded-xl animate-pulse" /> }
);

interface PreviewStepProps {
  videoUrl: string;
  texts: string[];
  onConfirm: () => void;
  onEditTexts: () => void;
  onBack: () => void;
}

export default function PreviewStep({
  videoUrl,
  texts,
  onConfirm,
  onEditTexts,
  onBack
}: PreviewStepProps) {
  const [isRendering, setIsRendering] = useState(false);

  const handleConfirm = async () => {
    setIsRendering(true);
    // 실제 렌더링 로직은 onConfirm에서 처리
    onConfirm();
  };

  return (
    <div className="animate-fade-in h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center max-w-4xl mx-auto w-full">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">최종 미리보기</h2>
          <p className="text-blue-300">영상이 마음에 드시면 확정해주세요</p>
        </div>

        {/* Player */}
        <div className="w-full max-w-md mb-6">
          <HologramPreviewPlayer
            videoSrc={videoUrl}
            texts={texts}
            width={400}
            height={400}
            autoPlay={true}
            loop={true}
            showControls={true}
          />
        </div>

        {/* Text List */}
        <div className="w-full max-w-md mb-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-300">텍스트 내용</h3>
              <button
                onClick={onEditTexts}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                수정하기
              </button>
            </div>
            <div className="space-y-2">
              {texts.map((text, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500 w-6">{index + 1}.</span>
                  <span className="text-white">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="w-full max-w-md mb-6">
          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
            <p className="text-sm text-yellow-300">
              <strong>안내:</strong> 미리보기는 실시간 렌더링입니다.
              확정하면 최종 영상 파일이 생성됩니다.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full max-w-md flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
            disabled={isRendering}
          >
            이전
          </button>
          <button
            onClick={handleConfirm}
            disabled={isRendering}
            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:opacity-90 transition-all font-medium disabled:opacity-50"
          >
            {isRendering ? '처리 중...' : '확정하기'}
          </button>
        </div>

      </div>
    </div>
  );
}
