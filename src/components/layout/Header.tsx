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
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

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
    {
      name: '제품 소개',
      href: '/products',
      submenu: [
        { name: '블루 타입', href: '/blue-type' },
        { name: '레드 타입', href: '/red-type' },
      ]
    },
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
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className={`text-sm font-bold relative transition-colors duration-200 ${textColorClass} flex items-center gap-1`}
                >
                  {item.name}
                  {item.submenu && (
                    <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E66B33] transition-all duration-300 group-hover:w-full`}></span>
                </Link>

                {/* 드롭다운 메뉴 */}
                {item.submenu && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange/10 hover:text-[#E66B33] transition-colors duration-200"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
                className={`text-sm font-bold relative group transition-colors duration-200 text-orange hover:text-[#d15a1f]`}
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
              <div key={item.name}>
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    className="flex-1 block px-4 py-3 text-base font-bold text-gray-900 hover:bg-gray-50 hover:text-[#E66B33] rounded-lg transition-colors duration-200"
                    onClick={() => {
                      if (!item.submenu) {
                        setIsMobileMenuOpen(false);
                      }
                    }}
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <button
                      onClick={() => setOpenSubmenu(openSubmenu === item.name ? null : item.name)}
                      className="px-4 py-3 text-gray-900"
                    >
                      <svg
                        className={`w-5 h-5 transition-transform duration-200 ${openSubmenu === item.name ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* 모바일 서브메뉴 */}
                {item.submenu && openSubmenu === item.name && (
                  <div className="pl-4 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange/10 hover:text-[#E66B33] rounded-lg transition-colors duration-200"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setOpenSubmenu(null);
                        }}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
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
                  className="block px-4 py-3 text-base font-bold text-orange hover:bg-orange/10 rounded-lg transition-colors duration-200"
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
