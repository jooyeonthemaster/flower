import { LayerConfig, StyleColors } from '../types';

// 우아한 스타일: 부드러운 그림자, 섬세한 그라데이션
function generateElegantLayers(colors: StyleColors): LayerConfig[] {
  const result: LayerConfig[] = [];

  for (let i = 5; i > 0; i--) {
    result.push({
      id: `shadow-${i}`,
      position: [0.015 * i, -0.015 * i, -i * 0.04],
      color: colors.secondary,
      opacity: 0.15 * (1 - i / 6),
      scale: 1 + i * 0.008,
      outlineWidth: 0,
    });
  }
  result.push({
    id: 'glow-back',
    position: [0, 0, -0.02],
    color: colors.glow,
    opacity: 0.4,
    scale: 1.02,
    outlineWidth: 0.1,
    outlineColor: colors.glow,
  });
  result.push({
    id: 'main',
    position: [0, 0, 0],
    color: colors.primary,
    opacity: 1,
    scale: 1,
    outlineWidth: 0.04,
    outlineColor: colors.secondary,
  });
  result.push({
    id: 'highlight',
    position: [0, 0.015, 0.01],
    color: '#FFFFFF',
    opacity: 0.25,
    scale: 0.99,
    outlineWidth: 0,
  });

  return result;
}

// 럭셔리 스타일: 깊은 금색 그림자, 강한 입체감
function generateLuxuryLayers(colors: StyleColors): LayerConfig[] {
  const result: LayerConfig[] = [];

  for (let i = 12; i > 0; i--) {
    result.push({
      id: `depth-${i}`,
      position: [0.025 * i, -0.025 * i, -i * 0.06],
      color: i > 6 ? '#1a1000' : colors.secondary,
      opacity: i > 6 ? 0.5 : 0.8,
      scale: 1 + i * 0.005,
      outlineWidth: 0,
    });
  }
  result.push({
    id: 'main-outline',
    position: [0, 0, 0],
    color: colors.secondary,
    opacity: 1,
    scale: 1,
    outlineWidth: 0.12,
    outlineColor: '#8B6914',
  });
  result.push({
    id: 'main',
    position: [0, 0, 0.02],
    color: colors.primary,
    opacity: 1,
    scale: 1,
    outlineWidth: 0.02,
    outlineColor: colors.primary,
  });
  result.push({
    id: 'shine',
    position: [-0.02, 0.03, 0.03],
    color: '#FFFFFF',
    opacity: 0.5,
    scale: 0.97,
    outlineWidth: 0,
  });

  return result;
}

// 네온 스타일: 강한 글로우, 다중 색상 발광
function generateNeonLayers(colors: StyleColors): LayerConfig[] {
  return [
    {
      id: 'glow-outer',
      position: [0, 0, -0.1],
      color: colors.glow,
      opacity: 0.3,
      scale: 1.15,
      outlineWidth: 0.2,
      outlineColor: colors.glow,
    },
    {
      id: 'glow-mid',
      position: [0, 0, -0.05],
      color: colors.secondary,
      opacity: 0.5,
      scale: 1.08,
      outlineWidth: 0.15,
      outlineColor: colors.secondary,
    },
    {
      id: 'glow-inner',
      position: [0, 0, -0.02],
      color: colors.primary,
      opacity: 0.7,
      scale: 1.03,
      outlineWidth: 0.08,
      outlineColor: colors.primary,
    },
    {
      id: 'main',
      position: [0, 0, 0],
      color: '#FFFFFF',
      opacity: 1,
      scale: 1,
      outlineWidth: 0.03,
      outlineColor: colors.primary,
    },
  ];
}

// 전통 스타일: 붓글씨 느낌, 붉은 인장 효과
function generateTraditionalLayers(colors: StyleColors): LayerConfig[] {
  const result: LayerConfig[] = [];

  for (let i = 6; i > 0; i--) {
    result.push({
      id: `shadow-${i}`,
      position: [0.02 * i, -0.03 * i, -i * 0.05],
      color: '#2a0000',
      opacity: 0.4 * (1 - i / 8),
      scale: 1 + i * 0.01,
      outlineWidth: 0,
    });
  }
  result.push({
    id: 'outline',
    position: [0, 0, -0.01],
    color: colors.secondary,
    opacity: 1,
    scale: 1.01,
    outlineWidth: 0.1,
    outlineColor: '#8B0000',
  });
  result.push({
    id: 'main',
    position: [0, 0, 0],
    color: colors.primary,
    opacity: 1,
    scale: 1,
    outlineWidth: 0.02,
    outlineColor: colors.secondary,
  });
  result.push({
    id: 'stamp-effect',
    position: [0.01, -0.01, 0.01],
    color: '#FFD700',
    opacity: 0.15,
    scale: 1.02,
    outlineWidth: 0,
  });

  return result;
}

