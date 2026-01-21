'use client';

import { useState, useEffect, useRef } from 'react';
import { SceneData } from './MultiSceneStep';
import { CustomSettings } from './TextPreviewStep';

// 템플릿 이미지/영상 경로 생성 헬퍼 함수
// 템플릿 이미지/영상 경로 생성 헬퍼 함수
const getTemplateImagePath = (category: string, style: string): string => {
  // MultiSceneStep과 동일한 경로 사용
  return `/previews/${category}-${style}.png`;
};

const getTemplateVideoPath = (category: string, style: string): string => {
  // Firebase Storage에서 템플릿 영상 로드
  return `https://storage.googleapis.com/flower-63624.firebasestorage.app/templates/videos/${category}-${style}.mp4`;
};

// 새 플로우: 템플릿 기반 진행 상태 (텍스트 오버레이까지 포함)
type GenerationPhase = 'idle' | 'loading-video' | 'looping-video' | 'applying-overlay' | 'completed' | 'error';

interface MultiSceneGenerationStepProps {
  sceneData: {
    scenes: SceneData[];
    category: string;
    style: string;
    referenceImage?: string;
    previewImageUrl?: string;
    customSettings?: CustomSettings;
  };
  onComplete: (videoUrl: string, scenes?: SceneData[]) => void;
  onBack: () => void;
}

