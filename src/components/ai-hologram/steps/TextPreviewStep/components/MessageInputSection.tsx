'use client'

import { SceneData } from '../../MultiSceneStep';
import { getKeywordsForCategory, keywordMessageSets } from '../constants/keywordMessages';

// Standard 모드 색상
const STANDARD_COLOR = '#8A9A5B';

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
    const messageSet = keywordMessageSets[category]?.[keyword];
    if (!messageSet) return;

    const newScenes = scenes.map((scene, index) => ({
      ...scene,
      text: messageSet[index] || scene.text,
    }));

    onKeywordSelect(keyword);
    // Note: Parent component should handle updating scenes
    newScenes.forEach((scene) => {
      onSceneChange(scene.id, scene.text);
    });
  };

  return (
    <div className="h-full bg-white rounded-2xl overflow-hidden flex flex-col shadow-lg border border-gray-100">
      <div className="p-5 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: STANDARD_COLOR }}
            >
              1
            </span>
            <h3 className="text-xl font-bold text-gray-900">축하 문구 입력</h3>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              filledCount === 6
                ? 'bg-[#8A9A5B]/10 text-[#8A9A5B] border border-[#8A9A5B]/20'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {filledCount}/6
          </span>
        </div>
        <div className="flex p-1 rounded-xl bg-gray-100">
          <button
            onClick={() => onMessageModeChange('keyword')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              messageMode === 'keyword'
                ? 'bg-[#8A9A5B] text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            키워드 자동완성
          </button>
          <button
            onClick={() => onMessageModeChange('custom')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              messageMode === 'custom'
                ? 'bg-[#8A9A5B] text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            직접 입력
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar-light p-5 pt-3">
        {messageMode === 'keyword' && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">키워드 선택 시 자동 채움</p>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => handleKeywordSelect(keyword)}
                  className={`px-3 py-1.5 rounded-full text-sm font-bold border-2 transition-all hover:scale-105 active:scale-95 ${
                    selectedKeyword === keyword
                      ? 'bg-[#8A9A5B] border-[#8A9A5B] text-white shadow-md'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-[#8A9A5B]/50 hover:text-[#8A9A5B]'
                  }`}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {scenes.map((scene, index) => (
            <div key={scene.id}>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
                    scene.text.trim()
                      ? 'bg-[#8A9A5B] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </span>
                <span className="text-xs font-bold text-gray-700">
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
                className="w-full bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#8A9A5B] focus:bg-white focus:ring-2 focus:ring-[#8A9A5B]/20 outline-none text-sm text-gray-900 placeholder-gray-400 p-3 resize-none transition-all"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
