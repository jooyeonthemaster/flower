/**
 * WebCodecs 기반 비디오 인코더
 * ImageData를 H.264로 인코딩
 */

import type {
  EncoderConfig,
  EncodingProgress,
  EncodingProgressCallback,
  EncodingResult,
  WebCodecsSupport,
} from './types';

// 기본 설정
const DEFAULT_CONFIG: EncoderConfig = {
  width: 720,
  height: 720,
  fps: 30,
  bitrate: 5_000_000, // 5 Mbps
  codec: 'avc1',
};

/**
 * WebCodecs 지원 여부 확인
 */
export function checkWebCodecsSupport(): WebCodecsSupport {
  const hasVideoEncoder = typeof VideoEncoder !== 'undefined';
  const hasVideoFrame = typeof VideoFrame !== 'undefined';

  return {
    supported: hasVideoEncoder && hasVideoFrame,
    videoEncoder: hasVideoEncoder,
    videoFrame: hasVideoFrame,
  };
}

/**
 * WebCodecs 기반 비디오 인코더
 */
export class WebCodecsEncoder {
  private config: EncoderConfig;
  private encoder: VideoEncoder | null = null;
  private encodedChunks: EncodedVideoChunk[] = [];
  private encodedMetadata: (EncodedVideoChunkMetadata | undefined)[] = [];
  private isEncoding: boolean = false;
  private frameCount: number = 0;
  private onProgress?: EncodingProgressCallback;

  constructor(config: Partial<EncoderConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * 인코더 초기화
   */
  async initialize(): Promise<boolean> {
    const support = checkWebCodecsSupport();
    if (!support.supported) {
      console.error('WebCodecs not supported in this browser');
      return false;
    }

    // 코덱 지원 확인
    const codecString = this.getCodecString();
    const isSupported = await VideoEncoder.isConfigSupported({
      codec: codecString,
      width: this.config.width,
      height: this.config.height,
      bitrate: this.config.bitrate,
      framerate: this.config.fps,
    });

    if (!isSupported.supported) {
      console.error('Codec not supported:', codecString);
      return false;
    }

    // 인코더 생성
    this.encoder = new VideoEncoder({
      output: (chunk, metadata) => this.handleEncodedChunk(chunk, metadata),
      error: (error) => this.handleError(error),
    });

    // 인코더 설정
    this.encoder.configure({
      codec: codecString,
      width: this.config.width,
      height: this.config.height,
      bitrate: this.config.bitrate,
      framerate: this.config.fps,
      latencyMode: 'quality', // 품질 우선
      avc: this.config.codec === 'avc1' ? { format: 'avc' } : undefined,
    });

    this.encodedChunks = [];
    this.encodedMetadata = [];
    this.frameCount = 0;
    this.isEncoding = true;

    return true;
  }

  /**
   * 코덱 문자열 반환
   */
  private getCodecString(): string {
    switch (this.config.codec) {
      case 'avc1':
        // H.264 Main Profile Level 4.0 (1080p 지원)
        return 'avc1.4d0028';
      case 'vp9':
        return 'vp09.00.10.08';
      case 'av1':
        return 'av01.0.04M.08';
      default:
        return 'avc1.4d0028';
    }
  }

  /**
   * 인코딩된 청크 처리
   */
  private handleEncodedChunk(chunk: EncodedVideoChunk, metadata?: EncodedVideoChunkMetadata): void {
    this.encodedChunks.push(chunk);
    this.encodedMetadata.push(metadata);
  }

  /**
   * 에러 처리
   */
  private handleError(error: DOMException): void {
    console.error('Encoder error:', error);
    this.isEncoding = false;
  }

  /**
   * ImageData를 프레임으로 인코딩
   */
  async encodeFrame(imageData: ImageData, frameNumber: number): Promise<void> {
    if (!this.encoder || !this.isEncoding) {
      throw new Error('Encoder not initialized');
    }

    // ImageData를 ImageBitmap으로 변환
    const bitmap = await createImageBitmap(imageData);

    // VideoFrame 생성
    const timestamp = (frameNumber * 1_000_000) / this.config.fps; // 마이크로초
    const frame = new VideoFrame(bitmap, {
      timestamp,
      duration: 1_000_000 / this.config.fps,
    });

    // 인코딩
    const keyFrame = frameNumber % (this.config.fps * 2) === 0; // 2초마다 키프레임
    this.encoder.encode(frame, { keyFrame });

    // 리소스 정리
    frame.close();
    bitmap.close();

    this.frameCount++;

    // 진행 상황 콜백
    if (this.onProgress) {
      this.onProgress({
        phase: 'encoding',
        currentFrame: frameNumber,
        totalFrames: 0, // 외부에서 설정
        percentage: 0,
      });
    }
  }

  /**
   * 여러 프레임 인코딩
   */
  async encodeFrames(
    frames: ImageData[],
    onProgress?: EncodingProgressCallback
  ): Promise<{ chunks: EncodedVideoChunk[]; metadata: (EncodedVideoChunkMetadata | undefined)[] }> {
    this.onProgress = onProgress;

    for (let i = 0; i < frames.length; i++) {
      await this.encodeFrame(frames[i], i);

      if (onProgress) {
        onProgress({
          phase: 'encoding',
          currentFrame: i + 1,
          totalFrames: frames.length,
          percentage: Math.round(((i + 1) / frames.length) * 100),
        });
      }
    }

    // 인코딩 완료 대기
    await this.encoder?.flush();

    return { chunks: this.encodedChunks, metadata: this.encodedMetadata };
  }

  /**
   * 인코딩된 청크 반환
   */
  getEncodedChunks(): EncodedVideoChunk[] {
    return this.encodedChunks;
  }

  /**
   * 인코딩된 데이터(청크 + 메타데이터) 반환
   */
  getEncodedData(): { chunks: EncodedVideoChunk[]; metadata: (EncodedVideoChunkMetadata | undefined)[] } {
    return { chunks: this.encodedChunks, metadata: this.encodedMetadata };
  }

  /**
   * 설정 반환
   */
  getConfig(): EncoderConfig {
    return this.config;
  }

  /**
   * 리소스 정리
   */
  async dispose(): Promise<void> {
    if (this.encoder) {
      if (this.encoder.state !== 'closed') {
        await this.encoder.flush();
        this.encoder.close();
      }
      this.encoder = null;
    }
    this.encodedChunks = [];
    this.encodedMetadata = [];
    this.isEncoding = false;
  }
}

export default WebCodecsEncoder;
