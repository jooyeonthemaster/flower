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

  const isPremium = isCompositionMode;

  const handleSendToAdmin = () => {
    alert('관리자에게 영상이 전송되었습니다. 확인 후 연락드리겠습니다.');
  };

  // Ping-Pong Playback Logic (Premium Only)
  useEffect(() => {
    if (!isCompositionMode) return;

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
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isReversing, isCompositionMode]);

  useEffect(() => {
    if (playCount >= 4) setPlayCount(0);
  }, [playCount]);

  return (
    <div className="w-full h-full flex flex-col items-center">

      {/* 타이틀 */}
      <div className="text-center mb-8 animate-fadeIn">
        <h2 className={`text-3xl font-display font-bold mb-2 ${isPremium ? 'text-gradient-gold' : 'text-blue-400'}`}>
          {isPremium ? '프리미엄 홀로그램 완성' : '홀로그램 영상 생성 완료'}
        </h2>
        <p className={`${isPremium ? 'text-amber-500/60' : 'text-blue-400/60'} font-light`}>
          나만의 홀로그램 영상이 완성되었습니다.
        </p>
      </div>

      {/* Main 2-Column Layout */}
      <div className="w-full max-w-[1920px] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-[calc(100vh-250px)] min-h-[600px]">

        {/* LEFT: Video Output */}
        <div className="h-full flex flex-col items-center justify-center relative">
          <div className={`relative w-full max-w-[700px] aspect-square rounded-2xl overflow-hidden shadow-2xl bg-black group ${isPremium ? 'shadow-[0_0_50px_-10px_rgba(245,158,11,0.2)]' : 'shadow-blue-500/20'}`}>

            {/* Frame Border */}
            <div className={`absolute inset-0 border-2 z-20 pointer-events-none rounded-2xl ${isPremium ? 'border-amber-500/20' : 'border-blue-500/20'}`}></div>

            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              muted
              loop={!isCompositionMode}
              playsInline
              controls
              className="w-full h-full object-contain relative z-10"
            />

            {/* Status Badge */}
            <div className="absolute top-6 left-6 z-30">
              <div className={`px-4 py-2 rounded-full border backdrop-blur-md text-xs font-bold flex items-center gap-2 ${isPremium
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                }`}>
                <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                최종 결과물 (FINAL RENDER)
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className={`h-full max-h-[600px] glass-panel rounded-2xl p-8 flex flex-col justify-between animate-fadeIn ${isPremium ? 'border-amber-500/20 shadow-[0_0_30px_-5px_rgba(245,158,11,0.05)]' : 'border-blue-500/20'
          }`} style={{ animationDelay: '0.2s' }}>

          <div>
            <h3 className={`font-display font-bold text-lg mb-6 flex items-center gap-3 ${isPremium ? 'text-amber-500' : 'text-blue-400'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${isPremium ? 'bg-amber-500/20' : 'bg-blue-500/20'}`}>✓</span>
              프로젝트 요약 (PROJECT SUMMARY)
            </h3>

            <div className="bg-black/20 rounded-xl p-6 border border-white/5 space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                <span className="text-gray-500">영상 타입</span>
                <span className="text-gray-200 font-bold">{isPremium ? 'Premium Composition' : 'Standard Template'}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                <span className="text-gray-500">재생 시간</span>
                <span className="text-gray-200 font-bold">30초 (Loop)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">해상도</span>
                <span className="text-gray-200 font-bold">1080 x 1080 (1:1)</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleSendToAdmin}
              className={`w-full py-5 rounded-xl font-bold text-lg text-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 ${isPremium
                ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 shadow-amber-500/20'
                : 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 shadow-blue-500/20'
                }`}
            >
              <span>홀로그램 기기로 전송</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={videoUrl}
                download="my-hologram.mp4"
                className="py-4 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-bold hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                다운로드
              </a>
              <button
                onClick={onReset}
                className="py-4 rounded-xl border border-white/10 text-gray-500 font-bold hover:bg-white/5 hover:text-gray-300 transition-all"
              >
                처음으로
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
