'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SceneData } from '../MultiSceneStep';
import { CustomSettings, TextPreviewStepProps } from './types';
import { getTemplateVideoPath } from './utils/templatePath';
import { keywordMessageSets } from './constants/keywordMessages';
import MessageInputSection from './components/MessageInputSection';
import StyleSettingsSection from './components/StyleSettingsSection';
import PreviewSection from './components/PreviewSection';
import StepActionBar from '../../components/StepActionBar';

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
    fontSize: 55,  // 1080p 기준
    fontFamily: "'Noto Sans KR', sans-serif",
  });

  const [showTextColorPalette, setShowTextColorPalette] = useState(false);
  const [showGlowColorPalette, setShowGlowColorPalette] = useState(false);
  const [showEffectsDropdown, setShowEffectsDropdown] = useState(false);
  const [showLetterEffectDropdown, setShowLetterEffectDropdown] = useState(false);
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showPresetsDropdown, setShowPresetsDropdown] = useState(false);

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
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar-light p-4 md:p-6 lg:p-8 pb-32">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-none mb-6 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="headline-step text-[#8A9A5B]">STANDARD</span>
            <span className="text-xl text-gray-300">✦</span>
            <span className="headline-step text-gray-900">문구 & 스타일</span>
          </div>
          <p className="text-gray-500 text-sm md:text-base">
            축하 문구를 입력하고 텍스트 스타일을 설정하세요
          </p>
        </motion.div>

        {/* 메인 3단 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 min-h-[600px]">
          {/* 1. 좌측: 축하 문구 입력 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col min-h-0"
          >
            <div className="h-full">
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
          </motion.div>

          {/* 2. 중앙: 스타일 설정 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col min-h-0"
          >
            <div className="h-full">
              <StyleSettingsSection
                style={sceneData.style}
                customSettings={customSettings}
                showTextColorPalette={showTextColorPalette}
                showGlowColorPalette={showGlowColorPalette}
                showEffectsDropdown={showEffectsDropdown}
                showLetterEffectDropdown={showLetterEffectDropdown}
                showPositionDropdown={showPositionDropdown}
                showFontDropdown={showFontDropdown}
                showPresetsDropdown={showPresetsDropdown}
                onCustomSettingsChange={setCustomSettings}
                onToggleTextColorPalette={setShowTextColorPalette}
                onToggleGlowColorPalette={setShowGlowColorPalette}
                onToggleEffectsDropdown={setShowEffectsDropdown}
                onToggleLetterEffectDropdown={setShowLetterEffectDropdown}
                onTogglePositionDropdown={setShowPositionDropdown}
                onToggleFontDropdown={setShowFontDropdown}
                onTogglePresetsDropdown={setShowPresetsDropdown}
              />
            </div>
          </motion.div>

          {/* 3. 우측: 미리보기 + 버튼 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col min-h-0"
          >
            <div className="h-full">
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
          </motion.div>
        </div>
      </div>

      <StepActionBar
        onNext={handleNext}
        onBack={onBack}
        isNextDisabled={filledCount === 0}
        nextLabel="영상 생성하기"
        color="#8A9A5B"
      />
    </div>
  );
}
