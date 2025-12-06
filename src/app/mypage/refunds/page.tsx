'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getUserRefunds } from '@/lib/firestore';
import {
  RefundRequest,
  REFUND_STATUS_LABELS,
  REFUND_STATUS_COLORS,
  REFUND_REASON_LABELS,
  formatPrice,
  formatDateTime,
} from '@/types/order';

export default function RefundsPage() {
  const { user } = useAuth();
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRefunds();
    }
  }, [user]);

  const loadRefunds = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const result = await getUserRefunds(user.uid);
      setRefunds(result);
    } catch (error) {
      console.error('환불 내역 로딩 실패:', error);
    } finally {
      setLoading(false);
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
    <div className="max-w-4xl mx-auto">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">환불 내역</h1>
        <p className="text-gray-600 mt-1">총 {refunds.length}건의 환불 신청</p>
      </div>

      {/* 환불 목록 */}
      {refunds.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
            </svg>
          </div>
          <p className="text-gray-500 mb-4">환불 신청 내역이 없습니다.</p>
          <Link
            href="/mypage/orders"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            주문 내역 보기
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {refunds.map((refund) => (
            <div
              key={refund.refundId}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">환불 ID</p>
                  <p className="font-mono text-gray-900">{refund.refundId}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${REFUND_STATUS_COLORS[refund.status]}`}
                >
                  {REFUND_STATUS_LABELS[refund.status]}
                </span>
              </div>

              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-gray-500">주문번호</dt>
                  <dd>
                    <Link
                      href={`/mypage/orders/${refund.orderId}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {refund.orderId}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">환불 사유</dt>
                  <dd className="text-gray-900">{REFUND_REASON_LABELS[refund.reasonType]}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">원 결제 금액</dt>
                  <dd className="text-gray-900">{formatPrice(refund.amount)}원</dd>
                </div>
                <div>
                  <dt className="text-gray-500">환불 금액</dt>
                  <dd className="font-medium text-blue-600">{formatPrice(refund.refundAmount)}원</dd>
                </div>
              </dl>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-2">상세 사유</p>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{refund.reason}</p>
              </div>

              {refund.adminNote && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">관리자 메모</p>
                  <p className="text-sm text-gray-900 bg-blue-50 p-3 rounded-lg">{refund.adminNote}</p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                <span>신청일: {formatDateTime(refund.createdAt)}</span>
                {refund.processedAt && (
                  <span>처리일: {formatDateTime(refund.processedAt)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 환불 정책 안내 */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-2">환불 정책 안내</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• 환불 신청 후 영업일 기준 1~3일 내 검토됩니다.</li>
          <li>• 승인된 환불은 원 결제 수단으로 환불됩니다.</li>
          <li>• 환불 처리 완료까지 3~5 영업일이 소요될 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
