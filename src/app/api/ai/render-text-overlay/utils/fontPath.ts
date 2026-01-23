/**
 * 폰트 파일 경로 관리
 */

import fs from 'fs';
import path from 'path';

// 폰트 패밀리 이름 → 파일명 매핑
const FONT_MAP: Record<string, string> = {
  // 기본 폰트
  "'Noto Sans KR', sans-serif": 'Hakgyoansim_GongryongalR.ttf',
  "'Hakgyoansim Gongryongal', sans-serif": 'Hakgyoansim_GongryongalR.ttf',

  // 프로젝트 폰트들
  "'SF레몬빙수', sans-serif": 'SF레몬빙수-TTF.ttf',
  "'KERISKEDU Line', sans-serif": 'KERISKEDU_Line.ttf',
  "'Solinsunny', sans-serif": 'Solinsunny.ttf',
  "'OK DDUNG', sans-serif": 'OK DDUNG.ttf',
  "'Sinchon Rhapsody', sans-serif": 'SinchonRhapsodyTTF-ExtraBold_(2).ttf',

  // Fallback
  "sans-serif": 'Hakgyoansim_GongryongalR.ttf',
  "default": 'Hakgyoansim_GongryongalR.ttf',
};

/**
 * 폰트 패밀리 이름으로 폰트 파일 경로를 찾는 함수
 */
export function getFontPath(fontFamily: string): string {
  const publicFontsDir = path.join(process.cwd(), 'public', 'fonts');

  // 매핑된 폰트 파일 찾기
  const fontFile = FONT_MAP[fontFamily] || FONT_MAP['default'];
  const fontPath = path.join(publicFontsDir, fontFile);

  // 파일 존재 확인
  if (fs.existsSync(fontPath)) {
    return fontPath;
  }

  // Fallback: 폴더의 첫 번째 ttf 파일 사용
  const files = fs.readdirSync(publicFontsDir);
  const ttfFile = files.find(f => f.endsWith('.ttf'));
  if (ttfFile) {
    return path.join(publicFontsDir, ttfFile);
  }

  throw new Error('No font file found in public/fonts directory');
}
