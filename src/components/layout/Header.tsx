'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AuthButton from '@/components/auth/AuthButton'
import { useAuth } from '@/contexts/AuthContext'

interface HeaderProps {
  variant?: 'default' | 'transparent';
}

export default function Header({ variant = 'default' }: HeaderProps) {
  const { user, isAdmin } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Scroll handler for transparent variant
  useEffect(() => {
    if (variant === 'default') return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant]);

  // Determine styles based on variant and scroll state
  const isTransparent = variant === 'transparent' && !isScrolled && !isMobileMenuOpen;

  // 헤더 배경을 로고 배경색과 동일하게 불투명 흰색으로 고정
  const headerClass = `fixed top-0 left-0 right-0 z-[100] transition-all duration-300 bg-white border-b border-gray-200 shadow-sm`;

  // Always use dark text for Light Theme homepage
  const textColorClass = 'text-gray-900 hover:text-[#E66B33]';

  const navigation = [
    { name: '홈', href: '/' },
    { name: '제품 소개', href: '/products' },
    { name: '블루 타입', href: '/blue-type' },
    { name: '레드 타입', href: '/red-type' },
    { name: '공지사항', href: '/notice' },
    { name: '문의하기', href: '/contact' },
  ]

  return (
    <header className={headerClass}>
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.png"
                alt="Flower Hologram"
                width={120}
                height={48}
                className="h-12 w-auto object-contain mix-blend-multiply"
              />
            </Link>
          </div>

          {/* 데스크톱 네비게이션 */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-bold relative group transition-colors duration-200 ${textColorClass}`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E66B33] transition-all duration-300 group-hover:w-full`}></span>
              </Link>
            ))}
          </div>

          {/* CTA 버튼 & 로그인 */}
          <div className="hidden lg:flex items-center space-x-4">
            {user && (
              <Link
                href="/mypage"
                className={`text-sm font-bold relative group transition-colors duration-200 ${textColorClass}`}
              >
                마이페이지
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                className={`text-sm font-bold relative group transition-colors duration-200 text-blue-600 hover:text-blue-700`}
              >
                관리자
              </Link>
            )}
            <AuthButton />
            <Link
              href="/ai-hologram"
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 transform hover:scale-105 ${isTransparent
                ? 'bg-[#0a0a0a] text-white hover:bg-[#E66B33]'
                : 'bg-[#0a0a0a] text-white hover:bg-[#E66B33]'
                }`}
            >
              지금 시작하기
            </Link>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md transition-colors duration-200 text-gray-900 hover:bg-gray-100"
            >
              <span className="sr-only">메뉴 열기</span>
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <span className={`block w-full h-0.5 bg-current transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}></span>
                <span className={`block w-full h-0.5 bg-current transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''
                  }`}></span>
                <span className={`block w-full h-0.5 bg-current transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden border-t border-gray-700/10 ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
          <div className="pb-4 pt-2 space-y-2 bg-white">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-base font-bold text-gray-900 hover:bg-gray-50 hover:text-[#E66B33] rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 px-4 space-y-3">
              {user && (
                <Link
                  href="/mypage"
                  className="block px-4 py-3 text-base font-bold text-gray-900 hover:bg-gray-50 hover:text-[#E66B33] rounded-lg transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  마이페이지
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="block px-4 py-3 text-base font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  관리자
                </Link>
              )}
              <div className="flex justify-center text-gray-900">
                <AuthButton />
              </div>
              <Link
                href="/ai-hologram"
                className="block w-full px-6 py-3 bg-[#0a0a0a] text-white text-center rounded-full font-bold hover:bg-[#E66B33] transition-all duration-300"
              >
                지금 시작하기
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
