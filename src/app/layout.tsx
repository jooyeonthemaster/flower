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
    default: 'Digital Hologram Wreaths - 혁신적인 디지털 화환',
    template: '%s | Digital Hologram Wreaths'
  },
  description: '고급스러운 디지털 홀로그램 화환으로 특별한 순간을 기념하세요. 최첨단 기술과 전통적인 조화가 만나는 새로운 경험.',
  keywords: ['디지털 화환', '홀로그램', '화환', '기념품', '조문', '축하', '기술'],
  authors: [{ name: 'Digital Hologram Wreaths' }],
  creator: 'Digital Hologram Wreaths',
  publisher: 'Digital Hologram Wreaths',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'http://localhost:3000',
    title: 'Digital Hologram Wreaths - 혁신적인 디지털 화환',
    description: '고급스러운 디지털 홀로그램 화환으로 특별한 순간을 기념하세요.',
    siteName: 'Digital Hologram Wreaths',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Hologram Wreaths - 혁신적인 디지털 화환',
    description: '고급스러운 디지털 홀로그램 화환으로 특별한 순간을 기념하세요.',
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
