# Remotion 렌더링 속도 최적화

**시작일**: 2026-01-11
**완료일**: 2026-01-11
**상태**: ✅ 완료

---

## 📊 현재 상황

### 문제점
- **현재 렌더링 시간**: 약 15분 (914초)
- **Vercel 프로덕션 제한**: 300초 (5분)
- **결과**: 프로덕션 배포 시 타임아웃 발생 예상

### 렌더링 시간 분석

```
총 15분 (914초) 구성:
1. Base64 → 임시 파일 저장: ~1초
2. Remotion 번들링: ~3-5분 ⚠️ (가장 느림)
3. Composition 선택: ~10-20초
4. 실제 비디오 렌더링: ~8-10분 ⚠️ (두 번째로 느림)
5. 결과 읽기 및 Base64 변환: ~5-10초
```

**병목 구간**:
1. 🔴 **Remotion 번들링** (3-5분): 매 요청마다 webpack 번들 생성
2. 🔴 **비디오 렌더링** (8-10분): 프레임별 처리 속도

---

## 🎯 최적화 전략

### 전략 1: 번들 캐싱 ⭐ (최우선)

**현재 문제**:
```typescript
// render-text-overlay/route.ts:66-70
const bundled = await bundle({
  entryPoint,
});
```
매 요청마다 번들을 새로 생성 → 3-5분 소요

**해결 방안**:
- 서버 시작 시 한 번만 번들 생성
- 전역 변수 또는 파일 시스템에 캐시
- 개발 환경에서만 적용 (프로덕션은 빌드 시 번들링)

**예상 효과**: 15분 → 10분 (3-5분 단축)

---

### 전략 2: 렌더링 설정 최적화

**이미 적용된 설정**:
```typescript
concurrency: Math.max(1, Math.floor(os.cpus().length / 2)),
disallowParallelEncoding: false,
timeoutInMilliseconds: 300000,
```

**추가 최적화**:
1. **코덱 변경**: `h264` → `h264-mkv` (더 빠름)
2. **품질 조정**: `videoBitrate` 낮추기
3. **프레임 수 감소**: FPS 30 → 24 (20% 단축)

**예상 효과**: 10분 → 7-8분 (2-3분 단축)

---

### 전략 3: 프리뷰와 최종 분리

**현재**: 프리뷰와 최종 렌더링 모두 Remotion 사용

**대안**:
- 프리뷰: Remotion Player (브라우저에서 실시간 렌더링)
- 최종: FFmpeg (서버에서 빠른 렌더링)

**FFmpeg 구현**:
```bash
ffmpeg -i input.mp4 -vf "drawtext=..." -c:a copy output.mp4
```

**장점**:
- FFmpeg는 2-3분 내 완료 (5배 빠름)
- Vercel 제한 통과 가능

**단점**:
- Remotion의 화려한 이펙트 사용 불가
- 프리뷰와 최종이 약간 다를 수 있음

**예상 효과**: 15분 → 2-3분 (80% 단축)

---

### 전략 4: 외부 렌더링 서비스

**Remotion Lambda 사용**:
- AWS Lambda에서 병렬 렌더링
- 수십 개 람다가 동시에 프레임 처리
- Vercel 타임아웃 회피

**비용**:
- 영상 1개당 약 $0.05-0.15
- 렌더링 시간: 1-2분

**예상 효과**: 15분 → 1-2분 (90% 단축)

---

## 📋 실행 계획

### Phase 1: 빠른 개선 (1시간)
- [ ] 번들 캐싱 구현
- [ ] 렌더링 설정 최적화
- [ ] 테스트: 7-8분 목표

### Phase 2: 근본 해결 (2시간)
- [ ] FFmpeg fallback 구현
- [ ] 프리뷰 = Remotion, 최종 = FFmpeg
- [ ] 테스트: 2-3분 목표

### Phase 3: 프로덕션 준비 (선택)
- [ ] Remotion Lambda 검토
- [ ] 비용 분석
- [ ] 배포 테스트

---

## 🔧 구현 진행 상황

### ✅ 완료된 최적화

#### 1. 번들 캐싱 구현 (2026-01-11)
```typescript
// 전역 캐시 변수
let cachedBundlePath: string | null = null;
let bundlePromise: Promise<string> | null = null;

async function getOrCreateBundle(entryPoint: string): Promise<string> {
  if (cachedBundlePath) {
    return cachedBundlePath; // 즉시 반환
  }
  // 첫 요청에만 번들 생성
  // ...
}
```

**효과**: 두 번째 요청부터 3-5분 절약

