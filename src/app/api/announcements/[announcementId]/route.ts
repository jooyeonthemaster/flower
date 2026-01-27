import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, isUserAdmin } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { AnnouncementCategory } from '@/types/firestore';

interface RouteParams {
  params: Promise<{ announcementId: string }>;
}

// GET: 공지사항 상세 조회
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { announcementId } = await params;

    if (!announcementId) {
      return NextResponse.json(
        { error: 'announcementId가 필요합니다.' },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const docRef = db.collection('announcements').doc(announcementId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: '공지사항을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 조회수 증가
    await docRef.update({
      viewCount: FieldValue.increment(1),
    });

    const data = doc.data();
    return NextResponse.json({
      success: true,
      announcement: {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate()?.toISOString(),
        updatedAt: data?.updatedAt?.toDate()?.toISOString(),
        publishedAt: data?.publishedAt?.toDate()?.toISOString(),
      },
    });
  } catch (error) {
    console.error('공지사항 상세 조회 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PATCH: 공지사항 수정 (관리자 전용)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { announcementId } = await params;
    const body = await request.json();
    const {
      adminId,
      title,
      content,
      summary,
      category,
      isPublished,
      isPinned,
    } = body;

    if (!announcementId) {
      return NextResponse.json(
        { error: 'announcementId가 필요합니다.' },
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
    const docRef = db.collection('announcements').doc(announcementId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: '공지사항을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const currentData = doc.data();
    const updateData: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (summary !== undefined) updateData.summary = summary;
    if (category !== undefined) updateData.category = category as AnnouncementCategory;
    if (isPinned !== undefined) updateData.isPinned = isPinned;

    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;
      // 처음 발행할 때만 publishedAt 설정
      if (isPublished && !currentData?.publishedAt) {
        updateData.publishedAt = FieldValue.serverTimestamp();
      }
    }

    await docRef.update(updateData);

    // 업데이트된 문서 반환
    const updatedDoc = await docRef.get();
    const data = updatedDoc.data();

    return NextResponse.json({
      success: true,
      announcement: {
        id: updatedDoc.id,
        ...data,
        createdAt: data?.createdAt?.toDate()?.toISOString(),
        updatedAt: data?.updatedAt?.toDate()?.toISOString(),
        publishedAt: data?.publishedAt?.toDate()?.toISOString(),
      },
    });
  } catch (error) {
    console.error('공지사항 수정 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 공지사항 삭제 (관리자 전용)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { announcementId } = await params;
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');

    if (!announcementId) {
      return NextResponse.json(
        { error: 'announcementId가 필요합니다.' },
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
    const docRef = db.collection('announcements').doc(announcementId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: '공지사항을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: '공지사항이 삭제되었습니다.',
    });
  } catch (error) {
    console.error('공지사항 삭제 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
