'use client'

import PaymentButton from '@/components/payment/PaymentButton'
import { AIDesignData, DeliveryInfo } from '../hooks/useProductWizard'
import { ProductColor, RentalPeriod } from '@/types/order'

interface StepNavigationProps {
  currentStep: number
  selectedColor: ProductColor
  selectedPeriod: RentalPeriod
  aiDesignData: AIDesignData
  generatedImageUrl: string | null
  generatedVideoUrl: string | null
  deliveryInfo: DeliveryInfo
  agreements: {
    terms: boolean
    privacy: boolean
    refund: boolean
    ecommerce: boolean
  }
  currentRental: {
    price: number
    name: string
  }
  deposit: number
  onNext: () => void
  onPrev: () => void
}

// 스타일 라벨 매핑
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

export default function StepNavigation({
  currentStep,
  selectedColor,
  selectedPeriod,
  aiDesignData,
  generatedImageUrl,
  generatedVideoUrl,
  deliveryInfo,
  agreements,
  currentRental,
  deposit,
  onNext,
  onPrev
}: StepNavigationProps) {
  const allAgreementsChecked = agreements.terms && agreements.privacy && agreements.refund && agreements.ecommerce

  // Step 1, 2는 항상 다음 버튼 활성화
  const isNextDisabled = false

  // 주문명 생성
  const styleLabel = styleLabels[aiDesignData.style] || aiDesignData.style
  const orderName = `AI 홀로그램 화환 렌탈 - ${styleLabel} (${selectedColor === 'blue' ? '블루' : '레드'})`

  return (
    <div className="mt-8 pt-4">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        {/* 이전 버튼 */}
        <button
          onClick={onPrev}
          className={`px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 ${
            currentStep === 1 ? 'invisible' : ''
          }`}
        >
          ← 이전 단계
        </button>

        {/* 다음/결제 버튼 */}
        <div>
          {currentStep < 7 ? (
            <button
              onClick={onNext}
              disabled={isNextDisabled}
              className={`px-12 py-4 font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                isNextDisabled
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : selectedColor === 'blue'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              다음 단계 →
            </button>
          ) : (
            <PaymentButton
              amount={currentRental.price}
              orderName={orderName}
              orderData={{
                selectedColor,
                selectedPeriod,
                aiDesignData,
                generatedImageUrl,
                generatedVideoUrl,
                deliveryInfo,
                deposit,
              }}
              className={`px-12 py-4 font-bold rounded-2xl transition-all duration-300 transform shadow-lg ${
                !allAgreementsChecked
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white hover:scale-105 hover:shadow-xl'
              }`}
              disabled={!allAgreementsChecked}
            />
          )}
        </div>
      </div>
    </div>
  )
}
