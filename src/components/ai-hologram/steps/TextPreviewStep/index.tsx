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
    <div className="animate-fade-in-down h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex-none mb-2 text-center lg:text-left">
        <h1 className="text-xl font-extrabold text-white mb-0.5">
          문구 입력 & 스타일 설정
        </h1>
        <p className="text-gray-400 text-xs">
          축하 문구를 입력하고 텍스트 스타일을 설정하세요
        </p>
      </div>

      {/* 메인 3분할 레이아웃 */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3 min-h-0">
        {/* 1. 좌측: 축하 문구 입력 */}
        <MessageInputSection
          category={sceneData.category}
          scenes={scenes}
          messageMode={messageMode}
          selectedKeyword={selectedKeyword}
          onMessageModeChange={setMessageMode}
          onKeywordSelect={selectKeyword}
          onSceneChange={handleSceneChange}
        />

        {/* 2. 중앙: 스타일 설정 */}
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

        {/* 3. 우측: 미리보기 + 버튼 */}
        <PreviewSection
          previewVideoUrl={previewVideoUrl}
          referenceImage={sceneData.referenceImage}
          scenes={scenes}
          customSettings={customSettings}
          filledCount={filledCount}
          onBack={onBack}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}
