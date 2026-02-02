'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        {/* 헤더 섹션 */}
        <section className="bg-cream py-20 border-b-4 border-orange">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black">
                회사 소개
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                디지털화환은 첨단 홀로그램 기술로 전통적인 화환의 새로운 패러다임을 제시합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 회사 개요 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">디지털화환</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  디지털화환은 2024년 설립된 혁신적인 기술 기업으로, 전통적인 화환 문화에
                  최첨단 홀로그램 기술을 접목하여 새로운 추모 및 축하 문화를 만들어가고 있습니다.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  우리는 디지털 기술의 무한한 가능성을 통해 더욱 의미 있고 지속 가능한
                  기념 방식을 제공하며, 고객의 소중한 순간을 영원히 간직할 수 있도록 돕습니다.
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-white rounded-lg shadow-md border-2 border-orange/20">
                    <h3 className="text-2xl font-bold text-orange mb-2">2024</h3>
                    <p className="text-gray-600 text-sm">설립년도</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-md border-2 border-moss-green/20">
                    <h3 className="text-2xl font-bold text-moss-green mb-2">100%</h3>
                    <p className="text-gray-600 text-sm">고객 만족도</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl p-8 h-96 flex items-center justify-center border-2 border-gray-200">
                  <div className="text-center">
                    <div className="flex flex-col items-center justify-center mb-6">
                      <Image
                        src="/images/logo.png"
                        alt="디지털화환"
                        width={200}
                        height={80}
                        className="h-20 w-auto object-contain"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">디지털화환</h3>
                    <p className="text-gray-600">Digital Hologram Wreaths</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 비전과 미션 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">비전과 미션</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                우리의 비전과 미션을 통해 더 나은 미래를 만들어가겠습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* 비전 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-orange">비전</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-center">
                  디지털 기술을 통해 전통적인 추모 및 축하 문화를 혁신하여,
                  더욱 의미 있고 지속 가능한 기념 문화를 선도하는 글로벌 기업이 되겠습니다.
                </p>
              </div>

              {/* 미션 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-dusty-rose/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-dusty-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-dusty-rose">미션</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-center">
                  첨단 홀로그램 기술을 활용하여 고객의 소중한 순간을 아름답게 기념하고,
                  환경 친화적이면서도 감동적인 디지털 화환 솔루션을 제공합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 핵심 가치 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">핵심 가치</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                디지털화환이 추구하는 핵심 가치들입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">혁신</h3>
                <p className="text-gray-600 text-sm">끊임없는 기술 혁신을 통해 새로운 가치를 창조합니다.</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">진정성</h3>
                <p className="text-gray-600 text-sm">고객의 마음을 이해하고 진심으로 소통합니다.</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-dusty-rose/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-dusty-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">지속가능성</h3>
                <p className="text-gray-600 text-sm">환경을 생각하는 지속 가능한 솔루션을 제공합니다.</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">품질</h3>
                <p className="text-gray-600 text-sm">최고 품질의 제품과 서비스를 제공합니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 사업자 정보 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">사업자 정보</h2>
              <p className="text-gray-600">
                디지털화환의 공식 사업자 정보입니다.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">기업 정보</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">상호명</span>
                        <span className="font-semibold">디지털화환</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">대표자</span>
                        <span className="font-semibold">조지형</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">사업자등록번호</span>
                        <span className="font-semibold">411-39-01174</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">개업일</span>
                        <span className="font-semibold">2024년 06월 17일</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">연락처 정보</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">대표전화</span>
                        <span className="font-semibold">02-336-0250</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">이메일</span>
                        <span className="font-semibold">baikal86@naver.com</span>
                      </div>
                      <div className="py-2">
                        <span className="text-gray-600 block mb-1">사업장 주소</span>
                        <span className="font-semibold text-sm">
                          서울특별시 중구 을지로 지하 220,<br />
                          지하2층 청년창업소누리 A-8호
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">사업 영역</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="bg-orange/10 rounded-lg p-3 text-center">
                    <p className="text-sm font-medium text-orange">제조업</p>
                  </div>
                  <div className="bg-moss-green/10 rounded-lg p-3 text-center">
                    <p className="text-sm font-medium text-moss-green">전자 및 광학 조립</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-sm font-medium text-green-800">섬유 및 의류</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <p className="text-sm font-medium text-orange-800">농업 대행업</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <p className="text-sm font-medium text-red-800">광고 대행업</p>
                  </div>
                  <div className="bg-dusty-rose/10 rounded-lg p-3 text-center">
                    <p className="text-sm font-medium text-dusty-rose">도매 및 소매업</p>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-3 text-center">
                    <p className="text-sm font-medium text-pink-800">광고 관련 서비스</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-sm font-medium text-gray-800">사업 디자인업</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 연혁 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">회사 연혁</h2>
              <p className="text-gray-600">
                디지털화환의 성장 과정을 소개합니다.
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-orange"></div>

              <div className="space-y-12">
                <div className="relative flex items-center">
                  <div className="flex-1 text-right pr-8">
                    <div className="bg-orange/10 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-orange mb-2">2024년 6월</h3>
                      <p className="text-gray-700">디지털화환 법인 설립</p>
                      <p className="text-sm text-gray-600 mt-1">혁신적인 디지털 화환 기술 개발 시작</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange rounded-full border-4 border-white"></div>
                  <div className="flex-1 pl-8"></div>
                </div>

                <div className="relative flex items-center">
                  <div className="flex-1 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange rounded-full border-4 border-white"></div>
                  <div className="flex-1 pl-8">
                    <div className="bg-dusty-rose/10 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-dusty-rose mb-2">2024년 하반기</h3>
                      <p className="text-gray-700">첫 번째 홀로그램 화환 프로토타입 완성</p>
                      <p className="text-sm text-gray-600 mt-1">기술 특허 출원 및 시장 진입 준비</p>
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center">
                  <div className="flex-1 text-right pr-8">
                    <div className="bg-green-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">2025년 계획</h3>
                      <p className="text-gray-700">본격적인 시장 출시 및 서비스 확대</p>
                      <p className="text-sm text-gray-600 mt-1">전국 배송망 구축 및 파트너십 확대</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange rounded-full border-4 border-white"></div>
                  <div className="flex-1 pl-8"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 연락처 */}
        <section className="py-16 bg-moss-green text-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
            <h2 className="text-3xl font-bold mb-6">함께 만들어가는 미래</h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              디지털화환과 함께 새로운 기념 문화를 만들어가실 파트너를 찾습니다.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                상담 문의하기
              </a>
              <a
                href="tel:02-336-0250"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-orange transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                02-336-0250
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

