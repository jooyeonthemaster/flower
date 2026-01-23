/**
 * KineticText 컴포넌트 - 이펙트가 적용된 텍스트 렌더링
 */

import React from 'react';
import { useVideoConfig } from 'remotion';
import { makeTransform, translate, scale as scaleTransform, rotate, rotateX as rotateXTransform, rotateY as rotateYTransform, translateZ } from '@remotion/animation-utils';
import { KineticTextProps } from '../types';
import { createEffectFlags, calculateEffectValues, calculateTextPosition, calculateClampedOffsets } from '../utils/effectCalculator';

const KineticText: React.FC<KineticTextProps> = ({
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
  const baseUnit = width / 1080;

  const flags = createEffectFlags(effects);
  const effectValues = calculateEffectValues({
    effects,
    frame,
    localFrame,
    seed,
    fps,
    baseUnit,
    text,
    glowColor,
  });

  const { topPos, leftPos } = calculateTextPosition(textPosition, seed);
  const { clampedXOffset, clampedYOffset } = calculateClampedOffsets(effectValues, topPos, baseUnit);

  // Transform 계산
  const totalZDepthValue = effectValues.zoomInZ + effectValues.flipUpZ + effectValues.spiral3dZ + effectValues.wave3dZ + effectValues.tumbleZ;
  const totalRotateXValue = effectValues.rotateX + effectValues.flipUpRotateX + effectValues.spiral3dRotateX + effectValues.wave3dRotateX + effectValues.tumbleRotateX;
  const totalRotateYValue = effectValues.rotateY + effectValues.spiral3dRotateY + effectValues.tumbleRotateY;
  const totalRotateValue = effectValues.waveRotate + effectValues.spinRotation + effectValues.swingRotate;
  const totalScaleValue = effectValues.zoomScale * effectValues.zoomInScale;

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
    perspective: '1200px',
    transform: containerTransform,
    width: '90%',
    maxWidth: '90%',
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    transformStyle: 'preserve-3d',
  };

  // TextShadow 조합
  const allShadows = [
    effectValues.dynamicGlow,
    effectValues.pulseShadow,
    effectValues.depthShadow,
    effectValues.extrudeShadow,
    effectValues.neonGlow,
  ].filter(s => s !== '');
  const combinedTextShadow = allShadows.length > 0 ? allShadows.join(', ') : 'none';

  // Filter 조합
  const allFilters = [];
  if (effectValues.isGlitching) {
    allFilters.push(`blur(${4 + effectValues.blurAmount}px)`, 'contrast(200%)', 'hue-rotate(90deg)');
  } else if (effectValues.blurAmount > 0) {
    allFilters.push(`blur(${effectValues.blurAmount}px)`);
  }
  if (flags.hasRainbow) {
    allFilters.push(`hue-rotate(${effectValues.rainbowHue}deg)`);
  }
  const combinedFilter = allFilters.length > 0 ? allFilters.join(' ') : 'none';

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
    opacity: (opacity * effectValues.strobe * effectValues.neonFlicker) * (flags.hasHologram ? effectValues.hologramOpacity : 1),
    textShadow: combinedTextShadow,
    transform: `translateX(${effectValues.glitchOffset + (flags.hasHologram ? effectValues.hologramOffset : 0)}px) scale(${(flags.hasPixelate ? effectValues.pixelateScale : 1) * effectValues.elasticScale})`,
    filter: combinedFilter,
  } as React.CSSProperties;

  return (
    <div style={containerStyle}>
      {/* Glitch RGB Split Effect */}
      {effectValues.isGlitching && (
        <div style={{ ...textStyle, position: 'absolute', color: '#ff0055', transform: `translate(-12px, -8px) scale(1.05)`, opacity: 0.8, mixBlendMode: 'screen' }}>
          {effectValues.displayText}
        </div>
      )}
      {effectValues.isGlitching && (
        <div style={{ ...textStyle, position: 'absolute', color: '#00ccff', transform: `translate(12px, 8px) scale(0.95)`, opacity: 0.8, mixBlendMode: 'screen' }}>
          {effectValues.displayText}
        </div>
      )}

      {/* Chromatic Aberration Effect */}
      {flags.hasChromatic && (
        <>
          <div style={{ ...textStyle, position: 'absolute', color: '#ff0000', transform: `translateX(${-effectValues.chromaticOffset}px)`, opacity: 0.6, mixBlendMode: 'screen', filter: 'none' }}>
            {effectValues.displayText}
          </div>
          <div style={{ ...textStyle, position: 'absolute', color: '#00ff00', transform: `translateX(0px)`, opacity: 0.6, mixBlendMode: 'screen', filter: 'none' }}>
            {effectValues.displayText}
          </div>
          <div style={{ ...textStyle, position: 'absolute', color: '#0000ff', transform: `translateX(${effectValues.chromaticOffset}px)`, opacity: 0.6, mixBlendMode: 'screen', filter: 'none' }}>
            {effectValues.displayText}
          </div>
        </>
      )}

      {/* Main Text */}
      <div style={textStyle}>
        {effectValues.displayText}
        {/* Typewriter 커서 */}
        {flags.hasTypewriter && effectValues.displayText.length < text.length && (
          <span style={{ opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0 }}>|</span>
        )}
      </div>
    </div>
  );
};

export default KineticText;
