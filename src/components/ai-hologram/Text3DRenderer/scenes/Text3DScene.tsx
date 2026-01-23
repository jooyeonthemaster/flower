import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text3DSceneProps } from '../types';
import { styleColors, fontMap } from '../constants';
import { generateStyleLayers } from '../utils/styleLayerGenerator';
import Text3DLayer from '../layers/Text3DLayer';
import GlowPlane from '../layers/GlowPlane';

// 3D 텍스트 씬 컴포넌트
export default function Text3DScene({ text, style, customColors, animate = true }: Text3DSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const colors = useMemo(() => ({
    ...styleColors[style] || styleColors.elegant,
    ...customColors,
  }), [style, customColors]);

  const font = fontMap[style] || fontMap.elegant;

  // 애니메이션
  useFrame((state) => {
    if (groupRef.current && animate) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  // 스타일별 다른 3D 효과 적용
  const layers = useMemo(() => generateStyleLayers(style, colors), [colors, style]);

  return (
    <group ref={groupRef}>
      {/* 글로우 배경 */}
      <GlowPlane
        color={colors.glow}
        position={[0, 0, -0.5]}
        scale={[8, 4, 1]}
        opacity={0.15}
      />

      {/* 텍스트 레이어들 */}
      {layers.map((layer) => (
        <Text3DLayer
          key={layer.id}
          text={text}
          font={font}
          color={layer.color}
          position={layer.position}
          scale={layer.scale}
          opacity={layer.opacity}
          outlineWidth={layer.outlineWidth}
          outlineColor={layer.outlineColor}
        />
      ))}
    </group>
  );
}
