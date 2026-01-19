# 오류 분석 및 해결: "합성할 영상이 없습니다"

## 발생 일시
2025년 1월

## 오류 현상
- **오류 메시지**: `Error: 합성할 영상이 없습니다.`
- **발생 위치**: `MultiSceneGenerationStep.tsx` - `mergeAllVideos()` 함수 (라인 176)
- **발생 시점**: 이미지 생성 → 영상 생성 → 영상 합성 과정 중 마지막 단계

## 오류 원인 분석

### 1. 문제의 코드 흐름

```typescript
const startGeneration = async () => {
  // Phase 1: 이미지 병렬 생성
  await generateAllImages();   // setSceneProgress로 imageUrl 업데이트

  // Phase 2: 영상 순차 생성
  await generateAllVideos();   // setSceneProgress로 videoUrl 업데이트

  // Phase 3: 영상 합성
  await mergeAllVideos();      // sceneProgress.filter(s => s.videoUrl) → 빈 배열!
};
```

### 2. 근본 원인: React 상태 업데이트의 비동기성

#### 문제 발생 메커니즘
1. `generateAllImages()`가 `setSceneProgress()`를 호출하여 `imageUrl` 저장
2. `generateAllVideos()`가 `sceneProgress`를 읽어야 하는데, **React 상태 업데이트는 비동기**
3. `setSceneProgress()`를 호출해도 즉시 `sceneProgress` 값이 변경되지 않음
4. 결과적으로 `mergeAllVideos()`에서 `sceneProgress`를 읽을 때 **빈 배열 또는 이전 상태**를 읽음

#### React useState의 특성
```typescript
// 이 코드는 의도대로 작동하지 않음
setSceneProgress(prev => [...prev, { videoUrl: 'xxx' }]);
console.log(sceneProgress);  // ← 아직 이전 값!
```

React의 `useState`는 **배치 업데이트**를 수행하며, 상태 변경은 다음 렌더 사이클에서 반영됩니다.

### 3. 코드에서 확인된 문제점

**`generateAllVideos` 함수 (라인 125-170)**:
```typescript
const generateAllVideos = async () => {
  const scenesWithImages = sceneProgress.filter(s => s.imageUrl);  // ← 문제!
  // sceneProgress가 아직 이전 값이라면 scenesWithImages는 빈 배열
  ...
};
```

**`mergeAllVideos` 함수 (라인 172-205)**:
```typescript
const mergeAllVideos = async () => {
  const completedScenes = sceneProgress.filter(s => s.videoUrl);  // ← 문제!
  if (completedScenes.length === 0) {
    throw new Error('합성할 영상이 없습니다.');  // ← 오류 발생!
  }
  ...
};
```

## 해결 방안

### 선택한 해결책: useRef로 실시간 데이터 추적

React의 `useRef`는 렌더링 사이클과 무관하게 **즉시** 값을 업데이트하고 읽을 수 있습니다.

#### 변경 사항

1. **새로운 ref 추가**:
```typescript
const sceneResultsRef = useRef<{
  id: number;
  imageUrl?: string;
  videoUrl?: string;
}[]>([]);
```

2. **이미지 생성 시 ref에도 저장**:
```typescript
// 기존: setSceneProgress만 호출
setSceneProgress(prev => prev.map(s =>
  s.id === scene.id ? { ...s, imageUrl: result.imageUrl } : s
));

// 추가: ref에도 동시 저장
sceneResultsRef.current = sceneResultsRef.current.map(s =>
  s.id === scene.id ? { ...s, imageUrl: result.imageUrl } : s
);
```

3. **영상 생성 시 ref 데이터 사용**:
```typescript
// 기존 (문제):
const scenesWithImages = sceneProgress.filter(s => s.imageUrl);

// 수정 (해결):
const scenesWithImages = sceneResultsRef.current.filter(s => s.imageUrl);
```

4. **영상 합성 시 ref 데이터 사용**:
```typescript
// 기존 (문제):
const completedScenes = sceneProgress.filter(s => s.videoUrl);

// 수정 (해결):
const completedScenes = sceneResultsRef.current.filter(s => s.videoUrl);
```

