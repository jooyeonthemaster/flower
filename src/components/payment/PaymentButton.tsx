'use client';

import { useState } from 'react';
import { initTossPayments, generateOrderId, formatPrice, PaymentRequest } from '@/lib/tossPayments';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentButtonProps {
  amount: number;
  orderName: string;
  className?: string;
  disabled?: boolean;
}

export default function PaymentButton({ 
  amount, 
  orderName, 
  className = "",
  disabled = false 
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handlePayment = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      setIsLoading(true);
      
      // 토스페이먼츠 SDK 초기화
      const tossPayments = await initTossPayments();
      
      // 결제 요청 데이터 준비
      const paymentData: PaymentRequest = {
        amount,
        orderId: generateOrderId(),
        orderName,
        customerName: user.displayName || '구매자',
        customerEmail: user.email || '',
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`
      };

      // 결제창 방식으로 결제 요청 (API 개별 연동 키 사용)
      await tossPayments.requestPayment('카드', {
        amount: paymentData.amount,
        orderId: paymentData.orderId,
        orderName: paymentData.orderName,
        customerName: paymentData.customerName,
        customerEmail: paymentData.customerEmail,
        successUrl: paymentData.successUrl,
        failUrl: paymentData.failUrl,
      });

    } catch (error) {
      console.error('결제 오류:', error);
      alert('결제 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || isLoading}
      className={`
        relative px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg
        transition-all duration-200 transform hover:scale-105 hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        ${className}
      `}
    >
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>결제 준비 중...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center space-x-2">
          <span>{formatPrice(amount)}원 결제하기</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
      )}
    </button>
  );
} 