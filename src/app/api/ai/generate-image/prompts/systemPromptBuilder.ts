import { getStylePrompt } from './stylePrompts';
import { getCategoryTheme } from './categoryThemes';
import { getReferenceImagePrompt } from './referenceImagePrompt';

interface SystemPromptParams {
  style: string;
  category: string;
  hasReferenceImage: boolean;
  referenceImageMode?: 'center' | 'background';
}

export const buildSystemPrompt = ({
  style,
  category,
  hasReferenceImage,
  referenceImageMode,
}: SystemPromptParams): string => {
  const selectedStyle = getStylePrompt(style);
  const selectedTheme = getCategoryTheme(category);
  const referenceImagePrompt = getReferenceImagePrompt(hasReferenceImage, referenceImageMode);
  const aspectRatioText = 'ASPECT RATIO: Square (1:1) composition for hologram fan display. Image must be perfectly square.';

  return `
    Task: Generate a high-quality 3D Hologram Wreath BACKGROUND image for video overlay.

    ${selectedStyle}
    ${selectedTheme}

    CRITICAL REQUIREMENTS:
    1. ABSOLUTELY NO TEXT - Do not generate any text, words, letters, numbers, or characters in the image. This is a BACKGROUND only.
    2. BACKGROUND: Pure Black (#000000). No studio lighting, no walls, no floor.
    3. ${aspectRatioText}
    4. This image will be used as a video background with text overlaid separately.

    DESIGN ELEMENTS - FULL-SCREEN SPECTACULAR EFFECTS:
    - Fill the ENTIRE IMAGE with visual effects - not just the center!
    - Effects should spread across ALL areas: center, edges, corners - EVERYWHERE
    - Create layered depth: foreground particles, midground effects, background glow
    - Light rays, sparkles, particles should cover the WHOLE canvas
    - Think: Immersive celebration that surrounds the viewer from all sides
    - Multiple layers of particles at different depths creating rich atmosphere
    - The center can have a focal glow, but effects must extend to ALL EDGES
    - Add trailing particles, floating elements, ambient sparkles THROUGHOUT
    - MAXIMUM coverage - every part of the image should have visual interest
    - DO NOT leave empty black spaces - fill with subtle particles or glow

    *** HOLOGRAM CIRCULAR SAFE ZONE - CRITICAL ***
    - This will be displayed on a CIRCULAR hologram fan display
    - Important content must stay within an INSCRIBED CIRCLE (center 85% of image)
    - The four CORNERS will be cut off when displayed as a circle
    - Place main focal elements in the CENTER circular area
    - Effects CAN extend to corners (they add atmosphere) but key elements stay centered
    - Imagine a circle touching all four edges - that's your safe display area

    *** CREATIVE VARIATION - VERY IMPORTANT ***
    - Each generated image MUST be UNIQUE and DIFFERENT from previous generations
    - Do NOT create identical or nearly identical images - vary the composition significantly
    - RANDOMIZE: particle positions, light ray angles, effect intensities, element arrangements
    - Surprise with creative interpretations while staying within the color palette
    - Add unexpected but fitting elements - make each image a NEW creative work
    - If a reference image is provided, use it as INSPIRATION ONLY - do NOT copy it exactly
    - The reference shows the MOOD and STYLE, but your output should be a FRESH interpretation
    - More variation = better video effects when animated

    ${referenceImagePrompt}
    REMEMBER: NO TEXT AT ALL. Text will be added as a separate overlay later.
  `;
};
