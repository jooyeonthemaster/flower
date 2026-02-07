import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

// Vercel Pro plan: 최대 300초 (5분)
export const maxDuration = 300;

// 카테고리별 오브젝트 옵션 (간결화)
const categoryObjects: Record<string, string[]> = {
  wedding: [
    'rose petals',
    'silk ribbons',
    'pearl strings',
    'lace patterns',
    'champagne bubbles',
    'crystal hearts',
    'butterflies',
  ],
  opening: [
    'ribbon cascades',
    'confetti pieces',
    'prosperity coins',
    'starburst effects',
    'celebration streamers',
    'firework sparks',
    'lantern shapes',
  ],
  event: [
    'crystal shapes',
    'spotlight beams',
    'prism effects',
    'diamond shapes',
    'geometric patterns',
    'star shapes',
    'trophy elements',
  ],
};

// 색상 팔레트 (카테고리 × 스타일별로 분리)
const colorPalettes: Record<string, string[]> = {
  wedding_fancy: [
    'rose pink', 'champagne gold', 'soft lavender', 'silver',
    'blush pink', 'ivory', 'peach', 'coral', 'dusty rose',
    'mauve', 'pearl white', 'rose gold', 'pastel pink', 'light gold',
  ],
  wedding_simple: [
    'pearl white', 'soft cream', 'pale blush', 'ivory',
    'champagne', 'warm white', 'soft lavender', 'light rose gold',
  ],
  opening_fancy: [
    'rich gold', 'crimson red', 'warm bronze', 'emerald green',
    'jade', 'royal gold', 'deep red', 'bright gold', 'orange',
    'sunny yellow', 'amber', 'copper', 'burnt orange', 'lime green',
  ],
  opening_simple: [
    'warm gold', 'cream', 'champagne', 'white',
    'soft bronze', 'elegant jade green', 'refined copper',
  ],
  event_fancy: [
    'royal purple', 'deep violet', 'navy blue', 'crystal silver',
    'burgundy', 'rose gold', 'deep teal', 'platinum', 'charcoal',
    'electric blue', 'sapphire blue', 'white', 'midnight blue', 'indigo',
  ],
  event_simple: [
    'navy blue', 'silver', 'deep purple', 'charcoal',
    'platinum', 'sapphire', 'white', 'elegant indigo',
  ],
};

