# 디지털화환 프로젝트 - AI 홀로그램 영상 생성

## 프로젝트 개요

Next.js 기반 AI 홀로그램 영상 생성 서비스입니다. LED 팬 형태의 원형 홀로그램 디스플레이용 맞춤형 영상을 생성합니다. **두 가지 모드**를 제공합니다:

1. **템플릿 모드 (무료)**: 사전 제작된 템플릿 영상 + 텍스트 오버레이
2. **AI 합성 모드 (유료)**: AI가 배경+3D 텍스트를 함께 생성

## 핵심 기능

### 1. 템플릿 모드 (Single Mode) - 무료
- **카테고리/스타일 선택**: 결혼식/개업/행사 × 화려/심플
- **6개 텍스트 입력**: 각 5초씩 30초 영상
- **105개 색상 팔레트 + 24개 텍스트 이펙트**
- **11개 한글 폰트 지원**
- **참조 이미지 합성**: 로고/인물 사진 자동 배경 제거 후 합성
- **Remotion 실시간 미리보기**
- **템플릿 영상 + 30초 루프 (Ping-pong)**

### 2. AI 합성 모드 (Composition Mode) - 유료
- **3개 문구 입력**: 각 10초씩 30초 영상
- **AI 듀얼프레임 이미지 생성**: Start/End Frame
- **AI 영상 생성**: 3D 텍스트 + 화려한 배경
- **고품질 홀로그램 효과**

### 3. 지원 스타일 (템플릿 모드)
- **결혼식**: 화려 (핑크/로즈골드) / 심플 (화이트/골드)
- **개업**: 화려 (빨강/금색) / 심플 (비즈니스 톤)
- **행사**: 화려 (파랑/보라) / 심플 (기업 톤)

## 기술 스택

### 프론트엔드
- **Next.js 15.4.2** (React 19)
- **TypeScript**
- **Tailwind CSS 4**
- **Remotion 4.0** - 영상 렌더링 + 실시간 미리보기
- **@imgly/background-removal** - 브라우저 배경 제거

### AI & 미디어
- **Google Gemini** - AI 합성 모드 이미지 생성
- **Higgsfield Kling 2.5** - AI 합성 모드 영상 생성
- **FFmpeg** - 영상 루프 (Ping-pong)

### 인프라
- **Firebase Storage** - 이미지/영상 저장
- **Vercel Pro** - 배포 (300초 타임아웃)

## 프로젝트 구조

```
flower/
├── src/
│   ├── app/
│   │   └── api/
│   │       └── ai/
│   │           ├── generate-image/      # 이미지 생성 (Gemini)
│   │           ├── generate-video-higgsfield/  # 영상 생성
│   │           ├── loop-video/          # 30초 루프
│   │           └── render-text-overlay/ # 텍스트 합성
│   ├── components/
│   │   └── ai-hologram/
│   │       ├── HologramWizard.tsx       # 메인 위자드
│   │       └── steps/
│   │           ├── MultiSceneStep.tsx   # 텍스트 입력
│   │           ├── MultiSceneGenerationStep.tsx  # 영상 생성
│   │           └── ResultStep.tsx       # 결과 표시
│   └── services/
│       └── aiService.ts
└── docs/
    ├── README.md (이 파일)
    ├── 초기계획.md              # 클라이언트 요구사항 및 기능 설계
    ├── 완료기록.md              # 구현 완료 내역
    └── 오류해결.md              # 모든 오류 해결 과정
```

## 주요 API 플로우

### 템플릿 모드 (Single Mode) - 무료
```
Step 0: MultiSceneStep
  └─ 카테고리 선택: wedding, opening, event
  └─ 스타일 선택: fancy, simple
  └─ 참조 이미지 업로드 (선택) → 배경 제거 (@imgly)
      ↓
Step 1: TextPreviewStep
  └─ 6개 텍스트 문구 입력
  └─ 텍스트 스타일 설정 (색상, 폰트, 이펙트)
  └─ Remotion Player 실시간 미리보기
      ↓
Step 2: MultiSceneGenerationStep
  └─ 템플릿 영상 로드: /templates/videos/{category}-{style}.mp4
  └─ 30초 루프 생성: /api/ai/loop-video (Ping-pong)
      ↓
Step 3: ResultStep
  └─ 텍스트 오버레이: /api/ai/render-text-overlay (Remotion)
  └─ 최종 30초 MP4 다운로드
```

