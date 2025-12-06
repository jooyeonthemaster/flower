'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getAllRefunds, processRefund } from '@/lib/firestore';
import {
  RefundRequest,
  RefundStatus,
  REFUND_STATUS_LABELS,
  REFUND_STATUS_COLORS,
  REFUND_REASON_LABELS,
  formatPrice,
  formatDateTime,
} from '@/types/order';

const statusFilters: { value: RefundStatus | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '대기 중' },
  { value: 'reviewing', label: '검토 중' },
  { value: 'approved', label: '승인됨' },
  { value: 'rejected', label: '거절됨' },
  { value: 'processing', label: '처리 중' },
  { value: 'completed', label: '완료' },
];

export default function AdminRefundsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') as RefundStatus | 'all' | null;

  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<RefundStatus | 'all'>(initialStatus || 'all');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    loadRefunds();
  }, [statusFilter]);

  const loadRefunds = async () => {
    try {
      setLoading(true);
      const filter = statusFilter === 'all' ? undefined : statusFilter;
      const { refunds: result } = await getAllRefunds(100, undefined, filter);
      setRefunds(result);
    } catch (error) {
      console.error('환불 요청 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (refundId: string, status: 'approved' | 'rejected') => {
    if (!user) return;

    try {
      setProcessingId(refundId);
      await processRefund(refundId, status, user.uid, adminNote || undefined);

      // 로컬 상태 업데이트
      setRefunds((prev) =>
        prev.map((refund) =>
          refund.refundId === refundId
            ? { ...refund, status, adminNote: adminNote || undefined }
            : refund
        )
      );

      setSelectedRefund(null);
      setAdminNote('');
      alert(`환불 요청이 ${status === 'approved' ? '승인' : '거절'}되었습니다.`);
    } catch (error) {
      console.error('환불 처리 실패:', error);
      alert('환불 처리에 실패했습니다.');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">환불 관리</h1>
        <p className="text-gray-500 mt-1">총 {refunds.length}건의 환불 요청</p>
      </div>

      {/* 필터 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === filter.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* 환불 요청 목록 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {refunds.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">해당 상태의 환불 요청이 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    환불 ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    주문 ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    사유
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    금액
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    요청일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {refunds.map((refund) => (
                  <tr key={refund.refundId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-mono text-gray-900">
                        {refund.refundId.slice(0, 15)}...
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${refund.orderId}`}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        {refund.orderId}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {REFUND_REASON_LABELS[refund.reasonType]}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">
                          {refund.reason}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-500">원 결제: {formatPrice(refund.amount)}원</p>
                        <p className="text-sm font-medium text-blue-600">
                          환불: {formatPrice(refund.refundAmount)}원
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${REFUND_STATUS_COLORS[refund.status]}`}
                      >
                        {REFUND_STATUS_LABELS[refund.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">
                        {formatDateTime(refund.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {(refund.status === 'pending' || refund.status === 'reviewing') && (
                        <button
                          onClick={() => setSelectedRefund(refund)}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          처리
                        </button>
                      )}
                      {refund.adminNote && (
                        <p className="text-xs text-gray-500 mt-1">
                          메모: {refund.adminNote.slice(0, 20)}...
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 환불 처리 모달 */}
      {selectedRefund && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedRefund(null)}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">환불 요청 처리</h3>

            <dl className="space-y-3 mb-6">
              <div className="flex justify-between">
                <dt className="text-gray-500">환불 ID</dt>
                <dd className="font-mono text-gray-900">{selectedRefund.refundId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">주문 ID</dt>
                <dd className="text-gray-900">{selectedRefund.orderId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">환불 사유</dt>
                <dd className="text-gray-900">
                  {REFUND_REASON_LABELS[selectedRefund.reasonType]}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 mb-1">상세 사유</dt>
                <dd className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">
                  {selectedRefund.reason}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">원 결제 금액</dt>
                <dd className="text-gray-900">{formatPrice(selectedRefund.amount)}원</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">환불 예정 금액</dt>
                <dd className="text-xl font-bold text-blue-600">
                  {formatPrice(selectedRefund.refundAmount)}원
                </dd>
              </div>
            </dl>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                관리자 메모 (선택)
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="환불 처리 관련 메모를 입력하세요..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleProcess(selectedRefund.refundId, 'approved')}
                disabled={processingId === selectedRefund.refundId}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {processingId === selectedRefund.refundId ? '처리 중...' : '승인'}
              </button>
              <button
                onClick={() => handleProcess(selectedRefund.refundId, 'rejected')}
                disabled={processingId === selectedRefund.refundId}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {processingId === selectedRefund.refundId ? '처리 중...' : '거절'}
              </button>
              <button
                onClick={() => {
                  setSelectedRefund(null);
                  setAdminNote('');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 환불 정책 안내 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="font-semibold text-yellow-800 mb-2">환불 정책 안내</h3>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• 제품 하자/배송 파손: 100% 환불</li>
          <li>• 설치 불가 (당사 사유): 100% 환불</li>
          <li>• 설치 불가 (고객 사유): 90% 환불</li>
          <li>• 단순 변심 (7일 이내): 85% 환불</li>
          <li>• 단순 변심 (7일 초과): 환불 불가</li>
        </ul>
      </div>
    </div>
  );
}
