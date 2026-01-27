import { Timestamp } from 'firebase/firestore';

// ============================================================
// 사용자 역할
// ============================================================
export type UserRole = 'user' | 'admin';

// ============================================================
// 사용자 프로필
// ============================================================
export interface UserDocument {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  phoneNumber?: string;
  address?: string;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp;
  totalOrders: number;
  totalVideos: number;
  totalSpent: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  phoneNumber?: string;
  address?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  totalOrders: number;
  totalVideos: number;
  totalSpent: number;
}

// ============================================================
// 주문
// ============================================================
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
export type ProductType = 'standard' | 'premium';

export interface OrderDocument {
  userId: string;
  userEmail: string;
  userName: string;
  paymentId: string;
  txId?: string;
  amount: number;
  currency: string;
  payMethod: string;
  orderName: string;
  productType: ProductType;
  status: OrderStatus;
  videoId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  paidAt?: Timestamp;
  customData?: Record<string, unknown>;
}

export interface Order {
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
  productType: ProductType;
  status: OrderStatus;
  videoId?: string;
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  customData?: Record<string, unknown>;
}

// ============================================================
// 영상
// ============================================================
export type VideoMode = 'single' | 'composition';
export type VideoStatus = 'generating' | 'completed' | 'failed';

export interface VideoSceneData {
  scenes?: Array<{
    id: number;
    text: string;
    type?: 'title' | 'message' | 'sender';
  }>;
  customSettings?: {
    fontSize?: number;
    fontFamily?: string;
    textColor?: string;
    glowColor?: string;
    effects?: string[];
    letterEffect?: string;
    textPosition?: string;
  };
  eventInfo?: {
    groomName?: string;
    brideName?: string;
    businessName?: string;
    eventName?: string;
    organizer?: string;
    date?: string;
  };
}

export interface VideoDocument {
  userId: string;
  userEmail: string;
  title: string;
  description?: string;
  mode: VideoMode;
  category: string;
  style: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  fileSize?: number;
  sceneData?: VideoSceneData;
  status: VideoStatus;
  adminRequestId?: string;
  orderId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  downloadCount: number;
}

export interface Video {
  id: string;
  userId: string;
  userEmail: string;
  title: string;
  description?: string;
  mode: VideoMode;
  category: string;
  style: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  fileSize?: number;
  sceneData?: VideoSceneData;
  status: VideoStatus;
  adminRequestId?: string;
  orderId?: string;
  createdAt: Date;
  updatedAt: Date;
  downloadCount: number;
}

// ============================================================
// 관리자 요청
// ============================================================
export type AdminRequestType = 'review' | 'production' | 'custom';
export type AdminRequestStatus = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'completed';
export type AdminRequestPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface AdminRequestDocument {
  userId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  videoId: string;
  videoUrl: string;
  videoTitle: string;
  videoMode: VideoMode;
  requestType: AdminRequestType;
  message?: string;
  status: AdminRequestStatus;
  adminId?: string;
  adminResponse?: string;
  adminNote?: string;
  priority: AdminRequestPriority;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  reviewedAt?: Timestamp;
  completedAt?: Timestamp;
}

export interface AdminRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  videoId: string;
  videoUrl: string;
  videoTitle: string;
  videoMode: VideoMode;
  requestType: AdminRequestType;
  message?: string;
  status: AdminRequestStatus;
  adminId?: string;
  adminResponse?: string;
  adminNote?: string;
  priority: AdminRequestPriority;
  createdAt: Date;
  updatedAt: Date;
  reviewedAt?: Date;
  completedAt?: Date;
}

// ============================================================
// 공지사항
// ============================================================
export type AnnouncementCategory = 'notice' | 'update' | 'event' | 'maintenance';

export interface AnnouncementDocument {
  title: string;
  content: string;
  summary?: string;
  category: AnnouncementCategory;
  isPublished: boolean;
  isPinned: boolean;
  authorId: string;
  authorName: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
  viewCount: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category: AnnouncementCategory;
  isPublished: boolean;
  isPinned: boolean;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  viewCount: number;
}

// ============================================================
// 통계
// ============================================================
export interface DailyStatistics {
  date: string;
  newUsers: number;
  activeUsers: number;
  totalOrders: number;
  totalRevenue: number;
  videosGenerated: number;
  standardVideos: number;
  premiumVideos: number;
  adminRequests: number;
  adminRequestsCompleted: number;
  updatedAt: Timestamp;
}

