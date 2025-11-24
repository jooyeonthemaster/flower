'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AuthButton from '@/components/auth/AuthButton'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: '홈', href: '/' },
    { name: '제품 소개', href: '/products' },
    { name: '블루 타입', href: '/blue-type' },
    { name: '레드 타입', href: '/red-type' },
    { name: '문의하기', href: '/contact' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* 로고 */}
                                <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center">
                          <Image
                            src="/images/logo.png"
                            alt="Digital Hologram Wreaths"
                            width={150}
                            height={72}
                            className="h-18 w-auto"
                          />
                        </Link>
                      </div>

          {/* 데스크톱 네비게이션 */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 relative group transition-colors duration-200"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* CTA 버튼 & 로그인 */}
          <div className="hidden lg:flex items-center space-x-4">
            <AuthButton />
            <Link
              href="/contact"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              상담 문의
            </Link>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="sr-only">메뉴 열기</span>
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <span className={`block w-full h-0.5 bg-current transition-transform duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}></span>
                <span className={`block w-full h-0.5 bg-current transition-opacity duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}></span>
                <span className={`block w-full h-0.5 bg-current transition-transform duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden border-t border-gray-200 ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="pb-4 pt-2 space-y-2 bg-white">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 px-4 space-y-3">
              <div className="flex justify-center">
                <AuthButton />
              </div>
              <Link
                href="/contact"
                className="block w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center rounded-full font-medium hover:shadow-lg transition-all duration-300"
              >
                상담 문의
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
} 