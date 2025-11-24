'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* 배경 이미지 */}
                        <div className="absolute inset-0 z-0">
                    <div
                      className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                      style={{
                        backgroundImage: 'url(/images/hero/hero-background.jpg)',
                      }}
                    ></div>
        {/* 다크 오버레이 */}
        <div className="absolute inset-0 bg-black/50"></div>
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 w-full h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full min-h-[600px]">
            
            {/* 왼쪽: 텍스트 콘텐츠 */}
            <div className={`space-y-8 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
              
              {/* 메인 헤딩 */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                  디지털 홀로그램 <span className="text-blue-400">화환</span>
                </h1>
              </div>

              {/* 구분선 */}
              <div className="w-24 h-1 bg-blue-500"></div>

              {/* 설명 텍스트 */}
              <div className="space-y-6 max-w-lg">
                <p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
                  최첨단 홀로그램 기술로 구현된 프리미엄 디지털 화환
                </p>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                  소중한 순간을 영원히 기념하는 새로운 방식을 경험해보세요
                </p>
              </div>

              {/* CTA 버튼 그룹 */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-all duration-300 group"
                >
                  <span>제품 둘러보기</span>
                  <svg className="ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/ai-hologram"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    AI 홀로그램 만들기
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>

              {/* 특징 포인트 */}
              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-white font-medium">8K 해상도</span>
                  </div>
                  <p className="text-gray-400 text-sm pl-4">초고화질 홀로그램</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-white font-medium">프리미엄 품질</span>
                  </div>
                  <p className="text-gray-400 text-sm pl-4">최고급 디스플레이</p>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>

      {/* 하단 스크롤 인디케이터 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center space-y-2 text-white/70">
          <div className="w-0.5 h-16 bg-white/30"></div>
          <div className="w-2 h-2 border border-white/50 animate-bounce"></div>
        </div>
      </div>

      {/* 우측 장식 라인 */}
      <div className="absolute right-0 top-1/4 w-1 h-1/2 bg-gradient-to-b from-transparent via-blue-500/50 to-transparent hidden lg:block"></div>
    </section>
  )
} 