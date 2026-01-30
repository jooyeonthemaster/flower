'use client'

import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="py-24 bg-gray-900 border-t-4 border-orange">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center space-y-12">
          
          {/* 메인 헤딩 */}
          <div className="space-y-6">
            <div className="inline-block">
              <span className="px-4 py-2 bg-orange text-white text-sm font-bold tracking-wider uppercase border-2 border-[#d15a1f]">
                START NOW
              </span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              지금 바로 전문 서비스를<br />
              <span className="text-orange">경험하세요</span>
            </h2>
            
            <div className="w-16 h-0.5 bg-orange/60 mx-auto"></div>
            
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              기업 전용 Digital Hologram Wreaths 솔루션으로<br />
              귀하의 비즈니스에 혁신을 더하십시오
            </p>
          </div>

          {/* CTA 버튼 그룹 */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-12 py-4 bg-white text-gray-900 font-bold text-lg hover:bg-gray-100 transition-colors duration-300 border-2 border-gray-300 group"
            >
              <span>무료 상담 신청</span>
              <svg className="ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center px-12 py-4 border-2 border-white text-white font-bold text-lg hover:bg-white hover:text-gray-900 transition-colors duration-300"
            >
              기업용 카탈로그
            </Link>
          </div>

          {/* 추가 정보 */}
          <div className="pt-12 border-t-2 border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "📞",
                  title: "24시간 기업 전담팀",
                  description: "전문 B2B 상담사와 즉시 연결"
                },
                {
                  icon: "🚚",
                  title: "전국 당일 설치",
                  description: "기업 고객 전용 당일 설치 서비스"
                },
                {
                  icon: "🛡️",
                  title: "5년 기업 보증",
                  description: "B2B 전용 연장 보증 프로그램"
                }
              ].map((feature, index) => (
                <div key={index} className="space-y-4 p-6 border-2 border-gray-700 bg-gray-800">
                  <div className="text-3xl">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">{feature.title}</h3>
                  <div className="h-0.5 bg-orange w-12"></div>
                  <p className="text-gray-400 text-sm font-medium">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 기업 고객 전용 섹션 */}
          <div className="pt-12 border-t-2 border-gray-700">
            <div className="bg-gray-800 p-8 border-2 border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">기업 고객 전용 혜택</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-2">
                  <div className="text-orange font-bold">■ 대량 주문 할인</div>
                  <div className="text-gray-300 text-sm">10개 이상 주문 시 특별 할인가</div>
                </div>
                <div className="space-y-2">
                  <div className="text-orange font-bold">■ 전담 매니저 배정</div>
                  <div className="text-gray-300 text-sm">기업 전용 계정 관리 서비스</div>
                </div>
                <div className="space-y-2">
                  <div className="text-orange font-bold">■ 맞춤 솔루션 개발</div>
                  <div className="text-gray-300 text-sm">기업 요구사항 맞춤 제작</div>
                </div>
                <div className="space-y-2">
                  <div className="text-orange font-bold">■ 연간 계약 혜택</div>
                  <div className="text-gray-300 text-sm">장기 계약 고객 특별 서비스</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 