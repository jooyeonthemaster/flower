interface ProgressBarProps {
  currentStep: number
  totalSteps?: number
}

export default function ProgressBar({ currentStep, totalSteps = 6 }: ProgressBarProps) {
  const stepConfig = [
    { num: 1, label: '색상', icon: '🎨' },
    { num: 2, label: '기간', icon: '⏱️' },
    { num: 3, label: '카테고리', icon: '📂' },
    { num: 4, label: '템플릿', icon: '🎬' },
    { num: 5, label: '정보입력', icon: '✍️' },
    { num: 6, label: '결제', icon: '💳' }
  ]

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "색상을 선택해주세요"
      case 2: return "렌트 기간을 선택해주세요"
      case 3: return "템플릿 카테고리를 선택해주세요"
      case 4: return "사용하실 템플릿을 선택해주세요"
      case 5: return "템플릿 정보를 입력해주세요"
      case 6: return "최종 확인 후 결제해주세요"
      default: return ""
    }
  }

  return (
    <div className="mb-4 py-4" style={{ marginTop: '12px' }}>
      <div className="max-w-4xl mx-auto">
        {/* 메인 진행률 바 */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            {stepConfig.map((step, index) => (
              <div key={step.num} className="flex items-center">
                {/* 단계 표시 */}
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    currentStep === step.num 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                      : currentStep > step.num
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.num ? '✓' : step.num}
                  </div>
                  <div className="hidden sm:block">
                    <div className={`text-sm font-medium ${
                      currentStep >= step.num ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </div>
                  </div>
                </div>
                
                {/* 연결선 */}
                {index < stepConfig.length - 1 && (
                  <div className="flex-1 mx-4 sm:mx-6">
                    <div className={`h-0.5 w-full transition-all duration-300 ${
                      currentStep > step.num 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                        : 'bg-gray-300'
                    }`}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* 현재 단계 정보 */}
        <div className="text-center mt-3">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200">
            <span>{stepConfig[currentStep - 1]?.icon}</span>
            <span>{stepConfig[currentStep - 1]?.label} 단계</span>
            <span className="text-blue-500">({currentStep}/{totalSteps})</span>
          </div>
        </div>
      </div>

      {/* 단계별 제목 */}
      <div className="text-center mb-4 mt-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{getStepTitle()}</h3>
        <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
      </div>
    </div>
  )
}
