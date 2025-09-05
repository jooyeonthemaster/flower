import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* 헤더 섹션 */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                채용 정보
              </h1>
              <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
                디지털화환과 함께 미래를 만들어갈 인재를 찾습니다.
              </p>
            </div>
          </div>
        </section>

        {/* 회사 문화 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">디지털화환에서 일한다는 것</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                혁신적인 기술로 전통 문화를 재해석하며, 새로운 가치를 창조하는 일에 함께하세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-indigo-50 rounded-2xl">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">혁신적 사고</h3>
                <p className="text-gray-600">창의적이고 혁신적인 아이디어를 자유롭게 표현할 수 있는 환경</p>
              </div>

              <div className="text-center p-8 bg-purple-50 rounded-2xl">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">팀워크</h3>
                <p className="text-gray-600">서로를 존중하고 협력하는 수평적 조직 문화</p>
              </div>

              <div className="text-center p-8 bg-blue-50 rounded-2xl">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">성장 기회</h3>
                <p className="text-gray-600">개인의 성장과 회사의 성장이 함께하는 기회</p>
              </div>
            </div>
          </div>
        </section>

        {/* 채용 공고 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">현재 채용 공고</h2>
            
            <div className="space-y-8">
              {/* 소프트웨어 개발자 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">소프트웨어 개발자</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">정규직</span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">경력 2-5년</span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">서울</span>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0">
                    <p className="text-2xl font-bold text-blue-600">연봉 4,000만원~</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">주요 업무</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• 홀로그램 콘텐츠 관리 시스템 개발</li>
                      <li>• 실시간 렌더링 엔진 최적화</li>
                      <li>• 사용자 인터페이스 개발</li>
                      <li>• API 개발 및 시스템 연동</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">필요 기술</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• React, Node.js, TypeScript</li>
                      <li>• 3D 그래픽스 (Three.js, WebGL)</li>
                      <li>• 실시간 통신 (WebSocket)</li>
                      <li>• 클라우드 서비스 (AWS, Azure)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 하드웨어 엔지니어 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">하드웨어 엔지니어</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">정규직</span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">경력 3-7년</span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">서울</span>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0">
                    <p className="text-2xl font-bold text-blue-600">연봉 4,500만원~</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">주요 업무</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• 홀로그램 프로젝터 시스템 설계</li>
                      <li>• 제어 하드웨어 개발</li>
                      <li>• 제품 테스트 및 품질 관리</li>
                      <li>• 기술 문서 작성</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">필요 기술</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• 전자회로 설계 및 PCB 디자인</li>
                      <li>• 임베디드 시스템 개발</li>
                      <li>• 광학 시스템 이해</li>
                      <li>• CAD 소프트웨어 활용</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 영업/마케팅 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">영업/마케팅 전문가</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">정규직</span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">경력 2-5년</span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">전국</span>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0">
                    <p className="text-2xl font-bold text-blue-600">연봉 3,500만원~</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">주요 업무</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• B2B 영업 및 신규 고객 발굴</li>
                      <li>• 파트너사 관리 및 협력</li>
                      <li>• 마케팅 전략 수립 및 실행</li>
                      <li>• 고객 관계 관리</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">우대 사항</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• IT 업계 영업 경험</li>
                      <li>• 장례업계 네트워크</li>
                      <li>• 디지털 마케팅 경험</li>
                      <li>• 영어 가능자</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 복리후생 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">복리후생</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-blue-50 rounded-2xl">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">급여</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>성과급 지급</li>
                  <li>연차 수당</li>
                  <li>퇴직금</li>
                </ul>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-2xl">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">건강</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>건강검진 지원</li>
                  <li>의료비 지원</li>
                  <li>헬스장 이용료</li>
                </ul>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-2xl">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">교육</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>교육비 지원</li>
                  <li>컨퍼런스 참가</li>
                  <li>자격증 취득 지원</li>
                </ul>
              </div>

              <div className="text-center p-6 bg-orange-50 rounded-2xl">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">근무 환경</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>유연근무제</li>
                  <li>재택근무 가능</li>
                  <li>자유로운 휴가</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 지원 방법 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">지원 방법</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-semibold mb-6">제출 서류</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>이력서 (자유 양식)</span>
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>자기소개서</span>
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>포트폴리오 (해당자)</span>
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>경력증명서</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold mb-6">전형 과정</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-bold text-indigo-600">1</span>
                        </div>
                        <span>서류 전형</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-bold text-purple-600">2</span>
                        </div>
                        <span>1차 면접 (실무진)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-bold text-blue-600">3</span>
                        </div>
                        <span>2차 면접 (임원진)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-bold text-green-600">4</span>
                        </div>
                        <span>최종 합격</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 연락처 */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
            <h2 className="text-3xl font-bold mb-6">채용 문의</h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              채용과 관련된 문의사항이 있으시거나 지원을 원하시면 연락주세요.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="tel:02-336-0250"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                02-336-0250
              </a>
              <a
                href="mailto:baikal86@naver.com"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-indigo-600 transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                채용 문의하기
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
