'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { removeBackground } from '@imgly/background-removal';
import StepActionBar from '../components/StepActionBar';

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

// Standard 모드 색상
const STANDARD_COLOR = '#8A9A5B'; // Moss Green

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
    { id: 'fancy', label: '화려하게', color: 'from-dusty-rose via-orange to-moss-green' },
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

  const categoryPreviewImages: Record<string, { fancy: string; simple: string }> = {
    wedding: { fancy: '/previews/wedding-fancy.png', simple: '/previews/wedding-simple.png' },
    opening: { fancy: '/previews/opening-fancy.png', simple: '/previews/opening-simple.png' },
    event: { fancy: '/previews/event-fancy.png', simple: '/previews/event-simple.png' },
  };

  const currentPreviewImage = categoryPreviewImages[category]?.[style as 'fancy' | 'simple'] || '';

  // 행사별 입력 필드 - 라이트 테마 스타일
  const renderEventInfoFields = () => {
    const inputClass = "w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 text-sm font-medium placeholder:text-gray-400 focus:border-[#8A9A5B] focus:ring-2 focus:ring-[#8A9A5B]/20 transition-all outline-none";

    switch (category) {
      case 'wedding':
        return (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={eventInfo.groomName || ''}
              onChange={(e) => setEventInfo({ ...eventInfo, groomName: e.target.value })}
              placeholder="신랑 이름"
              className={inputClass}
            />
            <input
              type="text"
              value={eventInfo.brideName || ''}
              onChange={(e) => setEventInfo({ ...eventInfo, brideName: e.target.value })}
              placeholder="신부 이름"
              className={inputClass}
            />
          </div>
        );
      case 'opening':
        return (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={eventInfo.businessName || ''}
              onChange={(e) => setEventInfo({ ...eventInfo, businessName: e.target.value })}
              placeholder="상호명"
              className={inputClass}
            />
          </div>
        );
      case 'event':
        return (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={eventInfo.eventName || ''}
              onChange={(e) => setEventInfo({ ...eventInfo, eventName: e.target.value })}
              placeholder="행사명"
              className={inputClass}
            />
            <input
              type="text"
              value={eventInfo.organizer || ''}
              onChange={(e) => setEventInfo({ ...eventInfo, organizer: e.target.value })}
              placeholder="주관 기관 (선택)"
              className={inputClass}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar-light p-4 md:p-6 lg:p-8 pb-32">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-none mb-6 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="headline-step text-[#8A9A5B]">STANDARD</span>
            <span className="text-xl text-gray-300">✦</span>
            <span className="headline-step text-gray-900">홀로그램 제작</span>
          </div>
          <p className="text-gray-500 text-sm md:text-base">
            행사 유형과 스타일을 선택하세요
          </p>
        </motion.div>

        {/* 메인 컨텐츠 - 2단 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

          {/* 좌측: 설정 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col gap-6">
              {/* Section Header */}
              <div className="flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: STANDARD_COLOR }}
                >
                  1
                </span>
                <h3 className="text-xl font-bold text-gray-900">영상 설정</h3>
              </div>

              {/* 행사 유형 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">행사 유형</label>
                <div className="grid grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <motion.button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex flex-col items-center justify-center h-24 rounded-xl border-2 transition-all duration-300 ${category === cat.id
                        ? 'border-[#8A9A5B] bg-[#8A9A5B]/10 shadow-md'
                        : 'border-gray-200 bg-gray-50 hover:border-[#8A9A5B]/50 hover:bg-gray-100'
                        }`}
                    >
                      <span className="text-3xl mb-2">{cat.icon}</span>
                      <span className={`text-sm font-bold ${category === cat.id ? 'text-[#8A9A5B]' : 'text-gray-600'}`}>
                        {cat.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 스타일 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">AI 스타일</label>
                <div className="grid grid-cols-2 gap-3">
                  {styles.map((s) => (
                    <motion.button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 px-4 h-14 rounded-xl border-2 transition-all ${style === s.id
                        ? 'border-[#8A9A5B] bg-[#8A9A5B]/10 shadow-md'
                        : 'border-gray-200 bg-gray-50 hover:border-[#8A9A5B]/50'
                        }`}
                    >
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${s.color} shrink-0 shadow-md`}></div>
                      <span className={`text-sm font-bold ${style === s.id ? 'text-[#8A9A5B]' : 'text-gray-600'}`}>
                        {s.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 상세 정보 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">상세 정보 입력</label>
                {renderEventInfoFields()}
              </div>
            </div>
          </motion.div>

          {/* 우측: 미리보기 및 액션 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            {/* 미리보기 영역 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col relative overflow-hidden h-full min-h-[400px]">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: STANDARD_COLOR }}
                >
                  2
                </span>
                <h3 className="text-xl font-bold text-gray-900">미리보기</h3>
              </div>

              {/* 이미지 */}
              <div className="flex-1 flex items-center justify-center py-4">
                <motion.div
                  className="relative w-full max-w-[320px] lg:max-w-[380px] aspect-square bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentPreviewImage ? (
                    <Image src={currentPreviewImage} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 text-gray-400">
                      <span className="text-5xl opacity-30">🖼️</span>
                      <span className="text-sm">미리보기</span>
                    </div>
                  )}

                  {/* Badge */}
                  <div
                    className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-2 shadow-lg"
                    style={{ backgroundColor: STANDARD_COLOR }}
                  >
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    1:1 Preview
                  </div>
                </motion.div>
              </div>

              {/* Tip */}
              <div className="text-sm text-gray-500 text-center mt-auto pt-4">
                <span className="font-bold" style={{ color: STANDARD_COLOR }}>Tip:</span> 다음 단계에서 30초 영상을 확인하고 문구를 수정할 수 있습니다.
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Fixed Action Bar */}
      <StepActionBar
        onNext={handleSubmit}
        onBack={onBack}
        color={STANDARD_COLOR}
        nextLabel="축하 문구 작성하러 가기"
      />
    </div>
  );
}

