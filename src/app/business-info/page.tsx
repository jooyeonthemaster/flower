import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function BusinessInfoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* 헤더 섹션 */}
        <section className="bg-gradient-to-r from-gray-800 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                사업자 정보
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                디지털화환의 공식 사업자 등록 정보입니다.
              </p>
            </div>
          </div>
        </section>

        {/* 사업자 정보 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="max-w-4xl mx-auto">
              
              {/* 기본 정보 */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-12">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">사업자등록증 정보</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">기업 기본 정보</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-gray-600 font-medium">상호명</span>
                          <span className="font-bold text-lg">디지털화환</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-gray-600 font-medium">대표자</span>
                          <span className="font-semibold">조지형</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-gray-600 font-medium">사업자등록번호</span>
                          <span className="font-semibold">411-39-01174</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <span className="text-gray-600 font-medium">개업연월일</span>
                          <span className="font-semibold">2024년 06월 17일</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">연락처 정보</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-gray-600 font-medium">대표전화</span>
                          <span className="font-semibold">02-336-0250</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-gray-600 font-medium">이메일</span>
                          <span className="font-semibold">baikal86@naver.com</span>
                        </div>
                        <div className="py-3">
                          <span className="text-gray-600 font-medium block mb-2">사업장 소재지</span>
                          <span className="font-semibold text-sm">
                            서울특별시 중구 을지로 지하 220,<br/>
                            지하2층 청년창업소누리 A-8호<br/>
                            (을지로, 유즈인 을지역)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 사업 영역 */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">사업의 종류</h2>
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <h3 className="font-semibold text-blue-800 mb-2">제조업</h3>
                      <p className="text-sm text-gray-600">영업 제조업</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <h3 className="font-semibold text-purple-800 mb-2">전자 및 광학</h3>
                      <p className="text-sm text-gray-600">종합 전자 및 광학 조립제조업</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <h3 className="font-semibold text-green-800 mb-2">섬유 및 의류</h3>
                      <p className="text-sm text-gray-600">섬유 및 의류 제조업</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 text-center">
                      <h3 className="font-semibold text-orange-800 mb-2">농업 대행업</h3>
                      <p className="text-sm text-gray-600">농업 관련 대행 서비스</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 text-center">
                      <h3 className="font-semibold text-red-800 mb-2">광고 대행업</h3>
                      <p className="text-sm text-gray-600">광고 투자 및 대행업</p>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-4 text-center">
                      <h3 className="font-semibold text-indigo-800 mb-2">도매 및 소매업</h3>
                      <p className="text-sm text-gray-600">상품 유통 및 판매</p>
                    </div>
                    <div className="bg-pink-50 rounded-lg p-4 text-center">
                      <h3 className="font-semibold text-pink-800 mb-2">광고 관련 서비스</h3>
                      <p className="text-sm text-gray-600">기타 광고 관련 서비스업</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <h3 className="font-semibold text-gray-800 mb-2">사업 디자인업</h3>
                      <p className="text-sm text-gray-600">디자인 및 기획 서비스</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 인증 및 허가 */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">인증 및 허가사항</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-semibold mb-6">보유 인증</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <span className="font-semibold">사업자등록증</span>
                        <span className="text-green-600 font-bold">보유</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <span className="font-semibold">통신판매업 신고</span>
                        <span className="text-blue-600 font-bold">진행중</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <span className="font-semibold">KC 인증</span>
                        <span className="text-purple-600 font-bold">진행중</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-semibold mb-6">법적 준수사항</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">전자상거래등에서의 소비자보호에 관한 법률 준수</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">개인정보보호법 준수</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">제품안전기본법 준수</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">소비자분쟁조정기준 준수</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 사업자등록증 이미지 표시 영역 */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">사업자등록증</h2>
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="text-center">
                    <div className="bg-gray-100 rounded-lg p-8 mb-6">
                      <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-600">사업자등록증 원본</p>
                      <p className="text-sm text-gray-500 mt-2">등록번호: 411-39-01174</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      사업자등록증 원본은 고객센터 방문 시 열람 가능하며, 
                      필요 시 사본을 요청하실 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 연락처 */}
        <section className="py-16 bg-gradient-to-r from-gray-800 to-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
            <h2 className="text-3xl font-bold mb-6">사업자 정보 문의</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              사업자 정보와 관련된 문의사항이 있으시면 연락주세요.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="tel:02-336-0250"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                02-336-0250
              </a>
              <a
                href="mailto:baikal86@naver.com"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-800 transition-colors duration-300"
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
