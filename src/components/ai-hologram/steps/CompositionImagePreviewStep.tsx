'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CompositionData } from './CompositionInputStep';

// 테스트 모드: true면 1개만 생성 (API 비용 절약)
const TEST_MODE = false;

// 카테고리/스타일 한글 매핑
const categoryLabels: Record<string, string> = {
  opening: '개업 축하',
  wedding: '결혼식',
  birthday: '생일',
  memorial: '추모',
  event: '행사/전시',
  promotion: '승진/영전',
};

const styleLabels: Record<string, string> = {
  elegant: '우아한',
  luxury: '럭셔리',
  neon: '네온',
  traditional: '전통',
  fantasy: '판타지',
  space: '스페이스',
  fancy: '화려하게',
  simple: '심플하게',
};

export interface GeneratedDualFrame {
  message: string;
  fullImageUrl: string;
  startFrameUrl: string;
  endFrameUrl: string;
}

interface CompositionImagePreviewStepProps {
  data: CompositionData;
  onNext: (generatedFrames: GeneratedDualFrame[]) => void;
  onBack: () => void;
}

type GenerationState = 'idle' | 'generating' | 'completed' | 'error';
type GenerationPhase = 'idle' | 'background' | 'textframe' | 'done';

export default function CompositionImagePreviewStep({
  data,
  onNext,
  onBack,
}: CompositionImagePreviewStepProps) {
  const [state, setState] = useState<GenerationState>('idle');
  const [generatedFrames, setGeneratedFrames] = useState<GeneratedDualFrame[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [generationPhase, setGenerationPhase] = useState<GenerationPhase>('idle');
  const [backgroundProgress, setBackgroundProgress] = useState<boolean[]>([]);
  const [textFrameProgress, setTextFrameProgress] = useState<boolean[]>([]);

  // 테스트 모드에서는 1개만 처리
  const messageCount = TEST_MODE ? 1 : data.messages.length;

  // 진행률 계산 (배경 50% + 텍스트 50%)
  const completedBackgrounds = backgroundProgress.filter(Boolean).length;
  const completedTextFrames = textFrameProgress.filter(Boolean).length;
  const totalProgress = ((completedBackgrounds + completedTextFrames) / (messageCount * 2)) * 100;

  // 배경 이미지 생성 (텍스트 없음, 1:1 비율)
  const generateBackgroundImage = async (): Promise<string> => {
    console.log('배경 이미지 생성 시작...');
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

    console.log('배경 이미지 생성 완료');
    return result.imageUrl;
  };

  // 텍스트 프레임 생성 (배경 + 텍스트, 1:1 비율)
  const generateTextFrame = async (text: string, backgroundImage: string): Promise<string> => {
    console.log('텍스트 프레임 생성 시작...', text);
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

    console.log('텍스트 프레임 생성 완료');
    return result.imageUrl;
  };

  // 모든 이미지 생성 (AI 2회 생성 방식 - 병렬 처리)
  const handleGenerateImages = async () => {
    setState('generating');
    setErrorMessage('');
    setGeneratedFrames([]);
    setGenerationPhase('background');
    setBackgroundProgress(new Array(messageCount).fill(false));
    setTextFrameProgress(new Array(messageCount).fill(false));

    try {
      // Phase 1: 모든 배경 이미지 병렬 생성
      console.log(`[Phase 1] 모든 배경 이미지 병렬 생성 시작... (${messageCount}개)`);

      const backgroundPromises = data.messages.slice(0, messageCount).map(async (_, index) => {
        const result = await generateBackgroundImage();
        setBackgroundProgress(prev => {
          const updated = [...prev];
          updated[index] = true;
          return updated;
        });
        console.log(`[Phase 1] 배경 이미지 ${index + 1}/${messageCount} 완료`);
        return result;
      });

      const backgroundUrls = await Promise.all(backgroundPromises);
      console.log(`[Phase 1] 모든 배경 이미지 생성 완료 (${backgroundUrls.length}개)`);

      // Phase 2: 모든 텍스트 프레임 병렬 생성
      setGenerationPhase('textframe');
      console.log(`[Phase 2] 모든 텍스트 프레임 병렬 생성 시작... (${messageCount}개)`);

      const textFramePromises = backgroundUrls.map(async (backgroundUrl, index) => {
        const message = data.messages[index];
        const result = await generateTextFrame(message, backgroundUrl);
        setTextFrameProgress(prev => {
          const updated = [...prev];
          updated[index] = true;
          return updated;
        });
        console.log(`[Phase 2] 텍스트 프레임 ${index + 1}/${messageCount} 완료`);
        return result;
      });

      const textFrameUrls = await Promise.all(textFramePromises);
      console.log(`[Phase 2] 모든 텍스트 프레임 생성 완료 (${textFrameUrls.length}개)`);

      // 결과 조합
      const frames: GeneratedDualFrame[] = backgroundUrls.map((backgroundUrl, index) => ({
        message: data.messages[index],
        fullImageUrl: textFrameUrls[index], // 미리보기용 (텍스트 있는 이미지)
        startFrameUrl: backgroundUrl,       // Start Frame = 배경만
        endFrameUrl: textFrameUrls[index],  // End Frame = 배경+텍스트
      }));

      setGeneratedFrames(frames);
      setGenerationPhase('done');
      setState('completed');
      console.log('[완료] 모든 이미지 생성 완료');

    } catch (error) {
      console.error('Image generation error:', error);
      setState('error');
      setGenerationPhase('idle');
      setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    }
  };

  // 다음 단계로 진행
  const handleNext = () => {
    onNext(generatedFrames);
  };

  // 재생성
  const handleRegenerate = () => {
    setState('idle');
    setGeneratedFrames([]);
    setSelectedIndex(0);
    setGenerationPhase('idle');
    setBackgroundProgress([]);
    setTextFrameProgress([]);
  };

  return (
    <div className="animate-fade-in h-full flex flex-col overflow-hidden">
      {/* 상단 헤더 */}
      <div className="flex-none mb-6 text-center lg:text-left">
        <h1 className="text-3xl font-extrabold text-white mb-2 drop-shadow-sm">
          <span className="text-amber-500 mr-2">Premium</span>
          AI 이미지 확인
        </h1>
        <p className="text-gray-400 text-sm">
          AI가 생성한 고품질 이미지를 확인하고 영상을 생성하세요.
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-full mx-auto items-center justify-center">

          {/* ================= 좌측: 프리뷰 및 썸네일 ================= */}
          <div className="flex flex-col items-center justify-center min-h-0 w-full">
            <div className="w-full max-w-[700px] aspect-square flex flex-col bg-gradient-to-br from-slate-900/80 to-black/80 border border-amber-500/20 rounded-[1.5rem] p-5 backdrop-blur-md shadow-[0_0_40px_-10px_rgba(251,191,36,0.05)] relative overflow-hidden">
              <div className="flex-none mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold border border-amber-500/20">P</span>
                  AI 생성 이미지
                </h3>
              </div>

              <div className="flex-1 flex flex-col justify-center min-h-0 overflow-hidden">
                {state === 'idle' && (
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_-5px_rgba(245,158,11,0.2)]">
                      <span className="text-5xl filter drop-shadow-lg">🎨</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">이미지 생성 준비</h3>
                    <p className="text-gray-400 max-w-md mb-8 leading-relaxed text-sm">
                      입력하신 <span className="text-amber-400 font-bold">{data.messages.length}개의 문구</span>를 바탕으로<br />
                      AI가 1:1 맞춤형 3D 아트웍을 생성합니다.
                    </p>
                    <button
                      onClick={handleGenerateImages}
                      className="px-10 py-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black font-bold text-lg shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)] hover:shadow-amber-500/50 hover:scale-105 transition-all"
                    >
                      AI 이미지 생성 시작
                    </button>
                  </div>
                )}

                {state === 'generating' && (
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <div className="relative w-24 h-24 mb-6">
                      <div className="absolute inset-0 rounded-full border-4 border-amber-500/20"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-500 animate-spin"></div>
                      <div className="absolute inset-2 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <span className="text-3xl animate-pulse">✨</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">프리미엄 아트웍 생성 중...</h3>
                    <p className="text-gray-400 mb-4 font-mono text-sm">
                      {generationPhase === 'background' ? 'Phase 1: 배경 이미지 생성' : 'Phase 2: 텍스트 프레임 생성'}
                    </p>
                    <div className="text-amber-400 text-xs mb-4">
                      {generationPhase === 'background'
                        ? `배경 ${completedBackgrounds}/${messageCount} 완료`
                        : `텍스트 ${completedTextFrames}/${messageCount} 완료`}
                    </div>
                    <div className="w-64 h-1.5 bg-gray-800 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500 ease-out"
                        style={{ width: `${totalProgress}%` }}
                      />
                    </div>
                    <p className="text-gray-500 text-xs mt-2">
                      병렬 처리 중 ({Math.round(totalProgress)}%)
                    </p>
                  </div>
                )}

                {state === 'error' && (
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <div className="w-24 h-24 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-6">
                      <span className="text-5xl">❌</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">생성 실패</h3>
                    <p className="text-gray-400 max-w-md mb-6 text-sm">
                      {errorMessage || '이미지 생성 중 오류가 발생했습니다.'}
                    </p>
                    <button
                      onClick={handleRegenerate}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold shadow-lg hover:scale-105 transition-all"
                    >
                      다시 시도
                    </button>
                  </div>
                )}

                {(state === 'completed' || (state === 'generating' && generatedFrames.length > 0)) && generatedFrames.length > 0 && (
                  <div className="flex flex-col h-full min-h-0">
                    {/* 메인 뷰어 */}
                    <div className="flex-1 relative flex items-center justify-center mb-4 min-h-0">
                      <div className="relative w-full h-full max-h-full aspect-square rounded-2xl overflow-hidden shadow-2xl border border-amber-500/20 bg-black/50 group">
                        <Image
                          src={generatedFrames[selectedIndex].endFrameUrl}
                          alt={`Scene ${selectedIndex + 1}`}
                          fill
                          className="object-contain"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-center text-white font-medium text-lg drop-shadow-md">{generatedFrames[selectedIndex].message}</p>
                        </div>
                      </div>

                      {/* 좌우 네비게이션 (오버레이) */}
                      <button
                        onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}
                        disabled={selectedIndex === 0}
                        className="absolute left-4 p-3 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/10 hover:bg-amber-500/20 hover:border-amber-500/50 disabled:opacity-0 transition-all z-10"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => setSelectedIndex(Math.min(generatedFrames.length - 1, selectedIndex + 1))}
                        disabled={selectedIndex === generatedFrames.length - 1}
                        className="absolute right-4 p-3 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/10 hover:bg-amber-500/20 hover:border-amber-500/50 disabled:opacity-0 transition-all z-10"
                      >
                        →
                      </button>
                    </div>

                    {/* 하단 썸네일 리스트 */}
                    <div className="h-20 min-h-[5rem] overflow-x-auto custom-scrollbar flex gap-2 px-1 pb-1 flex-none">
                      {generatedFrames.map((frame, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedIndex(index)}
                          className={`relative flex-shrink-0 aspect-square h-full rounded-lg overflow-hidden border-2 transition-all ${selectedIndex === index
                            ? 'border-amber-500 ring-2 ring-amber-500/20 scale-105 z-10'
                            : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                            }`}
                        >
                          <Image
                            src={frame.endFrameUrl}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                            {index + 1}
                          </div>
                        </button>
                      ))}
                      {state === 'generating' && Array.from({ length: messageCount - generatedFrames.length }).map((_, i) => (
                        <div key={`idx-${i}`} className="flex-shrink-0 aspect-square h-full rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-amber-500 rounded-full animate-spin"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= 우측: 진행 정보 및 액션 ================= */}
          <div className="flex flex-col items-center justify-center min-h-0 w-full">
            <div className="w-full max-w-[700px] aspect-square flex flex-col gap-4 min-h-0">
              <div className="flex-1 flex flex-col bg-slate-900 border border-amber-500/10 rounded-[1.5rem] overflow-hidden shadow-2xl min-h-0">
                {/* 헤더 */}
                <div className="p-6 pb-4 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-white/5 flex-none">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-amber-500/20 text-white flex items-center justify-center text-sm font-bold border border-amber-500/20">i</span>
                    생성 현황
                  </h3>
                </div>

                {/* 컨텐츠 */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-4 space-y-6">

                  {/* 정보 요약 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                      <p className="text-xs text-gray-500 mb-1">카테고리</p>
                      <p className="text-sm font-bold text-gray-200">{categoryLabels[data.category]}</p>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                      <p className="text-xs text-gray-500 mb-1">스타일</p>
                      <p className="text-sm font-bold text-amber-500">{styleLabels[data.style]}</p>
                    </div>
                  </div>

                  {/* 진행 리스트 */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center justify-between">
                      <span>Processing Queue</span>
                      <span className="text-amber-500">{generatedFrames.length} / {messageCount}</span>
                    </h4>
                    <div className="space-y-2">
                      {data.messages.slice(0, messageCount).map((msg, idx) => {
                        const bgDone = backgroundProgress[idx];
                        const textDone = textFrameProgress[idx];
                        const isProcessing = state === 'generating' && (!bgDone || !textDone);

                        return (
                          <div
                            key={idx}
                            onClick={() => generatedFrames[idx] && setSelectedIndex(idx)}
                            className={`group p-3 rounded-xl border flex items-center gap-3 transition-all ${generatedFrames[idx]
                              ? selectedIndex === idx
                                ? 'bg-amber-500/20 border-amber-500/50 shadow-[0_0_15px_-5px_rgba(245,158,11,0.3)]'
                                : 'bg-black/40 border-amber-500/10 hover:bg-amber-500/5 cursor-pointer'
                              : isProcessing
                                ? 'bg-amber-500/5 border-amber-500/30 animate-pulse'
                                : 'bg-white/5 border-transparent opacity-50'
                              }`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${generatedFrames[idx] ? 'bg-amber-500 text-black shadow-lg scale-110' : 'bg-gray-800 text-gray-500'
                              }`}>
                              {generatedFrames[idx] ? '✓' : idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${generatedFrames[idx] ? 'text-gray-200' : 'text-gray-500'}`}>{msg}</p>
                              {state === 'generating' && !generatedFrames[idx] && (
                                <p className="text-[10px] text-amber-400 mt-0.5">
                                  {!bgDone ? '배경 생성 중...' : !textDone ? '텍스트 생성 중...' : '완료'}
                                </p>
                              )}
                            </div>
                            {generatedFrames[idx] && (
                              <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 relative">
                                <Image src={generatedFrames[idx].endFrameUrl} alt="" fill className="object-cover" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 안내 */}
                  {TEST_MODE && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex gap-2 items-start">
                      <span className="text-blue-400 text-lg">ⓘ</span>
                      <p className="text-blue-200/80 text-xs leading-relaxed mt-1">시스템 최적화를 위해 현재 테스트 모드로 동작중입니다. (1컷만 생성)</p>
                    </div>
                  )}

                </div>
              </div>

              {/* 하단 액션 버튼 */}
              <div className="flex gap-3 min-h-[56px] flex-none">
                <button
                  onClick={onBack}
                  disabled={state === 'generating'}
                  className="w-16 rounded-xl flex items-center justify-center border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors bg-slate-900/40 backdrop-blur-sm disabled:opacity-50"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                  onClick={handleNext}
                  disabled={state !== 'completed'}
                  className={`flex-1 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all backdrop-blur-xl ${state === 'completed'
                    ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)] hover:scale-[1.02] hover:shadow-amber-500/50'
                    : 'bg-slate-800 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  <span>최종 영상 생성하기</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
