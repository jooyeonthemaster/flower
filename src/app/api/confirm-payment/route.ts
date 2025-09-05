import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { paymentId, amount } = await request.json();

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

    // TODO: 여기서 데이터베이스에 주문 정보를 저장하거나 업데이트
    // await saveOrderToDatabase(data);

    return NextResponse.json({
      success: true,
      payment: data,
    });

  } catch (error) {
    console.error('포트원 결제 검증 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 주문 정보를 데이터베이스에 저장하는 함수 (예시)
// async function saveOrderToDatabase(paymentData: unknown) {
//   // Firebase Firestore에 저장하는 예시
//   // const { db } = await import('@/lib/firebase');
//   // const { addDoc, collection } = await import('firebase/firestore');
//   
//   // await addDoc(collection(db, 'orders'), {
//   //   paymentKey: paymentData.paymentKey,
//   //   orderId: paymentData.orderId,
//   //   amount: paymentData.totalAmount,
//   //   status: paymentData.status,
//   //   method: paymentData.method,
//   //   customerEmail: paymentData.customerEmail,
//   //   customerName: paymentData.customerName,
//   //   orderName: paymentData.orderName,
//   //   createdAt: new Date(),
//   //   updatedAt: new Date(),
//   // });
// } 