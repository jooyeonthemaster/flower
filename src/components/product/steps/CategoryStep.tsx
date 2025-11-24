import { TEMPLATES_WITH_DATA } from '@/data/templates'

interface CategoryStepProps {
  onCategorySelect: (categoryId: string) => void
}

export default function CategoryStep({ onCategorySelect }: CategoryStepProps) {
  return (
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
                onClick={isEnabled ? () => onCategorySelect(category.id) : undefined}
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
