'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { removeBackground } from '@imgly/background-removal';

export interface SceneData {
  id: number;
  text: string;
  type: 'title' | 'message' | 'sender';
}

// 행사별 맞춤 정보 인터페이스
interface EventInfo {
  groomName?: string;
  brideName?: string;
  businessName?: string;
  eventName?: string;
  organizer?: string;
}

interface MultiSceneStepProps {
  onNext: (data: {
    scenes: SceneData[];
    category: string;
    style: string;
    referenceImage?: string;
    previewImageUrl?: string;
    eventInfo?: EventInfo;
  }) => void;
  initialData?: {
    scenes: SceneData[];
    category: string;
    style: string;
    referenceImage?: string;
    previewImageUrl?: string;
    eventInfo?: EventInfo;
  };
  onBack?: () => void;
}

// 카테고리별 기본 문구 템플릿
const getDefaultScenes = (category: string, eventInfo: EventInfo): SceneData[] => {
  const templates: Record<string, SceneData[]> = {
    wedding: [
      {
        id: 1, text: eventInfo.groomName && eventInfo.brideName
          ? `${eventInfo.groomName} & ${eventInfo.brideName}\n결혼을 축하합니다`
          : '두 분의 결혼을 진심으로 축하드립니다', type: 'title'
      },
      { id: 2, text: '오늘 이 아름다운 시작이 영원한 사랑의 약속이 되길 바랍니다', type: 'message' },
      { id: 3, text: '서로를 향한 믿음과 존중으로 어떤 날도 함께 이겨내시길 바랍니다', type: 'message' },
      { id: 4, text: '두 분이 나누는 사랑이 세상에서 가장 빛나는 축복이 되길 기원합니다', type: 'message' },
      { id: 5, text: '영원토록 변치 않는 사랑으로 행복한 가정을 이루시길 바랍니다', type: 'message' },
      { id: 6, text: '보내는 사람: ', type: 'sender' },
    ],
    opening: [
      {
        id: 1, text: eventInfo.businessName
          ? `${eventInfo.businessName}\n개업을 축하합니다`
          : '새로운 시작을 진심으로 축하드립니다', type: 'title'
      },
      { id: 2, text: '오늘의 첫 걸음이 큰 성공의 시작이 되길 기원합니다', type: 'message' },
      { id: 3, text: '정성을 담은 사업이 많은 분들께 사랑받길 바랍니다', type: 'message' },
      { id: 4, text: '방문하시는 모든 분들에게 기쁨을 드리는 공간이 되시길 바랍니다', type: 'message' },
      { id: 5, text: '사업이 날로 번창하여 큰 꿈을 이루시길 진심으로 응원합니다', type: 'message' },
      { id: 6, text: '보내는 사람: ', type: 'sender' },
    ],
    event: [
      {
        id: 1, text: eventInfo.eventName
          ? `${eventInfo.eventName}\n축하드립니다`
          : '뜻깊은 행사를 진심으로 축하드립니다', type: 'title'
      },
      { id: 2, text: '오늘 이 자리가 모두에게 의미 있는 시간이 되길 바랍니다', type: 'message' },
      { id: 3, text: '준비하신 모든 것들이 빛나는 결실로 이어지길 기원합니다', type: 'message' },
      { id: 4, text: '함께하신 분들 모두에게 좋은 추억이 되시길 바랍니다', type: 'message' },
      { id: 5, text: '성공적인 행사가 되시길 진심으로 응원합니다', type: 'message' },
      { id: 6, text: '보내는 사람: ', type: 'sender' },
    ],
  };
  return templates[category] || templates['wedding'];
};

