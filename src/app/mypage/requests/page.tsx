'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminRequest } from '@/types/firestore';

export default function RequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(null);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin-requests?userId=${user.uid}&limit=50`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error('요청 목록 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const config: Record<string, { label: string; className: string; icon: string }> = {
      pending: {
        label: '대기 중',
        className: 'bg-yellow-100 text-yellow-700',
        icon: '⏳'
      },
      reviewing: {
        label: '검토 중',
        className: 'bg-blue-100 text-blue-700',
        icon: '🔍'
      },
      approved: {
        label: '승인됨',
        className: 'bg-green-100 text-green-700',
        icon: '✅'
      },
      rejected: {
        label: '거절됨',
        className: 'bg-red-100 text-red-700',
        icon: '❌'
      },
      completed: {
        label: '완료',
        className: 'bg-gray-100 text-gray-700',
        icon: '✓'
      },
    };
    return config[status] || config.pending;
  };

  const getRequestTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      review: '검토 요청',
      production: '제작 요청',
      custom: '커스텀 요청',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">전송 요청 현황</h1>
        <p className="text-gray-500 mt-1">관리자에게 전송한 영상 요청의 처리 현황을 확인하세요.</p>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <p className="text-gray-500">
            총 <span className="font-bold text-gray-900">{requests.length}</span>건의 요청
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="text-center py-12 text-gray-500">로딩 중...</div>
          ) : requests.length > 0 ? (
            requests.map((request) => {
              const statusConfig = getStatusConfig(request.status);
              return (
                <div
                  key={request.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Request Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-bold text-gray-900 truncate">{request.videoTitle}</p>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          {getRequestTypeLabel(request.requestType)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span>요청일: {new Date(request.createdAt).toLocaleDateString('ko-KR')}</span>
                        {request.reviewedAt && (
                          <span>검토일: {new Date(request.reviewedAt).toLocaleDateString('ko-KR')}</span>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${statusConfig.className}`}>
                        <span>{statusConfig.icon}</span>
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>

                  {/* Admin Response (if any) */}
                  {request.adminResponse && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-sm font-medium text-blue-700 mb-1">관리자 답변</p>
                      <p className="text-sm text-blue-600">{request.adminResponse}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <p className="text-gray-500 mb-4">아직 전송 요청이 없습니다.</p>
              <a
                href="/ai-hologram"
                className="inline-block px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                영상 만들러 가기
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">요청 상세</h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status Timeline */}
              <div className="flex items-center justify-center gap-2">
                {['pending', 'reviewing', 'approved', 'completed'].map((status, index) => {
                  const isActive = ['pending', 'reviewing', 'approved', 'completed'].indexOf(selectedRequest.status) >= index;
                  const isCurrent = selectedRequest.status === status;
                  return (
                    <div key={status} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isActive
                            ? isCurrent
                              ? 'bg-blue-500 text-white'
                              : 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {index + 1}
                      </div>
                      {index < 3 && (
                        <div className={`w-8 h-1 ${isActive ? 'bg-green-500' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Video Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">영상 제목</p>
                <p className="font-medium text-gray-900">{selectedRequest.videoTitle}</p>
              </div>

              {/* Request Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">요청 유형</p>
                  <p className="font-medium text-gray-900">
                    {getRequestTypeLabel(selectedRequest.requestType)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">현재 상태</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusConfig(selectedRequest.status).className}`}>
                    {getStatusConfig(selectedRequest.status).label}
                  </span>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">요청일</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedRequest.createdAt).toLocaleString('ko-KR')}
                  </p>
                </div>
                {selectedRequest.completedAt && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">완료일</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedRequest.completedAt).toLocaleString('ko-KR')}
                    </p>
                  </div>
                )}
              </div>

              {/* Admin Response */}
              {selectedRequest.adminResponse && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-sm font-medium text-blue-700 mb-2">관리자 답변</p>
                  <p className="text-blue-600">{selectedRequest.adminResponse}</p>
                </div>
              )}

              {/* Video Link */}
              {selectedRequest.videoUrl && (
                <div className="flex gap-3">
                  <a
                    href={selectedRequest.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors text-center"
                  >
                    영상 보기
                  </a>
                  <a
                    href={selectedRequest.videoUrl}
                    download
                    className="py-3 px-4 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    다운로드
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
