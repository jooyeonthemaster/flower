'use client'

import { AIDesignData } from '../hooks/useProductWizard'

interface AIResultStepProps {
  videoUrl: string
  designData: AIDesignData
  onRegenerate: () => void
  onNext: () => void
}

// 스타일 정보 매핑
const styleLabels: Record<string, string> = {
  neon: '네온 사이버펑크',
  elegant: '우아한 플로럴',
  luxury: '럭셔리 골드',
  minimal: '모던 미니멀',
  traditional: '한국 전통',
  nature: '내추럴 포레스트',
  fantasy: '신비로운 판타지',
  ice: '크리스탈 아이스',
  fire: '블레이징 파이어',
  artdeco: '아트 데코',
  space: '갤럭시 스페이스',
  sketch: '아티스틱 스케치',
}

// 카테고리 정보 매핑
const categoryLabels: Record<string, { label: string; icon: string }> = {
  opening: { label: '개업 축하', icon: '🎉' },
  wedding: { label: '결혼식', icon: '💍' },
  birthday: { label: '생일', icon: '🎂' },
  memorial: { label: '추모', icon: '🕊️' },
  event: { label: '행사/전시', icon: '🎤' },
  promotion: { label: '승진/영전', icon: '📢' },
}

export default function AIResultStep({ videoUrl, designData, onRegenerate, onNext }: AIResultStepProps) {
  const categoryInfo = categoryLabels[designData.category] || { label: designData.category, icon: '🎯' }
  const styleLabel = styleLabels[designData.style] || designData.style

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Side: Video Preview (2 columns) */}
        <div className="lg:col-span-2">
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-2xl overflow-hidden shadow-lg">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  렌더링 완료
                </div>
                <h3 className="text-lg font-bold text-gray-900">나만의 홀로그램</h3>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black">
              <video
                src={videoUrl}
                autoPlay
                loop
                muted
                playsInline
                controls
                className="w-full h-full object-contain"
              />
            </div>

            {/* Video Info */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <p className="text-gray-600 text-sm">AI가 생성한 홀로그램 영상입니다. 마음에 드시면 결제를 진행해주세요.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Info & Actions (1 column) */}
        <div className="lg:col-span-1 space-y-6">

          {/* Design Summary */}
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 shadow-lg">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <span>✨</span>
              <span>디자인 정보</span>
            </h4>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">행사 유형</span>
                <span className="font-medium text-gray-900 flex items-center space-x-1">
                  <span>{categoryInfo.icon}</span>
                  <span>{categoryInfo.label}</span>
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">디자인 스타일</span>
                <span className="font-medium text-gray-900">{styleLabel}</span>
              </div>

              <div className="py-2">
                <span className="text-gray-500 text-sm block mb-2">요청 사항</span>
                <p className="text-gray-900 text-sm bg-gray-50 rounded-lg p-3 leading-relaxed">
                  {designData.prompt}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onNext}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              결제하기 →
            </button>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={videoUrl}
                download="my-hologram.mp4"
                className="py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-medium text-center hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>다운로드</span>
              </a>

              <button
                onClick={onRegenerate}
                className="py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>다시 만들기</span>
              </button>
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-blue-800 text-sm leading-relaxed">
              <strong>참고:</strong> 생성된 영상은 결제 완료 후 최종 렌탈 제품에 적용됩니다.
              다시 만들기를 선택하시면 새로운 디자인으로 재생성할 수 있습니다.
            </p>
          </div>

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

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
