import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* 헤더 섹션 */}
        <section className="bg-gradient-to-r from-moss-green to-orange text-white py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                사용 가이드
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                디지털화환을 효과적으로 사용하기 위한 상세한 사용 가이드입니다.
              </p>
            </div>
          </div>
        </section>

        {/* 시작하기 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">시작하기</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">전원 켜기</h3>
                <p className="text-gray-600 text-sm">메인 전원 스위치를 켜고 시스템 부팅을 기다립니다.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">네트워크 연결</h3>
                <p className="text-gray-600 text-sm">Wi-Fi 또는 이더넷을 통해 인터넷에 연결합니다.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-moss-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-moss-green">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">콘텐츠 선택</h3>
                <p className="text-gray-600 text-sm">원하는 화환 디자인과 애니메이션을 선택합니다.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">4</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">재생 시작</h3>
                <p className="text-gray-600 text-sm">설정한 콘텐츠가 홀로그램으로 재생됩니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 기본 조작법 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">기본 조작법</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* 터치 스크린 조작 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold mb-6">터치 스크린 조작</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-orange/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">메인 메뉴</h4>
                      <p className="text-gray-600 text-sm">화면 중앙을 터치하면 메인 메뉴가 나타납니다.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-orange/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">콘텐츠 선택</h4>
                      <p className="text-gray-600 text-sm">갤러리에서 원하는 화환 디자인을 선택하세요.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-moss-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-moss-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">설정 조정</h4>
                      <p className="text-gray-600 text-sm">밝기, 크기, 재생 속도 등을 조정할 수 있습니다.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 원격 제어 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold mb-6">원격 제어</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">모바일 앱</h4>
                      <p className="text-gray-600 text-sm">스마트폰 앱을 통해 원격으로 제어할 수 있습니다.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">웹 인터페이스</h4>
                      <p className="text-gray-600 text-sm">PC나 태블릿에서 웹 브라우저로 접속하여 제어하세요.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">스케줄링</h4>
                      <p className="text-gray-600 text-sm">시간대별로 자동 재생 스케줄을 설정할 수 있습니다.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 콘텐츠 관리 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">콘텐츠 관리</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 기본 콘텐츠 */}
              <div className="bg-orange/10 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-orange mb-6">기본 콘텐츠</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-orange mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    클래식 화환 디자인 10종
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-orange mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    모던 스타일 디자인 8종
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-orange mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    계절별 테마 디자인 12종
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-orange mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    기본 애니메이션 효과
                  </li>
                </ul>
              </div>

              {/* 맞춤 콘텐츠 */}
              <div className="bg-moss-green/10 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-moss-green mb-6">맞춤 콘텐츠</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-moss-green mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    개인 사진 업로드
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-moss-green mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    맞춤 메시지 입력
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-moss-green mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    회사 로고 삽입
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-moss-green mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    특별 애니메이션 제작
                  </li>
                </ul>
              </div>

              {/* 고급 설정 */}
              <div className="bg-green-50 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-green-800 mb-6">고급 설정</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    화질 및 밝기 조정
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    재생 속도 제어
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    자동 반복 설정
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    절전 모드 설정
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 관리 및 유지보수 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">관리 및 유지보수</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* 일상 관리 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold mb-6">일상 관리</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-orange/10 rounded-lg">
                    <h4 className="font-semibold text-orange mb-2">매일</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 외관 상태 점검</li>
                      <li>• 정상 작동 확인</li>
                      <li>• 먼지 제거 (부드러운 천 사용)</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-moss-green/10 rounded-lg">
                    <h4 className="font-semibold text-moss-green mb-2">주간</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 렌즈 청소</li>
                      <li>• 케이블 연결 상태 확인</li>
                      <li>• 소프트웨어 업데이트 확인</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">월간</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 전체 시스템 점검</li>
                      <li>• 성능 최적화</li>
                      <li>• 백업 데이터 확인</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 문제 해결 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold mb-6">문제 해결</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">⚠️ 주의사항</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 전원 관련 작업 시 반드시 전원 차단</li>
                      <li>• 물이나 습기가 있는 곳에서 청소 금지</li>
                      <li>• 강한 화학 세제 사용 금지</li>
                      <li>• 임의로 분해하지 마세요</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">🚨 긴급 상황</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      다음과 같은 상황 시 즉시 전원을 차단하고 기술 지원팀에 연락하세요:
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 타는 냄새나 연기 발생</li>
                      <li>• 비정상적인 소음</li>
                      <li>• 과열 현상</li>
                      <li>• 스파크 발생</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 지원 연락처 */}
        <section className="py-16 bg-gradient-to-r from-moss-green to-orange text-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
            <h2 className="text-3xl font-bold mb-6">사용법 문의</h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              사용 중 궁금한 점이나 도움이 필요하시면 언제든지 연락주세요.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="tel:02-336-0250"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                02-336-0250
              </a>
              <a
                href="mailto:baikal86@naver.com"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-orange transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                사용법 문의하기
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
