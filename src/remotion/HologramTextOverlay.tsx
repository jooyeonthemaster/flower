'use client';

import { AbsoluteFill, Video, Sequence, useCurrentFrame, useVideoConfig, interpolate, Easing, random } from 'remotion';
// CameraMotionBlur 제거됨 - 렌더링 시간 최적화
import { noise2D, noise3D } from '@remotion/noise';
import { makeTransform, translate, scale as scaleTransform, rotate, rotateX as rotateXTransform, rotateY as rotateYTransform, translateZ } from '@remotion/animation-utils';
// TransitionSeries 제거 - 타이밍 단순화
import React, { useMemo } from 'react';

interface TextScene {
  text: string;
  startFrame: number;
  endFrame: number;
  // Each scene has a unique random movement pattern
  seed: number;
}

interface HologramTextOverlayProps {
  videoSrc: string;
  imageSrc?: string;
  referenceImageSrc?: string; // 참조 이미지 (로고/인물 사진 - 배경 제거됨)
  texts: string[];
  fontFamily?: string;
  fontSize?: number;
  textColor?: string;
  glowColor?: string;
  effects?: string[]; // 이펙트 배열
  textPosition?: 'random' | 'top' | 'center' | 'bottom';
}

const KineticText: React.FC<{
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  glowColor: string;
  opacity: number;
  frame: number;
  localFrame: number; // 각 텍스트의 로컬 프레임 (entrance 이펙트용)
  seed: number;
  effects: string[];
  textPosition: 'random' | 'top' | 'center' | 'bottom';
}> = ({ text, fontSize, fontFamily, color, glowColor, opacity, frame, localFrame, seed, effects, textPosition }) => {
  const { fps, width } = useVideoConfig();

  // 해상도 기반 비율 계수 (1080px 기준으로 설계된 이펙트 값들을 현재 해상도에 맞게 조정)
  const baseUnit = width / 1080;

  // 이펙트 활성화 체크
  const hasDrift = effects.includes('drift');
  const hasRotate3d = effects.includes('rotate3d');
  const hasGlitch = effects.includes('glitch');
  const hasStrobe = effects.includes('strobe');
  const hasGlow = effects.includes('glow');
  const hasPulse = effects.includes('pulse');
  const hasWave = effects.includes('wave');
  const hasZoom = effects.includes('zoom');
  const hasBlur = effects.includes('blur');
  const hasChromatic = effects.includes('chromatic');
  const hasHologram = effects.includes('hologram');
  const hasPixelate = effects.includes('pixelate');
  const hasRainbow = effects.includes('rainbow');

  // 새로운 움직임/크기/위치 이펙트
  const hasBounce = effects.includes('bounce');
  const hasSpin = effects.includes('spin');
  const hasSpiral = effects.includes('spiral');
  const hasSwing = effects.includes('swing');
  const hasSlide = effects.includes('slide');
  const hasOrbit = effects.includes('orbit');

  // 새로운 3D 깊이 이펙트 (LED 홀로그램 팬용)
  const hasZoomIn = effects.includes('zoomIn');
  const hasFlipUp = effects.includes('flipUp');
  const hasSpiral3d = effects.includes('spiral3d');
  const hasWave3d = effects.includes('wave3d');
  const hasTumble = effects.includes('tumble');

  // 3D 텍스트 입체 효과 (text-shadow 여러 겹)
  const hasExtrude = effects.includes('extrude');

  // === 새로운 이펙트 (2024-01 추가) ===
  const hasTypewriter = effects.includes('typewriter');
  const hasShake = effects.includes('shake');
  const hasNeon = effects.includes('neon');
  const hasFloat = effects.includes('float');
  const hasElastic = effects.includes('elastic');

  // 반복 움직임 공통 타이밍: 4초에 2회 반복 후 1초 정지 (장면 5초 기준)
  const effectDuration = fps * 4; // 4초 동안 이펙트 재생
  const repeatProgress = Math.min(localFrame / effectDuration, 1); // 0~1 (4초)
  const repeatPhase = repeatProgress * Math.PI * 4; // 2주기 (4π)

  // 부드러운 정지를 위한 fadeout (마지막 0.5초 동안 서서히 감소)
  const fadeoutStart = fps * 3.5; // 3.5초부터 fadeout 시작
  const fadeoutFactor = interpolate(
    localFrame,
    [fadeoutStart, effectDuration],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 1. Orbital / Wandering Motion (전역 이동) - noise2D 기반 유기적 움직임
  const driftNoiseX = hasDrift ? noise2D('drift-x', frame * 0.03, seed) : 0;
  const driftNoiseY = hasDrift ? noise2D('drift-y', frame * 0.025, seed + 50) : 0;
  const driftX = hasDrift
    ? driftNoiseX * 90 * baseUnit * fadeoutFactor  // 비율 기반 X 이동
    : 0;
  const driftY = hasDrift
    ? driftNoiseY * 55 * baseUnit * fadeoutFactor  // 비율 기반 Y 이동
    : 0;

  // 3D Rotation (Perspective effect) - 부드러운 fadeout 적용
  const rotateX = hasRotate3d
    ? Math.sin(repeatPhase + seed) * 20 * fadeoutFactor
    : 0;
  const rotateY = hasRotate3d
    ? Math.cos(repeatPhase + seed) * 30 * fadeoutFactor
    : 0;

  // Intense Glitch Jitter (noise2D 기반 - 더 자연스러운 불규칙성)
  const glitchNoise = hasGlitch ? noise2D('glitch', frame * 0.15, seed) : 0; // -1 ~ 1
  const isGlitching = hasGlitch ? glitchNoise > 0.6 : false; // 상위 20% 확률
  const glitchOffset = isGlitching
    ? noise2D('glitch-offset', frame * 0.3, seed + 100) * 30 * baseUnit  // 비율 기반 오프셋
    : 0;

  // Strobe / Flicker Effect (확률 증가)
  const strobe = hasStrobe
    ? (random(frame + seed * 2) > 0.85 ? 0.3 : 1)  // 0.95 → 0.85 (15% 확률)
    : 1;

  // Pulse Effect (박동 효과) - 부드러운 fadeout 적용
  const pulseIntensity = hasPulse ? (Math.sin(repeatPhase) * 0.3 * fadeoutFactor) + 0.9 + (0.1 * (1 - fadeoutFactor)) : 1.0;
  const pulseShadow = hasPulse
    ? `0 0 ${10 * pulseIntensity}px ${glowColor}, 0 0 ${20 * pulseIntensity}px ${glowColor}, 0 0 ${40 * pulseIntensity}px ${glowColor}`
    : '';

  // Glow Effect (글로우 효과)
  const dynamicGlow = hasGlow
    ? `0 0 15px ${glowColor}, 0 0 30px ${glowColor}, 0 0 60px ${glowColor}, 0 0 100px ${glowColor}, 0 0 150px ${glowColor}`
    : '';

  // Wave Effect (물결 움직임) - 부드러운 fadeout 적용
  const waveY = hasWave
    ? Math.sin(repeatPhase + seed) * 30 * baseUnit * fadeoutFactor
    : 0;
  const waveRotate = hasWave
    ? Math.sin(repeatPhase + seed) * 5 * fadeoutFactor
    : 0;

  // Zoom Effect (확대/축소) - 부드러운 fadeout 적용 (정지 시 scale=1)
  const zoomScale = hasZoom
    ? 1 + Math.sin(repeatPhase + seed) * 0.25 * fadeoutFactor
    : 1;

  // Blur Effect (흐릿함) - 부드러운 fadeout 적용
  const blurAmount = hasBlur
    ? Math.abs(Math.sin(repeatPhase + seed)) * 5 * fadeoutFactor
    : 0;

  // Chromatic Aberration (색수차) - 부드러운 fadeout 적용
  const chromaticOffset = hasChromatic
    ? Math.sin(repeatPhase + seed) * 10 * baseUnit * fadeoutFactor
    : 0;

  // Hologram Effect (홀로그램 스캔라인) - noise3D 기반 자연스러운 변화
  const hologramNoise = hasHologram ? noise3D('hologram', frame * 0.08, seed * 0.1, repeatProgress) : 0;
  const hologramOffset = hasHologram
    ? hologramNoise * 12 * baseUnit * fadeoutFactor  // 비율 기반 스캔라인 떨림
    : 0;
  const hologramFlicker = hasHologram ? noise2D('holo-flicker', frame * 0.12, seed) : 0;
  const hologramOpacity = hasHologram
    ? 1 - (0.4 - hologramFlicker * 0.35) * fadeoutFactor  // noise 기반 자연스러운 깜빡임
    : 1;

  // Pixelate Effect (픽셀화) - 부드러운 fadeout 적용 (정지 시 scale=1)
  const pixelateScale = hasPixelate
    ? 1 + Math.sin(repeatPhase) * 0.5 * fadeoutFactor
    : 1;

  // Rainbow Effect (무지개 색상 변화) - 부드러운 fadeout 적용 (정지 시 원래 색상)
  const rainbowHue = hasRainbow
    ? ((repeatProgress * 720) % 360) * fadeoutFactor
    : 0;

  // 3D Extrude Effect (텍스트 입체 효과 - 매우 두꺼운 3D)
  // 3D Extrude Effect (텍스트 입체 효과 - 최적화됨)
  const extrudeShadow = hasExtrude
    ? (() => {
      // [Optimized] 그림자 레이어 대폭 감소 (30 -> 10)
      // 모바일/웹 환경에서 10단계면 충분히 입체적으로 보임. 렌더링 부하 1/3로 감소.
      const layers = [];
      const depth = 10; // [Optimized] 30 -> 10
      const angleX = 135;
      const angleY = 135;
      const angleRadX = (angleX * Math.PI) / 180;
      const angleRadY = (angleY * Math.PI) / 180;

      const baseR = parseInt(glowColor.slice(1, 3), 16);
      const baseG = parseInt(glowColor.slice(3, 5), 16);
      const baseB = parseInt(glowColor.slice(5, 7), 16);

      for (let i = 1; i <= depth; i++) {
        const offsetX = Math.cos(angleRadX) * i * 0.7;
        const offsetY = Math.sin(angleRadY) * i * 0.7;

        const progress = i / depth;
        const darkenFactor = 1 - progress * 0.85;

        const r = Math.floor(baseR * darkenFactor);
        const g = Math.floor(baseG * darkenFactor);
        const b = Math.floor(baseB * darkenFactor);

        // [Optimized] Blur 제거 (렌더링 시간의 주범)
        // 텍스트 그림자에 블러를 넣으면 브라우저 합성 연산이 폭증함.
        const blur = 0;

        const shadowColor = `rgb(${r}, ${g}, ${b})`;
        layers.push(`${offsetX}px ${offsetY}px ${blur}px ${shadowColor}`);
      }

      return layers.join(', ');
    })()
    : '';

  // 새로운 움직임/크기 이펙트들 - 부드러운 fadeout 적용

  // Bounce Effect (위아래 바운스) - 부드러운 fadeout 적용
  const bounceY = hasBounce
    ? Math.abs(Math.sin(repeatPhase + seed)) * 50 * baseUnit * fadeoutFactor
    : 0;

  // Spin Effect (2D 평면 회전) - 4초 동안 720도(=0도) 완료 후 정지
  // progressive 회전은 fadeout하면 역회전되므로 fadeout 미적용
  const spinRotation = hasSpin
    ? repeatProgress * 720  // 720도 = 0도 (2회전 완료 = 제자리)
    : 0;

  // Spiral Effect (나선형 움직임) - 부드러운 fadeout 적용
  const spiralRadius = hasSpiral
    ? (30 + Math.sin(repeatPhase + seed) * 20) * baseUnit * fadeoutFactor
    : 0;
  const spiralX = hasSpiral
    ? Math.cos(repeatPhase + seed) * spiralRadius
    : 0;
  const spiralY = hasSpiral
    ? Math.sin(repeatPhase + seed) * spiralRadius
    : 0;

  // Swing Effect (좌우 스윙) - 부드러운 fadeout 적용
  const swingX = hasSwing
    ? Math.sin(repeatPhase + seed) * 60 * baseUnit * fadeoutFactor
    : 0;
  const swingRotate = hasSwing
    ? Math.sin(repeatPhase + seed) * 15 * fadeoutFactor
    : 0;

  // Slide Effect (좌우 슬라이드) - 부드러운 fadeout 적용
  const slideX = hasSlide
    ? Math.sin(repeatPhase + seed) * 80 * baseUnit * fadeoutFactor
    : 0;

  // Orbit Effect (원형 궤도 움직임) - 부드러운 fadeout 적용
  const orbitRadius = 35 * baseUnit * fadeoutFactor;
  const orbitX = hasOrbit
    ? Math.cos(repeatPhase + seed) * orbitRadius
    : 0;
  const orbitY = hasOrbit
    ? Math.sin(repeatPhase + seed) * orbitRadius
    : 0;

  // === 새로운 3D 깊이 이펙트 (LED 홀로그램 팬용) ===

  // 1. Zoom In (멀리서 다가오는 효과) - translateZ 사용 - localFrame 사용으로 각 텍스트마다 작동
  const zoomInProgress = hasZoomIn
    ? interpolate(localFrame, [0, fps * 2.5], [1, 0], { extrapolateRight: 'clamp' })
    : 0;
  const zoomInZ = hasZoomIn ? zoomInProgress * -800 * baseUnit : 0; // 비율 기반 Z축 이동
  const zoomInScale = hasZoomIn ? 1 - zoomInProgress * 0.5 : 1; // 작게 시작해서 커짐

  // 2. Flip Up (밑에서 휘어서 올라오는 효과) - localFrame 사용으로 각 텍스트마다 작동 - 강화됨
  const flipUpProgress = hasFlipUp
    ? interpolate(localFrame, [0, fps * 2], [1, 0], { extrapolateRight: 'clamp' })
    : 0;
  const flipUpRotateX = hasFlipUp ? flipUpProgress * 120 : 0; // 90 → 120도 (더 큰 회전)
  const flipUpY = hasFlipUp ? flipUpProgress * 400 * baseUnit : 0; // 비율 기반 Y축 이동
  const flipUpZ = hasFlipUp ? flipUpProgress * -600 * baseUnit : 0; // 비율 기반 Z축 이동

  // 3. Spiral 3D (나선형 3D 회전) - 부드러운 fadeout 적용
  const spiral3dRotateX = hasSpiral3d ? Math.sin(repeatPhase) * 30 * fadeoutFactor : 0;
  const spiral3dRotateY = hasSpiral3d ? Math.cos(repeatPhase) * 40 * fadeoutFactor : 0;
  const spiral3dZ = hasSpiral3d ? Math.sin(repeatPhase * 2) * 150 * baseUnit * fadeoutFactor : 0;

  // 4. Wave 3D (3D 파도 움직임) - 부드러운 fadeout 적용
  const wave3dRotateX = hasWave3d ? Math.sin(repeatPhase) * 25 * fadeoutFactor : 0;
  const wave3dZ = hasWave3d ? Math.sin(repeatPhase + Math.PI / 2) * 200 * baseUnit * fadeoutFactor : 0; // 비율 기반 Z축
  const wave3dY = hasWave3d ? Math.cos(repeatPhase) * 30 * baseUnit * fadeoutFactor : 0; // 비율 기반 Y축

  // 5. Tumble (공중제비/텀블링) - 4초 동안 회전 완료 후 정지
  // progressive 회전(X,Y)은 fadeout하면 역회전되므로 fadeout 미적용
  // 720도=0도, 360도=0도 (완전 회전 = 제자리)
  const tumbleRotateX = hasTumble ? repeatProgress * 720 : 0; // X축 2회전
  const tumbleRotateY = hasTumble ? repeatProgress * 360 : 0; // Y축 1회전
  const tumbleZ = hasTumble ? Math.sin(repeatPhase) * 100 * baseUnit * fadeoutFactor : 0; // 비율 기반 Z축

  // 3D Depth Shadow (LED 홀로그램 팬용 깊이 그림자 - 자동)
  // Z축 깊이에 따라 그림자 크기 자동 조정
  const totalZDepth = Math.abs(zoomInZ + flipUpZ + spiral3dZ + wave3dZ + tumbleZ);
  const depthShadowIntensity = totalZDepth / 300; // 0~1 범위로 정규화
  const depthShadow = depthShadowIntensity > 0.1
    ? `0 ${depthShadowIntensity * 30}px ${depthShadowIntensity * 80}px rgba(0,0,0,${0.3 + depthShadowIntensity * 0.4})`
    : '';

  // === 새로운 이펙트 계산 (2024-01 추가) ===

  // Typewriter Effect (타이핑 효과) - 2초 동안 글자가 하나씩 나타남
  const typewriterChars = hasTypewriter
    ? Math.floor(interpolate(localFrame, [0, fps * 2], [0, text.length], { extrapolateRight: 'clamp' }))
    : text.length;
  const displayText = hasTypewriter ? text.slice(0, typewriterChars) : text;

  // Shake Effect (흔들림) - noise2D 기반 빠른 떨림
  const shakeX = hasShake ? noise2D('shake-x', frame * 0.5, seed) * 8 * baseUnit * fadeoutFactor : 0;
  const shakeY = hasShake ? noise2D('shake-y', frame * 0.5, seed + 10) * 8 * baseUnit * fadeoutFactor : 0;

  // Neon Effect (네온 깜빡임) - 네온 사인처럼 깜빡임
  const neonNoise = hasNeon ? noise2D('neon', frame * 0.2, seed) : 0;
  const neonFlicker = hasNeon ? (neonNoise > 0.3 ? 1 : 0.4) : 1;
  const neonGlow = hasNeon
    ? `0 0 10px ${glowColor}, 0 0 20px ${glowColor}, 0 0 40px ${glowColor}, 0 0 80px ${glowColor}`
    : '';

  // Float Effect (부유) - 부드럽게 위아래로 떠다님
  const floatY = hasFloat ? Math.sin(repeatPhase * 0.5) * 25 * baseUnit * fadeoutFactor : 0;

  // Elastic Effect (탄성 진입) - 더 강한 탄성 바운스
  const elasticScale = hasElastic
    ? interpolate(
      localFrame,
      [0, fps * 1.2],
      [0.3, 1],
      { extrapolateRight: 'clamp', easing: Easing.elastic(1.5) }
    )
    : 1;

  // Position Logic - 상중하만 지원 (% 단위 사용 - Remotion 렌더링 호환)
  // 이펙트들이 Y축으로 최대 ±150px 움직일 수 있으므로 안전한 마진 확보
  // 1080px 기준: 상단 30%=324px, 중앙 50%=540px, 하단 68%=734px
  const leftPos = '50%'; // 항상 가로 중앙
  let topPos = '68%'; // 기본값 (하단) - 75% → 68%로 조정

  if (textPosition === 'random') {
    const randVal = seed % 1; // 0~1 범위로 정규화
    if (randVal < 0.33) { // Top
      topPos = '30%'; // 상단 - 20% → 30%로 조정 (이펙트 마진 확보)
    } else if (randVal < 0.66) { // Middle
      topPos = '50%'; // 중앙 - 변경 없음
    } else { // Bottom
      topPos = '68%'; // 하단 - 75% → 68%로 조정
    }
  } else if (textPosition === 'top') {
    topPos = '30%'; // 상단 - 20% → 30%로 조정
  } else if (textPosition === 'center') {
    topPos = '50%'; // 중앙 - 변경 없음
  } else if (textPosition === 'bottom') {
    topPos = '68%'; // 하단 - 75% → 68%로 조정
  }

  // Y축 이동량 계산 및 클램프 (프레임 밖으로 나가지 않도록 제한)
  const rawYOffset = driftY + waveY + bounceY + spiralY + orbitY + flipUpY + wave3dY + floatY + shakeY;
  const rawXOffset = driftX + spiralX + swingX + slideX + orbitX + shakeX;

  // 위치에 따른 Y축 이동 제한값 (비율 기반으로 해상도에 맞게 조정)
  // 상단(30%): 위로 제한, 아래로 제한
  // 중앙(50%): 균등 제한
  // 하단(68%): 위로 제한, 아래로 제한
  let maxYUp = -250 * baseUnit;
  let maxYDown = 250 * baseUnit;
  if (topPos === '30%') {
    maxYUp = -120 * baseUnit; // 상단은 위로 덜 움직이게
    maxYDown = 200 * baseUnit;
  } else if (topPos === '68%') {
    maxYUp = -200 * baseUnit;
    maxYDown = 120 * baseUnit; // 하단은 아래로 덜 움직이게
  }

  const clampedYOffset = Math.max(maxYUp, Math.min(maxYDown, rawYOffset));
  const clampedXOffset = Math.max(-150 * baseUnit, Math.min(150 * baseUnit, rawXOffset)); // X축도 비율 기반 제한

  // makeTransform으로 깔끔하게 transform 조합
  const totalZDepthValue = zoomInZ + flipUpZ + spiral3dZ + wave3dZ + tumbleZ;
  const totalRotateXValue = rotateX + flipUpRotateX + spiral3dRotateX + wave3dRotateX + tumbleRotateX;
  const totalRotateYValue = rotateY + spiral3dRotateY + tumbleRotateY;
  const totalRotateValue = waveRotate + spinRotation + swingRotate;
  const totalScaleValue = zoomScale * zoomInScale;

  const containerTransform = makeTransform([
    translate('-50%', '-50%'),
    translate(`${clampedXOffset}px`, `${clampedYOffset}px`),
    translateZ(totalZDepthValue),
    rotateXTransform(totalRotateXValue),
    rotateYTransform(totalRotateYValue),
    rotate(totalRotateValue),
    scaleTransform(totalScaleValue),
  ]);

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: topPos,
    left: leftPos,
    perspective: '1200px',
    transform: containerTransform,
    width: '90%',     // 비율 기반 (1000px 고정 → 90%)
    maxWidth: '90%',  // 비율 기반 (1000px 고정 → 90%)
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    transformStyle: 'preserve-3d',
  };

  // textShadow 배열로 합치기 (빈 문자열 필터링)
  const allShadows = [dynamicGlow, pulseShadow, depthShadow, extrudeShadow, neonGlow]
    .filter(s => s !== '');
  const combinedTextShadow = allShadows.length > 0 ? allShadows.join(', ') : 'none';

  // filter 배열로 합치기
  const allFilters = [];
  if (isGlitching) {
    allFilters.push(`blur(${4 + blurAmount}px)`, 'contrast(200%)', 'hue-rotate(90deg)');
  } else if (blurAmount > 0) {
    allFilters.push(`blur(${blurAmount}px)`);
  }
  if (hasRainbow) {
    allFilters.push(`hue-rotate(${rainbowHue}deg)`);
  }
  const combinedFilter = allFilters.length > 0 ? allFilters.join(' ') : 'none';

  const textStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontFamily,
    fontWeight: 900,
    color: color,
    textAlign: 'center',
    whiteSpace: 'pre-wrap', // 줄바꿈 허용
    textWrap: 'balance', // 균형잡힌 줄바꿈 (각 줄 문자 수 균등 분배)
    width: 'auto',
    minWidth: 0, // flexbox 기본값 override
    maxWidth: '100%', // 부모 컨테이너 크기에 맞춤
    overflow: 'visible', // 글로우 이펙트 보이도록 visible 유지
    opacity: (opacity * strobe * neonFlicker) * (hasHologram ? hologramOpacity : 1),
    textShadow: combinedTextShadow,
    transform: `translateX(${glitchOffset + (hasHologram ? hologramOffset : 0)}px) scale(${(hasPixelate ? pixelateScale : 1) * elasticScale})`,
    filter: combinedFilter,
  } as React.CSSProperties;

  return (
    <div style={containerStyle}>
      {/* EXTREME RGB Split Effect (Glitch) */}
      {isGlitching && (
        <div style={{ ...textStyle, position: 'absolute', color: '#ff0055', transform: `translate(-12px, -8px) scale(1.05)`, opacity: 0.8, mixBlendMode: 'screen' }}>
          {displayText}
        </div>
      )}
      {isGlitching && (
        <div style={{ ...textStyle, position: 'absolute', color: '#00ccff', transform: `translate(12px, 8px) scale(0.95)`, opacity: 0.8, mixBlendMode: 'screen' }}>
          {displayText}
        </div>
      )}

      {/* Chromatic Aberration Effect (색수차) */}
      {hasChromatic && (
        <>
          <div style={{ ...textStyle, position: 'absolute', color: '#ff0000', transform: `translateX(${-chromaticOffset}px)`, opacity: 0.6, mixBlendMode: 'screen', filter: 'none' }}>
            {displayText}
          </div>
          <div style={{ ...textStyle, position: 'absolute', color: '#00ff00', transform: `translateX(0px)`, opacity: 0.6, mixBlendMode: 'screen', filter: 'none' }}>
            {displayText}
          </div>
          <div style={{ ...textStyle, position: 'absolute', color: '#0000ff', transform: `translateX(${chromaticOffset}px)`, opacity: 0.6, mixBlendMode: 'screen', filter: 'none' }}>
            {displayText}
          </div>
        </>
      )}

      {/* Main Text */}
      <div style={textStyle}>
        {displayText}
        {/* Typewriter 커서 (타이핑 효과 활성화 시) */}
        {hasTypewriter && typewriterChars < text.length && (
          <span style={{ opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0 }}>|</span>
        )}
      </div>
    </div>
  );
};