export interface DashboardStats {
  today: {
    orders: number;
    revenue: number;
    newUsers: number;
    videosGenerated: number;
    pendingRequests: number;
  };
  weekly: {
    orders: number[];
    revenue: number[];
    videos: number[];
    labels: string[];
  };
  totals: {
    users: number;
    orders: number;
    revenue: number;
    videos: number;
  };
}

// ============================================================
// 유틸리티 타입
// ============================================================

// Firestore 문서를 클라이언트 타입으로 변환하는 함수용 타입
export type DocumentWithId<T> = T & { id: string };

// Timestamp를 Date로 변환
export function convertTimestampToDate(timestamp: Timestamp | undefined): Date | undefined {
  return timestamp?.toDate();
}

// Document를 클라이언트 타입으로 변환
export function convertUserDocument(id: string, doc: UserDocument): UserProfile {
  return {
    uid: doc.uid,
    email: doc.email,
    displayName: doc.displayName,
    photoURL: doc.photoURL,
    phoneNumber: doc.phoneNumber,
    address: doc.address,
    role: doc.role,
    createdAt: doc.createdAt?.toDate() || new Date(),
    updatedAt: doc.updatedAt?.toDate() || new Date(),
    lastLoginAt: doc.lastLoginAt?.toDate() || new Date(),
    totalOrders: doc.totalOrders || 0,
    totalVideos: doc.totalVideos || 0,
    totalSpent: doc.totalSpent || 0,
  };
}

export function convertOrderDocument(id: string, doc: OrderDocument): Order {
  return {
    id,
    userId: doc.userId,
    userEmail: doc.userEmail,
    userName: doc.userName,
    paymentId: doc.paymentId,
    txId: doc.txId,
    amount: doc.amount,
    currency: doc.currency,
    payMethod: doc.payMethod,
    orderName: doc.orderName,
    productType: doc.productType,
    status: doc.status,
    videoId: doc.videoId,
    createdAt: doc.createdAt?.toDate() || new Date(),
    updatedAt: doc.updatedAt?.toDate() || new Date(),
    paidAt: doc.paidAt?.toDate(),
    customData: doc.customData,
  };
}

export function convertVideoDocument(id: string, doc: VideoDocument): Video {
  return {
    id,
    userId: doc.userId,
    userEmail: doc.userEmail,
    title: doc.title,
    description: doc.description,
    mode: doc.mode,
    category: doc.category,
    style: doc.style,
    videoUrl: doc.videoUrl,
    thumbnailUrl: doc.thumbnailUrl,
    duration: doc.duration,
    fileSize: doc.fileSize,
    sceneData: doc.sceneData,
    status: doc.status,
    adminRequestId: doc.adminRequestId,
    orderId: doc.orderId,
    createdAt: doc.createdAt?.toDate() || new Date(),
    updatedAt: doc.updatedAt?.toDate() || new Date(),
    downloadCount: doc.downloadCount || 0,
  };
}

export function convertAdminRequestDocument(id: string, doc: AdminRequestDocument): AdminRequest {
  return {
    id,
    userId: doc.userId,
    userEmail: doc.userEmail,
    userName: doc.userName,
    userPhone: doc.userPhone,
    videoId: doc.videoId,
    videoUrl: doc.videoUrl,
    videoTitle: doc.videoTitle,
    videoMode: doc.videoMode,
    requestType: doc.requestType,
    message: doc.message,
    status: doc.status,
    adminId: doc.adminId,
    adminResponse: doc.adminResponse,
    adminNote: doc.adminNote,
    priority: doc.priority,
    createdAt: doc.createdAt?.toDate() || new Date(),
    updatedAt: doc.updatedAt?.toDate() || new Date(),
    reviewedAt: doc.reviewedAt?.toDate(),
    completedAt: doc.completedAt?.toDate(),
  };
}

export function convertAnnouncementDocument(id: string, doc: AnnouncementDocument): Announcement {
  return {
    id,
    title: doc.title,
    content: doc.content,
    summary: doc.summary,
    category: doc.category,
    isPublished: doc.isPublished,
    isPinned: doc.isPinned,
    authorId: doc.authorId,
    authorName: doc.authorName,
    createdAt: doc.createdAt?.toDate() || new Date(),
    updatedAt: doc.updatedAt?.toDate() || new Date(),
    publishedAt: doc.publishedAt?.toDate(),
    viewCount: doc.viewCount || 0,
  };
}
