'use client';

import { useState } from 'react';
import {
  CompositionData,
  EventInfo,
  CompositionInputStepProps,
} from './types';
import { keywordMessageSets } from './constants/keywordMessages';
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
    <div className="w-full h-full flex flex-col items-center">

      {/* 타이틀 */}
      <div className="text-center mb-8 animate-fadeIn">
        <h2 className="text-3xl font-display font-bold mb-2 text-gradient-gold">AI 프리미엄 생성</h2>
        <p className="text-amber-500/60 font-light">AI가 당신만의 스토리를 분석하여 독창적인 영상을 설계합니다.</p>
      </div>

      {/* 메인 3분할 레이아웃 - Dashboard Style (Gold Theme) */}
      <div className="w-full max-w-[1920px] grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[calc(100vh-250px)] min-h-[600px]">

        {/* 1. 좌측: 영상 설정 (3 Col) */}
        <div className="lg:col-span-3 h-full glass-panel border-amber-500/20 rounded-2xl overflow-hidden flex flex-col animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <div className="p-5 border-b border-amber-500/10 bg-amber-500/5">
            <h3 className="font-display font-bold text-amber-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              영상 설정 <span className="text-[10px] opacity-50 ml-1 font-normal tracking-widest">CONFIGURATION</span>
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 flex flex-col gap-6">
            {/* 카테고리 */}
            <div>
              <label className="text-xs font-bold text-amber-500/50 mb-2 block uppercase tracking-wider">이벤트 유형 (Event Type)</label>
              <CategorySelector category={category} onCategoryChange={handleCategoryChange} />
            </div>

            {/* 스타일 */}
            <div>
              <label className="text-xs font-bold text-amber-500/50 mb-2 block uppercase tracking-wider">비주얼 스타일 (Visual Style)</label>
              <StyleSelector style={style} onStyleChange={setStyle} />
            </div>

            {/* 상세 정보 */}
            <div>
              <label className="text-xs font-bold text-amber-500/50 mb-2 block uppercase tracking-wider">상세 정보 (Details)</label>
              <EventInfoFields
                category={category}
                eventInfo={eventInfo}
                setEventInfo={setEventInfo}
                onBlur={updateTitleFromEventInfo}
              />
            </div>
          </div>
        </div>

        {/* 2. 중앙: 미리보기 (6 Col) */}
        <div className="lg:col-span-6 h-full flex flex-col gap-6">

          {/* Preview Area */}
          <div className="flex-1 glass-panel border-amber-500/20 rounded-2xl p-1 overflow-hidden animate-fadeIn relative group" style={{ animationDelay: '0.2s' }}>
            <PreviewPanel
              category={category}
              style={style}
              previewUrl={previewUrl}
              onFileChange={handleFileChange}
              onDelete={() => setPreviewUrl(null)}
            />

            {/* Gold Overlay Frame */}
            <div className="absolute inset-0 pointer-events-none border border-amber-500/20 rounded-xl z-20"></div>
            <div className="absolute top-4 right-4 z-30 px-3 py-1 rounded-full bg-black/60 backdrop-blur border border-amber-500/30 text-amber-400 text-xs font-mono shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              AI 컨셉 미리보기
            </div>
          </div>

          {/* Action Buttons */}
          <div className="h-20 glass-panel border-amber-500/20 rounded-xl p-3 flex items-center justify-between gap-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <button onClick={onBack} className="h-full px-8 rounded-lg border border-amber-500/10 hover:bg-amber-500/5 text-amber-500/50 hover:text-amber-500 transition-colors font-bold">
              이전
            </button>
            <button
              onClick={handleSubmit}
              className="h-full px-12 rounded-lg bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold tracking-wider hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center gap-2"
              disabled={!isValid}
            >
              <span>AI 에셋 생성하기</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </button>
          </div>
        </div>

        {/* 3. 우측: 문구/프롬프트 입력 (3 Col) */}
        <div className="lg:col-span-3 h-full glass-panel border-amber-500/20 rounded-2xl overflow-hidden flex flex-col animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <div className="p-5 border-b border-amber-500/10 bg-amber-500/5">
            <h3 className="font-display font-bold text-amber-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              스토리 프롬프트 <span className="text-[10px] opacity-50 ml-1 font-normal tracking-widest">PROMPT</span>
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
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
              // Hide internal buttons as we moved them to the center column
              hideButtons={true}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

