# AI 홀로그램 영상 생성 구현 계획

## 작성일
2025-01-10

## 현재 상황 분석 (수정됨)

### 문제점 재분석 ✅
사용자 스크린샷 분석 결과:
- **사용자는 "단일 영상 생성" 모드를 사용함**
- 단일 영상 모드는 `GenerationStep.tsx`를 사용
- `GenerationStep`은 **Google Veo API만 사용** (8초 영상만 생성)
- **Higgsfield + 30초 루프 없음**

### 실제 문제
1. **GenerationStep이 Google Veo만 사용함**
   - 파일: `src/components/ai-hologram/steps/GenerationStep.tsx`
   - Line 57: `aiService.generateVideo()` → Google Veo API 호출
   - 30초 루프 로직 없음
   - 텍스트 오버레이 단계로 자동 전환 안됨

2. **단일 영상 모드 vs 다중 장면 모드**
   - 단일 영상 모드 (`GenerationStep.tsx`): Google Veo → 8초 영상만
   - 다중 장면 모드 (`MultiSceneGenerationStep.tsx`): Higgsfield + 30초 루프 ✅

### 현재 플로우 (단일 영상 모드)
```
GenerationStep (단일 영상 모드):
1. 이미지 생성 (Google GenAI) ✅
2. 사용자가 수동으로 "홀로그램 영상 생성하기" 버튼 클릭
3. Google Veo API로 8초 영상 생성 ✅
4. onComplete(videoUrl) 호출 → ResultStep으로 이동 ✅
5. [문제] Higgsfield 사용 안함 ❌
6. [문제] 30초 루프 없음 ❌
7. [문제] 자동 전환 없음 (버튼 클릭 필요) ❌
```

---

## 해결 계획 (수정됨)

### 목표
**단일 영상 모드**를 **다중 장면 모드**처럼 동작하도록 수정:
1. Google Veo → Higgsfield로 변경
2. 8초 영상 → 30초 루프 영상
3. 수동 버튼 클릭 → 자동 전환

### 1단계: GenerationStep을 SingleVideoGenerationStep으로 교체 ✅

**방법 A: 기존 GenerationStep 완전 교체 (권장)**
- `GenerationStep.tsx`를 `SingleVideoGenerationStep.tsx`와 동일한 로직으로 변경
- Higgsfield + 30초 루프 적용
- 자동 전환 적용

**방법 B: HologramWizard에서 컴포넌트 교체**
- `GenerationStep` 사용 중지
- `SingleVideoGenerationStep` 사용

→ **방법 A 선택**: GenerationStep 내부를 SingleVideoGenerationStep 로직으로 교체

---

### 2단계: GenerationStep 수정 사항

**파일**: `src/components/ai-hologram/steps/GenerationStep.tsx`

#### 수정 1: 상태 타입 변경
```typescript
// 변경 전 (line 16)
const [status, setStatus] = useState<'idle' | 'generating-image' | 'image-ready' | 'generating-video' | 'error'>('idle');

// 변경 후
type GenerationPhase = 'idle' | 'uploading' | 'generating' | 'looping' | 'completed' | 'error';
const [phase, setPhase] = useState<GenerationPhase>('idle');
```

#### 수정 2: 영상 생성 로직 교체
```typescript
// 변경 전 (line 52-72): Google Veo 사용
const startVideoGeneration = async () => {
  const res = await aiService.generateVideo({ ... });
  onComplete(res.videoUrl);
};

// 변경 후: Higgsfield + 30초 루프
const startVideoGeneration = async () => {
  // 1. 이미지 업로드 (외부 URL 필요)
  // 2. Higgsfield API 호출 (5초 영상)
  // 3. loop-video API 호출 (30초 영상)
  // 4. 자동으로 onComplete 호출
};
```

#### 수정 3: UI 수정
- 수동 버튼 제거 → 자동 전환
- 진행 상태 표시 추가 (uploading, generating, looping)
- 30초 영상 미리보기

---

### 3단계: 코드 재사용

`SingleVideoGenerationStep.tsx`의 로직을 `GenerationStep.tsx`로 복사:
1. **startGeneration 함수** (line 32-122)
2. **3단계 Phase 로직** (uploading, generating, looping)
3. **자동 전환** (onComplete 자동 호출)

---

## 구현 진행 상황

### ✅ 완료된 작업 (2025-01-10)
- [x] 현재 상황 분석 및 문서화
- [x] GenerationStep 파일 분석
- [x] HologramWizard 파일 분석
- [x] 문제 원인 파악: 단일 영상 모드가 Google Veo만 사용
- [x] GenerationStep을 Higgsfield + 30초 루프 로직으로 완전 교체
- [x] 자동 전환 로직 추가 (onComplete 자동 호출)
- [x] UI 개선 (3단계 진행 표시, 30초 영상 미리보기)
- [x] 빌드 성공 ✅

---

## 예상 수정 사항

