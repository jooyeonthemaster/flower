/**
 * Video Encoder 타입 정의
 */

// 인코더 설정
export interface EncoderConfig {
  width: number;
  height: number;
  fps: number;
  bitrate: number; // bps
  codec: 'avc1' | 'vp9' | 'av1'; // H.264, VP9, AV1
}

// 인코딩 진행 상황
export interface EncodingProgress {
  phase: 'initializing' | 'encoding' | 'muxing' | 'complete' | 'error';
  currentFrame: number;
  totalFrames: number;
  percentage: number;
  error?: string;
}

// 인코딩 진행 콜백
export type EncodingProgressCallback = (progress: EncodingProgress) => void;

// 인코딩 결과
export interface EncodingResult {
  success: boolean;
  blob?: Blob;
  error?: string;
  duration?: number; // ms
}

// WebCodecs 지원 여부
export interface WebCodecsSupport {
  supported: boolean;
  videoEncoder: boolean;
  videoFrame: boolean;
}
