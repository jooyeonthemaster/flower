/**
 * Canvas 렌더러 React Hook
 * 비디오는 HTML video로 재생, 텍스트만 Canvas에 렌더링
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  CanvasTextRenderer,
  VideoCompositor,
  calculateEffects,
  isLetterEffect,
  DEFAULT_RENDERER_CONFIG,
  DEFAULT_TEXT_STYLE,
  SCENE_DURATION_SECONDS,
  ENTRANCE_DURATION_SECONDS,
  EXIT_DURATION_SECONDS,
  POSITION_TOP,
  POSITION_CENTER,
  POSITION_BOTTOM,
  type RenderConfig,
  type TextScene,
  type EffectContext,
  type EffectResult,
  type TextPosition,
  type EffectType,
  random,
  interpolate,
  Easing,
} from '@/lib/canvas-renderer';
import { createMP4FromFrames, checkWebCodecsSupport } from '@/lib/video-encoder';
import type { PreviewConfig, PreviewState, ExportState } from '../types';

interface UseCanvasRendererReturn {
  // 상태
  previewState: PreviewState;
  exportState: ExportState;
  exportProgress: number;
  currentFrame: number;
  totalFrames: number;
  isWebCodecsSupported: boolean;

  // 액션
  initializeCanvas: (canvas: HTMLCanvasElement) => void;
  initializeVideo: (video: HTMLVideoElement) => void;
  handleTimeUpdate: (currentTime: number) => void;
  exportVideo: () => Promise<Blob | null>;
  dispose: () => void;
}

/**
 * Canvas 렌더러 훅
 */
