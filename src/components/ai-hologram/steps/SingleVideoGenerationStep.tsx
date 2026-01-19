'use client';

import { useState, useEffect, useRef } from 'react';

interface SingleVideoGenerationStepProps {
  imageUrl: string; // 승인된 이미지 URL
  onComplete: (videoUrl: string) => void;
  onBack: () => void;
}

type GenerationPhase = 'idle' | 'uploading' | 'generating' | 'looping' | 'completed' | 'error';

export default function SingleVideoGenerationStep({
  imageUrl,
  onComplete,
  onBack
}: SingleVideoGenerationStepProps) {
  const [phase, setPhase] = useState<GenerationPhase>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const isGeneratingRef = useRef(false);

  useEffect(() => {
    if (!isGeneratingRef.current && phase === 'idle') {
      isGeneratingRef.current = true;
      startGeneration();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startGeneration = async () => {
    try {
      // Phase 1: 이미지 업로드 (Data URL인 경우)
      let externalImageUrl = imageUrl;

      if (imageUrl.startsWith('data:')) {
        setPhase('uploading');
        setProgress(10);

        const uploadResponse = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataUrl: imageUrl,
            filename: `hologram-${Date.now()}.png`,
          }),
        });

        const uploadResult = await uploadResponse.json();
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || '이미지 업로드 실패');
        }

        externalImageUrl = uploadResult.url;
        console.log('Image uploaded:', externalImageUrl);
      }

      setProgress(20);

      // Phase 2: Higgsfield로 5초 영상 생성
      setPhase('generating');
      setProgress(30);

      const videoResponse = await fetch('/api/ai/generate-video-higgsfield', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceImageUrl: externalImageUrl,
          prompt: 'Gentle holographic animation, floating particles, subtle glow effect, slow movement, seamless loop',
          duration: 5,
        }),
      });

      setProgress(60);

      const videoResult = await videoResponse.json();
      if (!videoResult.success) {
        throw new Error(videoResult.error || '영상 생성 실패');
      }

      console.log('5-second video generated');

      // Phase 3: 5초 영상을 6번 루프하여 30초 영상 생성
      setPhase('looping');
      setProgress(70);

      const loopResponse = await fetch('/api/ai/loop-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoDataUrl: videoResult.videoUrl,
          loopCount: 6,
          outputRatio: '1:1',
        }),
      });

      setProgress(90);

      const loopResult = await loopResponse.json();
      if (!loopResult.success) {
        throw new Error(loopResult.error || '영상 루프 실패');
      }

      console.log('30-second looped video created');

      // 완료
      setVideoUrl(loopResult.videoUrl);
      setProgress(100);
      setPhase('completed');

      // 약간의 딜레이 후 완료 콜백
      setTimeout(() => {
        onComplete(loopResult.videoUrl);
      }, 1000);

    } catch (error) {
      console.error('Generation error:', error);
      setPhase('error');
      setErrorMessage(error instanceof Error ? error.message : '영상 생성 중 오류가 발생했습니다.');
    }
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case 'idle': return '준비 중...';
      case 'uploading': return '이미지 업로드 중...';
      case 'generating': return 'AI 영상 생성 중... (약 1-2분 소요)';
      case 'looping': return '30초 영상으로 변환 중...';
      case 'completed': return '완료!';
      case 'error': return '오류 발생';
    }
  };

  const getPhaseIcon = () => {
    switch (phase) {
      case 'idle':
      case 'uploading':
        return '📤';
      case 'generating':
        return '🎬';
      case 'looping':
        return '🔄';
      case 'completed':
        return '✅';
      case 'error':
        return '❌';
    }
  };

  return (
    <div className="animate-fade-in h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{getPhaseIcon()}</div>
          <h2 className="text-2xl font-bold text-white mb-2">배경 영상 생성</h2>
          <p className="text-blue-300">{getPhaseLabel()}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>진행률</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Phase Steps */}
        <div className="w-full space-y-3 mb-8">
          {[
            { id: 'uploading', label: '이미지 업로드', icon: '📤' },
            { id: 'generating', label: 'AI 영상 생성 (5초)', icon: '🎬' },
            { id: 'looping', label: '30초 영상 변환', icon: '🔄' },
          ].map((step, index) => {
            const phases: GenerationPhase[] = ['uploading', 'generating', 'looping'];
            const currentIndex = phases.indexOf(phase);
            const stepIndex = phases.indexOf(step.id as GenerationPhase);
            const isActive = phase === step.id;
            const isCompleted = currentIndex > stepIndex || phase === 'completed';

            return (
              <div
                key={step.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'border-green-500/50 bg-green-500/10'
                    : isActive
                      ? 'border-blue-500/50 bg-blue-500/10'
                      : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? 'bg-green-600'
                      : isActive
                        ? 'bg-blue-600 animate-pulse'
                        : 'bg-gray-700'
                  }`}>
                    {isCompleted ? '✓' : isActive ? step.icon : (index + 1)}
                  </div>
                  <span className={`font-medium ${
                    isCompleted
                      ? 'text-green-300'
                      : isActive
                        ? 'text-white'
                        : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Preview Image */}
        {imageUrl && phase !== 'error' && (
          <div className="mb-8">
            <p className="text-sm text-gray-400 mb-2 text-center">원본 이미지</p>
            <div className="w-48 h-48 rounded-xl overflow-hidden bg-black/50 border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="원본 이미지"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Error State */}
        {phase === 'error' && (
          <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/50">
            <p className="text-red-300 text-sm mb-4">{errorMessage}</p>
            <button
              onClick={onBack}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
            >
              돌아가기
            </button>
          </div>
        )}

        {/* Completed State - Video Preview */}
        {phase === 'completed' && videoUrl && (
          <div className="text-center">
            <p className="text-green-300 mb-4">영상이 성공적으로 생성되었습니다!</p>
            <video
              src={videoUrl}
              className="w-64 h-64 rounded-xl object-cover mx-auto"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        )}

        {/* Info Text */}
        {phase !== 'error' && phase !== 'completed' && (
          <div className="text-center text-sm text-gray-500">
            <p>Higgsfield AI로 영상을 생성합니다.</p>
            <p className="mt-1">예상 소요 시간: 1~3분</p>
          </div>
        )}

      </div>
    </div>
  );
}
