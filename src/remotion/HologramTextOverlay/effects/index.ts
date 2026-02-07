import { noise2D, noise3D } from '@remotion/noise';
import { interpolate, Easing, random } from 'remotion';

export interface EffectCalculations {
  // Movement effects
  driftX: number;
  driftY: number;
  bounceY: number;
  spiralX: number;
  spiralY: number;
  swingX: number;
  slideX: number;
  orbitX: number;
  orbitY: number;
  waveY: number;
  floatY: number;
  shakeX: number;
  shakeY: number;

  // Rotation effects
  rotateX: number;
  rotateY: number;
  waveRotate: number;
  spinRotation: number;
  swingRotate: number;

  // 3D depth effects
  zoomInZ: number;
  zoomInScale: number;
  flipUpRotateX: number;
  flipUpY: number;
  flipUpZ: number;
  spiral3dRotateX: number;
  spiral3dRotateY: number;
  spiral3dZ: number;
  wave3dRotateX: number;
  wave3dZ: number;
  wave3dY: number;
  tumbleRotateX: number;
  tumbleRotateY: number;
  tumbleZ: number;

  // Scale effects
  zoomScale: number;
  pixelateScale: number;
  elasticScale: number;

  // Visual effects
  glitchOffset: number;
  isGlitching: boolean;
  strobe: number;
  pulseIntensity: number;
  blurAmount: number;
  chromaticOffset: number;
  hologramOffset: number;
  hologramOpacity: number;
  rainbowHue: number;
  neonFlicker: number;

  // Text effects
  typewriterChars: number;

  // Shadow effects
  pulseShadow: string;
  dynamicGlow: string;
  depthShadow: string;
  extrudeShadow: string;
  neonGlow: string;
}

interface EffectParams {
  effects: string[];
  frame: number;
  localFrame: number;
  seed: number;
  fps: number;
  baseUnit: number;
  fadeoutFactor: number;
  repeatPhase: number;
  repeatProgress: number;
  glowColor: string;
  text: string;
}

/**
 * Calculate all effects based on active effect list and parameters
 */
