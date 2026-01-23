'use client';

import { AbsoluteFill, Video, Img } from 'remotion';
import React from 'react';

interface VideoOnImageOverlayProps {
  backgroundImageSrc: string; // 배경 이미지 (참조 이미지 포함된 AI 생성 배경)
  textVideoSrc: string; // 텍스트 영상 (검은 배경 + 3D 텍스트 모션)
}

/**
 * VideoOnImageOverlay
 *
 * 배경 이미지 위에 텍스트 영상을 screen 블렌딩으로 오버레이합니다.
 * 텍스트 영상의 검은 배경은 투명해지고, 밝은 텍스트만 보입니다.
 *
 * 플로우:
 * 1. AI가 참조 이미지를 포함한 배경 이미지 생성
 * 2. 3D 텍스트 이미지를 Higgsfield로 모션 영상으로 변환
 * 3. 이 composition으로 배경 + 텍스트 영상 합성
 */
export const VideoOnImageOverlay: React.FC<VideoOnImageOverlayProps> = ({
  backgroundImageSrc,
  textVideoSrc,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* Layer 1: 배경 이미지 (참조 이미지 포함) */}
      {backgroundImageSrc && (
        <Img
          src={backgroundImageSrc}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      {/* Layer 2: 텍스트 영상 (screen 블렌딩으로 검은 배경 제거) */}
      {textVideoSrc && (
        <AbsoluteFill
          style={{
            mixBlendMode: 'screen', // 검은 배경은 투명, 밝은 부분만 표시
          }}
        >
          <Video
            src={textVideoSrc}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain', // 텍스트가 잘리지 않도록
            }}
            delayRenderTimeoutInMilliseconds={60000}
          />
        </AbsoluteFill>
      )}

      {/* Layer 3: 추가 글로우 효과 (텍스트 영상 위에 lighten 블렌딩) */}
      {textVideoSrc && (
        <AbsoluteFill
          style={{
            mixBlendMode: 'lighten',
            opacity: 0.3,
          }}
        >
          <Video
            src={textVideoSrc}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
            delayRenderTimeoutInMilliseconds={60000}
          />
        </AbsoluteFill>
      )}

      {/* Layer 4: 비네팅 효과 */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle, transparent 50%, black 120%)',
          pointerEvents: 'none',
          opacity: 0.5,
        }}
      />
    </AbsoluteFill>
  );
};

export default VideoOnImageOverlay;
