/**
 * Firestore 서비스 레이어
 * 주문, 사용자, 환불 관련 CRUD 작업
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  OrderDocument,
  UserDocument,
  RefundDocument,
  Order,
  User,
  RefundRequest,
  OrderStatus,
  RefundStatus,
  UserRole,
  ProductColor,
  RentalPeriod,
  EventCategory,
  convertOrderDoc,
  timestampToDate,
} from '@/types/order';

// ============================================
// 사용자 관련 함수
// ============================================

/**
 * 사용자 프로필 가져오기 또는 생성
 */
export async function getOrCreateUser(
  uid: string,
  email: string,
  displayName: string,
  photoURL: string | null
): Promise<User> {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data() as UserDocument;
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    };
  }

  // 새 사용자 생성
  const newUser: UserDocument = {
    uid,
    email,
    displayName,
    photoURL,
    phoneNumber: null,
    role: 'user',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await setDoc(userRef, newUser);

  return {
    ...newUser,
    createdAt: newUser.createdAt.toDate(),
    updatedAt: newUser.updatedAt.toDate(),
  };
}

/**
 * 사용자 프로필 업데이트
 */
export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<UserDocument, 'displayName' | 'phoneNumber' | 'photoURL'>>
): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

/**
 * 사용자 역할 확인
 */
export async function getUserRole(uid: string): Promise<UserRole | null> {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  return (userSnap.data() as UserDocument).role;
}

/**
 * 관리자 여부 확인
 */
export async function isAdmin(uid: string): Promise<boolean> {
  const role = await getUserRole(uid);
  return role === 'admin';
}

/**
 * 모든 사용자 목록 (관리자용)
 */
export async function getAllUsers(
  pageSize: number = 20,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ users: User[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  const usersRef = collection(db, 'users');
  let q = query(usersRef, orderBy('createdAt', 'desc'), limit(pageSize));

  if (lastDoc) {
    q = query(usersRef, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(pageSize));
  }

  const snapshot = await getDocs(q);
  const users: User[] = snapshot.docs.map((doc) => {
    const data = doc.data() as UserDocument;
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    };
  });

  const newLastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

  return { users, lastDoc: newLastDoc };
}

// ============================================
// 주문 관련 함수
// ============================================

/**
 * 주문 ID 생성
 */
export function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

/**
 * 주문 생성
 */
