'use client';

import { useState, useEffect } from 'react';
import { SceneData } from '../MultiSceneStep';
import { CustomSettings, TextPreviewStepProps } from './types';
import { getTemplateVideoPath } from './utils/templatePath';
import { keywordMessageSets } from './constants/keywordMessages';
import MessageInputSection from './components/MessageInputSection';
import StyleSettingsSection from './components/StyleSettingsSection';
import PreviewSection from './components/PreviewSection';

// Re-export types for external use
export type { CustomSettings } from './types';

export default function TextPreviewStep({
  sceneData,
  onNext,
  onBack,
}: TextPreviewStepProps) {
  const templateVideoUrl = getTemplateVideoPath(sceneData.category, sceneData.style);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string>(templateVideoUrl);
  const [scenes, setScenes] = useState<SceneData[]>(sceneData.scenes);
  const [messageMode, setMessageMode] = useState<'keyword' | 'custom'>('keyword');
  const [selectedKeyword, setSelectedKeyword] = useState<string>('');
  const [customSettings, setCustomSettings] = useState<CustomSettings>({
    textColor: '#FFFFFF',
    glowColor: '#00FFFF',
    effects: [],
    letterEffect: 'none',
    textPosition: 'random' as const,
    fontSize: 50,  // 1080p 기준
    fontFamily: "'Noto Sans KR', sans-serif",
  });

  const [showTextColorPalette, setShowTextColorPalette] = useState(false);
  const [showGlowColorPalette, setShowGlowColorPalette] = useState(false);
  const [showEffectsDropdown, setShowEffectsDropdown] = useState(false);
  const [showLetterEffectDropdown, setShowLetterEffectDropdown] = useState(false);
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);

  useEffect(() => {
    const newVideoUrl = getTemplateVideoPath(sceneData.category, sceneData.style);
    setPreviewVideoUrl(newVideoUrl);
  }, [sceneData.category, sceneData.style]);

  const handleNext = () => {
    if (previewVideoUrl) {
      onNext(previewVideoUrl, customSettings, scenes);
    }
  };

  const handleSceneChange = (id: number, text: string) => {
    setScenes(scenes.map(scene =>
      scene.id === id ? { ...scene, text } : scene
    ));
  };

  const selectKeyword = (keyword: string) => {
    setSelectedKeyword(keyword);
    const messageSet = keywordMessageSets[sceneData.category]?.[keyword];
    if (!messageSet) return;

    const newScenes = scenes.map((scene, index) => ({
      ...scene,
      text: messageSet[index] || scene.text,
    }));
    setScenes(newScenes);
  };

  const filledCount = scenes.filter(s => s.text.trim()).length;

  return (
    <div className="w-full h-full flex flex-col items-center">

      {/* 타이틀 */}
      <div className="text-center mb-8 animate-fadeIn">
        <h2 className="text-3xl font-display font-bold mb-2">CUSTOMIZE HOLOGRAM</h2>
        <p className="text-white/60 font-light">문구를 입력하고 텍스트 스타일을 설정하세요.</p>
      </div>

      {/* 메인 3분할 레이아웃 - Dashboard Style */}
      <div className="w-full max-w-[1920px] grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[calc(100vh-250px)] min-h-[600px]">

        {/* 1. 좌측: 축하 문구 입력 (3 Col) */}
        <div className="lg:col-span-3 h-full glass-panel rounded-2xl overflow-hidden flex flex-col animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <div className="p-5 border-b border-white/10 bg-white/5">
            <h3 className="font-display font-bold text-blue-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              MESSAGE INPUT
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
            <MessageInputSection
              category={sceneData.category}
              scenes={scenes}
              messageMode={messageMode}
              selectedKeyword={selectedKeyword}
              onMessageModeChange={setMessageMode}
              onKeywordSelect={selectKeyword}
              onSceneChange={handleSceneChange}
            />
          </div>
        </div>

        {/* 2. 중앙: 스타일 설정 (6 Col - Wide Preview Focus) */}
        <div className="lg:col-span-6 h-full flex flex-col gap-6">

          {/* Preview Area (Top) */}
          <div className="flex-1 glass-panel rounded-2xl p-1 overflow-hidden animate-fadeIn relative group" style={{ animationDelay: '0.2s' }}>
            <PreviewSection
              previewVideoUrl={previewVideoUrl}
              referenceImage={sceneData.referenceImage}
              scenes={scenes}
              customSettings={customSettings}
              filledCount={filledCount}
              onBack={onBack}
              onNext={handleNext}
              // Hide default buttons in PreviewSection to custom place them
              hideButtons={true}
            />
            {/* Custom 'Hologram Frame' overlay */}
            <div className="absolute inset-0 pointer-events-none border border-blue-500/20 rounded-xl z-20"></div>
            <div className="absolute top-4 right-4 z-30 px-3 py-1 rounded-full bg-black/60 backdrop-blur border border-blue-500/30 text-blue-400 text-xs font-mono">
              LIVE RENDER
            </div>
          </div>

          {/* Action Buttons (Bottom) */}
          <div className="h-20 glass-panel rounded-xl p-3 flex items-center justify-between gap-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <button onClick={onBack} className="h-full px-8 rounded-lg border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-colors font-bold">
              BACK
            </button>
            <button onClick={handleNext} className="h-full px-12 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold tracking-wider hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all">
              GENERATE VIDEO
            </button>
          </div>
        </div>

        {/* 3. 우측: 스타일 설정 (3 Col) */}
        <div className="lg:col-span-3 h-full glass-panel rounded-2xl overflow-hidden flex flex-col animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <div className="p-5 border-b border-white/10 bg-white/5">
            <h3 className="font-display font-bold text-blue-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              VISUAL SETTINGS
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
            <StyleSettingsSection
              style={sceneData.style}
              customSettings={customSettings}
              showTextColorPalette={showTextColorPalette}
              showGlowColorPalette={showGlowColorPalette}
              showEffectsDropdown={showEffectsDropdown}
              showLetterEffectDropdown={showLetterEffectDropdown}
              showPositionDropdown={showPositionDropdown}
              showFontDropdown={showFontDropdown}
              onCustomSettingsChange={setCustomSettings}
              onToggleTextColorPalette={setShowTextColorPalette}
              onToggleGlowColorPalette={setShowGlowColorPalette}
              onToggleEffectsDropdown={setShowEffectsDropdown}
              onToggleLetterEffectDropdown={setShowLetterEffectDropdown}
              onTogglePositionDropdown={setShowPositionDropdown}
              onToggleFontDropdown={setShowFontDropdown}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

