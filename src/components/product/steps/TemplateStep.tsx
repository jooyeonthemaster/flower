import { TemplateMetadata } from '@/types/template'
import { TEMPLATES_WITH_DATA } from '@/data/templates'

interface TemplateStepProps {
  selectedCategory: string
  onTemplateSelect: (template: TemplateMetadata) => void
  onBackToCategory: () => void
}

export default function TemplateStep({ selectedCategory, onTemplateSelect, onBackToCategory }: TemplateStepProps) {
  const selectedCategoryData = TEMPLATES_WITH_DATA.find(cat => cat.id === selectedCategory)

  if (!selectedCategoryData) {
    return (
      <div className="text-center">
        <p className="text-gray-600">카테고리를 찾을 수 없습니다.</p>
        <button onClick={onBackToCategory} className="mt-4 px-4 py-2 bg-orange text-white rounded">
          카테고리 다시 선택
        </button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-center space-x-4 mb-6">
        <button
          onClick={onBackToCategory}
          className="flex items-center space-x-2 text-orange hover:text-[#d15a1f] font-medium transition-colors duration-200"
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
            <div key={template.id} className="group bg-white/70 backdrop-blur-sm border-2 border-white/20 rounded-2xl overflow-hidden hover:border-orange/60 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              {/* 미리보기 영역 */}
              <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-b border-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange/10 to-dusty-rose/10"></div>
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
                    <div className="text-lg font-bold text-orange">{template.textFields.length}</div>
                    <div className="text-xs text-gray-500">텍스트</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{template.imageFields.length}</div>
                    <div className="text-xs text-gray-500">이미지</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-dusty-rose">{template.estimatedSetupTime}</div>
                    <div className="text-xs text-gray-500">시간</div>
                  </div>
                </div>

                <button
                  onClick={() => onTemplateSelect(template)}
                  className="w-full py-3 bg-gradient-to-r from-orange to-dusty-rose text-white font-medium rounded-xl hover:from-[#d15a1f] hover:to-[#c78a8a] transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-sm"
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
    </div>
  )
}
