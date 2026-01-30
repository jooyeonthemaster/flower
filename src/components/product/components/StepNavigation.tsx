'use client'

import { TemplateMetadata } from '@/types/template'
import PaymentButton from '@/components/payment/PaymentButton'
import { useTemplateValidation } from '../hooks/useTemplateValidation'

interface StepNavigationProps {
  currentStep: number
  selectedColor: 'blue' | 'red'
  selectedTemplate: TemplateMetadata | null
  templateData: {
    textData: Record<string, string>
    imageData: Record<string, File | string>
  }
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
  onNext: () => void
  onPrev: () => void
}

export default function StepNavigation({
  currentStep,
  selectedColor,
  selectedTemplate,
  templateData,
  agreements,
  currentRental,
  onNext,
  onPrev
}: StepNavigationProps) {
  const { validateTemplateData } = useTemplateValidation()

  const isNextDisabled = () => {
    if (currentStep === 4 && !selectedTemplate) return true
    if (currentStep === 5) {
      const validation = validateTemplateData(selectedTemplate, templateData)
      return !validation.isValid
    }
    return false
  }

  const allAgreementsChecked = agreements.terms && agreements.privacy && agreements.refund && agreements.ecommerce

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
          {currentStep < 6 ? (
            <button
              onClick={onNext}
              disabled={isNextDisabled()}
              className={`px-12 py-4 font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                isNextDisabled()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : selectedColor === 'blue'
                  ? 'bg-gradient-to-r from-orange to-dusty-rose hover:from-[#d15a1f] hover:to-[#c78a8a] text-white shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              다음 단계 →
            </button>
          ) : (
            <PaymentButton 
              amount={currentRental.price}
              orderName={`홀로그램 화환 렌탈 - ${selectedTemplate?.name} (${selectedColor === 'blue' ? '블루' : '레드'})`}
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
