import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';
import ffmpegPath from 'ffmpeg-static';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

import { spawnAsync, getFFmpegPath, cleanupTempFiles } from '@/lib/ffmpeg';

// Firebase Admin 초기화
if (!getApps().length) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim();

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    initializeApp({
      credential: cert(serviceAccount),
      storageBucket: storageBucket,
    });
  } else {
    initializeApp({
      projectId: projectId,
      storageBucket: storageBucket,
    });
  }
}

const execAsync = promisify(exec);

// Vercel Pro: 최대 300초 (5분)
export const maxDuration = 300;

// 크로스페이드 전환 시간 (초)
const CROSSFADE_DURATION = 1;

// ffprobe 경로 가져오기 (ffmpeg-static 기반)
async function getFFprobePath(): Promise<string> {
  // Priority 1: Environment variable
  if (process.env.FFPROBE_BIN) {
    return process.env.FFPROBE_BIN;
  }

  // Priority 2: System ffprobe
  try {
    await execAsync('ffprobe -version', { timeout: 5000 });
    return 'ffprobe';
  } catch {
    // ffmpeg-static 기반으로 ffprobe 경로 추론
  }

  // Priority 3: ffmpeg-static과 같은 디렉토리에서 ffprobe 찾기
  if (ffmpegPath && typeof ffmpegPath === 'string') {
    const ffprobeStaticPath = ffmpegPath.replace(/ffmpeg(\.exe)?$/i, 'ffprobe$1');
    if (fs.existsSync(ffprobeStaticPath)) {
      console.log('Using ffprobe from ffmpeg-static directory:', ffprobeStaticPath);
      return ffprobeStaticPath;
    }
  }

  // ffprobe 없으면 기본값 사용
  console.log('ffprobe not found, will use default duration');
  return '';
}

// 영상 길이 확인 함수 (ffprobe 사용)
async function getVideoDuration(filePath: string): Promise<number> {
  try {
    const ffprobeBin = await getFFprobePath();

    // ffprobe가 없으면 기본값 반환
    if (!ffprobeBin) {
      console.log('ffprobe not available, using default 10s');
      return 10;
    }

    const normalizedPath = filePath.replace(/\\/g, '/');

    // spawnAsync 사용 (Windows 쉘 파싱 문제 회피)
    const { stdout } = await spawnAsync(ffprobeBin, [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      normalizedPath
    ], { timeout: 10000 });

    const duration = parseFloat(stdout.trim());
    console.log(`Video duration for ${filePath}: ${duration}s`);
    return duration;
  } catch (error) {
    console.error('Failed to get video duration, using default 10s:', error);
    return 10; // 기본값 10초
  }
}

