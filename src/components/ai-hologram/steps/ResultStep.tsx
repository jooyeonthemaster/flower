'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { SceneData } from './MultiSceneStep';

// 모드별 색상
const PREMIUM_COLOR = '#E66B33';
const STANDARD_COLOR = '#8A9A5B';

interface ResultStepProps {
  videoUrl: string;
  onReset: () => void;
  scenes?: SceneData[];
  isCompositionMode?: boolean;
  category?: string;
  style?: string;
  eventInfo?: {
    groomName?: string;
    brideName?: string;
    businessName?: string;
    eventName?: string;
    organizer?: string;
    date?: string;
  };
}

export default function ResultStep({
  videoUrl,
  onReset,
  scenes,
  isCompositionMode = false,
  category,
  style,
  eventInfo
}: ResultStepProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReversing, setIsReversing] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const { user, userProfile } = useAuth();

  // 영상 저장 및 전송 상태
  const [savedVideoId, setSavedVideoId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  console.log('ResultStep - videoUrl:', videoUrl?.substring(0, 50) + '...');
  console.log('ResultStep - isCompositionMode:', isCompositionMode);

  // 영상 저장 함수 - videoId 반환
  const saveVideoToDatabase = useCallback(async (): Promise<string | null> => {
    if (!user || !videoUrl) return null;
    if (savedVideoId) return savedVideoId;
    if (isSaving) return null;

    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          userEmail: user.email,
          title: `홀로그램 영상 ${new Date().toLocaleDateString('ko-KR')}`,
          mode: isCompositionMode ? 'composition' : 'single',
          category: category || 'general',
          style: style || 'default',
          videoUrl,
          duration: 30,
          sceneData: scenes ? { scenes, eventInfo } : null,
        }),
      });

      if (!response.ok) {
        throw new Error('영상 저장 실패');
      }

      const data = await response.json();
      setSavedVideoId(data.videoId);
      console.log('영상 저장 완료:', data.videoId);
      return data.videoId;
    } catch (error) {
      console.error('영상 저장 오류:', error);
      setSaveError('영상 저장 중 오류가 발생했습니다.');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [user, videoUrl, savedVideoId, isSaving, isCompositionMode, category, style, scenes, eventInfo]);

  // 영상 자동 저장 (최초 렌더링 시)
  useEffect(() => {
    if (user && videoUrl && !savedVideoId && !isSaving) {
      saveVideoToDatabase();
    }
  }, [user, videoUrl, savedVideoId, isSaving, saveVideoToDatabase]);

  // 관리자에게 전송
  const handleSendToAdmin = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    let videoIdToUse = savedVideoId;

    if (!videoIdToUse) {
      if (isSaving) {
        alert('영상 저장 중입니다. 잠시 후 다시 시도해주세요.');
        return;
      }
      // 저장이 실패했으면 다시 시도하고 반환된 값 사용
      videoIdToUse = await saveVideoToDatabase();
      if (!videoIdToUse) {
        alert('영상 저장에 실패했습니다. 다시 시도해주세요.');
        return;
      }
    }

    setIsSending(true);

    try {
      const response = await fetch('/api/admin-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          userEmail: user.email,
          userName: userProfile?.displayName || user.displayName || '',
          userPhone: userProfile?.phoneNumber,
          videoId: videoIdToUse,
          videoUrl,
          videoTitle: `홀로그램 영상 ${new Date().toLocaleDateString('ko-KR')}`,
          videoMode: isCompositionMode ? 'composition' : 'single',
          requestType: 'review',
        }),
      });

      if (!response.ok) {
        throw new Error('요청 전송 실패');
      }

      setRequestSent(true);
      alert('관리자에게 영상이 전송되었습니다.\n마이페이지에서 처리 현황을 확인하실 수 있습니다.');
    } catch (error) {
      console.error('관리자 전송 오류:', error);
      alert('전송 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSending(false);
    }
  };

  // Composition 모드가 아닌 경우 (Single Mode) - 이미 완성된 30초 영상이므로 loop 속성만 사용
  // Composition 모드인 경우 - ping-pong 재생 로직 사용
  useEffect(() => {
    if (!isCompositionMode) return;

    const video = videoRef.current;
    if (!video) return;

    let animationFrameId: number;
    let lastTime = 0;

    const handleTimeUpdate = () => {
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

        lastTime -= 0.033;

        if (lastTime <= 0) {
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

  useEffect(() => {
    if (playCount >= 4) {
      setPlayCount(0);
    }
  }, [playCount]);

  const isPremium = isCompositionMode;
  const accentColor = isPremium ? PREMIUM_COLOR : STANDARD_COLOR;

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 lg:p-8 overflow-auto custom-scrollbar-light">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-none mb-6 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="headline-step" style={{ color: accentColor }}>{isPremium ? 'PREMIUM' : 'STANDARD'}</span>
          <span className="text-xl text-gray-300">✦</span>
          <span className="headline-step text-gray-900">완성!</span>
        </div>
        <p className="text-gray-500 text-sm md:text-base">
          모든 작업이 완료되었습니다. 영상을 확인하고 저장하세요.
        </p>
      </motion.div>

      {/* Main Content - 1:1 Split on Desktop */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 items-center justify-center">
        {/* Left Side: Video Output */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center justify-center min-h-0 w-full"
        >
          <div
            className="w-full max-w-[700px] aspect-square flex flex-col items-center justify-center rounded-2xl overflow-hidden relative group bg-white border-2 shadow-xl"
            style={{ borderColor: `${accentColor}30` }}
          >
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-black">
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
              <div
                className="px-4 py-2 rounded-full border-2 backdrop-blur-md text-sm font-bold flex items-center gap-2 bg-white"
                style={{ borderColor: `${accentColor}50`, color: accentColor }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: accentColor }}
                ></span>
                최종 완성본
              </div>
            </div>

            {/* Save Status Badge */}
            {user && (
              <div className="absolute top-6 right-6 z-20">
                <div
                  className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                    savedVideoId
                      ? 'bg-green-100 text-green-700'
                      : isSaving
                      ? 'bg-yellow-100 text-yellow-700'
                      : saveError
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {savedVideoId ? (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      저장됨
                    </>
                  ) : isSaving ? (
                    <>
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      저장 중...
                    </>
                  ) : saveError ? (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                      </svg>
                      저장 실패
                    </>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Side: Actions & Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center min-h-0 w-full"
        >
          <div className="w-full max-w-[700px] aspect-square flex flex-col gap-4 min-h-0">
            <div className="flex-1 flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-lg">
              <div className="p-6 pb-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    ✓
                  </span>
                  결과 관리
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar-light p-6 space-y-6">

                {/* Scene Info Summary */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <p className="text-sm text-gray-500 mb-3 font-bold uppercase tracking-wider">Project Summary</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Video Type</span>
                      <span className="text-gray-900 font-medium">{isPremium ? 'Premium Composition' : 'Standard Template'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duration</span>
                      <span className="text-gray-900 font-medium">30s Loop</span>
                    </div>
                    {scenes && scenes.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Text Scenes</span>
                        <span className="font-bold" style={{ color: accentColor }}>{scenes.length} Scenes</span>
                      </div>
                    )}
                    {user && savedVideoId && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">저장 상태</span>
                        <span className="text-green-600 font-medium">마이페이지에서 확인 가능</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <button
                    onClick={handleSendToAdmin}
                    disabled={isSending || requestSent || !user}
                    className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                      requestSent
                        ? 'bg-green-500 cursor-default'
                        : !user
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:-translate-y-1 hover:shadow-xl'
                    }`}
                    style={{ backgroundColor: requestSent ? undefined : accentColor }}
                  >
                    {isSending ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        전송 중...
                      </>
                    ) : requestSent ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        전송 완료
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        관리자에게 전송
                      </>
                    )}
                  </button>

                  {!user && (
                    <p className="text-center text-sm text-gray-500">
                      관리자에게 전송하려면 로그인이 필요합니다.
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={videoUrl}
                      download="my-hologram.mp4"
                      className="py-3 rounded-xl bg-gray-100 border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      다운로드
                    </a>
                    <button
                      onClick={onReset}
                      className="py-3 rounded-xl border-2 border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 font-bold transition-all"
                    >
                      처음으로
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
