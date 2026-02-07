'use client'

import { useState, useEffect } from 'react';
import { CustomSettings } from '../types';
import { availableEffects, letterEffects, fontOptions, positionLabels } from '../constants/styleOptions';
import ColorPaletteGrid from './ColorPaletteGrid';
import ConflictWarningPanel from './ConflictWarningPanel';
import { detectConflicts } from '@/lib/canvas-renderer/effects/conflictDetector';
import { EFFECT_PRESETS, type EffectPreset } from '../constants/effectPresets';
import type { EffectType } from '@/lib/canvas-renderer/types';

// Standard 모드 색상
const STANDARD_COLOR = '#8A9A5B';

interface StyleSettingsSectionProps {
  style: string;
  customSettings: CustomSettings;
  showTextColorPalette: boolean;
  showGlowColorPalette: boolean;
  showEffectsDropdown: boolean;
  showLetterEffectDropdown: boolean;
  showPositionDropdown: boolean;
  showFontDropdown: boolean;
  showPresetsDropdown: boolean;
  onCustomSettingsChange: (settings: CustomSettings) => void;
  onToggleTextColorPalette: (show: boolean) => void;
  onToggleGlowColorPalette: (show: boolean) => void;
  onToggleEffectsDropdown: (show: boolean) => void;
  onToggleLetterEffectDropdown: (show: boolean) => void;
  onTogglePositionDropdown: (show: boolean) => void;
  onToggleFontDropdown: (show: boolean) => void;
  onTogglePresetsDropdown: (show: boolean) => void;
}