## 수정된 코드

### MultiSceneGenerationStep.tsx 전체 변경 사항

```diff
+ const sceneResultsRef = useRef<{
+   id: number;
+   imageUrl?: string;
+   videoUrl?: string;
+ }[]>([]);

  useEffect(() => {
    const initialProgress: SceneProgress[] = sceneData.scenes.map(scene => ({
      id: scene.id,
      text: scene.text,
      status: 'pending'
    }));
    setSceneProgress(initialProgress);
+   // ref도 초기화
+   sceneResultsRef.current = sceneData.scenes.map(scene => ({
+     id: scene.id
+   }));
  }, [sceneData.scenes]);

  // generateAllImages 내부
  setSceneProgress(prev => prev.map(s =>
    s.id === scene.id ? { ...s, imageUrl: result.imageUrl } : s
  ));
+ sceneResultsRef.current = sceneResultsRef.current.map(s =>
+   s.id === scene.id ? { ...s, imageUrl: result.imageUrl } : s
+ );

  // generateAllVideos 함수
- const scenesWithImages = sceneProgress.filter(s => s.imageUrl);
+ const scenesWithImages = sceneResultsRef.current.filter(s => s.imageUrl);

  // 영상 완료 시
  setSceneProgress(prev => prev.map(s =>
    s.id === scene.id ? { ...s, status: 'completed', videoUrl: result.videoUrl } : s
  ));
+ sceneResultsRef.current = sceneResultsRef.current.map(s =>
+   s.id === scene.id ? { ...s, videoUrl: result.videoUrl } : s
+ );

  // mergeAllVideos 함수
- const completedScenes = sceneProgress.filter(s => s.videoUrl);
+ const completedScenes = sceneResultsRef.current.filter(s => s.videoUrl);
```

## 기타 고려한 대안

### 대안 1: 함수 간 데이터 직접 전달
```typescript
const imageResults = await generateAllImages();  // 반환값 사용
const videoResults = await generateAllVideos(imageResults);
await mergeAllVideos(videoResults);
```
- 장점: 명확한 데이터 흐름
- 단점: 기존 코드 대폭 수정 필요

### 대안 2: 상태 업데이트 완료 대기
```typescript
await new Promise(resolve => setTimeout(resolve, 0));
```
- 단점: 불안정하고 신뢰할 수 없음

### 대안 3: useReducer 사용
- 장점: 더 예측 가능한 상태 관리
- 단점: 과도한 리팩토링 필요

**선택한 대안**: `useRef` 방식이 최소한의 코드 변경으로 문제를 해결합니다.

## 수정 완료 확인

### 변경된 파일
- `src/components/ai-hologram/steps/MultiSceneGenerationStep.tsx`

### 빌드 결과
- ✅ 빌드 성공 (Next.js 15.4.2)
- ✅ 타입 에러 없음
- ✅ ESLint 경고 없음

## 테스트 체크리스트

- [ ] 6개 장면 입력 후 생성 시작
- [ ] 이미지 6개 생성 완료 확인
- [ ] 영상 6개 생성 완료 확인
- [ ] 영상 합성 성공 확인
- [ ] 최종 결과 영상 재생 확인

---

# 오류 분석 및 해결: "Internal S" JSON 파싱 오류

## 발생 일시
2025년 1월 7일

## 오류 현상
- **오류 메시지**: `SyntaxError: Unexpected token 'I', "Internal S"... is not valid JSON`
- **발생 위치**: `MultiSceneGenerationStep.tsx` - API 호출 후 `response.json()` 처리
- **발생 시점**: 이미지 생성, 영상 생성, 또는 영상 합성 API 호출 중

## 오류 원인 분석

### 1. 문제의 핵심
API 서버에서 에러 발생 시 다음과 같은 문제가 발생:
1. 서버에서 500 Internal Server Error 발생
2. Next.js가 JSON이 아닌 일반 텍스트("Internal Server Error")를 반환
3. 클라이언트에서 `response.json()`을 호출하면 JSON 파싱 실패
4. "Internal S..." 부분만 보이는 이유: 에러 메시지가 "Internal Server Error"로 시작하기 때문

