// 카테고리별 테마 정의 (서브 팔레트 포함)

interface ColorPalette {
  name: string;
  colors: string;
}

interface CategoryTheme {
  baseTheme: string;
  palettes: ColorPalette[];
}

export const categoryThemes: Record<string, CategoryTheme> = {
  wedding: {
    baseTheme: `
    THEME: ROMANTIC WEDDING CELEBRATION - Dreamy and Elegant Love Story

    SIGNATURE ELEMENTS (MUST INCLUDE):
    - Floating rose petals gently drifting outward from center
    - Delicate heart shapes made of light particles
    - Intertwined wedding rings glowing with warm light
    - Soft butterfly silhouettes made of sparkles
    - Elegant lace-like patterns in the particle effects
    - Champagne bubble particles rising and floating

    ATMOSPHERE: Ultra-romantic, soft dreamy glow, warm and intimate feeling, like a fairy tale wedding

    PARTICLE STYLE: Soft, rounded, flowing movements - like petals in gentle breeze
    `,
    palettes: [
      {
        name: "Classic Pink",
        colors: `
    COLOR PALETTE - Classic Pink:
    - PRIMARY: Soft pink (#FFB6C1), Rose gold (#B76E79), Blush (#FFC0CB)
    - SECONDARY: Champagne gold (#F7E7CE), Warm white (#FFF8F0), Pearl (#FDEEF4)
    - ACCENTS: Soft lavender (#E6E6FA), Light peach (#FFDAB9)
    - FLEXIBILITY: Feel free to vary intensity and saturation within this palette
        `
      },
      {
        name: "Classic White",
        colors: `
    COLOR PALETTE - Classic White:
    - PRIMARY: Pure white (#FFFFFF), Ivory (#FFFFF0), Silver (#C0C0C0)
    - SECONDARY: Pearl (#F5F5F5), Soft cream (#FFFDD0), Champagne (#F7E7CE)
    - ACCENTS: Light gold (#FFD700), Pale blush (#FFE4E1)
    - FLEXIBILITY: Feel free to vary intensity and saturation within this palette
        `
      },
      {
        name: "Lavender Dream",
        colors: `
    COLOR PALETTE - Lavender Dream:
    - PRIMARY: Lavender (#E6E6FA), Lilac (#C8A2C8), Soft purple (#DDA0DD)
    - SECONDARY: Silver (#C0C0C0), White (#FFFFFF), Pale violet (#EE82EE)
    - ACCENTS: Rose gold (#B76E79), Blush pink (#FFB6C1)
    - FLEXIBILITY: Feel free to vary intensity and saturation within this palette
        `
      },
      {
        name: "Gold Luxury",
        colors: `
    COLOR PALETTE - Gold Luxury:
    - PRIMARY: Champagne gold (#F7E7CE), Antique gold (#CFB53B), Rich gold (#FFD700)
    - SECONDARY: Cream (#FFFDD0), Ivory (#FFFFF0), White (#FFFFFF)
    - ACCENTS: Soft blush (#FFC0CB), Pearl (#F5F5F5)
    - FLEXIBILITY: Feel free to vary intensity and saturation within this palette
        `
      },
      {
        name: "Peach Blush",
        colors: `
    COLOR PALETTE - Peach Blush:
    - PRIMARY: Peach (#FFDAB9), Coral pink (#F88379), Warm white (#FFF8F0)
    - SECONDARY: Cream (#FFFDD0), Soft gold (#F7E7CE), Apricot (#FBCEB1)
    - ACCENTS: Blush (#FFC0CB), Rose (#FFE4E1)
    - FLEXIBILITY: Feel free to vary intensity and saturation within this palette
        `
      }
    ]
  },

  opening: {
    baseTheme: `
    THEME: GRAND OPENING / BUSINESS SUCCESS CELEBRATION - Prosperity and Fortune

    SIGNATURE ELEMENTS (MUST INCLUDE):
    - Festive ribbons flowing and curling dynamically
    - Coins and prosperity symbols scattered as particles
    - Explosive firework bursts
    - Lucky symbols: Four-leaf clovers, stars, golden keys
    - Confetti explosion
    - Sparkler/firecracker effects radiating outward

    ATMOSPHERE: High energy celebration, prosperity and success vibes, festive and exciting, like a grand festival

    PARTICLE STYLE: Dynamic, explosive, energetic movements - like fireworks and confetti bursts
    `,
    palettes: [
      {
        name: "Red Gold",
        colors: `
    COLOR PALETTE - Red Gold:
    - PRIMARY: Festive red (#FF2D2D, #DC143C), Imperial gold (#FFD700, #DAA520)
    - SECONDARY: Lucky orange (#FF8C00), Bright yellow (#FFE135)
    - ACCENTS: Rich crimson (#990000), Warm bronze (#CD7F32)
    - FLEXIBILITY: Feel free to vary intensity and saturation within this palette
        `
      },
      {
        name: "Gold Premium",
        colors: `
    COLOR PALETTE - Gold Premium:
    - PRIMARY: Rich gold (#FFD700), Black (#000000), White (#FFFFFF)
    - SECONDARY: Champagne (#F7E7CE), Cream (#FFFDD0), Amber (#FFBF00)
    - ACCENTS: Bronze (#CD7F32), Dark gold (#B8860B)
    - FLEXIBILITY: Feel free to vary intensity and saturation within this palette
        `
      },
      {
        name: "Orange Energy",
        colors: `
    COLOR PALETTE - Orange Energy:
    - PRIMARY: Bright orange (#FF6600), Sunny yellow (#FFD700), White (#FFFFFF)
    - SECONDARY: Warm gold (#DAA520), Cream (#FFFDD0), Light orange (#FFA500)
    - ACCENTS: Tangerine (#FF9966), Amber (#FFBF00)
    - FLEXIBILITY: Feel free to vary intensity and saturation within this palette
        `
      },
      {
        name: "Green Prosperity",
        colors: `
    COLOR PALETTE - Green Prosperity:
    - PRIMARY: Emerald (#50C878), Gold (#FFD700), White (#FFFFFF)
    - SECONDARY: Jade (#00A86B), Lime (#32CD32), Light green (#90EE90)
    - ACCENTS: Forest green (#228B22), Bronze (#CD7F32)
    - FLEXIBILITY: Feel free to vary intensity and saturation within this palette
        `
      },
      {
        name: "Neon Party",
        colors: `
    COLOR PALETTE - Neon Party:
    - PRIMARY: Neon pink (#FF6EC7), Electric cyan (#00FFFF), Vivid purple (#9400D3)
    - SECONDARY: Hot magenta (#FF1493), Electric blue (#7DF9FF), Neon yellow (#CCFF00)
    - ACCENTS: Lime green (#00FF00), Bright orange (#FF6600)
    - FLEXIBILITY: Feel free to vary intensity and saturation within this palette
        `
      }
    ]
  },

  event: {
    baseTheme: `
    THEME: FORMAL EVENT / CEREMONY - Sophisticated Elegance and Prestige

    SIGNATURE ELEMENTS (MUST INCLUDE):
    - Geometric crystal/diamond shapes reflecting light
    - Elegant spotlight beams radiating from center
    - Star burst patterns with sharp, clean edges
    - Sophisticated Art Deco-inspired geometric lines
    - Prismatic light effects
    - Professional award ceremony sparkle effects
    - Luxurious gradient backgrounds

    ATMOSPHERE: Prestigious, sophisticated, formal and impressive, like an award ceremony or gala event

    PARTICLE STYLE: Sharp, geometric, precise movements - like crystal reflections and spotlight effects
    `,
    palettes: [
      {
        name: "Blue Purple",
        colors: `
    COLOR PALETTE - Blue Purple:
    - PRIMARY: Royal blue (#4169E1), Deep purple (#663399), Midnight blue (#191970)
    - SECONDARY: Silver (#C0C0C0), Platinum (#E5E4E2), Crystal white (#F8F8FF)
    - ACCENTS: Electric violet (#8F00FF), Deep indigo (#4B0082)
    - FLEXIBILITY: Feel free to vary intensity and saturation within this palette
        `
      },
      {
        name: "Silver Elegance",
        colors: `
    COLOR PALETTE - Silver Elegance:
    - PRIMARY: Silver (#C0C0C0), White (#FFFFFF), Black (#000000)
    - SECONDARY: Platinum (#E5E4E2), Light gray (#D3D3D3), Charcoal (#36454F)
    - ACCENTS: Crystal white (#F8F8FF), Dark silver (#A9A9A9)
    - FLEXIBILITY: Feel free to vary intensity and saturation within this palette
        `
      },
      {
        name: "Rose Gold Glam",
        colors: `
    COLOR PALETTE - Rose Gold Glam:
    - PRIMARY: Rose gold (#B76E79), Blush (#FFC0CB), Gold (#FFD700)
    - SECONDARY: Champagne (#F7E7CE), Cream (#FFFDD0), Soft pink (#FFB6C1)
    - ACCENTS: Dusty pink (#D4A5A5), Mauve (#E0B0FF)
    - FLEXIBILITY: Feel free to vary intensity and saturation within this palette
        `
      },
      {
        name: "Mint Fresh",
        colors: `
    COLOR PALETTE - Mint Fresh:
    - PRIMARY: Mint (#98FF98), White (#FFFFFF), Silver (#C0C0C0)
    - SECONDARY: Seafoam (#71EEB8), Light teal (#20B2AA), Pale green (#98FB98)
    - ACCENTS: Gold (#FFD700), Pearl (#F5F5F5)
    - FLEXIBILITY: Feel free to vary intensity and saturation within this palette
        `
      },
      {
        name: "Deep Burgundy",
        colors: `
    COLOR PALETTE - Deep Burgundy:
    - PRIMARY: Burgundy (#800020), Gold (#FFD700), Black (#000000)
    - SECONDARY: Maroon (#800000), Bronze (#CD7F32), Dark red (#8B0000)
    - ACCENTS: Deep wine (#722F37), Copper (#B87333)
    - FLEXIBILITY: Feel free to vary intensity and saturation within this palette
        `
      }
    ]
  }
};

// 랜덤으로 팔레트를 선택하여 테마 문자열 반환
export const getCategoryTheme = (category: string): string => {
  const themeData = categoryThemes[category] || categoryThemes['wedding'];

  // 랜덤 팔레트 선택
  const randomIndex = Math.floor(Math.random() * themeData.palettes.length);
  const selectedPalette = themeData.palettes[randomIndex];

  return `${themeData.baseTheme}\n${selectedPalette.colors}`;
};
