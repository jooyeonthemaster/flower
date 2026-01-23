/**
 * Canvas 기반 미리보기 컴포넌트
 * 비디오는 HTML video로 재생, 텍스트만 Canvas에 오버레이
 */

'use client';

import { useCallback } from 'react';
import { PreviewCanvas, ExportButton } from './components';
import { useCanvasRenderer } from './hooks/useCanvasRenderer';
import type { CanvasPreviewProps } from './types';

export function CanvasPreview({
  config,
  width = 720,
  height = 720,
  autoPlay = true,
  showControls = false,
  onExportComplete,
  onError,
}: CanvasPreviewProps) {
  const {
    previewState,
    exportState,
    exportProgress,
    isWebCodecsSupported,
    initializeCanvas,
    initializeVideo,
    handleTimeUpdate,
    exportVideo,
  } = useCanvasRenderer(config);

  // Canvas 준비 완료 시
  const handleCanvasReady = useCallback(
    (canvas: HTMLCanvasElement) => {
      initializeCanvas(canvas);
    },
    [initializeCanvas]
  );

  // 비디오 준비 완료 시
  const handleVideoReady = useCallback(
    (video: HTMLVideoElement) => {
      initializeVideo(video);
    },
    [initializeVideo]
  );

  // 비디오 시간 업데이트 시
  const handleVideoTimeUpdate = useCallback(
    (currentTime: number) => {
      handleTimeUpdate(currentTime);
    },
    [handleTimeUpdate]
  );

  // 내보내기 처리
  const handleExport = useCallback(async () => {
    try {
      const blob = await exportVideo();
      if (blob) {
        onExportComplete?.(blob);
        // 자동 다운로드
        downloadBlob(blob, 'hologram-video.mp4');
      }
    } catch (error) {
      onError?.(error as Error);
    }
  }, [exportVideo, onExportComplete, onError]);

  return (
    <div className="flex flex-col gap-4">
      {/* 미리보기: 비디오 + Canvas 오버레이 */}
      <PreviewCanvas
        width={width}
        height={height}
        videoSrc={config.videoSrc}
        referenceImageSrc={config.referenceImageSrc}
        onCanvasReady={handleCanvasReady}
        onVideoReady={handleVideoReady}
        onTimeUpdate={handleVideoTimeUpdate}
      />

      {/* 내보내기 버튼 (showControls가 true일 때만) */}
      {showControls && (
        <ExportButton
          onExport={handleExport}
          state={exportState}
          progress={exportProgress}
          disabled={!isWebCodecsSupported || previewState === 'loading'}
        />
      )}

      {/* WebCodecs 미지원 경고 */}
      {showControls && !isWebCodecsSupported && (
        <div className="p-3 bg-yellow-900/50 border border-yellow-700 rounded-lg">
          <p className="text-sm text-yellow-300">
            이 브라우저는 WebCodecs를 지원하지 않습니다.
            Chrome, Edge 또는 최신 브라우저를 사용해주세요.
          </p>
        </div>
      )}
    </div>
  );
}

// Blob 다운로드 유틸
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Type export
export type { CanvasPreviewProps, PreviewConfig } from './types';

export default CanvasPreview;
