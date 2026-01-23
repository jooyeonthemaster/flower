'use client'

import { TEMPLATES_WITH_DATA } from '@/data/templates'
import { RentalInfo } from '../types'

interface CategoryViewProps {
  isRentalMode: boolean
  rentalInfo: RentalInfo
  onCategorySelect: (categoryId: string) => void
}

export default function CategoryView({ isRentalMode, rentalInfo, onCategorySelect }: CategoryViewProps) {
  return (
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
              onClick={() => onCategorySelect(category.id)}
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
  )
}
