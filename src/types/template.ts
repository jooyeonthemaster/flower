// 홀로그램 템플릿 시스템 타입 정의

export interface TextFieldRequirement {
  name: string
  label: string
  placeholder: string
  minLength: number
  maxLength: number
  recommendedLength: number
  required: boolean
  description: string
}

export interface ImageFieldRequirement {
  name: string
  label: string
  aspectRatio: string // "1:1", "4:3", "16:9", "3:4"
  formats: string[] // ["JPG", "PNG", "GIF"]
  maxSizeMB: number
  backgroundColor: "transparent" | "white" | "any"
  description: string
  required: boolean
  examples: string[] // 예시 설명
}

export interface TemplateMetadata {
  id: string
  name: string
  description: string
  category: string
  previewGif: string // gif 파일 경로
  thumbnail: string // 썸네일 이미지 경로
  difficulty: "easy" | "medium" | "advanced"
  popularityScore: number
  textFields: TextFieldRequirement[]
  imageFields: ImageFieldRequirement[]
  estimatedSetupTime: string // "5-10분"
  tags: string[]
}

export interface TemplateCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  templates: TemplateMetadata[]
  popularityRank: number
}

export interface CustomizationData {
  templateId: string
  textData: Record<string, string>
  imageData: Record<string, File | string>
}

// 카테고리 정의
export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: "business_opening",
    name: "개업/오픈",
    description: "매장 개업, 사무실 개소, 병원 개원",
    icon: "🏪",
    color: "blue",
    popularityRank: 1,
    templates: []
  },
  {
    id: "wedding",
    name: "결혼식",
    description: "결혼 축하, 웨딩홀 장식",
    icon: "💒",
    color: "pink",
    popularityRank: 2,
    templates: []
  },
  {
    id: "corporate_event",
    name: "기업 행사",
    description: "컨퍼런스, 세미나, 제품 런칭",
    icon: "🏢",
    color: "indigo",
    popularityRank: 3,
    templates: []
  },
  {
    id: "celebration",
    name: "축하 행사",
    description: "승진, 수상, 기념일",
    icon: "🎉",
    color: "yellow",
    popularityRank: 4,
    templates: []
  },
  {
    id: "memorial",
    name: "추모/조문",
    description: "장례식, 추도식, 위령제",
    icon: "🕊️",
    color: "gray",
    popularityRank: 8,
    templates: []
  },
  {
    id: "graduation",
    name: "졸업/입학",
    description: "졸업식, 입학식, 학위 수여식",
    icon: "🎓",
    color: "purple",
    popularityRank: 5,
    templates: []
  },
  {
    id: "birthday",
    name: "생일/기념일",
    description: "생일파티, 창립기념일",
    icon: "🎂",
    color: "red",
    popularityRank: 6,
    templates: []
  },
  {
    id: "religious",
    name: "종교 행사",
    description: "교회, 절, 성당 행사",
    icon: "⛪",
    color: "amber",
    popularityRank: 7,
    templates: []
  },
  {
    id: "political",
    name: "정치/선거",
    description: "당선 축하, 출마 선언",
    icon: "🗳️",
    color: "green",
    popularityRank: 9,
    templates: []
  },
  {
    id: "general",
    name: "기타",
    description: "범용 템플릿",
    icon: "✨",
    color: "slate",
    popularityRank: 10,
    templates: []
  }
] 