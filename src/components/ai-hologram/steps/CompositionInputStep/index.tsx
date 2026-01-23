'use client';

import { useState } from 'react';
import {
  CompositionData,
  EventInfo,
  CompositionInputStepProps,
} from './types';
import { keywordMessageSets, getKeywordsForCategory } from './constants/keywordMessages';
import CategorySelector from './components/CategorySelector';
import StyleSelector from './components/StyleSelector';
import EventInfoFields from './components/EventInfoFields';
import PreviewPanel from './components/PreviewPanel';
import MessageInputPanel from './components/MessageInputPanel';

// Re-export types for external use
export type { CompositionData, EventInfo } from './types';

const DEFAULT_MESSAGES = ['', '', ''];

export default function CompositionInputStep({ onNext, initialData, onBack }: CompositionInputStepProps) {
  const [category, setCategory] = useState(initialData?.category || 'wedding');
  const [style, setStyle] = useState(initialData?.style || 'fancy');
  const [messages, setMessages] = useState<string[]>(initialData?.messages || DEFAULT_MESSAGES);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.referenceImage || null);
  const [eventInfo, setEventInfo] = useState<EventInfo>(initialData?.eventInfo || {});
  const [messageMode, setMessageMode] = useState<'keyword' | 'custom'>('keyword');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

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

      {/* 메인 3단 레이아웃 (균등 분할) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">

        {/* ================= 1. 영상 설정 패널 ================= */}
        <div className="flex flex-col gap-6 min-h-0 overflow-y-auto custom-scrollbar">
          {/* Premium Card Style */}
          <div className="bg-gradient-to-br from-slate-900/80 to-black/80 border border-amber-500/20 rounded-[1.5rem] p-5 backdrop-blur-md flex-1 flex flex-col justify-between shadow-[0_0_40px_-10px_rgba(251,191,36,0.05)]">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-500/20 text-white flex items-center justify-center text-sm font-bold border border-amber-500/20">1</span>
              영상 설정
            </h3>

            {/* 1. 행사 유형 */}
            <CategorySelector
              category={category}
              onCategoryChange={handleCategoryChange}
            />

            {/* 2. 스타일 */}
            <StyleSelector
              style={style}
              onStyleChange={setStyle}
            />

            {/* 3. 상세 정보 */}
            <div className="flex-1 flex flex-col justify-center">
              <label className="block text-sm font-bold text-gray-300 mb-3">상세 정보 입력</label>
              <div className="bg-black/40 rounded-xl p-5 border border-amber-500/10 h-full flex flex-col justify-center">
                <EventInfoFields
                  category={category}
                  eventInfo={eventInfo}
                  setEventInfo={setEventInfo}
                  onBlur={updateTitleFromEventInfo}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= 2. 미리보기 패널 ================= */}
        <PreviewPanel
          category={category}
          style={style}
          previewUrl={previewUrl}
          onFileChange={handleFileChange}
          onDelete={() => setPreviewUrl(null)}
        />

        {/* ================= 3. 문구 입력 패널 ================= */}
        <MessageInputPanel
          category={category}
          messages={messages}
          messageMode={messageMode}
          selectedKeywords={selectedKeywords}
          filledCount={filledCount}
          isValid={isValid}
          onMessageChange={handleMessageChange}
          onMessageModeChange={setMessageMode}
          onKeywordSelect={selectKeyword}
          onSubmit={handleSubmit}
          onBack={onBack}
        />

      </div>
    </div>
  );
}
