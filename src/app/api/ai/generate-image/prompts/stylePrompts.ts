// 스타일 정의 (프론트엔드에서 사용하는 2개 스타일만 정의)
export const stylePrompts: Record<string, string> = {
  fancy: "STYLE: Spectacular Celebration Explosion. MAXIMUM visual impact with multiple layered effects: Bright glowing neon lines AND golden sparkles AND colorful particle fountains ALL radiating outward from center. Combine cyberpunk neon beams with luxury gold dust and fantasy stardust. Electric sparks mixed with diamond glitter and aurora waves. Pulsating energy waves in pink/purple/gold/cyan spreading outward. Champagne splash effects with holographic flowers. This should be the MOST spectacular, eye-catching celebration effect possible - like fireworks, confetti, and magic combined.",
  simple: "STYLE: Elegant Minimalist Glow. Clean, sophisticated visual style with subtle elegance. Soft white/silver light rays gently radiating from center. Delicate sparkle particles floating gracefully. Subtle gradient aura in soft pastel tones. Thin elegant lines creating geometric patterns. Minimal but refined particle trails. Professional and modern aesthetic with understated luxury. Think: premium brand, sophisticated celebration, refined taste.",
};

export const getStylePrompt = (style: string): string => {
  return stylePrompts[style] || stylePrompts['fancy'];
};
