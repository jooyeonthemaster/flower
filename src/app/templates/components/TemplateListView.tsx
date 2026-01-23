'use client'

import { TemplateMetadata } from '@/types/template'

interface CategoryData {
  id: string
  name: string
  icon: string
  description: string
  templates: TemplateMetadata[]
}

interface TemplateListViewProps {
  categoryData: CategoryData
  onBackToCategories: () => void
  onTemplateSelect: (template: TemplateMetadata) => void
}

export default function TemplateListView({
  categoryData,
  onBackToCategories,
  onTemplateSelect,
}: TemplateListViewProps) {
  return (
    <div className="space-y-8">
      {/* 브레드크럼 */}
      <div className="flex items-center space-x-2 text-sm">
        <button onClick={onBackToCategories} className="text-blue-600 hover:text-blue-800">
          카테고리
        </button>
        <span className="text-gray-400">&gt;</span>
        <span className="text-gray-900 font-medium">{categoryData.name}</span>
      </div>

      {/* 선택된 카테고리 정보 */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="text-2xl">{categoryData.icon}</div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{categoryData.name}</h2>
            <p className="text-gray-600">{categoryData.description}</p>
          </div>
        </div>
      </div>

      {/* 템플릿 목록 */}
      {categoryData.templates.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {categoryData.templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={onTemplateSelect}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <div className="text-4xl text-gray-300 mb-4">🚧</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">준비 중인 카테고리입니다</h3>
          <p className="text-gray-600 mb-4">곧 다양한 템플릿이 추가될 예정입니다.</p>
          <button
            onClick={onBackToCategories}
            className="px-6 py-2 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200"
          >
            다른 카테고리 선택
          </button>
        </div>
      )}
    </div>
  )
}

interface TemplateCardProps {
  template: TemplateMetadata
  onSelect: (template: TemplateMetadata) => void
}

function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <div className="bg-white border border-gray-200 overflow-hidden group hover:border-gray-400 hover:shadow-lg transition-all duration-200">
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
          onClick={() => onSelect(template)}
          className="w-full py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors duration-200"
        >
          상세 정보 보기
        </button>
      </div>
    </div>
  )
}
