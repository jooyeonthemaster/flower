import { SceneData } from '../../MultiSceneStep';
import { getKeywordsForCategory } from '../constants/keywordMessages';

interface MessageInputSectionProps {
  category: string;
  scenes: SceneData[];
  messageMode: 'keyword' | 'custom';
  selectedKeyword: string;
  onMessageModeChange: (mode: 'keyword' | 'custom') => void;
  onKeywordSelect: (keyword: string) => void;
  onSceneChange: (id: number, text: string) => void;
}

export default function MessageInputSection({
  category,
  scenes,
  messageMode,
  selectedKeyword,
  onMessageModeChange,
  onKeywordSelect,
  onSceneChange,
}: MessageInputSectionProps) {
  const filledCount = scenes.filter(s => s.text.trim()).length;
  const keywords = getKeywordsForCategory(category);

  const handleKeywordSelect = (keyword: string) => {
    // 부모 컴포넌트의 selectKeyword가 씬 업데이트를 처리함
    onKeywordSelect(keyword);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-black/80 border border-blue-500/20 rounded-[1.25rem] overflow-hidden flex flex-col min-h-0 shadow-[0_0_40px_-10px_rgba(59,130,246,0.05)] backdrop-blur-md">
      <div className="p-3 pb-2 border-b border-blue-500/10 active:border-blue-500/20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">1</span>
            축하 문구 입력
          </h3>
          <span className={`px-2 py-0.5 rounded text-xs font-bold ${filledCount === 6 ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-gray-400'}`}>
            {filledCount}/6
          </span>
        </div>
        <div className="flex p-1 rounded-lg bg-black/40 border border-blue-500/10">
          <button
            onClick={() => onMessageModeChange('keyword')}
            className={`flex-1 py-1.5 rounded text-sm font-bold transition-all ${messageMode === 'keyword' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-500 hover:text-gray-300'}`}
          >
            키워드 자동완성
          </button>
          <button
            onClick={() => onMessageModeChange('custom')}
            className={`flex-1 py-1.5 rounded text-sm font-bold transition-all ${messageMode === 'custom' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-500 hover:text-gray-300'}`}
          >
            직접 입력
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 pt-2">
        {messageMode === 'keyword' && (
          <div className="mb-2">
            <p className="text-xs text-gray-500 mb-1.5">키워드 선택 시 자동 채움</p>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => handleKeywordSelect(keyword)}
                  className={`px-3 py-1.5 rounded-full text-sm font-bold border transition-all ${selectedKeyword === keyword
                    ? 'bg-blue-500 border-blue-400 text-white shadow-blue-500/30 shadow-md'
                    : 'bg-black/40 border-slate-700 text-gray-400 hover:border-blue-500/50 hover:text-gray-200'
                    }`}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          {scenes.map((scene, index) => (
            <div key={scene.id}>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${scene.text.trim() ? 'bg-blue-500 text-white' : 'bg-slate-800 text-gray-500'}`}>
                  {index + 1}
                </span>
                <span className="text-xs text-gray-400">
                  {scene.type === 'title' && '제목'}
                  {scene.type === 'message' && '본문'}
                  {scene.type === 'sender' && '맺음말'}
                </span>
              </div>
              <textarea
                value={scene.text}
                onChange={(e) => onSceneChange(scene.id, e.target.value)}
                placeholder={scene.type === 'sender' ? '보내는 사람: ' : '문구 입력'}
                rows={2}
                className="w-full bg-black/60 rounded-xl border border-blue-500/20 focus:border-blue-400 outline-none text-sm text-white placeholder-gray-600 p-2.5 resize-none transition-all focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] focus:bg-black/80"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
