import { NextRequest, NextResponse } from 'next/server';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Vercel Pro: max 300s (5min)
export const maxDuration = 300;

// Bundle caching: Create bundle once and reuse across requests
let cachedBundlePath: string | null = null;
let bundlePromise: Promise<string> | null = null;

async function getOrCreateBundle(entryPoint: string): Promise<string> {
  // If bundle already exists, return immediately
  if (cachedBundlePath) {
    console.log('Using cached Remotion bundle:', cachedBundlePath);
    return cachedBundlePath;
  }

  // If bundling is in progress, wait for it
  if (bundlePromise) {
    console.log('Waiting for ongoing bundle creation...');
    return bundlePromise;
  }

  // Start new bundling process
  console.log('Creating new Remotion bundle (first request)...');
  bundlePromise = bundle({ entryPoint }).then((bundlePath) => {
    cachedBundlePath = bundlePath;
    bundlePromise = null;
    console.log('Bundle created and cached:', bundlePath);
    return bundlePath;
  });

  return bundlePromise;
}

export async function POST(req: NextRequest) {
  const tempFiles: string[] = [];

  try {
    // Check if request is FormData or JSON
    const contentType = req.headers.get('content-type') || '';
    let videoDataUrl: string | undefined;
    let texts: string[] = [];
    let fontSize = 50; // 미리보기와 동일한 기본값
    let fontFamily = "'Noto Sans KR', sans-serif";
    let textColor = '#ffffff';
    let glowColor = '#00ffff';
    let effects: string[] = []; // 기본값: 이펙트 없음
    let textPosition: 'random' | 'top' | 'center' | 'bottom' = 'random';
    let referenceImageSrc: string | undefined; // 참조 이미지 (배경 제거된 로고/인물 사진)

    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (from ResultStep to avoid Base64 memory crash)
      console.log('Receiving FormData...');
      const formData = await req.formData();

      const videoFile = formData.get('video') as File;
      if (videoFile) {
        // Convert File to Base64 Data URL
        const arrayBuffer = await videoFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        videoDataUrl = `data:video/mp4;base64,${base64}`;
        console.log('Video file converted to Data URL');
      }

      const textsStr = formData.get('texts') as string;
      if (textsStr) {
        texts = JSON.parse(textsStr);
      }

      fontSize = parseInt(formData.get('fontSize') as string) || 50;
      fontFamily = (formData.get('fontFamily') as string) || "'Noto Sans KR', sans-serif";
      textColor = (formData.get('textColor') as string) || '#ffffff';
      glowColor = (formData.get('glowColor') as string) || '#00ffff';

      // effects 배열 파싱
      const effectsStr = formData.get('effects') as string;
      if (effectsStr) {
        try {
          effects = JSON.parse(effectsStr);
        } catch (e) {
          console.error('Failed to parse effects:', e);
        }
      }

      const textPosValue = formData.get('textPosition') as string;
      textPosition = (textPosValue as 'random' | 'top' | 'center' | 'bottom') || 'random';

      // 참조 이미지 파싱 (배경 제거된 로고/인물 사진 - Base64 Data URL)
      const refImage = formData.get('referenceImage') as string;
      if (refImage) {
        referenceImageSrc = refImage;
        console.log('Reference image received (length):', refImage.length);
      }
    } else {
      // Handle JSON (original method)
      const body = await req.json();
      videoDataUrl = body.videoDataUrl;
      texts = body.texts;
      fontSize = body.fontSize || 50;
      fontFamily = body.fontFamily || "'Noto Sans KR', sans-serif";
      textColor = body.textColor || '#ffffff';
      glowColor = body.glowColor || '#00ffff';
      effects = body.effects || [];
      textPosition = body.textPosition || 'random';
      referenceImageSrc = body.referenceImageSrc;
    }

    if (!videoDataUrl || !texts || !Array.isArray(texts)) {
      return NextResponse.json(
        { success: false, error: '영상 데이터 또는 텍스트가 없습니다.' },
        { status: 400 }
      );
    }

    console.log(`Starting Remotion text overlay rendering with ${texts.length} texts`);
    const timestamp = Date.now();
    const tempDir = os.tmpdir();

    // 1. Save Base64 video to temp file, then serve via HTTP (not file://)
    let videoSrcPath = videoDataUrl;
    let tempVideoFileName = '';

    if (videoDataUrl.startsWith('data:')) {
      console.log('Converting Base64 video to temp file for HTTP serving...');
      const matches = videoDataUrl.match(/^data:video\/([^;]+);base64,(.+)$/);
      if (matches) {
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        tempVideoFileName = `remotion_input_${timestamp}.mp4`;
        const tempVideoPath = path.join(tempDir, tempVideoFileName);
        fs.writeFileSync(tempVideoPath, buffer);
        tempFiles.push(tempVideoPath);

        // Use HTTP URL instead of file:// to prevent Chrome memory crash
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const host = req.headers.get('host') || 'localhost:3000';
        videoSrcPath = `${protocol}://${host}/api/temp-video/${tempVideoFileName}`;

        console.log(`Saved temp video and created HTTP URL: ${videoSrcPath}`);
      }
    }

    // Remotion Bundle
    const entryPoint = path.join(process.cwd(), 'src', 'remotion', 'index.ts');

    if (!fs.existsSync(entryPoint)) {
      throw new Error(`Remotion entry point not found at ${entryPoint}`);
    }

    // Use cached bundle if available (saves 3-5 minutes!)
    const bundled = await getOrCreateBundle(entryPoint);

    // Select Composition
    const compositionId = 'HologramTextOverlay';
    const composition = await selectComposition({
      serveUrl: bundled,
      id: compositionId,
      inputProps: {
        videoSrc: videoSrcPath, // Pass file path instead of huge Base64 string
        texts,
        fontSize,
        fontFamily,
        textColor,
        glowColor,
        effects, // 이펙트 배열 전달
        textPosition,
        referenceImageSrc, // 참조 이미지 (배경 제거된 로고/인물 사진)
      },
    });

    // Render Video
    const outputLocation = path.join(tempDir, `remotion_output_${timestamp}.mp4`);
    tempFiles.push(outputLocation);

    console.log('Rendering video...');

    // Calculate Duration: 5 seconds per text * 30 FPS (smooth playback)
    const fps = 30; // Restored to 30fps for smooth playback on standard displays
    const durationInFrames = texts.length * 5 * fps;

    // Optimized rendering settings for speed
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
        videoSrc: videoSrcPath,
        texts,
        fontSize,
        fontFamily,
        textColor,
        glowColor,
        effects, // 이펙트 배열 전달
        textPosition,
        referenceImageSrc, // 참조 이미지 (배경 제거된 로고/인물 사진)
      },
      // Performance settings (based on Remotion best practices)
      // High concurrency can SLOW DOWN rendering (GitHub issue #4949)
      concurrency: 4, // Fixed optimal value - higher values may decrease performance
      disallowParallelEncoding: false, // Enable parallel encoding
      videoBitrate: '3M', // Reduced from 5M for faster encoding
      timeoutInMilliseconds: 300000, // 5 minutes timeout
    });

    console.log('Render completed:', outputLocation);

    // Read result
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
      rendered: true,
      textCount: texts.length,
    });

  } catch (error: unknown) {
    console.error('Remotion Rendering Error:', error);
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
