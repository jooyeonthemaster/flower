import { useRef, useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Text3DSceneProps } from '../types';
import { styleColors } from '../constants';
import Text3DScene from './Text3DScene';

interface CaptureSceneProps extends Text3DSceneProps {
  onCapture: (dataUrl: string) => void;
}

// 캡처용 씬 컴포넌트
export default function CaptureScene({
  text,
  style,
  customColors,
  onCapture,
}: CaptureSceneProps) {
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
