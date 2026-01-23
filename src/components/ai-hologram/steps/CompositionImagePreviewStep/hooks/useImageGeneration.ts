'use client';

import { useState, useEffect, useRef } from 'react';
import { CompositionData } from '../../CompositionInputStep';
import { GenerationState, GenerationPhase, GeneratedDualFrame, UseImageGenerationReturn } from '../types';
import { TEST_MODE } from '../constants';

export function useImageGeneration(data: CompositionData): UseImageGenerationReturn {
  const [state, setState] = useState<GenerationState>('idle');
  const [generatedFrames, setGeneratedFrames] = useState<GeneratedDualFrame[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [generationPhase, setGenerationPhase] = useState<GenerationPhase>('idle');
  const [backgroundProgress, setBackgroundProgress] = useState<boolean[]>([]);
  const [textFrameProgress, setTextFrameProgress] = useState<boolean[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const historyPushedRef = useRef(false);

  const messageCount = TEST_MODE ? 1 : data.messages.length;

  const completedBackgrounds = backgroundProgress.filter(Boolean).length;
  const completedTextFrames = textFrameProgress.filter(Boolean).length;
  const totalProgress = ((completedBackgrounds + completedTextFrames) / (messageCount * 2)) * 100;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 경과 시간 타이머
  useEffect(() => {
    if (state === 'completed' || state === 'error' || state === 'idle') return;

    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [state]);

  // 화면 이탈 경고 - 탭 닫기, 새로고침
  useEffect(() => {
    if (state !== 'generating') return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '이미지 생성이 진행 중입니다. 페이지를 떠나면 생성이 중단됩니다.';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state]);

  // 화면 이탈 경고 - 뒤로가기 버튼
  useEffect(() => {
    if (state !== 'generating') {
      historyPushedRef.current = false;
      return;
    }

    if (!historyPushedRef.current) {
      window.history.pushState({ generating: true }, '');
      historyPushedRef.current = true;
    }

    const handlePopState = () => {
      const confirmed = window.confirm(
        '이미지 생성이 진행 중입니다. 페이지를 떠나면 생성이 중단됩니다.\n\n정말 나가시겠습니까?'
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
  }, [state]);

  const generateBackgroundImage = async (): Promise<string> => {
    const response = await fetch('/api/ai/generate-background', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: data.category,
        style: data.style,
        referenceImage: data.referenceImage,
      }),
    });

    if (!response.ok) {
      throw new Error('배경 이미지 생성 실패');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || '배경 이미지 생성 실패');
    }

    return result.imageUrl;
  };

  const generateTextFrame = async (text: string, backgroundImage: string): Promise<string> => {
    const response = await fetch('/api/ai/generate-text-frame', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        backgroundImage,
        category: data.category,
        style: data.style,
        referenceImage: data.referenceImage,
      }),
    });

    if (!response.ok) {
      throw new Error('텍스트 프레임 생성 실패');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || '텍스트 프레임 생성 실패');
    }

    return result.imageUrl;
  };

  const handleGenerateImages = async () => {
    startTimeRef.current = Date.now();
    setElapsedTime(0);
    setState('generating');
    setErrorMessage('');
    setGeneratedFrames([]);
    setGenerationPhase('background');
    setBackgroundProgress(new Array(messageCount).fill(false));
    setTextFrameProgress(new Array(messageCount).fill(false));

    try {
      // Phase 1: 배경 이미지 병렬 생성
      const backgroundPromises = data.messages.slice(0, messageCount).map(async (_, index) => {
        const result = await generateBackgroundImage();
        setBackgroundProgress(prev => {
          const updated = [...prev];
          updated[index] = true;
          return updated;
        });
        return result;
      });

      const backgroundUrls = await Promise.all(backgroundPromises);

      // Phase 2: 텍스트 프레임 병렬 생성
      setGenerationPhase('textframe');

      const textFramePromises = backgroundUrls.map(async (backgroundUrl, index) => {
        const message = data.messages[index];
        const result = await generateTextFrame(message, backgroundUrl);
        setTextFrameProgress(prev => {
          const updated = [...prev];
          updated[index] = true;
          return updated;
        });
        return result;
      });

      const textFrameUrls = await Promise.all(textFramePromises);

      // 결과 조합
      const frames: GeneratedDualFrame[] = backgroundUrls.map((backgroundUrl, index) => ({
        message: data.messages[index],
        fullImageUrl: textFrameUrls[index],
        startFrameUrl: backgroundUrl,
        endFrameUrl: textFrameUrls[index],
      }));

      setGeneratedFrames(frames);
      setGenerationPhase('done');
      setState('completed');

    } catch (error) {
      console.error('Image generation error:', error);
      setState('error');
      setGenerationPhase('idle');
      setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    }
  };

  const handleRegenerate = () => {
    setState('idle');
    setGeneratedFrames([]);
    setSelectedIndex(0);
    setGenerationPhase('idle');
    setBackgroundProgress([]);
    setTextFrameProgress([]);
  };

  return {
    state,
    generatedFrames,
    selectedIndex,
    errorMessage,
    generationPhase,
    backgroundProgress,
    textFrameProgress,
    elapsedTime,
    totalProgress,
    messageCount,
    completedBackgrounds,
    completedTextFrames,
    handleGenerateImages,
    handleRegenerate,
    setSelectedIndex,
    formatTime,
  };
}
