/**
 * 비디오 컴포지터
 * 전체 비디오 렌더링 관리 및 미리보기 제공
 */

import type { RenderConfig, ExportProgress, ExportProgressCallback } from '../types';
import { FrameRenderer } from './FrameRenderer';

export class VideoCompositor {
  private config: RenderConfig;
  private frameRenderer: FrameRenderer;
  private isRendering: boolean = false;
  private animationFrameId: number | null = null;

  constructor(config: RenderConfig) {
    this.config = config;
    this.frameRenderer = new FrameRenderer(config);
  }

  /**
   * 리소스 초기화
   */
  async initialize(): Promise<void> {
    await this.frameRenderer.loadResources();
  }

  /**
   * 미리보기 시작 (실시간 재생)
   */
  startPreview(
    targetCanvas: HTMLCanvasElement,
    onFrameChange?: (frame: number) => void
  ): void {
    if (this.isRendering) return;

    const ctx = targetCanvas.getContext('2d')!;
    const { fps } = this.config.renderer;
    const totalFrames = this.frameRenderer.getTotalFrames();

    let currentFrame = 0;
    let lastTime = performance.now();
    const frameDuration = 1000 / fps;

    this.isRendering = true;

    const render = async () => {
      if (!this.isRendering) return;

      const now = performance.now();
      const elapsed = now - lastTime;

      if (elapsed >= frameDuration) {
        // 프레임 렌더링
        const imageData = await this.frameRenderer.renderFrame(currentFrame);

        // 타겟 캔버스에 복사
        ctx.putImageData(imageData, 0, 0);

        // 프레임 콜백
        if (onFrameChange) {
          onFrameChange(currentFrame);
        }

        // 다음 프레임
        currentFrame = (currentFrame + 1) % totalFrames;
        lastTime = now - (elapsed % frameDuration);
      }

      this.animationFrameId = requestAnimationFrame(render);
    };

    render();
  }

  /**
   * 미리보기 중지
   */
  stopPreview(): void {
    this.isRendering = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * 특정 프레임 렌더링 (스크러빙용)
   */
  async renderSingleFrame(
    targetCanvas: HTMLCanvasElement,
    frameNumber: number
  ): Promise<void> {
    const ctx = targetCanvas.getContext('2d')!;
    const imageData = await this.frameRenderer.renderFrame(frameNumber);
    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * 모든 프레임 렌더링 (내보내기용)
   */
  async renderAllFrames(
    onProgress?: ExportProgressCallback
  ): Promise<ImageData[]> {
    const totalFrames = this.frameRenderer.getTotalFrames();
    const frames: ImageData[] = [];

    for (let i = 0; i < totalFrames; i++) {
      const imageData = await this.frameRenderer.renderFrame(i);
      frames.push(imageData);

      if (onProgress) {
        onProgress({
          phase: 'rendering',
          current: i + 1,
          total: totalFrames,
          percentage: Math.round(((i + 1) / totalFrames) * 100),
        });
      }
    }

    return frames;
  }

  /**
   * 모든 프레임 렌더링 (최적화 버전 - Seek 제거)
   * Streaming 방식으로 메모리 효율적
   */
  async *renderAllFramesOptimized(
    onProgress?: ExportProgressCallback
  ): AsyncGenerator<ImageData, void, unknown> {
    const totalFrames = this.frameRenderer.getTotalFrames();

    // Sequential rendering으로 seek 제거
    for await (const imageData of this.frameRenderer.renderAllFramesSequential(
      (current, total) => {
        if (onProgress) {
          onProgress({
            phase: 'rendering',
            current,
            total,
            percentage: Math.round((current / total) * 100),
          });
        }
      }
    )) {
      yield imageData;
    }
  }

  /**
   * 설정 업데이트
   */
  updateConfig(newConfig: Partial<RenderConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.frameRenderer = new FrameRenderer(this.config);
  }

  /**
   * 캔버스 반환
   */
  getCanvas(): HTMLCanvasElement {
    return this.frameRenderer.getCanvas();
  }

  /**
   * 총 프레임 수 반환
   */
  getTotalFrames(): number {
    return this.frameRenderer.getTotalFrames();
  }

  /**
   * 영상 길이 (초) 반환
   */
  getDuration(): number {
    return this.config.renderer.duration;
  }

  /**
   * FPS 반환
   */
  getFPS(): number {
    return this.config.renderer.fps;
  }

  /**
   * 리소스 정리
   */
  dispose(): void {
    this.stopPreview();
    this.frameRenderer.dispose();
  }
}

export default VideoCompositor;
