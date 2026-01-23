import { useRef } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { Text3DLayerProps } from '../types';

// 개별 텍스트 레이어 컴포넌트
export default function Text3DLayer({
  text,
  font,
  color,
  position,
  scale,
  opacity,
  outlineWidth = 0,
  outlineColor = '#000000',
}: Text3DLayerProps) {
  const textRef = useRef<THREE.Mesh>(null);

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={1}
      font={font}
      color={color}
      anchorX="center"
      anchorY="middle"
      scale={scale}
      fillOpacity={opacity}
      outlineWidth={outlineWidth}
      outlineColor={outlineColor}
      maxWidth={10}
      textAlign="center"
    >
      {text}
    </Text>
  );
}