### SingleVideoGenerationStep.tsx
```typescript
// 수정 전 (line 107-115)
setVideoUrl(loopResult.videoUrl);
setProgress(100);
setPhase('completed');

setTimeout(() => {
  onComplete(loopResult.videoUrl);
}, 1000);

// 수정 후 (디버깅 로그 추가)
console.log('Loop result:', loopResult);
console.log('30초 영상 URL:', loopResult.videoUrl);

setVideoUrl(loopResult.videoUrl); // 30초 영상 URL 저장
setProgress(100);
setPhase('completed');

// 즉시 다음 단계로 전환 (딜레이 제거 또는 유지)
setTimeout(() => {
  console.log('Calling onComplete with 30s video:', loopResult.videoUrl);
  onComplete(loopResult.videoUrl);
}, 1000);
```

### HologramWizard.tsx (확인 필요)
```typescript
// onComplete 핸들러에서 자동으로 다음 단계로 이동
const handleVideoComplete = (videoUrl: string) => {
  setGeneratedVideoUrl(videoUrl);
  // 자동으로 다음 단계로 이동
  setCurrentStep(currentStep + 1); // 또는 특정 단계로 이동
};
```

---

## 테스트 계획

1. **30초 영상 재생 확인**
   - SingleVideoGenerationStep 완료 후
   - video 태그에 30초 영상이 재생되는지 확인
   - 브라우저 개발자 도구에서 video URL 확인

2. **자동 전환 확인**
   - 영상 생성 완료 후
   - 자동으로 텍스트 오버레이 단계로 넘어가는지 확인
   - 수동 버튼 클릭 없이 진행되는지 확인

3. **전체 플로우 테스트**
   - 이미지 선택 → 영상 생성 → 30초 루프 → 텍스트 오버레이 → 완성

---

## 참고 사항

### 관련 파일
- `src/components/ai-hologram/steps/SingleVideoGenerationStep.tsx`
- `src/components/ai-hologram/HologramWizard.tsx`
- `src/app/api/ai/loop-video/route.ts`
- `src/app/api/ai/generate-video-higgsfield/route.ts`

### API 플로우
```
1. /api/upload-image (Data URL → Firebase URL)
2. /api/ai/generate-video-higgsfield (Image → 5초 영상)
3. /api/ai/loop-video (5초 → 30초 ping-pong)
4. 완료 → 텍스트 오버레이 단계
```

---

## 변경 이력

### 2025-01-10 - 최종 완료 ✅

#### 수정된 파일
1. **`src/components/ai-hologram/steps/GenerationStep.tsx`** - 완전 재작성
   - Google Veo API 제거
   - Higgsfield API + 30초 루프 추가
   - 자동 전환 로직 추가 (line 138-141)
   - UI 개선: 3단계 진행 표시 (이미지 → 영상 30초 → 텍스트 오버레이)

#### 주요 변경 사항

**AS-IS (변경 전)**
```typescript
// Google Veo만 사용
const res = await aiService.generateVideo({
  sourceImageUrl: imageUrl,
  prompt: '...'
});
onComplete(res.videoUrl); // 8초 영상만
```

**TO-BE (변경 후)**
```typescript
// 1. 이미지 생성
const imageResult = await fetch('/api/ai/generate-image', {...});

// 2. 이미지 업로드 (Firebase)
const uploadResult = await fetch('/api/upload-image', {...});

// 3. Higgsfield API (5초 영상)
const videoResult = await fetch('/api/ai/generate-video-higgsfield', {
  body: JSON.stringify({
    sourceImageUrl: externalImageUrl,
    prompt: '...',
    duration: 5,
  })
});

// 4. 30초 루프 생성
const loopResult = await fetch('/api/ai/loop-video', {
  body: JSON.stringify({
    videoDataUrl: videoResult.videoUrl,
    loopCount: 6,
    outputRatio: '1:1',
  })
});

// 5. 자동으로 다음 단계로 전환
setTimeout(() => {
  onComplete(loopResult.videoUrl); // 30초 영상
}, 1500);
```

#### 새로운 기능
1. **30초 영상 미리보기** (line 284-299)
   - 완성된 30초 루프 영상을 즉시 재생
   - autoPlay + loop 설정

2. **자동 전환** (line 138-141)
   - 1.5초 딜레이 후 자동으로 텍스트 오버레이 단계로 이동
   - 수동 버튼 클릭 불필요

3. **진행 상태 표시** (line 191-211)
   - ① 이미지 생성 ✓
   - ② 영상 생성 (30초) ✓
   - ③ 텍스트 오버레이 적용 (자동)

#### 빌드 결과
```
✓ Compiled successfully in 13.0s
✓ Generating static pages (34/34)
```

#### 테스트 시나리오
1. 단일 영상 생성 모드 선택
2. 프롬프트 입력
3. 자동으로 이미지 생성 → 영상 생성 → 30초 루프
4. 완료 후 30초 영상 미리보기
5. 1.5초 후 자동으로 ResultStep (텍스트 오버레이 단계)로 이동

#### 해결된 문제
- ✅ 5초 영상만 재생되던 문제 → 30초 루프 영상 생성
- ✅ 수동 버튼 클릭 필요했던 문제 → 자동 전환
- ✅ Google Veo 할당량 문제 → Higgsfield 사용
- ✅ 텍스트 오버레이 단계로 넘어가지 않던 문제 → 자동 onComplete 호출
