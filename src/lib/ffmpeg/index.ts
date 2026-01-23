/**
 * 공통 FFmpeg 유틸리티
 * 모든 FFmpeg API에서 공유하는 함수들
 */

import { spawn } from 'child_process';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import ffmpegPath from 'ffmpeg-static';

const execAsync = promisify(exec);

/**
 * spawn을 Promise로 감싸는 헬퍼 함수
 * Windows에서 쉘 파싱 문제를 완전히 우회하기 위해 spawn + windowsVerbatimArguments 사용
 */
export function spawnAsync(
  command: string,
  args: string[],
  options: { timeout?: number } = {}
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const proc = spawn(command, args, {
      shell: false,
      windowsVerbatimArguments: true,
      windowsHide: true,
    });

    const timeoutId = options.timeout
      ? setTimeout(() => {
          timedOut = true;
          proc.kill('SIGKILL');
        }, options.timeout)
      : null;

    proc.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      if (timeoutId) clearTimeout(timeoutId);

      if (timedOut) {
        reject(new Error(`Command timed out after ${options.timeout}ms`));
      } else if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        const error = new Error(`Command failed with exit code ${code}: ${stderr}`) as Error & { code: number; stderr: string };
        error.code = code ?? 1;
        error.stderr = stderr;
        reject(error);
      }
    });

    proc.on('error', (err) => {
      if (timeoutId) clearTimeout(timeoutId);
      reject(err);
    });
  });
}

/**
 * FFmpeg 경로를 찾는 함수
 * 우선순위: 환경변수 > 시스템 FFmpeg > ffmpeg-static
 */
export async function getFFmpegPath(): Promise<string> {
  // Priority 1: Environment variable
  if (process.env.FFMPEG_BIN) {
    console.log('[FFmpeg] Using FFMPEG_BIN env:', process.env.FFMPEG_BIN);
    return process.env.FFMPEG_BIN;
  }

  // Priority 2: System FFmpeg
  try {
    await execAsync('ffmpeg -version', { timeout: 5000 });
    console.log('[FFmpeg] Using system ffmpeg');
    return 'ffmpeg';
  } catch {
    // System FFmpeg not found
    console.log('[FFmpeg] System ffmpeg not found');
  }

  // Priority 3: ffmpeg-static package
  console.log('[FFmpeg] ffmpeg-static raw path:', ffmpegPath);

  if (ffmpegPath && typeof ffmpegPath === 'string') {
    // Vercel 환경에서 ROOT 경로가 반환되는 경우 처리
    // fs.existsSync가 false를 반환해도 실제로 실행 가능할 수 있음
    console.log('[FFmpeg] Checking ffmpeg-static path exists:', fs.existsSync(ffmpegPath));

    // 파일이 존재하면 사용
    if (fs.existsSync(ffmpegPath)) {
      console.log('[FFmpeg] Using ffmpeg-static (file exists)');
      return ffmpegPath;
    }

    // 파일이 존재하지 않아도 경로가 유효해 보이면 시도
    // (Vercel serverless 환경에서는 fs.existsSync가 제대로 작동하지 않을 수 있음)
    if (!ffmpegPath.includes('ROOT')) {
      console.log('[FFmpeg] Using ffmpeg-static (assuming valid path)');
      return ffmpegPath;
    }
  }

  throw new Error('FFmpeg not found. Please install FFmpeg on your system.');
}

/**
 * 임시 파일 정리 함수
 */
export function cleanupTempFiles(files: string[]): void {
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

/**
 * FFmpeg drawtext 필터용 경로 이스케이프
 * Windows 콜론, 백슬래시 처리
 * 주의: FFmpeg 필터 내에서는 모든 콜론(드라이브 문자 포함)을 이스케이프해야 함
 */
export function escapePathForFFmpeg(filePath: string): string {
  let escaped = filePath.replace(/\\/g, '/');
  // FFmpeg 필터에서는 모든 콜론을 \:로 이스케이프 (드라이브 문자 포함)
  return escaped.replace(/:/g, '\\:');
}