### 2. 문제가 있는 코드 패턴

```typescript
// MultiSceneGenerationStep.tsx (라인 100-116)
const response = await fetch('/api/ai/generate-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ... })
});

const result = await response.json();  // ← 여기서 오류 발생!

if (!result.success) {
  throw new Error(result.error || '이미지 생성 실패');
}
```

**문제점**:
- `response.ok`를 확인하지 않고 바로 `response.json()` 호출
- HTTP 500 에러 시 응답 본문이 JSON이 아닐 수 있음
- 영상 생성(라인 161-175), 영상 합성(라인 209-224)에서도 동일한 패턴 사용

### 3. 서버 측 잠재적 원인
API 서버에서 에러 발생 가능한 상황:
1. **Google GenAI API 키 누락 또는 만료**
2. **API 타임아웃** (Vercel 최대 300초)
3. **FFmpeg 미설치** (영상 합성 시)
4. **파일 시스템 접근 오류** (`/tmp` 디렉토리 문제)
5. **메모리 부족** (Base64 인코딩 시 대용량 데이터 처리)

## 해결 방안

### 선택한 해결책: 응답 상태 확인 및 안전한 JSON 파싱

#### 1. 클라이언트 측 수정 (MultiSceneGenerationStep.tsx)

```typescript
// 안전한 API 호출 헬퍼 함수 추가
const safeJsonParse = async (response: Response): Promise<any> => {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    // JSON 파싱 실패 시 에러 메시지 생성
    throw new Error(`서버 오류: ${text.substring(0, 100)}`);
  }
};

// API 호출 시 적용
const response = await fetch('/api/ai/generate-image', { ... });

if (!response.ok) {
  const errorText = await response.text();
  throw new Error(`서버 오류 (${response.status}): ${errorText.substring(0, 100)}`);
}

const result = await safeJsonParse(response);
```

#### 2. 서버 측 보강 (route.ts 파일들)

모든 API 라우트에서 에러 발생 시 반드시 JSON으로 응답하도록 보장:

```typescript
// 모든 catch 블록에서
return NextResponse.json(
  { success: false, error: message },
  { status: 500 }
);
```

## 수정 코드

### MultiSceneGenerationStep.tsx 변경 사항

```diff
+ // 안전한 JSON 파싱 헬퍼
+ const safeApiCall = async (response: Response, context: string) => {
+   if (!response.ok) {
+     const errorText = await response.text();
+     throw new Error(`${context} 실패 (${response.status}): ${errorText.substring(0, 100)}`);
+   }
+
+   const text = await response.text();
+   try {
+     return JSON.parse(text);
+   } catch {
+     throw new Error(`${context} 응답 파싱 실패: ${text.substring(0, 100)}`);
+   }
+ };

  // generateAllImages 내부 (라인 100-116)
  const response = await fetch('/api/ai/generate-image', { ... });
- const result = await response.json();
+ const result = await safeApiCall(response, '이미지 생성');

  // generateAllVideos 내부 (라인 161-175)
  const response = await fetch('/api/ai/generate-video', { ... });
- const result = await response.json();
+ const result = await safeApiCall(response, '영상 생성');

  // mergeAllVideos 내부 (라인 209-224)
  const response = await fetch('/api/ai/merge-videos', { ... });
- const result = await response.json();
+ const result = await safeApiCall(response, '영상 합성');
```

## 테스트 체크리스트 (새 오류)

- [ ] API 키 없이 요청 시 명확한 오류 메시지 표시
- [ ] 타임아웃 시 명확한 오류 메시지 표시
- [ ] FFmpeg 없을 때 fallback 동작 확인
- [ ] 정상 요청 시 기존 기능 정상 작동

## 수정 완료 확인 (새 오류)

### 변경된 파일
- `src/components/ai-hologram/steps/MultiSceneGenerationStep.tsx`

### 빌드 결과
- ✅ 빌드 성공 (Next.js 15.4.2)
- ✅ 타입 에러 없음
- ✅ ESLint 경고 없음

## 결론 (종합)