// TransitionSeries용 텍스트 컴포넌트 (프레임 체크 없음 - TransitionSeries가 관리)
const TextSceneContent: React.FC<{
  scene: TextScene;
  fontSize: number;
  fontFamily: string;
  textColor: string;
  glowColor: string;
  effects: string[];
  textPosition: 'random' | 'top' | 'center' | 'bottom';
}> = ({ scene, fontSize, fontFamily, textColor, glowColor, effects, textPosition }) => {
  const frame = useCurrentFrame();  // Sequence 내부 상대 프레임 (0~149)
  const { fps } = useVideoConfig();

  // 전역 프레임 계산 (noise2D에서 텍스트별 고유 패턴 생성용)
  const globalFrame = scene.startFrame + frame;
  const localFrame = frame;
  const duration = fps * 5; // 5초 고정

  // Entrance/Exit Animations (Fast Fly-in / Blur-out)
  const entranceDuration = fps * 0.8;
  const exitDuration = fps * 0.5;

  const opacity = interpolate(
    localFrame,
    [0, entranceDuration, duration - exitDuration, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Scale Bounce effect on entrance
  const scaleValue = interpolate(
    localFrame,
    [0, entranceDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.elastic(1)
    }
  );

  const textContent = (
    <div style={{ width: '100%', height: '100%', transform: `scale(${scaleValue})` }}>
      <KineticText
        text={scene.text}
        fontSize={fontSize}
        fontFamily={fontFamily}
        color={textColor}
        glowColor={glowColor}
        opacity={opacity}
        frame={globalFrame}  // 전역 프레임 (noise2D용 - 텍스트별 고유 패턴)
        localFrame={localFrame}
        seed={scene.seed}
        effects={effects}
        textPosition={textPosition}
      />
    </div>
  );

  // CameraMotionBlur 제거 - 렌더링 시간 최적화 (samples=8이 렌더링 시간 8배 증가 유발)
  return textContent;
};

export const HologramTextOverlay: React.FC<HologramTextOverlayProps & { imageSrc?: string }> = ({
  videoSrc,
  imageSrc,
  referenceImageSrc,
  texts,
  fontFamily = "'Noto Sans KR', sans-serif",
  fontSize = 65, // 기본 폰트 사이즈 65px
  textColor = '#ffffff',
  glowColor = '#00ffff',
  effects = [], // 기본값: 이펙트 없음
  textPosition = 'random',
}) => {
  // effects 배열 그대로 사용 (빈 배열이면 이펙트 없음)
  const activeEffects = effects || [];
  const { fps } = useVideoConfig();
  const sceneDurationInFrames = fps * 5; // 5초 per text (6개 × 5초 = 30초)

  const textScenes: TextScene[] = useMemo(() => {
    return texts.map((text, index) => ({
      text,
      startFrame: index * sceneDurationInFrames,
      endFrame: (index + 1) * sceneDurationInFrames,
      seed: random(index * 123), // Deterministic random seed
    }));
  }, [texts, sceneDurationInFrames]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* Background: Video or Image */}
      {videoSrc ? (
        <Video
          src={videoSrc}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          delayRenderTimeoutInMilliseconds={60000}
        // loop 제거: 30초 템플릿 영상과 30초 렌더링이 정확히 일치하므로 불필요
        />
      ) : imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt="Background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      ) : null}

      {/* Cinematic Overlays - [Optimized] REMOVED
          노이즈, 스캔라인, 비네팅 제거로 고화질 유지 및 렌더링 속도 향상
          Dark Overlay는 가독성을 위해 상단에서 유지 (가볍게 처리됨)
       */}
    </AbsoluteFill>
  );
};

export default HologramTextOverlay;
