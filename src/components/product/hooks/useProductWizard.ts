'use client'

import { useState, useRef } from 'react'

// AI 디자인 데이터 타입
export interface AIDesignData {
  category: string
  style: string
  prompt: string
  referenceImage?: string
}

// 배송/설치 정보 타입
export interface DeliveryInfo {
  recipientName: string
  recipientPhone: string
  postalCode: string
  address: string
  addressDetail: string
  installationDate: string  // YYYY-MM-DD 형식
  installationTime: string  // 오전/오후/저녁
  installationNote: string
}

// AI 생성 상태 타입
export type AIGenerationStatus =
  | 'idle'
  | 'generating-image'
  | 'image-ready'
  | 'generating-video'
  | 'video-ready'
  | 'error'

export interface ProductWizardState {
  currentStep: number
  selectedColor: 'blue' | 'red'
  selectedPeriod: 'daily' | 'weekly' | 'monthly'
  // AI 관련 상태
  aiDesignData: AIDesignData
  generatedImageUrl: string | null
  generatedVideoUrl: string | null
  aiGenerationStatus: AIGenerationStatus
  aiError: string | null
  // 배송/설치 정보
  deliveryInfo: DeliveryInfo
  // 결제 관련
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
  // AI 관련 액션
  setAIDesignData: (data: AIDesignData) => void
  updateAIDesignField: <K extends keyof AIDesignData>(field: K, value: AIDesignData[K]) => void
  setGeneratedImageUrl: (url: string | null) => void
  setGeneratedVideoUrl: (url: string | null) => void
  setAIGenerationStatus: (status: AIGenerationStatus) => void
  setAIError: (error: string | null) => void
  resetAIGeneration: () => void
  // 배송/설치 관련 액션
  setDeliveryInfo: (info: DeliveryInfo) => void
  updateDeliveryField: <K extends keyof DeliveryInfo>(field: K, value: DeliveryInfo[K]) => void
  // 결제 관련 액션
  setAgreements: (agreements: ProductWizardState['agreements']) => void
  setShowLoginAlert: (show: boolean) => void
  // 네비게이션 액션
  handleNextStep: () => void
  handlePrevStep: () => void
  handleAIDesignSubmit: (data: AIDesignData) => void
  handleImageGenerated: (imageUrl: string) => void
  handleVideoGenerated: (videoUrl: string) => void
  // 중복 실행 방지 ref
  hasStartedGenerationRef: React.MutableRefObject<boolean>
}

export function useProductWizard(): ProductWizardState & ProductWizardActions {
  // 기본 상태
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedColor, setSelectedColor] = useState<'blue' | 'red'>('blue')
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')

  // AI 관련 상태
  const [aiDesignData, setAIDesignData] = useState<AIDesignData>({
    category: 'opening',
    style: 'neon',
    prompt: '',
    referenceImage: undefined
  })
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null)
  const [aiGenerationStatus, setAIGenerationStatus] = useState<AIGenerationStatus>('idle')
  const [aiError, setAIError] = useState<string | null>(null)

  // 중복 실행 방지 ref
  const hasStartedGenerationRef = useRef(false)

  // 배송/설치 정보 상태
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    recipientName: '',
    recipientPhone: '',
    postalCode: '',
    address: '',
    addressDetail: '',
    installationDate: '',
    installationTime: '오전',
    installationNote: ''
  })

  // 결제 관련 상태
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    refund: false,
    ecommerce: false
  })
  const [showLoginAlert, setShowLoginAlert] = useState(false)

  // AI 디자인 필드 개별 업데이트
  const updateAIDesignField = <K extends keyof AIDesignData>(field: K, value: AIDesignData[K]) => {
    setAIDesignData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // AI 생성 초기화
  const resetAIGeneration = () => {
    setGeneratedImageUrl(null)
    setGeneratedVideoUrl(null)
    setAIGenerationStatus('idle')
    setAIError(null)
    hasStartedGenerationRef.current = false
  }

  // 배송 정보 필드 개별 업데이트
  const updateDeliveryField = <K extends keyof DeliveryInfo>(field: K, value: DeliveryInfo[K]) => {
    setDeliveryInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // 네비게이션 액션
  const handleNextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      // Step 4 (AI 생성)에서 뒤로가면 생성 상태 초기화
      if (currentStep === 4) {
        resetAIGeneration()
      }
      setCurrentStep(currentStep - 1)
    }
  }

  // AI 디자인 제출 (Step 3 → Step 4)
  const handleAIDesignSubmit = (data: AIDesignData) => {
    setAIDesignData(data)
    resetAIGeneration() // 새 디자인이면 이전 생성 결과 초기화
    handleNextStep()
  }

  // 이미지 생성 완료 핸들러
  const handleImageGenerated = (imageUrl: string) => {
    setGeneratedImageUrl(imageUrl)
    setAIGenerationStatus('image-ready')
  }

  // 비디오 생성 완료 핸들러 (Step 4 → Step 5)
  const handleVideoGenerated = (videoUrl: string) => {
    setGeneratedVideoUrl(videoUrl)
    setAIGenerationStatus('video-ready')
    handleNextStep()
  }

  return {
    // 상태
    currentStep,
    selectedColor,
    selectedPeriod,
    aiDesignData,
    generatedImageUrl,
    generatedVideoUrl,
    aiGenerationStatus,
    aiError,
    deliveryInfo,
    agreements,
    showLoginAlert,
    // 액션
    setCurrentStep,
    setSelectedColor,
    setSelectedPeriod,
    setAIDesignData,
    updateAIDesignField,
    setGeneratedImageUrl,
    setGeneratedVideoUrl,
    setAIGenerationStatus,
    setAIError,
    resetAIGeneration,
    setDeliveryInfo,
    updateDeliveryField,
    setAgreements,
    setShowLoginAlert,
    handleNextStep,
    handlePrevStep,
    handleAIDesignSubmit,
    handleImageGenerated,
    handleVideoGenerated,
    hasStartedGenerationRef
  }
}
