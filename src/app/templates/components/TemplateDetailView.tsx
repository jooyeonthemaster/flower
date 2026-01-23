'use client'

import Link from 'next/link'
import { TemplateMetadata } from '@/types/template'
import PaymentButton from '@/components/payment/PaymentButton'
import { ActiveTab, RentalInfo } from '../types'

interface CategoryData {
  id: string
  name: string
  icon: string
  description: string
  templates: TemplateMetadata[]
}

interface TemplateDetailViewProps {
  template: TemplateMetadata
  categoryData: CategoryData | undefined
  isRentalMode: boolean
  rentalInfo: RentalInfo
  activeTab: ActiveTab
  expandedTextFields: number[]
  expandedImageFields: number[]
  showGuide: boolean
  onBackToCategories: () => void
  onBackToTemplates: () => void
  onTabChange: (tab: ActiveTab) => void
  onToggleTextField: (index: number) => void
  onToggleImageField: (index: number) => void
  onToggleGuide: () => void
}

export default function TemplateDetailView({
  template,
  categoryData,
  isRentalMode,
  rentalInfo,
  activeTab,
  expandedTextFields,
  expandedImageFields,
  showGuide,
  onBackToCategories,
  onBackToTemplates,
  onTabChange,
  onToggleTextField,
  onToggleImageField,
  onToggleGuide,
}: TemplateDetailViewProps) {
  return (
    <div className="space-y-6">
      {/* 브레드크럼 */}
      <Breadcrumb
        categoryName={categoryData?.name}
        templateName={template.name}
        onBackToCategories={onBackToCategories}
        onBackToTemplates={onBackToTemplates}
      />

      {/* 상단 헤더 */}
      <DetailHeader
        template={template}
        isRentalMode={isRentalMode}
        rentalInfo={rentalInfo}
        onBackToTemplates={onBackToTemplates}
      />

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽: 미리보기 */}
        <LeftSection template={template} showGuide={showGuide} onToggleGuide={onToggleGuide} />

        {/* 오른쪽: 요구사항 정보 */}
        <RightSection
          template={template}
          activeTab={activeTab}
          expandedTextFields={expandedTextFields}
          expandedImageFields={expandedImageFields}
          onTabChange={onTabChange}
          onToggleTextField={onToggleTextField}
          onToggleImageField={onToggleImageField}
        />
      </div>
    </div>
  )
}

// 브레드크럼 컴포넌트
function Breadcrumb({
  categoryName,
  templateName,
  onBackToCategories,
  onBackToTemplates,
}: {
  categoryName: string | undefined
  templateName: string
  onBackToCategories: () => void
  onBackToTemplates: () => void
}) {
  return (
    <div className="flex items-center space-x-2 text-sm">
      <button
        onClick={onBackToCategories}
        className="text-blue-600 hover:text-blue-800 transition-colors duration-200 hover:underline"
      >
        카테고리
      </button>
      <span className="text-gray-400">&gt;</span>
      <button
        onClick={onBackToTemplates}
        className="text-blue-600 hover:text-blue-800 transition-colors duration-200 hover:underline"
      >
        {categoryName}
      </button>
      <span className="text-gray-400">&gt;</span>
      <span className="text-gray-900 font-medium">{templateName}</span>
    </div>
  )
}