export function calculateEffects(params: EffectParams): EffectCalculations {
  const {
    effects,
    frame,
    localFrame,
    seed,
    fps,
    baseUnit,
    fadeoutFactor,
    repeatPhase,
    repeatProgress,
    glowColor,
    text,
  } = params;

  // Effect flags
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
  const hasBounce = effects.includes('bounce');
  const hasSpin = effects.includes('spin');
  const hasSpiral = effects.includes('spiral');
  const hasSwing = effects.includes('swing');
  const hasSlide = effects.includes('slide');
  const hasOrbit = effects.includes('orbit');
  const hasZoomIn = effects.includes('zoomIn');
  const hasFlipUp = effects.includes('flipUp');
  const hasSpiral3d = effects.includes('spiral3d');
  const hasWave3d = effects.includes('wave3d');
  const hasTumble = effects.includes('tumble');
  const hasExtrude = effects.includes('extrude');
  const hasTypewriter = effects.includes('typewriter');
  const hasShake = effects.includes('shake');
  const hasNeon = effects.includes('neon');
  const hasFloat = effects.includes('float');
  const hasElastic = effects.includes('elastic');

  // Drift effect (noise-based wandering)
  const driftNoiseX = hasDrift ? noise2D('drift-x', frame * 0.03, seed) : 0;
  const driftNoiseY = hasDrift ? noise2D('drift-y', frame * 0.025, seed + 50) : 0;
  const driftX = hasDrift ? driftNoiseX * 90 * baseUnit * fadeoutFactor : 0;
  const driftY = hasDrift ? driftNoiseY * 55 * baseUnit * fadeoutFactor : 0;

  // 3D Rotation
  const rotateX = hasRotate3d ? Math.sin(repeatPhase + seed) * 20 * fadeoutFactor : 0;
  const rotateY = hasRotate3d ? Math.cos(repeatPhase + seed) * 30 * fadeoutFactor : 0;

  // Glitch effect
  const glitchNoise = hasGlitch ? noise2D('glitch', frame * 0.15, seed) : 0;
  const isGlitching = hasGlitch ? glitchNoise > 0.6 : false;
  const glitchOffset = isGlitching ? noise2D('glitch-offset', frame * 0.3, seed + 100) * 30 * baseUnit : 0;

  // Strobe effect
  const strobe = hasStrobe ? (random(frame + seed * 2) > 0.85 ? 0.3 : 1) : 1;

  // Pulse effect
  const pulseIntensity = hasPulse ? (Math.sin(repeatPhase) * 0.3 * fadeoutFactor) + 0.9 + (0.1 * (1 - fadeoutFactor)) : 1.0;
  const pulseShadow = hasPulse
    ? `0 0 ${10 * pulseIntensity}px ${glowColor}, 0 0 ${20 * pulseIntensity}px ${glowColor}, 0 0 ${40 * pulseIntensity}px ${glowColor}`
    : '';

  // Glow effect
  const dynamicGlow = hasGlow
    ? `0 0 15px ${glowColor}, 0 0 30px ${glowColor}, 0 0 60px ${glowColor}, 0 0 100px ${glowColor}, 0 0 150px ${glowColor}`
    : '';

  // Wave effect
  const waveY = hasWave ? Math.sin(repeatPhase + seed) * 30 * baseUnit * fadeoutFactor : 0;
  const waveRotate = hasWave ? Math.sin(repeatPhase + seed) * 5 * fadeoutFactor : 0;

  // Zoom effect
  const zoomScale = hasZoom ? 1 + Math.sin(repeatPhase + seed) * 0.25 * fadeoutFactor : 1;

  // Blur effect
  const blurAmount = hasBlur ? Math.abs(Math.sin(repeatPhase + seed)) * 5 * fadeoutFactor : 0;

  // Chromatic aberration
  const chromaticOffset = hasChromatic ? Math.sin(repeatPhase + seed) * 10 * baseUnit * fadeoutFactor : 0;

  // Hologram effect
  const hologramNoise = hasHologram ? noise3D('hologram', frame * 0.08, seed * 0.1, repeatProgress) : 0;
  const hologramOffset = hasHologram ? hologramNoise * 12 * baseUnit * fadeoutFactor : 0;
  const hologramFlicker = hasHologram ? noise2D('holo-flicker', frame * 0.12, seed) : 0;
  const hologramOpacity = hasHologram ? 1 - (0.4 - hologramFlicker * 0.35) * fadeoutFactor : 1;

  // Pixelate effect
  const pixelateScale = hasPixelate ? 1 + Math.sin(repeatPhase) * 0.5 * fadeoutFactor : 1;

  // Rainbow effect
  const rainbowHue = hasRainbow ? ((repeatProgress * 720) % 360) * fadeoutFactor : 0;

  // Extrude shadow
  const extrudeShadow = hasExtrude ? generateExtrudeShadow(glowColor) : '';

  // Bounce effect
  const bounceY = hasBounce ? Math.abs(Math.sin(repeatPhase + seed)) * 50 * baseUnit * fadeoutFactor : 0;

  // Spin effect
  const spinRotation = hasSpin ? repeatProgress * 720 : 0;

  // Spiral effect
  const spiralRadius = hasSpiral ? (30 + Math.sin(repeatPhase + seed) * 20) * baseUnit * fadeoutFactor : 0;
  const spiralX = hasSpiral ? Math.cos(repeatPhase + seed) * spiralRadius : 0;
  const spiralY = hasSpiral ? Math.sin(repeatPhase + seed) * spiralRadius : 0;

  // Swing effect
  const swingX = hasSwing ? Math.sin(repeatPhase + seed) * 60 * baseUnit * fadeoutFactor : 0;
  const swingRotate = hasSwing ? Math.sin(repeatPhase + seed) * 15 * fadeoutFactor : 0;

  // Slide effect
  const slideX = hasSlide ? Math.sin(repeatPhase + seed) * 80 * baseUnit * fadeoutFactor : 0;

  // Orbit effect
  const orbitRadius = 35 * baseUnit * fadeoutFactor;
  const orbitX = hasOrbit ? Math.cos(repeatPhase + seed) * orbitRadius : 0;
  const orbitY = hasOrbit ? Math.sin(repeatPhase + seed) * orbitRadius : 0;

  // Zoom In (3D depth)
  const zoomInProgress = hasZoomIn
    ? interpolate(localFrame, [0, fps * 2.5], [1, 0], { extrapolateRight: 'clamp' })
    : 0;
  const zoomInZ = hasZoomIn ? zoomInProgress * -800 * baseUnit : 0;
  const zoomInScale = hasZoomIn ? 1 - zoomInProgress * 0.5 : 1;

  // Flip Up (3D depth)
  const flipUpProgress = hasFlipUp
    ? interpolate(localFrame, [0, fps * 2], [1, 0], { extrapolateRight: 'clamp' })
    : 0;
  const flipUpRotateX = hasFlipUp ? flipUpProgress * 120 : 0;
  const flipUpY = hasFlipUp ? flipUpProgress * 400 * baseUnit : 0;
  const flipUpZ = hasFlipUp ? flipUpProgress * -600 * baseUnit : 0;

  // Spiral 3D
  const spiral3dRotateX = hasSpiral3d ? Math.sin(repeatPhase) * 30 * fadeoutFactor : 0;
  const spiral3dRotateY = hasSpiral3d ? Math.cos(repeatPhase) * 40 * fadeoutFactor : 0;
  const spiral3dZ = hasSpiral3d ? Math.sin(repeatPhase * 2) * 150 * baseUnit * fadeoutFactor : 0;

  // Wave 3D
  const wave3dRotateX = hasWave3d ? Math.sin(repeatPhase) * 25 * fadeoutFactor : 0;
  const wave3dZ = hasWave3d ? Math.sin(repeatPhase + Math.PI / 2) * 200 * baseUnit * fadeoutFactor : 0;
  const wave3dY = hasWave3d ? Math.cos(repeatPhase) * 30 * baseUnit * fadeoutFactor : 0;

  // Tumble
  const tumbleRotateX = hasTumble ? repeatProgress * 720 : 0;
  const tumbleRotateY = hasTumble ? repeatProgress * 360 : 0;
  const tumbleZ = hasTumble ? Math.sin(repeatPhase) * 100 * baseUnit * fadeoutFactor : 0;

  // Depth shadow (automatic based on Z depth)
  const totalZDepth = Math.abs(zoomInZ + flipUpZ + spiral3dZ + wave3dZ + tumbleZ);
  const depthShadowIntensity = totalZDepth / 300;
  const depthShadow = depthShadowIntensity > 0.1
    ? `0 ${depthShadowIntensity * 30}px ${depthShadowIntensity * 80}px rgba(0,0,0,${0.3 + depthShadowIntensity * 0.4})`
    : '';

  // Typewriter effect
  const typewriterChars = hasTypewriter
    ? Math.floor(interpolate(localFrame, [0, fps * 2], [0, text.length], { extrapolateRight: 'clamp' }))
    : text.length;

  // Shake effect
  const shakeX = hasShake ? noise2D('shake-x', frame * 0.5, seed) * 8 * baseUnit * fadeoutFactor : 0;
  const shakeY = hasShake ? noise2D('shake-y', frame * 0.5, seed + 10) * 8 * baseUnit * fadeoutFactor : 0;

  // Neon effect
  const neonNoise = hasNeon ? noise2D('neon', frame * 0.2, seed) : 0;
  const neonFlicker = hasNeon ? (neonNoise > 0.3 ? 1 : 0.4) : 1;
  const neonGlow = hasNeon
    ? `0 0 10px ${glowColor}, 0 0 20px ${glowColor}, 0 0 40px ${glowColor}, 0 0 80px ${glowColor}`
    : '';

  // Float effect
  const floatY = hasFloat ? Math.sin(repeatPhase * 0.5) * 25 * baseUnit * fadeoutFactor : 0;

  // Elastic effect
  const elasticScale = hasElastic
    ? interpolate(
      localFrame,
      [0, fps * 1.2],
      [0.3, 1],
      { extrapolateRight: 'clamp', easing: Easing.elastic(1.5) }
    )
    : 1;

  return {
    driftX,
    driftY,
    bounceY,
    spiralX,
    spiralY,
    swingX,
    slideX,
    orbitX,
    orbitY,
    waveY,
    floatY,
    shakeX,
    shakeY,
    rotateX,
    rotateY,
    waveRotate,
    spinRotation,
    swingRotate,
    zoomInZ,
    zoomInScale,
    flipUpRotateX,
    flipUpY,
    flipUpZ,
    spiral3dRotateX,
    spiral3dRotateY,
    spiral3dZ,
    wave3dRotateX,
    wave3dZ,
    wave3dY,
    tumbleRotateX,
    tumbleRotateY,
    tumbleZ,
    zoomScale,
    pixelateScale,
    elasticScale,
    glitchOffset,
    isGlitching,
    strobe,
    pulseIntensity,
    blurAmount,
    chromaticOffset,
    hologramOffset,
    hologramOpacity,
    rainbowHue,
    neonFlicker,
    typewriterChars,
    pulseShadow,
    dynamicGlow,
    depthShadow,
    extrudeShadow,
    neonGlow,
  };
}

/**
 * Generate extrude shadow for 3D text effect
 */
function generateExtrudeShadow(glowColor: string): string {
  const layers = [];
  const depth = 10;
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

    const blur = 0;

    const shadowColor = `rgb(${r}, ${g}, ${b})`;
    layers.push(`${offsetX}px ${offsetY}px ${blur}px ${shadowColor}`);
  }

  return layers.join(', ');
}
