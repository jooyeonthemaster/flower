import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';

import { getFFmpegPath, cleanupTempFiles } from '@/lib/ffmpeg';

const execFileAsync = promisify(execFile);

// Vercel Pro: max 300s (5min)
export const maxDuration = 300;

/**
 * overlay-video-on-image API
 *
 * 배경 이미지 위에 텍스트 영상을 screen 블렌딩으로 오버레이합니다.
 * FFmpeg의 overlay 필터와 blend 모드를 사용합니다.
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

    console.log('Starting FFmpeg overlay-video-on-image rendering...');
    const timestamp = Date.now();
    const tempDir = os.tmpdir();

    // 1. FFmpeg 경로 확인
    let ffmpegBin: string;
    try {
      ffmpegBin = await getFFmpegPath();
    } catch (e) {
      console.error('FFmpeg not found:', e);
      return NextResponse.json(
        { success: false, error: 'FFmpeg를 찾을 수 없습니다.' },
        { status: 500 }
      );
    }

    // 2. 배경 이미지 저장
    const bgImagePath = path.join(tempDir, `bg_${timestamp}.png`);
    tempFiles.push(bgImagePath);

    if (backgroundImageUrl.startsWith('data:')) {
      const matches = backgroundImageUrl.match(/^data:image\/([^;]+);base64,(.+)$/);
      if (matches) {
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(bgImagePath, buffer);
        console.log(`Background image saved: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`);
      } else {
        throw new Error('Invalid background image data URL format');
      }
    } else {
      // 외부 URL에서 다운로드
      console.log('Downloading background image from URL...');
      const response = await fetch(backgroundImageUrl);
      if (!response.ok) {
        throw new Error(`배경 이미지 다운로드 실패: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(bgImagePath, buffer);
      console.log(`Background image downloaded: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`);
    }

    // 3. 텍스트 영상 저장
    const textVideoPath = path.join(tempDir, `text_video_${timestamp}.mp4`);
    tempFiles.push(textVideoPath);

    if (textVideoUrl.startsWith('data:')) {
      const matches = textVideoUrl.match(/^data:video\/([^;]+);base64,(.+)$/);
      if (matches) {
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(textVideoPath, buffer);
        console.log(`Text video saved: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`);
      } else {
        throw new Error('Invalid text video data URL format');
      }
    } else {
      // 외부 URL에서 다운로드
      console.log('Downloading text video from URL...');
      const response = await fetch(textVideoUrl);
      if (!response.ok) {
        throw new Error(`텍스트 영상 다운로드 실패: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(textVideoPath, buffer);
      console.log(`Text video downloaded: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`);
    }

    // 4. FFmpeg로 오버레이 합성
    // filter_complex:
    // - [0:v] 배경 이미지를 영상으로 변환 (loop, fps 설정)
    // - [1:v] 텍스트 영상
    // - blend=all_mode=screen 또는 overlay 필터 사용
    const outputPath = path.join(tempDir, `overlay_output_${timestamp}.mp4`);
    tempFiles.push(outputPath);

    console.log('Executing FFmpeg overlay...');

    // FFmpeg 명령어:
    // 배경 이미지를 영상으로 변환하고, 그 위에 텍스트 영상을 screen 블렌딩으로 합성
    // Screen 블렌딩: 어두운 부분(검은색)이 투명해지는 효과
    const ffmpegArgs = [
      '-y',
      // 입력 1: 배경 이미지를 영상으로 변환
      '-loop', '1',
      '-t', duration.toString(),
      '-i', bgImagePath,
      // 입력 2: 텍스트 영상
      '-i', textVideoPath,
      // 필터: screen 블렌딩으로 합성
      '-filter_complex',
      '[0:v]fps=30,format=rgb24[bg];' +
      '[1:v]fps=30,format=rgb24,scale=1080:1080:force_original_aspect_ratio=decrease,pad=1080:1080:(ow-iw)/2:(oh-ih)/2[fg];' +
      '[bg][fg]blend=all_mode=screen:all_opacity=1[out]',
      '-map', '[out]',
      // 출력 설정
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '18',
      '-r', '30',
      '-g', '30',
      '-sc_threshold', '0',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      '-t', duration.toString(),
      outputPath
    ];

    try {
      await execFileAsync(ffmpegBin, ffmpegArgs, { timeout: 240000 });
    } catch (ffmpegError) {
      console.error('FFmpeg execution error:', ffmpegError);
      const errMsg = ffmpegError instanceof Error ? ffmpegError.message : 'Unknown FFmpeg error';
      throw new Error(`FFmpeg 실행 실패: ${errMsg}`);
    }

    console.log('FFmpeg overlay completed');

    // 5. 결과 파일 확인
    if (!fs.existsSync(outputPath)) {
      throw new Error('Output file was not created');
    }

    const resultBuffer = fs.readFileSync(outputPath);
    const resultBase64 = resultBuffer.toString('base64');
    const resultDataUrl = `data:video/mp4;base64,${resultBase64}`;

    console.log(`Output video size: ${(resultBuffer.length / 1024 / 1024).toFixed(2)}MB`);

    // Cleanup
    cleanupTempFiles(tempFiles);

    return NextResponse.json({
      success: true,
      videoUrl: resultDataUrl,
      engine: 'ffmpeg-blend',
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

