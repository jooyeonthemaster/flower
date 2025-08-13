'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { TemplateMetadata } from '@/types/template'
import { TEMPLATES_WITH_DATA } from '@/data/templates'
import PaymentButton from '@/components/payment/PaymentButton'

function TemplatesPageContent() {
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateMetadata | null>(null)
  const [viewMode, setViewMode] = useState<'categories' | 'templates' | 'preview'>('categories')
  
  // 렌탈 관련 상태
  const [isRentalMode, setIsRentalMode] = useState(false)
  const [rentalInfo, setRentalInfo] = useState({
    period: 'daily',
    color: 'blue',
    amount: 120000
  })
  
  // 상세 페이지 상태
  const [activeTab, setActiveTab] = useState<'overview' | 'text' | 'image'>('overview')
  const [expandedTextFields, setExpandedTextFields] = useState<number[]>([])
  const [expandedImageFields, setExpandedImageFields] = useState<number[]>([])
  const [showGuide, setShowGuide] = useState(true)

  // 렌탈 쿼리 파라미터 처리
  useEffect(() => {
    const rental = searchParams.get('rental')
    const period = searchParams.get('period')
    const color = searchParams.get('color')
    const amount = searchParams.get('amount')

    if (rental === 'true') {
      setIsRentalMode(true)
      setRentalInfo({
        period: period || 'daily',
        color: color || 'blue',
        amount: parseInt(amount || '120000')
      })
    }
  }, [searchParams])

  const selectedCategoryData = TEMPLATES_WITH_DATA.find(cat => cat.id === selectedCategory)

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setViewMode('templates')
    setSelectedTemplate(null)
  }

  const handleTemplateSelect = (template: TemplateMetadata) => {
    setSelectedTemplate(template)
    setViewMode('preview')
    setActiveTab('overview')
    setExpandedTextFields([])
    setExpandedImageFields([])
  }

  const handleBackToCategories = () => {
    setViewMode('categories')
    setSelectedCategory('')
    setSelectedTemplate(null)
  }

  const handleBackToTemplates = () => {
    setViewMode('templates')
    setSelectedTemplate(null)
  }

  const toggleTextField = (index: number) => {
    setExpandedTextFields(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const toggleImageField = (index: number) => {
    setExpandedImageFields(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href={isRentalMode ? "/rental" : "/"} className="text-gray-600 hover:text-gray-900">
                ← {isRentalMode ? '렌탈 페이지로' : '메인으로'} 돌아가기
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">
                {isRentalMode ? '렌탈용 ' : ''}홀로그램 템플릿 선택
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              {viewMode === 'categories' && (isRentalMode ? 'RENTAL STEP 1/3: 카테고리 선택' : 'STEP 1/3: 카테고리 선택')}
              {viewMode === 'templates' && (isRentalMode ? 'RENTAL STEP 2/3: 템플릿 선택' : 'STEP 2/3: 템플릿 선택')}
              {viewMode === 'preview' && (isRentalMode ? 'RENTAL STEP 3/3: 상세 확인' : 'STEP 3/3: 상세 확인')}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 카테고리 선택 화면 */}
        {viewMode === 'categories' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">카테고리 선택</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {isRentalMode 
                  ? `${rentalInfo.color === 'blue' ? '블루' : '레드'} 타입 홀로그램 화환 렌탈용 카테고리를 선택해주세요.`
                  : '화환을 사용할 목적에 맞는 카테고리를 선택해주세요. 각 카테고리별로 최적화된 템플릿을 제공합니다.'
                }
              </p>
              {isRentalMode && (
                <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  렌탈 모드: {rentalInfo.period === 'daily' ? '일간' : rentalInfo.period === 'weekly' ? '주간' : '월간'} ₩{rentalInfo.amount.toLocaleString()}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {TEMPLATES_WITH_DATA
                .sort((a, b) => a.popularityRank - b.popularityRank)
                .map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className="bg-white border border-gray-200 p-6 text-center hover:border-gray-400 hover:shadow-lg transition-all duration-200 group"
                  >
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                      {category.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 inline-block">
                      {category.templates.length}개 템플릿
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* 템플릿 선택 화면 */}
        {viewMode === 'templates' && selectedCategoryData && (
          <div className="space-y-8">
            {/* 브레드크럼 */}
            <div className="flex items-center space-x-2 text-sm">
              <button onClick={handleBackToCategories} className="text-blue-600 hover:text-blue-800">
                카테고리
              </button>
              <span className="text-gray-400">&gt;</span>
              <span className="text-gray-900 font-medium">{selectedCategoryData.name}</span>
            </div>

            {/* 선택된 카테고리 정보 */}
            <div className="bg-white border border-gray-200 p-6">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{selectedCategoryData.icon}</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedCategoryData.name}</h2>
                  <p className="text-gray-600">{selectedCategoryData.description}</p>
                </div>
              </div>
            </div>

            {/* 템플릿 목록 */}
            {selectedCategoryData.templates.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {selectedCategoryData.templates.map((template) => (
                  <div key={template.id} className="bg-white border border-gray-200 overflow-hidden group hover:border-gray-400 hover:shadow-lg transition-all duration-200">
                    {/* 미리보기 영역 */}
                    <div className="aspect-video bg-gray-100 flex items-center justify-center border-b border-gray-200">
                      <div className="text-center text-gray-500">
                        <div className="w-16 h-16 bg-gray-300 mx-auto mb-2 flex items-center justify-center">
                          <span className="text-2xl">🎬</span>
                        </div>
                        <div className="text-sm font-medium">미리보기 영상</div>
                        <div className="text-xs text-gray-400 mt-1">{template.previewGif}</div>
                      </div>
                    </div>

                    {/* 템플릿 정보 */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg text-gray-900">{template.name}</h3>
                        <div className="flex space-x-1">
                          <span className={`px-2 py-1 text-xs font-medium border ${
                            template.difficulty === 'easy' 
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : template.difficulty === 'medium'
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {template.difficulty === 'easy' ? '쉬움' : template.difficulty === 'medium' ? '보통' : '고급'}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4">{template.description}</p>

                      {/* 템플릿 정보 그리드 */}
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4 bg-gray-50 p-4 border border-gray-200">
                        <div>
                          <div className="text-gray-500">설정 시간</div>
                          <div className="font-medium text-gray-900">{template.estimatedSetupTime}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">인기도</div>
                          <div className="font-medium text-gray-900">{template.popularityScore}%</div>
                        </div>
                        <div>
                          <div className="text-gray-500">텍스트 필드</div>
                          <div className="font-medium text-gray-900">{template.textFields.length}개</div>
                        </div>
                        <div>
                          <div className="text-gray-500">이미지 필드</div>
                          <div className="font-medium text-gray-900">{template.imageFields.length}개</div>
                        </div>
                      </div>

                      {/* 태그 */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {template.tags.slice(0, 4).map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs border border-gray-300">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* 선택 버튼 */}
                      <button
                        onClick={() => handleTemplateSelect(template)}
                        className="w-full py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors duration-200"
                      >
                        상세 정보 보기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 p-12 text-center">
                <div className="text-4xl text-gray-300 mb-4">🚧</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">준비 중인 카테고리입니다</h3>
                <p className="text-gray-600 mb-4">곧 다양한 템플릿이 추가될 예정입니다.</p>
                <button
                  onClick={handleBackToCategories}
                  className="px-6 py-2 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200"
                >
                  다른 카테고리 선택
                </button>
              </div>
            )}
          </div>
        )}

        {/* 템플릿 상세 화면 */}
        {viewMode === 'preview' && selectedTemplate && (
          <div className="space-y-6">
            {/* 브레드크럼 */}
            <div className="flex items-center space-x-2 text-sm">
              <button 
                onClick={handleBackToCategories} 
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 hover:underline"
              >
                카테고리
              </button>
              <span className="text-gray-400">&gt;</span>
              <button 
                onClick={handleBackToTemplates} 
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 hover:underline"
              >
                {selectedCategoryData?.name}
              </button>
              <span className="text-gray-400">&gt;</span>
              <span className="text-gray-900 font-medium">{selectedTemplate.name}</span>
            </div>

            {/* 상단 헤더 */}
            <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {selectedTemplate.name}
                      </h2>
                      <div className="text-2xl">🎬</div>
                    </div>
                    <p className="text-xl text-gray-600 mb-6 leading-relaxed">{selectedTemplate.description}</p>
                    <div className="flex flex-wrap gap-3">
                      <span className={`px-4 py-2 border font-semibold shadow-sm transition-all duration-200 hover:shadow-md ${
                        selectedTemplate.difficulty === 'easy' 
                          ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-300'
                          : selectedTemplate.difficulty === 'medium'
                          ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-300'
                          : 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-300'
                      }`}>
                        🎯 {selectedTemplate.difficulty === 'easy' ? '쉬움' 
                             : selectedTemplate.difficulty === 'medium' ? '보통' : '고급'}
                      </span>
                      <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-300 font-semibold shadow-sm hover:shadow-md transition-all duration-200">
                        ⭐ 인기도 {selectedTemplate.popularityScore}%
                      </span>
                      <span className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border border-gray-300 font-semibold shadow-sm hover:shadow-md transition-all duration-200">
                        ⏱️ {selectedTemplate.estimatedSetupTime}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <PaymentButton 
                      amount={isRentalMode ? rentalInfo.amount : 120000}
                      orderName={isRentalMode 
                        ? `홀로그램 화환 렌탈 - ${selectedTemplate.name} (${rentalInfo.color === 'blue' ? '블루' : '레드'})`
                        : `홀로그램 화환 - ${selectedTemplate.name}`
                      }
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 hover:from-blue-700 hover:to-blue-800"
                    />
                    {!isRentalMode && (
                      <Link
                        href={`/rental?template=${selectedTemplate.id}`}
                        className="px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 hover:from-green-700 hover:to-green-800"
                      >
                        📝 렌탈 문의
                      </Link>
                    )}
                    <button
                      onClick={handleBackToTemplates}
                      className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      🔄 다른 템플릿
                    </button>
                  </div>
                </div>
              </div>
              <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* 왼쪽: 미리보기 */}
              <div className="lg:col-span-2 space-y-6">
                {/* GIF 미리보기 */}
                <div className="bg-white border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-5 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900 flex items-center space-x-2">
                      <span className="text-xl">🎬</span>
                      <span>홀로그램 미리보기</span>
                    </h3>
                  </div>
                  <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30"></div>
                    <div className="text-center text-gray-500 z-10">
                      <div className="w-28 h-28 bg-gradient-to-br from-gray-300 to-gray-400 mx-auto mb-4 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                        <span className="text-5xl">🎬</span>
                      </div>
                      <div className="font-semibold text-xl text-gray-700 mb-2">GIF 미리보기 영상</div>
                      <div className="text-sm text-gray-500 bg-white/80 px-3 py-1 inline-block shadow-sm">
                        {selectedTemplate.previewGif}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 통계 및 가이드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 템플릿 통계 */}
                  <div className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-5 border-b border-gray-200">
                      <h3 className="font-bold text-gray-900 flex items-center space-x-2">
                        <span className="text-xl">📊</span>
                        <span>템플릿 정보</span>
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-6 text-center">
                        <div className="group">
                          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-200">
                            {selectedTemplate.textFields.length}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">📝 텍스트 필드</div>
                        </div>
                        <div className="group">
                          <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-200">
                            {selectedTemplate.imageFields.length}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">🖼️ 이미지 필드</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 설정 가이드 토글 */}
                  <div className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <button
                      onClick={() => setShowGuide(!showGuide)}
                      className="w-full p-5 text-left border-b border-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 flex items-center space-x-2">
                          <span className="text-xl">📋</span>
                          <span>설정 가이드</span>
                        </h3>
                        <span className={`text-gray-400 text-xl transform transition-transform duration-300 ${showGuide ? 'rotate-180' : ''}`}>
                          ↓
                        </span>
                      </div>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      showGuide ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="p-5 space-y-4 bg-gradient-to-b from-white to-gray-50">
                        {[
                          { num: 1, title: "정보 준비", desc: "필요한 텍스트와 이미지 준비", icon: "📝" },
                          { num: 2, title: "신청서 작성", desc: "정보 입력 및 이미지 업로드", icon: "✍️" },
                          { num: 3, title: "제작 완료", desc: `${selectedTemplate.estimatedSetupTime} 소요`, icon: "✨" }
                        ].map((step, idx) => (
                          <div key={idx} className="flex items-start space-x-3 group">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform duration-200">
                              {step.num}
                            </div>
                            <div className="text-sm flex-1">
                              <div className="font-semibold text-gray-900 flex items-center space-x-2">
                                <span>{step.icon}</span>
                                <span>{step.title}</span>
                              </div>
                              <div className="text-gray-600 mt-1">{step.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 오른쪽: 요구사항 정보 */}
              <div className="space-y-6">
                
                {/* 요약 카드 */}
                <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-5 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900 flex items-center space-x-2">
                      <span className="text-xl">📋</span>
                      <span>필요한 정보 요약</span>
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {[
                      { label: "텍스트 필드", value: `${selectedTemplate.textFields.length}개`, icon: "📝", color: "blue" },
                      { label: "이미지 필드", value: `${selectedTemplate.imageFields.length}개`, icon: "🖼️", color: "green" },
                      { 
                        label: "필수 항목", 
                        value: `${selectedTemplate.textFields.filter(f => f.required).length + selectedTemplate.imageFields.filter(f => f.required).length}개`, 
                        icon: "⚠️", 
                        color: "red" 
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 transition-colors duration-200 border border-gray-100 shadow-sm">
                        <span className="text-gray-700 font-medium flex items-center space-x-2">
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </span>
                        <span className={`font-bold ${
                          item.color === 'red' ? 'text-red-600' : 
                          item.color === 'green' ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 탭 네비게이션 */}
                <div className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="flex border-b border-gray-200 bg-gray-50">
                    {[
                      { id: 'overview', label: '개요', icon: '📄', count: null },
                      { id: 'text', label: '텍스트', icon: '📝', count: selectedTemplate.textFields.length },
                      { id: 'image', label: '이미지', icon: '🖼️', count: selectedTemplate.imageFields.length }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as 'overview' | 'text' | 'image')}
                        className={`flex-1 p-4 text-center font-semibold transition-all duration-200 relative ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-b from-blue-50 to-blue-100 text-blue-700 shadow-inner'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <span>{tab.icon}</span>
                          <span>{tab.label}</span>
                          {tab.count !== null && (
                            <span className={`px-2 py-1 text-xs font-bold border shadow-sm ${
                              activeTab === tab.id 
                                ? 'bg-blue-200 text-blue-800 border-blue-300' 
                                : 'bg-gray-200 text-gray-700 border-gray-300'
                            }`}>
                              {tab.count}
                            </span>
                          )}
                        </div>
                        {activeTab === tab.id && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* 탭 콘텐츠 */}
                  <div className="p-6 min-h-[300px]">
                    {/* 개요 탭 */}
                    {activeTab === 'overview' && (
                      <div className="space-y-6 animate-fadeIn">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                            <span>🏷️</span>
                            <span>태그</span>
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedTemplate.tags.map((tag, idx) => (
                              <span key={idx} className="px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-sm border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200 font-medium">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-5 shadow-md">
                          <h4 className="font-semibold text-yellow-900 mb-3 flex items-center space-x-2">
                            <span>⚠️</span>
                            <span>주의사항</span>
                          </h4>
                          <div className="text-sm text-yellow-800 space-y-2">
                            {[
                              "모든 필수 정보를 정확히 입력해주세요",
                              "고해상도 이미지 사용 권장",
                              "제작 완료 후 수정 어려움"
                            ].map((item, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <span className="text-yellow-600">•</span>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 텍스트 탭 */}
                    {activeTab === 'text' && (
                      <div className="space-y-3 animate-fadeIn">
                        {selectedTemplate.textFields.map((field, idx) => (
                          <div key={idx} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                            <button
                              onClick={() => toggleTextField(idx)}
                              className="w-full p-4 text-left hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                  <span className="text-lg">📝</span>
                                  <span className="font-semibold text-gray-900">{field.label}</span>
                                  {field.required && (
                                    <span className="px-2 py-1 bg-gradient-to-r from-red-100 to-red-200 text-red-700 text-xs font-bold border border-red-300 shadow-sm">
                                      필수
                                    </span>
                                  )}
                                </div>
                                <span className={`text-gray-400 text-lg transform transition-transform duration-300 ${
                                  expandedTextFields.includes(idx) ? 'rotate-180' : ''
                                }`}>
                                  ↓
                                </span>
                              </div>
                            </button>
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                              expandedTextFields.includes(idx) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}>
                              <div className="p-4 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200 space-y-3">
                                <p className="text-gray-700">{field.description}</p>
                                <div className="bg-white border-l-4 border-blue-400 p-3 shadow-sm">
                                  <div className="text-xs text-blue-600 font-semibold mb-1">💡 예시:</div>
                                  <div className="text-gray-900 font-medium">{field.placeholder}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                  <div className="bg-green-50 border border-green-200 p-2 text-center">
                                    <div className="text-green-600 font-semibold">권장 길이</div>
                                    <div className="text-green-800 font-bold">{field.recommendedLength}자</div>
                                  </div>
                                  <div className="bg-red-50 border border-red-200 p-2 text-center">
                                    <div className="text-red-600 font-semibold">최대 길이</div>
                                    <div className="text-red-800 font-bold">{field.maxLength}자</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 이미지 탭 */}
                    {activeTab === 'image' && (
                      <div className="space-y-3 animate-fadeIn">
                        {selectedTemplate.imageFields.map((field, idx) => (
                          <div key={idx} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                            <button
                              onClick={() => toggleImageField(idx)}
                              className="w-full p-4 text-left hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                  <span className="text-lg">🖼️</span>
                                  <span className="font-semibold text-gray-900">{field.label}</span>
                                  {field.required && (
                                    <span className="px-2 py-1 bg-gradient-to-r from-red-100 to-red-200 text-red-700 text-xs font-bold border border-red-300 shadow-sm">
                                      필수
                                    </span>
                                  )}
                                </div>
                                <span className={`text-gray-400 text-lg transform transition-transform duration-300 ${
                                  expandedImageFields.includes(idx) ? 'rotate-180' : ''
                                }`}>
                                  ↓
                                </span>
                              </div>
                            </button>
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                              expandedImageFields.includes(idx) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                            }`}>
                              <div className="p-4 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200 space-y-4">
                                <p className="text-gray-700">{field.description}</p>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                  {[
                                    { label: "이미지 비율", value: field.aspectRatio, icon: "📐", color: "blue" },
                                    { label: "파일 크기", value: `최대 ${field.maxSizeMB}MB`, icon: "💾", color: "green" },
                                    { label: "파일 형식", value: field.formats.join(', '), icon: "📄", color: "purple" },
                                    { 
                                      label: "배경 권장", 
                                      value: field.backgroundColor === 'transparent' ? '투명' 
                                             : field.backgroundColor === 'white' ? '흰색' : '무관', 
                                      icon: "🎨", 
                                      color: "orange" 
                                    }
                                  ].map((spec, specIdx) => (
                                    <div key={specIdx} className={`bg-${spec.color}-50 border border-${spec.color}-200 p-3 text-center shadow-sm`}>
                                      <div className={`text-${spec.color}-600 font-semibold flex items-center justify-center space-x-1`}>
                                        <span>{spec.icon}</span>
                                        <span>{spec.label}</span>
                                      </div>
                                      <div className={`text-${spec.color}-800 font-bold mt-1`}>{spec.value}</div>
                                    </div>
                                  ))}
                                </div>
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-3 shadow-sm">
                                  <div className="text-sm font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                                    <span>💡</span>
                                    <span>이미지 예시</span>
                                  </div>
                                  <div className="text-sm text-blue-700 space-y-1">
                                    {field.examples.map((example, exampleIdx) => (
                                      <div key={exampleIdx} className="flex items-center space-x-2">
                                        <span className="text-blue-500">•</span>
                                        <span>{example}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <TemplatesPageContent />
    </Suspense>
  )
} 