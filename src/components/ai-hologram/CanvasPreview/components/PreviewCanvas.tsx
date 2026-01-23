/**
 * 미리보기 Canvas 컴포넌트
 * 비디오 + Canvas 오버레이 구조
 * requestAnimationFrame 기반 60fps 렌더링
 */

'use client';

import { useRef, useEffect, useCallback } from 'react';

// 디버깅용 로그 (문제 해결 후 제거 예정)
const DEBUG = true;

interface PreviewCanvasProps {
  width: number;
  height: number;
  videoSrc?: string;
  referenceImageSrc?: string;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
  onVideoReady?: (video: HTMLVideoElement) => void;
  onTimeUpdate?: (currentTime: number) => void;
}

export function PreviewCanvas({
  width,
  height,
  videoSrc,
  referenceImageSrc,
  onCanvasReady,
  onVideoReady,
  onTimeUpdate,
}: PreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(-1);

  // 참조이미지 디버깅 로그
  useEffect(() => {
    if (DEBUG) {
      console.log('[PreviewCanvas] referenceImageSrc:', {
        exists: !!referenceImageSrc,
        type: typeof referenceImageSrc,
        length: referenceImageSrc?.length,
        isDataUrl: referenceImageSrc?.startsWith('data:'),
        preview: referenceImageSrc?.substring(0, 100),
      });
    }
  }, [referenceImageSrc]);

  // Canvas 준비
  useEffect(() => {
    if (canvasRef.current) {
      onCanvasReady(canvasRef.current);
    }
  }, [onCanvasReady]);

  // requestAnimationFrame 기반 렌더링 루프
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !onTimeUpdate) return;

    const renderLoop = () => {
      // 비디오가 재생 중이고 시간이 변경되었을 때만 렌더링
      if (!video.paused && !video.ended) {
        const currentTime = video.currentTime;
        // 프레임이 변경되었을 때만 렌더링 (약간의 최적화)
        if (Math.abs(currentTime - lastTimeRef.current) > 0.001) {
          lastTimeRef.current = currentTime;
          onTimeUpdate(currentTime);
        }
      }
      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    // 비디오가 로드되면 루프 시작
    const handleCanPlay = () => {
      if (animationFrameRef.current === null) {
        animationFrameRef.current = requestAnimationFrame(renderLoop);
      }
    };

    video.addEventListener('canplay', handleCanPlay);

    // 이미 재생 가능한 상태면 바로 시작
    if (video.readyState >= 3) {
      handleCanPlay();
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [onTimeUpdate]);

  // 비디오 준비
  const handleVideoLoaded = useCallback(() => {
    if (videoRef.current && onVideoReady) {
      onVideoReady(videoRef.current);
    }
  }, [onVideoReady]);

  return (
    <div
      className="relative rounded-lg overflow-hidden bg-black"
      style={{ aspectRatio: `${width}/${height}` }}
    >
      {/* 배경 비디오 */}
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          autoPlay
          onLoadedData={handleVideoLoaded}
          onError={(e) => {
            const video = e.currentTarget;
            const mediaError = video.error;
            console.error('Preview video error:', {
              code: mediaError?.code,
              message: mediaError?.message,
              codeDescription: mediaError?.code === 1 ? 'MEDIA_ERR_ABORTED' :
                               mediaError?.code === 2 ? 'MEDIA_ERR_NETWORK' :
                               mediaError?.code === 3 ? 'MEDIA_ERR_DECODE' :
                               mediaError?.code === 4 ? 'MEDIA_ERR_SRC_NOT_SUPPORTED' :
                               'UNKNOWN',
              videoSrc,
            });
          }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 1 }}
        />
      )}

      {/* 다크 오버레이 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.3))'
        }}
      />

      {/* 참조 이미지 (다크 오버레이 위, 텍스트 아래) */}
      {/* 위치를 FrameRenderer.ts와 동기화 (30%) */}
      {referenceImageSrc && (
        <div
          className="absolute pointer-events-none flex items-center justify-center"
          style={{
            zIndex: 3,
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '35%',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={referenceImageSrc}
            alt="Reference"
            className="w-full h-auto object-contain"
            style={{
              mixBlendMode: 'normal',
              opacity: 1,
              filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))',
            }}
            onLoad={() => DEBUG && console.log('[PreviewCanvas] Reference image loaded successfully')}
            onError={(e) => console.error('[PreviewCanvas] Reference image load error:', e)}
          />
        </div>
      )}

      {/* 텍스트 오버레이 Canvas */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 4 }}
      />

      {/* 시네마틱 오버레이 - 스캔라인 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 4,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.02) 2px, rgba(0,255,255,0.02) 4px)',
          mixBlendMode: 'color-dodge',
        }}
      />

      {/* 비네팅 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 5,
          background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </div>
  );
}

export default PreviewCanvas;
