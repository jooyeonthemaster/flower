// 참조 이미지 모드별 프롬프트 생성
// 'center': 중앙에 크게 배치 (단일 영상 생성 모드, 기본값)
// 'background': 배경에 은은하게 통합 (AI 영상 합성 모드)

const backgroundModePrompt = `
  *** BACKGROUND INTEGRATION INSTRUCTIONS ***

  An input image has been provided. IMPORTANT: Do NOT place it prominently.

  REQUIREMENTS:
  1. Subtly blend the input image INTO THE BACKGROUND as a faded, atmospheric element
  2. The input image should be barely noticeable - like a watermark or ghost image
  3. Apply heavy blur and reduce opacity to 10-20%
  4. The input image can be scaled down and placed in a corner or scattered as texture
  5. All holographic effects and particles should be IN FRONT of the faded reference
  6. The CENTER of the image should be COMPLETELY EMPTY for text overlay
  7. Think of the reference as "background texture inspiration" not a focal element

  CRITICAL PRIORITY: Leave the CENTER completely clear and empty. 3D text will be added separately.
  The reference image should NEVER be in the center - push it to edges or blend into particles.
`;

const centerModePrompt = `
  *** CRITICAL: INPUT IMAGE COMPOSITING INSTRUCTIONS ***

  An input image (logo/photo) has been provided via input_images parameter.
  This is the MOST IMPORTANT element of the composition.

  MANDATORY REQUIREMENTS:
  1. The provided input image MUST appear in the EXACT CENTER of the generated image
  2. The input image should occupy approximately 35-45% of the total image area
  3. The input image must be rendered CLEARLY and FAITHFULLY - do not distort, modify, or add effects to it
  4. REMOVE any background from the input image - only the main subject/logo should be visible
  5. The input image should appear as if it's FLOATING in the center, like a holographic projection

  COMPOSITION RULES:
  - All holographic effects, particles, light rays must RADIATE OUTWARD from the input image
  - The input image is the FOCAL POINT - treat it as the "sun" with everything else orbiting around it
  - Create a subtle glow or aura directly behind the input image to make it stand out
  - DO NOT cover or obscure any part of the input image with effects
  - The input image should be the brightest, most prominent element

  VISUAL HIERARCHY:
  1st: Input image (center, largest, clearest)
  2nd: Inner glow/aura around input image
  3rd: Radial light effects spreading outward
  4th: Particle effects in the outer regions

  If you cannot properly composite the input image, at least leave a clear circular/square space in the exact center for it.
`;

export const getReferenceImagePrompt = (
  hasReferenceImage: boolean,
  mode?: 'center' | 'background'
): string => {
  if (!hasReferenceImage) {
    return '';
  }

  return mode === 'background' ? backgroundModePrompt : centerModePrompt;
};
