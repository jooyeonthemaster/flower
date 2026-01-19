'use client';

import { useRef, useEffect, useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// 스타일별 색상 설정
const styleColors: Record<string, {
  primary: string;
  secondary: string;
  glow: string;
  background: string;
}> = {
  elegant: {
    primary: '#FFD700',
    secondary: '#FF69B4',
    glow: '#FFB6C1',
    background: '#1a0a1a',
  },
  luxury: {
    primary: '#FFD700',
    secondary: '#DAA520',
    glow: '#FFA500',
    background: '#0a0a0a',
  },
  neon: {
    primary: '#00FFFF',
    secondary: '#FF00FF',
    glow: '#00FF00',
    background: '#0a0020',
  },
  traditional: {
    primary: '#FF4444',
    secondary: '#FFD700',
    glow: '#FF6B6B',
    background: '#1a0505',
  },
  fantasy: {
    primary: '#8B5CF6',
    secondary: '#06B6D4',
    glow: '#A855F7',
    background: '#0a0a20',
  },
  space: {
    primary: '#E879F9',
    secondary: '#7C3AED',
    glow: '#F0ABFC',
    background: '#050510',
  },
};

// 폰트 매핑
const fontMap: Record<string, string> = {
  elegant: '/fonts/Hakgyoansim_GongryongalR.ttf',
  luxury: '/fonts/SinchonRhapsodyTTF-ExtraBold_(2).ttf',
  neon: '/fonts/SF레몬빙수-TTF.ttf',
  traditional: '/fonts/Hakgyoansim_GongryongalR.ttf',
  fantasy: '/fonts/Solinsunny.ttf',
  space: '/fonts/SF레몬빙수-TTF.ttf',
};

interface Text3DLayerProps {
  text: string;
  font: string;
  color: string;
  position: [number, number, number];
  scale: number;
  opacity: number;
  outlineWidth?: number;
  outlineColor?: string;
}

// 개별 텍스트 레이어 컴포넌트
function Text3DLayer({
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

interface GlowPlaneProps {
  color: string;
  position: [number, number, number];
  scale: [number, number, number];
  opacity: number;
}

// 글로우 이펙트 평면
function GlowPlane({ color, position, scale, opacity }: GlowPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.9;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={scale} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

interface Text3DSceneProps {
  text: string;
  style: string;
  customColors?: {
    primary?: string;
    secondary?: string;
    glow?: string;
  };
  animate?: boolean;
}

// 3D 텍스트 씬 컴포넌트
function Text3DScene({ text, style, customColors, animate = true }: Text3DSceneProps) {
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
  const layers = useMemo(() => {
    const result: Array<{
      id: string;
      position: [number, number, number];
      color: string;
      opacity: number;
      scale: number;
      outlineWidth: number;
      outlineColor?: string;
    }> = [];

    // 스타일별 레이어 설정
    switch (style) {
      case 'elegant':
        // 우아한 스타일: 부드러운 그림자, 섬세한 그라데이션
        for (let i = 5; i > 0; i--) {
          result.push({
            id: `shadow-${i}`,
            position: [0.015 * i, -0.015 * i, -i * 0.04],
            color: colors.secondary,
            opacity: 0.15 * (1 - i / 6),
            scale: 1 + i * 0.008,
            outlineWidth: 0,
          });
        }
        result.push({
          id: 'glow-back',
          position: [0, 0, -0.02],
          color: colors.glow,
          opacity: 0.4,
          scale: 1.02,
          outlineWidth: 0.1,
          outlineColor: colors.glow,
        });
        result.push({
          id: 'main',
          position: [0, 0, 0],
          color: colors.primary,
          opacity: 1,
          scale: 1,
          outlineWidth: 0.04,
          outlineColor: colors.secondary,
        });
        result.push({
          id: 'highlight',
          position: [0, 0.015, 0.01],
          color: '#FFFFFF',
          opacity: 0.25,
          scale: 0.99,
          outlineWidth: 0,
        });
        break;

      case 'luxury':
        // 럭셔리 스타일: 깊은 금색 그림자, 강한 입체감
        for (let i = 12; i > 0; i--) {
          result.push({
            id: `depth-${i}`,
            position: [0.025 * i, -0.025 * i, -i * 0.06],
            color: i > 6 ? '#1a1000' : colors.secondary,
            opacity: i > 6 ? 0.5 : 0.8,
            scale: 1 + i * 0.005,
            outlineWidth: 0,
          });
        }
        result.push({
          id: 'main-outline',
          position: [0, 0, 0],
          color: colors.secondary,
          opacity: 1,
          scale: 1,
          outlineWidth: 0.12,
          outlineColor: '#8B6914',
        });
        result.push({
          id: 'main',
          position: [0, 0, 0.02],
          color: colors.primary,
          opacity: 1,
          scale: 1,
          outlineWidth: 0.02,
          outlineColor: colors.primary,
        });
        result.push({
          id: 'shine',
          position: [-0.02, 0.03, 0.03],
          color: '#FFFFFF',
          opacity: 0.5,
          scale: 0.97,
          outlineWidth: 0,
        });
        break;

      case 'neon':
        // 네온 스타일: 강한 글로우, 다중 색상 발광
        result.push({
          id: 'glow-outer',
          position: [0, 0, -0.1],
          color: colors.glow,
          opacity: 0.3,
          scale: 1.15,
          outlineWidth: 0.2,
          outlineColor: colors.glow,
        });
        result.push({
          id: 'glow-mid',
          position: [0, 0, -0.05],
          color: colors.secondary,
          opacity: 0.5,
          scale: 1.08,
          outlineWidth: 0.15,
          outlineColor: colors.secondary,
        });
        result.push({
          id: 'glow-inner',
          position: [0, 0, -0.02],
          color: colors.primary,
          opacity: 0.7,
          scale: 1.03,
          outlineWidth: 0.08,
          outlineColor: colors.primary,
        });
        result.push({
          id: 'main',
          position: [0, 0, 0],
          color: '#FFFFFF',
          opacity: 1,
          scale: 1,
          outlineWidth: 0.03,
          outlineColor: colors.primary,
        });
        break;

      case 'traditional':
        // 전통 스타일: 붓글씨 느낌, 붉은 인장 효과
        for (let i = 6; i > 0; i--) {
          result.push({
            id: `shadow-${i}`,
            position: [0.02 * i, -0.03 * i, -i * 0.05],
            color: '#2a0000',
            opacity: 0.4 * (1 - i / 8),
            scale: 1 + i * 0.01,
            outlineWidth: 0,
          });
        }
        result.push({
          id: 'outline',
          position: [0, 0, -0.01],
          color: colors.secondary,
          opacity: 1,
          scale: 1.01,
          outlineWidth: 0.1,
          outlineColor: '#8B0000',
        });
        result.push({
          id: 'main',
          position: [0, 0, 0],
          color: colors.primary,
          opacity: 1,
          scale: 1,
          outlineWidth: 0.02,
          outlineColor: colors.secondary,
        });
        result.push({
          id: 'stamp-effect',
          position: [0.01, -0.01, 0.01],
          color: '#FFD700',
          opacity: 0.15,
          scale: 1.02,
          outlineWidth: 0,
        });
        break;

      case 'fantasy':
        // 판타지 스타일: 마법 오라, 무지개빛 효과
        result.push({
          id: 'magic-outer',
          position: [0, 0, -0.15],
          color: '#06B6D4',
          opacity: 0.25,
          scale: 1.2,
          outlineWidth: 0.15,
          outlineColor: '#06B6D4',
        });
        result.push({
          id: 'magic-mid',
          position: [0, 0, -0.08],
          color: colors.glow,
          opacity: 0.4,
          scale: 1.1,
          outlineWidth: 0.1,
          outlineColor: colors.glow,
        });
        for (let i = 4; i > 0; i--) {
          result.push({
            id: `sparkle-${i}`,
            position: [0.01 * i, -0.01 * i, -i * 0.03],
            color: colors.secondary,
            opacity: 0.3,
            scale: 1 + i * 0.015,
            outlineWidth: 0,
          });
        }
        result.push({
          id: 'main',
          position: [0, 0, 0],
          color: colors.primary,
          opacity: 1,
          scale: 1,
          outlineWidth: 0.05,
          outlineColor: colors.secondary,
        });
        result.push({
          id: 'shimmer',
          position: [0, 0.02, 0.02],
          color: '#FFFFFF',
          opacity: 0.4,
          scale: 0.98,
          outlineWidth: 0,
        });
        break;

      case 'space':
        // 스페이스 스타일: 우주적 글로우, 별빛 효과
        result.push({
          id: 'nebula',
          position: [0, 0, -0.2],
          color: colors.secondary,
          opacity: 0.2,
          scale: 1.25,
          outlineWidth: 0.2,
          outlineColor: colors.secondary,
        });
        result.push({
          id: 'star-glow',
          position: [0, 0, -0.1],
          color: colors.glow,
          opacity: 0.35,
          scale: 1.12,
          outlineWidth: 0.12,
          outlineColor: colors.glow,
        });
        for (let i = 8; i > 0; i--) {
          result.push({
            id: `depth-${i}`,
            position: [0, 0, -i * 0.04],
            color: i % 2 === 0 ? colors.primary : colors.secondary,
            opacity: 0.15 + (8 - i) * 0.05,
            scale: 1 + i * 0.01,
            outlineWidth: 0,
          });
        }
        result.push({
          id: 'main',
          position: [0, 0, 0],
          color: colors.primary,
          opacity: 1,
          scale: 1,
          outlineWidth: 0.04,
          outlineColor: colors.glow,
        });
        result.push({
          id: 'starlight',
          position: [0, 0, 0.02],
          color: '#FFFFFF',
          opacity: 0.35,
          scale: 0.99,
          outlineWidth: 0,
        });
        break;

      default:
        // 기본 스타일
        for (let i = 8; i > 0; i--) {
          result.push({
            id: `shadow-${i}`,
            position: [0.02 * i, -0.02 * i, -i * 0.05],
            color: '#000000',
            opacity: 0.3 * (1 - i / 10),
            scale: 1 + i * 0.01,
            outlineWidth: 0,
          });
        }
        result.push({
          id: 'main-outline',
          position: [0, 0, 0],
          color: colors.secondary,
          opacity: 1,
          scale: 1,
          outlineWidth: 0.08,
          outlineColor: colors.secondary,
        });
        result.push({
          id: 'main',
          position: [0, 0, 0.01],
          color: colors.primary,
          opacity: 1,
          scale: 1,
          outlineWidth: 0.03,
          outlineColor: colors.primary,
        });
        result.push({
          id: 'highlight',
          position: [0, 0.02, 0.02],
          color: '#FFFFFF',
          opacity: 0.3,
          scale: 0.98,
          outlineWidth: 0,
        });
    }

    return result;
  }, [colors, style]);

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

// 캡처용 씬 컴포넌트
function CaptureScene({
  text,
  style,
  customColors,
  onCapture,
}: Text3DSceneProps & { onCapture: (dataUrl: string) => void }) {
  const { gl, scene, camera } = useThree();
  const capturedRef = useRef(false);

  useEffect(() => {
    if (!capturedRef.current) {
      // 렌더링 후 캡처
      const timer = setTimeout(() => {
        gl.render(scene, camera);
        const dataUrl = gl.domElement.toDataURL('image/png');
        onCapture(dataUrl);
        capturedRef.current = true;
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [gl, scene, camera, onCapture]);

  const colors = useMemo(() => ({
    ...styleColors[style] || styleColors.elegant,
    ...customColors,
  }), [style, customColors]);

  return (
    <>
      <color attach="background" args={[colors.background]} />
      <Text3DScene text={text} style={style} customColors={customColors} animate={false} />
    </>
  );
}

export interface Text3DRendererProps {
  text: string;
  style: string;
  width?: number;
  height?: number;
  customColors?: {
    primary?: string;
    secondary?: string;
    glow?: string;
  };
  preview?: boolean;
  onImageGenerated?: (dataUrl: string) => void;
}

export interface Text3DRendererRef {
  capture: () => Promise<string>;
}

// 메인 렌더러 컴포넌트
const Text3DRenderer = forwardRef<Text3DRendererRef, Text3DRendererProps>(
  function Text3DRenderer(
    {
      text,
      style,
      width = 1024,
      height = 576,
      customColors,
      preview = true,
      onImageGenerated,
    },
    ref
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const colors = useMemo(() => ({
      ...styleColors[style] || styleColors.elegant,
      ...customColors,
    }), [style, customColors]);

    // 외부에서 캡처 호출 가능
    useImperativeHandle(ref, () => ({
      capture: async () => {
        return new Promise((resolve) => {
          if (capturedImage) {
            resolve(capturedImage);
          } else {
            // 캡처 대기
            const checkInterval = setInterval(() => {
              if (capturedImage) {
                clearInterval(checkInterval);
                resolve(capturedImage);
              }
            }, 100);

            // 타임아웃
            setTimeout(() => {
              clearInterval(checkInterval);
              resolve('');
            }, 5000);
          }
        });
      },
    }));

    const handleCapture = (dataUrl: string) => {
      setCapturedImage(dataUrl);
      onImageGenerated?.(dataUrl);
    };

    if (!preview) {
      // 캡처 전용 모드
      return (
        <div style={{ width, height, position: 'absolute', left: -9999 }}>
          <Canvas
            ref={canvasRef}
            gl={{ preserveDrawingBuffer: true, antialias: true }}
            camera={{ position: [0, 0, 5], fov: 50 }}
            style={{ width, height }}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <CaptureScene
              text={text}
              style={style}
              customColors={customColors}
              onCapture={handleCapture}
            />
          </Canvas>
        </div>
      );
    }

    // 프리뷰 모드
    return (
      <div
        className="relative rounded-xl overflow-hidden"
        style={{ width: '100%', aspectRatio: '16/9', background: colors.background }}
      >
        <Canvas
          ref={canvasRef}
          gl={{ preserveDrawingBuffer: true, antialias: true }}
          camera={{ position: [0, 0, 5], fov: 50 }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color={colors.glow} />
          <color attach="background" args={[colors.background]} />
          <Text3DScene text={text} style={style} customColors={customColors} animate={true} />
        </Canvas>

        {/* 글로우 오버레이 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${colors.glow}20 0%, transparent 70%)`,
          }}
        />
      </div>
    );
  }
);

export default Text3DRenderer;

// 스타일 색상 export
export { styleColors };
