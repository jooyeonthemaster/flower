'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { UserProfile, UserRole } from '@/types/firestore';

// 초기 관리자 이메일 목록 (환경 변수에서 가져옴)
const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Firebase 인증 정보만으로 기본 프로필 생성 (Firestore 접근 불가 시 사용)
  const createDefaultProfile = useCallback((firebaseUser: User): UserProfile => {
    const isEnvAdmin = ADMIN_EMAILS.includes(firebaseUser.email || '');
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL,
      role: isEnvAdmin ? 'admin' : 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
      totalOrders: 0,
      totalVideos: 0,
      totalSpent: 0,
    };
  }, []);

  // 사용자 프로필 가져오기 또는 생성
  const fetchOrCreateUserProfile = useCallback(async (firebaseUser: User): Promise<UserProfile> => {
    const isEnvAdmin = ADMIN_EMAILS.includes(firebaseUser.email || '');

    // Firestore 읽기 시도
    let existingData: Record<string, unknown> | null = null;
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        existingData = userSnap.data();
      }
    } catch {
      // Firestore 읽기 실패 - 기본 프로필 반환 (에러 로그 생략)
      return createDefaultProfile(firebaseUser);
    }

    if (existingData) {
      // 기존 사용자
      const currentRole = existingData.role as UserRole;
      const newRole: UserRole = isEnvAdmin ? 'admin' : currentRole;

      // Firestore 업데이트 시도 (선택적 - 실패해도 OK)
      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        await updateDoc(userRef, {
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          displayName: firebaseUser.displayName || existingData.displayName,
          photoURL: firebaseUser.photoURL,
          email: firebaseUser.email || existingData.email,
          ...(isEnvAdmin && currentRole !== 'admin' ? { role: 'admin' } : {}),
        });
      } catch {
        // 업데이트 실패는 무시 (로그도 생략)
      }

      return {
        uid: existingData.uid as string,
        email: existingData.email as string,
        displayName: (firebaseUser.displayName || existingData.displayName) as string,
        photoURL: firebaseUser.photoURL || (existingData.photoURL as string | null) || null,
        phoneNumber: existingData.phoneNumber as string | undefined,
        address: existingData.address as string | undefined,
        role: newRole,
        createdAt: (existingData.createdAt as { toDate: () => Date })?.toDate?.() || new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
        totalOrders: (existingData.totalOrders as number) || 0,
        totalVideos: (existingData.totalVideos as number) || 0,
        totalSpent: (existingData.totalSpent as number) || 0,
      };
    } else {
      // 신규 사용자 - Firestore 저장 시도 (선택적)
      const role: UserRole = isEnvAdmin ? 'admin' : 'user';

      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        await setDoc(userRef, {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL,
          role,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          totalOrders: 0,
          totalVideos: 0,
          totalSpent: 0,
        });
      } catch {
        // 저장 실패는 무시 (로그도 생략)
      }

      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
        totalOrders: 0,
        totalVideos: 0,
        totalSpent: 0,
      };
    }
  }, [createDefaultProfile]);

  // 프로필 새로고침
  const refreshUserProfile = useCallback(async () => {
    if (user) {
      const profile = await fetchOrCreateUserProfile(user);
      setUserProfile(profile);
    }
  }, [user, fetchOrCreateUserProfile]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const profile = await fetchOrCreateUserProfile(firebaseUser);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchOrCreateUserProfile]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google 로그인 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 환경 변수에서 직접 관리자 체크 (Firestore 업데이트 실패해도 관리자 인정)
  const isAdmin = userProfile?.role === 'admin' || ADMIN_EMAILS.includes(user?.email || '');

  const value = {
    user,
    userProfile,
    loading,
    isAdmin,
    signInWithGoogle,
    signOut,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
