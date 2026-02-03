/**
 * MP4 Muxer
 * EncodedVideoChunk를 MP4 컨테이너로 패키징
 * mp4-muxer 라이브러리 사용
 */

import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import type { EncoderConfig, EncodingProgressCallback } from './types';

/**
 * MP4 Muxer 클래스
 */
export class MP4MuxerWrapper {
  private config: EncoderConfig;
  private muxer: Muxer<ArrayBufferTarget> | null = null;
  private target: ArrayBufferTarget | null = null;

  constructor(config: EncoderConfig) {
    this.config = config;
  }

  /**
   * Muxer 초기화
   */
  initialize(): void {
    this.target = new ArrayBufferTarget();

    this.muxer = new Muxer({
      target: this.target,
      video: {
        codec: 'avc',
        width: this.config.width,
        height: this.config.height,
      },
      fastStart: 'in-memory', // 빠른 시작을 위해 메모리에 저장
    });
  }

  /**
   * 인코딩된 청크 추가
   */
  addVideoChunk(chunk: EncodedVideoChunk, metadata?: EncodedVideoChunkMetadata): void {
    if (!this.muxer) {
      throw new Error('Muxer not initialized');
    }

    this.muxer.addVideoChunk(chunk, metadata);
  }

  /**
   * 여러 청크 추가
   */
  addVideoChunks(
    chunks: EncodedVideoChunk[],
    metadata?: (EncodedVideoChunkMetadata | undefined)[],
    onProgress?: EncodingProgressCallback
  ): void {
    for (let i = 0; i < chunks.length; i++) {
      this.addVideoChunk(chunks[i], metadata?.[i]);

      if (onProgress) {
        onProgress({
          phase: 'muxing',
          currentFrame: i + 1,
          totalFrames: chunks.length,
          percentage: Math.round(((i + 1) / chunks.length) * 100),
        });
      }
    }
  }

  /**
   * MP4 파일 완료 및 Blob 반환
   */
  finalize(): Blob {
    if (!this.muxer || !this.target) {
      throw new Error('Muxer not initialized');
    }

    this.muxer.finalize();

    const buffer = this.target.buffer;
    return new Blob([buffer], { type: 'video/mp4' });
  }

  /**
   * 리소스 정리
   */
  dispose(): void {
    this.muxer = null;
    this.target = null;
  }
}

/**
 * ImageData 배열을 MP4 Blob으로 변환 (통합 함수)
 */
export async function createMP4FromFrames(
  frames: ImageData[],
  config: EncoderConfig,
  onProgress?: EncodingProgressCallback
): Promise<Blob> {
  const { WebCodecsEncoder } = await import('./WebCodecsEncoder');

  // 1. 인코더 초기화
  const encoder = new WebCodecsEncoder(config);
  const initialized = await encoder.initialize();

  if (!initialized) {
    throw new Error('Failed to initialize encoder');
  }

  // 2. 프레임 인코딩
  if (onProgress) {
    onProgress({
      phase: 'initializing',
      currentFrame: 0,
      totalFrames: frames.length,
      percentage: 0,
    });
  }

  const { chunks, metadata } = await encoder.encodeFrames(frames, onProgress);

  // 3. MP4 Muxing
  const muxer = new MP4MuxerWrapper(config);
  muxer.initialize();
  muxer.addVideoChunks(chunks, metadata, onProgress);

  // 4. 완료
  const blob = muxer.finalize();

  // 5. 정리
  await encoder.dispose();
  muxer.dispose();

  if (onProgress) {
    onProgress({
      phase: 'complete',
      currentFrame: frames.length,
      totalFrames: frames.length,
      percentage: 100,
    });
  }

  return blob;
}

/**
 * ImageData 스트림을 MP4 Blob으로 변환 (스트리밍 - 메모리 최적화)
 */
export async function createMP4FromFrameStream(
  frameGenerator: AsyncGenerator<ImageData, void, unknown>,
  totalFrames: number,
  config: EncoderConfig,
  onProgress?: EncodingProgressCallback
): Promise<Blob> {
  const { WebCodecsEncoder } = await import('./WebCodecsEncoder');

  // 1. 인코더 초기화
  const encoder = new WebCodecsEncoder(config);
  const initialized = await encoder.initialize();

  if (!initialized) {
    throw new Error('Failed to initialize encoder');
  }

  // 2. Muxer 초기화
  const muxer = new MP4MuxerWrapper(config);
  muxer.initialize();

  if (onProgress) {
    onProgress({
      phase: 'initializing',
      currentFrame: 0,
      totalFrames,
      percentage: 0,
    });
  }

  // 3. 프레임 스트리밍 인코딩 및 Muxing
  await encoder.encodeFrameStream(
    frameGenerator,
    totalFrames,
    onProgress,
    (chunk, metadata) => {
      // 인코딩된 청크를 즉시 muxer에 전달
      muxer.addVideoChunk(chunk, metadata);
    }
  );

  // 4. 완료
  const blob = muxer.finalize();

  // 5. 정리
  await encoder.dispose();
  muxer.dispose();

  if (onProgress) {
    onProgress({
      phase: 'complete',
      currentFrame: totalFrames,
      totalFrames,
      percentage: 100,
    });
  }

  return blob;
}

export default MP4MuxerWrapper;
