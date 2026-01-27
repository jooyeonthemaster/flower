import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// GET: 현재 사용자 프로필 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId가 필요합니다.' },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const data = userDoc.data();
    return NextResponse.json({
      success: true,
      user: {
        id: userDoc.id,
        ...data,
        createdAt: data?.createdAt?.toDate()?.toISOString(),
        updatedAt: data?.updatedAt?.toDate()?.toISOString(),
        lastLoginAt: data?.lastLoginAt?.toDate()?.toISOString(),
      },
    });
  } catch (error) {
    console.error('사용자 프로필 조회 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PATCH: 프로필 수정
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, displayName, phoneNumber, address } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId가 필요합니다.' },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const auth = getAdminAuth();

    // 사용자 존재 확인
    try {
      await auth.getUser(userId);
    } catch {
      return NextResponse.json(
        { error: '유효하지 않은 사용자입니다.' },
        { status: 403 }
      );
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 업데이트 데이터 구성
    const updateData: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (displayName !== undefined) {
      updateData.displayName = displayName;
    }
    if (phoneNumber !== undefined) {
      updateData.phoneNumber = phoneNumber;
    }
    if (address !== undefined) {
      updateData.address = address;
    }

    await userRef.update(updateData);

    // 업데이트된 문서 반환
    const updatedDoc = await userRef.get();
    const data = updatedDoc.data();

    return NextResponse.json({
      success: true,
      user: {
        id: updatedDoc.id,
        ...data,
        createdAt: data?.createdAt?.toDate()?.toISOString(),
        updatedAt: data?.updatedAt?.toDate()?.toISOString(),
        lastLoginAt: data?.lastLoginAt?.toDate()?.toISOString(),
      },
    });
  } catch (error) {
    console.error('프로필 수정 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
