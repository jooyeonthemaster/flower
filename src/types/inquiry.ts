import { Timestamp } from 'firebase/firestore';

// ============================================================
// 문의
// ============================================================
export type InquiryStatus = 'pending' | 'answered' | 'archived';
export type InquiryType = '일반문의' | '제품문의' | '기술지원' | '파트너십' | '기타';

export interface InquiryDocument {
  name: string;
  email: string;
  phone: string;
  company: string;
  inquiryType: InquiryType;
  message: string;
  status: InquiryStatus;
  userId?: string;
  adminId?: string;
  adminResponse?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  answeredAt?: Timestamp;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  inquiryType: InquiryType;
  message: string;
  status: InquiryStatus;
  userId?: string;
  adminId?: string;
  adminResponse?: string;
  createdAt: Date;
  updatedAt: Date;
  answeredAt?: Date;
}

// ============================================================
// 유틸리티 함수
// ============================================================
export function convertInquiryDocument(id: string, doc: InquiryDocument): Inquiry {
  return {
    id,
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    company: doc.company,
    inquiryType: doc.inquiryType,
    message: doc.message,
    status: doc.status,
    userId: doc.userId,
    adminId: doc.adminId,
    adminResponse: doc.adminResponse,
    createdAt: doc.createdAt?.toDate() || new Date(),
    updatedAt: doc.updatedAt?.toDate() || new Date(),
    answeredAt: doc.answeredAt?.toDate(),
  };
}
