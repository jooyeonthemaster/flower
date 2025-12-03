import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: '제품',
      links: [
        { name: '블루 타입 화환', href: '/blue-type' },
        { name: '레드 타입 화환', href: '/red-type' },
        { name: '기술 사양', href: '/specifications' },
        { name: '설치 가이드', href: '/installation' },
      ]
    },
    {
      title: '서비스',
      links: [
        { name: '상담 문의', href: '/contact' },
        { name: '기술 지원', href: '/support' },
        { name: '배송 정보', href: '/shipping' },
        { name: '교환/환불', href: '/returns' },
      ]
    },
    {
      title: '회사',
      links: [
        { name: '회사 소개', href: '/about' },
        { name: '사업자 정보', href: '/business-info' },
        { name: '파트너십', href: '/partners' },
        { name: '채용 정보', href: '/careers' },
      ]
    },
    {
      title: '고객지원',
      links: [
        { name: 'FAQ', href: '/faq' },
        { name: '사용 가이드', href: '/guide' },
        { name: '개인정보처리방침', href: '/privacy' },
        { name: '이용약관', href: '/terms' },
      ]
    }
  ]

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* 상단 구분선 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gray-700"></div>
      
      {/* 메인 footer 콘텐츠 */}
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* 상단 섹션: 로고 및 설명 */}
          <div className="mb-16 pb-16 border-b border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* 왼쪽: 브랜드 정보 */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">디</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">디지털화환</h3>
                    <p className="text-gray-400 text-sm">Digital Hologram Wreaths</p>
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed max-w-lg">
                  첨단 홀로그램 기술로 구현되는 차세대 화환 솔루션. 
                  전통과 혁신이 만나는 특별한 경험을 선사합니다.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-6">
                    <div className="text-sm">
                      <span className="text-gray-400">대표전화:</span>
                      <span className="text-white ml-2 font-medium">02-336-0250</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">이메일:</span>
                      <span className="text-white ml-2 font-medium">baikal86@naver.com</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-400">대표자:</span>
                    <span className="text-white ml-2 font-medium">조지형</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-400">사업자등록번호:</span>
                    <span className="text-white ml-2 font-medium">411-39-01174</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-400">통신판매업번호:</span>
                    <span className="text-white ml-2 font-medium">제 2025-서울동작-1506 호</span>
                  </div>
                </div>
              </div>

              {/* 오른쪽: 빠른 연락 */}
              <div className="bg-gray-800 rounded-2xl p-8 space-y-4">
                <h4 className="text-lg font-semibold mb-4">빠른 상담 문의</h4>
                <p className="text-gray-300 text-sm mb-6">
                  전문 상담사가 고객님의 요구사항에 맞는 최적의 솔루션을 제안해드립니다.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
                >
                  상담 신청하기
                </Link>
              </div>
            </div>
          </div>

          {/* 중간 섹션: 링크 그리드 */}
          <div className="mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerSections.map((section, index) => (
                <div key={index} className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          href={link.href}
                          className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 섹션: 저작권 및 추가 정보 */}
      <div className="border-t border-gray-700 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* 저작권 및 사업자 정보 */}
            <div className="text-gray-400 text-sm space-y-1">
              <p>© {currentYear} 디지털화환. All rights reserved.</p>
              <p>서울특별시 중구 을지로 지하 220, 지하2층 청년창업소누리 A-8호 | 대표: 조지형</p>
              <p>사업자등록번호: 411-39-01174 | 통신판매업번호: 제 2025-서울동작-1506 호</p>
            </div>

            {/* 하단 링크 */}
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                이용약관
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                개인정보처리방침
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors duration-200">
                사이트맵
              </Link>
            </div>

            {/* 인증 마크 */}
            <div className="flex items-center space-x-4">
              <div className="px-3 py-1 bg-gray-800 rounded text-xs text-gray-300 border border-gray-700">
                ISO 9001
              </div>
              <div className="px-3 py-1 bg-gray-800 rounded text-xs text-gray-300 border border-gray-700">
                KC 인증
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 장식 요소 */}
      <div className="absolute top-20 right-10 w-32 h-32 border border-gray-700/30 transform rotate-45 opacity-30"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 border border-blue-600/20 transform -rotate-12 opacity-50"></div>
    </footer>
  )
} 