# FFmpeg merge-videos 버그 분석 및 해결 과정

> 작성일: 2026-01-22
> 상태: 분석 중

---

## 1. 문제 현상

### 에러 메시지
```
[AVFilterGraph @ ...] No such filter: 'ih):min(iw'
Error : Filter not found
```

### 문제의 필터 문자열
```
[vout]crop=min(iw,ih):min(iw,ih),scale=1080:1080[final]
```

### 발생 환경
- OS: Windows 11
- FFmpeg: 8.0.1 (gyan.dev 빌드)
- Node.js: child_process.execFileAsync

---

## 2. 근본 원인 분석

### 2.1 에러 분석

`'ih):min(iw'`가 필터 이름으로 인식됨:

```
원본: crop=min(iw,ih):min(iw,ih)
파싱 결과:
  - crop=min(iw     ← 첫 번째 인자
  - ih):min(iw      ← 필터 이름으로 해석됨!
  - ih)             ← 세 번째 인자
```

### 2.2 쉼표(,)가 파싱되는 이유

| 시도한 방법 | 결과 | 이유 |
|------------|------|------|
| `execAsync` (문자열) | 실패 | Windows cmd.exe가 쉼표를 특수 처리 |
| `execFileAsync` (배열) | 실패 | Windows에서 시스템 명령어 실행 시 내부적으로 cmd.exe 사용 가능 |
| `-filter_complex_script` | 실패 | FFmpeg 8.0.1에서 deprecated + 여전히 파싱 문제 |

### 2.3 FFmpeg 8.0.1 경고
```
-filter_complex_script is deprecated, use -/filter_complex 파일경로 instead
```

---

## 3. 해결책 비교

### 방법 A: spawn + windowsVerbatimArguments (권장)

```typescript
import { spawn } from 'child_process';

function runFFmpeg(ffmpegBin: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegBin, args, {
      shell: false,
      windowsVerbatimArguments: true,  // Windows에서 인자를 그대로 전달
    });

    let stderr = '';
    proc.stderr.on('data', (data) => stderr += data);
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}: ${stderr}`));
    });
    proc.on('error', reject);
  });
}
```

**장점**: 쉘 파싱 완전 우회
**단점**: 코드 변경 필요

---

### 방법 B: min() 함수 대신 고정 크롭 사용 (권장)

**문제**: `crop=min(iw,ih):min(iw,ih)` - 쉼표 포함
**해결**: `scale` + `crop` 조합으로 쉼표 없이 구현

```
변경 전: crop=min(iw,ih):min(iw,ih),scale=1080:1080
변경 후: scale=1080:1080:force_original_aspect_ratio=increase,crop=1080:1080
```

**동작 원리**:
1. `scale=1080:1080:force_original_aspect_ratio=increase`: 비율 유지하면서 1080 이상으로 확대
2. `crop=1080:1080`: 중앙에서 1080x1080 크롭

**장점**: min() 함수 불필요, 쉼표 파싱 문제 없음
**단점**: 없음

---

### 방법 C: 2단계 처리 (안전하지만 느림)

```typescript
// 1단계: xfade만 적용 (쉼표 없음)
await runFFmpeg(['-y', ...inputs, '-filter_complex', xfadeFilter, '-c:v', 'libx264', tempOutput]);

// 2단계: crop 적용 (단순 명령)
await runFFmpeg(['-y', '-i', tempOutput, '-vf', 'crop=1080:1080', finalOutput]);
```

**장점**: 각 단계가 단순해서 디버깅 용이
**단점**: 2번 인코딩으로 품질 저하 및 시간 증가

---

### 방법 D: fluent-ffmpeg 라이브러리

```bash
npm install fluent-ffmpeg
```

```typescript
import ffmpeg from 'fluent-ffmpeg';

ffmpeg()
  .input(video1)
  .input(video2)
  .complexFilter([...])
  .output(outputPath)
  .run();
```

**장점**: 인자 이스케이프 자동 처리
**단점**: 새 의존성 추가

---

### 방법 E: FFmpeg 8.0.1 새 문법

```
-/filter_complex 파일경로
```

**상태**: 테스트 필요

---

## 4. 선택한 해결책

### 최종 선택: 방법 B (scale + crop 조합)

**이유**:
1. 코드 변경이 최소화됨
2. 추가 의존성 없음
3. 쉼표가 포함된 `min()` 함수를 완전히 제거
4. 모든 플랫폼(Windows, Linux, Vercel)에서 동일하게 동작

### 변경 내용

```typescript
// 변경 전
filterComplex += '; [vout]crop=min(iw,ih):min(iw,ih),scale=1080:1080[final]';

// 변경 후
filterComplex += '; [vout]scale=1080:1080:force_original_aspect_ratio=increase,crop=1080:1080[final]';
```

---

## 5. 검증 방법

### 로컬 테스트
```bash
ffmpeg -y -i video1.mp4 -i video2.mp4 -i video3.mp4 \
  -filter_complex "[0:v][1:v]xfade=transition=fade:duration=1:offset=9[v0]; [v0][2:v]xfade=transition=fade:duration=1:offset=18[vout]; [vout]scale=1080:1080:force_original_aspect_ratio=increase,crop=1080:1080[final]" \
  -map "[final]" -c:v libx264 -preset fast output.mp4
```

### 검증 체크리스트
- [ ] Windows 로컬에서 3개 영상 합성 성공
- [ ] 크로스페이드 효과 정상 작동
- [ ] 1:1 비율 출력 확인
- [ ] Vercel 배포 후 테스트

---

## 6. 교훈

1. **FFmpeg 버전 확인 필수**: 8.0.1에서 `-filter_complex_script` deprecated
2. **Windows 쉘 파싱 주의**: `execFile`도 완전히 안전하지 않음
3. **복잡한 표현식 피하기**: `min(a,b)` 같은 쉼표 포함 함수 대신 대안 사용
4. **단계별 테스트**: 명령줄에서 먼저 테스트 후 코드 적용

---

## 7. 버전 히스토리

| 날짜 | 시도 | 결과 |
|------|------|------|
| 2026-01-22 | execAsync + 문자열 | 실패 - 쉼표 파싱 |
| 2026-01-22 | execFileAsync + 배열 | 실패 - 여전히 파싱됨 |
| 2026-01-22 | -filter_complex_script | 실패 - deprecated + 파싱 |
| 2026-01-22 | **spawn + windowsVerbatimArguments + scale+crop** | **적용됨 - 테스트 필요** |

---

## 8. 최종 적용된 변경 사항

### 변경 1: spawnAsync 함수 추가 (쉘 파싱 완전 우회)

```typescript
function spawnAsync(
  command: string,
  args: string[],
  options: { timeout?: number } = {}
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      shell: false,  // 쉘 사용 안 함
      windowsVerbatimArguments: true,  // Windows에서 인자를 그대로 전달
      windowsHide: true,
    });
    // ...
  });
}
```

### 변경 2: min() 함수 제거

```typescript
// 변경 전 (쉼표로 인한 파싱 오류)
filterComplex += '; [vout]crop=min(iw,ih):min(iw,ih),scale=1080:1080[final]';

// 변경 후 (쉼표 파싱 문제 없음)
filterComplex += ';[vout]scale=1080:1080:force_original_aspect_ratio=increase,crop=1080:1080[final]';
```

### 동작 원리
1. `scale=1080:1080:force_original_aspect_ratio=increase`: 비율 유지하면서 최소 1080px 이상으로 스케일
2. `crop=1080:1080`: 중앙에서 1080x1080 크롭

