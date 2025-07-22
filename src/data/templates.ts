import { TemplateMetadata, TEMPLATE_CATEGORIES, TemplateCategory } from '@/types/template'

// 개업/오픈 카테고리 템플릿
const businessOpeningTemplates: TemplateMetadata[] = [
  {
    id: "business_grand_opening",
    name: "그랜드 오픈",
    description: "화려한 개업 축하 템플릿",
    category: "business_opening",
    previewGif: "/templates/business_grand_opening.gif",
    thumbnail: "/templates/business_grand_opening_thumb.jpg",
    difficulty: "easy",
    popularityScore: 95,
    estimatedSetupTime: "5-8분",
    tags: ["개업", "매장", "축하", "화려함"],
    textFields: [
      {
        name: "businessName",
        label: "업체명",
        placeholder: "예: 서울 치킨집",
        minLength: 2,
        maxLength: 30,
        recommendedLength: 15,
        required: true,
        description: "개업하는 업체의 정확한 명칭을 입력해주세요"
      },
      {
        name: "businessType",
        label: "업종",
        placeholder: "예: 치킨 전문점",
        minLength: 2,
        maxLength: 20,
        recommendedLength: 10,
        required: true,
        description: "업체의 주요 업종을 간단히 표현해주세요"
      },
      {
        name: "address",
        label: "주소",
        placeholder: "예: 서울시 강남구 ○○동",
        minLength: 5,
        maxLength: 50,
        recommendedLength: 25,
        required: true,
        description: "업체의 소재지를 입력해주세요 (상세주소 생략 가능)"
      },
      {
        name: "openingDate",
        label: "개업일",
        placeholder: "예: 2024년 1월 15일",
        minLength: 5,
        maxLength: 20,
        recommendedLength: 12,
        required: true,
        description: "개업 날짜를 입력해주세요"
      },
      {
        name: "senderName",
        label: "보내는 이",
        placeholder: "예: ○○상회 일동",
        minLength: 2,
        maxLength: 20,
        recommendedLength: 10,
        required: true,
        description: "화환을 보내는 분의 이름이나 단체명"
      }
    ],
    imageFields: [
      {
        name: "businessLogo",
        label: "업체 로고",
        aspectRatio: "1:1",
        formats: ["PNG", "JPG"],
        maxSizeMB: 5,
        backgroundColor: "transparent",
        description: "업체의 로고나 상징 이미지",
        required: false,
        examples: ["로고 이미지", "업체 심볼", "브랜드 마크"]
      },
      {
        name: "businessPhoto",
        label: "업체 사진",
        aspectRatio: "16:9",
        formats: ["JPG", "PNG"],
        maxSizeMB: 10,
        backgroundColor: "any",
        description: "업체 외관이나 내부 모습",
        required: false,
        examples: ["매장 외관", "인테리어 사진", "대표 상품 사진"]
      }
    ]
  },
  {
    id: "medical_opening",
    name: "병원/의원 개원",
    description: "전문적이고 신뢰감 있는 의료기관 개원 템플릿",
    category: "business_opening",
    previewGif: "/templates/medical_opening.gif",
    thumbnail: "/templates/medical_opening_thumb.jpg",
    difficulty: "medium",
    popularityScore: 88,
    estimatedSetupTime: "8-12분",
    tags: ["병원", "의원", "개원", "의료", "전문"],
    textFields: [
      {
        name: "clinicName",
        label: "병원/의원명",
        placeholder: "예: 서울연세내과의원",
        minLength: 3,
        maxLength: 30,
        recommendedLength: 15,
        required: true,
        description: "병원이나 의원의 정확한 명칭"
      },
      {
        name: "doctorName",
        label: "원장님 성함",
        placeholder: "예: 김○○ 원장",
        minLength: 2,
        maxLength: 15,
        recommendedLength: 8,
        required: true,
        description: "원장님의 성함 (존칭 포함)"
      },
      {
        name: "specialty",
        label: "전문 분야",
        placeholder: "예: 내과 전문의",
        minLength: 3,
        maxLength: 25,
        recommendedLength: 12,
        required: true,
        description: "주요 진료 분야나 전문성"
      },
      {
        name: "openingDate",
        label: "개원일",
        placeholder: "예: 2024년 1월 15일",
        minLength: 5,
        maxLength: 20,
        recommendedLength: 12,
        required: true,
        description: "개원 날짜"
      },
      {
        name: "senderName",
        label: "보내는 이",
        placeholder: "예: 의료진 일동",
        minLength: 2,
        maxLength: 20,
        recommendedLength: 10,
        required: true,
        description: "화환을 보내는 분의 이름이나 단체명"
      }
    ],
    imageFields: [
      {
        name: "clinicLogo",
        label: "병원 로고",
        aspectRatio: "1:1",
        formats: ["PNG"],
        maxSizeMB: 5,
        backgroundColor: "transparent",
        description: "병원의 로고나 심볼",
        required: false,
        examples: ["병원 로고", "의료진 심볼", "십자가 마크"]
      },
      {
        name: "doctorPhoto",
        label: "원장님 사진",
        aspectRatio: "3:4",
        formats: ["JPG", "PNG"],
        maxSizeMB: 5,
        backgroundColor: "white",
        description: "원장님의 프로필 사진 (정장 착용 권장)",
        required: false,
        examples: ["정장 프로필 사진", "가운 착용 사진", "전문적인 포즈"]
      }
    ]
  }
]

