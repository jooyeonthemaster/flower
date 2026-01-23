// 테스트 모드: true면 1개만 생성 (API 비용 절약)
export const TEST_MODE = false;

// 카테고리/스타일 한글 매핑
export const categoryLabels: Record<string, string> = {
  opening: '개업 축하',
  wedding: '결혼식',
  birthday: '생일',
  memorial: '추모',
  event: '행사/전시',
  promotion: '승진/영전',
};

export const styleLabels: Record<string, string> = {
  elegant: '우아한',
  luxury: '럭셔리',
  neon: '네온',
  traditional: '전통',
  fantasy: '판타지',
  space: '스페이스',
  fancy: '화려하게',
  simple: '심플하게',
};
