/**
 * Canvas 렌더러 기본값
 */

import type { RendererConfig, TextStyle } from '../types';

// 기본 렌더러 설정
export const DEFAULT_RENDERER_CONFIG: RendererConfig = {
  width: 1080,
  height: 1080,
  fps: 30,
  duration: 30, // 30초
  backgroundColor: '#000000',
};

// 기본 텍스트 스타일
export const DEFAULT_TEXT_STYLE: TextStyle = {
  fontFamily: "'Noto Sans KR', sans-serif",
  fontSize: 65,
  fontWeight: 900,
  color: '#ffffff',
  glowColor: '#00ffff',
  textAlign: 'center',
};

// 씬 설정
export const SCENE_DURATION_SECONDS = 5; // 각 텍스트 5초
export const ENTRANCE_DURATION_SECONDS = 0.8; // 진입 애니메이션
export const EXIT_DURATION_SECONDS = 0.5; // 퇴장 애니메이션

// 이펙트 타이밍
export const EFFECT_DURATION_SECONDS = 4; // 이펙트 재생 시간
export const FADEOUT_START_SECONDS = 3.5; // 페이드아웃 시작

// 위치 설정 (% 기준)
export const POSITION_TOP = 0.30; // 30%
export const POSITION_CENTER = 0.50; // 50%
export const POSITION_BOTTOM = 0.68; // 68%

// 이동 제한 (baseUnit 기준)
export const MAX_Y_MOVEMENT = 250;
export const MAX_X_MOVEMENT = 150;

// 3D 효과 설정
export const PERSPECTIVE = 1200;
