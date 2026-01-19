import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

// Vercel Pro: 최대 300초 (5분)
export const maxDuration = 300;

// 크로스페이드 전환 시간 (초)
const CROSSFADE_DURATION = 1;

// 영상 길이 확인 함수 (ffprobe 사용)
async function getVideoDuration(filePath: string): Promise<number> {
  try {
    const ffprobePath = filePath.replace(/\\/g, '/');
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${ffprobePath}"`,
      { timeout: 10000 }
    );
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

    // 1. Base64 영상들을 임시 폴더에 파일로 저장
    const videoFiles: string[] = [];
    for (let i = 0; i < videoDataUrls.length; i++) {
      const dataUrl = videoDataUrls[i];

      // Data URL에서 base64 추출
      const matches = dataUrl.match(/^data:video\/([^;]+);base64,(.+)$/);
      if (!matches) {
        console.error(`Invalid video data URL format at index ${i}`);
        continue;
      }

      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      const filepath = path.join(tempDir, `video_${timestamp}_${i}.mp4`);
      fs.writeFileSync(filepath, buffer);
      videoFiles.push(filepath);
      tempFiles.push(filepath);

      console.log(`Saved video ${i + 1}/${videoDataUrls.length}: ${filepath}`);
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

    // Windows 경로 호환성: 백슬래시를 슬래시로 변환
    const ffmpegOutputPath = outputPath.replace(/\\/g, '/');
    const ffmpegVideoFiles = videoFiles.map(f => f.replace(/\\/g, '/'));

    let ffmpegCommand: string;

    if (videoFiles.length === 1) {
      // 영상이 1개면 크로스페이드 없이 그냥 인코딩
      const cropFilter = outputRatio === '1:1'
        ? '-vf "crop=min(iw\\,ih):min(iw\\,ih),scale=1080:1080"'
        : '';
      ffmpegCommand = `ffmpeg -y -i "${ffmpegVideoFiles[0]}" ${cropFilter} -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k "${ffmpegOutputPath}"`;
    } else {
      // 2개 이상: xfade 크로스페이드 적용
      // 입력 파일들
      const inputs = ffmpegVideoFiles.map(f => `-i "${f}"`).join(' ');

      // xfade 필터 체인 구성
      // offset = 이전 영상들의 총 길이 - (전환 횟수 * 전환 시간)
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
          filterComplex += '; ';
        }
      }

      // 1:1 크롭 필터 추가
      if (outputRatio === '1:1') {
        filterComplex += `; [vout]crop=min(iw\\,ih):min(iw\\,ih),scale=1080:1080[final]`;
        ffmpegCommand = `ffmpeg -y ${inputs} -filter_complex "${filterComplex}" -map "[final]" -c:v libx264 -preset fast -crf 23 -an "${ffmpegOutputPath}"`;
      } else {
        ffmpegCommand = `ffmpeg -y ${inputs} -filter_complex "${filterComplex}" -map "[vout]" -c:v libx264 -preset fast -crf 23 -an "${ffmpegOutputPath}"`;
      }
    }

    console.log('Executing FFmpeg with crossfade:', ffmpegCommand);

    try {
      const { stdout, stderr } = await execAsync(ffmpegCommand, {
        timeout: 240000 // 4분 타임아웃
      });
      console.log('FFmpeg stdout:', stdout);
      if (stderr) console.log('FFmpeg stderr:', stderr);
    } catch (ffmpegError) {
      console.error('FFmpeg error:', ffmpegError);

      // FFmpeg가 없는 경우 대체 방법 시도 (첫 번째 영상만 반환)
      if ((ffmpegError as Error).message.includes('command not found') ||
          (ffmpegError as Error).message.includes('ENOENT')) {
        console.log('FFmpeg not available, returning first video as fallback');

        // 첫 번째 영상을 그대로 반환
        const firstVideoBuffer = fs.readFileSync(videoFiles[0]);
        const firstVideoBase64 = firstVideoBuffer.toString('base64');

        // 임시 파일 정리
        cleanupTempFiles(tempFiles);

        return NextResponse.json({
          success: true,
          videoUrl: `data:video/mp4;base64,${firstVideoBase64}`,
          warning: 'FFmpeg를 사용할 수 없어 첫 번째 영상만 반환됩니다.'
        });
      }

      throw ffmpegError;
    }

    // 4. 결과 파일 읽기
    if (!fs.existsSync(outputPath)) {
      throw new Error('합성된 영상 파일이 생성되지 않았습니다.');
    }

    const resultBuffer = fs.readFileSync(outputPath);
    const resultBase64 = resultBuffer.toString('base64');
    const videoDataUrl = `data:video/mp4;base64,${resultBase64}`;

    // 총 영상 길이 계산: 각 영상 길이 합 - (전환 횟수 * 전환 시간)
    const totalDuration = durations.reduce((sum, d) => sum + d, 0) - (videoFiles.length - 1) * CROSSFADE_DURATION;

    console.log(`Video merge completed successfully. Total duration: ${totalDuration.toFixed(1)}s (with ${videoFiles.length - 1} crossfades)`);

    // 5. 임시 파일 정리
    cleanupTempFiles(tempFiles);

    return NextResponse.json({
      success: true,
      videoUrl: videoDataUrl,
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
