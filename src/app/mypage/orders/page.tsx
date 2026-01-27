'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/orders?userId=${user.uid}`);
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
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: '결제 대기', className: 'bg-yellow-100 text-yellow-700' },
      paid: { label: '결제 완료', className: 'bg-green-100 text-green-700' },
      failed: { label: '결제 실패', className: 'bg-red-100 text-red-700' },
      refunded: { label: '환불 완료', className: 'bg-gray-100 text-gray-700' },
      cancelled: { label: '취소됨', className: 'bg-gray-100 text-gray-500' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getProductTypeBadge = (type: string) => {
    return type === 'premium' ? (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
        Premium
      </span>
    ) : (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
        Standard
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">주문 내역</h1>
        <p className="text-gray-500 mt-1">결제 및 주문 내역을 확인하세요.</p>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <p className="text-gray-500">
            총 <span className="font-bold text-gray-900">{orders.length}</span>건의 주문
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="text-center py-12 text-gray-500">로딩 중...</div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-bold text-gray-900">{order.orderName}</p>
                      {getProductTypeBadge(order.productType)}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span>주문번호: {order.id.slice(0, 8)}...</span>
                      <span>결제일: {new Date(order.createdAt).toLocaleDateString('ko-KR')}</span>
                      <span>결제수단: {order.payMethod}</span>
                    </div>
                  </div>

                  {/* Amount & Status */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {order.amount.toLocaleString()}원
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <p className="text-gray-500 mb-4">아직 주문 내역이 없습니다.</p>
              <a
                href="/ai-hologram"
                className="inline-block px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                홀로그램 영상 만들기
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
