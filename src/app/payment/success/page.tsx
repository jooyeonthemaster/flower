'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState<{
    paymentKey?: string;
    orderId?: string;
    amount?: string;
  }>({});

  useEffect(() => {
    const paymentId = searchParams.get('paymentId');
    const txId = searchParams.get('txId');
    const amount = searchParams.get('amount');

    setPaymentInfo({
      paymentKey: paymentId || undefined,
      orderId: txId || undefined,
      amount: amount || undefined,
    });

    // 포트원 결제 검증 API 호출
    if (paymentId && amount) {
      confirmPayment(paymentId, txId || '', amount);
    }
  }, [searchParams]);

  const confirmPayment = async (paymentId: string, txId: string, amount: string) => {
    try {
      // 포트원 결제 검증 API 호출
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

      if (response.ok) {
        console.log('포트원 결제 검증 완료');
      } else {
        const errorData = await response.json();
        console.error('포트원 결제 검증 실패:', errorData);
      }
    } catch (error) {
      console.error('포트원 결제 검증 API 호출 오류:', error);
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('ko-KR').format(Number(price));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* 성공 아이콘 */}
        <div className="mb-6">
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
        </div>

        {/* 제목 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          결제가 완료되었습니다!
        </h1>
        
        <p className="text-gray-600 mb-6">
          주문해주셔서 감사합니다.
        </p>

        {/* 결제 정보 */}
        {paymentInfo.orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">결제 정보</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">주문번호:</span>
                <span className="font-medium">{paymentInfo.orderId}</span>
              </div>
              
              {paymentInfo.amount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">결제금액:</span>
                  <span className="font-medium text-blue-600">
                    {formatPrice(paymentInfo.amount)}원
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

        {/* 버튼들 */}
        <div className="space-y-3">
          <Link 
            href="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            홈으로 돌아가기
          </Link>
          
          <Link 
            href="/orders"
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
} 