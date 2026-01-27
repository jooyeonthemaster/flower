'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Announcement, AnnouncementCategory } from '@/types/firestore';

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

  const getCategoryConfig = (category: AnnouncementCategory) => {
    const config: Record<AnnouncementCategory, { label: string; className: string }> = {
      notice: { label: '공지', className: 'bg-blue-100 text-blue-700' },
      update: { label: '업데이트', className: 'bg-green-100 text-green-700' },
      event: { label: '이벤트', className: 'bg-purple-100 text-purple-700' },
      maintenance: { label: '점검', className: 'bg-orange-100 text-orange-700' },
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
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">공지사항</h1>
          <p className="text-gray-500 mt-2">서비스 관련 공지사항을 확인하세요.</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Announcements List */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">로딩 중...</div>
          ) : filteredAnnouncements.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredAnnouncements.map((announcement) => {
                const categoryConfig = getCategoryConfig(announcement.category);
                return (
                  <Link
                    key={announcement.id}
                    href={`/notice/${announcement.id}`}
                    className="block p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {announcement.isPinned && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              중요
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryConfig.className}`}>
                            {categoryConfig.label}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{announcement.title}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2">
                          {announcement.summary || announcement.content.substring(0, 100)}
                        </p>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{new Date(announcement.createdAt).toLocaleDateString('ko-KR')}</span>
                        <span className="flex items-center gap-1">
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
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500">
                {selectedCategory === 'all' ? '등록된 공지사항이 없습니다.' : '해당 카테고리의 공지사항이 없습니다.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
