'use client';

import { Player } from '@remotion/player';
import { HologramTextOverlay } from '@/remotion/HologramTextOverlay';

interface HologramPreviewPlayerProps {
  videoSrc: string;
  texts: string[];
  fontFamily?: string;
  fontSize?: number;
  textColor?: string;
  glowColor?: string;
  width?: number;
  height?: number;
  autoPlay?: boolean;
  loop?: boolean;
  showControls?: boolean;
}

export default function HologramPreviewPlayer({
  videoSrc,
  texts,
  fontFamily = "'Noto Sans KR', sans-serif",
  fontSize = 48,
  textColor = '#ffffff',
  glowColor = '#00ffff',
  width = 400,
  height = 400,
  autoPlay = true,
  loop = true,
  showControls = true,
}: HologramPreviewPlayerProps) {
  // 텍스트가 6개 미만이면 빈 문자열로 채움
  const paddedTexts = [...texts];
  while (paddedTexts.length < 6) {
    paddedTexts.push('');
  }

  return (
    <div className="rounded-xl overflow-hidden bg-black">
      <Player
        component={HologramTextOverlay}
        inputProps={{
          videoSrc,
          texts: paddedTexts.slice(0, 6),
          fontFamily,
          fontSize,
          textColor,
          glowColor,
        }}
        durationInFrames={30 * 30} // 30초 @ 30fps
        fps={30}
        compositionWidth={1080}
        compositionHeight={1080}
        style={{
          width,
          height,
        }}
        autoPlay={autoPlay}
        loop={loop}
        controls={showControls}
      />
    </div>
  );
}
