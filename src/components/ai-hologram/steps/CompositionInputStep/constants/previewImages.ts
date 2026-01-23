import { SceneLabel } from '../types';

// 카테고리별 미리보기 이미지 (AI 전용)
export const categoryPreviewImages: Record<string, { fancy: string; simple: string }> = {
  wedding: {
    fancy: '/ai-previews/wedding-fancy.png',
    simple: '/ai-previews/wedding-simple.png',
  },
  opening: {
    fancy: '/ai-previews/opening-fancy.png',
    simple: '/ai-previews/opening-simple.png',
  },
  event: {
    fancy: '/ai-previews/event-fancy.png',
    simple: '/ai-previews/event-simple.png',
  },
};

// 장면 타입 라벨 (3개)
export const sceneLabels: SceneLabel[] = [
  { icon: '🎬', label: '오프닝' },
  { icon: '💬', label: '메인' },
  { icon: '✉️', label: '마무리' },
];
