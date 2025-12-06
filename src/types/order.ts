/**
 * 주문 및 환불 관련 타입 정의
 * 디지털화환 렌탈 서비스용
 */

import { Timestamp } from 'firebase/firestore';

// ============================================
// 주문 상태 (Order Status)
// ============================================
export type OrderStatus =
  | 'pending'           // 결제 대기
  | 'paid'              // 결제 완료
  | 'preparing'         // 준비 중
  | 'shipping'          // 배송 중
  | 'installed'         // 설치 완료
  | 'in_use'            // 사용 중
  | 'pickup_scheduled'  // 수거 예정
  | 'completed'         // 완료
  | 'cancelled'         // 취소됨
  | 'refund_requested'  // 환불 요청
  | 'refunded';         // 환불 완료

// 상태별 한글 라벨
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: '결제 대기',
  paid: '결제 완료',
  preparing: '준비 중',
  shipping: '배송 중',
  installed: '설치 완료',
  in_use: '사용 중',
  pickup_scheduled: '수거 예정',
  completed: '완료',
  cancelled: '취소됨',
  refund_requested: '환불 요청',
  refunded: '환불 완료',
};

// 상태별 색상
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  shipping: 'bg-indigo-100 text-indigo-800',
  installed: 'bg-green-100 text-green-800',
  in_use: 'bg-emerald-100 text-emerald-800',
  pickup_scheduled: 'bg-orange-100 text-orange-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  refund_requested: 'bg-pink-100 text-pink-800',
  refunded: 'bg-red-100 text-red-800',
};

// ============================================
// 환불 상태 (Refund Status)
// ============================================
export type RefundStatus =
  | 'pending'     // 대기 중
  | 'reviewing'   // 검토 중
  | 'approved'    // 승인됨
  | 'rejected'    // 거절됨
  | 'processing'  // 처리 중
  | 'completed';  // 완료

export const REFUND_STATUS_LABELS: Record<RefundStatus, string> = {
  pending: '대기 중',
  reviewing: '검토 중',
  approved: '승인됨',
  rejected: '거절됨',
  processing: '처리 중',
  completed: '완료',
};

export const REFUND_STATUS_COLORS: Record<RefundStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewing: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  processing: 'bg-purple-100 text-purple-800',
  completed: 'bg-gray-100 text-gray-800',
};

// ============================================
// 환불 사유 타입
// ============================================
export type RefundReasonType =
  | 'defect'            // 제품 하자
  | 'shipping_damage'   // 배송 중 파손
  | 'wrong_product'     // 상품 불일치
  | 'installation_fail' // 설치 불가
  | 'simple_change'     // 단순 변심
  | 'other';            // 기타

export const REFUND_REASON_LABELS: Record<RefundReasonType, string> = {
  defect: '제품 하자',
  shipping_damage: '배송 중 파손',
  wrong_product: '상품 불일치',
  installation_fail: '설치 불가',
  simple_change: '단순 변심',
  other: '기타',
};

// 환불 비율 (%)
export const REFUND_RATES: Record<RefundReasonType, number> = {
  defect: 100,
  shipping_damage: 100,
  wrong_product: 100,
  installation_fail: 90,  // 고객 사유 시
  simple_change: 85,      // 7일 이내
  other: 0,
};

// ============================================
// 사용자 역할
// ============================================
export type UserRole = 'user' | 'admin';

// ============================================
// 제품 타입
// ============================================
export type ProductColor = 'blue' | 'red';
export type RentalPeriod = 'daily' | 'weekly' | 'monthly';

export const PRODUCT_COLOR_LABELS: Record<ProductColor, string> = {
  blue: '블루 타입',
  red: '레드 타입',
};

export const RENTAL_PERIOD_LABELS: Record<RentalPeriod, string> = {
  daily: '일간 렌탈',
  weekly: '주간 렌탈',
  monthly: '월간 렌탈',
};

export const RENTAL_PRICES: Record<RentalPeriod, number> = {
  daily: 120000,
  weekly: 700000,
  monthly: 2400000,
};

// ============================================
// 카테고리 (행사 유형)
// ============================================
export type EventCategory =
  | 'opening'    // 개업 축하
  | 'wedding'    // 결혼식
  | 'birthday'   // 생일
  | 'memorial'   // 추모
  | 'event'      // 행사/전시
  | 'promotion'; // 승진/영전

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  opening: '개업 축하',
  wedding: '결혼식',
  birthday: '생일',
  memorial: '추모',
  event: '행사/전시',
  promotion: '승진/영전',
};

