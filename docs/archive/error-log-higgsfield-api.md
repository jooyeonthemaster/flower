# Higgsfield API 마이그레이션 오류 로그

> 이 문서는 Google Veo에서 Higgsfield API로 마이그레이션하는 과정에서 발생한 오류들을 기록합니다.
> **작성일**: 2025-01-10
> **상태**: ✅ 모든 오류 해결 완료

---

## 오류 #5: Google Veo API 할당량 초과 (429)

### 발생일시
2025-01-10

### 오류 메시지
```
Error: 영상 생성 실패 (500): {"success":false,"error":"{\"error\":{\"code\":429,\"message\":\"You exceeded your current quota...
```

### 원인 분석
1. **Google GenAI API 할당량 초과**: Veo 3.1 API의 무료 티어 일일 한도 초과
2. **MultiSceneGenerationStep에서 구 API 사용**: 멀티 씬 모드가 여전히 `/api/ai/generate-video` (Google Veo) 호출 중

### 해결 방법
**파일**: `src/components/ai-hologram/steps/MultiSceneGenerationStep.tsx:129-177`

```typescript
// 변경 전:
const response = await fetch('/api/ai/generate-video', { // Google Veo
  method: 'POST',
  body: JSON.stringify({
    sourceImageUrl: imageUrl,
    prompt: '...',
    aspectRatio: '1:1'
  })
});

// 변경 후:
// 1단계: Data URL을 Firebase에 업로드 (Higgsfield는 외부 URL 필요)
if (imageUrl.startsWith('data:')) {
  const uploadResponse = await fetch('/api/upload-image', {...});
  externalImageUrl = uploadResult.url;
}

// 2단계: Higgsfield API 호출
const response = await fetch('/api/ai/generate-video-higgsfield', {
  method: 'POST',
  body: JSON.stringify({
    sourceImageUrl: externalImageUrl,
    prompt: '...',
    duration: 5
  })
});
```

### 결과
- ✅ Google Veo API 의존성 제거
- ✅ 단일 영상 모드와 멀티 씬 모드 모두 Higgsfield 사용
- ⚠️ 다음 오류로 이어짐 → 오류 #6

---

## 오류 #6: Higgsfield API 인증 실패 (403)

### 발생일시
2025-01-10

### 오류 메시지
```
Error: 영상 생성 실패 (500): {"success":false,"error":"Higgsfield API 요청 실패: 403"}
```

### 원인 분석
1. **잘못된 API 엔드포인트**: `https://platform.higgsfield.ai/higgsfield-ai/dop/standard`는 웹 플랫폼 경로
2. **잘못된 인증 헤더 형식**: `Authorization: Key ${apiKey}:${apiSecret}` 형식이 아닌 다른 방식 사용

### 해결 방법
**파일**: `src/app/api/ai/generate-video-higgsfield/route.ts`

```typescript
// 1. API 엔드포인트 수정 (Line 6-8)
const HIGGSFIELD_API_BASE = 'https://api.higgsfield.ai/v1';
const GENERATE_ENDPOINT = '/generate/image-to-video';

// 2. 인증 헤더 수정 (Line 89-94)
headers: {
  'X-API-Key': apiKey,
  'X-API-Secret': apiSecret,
  'Content-Type': 'application/json',
}

// 3. 에러 로깅 강화 (Line 102-106)
if (!generateResponse.ok) {
  const errorText = await generateResponse.text();
  console.error('Higgsfield API error:', {
    status: generateResponse.status,
    statusText: generateResponse.statusText,
    headers: Object.fromEntries(generateResponse.headers.entries()),
    body: errorText
  });
  throw new Error(`Higgsfield API 요청 실패 (${generateResponse.status}): ${errorText.substring(0, 200)}`);
}
```

### 결과
- **403 → 522 Connection Timed Out** 에러로 변경
- `api.higgsfield.ai` 서버가 응답하지 않음
- ⚠️ 다음 오류로 이어짐 → 오류 #7

---

## 오류 #7: Higgsfield API 서버 응답 없음 (522)

### 발생일시
2025-01-10

### 오류 메시지
```
Higgsfield API error: {
  status: 522,
  statusText: '',
  body: '<!DOCTYPE html>\n...\n<title>api.higgsfield.ai | 522: Connection timed out</title>'
}
```

### 원인 분석

