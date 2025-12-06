'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getOrCreateUser, updateUserProfile } from '@/lib/firestore';
import { User } from '@/types/order';

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 폼 상태
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (authUser) {
      loadProfile();
    }
  }, [authUser]);

  const loadProfile = async () => {
    if (!authUser) return;

    try {
      setLoading(true);
      const userProfile = await getOrCreateUser(
        authUser.uid,
        authUser.email || '',
        authUser.displayName || '사용자',
        authUser.photoURL
      );
      setProfile(userProfile);
      setDisplayName(userProfile.displayName);
      setPhoneNumber(userProfile.phoneNumber || '');
    } catch (error) {
      console.error('프로필 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) return;

    try {
      setSaving(true);
      setMessage(null);

      await updateUserProfile(authUser.uid, {
        displayName,
        phoneNumber: phoneNumber || null,
      });

      setMessage({ type: 'success', text: '프로필이 저장되었습니다.' });

      // 프로필 다시 로드
      await loadProfile();
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      setMessage({ type: 'error', text: '프로필 저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^0-9]/g, '');

    // 전화번호 포맷팅
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(formatPhoneNumber(e.target.value));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">프로필 설정</h1>
        <p className="text-gray-600 mt-1">계정 정보를 관리합니다.</p>
      </div>

      {/* 프로필 카드 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* 프로필 헤더 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
          <div className="flex items-center space-x-4">
            {authUser?.photoURL ? (
              <img
                src={authUser.photoURL}
                alt="프로필"
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center">
                <span className="text-3xl text-gray-400">
                  {displayName?.charAt(0) || '?'}
                </span>
              </div>
            )}
            <div className="text-white">
              <h2 className="text-xl font-semibold">{displayName}</h2>
              <p className="text-blue-100">{authUser?.email}</p>
            </div>
          </div>
        </div>

        {/* 프로필 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 메시지 */}
          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* 이메일 (읽기 전용) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              type="email"
              value={authUser?.email || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">
              이메일은 Google 계정으로 로그인하여 변경할 수 없습니다.
            </p>
          </div>

          {/* 이름 */}
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="이름을 입력하세요"
            />
          </div>

          {/* 연락처 */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              연락처
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={handlePhoneChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="010-1234-5678"
              maxLength={13}
            />
            <p className="mt-1 text-xs text-gray-500">
              주문 관련 연락을 위해 사용됩니다.
            </p>
          </div>

          {/* 가입일 */}
          {profile && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">가입일</label>
              <p className="text-gray-600">
                {new Intl.DateTimeFormat('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }).format(profile.createdAt)}
              </p>
            </div>
          )}

          {/* 저장 버튼 */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  저장 중...
                </>
              ) : (
                '변경사항 저장'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 계정 정보 */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">계정 정보</h3>

        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-gray-500">로그인 방식</dt>
            <dd className="font-medium text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">계정 상태</dt>
            <dd className="font-medium text-green-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              정상
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">계정 유형</dt>
            <dd className="font-medium text-gray-900">
              {profile?.role === 'admin' ? '관리자' : '일반 회원'}
            </dd>
          </div>
        </dl>
      </div>

      {/* 안내 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-2">개인정보 보호</h3>
        <p className="text-blue-700 text-sm">
          입력하신 개인정보는 주문 처리 및 고객 서비스 목적으로만 사용됩니다.
          개인정보 처리방침에 대한 자세한 내용은 이용약관을 참조해 주세요.
        </p>
      </div>
    </div>
  );
}
