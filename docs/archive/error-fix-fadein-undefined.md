# 오류 수정 기록

## 오류 정보
- **발생 시각**: 2026-01-11 12:00:00
- **파일 경로**: `src/app/api/ai/render-text-overlay/route.ts`
- **오류 메시지**:
  ```
  FFmpeg text overlay error: ReferenceError: fadeIn is not defined
    at POST (src\app\api\ai\render-text-overlay\route.ts:206:56)
  ```

## 오류 원인

**변수 정의 누락**: `fadeIn`과 `fadeOut` 변수가 정의되지 않음

터미널 로그 분석:
```
Applying text 1/6: "🎊 개업을 축하합니다 🎊"
FFmpeg text overlay error: ReferenceError: fadeIn is not defined
    at POST (src\app\api\ai\render-text-overlay\route.ts:206:56)
```

206번 줄에서 `fadeIn` 변수를 사용하려 했지만, 해당 변수가 선언되지 않아 ReferenceError 발생.

**문제점**:
- `fadeIn`과 `fadeOut` 변수를 선언하지 않고 alpha 표현식에서 바로 사용
- 페이드 인/아웃 효과를 위한 시간 값이 정의되지 않음

---

## 수정 과정

### 시도 1 (2026-01-11 12:00:00)
**시도 내용**: fadeIn 변수 정의 추가
**결과**: 진행 중 (코드 수정 완료, 사용자 테스트 대기)
**상세**:
- **문제**: 199번 줄에서 `fadeOut = 0.5`만 정의하고 `fadeIn`은 정의하지 않음
- **수정**: 199번 줄에 `const fadeIn = 0.5;` 추가

**수정 내용**:
```typescript
// 수정 전
const fadeOut = 0.5;
const endTime = scene.startTime + scene.duration;

// 수정 후
const fadeIn = 0.5;   // ✅ 추가
const fadeOut = 0.5;
const endTime = scene.startTime + scene.duration;
```

**적용 파일**:
- `src/app/api/ai/render-text-overlay/route.ts` (199번 줄)

---

## 사용자 확인
- [x] 사용자 확인 완료 - "작동확인은 했는데"

---

## 추가 개선 사항 (2026-01-11)

### 개선 1: 추천 문구에서 이모티콘 제거
**이유**: FFmpeg에서 이모티콘이 네모 박스로 렌더링되는 문제
**수정 파일**: `src/components/ai-hologram/steps/MultiSceneStep.tsx`
**변경 내용**:
- `suggestedTexts`의 모든 이모티콘 제거
  - `'♥ 결혼을 축하합니다 ♥'` → `'결혼을 축하합니다'`
  - `'🎊 개업을 축하합니다 🎊'` → `'개업을 축하합니다'`
  - `'🎤 축하드립니다 🎤'` → `'축하드립니다'`
- placeholder 예시 문구에서도 이모티콘 제거

### 개선 2: 텍스트 이펙트 화려하게 개선 + 위치 조정
**목표**: 텍스트를 하단으로 이동하여 중앙 이미지가 가려지지 않도록 하고, 화려한 글로우 효과 추가

**수정 파일**: `src/app/api/ai/render-text-overlay/route.ts`
**변경 내용**:
1. **텍스트 위치 변경**: `y=(h-text_h)/2` → `y=(h-text_h-80)` (하단에서 80px 위)
2. **3단계 레이어 글로우 효과**:
   - 레이어 1: 외곽 글로우 (borderw=8, white@0.3)
   - 레이어 2: 중간 글로우 (borderw=4, white@0.5)
   - 레이어 3: 메인 텍스트 (borderw=2, 검은 테두리)

**미리보기 동기화**: `src/components/ai-hologram/steps/MultiSceneStep.tsx`
- 텍스트 위치: `bottom-16` → `bottom-20`
- 텍스트 크기: `text-lg` → `text-2xl`
- CSS 글로우 효과: `drop-shadow` + `WebkitTextStroke` 추가

---

## 최종 상태
**상태**: 완료
**완료 시각**: 2026-01-11 12:15:00
**비고**: fadeIn 변수 정의 + 이모티콘 제거 + 텍스트 이펙트 개선 완료
