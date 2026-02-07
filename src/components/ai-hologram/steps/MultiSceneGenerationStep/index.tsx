'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SceneData } from '../MultiSceneStep';
import { CustomSettings } from '../TextPreviewStep';
import {
  VideoCompositor,
  DEFAULT_RENDERER_CONFIG,
  DEFAULT_TEXT_STYLE,
  type RenderConfig,
  type EffectType,
  type TextPosition,
  type CharEffectMode,
} from '@/lib/canvas-renderer';
import { createMP4FromFrames, createMP4FromFrameStream, checkWebCodecsSupport } from '@/lib/video-encoder';
import { storage, auth } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signInAnonymously } from 'firebase/auth';
import TemplatePreview from './TemplatePreview';
import ProgressDisplay from './ProgressDisplay';
import {
  STANDARD_COLOR,
  getTemplateImagePath,
  getTemplateVideoPath,
  type GenerationPhase,
} from './constants';

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

  // Firebase Storage 직접 업로드 (AI 영상 합성 방식 적용)
  const uploadToFirebase = async (blob: Blob): Promise<string> => {
    try {
      console.log('[Upload] Starting direct Firebase upload');
      console.log(`[Upload] Video size: ${(blob.size / 1024 / 1024).toFixed(2)}MB`);

      // Step 1: 익명 인증 (이미 로그인되어 있으면 skip)
      if (!auth.currentUser) {
        console.log('[Upload] Signing in anonymously...');
        await signInAnonymously(auth);
        console.log('[Upload] Anonymous sign-in complete');
      } else {
        console.log('[Upload] Already signed in:', auth.currentUser.uid);
      }

      // Step 2: 파일명 생성 (AI 합성과 동일한 패턴)
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 8);
      const filename = `generated-videos/hologram-${timestamp}-${randomId}.mp4`;

      // Step 3: Firebase Storage 참조 생성
      const storageRef = ref(storage, filename);

      // Step 4: 직접 업로드 (Vercel 제한 회피)
      const metadata = {
        contentType: 'video/mp4',
      };

      console.log(`[Upload] Uploading to ${filename}...`);
      await uploadBytes(storageRef, blob, metadata);
      console.log('[Upload] Upload complete');

      // Step 5: Public URL 획득
      const downloadUrl = await getDownloadURL(storageRef);
      console.log('[Upload] Firebase URL:', downloadUrl);

      return downloadUrl;
    } catch (error) {
      console.error('[Upload] Firebase upload failed:', error);

      // 에러 메시지 개선
      if (error instanceof Error) {
        if (error.message.includes('unauthorized') || error.message.includes('permission-denied')) {
          throw new Error(
            '업로드 권한이 없습니다. Firebase Storage Rules를 확인해주세요.\n\n' +
            '에러: ' + error.message
          );
        }
      }

      throw new Error(
        `영상 업로드에 실패했습니다. 네트워크 연결을 확인하고 다시 시도해주세요.\n\n${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

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

      // Phase 2 & 3: 프레임 렌더링 및 인코딩 (Streaming Pipeline)
      setCurrentPhase('rendering');

      let blob: Blob;
      try {
        // 타임아웃 설정
        const renderTimeout = 600000; // 10분 (버퍼링 안정성 향상)
        const startTime = Date.now();

        // 최적화 버전 시도 (Sequential Playback + Streaming Encoding)
        const frameStream = compositor.renderAllFramesOptimized((progress) => {
          if (progress.phase === 'rendering') {
            setOverallProgress(20 + progress.percentage * 0.4); // 20-60%
          }
        });

        const expectedFrames = compositor.getTotalFrames();
        const encoderConfig = {
          width: renderConfig.renderer.width,
          height: renderConfig.renderer.height,
          fps: renderConfig.renderer.fps,
          bitrate: 5_000_000,
          codec: 'avc1' as const,
        };

        console.log(`🚀 Starting streaming pipeline: ${expectedFrames} frames`);

        // ✅ 스트리밍 방식: 프레임을 즉시 인코딩 (메모리 절약)
        setCurrentPhase('encoding');

        let lastProgressTime = Date.now();
        blob = await createMP4FromFrameStream(
          frameStream,
          expectedFrames,
          encoderConfig,
          (progress) => {
            // 타임아웃 체크
            if (Date.now() - startTime > renderTimeout) {
              throw new Error(
                `Rendering timeout at ${progress.currentFrame}/${expectedFrames} frames`
              );
            }

            // 진행률 업데이트
            if (progress.phase === 'encoding') {
              setOverallProgress(60 + progress.percentage * 0.25); // 60-85%
            } else if (progress.phase === 'muxing') {
              setOverallProgress(85 + progress.percentage * 0.05); // 85-90%
            }

            // 주기적 로깅 (매 5초)
            const now = Date.now();
            if (now - lastProgressTime > 5000) {
              console.log(`📊 Streaming progress: ${progress.currentFrame}/${expectedFrames} (${progress.percentage}%)`);
              lastProgressTime = now;
            }
          }
        );

        console.log(`✅ Streaming pipeline succeeded in ${Math.round((Date.now() - startTime) / 1000)}s`);

      } catch (error) {
        // Fallback: 기존 방식 (Seek + Batch Encoding)
        console.warn('⚠️ Streaming pipeline failed, falling back to batch method:', error);
        setCurrentPhase('rendering');

        const frames = await compositor.renderAllFrames((progress) => {
          if (progress.phase === 'rendering') {
            setOverallProgress(20 + progress.percentage * 0.4);
          }
        });

        setCurrentPhase('encoding');
        blob = await createMP4FromFrames(
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
      }

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

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 lg:p-8 overflow-auto custom-scrollbar-light">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-none mb-6 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="headline-step text-[#8A9A5B]">STANDARD</span>
          <span className="text-xl text-gray-300">✦</span>
          <span className="headline-step text-gray-900">생성 중</span>
        </div>
        <p className="text-gray-500 text-sm md:text-base">
          브라우저에서 직접 렌더링합니다. 빠르게 완료됩니다!
        </p>
      </motion.div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 items-center justify-center">
        {/* Left Side: Preview Visual */}
        <TemplatePreview
          templateImageUrl={templateImageUrl}
          currentPhase={currentPhase}
        />

        {/* Right Side: Progress Info */}
        <ProgressDisplay
          currentPhase={currentPhase}
          overallProgress={overallProgress}
          elapsedTime={elapsedTime}
          scenes={sceneData.scenes}
          errorMessage={errorMessage}
          onBack={onBack}
        />
      </div>
    </div>
  );
}