export function useCanvasRenderer(config: PreviewConfig): UseCanvasRendererReturn {
  // 상태
  const [previewState, setPreviewState] = useState<PreviewState>('loading');
  const [exportState, setExportState] = useState<ExportState>('idle');
  const [exportProgress, setExportProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [isWebCodecsSupported, setIsWebCodecsSupported] = useState(false);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const textRendererRef = useRef<CanvasTextRenderer | null>(null);
  const textScenesRef = useRef<TextScene[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // 설정
  const fps = 30;
  const sceneDuration = SCENE_DURATION_SECONDS * fps;

  // WebCodecs 지원 확인
  useEffect(() => {
    const support = checkWebCodecsSupport();
    setIsWebCodecsSupported(support.supported);
  }, []);

  // 텍스트 씬 생성
  useEffect(() => {
    textScenesRef.current = config.texts.map((text, index) => ({
      text,
      startFrame: index * sceneDuration,
      endFrame: (index + 1) * sceneDuration,
      seed: random(index * 123),
      position: config.textPosition as TextPosition,
    }));
    setTotalFrames(config.texts.length * sceneDuration);
  }, [config.texts, config.textPosition, sceneDuration]);

  // Canvas 초기화
  const initializeCanvas = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctxRef.current = ctx;
      textRendererRef.current = new CanvasTextRenderer(ctx, canvas.width, canvas.height);
    }
  }, []);

  // 비디오 초기화
  const initializeVideo = useCallback((video: HTMLVideoElement) => {
    videoRef.current = video;
    setPreviewState('playing');
  }, []);

  // Y 위치 계산
  const calculatePositionY = useCallback((position: TextPosition, seed: number, height: number): number => {
    if (position === 'random') {
      const randVal = seed % 1;
      if (randVal < 0.33) return height * (POSITION_TOP - 0.5);
      if (randVal < 0.66) return height * (POSITION_CENTER - 0.5);
      return height * (POSITION_BOTTOM - 0.5);
    }

    switch (position) {
      case 'top': return height * (POSITION_TOP - 0.5);
      case 'center': return height * (POSITION_CENTER - 0.5);
      case 'bottom': return height * (POSITION_BOTTOM - 0.5);
      default: return height * (POSITION_BOTTOM - 0.5);
    }
  }, []);

  // 텍스트 렌더링
  const renderText = useCallback((currentTime: number) => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    const textRenderer = textRendererRef.current;

    if (!ctx || !canvas || !textRenderer) return;

    const frameNumber = Math.floor(currentTime * fps);
    const { width, height } = canvas;

    // Canvas 클리어 (투명)
    ctx.clearRect(0, 0, width, height);

    // 현재 프레임에 해당하는 텍스트 씬 찾기
    const currentScene = textScenesRef.current.find(
      scene => frameNumber >= scene.startFrame && frameNumber < scene.endFrame
    );

    if (!currentScene) return;

    const localFrame = frameNumber - currentScene.startFrame;

    // 진입/퇴장 애니메이션
    const entranceFrames = ENTRANCE_DURATION_SECONDS * fps;
    const exitFrames = EXIT_DURATION_SECONDS * fps;

    const opacity = interpolate(
      localFrame,
      [0, entranceFrames, sceneDuration - exitFrames, sceneDuration],
      [0, 1, 1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // 진입 스케일 (elastic bounce)
    const scaleProgress = Math.min(localFrame / entranceFrames, 1);
    const entranceScale = Easing.elastic(1)(scaleProgress);

    // 위치 계산
    const positionY = calculatePositionY(currentScene.position, currentScene.seed, height);

    // 텍스트 스타일
    const textStyle = {
      ...DEFAULT_TEXT_STYLE,
      fontFamily: config.fontFamily,
      fontSize: config.fontSize,
      color: config.textColor,
      glowColor: config.glowColor,
    };

    // 글자별 이펙트 감지
    const hasLetterEffect = config.effects.some(e => isLetterEffect(e));
    const displayText = currentScene.text;
    // 줄바꿈 제외한 실제 글자 수 계산
    const visibleChars = displayText.replace(/\n/g, '');
    const totalChars = visibleChars.length;

    if (hasLetterEffect && totalChars > 0) {
      // 글자별 이펙트 모드: 각 글자마다 개별 이펙트 계산 (줄바꿈 제외)
      const charEffects: EffectResult[] = [];
      let charIndex = 0;

      for (let i = 0; i < displayText.length; i++) {
        // 줄바꿈 문자 건너뛰기
        if (displayText[i] === '\n') {
          continue;
        }

        const charContext: EffectContext = {
          frame: frameNumber,
          localFrame,
          fps,
          seed: currentScene.seed,
          width,
          height,
          text: currentScene.text,
          glowColor: config.glowColor,
          charIndex: charIndex,
          totalChars,
        };

        const charEffect = calculateEffects(config.effects, charContext);

        charEffects.push({
          ...charEffect,
          translateY: charEffect.translateY,
          opacity: charEffect.opacity * opacity,
          scale: charEffect.scale * entranceScale,
        });

        charIndex++;
      }

      // 기본 이펙트 (글자별 이펙트 제외)
      const nonLetterEffects = config.effects.filter(e => !isLetterEffect(e)) as typeof config.effects;
      const baseContext: EffectContext = {
        frame: frameNumber,
        localFrame,
        fps,
        seed: currentScene.seed,
        width,
        height,
        text: currentScene.text,
        glowColor: config.glowColor,
      };
      const baseEffects = calculateEffects(nonLetterEffects, baseContext);

      const finalBaseEffects: EffectResult = {
        ...baseEffects,
        translateY: baseEffects.translateY + positionY,
        opacity: baseEffects.opacity * opacity,
        scale: baseEffects.scale * entranceScale,
      };

      textRenderer.renderText(
        displayText,
        textStyle,
        finalBaseEffects,
        'perChar',
        charEffects
      );
    } else {
      // 기존 방식: 전체 텍스트에 이펙트 적용
      const effectContext: EffectContext = {
        frame: frameNumber,
        localFrame,
        fps,
        seed: currentScene.seed,
        width,
        height,
        text: currentScene.text,
        glowColor: config.glowColor,
      };

      const effects = calculateEffects(config.effects, effectContext);

      const finalEffects: EffectResult = {
        ...effects,
        translateY: effects.translateY + positionY,
        opacity: effects.opacity * opacity,
        scale: effects.scale * entranceScale,
      };

      const finalDisplayText = effects.displayText || currentScene.text;
      textRenderer.renderText(
        finalDisplayText,
        textStyle,
        finalEffects,
        config.charEffectMode === 'perChar' ? 'perChar' : 'whole'
      );
    }

    // 프레임 업데이트는 매 초마다만 (성능 최적화)
    if (frameNumber % fps === 0) {
      setCurrentFrame(frameNumber);
    }
  }, [config, calculatePositionY, fps, sceneDuration]);

  // 비디오 시간 업데이트 처리
  const handleTimeUpdate = useCallback((currentTime: number) => {
    // 30초 기준으로 시간 계산 (비디오가 30초 루프)
    const normalizedTime = currentTime % (config.texts.length * SCENE_DURATION_SECONDS);
    renderText(normalizedTime);
  }, [config.texts.length, renderText]);

  // 설정 변경 시 다시 렌더링
  useEffect(() => {
    if (videoRef.current) {
      handleTimeUpdate(videoRef.current.currentTime);
    }
  }, [config, handleTimeUpdate]);

  // 내보내기
  const exportVideo = useCallback(async (): Promise<Blob | null> => {
    if (!isWebCodecsSupported) {
      return null;
    }

    setExportState('preparing');
    setExportProgress(0);

    try {
      // RenderConfig 생성
      const renderConfig: RenderConfig = {
        renderer: {
          ...DEFAULT_RENDERER_CONFIG,
          width: 720,
          height: 720,
          fps: 30,
          duration: config.texts.length * SCENE_DURATION_SECONDS,
        },
        textStyle: {
          ...DEFAULT_TEXT_STYLE,
          fontFamily: config.fontFamily,
          fontSize: config.fontSize,
          color: config.textColor,
          glowColor: config.glowColor,
        },
        effects: config.effects,
        charEffectMode: config.charEffectMode === 'perChar' ? 'perChar' : 'whole',
        texts: config.texts,
        textPosition: config.textPosition,
        videoSrc: config.videoSrc,
        referenceImageSrc: config.referenceImageSrc,
      };

      // VideoCompositor 사용 (내보내기용)
      const compositor = new VideoCompositor(renderConfig);
      await compositor.initialize();

      // 프레임 렌더링
      setExportState('rendering');
      const frames = await compositor.renderAllFrames((progress) => {
        if (progress.phase === 'rendering') {
          setExportProgress(progress.percentage * 0.5);
        }
      });

      // MP4 인코딩
      setExportState('encoding');
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
            setExportProgress(50 + progress.percentage * 0.4);
          } else if (progress.phase === 'muxing') {
            setExportProgress(90 + progress.percentage * 0.1);
          }
        }
      );

      compositor.dispose();

      setExportState('complete');
      setExportProgress(100);

      setTimeout(() => {
        setExportState('idle');
        setExportProgress(0);
      }, 2000);

      return blob;
    } catch (error) {
      console.error('Export failed:', error);
      setExportState('error');
      return null;
    }
  }, [config, isWebCodecsSupported]);

  // 리소스 정리
  const dispose = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setPreviewState('idle');
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      dispose();
    };
  }, [dispose]);

  return {
    previewState,
    exportState,
    exportProgress,
    currentFrame,
    totalFrames,
    isWebCodecsSupported,
    initializeCanvas,
    initializeVideo,
    handleTimeUpdate,
    exportVideo,
    dispose,
  };
}

export default useCanvasRenderer;
