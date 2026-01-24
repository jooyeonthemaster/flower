import { CustomSettings } from '../types';
import { availableEffects, letterEffects, fontOptions, positionLabels } from '../constants/styleOptions';
import ColorPaletteGrid from './ColorPaletteGrid';

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
  onCustomSettingsChange: (settings: CustomSettings) => void;
  onToggleTextColorPalette: (show: boolean) => void;
  onToggleGlowColorPalette: (show: boolean) => void;
  onToggleEffectsDropdown: (show: boolean) => void;
  onToggleLetterEffectDropdown: (show: boolean) => void;
  onTogglePositionDropdown: (show: boolean) => void;
  onToggleFontDropdown: (show: boolean) => void;
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
  onCustomSettingsChange,
  onToggleTextColorPalette,
  onToggleGlowColorPalette,
  onToggleEffectsDropdown,
  onToggleLetterEffectDropdown,
  onTogglePositionDropdown,
  onToggleFontDropdown,
}: StyleSettingsSectionProps) {
  const toggleEffect = (effectId: string) => {
    const isSelected = customSettings.effects.includes(effectId);
    if (isSelected) {
      onCustomSettingsChange({ ...customSettings, effects: customSettings.effects.filter(e => e !== effectId) });
    } else {
      if (customSettings.effects.length >= 6) return;
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
              {availableEffects.map(({ id, name }) => (
                <button
                  key={id}
                  onClick={() => toggleEffect(id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${customSettings.effects.includes(id) ? 'bg-[#8A9A5B]/10 text-[#8A9A5B] font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {name}
                  {customSettings.effects.includes(id) && <span className="text-[#8A9A5B]">✓</span>}
                </button>
              ))}
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
      </div>
    </div>
  );
}