export async function POST(req: NextRequest) {
  const tempFiles: string[] = [];

  try {
    const body = await req.json();
    const { videoDataUrls, outputRatio = '1:1' } = body;

    if (!videoDataUrls || !Array.isArray(videoDataUrls) || videoDataUrls.length === 0) {
      return NextResponse.json(
        { success: false, error: '합성할 영상이 없습니다.' },
        { status: 400 }
      );
    }

    console.log(`Starting video merge with crossfade: ${videoDataUrls.length} videos`);

    const timestamp = Date.now();
    // OS에 맞는 임시 디렉토리 사용 (Windows: AppData\Local\Temp, Linux/Vercel: /tmp)
    const tempDir = os.tmpdir();

    // 1. 영상들을 임시 폴더에 파일로 저장 (URL 또는 Base64 지원)
    const videoFiles: string[] = [];
    for (let i = 0; i < videoDataUrls.length; i++) {
      const videoInput = videoDataUrls[i];
      const filepath = path.join(tempDir, `video_${timestamp}_${i}.mp4`);

      try {
        if (videoInput.startsWith('data:')) {
          // Data URL에서 base64 추출
          const matches = videoInput.match(/^data:video\/([^;]+);base64,(.+)$/);
          if (!matches) {
            console.error(`Invalid video data URL format at index ${i}`);
            continue;
          }
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');
          fs.writeFileSync(filepath, buffer);
          console.log(`Saved video ${i + 1}/${videoDataUrls.length} from Base64: ${filepath}`);
        } else if (videoInput.startsWith('http://') || videoInput.startsWith('https://')) {
          // 외부 URL에서 다운로드
          console.log(`Downloading video ${i + 1}/${videoDataUrls.length} from URL: ${videoInput.substring(0, 80)}...`);
          const response = await fetch(videoInput);
          if (!response.ok) {
            throw new Error(`Failed to download video: ${response.status}`);
          }
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          fs.writeFileSync(filepath, buffer);
          console.log(`Downloaded and saved video ${i + 1}/${videoDataUrls.length}: ${filepath} (${(buffer.length / 1024 / 1024).toFixed(1)}MB)`);
        } else {
          console.error(`Unknown video format at index ${i}`);
          continue;
        }

        videoFiles.push(filepath);
        tempFiles.push(filepath);
      } catch (downloadError) {
        console.error(`Failed to process video ${i}:`, downloadError);
        continue;
      }
    }

    if (videoFiles.length === 0) {
      throw new Error('유효한 영상 파일이 없습니다.');
    }

    // 2. 각 영상의 길이 확인
    const durations: number[] = [];
    for (const file of videoFiles) {
      const duration = await getVideoDuration(file);
      durations.push(duration);
    }
    console.log('Video durations:', durations);

    // 3. FFmpeg로 영상 합성 (크로스페이드 + 1:1 정사각형 크롭)
    const outputPath = path.join(tempDir, `merged_${timestamp}.mp4`);
    tempFiles.push(outputPath);

    // 3-1. FFmpeg 경로 가져오기 (핵심 수정!)
    let currentFfmpegPath: string;
    try {
      currentFfmpegPath = await getFFmpegPath();
    } catch (ffmpegPathError) {
      console.error('FFmpeg not found:', ffmpegPathError);

      // FFmpeg를 찾을 수 없는 경우 첫 번째 영상만 반환
      const firstVideoBuffer = fs.readFileSync(videoFiles[0]);
      const firstVideoBase64 = firstVideoBuffer.toString('base64');
      cleanupTempFiles(tempFiles);

      return NextResponse.json({
        success: true,
        videoUrl: `data:video/mp4;base64,${firstVideoBase64}`,
        warning: 'FFmpeg를 찾을 수 없어 첫 번째 영상만 반환됩니다.'
      });
    }

    // 시스템 FFmpeg인지 확인 (경로가 'ffmpeg'이면 시스템 FFmpeg)
    const isSystemFFmpeg = currentFfmpegPath === 'ffmpeg';

    // Windows 경로 호환성: 백슬래시를 슬래시로 변환
    const ffmpegOutputPath = outputPath.replace(/\\/g, '/');
    const ffmpegVideoFiles = videoFiles.map(f => f.replace(/\\/g, '/'));

    try {
      // FFmpeg 실행 바이너리 결정
      const ffmpegBin = isSystemFFmpeg ? 'ffmpeg' : currentFfmpegPath;

      if (videoFiles.length === 1) {
        // 영상이 1개면 크로스페이드 없이 그냥 인코딩
        console.log('Single video, encoding without crossfade');

        const args = ['-y', '-i', ffmpegVideoFiles[0]];
        if (outputRatio === '1:1') {
          // 핵심 수정: min() 함수 대신 scale+crop 조합 사용 (쉼표 파싱 문제 회피)
          // scale로 비율 유지하면서 1080 이상으로 확대 후 crop으로 중앙 1080x1080 추출
          args.push('-vf', 'scale=1080:1080:force_original_aspect_ratio=increase,crop=1080:1080');
        }
        args.push('-c:v', 'libx264', '-preset', 'fast', '-crf', '23', '-c:a', 'aac', '-b:a', '128k', ffmpegOutputPath);

        console.log('Executing:', ffmpegBin, args.join(' '));
        await spawnAsync(ffmpegBin, args, { timeout: 240000 });

      } else {
        // 2개 이상: xfade 크로스페이드 적용
        console.log(`Merging ${videoFiles.length} videos with crossfade`);

        // xfade 필터 체인 구성
        let filterComplex = '';
        let cumulativeOffset = 0;

        for (let i = 0; i < videoFiles.length - 1; i++) {
          const inputA = i === 0 ? '[0:v]' : `[v${i - 1}]`;
          const inputB = `[${i + 1}:v]`;
          const outputLabel = i === videoFiles.length - 2 ? '[vout]' : `[v${i}]`;

          // offset = 이전 영상 길이 - 전환 시간
          cumulativeOffset += durations[i] - CROSSFADE_DURATION;

          filterComplex += `${inputA}${inputB}xfade=transition=fade:duration=${CROSSFADE_DURATION}:offset=${cumulativeOffset.toFixed(2)}${outputLabel}`;

          if (i < videoFiles.length - 2) {
            filterComplex += ';';
          }
        }

        // 1:1 크롭 필터 추가
        // 핵심 수정: min(iw,ih) 대신 scale+crop 조합 사용 (쉼표 파싱 문제 완전 회피)
        const mapLabel = outputRatio === '1:1' ? '[final]' : '[vout]';
        if (outputRatio === '1:1') {
          filterComplex += ';[vout]scale=1080:1080:force_original_aspect_ratio=increase,crop=1080:1080[final]';
        }

        console.log('Filter complex:', filterComplex);

        // spawnAsync + windowsVerbatimArguments로 인자를 그대로 전달
        const args = ['-y'];
        // 입력 파일들 추가
        for (const file of ffmpegVideoFiles) {
          args.push('-i', file);
        }
        args.push('-filter_complex', filterComplex);
        args.push('-map', mapLabel);
        args.push('-c:v', 'libx264', '-preset', 'fast', '-crf', '23', '-an', ffmpegOutputPath);

        console.log('Executing:', ffmpegBin, args.slice(0, 10).join(' ') + '...');
        await spawnAsync(ffmpegBin, args, { timeout: 240000 });
      }

      console.log('FFmpeg execution completed successfully');
    } catch (ffmpegError) {
      console.error('FFmpeg execution error:', ffmpegError);
      throw ffmpegError;
    }

    // 4. 결과 파일 읽기
    if (!fs.existsSync(outputPath)) {
      throw new Error('합성된 영상 파일이 생성되지 않았습니다.');
    }

    const resultBuffer = fs.readFileSync(outputPath);

    // 총 영상 길이 계산: 각 영상 길이 합 - (전환 횟수 * 전환 시간)
    const totalDuration = durations.reduce((sum, d) => sum + d, 0) - (videoFiles.length - 1) * CROSSFADE_DURATION;

    console.log(`Video merge completed successfully. Total duration: ${totalDuration.toFixed(1)}s (with ${videoFiles.length - 1} crossfades)`);

    // 5. Firebase Storage에 업로드
    let finalVideoUrl: string;
    try {
      const bucket = getStorage().bucket();
      const uploadPath = `merged-videos/merged_${timestamp}.mp4`;
      const file = bucket.file(uploadPath);

      await file.save(resultBuffer, {
        metadata: { contentType: 'video/mp4' },
      });
      await file.makePublic();

      finalVideoUrl = `https://storage.googleapis.com/${bucket.name}/${uploadPath}`;
      console.log(`Uploaded merged video to Firebase: ${finalVideoUrl}`);
    } catch (uploadError) {
      console.error('Firebase upload failed, returning Base64:', uploadError);
      // 업로드 실패 시 Base64로 fallback (작은 영상인 경우)
      const resultBase64 = resultBuffer.toString('base64');
      finalVideoUrl = `data:video/mp4;base64,${resultBase64}`;
    }

    // 6. 임시 파일 정리
    cleanupTempFiles(tempFiles);

    return NextResponse.json({
      success: true,
      videoUrl: finalVideoUrl,
      duration: Math.round(totalDuration),
      sceneCount: videoFiles.length,
      crossfadeDuration: CROSSFADE_DURATION
    });

  } catch (error: unknown) {
    console.error('Merge Videos Error:', error);

    // 임시 파일 정리
    cleanupTempFiles(tempFiles);

    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