// 안전한 API 호출 헬퍼 함수 (JSON 파싱 오류 방지)
const safeApiCall = async (response: Response, context: string) => {
  if (!response.ok) {
    let errorText: string;
    try {
      errorText = await response.text();
    } catch {
      errorText = `HTTP ${response.status}`;
    }
    throw new Error(`${context} 실패 (${response.status}): ${errorText.substring(0, 100)}`);
  }

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${context} 응답 파싱 실패: ${text.substring(0, 100)}`);
  }
};

export default function MultiSceneGenerationStep({
  sceneData,
  onComplete,
  onBack
}: MultiSceneGenerationStepProps) {
  const [currentPhase, setCurrentPhase] = useState<GenerationPhase>('idle');
  const [overallProgress, setOverallProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [elapsedTime, setElapsedTime] = useState(0); // 경과 시간 (초)
  // 템플릿 이미지 경로 (AI 생성 없이 바로 사용)
  const templateImageUrl = getTemplateImagePath(sceneData.category, sceneData.style);
  const isGeneratingRef = useRef(false);
  const startTimeRef = useRef<number>(Date.now());
  const abortControllerRef = useRef<AbortController | null>(null);
  const isLeavingConfirmedRef = useRef(false); // 사용자가 나가기 확인했는지 추적

  // 경과 시간 타이머
  useEffect(() => {
    if (currentPhase === 'completed' || currentPhase === 'error') return;

    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPhase]);

  // 페이지 이탈 경고 - 창 닫기/새로고침/브라우저 뒤로가기 시 경고
  useEffect(() => {
    const isGenerating = currentPhase !== 'completed' && currentPhase !== 'error' && currentPhase !== 'idle';

    // 1. 창 닫기/새로고침 감지
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isGenerating) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    // 2. 브라우저 뒤로가기 버튼 감지 (SPA 내부 네비게이션)
    const handlePopState = () => {
      // 이미 나가기 확인된 상태면 그냥 진행
      if (isLeavingConfirmedRef.current) {
        return;
      }

      if (isGenerating) {
        // 뒤로가기 취소하고 현재 위치 유지
        window.history.pushState(null, '', window.location.href);

        // 사용자에게 경고
        const confirmLeave = window.confirm(
          '영상 생성이 진행 중입니다.\n이 페이지를 벗어나면 진행 상황이 저장되지 않습니다.\n\n정말 나가시겠습니까?'
        );

        if (confirmLeave) {
          // 플래그 설정 후 뒤로가기 실행
          isLeavingConfirmedRef.current = true;
          window.history.go(-1);
        }
      }
    };

    // 현재 상태를 history에 추가 (뒤로가기 감지용)
    if (isGenerating) {
      window.history.pushState(null, '', window.location.href);
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentPhase]);

  // 생성 시작
  useEffect(() => {
    if (!isGeneratingRef.current) {
      isGeneratingRef.current = true;
      startTimeRef.current = Date.now();
      startGeneration();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startGeneration = async () => {
    // AbortController 초기화
    abortControllerRef.current = new AbortController();

    try {
      // Phase 1: 템플릿 영상 로드
      setCurrentPhase('loading-video');
      setOverallProgress(10);

      const templateVideoUrl = getTemplateVideoPath(sceneData.category, sceneData.style);
      console.log('Using template video:', templateVideoUrl);

      // 클라이언트에서 직접 Firebase Storage에 접근하면 CORS 에러 발생
      // 서버 API에서 영상을 다운로드하도록 URL만 전달
      setOverallProgress(20);

      // Phase 2: 영상 루프 (5초 → 30초)
      setCurrentPhase('looping-video');
      const loopResult = await loopVideo(templateVideoUrl);

      setOverallProgress(50);

      // Phase 3: 텍스트 오버레이 자동 적용
      setCurrentPhase('applying-overlay');
      const finalVideoUrl = await applyTextOverlay(loopResult.videoUrl);

      setCurrentPhase('completed');
      setOverallProgress(100);

      // 완료 시 최종 영상 전달 (텍스트 오버레이 이미 적용됨)
      onComplete(finalVideoUrl);
    } catch (error) {
      console.error('Generation error:', error);
      setCurrentPhase('error');
      setErrorMessage(error instanceof Error ? error.message : '생성 중 오류가 발생했습니다.');
    }
  };

  // 템플릿 영상 로드 (이미 1:1, 30초 ping-pong 처리됨)
  const loopVideo = async (templateVideoUrl: string): Promise<{ videoUrl: string; looped: boolean }> => {
    console.log('Loading pre-processed template video (already 1:1, 30s ping-pong)');
    setOverallProgress(60);

    // Firebase Storage URL은 이미 절대 URL이므로 그대로 사용
    // 서버에서 fetch하면 CORS 제한 없이 다운로드 가능
    const response = await fetch('/api/ai/loop-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoUrl: templateVideoUrl,  // Firebase Storage URL 직접 전달
        passthroughOnly: true,  // 이미 처리된 영상이므로 Data URL 변환만 수행
      }),
      signal: abortControllerRef.current?.signal,
    });

    const result = await safeApiCall(response, '영상 루프');

    if (!result.success) {
      throw new Error(result.error || '영상 루프 실패');
    }

    if (result.warning) {
      console.log('Loop warning:', result.warning);
    }

    setOverallProgress(40);
    return {
      videoUrl: result.videoUrl,
      looped: result.looped !== false
    };
  };

  // Data URL을 Blob으로 변환하는 헬퍼 함수
  const dataUrlToBlob = (dataUrl: string): Blob => {
    const parts = dataUrl.split(',');
    const mime = parts[0].match(/:(.*?);/)?.[1] || 'video/mp4';
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // 텍스트 오버레이 적용 (Remotion 렌더링)
  const applyTextOverlay = async (videoDataUrl: string): Promise<string> => {
    console.log('Applying text overlay with Remotion...');
    setOverallProgress(60);

    const texts = sceneData.scenes.map(scene => scene.text);
    const settings = sceneData.customSettings;

    // 디버깅: 전달되는 설정값 확인
    console.log('Text Overlay Settings:', {
      fontSize: settings?.fontSize,
      fontFamily: settings?.fontFamily,
      textColor: settings?.textColor,
      glowColor: settings?.glowColor,
      effects: settings?.effects,
      textPosition: settings?.textPosition,
      texts: texts,
    });

    // Convert Base64 to Blob
    const videoBlob = dataUrlToBlob(videoDataUrl);
    console.log('Video Blob created:', videoBlob.size, 'bytes');

    // Create FormData
    const formData = new FormData();
    formData.append('video', videoBlob, 'input-video.mp4');
    formData.append('texts', JSON.stringify(texts));
    formData.append('fontSize', settings?.fontSize?.toString() || '50');
    formData.append('fontFamily', settings?.fontFamily || "'Noto Sans KR', sans-serif");
    formData.append('textColor', settings?.textColor || '#ffffff');
    formData.append('glowColor', settings?.glowColor || '#00ffff');
    formData.append('effects', JSON.stringify(settings?.effects || []));
    formData.append('textPosition', settings?.textPosition || 'random');

    // 참조 이미지가 있으면 추가
    if (sceneData.referenceImage) {
      console.log('Adding reference image...');
      formData.append('referenceImage', sceneData.referenceImage);
    }

    setOverallProgress(70);

    const response = await fetch('/api/ai/render-text-overlay', {
      method: 'POST',
      body: formData,
      signal: abortControllerRef.current?.signal,
    });

    setOverallProgress(85);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`텍스트 오버레이 실패 (${response.status}): ${errorText.substring(0, 100)}`);
    }

    const result = await response.json();

    if (!result.success && !result.warning) {
      throw new Error(result.error || '텍스트 오버레이 실패');
    }

    if (result.warning) {
      console.log('Overlay warning:', result.warning);
    }

    setOverallProgress(95);
    return result.videoUrl;
  };

  // 시간 포맷 함수 (초 → MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 예상 소요 시간 (실제 테스트 기반, 보수적 추정)
  const getEstimatedTime = (): string => {
    switch (currentPhase) {
      case 'loading-video': return '약 30초';
      case 'looping-video': return '약 1분';
      case 'applying-overlay': return '약 5~10분';
      default: return '';
    }
  };

  // 전체 예상 시간
  const getTotalEstimatedTime = (): string => {
    return '약 7~12분';
  };

  const getPhaseLabel = () => {
    switch (currentPhase) {
      case 'idle': return '준비 중...';
      case 'loading-video': return '템플릿 영상 로드 중...';
      case 'looping-video': return '영상 변환 중...';
      case 'applying-overlay': return '텍스트 오버레이 적용 중...';
      case 'completed': return '완료!';
      case 'error': return '오류 발생';
    }
  };

  const getPhaseDescription = () => {
    switch (currentPhase) {
      case 'idle': return '잠시만 기다려주세요...';
      case 'loading-video': return '템플릿 영상을 불러오고 있습니다';
      case 'looping-video': return '영상을 Data URL로 변환하고 있습니다';
      case 'applying-overlay': return '텍스트와 이펙트를 영상에 합성합니다';
      case 'completed': return '영상이 완성되었습니다!';
      case 'error': return '문제가 발생했습니다';
    }
  };

  // 각 Phase의 완료 여부 체크
  const isPhaseComplete = (phase: string) => {
    const phaseOrder = ['loading-video', 'looping-video', 'applying-overlay', 'completed'];
    const currentIndex = phaseOrder.indexOf(currentPhase);
    const phaseIndex = phaseOrder.indexOf(phase);
    return currentIndex > phaseIndex || currentPhase === 'completed';
  };

  const isPhaseActive = (phase: string) => currentPhase === phase;

  // 3단계 UI 데이터 (텍스트 오버레이까지 포함)
  const phases = [
    { id: 'loading-video', label: '템플릿 영상 로드', icon: '🎬' },
    { id: 'looping-video', label: '30초 확장', icon: '🔄' },
    { id: 'applying-overlay', label: '텍스트 오버레이', icon: '✨' },
  ];

  return (
    <div className="animate-fade-in h-full flex flex-col overflow-hidden">
      <div className="flex-none mb-6 text-center lg:text-left">
        <h1 className="text-3xl font-extrabold text-white mb-2 drop-shadow-sm">
          영상 생성 중
        </h1>
        <p className="text-gray-400 text-sm">
          템플릿 영상으로 홀로그램을 만들고 있습니다. 잠시만 기다려주세요.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 items-center justify-center">

        {/* Left Side: Preview Visual */}
        <div className="flex flex-col items-center justify-center min-h-0 w-full">
          <div className="w-full max-w-[700px] aspect-square bg-gradient-to-br from-slate-900/80 to-black/80 border border-blue-500/20 rounded-[1.5rem] p-8 backdrop-blur-md flex flex-col items-center justify-center shadow-[0_0_40px_-10px_rgba(59,130,246,0.05)] relative overflow-hidden">
            {/* Background Ambient Effect */}
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full scale-150 animate-pulse-slow pointer-events-none"></div>

            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={templateImageUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />

              {/* Overlay Status */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center gap-3">
                  {currentPhase === 'completed' ? (
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                      <span className="text-xl">✓</span>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                  )}
                  <div>
                    <p className="text-white font-bold text-lg">{getPhaseLabel()}</p>
                    <p className="text-blue-200 text-xs">{getPhaseDescription()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Progress Info */}
        <div className="flex flex-col items-center justify-center min-h-0 w-full">
          <div className="w-full max-w-[700px] aspect-square flex flex-col gap-4 min-h-0">
            <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-900/80 to-black/80 backdrop-blur-md border border-blue-500/20 rounded-[1.5rem] overflow-hidden shadow-[0_0_40px_-10px_rgba(59,130,246,0.05)] min-h-0">
              <div className="p-6 pb-4 bg-slate-900/40 backdrop-blur-md sticky top-0 z-10 border-b border-blue-500/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">i</span>
                  진행 상황
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-4 space-y-8">

                {/* Overall Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm font-bold text-gray-300 mb-2">
                    <span>Total Progress</span>
                    <span className="text-blue-400">{overallProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-purple-500 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>

                  {/* 시간 정보 */}
                  <div className="mt-3 space-y-1">
                    {currentPhase !== 'completed' && currentPhase !== 'error' && (
                      <>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">⏱ 경과 시간: <span className="text-white font-mono">{formatTime(elapsedTime)}</span></span>
                          <span className="text-gray-400">전체 예상: <span className="text-yellow-300">{getTotalEstimatedTime()}</span></span>
                        </div>
                        {getEstimatedTime() && (
                          <div className="text-xs text-gray-500">
                            현재 단계 예상: <span className="text-blue-300">{getEstimatedTime()}</span>
                          </div>
                        )}
                      </>
                    )}
                    {currentPhase === 'completed' && (
                      <div className="text-xs text-green-400">
                        ✓ 총 소요 시간: <span className="font-mono">{formatTime(elapsedTime)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Steps List */}
                <div className="space-y-4">
                  {phases.map((phase) => {
                    const isActive = isPhaseActive(phase.id);
                    const isDone = isPhaseComplete(phase.id);

                    return (
                      <div key={phase.id} className={`flex items-center gap-4 p-4 rounded-xl transition-all ${isActive ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-transparent border border-transparent opacity-60'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-inner ${isDone ? 'bg-green-500 text-white' : isActive ? 'bg-blue-500 text-white animate-pulse' : 'bg-gray-800 text-gray-500'
                          }`}>
                          {isDone ? '✓' : phase.icon}
                        </div>
                        <div className="flex-1">
                          <p className={`font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>{phase.label}</p>
                          {isActive && <p className="text-xs text-blue-300 mt-0.5 animate-pulse">작업 진행 중...</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Text Info */}
                <div className="bg-black/40 rounded-xl p-4 border border-blue-500/10">
                  <p className="text-xs text-gray-500 mb-2 font-bold uppercase">포함된 문구</p>
                  <div className="space-y-1">
                    {sceneData.scenes.map((scene, idx) => (
                      <div key={idx} className="flex gap-2 text-sm text-gray-300 items-start">
                        <span className="text-blue-500 font-bold">{idx + 1}.</span>
                        <span className="opacity-80 line-clamp-1">{scene.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* 오류 발생 시 버튼 */}
            {currentPhase === 'error' && (
              <div className="flex-none bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center justify-between">
                <span className="text-red-400 text-sm font-bold flex items-center gap-2">⚠️ {errorMessage}</span>
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors"
                >
                  돌아가기
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
