'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export interface CompositionData {
  messages: string[];  // 3개 멘트
  category: string;
  style: string;
  referenceImage?: string;
  eventInfo?: EventInfo;
}

// 행사별 맞춤 정보 인터페이스
interface EventInfo {
  // 결혼식
  groomName?: string;
  brideName?: string;
  weddingDate?: string;
  // 개업
  businessName?: string;
  openingDate?: string;
  // 행사
  eventName?: string;
  organizer?: string;
}

interface CompositionInputStepProps {
  onNext: (data: CompositionData) => void;
  initialData?: CompositionData;
  onBack?: () => void;
}

const DEFAULT_MESSAGES = ['', '', ''];

export default function CompositionInputStep({ onNext, initialData, onBack }: CompositionInputStepProps) {
  const [category, setCategory] = useState(initialData?.category || 'wedding');
  const [style, setStyle] = useState(initialData?.style || 'fancy');
  const [messages, setMessages] = useState<string[]>(initialData?.messages || DEFAULT_MESSAGES);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.referenceImage || null);
  const [eventInfo, setEventInfo] = useState<EventInfo>(initialData?.eventInfo || {});
  const [messageMode, setMessageMode] = useState<'keyword' | 'custom'>('keyword');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  // const [selectedTemplateSet, setSelectedTemplateSet] = useState<number>(0); // Not used in merged mode
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3가지 카테고리
  const categories = [
    { id: 'wedding', label: '결혼식', icon: '💒', desc: '행복한 출발' },
    { id: 'opening', label: '개업', icon: '🎊', desc: '대박 기원' },
    { id: 'event', label: '행사', icon: '🎉', desc: '성공적 개최' },
  ];

  // 2가지 스타일
  const styles = [
    { id: 'fancy', label: '화려하게', color: 'from-pink-500 via-purple-500 to-indigo-500', desc: '화려한 효과와 애니메이션' },
    { id: 'simple', label: '심플하게', color: 'from-gray-400 to-gray-600', desc: '깔끔하고 모던한 스타일' },
  ];

  // 카테고리별 키워드와 해당 문구 세트 (3개씩, 각 문구는 완성된 문장)
  const keywordMessageSets: Record<string, Record<string, string[]>> = {
    wedding: {
      '영원한 사랑': [
        '두 분의 결혼을 진심으로 축하드립니다',
        '오늘 이 아름다운 시작이 영원한 사랑의 약속이 되길 바랍니다',
        '영원토록 변치 않는 사랑으로 행복한 가정을 이루시길 진심으로 기원합니다',
      ],
      '행복': [
        '두 분의 결혼을 진심으로 축하드립니다',
        '오늘부터 시작되는 새로운 여정에 행복만 가득하길 기원합니다',
        '두 분의 가정에 늘 웃음과 행복이 넘쳐나길 진심으로 바랍니다',
      ],
      '축복': [
        '두 분의 결혼을 진심으로 축하드립니다',
        '하늘이 맺어준 소중한 인연을 온 마음을 다해 축복합니다',
        '두 분의 앞날에 기쁨과 축복이 영원히 함께하길 기원합니다',
      ],
      '백년해로': [
        '두 분의 결혼을 진심으로 축하드립니다',
        '오늘의 약속이 백년 후에도 변함없이 빛나길 바랍니다',
        '백년해로 하시며 누구보다 행복한 부부가 되시길 진심으로 기원합니다',
      ],
    },
    opening: {
      '번창': [
        '새로운 시작을 진심으로 축하드립니다',
        '정성을 담은 사업이 많은 분들께 사랑받는 공간이 되길 바랍니다',
        '사업이 날로 번창하여 큰 꿈을 이루시길 진심으로 응원합니다',
      ],
      '대박': [
        '새로운 시작을 진심으로 축하드립니다',
        '손님들의 발길이 끊이지 않는 명소가 되시길 바랍니다',
        '대박나셔서 모든 꿈을 이루시길 진심으로 응원합니다',
      ],
      '성공': [
        '새로운 시작을 진심으로 축하드립니다',
        '도전하시는 용기와 열정에 깊은 존경을 보냅니다',
        '항상 성공과 행운이 함께하시길 진심으로 응원합니다',
      ],
      '발전': [
        '새로운 시작을 진심으로 축하드립니다',
        '오늘의 시작이 무한한 발전의 토대가 되시길 바랍니다',
        '무궁무진한 발전을 이루시길 진심으로 응원합니다',
      ],
    },
    event: {
      '성공': [
        '뜻깊은 행사를 진심으로 축하드립니다',
        '준비하신 모든 것들이 빛나는 결실로 이어지길 기원합니다',
        '성공적인 행사가 되시길 진심으로 응원합니다',
      ],
      '축하': [
        '뜻깊은 행사를 진심으로 축하드립니다',
        '소중한 분들과 함께하는 이 순간이 오래도록 기억에 남으시길 바랍니다',
        '앞으로도 좋은 일들만 가득하시길 진심으로 기원합니다',
      ],
      '감사': [
        '뜻깊은 행사를 진심으로 축하드립니다',
        '함께해 주신 모든 분들께 깊은 감사의 마음을 전합니다',
        '베풀어 주신 관심과 사랑에 늘 건강하시고 행복하시길 기원합니다',
      ],
      '발전': [
        '뜻깊은 행사를 진심으로 축하드립니다',
        '오늘을 계기로 더욱 큰 도약을 이루시길 기원합니다',
        '무한한 발전과 성공을 진심으로 응원합니다',
      ],
    },
  };

  // 카테고리별 키워드 목록 (키워드메시지세트에서 추출)
  const getKeywordsForCategory = (cat: string): string[] => {
    return Object.keys(keywordMessageSets[cat] || {});
  };

  // 카테고리별 문구 템플릿 세트 (3개씩, 각 문구는 완성된 문장) - Not used in merged UI but kept for reference if needed
  /*
  const messageTemplates: Record<string, string[][]> = {
    wedding: [
      [
        '두 분의 결혼을 진심으로 축하드립니다',
        '오늘 이 아름다운 시작이 영원한 사랑의 약속이 되길 바랍니다',
        '영원한 행복과 사랑을 진심으로 기원합니다',
      ],
      // ...
    ],
    // ...
  };
  */

  const handleMessageChange = (index: number, text: string) => {
    setMessages(messages.map((msg, i) => (i === index ? text : msg)));
  };

  // 키워드 선택 시 해당 문구 세트 즉시 적용
  const selectKeyword = (keyword: string) => {
    setSelectedKeywords([keyword]); // 단일 선택

    // 해당 키워드의 문구 세트 가져오기
    const messageSet = keywordMessageSets[category]?.[keyword];
    if (!messageSet) return;

    // 문구 세트 적용 (첫 번째 문구에 이벤트 정보 반영)
    const newMessages = messageSet.map((text, index) => {
      // 첫 번째 장면에 이벤트 정보 적용
      if (index === 0) {
        if (category === 'wedding' && eventInfo.groomName && eventInfo.brideName) {
          return `${eventInfo.groomName} & ${eventInfo.brideName}\n결혼을 축하합니다`;
        } else if (category === 'opening' && eventInfo.businessName) {
          return `${eventInfo.businessName}\n개업을 축하합니다`;
        } else if (category === 'event' && eventInfo.eventName) {
          return `${eventInfo.eventName}\n축하드립니다`;
        }
      }
      return text;
    });

    setMessages(newMessages);
  };

  // 행사 정보 기반으로 첫 번째 문구 자동 생성
  const updateTitleFromEventInfo = () => {
    const newMessages = [...messages];

    if (category === 'wedding' && eventInfo.groomName && eventInfo.brideName) {
      newMessages[0] = `${eventInfo.groomName} & ${eventInfo.brideName}\n결혼을 축하합니다`;
    } else if (category === 'opening' && eventInfo.businessName) {
      newMessages[0] = `${eventInfo.businessName}\n개업을 축하합니다`;
    } else if (category === 'event' && eventInfo.eventName) {
      newMessages[0] = `${eventInfo.eventName}\n축하드립니다`;
    }

    setMessages(newMessages);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setSelectedKeywords([]);
    setEventInfo({});
    // 카테고리 변경 시 초기화
    setMessages(DEFAULT_MESSAGES);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    // 최소 1개 이상의 문구가 있어야 함
    const filledMessages = messages.filter(m => m.trim());
    if (filledMessages.length === 0) return;

    onNext({
      messages: messages.filter(m => m.trim()),
      category,
      style,
      referenceImage: previewUrl || undefined,
      eventInfo,
    });
  };

  const filledCount = messages.filter(m => m.trim()).length;
  const isValid = filledCount >= 1;

  // 장면 타입 라벨 (3개)
  const sceneLabels = [
    { icon: '🎬', label: '오프닝' },
    { icon: '💬', label: '메인' },
    { icon: '✉️', label: '마무리' },
  ];

  // 행사별 맞춤 입력 필드 렌더링
  const renderEventInfoFields = () => {
    switch (category) {
      case 'wedding':
        return (
          <div className="grid grid-cols-2 gap-4 w-full">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">신랑 이름</label>
              <input
                type="text"
                value={eventInfo.groomName || ''}
                onChange={(e) => setEventInfo({ ...eventInfo, groomName: e.target.value })}
                onBlur={updateTitleFromEventInfo}
                placeholder="홍길동"
                className="w-full bg-black/60 border border-amber-500/20 rounded-xl px-4 py-3 text-white text-base focus:border-amber-400 focus:bg-black/80 focus:shadow-[0_0_15px_rgba(251,191,36,0.1)] outline-none transition-all placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">신부 이름</label>
              <input
                type="text"
                value={eventInfo.brideName || ''}
                onChange={(e) => setEventInfo({ ...eventInfo, brideName: e.target.value })}
                onBlur={updateTitleFromEventInfo}
                placeholder="김영희"
                className="w-full bg-black/60 border border-amber-500/20 rounded-xl px-4 py-3 text-white text-base focus:border-amber-400 focus:bg-black/80 focus:shadow-[0_0_15px_rgba(251,191,36,0.1)] outline-none transition-all placeholder:text-gray-500"
              />
            </div>
          </div>
        );
      case 'opening':
        return (
          <div className="w-full">
            <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">상호명</label>
            <input
              type="text"
              value={eventInfo.businessName || ''}
              onChange={(e) => setEventInfo({ ...eventInfo, businessName: e.target.value })}
              onBlur={updateTitleFromEventInfo}
              placeholder="OO카페"
              className="w-full bg-black/60 border border-amber-500/20 rounded-xl px-4 py-3 text-white text-base focus:border-amber-400 focus:bg-black/80 focus:shadow-[0_0_15px_rgba(251,191,36,0.1)] outline-none transition-all placeholder:text-gray-500"
            />
          </div>
        );
      case 'event':
        return (
          <div className="grid grid-cols-2 gap-4 w-full">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">행사명</label>
              <input
                type="text"
                value={eventInfo.eventName || ''}
                onChange={(e) => setEventInfo({ ...eventInfo, eventName: e.target.value })}
                onBlur={updateTitleFromEventInfo}
                placeholder="2026 신년 행사"
                className="w-full bg-black/60 border border-amber-500/20 rounded-xl px-4 py-3 text-white text-base focus:border-amber-400 focus:bg-black/80 focus:shadow-[0_0_15px_rgba(251,191,36,0.1)] outline-none transition-all placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">주관 기관 (선택)</label>
              <input
                type="text"
                value={eventInfo.organizer || ''}
                onChange={(e) => setEventInfo({ ...eventInfo, organizer: e.target.value })}
                placeholder="주식회사 OOO"
                className="w-full bg-black/60 border border-amber-500/20 rounded-xl px-4 py-3 text-white text-base focus:border-amber-400 focus:bg-black/80 focus:shadow-[0_0_15px_rgba(251,191,36,0.1)] outline-none transition-all placeholder:text-gray-500"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // 카테고리별 미리보기 이미지
  const categoryPreviewImages: Record<string, { fancy: string; simple: string }> = {
    wedding: {
      fancy: '/previews/wedding-fancy.png', // 실제로는 AI 생성 예시 이미지여야 함
      simple: '/previews/wedding-simple.png',
    },
    opening: {
      fancy: '/previews/opening-fancy.png',
      simple: '/previews/opening-simple.png',
    },
    event: {
      fancy: '/previews/event-fancy.png',
      simple: '/previews/event-simple.png',
    },
  };

  const currentPreviewImage = categoryPreviewImages[category]?.[style as 'fancy' | 'simple'] || '';

  return (
    <div className="animate-fade-in-down h-full flex flex-col overflow-hidden">
      {/* 상단 헤더: Premium 테마 */}
      <div className="flex-none mb-6 text-center lg:text-left">
        <h1 className="text-3xl font-extrabold text-white mb-2 drop-shadow-sm">
          AI 프리미엄 홀로그램 제작
        </h1>
        <p className="text-gray-400 text-sm">
          AI가 당신만의 특별한 스토리를 완전히 새로운 영상으로 창조합니다.
        </p>
      </div>

      {/* 메인 2단 레이아웃 */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">

        {/* ================= 좌측: 설정 및 미리보기 패널 (7/12) ================= */}
        <div className="lg:col-span-7 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Left Sub-Column: 설정 통합 */}
            <div className="flex flex-col gap-6">
              {/* Premium Card Style: Gold border, Darker background */}
              <div className="bg-gradient-to-br from-slate-900/80 to-black/80 border border-amber-500/20 rounded-[1.5rem] p-5 backdrop-blur-md flex-1 flex flex-col justify-between shadow-[0_0_40px_-10px_rgba(251,191,36,0.05)]">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-amber-500/20 text-white flex items-center justify-center text-sm font-bold border border-amber-500/20">1</span>
                  영상 설정
                </h3>

                {/* 1. 행사 유형 */}
                <div className="mb-4 flex-1 flex flex-col justify-center">
                  <label className="block text-sm font-bold text-gray-300 mb-3">행사 유형</label>
                  <div className="grid grid-cols-3 gap-3 h-full">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-300 h-full ${category === cat.id
                          ? 'border-amber-500 bg-amber-500/20 text-white shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]'
                          : 'border-slate-800 bg-slate-900/50 text-gray-500 hover:border-amber-500/30 hover:text-white'
                          }`}
                      >
                        <span className="text-3xl mb-2 filter drop-shadow-md">{cat.icon}</span>
                        <span className="text-sm font-bold">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. 스타일 */}
                <div className="mb-4 flex-1 flex flex-col justify-center">
                  <label className="block text-sm font-bold text-gray-300 mb-3">AI 스타일</label>
                  <div className="grid grid-cols-1 gap-3 h-full">
                    {styles.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setStyle(s.id)}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left group h-full ${style === s.id
                          ? 'border-amber-500 bg-amber-500/20 shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]'
                          : 'border-slate-800 bg-slate-900/50 hover:border-amber-500/30'
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${s.color} shadow-lg shrink-0 group-hover:scale-110 transition-transform`}></div>
                        <div>
                          <div className={`text-base font-bold ${style === s.id ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>{s.label}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. 상세 정보 */}
                <div className="flex-1 flex flex-col justify-center">
                  <label className="block text-sm font-bold text-gray-300 mb-3">상세 정보 입력</label>
                  <div className="bg-black/40 rounded-xl p-5 border border-amber-500/10 h-full flex flex-col justify-center">
                    {renderEventInfoFields()}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sub-Column: 1:1 미리보기 */}
            <div className="flex flex-col gap-6">
              {/* 미리보기 카드 */}
              <div className="bg-gradient-to-br from-slate-900/80 to-black/80 border border-amber-500/20 rounded-[1.5rem] p-5 backdrop-blur-md flex-1 flex flex-col shadow-[0_0_40px_-10px_rgba(251,191,36,0.05)]">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 self-start">
                  <span className="w-8 h-8 rounded-full bg-amber-500/20 text-white flex items-center justify-center text-sm font-bold border border-amber-500/20">2</span>
                  예시 미리보기
                </h3>

                <div className="flex-1 w-full flex flex-col items-center justify-center">
                  <div className="relative w-full aspect-square max-w-[340px] mx-auto bg-black rounded-2xl border border-amber-500/10 overflow-hidden shadow-2xl flex-shrink-0 group">
                    {currentPreviewImage ? (
                      <Image
                        src={currentPreviewImage}
                        alt="Style Preview"
                        fill
                        className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 gap-2 p-4 text-center">
                        <span className="text-xs">AI가 생성할 영상의<br />분위기를 확인하세요</span>
                      </div>
                    )}
                    {/* Premium Badge */}
                    <div className="absolute top-3 right-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-amber-400 blur-md opacity-20 animate-pulse-slow"></div>
                        <span className="relative px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-500/30 flex items-center gap-1">
                          <span>✨</span> AI Generate
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-gray-300 border border-white/10">
                      1:1 Preview
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  * 선택하신 스타일로 AI가 영상을 새롭게 창작합니다.
                </p>
              </div>

              {/* 로고 업로드 */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="bg-black/60 border-2 border-dashed border-gray-800 hover:border-amber-500/50 hover:bg-amber-500/5 rounded-2xl p-4 cursor-pointer transition-all flex items-center gap-4 group"
              >
                {previewUrl ? (
                  <>
                    <div className="w-12 h-12 relative rounded-lg overflow-hidden border border-amber-500/30 bg-black shrink-0">
                      <Image src={previewUrl} alt="Logo" fill className="object-contain" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">업로드 완료</div>
                      <div className="text-[10px] text-gray-500">클릭하여 변경</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-gray-900 text-gray-600 flex items-center justify-center shrink-0 group-hover:text-amber-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-gray-400 group-hover:text-gray-200">참조 이미지 추가</div>
                      <div className="text-[10px] text-gray-600">(선택사항)</div>
                    </div>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>
            </div>
          </div>
        </div>

        {/* ================= 우측: 문구 입력 패널 (5/12) ================= */}
        <div className="lg:col-span-5 flex flex-col h-full gap-4 min-h-0">

          <div className="flex-1 flex flex-col bg-slate-900 backdrop-blur-sm border border-amber-500/10 rounded-[1.5rem] overflow-hidden shadow-2xl min-h-0">
            {/* 헤더 */}
            <div className="p-6 pb-4 bg-slate-900/40 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-amber-500/20 text-white flex items-center justify-center text-sm font-bold border border-amber-500/20">3</span>
                  축하 문구 입력
                </h3>
                <span className={`px-2 py-1 rounded text-xs font-bold ${filledCount === 3 ? 'bg-amber-500/20 text-white border border-amber-500/20' : 'bg-slate-800 text-gray-400'}`}>
                  {filledCount} / 3 완료
                </span>
              </div>

              {/* 탭 버튼 */}
              <div className="flex p-1 rounded-xl bg-black/40 border border-white/5">
                <button
                  onClick={() => setMessageMode('keyword')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${messageMode !== 'custom' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  키워드 자동완성
                </button>
                <button
                  onClick={() => setMessageMode('custom')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${messageMode === 'custom' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  직접 입력하기
                </button>
              </div>
            </div>

            {/* 컨텐츠 스크롤 영역 */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-2">

              {/* 키워드 추천 영역 */}
              {messageMode !== 'custom' && (
                <div className="mb-6 animate-fadeIn">
                  <p className="text-xs text-gray-400 mb-3 ml-1">원하는 키워드를 누르면 문구가 자동으로 채워집니다</p>
                  <div className="flex flex-wrap gap-2">
                    {getKeywordsForCategory(category).map((keyword) => (
                      <button
                        key={keyword}
                        onClick={() => selectKeyword(keyword)}
                        className={`px-3 py-1.5 rounded-full text-sm font-bold border transition-all hover:scale-105 active:scale-95 ${selectedKeywords.includes(keyword)
                          ? 'bg-amber-500 border-amber-400 text-black shadow-[0_0_15px_-3px_rgba(245,158,11,0.5)]'
                          : 'bg-slate-800/50 border-slate-700 text-gray-400 hover:border-slate-500 hover:text-gray-200'
                          }`}
                      >
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 입력 폼 리스트 */}
              <div className="space-y-1">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className="mb-4"
                  >
                    <div className="px-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${message.trim() ? 'bg-amber-500 text-black' : 'bg-slate-700 text-gray-500'
                            }`}>
                            {index + 1}
                          </span>
                          <span className="text-xs font-bold text-gray-300">
                            {sceneLabels[index]?.label}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-600 bg-black/30 px-1.5 py-0.5 rounded">10초 노출</span>
                      </div>
                      <textarea
                        value={message}
                        onChange={(e) => handleMessageChange(index, e.target.value)}
                        placeholder={
                          index === 0
                            ? category === 'wedding'
                              ? '예: 철수 & 영희\n결혼을 축하합니다'
                              : category === 'opening'
                                ? '예: OO카페\n개업을 축하합니다'
                                : '예: 2026 신년 행사\n축하드립니다'
                            : index === 2
                              ? '예: 영원한 행복을\n기원합니다'
                              : '예: 두 분의 앞날에\n행복만 가득하길'
                        }
                        rows={2}
                        className="w-full bg-black/40 rounded-lg border border-transparent focus:border-amber-500/50 focus:bg-black/60 outline-none text-sm text-white placeholder-gray-600 p-2 resize-none transition-all leading-snug"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 안내 문구 */}
              <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex gap-3 items-center">
                <span className="text-xl">✨</span>
                <p className="text-xs text-gray-300 leading-relaxed">
                  입력하신 문구와 분위기에 맞춰 AI가 <span className="text-white font-bold">100% 새로운 영상</span>을 생성합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 하단 액션 버튼 */}
          <div className="flex gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="w-14 h-14 rounded-xl flex items-center justify-center border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors bg-slate-900/40 backdrop-blur-xl"
                title="이전 단계"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className={`flex-1 h-14 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all backdrop-blur-xl ${isValid
                ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)] hover:scale-[1.02] hover:shadow-amber-500/50'
                : 'bg-slate-800/80 text-gray-500 cursor-not-allowed'
                }`}
            >
              <span>AI 영상 생성하기</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
