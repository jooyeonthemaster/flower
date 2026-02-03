import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * 헬스체크 엔드포인트
 *
 * 모든 필수 환경 변수가 설정되어 있는지 확인합니다.
 * 배포 환경에서 API 키 누락 문제를 빠르게 파악할 수 있습니다.
 *
 * 사용법:
 * curl https://your-domain.vercel.app/api/ai/health
 */
export async function GET() {
  const checks = {
    googleGemini: !!process.env.GOOGLE_GENAI_API_KEY,
    higgsfield: !!(
      process.env.HIGGSFIELD_API_KEY &&
      process.env.HIGGSFIELD_API_SECRET
    ),
    firebaseAdmin: !!(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
      (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL)
    ),
    firebaseClient: !!(
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    ),
  };

  const allOk = Object.values(checks).every(Boolean);

  // 상세 정보 (프로덕션에서는 조심해야 함)
  const details = {
    googleGemini: checks.googleGemini
      ? 'OK'
      : 'GOOGLE_GENAI_API_KEY 누락',
    higgsfield: checks.higgsfield
      ? 'OK'
      : !process.env.HIGGSFIELD_API_KEY
      ? 'HIGGSFIELD_API_KEY 누락'
      : 'HIGGSFIELD_API_SECRET 누락',
    firebaseAdmin: checks.firebaseAdmin
      ? 'OK'
      : 'FIREBASE_SERVICE_ACCOUNT_KEY 또는 개별 변수 누락',
    firebaseClient: checks.firebaseClient
      ? 'OK'
      : 'NEXT_PUBLIC_FIREBASE_* 변수 중 일부 누락',
  };

  return NextResponse.json(
    {
      status: allOk ? 'ok' : 'error',
      message: allOk
        ? '모든 필수 환경 변수가 설정되어 있습니다.'
        : '일부 환경 변수가 누락되었습니다. Vercel Dashboard에서 확인하세요.',
      checks,
      details,
      environment: process.env.VERCEL_ENV || 'local',
      timestamp: new Date().toISOString(),
    },
    {
      status: allOk ? 200 : 500,
    }
  );
}
