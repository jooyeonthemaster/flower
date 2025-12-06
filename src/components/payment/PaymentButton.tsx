'use client';

import { useState } from 'react';
import { requestPayment, formatPrice } from '@/lib/portOnePayments';
import { useAuth } from '@/contexts/AuthContext';
import { ProductColor, RentalPeriod, EventCategory } from '@/types/order';
import { AIDesignData, DeliveryInfo } from '@/components/product/hooks/useProductWizard';
import { uploadGeneratedMedia } from '@/lib/storage';

// 결제 전 저장할 주문 데이터
export interface PendingOrderData {
  productInfo: {
    color: ProductColor;
    period: RentalPeriod;
    periodDays: number;
    productName: string;
  };
  designInfo: {
    category: EventCategory;
    style: string;
    prompt: string;
    referenceImageUrl?: string;
  };
  generatedMedia: {
    imageUrl: string;
    videoUrl: string;
  };
  deliveryInfo: {
    recipientName: string;
    recipientPhone: string;
    postalCode: string;
    address: string;
    addressDetail: string;
    installationDate: string;
    installationTime: string;
    installationNote: string;
  };
  payment: {
    amount: number;
    deposit: number;
  };
}

interface PaymentButtonProps {
  amount: number;
  orderName: string;
  className?: string;
  disabled?: boolean;
  // 주문 데이터 (Firestore 저장용)
  orderData?: {
    selectedColor: ProductColor;
    selectedPeriod: RentalPeriod;
    aiDesignData: AIDesignData;
    generatedImageUrl: string | null;
    generatedVideoUrl: string | null;
    deliveryInfo: DeliveryInfo;
    deposit: number;
  };
}

// 렌탈 기간별 일수 계산
const getPeriodDays = (period: RentalPeriod): number => {
  switch (period) {
    case 'daily': return 1;
    case 'weekly': return 7;
    case 'monthly': return 30;
    default: return 1;
  }
};

export default function PaymentButton({
  amount,
  orderName,
  className = "",
  disabled = false,
  orderData
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handlePayment = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      setIsLoading(true);

      // 결제 전 주문 데이터를 localStorage에 저장
      if (orderData) {
        // 1. 먼저 미디어를 Firebase Storage에 업로드 (base64는 localStorage에 안 들어감)
        let imageUrl = orderData.generatedImageUrl || '';
        let videoUrl = orderData.generatedVideoUrl || '';

        // base64 데이터인 경우 Firebase Storage에 업로드
        const needsUpload =
          (imageUrl && imageUrl.startsWith('data:')) ||
          (videoUrl && videoUrl.startsWith('data:'));

        if (needsUpload) {
          setUploadStatus('미디어 업로드 중...');
          console.log('미디어 업로드 시작...');

          const uploadedMedia = await uploadGeneratedMedia(
            user.uid,
            orderData.generatedImageUrl,
            orderData.generatedVideoUrl
          );

          imageUrl = uploadedMedia.imageUrl;
          videoUrl = uploadedMedia.videoUrl;
          console.log('미디어 업로드 완료:', uploadedMedia);
        }

        setUploadStatus('결제 준비 중...');

        const pendingOrder: PendingOrderData = {
          productInfo: {
            color: orderData.selectedColor,
            period: orderData.selectedPeriod,
            periodDays: getPeriodDays(orderData.selectedPeriod),
            productName: orderName,
          },
          designInfo: {
            category: orderData.aiDesignData.category as EventCategory,
            style: orderData.aiDesignData.style,
            prompt: orderData.aiDesignData.prompt,
            referenceImageUrl: orderData.aiDesignData.referenceImage,
          },
          generatedMedia: {
            imageUrl,  // Firebase Storage URL (작은 문자열)
            videoUrl,  // Firebase Storage URL (작은 문자열)
          },
          deliveryInfo: {
            recipientName: orderData.deliveryInfo.recipientName,
            recipientPhone: orderData.deliveryInfo.recipientPhone,
            postalCode: orderData.deliveryInfo.postalCode,
            address: orderData.deliveryInfo.address,
            addressDetail: orderData.deliveryInfo.addressDetail,
            installationDate: orderData.deliveryInfo.installationDate,
            installationTime: orderData.deliveryInfo.installationTime,
            installationNote: orderData.deliveryInfo.installationNote,
          },
          payment: {
            amount,
            deposit: orderData.deposit,
          },
        };

        localStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));
        console.log('주문 데이터 저장됨:', pendingOrder);
      }

      // 포트원 결제 요청 데이터 준비
      const paymentData = {
        amount,
        orderName,
        customerName: user.displayName || '구매자',
        customerEmail: user.email || undefined,
        customerMobilePhone: user.phoneNumber || undefined,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
        customData: {
          userId: user.uid,
          timestamp: new Date().toISOString(),
        }
      };

      // 포트원 결제 요청
      setUploadStatus('결제 진행 중...');
      const response = await requestPayment(paymentData);
      console.log('포트원 결제 응답:', response);

      // IFRAME 모드에서는 자동 리다이렉트가 안 되므로 수동으로 처리
      if (response) {
        // 결제 실패 체크
        if (response.code) {
          // 사용자가 결제를 취소한 경우
          if (response.code === 'FAILURE_TYPE_PG' || response.message?.includes('취소')) {
            console.log('결제 취소됨');
            localStorage.removeItem('pendingOrder');
            return; // 에러 메시지 없이 조용히 종료
          }

          // 그 외 실패
          throw new Error(response.message || '결제에 실패했습니다.');
        }

        // 결제 성공 - success 페이지로 리다이렉트
        if (response.paymentId) {
          const successUrl = new URL('/payment/success', window.location.origin);
          successUrl.searchParams.set('paymentId', response.paymentId);
          if (response.txId) {
            successUrl.searchParams.set('txId', response.txId);
          }
          successUrl.searchParams.set('amount', String(amount));

          console.log('결제 성공, 리다이렉트:', successUrl.toString());
          window.location.href = successUrl.toString();
          return;
        }
      }

    } catch (error) {
      console.error('포트원 결제 오류:', error);
      // 결제 실패 시 localStorage 정리
      localStorage.removeItem('pendingOrder');

      const errorMessage = error instanceof Error ? error.message : '결제 중 오류가 발생했습니다.';
      if (!errorMessage.includes('취소')) {
        alert(errorMessage);
      }
    } finally {
      setIsLoading(false);
      setUploadStatus('');
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
          <span>{uploadStatus || '결제 준비 중...'}</span>
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