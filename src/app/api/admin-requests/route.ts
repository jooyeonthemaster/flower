import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, isUserAdmin } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import type FirebaseFirestore from '@google-cloud/firestore';
import { AdminRequestDocument, AdminRequestType, AdminRequestStatus, VideoMode } from '@/types/firestore';

// POST: 새 관리자 요청 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      userEmail,
      userName,
      userPhone,
      videoId,
      videoUrl,
      videoTitle,
      videoMode,
      requestType,
      message,
    } = body;

    // 필수 필드 검증
    if (!userId || !videoId || !videoUrl) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const db = getAdminDb();

    // 요청 데이터 생성 (undefined 값은 제외)
    const requestData: Record<string, unknown> = {
      userId,
      userEmail: userEmail || '',
      userName: userName || '',
      videoId,
      videoUrl,
      videoTitle: videoTitle || '홀로그램 영상',
      videoMode: (videoMode as VideoMode) || 'single',
      requestType: (requestType as AdminRequestType) || 'review',
      status: 'pending' as AdminRequestStatus,
      priority: 'normal',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    // 옵션 필드는 값이 있을 때만 추가 (Firestore는 undefined 허용 안함)
    if (userPhone !== undefined) requestData.userPhone = userPhone;
    if (message !== undefined) requestData.message = message;

    // 요청 저장
    const requestRef = await db.collection('adminRequests').add(requestData);

    // 영상 문서에 요청 ID 연결
    try {
      await db.collection('videos').doc(videoId).update({
        adminRequestId: requestRef.id,
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch (updateError) {
      console.error('영상 문서 업데이트 실패:', updateError);
    }

    return NextResponse.json({
      success: true,
      requestId: requestRef.id,
    });
  } catch (error) {
    console.error('관리자 요청 생성 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// GET: 요청 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const adminId = searchParams.get('adminId');
    const status = searchParams.get('status') as AdminRequestStatus | null;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const isAdminView = searchParams.get('isAdminView') === 'true';

    const db = getAdminDb();

    // 복합 인덱스 없이 쿼리 (필터만 적용, 정렬은 JS에서)
    let query: FirebaseFirestore.Query = db.collection('adminRequests');

    // 관리자 뷰가 아닌 경우 userId 필수
    if (!isAdminView) {
      if (!userId) {
        return NextResponse.json(
          { error: 'userId가 필요합니다.' },
          { status: 400 }
        );
      }
      query = query.where('userId', '==', userId);
    } else {
      // 관리자 뷰인 경우 권한 확인

      // [SECURITY] Reverted
      // const authResult = await verifyToken(request);

      // [ROLLBACK] Old Logic Restored
      if (adminId) {
        const isAdmin = await isUserAdmin(adminId);
        if (!isAdmin) {
          return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
        }
      }
    }


    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();

    // JS에서 정렬 및 페이지네이션
    let requests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString(),
      updatedAt: doc.data().updatedAt?.toDate()?.toISOString(),
      reviewedAt: doc.data().reviewedAt?.toDate()?.toISOString(),
      completedAt: doc.data().completedAt?.toDate()?.toISOString(),
    }));

    // createdAt 기준 내림차순 정렬
    requests.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    const total = requests.length;

    // 페이지네이션 적용
    requests = requests.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      requests,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('관리자 요청 목록 조회 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
