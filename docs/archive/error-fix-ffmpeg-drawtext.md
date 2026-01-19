# 오류 수정 기록

## 오류 정보
- **발생 시각**: 2026-01-10 17:30:00
- **파일 경로**: `src/app/api/ai/render-text-overlay/route.ts`
- **오류 메시지**:
  ```
  [AVFilterGraph @ 0000014f089f7580] No option name near '/WINDOWS/Fonts/malgun.ttf:fontsize=48:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:shadowcolor=black@0.5:shadowx=2:shadowy=2:alpha=if(lt(t,0.5),(t-0)/0.5,if(lt(t,4.5),1,(5-t)/0.5)):enable=between(t,0,5)'
  [AVFilterGraph @ 0000014f089f7580] Error parsing filterchain
  Error opening output files: Invalid argument
  ```

## 오류 원인

**FFmpeg drawtext 필터의 작은따옴표 충돌 문제**

현재 코드:
```typescript
const filter = `drawtext=text='${escapedText}':fontfile='${normalizedFontPath}':fontsize=${fontSize}:fontcolor=${textColor}:x=(w-text_w)/2:y=(h-text_h)/2:shadowcolor=black@0.5:shadowx=2:shadowy=2:alpha='${alphaExpr}':enable='${enableExpr}'`;
```

**문제점**:
1. **작은따옴표 중첩**: `text='...'`, `alpha='...'`, `enable='...'`에서 작은따옴표가 중첩됨
2. **이모지(🎊)**: 유니코드 문자가 작은따옴표 안에서 파싱 오류 유발
3. **표현식 내부 따옴표**: `alpha='if(lt(t,0.5),...)'`에서 작은따옴표가 FFmpeg 파서를 혼란시킴

FFmpeg는 작은따옴표로 감싼 값 내부에 또 다른 작은따옴표가 있으면 파싱 실패합니다.

---

## 수정 과정

### 시도 1 (2026-01-10 17:30:00)
**시도 내용**: alpha와 enable 표현식에서 작은따옴표 제거, textfile 옵션 사용
**결과**: 성공 (코드 수정 완료, 테스트 대기)
**상세**:
- 변경된 파일: `src/app/api/ai/render-text-overlay/route.ts` (174-190번 줄)
- 변경 내용:
  1. **textfile 옵션 사용**: 텍스트를 임시 파일(`.txt`)로 저장하여 이모지 및 특수문자 안전 처리
     ```typescript
     const textFilePath = path.join(tempDir, `text_${timestamp}_${i}.txt`);
     fs.writeFileSync(textFilePath, scene.text, 'utf8');
     ```

  2. **alpha 표현식에서 작은따옴표 제거**: `alpha='...'` → `alpha=...`
     ```typescript
     const alphaExpr = `if(lt(t,${scene.startTime + fadeIn}),(t-${scene.startTime})/${fadeIn},if(lt(t,${endTime - fadeOut}),1,(${endTime}-t)/${fadeOut}))`;
     ```

  3. **enable 표현식에서 작은따옴표 제거**: `enable='...'` → `enable=...`
     ```typescript
     const enableExpr = `between(t,${scene.startTime},${endTime})`;
     ```

  4. **최종 필터**:
     ```typescript
     const filter = `drawtext=textfile='${textFilePath}':fontfile='${normalizedFontPath}':fontsize=${fontSize}:fontcolor=${textColor}:x=(w-text_w)/2:y=(h-text_h)/2:shadowcolor=black@0.5:shadowx=2:shadowy=2:alpha=${alphaExpr}:enable=${enableExpr}`;
     ```

  5. **오타 수정**: `scene.startStart` → `scene.startTime`

- 결과 메시지: 코드 수정 완료, 사용자 테스트 대기 중

---

## 해결 방안

**핵심 변경사항**:
1. **textfile 옵션**: 이모지(🎊)와 한글을 포함한 텍스트를 UTF-8 파일로 저장하여 안전하게 전달
2. **표현식 작은따옴표 제거**: FFmpeg는 표현식(`alpha`, `enable`)에 작은따옴표가 있으면 파싱 실패
3. **임시 파일 관리**: 텍스트 파일도 `tempFiles` 배열에 추가하여 자동 정리

### 적용된 변경 사항
1. 텍스트를 임시 `.txt` 파일로 저장 (`text_${timestamp}_${i}.txt`)
2. `drawtext` 필터에서 `text='...'` 대신 `textfile='...'` 사용
3. `alpha`와 `enable` 표현식에서 작은따옴표 완전 제거
4. 타이포 수정 (`startStart` → `startTime`)

---

## 사용자 확인
- [ ] 사용자 확인 대기 중
- [ ] 사용자 확인 완료

---

## 최종 상태
**상태**: 진행 중 (코드 수정 완료, 실제 테스트 대기)
**완료 시각**: -
**비고**: 사용자가 실제 영상 생성 테스트 후 "잘 작동한다" 확인 필요
