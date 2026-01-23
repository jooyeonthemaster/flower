import { Composition } from 'remotion';
import { HologramTextOverlay } from './HologramTextOverlay';
import { VideoOnImageOverlay } from './VideoOnImageOverlay';
import { HologramText3D } from './HologramText3D';

// HologramTextOverlay Props 타입
interface HologramTextOverlayProps {
  videoSrc: string;
  imageSrc?: string;
  referenceImageSrc?: string;
  texts: string[];
  fontFamily?: string;
  fontSize?: number;
  textColor?: string;
  glowColor?: string;
  effects?: string[];
  textPosition?: 'random' | 'top' | 'center' | 'bottom';
}

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HologramTextOverlay"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={HologramTextOverlay as any}
        durationInFrames={30 * 30} // 기본값 30초 @ 30fps = 900프레임
        fps={30}
        width={720}
        height={720}
        defaultProps={{
          videoSrc: '', // 런타임에 전달
          texts: [
            '김철수 ♥ 이영희',
            '결혼을 축하합니다',
            '두 분의 앞날에',
            '행복이 가득하길',
            '바랍니다',
            '보내는 사람',
          ],
          fontFamily: "'Noto Sans KR', sans-serif",
          fontSize: 33, // 720p에 맞게 조정 (50 * 720/1080)
          textColor: '#ffffff',
          glowColor: '#00ffff',
        }}
        // 정확히 30초 고정 (템플릿 영상과 동기화)
        calculateMetadata={({ props }) => {
          const typedProps = props as HologramTextOverlayProps;
          const fps = 30;
          const durationInFrames = fps * 30; // 항상 30초 = 900프레임

          return {
            durationInFrames,
            props: typedProps,
          };
        }}
      />

      {/* AI 영상 합성 모드용: 배경 이미지 + 텍스트 영상 오버레이 */}
      <Composition
        id="VideoOnImageOverlay"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={VideoOnImageOverlay as any}
        durationInFrames={5 * 30} // 5초 @ 30fps = 150프레임
        fps={30}
        width={720}
        height={720}
        defaultProps={{
          backgroundImageSrc: '', // 런타임에 전달
          textVideoSrc: '', // 런타임에 전달
        }}
      />

      {/* 3D 텍스트 컴포지션 (Three.js 기반) */}
      <Composition
        id="HologramText3D"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={HologramText3D as any}
        durationInFrames={5 * 30} // 5초 @ 30fps = 150프레임
        fps={30}
        width={720}
        height={720}
        defaultProps={{
          text: '3D 텍스트',
          fontSize: 54, // 720p에 맞게 조정 (65 * 720/1080)
          textColor: '#ffffff',
          glowColor: '#00ffff',
          seed: 0,
          effect: '3d-rotate',
        }}
      />
    </>
  );
};
