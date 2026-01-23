// Higgsfield API 관련 에러 메시지 변환
export function transformErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'Internal Server Error';
  }

  const message = error.message;

  if (message.includes('quota') || message.includes('Quota') || message.includes('rate limit')) {
    return 'API 할당량 초과. 잠시 후 다시 시도해주세요.';
  }

  if (message.includes('Invalid') || message.includes('unauthorized') || message.includes('401')) {
    return 'API 키가 올바르지 않습니다. 관리자에게 문의하세요.';
  }

  if (message.includes('nsfw') || message.includes('콘텐츠 정책')) {
    // 이미 한글 메시지면 그대로
    return message;
  }

  if (message.includes('timeout') || message.includes('타임아웃')) {
    return '이미지 생성 시간이 초과되었습니다. 다시 시도해주세요.';
  }

  return message;
}
