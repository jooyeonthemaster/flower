'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { SceneData } from './MultiSceneStep';
import { CustomSettings } from './TextPreviewStep';
import {
  VideoCompositor,
  DEFAULT_RENDERER_CONFIG,
  DEFAULT_TEXT_STYLE,
  type RenderConfig,
  type EffectType,
  type TextPosition,
  type CharEffectMode,
} from '@/lib/canvas-renderer';
import { createMP4FromFrames, checkWebCodecsSupport } from '@/lib/video-encoder';

// 템플릿 이미지/영상 경로 생성 헬퍼 함수
const getTemplateImagePath = (category: string, style: string): string => {
  return `/previews/${category}-${style}.png`;
};

// Firebase Storage 템플릿 영상 URL
const STORAGE_BASE_URL = `https://storage.googleapis.com/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'flower-63624.firebasestorage.app'}`;

const getTemplateVideoPath = (category: string, style: string): string => {
  // Firebase Storage에서 템플릿 영상 로드
  return `${STORAGE_BASE_URL}/templates/videos/${category}-${style}.mp4`;
};

// 브라우저 렌더링 기반 진행 상태
type GenerationPhase = 'idle' | 'loading-video' | 'rendering' | 'encoding' | 'uploading' | 'completed' | 'error';

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