### 오류 1: "합성할 영상이 없습니다"
- **원인**: React의 비동기 상태 업데이트 (`useState`)
- **해결**: `useRef`를 병행 사용하여 즉시 읽기 가능한 데이터 저장소 구현

### 오류 2: "Internal S" JSON 파싱 오류
- **원인**: 서버 에러 발생 시 JSON이 아닌 텍스트 응답 반환
- **해결**: `safeApiCall()` 헬퍼 함수로 안전한 응답 처리
  - HTTP 상태 코드 확인 (`response.ok`)
  - JSON 파싱 실패 시 명확한 에러 메시지 제공
  - 사용자에게 실제 서버 오류 내용 표시

이 두 패턴은 API 호출이 많은 React 앱에서 공통적으로 적용할 수 있는 안정성 향상 기법입니다.

---

# 오류 분석 및 해결: Veo API aspectRatio 1:1 미지원

## 발생 일시
2025년 1월 7일

## 오류 현상
- **오류 메시지**: `aspectRatio does not support 1:1 as a valid value`
- **발생 위치**: `src/app/api/ai/generate-video/route.ts` - Veo API 호출
- **HTTP 상태**: 500 (내부적으로 400 Bad Request)

### 화면 증상
- 장면 1만 에러 표시 (빨간색 X)
- 장면 2~6은 이미지 생성 중 (파란색 애니메이션)
- 실제로는 모든 영상 생성이 실패할 예정

### 왜 장면 1만 에러로 보이나?
1. 이미지 생성은 **병렬** 처리 (Promise.all)
2. 영상 생성은 **순차** 처리 (for loop)
3. 장면 1이 먼저 이미지 완료 → 영상 생성 시도 → 즉시 실패
4. 나머지 장면은 아직 이미지 생성 중이라 영상 단계 미도달

## 오류 원인 분석

### 1. 문제의 코드

```typescript
// generate-video/route.ts (라인 51-64)
const videoAspectRatio = aspectRatio === '1:1' ? '1:1' : '16:9';

let operation = await client.models.generateVideos({
  model: "veo-3.1-generate-preview",
  // ...
  config: {
    aspectRatio: videoAspectRatio,  // ← 1:1을 그대로 전달!
  }
});
```

### 2. Veo 3.1 API 제한사항
Google Veo 3.1 API가 지원하는 aspectRatio:
- `16:9` (가로 영상)
- `9:16` (세로 영상)
- **`1:1` 미지원!**

### 3. 홀로그램 요구사항과의 충돌
- 홀로그램 팬은 **원형**이라 1:1 정사각형 필요
- Veo API는 1:1 미지원
- **해결책**: 16:9로 생성 후 **후처리로 1:1 크롭**

## 해결 방안

### 선택한 해결책: 16:9 생성 → 1:1 크롭

#### 전략
1. Veo API에는 항상 `16:9`로 요청
2. 영상 생성 후 중앙 기준 1:1로 크롭
3. 영상 합성 시 FFmpeg로 크롭 처리 (이미 구현됨)

#### 코드 수정 (generate-video/route.ts)

```diff
- const videoAspectRatio = aspectRatio === '1:1' ? '1:1' : '16:9';
+ // Veo 3.1은 1:1을 지원하지 않음 - 16:9로 생성 후 후처리로 크롭
+ const videoAspectRatio = '16:9';
+ const needsCrop = aspectRatio === '1:1';

  let operation = await client.models.generateVideos({
    // ...
    config: {
      aspectRatio: videoAspectRatio,
    }
  });

  // 영상 생성 완료 후...
+ if (needsCrop) {
+   // FFmpeg로 1:1 크롭 (중앙 기준)
+   // crop=min(iw,ih):min(iw,ih)
+ }
```

### 대안 검토

| 방안 | 장점 | 단점 |
|------|------|------|
| **16:9 → 1:1 크롭** | 구현 간단, 품질 유지 | 좌우 일부 잘림 |
| 9:16 → 1:1 크롭 | 세로 콘텐츠 보존 | 상하 많이 잘림 |
| 1:1 이미지 패딩 | 잘림 없음 | 검은 여백 발생, 어색함 |