export default function StyleSettingsSection({
  style,
  customSettings,
  showTextColorPalette,
  showGlowColorPalette,
  showEffectsDropdown,
  showLetterEffectDropdown,
  showPositionDropdown,
  showFontDropdown,
  showPresetsDropdown,
  onCustomSettingsChange,
  onToggleTextColorPalette,
  onToggleGlowColorPalette,
  onToggleEffectsDropdown,
  onToggleLetterEffectDropdown,
  onTogglePositionDropdown,
  onToggleFontDropdown,
  onTogglePresetsDropdown,
}: StyleSettingsSectionProps) {
  // 충돌 검증 상태
  const [conflictResult, setConflictResult] = useState(detectConflicts([]));

  // 이펙트 변경 시 실시간 충돌 검증
  useEffect(() => {
    const allEffects = [...customSettings.effects];
    if (customSettings.letterEffect && customSettings.letterEffect !== 'none') {
      allEffects.push(customSettings.letterEffect);
    }
    const result = detectConflicts(allEffects as EffectType[]);
    setConflictResult(result);
  }, [customSettings.effects, customSettings.letterEffect]);

  // 프리셋 적용 핸들러
  const handlePresetApply = (preset: EffectPreset) => {
    onCustomSettingsChange({
      ...customSettings,
      effects: preset.effects as string[],
      textColor: preset.textColor || customSettings.textColor,
      glowColor: preset.glowColor || customSettings.glowColor,
    });
    onTogglePresetsDropdown(false);
  };

  // 이펙트 경고 아이콘 표시
  const getEffectWarningIcon = (effectId: string) => {
    if (!customSettings.effects.includes(effectId)) {
      const testEffects = [...customSettings.effects, effectId];
      if (customSettings.letterEffect && customSettings.letterEffect !== 'none') {
        testEffects.push(customSettings.letterEffect);
      }
      const testResult = detectConflicts(testEffects as EffectType[]);
      if (testResult.conflicts.some(c => c.severity === 'critical')) {
        return '🚫';
      }
      if (testResult.conflicts.some(c => c.severity === 'danger')) {
        return '⚠️';
      }
    }
    return null;
  };

  const toggleEffect = (effectId: string) => {
    const isSelected = customSettings.effects.includes(effectId);
    if (isSelected) {
      onCustomSettingsChange({ ...customSettings, effects: customSettings.effects.filter(e => e !== effectId) });
    } else {
      if (customSettings.effects.length >= 6) return;

      // CRITICAL 충돌 체크
      const testEffects = [...customSettings.effects, effectId];
      if (customSettings.letterEffect && customSettings.letterEffect !== 'none') {
        testEffects.push(customSettings.letterEffect);
      }
      const testResult = detectConflicts(testEffects as EffectType[]);
      const hasCritical = testResult.conflicts.some(c => c.severity === 'critical');

      if (hasCritical) {
        const criticalConflict = testResult.conflicts.find(c => c.severity === 'critical');
        alert(`⚠️ 이 효과를 추가하면 심각한 성능 문제가 발생할 수 있습니다.\n\n${criticalConflict?.rule.message}`);
        return;
      }

      onCustomSettingsChange({ ...customSettings, effects: [...customSettings.effects, effectId] });
    }
  };

  return (
    <div className="h-full bg-white rounded-2xl p-5 flex flex-col overflow-y-auto custom-scrollbar-light shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
          style={{ backgroundColor: STANDARD_COLOR }}
        >
          2
        </span>
        <h3 className="text-xl font-bold text-gray-900">스타일 설정</h3>
      </div>

      <div className="flex-1 space-y-4">
        {/* 선택된 스타일 표시 */}
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">선택된 스타일</p>
          <p className="text-sm font-bold text-[#8A9A5B]">
            {style === 'fancy' ? '화려하게' : '심플하게'}
          </p>
        </div>

        {/* 텍스트 색상 */}
        <div className="relative">
          <label className="text-xs text-gray-600 font-bold block mb-1.5">텍스트 색상</label>
          <button
            onClick={() => onToggleTextColorPalette(!showTextColorPalette)}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-[#8A9A5B]/50 transition-all text-gray-900"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded border-2 border-gray-300" style={{ backgroundColor: customSettings.textColor }} />
              <span className="text-sm text-gray-700">{customSettings.textColor}</span>
            </div>
            <span className="text-gray-400 text-xs">▼</span>
          </button>
          {showTextColorPalette && (
            <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-20">
              <ColorPaletteGrid
                currentColor={customSettings.textColor}
                onSelect={(color) => { onCustomSettingsChange({ ...customSettings, textColor: color }); onToggleTextColorPalette(false); }}
              />
            </div>
          )}
        </div>

        {/* 글로우 색상 */}
        <div className="relative">
          <label className="text-xs text-gray-600 font-bold block mb-1.5">글로우 색상</label>
          <button
            onClick={() => onToggleGlowColorPalette(!showGlowColorPalette)}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-[#8A9A5B]/50 transition-all text-gray-900"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded border-2 border-gray-300" style={{ backgroundColor: customSettings.glowColor }} />
              <span className="text-sm text-gray-700">{customSettings.glowColor}</span>
            </div>
            <span className="text-gray-400 text-xs">▼</span>
          </button>
          {showGlowColorPalette && (
            <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-20">
              <ColorPaletteGrid
                currentColor={customSettings.glowColor}
                onSelect={(color) => { onCustomSettingsChange({ ...customSettings, glowColor: color }); onToggleGlowColorPalette(false); }}
              />
            </div>
          )}
        </div>

        {/* 폰트 */}
        <div className="relative">
          <label className="text-xs text-gray-600 font-bold block mb-1.5">폰트</label>
          <button
            onClick={() => onToggleFontDropdown(!showFontDropdown)}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-[#8A9A5B]/50 transition-all text-gray-900"
          >
            <span className="text-sm text-gray-700">{fontOptions.find(f => f.value === customSettings.fontFamily)?.name}</span>
            <span className="text-gray-400 text-xs">▼</span>
          </button>
          {showFontDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 p-1 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto custom-scrollbar-light">
              {fontOptions.map(({ value, name }) => (
                <button
                  key={value}
                  onClick={() => { onCustomSettingsChange({ ...customSettings, fontFamily: value }); onToggleFontDropdown(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${customSettings.fontFamily === value ? 'bg-[#8A9A5B]/10 text-[#8A9A5B] font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                  style={{ fontFamily: value }}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 위치 */}
        <div className="relative">
          <label className="text-xs text-gray-600 font-bold block mb-1.5">텍스트 위치</label>
          <button
            onClick={() => onTogglePositionDropdown(!showPositionDropdown)}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-[#8A9A5B]/50 transition-all text-gray-900"
          >
            <span className="text-sm text-gray-700">{positionLabels[customSettings.textPosition]}</span>
            <span className="text-gray-400 text-xs">▼</span>
          </button>
          {showPositionDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 p-1 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-20">
              {(['random', 'top', 'center', 'bottom'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => { onCustomSettingsChange({ ...customSettings, textPosition: pos }); onTogglePositionDropdown(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${customSettings.textPosition === pos ? 'bg-[#8A9A5B]/10 text-[#8A9A5B] font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {positionLabels[pos]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 일반 이펙트 */}
        <div className="relative">
          <label className="text-xs text-gray-600 font-bold block mb-1.5">
            특수 효과 <span className="text-[#8A9A5B]">({customSettings.effects.length}/6)</span>
          </label>
          <button
            onClick={() => onToggleEffectsDropdown(!showEffectsDropdown)}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-[#8A9A5B]/50 transition-all text-gray-900"
          >
            <span className="text-sm text-gray-700 truncate">
              {customSettings.effects.length === 0 ? '효과 없음' : customSettings.effects.map(id => availableEffects.find(e => e.id === id)?.name).join(', ')}
            </span>
            <span className="text-gray-400 text-xs">▼</span>
          </button>
          {showEffectsDropdown && (
            <div className="absolute bottom-full left-0 right-0 mb-1 p-1 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto custom-scrollbar-light">
              {availableEffects.map(({ id, name }) => {
                const warningIcon = getEffectWarningIcon(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleEffect(id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${customSettings.effects.includes(id) ? 'bg-[#8A9A5B]/10 text-[#8A9A5B] font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <span className="flex items-center gap-2">
                      {name}
                      {warningIcon && <span>{warningIcon}</span>}
                    </span>
                    {customSettings.effects.includes(id) && <span className="text-[#8A9A5B]">✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 글자별 이펙트 (단일 선택) */}
        <div className="relative">
          <label className="text-xs text-gray-600 font-bold block mb-1.5">글자별 효과</label>
          <button
            onClick={() => onToggleLetterEffectDropdown(!showLetterEffectDropdown)}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-[#8A9A5B]/50 transition-all text-gray-900"
          >
            <span className="text-sm text-gray-700">
              {letterEffects.find(e => e.id === customSettings.letterEffect)?.name || '없음'}
            </span>
            <span className="text-gray-400 text-xs">▼</span>
          </button>
          {showLetterEffectDropdown && (
            <div className="absolute bottom-full left-0 right-0 mb-1 p-1 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto custom-scrollbar-light">
              {letterEffects.map(({ id, name }) => (
                <button
                  key={id}
                  onClick={() => { onCustomSettingsChange({ ...customSettings, letterEffect: id }); onToggleLetterEffectDropdown(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${customSettings.letterEffect === id ? 'bg-[#8A9A5B]/10 text-[#8A9A5B] font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {name}
                  {customSettings.letterEffect === id && <span className="text-[#8A9A5B]">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 추천 조합 */}
        <div className="relative">
          <label className="text-xs text-gray-600 font-bold block mb-1.5">추천 조합</label>
          <button
            onClick={() => onTogglePresetsDropdown(!showPresetsDropdown)}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-[#8A9A5B]/50 transition-all text-gray-900"
          >
            <span className="text-sm text-gray-700">조합 선택</span>
            <span className="text-gray-400 text-xs">▼</span>
          </button>
          {showPresetsDropdown && (
            <div className="absolute bottom-full left-0 right-0 mb-1 p-1 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto custom-scrollbar-light">
              {EFFECT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetApply(preset)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{preset.icon}</span>
                    <span className="text-sm font-bold text-gray-900">{preset.name}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{preset.description}</p>
                  <div className="flex gap-1 flex-wrap">
                    {preset.effects.slice(0, 3).map((effect, index) => (
                      <span
                        key={index}
                        className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-600"
                      >
                        {availableEffects.find(e => e.id === effect)?.name || effect}
                      </span>
                    ))}
                    {preset.effects.length > 3 && (
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                        +{preset.effects.length - 3}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 충돌 경고 패널 */}
        <ConflictWarningPanel conflictResult={conflictResult} />
      </div>
    </div>
  );
}
