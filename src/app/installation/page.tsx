import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function InstallationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* 헤더 섹션 */}
        <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                설치 가이드
              </h1>
              <p className="text-xl text-green-100 max-w-3xl mx-auto">
                디지털화환의 안전하고 효율적인 설치를 위한 상세한 가이드입니다.
              </p>
            </div>
          </div>
        </section>

        {/* 설치 전 준비사항 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">설치 전 준비사항</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* 공간 준비 */}
              <div className="bg-orange/10 rounded-2xl p-8">
                <div className="w-16 h-16 bg-orange/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4a1 1 0 011-1h4m0 0V1m0 2h4m0 0V1m0 2v4m0 0h4a1 1 0 011 1v4m0 0v4m0 0v4a1 1 0 01-1 1h-4m0 0H9m0 0H5a1 1 0 01-1-1v-4m0 0V9" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">공간 확보</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-orange mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    최소 2m × 2m × 3m 공간
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-orange mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    평평하고 안정적인 바닥
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-orange mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    직사광선 차단 가능
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-orange mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    진동이 적은 환경
                  </li>
                </ul>
              </div>

              {/* 전원 준비 */}
              <div className="bg-yellow-50 rounded-2xl p-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">전원 준비</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    220V 전원 콘센트
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    30A 용량 확보
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    접지 연결 필수
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    UPS 설치 권장
                  </li>
                </ul>
              </div>

              {/* 네트워크 준비 */}
              <div className="bg-green-50 rounded-2xl p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">네트워크 연결</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    최소 100Mbps 인터넷
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    유선 연결 권장
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    고정 IP 설정
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    방화벽 설정 확인
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 설치 과정 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">설치 과정</h2>
            
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange/20 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-orange">1</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-4">현장 조사 및 측정</h3>
                    <p className="text-gray-600 mb-4">
                      전문 기술진이 현장을 방문하여 설치 환경을 점검하고 최적의 설치 위치를 결정합니다.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-2 text-sm">
                        <li>• 공간 크기 및 구조 측정</li>
                        <li>• 전원 공급 상태 확인</li>
                        <li>• 네트워크 환경 점검</li>
                      </ul>
                      <ul className="space-y-2 text-sm">
                        <li>• 조명 환경 분석</li>
                        <li>• 소음 및 진동 측정</li>
                        <li>• 안전 요소 검토</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-moss-green/20 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-moss-green">2</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-4">장비 설치 및 조립</h3>
                    <p className="text-gray-600 mb-4">
                      홀로그램 프로젝터와 제어 시스템을 안전하게 설치하고 모든 연결을 완료합니다.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-2 text-sm">
                        <li>• 프로젝터 마운트 설치</li>
                        <li>• 제어 시스템 배치</li>
                        <li>• 전원 케이블 연결</li>
                      </ul>
                      <ul className="space-y-2 text-sm">
                        <li>• 네트워크 케이블 연결</li>
                        <li>• 안전 장치 설치</li>
                        <li>• 케이블 정리 및 고정</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-green-600">3</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-4">시스템 설정 및 테스트</h3>
                    <p className="text-gray-600 mb-4">
                      소프트웨어 설치 및 설정을 완료하고 모든 기능이 정상 작동하는지 테스트합니다.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-2 text-sm">
                        <li>• OS 및 드라이버 설치</li>
                        <li>• 홀로그램 소프트웨어 설치</li>
                        <li>• 네트워크 설정</li>
                      </ul>
                      <ul className="space-y-2 text-sm">
                        <li>• 화질 및 색상 조정</li>
                        <li>• 음향 시스템 테스트</li>
                        <li>• 전체 시스템 동작 확인</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-orange-600">4</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-4">사용자 교육 및 인계</h3>
                    <p className="text-gray-600 mb-4">
                      고객에게 시스템 사용법을 상세히 안내하고 관리 방법을 교육합니다.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-2 text-sm">
                        <li>• 기본 조작법 교육</li>
                        <li>• 콘텐츠 변경 방법</li>
                        <li>• 일상 관리 요령</li>
                      </ul>
                      <ul className="space-y-2 text-sm">
                        <li>• 문제 해결 가이드</li>
                        <li>• 비상 연락처 안내</li>
                        <li>• 보증서 및 매뉴얼 전달</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 설치 주의사항 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">설치 주의사항</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* 안전 주의사항 */}
              <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-200">
                <h3 className="text-2xl font-semibold text-red-800 mb-6">⚠️ 안전 주의사항</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold">전기 안전</h4>
                      <p className="text-sm text-gray-600">설치 전 반드시 전원을 차단하고 작업하세요.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold">장비 안전</h4>
                      <p className="text-sm text-gray-600">정밀 장비이므로 충격이나 진동을 피해주세요.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold">환경 안전</h4>
                      <p className="text-sm text-gray-600">온도와 습도를 적정 수준으로 유지해주세요.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* 최적화 팁 */}
              <div className="bg-orange/10 rounded-2xl p-8 border-2 border-orange/30">
                <h3 className="text-2xl font-semibold text-orange mb-6">💡 최적화 팁</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-orange mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold">조명 최적화</h4>
                      <p className="text-sm text-gray-600">주변 조명을 조절하여 홀로그램 효과를 극대화하세요.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-orange mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold">위치 선정</h4>
                      <p className="text-sm text-gray-600">관람객의 시야각을 고려한 최적 위치에 설치하세요.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-orange mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold">정기 점검</h4>
                      <p className="text-sm text-gray-600">월 1회 정기 점검으로 최상의 성능을 유지하세요.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 문의 섹션 */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-teal-600 text-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
            <h2 className="text-3xl font-bold mb-6">설치 상담 문의</h2>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              설치와 관련된 궁금한 점이나 현장 조사가 필요하시면 연락주세요.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="tel:02-336-0250"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                02-336-0250
              </a>
              <a
                href="mailto:baikal86@naver.com"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                설치 문의하기
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
