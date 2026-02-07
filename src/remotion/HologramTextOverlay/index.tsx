'use client';

import React, { useMemo } from 'react';
import { AbsoluteFill, Video, Sequence, useVideoConfig, random } from 'remotion';
import { TextSceneContent, type TextScene } from './components/TextSceneContent';
import { HologramTextOverlayProps } from './types';
import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_TEXT_COLOR,
  DEFAULT_GLOW_COLOR,
  DEFAULT_TEXT_POSITION,
  SCENE_DURATION_SECONDS,
} from './constants';

export const HologramTextOverlay: React.FC<HologramTextOverlayProps> = ({
  videoSrc,
  imageSrc,
  referenceImageSrc,
  texts,
  fontFamily = DEFAULT_FONT_FAMILY,
  fontSize = DEFAULT_FONT_SIZE,
  textColor = DEFAULT_TEXT_COLOR,
  glowColor = DEFAULT_GLOW_COLOR,
  effects = [],
  textPosition = DEFAULT_TEXT_POSITION,
}) => {
  const activeEffects = effects || [];
  const { fps } = useVideoConfig();
  const sceneDurationInFrames = fps * SCENE_DURATION_SECONDS;

  const textScenes: TextScene[] = useMemo(() => {
    return texts.map((text, index) => ({
      text,
      startFrame: index * sceneDurationInFrames,
      endFrame: (index + 1) * sceneDurationInFrames,
      seed: random(index * 123), // Deterministic random seed
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
            objectFit: 'cover'
          }}
          delayRenderTimeoutInMilliseconds={60000}
        />
      ) : imageSrc ? (
        <img
          src={imageSrc}
          alt="Background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      ) : null}

      {/* Text Sequences */}
      {textScenes.map((scene, index) => (
        <Sequence
          key={index}
          from={scene.startFrame}
          durationInFrames={sceneDurationInFrames}
        >
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
    </AbsoluteFill>
  );
};

export default HologramTextOverlay;

// Re-export types for external use
export type { HologramTextOverlayProps } from './types';
export type { TextScene } from './components/TextSceneContent';
