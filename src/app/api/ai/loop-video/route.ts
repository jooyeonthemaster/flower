import { NextRequest, NextResponse } from 'next/server';
import { exec, execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';
import ffmpegPath from 'ffmpeg-static';

const execAsync = promisify(exec);
const execFileAsync = promisify(execFile);

// Vercel Pro: 최대 300초 (5분)
export const maxDuration = 300;

async function getFFmpegPath(): Promise<string> {
  // Priority 1: Environment variable (for manual override)
  if (process.env.FFMPEG_BIN) {
    console.log('Using FFmpeg from FFMPEG_BIN:', process.env.FFMPEG_BIN);
    return process.env.FFMPEG_BIN;
  }

  // Priority 2: System FFmpeg (most reliable on Windows/production)
  try {
    await execAsync('ffmpeg -version', { timeout: 5000 });
    console.log('Using system FFmpeg');
    return 'ffmpeg';
  } catch (sysError) {
    console.log('System FFmpeg not found, trying ffmpeg-static...');
  }

  // Priority 3: ffmpeg-static package (fallback)
  if (ffmpegPath && typeof ffmpegPath === 'string') {
    // Validate that the path doesn't contain invalid patterns like '\ROOT\'
    if (ffmpegPath.includes('\\ROOT\\') || ffmpegPath.includes('/ROOT/')) {
      console.error('Invalid ffmpeg-static path detected:', ffmpegPath);
      throw new Error('ffmpeg-static returned an invalid path. Please install FFmpeg on your system or set FFMPEG_BIN environment variable.');
    }

    // Verify the file actually exists
    if (fs.existsSync(ffmpegPath)) {
      console.log('Using ffmpeg-static:', ffmpegPath);
      return ffmpegPath;
    } else {
      console.error('ffmpeg-static path does not exist:', ffmpegPath);
    }
  }

  throw new Error('FFmpeg not found. Please install FFmpeg on your system or set FFMPEG_BIN environment variable.');
}

export async function POST(req: NextRequest) {
  const tempFiles: string[] = [];

  try {
    const body = await req.json();
    const { videoDataUrl, videoUrl, loopCount = 6, cropTo1x1 = false, trimToSeconds = 0 } = body;

    // videoUrl (외부 URL) 또는 videoDataUrl (Base64) 둘 중 하나 필요
    const inputSource = videoUrl || videoDataUrl;
    if (!inputSource) {
      return NextResponse.json(
        { success: false, error: '영상 데이터가 없습니다.' },
        { status: 400 }
      );
    }

    console.log(`Starting video loop: ${loopCount} times, cropTo1x1: ${cropTo1x1}, trimToSeconds: ${trimToSeconds}`);

    // FFmpeg 경로 가져오기
    let currentFfmpegPath: string;
    try {
      currentFfmpegPath = await getFFmpegPath();
    } catch (e) {
      console.log('FFmpeg not available, returning original video for client-side loop');
      return NextResponse.json({
        success: true,
        videoUrl: inputSource,
        warning: 'FFmpeg를 사용할 수 없어 원본 영상이 반환됩니다. 클라이언트에서 반복 재생됩니다.',
        looped: false,
        loopCount: loopCount,
        estimatedDuration: 5, // 원본 5초
      });
    }

    const timestamp = Date.now();
    const tempDir = os.tmpdir();
    let inputPath: string;

    // 입력 소스에 따라 다르게 처리
    if (videoUrl && !videoUrl.startsWith('data:')) {
      // 외부 URL인 경우: fetch로 다운로드
      console.log('Fetching video from URL:', videoUrl);
      const videoResponse = await fetch(videoUrl);
      if (!videoResponse.ok) {
        throw new Error(`영상 다운로드 실패: ${videoResponse.status}`);
      }
      const arrayBuffer = await videoResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      inputPath = path.join(tempDir, `input_${timestamp}.mp4`);
      fs.writeFileSync(inputPath, buffer);
      tempFiles.push(inputPath);
      console.log(`Input video downloaded: ${inputPath} (${buffer.length} bytes)`);
    } else {
      // Base64 Data URL인 경우
      const dataUrlSource = videoUrl || videoDataUrl;
      const matches = dataUrlSource.match(/^data:video\/([^;]+);base64,(.+)$/);
      if (!matches) {
        throw new Error('유효하지 않은 영상 Data URL 형식입니다.');
      }

      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      inputPath = path.join(tempDir, `input_${timestamp}.mp4`);
      fs.writeFileSync(inputPath, buffer);
      tempFiles.push(inputPath);
      console.log(`Input video saved: ${inputPath} (${buffer.length} bytes)`);
    }

    // 2. Ping-pong 루프 생성: "Sanitize First" 전략
    // Step 0: 원본을 CFR 30fps로 표준화 (VFR → CFR 변환으로 근본 원인 해결)
    // Step 1: 표준화된 비디오에서 역방향 생성
    // Step 2: 동일 스펙의 비디오 concat
    // Step 3: ping-pong 반복
    const sanitizedPath = path.join(tempDir, `sanitized_${timestamp}.mp4`);
    const reversedPath = path.join(tempDir, `reversed_${timestamp}.mp4`);
    const pingPongPath = path.join(tempDir, `pingpong_${timestamp}.mp4`);
    const outputPath = path.join(tempDir, `looped_${timestamp}.mp4`);
    const concatListPath = path.join(tempDir, `concat_${timestamp}.txt`);

    tempFiles.push(sanitizedPath, reversedPath, pingPongPath, outputPath, concatListPath);

    try {
      // Step 0 (NEW): 원본 비디오를 CFR 30fps로 표준화
      // 이것이 VFR → CFR 변환의 핵심! AI 생성 비디오의 불규칙한 타임스탬프를 먼저 정리
      // cropTo1x1: 16:9 → 1:1 중앙 크롭 (홀로그램 팬용)
      const videoFilters: string[] = [];

      if (cropTo1x1) {
        // 16:9 → 1:1 중앙 크롭: crop=높이:높이:(너비-높이)/2:0
        // 예: 1920x1080 → crop=1080:1080:420:0
        videoFilters.push('crop=ih:ih:(iw-ih)/2:0');
        console.log('Step 0: Sanitizing + cropping to 1:1 (center crop)...');
      } else {
        console.log('Step 0: Sanitizing input video to CFR 30fps with GOP optimization...');
      }

      // 영상 길이 트림 (예: 8초 → 5초)
      const trimArgs: string[] = [];
      if (trimToSeconds > 0) {
        trimArgs.push('-t', trimToSeconds.toString());
        console.log(`Trimming video to first ${trimToSeconds} seconds`);
      }

      const sanitizeArgs = [
        '-y',
        '-i', inputPath,            // AI 원본 (VFR, 불규칙 PTS/DTS)
        ...trimArgs,                // 영상 길이 트림 (선택)
        ...(videoFilters.length > 0 ? ['-vf', videoFilters.join(',')] : []),
        '-c:v', 'libx264',          // H.264 코덱
        '-preset', 'ultrafast',     // 빠른 인코딩
        '-crf', '18',               // 거의 무손실 품질
        '-r', '30',                 // CFR 30fps 강제 (핵심!)
        '-g', '30',                 // GOP 크기 30 (1초마다 keyframe, Remotion seeking 최적화)
        '-sc_threshold', '0',       // Scene change detection 비활성화 (일관된 GOP 보장)
        '-pix_fmt', 'yuv420p',      // 표준 pixel format
        '-movflags', '+faststart',  // 웹 최적화
        sanitizedPath
      ];

      await execFileAsync(currentFfmpegPath, sanitizeArgs, { timeout: 60000 });

      const sanitizedSize = fs.existsSync(sanitizedPath) ? fs.statSync(sanitizedPath).size : 0;
      console.log(`Sanitized video created: ${(sanitizedSize / 1024 / 1024).toFixed(2)}MB`);

      // Step 1: 표준화된 비디오에서 역방향 생성
      console.log('Step 1: Creating reversed video from sanitized source...');
      await execFileAsync(currentFfmpegPath, [
        '-y',
        '-i', sanitizedPath,        // ✅ sanitized 사용 (inputPath 아님!)
        '-vf', 'reverse,trim=start=0.033', // reverse + 첫 프레임 제거 (중복 방지)
        '-af', 'areverse',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-crf', '18',
        '-r', '30',
        '-g', '30',
        '-sc_threshold', '0',
        '-pix_fmt', 'yuv420p',
        reversedPath
      ], { timeout: 60000 });

      console.log('Reversed video created');

      // Step 2: 정방향 + 역방향 concat (둘 다 동일한 CFR 30fps 스펙!)
      console.log('Step 2: Concatenating sanitized + reversed (identical specs)...');
      // concat 리스트 파일 생성
      const concatContent = `file '${sanitizedPath.replace(/\\/g, '/')}'\nfile '${reversedPath.replace(/\\/g, '/')}'`;
      fs.writeFileSync(concatListPath, concatContent);

      // ✅ -c copy 사용 가능! (둘 다 동일한 인코딩 스펙이므로 재인코딩 불필요)
      await execFileAsync(currentFfmpegPath, [
        '-y',
        '-f', 'concat',
        '-safe', '0',
        '-i', concatListPath,
        '-c', 'copy',               // ✅ copy 사용 (빠르고 무손실)
        pingPongPath
      ], { timeout: 30000 });

      console.log('Ping-pong base created with stream copy (no re-encoding)');

      // Step 3: ping-pong 반복 (3번 = 약 30초)
      const pingPongRepeat = Math.ceil(loopCount / 2) - 1;
      console.log(`Step 3: Repeating ping-pong ${pingPongRepeat + 1} times...`);

      // ✅ -c copy 사용 가능! (이미 완벽한 CFR 30fps)
      await execFileAsync(currentFfmpegPath, [
        '-y',
        '-stream_loop', pingPongRepeat.toString(),
        '-i', pingPongPath,
        '-c', 'copy',               // ✅ copy 사용 (빠르고 무손실)
        outputPath
      ], { timeout: 60000 });

      console.log('Ping-pong loop creation completed (stream copy, perfect CFR 30fps)');
    } catch (ffmpegError) {
      console.error('FFmpeg execution error:', ffmpegError);

      // FFmpeg 실행 실패 시 원본 영상 반환
      cleanupTempFiles(tempFiles);

      return NextResponse.json({
        success: true,
        videoUrl: videoDataUrl,
        warning: 'FFmpeg 실행 중 오류가 발생하여 원본 영상이 반환됩니다. 클라이언트에서 ping-pong 재생됩니다.',
        looped: false,
        loopCount: loopCount,
        estimatedDuration: 5,
      });
    }

    // 4. 결과 파일 읽기
    if (!fs.existsSync(outputPath)) {
      throw new Error('루프된 영상 파일이 생성되지 않았습니다.');
    }

    const resultBuffer = fs.readFileSync(outputPath);
    const resultBase64 = resultBuffer.toString('base64');
    const resultDataUrl = `data:video/mp4;base64,${resultBase64}`;

    console.log(`Video loop completed. Output size: ${resultBuffer.length} bytes`);

    // 5. 임시 파일 정리
    cleanupTempFiles(tempFiles);

    return NextResponse.json({
      success: true,
      videoUrl: resultDataUrl,
      looped: true,
      loopCount: loopCount,
      estimatedDuration: loopCount * 5, // 5초 × loopCount
    });

  } catch (error: unknown) {
    console.error('Loop Video Error:', error);

    cleanupTempFiles(tempFiles);

    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

function cleanupTempFiles(files: string[]) {
  for (const file of files) {
    try {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log('Cleaned up:', file);
      }
    } catch (e) {
      console.error('Failed to cleanup file:', file, e);
    }
  }
}
