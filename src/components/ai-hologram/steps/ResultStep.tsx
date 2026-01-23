'use client';

import { useRef, useEffect, useState } from 'react';
import { SceneData } from './MultiSceneStep';

interface ResultStepProps {
  videoUrl: string;
  onReset: () => void;
  scenes?: SceneData[]; // Composition 모드에서 사용
  isCompositionMode?: boolean; // AI 영상 합성 모드
}

export default function ResultStep({ videoUrl, onReset, scenes, isCompositionMode = false }: ResultStepProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReversing, setIsReversing] = useState(false);
  const [playCount, setPlayCount] = useState(0);

  console.log('ResultStep - videoUrl:', videoUrl?.substring(0, 50) + '...');
  console.log('ResultStep - isCompositionMode:', isCompositionMode);

  const handleSendToAdmin = () => {
    alert('관리자에게 영상이 전송되었습니다. 확인 후 연락드리겠습니다.');
  };

  // Composition 모드가 아닌 경우 (Single Mode) - 이미 완성된 30초 영상이므로 loop 속성만 사용
  // Composition 모드인 경우 - ping-pong 재생 로직 사용
  useEffect(() => {
    if (!isCompositionMode) return; // Single Mode는 video loop 속성으로 처리

    const video = videoRef.current;
    if (!video) return;

    let animationFrameId: number;
    let lastTime = 0;

    const handleTimeUpdate = () => {
      // 정방향 재생 중 끝에 도달
      if (!isReversing && video.currentTime >= video.duration - 0.1) {
        setIsReversing(true);
        video.pause();
        lastTime = video.duration;
        reversePlay();
      }
    };

    const reversePlay = () => {
      const step = () => {
        if (!videoRef.current) return;

        // 역재생: 시간을 뒤로 감기
        lastTime -= 0.033; // 약 30fps

        if (lastTime <= 0) {
          // 역재생 완료 → 다시 정방향
          videoRef.current.currentTime = 0;
          setIsReversing(false);
          setPlayCount(prev => prev + 1);
          videoRef.current.play();
          return;
        }

        videoRef.current.currentTime = lastTime;
        animationFrameId = requestAnimationFrame(step);
      };

      animationFrameId = requestAnimationFrame(step);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isReversing, isCompositionMode]);

  // 4회 ping-pong 후 계속 반복 (무한 루프)
  useEffect(() => {
    if (playCount >= 4) {
      setPlayCount(0);
    }
  }, [playCount]);

  // Theme helpers
  const isPremium = isCompositionMode;
  const theme = {
    panel: isPremium
      ? 'bg-gradient-to-br from-slate-900/80 to-black/80 border-amber-500/20 shadow-[0_0_30px_-5px_rgba(245,158,11,0.1)]'
      : 'bg-slate-900/40 border-blue-500/10 shadow-lg',
    accentText: isPremium ? 'text-amber-500' : 'text-blue-500',
    accentBg: isPremium ? 'bg-amber-500' : 'bg-blue-500',
    accentBorder: isPremium ? 'border-amber-500/50' : 'border-blue-500/50',
    buttonPrimary: isPremium ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:shadow-amber-500/30' : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-blue-500/30',
    badge: isPremium ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
  };

  return (
    <div className="animate-fade-in h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-none mb-6 text-center lg:text-left">
        <h1 className="text-3xl font-extrabold text-white mb-2 drop-shadow-sm flex items-center justify-center lg:justify-start gap-3">
          {isPremium && <span className="text-amber-500">Premium</span>}
          <span>나만의 홀로그램 완성</span>
        </h1>
        <p className="text-gray-400 text-sm">
          모든 작업이 완료되었습니다. 영상을 확인하고 저장하세요.
        </p>
      </div>

      {/* Main Content - 1:1 Split on Desktop */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 items-center justify-center">
        {/* Left Side: Video Output */}
        <div className="flex flex-col items-center justify-center min-h-0 w-full">
          <div className={`w-full max-w-[700px] aspect-square flex flex-col items-center justify-center rounded-[1.5rem] backdrop-blur-md overflow-hidden relative group border ${theme.panel}`}>

            {/* Ambient Glow */}
            <div className={`absolute inset-0 ${isPremium ? 'bg-amber-500/5' : 'bg-blue-500/5'} blur-3xl rounded-full scale-150 pointer-events-none`}></div>

            <div className="relative w-full h-full flex items-center justify-center p-4">
              <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Status Badge */}
            <div className="absolute top-6 left-6 z-20">
              <div className={`px-4 py-2 rounded-full border backdrop-blur-md text-sm font-bold flex items-center gap-2 ${isPremium ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'}`}>
                <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                최종 완성본
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Actions & Details */}
        <div className="flex flex-col items-center justify-center min-h-0 w-full">
          <div className="w-full max-w-[700px] aspect-square flex flex-col gap-4 min-h-0">
            <div className={`flex-1 flex flex-col rounded-[1.5rem] backdrop-blur-sm overflow-hidden border ${theme.panel}`}>
              <div className="p-6 pb-4 border-b border-white/5 bg-white/5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${theme.badge}`}>✓</span>
                  결과 관리
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">

                {/* Scene Info Summary */}
                <div className="bg-black/20 rounded-xl p-5 border border-white/5">
                  <p className="text-sm text-gray-400 mb-3 font-bold uppercase tracking-wider">Project Summary</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Video Type</span>
                      <span className="text-white font-medium">{isPremium ? 'Premium Composition' : 'Standard Template'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duration</span>
                      <span className="text-white font-medium">30s Loop</span>
                    </div>
                    {scenes && scenes.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Text Scenes</span>
                        <span className={`font-bold ${theme.accentText}`}>{scenes.length} Scenes</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <button
                    onClick={handleSendToAdmin}
                    className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2 ${theme.buttonPrimary}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    관리자에게 전송
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={videoUrl}
                      download="my-hologram.mp4"
                      className="py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      다운로드
                    </a>
                    <button
                      onClick={onReset}
                      className="py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 font-bold transition-all"
                    >
                      처음으로
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
