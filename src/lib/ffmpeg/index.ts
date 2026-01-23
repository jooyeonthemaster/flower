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
    return process.env.FFMPEG_BIN;
  }

  // Priority 2: System FFmpeg
  try {
    await execAsync('ffmpeg -version', { timeout: 5000 });
    return 'ffmpeg';
  } catch {
    // System FFmpeg not found
  }

  // Priority 3: ffmpeg-static package
  if (ffmpegPath && typeof ffmpegPath === 'string') {
    if (ffmpegPath.includes('\\ROOT\\') || ffmpegPath.includes('/ROOT/')) {
      throw new Error('ffmpeg-static returned an invalid path.');
    }
    if (fs.existsSync(ffmpegPath)) {
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
