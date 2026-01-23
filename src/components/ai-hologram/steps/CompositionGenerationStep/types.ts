import { CompositionData } from '../CompositionInputStep';
import { GeneratedDualFrame } from '../CompositionImagePreviewStep';

export interface CompositionGenerationStepProps {
  data: CompositionData;
  generatedFrames: GeneratedDualFrame[];
  onComplete: (videoUrl: string, messages: string[]) => void;
  onBack: () => void;
}

export type GenerationPhase = 'generating-video' | 'merging' | 'completed' | 'error';

export interface SceneProgress {
  videoGenerated: boolean;
  videoUrl?: string;
}

export interface VideoGenerationResult {
  index: number;
  videoUrl: string;
  success: boolean;
  error?: unknown;
}
