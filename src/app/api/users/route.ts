import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, isUserAdmin } from '@/lib/firebase-admin';

// GET: 사용자 목록 조회 (관리자 전용)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    const limit = parseInt(searchParams.get('limit') || '200');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search') || '';

    // 관리자 권한 검증
    if (!adminId) {
      return NextResponse.json(
        { error: 'adminId가 필요합니다.' },
        { status: 400 }
      );
    }

    const isAdmin = await isUserAdmin(adminId);
    if (!isAdmin) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const db = getAdminDb();
    const snapshot = await db.collection('users').get();

    // 데이터 변환
    let users = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        uid: data.uid || doc.id,
        email: data.email || '',
        displayName: data.displayName || '',
        photoURL: data.photoURL || null,
        phoneNumber: data.phoneNumber || null,
        address: data.address || null,
        role: data.role || 'user',
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        lastLoginAt: data.lastLoginAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        totalOrders: data.totalOrders || 0,
        totalVideos: data.totalVideos || 0,
        totalSpent: data.totalSpent || 0,
      };
    });

    // 검색 필터 적용
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(
        user =>
          user.email.toLowerCase().includes(searchLower) ||
          user.displayName.toLowerCase().includes(searchLower)
      );
    }

    // createdAt 기준 내림차순 정렬
    users.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    const total = users.length;

    // 페이지네이션 적용
    users = users.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      users,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('사용자 목록 조회 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PATCH: 사용자 역할 변경 (관리자 전용)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, userId, role } = body;

    // 관리자 권한 검증
    if (!adminId) {
      return NextResponse.json(
        { error: 'adminId가 필요합니다.' },
        { status: 400 }
      );
    }

    const isAdmin = await isUserAdmin(adminId);
    if (!isAdmin) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'userId와 role이 필요합니다.' },
        { status: 400 }
      );
    }

    if (!['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: '유효하지 않은 역할입니다.' },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const { FieldValue } = await import('firebase-admin/firestore');

    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      role,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: '역할이 변경되었습니다.',
    });
  } catch (error) {
    console.error('사용자 역할 변경 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
