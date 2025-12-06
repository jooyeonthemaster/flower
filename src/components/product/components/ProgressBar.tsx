interface ProgressBarProps {
  currentStep: number
  totalSteps?: number
}

export default function ProgressBar({ currentStep, totalSteps = 7 }: ProgressBarProps) {
  const stepConfig = [
    { num: 1, label: '색상', icon: '🎨' },
    { num: 2, label: '기간', icon: '⏱️' },
    { num: 3, label: 'AI디자인', icon: '✨' },
    { num: 4, label: 'AI생성', icon: '🤖' },
    { num: 5, label: '결과', icon: '🎬' },
    { num: 6, label: '배송', icon: '📦' },
    { num: 7, label: '결제', icon: '💳' }
  ]

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "색상을 선택해주세요"
      case 2: return "렌트 기간을 선택해주세요"
      case 3: return "AI 홀로그램을 디자인해주세요"
      case 4: return "AI가 홀로그램을 생성 중입니다"
      case 5: return "생성된 홀로그램을 확인해주세요"
      case 6: return "배송 및 설치 정보를 입력해주세요"
      case 7: return "최종 확인 후 결제해주세요"
      default: return ""
    }
  }

  return (
    <div className="mb-4 py-4" style={{ marginTop: '12px' }}>
      <div className="max-w-3xl mx-auto px-4">
        {/* 메인 진행률 바 */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            {stepConfig.map((step, index) => (
              <div key={step.num} className="flex items-center flex-1 last:flex-none">
                {/* 단계 표시 */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    currentStep === step.num
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md scale-110'
                      : currentStep > step.num
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.num ? '✓' : step.num}
                  </div>
                  <span className={`text-xs mt-1.5 whitespace-nowrap ${
                    currentStep === step.num
                      ? 'text-blue-600 font-semibold'
                      : currentStep > step.num
                      ? 'text-green-600 font-medium'
                      : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>

                {/* 연결선 */}
                {index < stepConfig.length - 1 && (
                  <div className="flex-1 mx-1 sm:mx-2 -mt-5">
                    <div className={`h-0.5 w-full transition-all duration-300 ${
                      currentStep > step.num
                        ? 'bg-gradient-to-r from-green-500 to-green-500'
                        : 'bg-gray-200'
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
