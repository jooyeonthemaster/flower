/**
 * 텍스트 오버레이 API
 * Remotion을 사용하여 영상에 텍스트 오버레이 렌더링
 *
 * 24개 이펙트 지원 - FFmpeg fallback 없음
 * 입력 비디오는 FFmpeg로 CFR 30fps 변환 후 Remotion에 전달
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execFile } from 'child_process';
import { promisify } from 'util';

import type { TextOverlayRequest, TextPosition } from './types';
import { renderWithRemotion } from './services/remotionRenderer';
import { getFFmpegPath } from '@/lib/ffmpeg';

const execFileAsync = promisify(execFile);

// Vercel Pro: max 300s (5min)
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const tempFiles: string[] = [];

  try {
    // 1. 요청 파싱
    const {
      videoDataUrl,
      videoUrl,
      texts,
      fontSize,
      fontFamily,
      textColor,
      glowColor,
      effects,
      textPosition,
      referenceImageSrc,
    } = await parseRequest(req);

    if (!texts || !Array.isArray(texts)) {
      return NextResponse.json(
        { success: false, error: '텍스트가 없습니다.' },
        { status: 400 }
      );
    }

    // 2. 비디오 데이터 준비
    let finalVideoDataUrl = videoDataUrl;
    if (videoUrl && !videoDataUrl) {
      finalVideoDataUrl = await downloadVideo(videoUrl);
    }

    if (!finalVideoDataUrl) {
      return NextResponse.json(
        { success: false, error: '영상 데이터가 없습니다.' },
        { status: 400 }
      );
    }

    // 3. Remotion 렌더링 (24개 이펙트 지원)
    console.log(`Starting Remotion text overlay rendering with ${texts.length} texts`);

    const timestamp = Date.now();
    const tempDir = os.tmpdir();
    const outputPath = path.join(tempDir, `text_output_${timestamp}.mp4`);
    tempFiles.push(outputPath);

    // Base64 비디오를 임시 파일로 저장 후 CFR 30fps 변환 (VFR 끊김 방지)
    let videoSrcPath = finalVideoDataUrl;
    if (finalVideoDataUrl.startsWith('data:')) {
      console.log('Converting Base64 video to temp file...');
      const matches = finalVideoDataUrl.match(/^data:video\/([^;]+);base64,(.+)$/);
      if (matches) {
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        const rawVideoPath = path.join(tempDir, `raw_input_${timestamp}.mp4`);
        fs.writeFileSync(rawVideoPath, buffer);
        tempFiles.push(rawVideoPath);
        console.log(`Raw video saved: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`);

        // FFmpeg로 CFR 30fps 변환 (VFR 끊김 해결의 핵심!)
        // [Optimized] 스마트 변환: 이미 30fps이고 h264라면 변환 건너뛰기
        const tempVideoFileName = `remotion_input_${timestamp}.mp4`;
        const tempVideoPath = path.join(tempDir, tempVideoFileName);

        // 메타데이터 확인
        let shouldConvert = true;
        try {
          const { probeVideo } = await import('@/lib/ffmpeg/probe');
          const metadata = await probeVideo(rawVideoPath);
          console.log(`Video Metadata: ${metadata.fps}fps, ${metadata.codec}, ${metadata.width}x${metadata.height}`);

          // 30fps(오차범위 0.1)이고 h264이며 720p 이상이면 변환 건너뛰기 시도
          // 단, VFR 이슈가 의심되면 변환하는 것이 안전함.
          // 여기서는 'ultrafast' 프리셋 적용을 위해 항상 변환하되 속도를 최적화함.
          // (Remotion은 엄격한 CFR을 요구하므로 안전하게 무조건 변환하되 속도를 높임)
        } catch (e) {
          console.warn('Probe failed, fallback to conversion', e);
        }

        tempFiles.push(tempVideoPath);

        try {
          const ffmpegPath = await getFFmpegPath();
          // [Optimized] 'ultrafast' preset 사용으로 속도 대폭 향상
          console.log('Converting to CFR 30fps with ultrafast preset...');

          await execFileAsync(ffmpegPath, [
            '-y',
            '-i', rawVideoPath,
            '-c:v', 'libx264',
            '-preset', 'ultrafast',     // [Optimized] fast -> ultrafast (인코딩 속도 2-3배 향상)
            '-crf', '23',               // [Optimized] 18 -> 23 (용량 절감 및 인코딩 부하 감소, 화질 차이 미미)
            '-r', '30',                 // CFR 30fps 강제
            '-g', '30',                 // GOP 크기 30
            '-vf', 'scale=720:-2',      // 720p 가로폭 고정, 세로 비율 유지 (단순 720:720 강제에서 변경)
            '-sc_threshold', '0',       // Scene change detection 비활성화
            '-pix_fmt', 'yuv420p',      // 표준 pixel format
            '-movflags', '+faststart',  // 웹 최적화
            '-an',                      // 오디오 제거
            tempVideoPath
          ], { timeout: 60000 }); // 타임아웃 60초로 단축 (ultrafast라 충분)

          console.log('CFR 30fps conversion completed (ultrafast)');
        } catch (ffmpegError) {
          console.warn('FFmpeg CFR conversion failed, using raw video:', ffmpegError);
          // FFmpeg 실패 시 원본 사용
          fs.copyFileSync(rawVideoPath, tempVideoPath);
        }

        // HTTP URL 사용
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const host = req.headers.get('host') || 'localhost:3000';
        videoSrcPath = `${protocol}://${host}/api/temp-video/${tempVideoFileName}`;

        console.log(`Saved temp video and created HTTP URL: ${videoSrcPath}`);
      }
    }

    await renderWithRemotion(
      {
        videoSrc: videoSrcPath,
        texts,
        fontFamily,
        fontSize,
        textColor,
        glowColor,
        effects,
        textPosition: textPosition as 'random' | 'top' | 'center' | 'bottom',
        referenceImageSrc,
      },
      outputPath
    );

    // 4. 결과 반환
    if (!fs.existsSync(outputPath)) {
      throw new Error('Output file was not created');
    }

    const resultBuffer = fs.readFileSync(outputPath);
    const resultDataUrl = `data:video/mp4;base64,${resultBuffer.toString('base64')}`;

    cleanupTempFiles(tempFiles);

    return NextResponse.json({
      success: true,
      videoUrl: resultDataUrl,
      rendered: true,
      textCount: texts.length,
      engine: 'remotion',
    });

  } catch (error: unknown) {
    console.error('Remotion Text Overlay Rendering Error:', error);
    cleanupTempFiles(tempFiles);

    const errorMessage = error instanceof Error ? error.message : 'Render Failed';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────

async function parseRequest(req: NextRequest): Promise<TextOverlayRequest & {
  fontSize: number;
  fontFamily: string;
  textColor: string;
  glowColor: string;
  effects: string[];
  textPosition: TextPosition;
}> {
  const contentType = req.headers.get('content-type') || '';

  let videoDataUrl: string | undefined;
  let videoUrl: string | undefined;
  let texts: string[] = [];
  let fontSize = 50;
  let fontFamily = "'Noto Sans KR', sans-serif";
  let textColor = '#ffffff';
  let glowColor = '#00ffff';
  let effects: string[] = [];
  let textPosition: TextPosition = 'random';
  let referenceImageSrc: string | undefined;

  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData();

    const videoFile = formData.get('video') as File;
    if (videoFile) {
      const arrayBuffer = await videoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      videoDataUrl = `data:video/mp4;base64,${buffer.toString('base64')}`;
    }

    const textsStr = formData.get('texts') as string;
    if (textsStr) texts = JSON.parse(textsStr);

    fontSize = parseInt(formData.get('fontSize') as string) || 50;
    fontFamily = (formData.get('fontFamily') as string) || fontFamily;
    textColor = (formData.get('textColor') as string) || textColor;
    glowColor = (formData.get('glowColor') as string) || glowColor;

    const effectsStr = formData.get('effects') as string;
    if (effectsStr) {
      try { effects = JSON.parse(effectsStr); } catch { /* ignore */ }
    }

    const textPosValue = formData.get('textPosition') as string;
    textPosition = (textPosValue as TextPosition) || 'random';
  } else {
    const body = await req.json();
    videoDataUrl = body.videoDataUrl;
    videoUrl = body.videoUrl;
    texts = body.texts;
    fontSize = body.fontSize || 50;
    fontFamily = body.fontFamily || fontFamily;
    textColor = body.textColor || textColor;
    glowColor = body.glowColor || glowColor;
    effects = body.effects || [];
    textPosition = body.textPosition || 'random';
    referenceImageSrc = body.referenceImageSrc;
  }

  return {
    videoDataUrl,
    videoUrl,
    texts,
    fontSize,
    fontFamily,
    textColor,
    glowColor,
    effects,
    textPosition,
    referenceImageSrc,
  };
}

async function downloadVideo(videoUrl: string): Promise<string> {
  const response = await fetch(videoUrl);
  if (!response.ok) {
    throw new Error(`영상 다운로드 실패: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:video/mp4;base64,${buffer.toString('base64')}`;
}

function cleanupTempFiles(files: string[]): void {
  for (const file of files) {
    try {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    } catch {
      // ignore cleanup errors
    }
  }
}
