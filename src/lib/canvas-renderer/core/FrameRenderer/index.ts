/**
 * FrameRenderer - Main Orchestrator
 * 단일 프레임을 렌더링하는 역할
 */

import type {
  RenderConfig,
  TextScene,
  EffectResult,
  EffectContext,
  TextPosition,
} from '../../types';
import { CanvasTextRenderer } from '../CanvasTextRenderer';
import { calculateEffects, isLetterEffect } from '../../effects';
import { random, interpolate, Easing } from '../../utils/mathUtils';
import {
  SCENE_DURATION_SECONDS,
  ENTRANCE_DURATION_SECONDS,
  EXIT_DURATION_SECONDS,
  POSITION_TOP,
  POSITION_CENTER,
  POSITION_BOTTOM,
} from '../../constants/defaults';

// Separated modules
import { DEBUG } from './constants';
import { resolveUrl } from './utils/urlResolver';
import { calculatePositionY } from './utils/positionCalculator';
import { checkBufferHealth, waitForBufferRecovery } from './utils/bufferHealthChecker';
import { loadVideo } from './loaders/VideoLoader';
import { loadReferenceImage } from './loaders/ReferenceImageLoader';
import { renderVideoFrame, renderDarkOverlay } from './renderers/VideoFrameRenderer';
import { renderReferenceImage } from './renderers/ReferenceImageRenderer';
import { renderTextScene } from './renderers/TextSceneRenderer';
import { renderCinematicOverlays } from './renderers/OverlayRenderer';
import {
  renderWithVideoFrameCallback,
  type SequentialRenderContext,
} from './strategies/SequentialRenderer';
import {
  renderWithAnimationFrame,
  type AnimationFrameRenderContext,
} from './strategies/AnimationFrameRenderer';

/**
 * FrameRenderer 클래스
 */
