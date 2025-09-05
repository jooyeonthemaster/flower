import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function SpecificationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* 헤더 섹션 */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                기술 사양
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                디지털화환의 상세한 기술 사양과 성능 정보를 확인하세요.
              </p>
            </div>
          </div>
        </section>

        {/* 전체 시스템 사양 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">전체 시스템 사양</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 홀로그램 프로젝터 */}
              <div className="bg-blue-50 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-blue-800 mb-6">홀로그램 프로젝터</h3>
                <div className="space-y-4">
                  <div className="border-b border-blue-200 pb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">해상도</span>
                      <span className="font-semibold">4K UHD (3840×2160)</span>
                    </div>
                  </div>
                  <div className="border-b border-blue-200 pb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">밝기</span>
                      <span className="font-semibold">3,000 ANSI 루멘</span>
                    </div>
                  </div>
                  <div className="border-b border-blue-200 pb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">명암비</span>
                      <span className="font-semibold">10,000:1</span>
                    </div>
                  </div>
                  <div className="border-b border-blue-200 pb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">프레임 레이트</span>
                      <span className="font-semibold">60fps</span>
                    </div>
                  </div>
                  <div className="border-b border-blue-200 pb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">투사 거리</span>
                      <span className="font-semibold">1.5m - 5m</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">램프 수명</span>
                      <span className="font-semibold">20,000시간</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 제어 시스템 */}
              <div className="bg-purple-50 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-purple-800 mb-6">제어 시스템</h3>
                <div className="space-y-4">
                  <div className="border-b border-purple-200 pb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">프로세서</span>
                      <span className="font-semibold">Intel i7 12세대</span>
                    </div>
                  </div>
                  <div className="border-b border-purple-200 pb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">메모리</span>
                      <span className="font-semibold">32GB DDR5</span>
                    </div>
                  </div>
                  <div className="border-b border-purple-200 pb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">저장장치</span>
                      <span className="font-semibold">1TB NVMe SSD</span>
                    </div>
                  </div>
                  <div className="border-b border-purple-200 pb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">그래픽카드</span>
                      <span className="font-semibold">RTX 4070</span>
                    </div>
                  </div>
                  <div className="border-b border-purple-200 pb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">연결</span>
                      <span className="font-semibold">Wi-Fi 6, 이더넷</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">OS</span>
                      <span className="font-semibold">Windows 11 Pro</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 물리적 사양 */}
              <div className="bg-green-50 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-green-800 mb-6">물리적 사양</h3>
                <div className="space-y-4">
                  <div className="border-b border-green-200 pb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">전체 크기</span>
                      <span className="font-semibold">2m × 2m × 3m</span>
                    </div>
                  </div>
                  <div className="border-b border-green-200 pb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">무게</span>
                      <span className="font-semibold">45kg</span>
                    </div>
                  </div>
                  <div className="border-b border-green-200 pb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">소비전력</span>
                      <span className="font-semibold">200W</span>
                    </div>
                  </div>
                  <div className="border-b border-green-200 pb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">작동온도</span>
                      <span className="font-semibold">15°C ~ 30°C</span>
                    </div>
                  </div>
                  <div className="border-b border-green-200 pb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">습도</span>
                      <span className="font-semibold">40% ~ 70%</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">소음</span>
                      <span className="font-semibold">&lt; 40dB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 소프트웨어 기능 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">소프트웨어 기능</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-semibold mb-4">콘텐츠 관리</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>실시간 콘텐츠 변경 및 업데이트</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>다양한 파일 형식 지원 (MP4, PNG, JPG)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>스케줄링 기능 (시간별 자동 재생)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>원격 제어 및 모니터링</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-semibold mb-4">보안 기능</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-purple-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>암호화된 콘텐츠 전송</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-purple-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>접근 권한 관리 시스템</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-purple-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>자동 백업 및 복구 기능</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-purple-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>실시간 시스템 모니터링</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-semibold mb-4">네트워크 요구사항</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">인터넷 속도</span>
                      <span className="font-semibold">최소 100Mbps</span>
                    </li>
                    <li className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">권장 속도</span>
                      <span className="font-semibold">500Mbps 이상</span>
                    </li>
                    <li className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">연결 방식</span>
                      <span className="font-semibold">유선(권장), 무선</span>
                    </li>
                    <li className="flex justify-between items-center py-2">
                      <span className="text-gray-700">대역폭</span>
                      <span className="font-semibold">전용 회선 권장</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-semibold mb-4">환경 요구사항</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">설치 공간</span>
                      <span className="font-semibold">2m × 2m × 3m</span>
                    </li>
                    <li className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">전원</span>
                      <span className="font-semibold">220V, 30A</span>
                    </li>
                    <li className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">온도</span>
                      <span className="font-semibold">15°C ~ 30°C</span>
                    </li>
                    <li className="flex justify-between items-center py-2">
                      <span className="text-gray-700">습도</span>
                      <span className="font-semibold">40% ~ 70%</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 성능 비교 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">제품 라인업 비교</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 기본형 */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold mb-2">기본형</h3>
                  <p className="text-gray-600">Essential</p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-blue-600">₩580,000</span>
                    <span className="text-gray-500 text-sm block">7일 대여 기준</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">HD 홀로그램 디스플레이</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">기본 애니메이션 5종</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">원격 제어 기능</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">기본 설치 서비스</span>
                  </li>
                </ul>
              </div>

              {/* 프리미엄형 */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-500 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">인기</span>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold mb-2">프리미엄형</h3>
                  <p className="text-gray-600">Premium</p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-blue-600">₩880,000</span>
                    <span className="text-gray-500 text-sm block">7일 대여 기준</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">4K UHD 홀로그램 디스플레이</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">프리미엄 애니메이션 15종</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">맞춤 콘텐츠 제작</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">전문 설치 및 운영 지원</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">24시간 기술 지원</span>
                  </li>
                </ul>
              </div>

              {/* 엔터프라이즈형 */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-500">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold mb-2">엔터프라이즈형</h3>
                  <p className="text-gray-600">Enterprise</p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-purple-600">맞춤 견적</span>
                    <span className="text-gray-500 text-sm block">요구사항에 따라</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">8K 초고해상도 디스플레이</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">무제한 맞춤 콘텐츠</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">다중 디스플레이 연동</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">전담 기술진 배정</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">연장 보증 서비스</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 연락처 */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
            <h2 className="text-3xl font-bold mb-6">기술 사양 문의</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              더 자세한 기술 사양이나 맞춤형 솔루션이 필요하시면 전문가와 상담해보세요.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="tel:02-336-0250"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                02-336-0250
              </a>
              <a
                href="mailto:baikal86@naver.com"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                baikal86@naver.com
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
