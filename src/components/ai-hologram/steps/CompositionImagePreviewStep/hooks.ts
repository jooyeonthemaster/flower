import { useEffect, useRef } from 'react';
import { GenerationPhase } from './constants';

export function usePageExitWarning(generationPhase: GenerationPhase) {
  const historyPushedRef = useRef(false);

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
}

export function useElapsedTimer(
  generationPhase: GenerationPhase,
  startTimeRef: React.MutableRefObject<number>,
  setElapsedTime: (time: number) => void
) {
  useEffect(() => {
    if (generationPhase === 'done' || generationPhase === 'idle') return;

    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [generationPhase, startTimeRef, setElapsedTime]);
}