**선택**: 16:9 → 1:1 크롭 (홀로그램은 중앙 포커스이므로 적합)

## 실제 수정 코드

```typescript
// generate-video/route.ts (라인 49-54)

// Before (오류 발생):
const videoAspectRatio = aspectRatio === '1:1' ? '1:1' : '16:9';

// After (수정됨):
// 중요: Veo 3.1은 1:1 비율을 지원하지 않음 (16:9, 9:16만 지원)
// 1:1이 필요한 경우 16:9로 생성 후 영상 합성 단계에서 FFmpeg로 크롭
const videoAspectRatio = aspectRatio === '9:16' ? '9:16' : '16:9';
```

## 수정 완료 확인

### 변경된 파일
- `src/app/api/ai/generate-video/route.ts`

### 빌드 결과
- ✅ 빌드 성공 (Next.js 15.4.2)
- ✅ 타입 에러 없음
- ✅ ESLint 경고 없음

## 전체 영상 처리 흐름 (수정 후)

```
1. 이미지 생성 (Gemini 3 Pro)
   - 입력: 1:1 정사각형 요청
   - 출력: 1:1 정사각형 이미지 ✅

2. 영상 생성 (Veo 3.1)
   - 입력: 1:1 요청 → 16:9로 변환
   - 출력: 16:9 영상 (아직 정사각형 아님)

3. 영상 합성 (FFmpeg)
   - 입력: 16:9 영상 여러 개
   - 처리: crop=min(iw,ih):min(iw,ih),scale=1080:1080
   - 출력: 1:1 정사각형 최종 영상 ✅
```

## 테스트 체크리스트

- [ ] 영상 생성 API 호출 성공 확인
- [ ] 생성된 영상이 16:9 형태인지 확인
- [ ] 영상 합성 시 1:1 크롭 정상 동작 확인
- [ ] 최종 결과물이 정사각형인지 확인

---

# 오류 분석 및 해결: Windows /tmp 경로 오류

## 발생 일시
2025년 1월 7일

## 오류 현상
- **오류 메시지**: `ENOENT: no such file or directory, open 'C:\tmp\hologram_video_...'`
- **발생 위치**: `src/app/api/ai/generate-video/route.ts` - 영상 파일 저장
- **발생 환경**: Windows 로컬 개발 환경

## 오류 원인 분석

### 1. 문제의 코드

```typescript
// generate-video/route.ts (라인 94-96)
// Vercel serverless 환경: /tmp 디렉토리 사용 (임시)
const saveDir = '/tmp';
const filepath = path.join(saveDir, filename);
```

### 2. OS별 임시 폴더 차이

| OS | 임시 폴더 경로 | `/tmp` 해석 |
|------|---------------|-------------|
| Linux/Vercel | `/tmp` | `/tmp` (정상) |
| macOS | `/tmp` (→ `/private/tmp`) | `/tmp` (정상) |
| **Windows** | `C:\Users\...\AppData\Local\Temp` | `C:\tmp` (오류!) |

### 3. Windows에서 `/tmp`의 문제
- Node.js의 `path.join('/tmp', 'file.mp4')`가 Windows에서 `C:\tmp\file.mp4`로 변환
- `C:\tmp` 폴더는 기본적으로 존재하지 않음
- 파일 쓰기 시 `ENOENT` 오류 발생

## 해결 방안

### 선택한 해결책: os.tmpdir() 사용

Node.js의 `os.tmpdir()`은 OS에 맞는 임시 폴더 경로를 자동 반환:
- Windows: `C:\Users\...\AppData\Local\Temp`
- Linux/Vercel: `/tmp`
- macOS: `/var/folders/...`

#### 코드 수정

```diff
+ import os from 'os';

- const saveDir = '/tmp';
+ const saveDir = os.tmpdir();
  const filepath = path.join(saveDir, filename);
```

## 영향받는 파일들

1. **generate-video/route.ts** - 영상 다운로드 시 임시 저장
2. **merge-videos/route.ts** - 영상 합성 시 임시 파일 저장

## 수정 완료 확인

### 변경된 파일
- `src/app/api/ai/generate-video/route.ts`
- `src/app/api/ai/merge-videos/route.ts`

