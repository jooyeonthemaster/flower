import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* 헤더 섹션 */}
        <section className="bg-gradient-to-r from-moss-green to-orange text-white py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                기술 지원
              </h1>
              <p className="text-xl text-green-100 max-w-3xl mx-auto">
                디지털화환 제품의 최적 성능을 위한 전문적인 기술 지원 서비스를 제공합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 지원 서비스 개요 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">기술 지원 서비스</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                24시간 기술 지원부터 정기 점검까지, 고객의 디지털화환이 항상 최상의 상태를 유지할 수 있도록 도와드립니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 24시간 지원 */}
              <div className="text-center p-8 bg-green-50 rounded-2xl">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">24시간 지원</h3>
                <p className="text-gray-600">긴급 상황 시 24시간 전화 및 원격 지원 서비스</p>
              </div>

              {/* 원격 진단 */}
              <div className="text-center p-8 bg-orange/10 rounded-2xl">
                <div className="w-16 h-16 bg-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">원격 진단</h3>
                <p className="text-gray-600">실시간 원격 접속을 통한 신속한 문제 진단 및 해결</p>
              </div>

              {/* 정기 점검 */}
              <div className="text-center p-8 bg-moss-green/10 rounded-2xl">
                <div className="w-16 h-16 bg-moss-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-moss-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">정기 점검</h3>
                <p className="text-gray-600">월 1회 정기 점검으로 예방적 유지보수 실시</p>
              </div>
            </div>
          </div>
        </section>

        {/* 지원 범위 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">기술 지원 범위</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* 하드웨어 지원 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-orange mb-6">하드웨어 지원</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-orange mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="font-semibold">프로젝터 관리</h4>
                      <p className="text-sm text-gray-600">홀로그램 프로젝터의 성능 최적화 및 유지보수</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-orange mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="font-semibold">제어 시스템</h4>
                      <p className="text-sm text-gray-600">컴퓨터 시스템 및 제어 장비 관리</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-orange mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="font-semibold">네트워크 연결</h4>
                      <p className="text-sm text-gray-600">인터넷 연결 및 네트워크 설정 지원</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-orange mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="font-semibold">부품 교체</h4>
                      <p className="text-sm text-gray-600">소모품 및 부품 교체 서비스</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* 소프트웨어 지원 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-moss-green mb-6">소프트웨어 지원</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-moss-green mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="font-semibold">업데이트 관리</h4>
                      <p className="text-sm text-gray-600">정기적인 소프트웨어 업데이트 및 보안 패치</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-moss-green mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="font-semibold">콘텐츠 관리</h4>
                      <p className="text-sm text-gray-600">콘텐츠 업로드, 편집 및 스케줄 관리</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-moss-green mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="font-semibold">사용자 교육</h4>
                      <p className="text-sm text-gray-600">시스템 사용법 및 관리 방법 교육</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-moss-green mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="font-semibold">문제 해결</h4>
                      <p className="text-sm text-gray-600">소프트웨어 오류 및 시스템 문제 해결</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 지원 프로세스 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">기술 지원 프로세스</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">문제 접수</h3>
                <p className="text-gray-600 text-sm">전화, 이메일, 또는 원격 모니터링을 통한 문제 접수</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">원격 진단</h3>
                <p className="text-gray-600 text-sm">원격 접속을 통한 1차 진단 및 즉시 해결 시도</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-moss-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-moss-green">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">현장 지원</h3>
                <p className="text-gray-600 text-sm">원격 해결이 어려운 경우 전문 기술진 현장 파견</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">4</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">사후 관리</h3>
                <p className="text-gray-600 text-sm">문제 해결 후 추가 점검 및 예방 조치 실시</p>
              </div>
            </div>
          </div>
        </section>

        {/* 지원 계획 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">기술 지원 계획</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 기본 지원 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold text-green-600">기본 지원</h3>
                  <p className="text-gray-600">모든 고객 대상</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">전화 기술 지원</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">이메일 지원</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">온라인 매뉴얼 제공</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">기본 원격 지원</span>
                  </li>
                </ul>
              </div>

              {/* 프리미엄 지원 */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold text-orange">프리미엄 지원</h3>
                  <p className="text-gray-600">프리미엄 고객 대상</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-orange mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">24시간 전화 지원</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-orange mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">우선 현장 지원</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-orange mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">정기 점검 서비스</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-orange mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">맞춤 교육 프로그램</span>
                  </li>
                </ul>
              </div>

              {/* 엔터프라이즈 지원 */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-dusty-rose">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold text-moss-green">엔터프라이즈 지원</h3>
                  <p className="text-gray-600">기업 고객 대상</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-dusty-rose mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">전담 기술진 배정</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-dusty-rose mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">SLA 보장 서비스</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-dusty-rose mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">맞춤형 솔루션 개발</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-dusty-rose mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">예방적 유지보수</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 자주 발생하는 문제 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">자주 발생하는 문제 해결</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold">Q</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">홀로그램이 흐릿하게 보여요</h3>
                    <p className="text-gray-600 text-sm">
                      프로젝터 렌즈 청소 또는 초점 조정이 필요할 수 있습니다. 
                      설정 메뉴에서 화질 조정을 시도해보시고, 해결되지 않으면 기술 지원팀에 연락주세요.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold">Q</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">시스템이 자주 재시작돼요</h3>
                    <p className="text-gray-600 text-sm">
                      전원 공급 불안정 또는 과열이 원인일 수 있습니다. 
                      UPS 설치 여부와 주변 온도를 확인해주시고, 지속적인 문제 시 즉시 연락주세요.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold">Q</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">콘텐츠가 업데이트되지 않아요</h3>
                    <p className="text-gray-600 text-sm">
                      네트워크 연결 상태를 확인해주세요. 
                      인터넷 연결이 정상이라면 방화벽 설정이나 네트워크 권한 문제일 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 연락처 */}
        <section className="py-16 bg-gradient-to-r from-moss-green to-orange text-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">기술 지원 연락처</h2>
              <p className="text-xl text-green-100 max-w-3xl mx-auto">
                언제든지 기술적인 문제나 궁금한 점이 있으시면 연락주세요.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 긴급 지원 */}
              <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-semibold mb-6">🚨 긴급 기술 지원</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="font-semibold">24시간 긴급 상담</p>
                      <p className="text-green-100">02-336-0250</p>
                    </div>
                  </div>
                  <p className="text-sm text-green-100">
                    시스템 장애나 긴급 상황 시 24시간 언제든지 연락주세요.
                  </p>
                </div>
              </div>

              {/* 일반 지원 */}
              <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-semibold mb-6">📞 일반 기술 지원</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-semibold">이메일 지원</p>
                      <p className="text-white/90">baikal86@naver.com</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/90">
                    평일 09:00 - 18:00 운영<br/>
                    이메일은 24시간 접수 가능
                  </p>
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
