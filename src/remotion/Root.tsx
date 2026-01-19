import { Composition } from 'remotion';
import { HologramTextOverlay } from './HologramTextOverlay';
import { VideoOnImageOverlay } from './VideoOnImageOverlay';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HologramTextOverlay"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={HologramTextOverlay as any}
        durationInFrames={30 * 30} // 30초 @ 30fps
        fps={30}
        width={1080}
        height={1080}
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
          fontSize: 48,
          textColor: '#ffffff',
          glowColor: '#00ffff',
        }}
      />

      {/* AI 영상 합성 모드용: 배경 이미지 + 텍스트 영상 오버레이 */}
      <Composition
        id="VideoOnImageOverlay"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={VideoOnImageOverlay as any}
        durationInFrames={5 * 30} // 5초 @ 30fps (각 장면)
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          backgroundImageSrc: '', // 런타임에 전달
          textVideoSrc: '', // 런타임에 전달
        }}
      />
    </>
  );
};
