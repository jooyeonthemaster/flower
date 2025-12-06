'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getOrder, updateOrderStatus } from '@/lib/firestore';
import {
  Order,
  OrderStatus,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  PRODUCT_COLOR_LABELS,
  RENTAL_PERIOD_LABELS,
  EVENT_CATEGORY_LABELS,
  EVENT_CATEGORY_ICONS,
  formatPrice,
  formatDate,
  formatDateTime,
} from '@/types/order';

// 상태 변경 옵션
const getNextStatusOptions = (currentStatus: OrderStatus): OrderStatus[] => {
  const transitions: Record<OrderStatus, OrderStatus[]> = {
    pending: ['paid', 'cancelled'],
    paid: ['preparing', 'cancelled', 'refund_requested'],
    preparing: ['shipping', 'cancelled'],
    shipping: ['installed'],
    installed: ['in_use'],
    in_use: ['pickup_scheduled'],
    pickup_scheduled: ['completed'],
    completed: [],
    cancelled: [],
    refund_requested: ['refunded', 'paid'],
    refunded: [],
  };
  return transitions[currentStatus] || [];
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const orderId = params.orderId as string;

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const orderData = await getOrder(orderId);

      if (!orderData) {
        setError('주문을 찾을 수 없습니다.');
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

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;

    try {
      setUpdating(true);
      await updateOrderStatus(order.orderId, newStatus);
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      alert('상태가 변경되었습니다.');
    } catch (err) {
      console.error('상태 변경 실패:', err);
      alert('상태 변경에 실패했습니다.');
    } finally {
      setUpdating(false);
    }
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
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{error || '오류가 발생했습니다'}</h2>
        <Link
          href="/admin/orders"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4"
        >
          주문 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const nextStatuses = getNextStatusOptions(order.status);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">주문 상세</h1>
            <p className="text-sm text-gray-500">{order.orderId}</p>
          </div>
        </div>

        {/* 상태 변경 드롭다운 */}
        {nextStatuses.length > 0 && (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">상태 변경:</span>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  handleStatusChange(e.target.value as OrderStatus);
                }
              }}
              disabled={updating}
            >
              <option value="">선택하세요</option>
              {nextStatuses.map((status) => (
                <option key={status} value={status}>
                  {ORDER_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 현재 상태 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">주문 상태</h2>
          <span className={`px-4 py-2 text-sm font-medium rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">결제 ID:</span>
            <span className="ml-2 font-mono text-gray-900">{order.paymentId}</span>
          </div>
          <div>
            <span className="text-gray-500">사용자 ID:</span>
            <span className="ml-2 font-mono text-gray-900">{order.userId}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 고객 정보 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">고객 정보</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-gray-500">이름</dt>
              <dd className="font-medium text-gray-900">{order.customer.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">이메일</dt>
              <dd className="font-medium text-gray-900">{order.customer.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">연락처</dt>
              <dd className="font-medium text-gray-900">{order.customer.phone || '-'}</dd>
            </div>
            {order.customer.address && (
              <div className="flex justify-between">
                <dt className="text-gray-500">주소</dt>
                <dd className="font-medium text-gray-900 text-right max-w-[200px]">
                  {order.customer.address}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* 제품 정보 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">제품 정보</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-gray-500">제품명</dt>
              <dd className="font-medium text-gray-900">{order.productInfo.productName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">색상</dt>
              <dd className="font-medium text-gray-900">
                {order.productInfo.color === 'blue' ? '💙' : '❤️'} {PRODUCT_COLOR_LABELS[order.productInfo.color]}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">렌탈 기간</dt>
              <dd className="font-medium text-gray-900">{RENTAL_PERIOD_LABELS[order.productInfo.period]}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">행사 유형</dt>
              <dd className="font-medium text-gray-900">
                {EVENT_CATEGORY_ICONS[order.designInfo.category]} {EVENT_CATEGORY_LABELS[order.designInfo.category]}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* 결제 정보 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">결제 정보</h2>
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-gray-500">렌탈 금액</dt>
            <dd className="font-medium text-gray-900">{formatPrice(order.payment.amount)}원</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">보증금</dt>
            <dd className="font-medium text-gray-900">{formatPrice(order.payment.deposit)}원</dd>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between">
            <dt className="text-gray-700 font-medium">총 결제 금액</dt>
            <dd className="text-xl font-bold text-blue-600">{formatPrice(order.payment.totalAmount)}원</dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-gray-500">결제 수단</dt>
            <dd className="text-gray-700">{order.payment.method}</dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-gray-500">결제 일시</dt>
            <dd className="text-gray-700">{formatDateTime(order.payment.paidAt)}</dd>
          </div>
        </dl>
      </div>

      {/* 렌탈 기간 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">렌탈 기간</h2>
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-gray-500">시작일</dt>
            <dd className="font-medium text-gray-900">{formatDate(order.rental.startDate)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">종료일</dt>
            <dd className="font-medium text-gray-900">{formatDate(order.rental.endDate)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">총 일수</dt>
            <dd className="font-medium text-gray-900">{order.productInfo.periodDays}일</dd>
          </div>
          {order.rental.installationAddress && (
            <div className="flex justify-between">
              <dt className="text-gray-500">설치 주소</dt>
              <dd className="font-medium text-gray-900 text-right max-w-[300px]">
                {order.rental.installationAddress}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* 생성된 미디어 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">생성된 미디어</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 이미지 */}
          {order.generatedMedia.imageUrl && (
            <div>
              <p className="text-sm text-gray-500 mb-2">생성 이미지</p>
              <a
                href={order.generatedMedia.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={order.generatedMedia.imageUrl}
                  alt="생성 이미지"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200 hover:opacity-90 transition-opacity"
                />
              </a>
            </div>
          )}

          {/* 비디오 */}
          {order.generatedMedia.videoUrl && (
            <div>
              <p className="text-sm text-gray-500 mb-2">생성 영상</p>
              <video
                src={order.generatedMedia.videoUrl}
                controls
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>

        {!order.generatedMedia.imageUrl && !order.generatedMedia.videoUrl && (
          <p className="text-gray-500 text-center py-4">생성된 미디어가 없습니다.</p>
        )}
      </div>

      {/* AI 디자인 정보 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AI 디자인 정보</h2>
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-gray-500">스타일</dt>
            <dd className="font-medium text-gray-900 capitalize">{order.designInfo.style}</dd>
          </div>
          <div>
            <dt className="text-gray-500 mb-1">프롬프트</dt>
            <dd className="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">
              {order.designInfo.prompt || '(프롬프트 없음)'}
            </dd>
          </div>
        </dl>
      </div>

      {/* 타임스탬프 */}
      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
        <p>주문 생성: {formatDateTime(order.createdAt)}</p>
        <p>마지막 업데이트: {formatDateTime(order.updatedAt)}</p>
      </div>
    </div>
  );
}
