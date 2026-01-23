'use client'

import Link from 'next/link'
import { ViewMode } from '../types'

interface TemplateHeaderProps {
  isRentalMode: boolean
  viewMode: ViewMode
}

export default function TemplateHeader({ isRentalMode, viewMode }: TemplateHeaderProps) {
  const getStepText = () => {
    const prefix = isRentalMode ? 'RENTAL ' : ''
    switch (viewMode) {
      case 'categories':
        return `${prefix}STEP 1/3: 카테고리 선택`
      case 'templates':
        return `${prefix}STEP 2/3: 템플릿 선택`
      case 'preview':
        return `${prefix}STEP 3/3: 상세 확인`
    }
  }

  return (
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
            {getStepText()}
          </div>
        </div>
      </div>
    </header>
  )
}
