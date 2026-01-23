// 카테고리별 테마 정의 (프론트엔드에서 사용하는 3개 카테고리만 정의)
export const categoryThemes: Record<string, string> = {
  wedding: `
    THEME: ROMANTIC WEDDING CELEBRATION - Dreamy and Elegant Love Story

    SIGNATURE ELEMENTS (MUST INCLUDE):
    - Floating rose petals in soft pink and white, gently drifting outward from center
    - Delicate heart shapes made of golden light particles
    - Intertwined wedding rings glowing with warm light
    - Soft butterfly silhouettes made of sparkles
    - Elegant lace-like patterns in the particle effects
    - Champagne bubble particles rising and floating

    COLOR PALETTE (STRICT):
    - PRIMARY: Soft pink (#FFB6C1), Rose gold (#B76E79), Blush (#FFC0CB)
    - SECONDARY: Champagne gold (#F7E7CE), Warm white (#FFF8F0), Pearl (#FDEEF4)
    - ACCENTS: Soft lavender (#E6E6FA), Light peach (#FFDAB9)
    - AVOID: Blue tones, green tones, harsh red

    ATMOSPHERE: Ultra-romantic, soft dreamy glow, warm and intimate feeling, like a fairy tale wedding

    PARTICLE STYLE: Soft, rounded, flowing movements - like petals in gentle breeze
  `,

  opening: `
    THEME: GRAND OPENING / BUSINESS SUCCESS CELEBRATION - Prosperity and Fortune

    SIGNATURE ELEMENTS (MUST INCLUDE):
    - Festive red ribbons flowing and curling dynamically
    - Golden coins and ingots (Asian prosperity symbols) scattered as particles
    - Explosive firework bursts in red and gold
    - Lucky symbols: Four-leaf clovers, stars, golden keys
    - Confetti explosion in red, gold, and warm yellow
    - Sparkler/firecracker effects radiating outward
    - Oriental fortune clouds (구름무늬) as decorative elements

    COLOR PALETTE (STRICT):
    - PRIMARY: Festive red (#FF2D2D, #DC143C), Imperial gold (#FFD700, #DAA520)
    - SECONDARY: Lucky orange (#FF8C00), Bright yellow (#FFE135)
    - ACCENTS: Rich crimson (#990000), Warm bronze (#CD7F32)
    - AVOID: Pink, purple, blue, cold tones

    ATMOSPHERE: High energy celebration, prosperity and success vibes, festive and exciting, like a grand festival

    PARTICLE STYLE: Dynamic, explosive, energetic movements - like fireworks and confetti bursts
  `,

  event: `
    THEME: FORMAL EVENT / CEREMONY - Sophisticated Elegance and Prestige

    SIGNATURE ELEMENTS (MUST INCLUDE):
    - Geometric crystal/diamond shapes reflecting light
    - Elegant spotlight beams radiating from center
    - Star burst patterns with sharp, clean edges
    - Sophisticated Art Deco-inspired geometric lines
    - Prismatic light effects creating rainbow edges
    - Professional award ceremony sparkle effects
    - Luxurious velvet-like gradient backgrounds

    COLOR PALETTE (STRICT):
    - PRIMARY: Royal blue (#4169E1), Deep purple (#663399), Midnight blue (#191970)
    - SECONDARY: Silver (#C0C0C0), Platinum (#E5E4E2), Crystal white (#F8F8FF)
    - ACCENTS: Electric violet (#8F00FF), Deep indigo (#4B0082)
    - AVOID: Pink, red, orange, warm yellows

    ATMOSPHERE: Prestigious, sophisticated, formal and impressive, like an award ceremony or gala event

    PARTICLE STYLE: Sharp, geometric, precise movements - like crystal reflections and spotlight effects
  `,
};

export const getCategoryTheme = (category: string): string => {
  return categoryThemes[category] || categoryThemes['wedding'];
};