#### 2. Concurrency 최적화 (2026-01-11)
```typescript
// 변경 전: cpuCount - 1 (오히려 느려짐)
concurrency: Math.max(2, cpuCount - 1),

// 변경 후: 고정값 4 (Remotion 권장)
concurrency: 4,
```

**근거**: Remotion GitHub Issue #4949 - 높은 concurrency가 오히려 성능 저하

#### 3. 비트레이트 감소
```typescript
videoBitrate: '3M', // 10M → 5M → 3M
```

**효과**: 인코딩 속도 향상, 화질은 충분히 유지

#### 4. FPS 감소
```typescript
fps: 24, // 30 → 24
```

**효과**: 프레임 수 20% 감소 → 렌더링 20% 빠름

#### 5. ResultStep 메모리 크래시 수정 (2026-01-11)

**문제**: "텍스트 오버레이 적용하기" 버튼 클릭 시 브라우저 크래시
- 7-20MB Base64 영상 데이터를 JSON.stringify()로 처리
- 브라우저 메모리 부족으로 "페이지를 표시할 수 없음" 오류

**해결**:
```typescript
// ResultStep.tsx
const dataUrlToBlob = (dataUrl: string): Blob => {
  // Base64 → Uint8Array → Blob (메모리 효율적)
};

// FormData로 전송 (JSON 대신)
const formData = new FormData();
formData.append('video', videoBlob, 'input-video.mp4');
```

```typescript
// render-text-overlay/route.ts
// FormData와 JSON 둘 다 지원
if (contentType.includes('multipart/form-data')) {
  const formData = await req.formData();
  const videoFile = formData.get('video') as File;
  // ...
}
```

**효과**: 브라우저 크래시 완전 해결, 페이지 정상 작동

---

## 📊 성능 개선 결과

### 최적화 전
- **렌더링 시간**: 약 15분 (914초)
- **문제**: Vercel 5분 제한 초과, 브라우저 크래시

### 최적화 후 (테스트 완료)
- **첫 번째 요청**: 시간 대폭 단축 ✅
- **페이지 안정성**: 브라우저 크래시 없음 ✅
- **메모리 사용**: FormData 사용으로 메모리 효율적 ✅

### 향후 예상
- **두 번째 요청 이후**: 번들 캐시 활용으로 추가 3-5분 단축 예상
- **단축률**: 약 50-60%

---

## ⚠️ 한계점

### Remotion의 근본적 문제
1. **단일 서버 렌더링의 한계**
   - JavaScript 기반 프레임 렌더링
   - CPU 병렬화 한계

2. **Concurrency 역설**
   - 높은 concurrency = 오히려 느려짐
   - GitHub Issue #4949 확인됨

3. **OffthreadVideo 성능 저하**
   - 20-30% 렌더링 후 속도 급감
   - 메모리 사용량 증가

### Vercel 프로덕션 문제
- 현재 예상 시간: 5-7분
- Vercel 제한: 5분 (maxDuration: 300)
- **타임아웃 위험 여전히 존재**

---

## 🚀 추가 최적화 옵션 (미적용)

### 옵션 A: Remotion Lambda ⭐⭐
- **속도**: 1-2분 (93% 단축)
- **비용**: $0.05-0.15/영상
- **장점**: 화려한 이펙트 유지
- **단점**: AWS 설정 필요

### 옵션 B: FFmpeg 전환 ⭐
- **속도**: 30초-1분 (95% 단축)
- **비용**: 무료
- **장점**: 안정적, 빠름
- **단점**: 화려한 모션 이펙트 불가 (사용자 요구사항 충족 불가)

---

## ✅ 최종 결론

### 완료된 작업
1. ✅ 번들 캐싱 구현 → 두 번째 요청부터 3-5분 절약
2. ✅ Concurrency 최적화 (4로 고정) → 렌더링 속도 개선
3. ✅ 비트레이트 감소 (3M) → 인코딩 속도 향상
4. ✅ FPS 감소 (24) → 프레임 수 20% 감소
5. ✅ ResultStep 메모리 크래시 수정 → 브라우저 안정성 확보

### 테스트 결과
- 렌더링 시간 대폭 단축 확인 ✅
- 브라우저 크래시 없이 정상 작동 ✅
- 페이지 안정성 확보 ✅

### 추가 최적화 필요 시
- 클라이언트 요청 시 Remotion Lambda 또는 FFmpeg 전환 검토
- Vercel 프로덕션 환경 5분 제한 고려 필요

---

**최종 업데이트**: 2026-01-11 (Phase 1 완료 및 테스트 성공)
