import { getKeywordsForCategory } from '../constants/keywordMessages';
import { sceneLabels } from '../constants/previewImages';

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
    <div className="flex flex-col h-full gap-4 min-h-0">
      <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-900/80 to-black/80 border border-amber-500/20 rounded-[1.5rem] overflow-hidden shadow-[0_0_40px_-10px_rgba(251,191,36,0.05)] backdrop-blur-md min-h-0">
        {/* 헤더 */}
        <div className="p-6 pb-4 bg-transparent sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-500/20 text-white flex items-center justify-center text-sm font-bold border border-amber-500/20">
                3
              </span>
              축하 문구 입력
            </h3>
            <span
              className={`px-2 py-1 rounded text-xs font-bold ${filledCount === 3 ? 'bg-amber-500/20 text-white border border-amber-500/20' : 'bg-slate-800 text-gray-400'}`}
            >
              {filledCount} / 3 완료
            </span>
          </div>

          {/* 탭 버튼 */}
          <div className="flex p-1 rounded-xl bg-black/40 border border-white/5">
            <button
              onClick={() => onMessageModeChange('keyword')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${messageMode !== 'custom' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
            >
              키워드 자동완성
            </button>
            <button
              onClick={() => onMessageModeChange('custom')}
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
                    onClick={() => onKeywordSelect(keyword)}
                    className={`px-3 py-1.5 rounded-full text-sm font-bold border transition-all hover:scale-105 active:scale-95 ${
                      selectedKeywords.includes(keyword)
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
              <div key={index} className="mb-4">
                <div className="px-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${message.trim() ? 'bg-amber-500 text-black' : 'bg-slate-700 text-gray-500'}`}
                      >
                        {index + 1}
                      </span>
                      <span className="text-xs font-bold text-gray-300">{sceneLabels[index]?.label}</span>
                    </div>
                    <span className="text-[10px] text-gray-600 bg-black/30 px-1.5 py-0.5 rounded">10초 노출</span>
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

      {/* 하단 액션 버튼 (3번 박스 하단) */}
      <div className="flex gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="w-14 h-14 rounded-xl flex items-center justify-center border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors bg-slate-900/40 backdrop-blur-xl"
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
          className={`flex-1 h-14 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all backdrop-blur-xl ${
            isValid
              ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)] hover:scale-[1.02] hover:shadow-amber-500/50'
              : 'bg-slate-800/80 text-gray-500 cursor-not-allowed'
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
