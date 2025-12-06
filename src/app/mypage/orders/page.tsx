'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getUserOrders } from '@/lib/firestore';
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
} from '@/types/order';

const statusFilters: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'paid', label: '결제완료' },
  { value: 'preparing', label: '준비중' },
  { value: 'shipping', label: '배송중' },
  { value: 'installed', label: '설치완료' },
  { value: 'in_use', label: '사용중' },
  { value: 'completed', label: '완료' },
  { value: 'refund_requested', label: '환불요청' },
];

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((o) => o.status === statusFilter));
    }
  }, [statusFilter, orders]);

  const loadOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { orders: userOrders } = await getUserOrders(user.uid, 50);
      setOrders(userOrders);
      setFilteredOrders(userOrders);
    } catch (error) {
      console.error('주문 로딩 실패:', error);
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
    <div className="max-w-6xl mx-auto">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">주문 내역</h1>
        <p className="text-gray-600 mt-1">총 {orders.length}건의 주문이 있습니다.</p>
      </div>

      {/* 필터 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
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

      {/* 주문 목록 */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-gray-500 mb-4">
            {statusFilter === 'all' ? '아직 주문 내역이 없습니다.' : '해당 상태의 주문이 없습니다.'}
          </p>
          {statusFilter === 'all' && (
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              주문하러 가기
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Link
              key={order.orderId}
              href={`/mypage/orders/${order.orderId}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* 주문 헤더 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">주문번호:</span>
                    <span className="font-medium text-gray-900">{order.orderId}</span>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>

                {/* 주문 정보 */}
                <div className="flex items-start space-x-4">
                  {/* 영상 썸네일 */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {order.generatedMedia?.videoUrl ? (
                      <video
                        src={order.generatedMedia.videoUrl}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl">
                          {order.productInfo.color === 'blue' ? '💙' : '❤️'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 상세 정보 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {PRODUCT_COLOR_LABELS[order.productInfo.color]} 홀로그램 화환
                    </h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <div className="text-gray-500">
                        렌탈 기간: <span className="text-gray-700">{RENTAL_PERIOD_LABELS[order.productInfo.period]}</span>
                      </div>
                      <div className="text-gray-500">
                        행사 유형: <span className="text-gray-700">
                          {EVENT_CATEGORY_ICONS[order.designInfo.category]} {EVENT_CATEGORY_LABELS[order.designInfo.category]}
                        </span>
                      </div>
                      <div className="text-gray-500">
                        주문일: <span className="text-gray-700">{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="text-gray-500">
                        렌탈 기간: <span className="text-gray-700">
                          {formatDate(order.rental.startDate)} ~ {formatDate(order.rental.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 금액 */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-gray-500">결제 금액</p>
                    <p className="text-xl font-bold text-blue-600">
                      {formatPrice(order.payment.totalAmount)}원
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
