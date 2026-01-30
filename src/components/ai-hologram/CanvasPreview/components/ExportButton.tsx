/**
 * 내보내기 버튼 컴포넌트
 */

'use client';

import type { ExportButtonProps } from '../types';

// 상태별 버튼 텍스트
const STATE_LABELS: Record<string, string> = {
  idle: '영상 내보내기',
  preparing: '준비 중...',
  rendering: '프레임 렌더링 중...',
  encoding: '인코딩 중...',
  complete: '완료!',
  error: '오류 발생',
};

export function ExportButton({ onExport, state, progress, disabled }: ExportButtonProps) {
  const isProcessing = state !== 'idle' && state !== 'complete' && state !== 'error';
  const isDisabled = disabled || isProcessing;

  return (
    <div className="relative">
      <button
        onClick={onExport}
        disabled={isDisabled}
        className={`
          w-full px-6 py-3 rounded-lg font-medium text-white
          transition-all duration-200
          ${isDisabled
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-orange hover:bg-orange active:bg-[#b84a1a]'
          }
          ${state === 'complete' ? 'bg-green-600' : ''}
          ${state === 'error' ? 'bg-red-600' : ''}
        `}
      >
        {STATE_LABELS[state] || '내보내기'}
      </button>

      {/* 진행률 바 */}
      {isProcessing && (
        <div className="mt-2">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange/100 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-sm text-gray-400 text-center">
            {Math.round(progress)}%
          </p>
        </div>
      )}
    </div>
  );
}

export default ExportButton;
