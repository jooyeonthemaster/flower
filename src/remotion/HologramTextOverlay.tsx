'use client';

import { AbsoluteFill, Video, useCurrentFrame, useVideoConfig, interpolate, Easing, random } from 'remotion';
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
  const { fps } = useVideoConfig();

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

  // 반복 움직임 공통 타이밍: 3초에 2회 반복 후 2초 정지
  const repeatProgress = Math.min(localFrame / (fps * 3), 1); // 0~1 (3초)
  const repeatPhase = repeatProgress * Math.PI * 4; // 2주기 (4π)

  // 1. Orbital / Wandering Motion (전역 이동) - 3초에 2회 반복 후 정지
  const driftX = hasDrift
    ? Math.sin(repeatPhase + seed) * 80
    : 0;
  const driftY = hasDrift
    ? Math.cos(repeatPhase + seed * 2) * 50
    : 0;

  // 3D Rotation (Perspective effect) - 3초에 2회 반복 후 정지
  const rotateX = hasRotate3d
    ? Math.sin(repeatPhase + seed) * 20
    : 0;
  const rotateY = hasRotate3d
    ? Math.cos(repeatPhase + seed) * 30
    : 0;

  // Intense Glitch Jitter (확률 증가 및 강도 증가)
  const isGlitching = hasGlitch
    ? random(frame + seed) > 0.8  // 0.88 → 0.8 (20% 확률)
    : false;
  const glitchOffset = isGlitching ? interpolate(random(frame), [0, 1], [-25, 25]) : 0;  // -15~15 → -25~25

  // Strobe / Flicker Effect (확률 증가)
  const strobe = hasStrobe
    ? (random(frame + seed * 2) > 0.85 ? 0.3 : 1)  // 0.95 → 0.85 (15% 확률)
    : 1;

  // Pulse Effect (박동 효과) - 3초에 2회 반복 후 정지
  const pulseIntensity = hasPulse ? Math.sin(repeatPhase) * 0.3 + 0.9 : 1.0;
  const pulseShadow = hasPulse
    ? `0 0 ${10 * pulseIntensity}px ${glowColor}, 0 0 ${20 * pulseIntensity}px ${glowColor}, 0 0 ${40 * pulseIntensity}px ${glowColor}`
    : '';

  // Glow Effect (글로우 효과)
  const dynamicGlow = hasGlow
    ? `0 0 15px ${glowColor}, 0 0 30px ${glowColor}, 0 0 60px ${glowColor}, 0 0 100px ${glowColor}, 0 0 150px ${glowColor}`
    : '';

  // Wave Effect (물결 움직임) - 3초에 2회 반복 후 정지
  const waveY = hasWave
    ? Math.sin(repeatPhase + seed) * 30
    : 0;
  const waveRotate = hasWave
    ? Math.sin(repeatPhase + seed) * 5
    : 0;

  // Zoom Effect (확대/축소) - 3초에 2회 반복 후 정지
  const zoomScale = hasZoom
    ? 1 + Math.sin(repeatPhase + seed) * 0.25  // 0.75~1.25 범위
    : 1;

  // Blur Effect (흐릿함) - 3초에 2회 반복 후 정지
  const blurAmount = hasBlur
    ? Math.abs(Math.sin(repeatPhase + seed)) * 5
    : 0;

  // Chromatic Aberration (색수차) - 3초에 2회 반복 후 정지
  const chromaticOffset = hasChromatic
    ? Math.sin(repeatPhase + seed) * 10
    : 0;

  // Hologram Effect (홀로그램 스캔라인) - 3초에 2회 반복 후 정지
  const hologramOffset = hasHologram
    ? Math.sin(repeatPhase) * 8
    : 0;
  const hologramOpacity = hasHologram
    ? 0.5 + Math.sin(repeatPhase) * 0.4  // 0.5~0.9
    : 1;

  // Pixelate Effect (픽셀화) - 3초에 2회 반복 후 정지
  const pixelateScale = hasPixelate
    ? 1 + Math.sin(repeatPhase) * 0.5  // 0.5~1.5
    : 1;

  // Rainbow Effect (무지개 색상 변화) - 3초에 2회 반복 후 정지
  const rainbowHue = hasRainbow
    ? (repeatProgress * 720) % 360  // 2회전 (0→720도)
    : 0;

  // 3D Extrude Effect (텍스트 입체 효과 - 매우 두꺼운 3D)
  const extrudeShadow = hasExtrude
    ? (() => {
        // 그림자 방향 (우하단 - 약간 오른쪽으로)
        const layers = [];
        const depth = 60; // 깊이 (레이어 개수) - 20 → 60으로 증가
        const angleX = 135; // X 방향 각도 (135도 = 좌하단)
        const angleY = 135; // Y 방향 각도
        const angleRadX = (angleX * Math.PI) / 180;
        const angleRadY = (angleY * Math.PI) / 180;

        // glowColor 파싱
        const baseR = parseInt(glowColor.slice(1, 3), 16);
        const baseG = parseInt(glowColor.slice(3, 5), 16);
        const baseB = parseInt(glowColor.slice(5, 7), 16);

        // 색상 계산 (앞에서 뒤로 갈수록 그라데이션)
        for (let i = 1; i <= depth; i++) {
          const offsetX = Math.cos(angleRadX) * i * 0.7; // 0.7 곱해서 X 방향 조정
          const offsetY = Math.sin(angleRadY) * i * 0.7; // 0.7 곱해서 Y 방향 조정

          // 색상 그라데이션 (앞: glowColor → 뒤: 매우 어두운 색)
          const progress = i / depth; // 0~1
          const darkenFactor = 1 - progress * 0.85; // 85%까지 어두워짐

          const r = Math.floor(baseR * darkenFactor);
          const g = Math.floor(baseG * darkenFactor);
          const b = Math.floor(baseB * darkenFactor);

          // 블러 추가 (뒤로 갈수록 약간 블러)
          const blur = i > depth * 0.7 ? 1 : 0; // 뒤쪽 30%만 블러

          const shadowColor = `rgb(${r}, ${g}, ${b})`;
          layers.push(`${offsetX}px ${offsetY}px ${blur}px ${shadowColor}`);
        }

        return layers.join(', ');
      })()
    : '';

  // 새로운 움직임/크기 이펙트들 - 모두 3초에 2회 반복 후 정지

  // Bounce Effect (위아래 바운스) - 3초에 2회 반복 후 정지
  const bounceY = hasBounce
    ? Math.abs(Math.sin(repeatPhase + seed)) * 50
    : 0;

  // Spin Effect (2D 평면 회전) - 3초에 2회전 후 정지
  const spinRotation = hasSpin
    ? repeatProgress * 720  // 0→720도
    : 0;

  // Spiral Effect (나선형 움직임) - 3초에 2회 반복 후 정지
  const spiralRadius = hasSpiral
    ? 30 + Math.sin(repeatPhase + seed) * 20  // 10~50 사이로 진동
    : 0;
  const spiralX = hasSpiral
    ? Math.cos(repeatPhase + seed) * spiralRadius
    : 0;
  const spiralY = hasSpiral
    ? Math.sin(repeatPhase + seed) * spiralRadius
    : 0;

  // Swing Effect (좌우 스윙) - 3초에 2회 반복 후 정지
  const swingX = hasSwing
    ? Math.sin(repeatPhase + seed) * 60
    : 0;
  const swingRotate = hasSwing
    ? Math.sin(repeatPhase + seed) * 15
    : 0;

  // Slide Effect (좌우 슬라이드) - 3초에 2회 반복 후 정지
  const slideX = hasSlide
    ? Math.sin(repeatPhase + seed) * 80
    : 0;

  // Orbit Effect (원형 궤도 움직임) - 3초에 2회 반복 후 정지
  const orbitRadius = 35;
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
  const zoomInZ = hasZoomIn ? zoomInProgress * -800 : 0; // -800px에서 0으로
  const zoomInScale = hasZoomIn ? 1 - zoomInProgress * 0.5 : 1; // 작게 시작해서 커짐

  // 2. Flip Up (밑에서 휘어서 올라오는 효과) - localFrame 사용으로 각 텍스트마다 작동 - 강화됨
  const flipUpProgress = hasFlipUp
    ? interpolate(localFrame, [0, fps * 2], [1, 0], { extrapolateRight: 'clamp' })
    : 0;
  const flipUpRotateX = hasFlipUp ? flipUpProgress * 120 : 0; // 90 → 120도 (더 큰 회전)
  const flipUpY = hasFlipUp ? flipUpProgress * 400 : 0; // 200 → 400 (2배 더 아래에서 시작)
  const flipUpZ = hasFlipUp ? flipUpProgress * -600 : 0; // -300 → -600 (2배 더 뒤에서 시작)

  // 3. Spiral 3D (나선형 3D 회전) - 3초에 2회 반복 후 정지
  const spiral3dRotateX = hasSpiral3d ? Math.sin(repeatPhase) * 30 : 0;
  const spiral3dRotateY = hasSpiral3d ? Math.cos(repeatPhase) * 40 : 0;
  const spiral3dZ = hasSpiral3d ? Math.sin(repeatPhase * 2) * 150 : 0;

  // 4. Wave 3D (3D 파도 움직임) - 3초에 2회 반복 후 정지
  const wave3dRotateX = hasWave3d ? Math.sin(repeatPhase) * 25 : 0;
  const wave3dZ = hasWave3d ? Math.sin(repeatPhase + Math.PI / 2) * 200 : 0; // 앞뒤 파도
  const wave3dY = hasWave3d ? Math.cos(repeatPhase) * 30 : 0; // 위아래 파도

  // 5. Tumble (공중제비/텀블링) - 3초에 2회전 후 2초 정지
  const tumbleRotateX = hasTumble ? repeatProgress * 720 : 0; // X축 2회전 (0→720도, 3초 완료)
  const tumbleRotateY = hasTumble ? repeatProgress * 360 : 0; // Y축 1회전 (0→360도, 3초 완료)
  const tumbleZ = hasTumble ? Math.sin(repeatPhase) * 100 : 0; // 앞뒤 흔들림 (2주기)

  // 3D Depth Shadow (LED 홀로그램 팬용 깊이 그림자 - 자동)
  // Z축 깊이에 따라 그림자 크기 자동 조정
  const totalZDepth = Math.abs(zoomInZ + flipUpZ + spiral3dZ + wave3dZ + tumbleZ);
  const depthShadowIntensity = totalZDepth / 300; // 0~1 범위로 정규화
  const depthShadow = depthShadowIntensity > 0.1
    ? `0 ${depthShadowIntensity * 30}px ${depthShadowIntensity * 80}px rgba(0,0,0,${0.3 + depthShadowIntensity * 0.4})`
    : '';

  // Position Logic - 상중하만 지원 (% 단위 사용 - Remotion 렌더링 호환)
  const leftPos = '50%'; // 항상 가로 중앙
  let topPos = '75%'; // 기본값 (하단)

  if (textPosition === 'random') {
    const randVal = seed % 1; // 0~1 범위로 정규화
    if (randVal < 0.33) { // Top
      topPos = '20%'; // 상단
    } else if (randVal < 0.66) { // Middle
      topPos = '50%'; // 중앙
    } else { // Bottom
      topPos = '75%'; // 하단
    }
  } else if (textPosition === 'top') {
    topPos = '20%'; // 상단
  } else if (textPosition === 'center') {
    topPos = '50%'; // 중앙
  } else if (textPosition === 'bottom') {
    topPos = '75%'; // 하단
  }

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: topPos,
    left: leftPos,
    // perspective는 별도 속성으로 분리 (transform 순서 충돌 방지)
    perspective: '1200px',
    transform: `
      translate(-50%, -50%)
      translate(
        ${driftX + spiralX + swingX + slideX + orbitX}px,
        ${driftY + waveY + bounceY + spiralY + orbitY + flipUpY + wave3dY}px
      )
      translateZ(${zoomInZ + flipUpZ + spiral3dZ + wave3dZ + tumbleZ}px)
      rotateX(${rotateX + flipUpRotateX + spiral3dRotateX + wave3dRotateX + tumbleRotateX}deg)
      rotateY(${rotateY + spiral3dRotateY + tumbleRotateY}deg)
      rotate(${waveRotate + spinRotation + swingRotate}deg)
      scale(${zoomScale * zoomInScale})
    `,
    width: '1000px', // 명시적 크기 설정 (absolute positioning shrink-to-fit 방지)
    maxWidth: '1000px', // Container 최대 가로 길이 제한
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    // LED 홀로그램 팬용 깊이감 강화
    transformStyle: 'preserve-3d',
  };

  // textShadow 배열로 합치기 (빈 문자열 필터링)
  const allShadows = [dynamicGlow, pulseShadow, depthShadow, extrudeShadow]
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
    opacity: (opacity * strobe) * (hasHologram ? hologramOpacity : 1),
    textShadow: combinedTextShadow,
    transform: `translateX(${glitchOffset + (hasHologram ? hologramOffset : 0)}px) scale(${hasPixelate ? pixelateScale : 1})`,
    filter: combinedFilter,
  } as React.CSSProperties;

  return (
    <div style={containerStyle}>
      {/* EXTREME RGB Split Effect (Glitch) */}
      {isGlitching && (
        <div style={{ ...textStyle, position: 'absolute', color: '#ff0055', transform: `translate(-12px, -8px) scale(1.05)`, opacity: 0.8, mixBlendMode: 'screen' }}>
          {text}
        </div>
      )}
      {isGlitching && (
        <div style={{ ...textStyle, position: 'absolute', color: '#00ccff', transform: `translate(12px, 8px) scale(0.95)`, opacity: 0.8, mixBlendMode: 'screen' }}>
          {text}
        </div>
      )}

      {/* Chromatic Aberration Effect (색수차) */}
      {hasChromatic && (
        <>
          <div style={{ ...textStyle, position: 'absolute', color: '#ff0000', transform: `translateX(${-chromaticOffset}px)`, opacity: 0.6, mixBlendMode: 'screen', filter: 'none' }}>
            {text}
          </div>
          <div style={{ ...textStyle, position: 'absolute', color: '#00ff00', transform: `translateX(0px)`, opacity: 0.6, mixBlendMode: 'screen', filter: 'none' }}>
            {text}
          </div>
          <div style={{ ...textStyle, position: 'absolute', color: '#0000ff', transform: `translateX(${chromaticOffset}px)`, opacity: 0.6, mixBlendMode: 'screen', filter: 'none' }}>
            {text}
          </div>
        </>
      )}

      {/* Main Text */}
      <div style={textStyle}>
        {text}
      </div>
    </div>
  );
};

