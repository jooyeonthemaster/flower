import { SceneData } from '../MultiSceneStep';

export interface CustomSettings {
  textColor: string;
  glowColor: string;
  effects: string[];
  letterEffect: string;  // 글자별 이펙트 (단일 선택)
  textPosition: 'random' | 'top' | 'center' | 'bottom';
  fontSize: number;
  fontFamily: string;
}

export interface TextPreviewStepProps {
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
