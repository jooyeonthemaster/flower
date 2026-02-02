import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, isUserAdmin } from '@/lib/firebase-admin';
import { verifyToken } from '@/lib/auth-utils';

// GET: 주문 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const adminId = searchParams.get('adminId'); // [ROLLBACK] Restored
    const isAdminView = searchParams.get('isAdminView') === 'true';
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const db = getAdminDb();

    // 관리자 뷰인 경우
    if (isAdminView) {
      // [SECURITY] Reverted
      // const authResult = await verifyToken(request);

      // [ROLLBACK] Old logic restored
      // 관리자 권한 검증
      if (!adminId) {
        return NextResponse.json({ error: 'adminId가 필요합니다.' }, { status: 400 });
      }
      const isAdmin = await isUserAdmin(adminId);
      if (!isAdmin) {
        return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
      }


      // 모든 주문 조회
      const snapshot = await db.collection('orders').get();

      let orders = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId || '',
          userEmail: data.userEmail || '',
          userName: data.userName || '',
          paymentId: data.paymentId || '',
          txId: data.txId || null,
          amount: data.amount || 0,
          currency: data.currency || 'KRW',
          payMethod: data.payMethod || '',
          orderName: data.orderName || '',
          productType: data.productType || 'standard',
          status: data.status || 'pending',
          videoId: data.videoId || null,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          paidAt: data.paidAt?.toDate?.()?.toISOString() || null,
        };
      });

      // 상태 필터 적용
      if (status && status !== 'all') {
        orders = orders.filter(order => order.status === status);
      }

      // createdAt 기준 내림차순 정렬
      orders.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      const total = orders.length;

      // 페이지네이션 적용
      orders = orders.slice(offset, offset + limit);

      return NextResponse.json({
        success: true,
        orders,
        total,
        limit,
        offset,
      });
    }

    // 사용자 뷰인 경우
    if (!userId) {
      return NextResponse.json(
        { error: 'userId가 필요합니다.' },
        { status: 400 }
      );
    }

    // 해당 사용자의 주문만 조회
    const snapshot = await db.collection('orders').where('userId', '==', userId).get();

    let orders = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId || '',
        userEmail: data.userEmail || '',
        userName: data.userName || '',
        paymentId: data.paymentId || '',
        txId: data.txId || null,
        amount: data.amount || 0,
        currency: data.currency || 'KRW',
        payMethod: data.payMethod || '',
        orderName: data.orderName || '',
        productType: data.productType || 'standard',
        status: data.status || 'pending',
        videoId: data.videoId || null,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        paidAt: data.paidAt?.toDate?.()?.toISOString() || null,
      };
    });

    // createdAt 기준 내림차순 정렬
    orders.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    const total = orders.length;

    // 페이지네이션 적용
    orders = orders.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      orders,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('주문 목록 조회 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
