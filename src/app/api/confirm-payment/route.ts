import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    // 토스페이먼츠 시크릿 키
    const secretKey = process.env.TOSS_SECRET_KEY!;
    
    // 토스페이먼츠 결제 승인 API 호출
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: parseInt(amount),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('토스페이먼츠 결제 승인 실패:', data);
      return NextResponse.json(
        { error: data.message || '결제 승인에 실패했습니다.' },
        { status: response.status }
      );
    }

    // 결제 승인 성공
    console.log('결제 승인 성공:', data);

    // TODO: 여기서 데이터베이스에 주문 정보를 저장하거나 업데이트
    // await saveOrderToDatabase(data);

    return NextResponse.json({
      success: true,
      payment: data,
    });

  } catch (error) {
    console.error('결제 승인 API 오류:', error);
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