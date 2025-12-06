'use client'

import { AIDesignData, DeliveryInfo } from '../hooks/useProductWizard'

interface PaymentStepProps {
  selectedColor: 'blue' | 'red'
  selectedPeriod: 'daily' | 'weekly' | 'monthly'
  aiDesignData: AIDesignData
  generatedVideoUrl: string | null
  generatedImageUrl: string | null
  deliveryInfo: DeliveryInfo
  currentRental: {
    name: string
    price: number
    unit: string
  }
  productInfo: {
    name: string
    baseServices: {
      deposit: number
    }
    colorOptions: {
      blue: { name: string }
      red: { name: string }
    }
  }
  agreements: {
    terms: boolean
    privacy: boolean
    refund: boolean
    ecommerce: boolean
  }
  onAgreementChange: (agreements: PaymentStepProps['agreements']) => void
}

// 스타일 라벨 매핑
const styleLabels: Record<string, string> = {
  neon: '네온 사이버펑크',
  elegant: '우아한 플로럴',
  luxury: '럭셔리 골드',
  minimal: '모던 미니멀',
  traditional: '한국 전통',
  nature: '내추럴 포레스트',
  fantasy: '신비로운 판타지',
  ice: '크리스탈 아이스',
  fire: '블레이징 파이어',
  artdeco: '아트 데코',
  space: '갤럭시 스페이스',
  sketch: '아티스틱 스케치',
}

// 카테고리 라벨 매핑
const categoryLabels: Record<string, { label: string; icon: string }> = {
  opening: { label: '개업 축하', icon: '🎉' },
  wedding: { label: '결혼식', icon: '💍' },
  birthday: { label: '생일', icon: '🎂' },
  memorial: { label: '추모', icon: '🕊️' },
  event: { label: '행사/전시', icon: '🎤' },
  promotion: { label: '승진/영전', icon: '📢' },
}

