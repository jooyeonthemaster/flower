import { TemplateMetadata } from '@/types/template'

interface DataInputStepProps {
  selectedTemplate: TemplateMetadata
  templateData: {
    textData: Record<string, string>
    imageData: Record<string, File | string>
  }
  onTextFieldChange: (fieldName: string, value: string) => void
  onImageFieldChange: (fieldName: string, file: File) => void
}

export default function DataInputStep({
  selectedTemplate,
  templateData,
  onTextFieldChange,
  onImageFieldChange
}: DataInputStepProps) {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg rounded-2xl p-6">
        <div className="text-center mb-6">
          <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedTemplate.name}</h4>
          <p className="text-gray-600 text-sm">{selectedTemplate.description}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 텍스트 필드들 */}
          {selectedTemplate.textFields.length > 0 && (
            <div className="lg:col-span-2">
              <h5 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span>📝</span>
                <span>텍스트 정보 입력</span>
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedTemplate.textFields.map((field, index) => (
                  <div key={index} className={`group ${field.maxLength > 100 ? 'md:col-span-2' : ''}`}>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <div className="relative">
                      {field.maxLength > 100 ? (
                        <textarea
                          placeholder={field.placeholder}
                          value={templateData.textData[field.name] || ''}
                          onChange={(e) => onTextFieldChange(field.name, e.target.value)}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-orange focus:ring-2 focus:ring-orange/20 transition-all duration-200 resize-none text-sm"
                          rows={2}
                          maxLength={field.maxLength}
                        />
                      ) : (
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          value={templateData.textData[field.name] || ''}
                          onChange={(e) => onTextFieldChange(field.name, e.target.value)}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-orange focus:ring-2 focus:ring-orange/20 transition-all duration-200 text-sm"
                          maxLength={field.maxLength}
                        />
                      )}
                      <div className="absolute bottom-1 right-2 text-xs text-gray-400">
                        {(templateData.textData[field.name] || '').length}/{field.maxLength}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 이미지 필드들 */}
          {selectedTemplate.imageFields.length > 0 && (
            <div className="lg:col-span-1">
              <h5 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span>🖼️</span>
                <span>이미지 업로드</span>
              </h5>
              <div className="space-y-4">
                {selectedTemplate.imageFields.map((field, index) => (
                  <div key={index} className="group">
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-3 text-center hover:border-orange/60 transition-all duration-200 ${
                      templateData.imageData[field.name] ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50/50'
                    }`}>
                      <input
                        type="file"
                        accept={field.formats.map(f => `.${f.toLowerCase()}`).join(',')}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) onImageFieldChange(field.name, file)
                        }}
                        className="hidden"
                        id={`image-${field.name}`}
                      />
                      <label htmlFor={`image-${field.name}`} className="cursor-pointer block">
                        {templateData.imageData[field.name] ? (
                          <div className="text-green-600">
                            <div className="text-lg mb-1">✅</div>
                            <div className="text-xs font-medium">파일 선택됨</div>
                          </div>
                        ) : (
                          <div className="text-gray-500">
                            <div className="text-lg mb-1">📁</div>
                            <div className="text-xs mb-1">파일 선택</div>
                            <div className="text-xs text-gray-400">
                              {field.formats.join(', ')}
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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
