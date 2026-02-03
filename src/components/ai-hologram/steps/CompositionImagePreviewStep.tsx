'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useVideoGeneration } from './CompositionGenerationStep/hooks/useVideoGeneration';

const PREMIUM_COLOR = '#E66B33';

export interface CompositionData {
  messages: string[];
  category: string;
  style: string;
}

export interface GeneratedDualFrame {
  startFrameUrl: string;
  endFrameUrl: string;
  message: string;
}

interface SceneProgress {
  videoGenerated: boolean;
  videoUrl?: string;
}

type GenerationPhase =
  | 'idle'
  | 'background'
  | 'textframe'
  | 'images-completed'
  | 'generating-videos'
  | 'merging-videos'
  | 'done';

type GenerationState = 'idle' | 'generating' | 'completed' | 'error';

interface CompositionImagePreviewStepProps {
  data: CompositionData;
  onNext: (videoUrl: string, messages: string[]) => void;
  onBack: () => void;
}

const categoryLabels: Record<string, string> = {
  wedding: '결혼식',
  opening: '개업',
  event: '행사',
};

const styleLabels: Record<string, string> = {
  fancy: '팬시',
  vibrant: '바이브런트',
  minimal: '미니멀',
};

export default function CompositionImagePreviewStep({ data, onNext, onBack }: CompositionImagePreviewStepProps) {
  const [generationPhase, setGenerationPhase] = useState<GenerationPhase>('idle');
  const [state, setState] = useState<GenerationState>('idle');
  const [backgroundProgress, setBackgroundProgress] = useState<boolean[]>(data.messages.map(() => false));
  const [textFrameProgress, setTextFrameProgress] = useState<boolean[]>(data.messages.map(() => false));
  const [generatedFrames, setGeneratedFrames] = useState<GeneratedDualFrame[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [videoProgress, setVideoProgress] = useState<SceneProgress[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const generationStartedRef = useRef(false);
  const historyPushedRef = useRef(false);

  const messageCount = data.messages.length;

  // 화면 이탈 경고 (생성 중일 때) - 탭 닫기, 새로고침
  useEffect(() => {
    const isGenerating = generationPhase !== 'idle' && generationPhase !== 'done';
    if (!isGenerating) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '영상 생성이 진행 중입니다. 페이지를 떠나면 생성이 중단됩니다.';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [generationPhase]);

  // 화면 이탈 경고 (생성 중일 때) - 뒤로가기 버튼
  useEffect(() => {
    const isGenerating = generationPhase !== 'idle' && generationPhase !== 'done';
    if (!isGenerating) {
      historyPushedRef.current = false;
      return;
    }

    if (!historyPushedRef.current) {
      window.history.pushState({ generating: true }, '');
      historyPushedRef.current = true;
    }

    const handlePopState = () => {
      const confirmed = window.confirm(
        '영상 생성이 진행 중입니다. 페이지를 떠나면 생성이 중단됩니다.\n\n정말 나가시겠습니까?'
      );
      if (confirmed) {
        window.removeEventListener('popstate', handlePopState);
        historyPushedRef.current = false;
        window.history.back();
      } else {
        window.history.pushState({ generating: true }, '');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [generationPhase]);

  // 경과 시간 타이머
  useEffect(() => {
    if (generationPhase === 'done' || generationPhase === 'idle') return;

    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [generationPhase]);

  // 진행률 계산
  const completedBackgrounds = backgroundProgress.filter(Boolean).length;
  const completedTextFrames = textFrameProgress.filter(Boolean).length;
  const completedVideos = videoProgress.filter(p => p.videoGenerated).length;

  const imageProgress = ((completedBackgrounds + completedTextFrames) / (messageCount * 2)) * 40;
  const videoGenerationProgress = (completedVideos / messageCount) * 50;
  const mergeProgress = generationPhase === 'merging-videos' ? 5 : generationPhase === 'done' ? 10 : 0;

  const totalProgress = imageProgress + videoGenerationProgress + mergeProgress;

  // 시간 포맷 함수
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 영상 생성 훅 사용
  const { runMainProcess } = useVideoGeneration({
    generatedFrames,
    model: 'kling-2.5-turbo-pro',
    style: data.style,
    category: data.category,
    setPhase: (phase) => {
      if (phase === 'generating-video') setGenerationPhase('generating-videos');
      if (phase === 'merging') setGenerationPhase('merging-videos');
      if (phase === 'completed') setGenerationPhase('done');
      if (phase === 'error') {
        setState('error');
        setGenerationPhase('idle');
      }
    },
    setProgress: setVideoProgress,
    setErrorMessage: (msg) => {
      setErrorMessage(`영상 생성 실패: ${msg}`);
      setState('error');
    },
    onComplete: (videoUrl, messages) => {
      onNext(videoUrl, messages);
    },
  });

  // 이미지 생성 완료 시 자동으로 영상 생성 시작
  useEffect(() => {
    if (generationPhase === 'images-completed' && generatedFrames.length > 0) {
      const timer = setTimeout(() => {
        console.log('[자동 진행] 영상 생성 시작...');
        setGenerationPhase('generating-videos');
        setVideoProgress(generatedFrames.map(() => ({ videoGenerated: false })));
        runMainProcess();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [generationPhase, generatedFrames, runMainProcess]);

  // 이미지 생성 로직
  const handleGenerateImages = useCallback(async () => {
    if (generationStartedRef.current) return;
    generationStartedRef.current = true;
    startTimeRef.current = Date.now();

    setState('generating');
    setGenerationPhase('background');

    try {
      // Phase 1: 배경 이미지 생성
      const backgroundRequests = data.messages.map(async (message, idx) => {
        try {
          const response = await fetch('/api/ai/generate-background', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, category: data.category, style: data.style }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`배경 생성 API 오류 (${idx + 1}):`, {
              status: response.status,
              statusText: response.statusText,
              url: response.url,
              body: errorText.substring(0, 500),
            });
            throw new Error(`배경 생성 실패 (${idx + 1}): ${response.status} ${response.statusText}`);
          }

          const result = await response.json();

          setBackgroundProgress(prev => {
            const newProg = [...prev];
            newProg[idx] = true;
            return newProg;
          });

          return result.imageUrl;
        } catch (error) {
          console.error(`배경 생성 예외 (${idx + 1}):`, error);
          throw error;
        }
      });

      const backgroundUrls = await Promise.all(backgroundRequests);

      // Phase 2: 텍스트 프레임 생성
      setGenerationPhase('textframe');

      const textFrameRequests = data.messages.map(async (message, idx) => {
        try {
          const response = await fetch('/api/ai/generate-text-frame', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message,
              backgroundUrl: backgroundUrls[idx],
              category: data.category,
              style: data.style,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`텍스트 프레임 API 오류 (${idx + 1}):`, {
              status: response.status,
              statusText: response.statusText,
              url: response.url,
              body: errorText.substring(0, 500),
            });
            throw new Error(`텍스트 프레임 생성 실패 (${idx + 1}): ${response.status} ${response.statusText}`);
          }

          const result = await response.json();

          setTextFrameProgress(prev => {
            const newProg = [...prev];
            newProg[idx] = true;
            return newProg;
          });

          return {
            startFrameUrl: result.startFrameUrl,
            endFrameUrl: result.endFrameUrl,
            message,
          };
        } catch (error) {
          console.error(`텍스트 프레임 예외 (${idx + 1}):`, error);
          throw error;
        }
      });

      const frames = await Promise.all(textFrameRequests);

      setGeneratedFrames(frames);
      setGenerationPhase('images-completed');
      setState('completed');

    } catch (error) {
      console.error('이미지 생성 오류:', error);
      setState('error');
      setGenerationPhase('idle');
      setErrorMessage(error instanceof Error ? error.message : '이미지 생성에 실패했습니다.');
    }
  }, [data]);

  // 다시 시도
  const handleRegenerate = () => {
    generationStartedRef.current = false;
    setGenerationPhase('idle');
    setState('idle');
    setErrorMessage('');
    setBackgroundProgress(data.messages.map(() => false));
    setTextFrameProgress(data.messages.map(() => false));
    setGeneratedFrames([]);
    setVideoProgress([]);
    setElapsedTime(0);
  };

  // 취소 핸들러
  const handleCancel = () => {
    const confirmed = window.confirm(
      '생성을 중단하시겠습니까?\n지금까지의 진행 상황은 저장되지 않습니다.'
    );

    if (confirmed) {
      setState('idle');
      setGenerationPhase('idle');
      onBack();
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar-light p-4 md:p-6 lg:p-8 pb-32">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-none mb-6 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="headline-step text-[#E66B33]">PREMIUM</span>
            <span className="text-xl text-gray-300">✦</span>
            <span className="headline-step text-gray-900">AI 영상 생성</span>
          </div>
          <p className="text-gray-500 text-sm md:text-base">
            AI가 이미지와 영상을 자동으로 생성합니다
          </p>
        </motion.div>

        {/* 메인 2단 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 min-h-[600px]">

          {/* 1. 미리보기 패널 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col min-h-0"
          >
            <div className="flex-1 bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex flex-col gap-4">
              {/* Section Header */}
              <div className="flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: PREMIUM_COLOR }}
                >
                  1
                </span>
                <h3 className="text-xl font-bold text-gray-900">미리보기</h3>
              </div>

              {/* 미리보기 내용 */}
              <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden relative flex items-center justify-center min-h-[400px]">
                {/* Idle 상태 */}
                {generationPhase === 'idle' && (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mb-4 shadow-sm">
                      <span className="text-4xl">🎨</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">AI 영상 생성 준비</h3>
                    <p className="text-gray-500 text-sm max-w-md mb-6">
                      {data.messages.length}개의 문구로 맞춤형 홀로그램 영상을 생성합니다
                    </p>
                    <button
                      onClick={handleGenerateImages}
                      className="px-8 py-3 rounded-xl bg-[#E66B33] text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                    >
                      생성 시작
                    </button>
                  </div>
                )}

                {/* 생성 중 */}
                {generationPhase !== 'idle' && generationPhase !== 'done' && (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6">
                    {generatedFrames.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="relative w-20 h-20 mb-4">
                          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#E66B33] animate-spin"></div>
                          <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                            <span className="text-2xl animate-pulse">✨</span>
                          </div>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-1">AI 생성 중...</h3>
                        <p className="text-gray-500 text-sm">잠시만 기다려주세요</p>
                      </div>
                    ) : (
                      <div className="relative w-full h-full rounded-lg overflow-hidden shadow-sm border border-gray-200 group">
                        <Image
                          src={generatedFrames[0].endFrameUrl}
                          alt="Preview"
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                              style={{ borderColor: `${PREMIUM_COLOR} transparent ${PREMIUM_COLOR} ${PREMIUM_COLOR}` }}
                            />
                            <div>
                              <p className="text-white font-bold text-sm">미리보기</p>
                              <p className="text-gray-200 text-xs line-clamp-1">{generatedFrames[0].message}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 완료 상태 */}
                {generationPhase === 'done' && generatedFrames.length > 0 && (
                  <div className="w-full h-full p-6 flex items-center justify-center">
                    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-sm border border-gray-200 group">
                      <Image
                        src={generatedFrames[0].endFrameUrl}
                        alt="Final Preview"
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                            style={{ backgroundColor: PREMIUM_COLOR }}
                          >
                            <span className="text-lg text-white">✓</span>
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm">생성 완료!</p>
                            <p className="text-gray-200 text-xs">영상이 준비되었습니다</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* 2. 진행 상황 패널 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col min-h-0"
          >
            <div className="flex-1 bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex flex-col gap-4">
              {/* Section Header */}
              <div className="flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: PREMIUM_COLOR }}
                >
                  2
                </span>
                <h3 className="text-xl font-bold text-gray-900">진행 상황</h3>
              </div>

              {/* 진행 정보 */}
              <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-200 flex flex-col gap-4 overflow-y-auto custom-scrollbar-light">
                {/* 전체 진행률 */}
                <div>
                  <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
                    <span>Total Progress</span>
                    <span style={{ color: PREMIUM_COLOR }}>{Math.round(totalProgress)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 ease-out"
                      style={{
                        width: `${totalProgress}%`,
                        backgroundColor: PREMIUM_COLOR,
                        boxShadow: `0 0 10px ${PREMIUM_COLOR}60`,
                      }}
                    />
                  </div>

                  <div className="mt-3 space-y-1">
                    {generationPhase !== 'idle' && generationPhase !== 'done' && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">경과 시간: <span className="text-gray-700 font-mono">{formatTime(elapsedTime)}</span></span>
                        <span className="text-gray-500">전체 예상: <span className="text-green-600">약 5~10분</span></span>
                      </div>
                    )}
                    {generationPhase === 'done' && (
                      <div className="text-xs text-green-600">
                        ✓ 총 소요 시간: <span className="font-mono">{formatTime(elapsedTime)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 현재 상태 표시 */}
                <div
                  className={`rounded-xl p-4 border-2 transition-all ${
                    generationPhase !== 'idle' && generationPhase !== 'done'
                      ? 'bg-white'
                      : 'bg-transparent border-transparent opacity-60'
                  }`}
                  style={{
                    borderColor: generationPhase !== 'idle' && generationPhase !== 'done' ? `${PREMIUM_COLOR}50` : 'transparent',
                  }}
                >
                  <p className="text-xs text-gray-500 mb-2 font-bold uppercase">현재 단계</p>
                  <div className="flex items-center gap-3">
                    {generationPhase !== 'done' && generationPhase !== 'idle' ? (
                      <div
                        className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                        style={{ borderColor: `${PREMIUM_COLOR} transparent ${PREMIUM_COLOR} ${PREMIUM_COLOR}` }}
                      />
                    ) : generationPhase === 'done' ? (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500">
                        <span className="text-xl text-white">✓</span>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200">
                        <span className="text-xl">⏸️</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">
                        {generationPhase === 'idle' && '대기 중'}
                        {(generationPhase === 'background' || generationPhase === 'textframe') && 'AI 이미지 생성 중'}
                        {generationPhase === 'images-completed' && '영상 생성 준비 중'}
                        {generationPhase === 'generating-videos' && 'AI 영상 생성 중'}
                        {generationPhase === 'merging-videos' && '최종 합성 중'}
                        {generationPhase === 'done' && '완료'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {generationPhase === 'idle' && '시작 버튼을 눌러주세요'}
                        {(generationPhase === 'background' || generationPhase === 'textframe') && '배경과 텍스트 프레임을 생성합니다'}
                        {generationPhase === 'images-completed' && '잠시 후 자동으로 시작됩니다'}
                        {generationPhase === 'generating-videos' && '각 장면을 영상으로 변환합니다'}
                        {generationPhase === 'merging-videos' && '모든 영상을 하나로 연결합니다'}
                        {generationPhase === 'done' && '모든 작업이 완료되었습니다'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 설정 정보 */}
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-2 font-bold uppercase">생성 설정</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">카테고리</p>
                      <p className="text-sm font-bold text-gray-700">{categoryLabels[data.category]}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">스타일</p>
                      <p className="text-sm font-bold" style={{ color: PREMIUM_COLOR }}>{styleLabels[data.style]}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">문구 개수</p>
                    <p className="text-sm font-bold text-gray-700">{data.messages.length}개</p>
                  </div>
                </div>
              </div>

              {/* 버튼 영역 */}
              {state === 'error' && errorMessage && (
                <div className="flex-none bg-red-50 border border-red-200 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 mr-2">
                    <span className="text-lg flex-shrink-0">⚠️</span>
                    <span className="text-red-600 text-sm font-bold line-clamp-1">{errorMessage}</span>
                  </div>
                  <button
                    onClick={handleRegenerate}
                    className="px-3 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                  >
                    다시 시도
                  </button>
                </div>
              )}

              {generationPhase === 'idle' && (
                <button
                  onClick={onBack}
                  className="w-full px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                >
                  뒤로가기
                </button>
              )}

              {generationPhase !== 'idle' && generationPhase !== 'done' && state !== 'error' && (
                <div className="flex-none bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 mr-2">
                    <span className="text-lg flex-shrink-0">⚠️</span>
                    <span className="text-orange-700 text-sm font-bold">생성 중단 시 진행 상황이 저장되지 않습니다</span>
                  </div>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-2 bg-[#E66B33] text-white text-sm font-bold rounded-lg hover:bg-[#d55a28] transition-colors whitespace-nowrap"
                  >
                    중단
                  </button>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
