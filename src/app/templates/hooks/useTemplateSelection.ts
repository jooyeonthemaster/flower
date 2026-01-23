'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { TemplateMetadata } from '@/types/template'
import { TEMPLATES_WITH_DATA } from '@/data/templates'
import { ViewMode, ActiveTab, RentalInfo, UseTemplateSelectionReturn } from '../types'

export function useTemplateSelection(): UseTemplateSelectionReturn {
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateMetadata | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('categories')

  // 렌탈 관련 상태
  const [isRentalMode, setIsRentalMode] = useState(false)
  const [rentalInfo, setRentalInfo] = useState<RentalInfo>({
    period: 'daily',
    color: 'blue',
    amount: 120000
  })

  // 상세 페이지 상태
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview')
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

  return {
    selectedCategory,
    selectedTemplate,
    viewMode,
    isRentalMode,
    rentalInfo,
    activeTab,
    expandedTextFields,
    expandedImageFields,
    showGuide,
    selectedCategoryData,
    handleCategorySelect,
    handleTemplateSelect,
    handleBackToCategories,
    handleBackToTemplates,
    toggleTextField,
    toggleImageField,
    setActiveTab,
    setShowGuide,
  }
}
