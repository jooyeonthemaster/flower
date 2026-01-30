'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Announcement, AnnouncementCategory } from '@/types/firestore';

interface NoticeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const { id } = use(params);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnouncement();
  }, [id]);

  const fetchAnnouncement = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/announcements/${id}`);
      if (response.ok) {
        const data = await response.json();
        setAnnouncement(data.announcement);
      } else if (response.status === 404) {
        setError('공지사항을 찾을 수 없습니다.');
      } else {
        setError('공지사항을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('공지사항 조회 오류:', err);
      setError('공지사항을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryConfig = (category: AnnouncementCategory) => {
    const config: Record<AnnouncementCategory, { label: string; className: string }> = {
      notice: { label: '공지', className: 'bg-orange/20 text-orange' },
      update: { label: '업데이트', className: 'bg-green-100 text-green-700' },
      event: { label: '이벤트', className: 'bg-moss-green/20 text-moss-green' },
      maintenance: { label: '점검', className: 'bg-orange-100 text-orange-700' },
    };
    return config[category] || config.notice;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-medium">로딩 중...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">공지사항을 찾을 수 없습니다</h2>
            <p className="text-gray-600 mb-6">{error || '요청하신 공지사항이 존재하지 않거나 삭제되었습니다.'}</p>
            <Link
              href="/notice"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange text-white rounded-full hover:bg-[#d15a1f] transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              목록으로 돌아가기
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const categoryConfig = getCategoryConfig(announcement.category);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20">
        {/* 헤더 섹션 */}
        <section className="bg-cream py-16 border-b-4 border-orange">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
            {/* Back Button */}
            <Link
              href="/notice"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-orange transition-colors font-medium mb-8"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              목록으로
            </Link>

            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              {announcement.isPinned && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                  📌 중요
                </span>
              )}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${categoryConfig.className}`}>
                {categoryConfig.label}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-6">
              {announcement.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">{announcement.authorName}</span>
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(announcement.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                조회 {announcement.viewCount}
              </span>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                {announcement.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-6 text-gray-700 leading-relaxed last:mb-0">
                    {paragraph || '\u00A0'}
                  </p>
                ))}
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="mt-8 flex justify-center">
              <Link
                href="/notice"
                className="inline-flex items-center gap-2 px-8 py-3 bg-orange text-white rounded-full hover:bg-[#d15a1f] transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                목록으로 돌아가기
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
