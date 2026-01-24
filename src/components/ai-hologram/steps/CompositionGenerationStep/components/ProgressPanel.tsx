import { GenerationPhase, SceneProgress } from '../types';

// Premium 모드 색상
const PREMIUM_COLOR = '#E66B33';

interface ProgressPanelProps {
  phase: GenerationPhase;
  progress: SceneProgress[];
  sceneCount: number;
  errorMessage: string;
  onBack: () => void;
  elapsedTime: number;
}

export default function ProgressPanel({ phase, progress, sceneCount, errorMessage, onBack, elapsedTime }: ProgressPanelProps) {
  // 진행 상황 계산
  const totalSteps = sceneCount + (sceneCount > 1 ? 1 : 0);
  const completedSteps = progress.filter((p) => p.videoGenerated).length + (phase === 'completed' && sceneCount > 1 ? 1 : 0);
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);
  const completedCount = progress.filter((p) => p.videoGenerated).length;

  // 시간 포맷 함수
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="lg:col-span-5 flex flex-col h-full gap-4 min-h-0">
      <div className="flex-1 flex flex-col bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg min-h-0">
        <div className="p-5 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ backgroundColor: PREMIUM_COLOR }}
            >
              i
            </span>
            전체 진행 상황
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar-light p-5 space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
              <span>Total Progress</span>
              <span style={{ color: PREMIUM_COLOR }}>{progressPercent}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500 ease-out"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: PREMIUM_COLOR,
                  boxShadow: `0 0 10px ${PREMIUM_COLOR}60`,
                }}
              />
            </div>
            {phase !== 'completed' && phase !== 'error' && (
              <div className="mt-3 flex justify-between text-xs">
                <span className="text-gray-500">
                  경과 시간: <span className="text-gray-900 font-mono">{formatTime(elapsedTime)}</span>
                </span>
                <span className="text-gray-500">
                  전체 예상: <span className="text-green-600 font-medium">약 5~10분</span>
                </span>
              </div>
            )}
            {phase === 'completed' && (
              <div className="mt-3 text-xs text-green-600">
                ✓ 총 소요 시간: <span className="font-mono">{formatTime(elapsedTime)}</span>
              </div>
            )}
          </div>

          {/* Status Steps */}
          <div className="space-y-3">
            {/* Step 1: Video Gen */}
            <div
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                phase === 'generating-video'
                  ? 'bg-gray-50'
                  : 'bg-transparent border-transparent opacity-50'
              }`}
              style={{
                borderColor: phase === 'generating-video' ? `${PREMIUM_COLOR}50` : 'transparent',
              }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  completedCount === sceneCount
                    ? 'bg-green-500 text-white'
                    : phase === 'generating-video'
                      ? 'text-white animate-pulse'
                      : 'bg-gray-200 text-gray-400'
                }`}
                style={{
                  backgroundColor: phase === 'generating-video' && completedCount !== sceneCount ? PREMIUM_COLOR : undefined,
                }}
              >
                {completedCount === sceneCount ? '✓' : '🎬'}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">개별 장면 영상 생성</p>
                <p className="text-xs text-gray-500">
                  {completedCount} / {sceneCount} 완료
                </p>
              </div>
            </div>

            {/* Step 2: Merging */}
            <div
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                phase === 'merging'
                  ? 'bg-gray-50'
                  : 'bg-transparent border-transparent opacity-50'
              }`}
              style={{
                borderColor: phase === 'merging' ? `${PREMIUM_COLOR}50` : 'transparent',
              }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  phase === 'completed'
                    ? 'bg-green-500 text-white'
                    : phase === 'merging'
                      ? 'text-white animate-pulse'
                      : 'bg-gray-200 text-gray-400'
                }`}
                style={{
                  backgroundColor: phase === 'merging' ? PREMIUM_COLOR : undefined,
                }}
              >
                {phase === 'completed' ? '✓' : '🔗'}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">영상 연결 및 합성</p>
                <p className="text-xs text-gray-500">{phase === 'completed' ? '완료' : phase === 'merging' ? '처리 중...' : '대기 중'}</p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-xs text-gray-600 leading-relaxed">
              <span className="font-bold" style={{ color: PREMIUM_COLOR }}>Tip:</span> 프리미엄 모드에서는 각 장면을 10초 분량의 고품질 영상으로 생성한 후,
              자연스럽게 연결하여 하나의 스토리 영상으로 완성합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions (Error Case) */}
      {phase === 'error' && (
        <div className="flex-none bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <span className="text-red-600 text-sm font-bold line-clamp-1">{errorMessage}</span>
          </div>
          <button onClick={onBack} className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors">
            돌아가기
          </button>
        </div>
      )}
    </div>
  );
}
