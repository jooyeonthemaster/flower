import { NextResponse } from 'next/server';
import fs from 'fs';
import ffmpegPath from 'ffmpeg-static';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL ? 'Vercel' : 'Local',
  };

  // 1. ffmpeg-static 경로 확인
  results.ffmpegStaticPath = ffmpegPath;
  results.ffmpegStaticType = typeof ffmpegPath;

  // 2. 파일 존재 여부 확인
  if (ffmpegPath && typeof ffmpegPath === 'string') {
    results.ffmpegExists = fs.existsSync(ffmpegPath);
    results.pathIncludesROOT = ffmpegPath.includes('ROOT');
  }

  // 3. 시스템 FFmpeg 확인
  try {
    const { stdout } = await execAsync('ffmpeg -version', { timeout: 5000 });
    results.systemFFmpeg = true;
    results.systemFFmpegVersion = stdout.split('\n')[0];
  } catch {
    results.systemFFmpeg = false;
  }

  // 4. ffmpeg-static 실행 테스트 (존재하는 경우)
  if (ffmpegPath && typeof ffmpegPath === 'string' && fs.existsSync(ffmpegPath)) {
    try {
      const { stdout } = await execAsync(`"${ffmpegPath}" -version`, { timeout: 5000 });
      results.ffmpegStaticWorks = true;
      results.ffmpegStaticVersion = stdout.split('\n')[0];
    } catch (e) {
      results.ffmpegStaticWorks = false;
      results.ffmpegStaticError = e instanceof Error ? e.message : String(e);
    }
  }

  // 5. /tmp 디렉토리 쓰기 가능 여부
  try {
    const testFile = '/tmp/test_write_' + Date.now();
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    results.tmpWritable = true;
  } catch {
    results.tmpWritable = false;
  }

  return NextResponse.json(results);
}
