'use client';

import { useState, useEffect } from 'react';
import { SceneData } from './MultiSceneStep';
import { Player } from '@remotion/player';
import { HologramTextOverlay } from '../../../remotion/HologramTextOverlay';

export interface CustomSettings {
  textColor: string;
  glowColor: string;
  effects: string[];
  textPosition: 'random' | 'top' | 'center' | 'bottom';
  fontSize: number;
  fontFamily: string;
}

interface TextPreviewStepProps {
  sceneData: {
    scenes: SceneData[];
    category: string;
    style: string;
    referenceImage?: string;
    previewImageUrl?: string;
  };
  onNext: (previewImageUrl: string, customSettings: CustomSettings, scenes: SceneData[]) => void;
  onBack: () => void;
}

const getTemplateVideoPath = (category: string, style: string): string => {
  return `/templates/videos/${category}-${style}.mp4`;
};

// 카테고리별 키워드와 문구 세트
const keywordMessageSets: Record<string, Record<string, string[]>> = {
  wedding: {
    '영원한 사랑': [
      '두 분의 결혼을 진심으로 축하드립니다',
      '오늘 이 아름다운 시작이 영원한 사랑의 약속이 되길 바랍니다',
      '서로를 향한 믿음과 존중으로 어떤 날도 함께 이겨내시길 바랍니다',
      '두 분이 나누는 사랑이 세상에서 가장 빛나는 축복이 되길 기원합니다',
      '영원토록 변치 않는 사랑으로 행복한 가정을 이루시길 바랍니다',
      '보내는 사람: ',
    ],
    '행복': [
      '두 분의 결혼을 진심으로 축하드립니다',
      '오늘부터 시작되는 새로운 여정에 행복만 가득하길 기원합니다',
      '함께하는 모든 순간이 소중한 추억으로 쌓여가길 바랍니다',
      '서로의 존재만으로도 행복해지는 날들이 되시길 바랍니다',
      '두 분의 가정에 늘 웃음과 행복이 넘쳐나길 진심으로 기원합니다',
      '보내는 사람: ',
    ],
    '축복': [
      '두 분의 결혼을 진심으로 축하드립니다',
      '하늘이 맺어준 소중한 인연을 진심으로 축복합니다',
      '두 분의 앞날에 기쁨과 축복이 함께하길 기원합니다',
      '서로를 아끼고 사랑하는 마음이 영원하길 바랍니다',
      '아름다운 두 분의 결합을 온 마음을 다해 축복드립니다',
      '보내는 사람: ',
    ],
    '백년해로': [
      '두 분의 결혼을 진심으로 축하드립니다',
      '오늘의 약속이 백년 후에도 변함없이 빛나길 바랍니다',
      '함께 걸어갈 긴 여정에 사랑과 행복이 함께하길 기원합니다',
      '세월이 흘러도 서로를 바라보는 눈빛이 오늘처럼 따뜻하길 바랍니다',
      '백년해로 하시며 누구보다 행복한 부부가 되시길 기원합니다',
      '보내는 사람: ',
    ],
  },
  opening: {
    '번창': [
      '새로운 시작을 진심으로 축하드립니다',
      '오늘의 첫 걸음이 큰 성공의 시작이 되길 기원합니다',
      '정성을 담은 사업이 많은 분들께 사랑받길 바랍니다',
      '방문하시는 모든 분들에게 기쁨을 드리는 공간이 되길 바랍니다',
      '사업이 날로 번창하여 큰 꿈을 이루시길 진심으로 응원합니다',
      '보내는 사람: ',
    ],
    '대박': [
      '새로운 시작을 진심으로 축하드립니다',
      '그동안의 노력이 드디어 결실을 맺게 되어 기쁩니다',
      '손님들의 발길이 끊이지 않는 명소가 되시길 바랍니다',
      '매일매일 좋은 일들로 가득 차시길 기원합니다',
      '대박나셔서 모든 꿈을 이루시길 진심으로 응원합니다',
      '보내는 사람: ',
    ],
    '성공': [
      '새로운 시작을 진심으로 축하드립니다',
      '도전하시는 용기와 열정에 깊은 존경을 보냅니다',
      '뜻하신 바를 모두 이루시는 성공적인 사업이 되시길 바랍니다',
      '어려움이 있어도 좋은 결과로 이어지시길 기원합니다',
      '항상 성공과 행운이 함께하시길 진심으로 응원합니다',
      '보내는 사람: ',
    ],
    '발전': [
      '새로운 시작을 진심으로 축하드립니다',
      '오늘의 시작이 무한한 발전의 토대가 되시길 바랍니다',
      '끊임없이 성장하고 발전하는 사업이 되시길 기원합니다',
      '고객님들께 최고의 가치를 전하시는 공간이 되시길 바랍니다',
      '무궁무진한 발전을 이루시길 진심으로 응원합니다',
      '보내는 사람: ',
    ],
  },
  event: {
    '성공': [
      '뜻깊은 행사를 진심으로 축하드립니다',
      '오늘 이 자리가 모두에게 의미 있는 시간이 되길 바랍니다',
      '준비하신 모든 것들이 빛나는 결실로 이어지길 기원합니다',
      '함께하신 분들 모두에게 좋은 추억이 되시길 바랍니다',
      '성공적인 행사가 되시길 진심으로 응원합니다',
      '보내는 사람: ',
    ],
    '축하': [
      '뜻깊은 행사를 진심으로 축하드립니다',
      '오늘의 기쁨이 오래도록 기억에 남으시길 바랍니다',
      '소중한 분들과 함께하는 이 순간이 더욱 빛나길 기원합니다',
      '앞으로도 좋은 일들만 가득하시길 바랍니다',
      '진심을 담아 축하의 마음을 전합니다',
      '보내는 사람: ',
    ],
    '감사': [
      '뜻깊은 행사를 진심으로 축하드립니다',
      '함께해 주신 모든 분들께 깊은 감사의 마음을 전합니다',
      '오늘의 인연이 앞으로도 소중한 관계로 이어지길 바랍니다',
      '베풀어 주신 관심과 사랑에 진심으로 감사드립니다',
      '늘 건강하시고 행복하시길 기원합니다',
      '보내는 사람: ',
    ],
    '발전': [
      '뜻깊은 행사를 진심으로 축하드립니다',
      '오늘을 계기로 더욱 큰 도약을 이루시길 기원합니다',
      '지금까지의 성과에 깊은 존경을 보냅니다',
      '앞으로의 발전이 더욱 기대되는 시간입니다',
      '무한한 발전과 성공을 진심으로 응원합니다',
      '보내는 사람: ',
    ],
  },
};

