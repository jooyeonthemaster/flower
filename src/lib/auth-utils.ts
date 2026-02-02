import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth, isUserAdmin } from './firebase-admin';

/**
 * API 요청에서 Authorization 헤더의 Bearer 토큰을 검증합니다.
 * 관리자 권한이 필요한 경우, 관리자 여부도 함께 확인합니다.
 * 
 * @param request NextRequest 객체
 * @param requireAdmin 관리자 권한 필요 여부 (기본값: true)
 * @returns 성공 시 { success: true, uid: string, email: string }, 실패 시 { success: false, response: NextResponse }
 */
export async function verifyToken(request: NextRequest, requireAdmin = true) {
    try {
        const authHeader = request.headers.get('Authorization');

        // 1. 헤더 존재 확인
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return {
                success: false,
                response: NextResponse.json(
                    { error: '인증 토큰이 필요합니다.' },
                    { status: 401 }
                )
            };
        }

        const token = authHeader.split('Bearer ')[1];
        const auth = getAdminAuth();

        // 2. 토큰 검증
        const decodedToken = await auth.verifyIdToken(token);
        const { uid, email } = decodedToken;

        // 3. 관리자 권한 확인 (필요한 경우)
        if (requireAdmin) {
            const isAdmin = await isUserAdmin(uid); // 기존 firebase-admin의 함수 재사용

            // ADMIN_ EMAILS 환경변수 체크는 isUserAdmin 내부에서 처리되거나, 여기서 추가 확인 가능
            // 여기서는 isUserAdmin이 DB 체크를 하므로, 비상용 환경변수 체크를 추가로 함
            const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
            const isEnvAdmin = email && adminEmails.includes(email);

            if (!isAdmin && !isEnvAdmin) {
                return {
                    success: false,
                    response: NextResponse.json(
                        { error: '관리자 권한이 필요합니다.' },
                        { status: 403 }
                    )
                };
            }
        }

        return { success: true, uid, email };

    } catch (error) {
        console.error('토큰 검증 실패:', error);
        return {
            success: false,
            response: NextResponse.json(
                { error: '유효하지 않은 토큰입니다.' },
                { status: 401 }
            )
        };
    }
}