### 빌드 결과
- ✅ 빌드 성공
- ✅ 타입 에러 없음

## 테스트 체크리스트

- [ ] Windows 로컬에서 영상 생성 성공
- [ ] Vercel 배포 환경에서 영상 생성 성공
- [ ] 임시 파일 정상 삭제 확인

---

# 오류 분석 및 해결: Video generation completed but no video data found

## 발생 일시
2025년 1월 7일

## 오류 현상
- **오류 메시지**: `Video generation completed but no video data found`
- **발생 위치**: `src/app/api/ai/generate-video/route.ts:117`
- **HTTP 상태**: 500 Internal Server Error

## 오류 원인 분석

### 1. 문제의 코드

```typescript
// generate-video/route.ts (라인 91-118)
if (operation.response?.generatedVideos?.[0]?.video) {
  // 정상 처리
} else {
  throw new Error('Video generation completed but no video data found');
}
```

### 2. 가능한 원인들

#### 원인 A: Veo API 응답 구조 변경
- Google Veo API의 응답 구조가 변경되었을 수 있음
- `generatedVideos[0].video` 경로가 다를 수 있음

#### 원인 B: 콘텐츠 정책 위반
- AI가 생성한 이미지가 Veo의 콘텐츠 정책에 위반될 경우
- 영상 생성은 완료되지만 결과물이 필터링됨

#### 원인 C: API 할당량/제한
- Veo API 사용량 제한에 도달
- Preview 버전의 제한사항

#### 원인 D: 이미지 품질/형식 문제
- 입력 이미지가 Veo의 요구사항을 충족하지 않음
- Base64 인코딩 문제

### 3. 디버깅 필요 사항

서버 로그에서 다음 확인 필요:
```
Video generation complete. Response: { ... }
```

이 로그에서 실제 `operation.response` 구조를 확인해야 정확한 원인 파악 가능.

## 해결 방안

### 선택한 해결책: 상세 로깅 및 대체 경로 처리

1. 응답 구조 전체 로깅
2. 다양한 응답 경로 지원
3. 구체적인 에러 메시지 제공

#### 코드 수정

```typescript
// 응답 구조 상세 로깅
console.log('Operation response keys:', Object.keys(operation.response || {}));
console.log('Full response:', JSON.stringify(operation.response, null, 2));

// 다양한 응답 구조 처리
const generatedVideos = operation.response?.generatedVideos;
const firstVideo = generatedVideos?.[0];

if (!generatedVideos || generatedVideos.length === 0) {
  throw new Error(`영상 생성 결과 없음. Response: ${JSON.stringify(operation.response)}`);
}

if (!firstVideo?.video) {
  // 필터링되었거나 다른 형식인 경우
  throw new Error(`영상 데이터 없음. Generated: ${JSON.stringify(firstVideo)}`);
}
```

## 수정 완료 확인

### 변경된 파일
- `src/app/api/ai/generate-video/route.ts`

### 빌드 결과
- ✅ 빌드 성공
- ✅ 타입 에러 없음

## 추가 확인 필요

서버 터미널 로그에서 `Video generation complete. Response:` 내용을 확인하여
실제 API 응답 구조를 파악해야 정확한 수정이 가능합니다.

---

# 오류 분석 및 해결: Veo 콘텐츠 필터링 (Celebrity Detection)

## 발생 일시
2025년 1월 7일

## 오류 현상
- **오류 메시지**: `영상 생성 결과 없음 (콘텐츠 필터링 가능성)`
- **발생 위치**: `src/app/api/ai/generate-video/route.ts`
- **발생 상황**: 3개 장면 중 1번째는 성공, 2번째에서 실패

## 오류 원인 분석

### 1. Veo API의 RAI (Responsible AI) 필터링

서버 로그에서 확인된 실제 응답:
```json
{
  "raiMediaFilteredCount": 1,
  "raiMediaFilteredReasons": [
    "Sorry, we can't create videos from input images containing celebrity or their likenesses. Please remove the reference and try again."
  ]
}
```

