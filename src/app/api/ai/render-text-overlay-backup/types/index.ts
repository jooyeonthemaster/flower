/**
 * render-text-overlay API 타입 정의
 */

export interface TextOverlayRequest {
  videoDataUrl?: string;
  videoUrl?: string;
  texts: string[];
  fontSize?: number;
  fontFamily?: string;
  textColor?: string;
  glowColor?: string;
  effects?: string[];
  textPosition?: TextPosition;
  referenceImageSrc?: string;
}

export type TextPosition = 'random' | 'top' | 'center' | 'bottom';

export interface TextOverlayOptions {
  fontSize: number;
  fontFamily: string;
  textColor: string;
  glowColor: string;
  textPosition: TextPosition;
  effects: string[];
}

export interface TextOverlayResponse {
  success: boolean;
  videoUrl?: string;
  rendered?: boolean;
  textCount?: number;
  engine?: string;
  error?: string;
}
