/**
 * TextSceneContent 컴포넌트 - 각 텍스트 장면 렌더링
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { TextSceneContentProps } from '../types';
import KineticText from './KineticText';

const TextSceneContent: React.FC<TextSceneContentProps> = ({
  scene,
  fontSize,
  fontFamily,
  textColor,
  glowColor,
  effects,
  textPosition,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const globalFrame = scene.startFrame + frame;
  const localFrame = frame;
  const duration = fps * 5;

  // Entrance/Exit Animations
  const entranceDuration = fps * 0.8;
  const exitDuration = fps * 0.5;

  const opacity = interpolate(
    localFrame,
    [0, entranceDuration, duration - exitDuration, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Scale Bounce effect on entrance
  const scaleValue = interpolate(
    localFrame,
    [0, entranceDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.elastic(1),
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

export default TextSceneContent;
