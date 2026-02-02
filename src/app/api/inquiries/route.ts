import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, isUserAdmin } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import type FirebaseFirestore from '@google-cloud/firestore';
import { InquiryStatus, InquiryType } from '@/types/inquiry';

// POST: 새 문의 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      inquiryType,
      message,
      userId,
    } = body;

    // 필수 필드 검증
    if (!name || !email || !message || !inquiryType) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const db = getAdminDb();

    // 문의 데이터 생성
    const inquiryData: Record<string, unknown> = {
      name,
      email,
      phone: phone || '',
      company: company || '',
      inquiryType: inquiryType as InquiryType,
      message,
      status: 'pending' as InquiryStatus,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    // 로그인한 사용자인 경우 userId 추가
    if (userId) {
      inquiryData.userId = userId;
    }

    // 문의 저장
    const inquiryRef = await db.collection('inquiries').add(inquiryData);

    return NextResponse.json({
      success: true,
      inquiryId: inquiryRef.id,
    });
  } catch (error) {
    console.error('문의 생성 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// GET: 문의 목록 조회 (관리자만)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');

    // [SECURITY] Reverted
    // const { verifyToken } = await import('@/lib/auth-utils');
    // const authResult = await verifyToken(request);
    // if (!authResult.success) {
    //   return authResult.response;
    // }

    const status = searchParams.get('status') as InquiryStatus | null;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // [ROLLBACK] Old Logic restored
    // 관리자 권한 확인
    if (!adminId) {
      return NextResponse.json({ error: 'adminId가 필요합니다.' }, { status: 400 });
    }
    const isAdmin = await isUserAdmin(adminId);
    if (!isAdmin) {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }


    const db = getAdminDb();
    let query: FirebaseFirestore.Query = db.collection('inquiries');

    // 상태 필터링
    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();

    // JS에서 정렬 및 페이지네이션
    let inquiries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString(),
      updatedAt: doc.data().updatedAt?.toDate()?.toISOString(),
      answeredAt: doc.data().answeredAt?.toDate()?.toISOString(),
    }));

    // createdAt 기준 내림차순 정렬 (최신순)
    inquiries.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    const total = inquiries.length;

    // 페이지네이션 적용
    inquiries = inquiries.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      inquiries,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('문의 목록 조회 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
