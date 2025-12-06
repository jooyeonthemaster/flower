'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createOrder, generateOrderId, getOrCreateUser } from '@/lib/firestore';
import { PendingOrderData } from '@/components/payment/PaymentButton';
import { Timestamp } from 'firebase/firestore';
import { formatPrice } from '@/types/order';

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [paymentInfo, setPaymentInfo] = useState<{
    paymentKey?: string;
    orderId?: string;
    amount?: string;
  }>({});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [savedOrderId, setSavedOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 주문 저장 함수
  const saveOrder = useCallback(async (
    paymentId: string,
    pendingOrder: PendingOrderData
  ) => {
    if (!user) {
      setError('로그인이 필요합니다.');
      setSaveStatus('error');
      return;
    }

    try {
      setSaveStatus('saving');

      // 사용자 프로필 생성/조회
      await getOrCreateUser(
        user.uid,
        user.email || '',
        user.displayName || '사용자',
        user.photoURL
      );

      // 주문 ID 생성
      const orderId = generateOrderId();

      // 렌탈 시작일/종료일 계산
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + pendingOrder.productInfo.periodDays);

      // 설치 희망일을 렌탈 시작일로 사용
      const installDate = pendingOrder.deliveryInfo?.installationDate
        ? new Date(pendingOrder.deliveryInfo.installationDate)
        : startDate;
      const rentalEndDate = new Date(installDate);
      rentalEndDate.setDate(rentalEndDate.getDate() + pendingOrder.productInfo.periodDays);

      // 전체 주소 조합
      const fullAddress = pendingOrder.deliveryInfo
        ? `${pendingOrder.deliveryInfo.postalCode ? `(${pendingOrder.deliveryInfo.postalCode}) ` : ''}${pendingOrder.deliveryInfo.address}${pendingOrder.deliveryInfo.addressDetail ? ` ${pendingOrder.deliveryInfo.addressDetail}` : ''}`
        : '';

      // Firestore에 주문 저장
      await createOrder({
        orderId,
        userId: user.uid,
        paymentId,
        status: 'paid',
        productInfo: pendingOrder.productInfo,
        designInfo: pendingOrder.designInfo,
        generatedMedia: {
          imageUrl: pendingOrder.generatedMedia.imageUrl,
          videoUrl: pendingOrder.generatedMedia.videoUrl,
        },
        payment: {
          amount: pendingOrder.payment.amount,
          deposit: pendingOrder.payment.deposit,
          totalAmount: pendingOrder.payment.amount + pendingOrder.payment.deposit,
          method: 'CARD',
          paidAt: Timestamp.now(),
        },
        customer: {
          name: pendingOrder.deliveryInfo?.recipientName || user.displayName || '구매자',
          email: user.email || '',
          phone: pendingOrder.deliveryInfo?.recipientPhone || user.phoneNumber || '',
          address: fullAddress,
        },
        rental: {
          startDate: Timestamp.fromDate(installDate),
          endDate: Timestamp.fromDate(rentalEndDate),
          installationAddress: fullAddress,
        },
      });

      // localStorage 정리
      localStorage.removeItem('pendingOrder');

      setSavedOrderId(orderId);
      setSaveStatus('success');
      console.log('주문 저장 완료:', orderId);

    } catch (err) {
      console.error('주문 저장 실패:', err);
      setError('주문 저장 중 오류가 발생했습니다.');
      setSaveStatus('error');
    }
  }, [user]);

  useEffect(() => {
    const paymentId = searchParams.get('paymentId');
    const txId = searchParams.get('txId');
    const amount = searchParams.get('amount');

    setPaymentInfo({
      paymentKey: paymentId || undefined,
      orderId: txId || undefined,
      amount: amount || undefined,
    });

    // 결제 검증 및 주문 저장
    if (paymentId && amount && user && saveStatus === 'idle') {
      confirmAndSavePayment(paymentId, txId || '', amount);
    }
  }, [searchParams, user, saveStatus]);

  const confirmAndSavePayment = async (paymentId: string, txId: string, amount: string) => {
    try {
      // 1. 포트원 결제 검증 API 호출
      const response = await fetch('/api/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          txId,
          amount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('포트원 결제 검증 실패:', errorData);
        setError('결제 검증에 실패했습니다.');
        setSaveStatus('error');
        return;
      }

      console.log('포트원 결제 검증 완료');

      // 2. localStorage에서 주문 데이터 가져오기 (sessionStorage는 새 탭에서 공유 안됨)
      const pendingOrderJson = localStorage.getItem('pendingOrder');
      if (!pendingOrderJson) {
        console.error('pendingOrder 데이터가 없습니다!');
        setError('주문 데이터를 찾을 수 없습니다. 결제는 완료되었으나 주문 정보가 누락되었습니다. 고객센터로 문의해주세요.');
        setSaveStatus('error');
        return;
      }

      const pendingOrder: PendingOrderData = JSON.parse(pendingOrderJson);

      // 3. Firestore에 주문 저장
      await saveOrder(paymentId, pendingOrder);

    } catch (error) {
      console.error('결제 검증/저장 오류:', error);
      setError('결제 처리 중 오류가 발생했습니다.');
      setSaveStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* 상태별 아이콘 */}
        <div className="mb-6">
          {saveStatus === 'saving' ? (
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : saveStatus === 'error' ? (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          ) : (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>

        {/* 제목 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {saveStatus === 'saving'
            ? '주문 처리 중...'
            : saveStatus === 'error'
            ? '오류가 발생했습니다'
            : '결제가 완료되었습니다!'}
        </h1>

        <p className="text-gray-600 mb-6">
          {saveStatus === 'saving'
            ? '잠시만 기다려주세요.'
            : saveStatus === 'error'
            ? error || '다시 시도해주세요.'
            : '주문해주셔서 감사합니다.'}
        </p>

        {/* 결제 정보 */}
        {(saveStatus === 'success' || saveStatus === 'idle') && paymentInfo.orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">결제 정보</h3>

            <div className="space-y-2 text-sm">
              {savedOrderId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">주문번호:</span>
                  <span className="font-medium text-blue-600">{savedOrderId}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">거래번호:</span>
                <span className="font-medium">{paymentInfo.orderId}</span>
              </div>

              {paymentInfo.amount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">결제금액:</span>
                  <span className="font-medium text-blue-600">
                    {formatPrice(Number(paymentInfo.amount))}원
                  </span>
                </div>
              )}

              {paymentInfo.paymentKey && (
                <div className="flex justify-between">
                  <span className="text-gray-600">결제 ID:</span>
                  <span className="font-medium text-xs">
                    {paymentInfo.paymentKey.substring(0, 20)}...
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 안내 메시지 */}
        {saveStatus === 'success' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-semibold text-blue-800 mb-2">다음 단계 안내</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 담당자가 24시간 내 연락드립니다.</li>
              <li>• 설치 일정을 협의 후 진행됩니다.</li>
              <li>• 마이페이지에서 주문 상태를 확인하세요.</li>
            </ul>
          </div>
        )}

        {/* 버튼들 */}
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            홈으로 돌아가기
          </Link>

          <Link
            href="/mypage/orders"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            주문 내역 보기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">결제 정보를 확인하고 있습니다...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
