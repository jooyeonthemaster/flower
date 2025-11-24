import { TemplateMetadata } from '@/types/template'

export interface TemplateValidationResult {
  isValid: boolean
  missingFields: string[]
}

export function useTemplateValidation() {
  const validateTemplateData = (
    template: TemplateMetadata | null,
    templateData: {
      textData: Record<string, string>
      imageData: Record<string, File | string>
    }
  ): TemplateValidationResult => {
    if (!template) {
      return { isValid: false, missingFields: ['template'] }
    }

    const missingFields: string[] = []

    // 필수 텍스트 필드 체크
    const requiredTextFields = template.textFields.filter(field => field.required)
    for (const field of requiredTextFields) {
      if (!templateData.textData[field.name] || templateData.textData[field.name].trim() === '') {
        missingFields.push(field.label)
      }
    }

    // 필수 이미지 필드 체크
    const requiredImageFields = template.imageFields.filter(field => field.required)
    for (const field of requiredImageFields) {
      if (!templateData.imageData[field.name]) {
        missingFields.push(field.label)
      }
    }

    return {
      isValid: missingFields.length === 0,
      missingFields
    }
  }

  return {
    validateTemplateData
  }
}
