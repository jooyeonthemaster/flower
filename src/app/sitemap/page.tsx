'use client';

import Link from 'next/link';

export default function SitemapPage() {
  const siteStructure = [
    {
      title: '메인',
      links: [
        { name: '홈', href: '/' },
        { name: '제품 소개', href: '/products' },
      ],
    },
    {
      title: '제품',
      links: [
        { name: '블루 타입 화환', href: '/blue-type' },
        { name: '레드 타입 화환', href: '/red-type' },
        { name: '기술 사양', href: '/specifications' },
        { name: '설치 가이드', href: '/installation' },
      ],
    },
    {
      title: '서비스',
      links: [
        { name: 'AI 홀로그램 제작', href: '/ai-hologram' },
        { name: '상담 문의', href: '/contact' },
        { name: '기술 지원', href: '/support' },
        { name: '배송 정보', href: '/shipping' },
        { name: '교환/환불', href: '/returns' },
      ],
    },
    {
      title: '회사 정보',
      links: [
        { name: '회사 소개', href: '/about' },
        { name: '사업자 정보', href: '/business-info' },
        { name: '파트너십', href: '/partners' },
        { name: '채용 정보', href: '/careers' },
      ],
    },
    {
      title: '고객지원',
      links: [
        { name: 'FAQ', href: '/faq' },
        { name: '사용 가이드', href: '/guide' },
        { name: '공지사항', href: '/notice' },
      ],
    },
    {
      title: '정책',
      links: [
        { name: '개인정보처리방침', href: '/privacy' },
        { name: '이용약관', href: '/terms' },
      ],
    },
    {
      title: '회원',
      links: [
        { name: '마이페이지', href: '/mypage' },
        { name: '프로필', href: '/mypage/profile' },
        { name: '주문 내역', href: '/mypage/orders' },
        { name: '내 영상', href: '/mypage/videos' },
        { name: '전송 요청', href: '/mypage/requests' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900">사이트맵</h1>
          <p className="text-gray-500 mt-2">
            디지털화환 웹사이트의 전체 페이지 구조입니다.
          </p>
        </div>

        {/* Site Structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteStructure.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-[#E66B33] transition-colors duration-200 flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