// 프롬프트 생성 함수
function generatePrompt(
  category: string,
  style: string,
  selectedObjects: string[],
  selectedColors: string[],
  referenceInstruction: string
): string {
  const colorPalette = selectedColors.join(', ');

  if (category === 'wedding' && style === 'fancy') {
    return `Create a 1:1 SQUARE premium image with hologram-style effects for a wedding celebration.

STYLE: Spectacular and romantic with rich visual effects, dramatic lighting, and luxurious elements

COLOR PALETTE: ${colorPalette}

VISUAL ELEMENTS - MUST BE CLEARLY VISIBLE:
You MUST include these specific elements:
${selectedObjects.map(obj => `- ${obj}`).join('\n')}

EXECUTION REQUIREMENTS:
- Each element MUST have clear, recognizable form with defined edges
- DO NOT dissolve elements into pure abstract light - keep them distinct and visible
- Layer elements at different depths for visual richness
- Add elegant glow and particle effects AROUND elements, not replacing them
- Premium quality but elements must remain clearly visible and recognizable
- Balance between elegant styling and clear visibility

TECHNICAL REQUIREMENTS:
- Pure black (#000000) background
- Leave CENTER AREA clear for text overlay
- CRITICAL: ABSOLUTELY NO TEXT, WORDS, OR LETTERS of any kind anywhere in the image
- Do not write "holographic", "background", "wedding" or any other words
- 1:1 square ratio for LED hologram fan display
- Ultra high quality, cinematic lighting, professional CGI

${referenceInstruction}

QUALITY GOAL: Luxurious, romantic, spectacular - with clearly visible design elements that are recognizable and distinct.`;
  }

  if (category === 'wedding' && style === 'simple') {
    return `Create a 1:1 SQUARE elegant image with hologram-style effects for a wedding celebration.

STYLE: Clean, refined, and minimal with soft lighting and sophisticated aesthetics

COLOR PALETTE: ${colorPalette}

VISUAL ELEMENT - MUST BE CLEARLY VISIBLE:
You MUST include this specific element:
${selectedObjects.map(obj => `- ${obj}`).join('\n')}

EXECUTION REQUIREMENTS:
- The element MUST be clearly visible with clean, defined form
- Minimal, elegant approach - less is more
- Subtle glow and soft lighting effects
- Keep composition clean and uncluttered
- Sophisticated simplicity with the element remaining recognizable

TECHNICAL REQUIREMENTS:
- Pure black (#000000) background
- Leave CENTER AREA clear for text overlay
- CRITICAL: ABSOLUTELY NO TEXT, WORDS, OR LETTERS of any kind anywhere in the image
- Do not write any words at all
- 1:1 square ratio for LED hologram fan display
- Ultra high quality, soft lighting, professional quality

${referenceInstruction}

QUALITY GOAL: Elegant, refined, sophisticated simplicity with a clearly visible and recognizable design element.`;
  }

  if (category === 'opening' && style === 'fancy') {
    return `Create a 1:1 SQUARE premium image with hologram-style effects for a grand opening celebration.

STYLE: Bold, energetic, and spectacular with dynamic visual effects and celebratory elements

COLOR PALETTE: ${colorPalette}

VISUAL ELEMENTS - MUST BE CLEARLY VISIBLE:
You MUST include these specific elements:
${selectedObjects.map(obj => `- ${obj}`).join('\n')}

EXECUTION REQUIREMENTS:
- Each element MUST have clear, recognizable form with defined edges
- DO NOT dissolve elements into pure abstract light - keep them distinct and visible
- Create dynamic, energetic composition with movement
- Add powerful glow and particle effects AROUND elements, not replacing them
- Celebratory and bold but elements must remain clearly visible
- Balance between dramatic effects and clear visibility

TECHNICAL REQUIREMENTS:
- Pure black (#000000) background
- Leave CENTER AREA clear for text overlay
- CRITICAL: ABSOLUTELY NO TEXT, WORDS, OR LETTERS of any kind anywhere in the image
- Do not write any words at all
- 1:1 square ratio for LED hologram fan display
- Ultra high quality, dramatic lighting, professional CGI

${referenceInstruction}

QUALITY GOAL: Bold, prosperous, celebratory - with clearly visible design elements that convey success and prosperity.`;
  }

  if (category === 'opening' && style === 'simple') {
    return `Create a 1:1 SQUARE elegant image with hologram-style effects for a business opening.

STYLE: Clean, professional, and refined with sophisticated aesthetics

COLOR PALETTE: ${colorPalette}

VISUAL ELEMENT - MUST BE CLEARLY VISIBLE:
You MUST include this specific element:
${selectedObjects.map(obj => `- ${obj}`).join('\n')}

EXECUTION REQUIREMENTS:
- The element MUST be clearly visible with clean, defined form
- Professional, elegant approach
- Subtle glow and refined lighting
- Keep composition clean and professional
- Sophisticated minimalism with the element remaining recognizable

TECHNICAL REQUIREMENTS:
- Pure black (#000000) background
- Leave CENTER AREA clear for text overlay
- CRITICAL: ABSOLUTELY NO TEXT, WORDS, OR LETTERS of any kind anywhere in the image
- Do not write any words at all
- 1:1 square ratio for LED hologram fan display
- Ultra high quality, refined lighting, professional quality

${referenceInstruction}

QUALITY GOAL: Professional, elegant, prosperous simplicity with a clearly visible design element.`;
  }

  if (category === 'event' && style === 'fancy') {
    return `Create a 1:1 SQUARE premium image with hologram-style effects for a special event.

STYLE: Dramatic, cinematic with rich visual effects and luxurious presentation

COLOR PALETTE: ${colorPalette}

VISUAL ELEMENTS - MUST BE CLEARLY VISIBLE:
You MUST include these specific elements:
${selectedObjects.map(obj => `- ${obj}`).join('\n')}

EXECUTION REQUIREMENTS:
- Each element MUST have clear, recognizable form with defined edges
- DO NOT dissolve elements into pure abstract light - keep them distinct and visible
- Create dramatic, cinematic composition
- Add powerful glow and light effects AROUND elements, not replacing them
- Luxurious and bold but elements must remain clearly visible
- Balance between cinematic effects and clear visibility

TECHNICAL REQUIREMENTS:
- Pure black (#000000) background
- Leave CENTER AREA clear for text overlay
- CRITICAL: ABSOLUTELY NO TEXT, WORDS, OR LETTERS of any kind anywhere in the image
- Do not write any words at all
- 1:1 square ratio for LED hologram fan display
- Ultra high quality, dramatic cinematic lighting, professional CGI

${referenceInstruction}

QUALITY GOAL: Dramatic, luxurious, prestigious - with clearly visible design elements that create impact.`;
  }

  // event + simple
  return `Create a 1:1 SQUARE elegant image with hologram-style effects for a special event.

STYLE: Clean, sophisticated, and refined with elegant aesthetics

COLOR PALETTE: ${colorPalette}

VISUAL ELEMENT - MUST BE CLEARLY VISIBLE:
You MUST include this specific element:
${selectedObjects.map(obj => `- ${obj}`).join('\n')}

EXECUTION REQUIREMENTS:
- The element MUST be clearly visible with clean, defined form
- Elegant, professional approach
- Subtle glow and refined lighting
- Keep composition clean and sophisticated
- Refined minimalism with the element remaining recognizable

TECHNICAL REQUIREMENTS:
- Pure black (#000000) background
- Leave CENTER AREA clear for text overlay
- CRITICAL: ABSOLUTELY NO TEXT, WORDS, OR LETTERS of any kind anywhere in the image
- Do not write any words at all
- 1:1 square ratio for LED hologram fan display
- Ultra high quality, elegant lighting, professional quality

${referenceInstruction}

QUALITY GOAL: Sophisticated, elegant, prestigious simplicity with a clearly visible design element.`;
}