// 풀 스펙트럼 색상 팔레트 생성 (사진처럼 색상표)
const generateColorPalette = (): string[] => {
  const colors: string[] = [];

  // Row 1: 밝은 색상 (Saturation 100%, Lightness ~90%)
  const brightColors = [
    '#FFCCCC', '#FFE5CC', '#FFFFCC', '#E5FFCC', '#CCFFCC', '#CCFFE5',
    '#CCFFFF', '#CCE5FF', '#CCCCFF', '#E5CCFF', '#FFCCFF', '#FFCCE5',
    '#FFFFFF', '#E0E0E0', '#C0C0C0',
  ];

  // Row 2: 연한 색상 (Saturation 100%, Lightness ~75%)
  const lightColors = [
    '#FF9999', '#FFCC99', '#FFFF99', '#CCFF99', '#99FF99', '#99FFCC',
    '#99FFFF', '#99CCFF', '#9999FF', '#CC99FF', '#FF99FF', '#FF99CC',
    '#B0B0B0', '#909090', '#707070',
  ];

  // Row 3: 중간 밝기 (Saturation 100%, Lightness ~60%)
  const mediumLightColors = [
    '#FF6666', '#FFB366', '#FFFF66', '#B3FF66', '#66FF66', '#66FFB3',
    '#66FFFF', '#66B3FF', '#6666FF', '#B366FF', '#FF66FF', '#FF66B3',
    '#606060', '#505050', '#404040',
  ];

  // Row 4: 순수 색상 (Saturation 100%, Lightness ~50%)
  const pureColors = [
    '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80',
    '#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF', '#FF0080',
    '#FFD700', '#C0C0C0', '#303030',
  ];

  // Row 5: 진한 색상 (Saturation 100%, Lightness ~40%)
  const darkColors = [
    '#CC0000', '#CC6600', '#CCCC00', '#66CC00', '#00CC00', '#00CC66',
    '#00CCCC', '#0066CC', '#0000CC', '#6600CC', '#CC00CC', '#CC0066',
    '#DAA520', '#A0A0A0', '#202020',
  ];

  // Row 6: 더 진한 색상 (Saturation 100%, Lightness ~30%)
  const darkerColors = [
    '#990000', '#994D00', '#999900', '#4D9900', '#009900', '#00994D',
    '#009999', '#004D99', '#000099', '#4D0099', '#990099', '#99004D',
    '#B8860B', '#808080', '#101010',
  ];

  // Row 7: 아주 진한 색상 (Saturation 100%, Lightness ~20%)
  const deepColors = [
    '#660000', '#663300', '#666600', '#336600', '#006600', '#006633',
    '#006666', '#003366', '#000066', '#330066', '#660066', '#660033',
    '#8B4513', '#505050', '#000000',
  ];

  return [
    ...brightColors,
    ...lightColors,
    ...mediumLightColors,
    ...pureColors,
    ...darkColors,
    ...darkerColors,
    ...deepColors,
  ];
};

