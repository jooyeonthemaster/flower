'use client'

import { useState, useEffect } from 'react'
import { aiService } from '@/services/aiService'
import { AIDesignData, AIGenerationStatus } from '../hooks/useProductWizard'

interface AIGenerationStepProps {
  designData: AIDesignData
  generationStatus: AIGenerationStatus
  generatedImageUrl: string | null
  onStatusChange: (status: AIGenerationStatus) => void
  onImageGenerated: (imageUrl: string) => void
  onVideoGenerated: (videoUrl: string) => void
  onError: (error: string) => void
  onBack: () => void
  hasStartedRef: React.MutableRefObject<boolean>
}

export default function AIGenerationStep({
  designData,
  generationStatus,
  generatedImageUrl,
  onStatusChange,
  onImageGenerated,
  onVideoGenerated,
  onError,
  onBack,
  hasStartedRef
}: AIGenerationStepProps) {
  const [progress, setProgress] = useState(0)

  // 이미지 생성 시작
  const startImageGeneration = async () => {
    if (hasStartedRef.current) return
    hasStartedRef.current = true

    onStatusChange('generating-image')

    try {
      const res = await aiService.generateImage({
        prompt: designData.prompt,
        category: designData.category,
        style: designData.style,
        referenceImage: designData.referenceImage
      })

      if (res.success && res.imageUrl) {
        onImageGenerated(res.imageUrl)
      } else {
        throw new Error(res.error || '이미지 생성에 실패했습니다')
      }
    } catch (err: unknown) {
      hasStartedRef.current = false
      onStatusChange('error')
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다'
      onError(message)
    }
  }

  // 비디오 생성 시작
  const startVideoGeneration = async () => {
    if (!generatedImageUrl) return

    onStatusChange('generating-video')

    try {
      const res = await aiService.generateVideo({
        sourceImageUrl: generatedImageUrl,
        prompt: `Create a seamless loop holographic video.
CRITICAL ANIMATION RULES:
- The center portrait/image and all text MUST remain completely STATIC and UNCHANGED.
- ONLY animate the circular border/ring frame.
- The ring must rotate like a SPINNING WHEEL or CD - rotating around its CENTER AXIS while staying FLAT and FACING the camera.
- Think of a loading spinner on a website - it spins clockwise while always facing you.
- DO NOT flip or rotate the ring in 3D space. NO tumbling, NO coin-flip rotation.
- The ring stays perfectly parallel to the screen/camera at all times.
- Smooth, steady clockwise rotation (like clock hands moving).
- Add subtle glowing particle effects floating around.
Style: ${designData.style}`
      })

      if (res.success && res.videoUrl) {
        onVideoGenerated(res.videoUrl)
      } else {
        throw new Error(res.error || '영상 생성에 실패했습니다')
      }
    } catch (err: unknown) {
      onStatusChange('error')
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다'
      onError(message)
    }
  }

  // 컴포넌트 마운트 시 이미지 생성 시작
  useEffect(() => {
    if (generationStatus === 'idle') {
      startImageGeneration()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 진행률 애니메이션
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (generationStatus === 'generating-image' || generationStatus === 'generating-video') {
      setProgress(0)
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev
          return prev + Math.random() * 5
        })
      }, 300)
    } else if (generationStatus === 'image-ready' || generationStatus === 'error') {
      setProgress(100)
    }
    return () => clearInterval(interval)
  }, [generationStatus])

  // 재시도 핸들러
  const handleRetry = () => {
    hasStartedRef.current = false
    onStatusChange('idle')
    startImageGeneration()
  }

  // 상태별 타이틀
  const getStatusTitle = () => {
    switch (generationStatus) {
      case 'generating-image':
        return 'AI가 디자인을\n구상하고 있습니다...'
      case 'image-ready':
        return '디자인 초안이\n완성되었습니다!'
      case 'generating-video':
        return '홀로그램 영상을\n렌더링 중입니다...'
      case 'error':
        return '오류가 발생했습니다'
      default:
        return '준비 중...'
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left Side: Status & Controls */}
        <div className="bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-8 shadow-lg">
          <div className="space-y-6">
            {/* Status Title */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 whitespace-pre-line leading-tight">
                {getStatusTitle()}
              </h2>

              {/* Progress Steps */}
              <div className="space-y-3">
                <div className={`flex items-center space-x-3 ${
                  generationStatus === 'generating-image' ? 'text-blue-600' :
                  generationStatus === 'image-ready' || generationStatus === 'generating-video' || generationStatus === 'video-ready' ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                    generationStatus === 'generating-image' ? 'border-blue-500 bg-blue-50' :
                    generationStatus === 'image-ready' || generationStatus === 'generating-video' || generationStatus === 'video-ready' ? 'border-green-500 bg-green-50' : 'border-gray-300'
                  }`}>
                    {generationStatus === 'image-ready' || generationStatus === 'generating-video' || generationStatus === 'video-ready' ? '✓' : '1'}
                  </span>
                  <span className="font-medium">이미지 생성</span>
                  {generationStatus === 'generating-image' && <span className="animate-pulse text-blue-500">...</span>}
                </div>

                <div className={`flex items-center space-x-3 ${
                  generationStatus === 'generating-video' ? 'text-blue-600' :
                  generationStatus === 'video-ready' ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                    generationStatus === 'generating-video' ? 'border-blue-500 bg-blue-50' :
                    generationStatus === 'video-ready' ? 'border-green-500 bg-green-50' : 'border-gray-300'
                  }`}>
                    {generationStatus === 'video-ready' ? '✓' : '2'}
                  </span>
                  <span className="font-medium">비디오 렌더링</span>
                  {generationStatus === 'generating-video' && <span className="animate-pulse text-blue-500">...</span>}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {(generationStatus === 'generating-image' || generationStatus === 'generating-video') && (
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{generationStatus === 'generating-image' ? '이미지 생성 중...' : '영상 렌더링 중...'}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {generationStatus === 'error' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm mb-3">생성 중 오류가 발생했습니다. 다시 시도해주세요.</p>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  다시 시도
                </button>
              </div>
            )}

            {/* Action Buttons */}
            {generationStatus === 'image-ready' && (
              <div className="space-y-3">
                <button
                  onClick={startVideoGeneration}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                >
                  홀로그램 영상 생성하기
                </button>
                <button
                  onClick={onBack}
                  className="w-full py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                >
                  다시 디자인하기
                </button>
              </div>
            )}

            {/* Back Button (during generation) */}
            {(generationStatus === 'generating-image' || generationStatus === 'generating-video') && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">
                  {generationStatus === 'generating-video'
                    ? '* 영상 생성에는 약 2~4분이 소요될 수 있습니다'
                    : '* 이미지 생성에는 약 30초~1분이 소요됩니다'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Preview */}
        <div className="bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-2xl overflow-hidden shadow-lg min-h-[400px] relative">
          {generatedImageUrl ? (
            <div className="relative w-full h-full min-h-[400px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={generatedImageUrl}
                alt="Generated Design"
                className="w-full h-full object-contain p-4"
              />
              {generationStatus === 'image-ready' && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white text-sm">AI가 생성한 디자인 초안입니다</p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="w-16 h-16 border-4 border-t-blue-500 border-r-purple-500 border-b-blue-500 border-l-purple-500 rounded-full animate-spin mb-4"></div>
              <span className="text-gray-500 font-medium tracking-wide">AI PROCESSING</span>
              <span className="text-gray-400 text-sm mt-1">잠시만 기다려주세요...</span>
            </div>
          )}

          {/* Scan Effect */}
          {(generationStatus === 'generating-image' || generationStatus === 'generating-video') && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent translate-y-[-100%] animate-[scan_3s_linear_infinite] pointer-events-none"></div>
          )}
        </div>

      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