// 상단 헤더 컴포넌트
function DetailHeader({
  template,
  isRentalMode,
  rentalInfo,
  onBackToTemplates,
}: {
  template: TemplateMetadata
  isRentalMode: boolean
  rentalInfo: RentalInfo
  onBackToTemplates: () => void
}) {
  return (
    <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 shadow-lg overflow-hidden">
      <div className="p-8">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {template.name}
              </h2>
              <div className="text-2xl">🎬</div>
            </div>
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">{template.description}</p>
            <div className="flex flex-wrap gap-3">
              <DifficultyBadge difficulty={template.difficulty} />
              <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-300 font-semibold shadow-sm hover:shadow-md transition-all duration-200">
                ⭐ 인기도 {template.popularityScore}%
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border border-gray-300 font-semibold shadow-sm hover:shadow-md transition-all duration-200">
                ⏱️ {template.estimatedSetupTime}
              </span>
            </div>
          </div>
          <div className="flex space-x-4">
            <PaymentButton
              amount={isRentalMode ? rentalInfo.amount : 120000}
              orderName={isRentalMode
                ? `홀로그램 화환 렌탈 - ${template.name} (${rentalInfo.color === 'blue' ? '블루' : '레드'})`
                : `홀로그램 화환 - ${template.name}`
              }
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 hover:from-blue-700 hover:to-blue-800"
            />
            {!isRentalMode && (
              <Link
                href={`/rental?template=${template.id}`}
                className="px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 hover:from-green-700 hover:to-green-800"
              >
                📝 렌탈 문의
              </Link>
            )}
            <button
              onClick={onBackToTemplates}
              className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              🔄 다른 템플릿
            </button>
          </div>
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    </div>
  )
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const config = {
    easy: { text: '쉬움', className: 'from-green-50 to-green-100 text-green-800 border-green-300' },
    medium: { text: '보통', className: 'from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-300' },
    hard: { text: '고급', className: 'from-red-50 to-red-100 text-red-800 border-red-300' },
  }
  const { text, className } = config[difficulty as keyof typeof config] || config.medium

  return (
    <span className={`px-4 py-2 border font-semibold shadow-sm transition-all duration-200 hover:shadow-md bg-gradient-to-r ${className}`}>
      🎯 {text}
    </span>
  )
}

