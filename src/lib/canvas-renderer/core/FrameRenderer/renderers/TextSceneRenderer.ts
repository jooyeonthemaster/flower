/**
 * 텍스트 씬 렌더러
 */

import type {
  RenderConfig,
  TextScene,
  EffectContext,
  EffectResult,
  CharEffectMode,
} from '../../../types';
import { CanvasTextRenderer } from '../../CanvasTextRenderer';
import { calculateEffects, isLetterEffect } from '../../../effects';
import { interpolate, Easing } from '../../../utils/mathUtils';
import {
  SCENE_DURATION_SECONDS,
  ENTRANCE_DURATION_SECONDS,
  EXIT_DURATION_SECONDS,
} from '../../../constants/defaults';
import { calculatePositionY } from '../utils/positionCalculator';

/**
 * 텍스트 씬 렌더링
 */
export function renderTextScene(
  scene: TextScene,
  frameNumber: number,
  config: RenderConfig,
  textRenderer: CanvasTextRenderer
): void {
  const { fps } = config.renderer;
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
  const hasLetterEffect = config.effects.some(e => isLetterEffect(e));
  const displayText = scene.text;
  const totalChars = displayText.length;

  // 위치 계산
  const positionY = calculatePositionY(scene.position, scene.seed, config.renderer.height);

  if (hasLetterEffect && totalChars > 0) {
    // 글자별 이펙트 모드: 이펙트를 일반/글자별로 분리
    // letterEffect만 각 글자에 적용, 일반 이펙트는 전체 텍스트에 적용
    const letterEffectsOnly = config.effects.filter(e => isLetterEffect(e));
    const charEffects: EffectResult[] = [];

    for (let i = 0; i < totalChars; i++) {
      const effectContext: EffectContext = {
        frame: frameNumber,
        localFrame,
        fps,
        seed: scene.seed,
        width: config.renderer.width,
        height: config.renderer.height,
        text: scene.text,
        glowColor: config.textStyle.glowColor,
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
      width: config.renderer.width,
      height: config.renderer.height,
      text: scene.text,
      glowColor: config.textStyle.glowColor,
    };

    // 일반 이펙트만 전체 텍스트에 적용
    const generalEffects = config.effects.filter(e => !isLetterEffect(e));
    const baseEffects = calculateEffects(generalEffects, baseContext);

    const finalBaseEffects: EffectResult = {
      ...baseEffects,
      translateY: baseEffects.translateY + positionY,
      opacity: baseEffects.opacity * opacity,
      scale: baseEffects.scale * entranceScale,
    };

    textRenderer.renderText(
      displayText,
      config.textStyle,
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
      width: config.renderer.width,
      height: config.renderer.height,
      text: scene.text,
      glowColor: config.textStyle.glowColor,
    };

    const effects = calculateEffects(config.effects, effectContext);

    const finalEffects: EffectResult = {
      ...effects,
      translateY: effects.translateY + positionY,
      opacity: effects.opacity * opacity,
      scale: effects.scale * entranceScale,
    };

    const finalDisplayText = effects.displayText || scene.text;
    textRenderer.renderText(
      finalDisplayText,
      config.textStyle,
      finalEffects,
      config.charEffectMode
    );
  }
}
