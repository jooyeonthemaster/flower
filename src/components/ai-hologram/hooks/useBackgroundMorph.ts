'use client';

import { useMemo } from 'react';

export type BackgroundColor = 'cream' | 'black' | 'dusty-rose' | 'moss-green' | 'orange';

interface BackgroundMorphConfig {
  currentStep: number;
  mode: 'select' | 'single' | 'composition';
}

// CSS 클래스 매핑
const colorClassMap: Record<BackgroundColor, string> = {
  'cream': 'bg-cream',
  'black': 'bg-deep-black',
  'dusty-rose': 'bg-dusty-rose',
  'moss-green': 'bg-moss-green',
  'orange': 'bg-orange',
};

// 텍스트 색상 (배경에 따른 대비)
const textColorMap: Record<BackgroundColor, string> = {
  'cream': 'text-deep-black',
  'black': 'text-cream',
  'dusty-rose': 'text-deep-black',
  'moss-green': 'text-cream',
  'orange': 'text-cream',
};

// 단계별 배경색 정의
const stepBackgrounds: Record<string, Record<number, BackgroundColor>> = {
  select: {
    0: 'cream',
  },
  single: {
    0: 'cream',      // Create step
    1: 'cream',      // Compose step
    2: 'cream',      // Generate step (라이트 테마)
    3: 'cream',      // Complete step
  },
  composition: {
    0: 'cream',           // Create step
    1: 'cream',           // Compose step (라이트 테마)
    2: 'cream',           // Generate step (라이트 테마)
    3: 'cream',           // Complete step
  },
};

export function useBackgroundMorph({ currentStep, mode }: BackgroundMorphConfig) {
  const backgroundColor = useMemo(() => {
    const modeBackgrounds = stepBackgrounds[mode] || stepBackgrounds.select;
    return modeBackgrounds[currentStep] || 'cream';
  }, [currentStep, mode]);

  const bgClass = colorClassMap[backgroundColor];
  const textClass = textColorMap[backgroundColor];

  return {
    backgroundColor,
    bgClass,
    textClass,
    // 전체 클래스 조합
    containerClass: `${bgClass} ${textClass} bg-morph`,
    // 다크 모드 여부
    isDark: backgroundColor === 'black',
    // Premium 모드 여부
    isPremiumStyle: backgroundColor === 'dusty-rose' || backgroundColor === 'orange',
  };
}

// 특정 색상의 CSS 변수값 반환
export function getColorValue(color: BackgroundColor): string {
  const values: Record<BackgroundColor, string> = {
    'cream': '#F5F5F0',
    'black': '#0a0a0a',
    'dusty-rose': '#D4A5A5',
    'moss-green': '#8A9A5B',
    'orange': '#E66B33',
  };
  return values[color];
}
