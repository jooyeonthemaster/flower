// 토스페이먼츠 클라이언트 키
const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

// 전역 TossPayments 타입 선언
declare global {
  interface Window {
    TossPayments: (clientKey: string) => {
      requestPayment: (method: string, paymentData: Record<string, unknown>) => Promise<void>;
    };
  }
}

// 토스페이먼츠 SDK 초기화 (결제창 방식)
export const initTossPayments = async () => {
  // script 태그로 동적 로드
  if (typeof window !== 'undefined' && !window.TossPayments) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.tosspayments.com/v1/payment';
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  // TossPayments 초기화
  if (typeof window !== 'undefined' && window.TossPayments) {
    return window.TossPayments(clientKey);
  }
  
  throw new Error('TossPayments SDK를 로드할 수 없습니다.');
};

// 결제 요청 타입 정의
export interface PaymentRequest {
  amount: number;
  orderId: string;
  orderName: string;
  customerName?: string;
  customerEmail?: string;
  customerMobilePhone?: string;
  successUrl: string;
  failUrl: string;
}

// 주문 ID 생성 함수
export const generateOrderId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `ORDER_${timestamp}_${random}`;
};

// 결제 금액 포맷팅
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ko-KR').format(price);
};

const tossPaymentsLib = { initTossPayments, generateOrderId, formatPrice };
export default tossPaymentsLib; 