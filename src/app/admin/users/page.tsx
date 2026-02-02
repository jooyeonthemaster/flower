'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/firestore';

interface UserData {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  totalOrders: number;
  totalVideos: number;
  totalSpent: number;
}

export default function AdminUsersPage() {
  const { user, getUserIdToken } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [updating, setUpdating] = useState(false);
  const [lastDoc, setLastDoc] = useState<string | null>(null);
  const [filter, setFilter] = useState<UserRole | 'all'>('all');

  const fetchUsers = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        adminId: user.uid,
        limit: '50',
      });
      if (lastDoc) {
        params.append('offset', users.length.toString());
      }
      if (filter !== 'all') {
        params.append('role', filter);
      }

      const response = await fetch(`/api/users?${params}`);
      const data = await response.json();

      if (data.success) {
        setUsers(prev => lastDoc ? [...prev, ...data.users] : data.users);
        setLastDoc(data.lastDocId);
      }
    } catch (error) {
      console.error('사용자 목록 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  }, [user, lastDoc, filter, users.length]);

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user, fetchUsers]);

  const updateUserRole = useCallback(async (userId: string, newRole: UserRole) => {
    if (!user) return;

    try {
      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: user.uid,
          userId,
          role: newRole,
        }),
      });

      alert('역할 변경에 실패했습니다.');
    } finally {
      setUpdating(false);
    }
  }, [user, selectedUser, getUserIdToken]);

  const filteredUsers = useMemo(
    () => users.filter(
      (user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [users, searchTerm]
  );

  const totalSpentAll = useMemo(() => users.reduce((sum, u) => sum + u.totalSpent, 0), [users]);
  const adminCount = useMemo(() => users.filter((u) => u.role === 'admin').length, [users]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">회원 관리</h1>
          <p className="text-gray-500 mt-1">전체 회원 목록을 확인하고 관리합니다.</p>
        </div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          새로고침
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">총 회원</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}명</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">관리자</p>
          <p className="text-2xl font-bold text-blue-600">{adminCount}명</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">총 결제 금액</p>
          <p className="text-2xl font-bold text-green-600">{totalSpentAll.toLocaleString()}원</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">평균 결제 금액</p>
          <p className="text-2xl font-bold text-purple-600">
            {users.length > 0 ? Math.round(totalSpentAll / users.length).toLocaleString() : 0}원
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="이름 또는 이메일로 검색..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">회원</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">역할</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">주문 수</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">영상 수</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">총 결제</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">가입일</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    로딩 중...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((userData) => (
                  <tr key={userData.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {userData.photoURL ? (
                          <img
                            src={userData.photoURL}
                            alt={userData.displayName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                            {userData.displayName?.[0] || userData.email?.[0] || '?'}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{userData.displayName || '-'}</p>
                          <p className="text-xs text-gray-500">{userData.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${userData.role === 'admin'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                          }`}
                      >
                        {userData.role === 'admin' ? '관리자' : '일반'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{userData.totalOrders}건</td>
                    <td className="px-6 py-4 text-gray-900">{userData.totalVideos}개</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {userData.totalSpent.toLocaleString()}원
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(userData.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedUser(userData)}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        상세
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? '검색 결과가 없습니다.' : '아직 회원이 없습니다.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {selectedUser.photoURL ? (
                  <img
                    src={selectedUser.photoURL}
                    alt={selectedUser.displayName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-500 font-medium">
                    {selectedUser.displayName?.[0] || selectedUser.email?.[0] || '?'}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedUser.displayName || '-'}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedUser.totalOrders}</p>
                  <p className="text-sm text-blue-700">총 주문</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedUser.totalVideos}</p>
                  <p className="text-sm text-green-700">총 영상</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {selectedUser.totalSpent.toLocaleString()}원
                  </p>
                  <p className="text-sm text-purple-700">총 결제</p>
                </div>
              </div>

              {/* User Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-2">계정 정보</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">사용자 ID: </span>
                    <span className="font-mono text-xs text-gray-700">{selectedUser.uid}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">가입일: </span>
                    <span className="font-medium text-gray-900">
                      {new Date(selectedUser.createdAt).toLocaleString('ko-KR')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">마지막 로그인: </span>
                    <span className="font-medium text-gray-900">
                      {new Date(selectedUser.lastLoginAt).toLocaleString('ko-KR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Role Management */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-3">역할 관리</p>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">현재 역할:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${selectedUser.role === 'admin'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                      }`}
                  >
                    {selectedUser.role === 'admin' ? '관리자' : '일반 사용자'}
                  </span>
                </div>
                <div className="mt-4 flex gap-3">
                  {selectedUser.role === 'user' ? (
                    <button
                      onClick={() => updateUserRole(selectedUser.id, 'admin')}
                      disabled={updating}
                      className="px-4 py-2 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                      관리자로 변경
                    </button>
                  ) : (
                    <button
                      onClick={() => updateUserRole(selectedUser.id, 'user')}
                      disabled={updating}
                      className="px-4 py-2 bg-gray-500 text-white font-medium rounded-xl hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                      일반 사용자로 변경
                    </button>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-full py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
