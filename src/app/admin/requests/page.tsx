'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminRequest, AdminRequestStatus, AdminRequestPriority } from '@/types/firestore';

export default function AdminRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | AdminRequestStatus>('all');
  const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(null);
  const [responseText, setResponseText] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user, filter]);

  const fetchRequests = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        isAdminView: 'true',
        adminId: user.uid,
        limit: '100',
      });
      if (filter !== 'all') {
        params.append('status', filter);
      }

      const response = await fetch(`/api/admin-requests?${params}`);
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

  const updateRequestStatus = async (requestId: string, status: AdminRequestStatus) => {
    if (!user) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/admin-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: user.uid,
          status,
          adminResponse: responseText || undefined,
          adminNote: adminNote || undefined,
        }),
      });

      if (response.ok) {
        await fetchRequests();
        setSelectedRequest(null);
        setResponseText('');
        setAdminNote('');
      }
    } catch (error) {
      console.error('상태 변경 오류:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      pending: { label: '대기', className: 'bg-yellow-100 text-yellow-700' },
      reviewing: { label: '검토 중', className: 'bg-blue-100 text-blue-700' },
      approved: { label: '승인', className: 'bg-green-100 text-green-700' },
      rejected: { label: '거절', className: 'bg-red-100 text-red-700' },
      completed: { label: '완료', className: 'bg-gray-100 text-gray-700' },
    };
    return config[status] || config.pending;
  };

  const getPriorityConfig = (priority: string) => {
    const config: Record<string, { label: string; className: string }> = {
      low: { label: '낮음', className: 'text-gray-500' },
      normal: { label: '보통', className: 'text-blue-500' },
      high: { label: '높음', className: 'text-orange-500' },
      urgent: { label: '긴급', className: 'text-red-500 font-bold' },
    };
    return config[priority] || config.normal;
  };

  const getRequestTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      review: '검토 요청',
      production: '제작 요청',
      custom: '커스텀 요청',
    };
    return labels[type] || type;
  };

  const filterCounts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    reviewing: requests.filter((r) => r.status === 'reviewing').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
    completed: requests.filter((r) => r.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">영상 요청 관리</h1>
          <p className="text-gray-500 mt-1">사용자들이 전송한 영상 요청을 검토하고 처리합니다.</p>
        </div>
        <button
          onClick={fetchRequests}
          className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          새로고침
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-xl">
        {(['all', 'pending', 'reviewing', 'approved', 'rejected', 'completed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {status === 'all' ? '전체' : getStatusConfig(status).label}
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-200">
              {filterCounts[status]}
            </span>
          </button>
        ))}
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">영상 제목</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">요청자</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">유형</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">우선순위</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">상태</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">요청일</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    로딩 중...
                  </td>
                </tr>
              ) : requests.length > 0 ? (
                requests.map((request) => {
                  const statusConfig = getStatusConfig(request.status);
                  const priorityConfig = getPriorityConfig(request.priority);
                  return (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 truncate max-w-[200px]">
                          {request.videoTitle}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {request.videoMode === 'composition' ? '구성 모드' : '단일 모드'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{request.userName || '-'}</p>
                        <p className="text-xs text-gray-500">{request.userEmail}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {getRequestTypeLabel(request.requestType)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm ${priorityConfig.className}`}>
                          {priorityConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setResponseText(request.adminResponse || '');
                            setAdminNote(request.adminNote || '');
                          }}
                          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          상세
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {filter === 'all' ? '아직 요청이 없습니다.' : '해당 상태의 요청이 없습니다.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">요청 상세</h3>
                <p className="text-sm text-gray-500 mt-1">ID: {selectedRequest.id}</p>
              </div>
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
              {/* Video Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">영상 제목</p>
                  <p className="font-medium text-gray-900">{selectedRequest.videoTitle}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">영상 모드</p>
                  <p className="font-medium text-gray-900">
                    {selectedRequest.videoMode === 'composition' ? '구성 모드' : '단일 모드'}
                  </p>
                </div>
              </div>

              {/* User Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-2">요청자 정보</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">이름: </span>
                    <span className="font-medium text-gray-900">{selectedRequest.userName || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">이메일: </span>
                    <span className="font-medium text-gray-900">{selectedRequest.userEmail}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">연락처: </span>
                    <span className="font-medium text-gray-900">{selectedRequest.userPhone || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">요청일: </span>
                    <span className="font-medium text-gray-900">
                      {new Date(selectedRequest.createdAt).toLocaleString('ko-KR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Message */}
              {selectedRequest.message && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-sm font-medium text-blue-700 mb-2">요청 메시지</p>
                  <p className="text-blue-600">{selectedRequest.message}</p>
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

              {/* Admin Response */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사용자에게 전달할 답변
                  </label>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="사용자에게 전달할 내용을 입력하세요..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    관리자 메모 (내부용)
                  </label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="내부적으로 참고할 메모를 입력하세요..."
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                {selectedRequest.status === 'pending' && (
                  <button
                    onClick={() => updateRequestStatus(selectedRequest.id, 'reviewing')}
                    disabled={updating}
                    className="px-4 py-2 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    검토 시작
                  </button>
                )}
                {(selectedRequest.status === 'pending' || selectedRequest.status === 'reviewing') && (
                  <>
                    <button
                      onClick={() => updateRequestStatus(selectedRequest.id, 'approved')}
                      disabled={updating}
                      className="px-4 py-2 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      승인
                    </button>
                    <button
                      onClick={() => updateRequestStatus(selectedRequest.id, 'rejected')}
                      disabled={updating}
                      className="px-4 py-2 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      거절
                    </button>
                  </>
                )}
                {selectedRequest.status === 'approved' && (
                  <button
                    onClick={() => updateRequestStatus(selectedRequest.id, 'completed')}
                    disabled={updating}
                    className="px-4 py-2 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    완료 처리
                  </button>
                )}
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
