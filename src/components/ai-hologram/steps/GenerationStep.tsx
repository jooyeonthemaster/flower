import { useState, useEffect, useRef } from 'react';
import { aiService } from '@/services/aiService';

interface GenerationStepProps {
  promptData: {
    prompt: string;
    category: string;
    style: string;
    referenceImage?: string;
  };
  onComplete: (videoUrl: string) => void;
  onBack: () => void;
}

export default function GenerationStep({ promptData, onComplete, onBack }: GenerationStepProps) {
  const [status, setStatus] = useState<'idle' | 'generating-image' | 'image-ready' | 'generating-video' | 'error'>('idle');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const hasStartedRef = useRef(false); // 중복 실행 방지

  const startImageGeneration = async () => {
    // 이미 실행 중이면 리턴
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    setStatus('generating-image');
    setErrorMsg(null);

    try {
      const res = await aiService.generateImage({
        prompt: promptData.prompt,
        category: promptData.category,
        style: promptData.style,
        referenceImage: promptData.referenceImage
      });

      if (res.success && res.imageUrl) {
        setImageUrl(res.imageUrl);
        setStatus('image-ready');
      } else {
        throw new Error(res.error || '이미지 생성 실패');
      }
    } catch (err: unknown) {
      hasStartedRef.current = false; // 에러 시 재시도 가능하도록 초기화
      setStatus('error');
      const message = err instanceof Error ? err.message : 'Unknown error';
      setErrorMsg(message);
    }
  };

  const startVideoGeneration = async () => {
    if (!imageUrl) return;
    
    setStatus('generating-video');
    try {
      const res = await aiService.generateVideo({
        sourceImageUrl: imageUrl,
        prompt: `Create a holographic loop video, style: ${promptData.style}, slow rotation, glowing particles, 3d effect`
      });

      if (res.success && res.videoUrl) {
        onComplete(res.videoUrl);
      } else {
        throw new Error(res.error || '영상 생성 실패');
      }
    } catch (err: unknown) {
      setStatus('error');
      const message = err instanceof Error ? err.message : 'Unknown error';
      setErrorMsg(message);
    }
  };

  useEffect(() => {
    if (status === 'idle') {
      startImageGeneration();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'generating-image' || status === 'generating-video') {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev;
          return prev + (Math.random() * 5);
        });
      }, 300);
    } else if (status === 'image-ready' || status === 'error') {
      setProgress(100);
    }
    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="h-full flex flex-col lg:flex-row gap-8 animate-fade-in">
      
      {/* Left Side: Status & Controls */}
      <div className="lg:w-1/3 flex flex-col justify-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white leading-tight">
            {status === 'generating-image' && 'AI가 디자인을\n구상하고 있습니다...'}
            {status === 'image-ready' && '디자인 초안이\n완성되었습니다!'}
            {status === 'generating-video' && '홀로그램 영상을\n렌더링 중입니다...'}
            {status === 'error' && '오류가 발생했습니다.'}
          </h2>
          
          <div className="text-gray-400 space-y-1">
            <div className={`flex items-center space-x-3 ${status === 'generating-image' ? 'text-blue-400' : ''}`}>
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">1</span>
              <span>이미지 생성</span>
              {status === 'generating-image' && <span className="animate-pulse">...</span>}
            </div>
            <div className={`flex items-center space-x-3 ${status === 'generating-video' ? 'text-blue-400' : ''}`}>
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">2</span>
              <span>비디오 렌더링</span>
              {status === 'generating-video' && <span className="animate-pulse">...</span>}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {(status === 'generating-image' || status === 'generating-video') && (
          <div className="space-y-2">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-right text-xs text-gray-500">{Math.round(progress)}%</div>
          </div>
        )}

        {/* Error Msg */}
        {status === 'error' && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 text-sm">
            <p>{errorMsg}</p>
            <button
              onClick={() => {
                hasStartedRef.current = false; // 재시도 시 초기화
                setStatus('idle');
              }}
              className="mt-3 px-4 py-2 bg-red-600 rounded-lg text-xs hover:bg-red-700"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* Actions */}
        {status === 'image-ready' && (
          <div className="space-y-3">
            <button
              onClick={startVideoGeneration}
              className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              홀로그램 영상 생성하기
            </button>
            <button
              onClick={onBack}
              className="w-full py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all"
            >
              다시 디자인하기
            </button>
          </div>
        )}
      </div>

      {/* Right Side: Preview */}
      <div className="lg:w-2/3 h-full bg-black/40 rounded-2xl border border-white/10 overflow-hidden relative group">
        {imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Generated" className="w-full h-full object-contain" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500/50 space-y-4">
            <div className="w-20 h-20 border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-light tracking-widest">AI PROCESSING</span>
          </div>
        )}
        
        {(status === 'generating-image' || status === 'generating-video') && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent translate-y-[-100%] animate-[scan_3s_linear_infinite]"></div>
        )}
      </div>

    </div>
  );
}
