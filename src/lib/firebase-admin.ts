import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getStorage, Storage } from 'firebase-admin/storage';

let app: App;
let adminDb: Firestore;
let adminAuth: Auth;
let adminStorage: Storage;

function initializeFirebaseAdmin(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  // 방법 1: JSON 형태의 서비스 계정 키 사용 (FIREBASE_SERVICE_ACCOUNT_KEY)
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      return initializeApp({
        credential: cert(serviceAccount),
        storageBucket,
      });
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', e);
    }
  }

  // 방법 2: 개별 환경 변수 사용
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (projectId && privateKey && clientEmail) {
    return initializeApp({
      credential: cert({
        projectId,
        privateKey,
        clientEmail,
      }),
      storageBucket,
    });
  }

  // 방법 3: Vercel 환경에서는 credential이 필수
  // credential 없이 초기화하면 Storage/Firestore 접근 실패
  const errorMessage =
    'Firebase Admin 초기화 실패: 유효한 자격 증명을 찾을 수 없습니다.\n' +
    '다음 중 하나를 설정해주세요:\n' +
    '1. FIREBASE_SERVICE_ACCOUNT_KEY (전체 JSON)\n' +
    '2. FIREBASE_PROJECT_ID + FIREBASE_PRIVATE_KEY + FIREBASE_CLIENT_EMAIL\n' +
    '\nVercel 환경에서는 명시적 credential이 필수입니다.';

  console.error(errorMessage);
  throw new Error(errorMessage);
}

// 초기화 함수
function getAdminApp(): App {
  if (!app) {
    app = initializeFirebaseAdmin();
  }
  return app;
}

// Firestore 인스턴스 가져오기
export function getAdminDb(): Firestore {
  if (!adminDb) {
    adminDb = getFirestore(getAdminApp());
  }
  return adminDb;
}

// Auth 인스턴스 가져오기
export function getAdminAuth(): Auth {
  if (!adminAuth) {
    adminAuth = getAuth(getAdminApp());
  }
  return adminAuth;
}

// Storage 인스턴스 가져오기
export function getAdminStorage(): Storage {
  if (!adminStorage) {
    adminStorage = getStorage(getAdminApp());
  }
  return adminStorage;
}

// 환경 변수에서 관리자 이메일 목록 가져오기
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
  .split(',')
  .map(email => email.trim().toLowerCase())
  .filter(email => email.length > 0);

// 편의 함수: 사용자 역할 확인
export async function isUserAdmin(uid: string): Promise<boolean> {
  try {
    const db = getAdminDb();
    const auth = getAdminAuth();

    // 1. Firebase Auth에서 사용자 이메일 가져와서 환경 변수 확인
    try {
      const userRecord = await auth.getUser(uid);
      if (userRecord.email && ADMIN_EMAILS.includes(userRecord.email.toLowerCase())) {
        return true;
      }
    } catch {
      // Auth에서 사용자를 찾지 못해도 계속 진행
    }

    // 2. Firestore에서 role 확인
    const userDoc = await db.collection('users').doc(uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();

      // Firestore의 role이 admin이면 true
      if (userData?.role === 'admin') {
        return true;
      }

      // Firestore에 이메일이 있고 환경 변수에 포함되어 있으면 true
      if (userData?.email && ADMIN_EMAILS.includes(userData.email.toLowerCase())) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// 편의 함수: 사용자 통계 업데이트
export async function updateUserStats(
  uid: string,
  updates: {
    totalOrders?: number;
    totalVideos?: number;
    totalSpent?: number;
  }
): Promise<void> {
  try {
    const db = getAdminDb();
    const userRef = db.collection('users').doc(uid);

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (updates.totalOrders !== undefined) {
      updateData.totalOrders = updates.totalOrders;
    }
    if (updates.totalVideos !== undefined) {
      updateData.totalVideos = updates.totalVideos;
    }
    if (updates.totalSpent !== undefined) {
      updateData.totalSpent = updates.totalSpent;
    }

    await userRef.update(updateData);
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
}

// 편의 함수: 사용자 통계 증가
export async function incrementUserStats(
  uid: string,
  increments: {
    totalOrders?: number;
    totalVideos?: number;
    totalSpent?: number;
  }
): Promise<void> {
  try {
    const db = getAdminDb();
    const { FieldValue } = await import('firebase-admin/firestore');
    const userRef = db.collection('users').doc(uid);

    const updateData: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (increments.totalOrders !== undefined) {
      updateData.totalOrders = FieldValue.increment(increments.totalOrders);
    }
    if (increments.totalVideos !== undefined) {
      updateData.totalVideos = FieldValue.increment(increments.totalVideos);
    }
    if (increments.totalSpent !== undefined) {
      updateData.totalSpent = FieldValue.increment(increments.totalSpent);
    }

    await userRef.update(updateData);
  } catch (error) {
    console.error('Error incrementing user stats:', error);
    throw error;
  }
}

export { app, adminDb, adminAuth, adminStorage };
