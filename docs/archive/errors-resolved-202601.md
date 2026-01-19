# 디지털화환 프로젝트 - 오류 해결 기록 (아카이브)

> 이 문서는 2026년 1월에 해결된 오류들의 아카이브입니다.
> 현재 진행 중인 오류는 [오류해결.md](../오류해결.md)를 참고하세요.

**아카이브 날짜**: 2026-01-10
**포함 오류**: #1 ~ #13 (총 13건)

---

## React & API 관련 오류

### 오류 #1: 합성할 영상이 없습니다

**발생일**: 2026-01-07
**파일**: `MultiSceneGenerationStep.tsx`
**상태**: ✅ 해결됨

#### 오류 메시지
```
Error: 합성할 영상이 없습니다.
```

#### 원인
React의 `useState`는 비동기로 상태를 업데이트합니다. `setSceneProgress()`를 호출해도 즉시 `sceneProgress` 값이 변경되지 않아, 다음 함수에서 빈 배열을 읽게 됩니다.

```typescript
// 문제 코드
setSceneProgress(prev => [...prev, { videoUrl: 'xxx' }]);
const completedScenes = sceneProgress.filter(s => s.videoUrl);  // ← 아직 이전 값!
```

#### 해결
`useRef`를 병행 사용하여 즉시 읽을 수 있는 데이터 저장소 구현:

```typescript
const sceneResultsRef = useRef<{ id: number; imageUrl?: string; videoUrl?: string; }[]>([]);

// 상태와 ref 동시 업데이트
setSceneProgress(prev => prev.map(s => s.id === scene.id ? { ...s, videoUrl } : s));
sceneResultsRef.current = sceneResultsRef.current.map(s => s.id === scene.id ? { ...s, videoUrl } : s);

// ref에서 읽기
const completedScenes = sceneResultsRef.current.filter(s => s.videoUrl);
```

---

### 오류 #2: "Internal S" JSON 파싱 오류

**발생일**: 2026-01-07
**상태**: ✅ 해결됨

#### 오류 메시지
```
SyntaxError: Unexpected token 'I', "Internal S"... is not valid JSON
```

#### 원인
API 서버에서 500 에러 발생 시 JSON이 아닌 일반 텍스트("Internal Server Error")를 반환하는데, 클라이언트에서 `response.json()`을 호출하여 파싱 실패.

#### 해결
응답 상태 확인 및 안전한 JSON 파싱:

```typescript
const safeApiCall = async (response: Response, context: string) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${context} 실패 (${response.status}): ${errorText.substring(0, 100)}`);
  }

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${context} 응답 파싱 실패: ${text.substring(0, 100)}`);
  }
};
```

---

### 오류 #3: Veo API aspectRatio 1:1 미지원

**발생일**: 2026-01-07
**파일**: `generate-video/route.ts`
**상태**: ✅ 해결됨

#### 오류 메시지
```
aspectRatio does not support 1:1 as a valid value
```

#### 원인
Google Veo 3.1 API는 `16:9`, `9:16`만 지원하며 `1:1`은 미지원.

#### 해결
16:9로 생성 후 영상 합성 시 FFmpeg로 1:1 크롭:

```typescript
// API 호출 시
aspectRatio: '16:9'

// FFmpeg 합성 시
-vf "crop=min(iw\\,ih):min(iw\\,ih),scale=1080:1080"
```

---

## FFmpeg & 영상 처리 오류

### 오류 #4: ffmpeg-static 경로 오류 (\ROOT\)

**발생일**: 2026-01-08
**파일**: `loop-video/route.ts`
**상태**: ✅ 해결됨

#### 오류 메시지
```
C:\ROOT\npm\node_modules\ffmpeg-static\ffmpeg.exe
spawn C:\ROOT\npm\node_modules\ffmpeg-static\ffmpeg.exe ENOENT
```

#### 원인
`ffmpeg-static` 패키지가 잘못된 경로를 반환함.

#### 해결
FFmpeg 우선순위 변경 및 검증 로직 추가:

```typescript
async function getFFmpegPath(): Promise<string> {
  // 1순위: 환경변수
  if (process.env.FFMPEG_BIN) return process.env.FFMPEG_BIN;

  // 2순위: 시스템 FFmpeg
  try {
    await execAsync('ffmpeg -version', { timeout: 5000 });
    return 'ffmpeg';
  } catch {}

  // 3순위: ffmpeg-static (검증 후)
  if (ffmpegPath && typeof ffmpegPath === 'string') {
    if (ffmpegPath.includes('\\ROOT\\')) {
      throw new Error('Invalid ffmpeg-static path');
    }
    if (fs.existsSync(ffmpegPath)) {
      return ffmpegPath;
    }
  }

  throw new Error('FFmpeg not found');
}
```

---

### 오류 #5: FFmpeg "No such filter: 'crop'"

**발생일**: 2026-01-08
**상태**: ✅ 해결됨

#### 원인
Windows에서 큰따옴표 내부의 작은따옴표 이스케이프 문제.

#### 해결
```typescript
// 변경 전
-vf "crop='min(iw,ih)':..."

// 변경 후
-vf "crop=min(iw\\,ih):..."
```

