'use client';

import React from 'react';
import { useVideoConfig } from 'remotion';
import { makeTransform, translate, scale as scaleTransform, rotate, rotateX as rotateXTransform, rotateY as rotateYTransform, translateZ } from '@remotion/animation-utils';
import { calculateEffects } from '../effects';
import {
  calculateBaseUnit,
  calculateFadeoutFactor,
  calculateRepeatPhase,
  getTopPosition,
  clampYOffset,
  clampXOffset,
  combineTextShadows,
  combineFilters,
} from '../utils';
import { CONTAINER_WIDTH, CONTAINER_MAX_WIDTH, CONTAINER_PADDING, PERSPECTIVE } from '../constants';

interface KineticTextProps {
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  glowColor: string;
  opacity: number;
  frame: number;
  localFrame: number;
  seed: number;
  effects: string[];
  textPosition: 'random' | 'top' | 'center' | 'bottom';
}

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  fontSize,
  fontFamily,
  color,
  glowColor,
  opacity,
  frame,
  localFrame,
  seed,
  effects,
  textPosition,
}) => {
  const { fps, width } = useVideoConfig();

  // Calculate base unit for resolution scaling
  const baseUnit = calculateBaseUnit(width);

  // Calculate timing values
  const fadeoutFactor = calculateFadeoutFactor(localFrame, fps);
  const { repeatProgress, repeatPhase } = calculateRepeatPhase(localFrame, fps);

  // Calculate all effects
  const effectCalcs = calculateEffects({
    effects,
    frame,
    localFrame,
    seed,
    fps,
    baseUnit,
    fadeoutFactor,
    repeatPhase,
    repeatProgress,
    glowColor,
    text,
  });

  // Get position
  const leftPos = '50%';
  const topPos = getTopPosition(textPosition, seed);

  // Calculate total offsets
  const rawYOffset = effectCalcs.driftY + effectCalcs.waveY + effectCalcs.bounceY +
    effectCalcs.spiralY + effectCalcs.orbitY + effectCalcs.flipUpY +
    effectCalcs.wave3dY + effectCalcs.floatY + effectCalcs.shakeY;
  const rawXOffset = effectCalcs.driftX + effectCalcs.spiralX + effectCalcs.swingX +
    effectCalcs.slideX + effectCalcs.orbitX + effectCalcs.shakeX;

  const clampedYOffset = clampYOffset(rawYOffset, topPos, baseUnit);
  const clampedXOffset = clampXOffset(rawXOffset, baseUnit);

  // Calculate total transform values
  const totalZDepthValue = effectCalcs.zoomInZ + effectCalcs.flipUpZ + effectCalcs.spiral3dZ +
    effectCalcs.wave3dZ + effectCalcs.tumbleZ;
  const totalRotateXValue = effectCalcs.rotateX + effectCalcs.flipUpRotateX +
    effectCalcs.spiral3dRotateX + effectCalcs.wave3dRotateX + effectCalcs.tumbleRotateX;
  const totalRotateYValue = effectCalcs.rotateY + effectCalcs.spiral3dRotateY +
    effectCalcs.tumbleRotateY;
  const totalRotateValue = effectCalcs.waveRotate + effectCalcs.spinRotation +
    effectCalcs.swingRotate;
  const totalScaleValue = effectCalcs.zoomScale * effectCalcs.zoomInScale;

  // Build container transform
  const containerTransform = makeTransform([
    translate('-50%', '-50%'),
    translate(`${clampedXOffset}px`, `${clampedYOffset}px`),
    translateZ(totalZDepthValue),
    rotateXTransform(totalRotateXValue),
    rotateYTransform(totalRotateYValue),
    rotate(totalRotateValue),
    scaleTransform(totalScaleValue),
  ]);

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: topPos,
    left: leftPos,
    perspective: PERSPECTIVE,
    transform: containerTransform,
    width: CONTAINER_WIDTH,
    maxWidth: CONTAINER_MAX_WIDTH,
    padding: CONTAINER_PADDING,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    transformStyle: 'preserve-3d',
  };

  // Combine text shadows
  const combinedTextShadow = combineTextShadows([
    effectCalcs.dynamicGlow,
    effectCalcs.pulseShadow,
    effectCalcs.depthShadow,
    effectCalcs.extrudeShadow,
    effectCalcs.neonGlow,
  ]);

  // Combine filters
  const combinedFilter = combineFilters([
    { enabled: effectCalcs.isGlitching, value: `blur(${4 + effectCalcs.blurAmount}px) contrast(200%) hue-rotate(90deg)` },
    { enabled: !effectCalcs.isGlitching && effectCalcs.blurAmount > 0, value: `blur(${effectCalcs.blurAmount}px)` },
    { enabled: effectCalcs.rainbowHue > 0, value: `hue-rotate(${effectCalcs.rainbowHue}deg)` },
  ]);

  // Display text (typewriter effect)
  const displayText = text.slice(0, effectCalcs.typewriterChars);

  const textStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontFamily,
    fontWeight: 900,
    color: color,
    textAlign: 'center',
    whiteSpace: 'pre-wrap',
    textWrap: 'balance',
    width: 'auto',
    minWidth: 0,
    maxWidth: '100%',
    overflow: 'visible',
    opacity: (opacity * effectCalcs.strobe * effectCalcs.neonFlicker) * effectCalcs.hologramOpacity,
    textShadow: combinedTextShadow,
    transform: `translateX(${effectCalcs.glitchOffset + effectCalcs.hologramOffset}px) scale(${effectCalcs.pixelateScale * effectCalcs.elasticScale})`,
    filter: combinedFilter,
  } as React.CSSProperties;

  return (
    <div style={containerStyle}>
      {/* RGB Split Effect (Glitch) */}
      {effectCalcs.isGlitching && (
        <>
          <div style={{
            ...textStyle,
            position: 'absolute',
            color: '#ff0055',
            transform: `translate(-12px, -8px) scale(1.05)`,
            opacity: 0.8,
            mixBlendMode: 'screen'
          }}>
            {displayText}
          </div>
          <div style={{
            ...textStyle,
            position: 'absolute',
            color: '#00ccff',
            transform: `translate(12px, 8px) scale(0.95)`,
            opacity: 0.8,
            mixBlendMode: 'screen'
          }}>
            {displayText}
          </div>
        </>
      )}

      {/* Chromatic Aberration Effect */}
      {effectCalcs.chromaticOffset !== 0 && (
        <>
          <div style={{
            ...textStyle,
            position: 'absolute',
            color: '#ff0000',
            transform: `translateX(${-effectCalcs.chromaticOffset}px)`,
            opacity: 0.6,
            mixBlendMode: 'screen',
            filter: 'none'
          }}>
            {displayText}
          </div>
          <div style={{
            ...textStyle,
            position: 'absolute',
            color: '#00ff00',
            transform: `translateX(0px)`,
            opacity: 0.6,
            mixBlendMode: 'screen',
            filter: 'none'
          }}>
            {displayText}
          </div>
          <div style={{
            ...textStyle,
            position: 'absolute',
            color: '#0000ff',
            transform: `translateX(${effectCalcs.chromaticOffset}px)`,
            opacity: 0.6,
            mixBlendMode: 'screen',
            filter: 'none'
          }}>
            {displayText}
          </div>
        </>
      )}

      {/* Main Text */}
      <div style={textStyle}>
        {displayText}
        {/* Typewriter cursor */}
        {effects.includes('typewriter') && effectCalcs.typewriterChars < text.length && (
          <span style={{ opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0 }}>|</span>
        )}
      </div>
    </div>
  );
};
