import { GenerationPhase, SceneProgress } from '../types';

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
      <div className="flex-1 flex flex-col bg-slate-900 border border-amber-500/10 rounded-[1.5rem] overflow-hidden shadow-2xl min-h-0">
        <div className="p-6 pb-4 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-white/5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-amber-500/20 text-white flex items-center justify-center text-sm font-bold border border-amber-500/20">
              i
            </span>
            전체 진행 상황
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-4 space-y-8">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm font-bold text-gray-400 mb-2">
              <span>Total Progress</span>
              <span className="text-amber-500">{progressPercent}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500 ease-out shadow-[0_0_15px_-2px_rgba(245,158,11,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {phase !== 'completed' && phase !== 'error' && (
              <div className="mt-3 flex justify-between text-xs">
                <span className="text-gray-400">
                  경과 시간: <span className="text-white font-mono">{formatTime(elapsedTime)}</span>
                </span>
                <span className="text-gray-400">
                  전체 예상: <span className="text-green-300">약 5~10분</span>
                </span>
              </div>
            )}
            {phase === 'completed' && (
              <div className="mt-3 text-xs text-green-400">
                ✓ 총 소요 시간: <span className="font-mono">{formatTime(elapsedTime)}</span>
              </div>
            )}
          </div>

          {/* Status Steps */}
          <div className="space-y-4">
            {/* Step 1: Video Gen */}
            <div
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${phase === 'generating-video' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-transparent border-transparent opacity-50'}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${completedCount === sceneCount ? 'bg-green-500 text-white' : phase === 'generating-video' ? 'bg-amber-500 text-black animate-pulse' : 'bg-gray-800 text-gray-500'}`}
              >
                {completedCount === sceneCount ? '✓' : '🎬'}
              </div>
              <div>
                <p className="text-sm font-bold text-white">개별 장면 영상 생성</p>
                <p className="text-xs text-gray-400">
                  {completedCount} / {sceneCount} 완료
                </p>
              </div>
            </div>

            {/* Step 2: Merging */}
            <div
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${phase === 'merging' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-transparent border-transparent opacity-50'}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${phase === 'completed' ? 'bg-green-500 text-white' : phase === 'merging' ? 'bg-amber-500 text-black animate-pulse' : 'bg-gray-800 text-gray-500'}`}
              >
                {phase === 'completed' ? '✓' : '🔗'}
              </div>
              <div>
                <p className="text-sm font-bold text-white">영상 연결 및 합성</p>
                <p className="text-xs text-gray-400">{phase === 'completed' ? '완료' : phase === 'merging' ? '처리 중...' : '대기 중'}</p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <p className="text-xs text-gray-400 leading-relaxed">
              <span className="text-amber-500 font-bold">Tip:</span> 프리미엄 모드에서는 각 장면을 10초 분량의 고품질 영상으로 생성한 후,
              자연스럽게 연결하여 하나의 스토리 영상으로 완성합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions (Error Case) */}
      {phase === 'error' && (
        <div className="flex-none bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <span className="text-red-400 text-sm font-bold line-clamp-1">{errorMessage}</span>
          </div>
          <button onClick={onBack} className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors">
            돌아가기
          </button>
        </div>
      )}
    </div>
  );
}
