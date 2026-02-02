'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Announcement, AnnouncementCategory } from '@/types/firestore';

export default function AdminAnnouncementsPage() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/announcements?publishedOnly=false&limit=100');
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.announcements || []);
      }
    } catch (error) {
      console.error('공지사항 목록 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (announcement: Announcement) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/announcements/${announcement.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: user.uid,
          isPublished: !announcement.isPublished,
        }),
      });

      if (response.ok) {
        setAnnouncements((prev) =>
          prev.map((a) =>
            a.id === announcement.id ? { ...a, isPublished: !a.isPublished } : a
          )
        );
      }
    } catch (error) {
      console.error('공지사항 발행 상태 변경 오류:', error);
    }
  };

  const togglePin = async (announcement: Announcement) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/announcements/${announcement.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: user.uid,
          isPinned: !announcement.isPinned,
        }),
      });

      if (response.ok) {
        setAnnouncements((prev) =>
          prev.map((a) =>
            a.id === announcement.id ? { ...a, isPinned: !a.isPinned } : a
          )
        );
      }
    } catch (error) {
      console.error('공지사항 고정 상태 변경 오류:', error);
    }
  };

  const deleteAnnouncement = async (announcementId: string) => {
    if (!user) return;
    if (!confirm('정말 이 공지사항을 삭제하시겠습니까?')) return;

    setDeleting(announcementId);
    try {
      const response = await fetch(
        `/api/announcements/${announcementId}?adminId=${user.uid}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        setAnnouncements((prev) => prev.filter((a) => a.id !== announcementId));
      }
    } catch (error) {
      console.error('공지사항 삭제 오류:', error);
    } finally {
      setDeleting(null);
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">공지사항 관리</h1>
          <p className="text-gray-500 mt-1">서비스 공지사항을 작성하고 관리합니다.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchAnnouncements}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            새로고침
          </button>
          <Link
            href="/admin/announcements/new"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            새 공지사항
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">전체</p>
          <p className="text-2xl font-bold text-gray-900">{announcements.length}개</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">발행됨</p>
          <p className="text-2xl font-bold text-green-600">
            {announcements.filter((a) => a.isPublished).length}개
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">미발행</p>
          <p className="text-2xl font-bold text-yellow-600">
            {announcements.filter((a) => !a.isPublished).length}개
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">고정됨</p>
          <p className="text-2xl font-bold text-blue-600">
            {announcements.filter((a) => a.isPinned).length}개
          </p>
        </div>
      </div>

      {/* Announcements List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-12 text-center text-gray-500">로딩 중...</div>
          ) : announcements.length > 0 ? (
            announcements.map((announcement) => {
              const categoryConfig = getCategoryConfig(announcement.category);
              return (
                <div
                  key={announcement.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        {announcement.isPinned && (
                          <span className="text-blue-500">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                            </svg>
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryConfig.className}`}>
                          {categoryConfig.label}
                        </span>
                        {!announcement.isPublished && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                            미발행
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 truncate">{announcement.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {announcement.summary || announcement.content.substring(0, 100)}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>{announcement.authorName}</span>
                        <span>{new Date(announcement.createdAt).toLocaleDateString('ko-KR')}</span>
                        <span>조회 {announcement.viewCount}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePin(announcement)}
                        className={`p-2 rounded-lg transition-colors ${announcement.isPinned
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-400 hover:text-gray-600'
                          }`}
                        title={announcement.isPinned ? '고정 해제' : '고정'}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => togglePublish(announcement)}
                        className={`p-2 rounded-lg transition-colors ${announcement.isPublished
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400 hover:text-gray-600'
                          }`}
                        title={announcement.isPublished ? '발행 취소' : '발행'}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <Link
                        href={`/admin/announcements/${announcement.id}/edit`}
                        className="p-2 rounded-lg bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        title="수정"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => deleteAnnouncement(announcement.id)}
                        disabled={deleting === announcement.id}
                        className="p-2 rounded-lg bg-gray-100 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="삭제"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 mb-4">아직 공지사항이 없습니다.</p>
              <Link
                href="/admin/announcements/new"
                className="inline-block px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                첫 공지사항 작성하기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
