import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, isUserAdmin } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { InquiryStatus } from '@/types/inquiry';

interface RouteParams {
  params: Promise<{ inquiryId: string }>;
}

// PATCH: 문의 상태 변경 및 답변 작성 (관리자 전용)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { inquiryId } = await params;
    const body = await request.json();
    const {
      adminId,
      status,
      adminResponse,
    } = body;

    if (!inquiryId) {
      return NextResponse.json(
        { error: 'inquiryId가 필요합니다.' },
        { status: 400 }
      );
    }

    // 관리자 권한 확인
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
    const docRef = db.collection('inquiries').doc(inquiryId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: '문의를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    // 상태 변경
    if (status !== undefined) {
      updateData.status = status as InquiryStatus;

      // 답변 완료 시 answeredAt 설정
      if (status === 'answered') {
        updateData.answeredAt = FieldValue.serverTimestamp();
        updateData.adminId = adminId;
      }
    }

    // 관리자 답변 작성
    if (adminResponse !== undefined) {
      updateData.adminResponse = adminResponse;
      updateData.adminId = adminId;

      // 답변 작성 시 자동으로 상태를 'answered'로 변경
      if (!status) {
        updateData.status = 'answered' as InquiryStatus;
        updateData.answeredAt = FieldValue.serverTimestamp();
      }
    }

    await docRef.update(updateData);

    // 업데이트된 문서 반환
    const updatedDoc = await docRef.get();
    const data = updatedDoc.data();

    return NextResponse.json({
      success: true,
      inquiry: {
        id: updatedDoc.id,
        ...data,
        createdAt: data?.createdAt?.toDate()?.toISOString(),
        updatedAt: data?.updatedAt?.toDate()?.toISOString(),
        answeredAt: data?.answeredAt?.toDate()?.toISOString(),
      },
    });
  } catch (error) {
    console.error('문의 업데이트 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
