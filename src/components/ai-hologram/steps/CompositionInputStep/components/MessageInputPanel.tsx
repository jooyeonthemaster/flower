import { getKeywordsForCategory } from '../constants/keywordMessages';
import { sceneLabels } from '../constants/previewImages';

// Premium 모드 색상
const PREMIUM_COLOR = '#E66B33';

interface MessageInputPanelProps {
  category: string;
  messages: string[];
  messageMode: 'keyword' | 'custom';
  selectedKeywords: string[];
  filledCount: number;
  isValid: boolean;
  onMessageChange: (index: number, text: string) => void;
  onMessageModeChange: (mode: 'keyword' | 'custom') => void;
  onKeywordSelect: (keyword: string) => void;
  onSubmit: () => void;
  onBack?: () => void;
}

export default function MessageInputPanel({
  category,
  messages,
  messageMode,
  selectedKeywords,
  filledCount,
  isValid,
  onMessageChange,
  onMessageModeChange,
  onKeywordSelect,
  onSubmit,
  onBack,
}: MessageInputPanelProps) {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-1 flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 min-h-0">
        {/* 헤더 */}
        <div className="p-5 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: PREMIUM_COLOR }}
              >
                3
              </span>
              <h3 className="text-xl font-bold text-gray-900">축하 문구 입력</h3>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                filledCount === 3
                  ? 'bg-[#E66B33]/10 text-[#E66B33] border border-[#E66B33]/20'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {filledCount} / 3 완료
            </span>
          </div>

          {/* 탭 버튼 */}
          <div className="flex p-1 rounded-xl bg-gray-100">
            <button
              onClick={() => onMessageModeChange('keyword')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                messageMode !== 'custom'
                  ? 'bg-[#E66B33] text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              키워드 자동완성
            </button>
            <button
              onClick={() => onMessageModeChange('custom')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                messageMode === 'custom'
                  ? 'bg-[#E66B33] text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              직접 입력하기
            </button>
          </div>
        </div>

        {/* 컨텐츠 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar-light p-5 pt-3">
          {/* 키워드 추천 영역 */}
          {messageMode !== 'custom' && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">원하는 키워드를 누르면 문구가 자동으로 채워집니다</p>
              <div className="flex flex-wrap gap-2">
                {getKeywordsForCategory(category).map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => onKeywordSelect(keyword)}
                    className={`px-3 py-1.5 rounded-full text-sm font-bold border-2 transition-all hover:scale-105 active:scale-95 ${
                      selectedKeywords.includes(keyword)
                        ? 'bg-[#E66B33] border-[#E66B33] text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-[#E66B33]/50 hover:text-[#E66B33]'
                    }`}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 입력 폼 리스트 */}
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
                        message.trim()
                          ? 'bg-[#E66B33] text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-gray-700">{sceneLabels[index]?.label}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">10초 노출</span>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => onMessageChange(index, e.target.value)}
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
                  className="w-full bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#E66B33] focus:bg-white focus:ring-2 focus:ring-[#E66B33]/20 outline-none text-sm text-gray-900 placeholder-gray-400 p-3 resize-none transition-all leading-snug"
                />
              </div>
            ))}
          </div>

          {/* 안내 문구 */}
          <div className="mt-4 p-3 rounded-xl bg-[#E66B33]/5 border border-[#E66B33]/20 flex gap-3 items-center">
            <span className="text-xl">✨</span>
            <p className="text-xs text-gray-600 leading-relaxed">
              입력하신 문구와 분위기에 맞춰 AI가 <span className="text-gray-900 font-bold">100% 새로운 영상</span>을 생성합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 하단 액션 버튼 */}
      <div className="flex gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="w-14 h-14 rounded-xl flex items-center justify-center border-2 border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors bg-white"
            title="이전 단계"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <button
          onClick={onSubmit}
          disabled={!isValid}
          className={`flex-1 h-14 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${
            isValid
              ? 'bg-[#E66B33] text-white hover:bg-[#D55A22] hover:scale-[1.02] hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>AI 이미지 생성하기</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
