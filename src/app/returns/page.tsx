import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* 헤더 섹션 */}
        <section className="bg-cream border-b-4 border-orange text-white py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                교환 및 환불 규정
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                디지털화환의 교환 및 환불 정책에 대한 상세한 안내입니다.
              </p>
            </div>
          </div>
        </section>

        {/* 정책 개요 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">교환/환불 정책 개요</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                고객 만족을 위해 공정하고 투명한 교환/환불 정책을 운영하고 있습니다. 
                디지털화환의 특성상 일반 상품과 다른 정책이 적용됩니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-orange/10 rounded-2xl">
                <div className="w-16 h-16 bg-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">7일 이내</h3>
                <p className="text-gray-600">설치 완료 후 7일 이내 교환/환불 신청 가능</p>
              </div>

              <div className="text-center p-8 bg-green-50 rounded-2xl">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">무료 A/S</h3>
                <p className="text-gray-600">제품 하자 시 1년간 무료 수리 서비스</p>
              </div>

              <div className="text-center p-8 bg-moss-green/10 rounded-2xl">
                <div className="w-16 h-16 bg-moss-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-moss-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">전액 환불</h3>
                <p className="text-gray-600">정당한 사유 시 구매 금액 100% 환불</p>
              </div>
            </div>
          </div>
        </section>

        {/* 교환 정책 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">교환 정책</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* 교환 가능한 경우 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold mb-6 text-green-600">교환 가능한 경우</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900">제품 하자</h4>
                      <p className="text-gray-600 text-sm">제조상의 결함이나 기능 이상이 있는 경우</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900">배송 중 파손</h4>
                      <p className="text-gray-600 text-sm">운송 과정에서 발생한 물리적 손상</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900">주문 상품 불일치</h4>
                      <p className="text-gray-600 text-sm">주문한 제품과 다른 제품이 배송된 경우</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900">설치 불가</h4>
                      <p className="text-gray-600 text-sm">현장 여건상 설치가 불가능한 경우 (사전 안내 미흡 시)</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* 교환 불가능한 경우 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold mb-6 text-red-600">교환 불가능한 경우</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900">단순 변심</h4>
                      <p className="text-gray-600 text-sm">고객의 단순 변심으로 인한 교환 요청</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900">고객 과실</h4>
                      <p className="text-gray-600 text-sm">고객의 부주의로 인한 손상이나 파손</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900">사용 후 교환</h4>
                      <p className="text-gray-600 text-sm">정상 사용 후 7일이 경과한 경우</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900">맞춤 제작품</h4>
                      <p className="text-gray-600 text-sm">고객 요청에 따라 특별 제작된 맞춤형 제품</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 환불 정책 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">환불 정책</h2>
            
            <div className="bg-gray-50 rounded-2xl p-8 mb-12">
              <h3 className="text-2xl font-semibold mb-6">환불 절차 및 기간</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-orange">1</span>
                  </div>
                  <h4 className="font-semibold mb-2">환불 신청</h4>
                  <p className="text-sm text-gray-600">고객센터 연락 또는 온라인 신청</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-moss-green/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-moss-green">2</span>
                  </div>
                  <h4 className="font-semibold mb-2">제품 회수</h4>
                  <p className="text-sm text-gray-600">전문 기술진이 직접 방문하여 회수</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-green-600">3</span>
                  </div>
                  <h4 className="font-semibold mb-2">상태 확인</h4>
                  <p className="text-sm text-gray-600">제품 상태 및 환불 사유 검토</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-orange-600">4</span>
                  </div>
                  <h4 className="font-semibold mb-2">환불 처리</h4>
                  <p className="text-sm text-gray-600">승인 후 3-5일 내 환불 완료</p>
                </div>
              </div>
            </div>

            {/* 환불 금액 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold mb-6 text-orange">환불 금액 기준</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700">제품 하자 시</span>
                    <span className="font-semibold text-green-600">100% 환불</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700">배송 중 파손 시</span>
                    <span className="font-semibold text-green-600">100% 환불</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700">설치 불가 시 (당사 사유)</span>
                    <span className="font-semibold text-green-600">100% 환불</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700">설치 불가 시 (고객 사유)</span>
                    <span className="font-semibold text-orange-600">90% 환불</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-700">단순 변심 (7일 이내)</span>
                    <span className="font-semibold text-orange-600">85% 환불</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>참고:</strong> 환불 시 배송비 및 설치비는 차감될 수 있습니다.
                  </p>
                </div>
              </div>

              {/* 환불 방법 */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold mb-6 text-moss-green">환불 방법</h3>
                
                <div className="space-y-6">
                  <div className="border-l-4 border-orange pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">계좌 이체</h4>
                    <p className="text-gray-600 text-sm">고객 지정 계좌로 직접 이체 (가장 빠른 방법)</p>
                    <p className="text-orange text-sm font-medium">처리 기간: 1-2일</p>
                  </div>
                  
                  <div className="border-l-4 border-dusty-rose pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">카드 승인 취소</h4>
                    <p className="text-gray-600 text-sm">신용카드 결제 시 카드사를 통한 승인 취소</p>
                    <p className="text-moss-green text-sm font-medium">처리 기간: 3-5일</p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">현금 환불</h4>
                    <p className="text-gray-600 text-sm">현금 결제 시 현금으로 환불 (방문 필요)</p>
                    <p className="text-green-600 text-sm font-medium">처리 기간: 즉시</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-orange/10 border border-orange/30 rounded-lg">
                  <p className="text-sm text-orange">
                    <strong>안내:</strong> 환불 계좌는 주문자 본인 명의 계좌만 가능합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* A/S 정책 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">A/S 서비스</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 무상 A/S */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-600">무상 A/S</h3>
                  <p className="text-gray-600 text-sm">구매 후 1년간</p>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    제품 하자로 인한 수리
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    소프트웨어 업데이트
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    정기 점검 서비스
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    전화 기술 지원
                  </li>
                </ul>
              </div>

              {/* 유상 A/S */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-orange-600">유상 A/S</h3>
                  <p className="text-gray-600 text-sm">1년 경과 후 또는 고객 과실</p>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    고객 과실로 인한 손상
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    보증 기간 만료 후 수리
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    부품 교체 및 업그레이드
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    추가 기능 설치
                  </li>
                </ul>
              </div>

              {/* 연장 보증 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-orange">연장 보증</h3>
                  <p className="text-gray-600 text-sm">추가 1-2년 연장 가능</p>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-orange mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    제품 가격의 10% (1년)
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-orange mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    제품 가격의 15% (2년)
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-orange mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    우선 A/S 서비스
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-orange mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    정기 점검 서비스
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 연락처 및 신청 방법 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">교환/환불 신청 방법</h2>
            
            <div className="bg-cream border-b-4 border-orange rounded-2xl p-8 text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-6">연락처</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="font-semibold">고객센터</p>
                        <p>02-336-0250</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="font-semibold">이메일</p>
                        <p>baikal86@naver.com</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-6 h-6 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-semibold">운영시간</p>
                        <p>평일 09:00 - 18:00</p>
                        <p className="text-sm opacity-90">토요일 09:00 - 15:00</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-6">필요 정보</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>주문번호 또는 구매 확인서</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>구매자 정보 (이름, 연락처)</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>교환/환불 사유</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>제품 상태 사진 (하자 시)</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>환불 계좌 정보 (환불 시)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

