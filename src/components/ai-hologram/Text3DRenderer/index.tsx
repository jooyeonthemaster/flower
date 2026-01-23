'use client';

import { useRef, useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text3DRendererProps, Text3DRendererRef } from './types';
import { styleColors } from './constants';
import Text3DScene from './scenes/Text3DScene';
import CaptureScene from './scenes/CaptureScene';

// Re-export types and constants for external use
export type { Text3DRendererProps, Text3DRendererRef } from './types';
export { styleColors } from './constants';

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
