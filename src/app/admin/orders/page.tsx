'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Badge, { BadgeVariant } from '@/components/ui/Badge';

interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  paymentId: string;
  txId?: string;
  amount: number;
  currency: string;
  payMethod: string;
  orderName: string;
  productType: 'standard' | 'premium';
  status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
  createdAt: string;
  paidAt?: string;
}

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'refunded'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        adminId: user.uid,
        isAdminView: 'true',
      });

      if (filter !== 'all') {
        params.set('status', filter);
      }

      const response = await fetch(`/api/orders?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user, filter]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  const getStatusConfig = useCallback((status: string): { label: string; variant: BadgeVariant } => {
    const config: Record<string, { label: string; variant: BadgeVariant }> = {
      pending: { label: '대기', variant: 'pending' },
      paid: { label: '결제완료', variant: 'success' },
      failed: { label: '실패', variant: 'error' },
      refunded: { label: '환불', variant: 'warning' },
      cancelled: { label: '취소', variant: 'neutral' },
    };
    return config[status] || config.pending;
  }, []);

  const getPayMethodLabel = useCallback((method: string) => {
    const labels: Record<string, string> = {
      CARD: '카드',
      VIRTUAL_ACCOUNT: '가상계좌',
      TRANSFER: '계좌이체',
      MOBILE: '휴대폰',
    };
    return labels[method] || method;
  }, []);

  const totalRevenue = useMemo(
    () => orders.filter((o) => o.status === 'paid').reduce((sum, o) => sum + o.amount, 0),
    [orders]
  );

  const filterCounts = useMemo(
    () => ({
      all: orders.length,
      paid: orders.filter((o) => o.status === 'paid').length,
      pending: orders.filter((o) => o.status === 'pending').length,
      refunded: orders.filter((o) => o.status === 'refunded').length,
    }),
    [orders]
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">주문 관리</h1>
          <p className="text-gray-500 mt-1">전체 주문 내역을 확인하고 관리합니다.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2">
            <p className="text-xs text-green-600">총 매출</p>
            <p className="text-lg font-bold text-green-700">{totalRevenue.toLocaleString()}원</p>
          </div>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            새로고침
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-xl">
        {(['all', 'paid', 'pending', 'refunded'] as const).map((status) => (
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

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">주문 ID</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">상품명</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">주문자</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">결제 금액</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">결제 방법</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">상태</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">주문일</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    로딩 중...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="text-xs font-mono text-gray-500">{order.id.slice(0, 8)}...</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{order.orderName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {order.productType === 'premium' ? '프리미엄' : '스탠다드'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{order.userName || '-'}</p>
                        <p className="text-xs text-gray-500">{order.userEmail}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{order.amount.toLocaleString()}원</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {getPayMethodLabel(order.payMethod)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusConfig.variant}>
                          {statusConfig.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
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
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    {filter === 'all' ? '아직 주문이 없습니다.' : '해당 상태의 주문이 없습니다.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">주문 상세</h3>
                <p className="text-sm text-gray-500 mt-1">주문 ID: {selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">상품명</p>
                  <p className="font-medium text-gray-900">{selectedOrder.orderName}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">상품 유형</p>
                  <p className="font-medium text-gray-900">
                    {selectedOrder.productType === 'premium' ? '프리미엄' : '스탠다드'}
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <p className="text-sm text-green-600 mb-1">결제 금액</p>
                  <p className="text-2xl font-bold text-green-700">
                    {selectedOrder.amount.toLocaleString()}원
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">결제 상태</p>
                  <Badge variant={getStatusConfig(selectedOrder.status).variant}>
                    {getStatusConfig(selectedOrder.status).label}
                  </Badge>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-2">주문자 정보</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">이름: </span>
                    <span className="font-medium text-gray-900">{selectedOrder.userName || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">이메일: </span>
                    <span className="font-medium text-gray-900">{selectedOrder.userEmail}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-2">결제 정보</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">결제 방법: </span>
                    <span className="font-medium text-gray-900">
                      {getPayMethodLabel(selectedOrder.payMethod)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">결제 ID: </span>
                    <span className="font-mono text-xs text-gray-700">{selectedOrder.paymentId}</span>
                  </div>
                  {selectedOrder.txId && (
                    <div className="col-span-2">
                      <span className="text-gray-500">거래 ID: </span>
                      <span className="font-mono text-xs text-gray-700">{selectedOrder.txId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">주문일</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedOrder.createdAt).toLocaleString('ko-KR')}
                  </p>
                </div>
                {selectedOrder.paidAt && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">결제일</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedOrder.paidAt).toLocaleString('ko-KR')}
                    </p>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
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
