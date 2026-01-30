import { TemplateMetadata } from '@/types/template'

interface PaymentStepProps {
  selectedColor: 'blue' | 'red'
  selectedTemplate: TemplateMetadata
  selectedCategoryData: {
    id: string
    name: string
    icon: string
  } | undefined
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

export default function PaymentStep({
  selectedColor,
  selectedTemplate,
  selectedCategoryData,
  currentRental,
  productInfo,
  agreements,
  onAgreementChange
}: PaymentStepProps) {
  const currentColor = productInfo.colorOptions[selectedColor]

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* 선택 사항 요약 */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-2xl rounded-3xl p-8">
          <h4 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-2">
            <span>📋</span>
            <span>선택된 옵션</span>
          </h4>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">제품</span>
              <span className="font-semibold">{productInfo.name}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">색상</span>
              <span className="font-semibold flex items-center space-x-2">
                <span>{selectedColor === 'blue' ? '💙' : '❤️'}</span>
                <span>{currentColor.name}</span>
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">렌트 기간</span>
              <span className="font-semibold">{currentRental.name}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">카테고리</span>
              <span className="font-semibold flex items-center space-x-2">
                <span>{selectedCategoryData?.icon}</span>
                <span>{selectedCategoryData?.name}</span>
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">템플릿</span>
              <span className="font-semibold">{selectedTemplate?.name}</span>
            </div>
            
            <div className="pt-6 border-t-2 border-gray-300">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">총 렌트 비용</span>
                <span className="text-3xl font-bold text-orange">
                  ₩{currentRental.price.toLocaleString()}/{currentRental.unit}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 포함 서비스 */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-2xl rounded-3xl p-8">
          <h4 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-2">
            <span>✨</span>
            <span>포함 서비스</span>
          </h4>
          <div className="space-y-6">
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-700 flex items-center space-x-2">
                <span>🚚</span>
                <span>전국 무료 배송 및 설치</span>
              </span>
              <span className="text-emerald-600 font-bold">무료</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-700 flex items-center space-x-2">
                <span>🛠️</span>
                <span>24시간 기술 지원</span>
              </span>
              <span className="text-emerald-600 font-bold">무료</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-700 flex items-center space-x-2">
                <span>📦</span>
                <span>수거 및 반납 서비스</span>
              </span>
              <span className="text-emerald-600 font-bold">무료</span>
            </div>
            <div className="flex justify-between items-center py-4 pt-6 border-t border-gray-200">
              <span className="text-gray-700 font-semibold flex items-center space-x-2">
                <span>💰</span>
                <span>보증금 (반납 시 환불)</span>
              </span>
              <span className="text-gray-900 font-bold text-lg">₩{productInfo.baseServices.deposit.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 결제 전 동의 사항 및 필수 고지사항 */}
      <div className="max-w-6xl mx-auto mt-12">
        {/* 전자상거래법 필수 고지사항 */}
        <div className="bg-orange/10 border border-orange/30 rounded-2xl p-6 mb-6">
          <h5 className="text-lg font-bold text-black mb-4 flex items-center">
            <span className="mr-2">⚖️</span>
            전자상거래법 필수 고지사항
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div><span className="font-semibold text-black">상호명:</span> 디지털화환</div>
              <div><span className="font-semibold text-black">대표자:</span> 조지형</div>
              <div><span className="font-semibold text-black">사업자등록번호:</span> 411-39-01174</div>
              <div><span className="font-semibold text-black">통신판매업번호:</span> <span className="text-orange">[신고 진행중]</span></div>
            </div>
            <div className="space-y-2">
              <div><span className="font-semibold text-black">연락처:</span> 02-336-0250</div>
              <div><span className="font-semibold text-black">이메일:</span> baikal86@naver.com</div>
              <div><span className="font-semibold text-black">사업장 주소:</span><br />서울특별시 중구 을지로 지하 220, 지하2층 청년창업소누리 A-8호</div>
            </div>
          </div>
        </div>

        {/* 결제 관련 유의사항 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6">
          <h5 className="text-lg font-bold text-yellow-800 mb-4 flex items-center">
            <span className="mr-2">⚠️</span>
            결제 관련 유의사항
          </h5>
          <div className="space-y-3 text-sm text-yellow-800">
            <div className="flex items-start space-x-2">
              <span className="text-yellow-600">•</span>
              <span><strong>보증금:</strong> 렌트 비용 외 보증금 {productInfo.baseServices.deposit.toLocaleString()}원이 별도로 결제되며, 제품 반납 시 전액 환불됩니다.</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-yellow-600">•</span>
              <span><strong>환불 정책:</strong> 설치 완료 후 7일 이내 환불 신청 가능하며, 환불 금액은 사유에 따라 차등 적용됩니다.</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-yellow-600">•</span>
              <span><strong>렌트 기간:</strong> 선택하신 {currentRental.name} 기준으로 계산되며, 연장 시 별도 협의가 필요합니다.</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-yellow-600">•</span>
              <span><strong>설치 및 수거:</strong> 전문 기술진이 직접 방문하여 설치 및 수거를 진행하며, 일정 조율이 필요할 수 있습니다.</span>
            </div>
          </div>
        </div>

        {/* 약관 동의 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h5 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📋</span>
            약관 동의 (필수)
          </h5>
          <div className="space-y-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={agreements.terms}
                onChange={(e) => onAgreementChange({...agreements, terms: e.target.checked})}
                className="mt-1 w-4 h-4 text-orange border-gray-300 rounded focus:ring-orange"
              />
              <span className="text-sm">
                <a href="/terms" target="_blank" className="text-orange underline font-semibold hover:text-[#d15a1f]">이용약관</a>에 동의합니다. <span className="text-red-500">(필수)</span>
              </span>
            </label>
            
            <label className="flex items-start space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={agreements.privacy}
                onChange={(e) => onAgreementChange({...agreements, privacy: e.target.checked})}
                className="mt-1 w-4 h-4 text-orange border-gray-300 rounded focus:ring-orange"
              />
              <span className="text-sm">
                <a href="/privacy" target="_blank" className="text-orange underline font-semibold hover:text-[#d15a1f]">개인정보처리방침</a>에 동의합니다. <span className="text-red-500">(필수)</span>
              </span>
            </label>
            
            <label className="flex items-start space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={agreements.refund}
                onChange={(e) => onAgreementChange({...agreements, refund: e.target.checked})}
                className="mt-1 w-4 h-4 text-orange border-gray-300 rounded focus:ring-orange"
              />
              <span className="text-sm">
                <a href="/returns" target="_blank" className="text-orange underline font-semibold hover:text-[#d15a1f]">교환 및 환불 정책</a>을 확인했습니다. <span className="text-red-500">(필수)</span>
              </span>
            </label>
            
            <label className="flex items-start space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={agreements.ecommerce}
                onChange={(e) => onAgreementChange({...agreements, ecommerce: e.target.checked})}
                className="mt-1 w-4 h-4 text-orange border-gray-300 rounded focus:ring-orange"
              />
              <span className="text-sm">
                전자상거래법에 따른 필수 고지사항을 확인했으며, 위 결제 관련 유의사항에 동의합니다. <span className="text-red-500">(필수)</span>
              </span>
            </label>
          </div>
          
          {/* 전체 동의 여부 확인 */}
          {(!agreements.terms || !agreements.privacy || !agreements.refund || !agreements.ecommerce) && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">
                ⚠️ 모든 필수 약관에 동의해야 결제를 진행할 수 있습니다.
              </p>
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
