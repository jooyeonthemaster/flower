import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, isUserAdmin } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { AnnouncementCategory } from '@/types/firestore';

// GET: 공지사항 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const category = searchParams.get('category') as AnnouncementCategory | null;
    const publishedOnly = searchParams.get('publishedOnly') !== 'false';

    const db = getAdminDb();

    // 복합 인덱스 문제 방지: 모든 공지사항을 가져온 후 JS에서 필터링/정렬
    const snapshot = await db.collection('announcements').get();

    let announcements = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        content: data.content || '',
        summary: data.summary || '',
        category: data.category || 'notice',
        isPublished: data.isPublished || false,
        isPinned: data.isPinned || false,
        authorId: data.authorId || '',
        authorName: data.authorName || '',
        viewCount: data.viewCount || 0,
        createdAt: data.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate()?.toISOString() || new Date().toISOString(),
        publishedAt: data.publishedAt?.toDate()?.toISOString() || null,
      };
    });

    // 발행된 것만 필터링
    if (publishedOnly) {
      announcements = announcements.filter(a => a.isPublished);
    }

    // 카테고리 필터링
    if (category) {
      announcements = announcements.filter(a => a.category === category);
    }

    // 고정된 항목을 먼저, 그 다음 생성일 내림차순 정렬
    announcements.sort((a, b) => {
      // isPinned 먼저 비교
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // 같으면 createdAt으로 정렬
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    // limit 적용
    if (limitParam) {
      announcements = announcements.slice(0, parseInt(limitParam));
    }

    return NextResponse.json({
      success: true,
      announcements,
    });
  } catch (error) {
    console.error('공지사항 목록 조회 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 공지사항 생성 (관리자 전용)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      adminId,
      title,
      content,
      summary,
      category = 'notice',
      isPublished = false,
      isPinned = false,
    } = body;

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

    if (!title || !content) {
      return NextResponse.json(
        { error: '제목과 내용은 필수입니다.' },
        { status: 400 }
      );
    }

    const db = getAdminDb();

    // 작성자 정보 가져오기
    const adminDoc = await db.collection('users').doc(adminId).get();
    const adminData = adminDoc.data();

    const announcementData = {
      title,
      content,
      summary: summary || content.substring(0, 100),
      category: category as AnnouncementCategory,
      isPublished,
      isPinned,
      authorId: adminId,
      authorName: adminData?.displayName || '관리자',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      publishedAt: isPublished ? FieldValue.serverTimestamp() : null,
      viewCount: 0,
    };

    const docRef = await db.collection('announcements').add(announcementData);

    return NextResponse.json({
      success: true,
      announcementId: docRef.id,
    });
  } catch (error) {
    console.error('공지사항 생성 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