#### 조사 과정
여러 엔드포인트를 시도했지만 모두 실패:

| 시도 | 베이스 URL | 인증 방식 | 결과 |
|------|-----------|----------|------|
| #1 | `api.higgsfield.ai/v1` | `X-API-Key` + `X-API-Secret` | 522 (도메인 미존재) |
| #2 | `cloud.higgsfield.ai/api` | `Bearer ${apiKey}` | 404 (엔드포인트 없음) |
| #3 | `platform.higgsfield.ai/api/generate` | `Bearer ${apiKey}` | 404 (경로 잘못됨) |

#### 공식 문서 확인 후 해결
- **출처**: https://docs.higgsfield.ai/llms.txt
- **베이스 URL**: `https://platform.higgsfield.ai`
- **인증 방식**: `Authorization: Key {api_key}:{api_secret}`
- **엔드포인트**: `/{model_id}` (예: `/higgsfield-ai/dop/standard`)

### 최종 해결 코드

**파일**: `src/app/api/ai/generate-video-higgsfield/route.ts`

```typescript
// 정확한 설정
const HIGGSFIELD_API_BASE = 'https://platform.higgsfield.ai';
const MODEL_ID = 'higgsfield-ai/dop/standard';

// 영상 생성 요청
const generateResponse = await fetch(`${HIGGSFIELD_API_BASE}/${MODEL_ID}`, {
  method: 'POST',
  headers: {
    'Authorization': `Key ${apiKey}:${apiSecret}`,  // ✅ 올바른 형식
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    image_url: imageUrl,
    prompt: prompt,
    duration: duration,
  }),
});

// 상태 확인 요청
const statusResponse = await fetch(queuedResult.status_url, {
  headers: {
    'Authorization': `Key ${apiKey}:${apiSecret}`,  // ✅ 올바른 형식
  },
});
```

### 추가 개선: AbortController 타임아웃
```typescript
// AbortController로 명시적 타임아웃 설정 (60초)
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 60000);

try {
  const generateResponse = await fetch(`${HIGGSFIELD_API_BASE}/${MODEL_ID}`, {
    method: 'POST',
    headers: {...},
    body: {...},
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
} catch (fetchError) {
  clearTimeout(timeoutId);
  if (fetchError instanceof Error && fetchError.name === 'AbortError') {
    throw new Error('Higgsfield API 요청 타임아웃 (60초 초과)');
  }
  throw fetchError;
}
```

### API 응답 구조

**요청 제출 (Queued)**:
```json
{
  "status": "queued",
  "request_id": "d7e6c0f3-6699-4f6c-bb45-2ad7fd9158ff",
  "status_url": "https://platform.higgsfield.ai/requests/{request_id}/status",
  "cancel_url": "https://platform.higgsfield.ai/requests/{request_id}/cancel"
}
```

**완료 (Completed)**:
```json
{
  "status": "completed",
  "request_id": "d7e6c0f3-6699-4f6c-bb45-2ad7fd9158ff",
  "video": {
    "url": "https://video.url/example.mp4"
  }
}
```

### 상태 코드

| Status | 설명 |
|--------|------|
| `queued` | 대기 중 (취소 가능) |
| `in_progress` | 생성 중 (취소 불가) |
| `completed` | 완료 (영상 다운로드 가능) |
| `failed` | 실패 (크레딧 환불) |
| `nsfw` | 콘텐츠 정책 위반 (크레딧 환불) |

### 결과
- ✅ 522 에러 해결
- ✅ API 인증 성공
- ✅ 영상 생성 정상 작동

---

## 수정된 파일 요약

| 파일 | 수정 내용 |
|------|-----------|
| `src/components/ai-hologram/steps/MultiSceneGenerationStep.tsx` | Veo → Higgsfield 전환, Firebase 업로드 추가 |
| `src/app/api/ai/generate-video-higgsfield/route.ts` | 엔드포인트, 인증, 에러 로깅, 타임아웃 수정 |

---

## 핵심 교훈

1. **공식 문서 우선**: 추측으로 API 구성하지 말고 공식 문서 먼저 확인
2. **에러 로깅 강화**: 상세한 에러 정보 로깅으로 디버깅 시간 단축
3. **타임아웃 설정**: 무한 대기 방지를 위한 명시적 타임아웃 필수

---

**최종 업데이트**: 2025-01-10
**상태**: ✅ 모든 오류 해결 완료