export default function MultiSceneStep({ onNext, initialData, onBack }: MultiSceneStepProps) {
  const [category, setCategory] = useState(initialData?.category || 'wedding');
  const [style, setStyle] = useState(initialData?.style || 'fancy');
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.referenceImage || null);
  const [eventInfo, setEventInfo] = useState<EventInfo>(initialData?.eventInfo || {});
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [backgroundRemovalProgress, setBackgroundRemovalProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'wedding', label: '결혼식', icon: '💒' },
    { id: 'opening', label: '개업', icon: '🎊' },
    { id: 'event', label: '행사', icon: '🎉' },
  ];

  const styles = [
    { id: 'fancy', label: '화려하게', color: 'from-pink-500 via-purple-500 to-indigo-500' },
    { id: 'simple', label: '심플하게', color: 'from-gray-400 to-gray-600' },
  ];

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setEventInfo({});
  };

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsRemovingBackground(true);
    setBackgroundRemovalProgress(0);

    try {
      // 배경 제거 처리 (브라우저에서 실행)
      const blob = await removeBackground(file, {
        progress: (key, current, total) => {
          // 진행률 계산 (downloading, computing 등의 단계)
          if (total > 0) {
            const progress = Math.round((current / total) * 100);
            setBackgroundRemovalProgress(progress);
          }
        },
      });

      // Blob을 Data URL로 변환
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setIsRemovingBackground(false);
        setBackgroundRemovalProgress(100);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('배경 제거 실패:', error);
      // 배경 제거 실패 시 원본 이미지 사용
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setIsRemovingBackground(false);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleRemoveFile = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    const scenes = getDefaultScenes(category, eventInfo);
    onNext({
      scenes,
      category,
      style,
      referenceImage: previewUrl || undefined,
      eventInfo,
    });
  };

  // 카테고리별 미리보기 이미지 (템플릿 버전용)
  const categoryPreviewImages: Record<string, { fancy: string; simple: string }> = {
    wedding: { fancy: '/previews/wedding-fancy.png', simple: '/previews/wedding-simple.png' },
    opening: { fancy: '/previews/opening-fancy.png', simple: '/previews/opening-simple.png' },
    event: { fancy: '/previews/event-fancy.png', simple: '/previews/event-simple.png' },
  };

  const currentPreviewImage = categoryPreviewImages[category]?.[style as 'fancy' | 'simple'] || '';

  // 행사별 입력 필드 (Premium 스타일 적용)
  const renderEventInfoFields = () => {
    switch (category) {
      case 'wedding':
        return (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={eventInfo.groomName || ''}
              onChange={(e) => setEventInfo({ ...eventInfo, groomName: e.target.value })}
              placeholder="신랑 이름"
              className="w-full h-14 px-4 rounded-xl border border-blue-500/20 bg-black/60 text-white text-base font-bold placeholder:text-gray-500 focus:border-blue-400 focus:bg-black/80 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all outline-none"
            />
            <input
              type="text"
              value={eventInfo.brideName || ''}
              onChange={(e) => setEventInfo({ ...eventInfo, brideName: e.target.value })}
              placeholder="신부 이름"
              className="w-full h-14 px-4 rounded-xl border border-blue-500/20 bg-black/60 text-white text-base font-bold placeholder:text-gray-500 focus:border-blue-400 focus:bg-black/80 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all outline-none"
            />
          </div>
        );
      case 'opening':
        return (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={eventInfo.businessName || ''}
              onChange={(e) => setEventInfo({ ...eventInfo, businessName: e.target.value })}
              placeholder="상호명"
              className="w-full h-14 px-4 rounded-xl border border-blue-500/20 bg-black/60 text-white text-base font-bold placeholder:text-gray-500 focus:border-blue-400 focus:bg-black/80 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all outline-none"
            />
            {/* Layout Spacer for consistency with 2-input categories */}
            <div className="w-full h-14 hidden lg:block" aria-hidden="true" />
          </div>
        );
      case 'event':
        return (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={eventInfo.eventName || ''}
              onChange={(e) => setEventInfo({ ...eventInfo, eventName: e.target.value })}
              placeholder="행사명"
              className="w-full h-14 px-4 rounded-xl border border-blue-500/20 bg-black/60 text-white text-base font-bold placeholder:text-gray-500 focus:border-blue-400 focus:bg-black/80 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all outline-none"
            />
            <input
              type="text"
              value={eventInfo.organizer || ''}
              onChange={(e) => setEventInfo({ ...eventInfo, organizer: e.target.value })}
              placeholder="주관 기관 (선택)"
              className="w-full h-14 px-4 rounded-xl border border-blue-500/20 bg-black/60 text-white text-base font-bold placeholder:text-gray-500 focus:border-blue-400 focus:bg-black/80 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all outline-none"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in-down w-full flex flex-col pb-6 lg:pb-0">
      {/* 헤더 */}
      <div className="flex-none mb-3 lg:mb-4 text-center lg:text-left">
        <h1 className="text-xl font-extrabold text-white mb-0.5">
          템플릿 기반 홀로그램 제작
        </h1>
        <p className="text-gray-400 text-xs">
          행사 유형과 스타일을 선택하세요
        </p>
      </div>

      {/* 메인 컨텐츠 - 2단 레이아웃 */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-stretch">

        {/* 좌측: 설정 */}
        <div className="flex flex-col">
          <div className="flex-1 bg-gradient-to-br from-slate-900/80 to-black/80 border border-blue-500/20 rounded-[1.5rem] p-5 backdrop-blur-md flex flex-col gap-5 shadow-[0_0_40px_-10px_rgba(59,130,246,0.05)]">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-sm font-bold">1</span>
              영상 설정
            </h3>

            {/* 행사 유형 */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">행사 유형</label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex flex-col items-center justify-center h-28 rounded-xl border transition-all duration-300 ${category === cat.id
                      ? 'border-blue-500 bg-blue-500/20 text-white shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]'
                      : 'border-slate-800 bg-slate-900/50 text-gray-500 hover:border-blue-500/30 hover:text-white'
                      }`}
                  >
                    <span className="text-3xl mb-2 filter drop-shadow-md">{cat.icon}</span>
                    <span className="text-sm font-bold">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 스타일 및 상세 정보 */}
            <div className="flex flex-col gap-4">
              {/* 스타일 */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">AI 스타일</label>
                <div className="grid grid-cols-2 gap-2">
                  {styles.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      className={`flex items-center gap-3 px-4 h-14 rounded-xl border transition-all text-left group ${style === s.id
                        ? 'border-blue-500 bg-blue-500/20 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]'
                        : 'border-slate-800 bg-slate-900/50 hover:border-blue-500/30'
                        }`}
                    >
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${s.color} shrink-0 ring-2 ring-white/10 shadow-lg group-hover:scale-110 transition-transform`}></div>
                      <span className={`text-lg font-bold ${style === s.id ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 상세 정보 */}
              <div className="flex flex-col">
                <label className="block text-sm font-bold text-gray-300 mb-2">상세 정보 입력</label>
                <div className="flex-1 flex flex-col gap-2">
                  {renderEventInfoFields()}
                </div>
              </div>
            </div>

            {/* 참조 이미지 업로드 - 임시 비활성화 (docs/REFERENCE-IMAGE-BACKUP.md 참고) */}
            {/* TODO: 참조 이미지 기능 버그 해결 후 복원 필요 */}
          </div>
        </div>

        {/* 우측: 미리보기 및 액션 */}
        <div className="flex flex-col gap-4">
          {/* 미리보기 영역 - flex-1로 남은 공간 채우기 */}
          <div className="flex-1 bg-gradient-to-br from-slate-900/80 to-black/80 border border-blue-500/20 rounded-[1.5rem] p-5 backdrop-blur-md flex flex-col relative overflow-hidden group shadow-[0_0_40px_-10px_rgba(59,130,246,0.05)]">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full scale-150 pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-700"></div>

            <div className="relative z-10 w-full h-full flex flex-col">
              {/* 제목 - 1번 박스와 동일한 스타일 */}
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-sm font-bold">2</span>
                미리보기
              </h3>

              {/* 이미지 - 세로 중앙 정렬 */}
              <div className="flex-1 flex items-center justify-center py-4">
                <div className="relative w-full max-w-[320px] lg:max-w-[380px] aspect-square bg-black rounded-xl border border-blue-500/10 overflow-hidden shadow-2xl ring-1 ring-white/5 group-hover:scale-[1.02] transition-transform duration-500">
                  {currentPreviewImage ? (
                    <Image src={currentPreviewImage} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 text-gray-500">
                      <span className="text-4xl opacity-20">🖼️</span>
                      <span className="text-sm">설정을 선택하면 미리보기가 표시됩니다</span>
                    </div>
                  )}

                  {/* Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold text-white border border-white/10 flex items-center gap-1.5 shadow-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    1:1 Preview
                  </div>
                </div>
              </div>

              {/* Tip 문구 - 이미지 아래 */}
              <div className="text-sm text-gray-400 text-center">
                <span className="text-blue-400 font-bold">Tip:</span> 다음 단계에서 30초 영상을 확인하고 문구를 수정할 수 있습니다.
              </div>
            </div>
          </div>

          {/* 하단 액션 버튼 */}
          <div className="flex-none h-16 lg:h-18 bg-gradient-to-br from-slate-900/80 to-black/80 border border-blue-500/20 rounded-[1.5rem] p-2 backdrop-blur-md flex items-center gap-2 shadow-[0_0_20px_-10px_rgba(59,130,246,0.1)] z-20">
            {onBack && (
              <button
                onClick={onBack}
                className="h-full aspect-square rounded-xl flex items-center justify-center border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors bg-white/5"
                title="이전 단계"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
            )}

            <button
              onClick={handleSubmit}
              className="flex-1 h-full rounded-xl font-bold text-base lg:text-lg shadow-lg flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white hover:scale-[1.01] hover:shadow-blue-500/30"
            >
              축하 문구 작성하러 가기
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
