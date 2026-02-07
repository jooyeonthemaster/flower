import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, incrementUserStats } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import type FirebaseFirestore from '@google-cloud/firestore';
import { VideoDocument, VideoMode, VideoStatus, VideoSceneData } from '@/types/firestore';
import crypto from 'crypto';

/**
 * userId + videoUrl로 deterministic document ID 생성
 * Race condition 방지: 같은 조합은 항상 같은 ID 생성
 */
function generateVideoDocId(userId: string, videoUrl: string): string {
  const hash = crypto.createHash('sha256')
    .update(`${userId}_${videoUrl}`)
    .digest('hex');
  return `vid_${hash.substring(0, 28)}`; // 'vid_' prefix + 28자 = 32자
}

// POST: 새 영상 저장
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      userEmail,
      title,
      description,
      mode,
      category,
      style,
      videoUrl,
      thumbnailUrl,
      duration,
      fileSize,
      sceneData,
      orderId,
    } = body;

    // 필수 필드 검증
    if (!userId || !videoUrl) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const db = getAdminDb();

    // ✅ Deterministic ID로 중복 방지 (Race Condition 완전 해결)
    const docId = generateVideoDocId(userId, videoUrl);
    const docRef = db.collection('videos').doc(docId);

    // 이미 존재하는지 확인
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      console.log('[Videos API] Duplicate video detected (by deterministic ID):', docId);
      return NextResponse.json({
        success: true,
        videoId: docId,
        isDuplicate: true,
        message: '이미 저장된 영상입니다.'
      });
    }

    // 영상 데이터 생성 (undefined 값은 제외)
    const videoData: Record<string, unknown> = {
      userId,
      userEmail: userEmail || '',
      title: title || `홀로그램 영상 ${new Date().toLocaleDateString('ko-KR')}`,
      mode: (mode as VideoMode) || 'single',
      category: category || 'general',
      style: style || 'default',
      videoUrl,
      duration: duration || 30,
      status: 'completed' as VideoStatus,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      downloadCount: 0,
    };

    // 옵션 필드는 값이 있을 때만 추가 (Firestore는 undefined 허용 안함)
    if (description !== undefined) videoData.description = description;
    if (thumbnailUrl !== undefined) videoData.thumbnailUrl = thumbnailUrl;
    if (fileSize !== undefined) videoData.fileSize = fileSize;
    if (sceneData !== undefined) videoData.sceneData = sceneData;
    if (orderId !== undefined) videoData.orderId = orderId;

    // ✅ Deterministic ID로 새 영상 저장 (set 사용, race condition 완전 차단)
    await docRef.set(videoData);

    console.log('[Videos API] New video saved with deterministic ID:', docId);

    // 사용자 통계 업데이트
    try {
      await incrementUserStats(userId, { totalVideos: 1 });
    } catch (statsError) {
      console.error('사용자 통계 업데이트 실패:', statsError);
    }

    return NextResponse.json({
      success: true,
      videoId: docId,
      isDuplicate: false
    });
  } catch (error) {
    console.error('영상 저장 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// GET: 사용자 영상 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const mode = searchParams.get('mode') as VideoMode | null;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId가 필요합니다.' },
        { status: 400 }
      );
    }

    const db = getAdminDb();

    // 복합 인덱스 없이 쿼리 (userId만 필터링, 정렬은 JS에서)
    let query: FirebaseFirestore.Query = db.collection('videos').where('userId', '==', userId);

    if (mode) {
      query = query.where('mode', '==', mode);
    }

    const snapshot = await query.get();

    // JS에서 정렬 및 페이지네이션
    let videos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString(),
      updatedAt: doc.data().updatedAt?.toDate()?.toISOString(),
    }));

    // createdAt 기준 내림차순 정렬
    videos.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    const total = videos.length;

    // 페이지네이션 적용
    videos = videos.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      videos,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('영상 목록 조회 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
