/**
 * Remotion 서버사이드 렌더링 서비스
 * Vercel 서버리스 환경에서 Remotion을 사용하여 비디오 렌더링
 */

import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import os from 'os';

// 타입 정의
interface RenderOptions {
  videoSrc: string;
  texts: string[];
  fontFamily: string;
  fontSize: number;
  textColor: string;
  glowColor: string;
  effects: string[];
  textPosition: 'random' | 'top' | 'center' | 'bottom';
  referenceImageSrc?: string;
}

// Chromium 바이너리 경로 가져오기 (Vercel 서버리스용)
async function getChromiumExecutablePath(): Promise<string | undefined> {
  // 로컬 개발 환경에서는 시스템 Chrome 사용
  if (process.env.NODE_ENV === 'development') {
    return undefined; // Remotion이 자동으로 찾음
  }

  // Vercel 서버리스 환경
  try {
    const chromium = await import('@sparticuz/chromium');
    return await chromium.default.executablePath();
  } catch {
    console.log('Chromium not available, using system browser');
    return undefined;
  }
}

// 번들 캐시 (메모리에 경로 저장)
let bundleCache: string | null = null;

/**
 * Remotion 컴포지션 번들 생성 또는 캐시된 번들 반환
 */
async function getOrCreateBundle(): Promise<string> {
  if (bundleCache && fs.existsSync(bundleCache)) {
    console.log('Using cached Remotion bundle:', bundleCache);
    return bundleCache;
  }

  console.log('Creating new Remotion bundle...');
  const entryPoint = path.join(process.cwd(), 'src', 'remotion', 'index.ts');

  // 엔트리 포인트 존재 확인
  if (!fs.existsSync(entryPoint)) {
    throw new Error(`Remotion entry point not found: ${entryPoint}`);
  }

  const bundleDir = path.join(os.tmpdir(), 'remotion-bundle');

  bundleCache = await bundle({
    entryPoint,
    outDir: bundleDir,
    onProgress: (progress) => {
      if (progress % 20 === 0) {
        console.log(`Bundling: ${progress}%`);
      }
    },
  });

  console.log('Remotion bundle created:', bundleCache);
  return bundleCache;
}

/**
 * Remotion을 사용하여 비디오 렌더링
 */
export async function renderWithRemotion(
  options: RenderOptions,
  outputPath: string
): Promise<void> {
  const {
    videoSrc,
    texts,
    fontFamily,
    fontSize,
    textColor,
    glowColor,
    effects,
    textPosition,
    referenceImageSrc,
  } = options;

  // 번들 생성 또는 캐시 사용
  const bundlePath = await getOrCreateBundle();

  // Chromium 경로
  const chromiumPath = await getChromiumExecutablePath();
  console.log('Using Chromium:', chromiumPath || 'system default');

  // 컴포지션 선택 (타임아웃 120초로 증가)
  const composition = await selectComposition({
    serveUrl: bundlePath,
    id: 'HologramTextOverlay',
    inputProps: {
      videoSrc,
      texts,
      fontFamily,
      fontSize,
      textColor,
      glowColor,
      effects,
      textPosition,
      referenceImageSrc,
    },
    browserExecutable: chromiumPath,
    timeoutInMilliseconds: 300000, // 300초 (5분) - 브라우저 설정용
  });

  console.log('Selected composition:', composition.id);
  console.log('Duration:', composition.durationInFrames, 'frames');

  // 렌더링 (타임아웃 300초 = 5분)
  await renderMedia({
    composition,
    serveUrl: bundlePath,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps: {
      videoSrc,
      texts,
      fontFamily,
      fontSize,
      textColor,
      glowColor,
      effects,
      textPosition,
      referenceImageSrc,
    },
    browserExecutable: chromiumPath,
    timeoutInMilliseconds: 1200000, // 1200초
    concurrency: 8, // [Optimized] 4 -> 8 (병렬 처리 증가로 속도 향상)
    onProgress: ({ progress }) => {
      if (Math.round(progress * 100) % 10 === 0) {
        console.log(`Rendering: ${Math.round(progress * 100)}%`);
      }
    },
  });

  console.log('Remotion rendering complete:', outputPath);
}

/**
 * Remotion 사용 가능 여부 확인
 */
export async function isRemotionAvailable(): Promise<boolean> {
  try {
    // 엔트리 포인트 확인
    const entryPoint = path.join(process.cwd(), 'src', 'remotion', 'index.ts');
    if (!fs.existsSync(entryPoint)) {
      console.log('Remotion entry point not found');
      return false;
    }

    // Chromium 사용 가능 여부 확인 (Vercel 환경)
    if (process.env.VERCEL) {
      try {
        const chromium = await import('@sparticuz/chromium');
        await chromium.default.executablePath();
      } catch {
        console.log('Chromium not available on Vercel');
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}
