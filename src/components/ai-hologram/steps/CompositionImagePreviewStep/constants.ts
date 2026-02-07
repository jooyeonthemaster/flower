export const PREMIUM_COLOR = '#E66B33';

// 테스트 모드: true로 설정하면 첫 번째 장면만 생성 (빠른 테스트용)
export const TEST_MODE = false;

export const categoryLabels: Record<string, string> = {
  wedding: '결혼식',
  opening: '개업',
  event: '행사',
};

export const styleLabels: Record<string, string> = {
  fancy: '화려하게',
  simple: '심플하게',
};

export type GenerationPhase =
  | 'idle'
  | 'background'
  | 'textframe'
  | 'images-completed'
  | 'generating-videos'
  | 'merging-videos'
  | 'done';

export type GenerationState = 'idle' | 'generating' | 'completed' | 'error';

export interface SceneProgress {
  videoGenerated: boolean;
  videoUrl?: string;
}

export interface GeneratedDualFrame {
  startFrameUrl: string;
  endFrameUrl: string;
  message: string;
}

export interface CompositionData {
  messages: string[];
  category: string;
  style: string;
}
