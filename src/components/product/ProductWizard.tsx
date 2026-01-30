'use client'

import { useAuth } from '@/contexts/AuthContext'
import { TEMPLATES_WITH_DATA } from '@/data/templates'
import { useProductWizard } from './hooks/useProductWizard'
import ProgressBar from './components/ProgressBar'
import LoginAlert from './components/LoginAlert'
import StepNavigation from './components/StepNavigation'
import ColorStep from './steps/ColorStep'
import PeriodStep from './steps/PeriodStep'
import CategoryStep from './steps/CategoryStep'
import TemplateStep from './steps/TemplateStep'
import DataInputStep from './steps/DataInputStep'
import PaymentStep from './steps/PaymentStep'

export default function ProductWizard() {
  const { user } = useAuth()
  const {
    currentStep,
    selectedColor,
    selectedPeriod,
    selectedCategory,
    selectedTemplate,
    templateData,
    agreements,
    showLoginAlert,
    setSelectedColor,
    setSelectedPeriod,
    setSelectedCategory,
    setAgreements,
    setShowLoginAlert,
    handleNextStep,
    handlePrevStep,
    handleCategorySelect,
    handleTemplateSelect,
    handleTextFieldChange,
    handleImageFieldChange
  } = useProductWizard()

  // 제품 정보
  const productInfo = {
    name: "Digital Hologram Wreath",
    subtitle: "프리미엄 홀로그램 화환",
    description: "최첨단 8K 홀로그램 기술로 구현된 차세대 디지털 화환. 전통과 혁신이 만나는 특별한 경험을 선사합니다.",
    features: [
      "8K Ultra HD 홀로그램 디스플레이",
      "무선 스마트 제어 시스템",
      "전용 스탠드 및 설치 키트 포함",
      "24시간 기술 지원 서비스"
    ],
    colorOptions: {
      blue: { name: "블루 타입", desc: "신뢰와 안정감을 상징하는 블루 컬러" },
      red: { name: "레드 타입", desc: "열정과 에너지를 상징하는 레드 컬러" }
    },
    rentalOptions: {
      daily: {
        name: "일간 렌트",
        price: 120000,
        unit: "일",
        description: "1일 단위 렌트",
        minDays: 1,
        maxDays: 6,
        note: "단기 행사에 최적"
      },
      weekly: {
        name: "주간 렌트",
        price: 700000,
        unit: "주",
        description: "1주 단위 렌트 (7일)",
        minDays: 7,
        maxDays: 27,
        dailyPrice: 100000,
        note: "중기간 행사에 경제적"
      },
      monthly: {
        name: "월간 렌트",
        price: 2400000,
        unit: "월",
        description: "1개월 단위 렌트 (30일)",
        minDays: 30,
        maxDays: 365,
        dailyPrice: 80000,
        note: "장기간 이용 시 최대 할인"
      }
    },
    baseServices: {
      deposit: 500000
    }
  }

  const currentRental = productInfo.rentalOptions[selectedPeriod]
  const selectedCategoryData = TEMPLATES_WITH_DATA.find(cat => cat.id === selectedCategory)

  // 로그인이 필요한 단계에서 로그인 체크
  const handleNext = () => {
    if (currentStep >= 1 && !user) {
      setShowLoginAlert(true)
      return
    }
    handleNextStep()
  }

  const handleBackToCategory = () => {
    setSelectedCategory('')
    // currentStep을 3으로 설정하는 대신 handlePrevStep 사용
    if (currentStep > 3) {
      // 4단계에서 3단계로 돌아가는 경우
      handlePrevStep()
    }
  }

  return (
    <section className="pt-24 pb-12 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* 섹션 헤더 */}
        <div className="text-center mb-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange rounded-full mb-4 shadow-lg">
            <span className="text-xl">🚀</span>
          </div>
          <h2 className="text-4xl font-bold text-black mb-4">
            PREMIUM RENTAL SERVICE
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            프리미엄 홀로그램 화환 렌탈 서비스로 특별한 순간을 더욱 빛나게 만들어보세요
          </p>
        </div>

        {/* 로그인 알림 모달 */}
        <LoginAlert 
          show={showLoginAlert} 
          onClose={() => setShowLoginAlert(false)} 
        />

        {/* 진행 단계 표시 */}
        <ProgressBar currentStep={currentStep} />

        {/* 단계별 컨텐츠 */}
        <div className="min-h-[320px]">
          
          {/* STEP 1: 색상 선택 */}
          {currentStep === 1 && (
            <ColorStep 
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
            />
          )}

          {/* STEP 2: 기간 선택 */}
          {currentStep === 2 && (
            <PeriodStep 
              selectedPeriod={selectedPeriod}
              onPeriodSelect={setSelectedPeriod}
            />
          )}

          {/* STEP 3: 카테고리 선택 */}
          {currentStep === 3 && (
            <CategoryStep 
              onCategorySelect={handleCategorySelect}
            />
          )}

          {/* STEP 4: 템플릿 선택 */}
          {currentStep === 4 && selectedCategoryData && (
            <TemplateStep 
              selectedCategory={selectedCategory}
              onTemplateSelect={handleTemplateSelect}
              onBackToCategory={handleBackToCategory}
            />
          )}

          {/* STEP 5: 템플릿 정보 입력 */}
          {currentStep === 5 && selectedTemplate && (
            <DataInputStep 
              selectedTemplate={selectedTemplate}
              templateData={templateData}
              onTextFieldChange={handleTextFieldChange}
              onImageFieldChange={handleImageFieldChange}
            />
          )}

          {/* STEP 6: 최종 확인 및 결제 */}
          {currentStep === 6 && (
            <PaymentStep 
              selectedColor={selectedColor}
              selectedTemplate={selectedTemplate!}
              selectedCategoryData={selectedCategoryData}
              currentRental={currentRental}
              productInfo={productInfo}
              agreements={agreements}
              onAgreementChange={setAgreements}
            />
          )}
        </div>

        {/* 하단 버튼 */}
        <StepNavigation 
          currentStep={currentStep}
          selectedColor={selectedColor}
          selectedTemplate={selectedTemplate}
          templateData={templateData}
          agreements={agreements}
          currentRental={currentRental}
          onNext={handleNext}
          onPrev={handlePrevStep}
        />
      </div>
    </section>
  )
}
