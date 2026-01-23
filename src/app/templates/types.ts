import { TemplateMetadata } from '@/types/template'

export type ViewMode = 'categories' | 'templates' | 'preview'
export type ActiveTab = 'overview' | 'text' | 'image'

export interface RentalInfo {
  period: string
  color: string
  amount: number
}

export interface UseTemplateSelectionReturn {
  // 상태
  selectedCategory: string
  selectedTemplate: TemplateMetadata | null
  viewMode: ViewMode
  isRentalMode: boolean
  rentalInfo: RentalInfo
  activeTab: ActiveTab
  expandedTextFields: number[]
  expandedImageFields: number[]
  showGuide: boolean
  selectedCategoryData: ReturnType<typeof import('@/data/templates').TEMPLATES_WITH_DATA.find>

  // 핸들러
  handleCategorySelect: (categoryId: string) => void
  handleTemplateSelect: (template: TemplateMetadata) => void
  handleBackToCategories: () => void
  handleBackToTemplates: () => void
  toggleTextField: (index: number) => void
  toggleImageField: (index: number) => void
  setActiveTab: (tab: ActiveTab) => void
  setShowGuide: (show: boolean) => void
}
