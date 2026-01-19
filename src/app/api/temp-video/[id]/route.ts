import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Temporary Media File Server
 *
 * Purpose: Serve temporary video/image files to Remotion via HTTP instead of file://
 * This prevents Chrome "Target closed" errors caused by large Base64 data URLs
 *
 * Supported patterns:
 * - remotion_input_*.mp4 (기존 영상 입력)
 * - bg_*.png (배경 이미지)
 * - text_video_*.mp4 (텍스트 영상)
 * - overlay_output_*.mp4 (오버레이 결과)
 */

// 허용된 파일 패턴
const ALLOWED_PATTERNS = [
  /^remotion_input_\d+\.mp4$/,
  /^bg_\d+\.png$/,
  /^text_video_\d+\.mp4$/,
  /^overlay_output_\d+\.mp4$/,
];

// 확장자별 Content-Type
const CONTENT_TYPES: Record<string, string> = {
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Security: Only allow specific file patterns
    const isAllowed = ALLOWED_PATTERNS.some(pattern => pattern.test(id));
    if (!id || !isAllowed) {
      console.error('Invalid file ID:', id);
      return NextResponse.json(
        { error: 'Invalid file ID' },
        { status: 400 }
      );
    }

    // Construct file path
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, id);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath);
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Read file
    const fileBuffer = fs.readFileSync(filePath);

    // Determine content type based on extension
    const ext = path.extname(id).toLowerCase();
    const contentType = CONTENT_TYPES[ext] || 'application/octet-stream';

    // Stream the file with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    console.error('Temp media server error:', error);
    return NextResponse.json(
      { error: 'Failed to serve media file' },
      { status: 500 }
    );
  }
}
