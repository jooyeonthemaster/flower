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
    { id: 'wedding', label: '결혼식', icon: '💒', color: 'from-pink-500 to-rose-500' },
    { id: 'opening', label: '개업', icon: '🎊', color: 'from-blue-500 to-cyan-500' },
    { id: 'event', label: '행사', icon: '🎉', color: 'from-purple-500 to-indigo-500' },
  ];

  const styles = [
    { id: 'fancy', label: '화려하게', desc: '다채로운 색상과 빛나는 효과', color: 'from-pink-500 via-purple-500 to-indigo-500' },
    { id: 'simple', label: '심플하게', desc: '깔끔하고 세련된 단색 톤', color: 'from-gray-400 to-gray-600' },
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
          if (total > 0) {
            const progress = Math.round((current / total) * 100);
            setBackgroundRemovalProgress(progress);
          }
        },
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setIsRemovingBackground(false);
        setBackgroundRemovalProgress(100);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('배경 제거 실패:', error);
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

  // 카테고리별 미리보기 이미지
  const categoryPreviewImages: Record<string, { fancy: string; simple: string }> = {
    wedding: { fancy: '/previews/wedding-fancy.png', simple: '/previews/wedding-simple.png' },
    opening: { fancy: '/previews/opening-fancy.png', simple: '/previews/opening-simple.png' },
    event: { fancy: '/previews/event-fancy.png', simple: '/previews/event-simple.png' },
  };

  const currentPreviewImage = categoryPreviewImages[category]?.[style as 'fancy' | 'simple'] || '';

  const renderEventInfoFields = () => {
    // 공통 Input 스타일
    const inputClass = "w-full h-12 bg-transparent border-b border-white/20 text-white placeholder-white/30 focus:border-blue-400 focus:outline-none transition-colors font-medium text-lg";

    switch (category) {
      case 'wedding':
        return (
          <div className="flex gap-4 animate-fadeIn">
            <input type="text" value={eventInfo.groomName || ''} onChange={(e) => setEventInfo({ ...eventInfo, groomName: e.target.value })} placeholder="신랑 이름" className={inputClass} />
            <input type="text" value={eventInfo.brideName || ''} onChange={(e) => setEventInfo({ ...eventInfo, brideName: e.target.value })} placeholder="신부 이름" className={inputClass} />
          </div>
        );
      case 'opening':
        return (
          <div className="animate-fadeIn">
            <input type="text" value={eventInfo.businessName || ''} onChange={(e) => setEventInfo({ ...eventInfo, businessName: e.target.value })} placeholder="상호명 (예: 대박식당)" className={inputClass} />
          </div>
        );
      case 'event':
        return (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <input type="text" value={eventInfo.eventName || ''} onChange={(e) => setEventInfo({ ...eventInfo, eventName: e.target.value })} placeholder="행사명" className={inputClass} />
            <input type="text" value={eventInfo.organizer || ''} onChange={(e) => setEventInfo({ ...eventInfo, organizer: e.target.value })} placeholder="주관 (선택)" className={inputClass} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      {/* 타이틀 */}
      <div className="text-center mb-10 animate-fadeIn">
        <h2 className="text-3xl font-display font-bold mb-2">SETUP YOUR HOLOGRAM</h2>
        <p className="text-white/60 font-light">제작할 홀로그램의 종류와 스타일을 선택해 주세요.</p>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT: Configuration */}
        <div className="lg:col-span-7 flex flex-col gap-8">

          {/* 1. Category Selection */}
          <div className="glass-panel p-8 rounded-2xl animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-display text-blue-400 mb-6 flex items-center gap-2">
              <span className="w-6 h-[1px] bg-blue-400"></span> 01. EVENT TYPE
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`group relative h-32 rounded-xl border transition-all duration-300 overflow-hidden flex flex-col items-center justify-center gap-3 ${category === cat.id
                      ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                      : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                    }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  <span className="text-4xl relative z-10 group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                  <span className={`text-sm font-bold relative z-10 ${category === cat.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Style Selection */}
          <div className="glass-panel p-8 rounded-2xl animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-display text-blue-400 mb-6 flex items-center gap-2">
              <span className="w-6 h-[1px] bg-blue-400"></span> 02. VISUAL STYLE
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`relative p-5 rounded-xl border text-left transition-all duration-300 ${style === s.id
                      ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${s.color} shadow-lg shrink-0`}></div>
                    <div>
                      <div className={`font-display font-bold text-lg ${style === s.id ? 'text-white' : 'text-gray-300'}`}>{s.label}</div>
                      <div className="text-xs text-gray-500">{s.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Details Input */}
          <div className="glass-panel p-8 rounded-2xl animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-lg font-display text-blue-400 mb-6 flex items-center gap-2">
              <span className="w-6 h-[1px] bg-blue-400"></span> 03. DETAILS
            </h3>
            <div className="px-2">
              {renderEventInfoFields()}
            </div>
          </div>

        </div>

        {/* RIGHT: Preview & Actions */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">

          {/* Device Preview */}
          <div className="glass-panel rounded-2xl p-1 overflow-hidden animate-fadeIn backdrop-blur-3xl" style={{ animationDelay: '0.4s' }}>
            <div className="bg-black/80 rounded-xl aspect-square relative overflow-hidden flex items-center justify-center group">

              {/* Hologram Fan Frame */}
              {/* <div className="absolute inset-4 border-2 border-white/5 rounded-full animate-spin-slow opacity-20 border-dashed"></div> */}

              {/* Content */}
              <div className="relative w-3/4 h-3/4">
                {currentPreviewImage ? (
                  <div className="w-full h-full relative animate-float">
                    <Image src={currentPreviewImage} alt="Preview" fill className="object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent mix-blend-overlay"></div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">PREVIEW</div>
                )}
              </div>

              {/* Overlay Text */}
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  HOLOGRAM PREVIEW
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
            {onBack && (
              <button onClick={onBack} className="h-14 px-6 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                이전
              </button>
            )}
            <button
              onClick={handleSubmit}
              className="flex-1 h-14 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 font-bold text-lg tracking-wide hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all active:scale-[0.98] border border-white/10"
            >
              다음 단계로
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
