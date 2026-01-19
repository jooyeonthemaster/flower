# AI Hologram 프로젝트 진행상황

## 최종 업데이트: 2026-01-19

---

## 현재 상태: 정상 작동

### 1. 템플릿 모드 (Single Mode) - 무료
- **상태**: 정상 작동
- **기능**: 템플릿 영상 + 6개 문구 텍스트 오버레이로 30초 영상 생성
- **방식**: 사전 제작 템플릿 영상 (AI 생성 없음 → 비용 절감)
- **신규 기능**:
  - 참조 이미지 합성 (배경 제거 후 상단 중앙 배치)
  - 105개 색상 팔레트 + 24개 텍스트 이펙트
  - 11개 한글 폰트 지원
  - Remotion 실시간 미리보기

### 2. AI 영상 합성 모드
- **상태**: 정상 작동
- **기능**: 3개 문구로 30초 3D 텍스트 영상 자동 생성
- **API**: Google Gemini (이미지 생성) + Higgsfield Kling 2.5 (영상 생성)

---

## 최근 수정 사항 (2026-01-19)

### 템플릿 모드 대폭 개선

#### 1. 템플릿 방식 전환 (AI 생성 → 로컬 템플릿)
- **변경 전**: AI가 배경 이미지/영상 매번 생성
- **변경 후**: 사전 제작 템플릿 영상 사용
- **장점**: API 비용 없음, 빠른 처리, 일관된 품질

#### 2. 참조 이미지 합성 기능 구현
- **배경 제거**: @imgly/background-removal (브라우저 기반)
- **합성 방식**: Remotion 렌더링 시 Screen 블렌딩
- **위치**: 상단 중앙 (paddingTop: 8%, width: 35%)
- **수정 파일**:
  - `MultiSceneStep.tsx` - 배경 제거 로직 + 진행률 UI
  - `TextPreviewStep.tsx` - referenceImage 미리보기
  - `HologramTextOverlay.tsx` - 참조 이미지 렌더링 레이어
  - `ResultStep.tsx` - referenceImage API 전달
  - `render-text-overlay/route.ts` - referenceImageSrc 처리

#### 3. 텍스트 이펙트 확장
- **24개 이펙트**: drift, rotate3d, glitch, strobe, glow, pulse, wave, zoom, blur, chromatic, hologram, pixelate, rainbow, bounce, spin, spiral, swing, slide, orbit, zoomIn, flipUp, spiral3d, wave3d, tumble
- **3D 깊이 이펙트**: LED 홀로그램 팬용 최적화 (translateZ, perspective)
- **extrude 효과**: 60레이어 3D 텍스트 입체 효과

---

## 이전 수정 사항 (2026-01-16)

### API 수정

#### 1. `generate-image/route.ts` (단일 영상 생성 - 이미지 생성)
- **input_images 구조 수정**: API 문서 기준으로 변경
  ```javascript
  // 변경 전 (잘못된 구조)
  { id: `ref-${Date.now()}`, url: referenceImageUrl, type: 'media_input' }

  // 변경 후 (API 문서 기준)
  { type: 'image_url', image_url: referenceImageUrl }
  ```
- **aspect_ratio 수정**: `16:9` → `1:1` (홀로그램 팬 디스플레이용 정사각형)
- **지원 비율**: `auto`, `1:1`, `4:3`, `3:4`, `3:2`

#### 2. `generate-video-startend/route.ts` (AI 영상 합성 - 영상 생성)
- 클라이언트 측 폴링 방식으로 변경 (Vercel 타임아웃 방지)
- Job 정보 즉시 반환 후 클라이언트에서 직접 상태 확인

#### 3. `check-video-status/route.ts` (영상 상태 확인)
- 클라이언트 폴링용 상태 확인 API
- Higgsfield API 상태 조회 및 영상 다운로드 처리

### UI 수정

#### 기술적 정보 제거 (사용자 친화적 UI)
- AI 모델 이름 제거 (예: `kling-2.5-turbo-pro`, `Veo 3.1`)
- 기술적 용어 제거 (예: `Start/End Frame`, `병렬 처리`)
- 버전/엔진 라벨 제거 (예: `GEN V2.5 ENGINE`)
- 영상 플레이어 호버 오버레이 제거

