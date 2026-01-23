/**
 * CanvasPreview 컴포넌트 타입 정의
 */

import type {
  EffectType,
  TextPosition,
  CharEffectMode,
} from '@/lib/canvas-renderer';

// 미리보기 상태
export type PreviewState = 'idle' | 'loading' | 'playing' | 'paused' | 'exporting';

// 내보내기 상태
export type ExportState = 'idle' | 'preparing' | 'rendering' | 'encoding' | 'complete' | 'error';

// 미리보기 설정
export interface PreviewConfig {
  texts: string[];
  effects: EffectType[];
  textPosition: TextPosition;
  charEffectMode: CharEffectMode;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  glowColor: string;
  videoSrc?: string;
  referenceImageSrc?: string;
}

// 미리보기 컴포넌트 Props
export interface CanvasPreviewProps {
  config: PreviewConfig;
  width?: number;
  height?: number;
  autoPlay?: boolean;
  showControls?: boolean;
  onExportComplete?: (blob: Blob) => void;
  onError?: (error: Error) => void;
}

// 내보내기 버튼 Props
export interface ExportButtonProps {
  onExport: () => void;
  state: ExportState;
  progress: number;
  disabled?: boolean;
}

// 미리보기 캔버스 Props
export interface PreviewCanvasProps {
  width: number;
  height: number;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
}

// 재생 컨트롤 Props
export interface PlaybackControlsProps {
  state: PreviewState;
  currentFrame: number;
  totalFrames: number;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (frame: number) => void;
}