export async function createOrder(
  orderData: Omit<OrderDocument, 'createdAt' | 'updatedAt'>
): Promise<Order> {
  const orderRef = doc(db, 'orders', orderData.orderId);

  const orderDoc: OrderDocument = {
    ...orderData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await setDoc(orderRef, orderDoc);

  return convertOrderDoc(orderDoc);
}

/**
 * 주문 상세 조회
 */
export async function getOrder(orderId: string): Promise<Order | null> {
  const orderRef = doc(db, 'orders', orderId);
  const orderSnap = await getDoc(orderRef);

  if (!orderSnap.exists()) {
    return null;
  }

  return convertOrderDoc(orderSnap.data() as OrderDocument);
}

/**
 * 사용자의 주문 목록 조회
 */
export async function getUserOrders(
  userId: string,
  pageSize: number = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ orders: Order[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  const ordersRef = collection(db, 'orders');
  let q = query(
    ordersRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );

  if (lastDoc) {
    q = query(
      ordersRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      startAfter(lastDoc),
      limit(pageSize)
    );
  }

  const snapshot = await getDocs(q);
  const orders: Order[] = snapshot.docs.map((doc) =>
    convertOrderDoc(doc.data() as OrderDocument)
  );

  const newLastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

  return { orders, lastDoc: newLastDoc };
}

/**
 * 모든 주문 조회 (관리자용)
 */
export async function getAllOrders(
  pageSize: number = 20,
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  statusFilter?: OrderStatus
): Promise<{ orders: Order[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  const ordersRef = collection(db, 'orders');
  let q;

  if (statusFilter) {
    q = query(
      ordersRef,
      where('status', '==', statusFilter),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
  } else {
    q = query(ordersRef, orderBy('createdAt', 'desc'), limit(pageSize));
  }

  if (lastDoc) {
    if (statusFilter) {
      q = query(
        ordersRef,
        where('status', '==', statusFilter),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    } else {
      q = query(
        ordersRef,
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }
  }

  const snapshot = await getDocs(q);
  const orders: Order[] = snapshot.docs.map((doc) =>
    convertOrderDoc(doc.data() as OrderDocument)
  );

  const newLastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

  return { orders, lastDoc: newLastDoc };
}

/**
 * 주문 상태 업데이트
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, {
    status,
    updatedAt: Timestamp.now(),
  });
}

/**
 * 주문 정보 업데이트 (관리자용)
 */
export async function updateOrder(
  orderId: string,
  data: Partial<OrderDocument>
): Promise<void> {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

// ============================================
// 환불 관련 함수
// ============================================

/**
 * 환불 ID 생성
 */
export function generateRefundId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `REF-${timestamp}-${random}`;
}

/**
 * 환불 요청 생성
 */
export async function createRefundRequest(
  refundData: Omit<RefundDocument, 'createdAt' | 'updatedAt'>
): Promise<RefundRequest> {
  const refundRef = doc(db, 'refund_requests', refundData.refundId);

  const refundDoc: RefundDocument = {
    ...refundData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await setDoc(refundRef, refundDoc);

  // 주문 상태도 환불 요청으로 변경
  await updateOrderStatus(refundData.orderId, 'refund_requested');

  return {
    ...refundDoc,
    createdAt: refundDoc.createdAt.toDate(),
    updatedAt: refundDoc.updatedAt.toDate(),
    processedAt: refundDoc.processedAt?.toDate(),
  };
}

/**
 * 환불 요청 상세 조회
 */
export async function getRefundRequest(refundId: string): Promise<RefundRequest | null> {
  const refundRef = doc(db, 'refund_requests', refundId);
  const refundSnap = await getDoc(refundRef);

  if (!refundSnap.exists()) {
    return null;
  }

  const data = refundSnap.data() as RefundDocument;
  return {
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
    processedAt: data.processedAt ? timestampToDate(data.processedAt) : undefined,
  };
}

/**
 * 사용자의 환불 요청 목록
 */
export async function getUserRefunds(userId: string): Promise<RefundRequest[]> {
  const refundsRef = collection(db, 'refund_requests');
  const q = query(
    refundsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data() as RefundDocument;
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
      processedAt: data.processedAt ? timestampToDate(data.processedAt) : undefined,
    };
  });
}

/**
 * 모든 환불 요청 조회 (관리자용)
 */
export async function getAllRefunds(
  pageSize: number = 20,
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  statusFilter?: RefundStatus
): Promise<{ refunds: RefundRequest[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  const refundsRef = collection(db, 'refund_requests');
  let q;

  if (statusFilter) {
    q = query(
      refundsRef,
      where('status', '==', statusFilter),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
  } else {
    q = query(refundsRef, orderBy('createdAt', 'desc'), limit(pageSize));
  }

  if (lastDoc) {
    if (statusFilter) {
      q = query(
        refundsRef,
        where('status', '==', statusFilter),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    } else {
      q = query(
        refundsRef,
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }
  }

  const snapshot = await getDocs(q);
  const refunds: RefundRequest[] = snapshot.docs.map((doc) => {
    const data = doc.data() as RefundDocument;
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
      processedAt: data.processedAt ? timestampToDate(data.processedAt) : undefined,
    };
  });

  const newLastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

  return { refunds, lastDoc: newLastDoc };
}

/**
 * 환불 요청 처리 (관리자용)
 */
export async function processRefund(
  refundId: string,
  status: 'approved' | 'rejected',
  adminId: string,
  adminNote?: string,
  refundAmount?: number
): Promise<void> {
  const refundRef = doc(db, 'refund_requests', refundId);
  const refundSnap = await getDoc(refundRef);

  if (!refundSnap.exists()) {
    throw new Error('환불 요청을 찾을 수 없습니다.');
  }

  const refundData = refundSnap.data() as RefundDocument;

  await updateDoc(refundRef, {
    status,
    adminNote,
    processedBy: adminId,
    processedAt: Timestamp.now(),
    refundAmount: refundAmount ?? refundData.refundAmount,
    updatedAt: Timestamp.now(),
  });

  // 승인된 경우 주문 상태도 업데이트
  if (status === 'approved') {
    await updateOrderStatus(refundData.orderId, 'refunded');
  } else {
    // 거절된 경우 원래 상태로 복원 (여기서는 paid로)
    await updateOrderStatus(refundData.orderId, 'paid');
  }
}

// ============================================
// 통계 관련 함수 (관리자용)
// ============================================

/**
 * 오늘 주문 수
 */
export async function getTodayOrderCount(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ordersRef = collection(db, 'orders');
  const q = query(
    ordersRef,
    where('createdAt', '>=', Timestamp.fromDate(today))
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}

/**
 * 대기 중인 환불 요청 수
 */
export async function getPendingRefundCount(): Promise<number> {
  const refundsRef = collection(db, 'refund_requests');
  const q = query(
    refundsRef,
    where('status', 'in', ['pending', 'reviewing'])
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}

/**
 * 이번 달 총 매출
 */
export async function getMonthlyRevenue(): Promise<number> {
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const ordersRef = collection(db, 'orders');
  const q = query(
    ordersRef,
    where('status', '==', 'paid'),
    where('createdAt', '>=', Timestamp.fromDate(firstDayOfMonth))
  );

  const snapshot = await getDocs(q);
  let total = 0;

  snapshot.docs.forEach((doc) => {
    const data = doc.data() as OrderDocument;
    total += data.payment.totalAmount;
  });

  return total;
}

/**
 * 주문 상태별 통계
 */
export async function getOrderStatusStats(): Promise<Record<OrderStatus, number>> {
  const ordersRef = collection(db, 'orders');
  const snapshot = await getDocs(ordersRef);

  const stats: Record<string, number> = {};

  snapshot.docs.forEach((doc) => {
    const data = doc.data() as OrderDocument;
    stats[data.status] = (stats[data.status] || 0) + 1;
  });

  return stats as Record<OrderStatus, number>;
}
