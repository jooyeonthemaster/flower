/**
 * 텍스트 측정 유틸리티
 */

import type { TextStyle } from '../types';

// 측정용 캔버스 (재사용)
let measureCanvas: HTMLCanvasElement | null = null;
let measureCtx: CanvasRenderingContext2D | null = null;

/**
 * 측정용 캔버스 컨텍스트 가져오기
 */
function getMeasureContext(): CanvasRenderingContext2D {
  if (!measureCanvas) {
    measureCanvas = document.createElement('canvas');
    measureCtx = measureCanvas.getContext('2d');
  }
  return measureCtx!;
}

/**
 * 텍스트 너비 측정
 */
export function measureTextWidth(text: string, style: TextStyle): number {
  const ctx = getMeasureContext();
  ctx.font = `${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;
  return ctx.measureText(text).width;
}

/**
 * 텍스트 높이 측정 (근사값)
 */
export function measureTextHeight(style: TextStyle): number {
  // 폰트 높이는 일반적으로 fontSize의 1.2배 정도
  return style.fontSize * 1.2;
}

/**
 * 개별 글자 너비 배열 반환
 */
export function measureCharWidths(text: string, style: TextStyle): number[] {
  const ctx = getMeasureContext();
  ctx.font = `${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;

  return text.split('').map(char => ctx.measureText(char).width);
}

/**
 * 글자별 위치 계산 (중앙 정렬 기준)
 */
export function calculateCharPositions(
  text: string,
  style: TextStyle,
  centerX: number
): { char: string; x: number; width: number }[] {
  const charWidths = measureCharWidths(text, style);
  const totalWidth = charWidths.reduce((sum, w) => sum + w, 0);

  let currentX = centerX - totalWidth / 2;
  const positions: { char: string; x: number; width: number }[] = [];

  for (let i = 0; i < text.length; i++) {
    positions.push({
      char: text[i],
      x: currentX + charWidths[i] / 2, // 글자 중심 기준
      width: charWidths[i],
    });
    currentX += charWidths[i];
  }

  return positions;
}

/**
 * 멀티라인 글자별 위치 계산 (줄바꿈 지원)
 */
export function calculateCharPositionsMultiLine(
  text: string,
  style: TextStyle,
  centerX: number
): { char: string; x: number; y: number; width: number; lineIndex: number }[] {
  const ctx = getMeasureContext();
  ctx.font = `${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;

  const lines = text.split('\n');
  const lineHeight = style.fontSize * 1.3;
  const totalHeight = (lines.length - 1) * lineHeight;
  const positions: { char: string; x: number; y: number; width: number; lineIndex: number }[] = [];

  let globalCharIndex = 0;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    const lineY = -totalHeight / 2 + lineIndex * lineHeight;

    // 각 라인의 글자 너비 측정
    const charWidths: number[] = [];
    for (const char of line) {
      charWidths.push(ctx.measureText(char).width);
    }
    const lineWidth = charWidths.reduce((sum, w) => sum + w, 0);

    // 중앙 정렬 기준 X 시작점
    let currentX = centerX - lineWidth / 2;

    for (let i = 0; i < line.length; i++) {
      positions.push({
        char: line[i],
        x: currentX + charWidths[i] / 2,
        y: lineY,
        width: charWidths[i],
        lineIndex,
      });
      currentX += charWidths[i];
      globalCharIndex++;
    }

    // 줄바꿈 문자도 인덱스에 포함 (다음 라인이 있을 경우)
    if (lineIndex < lines.length - 1) {
      globalCharIndex++; // \n 문자 건너뛰기
    }
  }

  return positions;
}

/**
 * 텍스트 줄바꿈 처리 (maxWidth 기준)
 */
export function wrapText(
  text: string,
  style: TextStyle,
  maxWidth: number
): string[] {
  const ctx = getMeasureContext();
  ctx.font = `${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;

  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * 텍스트 바운딩 박스 계산
 */
export interface TextBounds {
  width: number;
  height: number;
  lines: string[];
  lineHeight: number;
}

export function calculateTextBounds(
  text: string,
  style: TextStyle,
  maxWidth: number
): TextBounds {
  const lines = wrapText(text, style, maxWidth);
  const lineHeight = measureTextHeight(style);

  let maxLineWidth = 0;
  for (const line of lines) {
    const lineWidth = measureTextWidth(line, style);
    maxLineWidth = Math.max(maxLineWidth, lineWidth);
  }

  return {
    width: maxLineWidth,
    height: lines.length * lineHeight,
    lines,
    lineHeight,
  };
}

/**
 * 한글 자동 줄바꿈 (글자 단위)
 * 기준: "두 분의 결혼을 진심으로 축하드립니다" (약 16글자) 보다 긴 텍스트
 * - 기존 수동 줄바꿈(\n)은 유지
 * - 각 줄에서 maxWidth를 초과하면 글자 단위로 줄바꿈
 */
export function autoWrapKoreanText(
  text: string,
  style: TextStyle,
  maxWidth: number
): string {
  const ctx = getMeasureContext();
  ctx.font = `${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;

  // 이미 수동 줄바꿈이 있는 경우 각 줄별로 처리
  const manualLines = text.split('\n');
  const resultLines: string[] = [];

  for (const line of manualLines) {
    if (line.length === 0) {
      resultLines.push('');
      continue;
    }

    // 현재 줄의 너비 측정
    const lineWidth = ctx.measureText(line).width;

    if (lineWidth <= maxWidth) {
      // 너비가 충분하면 그대로 유지
      resultLines.push(line);
    } else {
      // 너비 초과 시 글자 단위로 줄바꿈
      let currentLine = '';
      let currentWidth = 0;

      for (const char of line) {
        const charWidth = ctx.measureText(char).width;

        if (currentWidth + charWidth > maxWidth && currentLine.length > 0) {
          // 현재 줄 저장하고 새 줄 시작
          resultLines.push(currentLine);
          currentLine = char;
          currentWidth = charWidth;
        } else {
          currentLine += char;
          currentWidth += charWidth;
        }
      }

      // 마지막 줄 추가
      if (currentLine.length > 0) {
        resultLines.push(currentLine);
      }
    }
  }

  return resultLines.join('\n');
}
