import { StyleColors } from './types';

// 스타일별 색상 설정
export const styleColors: Record<string, StyleColors> = {
  elegant: {
    primary: '#FFD700',
    secondary: '#FF69B4',
    glow: '#FFB6C1',
    background: '#1a0a1a',
  },
  luxury: {
    primary: '#FFD700',
    secondary: '#DAA520',
    glow: '#FFA500',
    background: '#0a0a0a',
  },
  neon: {
    primary: '#00FFFF',
    secondary: '#FF00FF',
    glow: '#00FF00',
    background: '#0a0020',
  },
  traditional: {
    primary: '#FF4444',
    secondary: '#FFD700',
    glow: '#FF6B6B',
    background: '#1a0505',
  },
  fantasy: {
    primary: '#8B5CF6',
    secondary: '#06B6D4',
    glow: '#A855F7',
    background: '#0a0a20',
  },
  space: {
    primary: '#E879F9',
    secondary: '#7C3AED',
    glow: '#F0ABFC',
    background: '#050510',
  },
};

// 폰트 매핑
export const fontMap: Record<string, string> = {
  elegant: '/fonts/Hakgyoansim_GongryongalR.ttf',
  luxury: '/fonts/SinchonRhapsodyTTF-ExtraBold_(2).ttf',
  neon: '/fonts/SF레몬빙수-TTF.ttf',
  traditional: '/fonts/Hakgyoansim_GongryongalR.ttf',
  fantasy: '/fonts/Solinsunny.ttf',
  space: '/fonts/SF레몬빙수-TTF.ttf',
};
