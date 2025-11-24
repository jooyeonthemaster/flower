// 포트원(PortOne) V2 결제 라이브러리
import * as PortOne from '@portone/browser-sdk/v2';
import type { PaymentRequest, PaymentResponse } from '@portone/browser-sdk/v2';

// 포트원 환경변수
const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID!;
const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!;

// 포트원 SDK는 이미 import되어 있으므로 초기화 함수가 필요 없음
export const initPortOnePayments = async (): Promise<typeof PortOne> => {
  // 브라우저 환경에서만 실행
  if (typeof window === 'undefined') {
    throw new Error('PortOne SDK는 브라우저 환경에서만 사용할 수 있습니다.');
  }

  return PortOne;
};

// 결제 ID 생성 함수
export const generatePaymentId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `payment_${timestamp}_${random}`;
};

// 고객 ID 생성 함수
export const generateCustomerId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `customer_${timestamp}_${random}`;
};

// 결제 요청 함수
export const requestPayment = async (paymentData: {
  amount: number;
  orderName: string;
  customerName?: string;
  customerEmail?: string;
  customerMobilePhone?: string;
  successUrl: string;
  failUrl: string;
  customData?: Record<string, unknown>;
}): Promise<PaymentResponse> => {
  try {
    // 브라우저 환경 확인
    if (typeof window === 'undefined') {
      throw new Error('PortOne SDK는 브라우저 환경에서만 사용할 수 있습니다.');
    }

    // 고객 정보 구성 (빈 값 제외)
    const customer: Record<string, string> = {
      customerId: generateCustomerId(),
    };
    
    if (paymentData.customerName) {
      customer.fullName = paymentData.customerName;
    }
    
    if (paymentData.customerEmail) {
      customer.email = paymentData.customerEmail;
    }
    
    if (paymentData.customerMobilePhone && paymentData.customerMobilePhone.trim() !== '') {
      customer.phoneNumber = paymentData.customerMobilePhone;
    }

    // 결제 요청 데이터 구성
    const paymentRequest: PaymentRequest = {
      storeId,
      channelKey,
      paymentId: generatePaymentId(),
      orderName: paymentData.orderName,
      totalAmount: paymentData.amount,
      currency: 'CURRENCY_KRW',
      payMethod: 'CARD',
      customer,
      redirectUrl: paymentData.successUrl,
      customData: paymentData.customData,
      locale: 'KO_KR',
      windowType: {
        pc: 'IFRAME'
      },
    };

    // 결제 요청
    const response = await PortOne.requestPayment(paymentRequest);
    
    if (!response) {
      throw new Error('포트원 결제 응답이 없습니다.');
    }
    
    return response;

  } catch (error) {
    console.error('포트원 결제 요청 오류:', error);
    throw error;
  }
};

// 결제 금액 포맷팅
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ko-KR').format(price);
};

// 포트원 에러 메시지 매핑
export const getPortOneErrorMessage = (code: string): string => {
  const errorMessages: { [key: string]: string } = {
    'PAYMENT_CANCELLED': '사용자가 결제를 취소했습니다.',
    'PAYMENT_FAILED': '결제에 실패했습니다.',
    'INVALID_REQUEST': '잘못된 요청입니다.',
    'UNAUTHORIZED': '인증에 실패했습니다.',
    'FORBIDDEN': '접근이 거부되었습니다.',
    'NOT_FOUND': '요청한 자원을 찾을 수 없습니다.',
    'INTERNAL_SERVER_ERROR': '서버 내부 오류가 발생했습니다.',
    'BAD_GATEWAY': '게이트웨이 오류가 발생했습니다.',
    'SERVICE_UNAVAILABLE': '서비스를 사용할 수 없습니다.',
    'GATEWAY_TIMEOUT': '게이트웨이 시간 초과가 발생했습니다.',
  };

  return errorMessages[code] || '알 수 없는 오류가 발생했습니다.';
};

// 기본 export
const portOnePaymentsLib = {
  initPortOnePayments,
  requestPayment,
  generatePaymentId,
  generateCustomerId,
  formatPrice,
  getPortOneErrorMessage,
};

export default portOnePaymentsLib;
