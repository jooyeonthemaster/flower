import { NextRequest, NextResponse } from 'next/server';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Vercel Pro: max 300s (5min)
export const maxDuration = 300;

// Bundle caching
let cachedBundlePath: string | null = null;
let bundlePromise: Promise<string> | null = null;

async function getOrCreateBundle(entryPoint: string): Promise<string> {
  if (cachedBundlePath) {
    console.log('Using cached Remotion bundle:', cachedBundlePath);
    return cachedBundlePath;
  }

  if (bundlePromise) {
    console.log('Waiting for ongoing bundle creation...');
    return bundlePromise;
  }

  console.log('Creating new Remotion bundle...');
  bundlePromise = bundle({ entryPoint }).then((bundlePath) => {
    cachedBundlePath = bundlePath;
    bundlePromise = null;
    console.log('Bundle created and cached:', bundlePath);
    return bundlePath;
  });

  return bundlePromise;
}

/**
 * overlay-video-on-image API
 *
 * 배경 이미지 위에 텍스트 영상을 screen 블렌딩으로 오버레이합니다.
 *
 * 입력:
 * - backgroundImageUrl: 배경 이미지 URL (참조 이미지 포함된 AI 생성 배경)
 * - textVideoUrl: 텍스트 영상 URL (검은 배경 + 3D 텍스트 모션)
 * - duration: 영상 길이 (초, 기본값 5)
 *
 * 출력:
 * - videoUrl: 합성된 영상 Data URL
 */
export async function POST(req: NextRequest) {
  const tempFiles: string[] = [];

  try {
    const body = await req.json();
    const { backgroundImageUrl, textVideoUrl, duration = 5 } = body;

    if (!backgroundImageUrl || !textVideoUrl) {
      return NextResponse.json(
        { success: false, error: '배경 이미지와 텍스트 영상이 필요합니다.' },
        { status: 400 }
      );
    }

    console.log('Starting overlay-video-on-image rendering...');
    const timestamp = Date.now();
    const tempDir = os.tmpdir();

    // 1. 배경 이미지를 temp 파일로 저장 (Data URL인 경우)
    let bgImagePath = backgroundImageUrl;
    if (backgroundImageUrl.startsWith('data:')) {
      const matches = backgroundImageUrl.match(/^data:image\/([^;]+);base64,(.+)$/);
      if (matches) {
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        const tempBgPath = path.join(tempDir, `bg_${timestamp}.png`);
        fs.writeFileSync(tempBgPath, buffer);
        tempFiles.push(tempBgPath);

        // HTTP URL로 변환
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const host = req.headers.get('host') || 'localhost:3000';
        bgImagePath = `${protocol}://${host}/api/temp-video/${path.basename(tempBgPath)}`;
        console.log('Background image saved:', bgImagePath);
      }
    }

    // 2. 텍스트 영상을 temp 파일로 저장 (Data URL인 경우)
    let textVideoPath = textVideoUrl;
    if (textVideoUrl.startsWith('data:')) {
      const matches = textVideoUrl.match(/^data:video\/([^;]+);base64,(.+)$/);
      if (matches) {
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        const tempVideoPath = path.join(tempDir, `text_video_${timestamp}.mp4`);
        fs.writeFileSync(tempVideoPath, buffer);
        tempFiles.push(tempVideoPath);

        // HTTP URL로 변환
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const host = req.headers.get('host') || 'localhost:3000';
        textVideoPath = `${protocol}://${host}/api/temp-video/${path.basename(tempVideoPath)}`;
        console.log('Text video saved:', textVideoPath);
      }
    }

    // 3. Remotion Bundle
    const entryPoint = path.join(process.cwd(), 'src', 'remotion', 'index.ts');

    if (!fs.existsSync(entryPoint)) {
      throw new Error(`Remotion entry point not found at ${entryPoint}`);
    }

    const bundled = await getOrCreateBundle(entryPoint);

    // 4. Select Composition
    const compositionId = 'VideoOnImageOverlay';
    const fps = 30;
    const durationInFrames = duration * fps;

    const composition = await selectComposition({
      serveUrl: bundled,
      id: compositionId,
      inputProps: {
        backgroundImageSrc: bgImagePath,
        textVideoSrc: textVideoPath,
      },
    });

    // 5. Render Video
    const outputLocation = path.join(tempDir, `overlay_output_${timestamp}.mp4`);
    tempFiles.push(outputLocation);

    console.log('Rendering overlay video...');

    await renderMedia({
      composition: {
        ...composition,
        durationInFrames,
        fps,
      },
      serveUrl: bundled,
      codec: 'h264',
      outputLocation,
      inputProps: {
        backgroundImageSrc: bgImagePath,
        textVideoSrc: textVideoPath,
      },
      concurrency: 4,
      disallowParallelEncoding: false,
      videoBitrate: '4M',
      timeoutInMilliseconds: 300000,
    });

    console.log('Render completed:', outputLocation);

    // 6. Read result
    if (!fs.existsSync(outputLocation)) {
      throw new Error('Output file was not created');
    }

    const resultBuffer = fs.readFileSync(outputLocation);
    const resultBase64 = resultBuffer.toString('base64');
    const resultDataUrl = `data:video/mp4;base64,${resultBase64}`;

    // Cleanup
    cleanupTempFiles(tempFiles);

    return NextResponse.json({
      success: true,
      videoUrl: resultDataUrl,
    });

  } catch (error: unknown) {
    console.error('Overlay Video Error:', error);
    cleanupTempFiles(tempFiles);

    const errorMessage = error instanceof Error ? error.message : 'Render Failed';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

function cleanupTempFiles(files: string[]) {
  for (const file of files) {
    try {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    } catch (e) {
      console.error('Failed to cleanup file:', file, e);
    }
  }
}
