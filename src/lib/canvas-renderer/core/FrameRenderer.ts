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

// 디버깅용 로그 (문제 해결 후 제거 예정)
const DEBUG = true;

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
   * 상대 경로를 절대 URL로 변환
   */
  private resolveUrl(src: string): string {
    // 이미 절대 URL이면 그대로 반환
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('blob:')) {
      return src;
    }
    // 상대 경로면 현재 origin 추가
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    // /로 시작하지 않으면 / 추가
    const path = src.startsWith('/') ? src : `/${src}`;
    return `${base}${path}`;
  }

  /**
   * 비디오 로드 (fetch + blob 방식으로 안정적 로드)
   */
  async loadVideo(videoSrc: string): Promise<void> {
    const resolvedUrl = this.resolveUrl(videoSrc);

    if (DEBUG) {
      console.log('[FrameRenderer] loadVideo 시작:', {
        videoSrc,
        resolvedUrl,
      });
    }

    try {
      // fetch로 비디오 데이터 가져오기
      const response = await fetch(resolvedUrl);

      if (DEBUG) {
        console.log('[FrameRenderer] fetch 응답:', {
          status: response.status,
          statusText: response.statusText,
          contentType: response.headers.get('content-type'),
          contentLength: response.headers.get('content-length'),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      if (DEBUG) {
        console.log('[FrameRenderer] blob 생성 완료:', {
          blobSize: blob.size,
          blobType: blob.type,
          blobUrl,
        });
      }

      return new Promise((resolve, reject) => {
        this.videoElement = document.createElement('video');
        this.videoElement.muted = true;
        this.videoElement.playsInline = true;
        this.videoElement.preload = 'auto';

        // HAVE_ENOUGH_DATA (readyState >= 4) + buffered 95% 대기 - 완전 로드 보장
        const waitForFullyLoaded = () => {
          return new Promise<void>((resolveReady) => {
            const check = () => {
              const video = this.videoElement!;

              // readyState 4 (HAVE_ENOUGH_DATA) 확인
              if (video.readyState < 4) {
                return; // 아직 부족
              }

              // buffered 범위 확인 (전체 duration 커버 여부)
              if (video.buffered.length > 0) {
                const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                const duration = video.duration;

                // 전체 비디오의 95% 이상 버퍼링되면 OK
                if (bufferedEnd >= duration * 0.95) {
                  video.removeEventListener('canplaythrough', check);
                  video.removeEventListener('progress', check);
                  resolveReady();
                }
              }
            };

            // 즉시 체크
            check();

            // 이벤트 리스너 등록
            this.videoElement!.addEventListener('canplaythrough', check);
            this.videoElement!.addEventListener('progress', check);
          });
        };

        const timeout = setTimeout(() => {
          reject(new Error(`Video load timeout: ${videoSrc}`));
        }, 30000);

        Promise.race([
          waitForFullyLoaded(),
          new Promise<void>((_, rejectTimeout) =>
            setTimeout(() => rejectTimeout(new Error('Video full load timeout (readyState 4 + buffered 95%)')), 30000)
          )
        ]).then(() => {
          clearTimeout(timeout);
          this.videoReady = true;

          if (DEBUG) {
            console.log('[FrameRenderer] Video fully loaded:', {
              readyState: this.videoElement!.readyState,
              bufferedEnd: this.videoElement!.buffered.length > 0
                ? this.videoElement!.buffered.end(0).toFixed(3)
                : '0',
              duration: this.videoElement!.duration.toFixed(3),
            });
          }

          resolve();
        }).catch((error) => {
          clearTimeout(timeout);
          reject(error);
        });

        this.videoElement.onerror = () => {
          clearTimeout(timeout);
          URL.revokeObjectURL(blobUrl);

          const mediaError = this.videoElement?.error;
          const errorInfo = {
            code: mediaError?.code,
            message: mediaError?.message,
            codeDescription: mediaError?.code === 1 ? 'MEDIA_ERR_ABORTED' :
              mediaError?.code === 2 ? 'MEDIA_ERR_NETWORK' :
                mediaError?.code === 3 ? 'MEDIA_ERR_DECODE' :
                  mediaError?.code === 4 ? 'MEDIA_ERR_SRC_NOT_SUPPORTED' :
                    'UNKNOWN',
            videoSrc,
            readyState: this.videoElement?.readyState,
            networkState: this.videoElement?.networkState,
          };

          console.error('Video element error:', errorInfo);
          reject(new Error(`Failed to load video element: ${videoSrc} (${errorInfo.codeDescription}: ${mediaError?.message || 'Unknown error'})`));
        };

        this.videoElement.src = blobUrl;
        this.videoElement.load();
      });
    } catch (error) {
      console.error('Video fetch error:', error, resolvedUrl);
      throw new Error(`Failed to fetch video: ${videoSrc} (${error})`);
    }
  }

  /**
   * 참조 이미지 로드 (fetch + blob 방식으로 안정적 로드)
   */
  async loadReferenceImage(imageSrc: string): Promise<void> {
    // Data URL인 경우 fetch 없이 직접 로드
    const isDataUrl = imageSrc.startsWith('data:');

    if (DEBUG) {
      console.log('[FrameRenderer] loadReferenceImage 시작:', {
        isDataUrl,
        srcLength: imageSrc.length,
        srcPreview: imageSrc.substring(0, 100),
      });
    }

    if (isDataUrl) {
      // Data URL은 직접 Image에 설정
      return new Promise((resolve, reject) => {
        this.referenceImage = new Image();

        const timeout = setTimeout(() => {
          reject(new Error(`Image load timeout (DataURL)`));
        }, 15000);

        this.referenceImage.onload = () => {
          clearTimeout(timeout);
          if (DEBUG) {
            console.log('[FrameRenderer] 참조 이미지 로드 성공 (DataURL):', {
              width: this.referenceImage?.width,
              height: this.referenceImage?.height,
            });
          }
          resolve();
        };

        this.referenceImage.onerror = (e) => {
          clearTimeout(timeout);
          console.error('[FrameRenderer] 참조 이미지 로드 실패 (DataURL):', e);
          reject(new Error(`Failed to load image from DataURL`));
        };

        this.referenceImage.src = imageSrc;
      });
    }

    const resolvedUrl = this.resolveUrl(imageSrc);

    try {
      // fetch로 이미지 데이터 가져오기
      const response = await fetch(resolvedUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      return new Promise((resolve, reject) => {
        this.referenceImage = new Image();

        const timeout = setTimeout(() => {
          reject(new Error(`Image load timeout: ${imageSrc}`));
        }, 15000); // 15초 타임아웃

        this.referenceImage.onload = () => {
          clearTimeout(timeout);
          if (DEBUG) {
            console.log('[FrameRenderer] 참조 이미지 로드 성공 (URL):', {
              width: this.referenceImage?.width,
              height: this.referenceImage?.height,
            });
          }
          resolve();
        };

        this.referenceImage.onerror = (e) => {
          clearTimeout(timeout);
          URL.revokeObjectURL(blobUrl);
          console.error('[FrameRenderer] 참조 이미지 로드 실패 (URL):', { imageSrc, error: e });
          reject(new Error(`Failed to load image element: ${imageSrc}`));
        };

        this.referenceImage.src = blobUrl;
      });
    } catch (error) {
      console.error('Image fetch error:', error, resolvedUrl);
      throw new Error(`Failed to fetch image: ${imageSrc} (${error})`);
    }
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
    const { width, height, fps, backgroundColor } = this.config.renderer;
    const ctx = this.ctx;

    // 1. 배경 클리어
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // 2. 배경 비디오 렌더링
    if (this.videoElement && this.videoReady) {
      await this.renderVideoFrame(frameNumber);
    }

    // 3. 다크 오버레이 (시네마틱)
    this.renderDarkOverlay();

    // 4. 참조 이미지 렌더링
    if (this.referenceImage) {
      this.renderReferenceImage();
    }

    // 5. 현재 프레임에 해당하는 텍스트 씬 찾기
    const currentScene = this.textScenes.find(
      scene => frameNumber >= scene.startFrame && frameNumber < scene.endFrame
    );

    // 6. 텍스트 렌더링
    if (currentScene) {
      this.renderTextScene(currentScene, frameNumber);
    }

    // 7. 시네마틱 오버레이 제거 (성능 저하 및 불필요한 효과)
    // this.renderCinematicOverlays();

    // 8. ImageData 반환
    return ctx.getImageData(0, 0, width, height);
  }

  /**
   * 비디오 프레임 렌더링
   */
  private async renderVideoFrame(frameNumber: number): Promise<void> {
    if (!this.videoElement) return;

    const { fps } = this.config.renderer;
    const targetTime = frameNumber / fps;

    // 비디오 시간 설정
    this.videoElement.currentTime = targetTime % this.videoElement.duration;

    // 시크 완료 대기
    await new Promise<void>(resolve => {
      const onSeeked = () => {
        this.videoElement!.removeEventListener('seeked', onSeeked);
        resolve();
      };
      this.videoElement!.addEventListener('seeked', onSeeked);
    });

    // 비디오 프레임 그리기
    this.ctx.drawImage(
      this.videoElement,
      0, 0,
      this.config.renderer.width,
      this.config.renderer.height
    );
  }

  /**
   * 다크 오버레이 렌더링
   */
  private renderDarkOverlay(): void {
    const { width, height } = this.config.renderer;
    const ctx = this.ctx;

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(0,0,0,0.4)');
    gradient.addColorStop(0.4, 'rgba(0,0,0,0.1)');
    gradient.addColorStop(0.6, 'rgba(0,0,0,0.1)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.4)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  /**
   * 참조 이미지 렌더링 (Screen 블렌딩)
   */
  private renderReferenceImage(): void {
    if (!this.referenceImage) return;

    const { width, height } = this.config.renderer;
    const ctx = this.ctx;

    // 이미지 크기 계산 (35% 너비)
    const imgWidth = width * 0.35;
    const imgHeight = (this.referenceImage.height / this.referenceImage.width) * imgWidth;

    // 위치 (상단 30%, 가운데) - PreviewCanvas.tsx와 동기화
    const x = (width - imgWidth) / 2;
    const y = height * 0.3 - imgHeight / 2;

    ctx.save();

    // 기본 블렌딩 (source-over)
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    // 그림자 효과
    ctx.shadowColor = 'rgba(255,255,255,0.5)';
    ctx.shadowBlur = 20;

    ctx.drawImage(this.referenceImage, x, y, imgWidth, imgHeight);

    ctx.restore();
  }

  /**
   * 텍스트 씬 렌더링
   */
  private renderTextScene(scene: TextScene, frameNumber: number): void {
    const { fps } = this.config.renderer;
    const localFrame = frameNumber - scene.startFrame;
    const sceneDuration = SCENE_DURATION_SECONDS * fps;

    // 진입/퇴장 애니메이션
    const entranceFrames = ENTRANCE_DURATION_SECONDS * fps;
    const exitFrames = EXIT_DURATION_SECONDS * fps;

    const opacity = interpolate(
      localFrame,
      [0, entranceFrames, sceneDuration - exitFrames, sceneDuration],
      [0, 1, 1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // 진입 스케일 (elastic bounce)
    const scaleProgress = Math.min(localFrame / entranceFrames, 1);
    const entranceScale = Easing.elastic(1)(scaleProgress);

    // 글자별 이펙트 감지
    const hasLetterEffect = this.config.effects.some(e => isLetterEffect(e));
    const displayText = scene.text;
    const totalChars = displayText.length;

    // 위치 계산
    const positionY = this.calculatePositionY(scene.position, scene.seed);

    if (hasLetterEffect && totalChars > 0) {
      // 글자별 이펙트 모드: 이펙트를 일반/글자별로 분리
      // letterEffect만 각 글자에 적용, 일반 이펙트는 전체 텍스트에 적용
      const letterEffectsOnly = this.config.effects.filter(e => isLetterEffect(e));
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

        // letterEffect만 적용 (일반 이펙트는 baseEffects에서 처리)
        const charEffect = calculateEffects(letterEffectsOnly, effectContext);

        charEffects.push({
          ...charEffect,
          translateY: charEffect.translateY,
          opacity: charEffect.opacity * opacity,
          scale: charEffect.scale * entranceScale,
        });
      }

      // 기본 이펙트 (전체 텍스트용)
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

      // 일반 이펙트만 전체 텍스트에 적용
      const generalEffects = this.config.effects.filter(e => !isLetterEffect(e));
      const baseEffects = calculateEffects(generalEffects, baseContext);

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
    } else {
      // 기존 방식: 전체 텍스트에 이펙트 적용
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
  }

  /**
   * Y 위치 계산
   */
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

  /**
   * 시네마틱 오버레이 렌더링
   */
  private renderCinematicOverlays(): void {
    const { width, height } = this.config.renderer;
    const ctx = this.ctx;

    // 1. 노이즈/그레인 (간소화)
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.globalCompositeOperation = 'overlay';

    // 간단한 노이즈 패턴
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2 + 1;
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5})`;
      ctx.fillRect(x, y, size, size);
    }
    ctx.restore();

    // 2. 스캔라인
    ctx.save();
    ctx.globalAlpha = 0.03;
    ctx.globalCompositeOperation = 'color-dodge';
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 1;

    for (let y = 0; y < height; y += 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();

    // 3. 비네팅
    ctx.save();
    const vignette = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, width * 0.8
    );
    vignette.addColorStop(0, 'transparent');
    vignette.addColorStop(1, 'rgba(0,0,0,0.7)');

    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
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

    if (supportsVideoFrameCallback) {
      // Native API 사용 (정확함)
      yield* this.renderWithVideoFrameCallback(totalFrames, onProgress);
    } else {
      // Fallback: requestAnimationFrame
      yield* this.renderWithAnimationFrame(totalFrames, onProgress);
    }
  }

  /**
   * requestVideoFrameCallback 사용 렌더링 (적응형 타임아웃 + 버퍼 모니터링)
   */
  private async *renderWithVideoFrameCallback(
    totalFrames: number,
    onProgress?: (current: number, total: number) => void
  ): AsyncGenerator<ImageData, void, unknown> {
    const video = this.videoElement!;
    const frameDuration = 1000 / this.config.renderer.fps;

    // 동적 타임아웃 계산
    const baseTimeout = 5000;
    const bufferMargin = 3000;
    const dynamicTimeout = Math.max(
      baseTimeout,
      (frameDuration * 2) + bufferMargin
    );

    // play() 예외 처리
    try {
      await video.play();
    } catch (error) {
      throw new Error(`Failed to play video: ${error}`);
    }

    // playing 상태 확인
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Video play timeout - not in playing state'));
      }, 5000);

      const onPlaying = () => {
        clearTimeout(timeout);
        video.removeEventListener('playing', onPlaying);
        resolve();
      };

      if (!video.paused && video.readyState >= 3) {
        clearTimeout(timeout);
        resolve();
      } else {
        video.addEventListener('playing', onPlaying);
      }
    });

    // 프레임 렌더링
    for (let i = 0; i < totalFrames; i++) {
      // 비디오 종료 체크 - 종료된 경우 마지막 프레임 재사용
      if (video.ended) {
        if (DEBUG) {
          console.warn(`[Frame ${i}] Video ended, using last frame for remaining ${totalFrames - i} frames`);
        }

        // requestVideoFrameCallback 없이 바로 렌더링 (마지막 프레임 재사용)
        const imageData = this.renderFrameWithoutVideoSeek(i);

        if (onProgress) {
          onProgress(i + 1, totalFrames);
        }

        yield imageData;
        continue; // 다음 프레임으로 (requestVideoFrameCallback 건너뛰기)
      }

      // 버퍼 상태 모니터링
      const bufferStatus = this.checkBufferHealth(video, i);

      if (bufferStatus.isStalled) {
        try {
          await this.waitForBufferRecovery(video, baseTimeout);
        } catch (error) {
          // 버퍼 회복 실패 시에도 진행 시도 (타임아웃 증가)
          console.warn(`Buffer recovery timeout at frame ${i}, continuing...`);
        }
      }

      // 프레임당 동적 타임아웃
      const frameTimeout = baseTimeout + (bufferStatus.stalledDuration || 0);

      // requestVideoFrameCallback with adaptive timeout
      try {
        await Promise.race([
          new Promise<void>(resolve => {
            (video as any).requestVideoFrameCallback(() => resolve());
          }),
          new Promise<void>((_, reject) =>
            setTimeout(() => reject(new Error(`Frame ${i} callback timeout`)), frameTimeout)
          )
        ]);
      } catch (error) {
        // ✅ 마지막 프레임 또는 비디오 종료 체크
        const isLastFrames = i >= totalFrames - 5; // 마지막 5프레임
        const isNearEnd = video.currentTime >= video.duration - 0.1; // duration 0.1초 이내

        if (video.ended || isLastFrames || isNearEnd) {
          if (DEBUG) {
            console.warn(
              `[Frame ${i}/${totalFrames}] Video near end ` +
              `(ended: ${video.ended}, currentTime: ${video.currentTime.toFixed(3)}s/${video.duration.toFixed(3)}s), ` +
              `using last frame`
            );
          }
          const imageData = this.renderFrameWithoutVideoSeek(i);
          if (onProgress) {
            onProgress(i + 1, totalFrames);
          }
          yield imageData;
          continue;
        }
        throw new Error(`requestVideoFrameCallback failed at frame ${i}: ${error}`);
      }

      // 프레임 렌더링
      const imageData = this.renderFrameWithoutVideoSeek(i);

      if (onProgress) {
        onProgress(i + 1, totalFrames);
      }

      yield imageData;
    }

    video.pause();
  }

  /**
   * requestAnimationFrame Fallback
   */
  private async *renderWithAnimationFrame(
    totalFrames: number,
    onProgress?: (current: number, total: number) => void
  ): AsyncGenerator<ImageData, void, unknown> {
    const video = this.videoElement!;
    const { fps } = this.config.renderer;

    await video.play();

    // playing 상태 확인
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Video play timeout')), 5000);
      const onPlaying = () => {
        clearTimeout(timeout);
        video.removeEventListener('playing', onPlaying);
        resolve();
      };

      if (!video.paused && video.readyState >= 3) {
        clearTimeout(timeout);
        resolve();
      } else {
        video.addEventListener('playing', onPlaying);
      }
    });

    for (let i = 0; i < totalFrames; i++) {
      const targetTime = i / fps;
      const frameDuration = 1000 / fps;
      const maxWaitTime = frameDuration * 2 + 3000; // 2프레임 + 3초 여유
      const startTime = Date.now();

      // Loop 탈출 조건 개선
      while (video.currentTime < targetTime - 0.001) { // 0.001초 허용 오차
        // 타임아웃 체크
        if (Date.now() - startTime > maxWaitTime) {
          throw new Error(
            `Frame ${i} timeout: video stuck at ${video.currentTime.toFixed(3)}s (target: ${targetTime.toFixed(3)}s)`
          );
        }

        // 비디오 중지 감지
        if (video.paused || video.ended) {
          throw new Error(`Video playback stopped at frame ${i}`);
        }

        await new Promise(resolve => requestAnimationFrame(resolve));
      }

      // 프레임 렌더링
      const imageData = this.renderFrameWithoutVideoSeek(i);

      if (onProgress) {
        onProgress(i + 1, totalFrames);
      }

      yield imageData;
    }

    video.pause();
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
    this.renderDarkOverlay();

    // 4. 참조 이미지
    if (this.referenceImage) {
      this.renderReferenceImage();
    }

    // 5. 텍스트 렌더링
    const currentScene = this.textScenes.find(
      scene => frameNumber >= scene.startFrame && frameNumber < scene.endFrame
    );

    if (currentScene) {
      this.renderTextScene(currentScene, frameNumber);
    }

    // 6. ImageData 반환
    return ctx.getImageData(0, 0, width, height);
  }

  /**
   * 버퍼 상태 체크
   */
  private checkBufferHealth(video: HTMLVideoElement, frameIndex: number) {
    const currentTime = video.currentTime;
    const buffered = video.buffered;
    let isStalled = false;
    let stalledDuration = 0;

    let isCurrentTimeBuffered = false;
    for (let i = 0; i < buffered.length; i++) {
      if (currentTime >= buffered.start(i) && currentTime < buffered.end(i)) {
        isCurrentTimeBuffered = true;
        break;
      }
    }

    if (!isCurrentTimeBuffered && buffered.length > 0) {
      isStalled = true;
      const lastBufferEnd = buffered.end(buffered.length - 1);
      const gapSize = currentTime - lastBufferEnd;
      stalledDuration = Math.min(gapSize * 1000, 5000);
    }

    return { isStalled, stalledDuration };
  }

  /**
   * 버퍼 회복 대기
   */
  private async waitForBufferRecovery(
    video: HTMLVideoElement,
    timeout: number
  ): Promise<void> {
    const startTime = Date.now();

    return new Promise<void>((resolve, reject) => {
      const checkBuffer = () => {
        const currentTime = video.currentTime;
        const buffered = video.buffered;

        for (let i = 0; i < buffered.length; i++) {
          if (currentTime >= buffered.start(i) && currentTime < buffered.end(i)) {
            resolve();
            return;
          }
        }

        if (Date.now() - startTime > timeout) {
          reject(new Error('Buffer recovery timeout'));
          return;
        }

        setTimeout(checkBuffer, 100);
      };

      checkBuffer();
    });
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
