'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Inquiry, InquiryStatus } from '@/types/inquiry';
import Badge, { BadgeVariant } from '@/components/ui/Badge';

export default function AdminInquiriesPage() {
  const { user, getUserIdToken } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | InquiryStatus>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [responseText, setResponseText] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchInquiries();
    }
  }, [user, filter]);

  const fetchInquiries = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        adminId: user.uid,
        limit: '50',
      });
      if (filter !== 'all') {
        params.append('status', filter);
      }

      const response = await fetch(`/api/inquiries?${params}`);
      if (response.ok) {
        const data = await response.json();
        setInquiries(data.inquiries || []);
      }
    } catch (error) {
      console.error('문의 목록 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (inquiryId: string, status: InquiryStatus, adminResponse?: string) => {
    if (!user) return;

    setUpdating(true);
    const loadingToast = toast.loading('문의를 처리하고 있습니다...');

    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: user.uid,
          status,
          adminResponse,
        }),
      });

      if (!response.ok) {
        throw new Error('문의 업데이트 실패');
      }

      await fetchInquiries();
      setSelectedInquiry(null);
      setResponseText('');
      toast.success('문의가 처리되었습니다.', { id: loadingToast });
    } catch (error) {
      console.error('문의 업데이트 오류:', error);
      toast.error('문의 처리 중 오류가 발생했습니다.', { id: loadingToast });
    } finally {
      setUpdating(false);
    }
  };

    const getStatusConfig = (status: string): { label: string; variant: BadgeVariant } => {
      const config: Record<string, { label: string; variant: BadgeVariant }> = {
        pending: { label: '미답변', variant: 'pending' },
        answered: { label: '답변완료', variant: 'success' },
        archived: { label: '보관', variant: 'neutral' },
      };
      return config[status] || config.pending;
    };

    const getInquiryTypeLabel = (type: string) => {
      return type; // 이미 한글이므로 그대로 반환
    };

    const filterCounts = {
      all: inquiries.length,
      pending: inquiries.filter((i) => i.status === 'pending').length,
      answered: inquiries.filter((i) => i.status === 'answered').length,
      archived: inquiries.filter((i) => i.status === 'archived').length,
    };

    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">문의 관리</h1>
            <p className="text-gray-500 mt-1">고객 문의를 확인하고 답변을 작성합니다.</p>
          </div>
          <button
            onClick={fetchInquiries}
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
          {(['all', 'pending', 'answered', 'archived'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
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

        {/* Inquiries List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">문의가 없습니다</h3>
            <p className="text-gray-500">
              {filter === 'all' ? '아직 접수된 문의가 없습니다.' : `${getStatusConfig(filter).label} 상태의 문의가 없습니다.`}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      문의자
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      문의 유형
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      문의 내용
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      접수일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                        <div className="text-sm text-gray-500">{inquiry.email}</div>
                        {inquiry.phone && (
                          <div className="text-sm text-gray-500">{inquiry.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="info">
                          {getInquiryTypeLabel(inquiry.inquiryType)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 line-clamp-2 max-w-md">
                          {inquiry.message}
                        </div>
                        {inquiry.company && (
                          <div className="text-xs text-gray-500 mt-1">회사: {inquiry.company}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusConfig(inquiry.status).variant}>
                          {getStatusConfig(inquiry.status).label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => {
                            setSelectedInquiry(inquiry);
                            setResponseText(inquiry.adminResponse || '');
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          상세
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedInquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">문의 상세</h2>
                  <button
                    onClick={() => setSelectedInquiry(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Inquiry Info */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">문의자</div>
                      <div className="font-medium text-gray-900">{selectedInquiry.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">이메일</div>
                      <div className="font-medium text-gray-900">{selectedInquiry.email}</div>
                    </div>
                    {selectedInquiry.phone && (
                      <div>
                        <div className="text-sm text-gray-500">연락처</div>
                        <div className="font-medium text-gray-900">{selectedInquiry.phone}</div>
                      </div>
                    )}
                    {selectedInquiry.company && (
                      <div>
                        <div className="text-sm text-gray-500">회사명</div>
                        <div className="font-medium text-gray-900">{selectedInquiry.company}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-gray-500">문의 유형</div>
                      <div className="font-medium text-gray-900">{selectedInquiry.inquiryType}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">접수일</div>
                      <div className="font-medium text-gray-900">
                        {new Date(selectedInquiry.createdAt).toLocaleString('ko-KR')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <div className="text-sm text-gray-500 mb-2">문의 내용</div>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-900 whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </div>
                </div>

                {/* Admin Response */}
                <div>
                  <div className="text-sm text-gray-500 mb-2">답변 작성</div>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="답변을 작성해주세요..."
                  />
                </div>

                {/* Existing Response */}
                {selectedInquiry.adminResponse && (
                  <div>
                    <div className="text-sm text-gray-500 mb-2">기존 답변</div>
                    <div className="bg-blue-50 rounded-lg p-4 text-gray-900 whitespace-pre-wrap">
                      {selectedInquiry.adminResponse}
                    </div>
                    {selectedInquiry.answeredAt && (
                      <div className="text-xs text-gray-500 mt-2">
                        답변일: {new Date(selectedInquiry.answeredAt).toLocaleString('ko-KR')}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => updateInquiryStatus(selectedInquiry.id, 'answered', responseText)}
                    disabled={updating || !responseText.trim()}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {updating ? '처리 중...' : '답변 완료'}
                  </button>
                  <button
                    onClick={() => updateInquiryStatus(selectedInquiry.id, 'archived')}
                    disabled={updating}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    보관
                  </button>
                  <button
                    onClick={() => {
                      setSelectedInquiry(null);
                      setResponseText('');
                    }}
                    disabled={updating}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