// 왼쪽 섹션 컴포넌트
function LeftSection({
  template,
  showGuide,
  onToggleGuide,
}: {
  template: TemplateMetadata
  showGuide: boolean
  onToggleGuide: () => void
}) {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* GIF 미리보기 */}
      <div className="bg-white border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-5 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 flex items-center space-x-2">
            <span className="text-xl">🎬</span>
            <span>홀로그램 미리보기</span>
          </h3>
        </div>
        <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30"></div>
          <div className="text-center text-gray-500 z-10">
            <div className="w-28 h-28 bg-gradient-to-br from-gray-300 to-gray-400 mx-auto mb-4 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
              <span className="text-5xl">🎬</span>
            </div>
            <div className="font-semibold text-xl text-gray-700 mb-2">GIF 미리보기 영상</div>
            <div className="text-sm text-gray-500 bg-white/80 px-3 py-1 inline-block shadow-sm">
              {template.previewGif}
            </div>
          </div>
        </div>
      </div>

      {/* 통계 및 가이드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TemplateStats template={template} />
        <SetupGuide template={template} showGuide={showGuide} onToggleGuide={onToggleGuide} />
      </div>
    </div>
  )
}

function TemplateStats({ template }: { template: TemplateMetadata }) {
  return (
    <div className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-5 border-b border-gray-200">
        <h3 className="font-bold text-gray-900 flex items-center space-x-2">
          <span className="text-xl">📊</span>
          <span>템플릿 정보</span>
        </h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6 text-center">
          <div className="group">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-200">
              {template.textFields.length}
            </div>
            <div className="text-sm text-gray-600 font-medium">📝 텍스트 필드</div>
          </div>
          <div className="group">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-200">
              {template.imageFields.length}
            </div>
            <div className="text-sm text-gray-600 font-medium">🖼️ 이미지 필드</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SetupGuide({
  template,
  showGuide,
  onToggleGuide,
}: {
  template: TemplateMetadata
  showGuide: boolean
  onToggleGuide: () => void
}) {
  const steps = [
    { num: 1, title: "정보 준비", desc: "필요한 텍스트와 이미지 준비", icon: "📝" },
    { num: 2, title: "신청서 작성", desc: "정보 입력 및 이미지 업로드", icon: "✍️" },
    { num: 3, title: "제작 완료", desc: `${template.estimatedSetupTime} 소요`, icon: "✨" }
  ]

  return (
    <div className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <button
        onClick={onToggleGuide}
        className="w-full p-5 text-left border-b border-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200"
      >
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-900 flex items-center space-x-2">
            <span className="text-xl">📋</span>
            <span>설정 가이드</span>
          </h3>
          <span className={`text-gray-400 text-xl transform transition-transform duration-300 ${showGuide ? 'rotate-180' : ''}`}>
            ↓
          </span>
        </div>
      </button>
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        showGuide ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="p-5 space-y-4 bg-gradient-to-b from-white to-gray-50">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-start space-x-3 group">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform duration-200">
                {step.num}
              </div>
              <div className="text-sm flex-1">
                <div className="font-semibold text-gray-900 flex items-center space-x-2">
                  <span>{step.icon}</span>
                  <span>{step.title}</span>
                </div>
                <div className="text-gray-600 mt-1">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 오른쪽 섹션 컴포넌트
function RightSection({
  template,
  activeTab,
  expandedTextFields,
  expandedImageFields,
  onTabChange,
  onToggleTextField,
  onToggleImageField,
}: {
  template: TemplateMetadata
  activeTab: ActiveTab
  expandedTextFields: number[]
  expandedImageFields: number[]
  onTabChange: (tab: ActiveTab) => void
  onToggleTextField: (index: number) => void
  onToggleImageField: (index: number) => void
}) {
  return (
    <div className="space-y-6">
      <SummaryCard template={template} />
      <TabSection
        template={template}
        activeTab={activeTab}
        expandedTextFields={expandedTextFields}
        expandedImageFields={expandedImageFields}
        onTabChange={onTabChange}
        onToggleTextField={onToggleTextField}
        onToggleImageField={onToggleImageField}
      />
    </div>
  )
}

function SummaryCard({ template }: { template: TemplateMetadata }) {
  const items = [
    { label: "텍스트 필드", value: `${template.textFields.length}개`, icon: "📝", color: "blue" },
    { label: "이미지 필드", value: `${template.imageFields.length}개`, icon: "🖼️", color: "green" },
    {
      label: "필수 항목",
      value: `${template.textFields.filter(f => f.required).length + template.imageFields.filter(f => f.required).length}개`,
      icon: "⚠️",
      color: "red"
    }
  ]

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-5 border-b border-gray-200">
        <h3 className="font-bold text-gray-900 flex items-center space-x-2">
          <span className="text-xl">📋</span>
          <span>필요한 정보 요약</span>
        </h3>
      </div>
      <div className="p-6 space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 transition-colors duration-200 border border-gray-100 shadow-sm">
            <span className="text-gray-700 font-medium flex items-center space-x-2">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </span>
            <span className={`font-bold ${
              item.color === 'red' ? 'text-red-600' :
              item.color === 'green' ? 'text-green-600' : 'text-blue-600'
            }`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TabSection({
  template,
  activeTab,
  expandedTextFields,
  expandedImageFields,
  onTabChange,
  onToggleTextField,
  onToggleImageField,
}: {
  template: TemplateMetadata
  activeTab: ActiveTab
  expandedTextFields: number[]
  expandedImageFields: number[]
  onTabChange: (tab: ActiveTab) => void
  onToggleTextField: (index: number) => void
  onToggleImageField: (index: number) => void
}) {
  const tabs = [
    { id: 'overview' as ActiveTab, label: '개요', icon: '📄', count: null },
    { id: 'text' as ActiveTab, label: '텍스트', icon: '📝', count: template.textFields.length },
    { id: 'image' as ActiveTab, label: '이미지', icon: '🖼️', count: template.imageFields.length }
  ]

  return (
    <div className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="flex border-b border-gray-200 bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 p-4 text-center font-semibold transition-all duration-200 relative ${
              activeTab === tab.id
                ? 'bg-gradient-to-b from-blue-50 to-blue-100 text-blue-700 shadow-inner'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-center space-x-2" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`px-2 py-1 text-xs font-bold border shadow-sm ${
                  activeTab === tab.id
                    ? 'bg-blue-200 text-blue-800 border-blue-300'
                    : 'bg-gray-200 text-gray-700 border-gray-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </div>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            )}
          </button>
        ))}
      </div>

      <div className="p-6 min-h-[300px]">
        {activeTab === 'overview' && <OverviewTab template={template} />}
        {activeTab === 'text' && (
          <TextFieldsTab
            fields={template.textFields}
            expandedFields={expandedTextFields}
            onToggle={onToggleTextField}
          />
        )}
        {activeTab === 'image' && (
          <ImageFieldsTab
            fields={template.imageFields}
            expandedFields={expandedImageFields}
            onToggle={onToggleImageField}
          />
        )}
      </div>
    </div>
  )
}

function OverviewTab({ template }: { template: TemplateMetadata }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
          <span>🏷️</span>
          <span>태그</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {template.tags.map((tag, idx) => (
            <span key={idx} className="px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-sm border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200 font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-5 shadow-md">
        <h4 className="font-semibold text-yellow-900 mb-3 flex items-center space-x-2">
          <span>⚠️</span>
          <span>주의사항</span>
        </h4>
        <div className="text-sm text-yellow-800 space-y-2">
          {["모든 필수 정보를 정확히 입력해주세요", "고해상도 이미지 사용 권장", "제작 완료 후 수정 어려움"].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <span className="text-yellow-600">•</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TextFieldsTab({
  fields,
  expandedFields,
  onToggle,
}: {
  fields: TemplateMetadata['textFields']
  expandedFields: number[]
  onToggle: (index: number) => void
}) {
  return (
    <div className="space-y-3 animate-fadeIn">
      {fields.map((field, idx) => (
        <div key={idx} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
          <button
            onClick={() => onToggle(idx)}
            className="w-full p-4 text-left hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <span className="text-lg">📝</span>
                <span className="font-semibold text-gray-900">{field.label}</span>
                {field.required && (
                  <span className="px-2 py-1 bg-gradient-to-r from-red-100 to-red-200 text-red-700 text-xs font-bold border border-red-300 shadow-sm">
                    필수
                  </span>
                )}
              </div>
              <span className={`text-gray-400 text-lg transform transition-transform duration-300 ${
                expandedFields.includes(idx) ? 'rotate-180' : ''
              }`}>
                ↓
              </span>
            </div>
          </button>
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            expandedFields.includes(idx) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="p-4 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200 space-y-3">
              <p className="text-gray-700">{field.description}</p>
              <div className="bg-white border-l-4 border-blue-400 p-3 shadow-sm">
                <div className="text-xs text-blue-600 font-semibold mb-1">💡 예시:</div>
                <div className="text-gray-900 font-medium">{field.placeholder}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-green-50 border border-green-200 p-2 text-center">
                  <div className="text-green-600 font-semibold">권장 길이</div>
                  <div className="text-green-800 font-bold">{field.recommendedLength}자</div>
                </div>
                <div className="bg-red-50 border border-red-200 p-2 text-center">
                  <div className="text-red-600 font-semibold">최대 길이</div>
                  <div className="text-red-800 font-bold">{field.maxLength}자</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ImageFieldsTab({
  fields,
  expandedFields,
  onToggle,
}: {
  fields: TemplateMetadata['imageFields']
  expandedFields: number[]
  onToggle: (index: number) => void
}) {
  return (
    <div className="space-y-3 animate-fadeIn">
      {fields.map((field, idx) => (
        <div key={idx} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
          <button
            onClick={() => onToggle(idx)}
            className="w-full p-4 text-left hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <span className="text-lg">🖼️</span>
                <span className="font-semibold text-gray-900">{field.label}</span>
                {field.required && (
                  <span className="px-2 py-1 bg-gradient-to-r from-red-100 to-red-200 text-red-700 text-xs font-bold border border-red-300 shadow-sm">
                    필수
                  </span>
                )}
              </div>
              <span className={`text-gray-400 text-lg transform transition-transform duration-300 ${
                expandedFields.includes(idx) ? 'rotate-180' : ''
              }`}>
                ↓
              </span>
            </div>
          </button>
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            expandedFields.includes(idx) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="p-4 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200 space-y-4">
              <p className="text-gray-700">{field.description}</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: "이미지 비율", value: field.aspectRatio, icon: "📐", color: "blue" },
                  { label: "파일 크기", value: `최대 ${field.maxSizeMB}MB`, icon: "💾", color: "green" },
                  { label: "파일 형식", value: field.formats.join(', '), icon: "📄", color: "purple" },
                  {
                    label: "배경 권장",
                    value: field.backgroundColor === 'transparent' ? '투명'
                           : field.backgroundColor === 'white' ? '흰색' : '무관',
                    icon: "🎨",
                    color: "orange"
                  }
                ].map((spec, specIdx) => (
                  <div key={specIdx} className={`bg-${spec.color}-50 border border-${spec.color}-200 p-3 text-center shadow-sm`}>
                    <div className={`text-${spec.color}-600 font-semibold flex items-center justify-center space-x-1`}>
                      <span>{spec.icon}</span>
                      <span>{spec.label}</span>
                    </div>
                    <div className={`text-${spec.color}-800 font-bold mt-1`}>{spec.value}</div>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-3 shadow-sm">
                <div className="text-sm font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                  <span>💡</span>
                  <span>이미지 예시</span>
                </div>
                <div className="text-sm text-blue-700 space-y-1">
                  {field.examples.map((example, exampleIdx) => (
                    <div key={exampleIdx} className="flex items-center space-x-2">
                      <span className="text-blue-500">•</span>
                      <span>{example}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