#### 한글화
- 카테고리/스타일 영어 → 한글 변환
  ```javascript
  categoryLabels: {
    opening: '개업 축하',
    wedding: '결혼식',
    birthday: '생일',
    memorial: '추모',
    event: '행사/전시',
    promotion: '승진/영전',
  }

  styleLabels: {
    elegant: '우아한',
    luxury: '럭셔리',
    neon: '네온',
    traditional: '전통',
    fantasy: '판타지',
    space: '스페이스',
  }
  ```

---

## 파일 구조

### API Routes (`src/app/api/ai/`)
| 파일 | 용도 | API |
|------|------|-----|
| `generate-image/route.ts` | 단일 영상 모드 - 배경 이미지 생성 | Higgsfield Nano Banana |
| `generate-video/route.ts` | 단일 영상 모드 - 영상 생성 | Google Veo |
| `generate-dual-frame/route.ts` | AI 합성 모드 - 듀얼 프레임 이미지 생성 | Google Gemini |
| `generate-video-startend/route.ts` | AI 합성 모드 - Start/End Frame 영상 생성 | Higgsfield Kling 2.5 |
| `check-video-status/route.ts` | 영상 생성 상태 확인 (폴링) | Higgsfield |
| `merge-videos/route.ts` | 영상 합성 | FFmpeg |

### Components (`src/components/ai-hologram/`)
| 파일 | 용도 |
|------|------|
| `HologramWizard.tsx` | 메인 위자드 컴포넌트 (모드 선택 및 단계 관리) |
| `steps/MultiSceneStep.tsx` | 단일 영상 - 장면 입력 |
| `steps/TextPreviewStep.tsx` | 단일 영상 - 텍스트 미리보기 |
| `steps/MultiSceneGenerationStep.tsx` | 단일 영상 - 영상 생성 |
| `steps/CompositionInputStep.tsx` | AI 합성 - 입력 |
| `steps/CompositionImagePreviewStep.tsx` | AI 합성 - 이미지 미리보기 |
| `steps/CompositionGenerationStep.tsx` | AI 합성 - 영상 생성 (클라이언트 폴링) |
| `steps/ResultStep.tsx` | 결과 화면 (공통) |

---

## 환경 변수

```env
# Higgsfield API
HIGGSFIELD_API_KEY=
HIGGSFIELD_API_SECRET=

# Google AI
GOOGLE_GENAI_API_KEY=

# Firebase (이미지 업로드용)
FIREBASE_*
```

---

## 알려진 이슈 및 해결

### 해결됨
1. ✅ Vercel 타임아웃 (300초 제한) → 클라이언트 측 폴링으로 해결
2. ✅ Nano Banana API input_images 구조 오류 → API 문서 기준으로 수정
3. ✅ aspect_ratio 지원하지 않는 값 사용 → 1:1로 변경
4. ✅ 사용자에게 불필요한 기술적 정보 노출 → UI에서 제거

### 참고 사항
- 영상 생성 예상 소요 시간: 3-7분
- 클라이언트 폴링 간격: 5초
- 최대 폴링 시간: 10분

---

## API 문서 참조

### Higgsfield Nano Banana
- 엔드포인트: `POST /nano-banana`
- input_images 구조:
  ```json
  {
    "type": "image_url",
    "image_url": "<url>"
  }
  ```
- 지원 aspect_ratio: `auto`, `1:1`, `4:3`, `3:4`, `3:2`

### Higgsfield Kling 2.5 Turbo Pro
- 엔드포인트: `POST /kling-video/v2.5-turbo/pro/image-to-video`
- Start/End Frame 지원
- duration: 5 또는 10초

---

## 다음 단계 (예정)

- [ ] Firebase Storage 연동
- [ ] 관리자 페이지 구현
- [ ] 결제 시스템 통합
- [ ] 홀로그램 디바이스 실제 테스트

## 최근 해결 완료 (2026-01-19)

- [x] 참조 이미지 배경 제거 기능 ✅
- [x] 한글 텍스트 렌더링 문제 해결 ✅
