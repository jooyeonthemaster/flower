import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, isUserAdmin } from '@/lib/firebase-admin';
import { verifyToken } from '@/lib/auth-utils';

// GET: 대시보드 통계 조회 (관리자 전용)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId'); // [SECURITY] Deprecated

    // [SECURITY] Token based auth
    // const authResult = await verifyToken(request);
    // if (!authResult.success) {
    //   return authResult.response;
    // }

    /*
    // [ROLLBACK] Old Logic
    // 관리자 권한 검증
    if (!adminId) {
      return NextResponse.json({ error: 'adminId가 필요합니다.' }, { status: 400 });
    }
    const isAdmin = await isUserAdmin(adminId);
    if (!isAdmin) {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }
    */

    // [ROLLBACK] Old Logic Restored
    // 관리자 권한 검증
    if (!adminId) {
      return NextResponse.json({ error: 'adminId가 필요합니다.' }, { status: 400 });
    }

    const isAdmin = await isUserAdmin(adminId);
    if (!isAdmin) {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }


    const db = getAdminDb();

    // 모든 쿼리를 병렬로 실행 (성능 최적화)
    const [usersSnap, ordersSnap, videosSnap, pendingRequestsSnap, allRequestsSnap] = await Promise.all([
      db.collection('users').get(),
      db.collection('orders').get(),
      db.collection('videos').get(),
      db.collection('adminRequests').where('status', '==', 'pending').get(),
      db.collection('adminRequests').get(),
    ]);

    // 사용자 수
    const totalUsers = usersSnap.size;

    // 주문 수 및 매출
    let totalRevenue = 0;
    let paidOrdersCount = 0;
    ordersSnap.forEach(doc => {
      const data = doc.data();
      if (data.status === 'paid') {
        totalRevenue += data.amount || 0;
        paidOrdersCount++;
      }
    });

    // 영상 수
    const totalVideos = videosSnap.size;

    // 대기 중인 요청
    const pendingRequests = pendingRequestsSnap.size;

    // 최근 요청 (5개)
    let recentRequests = allRequestsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
    }));
    recentRequests.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    recentRequests = recentRequests.slice(0, 5);

    // 최근 주문 (5개)
    let recentOrders = ordersSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
    }));
    recentOrders.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    recentOrders = recentOrders.slice(0, 5);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders: ordersSnap.size,
        paidOrdersCount,
        totalRevenue,
        totalVideos,
        pendingRequests,
        recentRequests,
        recentOrders,
      },
    });
  } catch (error) {
    console.error('대시보드 통계 조회 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
