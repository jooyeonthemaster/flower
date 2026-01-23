/**
 * Canvas 텍스트 렌더러
 * 글자별 이펙트 적용 가능
 */

import type {
  TextStyle,
  EffectType,
  EffectResult,
  EffectContext,
  CharEffectMode,
} from '../types';
import { calculateCharPositions, calculateCharPositionsMultiLine, calculateTextBounds } from '../utils/textMeasure';
import { hexToRgb, rgba } from '../utils/colorUtils';
import { GLOW_RADII } from '../constants/effects';

export class CanvasTextRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  /**
   * 텍스트 렌더링 (전체 또는 글자별)
   */
  renderText(
    text: string,
    style: TextStyle,
    effects: EffectResult,
    mode: CharEffectMode,
    charEffects?: EffectResult[] // 글자별 이펙트 (perChar 모드용)
  ): void {
    if (mode === 'perChar' && charEffects) {
      this.renderCharByChar(text, style, effects, charEffects);
    } else {
      this.renderWholeText(text, style, effects);
    }
  }

  /**
   * 전체 텍스트 렌더링 (멀티라인 지원)
   */
  private renderWholeText(
    text: string,
    style: TextStyle,
    effects: EffectResult
  ): void {
    const ctx = this.ctx;
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    // 줄바꿈 처리
    const lines = text.split('\n');
    const lineHeight = style.fontSize * 1.3; // 라인 높이 (1.3배)
    const totalHeight = (lines.length - 1) * lineHeight;

    ctx.save();

    // blur/hueRotate filter 적용
    const filters: string[] = [];
    if (effects.blur > 0) {
      filters.push(`blur(${effects.blur}px)`);
    }
    if (effects.hueRotate !== 0) {
      filters.push(`hue-rotate(${effects.hueRotate}deg)`);
    }
    if (filters.length > 0) {
      ctx.filter = filters.join(' ');
    }

    // 이펙트 적용 (위치, 회전, 크기)
    ctx.translate(
      centerX + effects.translateX,
      centerY + effects.translateY
    );

    // 3D 회전 근사 (2D에서)
    this.apply3DTransform(effects);

    ctx.rotate((effects.rotateZ * Math.PI) / 180);
    ctx.scale(effects.scale, effects.scale);

    // 투명도
    ctx.globalAlpha = effects.opacity;

    // 폰트 설정
    ctx.font = `${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 각 라인 렌더링
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineY = -totalHeight / 2 + i * lineHeight;

      // 추가 레이어 (chromatic, glitch 등)
      if (effects.extraLayers) {
        for (const layer of effects.extraLayers) {
          ctx.save();
          ctx.globalCompositeOperation = layer.blendMode;
          ctx.globalAlpha = layer.opacity * effects.opacity;
          ctx.fillStyle = layer.color;
          ctx.fillText(line, layer.offsetX, lineY + layer.offsetY);
          ctx.restore();
        }
      }

      // 그림자 효과 (glow, extrude 등)
      this.applyTextShadowAtY(line, style, effects, lineY);

      // 메인 텍스트
      ctx.fillStyle = style.color;
      ctx.fillText(line, 0, lineY);
    }

    ctx.restore();
  }

  /**
   * 글자별 렌더링 (멀티라인 지원)
   */
  private renderCharByChar(
    text: string,
    style: TextStyle,
    baseEffects: EffectResult,
    charEffects: EffectResult[]
  ): void {
    const ctx = this.ctx;
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    // 줄바꿈 문자 제외한 글자 위치 계산
    const charPositions = calculateCharPositionsMultiLine(text, style, 0);

    // charEffects 인덱스 매핑 (줄바꿈 제외)
    let effectIndex = 0;

    for (let i = 0; i < charPositions.length; i++) {
      const pos = charPositions[i];
      const char = pos.char;

      // 줄바꿈은 건너뛰기
      if (char === '\n') {
        effectIndex++;
        continue;
      }

      const charEffect = charEffects[effectIndex] || baseEffects;
      effectIndex++;

      ctx.save();

      // blur/hueRotate filter 적용 (글자별)
      const filters: string[] = [];
      if (charEffect.blur > 0) {
        filters.push(`blur(${charEffect.blur}px)`);
      }
      if (charEffect.hueRotate !== 0) {
        filters.push(`hue-rotate(${charEffect.hueRotate}deg)`);
      }
      if (filters.length > 0) {
        ctx.filter = filters.join(' ');
      }

      // 기본 위치 (전체 이펙트 적용)
      ctx.translate(
        centerX + baseEffects.translateX,
        centerY + baseEffects.translateY
      );

      // 전체 회전/크기
      this.apply3DTransform(baseEffects);
      ctx.rotate((baseEffects.rotateZ * Math.PI) / 180);
      ctx.scale(baseEffects.scale, baseEffects.scale);

      // 글자별 추가 변환 (Y 위치 포함)
      ctx.translate(pos.x + charEffect.translateX, pos.y + charEffect.translateY);
      ctx.rotate((charEffect.rotateZ * Math.PI) / 180);
      ctx.scale(charEffect.scale, charEffect.scale);

      // 투명도
      ctx.globalAlpha = baseEffects.opacity * charEffect.opacity;

      // 폰트 설정
      ctx.font = `${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 그림자 효과
      this.applyTextShadow(char, style, charEffect);

      // 글자 렌더링
      ctx.fillStyle = style.color;
      ctx.fillText(char, 0, 0);

      ctx.restore();
    }
  }

  /**
   * 3D 변환 근사 적용 (2D Canvas에서)
   */
  private apply3DTransform(effects: EffectResult): void {
    const ctx = this.ctx;

    // rotateX 근사: Y축 스케일 변경
    if (effects.rotateX !== 0) {
      const scaleY = Math.cos((effects.rotateX * Math.PI) / 180);
      ctx.scale(1, Math.max(0.1, scaleY));
    }

    // rotateY 근사: X축 스케일 변경 + 기울임
    if (effects.rotateY !== 0) {
      const scaleX = Math.cos((effects.rotateY * Math.PI) / 180);
      const skewX = Math.sin((effects.rotateY * Math.PI) / 180) * 0.3;
      ctx.transform(Math.max(0.1, scaleX), 0, skewX, 1, 0, 0);
    }

    // translateZ 근사: 크기 변경 (원근감)
    if (effects.translateZ !== 0) {
      const perspective = 1200;
      const scale = perspective / (perspective - effects.translateZ);
      ctx.scale(scale, scale);
    }
  }

  /**
   * 텍스트 그림자 적용 (glow, extrude 등)
   */
  private applyTextShadow(
    text: string,
    style: TextStyle,
    effects: EffectResult
  ): void {
    this.applyTextShadowAtY(text, style, effects, 0);
  }

  /**
   * 특정 Y 위치에 텍스트 그림자 적용 (멀티라인용)
   */
  private applyTextShadowAtY(
    text: string,
    style: TextStyle,
    effects: EffectResult,
    y: number
  ): void {
    const ctx = this.ctx;

    if (!effects.textShadow || effects.textShadow === 'none') {
      return;
    }

    // textShadow 파싱 및 적용
    const shadows = this.parseTextShadow(effects.textShadow);

    for (const shadow of shadows) {
      ctx.save();
      ctx.shadowColor = shadow.color;
      ctx.shadowBlur = shadow.blur;
      ctx.shadowOffsetX = shadow.offsetX;
      ctx.shadowOffsetY = shadow.offsetY;
      ctx.fillStyle = shadow.color;
      ctx.fillText(text, 0, y);
      ctx.restore();
    }
  }

  /**
   * CSS text-shadow 문자열 파싱
   */
  private parseTextShadow(
    shadowStr: string
  ): { offsetX: number; offsetY: number; blur: number; color: string }[] {
    const shadows: { offsetX: number; offsetY: number; blur: number; color: string }[] = [];

    // rgb() 안의 쉼표를 보존하면서 분리
    const parts = this.splitShadowParts(shadowStr);

    for (const part of parts) {
      const trimmed = part.trim();

      // 형식 1: "0 0 15px #color" (glow, pulse 등 - offset에 px 없음)
      // 형식 2: "0.7px 0.7px 0px rgb(r,g,b)" (extrude 등 - offset에 px 있음)

      // 정규식 1: offset에 px가 없는 형식 (0 0 15px color)
      let match = trimmed.match(
        /^(-?[\d.]+)\s+(-?[\d.]+)\s+([\d.]+)px\s+(.+)$/
      );

      if (!match) {
        // 정규식 2: offset에 px가 있는 형식 (0px 0px 15px color)
        match = trimmed.match(
          /^(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px\s+(.+)$/
        );
      }

      if (match) {
        shadows.push({
          offsetX: parseFloat(match[1]),
          offsetY: parseFloat(match[2]),
          blur: parseFloat(match[3]),
          color: match[4].trim(),
        });
      }
    }

    return shadows;
  }

  /**
   * rgb() 안의 쉼표를 보존하면서 shadow 분리
   */
  private splitShadowParts(shadowStr: string): string[] {
    const parts: string[] = [];
    let current = '';
    let parenDepth = 0;

    for (const char of shadowStr) {
      if (char === '(') parenDepth++;
      else if (char === ')') parenDepth--;

      if (char === ',' && parenDepth === 0) {
        parts.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    if (current.trim()) {
      parts.push(current.trim());
    }

    return parts;
  }

  /**
   * 글로우 효과 직접 렌더링 (더 부드러운 결과)
   */
  renderGlow(
    text: string,
    style: TextStyle,
    x: number,
    y: number,
    glowColor: string,
    intensity: number = 1
  ): void {
    const ctx = this.ctx;

    ctx.save();
    ctx.font = `${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 여러 레이어로 글로우 생성
    for (const radius of GLOW_RADII) {
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = radius * intensity;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillStyle = glowColor;
      ctx.globalAlpha = 0.3;
      ctx.fillText(text, x, y);
    }

    ctx.restore();
  }

  /**
   * Extrude 효과 직접 렌더링 (3D 입체)
   */
  renderExtrude(
    text: string,
    style: TextStyle,
    x: number,
    y: number,
    glowColor: string,
    depth: number = 30
  ): void {
    const ctx = this.ctx;
    const rgb = hexToRgb(glowColor);
    const angleRad = (135 * Math.PI) / 180;

    ctx.save();
    ctx.font = `${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 뒤에서 앞으로 레이어 렌더링
    for (let i = depth; i >= 1; i--) {
      const offsetX = Math.cos(angleRad) * i * 0.7;
      const offsetY = Math.sin(angleRad) * i * 0.7;

      const progress = i / depth;
      const darken = 1 - progress * 0.85;

      const r = Math.floor(rgb.r * darken);
      const g = Math.floor(rgb.g * darken);
      const b = Math.floor(rgb.b * darken);

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillText(text, x + offsetX, y + offsetY);
    }

    ctx.restore();
  }
}

export default CanvasTextRenderer;
