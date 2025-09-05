import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: '디지털화환 - 혁신적인 홀로그램 화환 솔루션',
    template: '%s | 디지털화환'
  },
  description: '첨단 홀로그램 기술로 구현되는 차세대 화환 솔루션. 전통과 혁신이 만나는 특별한 경험을 선사합니다. 디지털화환과 함께 새로운 기념 문화를 만들어보세요.',
  keywords: ['디지털화환', '홀로그램 화환', '디지털 기념품', '조문', '축하', '홀로그램 기술', '친환경 화환', '미래형 화환'],
  authors: [{ name: '디지털화환', url: 'https://digitalwreaths.co.kr' }],
  creator: '디지털화환',
  publisher: '디지털화환',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://digitalwreaths.co.kr',
    title: '디지털화환 - 혁신적인 홀로그램 화환 솔루션',
    description: '첨단 홀로그램 기술로 구현되는 차세대 화환 솔루션. 전통과 혁신이 만나는 특별한 경험을 선사합니다.',
    siteName: '디지털화환',
  },
  twitter: {
    card: 'summary_large_image',
    title: '디지털화환 - 혁신적인 홀로그램 화환 솔루션',
    description: '첨단 홀로그램 기술로 구현되는 차세대 화환 솔루션. 전통과 혁신이 만나는 특별한 경험을 선사합니다.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`scroll-smooth ${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
