'use client';

import { useState } from 'react';

interface TextInputStepProps {
  category: string; // 'wedding' | 'opening' | 'event'
  initialTexts?: string[];
  onComplete: (texts: string[]) => void;
  onBack: () => void;
}

// 카테고리별 기본 텍스트 템플릿
const defaultTexts: Record<string, string[]> = {
  wedding: [
    '김철수 ♥ 이영희',
    '결혼을 축하합니다',
    '두 분의 앞날에',
    '행복이 가득하길',
    '바랍니다',
    '보내는 사람',
  ],
  opening: [
    '개업을 축하합니다',
    '번창하시길',
    '기원합니다',
    '새로운 시작을',
    '응원합니다',
    '보내는 사람',
  ],
  event: [
    '축하합니다',
    '기쁜 마음으로',
    '함께합니다',
    '행복한 날',
    '되세요',
    '보내는 사람',
  ],
};

// 카테고리별 플레이스홀더
const placeholders: Record<string, string[]> = {
  wedding: [
    '신랑 ♥ 신부 이름',
    '축하 메시지 1',
    '축하 메시지 2',
    '축하 메시지 3',
    '축하 메시지 4',
    '보내는 사람 / 회사명',
  ],
  opening: [
    '가게/회사 이름',
    '축하 메시지 1',
    '축하 메시지 2',
    '축하 메시지 3',
    '축하 메시지 4',
    '보내는 사람 / 회사명',
  ],
  event: [
    '행사명 / 축하 대상',
    '축하 메시지 1',
    '축하 메시지 2',
    '축하 메시지 3',
    '축하 메시지 4',
    '보내는 사람 / 회사명',
  ],
};

export default function TextInputStep({
  category,
  initialTexts,
  onComplete,
  onBack
}: TextInputStepProps) {
  const defaults = defaultTexts[category] || defaultTexts.event;
  const [texts, setTexts] = useState<string[]>(
    initialTexts && initialTexts.length === 6
      ? initialTexts
      : defaults
  );

  const categoryPlaceholders = placeholders[category] || placeholders.event;

  const handleTextChange = (index: number, value: string) => {
    const newTexts = [...texts];
    newTexts[index] = value;
    setTexts(newTexts);
  };

  const handleSubmit = () => {
    // 빈 텍스트 확인
    const hasEmpty = texts.some(t => t.trim() === '');
    if (hasEmpty) {
      alert('모든 텍스트를 입력해주세요.');
      return;
    }
    onComplete(texts);
  };

  const handleReset = () => {
    setTexts(defaults);
  };

  return (
    <div className="animate-fade-in h-full flex flex-col">
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">텍스트 입력</h2>
          <p className="text-blue-300">영상에 표시될 6개 문구를 입력하세요</p>
          <p className="text-sm text-gray-400 mt-1">각 문구는 5초씩 표시됩니다</p>
        </div>

        {/* Text Inputs */}
        <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar">
          {texts.map((text, index) => (
            <div key={index} className="relative">
              <label className="block text-sm text-gray-400 mb-1">
                장면 {index + 1} ({index * 5}초 ~ {(index + 1) * 5}초)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                  placeholder={categoryPlaceholders[index]}
                  maxLength={50}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                  {text.length}/50
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Preview Info */}
        <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
          <h3 className="text-sm font-medium text-blue-300 mb-2">미리보기</h3>
          <div className="space-y-1">
            {texts.map((text, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 w-16">장면 {index + 1}:</span>
                <span className="text-white truncate">{text || '(비어있음)'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
          >
            이전
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all"
          >
            초기화
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition-all font-medium"
          >
            다음
          </button>
        </div>

      </div>
    </div>
  );
}
