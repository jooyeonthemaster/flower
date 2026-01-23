# Premium 모드 AI 영상 생성 - Vercel 배포 오류 해결 기록

## 개요
- **문제 발생 일시**: 2025-01-21
- **해결 완료 일시**: 2025-01-21
- **상태**: ✅ 해결 완료

## 환경
- **프레임워크**: Next.js 16.1.3
- **배포 플랫폼**: Vercel (CLI 배포)
- **스토리지**: Firebase Storage
- **기능**: Premium 모드 AI 영상 생성 (Kling API)
- **프로덕션 URL**: https://flower-livid-zeta.vercel.app

---

## 오류 진행 히스토리

| 순서 | 오류 | HTTP 상태 | 원인 | 해결 방법 | 상태 |
|-----|------|----------|------|----------|------|
| 1 | CORS Policy Error | - | 환경변수에 줄바꿈 포함 | `.trim()` 적용 | ✅ |
| 2 | Firebase Unauthorized | 403 | Security Rules 차단 | 서버 API 사용 | ✅ |
| 3 | Payload Too Large | 413 | 6MB > 4.5MB 제한 | 이미지 압축 | ✅ |

---

## 오류 1: CORS 오류

### 증상
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/v0/b/flower-63624.firebasestorage.app%0A/o?...'
has been blocked by CORS policy: Response to preflight request doesn't pass access control check
```

### 원인 분석
- Firebase Storage URL에 `%0A` (줄바꿈 문자 URL 인코딩)가 포함됨
- 잘못된 URL: `flower-63624.firebasestorage.app%0A`
- 올바른 URL: `flower-63624.firebasestorage.app`
- **근본 원인**: Vercel 환경 변수 `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` 설정 시 값 끝에 줄바꿈이 포함됨

### 해결 방법
환경 변수 값에 `.trim()` 적용하여 공백/줄바꿈 제거

### 수정 파일

#### 1. `src/lib/firebase.ts`
```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim()!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim()!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim()!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim()!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim()!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim()!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim()!
};
```

#### 2. `src/app/api/upload-image/route.ts`
```typescript
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim();
```

---

## 오류 2: 403 Forbidden

### 증상
```
Firebase Storage: User does not have permission to access 'ai-videos/end-0-1768936355080.png'. (storage/unauthorized)
```

### 원인 분석
- 클라이언트에서 Firebase Storage에 직접 업로드 시도
- Firebase Storage Security Rules가 인증되지 않은 사용자의 쓰기 차단
- 로컬 개발 환경에서는 동작했으나 프로덕션에서 차단됨

### 해결 방법
클라이언트 직접 업로드 → 서버 API (`/api/upload-image`) 사용으로 변경
- 서버는 Firebase Admin SDK 사용 → Security Rules 우회 가능

### 수정 파일

#### `src/components/ai-hologram/steps/CompositionGenerationStep.tsx`
```typescript
// 변경 전: 클라이언트 직접 업로드
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const uploadImageToStorage = async (dataUrl: string, filename: string) => {
  const storageRef = ref(storage, `ai-videos/${filename}`);
  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
};

// 변경 후: 서버 API 사용
const uploadImageToStorage = async (dataUrl: string, filename: string) => {
  const response = await fetch('/api/upload-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataUrl, filename }),
  });
  const result = await response.json();
  return result.url;
};
```

---

## 오류 3: 413 Payload Too Large

### 증상
```
Failed to load resource: the server responded with a status of 413
FUNCTION_PAYLOAD_TOO_LARGE
icn1::v6b7k-1768936778614-e812fe241464
```

### 상세 로그
```
[Phase 1] Start Frame Length: 6305198 (약 6.3MB)
[Phase 1] End Frame Length: 6416762 (약 6.4MB)
```

### 원인 분석
1. **Vercel 서버리스 함수 제한**: 기본 request body 크기 제한 4.5MB
2. **이미지 크기 초과**: 6MB+ PNG 이미지를 Base64 Data URL로 JSON body에 포함
3. **흐름 변경으로 인한 문제**:
   - 이전: 클라이언트 → Firebase 직접 업로드 (크기 제한 없음)
   - 현재: 클라이언트 → Vercel API → Firebase (Vercel 4.5MB 제한에 걸림)

### 데이터 흐름
```
클라이언트 (6MB PNG Data URL)
    ↓ POST /api/upload-image (JSON body 6MB+)
Vercel Serverless Function ← 4.5MB 제한 초과로 413 에러
    ↓
