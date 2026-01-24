'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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

// Premium 모드 색상
const PREMIUM_COLOR = '#E66B33'; // International Orange

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

  const selectKeyword = (keyword: string) => {
    setSelectedKeywords([keyword]);
    const messageSet = keywordMessageSets[category]?.[keyword];
    if (!messageSet) return;

    const newMessages = messageSet.map((text, index) => {
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
    <div className="w-full h-full flex flex-col p-4 md:p-6 lg:p-8 overflow-auto custom-scrollbar-light">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-none mb-6 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="headline-step text-[#E66B33]">PREMIUM</span>
          <span className="text-xl text-gray-300">✦</span>
          <span className="headline-step text-gray-900">AI 홀로그램</span>
        </div>
        <p className="text-gray-500 text-sm md:text-base">
          AI가 당신만의 특별한 스토리를 완전히 새로운 영상으로 창조합니다
        </p>
      </motion.div>

      {/* 메인 3단 레이아웃 */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 min-h-0">

        {/* 1. 영상 설정 패널 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col min-h-0"
        >
          <div className="flex-1 bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex flex-col gap-4 overflow-y-auto custom-scrollbar-light">
            {/* Section Header */}
            <div className="flex items-center gap-3">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: PREMIUM_COLOR }}
              >
                1
              </span>
              <h3 className="text-xl font-bold text-gray-900">영상 설정</h3>
            </div>

            {/* 행사 유형 */}
            <CategorySelector
              category={category}
              onCategoryChange={handleCategoryChange}
            />

            {/* 스타일 */}
            <StyleSelector
              style={style}
              onStyleChange={setStyle}
            />

            {/* 상세 정보 */}
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-bold text-gray-700 mb-2">상세 정보 입력</label>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex-1">
                <EventInfoFields
                  category={category}
                  eventInfo={eventInfo}
                  setEventInfo={setEventInfo}
                  onBlur={updateTitleFromEventInfo}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. 미리보기 패널 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PreviewPanel
            category={category}
            style={style}
            previewUrl={previewUrl}
            onFileChange={handleFileChange}
            onDelete={() => setPreviewUrl(null)}
          />
        </motion.div>

        {/* 3. 문구 입력 패널 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
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
        </motion.div>

      </div>
    </div>
  );
}
