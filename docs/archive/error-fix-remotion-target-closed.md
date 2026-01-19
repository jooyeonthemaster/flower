# Remotion "Target Closed" 에러 수정 과정

**발생일**: 2026-01-11
**완료일**: 2026-01-11
**상태**: ✅ 해결 완료

---

## 🔴 에러 정보

### 콘솔 에러
```
Protocol error (Page.addScriptToEvaluateOnNewDocument): Target closed.
https://www.remotion.dev/docs/target-closed
```

### 터미널 로그
```
Starting Remotion text overlay rendering with 6 texts
Using Base64 video data URL directly for Remotion
Bundling Remotion composition...
Bundle created: C:\Users\jayit\AppData\Local\Temp\remotion-webpack-bundle-4Nk9OO
Remotion Rendering Error: [Error [ProtocolError]: Protocol error...
POST /api/ai/render-text-overlay 500 in 16595ms
```

### 핵심 정보
- **발생 위치**: `/api/ai/render-text-overlay`
- **소요 시간**: 16.5초 후 크래시 (timeout 60초보다 훨씬 빠름)
- **단계**: Remotion bundle 생성 직후

---

## 🔍 원인 분석

### "Target Closed" 의미
Puppeteer/Chrome 브라우저 프로세스가 갑자기 종료됨 → **메모리 크래시**

### 근본 원인
1. **Base64 비디오 크기 문제**
   - 30초 1080x1080 영상 = 5-15MB
   - Base64 인코딩 → 33% 증가 = 7-20MB
   - Chrome이 거대한 Data URL 처리 실패

2. **Remotion Video 컴포넌트 제약**
   - `<Video src="data:video/mp4;base64,..." />`
   - Chrome이 Base64를 메모리에 전체 로드 시도
   - 메모리 부족 → 프로세스 종료

3. **Vercel 서버리스 메모리 제한**
   - Chrome + Remotion + 대용량 Base64 = 메모리 초과

---

## 🛠️ 시도한 해결 방법

### ❌ 시도 1: Base64 직접 전달 (실패)
**날짜**: 2026-01-11 14:00
**방법**: `file://` 대신 Base64 Data URL 직접 전달
**결과**: Chrome 메모리 크래시 (Target closed)

**수정 내용**:
- `render-text-overlay/route.ts`: 임시 파일 저장 제거, Base64 직접 사용
- `HologramTextOverlay.tsx`: `delayRenderTimeoutInMilliseconds={60000}` 추가

**실패 원인**: Base64가 너무 커서 Chrome이 처리 불가

---

## ✅ 최종 해결 방안 (진행 중)

### 방법: 임시 HTTP 서버로 파일 제공

#### 전략
1. Base64 → 임시 파일 저장
2. Next.js API route로 파일 스트리밍
3. Remotion에 `http://localhost:3000/api/temp-video/xxx.mp4` 전달
4. Chrome이 HTTP 스트리밍으로 비디오 로드 (메모리 효율적)

#### 구현 단계

**1단계**: 임시 HTTP 서버 API 생성
- 파일: `src/app/api/temp-video/[id]/route.ts` (신규)
- 기능: 임시 파일을 HTTP GET으로 스트리밍

**2단계**: render-text-overlay API 수정
- Base64 → 임시 파일 저장
- HTTP URL 생성: `http://localhost:3000/api/temp-video/remotion_input_12345.mp4`
- Remotion에 HTTP URL 전달

**3단계**: 테스트
- 멀티 씬 모드 → 텍스트 오버레이 적용
- "Target closed" 에러 없이 완료되는지 확인

---

## 📊 진행 상황

- [x] 에러 원인 분석
- [x] 해결 방안 수립
- [x] 임시 HTTP 서버 API 구현
- [x] render-text-overlay API 수정
- [x] 로컬 테스트 완료 ✅
- [x] 최종 검증 완료 ✅

---

## 🔧 구현 완료 내역

### 1. 임시 HTTP 서버 API 생성
**파일**: `src/app/api/temp-video/[id]/route.ts` (신규)

**기능**:
- GET 요청으로 임시 파일 스트리밍
- `Content-Type: video/mp4` 헤더 설정
- 보안: `remotion_input_*.mp4` 패턴만 허용
- 캐시 비활성화

**URL 형식**: `http://localhost:3000/api/temp-video/remotion_input_12345.mp4`

### 2. render-text-overlay API 수정
**파일**: `src/app/api/ai/render-text-overlay/route.ts`

**수정 내용**:
```typescript
// 이전: Base64 직접 전달 (메모리 크래시)
const videoSrcPath = videoDataUrl;

// 현재: 임시 파일 + HTTP URL
tempVideoFileName = `remotion_input_${timestamp}.mp4`;
tempVideoPath = path.join(tempDir, tempVideoFileName);
fs.writeFileSync(tempVideoPath, buffer);

const host = req.headers.get('host') || 'localhost:3000';
videoSrcPath = `http://${host}/api/temp-video/${tempVideoFileName}`;
```

**장점**:
- Chrome이 HTTP 스트리밍으로 비디오 로드
- 메모리 효율적 (Base64 전체 로드 X)
- "Target closed" 에러 방지

---

## ✅ 테스트 결과

### 테스트 일시
2026-01-11 오후

### 테스트 환경
- 로컬 개발 환경 (localhost:3000)
- 멀티 씬 모드 (6개 텍스트 입력)
- 영상: 30초 1080x1080 AI 생성 영상

### 결과
**✅ 성공**
```
Starting Remotion text overlay rendering with 6 texts
Converting Base64 video to temp file for HTTP serving...
Saved temp video and created HTTP URL: http://localhost:3000/api/temp-video/remotion_input_1768139898141.mp4
Bundling Remotion composition...
Bundle created: C:\Users\jayit\AppData\Local\Temp\remotion-webpack-bundle-43zAXS
Rendering video...
Render completed: C:\Users\jayit\AppData\Local\Temp\remotion_output_1768139898141.mp4
POST /api/ai/render-text-overlay 200 in 914313ms (약 15분)
```

### 핵심 성과
- ✅ **"Target Closed" 에러 완전 해결**: 16초 크래시 → 15분 정상 완료
- ✅ **HTTP 스트리밍 작동 확인**: 150+ GET 요청 성공
- ✅ **최종 영상 생성 확인**: 텍스트 오버레이 적용된 영상 출력

### 남은 이슈
- ⚠️ **렌더링 속도**: 15분은 프로덕션 환경에서 너무 느림
- ⚠️ **Vercel 제한**: 프로덕션 maxDuration 300초(5분) 초과
- 🔧 **다음 단계**: 속도 최적화 필요 (별도 문서화)

---

## 📝 참고 문서

- [Remotion "Target Closed" 공식 문서](https://www.remotion.dev/docs/target-closed)
- 주요 원인: 메모리 부족, Puppeteer 크래시, 잘못된 Chrome 설정

---

**최종 업데이트**: 2026-01-11 (해결 완료, 최적화 작업은 별도 진행)
