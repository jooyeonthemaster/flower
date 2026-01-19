'use client';

import { useState, useEffect, useRef } from 'react';
import { SceneData } from './MultiSceneStep';
import { CustomSettings } from './TextPreviewStep';

// 템플릿 이미지/영상 경로 생성 헬퍼 함수
const getTemplateImagePath = (category: string, style: string): string => {
  return `/templates/images/${category}-${style}.png`;
};

const getTemplateVideoPath = (category: string, style: string): string => {
  return `/templates/videos/${category}-${style}.mp4`;
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
  // 템플릿 이미지 경로 (AI 생성 없이 바로 사용)
  const templateImageUrl = getTemplateImagePath(sceneData.category, sceneData.style);
  const isGeneratingRef = useRef(false);

  // 생성 시작
  useEffect(() => {
    if (!isGeneratingRef.current) {
      isGeneratingRef.current = true;
      startGeneration();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startGeneration = async () => {
    try {
      // Phase 1: 템플릿 영상 로드
      setCurrentPhase('loading-video');
      setOverallProgress(10);

      const templateVideoUrl = getTemplateVideoPath(sceneData.category, sceneData.style);
      console.log('Using template video:', templateVideoUrl);

      // 영상 파일 존재 여부 확인
      const videoCheckResponse = await fetch(templateVideoUrl, { method: 'HEAD' });
      if (!videoCheckResponse.ok) {
        throw new Error(`템플릿 영상을 찾을 수 없습니다: ${templateVideoUrl}`);
      }

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

  // 영상 루프 (5초 → 30초)
  const loopVideo = async (templateVideoUrl: string): Promise<{ videoUrl: string; looped: boolean }> => {
    console.log('Looping video 6 times (5s → 30s) with 1:1 crop');
    setOverallProgress(60);

    // 서버 기준 절대 URL 생성 (fetch가 로컬 파일을 다운로드할 수 있도록)
    const absoluteUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${templateVideoUrl}`
      : templateVideoUrl;

    const response = await fetch('/api/ai/loop-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoUrl: absoluteUrl,  // URL 직접 전달
        loopCount: 6,           // 5초 × 6 = 30초
        cropTo1x1: true,        // 16:9 → 1:1 중앙 크롭
        trimToSeconds: 5        // 8초 영상 → 5초로 트림
      })
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

  const getPhaseLabel = () => {
    switch (currentPhase) {
      case 'idle': return '준비 중...';
      case 'loading-video': return '템플릿 영상 로드 중...';
      case 'looping-video': return '30초 영상으로 확장 중...';
      case 'applying-overlay': return '텍스트 오버레이 적용 중...';
      case 'completed': return '완료!';
      case 'error': return '오류 발생';
    }
  };

  const getPhaseDescription = () => {
    switch (currentPhase) {
      case 'idle': return '잠시만 기다려주세요...';
      case 'loading-video': return '템플릿 영상을 불러오고 있습니다';
      case 'looping-video': return '5초 영상을 30초 영상으로 확장합니다';
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

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">

        {/* Left Side: Preview Visual (7/12) */}
        <div className="lg:col-span-7 flex flex-col min-h-0">
          <div className="bg-gradient-to-br from-slate-900/80 to-black/80 border border-blue-500/20 rounded-[1.5rem] p-8 backdrop-blur-md flex-1 flex flex-col items-center justify-center shadow-[0_0_40px_-10px_rgba(59,130,246,0.05)] relative overflow-hidden">
            {/* Background Ambient Effect */}
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full scale-150 animate-pulse-slow pointer-events-none"></div>

            <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 group">
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

        {/* Right Side: Progress Info (5/12) */}
        <div className="lg:col-span-5 flex flex-col h-full gap-4 min-h-0">
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
  );
}