export default function TextPreviewStep({
  sceneData,
  onNext,
  onBack
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
    textPosition: 'random' as const,
    fontSize: 50,
    fontFamily: "'Noto Sans KR', sans-serif",
  });

  const [showTextColorPalette, setShowTextColorPalette] = useState(false);
  const [showGlowColorPalette, setShowGlowColorPalette] = useState(false);
  const [showEffectsDropdown, setShowEffectsDropdown] = useState(false);
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);

  const colorPalette = generateColorPalette();

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
      text: messageSet[index] || scene.text
    }));
    setScenes(newScenes);
  };

  const getKeywordsForCategory = (): string[] => {
    return Object.keys(keywordMessageSets[sceneData.category] || {});
  };

  const filledCount = scenes.filter(s => s.text.trim()).length;

  const availableEffects = [
    // 기본 이펙트
    { id: 'glow', name: '글로우' },
    { id: 'glitch', name: '글리치' },
    { id: 'drift', name: '떠다님' },
    { id: 'pulse', name: '펄스' },
    { id: 'hologram', name: '홀로그램' },
    { id: 'strobe', name: '스트로브' },
    { id: 'wave', name: '웨이브' },
    { id: 'zoom', name: '줌' },
    { id: 'blur', name: '블러' },
    { id: 'chromatic', name: '색수차' },
    { id: 'pixelate', name: '픽셀화' },
    { id: 'rainbow', name: '레인보우' },
    { id: 'rotate3d', name: '3D 회전' },
    // 움직임/크기 이펙트
    { id: 'bounce', name: '바운스' },
    { id: 'spin', name: '스핀' },
    { id: 'spiral', name: '나선형' },
    { id: 'swing', name: '스윙' },
    { id: 'slide', name: '슬라이드' },
    { id: 'orbit', name: '궤도' },
    // 3D 깊이 이펙트 (LED 홀로그램 팬용)
    { id: 'zoomIn', name: '줌인 3D' },
    { id: 'flipUp', name: '플립업' },
    { id: 'spiral3d', name: '3D 나선' },
    { id: 'wave3d', name: '3D 웨이브' },
    { id: 'tumble', name: '텀블' },
    { id: 'extrude', name: '입체돌출' },
  ];

  const fontOptions = [
    // Google Fonts
    { value: "'Noto Sans KR', sans-serif", name: 'Noto Sans' },
    { value: "'Black Han Sans', sans-serif", name: '검은고딕' },
    { value: "'Jua', sans-serif", name: '주아체' },
    { value: "'Do Hyeon', sans-serif", name: '도현체' },
    { value: "'Gaegu', cursive", name: '개구체' },
    { value: "'Gamja Flower', cursive", name: '감자꽃체' },
    // 로컬 커스텀 폰트 (public/fonts)
    { value: "'Hakgyoansim Gongryongal', sans-serif", name: '공룡알체' },
    { value: "'OK DDUNG', sans-serif", name: '오케이뚱' },
    { value: "'SF Lemon Bingsu', sans-serif", name: 'SF 레몬빙수' },
    { value: "'Sinchon Rhapsody', sans-serif", name: '신촌랩소디' },
    { value: "'Solinsunny', sans-serif", name: '솔인써니' },
    { value: "'KERIS EDU Line', sans-serif", name: '케리스에듀' },
  ];

  const toggleEffect = (effectId: string) => {
    setCustomSettings(prev => {
      const isSelected = prev.effects.includes(effectId);
      if (isSelected) {
        return { ...prev, effects: prev.effects.filter(e => e !== effectId) };
      } else {
        if (prev.effects.length >= 6) return prev;
        return { ...prev, effects: [...prev.effects, effectId] };
      }
    });
  };

  // 색상 팔레트 컴포넌트
  const ColorPaletteGrid = ({ currentColor, onSelect }: { currentColor: string; onSelect: (color: string) => void }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: '2px' }}>
      {colorPalette.map((color, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(color)}
          className={`w-4 h-4 border ${currentColor === color ? 'border-blue-400 ring-1 ring-blue-400' : 'border-black/20 hover:border-white/60'}`}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  );

  return (
    <div className="animate-fade-in-down h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex-none mb-4 text-center lg:text-left">
        <h1 className="text-2xl font-extrabold text-white mb-1">
          문구 입력 & 스타일 설정
        </h1>
        <p className="text-gray-400 text-sm">
          축하 문구를 입력하고 텍스트 스타일을 설정하세요
        </p>
      </div>

      {/* 메인 3분할 레이아웃 */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">

        {/* 1. 좌측: 축하 문구 입력 */}
        <div className="bg-gradient-to-br from-slate-900/80 to-black/80 border border-blue-500/20 rounded-[1.5rem] overflow-hidden flex flex-col min-h-0 shadow-[0_0_40px_-10px_rgba(59,130,246,0.05)] backdrop-blur-md">
          <div className="p-4 pb-3 border-b border-blue-500/10 active:border-blue-500/20">
            <div className="flex items-center justify-between mb-3">
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
                onClick={() => setMessageMode('keyword')}
                className={`flex-1 py-1.5 rounded text-sm font-bold transition-all ${messageMode === 'keyword' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-500 hover:text-gray-300'}`}
              >
                키워드 자동완성
              </button>
              <button
                onClick={() => setMessageMode('custom')}
                className={`flex-1 py-1.5 rounded text-sm font-bold transition-all ${messageMode === 'custom' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-500 hover:text-gray-300'}`}
              >
                직접 입력
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pt-3">
            {messageMode === 'keyword' && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">키워드 선택 시 자동 채움</p>
                <div className="flex flex-wrap gap-2">
                  {getKeywordsForCategory().map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => selectKeyword(keyword)}
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

            <div className="space-y-2.5">
              {scenes.map((scene, index) => (
                <div key={scene.id}>
                  <div className="flex items-center gap-2 mb-1">
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
                    onChange={(e) => handleSceneChange(scene.id, e.target.value)}
                    placeholder={scene.type === 'sender' ? '보내는 사람: ' : '문구 입력'}
                    rows={2}
                    className="w-full bg-black/60 rounded-xl border border-blue-500/20 focus:border-blue-400 outline-none text-sm text-white placeholder-gray-600 p-2.5 resize-none transition-all focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] focus:bg-black/80"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. 중앙: 스타일 설정 */}
        <div className="bg-gradient-to-br from-slate-900/80 to-black/80 border border-blue-500/20 rounded-[1.5rem] p-4 flex flex-col min-h-0 overflow-y-auto custom-scrollbar shadow-[0_0_40px_-10px_rgba(59,130,246,0.05)] backdrop-blur-md">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2 flex-none">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">2</span>
            스타일 설정
          </h3>

          <div className="flex-1 space-y-4">
            {/* 선택된 스타일 표시 */}
            <div className="bg-black/40 p-3 rounded-xl border border-blue-500/10">
              <p className="text-xs text-gray-500 mb-1">스타일</p>
              <p className="text-sm font-bold text-blue-500">
                {sceneData.style === 'fancy' ? '화려하게' : '심플하게'}
              </p>
            </div>
            {/* 텍스트 색상 */}
            <div className="relative">
              <label className="text-sm text-gray-400 font-bold block mb-2">텍스트 색상</label>
              <button
                onClick={() => setShowTextColorPalette(!showTextColorPalette)}
                className="w-full flex items-center justify-between px-3 py-3 bg-black/60 border border-blue-500/20 rounded-xl hover:bg-black/80 hover:border-blue-500/40 transition-all text-white"
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
                    onSelect={(color) => { setCustomSettings({ ...customSettings, textColor: color }); setShowTextColorPalette(false); }}
                  />
                </div>
              )}
            </div>

            {/* 글로우 색상 */}
            <div className="relative">
              <label className="text-sm text-gray-400 font-bold block mb-2">글로우 색상</label>
              <button
                onClick={() => setShowGlowColorPalette(!showGlowColorPalette)}
                className="w-full flex items-center justify-between px-3 py-3 bg-black/60 border border-blue-500/20 rounded-xl hover:bg-black/80 hover:border-blue-500/40 transition-all text-white"
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
                    onSelect={(color) => { setCustomSettings({ ...customSettings, glowColor: color }); setShowGlowColorPalette(false); }}
                  />
                </div>
              )}
            </div>

            {/* 폰트 */}
            <div className="relative">
              <label className="text-sm text-gray-400 font-bold block mb-2">폰트</label>
              <button
                onClick={() => setShowFontDropdown(!showFontDropdown)}
                className="w-full flex items-center justify-between px-3 py-3 bg-black/60 border border-blue-500/20 rounded-xl hover:bg-black/80 hover:border-blue-500/40 transition-all text-white"
              >
                <span className="text-sm text-gray-300">{fontOptions.find(f => f.value === customSettings.fontFamily)?.name}</span>
                <span className="text-gray-500 text-xs">▼</span>
              </button>
              {showFontDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 p-1 bg-slate-900 border border-blue-500/20 rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto custom-scrollbar">
                  {fontOptions.map(({ value, name }) => (
                    <button
                      key={value}
                      onClick={() => { setCustomSettings({ ...customSettings, fontFamily: value }); setShowFontDropdown(false); }}
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
              <label className="text-sm text-gray-400 font-bold block mb-2">텍스트 위치</label>
              <button
                onClick={() => setShowPositionDropdown(!showPositionDropdown)}
                className="w-full flex items-center justify-between px-3 py-3 bg-black/60 border border-blue-500/20 rounded-xl hover:bg-black/80 hover:border-blue-500/40 transition-all text-white"
              >
                <span className="text-sm text-gray-300">
                  {{ 'random': '랜덤', 'top': '상단', 'center': '중앙', 'bottom': '하단' }[customSettings.textPosition]}
                </span>
                <span className="text-gray-500 text-xs">▼</span>
              </button>
              {showPositionDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 p-1 bg-slate-900 border border-blue-500/20 rounded-xl shadow-2xl z-20">
                  {['random', 'top', 'center', 'bottom'].map((pos) => (
                    <button
                      key={pos}
                      onClick={() => { setCustomSettings({ ...customSettings, textPosition: pos as CustomSettings['textPosition'] }); setShowPositionDropdown(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${customSettings.textPosition === pos ? 'bg-blue-600/30 text-blue-200' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                      {{ 'random': '랜덤', 'top': '상단', 'center': '중앙', 'bottom': '하단' }[pos]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 이펙트 */}
            <div className="relative">
              <label className="text-sm text-gray-400 font-bold block mb-2">
                특수 효과 <span className="text-blue-500">({customSettings.effects.length}/6)</span>
              </label>
              <button
                onClick={() => setShowEffectsDropdown(!showEffectsDropdown)}
                className="w-full flex items-center justify-between px-3 py-3 bg-black/60 border border-blue-500/20 rounded-xl hover:bg-black/80 hover:border-blue-500/40 transition-all text-white"
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
          </div>
        </div>

        {/* 3. 우측: 미리보기 + 버튼 */}
        <div className="bg-gradient-to-br from-slate-900/80 to-black/80 border border-blue-500/20 rounded-[1.5rem] p-4 flex flex-col min-h-0 shadow-[0_0_40px_-10px_rgba(59,130,246,0.05)] backdrop-blur-md">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2 flex-none">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">3</span>
            실시간 미리보기
          </h3>

          <div className="flex-1 flex items-center justify-center bg-black/50 rounded-xl border border-blue-500/10 overflow-hidden p-2">
            {previewVideoUrl && (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-full max-w-[400px] aspect-square shadow-2xl rounded-xl overflow-hidden ring-1 ring-white/10 group">
                  <Player
                    component={HologramTextOverlay}
                    inputProps={{
                      videoSrc: previewVideoUrl,
                      imageSrc: '',
                      referenceImageSrc: sceneData.referenceImage || '',
                      texts: scenes.map(s => s.text),
                      fontSize: 50,
                      fontFamily: customSettings.fontFamily,
                      textColor: customSettings.textColor,
                      glowColor: customSettings.glowColor,
                      effects: customSettings.effects,
                      textPosition: customSettings.textPosition,
                    }}
                    durationInFrames={scenes.length * 30 * 5}
                    compositionWidth={1080}
                    compositionHeight={1080}
                    fps={30}
                    controls
                    loop
                    autoPlay
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3 mt-4 pt-4 border-t border-blue-500/10 flex-none">
            <button
              onClick={onBack}
              className="w-12 h-11 rounded-xl flex items-center justify-center border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors bg-white/5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={handleNext}
              disabled={filledCount === 0}
              className={`flex-1 h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${filledCount === 0
                ? 'bg-slate-800/50 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white hover:scale-[1.02] shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)]'
                }`}
            >
              영상 생성하기
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
