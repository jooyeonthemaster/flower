'use client'

import { useState } from 'react'
import { TemplateMetadata } from '@/types/template'
import { TEMPLATES_WITH_DATA } from '@/data/templates'
import PaymentButton from '@/components/payment/PaymentButton'
import { useAuth } from '@/contexts/AuthContext'

type RentalOption = {
  name: string
  price: number
  unit: string
  description: string
  minDays: number
  maxDays: number
  note: string
  dailyPrice?: number
}

export default function ProductSection() {
  const { user, signInWithGoogle } = useAuth()
  
  // 단계 관리 (1: 색상, 2: 기간, 3: 템플릿카테고리, 4: 템플릿선택, 5: 정보입력, 6: 최종확인)
  const [currentStep, setCurrentStep] = useState(1)
  
  // 선택된 옵션들
  const [selectedColor, setSelectedColor] = useState<'blue' | 'red'>('blue')
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateMetadata | null>(null)
  
  // 템플릿 정보 입력
  const [templateData, setTemplateData] = useState<{
    textData: Record<string, string>
    imageData: Record<string, File | string>
  }>({
    textData: {},
    imageData: {}
  })
  
  // UI 상태
  const [showLoginAlert, setShowLoginAlert] = useState(false)

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
      } as RentalOption,
      weekly: {
        name: "주간 렌트",
        price: 700000,
        unit: "주",
        description: "1주 단위 렌트 (7일)",
        minDays: 7,
        maxDays: 27,
        dailyPrice: 100000,
        note: "중기간 행사에 경제적"
      } as RentalOption,
      monthly: {
        name: "월간 렌트",
        price: 2400000,
        unit: "월",
        description: "1개월 단위 렌트 (30일)",
        minDays: 30,
        maxDays: 365,
        dailyPrice: 80000,
        note: "장기간 이용 시 최대 할인"
      } as RentalOption
    },
    baseServices: {
      deposit: 500000
    }
  }

  const currentColor = productInfo.colorOptions[selectedColor]
  const currentRental = productInfo.rentalOptions[selectedPeriod]
  const selectedCategoryData = TEMPLATES_WITH_DATA.find(cat => cat.id === selectedCategory)

  const handleNextStep = () => {
    // 로그인 체크 (1단계부터 필요)
    if (currentStep >= 1 && !user) {
      setShowLoginAlert(true)
      return
    }
    
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedTemplate(null)
    handleNextStep()
  }

  const handleTemplateSelect = (template: TemplateMetadata) => {
    setSelectedTemplate(template)
    // 템플릿 데이터 초기화
    const initialTextData: Record<string, string> = {}
    template.textFields.forEach(field => {
      initialTextData[field.name] = ''
    })
    setTemplateData({
      textData: initialTextData,
      imageData: {}
    })
    handleNextStep()
  }

  const handleTextFieldChange = (fieldName: string, value: string) => {
    setTemplateData(prev => ({
      ...prev,
      textData: {
        ...prev.textData,
        [fieldName]: value
      }
    }))
  }

  const handleImageFieldChange = (fieldName: string, file: File) => {
    setTemplateData(prev => ({
      ...prev,
      imageData: {
        ...prev.imageData,
        [fieldName]: file
      }
    }))
  }

  // 단계별 제목
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

  // 필수 텍스트 필드 검증
  const isTemplateDataValid = () => {
    if (!selectedTemplate) return false
    
    // 필수 텍스트 필드 체크
    const requiredTextFields = selectedTemplate.textFields.filter(field => field.required)
    for (const field of requiredTextFields) {
      if (!templateData.textData[field.name] || templateData.textData[field.name].trim() === '') {
        return false
      }
    }
    
    // 필수 이미지 필드 체크
    const requiredImageFields = selectedTemplate.imageFields.filter(field => field.required)
    for (const field of requiredImageFields) {
      if (!templateData.imageData[field.name]) {
        return false
      }
    }
    
    return true
  }

  const stepConfig = [
    { num: 1, label: '색상', icon: '🎨' },
    { num: 2, label: '기간', icon: '⏱️' },
    { num: 3, label: '카테고리', icon: '📂' },
    { num: 4, label: '템플릿', icon: '🎬' },
    { num: 5, label: '정보입력', icon: '✍️' },
    { num: 6, label: '결제', icon: '💳' }
  ]

  return (
    <section className="pt-24 pb-12 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 섹션 헤더 */}
        <div className="text-center mb-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <span className="text-xl">🚀</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
            PREMIUM RENTAL SERVICE
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            프리미엄 홀로그램 화환 렌탈 서비스로 특별한 순간을 더욱 빛나게 만들어보세요
          </p>
        </div>

        {/* 로그인 알림 모달 */}
        {showLoginAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">로그인이 필요합니다</h3>
                <p className="text-gray-600 mb-6">
                  템플릿 선택을 위해서는 먼저 로그인을 해주세요.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowLoginAlert(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={async () => {
                      setShowLoginAlert(false)
                      try {
                        await signInWithGoogle()
                      } catch (error) {
                        console.error('로그인 실패:', error)
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    로그인하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 진행 단계 표시 */}
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
                <span className="text-blue-500">({currentStep}/6)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 단계별 제목 */}
                  <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{getStepTitle()}</h3>
            <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>

        {/* 단계별 컨텐츠 */}
        <div className="min-h-[320px]">
          
          {/* STEP 1: 색상 선택 */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center animate-fade-in">
              {/* 제품 이미지 */}
              <div className="lg:col-span-1">
                <div className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-2xl p-8 rounded-3xl">
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 overflow-hidden rounded-2xl relative">
                    <img 
                      src={`/images/products/hologram-wreath-${selectedColor}.jpg`}
                      alt={`${currentColor.name} 홀로그램 화환`}
                      className="w-full h-full object-contain transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  </div>
                </div>
              </div>

              {/* 색상 선택 */}
              <div className="lg:col-span-2">
                <div className="max-w-2xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {Object.entries(productInfo.colorOptions).map(([color, option]) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color as 'blue' | 'red')}
                        className={`group p-8 border-2 rounded-3xl text-center transition-all duration-500 transform hover:scale-105 ${
                          selectedColor === color
                            ? color === 'blue'
                              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl shadow-blue-500/25'
                              : 'border-red-500 bg-gradient-to-br from-red-50 to-red-100 shadow-2xl shadow-red-500/25'
                            : 'border-gray-200 bg-white/50 backdrop-blur-sm hover:border-gray-300 hover:shadow-xl'
                        }`}
                      >
                        <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl border-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                          color === 'blue' 
                            ? 'bg-gradient-to-br from-blue-600 to-blue-800 border-blue-700 shadow-lg shadow-blue-500/50' 
                            : 'bg-gradient-to-br from-red-600 to-red-800 border-red-700 shadow-lg shadow-red-500/50'
                        }`}>
                          <span className="text-2xl text-white">
                            {color === 'blue' ? '💙' : '❤️'}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-2">{option.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: 기간 선택 */}
          {currentStep === 2 && (
            <div className="max-w-4xl mx-auto animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(productInfo.rentalOptions).map(([period, option]) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period as 'daily' | 'weekly' | 'monthly')}
                    className={`p-5 border-2 rounded-2xl text-center transition-all duration-300 hover:scale-105 ${
                      selectedPeriod === period
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg shadow-blue-500/20'
                        : 'border-gray-200 bg-white/70 backdrop-blur-sm hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-10 h-10 mx-auto mb-3 rounded-xl flex items-center justify-center text-lg ${
                      selectedPeriod === period 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {period === 'daily' ? '📅' : period === 'weekly' ? '📊' : '📈'}
                    </div>
                    <div className="text-xl font-bold text-gray-900 mb-1">{option.name}</div>
                    <div className="text-sm text-gray-600 mb-3">{option.note}</div>
                    {option.dailyPrice && (
                      <div className="text-xs text-emerald-600 font-medium mb-2">
                        일당 ₩{option.dailyPrice.toLocaleString()} ({Math.round((1 - option.dailyPrice / productInfo.rentalOptions.daily.price) * 100)}% 절약)
                      </div>
                    )}
                    <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                      ₩{option.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">/ {option.unit}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: 카테고리 선택 */}
          {currentStep === 3 && (
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <p className="text-lg text-gray-600">
                  화환을 사용할 목적에 맞는 카테고리를 선택해주세요
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {TEMPLATES_WITH_DATA
                  .sort((a, b) => a.popularityRank - b.popularityRank)
                  .map((category) => {
                    const enabledCategoryIds = new Set(['wedding', 'corporate_event']);
                    const isEnabled = enabledCategoryIds.has(category.id);
                    return (
                      <button
                        key={category.id}
                        onClick={isEnabled ? () => handleCategorySelect(category.id) : undefined}
                        disabled={!isEnabled}
                        className={`group bg-white/70 backdrop-blur-sm border-2 border-white/20 p-5 text-center transition-all duration-300 rounded-2xl ${
                          isEnabled
                            ? 'hover:border-blue-400 hover:shadow-lg transform hover:scale-105'
                            : 'opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className={`text-3xl mb-3 transition-transform duration-300 ${isEnabled ? 'group-hover:scale-110' : ''}`}>
                          {category.icon}
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2 text-base">{category.name}</h3>
                        <p className="text-gray-600 mb-3 text-xs leading-relaxed">{category.description}</p>
                        <div className="inline-flex items-center justify-center px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs font-medium rounded-full">
                          {isEnabled ? `${category.templates.length}개` : '준비 중'}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* STEP 4: 템플릿 선택 */}
          {currentStep === 4 && selectedCategoryData && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <button
                  onClick={() => {
                    setSelectedCategory('')
                    setCurrentStep(3)
                  }}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  <span>←</span>
                  <span>카테고리 다시 선택</span>
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <h4 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                  <span className="text-2xl">{selectedCategoryData.icon}</span>
                  <span>{selectedCategoryData.name} 템플릿</span>
                </h4>
              </div>
              
              {selectedCategoryData.templates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedCategoryData.templates.map((template) => (
                    <div key={template.id} className="group bg-white/70 backdrop-blur-sm border-2 border-white/20 rounded-2xl overflow-hidden hover:border-blue-400 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      {/* 미리보기 영역 */}
                      <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-b border-gray-200 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30"></div>
                        <div className="text-center text-gray-500 z-10">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 mx-auto mb-2 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                            <span className="text-xl">🎬</span>
                          </div>
                          <div className="text-sm font-medium text-gray-700">미리보기</div>
                        </div>
                      </div>

                      {/* 템플릿 정보 */}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-gray-900">{template.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            template.difficulty === 'easy' 
                              ? 'bg-emerald-100 text-emerald-700'
                              : template.difficulty === 'medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {template.difficulty === 'easy' ? '쉬움' : template.difficulty === 'medium' ? '보통' : '고급'}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-3 text-sm leading-relaxed">{template.description}</p>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{template.textFields.length}</div>
                            <div className="text-xs text-gray-500">텍스트</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">{template.imageFields.length}</div>
                            <div className="text-xs text-gray-500">이미지</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">{template.estimatedSetupTime}</div>
                            <div className="text-xs text-gray-500">시간</div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleTemplateSelect(template)}
                          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-sm"
                        >
                          이 템플릿 선택하기
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/70 backdrop-blur-sm border-2 border-white/20 p-16 text-center rounded-3xl">
                  <div className="text-6xl text-gray-300 mb-6">🚧</div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-4">준비 중인 카테고리입니다</h3>
                  <p className="text-gray-600 text-lg">곧 다양한 템플릿이 추가될 예정입니다.</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: 템플릿 정보 입력 */}
          {currentStep === 5 && selectedTemplate && (
            <div className="max-w-4xl mx-auto animate-fade-in">
              <div className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg rounded-2xl p-6">
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedTemplate.name}</h4>
                  <p className="text-gray-600 text-sm">{selectedTemplate.description}</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* 텍스트 필드들 */}
                  {selectedTemplate.textFields.length > 0 && (
                    <div className="lg:col-span-2">
                      <h5 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                        <span>📝</span>
                        <span>텍스트 정보 입력</span>
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedTemplate.textFields.map((field, index) => (
                          <div key={index} className={`group ${field.maxLength > 100 ? 'md:col-span-2' : ''}`}>
                            <label className="block text-sm font-medium text-gray-900 mb-1">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <div className="relative">
                              {field.maxLength > 100 ? (
                                <textarea
                                  placeholder={field.placeholder}
                                  value={templateData.textData[field.name] || ''}
                                  onChange={(e) => handleTextFieldChange(field.name, e.target.value)}
                                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none text-sm"
                                  rows={2}
                                  maxLength={field.maxLength}
                                />
                              ) : (
                                <input
                                  type="text"
                                  placeholder={field.placeholder}
                                  value={templateData.textData[field.name] || ''}
                                  onChange={(e) => handleTextFieldChange(field.name, e.target.value)}
                                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-sm"
                                  maxLength={field.maxLength}
                                />
                              )}
                              <div className="absolute bottom-1 right-2 text-xs text-gray-400">
                                {(templateData.textData[field.name] || '').length}/{field.maxLength}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 이미지 필드들 */}
                  {selectedTemplate.imageFields.length > 0 && (
                    <div className="lg:col-span-1">
                      <h5 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                        <span>🖼️</span>
                        <span>이미지 업로드</span>
                      </h5>
                      <div className="space-y-4">
                        {selectedTemplate.imageFields.map((field, index) => (
                          <div key={index} className="group">
                            <label className="block text-sm font-medium text-gray-900 mb-1">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <div className={`border-2 border-dashed rounded-lg p-3 text-center hover:border-blue-400 transition-all duration-200 ${
                              templateData.imageData[field.name] ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50/50'
                            }`}>
                              <input
                                type="file"
                                accept={field.formats.map(f => `.${f.toLowerCase()}`).join(',')}
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) handleImageFieldChange(field.name, file)
                                }}
                                className="hidden"
                                id={`image-${field.name}`}
                              />
                              <label htmlFor={`image-${field.name}`} className="cursor-pointer block">
                                {templateData.imageData[field.name] ? (
                                  <div className="text-green-600">
                                    <div className="text-lg mb-1">✅</div>
                                    <div className="text-xs font-medium">파일 선택됨</div>
                                  </div>
                                ) : (
                                  <div className="text-gray-500">
                                    <div className="text-lg mb-1">📁</div>
                                    <div className="text-xs mb-1">파일 선택</div>
                                    <div className="text-xs text-gray-400">
                                      {field.formats.join(', ')}
                                    </div>
                                  </div>
                                )}
                              </label>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: 최종 확인 및 결제 */}
          {currentStep === 6 && (
            <div className="max-w-6xl mx-auto animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* 선택 사항 요약 */}
                <div className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-2xl rounded-3xl p-8">
                  <h4 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-2">
                    <span>📋</span>
                    <span>선택된 옵션</span>
                  </h4>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">제품</span>
                      <span className="font-semibold">{productInfo.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">색상</span>
                      <span className="font-semibold flex items-center space-x-2">
                        <span>{selectedColor === 'blue' ? '💙' : '❤️'}</span>
                        <span>{currentColor.name}</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">렌트 기간</span>
                      <span className="font-semibold">{currentRental.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">카테고리</span>
                      <span className="font-semibold flex items-center space-x-2">
                        <span>{selectedCategoryData?.icon}</span>
                        <span>{selectedCategoryData?.name}</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">템플릿</span>
                      <span className="font-semibold">{selectedTemplate?.name}</span>
                    </div>
                    
                    <div className="pt-6 border-t-2 border-gray-300">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">총 렌트 비용</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          ₩{currentRental.price.toLocaleString()}/{currentRental.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 포함 서비스 */}
                <div className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-2xl rounded-3xl p-8">
                  <h4 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-2">
                    <span>✨</span>
                    <span>포함 서비스</span>
                  </h4>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-700 flex items-center space-x-2">
                        <span>🚚</span>
                        <span>전국 무료 배송 및 설치</span>
                      </span>
                      <span className="text-emerald-600 font-bold">무료</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-700 flex items-center space-x-2">
                        <span>🛠️</span>
                        <span>24시간 기술 지원</span>
                      </span>
                      <span className="text-emerald-600 font-bold">무료</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-700 flex items-center space-x-2">
                        <span>📦</span>
                        <span>수거 및 반납 서비스</span>
                      </span>
                      <span className="text-emerald-600 font-bold">무료</span>
                    </div>
                    <div className="flex justify-between items-center py-4 pt-6 border-t border-gray-200">
                      <span className="text-gray-700 font-semibold flex items-center space-x-2">
                        <span>💰</span>
                        <span>보증금 (반납 시 환불)</span>
                      </span>
                      <span className="text-gray-900 font-bold text-lg">₩{productInfo.baseServices.deposit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="mt-8 pt-4">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            {/* 이전 버튼 */}
            <button
              onClick={handlePrevStep}
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
                  onClick={handleNextStep}
                  disabled={
                    (currentStep === 4 && !selectedTemplate) ||
                    (currentStep === 5 && !isTemplateDataValid())
                  }
                  className={`px-12 py-4 font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                    (currentStep === 4 && !selectedTemplate) ||
                    (currentStep === 5 && !isTemplateDataValid())
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
                  orderName={`홀로그램 화환 렌탈 - ${selectedTemplate?.name} (${currentColor.name})`}
                  className="px-12 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                />
              )}
            </div>
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
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </section>
  )
}