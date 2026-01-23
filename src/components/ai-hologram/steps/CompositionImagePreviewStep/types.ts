import { CompositionData } from '../CompositionInputStep';

export type GenerationState = 'idle' | 'generating' | 'completed' | 'error';
export type GenerationPhase = 'idle' | 'background' | 'textframe' | 'done';

export interface GeneratedDualFrame {
  message: string;
  fullImageUrl: string;
  startFrameUrl: string;
  endFrameUrl: string;
}

export interface CompositionImagePreviewStepProps {
  data: CompositionData;
  onNext: (generatedFrames: GeneratedDualFrame[]) => void;
  onBack: () => void;
}

export interface UseImageGenerationReturn {
  state: GenerationState;
  generatedFrames: GeneratedDualFrame[];
  selectedIndex: number;
  errorMessage: string;
  generationPhase: GenerationPhase;
  backgroundProgress: boolean[];
  textFrameProgress: boolean[];
  elapsedTime: number;
  totalProgress: number;
  messageCount: number;
  completedBackgrounds: number;
  completedTextFrames: number;
  handleGenerateImages: () => Promise<void>;
  handleRegenerate: () => void;
  setSelectedIndex: (index: number) => void;
  formatTime: (seconds: number) => string;
}