// 결혼식 카테고리 템플릿
const weddingTemplates: TemplateMetadata[] = [
  {
    id: "elegant_wedding",
    name: "우아한 결혼식",
    description: "클래식하고 우아한 결혼 축하 템플릿",
    category: "wedding",
    previewGif: "/templates/elegant_wedding.gif",
    thumbnail: "/templates/elegant_wedding_thumb.jpg",
    difficulty: "easy",
    popularityScore: 98,
    estimatedSetupTime: "5-10분",
    tags: ["결혼", "웨딩", "우아", "클래식", "축하"],
    textFields: [
      {
        name: "groomName",
        label: "신랑 이름",
        placeholder: "예: 김○○",
        minLength: 2,
        maxLength: 10,
        recommendedLength: 5,
        required: true,
        description: "신랑의 성함"
      },
      {
        name: "brideName",
        label: "신부 이름",
        placeholder: "예: 이○○",
        minLength: 2,
        maxLength: 10,
        recommendedLength: 5,
        required: true,
        description: "신부의 성함"
      },
      {
        name: "weddingDate",
        label: "예식일",
        placeholder: "예: 2024년 2월 14일",
        minLength: 5,
        maxLength: 20,
        recommendedLength: 12,
        required: true,
        description: "결혼식 날짜"
      },
      {
        name: "venue",
        label: "예식장",
        placeholder: "예: 서울 웨딩홀",
        minLength: 3,
        maxLength: 30,
        recommendedLength: 15,
        required: true,
        description: "결혼식이 열리는 장소"
      },
      {
        name: "senderName",
        label: "보내는 이",
        placeholder: "예: 친구들 일동",
        minLength: 2,
        maxLength: 20,
        recommendedLength: 10,
        required: true,
        description: "축하 메시지를 보내는 분"
      }
    ],
    imageFields: [
      {
        name: "couplePhoto",
        label: "커플 사진",
        aspectRatio: "4:3",
        formats: ["JPG", "PNG"],
        maxSizeMB: 10,
        backgroundColor: "any",
        description: "신랑신부의 사진 (웨딩사진 권장)",
        required: false,
        examples: ["웨딩 스튜디오 사진", "야외 촬영 사진", "드레스 & 턱시도 사진"]
      }
    ]
  }
]

// 기업 행사 카테고리 템플릿
const corporateEventTemplates: TemplateMetadata[] = [
  {
    id: "product_launch",
    name: "제품 런칭",
    description: "신제품 출시 및 기업 행사용 프로페셔널 템플릿",
    category: "corporate_event",
    previewGif: "/templates/product_launch.gif",
    thumbnail: "/templates/product_launch_thumb.jpg",
    difficulty: "medium",
    popularityScore: 85,
    estimatedSetupTime: "10-15분",
    tags: ["제품출시", "기업", "런칭", "프로페셔널", "비즈니스"],
    textFields: [
      {
        name: "companyName",
        label: "회사명",
        placeholder: "예: (주)테크코리아",
        minLength: 2,
        maxLength: 30,
        recommendedLength: 15,
        required: true,
        description: "행사를 주최하는 회사명"
      },
      {
        name: "eventName",
        label: "행사명",
        placeholder: "예: 스마트폰 신제품 발표회",
        minLength: 3,
        maxLength: 40,
        recommendedLength: 20,
        required: true,
        description: "행사의 정확한 명칭"
      },
      {
        name: "eventDate",
        label: "행사일",
        placeholder: "예: 2024년 3월 1일",
        minLength: 5,
        maxLength: 20,
        recommendedLength: 12,
        required: true,
        description: "행사 개최 날짜"
      },
      {
        name: "venue",
        label: "장소",
        placeholder: "예: 코엑스 컨벤션센터",
        minLength: 3,
        maxLength: 30,
        recommendedLength: 15,
        required: true,
        description: "행사가 열리는 장소"
      },
      {
        name: "senderName",
        label: "보내는 이",
        placeholder: "예: 협력업체 일동",
        minLength: 2,
        maxLength: 20,
        recommendedLength: 10,
        required: true,
        description: "축하 메시지를 보내는 분"
      }
    ],
    imageFields: [
      {
        name: "companyLogo",
        label: "회사 로고",
        aspectRatio: "1:1",
        formats: ["PNG"],
        maxSizeMB: 5,
        backgroundColor: "transparent",
        description: "회사의 공식 로고",
        required: true,
        examples: ["기업 로고", "브랜드 심볼", "회사 마크"]
      },
      {
        name: "productImage",
        label: "제품 이미지",
        aspectRatio: "16:9",
        formats: ["JPG", "PNG"],
        maxSizeMB: 10,
        backgroundColor: "white",
        description: "출시하는 제품의 대표 이미지",
        required: false,
        examples: ["제품 사진", "프로모션 이미지", "브로슈어 이미지"]
      }
    ]
  }
]

// 템플릿을 카테고리에 할당
export const TEMPLATES_WITH_DATA: TemplateCategory[] = TEMPLATE_CATEGORIES.map(category => {
  let templates: TemplateMetadata[] = []
  
  switch (category.id) {
    case "business_opening":
      templates = businessOpeningTemplates
      break
    case "wedding":
      templates = weddingTemplates
      break
    case "corporate_event":
      templates = corporateEventTemplates
      break
    // 나머지 카테고리들은 나중에 추가
    default:
      templates = []
  }
  
  return {
    ...category,
    templates
  }
})

// 모든 템플릿을 플랫 배열로 내보내기
export const ALL_TEMPLATES: TemplateMetadata[] = TEMPLATES_WITH_DATA.flatMap(category => category.templates) 