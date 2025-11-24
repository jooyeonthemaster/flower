'use client'

import { useState } from 'react'
import { TemplateMetadata } from '@/types/template'

export interface ProductWizardState {
  currentStep: number
  selectedColor: 'blue' | 'red'
  selectedPeriod: 'daily' | 'weekly' | 'monthly'
  selectedCategory: string
  selectedTemplate: TemplateMetadata | null
  templateData: {
    textData: Record<string, string>
    imageData: Record<string, File | string>
  }
  agreements: {
    terms: boolean
    privacy: boolean
    refund: boolean
    ecommerce: boolean
  }
  showLoginAlert: boolean
}

export interface ProductWizardActions {
  setCurrentStep: (step: number) => void
  setSelectedColor: (color: 'blue' | 'red') => void
  setSelectedPeriod: (period: 'daily' | 'weekly' | 'monthly') => void
  setSelectedCategory: (category: string) => void
  setSelectedTemplate: (template: TemplateMetadata | null) => void
  setTemplateData: (data: ProductWizardState['templateData']) => void
  setAgreements: (agreements: ProductWizardState['agreements']) => void
  setShowLoginAlert: (show: boolean) => void
  handleNextStep: () => void
  handlePrevStep: () => void
  handleCategorySelect: (categoryId: string) => void
  handleTemplateSelect: (template: TemplateMetadata) => void
  handleTextFieldChange: (fieldName: string, value: string) => void
  handleImageFieldChange: (fieldName: string, file: File) => void
}

export function useProductWizard(): ProductWizardState & ProductWizardActions {
  // 상태 정의
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedColor, setSelectedColor] = useState<'blue' | 'red'>('blue')
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateMetadata | null>(null)
  const [templateData, setTemplateData] = useState<{
    textData: Record<string, string>
    imageData: Record<string, File | string>
  }>({
    textData: {},
    imageData: {}
  })
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    refund: false,
    ecommerce: false
  })
  const [showLoginAlert, setShowLoginAlert] = useState(false)

  // 액션 함수들
  const handleNextStep = () => {
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

  return {
    // 상태
    currentStep,
    selectedColor,
    selectedPeriod,
    selectedCategory,
    selectedTemplate,
    templateData,
    agreements,
    showLoginAlert,
    // 액션
    setCurrentStep,
    setSelectedColor,
    setSelectedPeriod,
    setSelectedCategory,
    setSelectedTemplate,
    setTemplateData,
    setAgreements,
    setShowLoginAlert,
    handleNextStep,
    handlePrevStep,
    handleCategorySelect,
    handleTemplateSelect,
    handleTextFieldChange,
    handleImageFieldChange
  }
}