// 판타지 스타일: 마법 오라, 무지개빛 효과
function generateFantasyLayers(colors: StyleColors): LayerConfig[] {
  const result: LayerConfig[] = [];

  result.push({
    id: 'magic-outer',
    position: [0, 0, -0.15],
    color: '#06B6D4',
    opacity: 0.25,
    scale: 1.2,
    outlineWidth: 0.15,
    outlineColor: '#06B6D4',
  });
  result.push({
    id: 'magic-mid',
    position: [0, 0, -0.08],
    color: colors.glow,
    opacity: 0.4,
    scale: 1.1,
    outlineWidth: 0.1,
    outlineColor: colors.glow,
  });
  for (let i = 4; i > 0; i--) {
    result.push({
      id: `sparkle-${i}`,
      position: [0.01 * i, -0.01 * i, -i * 0.03],
      color: colors.secondary,
      opacity: 0.3,
      scale: 1 + i * 0.015,
      outlineWidth: 0,
    });
  }
  result.push({
    id: 'main',
    position: [0, 0, 0],
    color: colors.primary,
    opacity: 1,
    scale: 1,
    outlineWidth: 0.05,
    outlineColor: colors.secondary,
  });
  result.push({
    id: 'shimmer',
    position: [0, 0.02, 0.02],
    color: '#FFFFFF',
    opacity: 0.4,
    scale: 0.98,
    outlineWidth: 0,
  });

  return result;
}

// 스페이스 스타일: 우주적 글로우, 별빛 효과
function generateSpaceLayers(colors: StyleColors): LayerConfig[] {
  const result: LayerConfig[] = [];

  result.push({
    id: 'nebula',
    position: [0, 0, -0.2],
    color: colors.secondary,
    opacity: 0.2,
    scale: 1.25,
    outlineWidth: 0.2,
    outlineColor: colors.secondary,
  });
  result.push({
    id: 'star-glow',
    position: [0, 0, -0.1],
    color: colors.glow,
    opacity: 0.35,
    scale: 1.12,
    outlineWidth: 0.12,
    outlineColor: colors.glow,
  });
  for (let i = 8; i > 0; i--) {
    result.push({
      id: `depth-${i}`,
      position: [0, 0, -i * 0.04],
      color: i % 2 === 0 ? colors.primary : colors.secondary,
      opacity: 0.15 + (8 - i) * 0.05,
      scale: 1 + i * 0.01,
      outlineWidth: 0,
    });
  }
  result.push({
    id: 'main',
    position: [0, 0, 0],
    color: colors.primary,
    opacity: 1,
    scale: 1,
    outlineWidth: 0.04,
    outlineColor: colors.glow,
  });
  result.push({
    id: 'starlight',
    position: [0, 0, 0.02],
    color: '#FFFFFF',
    opacity: 0.35,
    scale: 0.99,
    outlineWidth: 0,
  });

  return result;
}

// 기본 스타일
function generateDefaultLayers(colors: StyleColors): LayerConfig[] {
  const result: LayerConfig[] = [];

  for (let i = 8; i > 0; i--) {
    result.push({
      id: `shadow-${i}`,
      position: [0.02 * i, -0.02 * i, -i * 0.05],
      color: '#000000',
      opacity: 0.3 * (1 - i / 10),
      scale: 1 + i * 0.01,
      outlineWidth: 0,
    });
  }
  result.push({
    id: 'main-outline',
    position: [0, 0, 0],
    color: colors.secondary,
    opacity: 1,
    scale: 1,
    outlineWidth: 0.08,
    outlineColor: colors.secondary,
  });
  result.push({
    id: 'main',
    position: [0, 0, 0.01],
    color: colors.primary,
    opacity: 1,
    scale: 1,
    outlineWidth: 0.03,
    outlineColor: colors.primary,
  });
  result.push({
    id: 'highlight',
    position: [0, 0.02, 0.02],
    color: '#FFFFFF',
    opacity: 0.3,
    scale: 0.98,
    outlineWidth: 0,
  });

  return result;
}

// 스타일별 레이어 생성 함수
export function generateStyleLayers(style: string, colors: StyleColors): LayerConfig[] {
  switch (style) {
    case 'elegant':
      return generateElegantLayers(colors);
    case 'luxury':
      return generateLuxuryLayers(colors);
    case 'neon':
      return generateNeonLayers(colors);
    case 'traditional':
      return generateTraditionalLayers(colors);
    case 'fantasy':
      return generateFantasyLayers(colors);
    case 'space':
      return generateSpaceLayers(colors);
    default:
      return generateDefaultLayers(colors);
  }
}
