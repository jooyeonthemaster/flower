'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getOrder } from '@/lib/firestore';
import {
  Order,
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

// 주문 상태 타임라인 순서
const STATUS_TIMELINE = [
  { status: 'paid', label: '결제 완료', icon: '💳' },
  { status: 'preparing', label: '준비 중', icon: '📦' },
  { status: 'shipping', label: '배송 중', icon: '🚚' },
  { status: 'installed', label: '설치 완료', icon: '🏠' },
  { status: 'in_use', label: '사용 중', icon: '✨' },
  { status: 'pickup_scheduled', label: '수거 예정', icon: '📅' },
  { status: 'completed', label: '완료', icon: '✅' },
];

// 환불 가능 상태
const REFUNDABLE_STATUSES = ['paid', 'preparing', 'shipping'];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params.orderId as string;

  useEffect(() => {
    if (user && orderId) {
      loadOrder();
    }
  }, [user, orderId]);

  const loadOrder = async () => {
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

      setOrder(orderData);
    } catch (err) {
      console.error('주문 로딩 실패:', err);
      setError('주문 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadVideo = async () => {
    if (!order?.generatedMedia.videoUrl) return;

    try {
      const response = await fetch(order.generatedMedia.videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hologram-${order.orderId}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('다운로드 실패:', err);
      alert('영상 다운로드에 실패했습니다.');
    }
  };

  const getCurrentStatusIndex = () => {
    if (!order) return -1;
    // 환불/취소 상태는 타임라인에서 제외
    if (['cancelled', 'refund_requested', 'refunded'].includes(order.status)) {
      return -1;
    }
    return STATUS_TIMELINE.findIndex((s) => s.status === order.status);
  };

  const canRequestRefund = () => {
    if (!order) return false;
    return REFUNDABLE_STATUSES.includes(order.status);
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
      <div className="max-w-4xl mx-auto text-center py-12">
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

  const currentStatusIndex = getCurrentStatusIndex();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 뒤로가기 + 제목 */}
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
          <p className="text-sm text-gray-500">주문번호: {order.orderId}</p>
        </div>
      </div>

      {/* 주문 상태 배지 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">주문 상태</h2>
          <span className={`px-4 py-2 text-sm font-medium rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>

        {/* 상태 타임라인 */}
        {currentStatusIndex >= 0 && (
          <div className="relative">
            <div className="flex justify-between items-center">
              {STATUS_TIMELINE.map((step, index) => (
                <div key={step.status} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      index <= currentStatusIndex
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      index <= currentStatusIndex ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            {/* 연결선 */}
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 -z-0">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${(currentStatusIndex / (STATUS_TIMELINE.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* 환불/취소 상태 표시 */}
        {['cancelled', 'refund_requested', 'refunded'].includes(order.status) && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">
              {order.status === 'cancelled' && '이 주문은 취소되었습니다.'}
              {order.status === 'refund_requested' && '환불 요청이 접수되어 검토 중입니다.'}
              {order.status === 'refunded' && '환불이 완료되었습니다.'}
            </p>
          </div>
        )}
      </div>

      {/* 생성된 영상 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">생성된 홀로그램 영상</h2>

        {order.generatedMedia.videoUrl ? (
          <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                src={order.generatedMedia.videoUrl}
                controls
                className="w-full h-full object-contain"
                poster={order.generatedMedia.thumbnailUrl || order.generatedMedia.imageUrl}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleDownloadVideo}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                영상 다운로드
              </button>

              {order.generatedMedia.imageUrl && (
                <a
                  href={order.generatedMedia.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  원본 이미지 보기
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>영상이 아직 생성되지 않았습니다.</p>
          </div>
        )}
      </div>

      {/* 주문 정보 */}
      <div className="grid md:grid-cols-2 gap-6">
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
                <dd className="font-medium text-gray-900 text-right max-w-[200px]">
                  {order.rental.installationAddress}
                </dd>
              </div>
            )}
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
          {order.designInfo.referenceImageUrl && (
            <div>
              <dt className="text-gray-500 mb-2">참고 이미지</dt>
              <dd>
                <img
                  src={order.designInfo.referenceImageUrl}
                  alt="참고 이미지"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* 주문자 정보 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">주문자 정보</h2>
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-gray-500">이름</dt>
            <dd className="font-medium text-gray-900">{order.customer.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">이메일</dt>
            <dd className="font-medium text-gray-900">{order.customer.email}</dd>
          </div>
          {order.customer.phone && (
            <div className="flex justify-between">
              <dt className="text-gray-500">연락처</dt>
              <dd className="font-medium text-gray-900">{order.customer.phone}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* 주문 일시 */}
      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
        <p>주문 일시: {formatDateTime(order.createdAt)}</p>
        <p>마지막 업데이트: {formatDateTime(order.updatedAt)}</p>
      </div>

      {/* 환불 신청 버튼 */}
      {canRequestRefund() && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">환불 신청</h2>
          <p className="text-gray-500 text-sm mb-4">
            환불 정책에 따라 환불 신청이 가능합니다. 환불 사유에 따라 환불 금액이 달라질 수 있습니다.
          </p>
          <Link
            href={`/mypage/refunds/new?orderId=${order.orderId}`}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
            </svg>
            환불 신청하기
          </Link>
        </div>
      )}

      {/* 고객센터 안내 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-2">도움이 필요하신가요?</h3>
        <p className="text-blue-700 text-sm mb-3">
          주문 관련 문의사항이 있으시면 고객센터로 연락해 주세요.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <a href="tel:010-1234-5678" className="text-blue-600 hover:underline">
            📞 010-1234-5678
          </a>
          <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
            ✉️ support@example.com
          </a>
        </div>
      </div>
    </div>
  );
}
