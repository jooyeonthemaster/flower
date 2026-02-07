'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { TemplateMetadata } from '@/types/template'
import { TEMPLATES_WITH_DATA } from '@/data/templates'
import TemplatePreview from './components/TemplatePreview'

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
                <div className="mt-4 inline-flex items-center px-4 py-2 bg-orange/20 text-orange rounded-full text-sm font-medium">
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
              <button onClick={handleBackToCategories} className="text-orange hover:text-orange">
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
          <TemplatePreview
            selectedTemplate={selectedTemplate}
            selectedCategoryName={selectedCategoryData?.name}
            isRentalMode={isRentalMode}
            rentalInfo={rentalInfo}
            onBackToCategories={handleBackToCategories}
            onBackToTemplates={handleBackToTemplates}
          />
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