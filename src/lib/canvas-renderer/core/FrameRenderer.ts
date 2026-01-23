/**
 * 프레임 렌더러
 * 단일 프레임을 렌더링하는 역할
 */

import type {
  RenderConfig,
  TextScene,
  EffectResult,
  EffectContext,
  TextPosition,
} from '../types';
import { CanvasTextRenderer } from './CanvasTextRenderer';
import { calculateEffects, isLetterEffect } from '../effects';
import { random, interpolate, Easing } from '../utils/mathUtils';
import {
  SCENE_DURATION_SECONDS,
  ENTRANCE_DURATION_SECONDS,
  EXIT_DURATION_SECONDS,
  POSITION_TOP,
  POSITION_CENTER,
  POSITION_BOTTOM,
} from '../constants/defaults';
import { loadVideoElement, loadImageElement } from './utils/resourceLoader';
import {
  renderDarkOverlay,
  renderReferenceImage,
  renderCinematicOverlays,
} from './utils/overlayRenderer';

export class FrameRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private textRenderer: CanvasTextRenderer;
  private config: RenderConfig;
  private textScenes: TextScene[];

  private videoElement: HTMLVideoElement | null = null;
  private videoReady: boolean = false;
  private referenceImage: HTMLImageElement | null = null;

  constructor(config: RenderConfig) {
    this.config = config;

    this.canvas = document.createElement('canvas');
    this.canvas.width = config.renderer.width;
    this.canvas.height = config.renderer.height;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })!;

    this.textRenderer = new CanvasTextRenderer(
      this.ctx,
      config.renderer.width,
      config.renderer.height
    );

    this.textScenes = this.createTextScenes();
  }

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

  async loadVideo(videoSrc: string): Promise<void> {
    this.videoElement = await loadVideoElement(videoSrc);
    this.videoReady = true;
  }

  async loadReferenceImage(imageSrc: string): Promise<void> {
    this.referenceImage = await loadImageElement(imageSrc);
  }

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

  async renderFrame(frameNumber: number): Promise<ImageData> {
    const { width, height, backgroundColor } = this.config.renderer;
    const ctx = this.ctx;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    if (this.videoElement && this.videoReady) {
      await this.renderVideoFrame(frameNumber);
    }

    renderDarkOverlay(ctx, { width, height });

    if (this.referenceImage) {
      renderReferenceImage(ctx, { width, height }, this.referenceImage);
    }

    const currentScene = this.textScenes.find(
      scene => frameNumber >= scene.startFrame && frameNumber < scene.endFrame
    );

    if (currentScene) {
      this.renderTextScene(currentScene, frameNumber);
    }

    renderCinematicOverlays(ctx, { width, height });

    return ctx.getImageData(0, 0, width, height);
  }

  private async renderVideoFrame(frameNumber: number): Promise<void> {
    if (!this.videoElement) return;

    const { fps } = this.config.renderer;
    const targetTime = frameNumber / fps;

    this.videoElement.currentTime = targetTime % this.videoElement.duration;

    await new Promise<void>(resolve => {
      const onSeeked = () => {
        this.videoElement!.removeEventListener('seeked', onSeeked);
        resolve();
      };
      this.videoElement!.addEventListener('seeked', onSeeked);
    });

    this.ctx.drawImage(
      this.videoElement,
      0, 0,
      this.config.renderer.width,
      this.config.renderer.height
    );
  }

  private renderTextScene(scene: TextScene, frameNumber: number): void {
    const { fps } = this.config.renderer;
    const localFrame = frameNumber - scene.startFrame;
    const sceneDuration = SCENE_DURATION_SECONDS * fps;

    const entranceFrames = ENTRANCE_DURATION_SECONDS * fps;
    const exitFrames = EXIT_DURATION_SECONDS * fps;

    const opacity = interpolate(
      localFrame,
      [0, entranceFrames, sceneDuration - exitFrames, sceneDuration],
      [0, 1, 1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const scaleProgress = Math.min(localFrame / entranceFrames, 1);
    const entranceScale = Easing.elastic(1)(scaleProgress);

    const hasLetterEffect = this.config.effects.some(e => isLetterEffect(e));
    const displayText = scene.text;
    const totalChars = displayText.length;

    const positionY = this.calculatePositionY(scene.position, scene.seed);

    if (hasLetterEffect && totalChars > 0) {
      this.renderWithLetterEffects(scene, frameNumber, localFrame, fps, opacity, entranceScale, positionY);
    } else {
      this.renderWithoutLetterEffects(scene, frameNumber, localFrame, fps, opacity, entranceScale, positionY);
    }
  }

  private renderWithLetterEffects(
    scene: TextScene,
    frameNumber: number,
    localFrame: number,
    fps: number,
    opacity: number,
    entranceScale: number,
    positionY: number
  ): void {
    const displayText = scene.text;
    const totalChars = displayText.length;
    const charEffects: EffectResult[] = [];

    for (let i = 0; i < totalChars; i++) {
      const effectContext: EffectContext = {
        frame: frameNumber,
        localFrame,
        fps,
        seed: scene.seed,
        width: this.config.renderer.width,
        height: this.config.renderer.height,
        text: scene.text,
        glowColor: this.config.textStyle.glowColor,
        charIndex: i,
        totalChars,
      };

      const charEffect = calculateEffects(this.config.effects, effectContext);

      charEffects.push({
        ...charEffect,
        translateY: charEffect.translateY,
        opacity: charEffect.opacity * opacity,
        scale: charEffect.scale * entranceScale,
      });
    }

    const baseContext: EffectContext = {
      frame: frameNumber,
      localFrame,
      fps,
      seed: scene.seed,
      width: this.config.renderer.width,
      height: this.config.renderer.height,
      text: scene.text,
      glowColor: this.config.textStyle.glowColor,
    };

    const nonLetterEffects = this.config.effects.filter(e => !isLetterEffect(e));
    const baseEffects = calculateEffects(nonLetterEffects, baseContext);

    const finalBaseEffects: EffectResult = {
      ...baseEffects,
      translateY: baseEffects.translateY + positionY,
      opacity: baseEffects.opacity * opacity,
      scale: baseEffects.scale * entranceScale,
    };

    this.textRenderer.renderText(
      displayText,
      this.config.textStyle,
      finalBaseEffects,
      'perChar',
      charEffects
    );
  }

  private renderWithoutLetterEffects(
    scene: TextScene,
    frameNumber: number,
    localFrame: number,
    fps: number,
    opacity: number,
    entranceScale: number,
    positionY: number
  ): void {
    const effectContext: EffectContext = {
      frame: frameNumber,
      localFrame,
      fps,
      seed: scene.seed,
      width: this.config.renderer.width,
      height: this.config.renderer.height,
      text: scene.text,
      glowColor: this.config.textStyle.glowColor,
    };

    const effects = calculateEffects(this.config.effects, effectContext);

    const finalEffects: EffectResult = {
      ...effects,
      translateY: effects.translateY + positionY,
      opacity: effects.opacity * opacity,
      scale: effects.scale * entranceScale,
    };

    const finalDisplayText = effects.displayText || scene.text;
    this.textRenderer.renderText(
      finalDisplayText,
      this.config.textStyle,
      finalEffects,
      this.config.charEffectMode
    );
  }

  private calculatePositionY(position: TextPosition, seed: number): number {
    const { height } = this.config.renderer;

    if (position === 'random') {
      const randVal = seed % 1;
      if (randVal < 0.33) return height * (POSITION_TOP - 0.5);
      if (randVal < 0.66) return height * (POSITION_CENTER - 0.5);
      return height * (POSITION_BOTTOM - 0.5);
    }

    switch (position) {
      case 'top': return height * (POSITION_TOP - 0.5);
      case 'center': return height * (POSITION_CENTER - 0.5);
      case 'bottom': return height * (POSITION_BOTTOM - 0.5);
      default: return height * (POSITION_BOTTOM - 0.5);
    }
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  getTotalFrames(): number {
    return this.config.renderer.duration * this.config.renderer.fps;
  }

  dispose(): void {
    if (this.videoElement) {
      if (this.videoElement.src.startsWith('blob:')) {
        URL.revokeObjectURL(this.videoElement.src);
      }
      this.videoElement.src = '';
      this.videoElement = null;
    }
    if (this.referenceImage) {
      if (this.referenceImage.src.startsWith('blob:')) {
        URL.revokeObjectURL(this.referenceImage.src);
      }
      this.referenceImage = null;
    }
    this.videoReady = false;
  }
}

export default FrameRenderer;
