/**
 * 재생 컨트롤 컴포넌트
 */

'use client';

import type { PlaybackControlsProps } from '../types';

export function PlaybackControls({
  state,
  currentFrame,
  totalFrames,
  onPlay,
  onPause,
  onSeek,
}: PlaybackControlsProps) {
  const isPlaying = state === 'playing';
  const isLoading = state === 'loading';
  const progress = totalFrames > 0 ? (currentFrame / totalFrames) * 100 : 0;

  // 시간 포맷 (프레임 -> 초)
  const formatTime = (frame: number) => {
    const seconds = frame / 30; // 30fps 기준
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 슬라이더 변경 처리
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const frame = Math.round((parseFloat(e.target.value) / 100) * totalFrames);
    onSeek(frame);
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-800 rounded-lg">
      {/* 진행 슬라이더 */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400 w-12">
          {formatTime(currentFrame)}
        </span>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSliderChange}
          disabled={isLoading || totalFrames === 0}
          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:bg-blue-500
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
          "
        />
        <span className="text-sm text-gray-400 w-12 text-right">
          {formatTime(totalFrames)}
        </span>
      </div>

      {/* 재생/일시정지 버튼 */}
      <div className="flex justify-center gap-4">
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={isLoading || totalFrames === 0}
          className={`
            px-6 py-2 rounded-lg font-medium transition-all
            ${isLoading || totalFrames === 0
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner />
              로딩 중...
            </span>
          ) : isPlaying ? (
            '일시정지'
          ) : (
            '재생'
          )}
        </button>
      </div>
    </div>
  );
}

// 로딩 스피너
function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default PlaybackControls;
