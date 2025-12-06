'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getOrder, createRefundRequest, generateRefundId } from '@/lib/firestore';
import {
  Order,
  RefundReasonType,
  REFUND_REASON_LABELS,
  calculateRefundAmount,
  formatPrice,
  formatDate,
} from '@/types/order';

function RefundRequestContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 폼 상태
  const [reasonType, setReasonType] = useState<RefundReasonType>('simple_change');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (user && orderId) {
      loadOrder();
    }
  }, [user, orderId]);

  const loadOrder = async () => {
    if (!orderId) {
      setError('주문 ID가 필요합니다.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const orderData = await getOrder(orderId);

      if (!orderData) {
        setError('주문을 찾을 수 없습니다.');
        return;
      }

      // 본인 주문인지 확인
      if (orderData.userId !== user?.uid) {
        setError('접근 권한이 없습니다.');
        return;
      }

      // 환불 가능 상태인지 확인
      const refundableStatuses = ['paid', 'preparing', 'shipping'];
      if (!refundableStatuses.includes(orderData.status)) {
        setError('환불 신청이 불가능한 주문 상태입니다.');
        return;
      }

      setOrder(orderData);
    } catch (err) {
      console.error('주문 로딩 실패:', err);
      setError('주문 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order || !user) return;

    if (!reason.trim()) {
      alert('환불 사유를 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);

      // 사용 일수 계산
      const startDate = new Date(order.rental.startDate);
      const today = new Date();
      const daysUsed = Math.max(0, Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

      // 환불 금액 계산
      const { refundAmount } = calculateRefundAmount(
        order.payment.totalAmount,
        reasonType,
        daysUsed
      );

      // 환불 요청 생성
      await createRefundRequest({
        refundId: generateRefundId(),
        orderId: order.orderId,
        userId: user.uid,
        status: 'pending',
        reason: reason.trim(),
        reasonType,
        amount: order.payment.totalAmount,
        refundAmount,
      });

      alert('환불 신청이 완료되었습니다. 관리자 검토 후 처리됩니다.');
      router.push('/mypage/orders');
    } catch (err) {
      console.error('환불 신청 실패:', err);
      alert('환불 신청에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  // 예상 환불 금액 계산
  const getEstimatedRefund = () => {
    if (!order) return { refundAmount: 0, rate: 0, deduction: 0 };

    const startDate = new Date(order.rental.startDate);
    const today = new Date();
    const daysUsed = Math.max(0, Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

    return calculateRefundAmount(order.payment.totalAmount, reasonType, daysUsed);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{error || '오류가 발생했습니다'}</h2>
        <Link
          href="/mypage/orders"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4"
        >
          주문 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const estimated = getEstimatedRefund();

  return (
    <div className="max-w-2xl mx-auto">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">환불 신청</h1>
        <p className="text-gray-600 mt-1">주문번호: {order.orderId}</p>
      </div>

      {/* 주문 정보 요약 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">주문 정보</h2>
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-gray-500">제품</dt>
            <dd className="font-medium text-gray-900">{order.productInfo.productName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">렌탈 기간</dt>
            <dd className="font-medium text-gray-900">
              {formatDate(order.rental.startDate)} ~ {formatDate(order.rental.endDate)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">결제 금액</dt>
            <dd className="font-medium text-gray-900">{formatPrice(order.payment.totalAmount)}원</dd>
          </div>
        </dl>
      </div>

      {/* 환불 신청 폼 */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">환불 사유</h2>

        {/* 환불 사유 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            환불 사유 유형 <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {(Object.entries(REFUND_REASON_LABELS) as [RefundReasonType, string][]).map(
              ([value, label]) => (
                <label
                  key={value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    reasonType === value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="reasonType"
                    value={value}
                    checked={reasonType === value}
                    onChange={(e) => setReasonType(e.target.value as RefundReasonType)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-3 text-gray-900">{label}</span>
                </label>
              )
            )}
          </div>
        </div>

        {/* 상세 사유 */}
        <div className="mb-6">
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
            상세 사유 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="환불 사유를 상세히 입력해주세요..."
          />
        </div>

        {/* 예상 환불 금액 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-3">예상 환불 금액</h3>
          <dl className="space-y-2">
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">원 결제 금액</dt>
              <dd className="text-gray-900">{formatPrice(order.payment.totalAmount)}원</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">환불률</dt>
              <dd className="text-gray-900">{estimated.rate}%</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">공제액</dt>
              <dd className="text-red-600">-{formatPrice(estimated.deduction)}원</dd>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between">
              <dt className="font-medium text-gray-900">환불 예정 금액</dt>
              <dd className="text-xl font-bold text-blue-600">
                {formatPrice(estimated.refundAmount)}원
              </dd>
            </div>
          </dl>
          {estimated.rate === 0 && (
            <p className="mt-2 text-sm text-red-600">
              ⚠️ 현재 환불 사유로는 환불이 불가능합니다.
            </p>
          )}
        </div>

        {/* 환불 정책 안내 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-yellow-800 mb-2">환불 정책 안내</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• 제품 하자/배송 파손: 100% 환불</li>
            <li>• 설치 불가 (당사 사유): 100% 환불</li>
            <li>• 설치 불가 (고객 사유): 90% 환불</li>
            <li>• 단순 변심 (7일 이내): 85% 환불</li>
            <li>• 단순 변심 (7일 초과): 환불 불가</li>
          </ul>
        </div>

        {/* 버튼 */}
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={submitting || estimated.rate === 0}
            className="flex-1 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? '처리 중...' : '환불 신청하기'}
          </button>
          <Link
            href={`/mypage/orders/${order.orderId}`}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function RefundRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RefundRequestContent />
    </Suspense>
  );
}