### AI 합성 모드 (Composition Mode) - 유료
```
Step 0: CompositionInputStep
  └─ 3개 문구 입력
  └─ 카테고리/스타일 선택
      ↓
Step 1: CompositionImagePreviewStep
  └─ AI 듀얼프레임 이미지 생성 (Google Gemini)
  └─ 16:9 → 1:1 크롭
      ↓
Step 2: CompositionGenerationStep
  └─ Start/End Frame 영상 생성 (Higgsfield Kling 2.5)
  └─ 3개 영상 합성 (FFmpeg)
      ↓
Step 3: ResultStep
  └─ 최종 30초 MP4 다운로드
```

## 주요 제약사항

### 1. 홀로그램 요구사항
- **1:1 정사각형 비율** 필수 (원형 홀로그램 팬)
- **검은 배경 (#000000)** 필수 (홀로그램에서 투명)
- **텍스트는 원 안에** 배치 (가장자리 잘림 방지)

### 2. Vercel 제약
- **타임아웃**: 최대 300초 (Pro 플랜)
- **FFmpeg**: 서버리스 환경에서 제한적 지원
- **파일 저장**: `/tmp` 또는 `os.tmpdir()` 사용

### 3. API 제약
- **Higgsfield DoP**: 외부 URL 필요 (Firebase 업로드 필수)
- **Google Veo**: 1:1 비율 미지원 (16:9 → 크롭 필요)

## 비용 구조

### 템플릿 모드 (무료)
- 사전 제작 템플릿 사용 → **API 비용 없음**
- Remotion 렌더링만 필요 (서버 비용만)

### AI 합성 모드 (유료 - 100,000원)
- 이미지 생성 (Gemini): $0.02/장 × 3 = $0.06
- 영상 생성 (Higgsfield): ~$0.05/건 × 3 = $0.15
- **총 원가**: 약 $0.21/건 (~280원)

## 환경 변수

`.env.local` 파일 필수:

```env
# Google AI
GOOGLE_GENAI_API_KEY=your_api_key

# Higgsfield
HIGGSFIELD_API_KEY=your_api_key
HIGGSFIELD_API_SECRET=your_api_secret

# Firebase
FIREBASE_API_KEY=your_api_key
FIREBASE_STORAGE_BUCKET=your_bucket
```

## 개발 가이드

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

### FFmpeg 설치 (Windows)
```bash
# WinGet 사용
winget install FFmpeg

# 또는 수동 설치
# https://ffmpeg.org/download.html
# 압축 해제 후 PATH에 추가
```

### 테스트
```bash
# 브라우저에서
http://localhost:3000/ai-hologram

# FFmpeg 확인
ffmpeg -version
```

## 문서 가이드

### [초기계획.md](./초기계획.md)
- 클라이언트 요구사항
- 기능 설계 및 우선순위
- 기술적 구현 방안
- 파일 구조 및 일정

### [완료기록.md](./완료기록.md)
- 구현 완료된 기능 목록
- 단계별 작업 내역
- UI/UX 개선 사항
- 프롬프트 최적화 기록

### [오류해결.md](./오류해결.md)
- 발생한 모든 오류 기록
- 오류 원인 분석
- 해결 방법 및 코드 수정
- 테스트 결과

## 주요 이슈 및 해결책

### Issue #1: FFmpeg 경로 문제
**문제**: Windows에서 `\ROOT\` 잘못된 경로
**해결**: 시스템 FFmpeg 우선 사용

### Issue #2: 5초 영상만 재생
**문제**: 30초 루프 생성 안됨
**해결**: Ping-pong 루프 알고리즘 적용

### Issue #3: Google Veo 할당량 초과
**문제**: 429 에러 발생
**해결**: Higgsfield DoP로 전환

### Issue #4: Higgsfield API 522 타임아웃
**문제**: 잘못된 엔드포인트 사용
**해결**: 공식 문서 확인 후 `platform.higgsfield.ai` 사용

## 프로젝트 타임라인

- **2026-01-06**: 프로젝트 기획 시작
- **2026-01-07**: AI 영상 합성 기능 개발
- **2026-01-10**: 단일 영상 모드 Higgsfield 전환 완료
- **목표**: 2026-01-31 전체 기능 완료

## 참고 자료

### API 문서
- [Google Gemini API](https://ai.google.dev/docs)
- [Higgsfield Platform](https://docs.higgsfield.ai/llms.txt)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)

### 기술 참고
- [Next.js 15](https://nextjs.org/docs)
- [Remotion](https://www.remotion.dev/docs)
- [Firebase Storage](https://firebase.google.com/docs/storage)

## 라이선스 및 연락처

- **프로젝트 이름**: Flower (디지털화환)
- **개발 시작**: 2026-01
- **개발 환경**: Windows 11, Node.js 20+

---

**최종 업데이트**: 2026-01-19
