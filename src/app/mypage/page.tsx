'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Video, AdminRequest } from '@/types/firestore';

export default function MyPageDashboard() {
  const { user, userProfile } = useAuth();
  const [recentVideos, setRecentVideos] = useState<Video[]>([]);
  const [recentRequests, setRecentRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // 최근 영상 조회
      const videosRes = await fetch(`/api/videos?userId=${user.uid}&limit=3`);
      if (videosRes.ok) {
        const videosData = await videosRes.json();
        setRecentVideos(videosData.videos || []);
      }

      // 최근 요청 조회
      const requestsRes = await fetch(`/api/admin-requests?userId=${user.uid}&limit=3`);
      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        setRecentRequests(requestsData.requests || []);
      }
    } catch (error) {
      console.error('대시보드 데이터 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: '대기 중', className: 'bg-yellow-100 text-yellow-700' },
      reviewing: { label: '검토 중', className: 'bg-blue-100 text-blue-700' },
      approved: { label: '승인', className: 'bg-green-100 text-green-700' },
      rejected: { label: '거절', className: 'bg-red-100 text-red-700' },
      completed: { label: '완료', className: 'bg-gray-100 text-gray-700' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          안녕하세요, {userProfile?.displayName || '사용자'}님
        </h1>
        <p className="text-gray-500">
          마이페이지에서 주문 내역, 생성한 영상, 전송 요청을 확인하세요.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{userProfile?.totalOrders || 0}</p>
              <p className="text-sm text-gray-500">총 주문</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{userProfile?.totalVideos || 0}</p>
              <p className="text-sm text-gray-500">생성 영상</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {userProfile?.totalSpent ? `${userProfile.totalSpent.toLocaleString()}원` : '0원'}
              </p>
              <p className="text-sm text-gray-500">총 결제</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Videos */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">최근 영상</h2>
          <Link href="/mypage/videos" className="text-sm text-gray-500 hover:text-gray-700">
            전체 보기 →
          </Link>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">로딩 중...</div>
          ) : recentVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentVideos.map((video) => (
                <div key={video.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-gray-900 truncate">{video.title}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(video.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>아직 생성된 영상이 없습니다.</p>
              <Link href="/ai-hologram" className="text-blue-600 hover:underline mt-2 inline-block">
                영상 만들러 가기 →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">전송 요청 현황</h2>
          <Link href="/mypage/requests" className="text-sm text-gray-500 hover:text-gray-700">
            전체 보기 →
          </Link>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">로딩 중...</div>
          ) : recentRequests.length > 0 ? (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{request.videoTitle}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(request.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>아직 전송 요청이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