export default function MultiSceneGenerationStep({
  sceneData,
  onComplete,
  onBack
}: MultiSceneGenerationStepProps) {
  const [currentPhase, setCurrentPhase] = useState<GenerationPhase>('idle');
  const [overallProgress, setOverallProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isWebCodecsSupported, setIsWebCodecsSupported] = useState(true);

  const templateImageUrl = getTemplateImagePath(sceneData.category, sceneData.style);
  const isGeneratingRef = useRef(false);
  const startTimeRef = useRef<number>(Date.now());
  const compositorRef = useRef<VideoCompositor | null>(null);
  const historyPushedRef = useRef(false);

  // WebCodecs 지원 확인
  useEffect(() => {
    const support = checkWebCodecsSupport();
    setIsWebCodecsSupported(support.supported);
    if (!support.supported) {
      setErrorMessage('이 브라우저는 WebCodecs를 지원하지 않습니다. Chrome, Edge 등 최신 브라우저를 사용해주세요.');
      setCurrentPhase('error');
    }
  }, []);

  // 경과 시간 타이머
  useEffect(() => {
    if (currentPhase === 'completed' || currentPhase === 'error') return;

    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPhase]);

  // 화면 이탈 경고 (생성 중일 때) - 탭 닫기, 새로고침
  useEffect(() => {
    const isGenerating = currentPhase !== 'idle' && currentPhase !== 'completed' && currentPhase !== 'error';

    if (!isGenerating) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '영상 생성이 진행 중입니다. 페이지를 떠나면 생성이 중단됩니다.';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentPhase]);

  // 브라우저 뒤로가기 경고 (생성 중일 때)
  useEffect(() => {
    const isGenerating = currentPhase !== 'idle' && currentPhase !== 'completed' && currentPhase !== 'error';

    if (!isGenerating) {
      historyPushedRef.current = false;
      return;
    }

    // 더미 히스토리 한 번만 추가
    if (!historyPushedRef.current) {
      window.history.pushState({ generating: true }, '');
      historyPushedRef.current = true;
    }

    const handlePopState = () => {
      const confirmed = window.confirm('영상 생성이 진행 중입니다. 페이지를 떠나면 생성이 중단됩니다.\n\n정말 나가시겠습니까?');
      if (confirmed) {
        // 나가기 선택 시 리스너 제거 후 뒤로가기
        window.removeEventListener('popstate', handlePopState);
        historyPushedRef.current = false;
        window.history.back();
      } else {
        // 취소 시 히스토리 다시 추가
        window.history.pushState({ generating: true }, '');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentPhase]);

  // 렌더링 설정 생성
  const createRenderConfig = useCallback((): RenderConfig => {
    const settings = sceneData.customSettings;
    const texts = sceneData.scenes.map(scene => scene.text);
    const templateVideoUrl = getTemplateVideoPath(sceneData.category, sceneData.style);

    return {
      renderer: {
        ...DEFAULT_RENDERER_CONFIG,
        width: 1080,
        height: 1080,
        fps: 30,
        duration: texts.length * 5,
      },
      textStyle: {
        ...DEFAULT_TEXT_STYLE,
        fontFamily: settings?.fontFamily || "'Noto Sans KR', sans-serif",
        fontSize: settings?.fontSize || 50,
        color: settings?.textColor || '#ffffff',
        glowColor: settings?.glowColor || '#00ffff',
      },
      effects: [
        ...(settings?.effects || []),
        ...(settings?.letterEffect && settings.letterEffect !== 'none' ? [settings.letterEffect] : [])
      ] as EffectType[],
      charEffectMode: 'all' as CharEffectMode,
      texts,
      textPosition: (settings?.textPosition || 'random') as TextPosition,
      videoSrc: templateVideoUrl,
      referenceImageSrc: sceneData.referenceImage,
    };
  }, [sceneData]);

  // 브라우저 렌더링으로 영상 생성
  const startGeneration = useCallback(async () => {
    if (!isWebCodecsSupported) return;

    try {
      // Phase 1: 영상/리소스 로드
      setCurrentPhase('loading-video');
      setOverallProgress(5);

      const renderConfig = createRenderConfig();
      const compositor = new VideoCompositor(renderConfig);
      compositorRef.current = compositor;

      await compositor.initialize();
      setOverallProgress(20);

      // Phase 2: 프레임 렌더링
      setCurrentPhase('rendering');
      const frames = await compositor.renderAllFrames((progress) => {
        if (progress.phase === 'rendering') {
          setOverallProgress(20 + progress.percentage * 0.4); // 20-60%
        }
      });

      // Phase 3: MP4 인코딩
      setCurrentPhase('encoding');
      const blob = await createMP4FromFrames(
        frames,
        {
          width: renderConfig.renderer.width,
          height: renderConfig.renderer.height,
          fps: renderConfig.renderer.fps,
          bitrate: 5_000_000,
          codec: 'avc1',
        },
        (progress) => {
          if (progress.phase === 'encoding') {
            setOverallProgress(60 + progress.percentage * 0.25); // 60-85%
          } else if (progress.phase === 'muxing') {
            setOverallProgress(85 + progress.percentage * 0.05); // 85-90%
          }
        }
      );

      // Phase 4: Firebase 업로드
      setCurrentPhase('uploading');
      setOverallProgress(90);

      const videoUrl = await uploadToFirebase(blob);
      setOverallProgress(100);

      // 완료
      setCurrentPhase('completed');
      compositor.dispose();

      onComplete(videoUrl);
    } catch (error) {
      console.error('Generation error:', error);
      setCurrentPhase('error');
      setErrorMessage(error instanceof Error ? error.message : '생성 중 오류가 발생했습니다.');

      if (compositorRef.current) {
        compositorRef.current.dispose();
      }
    }
  }, [isWebCodecsSupported, createRenderConfig, onComplete]);

  // Firebase Storage 업로드
  const uploadToFirebase = async (blob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('file', blob, 'hologram-video.mp4');
    formData.append('folder', 'generated-videos');

    const response = await fetch('/api/upload-video', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      // 업로드 실패 시 Blob URL 반환 (로컬 다운로드용)
      console.warn('Firebase upload failed, using blob URL');
      return URL.createObjectURL(blob);
    }

    const result = await response.json();
    return result.url;
  };

  // 생성 시작
  useEffect(() => {
    if (!isGeneratingRef.current && isWebCodecsSupported) {
      isGeneratingRef.current = true;
      startTimeRef.current = Date.now();
      startGeneration();
    }
  }, [isWebCodecsSupported, startGeneration]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (compositorRef.current) {
        compositorRef.current.dispose();
      }
    };
  }, []);

  // 시간 포맷 함수
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 예상 소요 시간 (브라우저 렌더링 기준)
  const getEstimatedTime = (): string => {
    switch (currentPhase) {
      case 'loading-video': return '약 2-3초';
      case 'rendering': return '약 5-10초';
      case 'encoding': return '약 3-5초';
      case 'uploading': return '약 2-3초';
      default: return '';
    }
  };

  const getTotalEstimatedTime = (): string => {
    return '약 5~10분';
  };

  const getPhaseLabel = () => {
    switch (currentPhase) {
      case 'idle': return '준비 중...';
      case 'loading-video': return '리소스 로드 중...';
      case 'rendering': return '프레임 렌더링 중...';
      case 'encoding': return 'MP4 인코딩 중...';
      case 'uploading': return '업로드 중...';
      case 'completed': return '완료!';
      case 'error': return '오류 발생';
    }
  };

  const getPhaseDescription = () => {
    switch (currentPhase) {
      case 'idle': return '잠시만 기다려주세요...';
      case 'loading-video': return '템플릿 영상과 리소스를 불러오고 있습니다';
      case 'rendering': return '영상을 렌더링하고 있습니다';
      case 'encoding': return 'WebCodecs로 MP4 영상을 생성합니다';
      case 'uploading': return '완성된 영상을 업로드합니다';
      case 'completed': return '영상이 완성되었습니다!';
      case 'error': return '문제가 발생했습니다';
    }
  };

  const isPhaseComplete = (phase: string) => {
    const phaseOrder = ['loading-video', 'rendering', 'encoding', 'uploading', 'completed'];
    const currentIndex = phaseOrder.indexOf(currentPhase);
    const phaseIndex = phaseOrder.indexOf(phase);
    return currentIndex > phaseIndex || currentPhase === 'completed';
  };

  const isPhaseActive = (phase: string) => currentPhase === phase;

  const phases = [
    { id: 'loading-video', label: '리소스 로드', icon: '📥' },
    { id: 'rendering', label: '프레임 렌더링', icon: '🎨' },
    { id: 'encoding', label: 'MP4 인코딩', icon: '🎬' },
    { id: 'uploading', label: '업로드', icon: '☁️' },
  ];

  return (
    <div className="animate-fade-in h-full flex flex-col overflow-hidden">
      <div className="flex-none mb-6 text-center lg:text-left">
        <h1 className="text-3xl font-extrabold text-white mb-2 drop-shadow-sm">
          영상 생성 중
        </h1>
        <p className="text-gray-400 text-sm">
          브라우저에서 직접 렌더링합니다. 빠르게 완료됩니다!
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 items-center justify-center">
        {/* Left Side: Preview Visual */}
        <div className="flex flex-col items-center justify-center min-h-0 w-full">
          <div className="w-full max-w-[700px] aspect-square bg-gradient-to-br from-slate-900/80 to-black/80 border border-blue-500/20 rounded-[1.5rem] p-8 backdrop-blur-md flex flex-col items-center justify-center shadow-[0_0_40px_-10px_rgba(59,130,246,0.05)] relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full scale-150 animate-pulse-slow pointer-events-none"></div>

            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={templateImageUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />

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
                    <span className="text-blue-400">{Math.round(overallProgress)}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-purple-500 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>

                  <div className="mt-3 space-y-1">
                    {currentPhase !== 'completed' && currentPhase !== 'error' && (
                      <>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">경과 시간: <span className="text-white font-mono">{formatTime(elapsedTime)}</span></span>
                          <span className="text-gray-400">전체 예상: <span className="text-green-300">{getTotalEstimatedTime()}</span></span>
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
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-inner ${isDone ? 'bg-green-500 text-white' : isActive ? 'bg-blue-500 text-white animate-pulse' : 'bg-gray-800 text-gray-500'}`}>
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
                <div className="bg-black/40 rounded-xl p-4 border border-blue-500/10 -mt-4">
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
