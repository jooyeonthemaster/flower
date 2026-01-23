'use client';

/**
 * HologramTextOverlay - 홀로그램 텍스트 오버레이 컴포지션
 */

import React, { useMemo } from 'react';
import { AbsoluteFill, Video, Sequence, useVideoConfig, random } from 'remotion';
import { HologramTextOverlayProps, TextScene } from './types';
import TextSceneContent from './components/TextSceneContent';

export const HologramTextOverlay: React.FC<HologramTextOverlayProps & { imageSrc?: string }> = ({
  videoSrc,
  imageSrc,
  referenceImageSrc,
  texts,
  fontFamily = "'Noto Sans KR', sans-serif",
  fontSize = 65,
  textColor = '#ffffff',
  glowColor = '#00ffff',
  effects = [],
  textPosition = 'random',
}) => {
  const activeEffects = effects || [];
  const { fps } = useVideoConfig();
  const sceneDurationInFrames = fps * 5;

  const textScenes: TextScene[] = useMemo(() => {
    return texts.map((text, index) => ({
      text,
      startFrame: index * sceneDurationInFrames,
      endFrame: (index + 1) * sceneDurationInFrames,
      seed: random(index * 123),
    }));
  }, [texts, sceneDurationInFrames]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* Background: Video or Image */}
      {videoSrc ? (
        <Video
          src={videoSrc}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          delayRenderTimeoutInMilliseconds={60000}
        />
      ) : imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt="Background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : null}

      {/* Dark Overlay with Gradient */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.4))',
        }}
      />

      {/* Reference Image Layer */}
      {referenceImageSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={referenceImageSrc}
          alt="Reference"
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '35%',
            height: 'auto',
            maxHeight: '35%',
            objectFit: 'contain',
            mixBlendMode: 'screen',
            filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5)) drop-shadow(0 0 40px rgba(0,255,255,0.3))',
            zIndex: 10,
          }}
        />
      )}

      {/* Text Scenes */}
      {textScenes.map((scene, index) => (
        <Sequence key={index} from={index * sceneDurationInFrames} durationInFrames={sceneDurationInFrames}>
          <TextSceneContent
            scene={scene}
            fontSize={fontSize}
            fontFamily={fontFamily}
            textColor={textColor}
            glowColor={glowColor}
            effects={activeEffects}
            textPosition={textPosition}
          />
        </Sequence>
      ))}

      {/* Cinematic Overlays */}

      {/* 1. Digital Noise / Grain */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(circle at 20% 50%, transparent 0%, rgba(255,255,255,0.02) 100%),
            radial-gradient(circle at 80% 20%, transparent 0%, rgba(255,255,255,0.01) 100%),
            radial-gradient(circle at 40% 80%, transparent 0%, rgba(255,255,255,0.015) 100%)
          `,
          opacity: 0.15,
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
        }}
      />

      {/* 2. Scanlines */}
      <AbsoluteFill
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)',
          pointerEvents: 'none',
          mixBlendMode: 'color-dodge',
        }}
      />

      {/* 3. Vignette */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle, transparent 50%, black 120%)',
          pointerEvents: 'none',
          opacity: 0.7,
        }}
      />
    </AbsoluteFill>
  );
};

export default HologramTextOverlay;