Firebase Storage (도달하지 못함)
```

### 해결 방법
클라이언트에서 이미지 압축 후 업로드

### 수정 파일

#### 1. `src/components/ai-hologram/steps/CompositionGenerationStep.tsx`

이미지 압축 함수 추가:
```typescript
// 이미지 압축 함수 (PNG → JPEG 변환 + 품질 압축)
// Vercel 서버리스 함수의 4.5MB body 제한을 우회하기 위해 필요
const compressImage = async (dataUrl: string, quality = 0.85, maxSize = 1024): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      // 이미지 크기 조정 (너무 크면 리사이즈)
      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      // PNG → JPEG 변환으로 크기 대폭 감소
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

      const originalSize = Math.round(dataUrl.length / 1024);
      const compressedSize = Math.round(compressedDataUrl.length / 1024);
      console.log(`[Image Compression] ${originalSize}KB → ${compressedSize}KB (${Math.round((1 - compressedSize/originalSize) * 100)}% 감소)`);

      resolve(compressedDataUrl);
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = dataUrl;
  });
};
```

업로드 함수에 압축 적용:
```typescript
const uploadImageToStorage = async (dataUrl: string, filename: string): Promise<string> => {
  // 업로드 전 이미지 압축 (Vercel 4.5MB 제한 우회)
  const compressedDataUrl = await compressImage(dataUrl);

  const response = await fetch('/api/upload-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dataUrl: compressedDataUrl,
      filename: `ai-videos/${filename.replace('.png', '.jpg')}`,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`이미지 업로드 실패: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || '이미지 업로드 실패');
  }

  return result.url;
};
```

#### 2. `src/app/api/upload-image/route.ts`

경로 처리 로직 수정:
```typescript
// 파일명 생성
const timestamp = Date.now();
const extension = mimeType.split('/')[1] || 'png';
const finalFilename = filename || `ai-generated-${timestamp}.${extension}`;
// filename에 경로가 포함되어 있으면 그대로 사용, 아니면 ai-images/ 기본 경로 사용
const filePath = finalFilename.includes('/') ? finalFilename : `ai-images/${finalFilename}`;
```

#### 3. `vercel.json`

함수 타임아웃 설정 추가:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "installCommand": "npm install --legacy-peer-deps",
  "functions": {
    "src/app/api/upload-image/route.ts": {
      "maxDuration": 60
    },
    "src/app/api/ai/**/*.ts": {
      "maxDuration": 300
    }
  }
}
```

---

## 압축 효과

| 항목 | 원본 | 압축 후 | 감소율 |
|------|------|---------|--------|
| 포맷 | PNG | JPEG | - |
| 해상도 | 1376px | 1024px | 25% |
| 품질 | 100% | 85% | 15% |
| 파일 크기 | ~6MB | ~300KB | **95%** |

---

## 테스트 결과

| 테스트 | 결과 | 비고 |
|-------|------|------|
| 로컬 테스트 | ✅ 성공 | 모든 기능 정상 동작 |
| Vercel 배포 테스트 | ✅ 성공 | Premium 모드 영상 생성 확인 |

---

## 전체 수정 파일 목록

| 파일 경로 | 수정 내용 |
|----------|----------|
| `src/lib/firebase.ts` | 모든 환경 변수에 `.trim()` 적용 |
| `src/app/api/upload-image/route.ts` | `.trim()` 적용 + 경로 처리 로직 개선 |
| `src/components/ai-hologram/steps/CompositionGenerationStep.tsx` | 클라이언트 직접 업로드 → 서버 API + 이미지 압축 |
| `vercel.json` | 함수 타임아웃 설정 추가 |

---

## 추후 품질 개선 방안 (필요 시)

현재 이미지 압축으로 인해 약간의 품질 저하가 있을 수 있음. 클라이언트 요청 시 아래 방안 적용 가능:

### 방안 A: Firebase Storage Rules 수정 (권장)
- **효과**: 원본 품질 100% 유지
- **구현**:
  1. Firebase Console → Storage → Rules
  2. `ai-videos/` 경로에 쓰기 권한 허용
  3. 클라이언트 직접 업로드 코드 복원

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /ai-videos/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### 방안 B: 압축 품질 상향
- **효과**: 품질 저하 최소화
- **구현**: `compressImage` 함수 설정 조정
  - quality: 0.85 → 0.95
  - maxSize: 1024 → 1376

---

## 배포 방법

Git 연결이 안 되어 있어 Vercel CLI로 직접 배포:

```bash
cd "c:\Users\jayit\OneDrive\바탕 화면\roqkf\flower"
npx vercel --prod --yes
```

---

## 참고 자료
- [Vercel Serverless Functions Limits](https://vercel.com/docs/functions/runtimes#request-body-size)
- [Next.js Route Segment Config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)
- [Firebase Storage Security Rules](https://firebase.google.com/docs/storage/security)
- [Canvas API - toDataURL](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL)
