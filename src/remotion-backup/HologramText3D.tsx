'use client';

/**
 * 3D 텍스트 컴포넌트 (Remotion + Three.js + troika-three-text)
 * LED 홀로그램 팬용 진짜 3D 텍스트 렌더링
 */

import React, { useRef, useMemo } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { noise2D } from '@remotion/noise';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface HologramText3DProps {
  text: string;
  fontSize?: number;
  textColor?: string;
  glowColor?: string;
  seed?: number;
  effect?: '3d-rotate' | '3d-float' | '3d-pulse' | '3d-wave';
  fontUrl?: string; // 커스텀 폰트 URL (선택)
}

// Google Fonts CDN URL (Noto Sans KR - 한글 지원)
const DEFAULT_KOREAN_FONT = 'https://fonts.gstatic.com/s/notosanskr/v36/PbykFmXiEBPT4ITbgNA5Cgm20HTs4JMMuA.woff2';

// 3D 텍스트 씬 컴포넌트
const Text3DScene: React.FC<{
  text: string;
  fontSize: number;
  textColor: string;
  glowColor: string;
  seed: number;
  effect: string;
  fontUrl: string;
}> = ({ text, fontSize, textColor, glowColor, seed, effect, fontUrl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const textRef = useRef<THREE.Mesh>(null);

  // 이펙트 계산
  const effectValues = useMemo(() => {
    const progress = (frame % (fps * 4)) / (fps * 4); // 4초 주기
    const phase = progress * Math.PI * 2;

    // noise 기반 자연스러운 움직임
    const noiseX = noise2D('3d-x', frame * 0.02, seed);
    const noiseY = noise2D('3d-y', frame * 0.025, seed + 10);
    const noiseZ = noise2D('3d-z', frame * 0.015, seed + 20);

    let rotateX = 0;
    let rotateY = 0;
    let rotateZ = 0;
    let positionZ = 0;
    let scale = 1;

    switch (effect) {
      case '3d-rotate':
        // 부드러운 3D 회전
        rotateX = noiseX * 0.3;
        rotateY = Math.sin(phase) * 0.5 + noiseY * 0.2;
        rotateZ = noiseZ * 0.1;
        break;

      case '3d-float':
        // 공중에 떠 있는 효과
        rotateX = Math.sin(phase * 0.5) * 0.15;
        rotateY = Math.cos(phase * 0.3) * 0.2;
        positionZ = Math.sin(phase) * 0.5 + noiseZ * 0.3;
        break;

      case '3d-pulse':
        // 3D 펄스 (크기 + 깊이 변화)
        scale = 1 + Math.sin(phase * 2) * 0.15;
        positionZ = Math.sin(phase * 2) * 0.3;
        rotateY = noiseY * 0.15;
        break;

      case '3d-wave':
        // 3D 파도 효과
        rotateX = Math.sin(phase + noiseX) * 0.25;
        rotateY = Math.cos(phase * 0.7) * 0.3;
        positionZ = Math.sin(phase * 1.5) * 0.4;
        break;

      default:
        break;
    }

    return { rotateX, rotateY, rotateZ, positionZ, scale };
  }, [frame, fps, seed, effect]);

  // 입장 애니메이션
  const entranceProgress = interpolate(
    frame,
    [0, fps * 0.8],
    [0, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  const entranceScale = interpolate(
    frame,
    [0, fps * 0.5],
    [0.5, 1],
    { extrapolateRight: 'clamp', easing: Easing.elastic(1) }
  );

  return (
    <>
      {/* 조명 설정 */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, 5]} intensity={0.5} color={glowColor} />
      <spotLight
        position={[0, 5, 10]}
        angle={0.3}
        penumbra={1}
        intensity={0.8}
        color={glowColor}
      />

      {/* 3D 텍스트 */}
      <group
        rotation={[effectValues.rotateX, effectValues.rotateY, effectValues.rotateZ]}
        position={[0, 0, effectValues.positionZ]}
        scale={effectValues.scale * entranceScale}
      >
        <Text
          ref={textRef}
          fontSize={fontSize * 0.015} // Three.js 스케일에 맞게 조정
          color={textColor}
          anchorX="center"
          anchorY="middle"
          font={fontUrl}
          maxWidth={10}
          textAlign="center"
          outlineWidth={0.02}
          outlineColor={glowColor}
          fillOpacity={entranceProgress}
        >
          {text}
          <meshStandardMaterial
            attach="material"
            color={textColor}
            emissive={glowColor}
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </Text>

        {/* 글로우 레이어 (뒤에 배치) */}
        <Text
          fontSize={fontSize * 0.016}
          color={glowColor}
          anchorX="center"
          anchorY="middle"
          font={fontUrl}
          maxWidth={10}
          textAlign="center"
          position={[0, 0, -0.1]}
          fillOpacity={entranceProgress * 0.4}
        >
          {text}
          <meshBasicMaterial
            attach="material"
            color={glowColor}
            transparent
            opacity={0.3}
          />
        </Text>
      </group>
    </>
  );
};

// 메인 3D 텍스트 컴포넌트
export const HologramText3D: React.FC<HologramText3DProps> = ({
  text,
  fontSize = 65,
  textColor = '#ffffff',
  glowColor = '#00ffff',
  seed = 0,
  effect = '3d-rotate',
  fontUrl,
}) => {
  // 폰트 URL 결정 (커스텀 > 기본 한글 폰트)
  const effectiveFontUrl = fontUrl || DEFAULT_KOREAN_FONT;
  const { width, height } = useVideoConfig();

  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ backgroundColor: 'transparent' }}
    >
      <Text3DScene
        text={text}
        fontSize={fontSize}
        textColor={textColor}
        glowColor={glowColor}
        seed={seed}
        effect={effect}
        fontUrl={effectiveFontUrl}
      />
    </ThreeCanvas>
  );
};

export default HologramText3D;
