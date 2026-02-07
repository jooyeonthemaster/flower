'use client';

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { KineticText } from './KineticText';
import { ENTRANCE_DURATION_SECONDS, EXIT_DURATION_SECONDS, SCENE_DURATION_SECONDS } from '../constants';

export interface TextScene {
  text: string;
  startFrame: number;
  endFrame: number;
  seed: number;
}

interface TextSceneContentProps {
  scene: TextScene;
  fontSize: number;
  fontFamily: string;
  textColor: string;
  glowColor: string;
  effects: string[];
  textPosition: 'random' | 'top' | 'center' | 'bottom';
}

export const TextSceneContent: React.FC<TextSceneContentProps> = ({
  scene,
  fontSize,
  fontFamily,
  textColor,
  glowColor,
  effects,
  textPosition,
}) => {
  const frame = useCurrentFrame(); // Sequence internal relative frame (0~149)
  const { fps } = useVideoConfig();

  // Calculate global frame (for noise2D unique patterns per text)
  const globalFrame = scene.startFrame + frame;
  const localFrame = frame;
  const duration = fps * SCENE_DURATION_SECONDS;

  // Entrance/Exit Animations
  const entranceDuration = fps * ENTRANCE_DURATION_SECONDS;
  const exitDuration = fps * EXIT_DURATION_SECONDS;

  const opacity = interpolate(
    localFrame,
    [0, entranceDuration, duration - exitDuration, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Scale bounce effect on entrance
  const scaleValue = interpolate(
    localFrame,
    [0, entranceDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.elastic(1)
    }
  );

  return (
    <div style={{ width: '100%', height: '100%', transform: `scale(${scaleValue})` }}>
      <KineticText
        text={scene.text}
        fontSize={fontSize}
        fontFamily={fontFamily}
        color={textColor}
        glowColor={glowColor}
        opacity={opacity}
        frame={globalFrame}
        localFrame={localFrame}
        seed={scene.seed}
        effects={effects}
        textPosition={textPosition}
      />
    </div>
  );
};