/**
 * 배경 이미지 생성 API (Google Gemini 사용)
 * 1:1 비율, 텍스트 없음
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, style, referenceImage, testMode } = body;

    // 디버그 로그
    console.log('=== GENERATE BACKGROUND (Google Gemini) ===');
    console.log('Category:', category);
    console.log('Style:', style);
    console.log('Reference Image Provided:', !!referenceImage);
    console.log('Test Mode:', !!testMode);

    // Google Gemini API 키 확인
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Google Gemini API key not configured (GOOGLE_GENAI_API_KEY)' },
        { status: 500 }
      );
    }

    // GoogleGenAI 클라이언트 초기화
    const ai = new GoogleGenAI({ apiKey });

    // 카테고리/스타일 확인 (기본값 처리)
    const safeCategory = categoryObjects[category] ? category : 'event';
    const safeStyle = style === 'simple' ? 'simple' : 'fancy';

    // 오브젝트 선택 (스타일에 따라 개수 다름)
    const availableObjects = categoryObjects[safeCategory];
    const numObjects = safeStyle === 'simple' ? 1 : (Math.floor(Math.random() * 2) + 2); // simple: 1개, fancy: 2-3개
    const shuffledObjects = [...availableObjects].sort(() => Math.random() - 0.5);
    const selectedObjects = shuffledObjects.slice(0, numObjects);

    // 색상 선택 (스타일에 따라 개수 다름)
    const colorPaletteKey = `${safeCategory}_${safeStyle}`;
    const availableColors = colorPalettes[colorPaletteKey];
    const numColors = safeStyle === 'simple'
      ? (Math.floor(Math.random() * 2) + 1)  // simple: 1-2개
      : (Math.floor(Math.random() * 2) + 2); // fancy: 2-3개
    const shuffledColors = [...availableColors].sort(() => Math.random() - 0.5);
    const selectedColors = shuffledColors.slice(0, numColors);

    // 참조 이미지 Base64 준비
    let referenceImageBase64: string | null = null;
    let referenceImageMimeType = 'image/png';

    if (referenceImage) {
      if (referenceImage.startsWith('data:')) {
        // Data URL에서 추출
        const matches = referenceImage.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          referenceImageMimeType = matches[1];
          referenceImageBase64 = matches[2];
          console.log('Reference image extracted from Data URL, mime:', referenceImageMimeType);
        }
      } else {
        // URL인 경우 다운로드 후 Base64 변환
        try {
          const response = await fetch(referenceImage);
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            referenceImageBase64 = Buffer.from(arrayBuffer).toString('base64');
            const contentType = response.headers.get('content-type');
            if (contentType) {
              referenceImageMimeType = contentType;
            }
            console.log('Reference image downloaded and converted to Base64');
          }
        } catch (err) {
          console.error('Failed to download reference image:', err);
        }
      }
    }

    // 참조 이미지 관련 프롬프트 (로고 배치)
    const referenceInstruction = referenceImageBase64
      ? `LOGO PLACEMENT:
The attached image is a logo/reference image.
Remove its background and place it at the center-top area of the generated image (approximately 30% from the top).
The logo should blend harmoniously with the hologram style.
Leave the center and bottom area clear for text overlay later.`
      : '';

    // 프롬프트 생성
    const backgroundPrompt = generatePrompt(
      safeCategory,
      safeStyle,
      selectedObjects,
      selectedColors,
      referenceInstruction
    );

    console.log('Generating background image with Google Gemini...');
    console.log('Selected Objects:', selectedObjects);
    console.log('Selected Colors:', selectedColors);
    console.log('Prompt preview:', backgroundPrompt.substring(0, 400) + '...');

    // 테스트 모드: API 호출 없이 프롬프트만 반환
    if (testMode) {
      console.log('TEST MODE: Returning prompt without API call');
      return NextResponse.json({
        success: true,
        testMode: true,
        prompt: backgroundPrompt,
        selectedObjects,
        selectedColors,
        category: safeCategory,
        style: safeStyle,
      });
    }

    // Google Gemini API 요청 구성
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contents: any[] = [];

    // 텍스트 프롬프트 추가
    contents.push({ text: backgroundPrompt });

    // 참조 이미지가 있으면 추가
    if (referenceImageBase64) {
      contents.push({
        inlineData: {
          mimeType: referenceImageMimeType,
          data: referenceImageBase64,
        },
      });
      console.log('Reference image (logo) added to request');
    }

    // Gemini 3 Pro Image Preview 모델 사용
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: contents,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: {
          aspectRatio: '1:1',
          imageSize: '2K',
        },
      },
    });

    console.log('Gemini response received');

    // 응답에서 이미지 추출
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = response as any;
    let imageBase64: string | null = null;
    let imageMimeType = 'image/png';

    if (result.candidates?.[0]?.content?.parts) {
      for (const part of result.candidates[0].content.parts) {
        if (part.text) {
          console.log('Response text:', part.text.substring(0, 200));
        }
        if (part.inlineData?.data) {
          imageBase64 = part.inlineData.data;
          imageMimeType = part.inlineData.mimeType || 'image/png';
          console.log('Image extracted from response, mime:', imageMimeType);
          break;
        }
      }
    }

    if (!imageBase64) {
      console.error('No image found in response');
      console.error('Full response structure:', JSON.stringify(result, null, 2).substring(0, 2000));
      throw new Error('배경 이미지 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }

    const imageDataUrl = `data:${imageMimeType};base64,${imageBase64}`;

    console.log('Background image generated successfully (1:1 ratio, no text)');

    return NextResponse.json({
      success: true,
      imageUrl: imageDataUrl,
    });

  } catch (error: unknown) {
    console.error('Background Image Generation Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}