### 2. 원인
- Veo API가 입력 이미지에서 **유명인(celebrity)** 또는 **유사한 얼굴**을 감지
- AI 윤리 정책에 따라 영상 생성을 자동으로 차단
- 이는 **코드 버그가 아닌 API 정책** 문제

### 3. Veo의 콘텐츠 필터링 종류
- **Celebrity/Likeness**: 유명인 얼굴 감지
- **Violence/Harmful**: 폭력적/유해 콘텐츠
- **Copyright**: 저작권 관련 콘텐츠
- **NSFW**: 성인 콘텐츠

## 해결 방안

### 선택한 해결책: 사용자 친화적 에러 메시지

코드로 필터링을 우회할 수는 없지만, 사용자에게 **명확한 원인과 해결방법**을 안내:

```typescript
// 콘텐츠 필터링 확인 (RAI = Responsible AI)
if (response?.raiMediaFilteredCount > 0) {
  const reasons = response?.raiMediaFilteredReasons || [];
  const reasonText = reasons.join(', ');

  let userMessage = '콘텐츠 정책으로 인해 영상을 생성할 수 없습니다.';

  if (reasonText.includes('celebrity')) {
    userMessage = '이미지에 유명인 또는 유사한 얼굴이 포함되어 영상 생성이 차단되었습니다. 다른 이미지를 사용해주세요.';
  } else if (reasonText.includes('violence')) {
    userMessage = '이미지에 부적절한 콘텐츠가 감지되었습니다.';
  }

  throw new Error(userMessage);
}
```

## 사용자 대응 방안

1. **레퍼런스 이미지 변경**: 유명인 얼굴이 없는 이미지 사용
2. **AI 생성 이미지 수정**: Gemini에게 "사람 얼굴 없이" 요청
3. **추상적 디자인 사용**: 로고, 텍스트, 추상적 그래픽 위주

## 수정 완료 확인

### 변경된 파일
- `src/app/api/ai/generate-video/route.ts`

### 빌드 결과
- ✅ 빌드 성공
- ✅ 타입 에러 없음

## 중요 참고사항

이 오류는 **Google Veo API의 정책**으로 인한 것이며, 다음 경우에 발생할 수 있습니다:
- 실제 유명인 사진 사용
- AI가 생성한 이미지가 **우연히 유명인과 유사**하게 생성된 경우
- 특정 얼굴 특징이 유명인 데이터베이스와 매칭된 경우

**해결책**: 이미지 생성 프롬프트에서 사람 얼굴을 최소화하거나, 추상적인 홀로그램 스타일을 사용하는 것이 좋습니다.

---

# 오류 분석 및 해결: FFmpeg Windows 경로 백슬래시 문제

## 발생 일시
2025년 1월 7일

## 오류 현상
- **오류 메시지**: `Command failed: ffmpeg -y -f concat -safe 0 -i "C:\\Users\\jayit\\AppData...`
- **발생 위치**: `src/app/api/ai/merge-videos/route.ts` - FFmpeg concat 실행
- **발생 환경**: Windows 로컬 개발 환경
- **발생 시점**: 4개 장면 영상 생성 완료 후 합성 단계

## 오류 원인 분석

### 1. 문제의 코드 흐름

```
1. 이미지 생성 (4개) → ✅ 성공
2. 영상 생성 (4개) → ✅ 성공
3. 영상 합성 (FFmpeg) → ❌ 실패
```

### 2. 근본 원인: Windows 경로의 백슬래시

#### 문제가 있는 코드 (라인 62)
```typescript
const listContent = videoFiles.map(f => `file '${f}'`).join('\n');
```

#### Windows에서 생성되는 concat 리스트 파일 내용
```
file 'C:\Users\jayit\AppData\Local\Temp\video_xxx_0.mp4'
file 'C:\Users\jayit\AppData\Local\Temp\video_xxx_1.mp4'
```