const TextSceneComponent: React.FC<{
  scene: TextScene;
  fontSize: number;
  fontFamily: string;
  textColor: string;
  glowColor: string;
  effects: string[];
  textPosition: 'random' | 'top' | 'center' | 'bottom';
}> = ({ scene, fontSize, fontFamily, textColor, glowColor, effects, textPosition }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active check
  if (frame < scene.startFrame || frame >= scene.endFrame) return null;

  const localFrame = frame - scene.startFrame;
  const duration = scene.endFrame - scene.startFrame;

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
  const scale = interpolate(
    localFrame,
    [0, entranceDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.elastic(1)
    }
  );

  return (
    <div style={{ width: '100%', height: '100%', transform: `scale(${scale})` }}>
      <KineticText
        text={scene.text}
        fontSize={fontSize}
        fontFamily={fontFamily}
        color={textColor}
        glowColor={glowColor}
        opacity={opacity}
        frame={frame}
        localFrame={localFrame}
        seed={scene.seed}
        effects={effects}
        textPosition={textPosition}
      />
    </div>
  );
};

export const HologramTextOverlay: React.FC<HologramTextOverlayProps & { imageSrc?: string }> = ({
  videoSrc,
  imageSrc,
  referenceImageSrc,
  texts,
  fontFamily = "'Noto Sans KR', sans-serif",
  fontSize = 50, // 기본 폰트 사이즈 50px로 축소
  textColor = '#ffffff',
  glowColor = '#00ffff',
  effects = [], // 기본값: 이펙트 없음
  textPosition = 'random',
}) => {
  // effects 배열 그대로 사용 (빈 배열이면 이펙트 없음)
  const activeEffects = effects || [];
  const { fps } = useVideoConfig();
  const sceneDurationInFrames = fps * 5; // 5 seconds per text

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

      {/* Dark Overlay with Gradient (More cinematic) */}
      <AbsoluteFill style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.4))'
      }} />

      {/* Reference Image Layer (로고/인물 사진 - 배경 제거됨) */}
      {referenceImageSrc && (
        <AbsoluteFill style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingTop: '8%',
          zIndex: 10,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={referenceImageSrc}
            alt="Reference"
            style={{
              width: '35%',
              height: 'auto',
              maxHeight: '40%',
              objectFit: 'contain',
              mixBlendMode: 'screen',
              filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5)) drop-shadow(0 0 40px rgba(0,255,255,0.3))',
            }}
          />
        </AbsoluteFill>
      )}

      {/* Text Scenes */}
      {textScenes.map((scene, index) => (
        <TextSceneComponent
          key={index}
          scene={scene}
          fontSize={fontSize}
          fontFamily={fontFamily}
          textColor={textColor}
          glowColor={glowColor}
          effects={activeEffects}
          textPosition={textPosition}
        />
      ))}

      {/* Cinematic Overlays (Enhanced) */}

      {/* 1. Digital Noise / Grain (Optimized - CSS Gradient) */}
      <AbsoluteFill style={{
        background: `
          radial-gradient(circle at 20% 50%, transparent 0%, rgba(255,255,255,0.02) 100%),
          radial-gradient(circle at 80% 20%, transparent 0%, rgba(255,255,255,0.01) 100%),
          radial-gradient(circle at 40% 80%, transparent 0%, rgba(255,255,255,0.015) 100%)
        `,
        opacity: 0.15,
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
      }} />

      {/* 2. Scanlines (Moving) */}
      <AbsoluteFill style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)',
        pointerEvents: 'none',
        mixBlendMode: 'color-dodge',
      }} />

      {/* 3. Vignette */}
      <AbsoluteFill style={{
        background: 'radial-gradient(circle, transparent 50%, black 120%)',
        pointerEvents: 'none',
        opacity: 0.7,
      }} />
    </AbsoluteFill>
  );
};

export default HologramTextOverlay;
