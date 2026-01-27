import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, incrementUserStats } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const { paymentId, amount, txId } = await request.json();

    // 포트원 V2 API Secret 키
    const apiSecret = process.env.PORTONE_API_SECRET!;

    // 포트원 V2 결제 정보 조회 API 호출
    const response = await fetch(`https://api.portone.io/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `PortOne ${apiSecret}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('포트원 결제 정보 조회 실패:', data);
      return NextResponse.json(
        { error: data.message || '결제 정보 조회에 실패했습니다.' },
        { status: response.status }
      );
    }

    // 결제 상태 확인
    if (data.status !== 'PAID') {
      console.error('결제가 완료되지 않음:', data);
      return NextResponse.json(
        { error: '결제가 완료되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 결제 금액 검증
    if (data.amount?.total !== parseInt(amount)) {
      console.error('결제 금액 불일치:', { expected: amount, actual: data.amount?.total });
      return NextResponse.json(
        { error: '결제 금액이 일치하지 않습니다.' },
        { status: 400 }
      );
    }

    // 결제 검증 성공
    console.log('포트원 결제 검증 성공:', data);

    // Firestore에 주문 정보 저장
    let orderId: string | null = null;
    const customData = data.customData ? JSON.parse(data.customData) : {};
    const userId = customData.userId;

    try {
      const db = getAdminDb();

      // 주문 데이터 생성
      const orderData = {
        userId: userId || null,
        userEmail: data.customer?.email || '',
        userName: data.customer?.fullName || data.customer?.name || '',

        paymentId: data.paymentId,
        txId: txId || data.txId || null,
        amount: data.amount.total,
        currency: data.currency || 'KRW',
        payMethod: data.method?.type || 'CARD',

        orderName: data.orderName || '홀로그램 영상',
        productType: data.orderName?.includes('프리미엄') || data.orderName?.includes('Premium')
          ? 'premium'
          : 'standard',

        status: 'paid',

        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        paidAt: FieldValue.serverTimestamp(),

        customData,
      };

      // 주문 저장
      const orderRef = await db.collection('orders').add(orderData);
      orderId = orderRef.id;
      console.log('주문 저장 완료:', orderId);

      // 사용자 통계 업데이트
      if (userId) {
        try {
          await incrementUserStats(userId, {
            totalOrders: 1,
            totalSpent: data.amount.total,
          });
          console.log('사용자 통계 업데이트 완료:', userId);
        } catch (statsError) {
          // 통계 업데이트 실패해도 주문은 성공으로 처리
          console.error('사용자 통계 업데이트 실패:', statsError);
        }
      }
    } catch (dbError) {
      // DB 저장 실패해도 결제는 성공으로 처리
      console.error('주문 저장 실패:', dbError);
    }

    return NextResponse.json({
      success: true,
      payment: data,
      orderId,
    });

  } catch (error) {
    console.error('포트원 결제 검증 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
