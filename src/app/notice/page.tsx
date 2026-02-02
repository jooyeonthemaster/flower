'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Announcement, AnnouncementCategory } from '@/types/firestore';
import Badge, { BadgeVariant } from '@/components/ui/Badge';

export default function NoticePage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<AnnouncementCategory | 'all'>('all');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/announcements?publishedOnly=true&limit=50');
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.announcements || []);
      }
    } catch (error) {
      console.error('공지사항 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryConfig = (category: AnnouncementCategory): { label: string; variant: BadgeVariant } => {
    const config: Record<AnnouncementCategory, { label: string; variant: BadgeVariant }> = {
      notice: { label: '공지', variant: 'warning' },
      update: { label: '업데이트', variant: 'success' },
      event: { label: '이벤트', variant: 'info' },
      maintenance: { label: '점검', variant: 'error' },
    };
    return config[category] || config.notice;
  };

  const filteredAnnouncements = selectedCategory === 'all'
    ? announcements
    : announcements.filter(a => a.category === selectedCategory);

  const categories: { value: AnnouncementCategory | 'all'; label: string }[] = [
    { value: 'all', label: '전체' },
    { value: 'notice', label: '공지' },
    { value: 'update', label: '업데이트' },
    { value: 'event', label: '이벤트' },
    { value: 'maintenance', label: '점검' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        {/* 헤더 섹션 */}
        <section className="bg-cream py-20 border-b-4 border-orange">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black">
                공지사항
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                디지털화환의 새로운 소식과 중요한 공지사항을 확인하세요.
              </p>
            </div>
          </div>
        </section>

        {/* 본문 */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                    selectedCategory === cat.value
                      ? 'bg-orange text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-orange/30'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Announcements List */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-16 text-center">
                  <div className="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">로딩 중...</p>
                </div>
              ) : filteredAnnouncements.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredAnnouncements.map((announcement) => {
                    const categoryConfig = getCategoryConfig(announcement.category);
                    return (
                      <Link
                        key={announcement.id}
                        href={`/notice/${announcement.id}`}
                        className="block p-6 hover:bg-cream/30 transition-all duration-200 group"
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-3">
                              {announcement.isPinned && (
                                <Badge variant="error">
                                  📌 중요
                                </Badge>
                              )}
                              <Badge variant={categoryConfig.variant}>
                                {categoryConfig.label}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange transition-colors">
                              {announcement.title}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                              {announcement.summary || announcement.content.substring(0, 100)}
                            </p>
                          </div>

                          {/* Meta */}
                          <div className="flex md:flex-col items-center gap-3 text-sm text-gray-500">
                            <span className="whitespace-nowrap">
                              {new Date(announcement.createdAt).toLocaleDateString('ko-KR')}
                            </span>
                            <span className="flex items-center gap-1.5 whitespace-nowrap">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {announcement.viewCount}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="p-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">
                    {selectedCategory === 'all' ? '등록된 공지사항이 없습니다.' : '해당 카테고리의 공지사항이 없습니다.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