---

### 오류 #6: 영상 합성 시 검은 화면 / 찌그러짐

**발생일**: 2026-01-08
**상태**: ✅ 해결됨

#### 원인
1. 입력 영상들의 해상도/코덱 불일치
2. scale 필터 순서 문제

#### 해결
```bash
# 각 영상을 먼저 표준화
ffmpeg -i input.mp4 -vf "scale=1080:1080,setsar=1:1" -c:v libx264 -preset fast -crf 23 standardized.mp4

# concat 시 모든 영상이 동일한 스펙
ffmpeg -f concat -i list.txt -c copy output.mp4
```

---

### 오류 #7: 영상이 30초가 아닌 5초만 반복

**발생일**: 2026-01-08
**파일**: `loop-video/route.ts`
**상태**: ✅ 해결됨

#### 원인
단순 `loop=5` 옵션 사용으로 5초 영상을 5번 반복해 25초만 생성됨.

#### 해결
**Ping-pong 알고리즘** 구현:

```typescript
// 1. 원본 영상을 역재생 영상 생성
ffmpeg -i input.mp4 -vf reverse reversed.mp4

// 2. concat 리스트 작성 (정방향 + 역방향 반복)
for (let i = 0; i < repeats; i++) {
  list += `file '${inputPath}'\n`;
  list += `file '${reversedPath}'\n`;
}

// 3. 합성 후 정확히 30초로 자르기
ffmpeg -f concat -i list.txt -t 30 output.mp4
```

---

### 오류 #8: 영상 경계에서 끊김 현상

**발생일**: 2026-01-08
**상태**: ✅ 해결됨

#### 원인
정방향 → 역방향 전환 시 끝프레임 중복.

#### 해결
```typescript
// 마지막 프레임 제외하고 역재생
ffmpeg -i input.mp4 -vf "reverse,trim=start=0.033" reversed.mp4
```

---

## 외부 API 연동 오류

### 오류 #9: Higgsfield API 403 Forbidden

**발생일**: 2026-01-08
**파일**: `generate-video-higgsfield/route.ts`
**상태**: ✅ 해결됨

#### 원인
Authorization 헤더 누락 또는 잘못된 형식.

#### 해결
```typescript
const response = await fetch('https://api.higgsfield.ai/v1/dop', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.HIGGSFIELD_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ ... })
});
```

---

### 오류 #10: Higgsfield 영상 URL "not ready"

**발생일**: 2026-01-08
**상태**: ✅ 해결됨

#### 원인
Higgsfield는 비동기 생성이며 즉시 URL이 준비되지 않음.

#### 해결
폴링 방식 구현:

```typescript
let attempts = 0;
while (attempts < 60) {
  const statusRes = await fetch(`https://api.higgsfield.ai/v1/dop/${generationId}`);
  const statusData = await statusRes.json();

  if (statusData.status === 'completed' && statusData.videoUrl) {
    return statusData.videoUrl;
  }

  if (statusData.status === 'failed') {
    throw new Error('영상 생성 실패');
  }

  await new Promise(resolve => setTimeout(resolve, 5000)); // 5초 대기
  attempts++;
}
```

---

### 오류 #11: Higgsfield DoP Standard 품질 부족

**발생일**: 2026-01-09
**상태**: ✅ 해결됨

#### 문제
Standard 모델로 생성한 영상의 품질이 기대 이하.

#### 해결
**DoP Lite** 모델로 변경:

```typescript
const response = await fetch('https://api.higgsfield.ai/v1/dop-lite', {
  // ...
});
```

**차이점**:
- Standard: 5초 영상, 저품질, 빠름
- Lite: 5초 영상, 고품질, 느림 (~30초)

---

### 오류 #12: Higgsfield 영상이 너무 짧음 (5초)

**발생일**: 2026-01-09
**상태**: ✅ 해결됨

#### 문제
Higgsfield는 5초 영상만 생성하므로 30초 영상을 위해 ping-pong 루프 필요.

#### 해결
`loop-video` API 통합:

```typescript
// 1. Higgsfield로 5초 영상 생성
const videoUrl = await generateWithHiggsfield(imageUrl, prompt);

// 2. ping-pong 알고리즘으로 30초 루프 생성
const loopedVideoUrl = await loopVideo(videoUrl, 30);
```

---

### 오류 #13: Gemini 이미지 생성 프롬프트 부족

**발생일**: 2026-01-09
**파일**: `generate-image/route.ts`
**상태**: ✅ 해결됨

#### 문제
"장미 디자인"만 입력하면 일반 장미 사진이 생성됨.

#### 해결
프롬프트 강화 시스템:

```typescript
const enhancedPrompt = `
${userPrompt}

Style requirements:
- Hologram-ready design with pure black (#000000) background
- 1:1 square aspect ratio (1080x1080)
- Centered main subject with symmetry
- Clean, professional, high-end memorial design
- No text, no people, no watermarks
`;
```

---

**최종 업데이트**: 2026-01-10
**아카이브 완료**: 13건의 해결된 오류 기록