export default function PaymentStep({
  selectedColor,
  aiDesignData,
  generatedVideoUrl,
  deliveryInfo,
  currentRental,
  productInfo,
  agreements,
  onAgreementChange
}: PaymentStepProps) {
  const currentColor = productInfo.colorOptions[selectedColor]
  const styleLabel = styleLabels[aiDesignData.style] || aiDesignData.style
  const categoryInfo = categoryLabels[aiDesignData.category] || { label: aiDesignData.category, icon: '🎯' }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* 왼쪽: 선택 사항 요약 & 영상 미리보기 */}
        <div className="space-y-6">
          {/* 선택 사항 요약 */}
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200/60 shadow-xl rounded-2xl p-6">
            <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <span>📋</span>
              <span>주문 정보</span>
            </h4>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">제품</span>
                <span className="font-semibold">{productInfo.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">색상</span>
                <span className="font-semibold flex items-center space-x-2">
                  <span>{selectedColor === 'blue' ? '💙' : '❤️'}</span>
                  <span>{currentColor.name}</span>
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">렌트 기간</span>
                <span className="font-semibold">{currentRental.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">행사 유형</span>
                <span className="font-semibold flex items-center space-x-2">
                  <span>{categoryInfo.icon}</span>
                  <span>{categoryInfo.label}</span>
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">디자인 스타일</span>
                <span className="font-semibold">{styleLabel}</span>
              </div>

              <div className="pt-4 border-t-2 border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">총 렌트 비용</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ₩{currentRental.price.toLocaleString()}/{currentRental.unit}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 배송/설치 정보 */}
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200/60 shadow-xl rounded-2xl p-6">
            <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <span>📦</span>
              <span>배송/설치 정보</span>
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">수령인</span>
                <span className="font-semibold">{deliveryInfo.recipientName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">연락처</span>
                <span className="font-semibold">{deliveryInfo.recipientPhone}</span>
              </div>
              <div className="py-2 border-b border-gray-200">
                <span className="text-gray-600 block mb-1">설치 주소</span>
                <span className="font-semibold">
                  {deliveryInfo.postalCode && `(${deliveryInfo.postalCode}) `}
                  {deliveryInfo.address}
                  {deliveryInfo.addressDetail && `, ${deliveryInfo.addressDetail}`}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">설치 희망일</span>
                <span className="font-semibold">
                  {deliveryInfo.installationDate} {deliveryInfo.installationTime}
                </span>
              </div>
              {deliveryInfo.installationNote && (
                <div className="py-2">
                  <span className="text-gray-600 block mb-1">요청사항</span>
                  <span className="text-sm text-gray-700">{deliveryInfo.installationNote}</span>
                </div>
              )}
            </div>
          </div>

          {/* 생성된 영상 미리보기 */}
          {generatedVideoUrl && (
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200/60 shadow-xl rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <span>🎬</span>
                  <span>AI 생성 홀로그램</span>
                </h4>
              </div>
              <div className="aspect-video bg-black">
                <video
                  src={generatedVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {/* 오른쪽: 포함 서비스 & 약관 동의 */}
        <div className="space-y-6">
          {/* 포함 서비스 */}
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200/60 shadow-xl rounded-2xl p-6">
            <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <span>✨</span>
              <span>포함 서비스</span>
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700 flex items-center space-x-2">
                  <span>🚚</span>
                  <span>전국 무료 배송 및 설치</span>
                </span>
                <span className="text-emerald-600 font-bold">무료</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700 flex items-center space-x-2">
                  <span>🛠️</span>
                  <span>24시간 기술 지원</span>
                </span>
                <span className="text-emerald-600 font-bold">무료</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700 flex items-center space-x-2">
                  <span>📦</span>
                  <span>수거 및 반납 서비스</span>
                </span>
                <span className="text-emerald-600 font-bold">무료</span>
              </div>
              <div className="flex justify-between items-center py-3 pt-4 border-t border-gray-200">
                <span className="text-gray-700 font-semibold flex items-center space-x-2">
                  <span>💰</span>
                  <span>보증금 (반납 시 환불)</span>
                </span>
                <span className="text-gray-900 font-bold text-lg">₩{productInfo.baseServices.deposit.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 전자상거래법 필수 고지사항 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h5 className="text-sm font-bold text-blue-800 mb-3 flex items-center">
              <span className="mr-2">⚖️</span>
              전자상거래법 필수 고지사항
            </h5>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div><span className="font-semibold text-blue-700">상호명:</span> 디지털화환</div>
                <div><span className="font-semibold text-blue-700">대표자:</span> 조지형</div>
                <div><span className="font-semibold text-blue-700">사업자등록번호:</span> 411-39-01174</div>
                <div><span className="font-semibold text-blue-700">통신판매업:</span> 제 2025-서울동작-1506 호</div>
              </div>
              <div className="space-y-1">
                <div><span className="font-semibold text-blue-700">연락처:</span> 02-336-0250</div>
                <div><span className="font-semibold text-blue-700">이메일:</span> baikal86@naver.com</div>
                <div><span className="font-semibold text-blue-700">주소:</span> 서울특별시 중구 을지로 지하 220</div>
              </div>
            </div>
          </div>

          {/* 결제 관련 유의사항 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h5 className="text-sm font-bold text-yellow-800 mb-2 flex items-center">
              <span className="mr-2">⚠️</span>
              결제 관련 유의사항
            </h5>
            <div className="space-y-1 text-xs text-yellow-800">
              <div className="flex items-start space-x-1">
                <span>•</span>
                <span><strong>보증금:</strong> {productInfo.baseServices.deposit.toLocaleString()}원이 별도 결제되며, 반납 시 환불됩니다.</span>
              </div>
              <div className="flex items-start space-x-1">
                <span>•</span>
                <span><strong>환불 정책:</strong> 설치 완료 후 7일 이내 환불 신청 가능합니다.</span>
              </div>
              <div className="flex items-start space-x-1">
                <span>•</span>
                <span><strong>설치/수거:</strong> 전문 기술진이 직접 방문하여 진행합니다.</span>
              </div>
            </div>
          </div>

          {/* 약관 동의 */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h5 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">📋</span>
              약관 동의 (필수)
            </h5>
            <div className="space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreements.terms}
                  onChange={(e) => onAgreementChange({...agreements, terms: e.target.checked})}
                  className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm">
                  <a href="/terms" target="_blank" className="text-blue-600 underline font-semibold hover:text-blue-800">이용약관</a>에 동의합니다. <span className="text-red-500">(필수)</span>
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreements.privacy}
                  onChange={(e) => onAgreementChange({...agreements, privacy: e.target.checked})}
                  className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm">
                  <a href="/privacy" target="_blank" className="text-blue-600 underline font-semibold hover:text-blue-800">개인정보처리방침</a>에 동의합니다. <span className="text-red-500">(필수)</span>
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreements.refund}
                  onChange={(e) => onAgreementChange({...agreements, refund: e.target.checked})}
                  className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm">
                  <a href="/returns" target="_blank" className="text-blue-600 underline font-semibold hover:text-blue-800">교환 및 환불 정책</a>을 확인했습니다. <span className="text-red-500">(필수)</span>
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreements.ecommerce}
                  onChange={(e) => onAgreementChange({...agreements, ecommerce: e.target.checked})}
                  className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm">
                  전자상거래법 필수 고지사항 및 유의사항에 동의합니다. <span className="text-red-500">(필수)</span>
                </span>
              </label>
            </div>

            {/* 전체 동의 여부 확인 */}
            {(!agreements.terms || !agreements.privacy || !agreements.refund || !agreements.ecommerce) && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-600 font-medium">
                  ⚠️ 모든 필수 약관에 동의해야 결제를 진행할 수 있습니다.
                </p>
              </div>
            )}
          </div>
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