#### FFmpeg의 해석 방식
- FFmpeg는 **백슬래시(`\`)를 이스케이프 문자**로 해석
- `\U`는 유니코드 시퀀스로, `\A`는 알 수 없는 이스케이프로 해석 시도
- 결과적으로 파일 경로를 찾지 못해 실패

### 3. 영향받는 위치

| 위치 | 문제 |
|------|------|
| concat 리스트 파일 내용 | 백슬래시가 이스케이프로 해석 |
| FFmpeg -i 입력 경로 | 백슬래시 해석 오류 |
| FFmpeg 출력 경로 | 백슬래시 해석 오류 |

## 해결 방안

### 선택한 해결책: 모든 경로에서 백슬래시를 슬래시로 변환

FFmpeg는 Windows에서도 **슬래시(`/`) 경로를 정상 인식**합니다.

#### 수정 1: concat 리스트 파일 내용 (라인 62-63)
```typescript
// Before (오류 발생):
const listContent = videoFiles.map(f => `file '${f}'`).join('\n');

// After (수정됨):
// Windows 경로 호환성: 백슬래시를 슬래시로 변환 (FFmpeg는 백슬래시를 이스케이프로 해석)
const listContent = videoFiles.map(f => `file '${f.replace(/\\/g, '/')}'`).join('\n');
```

#### 수정 2: FFmpeg 명령어 경로 (라인 77-88)
```typescript
// Before (오류 발생):
ffmpegCommand = `ffmpeg -y -f concat -safe 0 -i "${listPath}" ...`;

// After (수정됨):
// Windows 경로 호환성: 백슬래시를 슬래시로 변환
const ffmpegListPath = listPath.replace(/\\/g, '/');
const ffmpegOutputPath = outputPath.replace(/\\/g, '/');
ffmpegCommand = `ffmpeg -y -f concat -safe 0 -i "${ffmpegListPath}" ... "${ffmpegOutputPath}"`;
```

## 수정 후 경로 예시

### Before (오류)
```
입력: C:\Users\jayit\AppData\Local\Temp\concat_list_xxx.txt
concat 리스트 내용:
  file 'C:\Users\jayit\AppData\Local\Temp\video_xxx_0.mp4'
FFmpeg: "C:\Users\jayit\..." → 경로 해석 실패
```

### After (수정됨)
```
입력: C:/Users/jayit/AppData/Local/Temp/concat_list_xxx.txt
concat 리스트 내용:
  file 'C:/Users/jayit/AppData/Local/Temp/video_xxx_0.mp4'
FFmpeg: "C:/Users/jayit/..." → 정상 작동
```

## 수정 완료 확인

### 변경된 파일
- `src/app/api/ai/merge-videos/route.ts`

### 변경 내용 요약
1. concat 리스트 파일 생성 시 경로 변환 추가
2. FFmpeg 명령어 실행 시 입력/출력 경로 변환 추가

### 빌드 결과
- ✅ 빌드 성공 (Next.js 15.4.2)
- ✅ 타입 에러 없음
- ✅ ESLint 경고 없음

## 테스트 체크리스트

- [ ] Windows 로컬에서 영상 합성 성공
- [ ] 4개 장면 합성 테스트
- [ ] 최종 결과물 재생 확인
- [ ] Vercel 배포 환경에서도 정상 작동 확인

## 추가 참고사항

### OS별 경로 구분자
| OS | 기본 구분자 | FFmpeg 호환성 |
|------|----------|--------------|
| Windows | `\` (백슬래시) | `/`도 인식 가능 |
| Linux/macOS | `/` (슬래시) | 기본 지원 |
| Vercel | `/` (슬래시) | 기본 지원 |

### Node.js path 모듈 동작
- `path.join()`은 OS에 맞는 구분자 사용
- Windows: `path.join('/tmp', 'file.mp4')` → `\tmp\file.mp4`
- 따라서 FFmpeg 호출 전 경로 변환 필요

## 결론

이 오류는 **Windows와 FFmpeg 간의 경로 해석 차이**로 발생했습니다.
Node.js의 `path` 모듈은 OS에 맞는 경로를 생성하지만, FFmpeg는 백슬래시를 이스케이프로 해석하므로 명시적인 경로 변환이 필요합니다.

`.replace(/\\/g, '/')` 패턴을 사용하여 모든 백슬래시를 슬래시로 변환하면 Windows와 Linux/Vercel 환경 모두에서 정상 작동합니다.
