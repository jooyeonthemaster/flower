import { CustomSettings } from '../types';
import { availableEffects, letterEffects, fontOptions, positionLabels } from '../constants/styleOptions';
import ColorPaletteGrid from './ColorPaletteGrid';

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
    <div className="bg-gradient-to-br from-slate-900/80 to-black/80 border border-blue-500/20 rounded-[1.25rem] p-3 flex flex-col min-h-0 overflow-y-auto custom-scrollbar shadow-[0_0_40px_-10px_rgba(59,130,246,0.05)] backdrop-blur-md">
      <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2 flex-none">
        <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">2</span>
        스타일 설정
      </h3>

      <div className="flex-1 space-y-3">
        {/* 선택된 스타일 표시 */}
        <div className="bg-black/40 p-2.5 rounded-xl border border-blue-500/10">
          <p className="text-xs text-gray-500 mb-0.5">스타일</p>
          <p className="text-sm font-bold text-blue-500">
            {style === 'fancy' ? '화려하게' : '심플하게'}
          </p>
        </div>

        {/* 텍스트 색상 */}
        <div className="relative">
          <label className="text-xs text-gray-400 font-bold block mb-1.5">텍스트 색상</label>
          <button
            onClick={() => onToggleTextColorPalette(!showTextColorPalette)}
            className="w-full flex items-center justify-between px-2.5 py-2 bg-black/60 border border-blue-500/20 rounded-xl hover:bg-black/80 hover:border-blue-500/40 transition-all text-white"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded border border-white/20" style={{ backgroundColor: customSettings.textColor }} />
              <span className="text-sm text-gray-300">{customSettings.textColor}</span>
            </div>
            <span className="text-gray-500 text-xs">▼</span>
          </button>
          {showTextColorPalette && (
            <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-slate-900 border border-blue-500/20 rounded-xl shadow-2xl z-20">
              <ColorPaletteGrid
                currentColor={customSettings.textColor}
                onSelect={(color) => { onCustomSettingsChange({ ...customSettings, textColor: color }); onToggleTextColorPalette(false); }}
              />
            </div>
          )}
        </div>

        {/* 글로우 색상 */}
        <div className="relative">
          <label className="text-xs text-gray-400 font-bold block mb-1.5">글로우 색상</label>
          <button
            onClick={() => onToggleGlowColorPalette(!showGlowColorPalette)}
            className="w-full flex items-center justify-between px-2.5 py-2 bg-black/60 border border-blue-500/20 rounded-xl hover:bg-black/80 hover:border-blue-500/40 transition-all text-white"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded border border-white/20" style={{ backgroundColor: customSettings.glowColor }} />
              <span className="text-sm text-gray-300">{customSettings.glowColor}</span>
            </div>
            <span className="text-gray-500 text-xs">▼</span>
          </button>
          {showGlowColorPalette && (
            <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-slate-900 border border-blue-500/20 rounded-xl shadow-2xl z-20">
              <ColorPaletteGrid
                currentColor={customSettings.glowColor}
                onSelect={(color) => { onCustomSettingsChange({ ...customSettings, glowColor: color }); onToggleGlowColorPalette(false); }}
              />
            </div>
          )}
        </div>

        {/* 폰트 */}
        <div className="relative">
          <label className="text-xs text-gray-400 font-bold block mb-1.5">폰트</label>
          <button
            onClick={() => onToggleFontDropdown(!showFontDropdown)}
            className="w-full flex items-center justify-between px-2.5 py-2 bg-black/60 border border-blue-500/20 rounded-xl hover:bg-black/80 hover:border-blue-500/40 transition-all text-white"
          >
            <span className="text-sm text-gray-300">{fontOptions.find(f => f.value === customSettings.fontFamily)?.name}</span>
            <span className="text-gray-500 text-xs">▼</span>
          </button>
          {showFontDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 p-1 bg-slate-900 border border-blue-500/20 rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto custom-scrollbar">
              {fontOptions.map(({ value, name }) => (
                <button
                  key={value}
                  onClick={() => { onCustomSettingsChange({ ...customSettings, fontFamily: value }); onToggleFontDropdown(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${customSettings.fontFamily === value ? 'bg-blue-600/30 text-blue-200' : 'text-gray-400 hover:bg-white/5'}`}
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
          <label className="text-xs text-gray-400 font-bold block mb-1.5">텍스트 위치</label>
          <button
            onClick={() => onTogglePositionDropdown(!showPositionDropdown)}
            className="w-full flex items-center justify-between px-2.5 py-2 bg-black/60 border border-blue-500/20 rounded-xl hover:bg-black/80 hover:border-blue-500/40 transition-all text-white"
          >
            <span className="text-sm text-gray-300">{positionLabels[customSettings.textPosition]}</span>
            <span className="text-gray-500 text-xs">▼</span>
          </button>
          {showPositionDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 p-1 bg-slate-900 border border-blue-500/20 rounded-xl shadow-2xl z-20">
              {(['random', 'top', 'center', 'bottom'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => { onCustomSettingsChange({ ...customSettings, textPosition: pos }); onTogglePositionDropdown(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${customSettings.textPosition === pos ? 'bg-blue-600/30 text-blue-200' : 'text-gray-400 hover:bg-white/5'}`}
                >
                  {positionLabels[pos]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 일반 이펙트 */}
        <div className="relative">
          <label className="text-xs text-gray-400 font-bold block mb-1.5">
            특수 효과 <span className="text-blue-500">({customSettings.effects.length}/6)</span>
          </label>
          <button
            onClick={() => onToggleEffectsDropdown(!showEffectsDropdown)}
            className="w-full flex items-center justify-between px-2.5 py-2 bg-black/60 border border-blue-500/20 rounded-xl hover:bg-black/80 hover:border-blue-500/40 transition-all text-white"
          >
            <span className="text-sm text-gray-300">
              {customSettings.effects.length === 0 ? '효과 없음' : customSettings.effects.map(id => availableEffects.find(e => e.id === id)?.name).join(', ')}
            </span>
            <span className="text-gray-500 text-xs">▼</span>
          </button>
          {showEffectsDropdown && (
            <div className="absolute bottom-full left-0 right-0 mb-1 p-1 bg-slate-900 border border-blue-500/20 rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto custom-scrollbar">
              {availableEffects.map(({ id, name }) => (
                <button
                  key={id}
                  onClick={() => toggleEffect(id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${customSettings.effects.includes(id) ? 'bg-blue-600/30 text-blue-200' : 'text-gray-400 hover:bg-white/5'}`}
                >
                  {name}
                  {customSettings.effects.includes(id) && <span>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 글자별 이펙트 (단일 선택) */}
        <div className="relative">
          <label className="text-xs text-gray-400 font-bold block mb-1.5">글자별 효과</label>
          <button
            onClick={() => onToggleLetterEffectDropdown(!showLetterEffectDropdown)}
            className="w-full flex items-center justify-between px-2.5 py-2 bg-black/60 border border-blue-500/20 rounded-xl hover:bg-black/80 hover:border-blue-500/40 transition-all text-white"
          >
            <span className="text-sm text-gray-300">
              {letterEffects.find(e => e.id === customSettings.letterEffect)?.name || '없음'}
            </span>
            <span className="text-gray-500 text-xs">▼</span>
          </button>
          {showLetterEffectDropdown && (
            <div className="absolute bottom-full left-0 right-0 mb-1 p-1 bg-slate-900 border border-blue-500/20 rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto custom-scrollbar">
              {letterEffects.map(({ id, name }) => (
                <button
                  key={id}
                  onClick={() => { onCustomSettingsChange({ ...customSettings, letterEffect: id }); onToggleLetterEffectDropdown(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${customSettings.letterEffect === id ? 'bg-blue-600/30 text-blue-200' : 'text-gray-400 hover:bg-white/5'}`}
                >
                  {name}
                  {customSettings.letterEffect === id && <span>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
