'use client'

import { Suspense } from 'react'
import { useTemplateSelection } from './hooks/useTemplateSelection'
import TemplateHeader from './components/TemplateHeader'
import CategoryView from './components/CategoryView'
import TemplateListView from './components/TemplateListView'
import TemplateDetailView from './components/TemplateDetailView'

function TemplatesPageContent() {
  const {
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
  } = useTemplateSelection()

  return (
    <div className="min-h-screen bg-gray-50">
      <TemplateHeader isRentalMode={isRentalMode} viewMode={viewMode} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'categories' && (
          <CategoryView
            isRentalMode={isRentalMode}
            rentalInfo={rentalInfo}
            onCategorySelect={handleCategorySelect}
          />
        )}

        {viewMode === 'templates' && selectedCategoryData && (
          <TemplateListView
            categoryData={selectedCategoryData}
            onBackToCategories={handleBackToCategories}
            onTemplateSelect={handleTemplateSelect}
          />
        )}

        {viewMode === 'preview' && selectedTemplate && (
          <TemplateDetailView
            template={selectedTemplate}
            categoryData={selectedCategoryData}
            isRentalMode={isRentalMode}
            rentalInfo={rentalInfo}
            activeTab={activeTab}
            expandedTextFields={expandedTextFields}
            expandedImageFields={expandedImageFields}
            showGuide={showGuide}
            onBackToCategories={handleBackToCategories}
            onBackToTemplates={handleBackToTemplates}
            onTabChange={setActiveTab}
            onToggleTextField={toggleTextField}
            onToggleImageField={toggleImageField}
            onToggleGuide={() => setShowGuide(!showGuide)}
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