export const EVENT_CATEGORY_ICONS: Record<EventCategory, string> = {
  opening: '🎉',
  wedding: '💍',
  birthday: '🎂',
  memorial: '🕊️',
  event: '🎤',
  promotion: '📢',
};

// ============================================
// Firestore 문서 타입
// ============================================

// 사용자 문서
export interface UserDocument {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  phoneNumber: string | null;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 주문 문서
export interface OrderDocument {
  orderId: string;
  userId: string;
  paymentId: string;
  status: OrderStatus;

  // 제품 정보
  productInfo: {
    color: ProductColor;
    period: RentalPeriod;
    periodDays: number;
    productName: string;
  };

  // AI 디자인 정보
  designInfo: {
    category: EventCategory;
    style: string;
    prompt: string;
    referenceImageUrl?: string;
  };

  // 생성된 미디어
  generatedMedia: {
    imageUrl: string;
    videoUrl: string;
    thumbnailUrl?: string;
  };

  // 결제 정보
  payment: {
    amount: number;           // 렌탈 금액
    deposit: number;          // 보증금 (500,000원)
    totalAmount: number;      // 총 결제 금액
    method: string;           // 결제 수단 (CARD 등)
    paidAt: Timestamp;
  };

  // 고객 정보
  customer: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };

  // 렌탈 기간
  rental: {
    startDate: Timestamp;
    endDate: Timestamp;
    installationAddress?: string;
  };

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 환불 요청 문서
export interface RefundDocument {
  refundId: string;
  orderId: string;
  userId: string;
  status: RefundStatus;
  reason: string;                    // 상세 사유
  reasonType: RefundReasonType;      // 사유 분류
  amount: number;                    // 원 결제 금액
  refundAmount: number;              // 환불 예정/완료 금액
  evidenceImages?: string[];         // 증거 사진 URLs
  adminNote?: string;                // 관리자 메모
  processedBy?: string;              // 처리한 관리자 ID
  processedAt?: Timestamp;           // 처리 일시
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 관리자 활동 로그
export interface AdminLogDocument {
  logId: string;
  adminId: string;
  adminEmail: string;
  action: string;                    // order_update, refund_approve 등
  targetCollection: string;
  targetId: string;
  details: Record<string, unknown>;
  timestamp: Timestamp;
  ipAddress?: string;
}

// ============================================
// 클라이언트용 타입 (Timestamp → Date 변환)
// ============================================

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  phoneNumber: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  orderId: string;
  userId: string;
  paymentId: string;
  status: OrderStatus;
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
    thumbnailUrl?: string;
  };
  payment: {
    amount: number;
    deposit: number;
    totalAmount: number;
    method: string;
    paidAt: Date;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  rental: {
    startDate: Date;
    endDate: Date;
    installationAddress?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface RefundRequest {
  refundId: string;
  orderId: string;
  userId: string;
  status: RefundStatus;
  reason: string;
  reasonType: RefundReasonType;
  amount: number;
  refundAmount: number;
  evidenceImages?: string[];
  adminNote?: string;
  processedBy?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// 유틸리티 함수
// ============================================

/**
 * Firestore Timestamp를 Date로 변환
 */
export function timestampToDate(timestamp: Timestamp | undefined): Date {
  return timestamp?.toDate() ?? new Date();
}

/**
 * OrderDocument를 Order로 변환
 */
export function convertOrderDoc(doc: OrderDocument): Order {
  return {
    ...doc,
    payment: {
      ...doc.payment,
      paidAt: timestampToDate(doc.payment.paidAt),
    },
    rental: {
      ...doc.rental,
      startDate: timestampToDate(doc.rental.startDate),
      endDate: timestampToDate(doc.rental.endDate),
    },
    createdAt: timestampToDate(doc.createdAt),
    updatedAt: timestampToDate(doc.updatedAt),
  };
}

/**
 * 환불 금액 계산
 */
export function calculateRefundAmount(
  originalAmount: number,
  reasonType: RefundReasonType,
  daysUsed: number = 0
): { refundAmount: number; deduction: number; rate: number } {
  let rate = REFUND_RATES[reasonType];

  // 단순 변심의 경우 7일 이후는 환불 불가
  if (reasonType === 'simple_change' && daysUsed > 7) {
    rate = 0;
  }

  // 설치 전 설치 불가는 100%
  if (reasonType === 'installation_fail' && daysUsed === 0) {
    rate = 100;
  }

  const refundAmount = Math.floor(originalAmount * (rate / 100));
  const deduction = originalAmount - refundAmount;

  return { refundAmount, deduction, rate };
}

/**
 * 가격 포맷팅
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR').format(price);
}

/**
 * 날짜 포맷팅
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * 날짜+시간 포맷팅
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
