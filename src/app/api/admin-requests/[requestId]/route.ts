import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, isUserAdmin } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { AdminRequestStatus, AdminRequestPriority } from '@/types/firestore';

interface RouteParams {
  params: Promise<{ requestId: string }>;
}

// GET: 요청 상세 조회
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { requestId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!requestId) {
      return NextResponse.json(
        { error: 'requestId가 필요합니다.' },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const requestDoc = await db.collection('adminRequests').doc(requestId).get();

    if (!requestDoc.exists) {
      return NextResponse.json(
        { error: '요청을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const data = requestDoc.data();

    // 권한 확인: 본인 요청이거나 관리자인지
    if (userId && data?.userId !== userId) {
      const isAdmin = await isUserAdmin(userId);
      if (!isAdmin) {
        return NextResponse.json(
          { error: '접근 권한이 없습니다.' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      request: {
        id: requestDoc.id,
        ...data,
        createdAt: data?.createdAt?.toDate()?.toISOString(),
        updatedAt: data?.updatedAt?.toDate()?.toISOString(),
        reviewedAt: data?.reviewedAt?.toDate()?.toISOString(),
        completedAt: data?.completedAt?.toDate()?.toISOString(),
      },
    });
  } catch (error) {
    console.error('관리자 요청 상세 조회 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PATCH: 요청 상태 변경 (관리자 전용)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { requestId } = await params;
    const body = await request.json();
    const {
      adminId,
      status,
      adminResponse,
      adminNote,
      priority,
    } = body;

    if (!requestId) {
      return NextResponse.json(
        { error: 'requestId가 필요합니다.' },
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
    const requestRef = db.collection('adminRequests').doc(requestId);
    const requestDoc = await requestRef.get();

    if (!requestDoc.exists) {
      return NextResponse.json(
        { error: '요청을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 업데이트 데이터 구성
    const updateData: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (status) {
      updateData.status = status as AdminRequestStatus;

      // 상태에 따른 추가 필드
      if (status === 'reviewing' && !requestDoc.data()?.reviewedAt) {
        updateData.reviewedAt = FieldValue.serverTimestamp();
        updateData.adminId = adminId;
      }

      if (status === 'completed' || status === 'approved' || status === 'rejected') {
        updateData.completedAt = FieldValue.serverTimestamp();
      }
    }

    if (adminResponse !== undefined) {
      updateData.adminResponse = adminResponse;
    }

    if (adminNote !== undefined) {
      updateData.adminNote = adminNote;
    }

    if (priority) {
      updateData.priority = priority as AdminRequestPriority;
    }

    await requestRef.update(updateData);

    // 업데이트된 문서 반환
    const updatedDoc = await requestRef.get();
    const data = updatedDoc.data();

    return NextResponse.json({
      success: true,
      request: {
        id: updatedDoc.id,
        ...data,
        createdAt: data?.createdAt?.toDate()?.toISOString(),
        updatedAt: data?.updatedAt?.toDate()?.toISOString(),
        reviewedAt: data?.reviewedAt?.toDate()?.toISOString(),
        completedAt: data?.completedAt?.toDate()?.toISOString(),
      },
    });
  } catch (error) {
    console.error('관리자 요청 상태 변경 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