export class FrameRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private textRenderer: CanvasTextRenderer;
  private config: RenderConfig;
  private textScenes: TextScene[];

  // 배경 비디오 관련
  private videoElement: HTMLVideoElement | null = null;
  private videoReady: boolean = false;

  // 참조 이미지 관련
  private referenceImage: HTMLImageElement | null = null;

  constructor(config: RenderConfig) {
    this.config = config;

    // 캔버스 생성
    this.canvas = document.createElement('canvas');
    this.canvas.width = config.renderer.width;
    this.canvas.height = config.renderer.height;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })!;

    // 텍스트 렌더러 초기화
    this.textRenderer = new CanvasTextRenderer(
      this.ctx,
      config.renderer.width,
      config.renderer.height
    );

    // 텍스트 씬 생성
    this.textScenes = this.createTextScenes();
  }

  /**
   * 텍스트 씬 생성
   */
  private createTextScenes(): TextScene[] {
    const { fps } = this.config.renderer;
    const sceneDuration = SCENE_DURATION_SECONDS * fps;

    return this.config.texts.map((text, index) => ({
      text,
      startFrame: index * sceneDuration,
      endFrame: (index + 1) * sceneDuration,
      seed: random(index * 123),
      position: this.config.textPosition,
    }));
  }

  /**
   * 비디오 로드
   */
  async loadVideo(videoSrc: string): Promise<void> {
    this.videoElement = await loadVideo(videoSrc);
    this.videoReady = true;
  }

  /**
   * 참조 이미지 로드
   */
  async loadReferenceImage(imageSrc: string): Promise<void> {
    this.referenceImage = await loadReferenceImage(imageSrc);
  }

  /**
   * 리소스 로드
   */
  async loadResources(): Promise<void> {
    const promises: Promise<void>[] = [];

    if (this.config.videoSrc) {
      promises.push(this.loadVideo(this.config.videoSrc));
    }

    if (this.config.referenceImageSrc) {
      promises.push(this.loadReferenceImage(this.config.referenceImageSrc));
    }

    await Promise.all(promises);
  }

  /**
   * 단일 프레임 렌더링
   */
  async renderFrame(frameNumber: number): Promise<ImageData> {
    const { width, height, backgroundColor } = this.config.renderer;
    const ctx = this.ctx;

    // 1. 배경 클리어
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // 2. 배경 비디오 렌더링
    if (this.videoElement && this.videoReady) {
      await renderVideoFrame(this.videoElement, frameNumber, this.config, this.ctx);
    }

    // 3. 다크 오버레이 (시네마틱)
    renderDarkOverlay(this.ctx, this.config.renderer.width, this.config.renderer.height);

    // 4. 참조 이미지 렌더링
    if (this.referenceImage) {
      renderReferenceImage(this.referenceImage, this.ctx, this.config.renderer.width, this.config.renderer.height);
    }

    // 5. 현재 프레임에 해당하는 텍스트 씬 찾기
    const currentScene = this.textScenes.find(
      scene => frameNumber >= scene.startFrame && frameNumber < scene.endFrame
    );

    // 6. 텍스트 렌더링
    if (currentScene) {
      renderTextScene(currentScene, frameNumber, this.config, this.textRenderer);
    }

    // 7. 시네마틱 오버레이 제거 (성능 저하 및 불필요한 효과)
    // renderCinematicOverlays(this.ctx, this.config.renderer.width, this.config.renderer.height);

    // 8. ImageData 반환
    return ctx.getImageData(0, 0, width, height);
  }

  /**
   * 캔버스 엘리먼트 반환
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * 총 프레임 수 반환
   */
  getTotalFrames(): number {
    return this.config.renderer.duration * this.config.renderer.fps;
  }

  /**
   * 모든 프레임을 순차 재생으로 렌더링 (Seek 최적화)
   * @returns AsyncGenerator로 프레임 스트리밍
   */
  async *renderAllFramesSequential(
    onProgress?: (current: number, total: number) => void
  ): AsyncGenerator<ImageData, void, unknown> {
    if (!this.videoElement || !this.videoReady) {
      throw new Error('Video not loaded');
    }

    const totalFrames = this.getTotalFrames();

    // 비디오를 처음부터 재생 (0.3배속으로 천천히 재생하여 프레임 처리 시간 확보)
    this.videoElement.currentTime = 0;
    this.videoElement.playbackRate = 0.3;

    // requestVideoFrameCallback 지원 확인
    const supportsVideoFrameCallback = 'requestVideoFrameCallback' in HTMLVideoElement.prototype;

    // 렌더 컨텍스트 생성
    const renderContext = {
      videoElement: this.videoElement,
      fps: this.config.renderer.fps,
      renderFrame: (frameNumber: number) => this.renderFrameWithoutVideoSeek(frameNumber),
    };

    if (supportsVideoFrameCallback) {
      // Native API 사용 (정확함)
      yield* renderWithVideoFrameCallback(renderContext as SequentialRenderContext, totalFrames, onProgress);
    } else {
      // Fallback: requestAnimationFrame
      yield* renderWithAnimationFrame(renderContext as AnimationFrameRenderContext, totalFrames, onProgress);
    }
  }

  /**
   * Video Seek 없이 프레임 렌더링
   */
  private renderFrameWithoutVideoSeek(frameNumber: number): ImageData {
    const { width, height, backgroundColor } = this.config.renderer;
    const ctx = this.ctx;

    // 1. 배경 클리어
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // 2. 비디오 프레임 그리기 (이미 올바른 시간에 있음)
    if (this.videoElement && this.videoReady) {
      ctx.drawImage(this.videoElement, 0, 0, width, height);
    }

    // 3. 다크 오버레이
    renderDarkOverlay(ctx, width, height);

    // 4. 참조 이미지
    if (this.referenceImage) {
      renderReferenceImage(this.referenceImage, ctx, width, height);
    }

    // 5. 텍스트 렌더링
    const currentScene = this.textScenes.find(
      scene => frameNumber >= scene.startFrame && frameNumber < scene.endFrame
    );

    if (currentScene) {
      renderTextScene(currentScene, frameNumber, this.config, this.textRenderer);
    }

    // 6. ImageData 반환
    return ctx.getImageData(0, 0, width, height);
  }

  /**
   * 리소스 정리
   */
  dispose(): void {
    if (this.videoElement) {
      // blob URL이면 해제
      if (this.videoElement.src.startsWith('blob:')) {
        URL.revokeObjectURL(this.videoElement.src);
      }
      this.videoElement.src = '';
      this.videoElement = null;
    }
    if (this.referenceImage) {
      // blob URL이면 해제
      if (this.referenceImage.src.startsWith('blob:')) {
        URL.revokeObjectURL(this.referenceImage.src);
      }
      this.referenceImage = null;
    }
    this.videoReady = false;
  }
}

export default FrameRenderer;

// Type re-exports for backward compatibility
export type {
  RenderConfig,
  TextScene,
  EffectResult,
  EffectContext,
  TextPosition,
} from '../../types';
