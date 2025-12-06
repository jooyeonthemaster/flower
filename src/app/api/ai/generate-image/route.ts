import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

// Interface for image generation response part
interface ImageBytes {
  imageBytes: string;
}

interface GeneratedImage {
  image: ImageBytes;
}

// Extended response type to include generatedImages
interface ExtendedGenerateContentResponse {
  generatedImages?: GeneratedImage[];
  candidates?: {
    content?: {
      parts?: {
        inlineData?: {
          data: string;
        };
      }[];
    };
  }[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, category, style, referenceImage } = body;

    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      console.error('API Key missing');
      return NextResponse.json(
        { success: false, error: 'API Key not configured' },
        { status: 500 }
      );
    }

    const client = new GoogleGenAI({ apiKey });

    // 다양한 스타일 정의 확장
    const stylePrompts: Record<string, string> = {
      neon: "STYLE: Cyberpunk Neon. High contrast, glowing blue/purple laser lines, glitch effects, futuristic circuitry patterns.",
      elegant: "STYLE: Elegant Floral. Soft golden lighting, blooming holographic flowers, premium white/gold particles, graceful curves, wedding-like atmosphere.",
      minimal: "STYLE: Modern Minimalist. Clean geometric lines, simple white spotlight, thin glowing borders, sophisticated and professional look.",
      fantasy: "STYLE: Mystical Fantasy. Ethereal aura, magical dust particles, dreamlike soft glow, celestial patterns, pastel and cyan gradients.",
      luxury: "STYLE: Luxury Gold. High-end premium look, liquid gold effects, diamond sparkles, rich black and gold contrast, expensive jewelry aesthetic.",
      traditional: "STYLE: Korean Traditional (Dancheong). Holographic patterns inspired by Korean palace architecture, red/blue/green energy flows, oriental cloud patterns, majestic aura.",
      nature: "STYLE: Nature Forest. Bioluminescent plants, glowing vines, floating fireflies, organic curves, emerald green and teal energy.",
      ice: "STYLE: Crystal Ice. Frozen fractal patterns, sharp diamond edges, cold blue mist, winter snowflake geometry, prismatic light refraction.",
      fire: "STYLE: Blazing Fire. Burning energy rings, warm orange/red plasma, dynamic flame particles, intense brightness, powerful aura.",
      artdeco: "STYLE: Art Deco. Great Gatsby style, geometric gold patterns, symmetrical fans, retro-futuristic luxury, 1920s elegance reborn as holograms.",
      space: "STYLE: Galaxy Space. Deep space background, nebula clouds, star clusters, orbiting planetary rings, cosmic violet and magenta energy.",
      sketch: "STYLE: Artistic Light Sketch. Wireframe aesthetic, architectural blueprint lines, white pencil light on black, technical and artistic fusion."
    };

    const selectedStyle = stylePrompts[style] || stylePrompts['neon'];

    const systemPrompt = `
      Task: Generate a high-quality 2D Hologram Wreath design for video animation.

      ${selectedStyle}

      CRITICAL COMPOSITION RULES:
      - BACKGROUND: MUST be PURE BLACK (#000000). Absolutely no gray, no gradients, no studio lighting, no walls, no floor visible.
      - ASPECT RATIO: Cinematic Landscape (16:9) composition.

      CIRCULAR BORDER/RING (EXTREMELY IMPORTANT - READ CAREFULLY):
      - The holographic ring MUST be viewed from STRAIGHT FRONT, like a circular picture frame hanging on a wall.
      - Imagine a round mirror or circular photo frame mounted on a wall - you are looking at it directly from the front.
      - The ring MUST appear as a PERFECT CIRCLE, NOT an ellipse.
      - ABSOLUTELY NO tilting, NO 3D perspective, NO angle - the ring plane must be parallel to the camera/viewer.
      - WRONG: Ring tilted like a hula hoop on the ground or at an angle.
      - CORRECT: Ring perfectly upright and facing the viewer, like a circular portal or round picture frame.
      - This is critical because the ring will be animated to rotate clockwise in 2D (spinning like a wheel).

      REFERENCE IMAGE HANDLING (CRITICAL):
      - The provided image is a LOGO, PERSON, or PRODUCT that MUST BE PRESERVED EXACTLY in the center.
      - REMOVE any white background from the reference image - display it as a CUTOUT/KNOCKOUT image.
      - The subject should appear cleanly isolated on the pure black background.
      - Do NOT distort, style-transfer, or reimagine the internal details of the reference image (especially faces or text).
      - The reference image should appear as a flat 2D element floating inside the holographic ring.
      - Apply the '${style}' effects ONLY to the surrounding ring border and background particles, NOT to the subject.

      TEXT GENERATION:
      - Generate appropriate congratulatory text in KOREAN based on the category '${category}' and request '${prompt}'.
      - Example: "개업을 축하합니다", "결혼을 축하합니다".
      - Text should be glowing and placed clearly below the subject.
      - Text must also be on the pure black background, clearly visible.
    `;

    console.log(`Requesting image generation with model: gemini-3-pro-image-preview (Style: ${style})`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parts: any[] = [
      { text: systemPrompt }
    ];

    if (referenceImage) {
      const base64Data = referenceImage.split(',')[1];
      const mimeType = referenceImage.split(';')[0].split(':')[1];
      
      console.log('Attaching reference image with mimeType:', mimeType);
      
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      });
    }

    const response = await client.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [
        {
          parts: parts
        }
      ],
      config: {
      }
    });

    console.log('API Response keys:', Object.keys(response || {}));
    
    let imageBase64: string | undefined;
    // Cast response to our extended interface to avoid 'any'
    const responseTyped = response as unknown as ExtendedGenerateContentResponse;

    if (responseTyped.generatedImages?.[0]?.image?.imageBytes) {
        console.log('Found image in generatedImages');
        imageBase64 = responseTyped.generatedImages[0].image.imageBytes;
    } else if (responseTyped.candidates?.[0]?.content?.parts) {
        console.log('Checking candidates for image...');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const imagePart = responseTyped.candidates[0].content.parts.find((part: any) => part.inlineData);
        if (imagePart?.inlineData?.data) {
            console.log('Found image in candidates inlineData');
            imageBase64 = imagePart.inlineData.data;
        }
    }

    if (!imageBase64) {
      console.error('Unexpected API Response:', JSON.stringify(response, null, 2));
      throw new Error('No image data generated');
    }

    // Vercel serverless 환경에서는 파일 시스템 쓰기 불가
    // Base64 data URL로 직접 반환
    const dataUrl = `data:image/png;base64,${imageBase64}`;

    return NextResponse.json({
      success: true,
      imageUrl: dataUrl
    });

  } catch (error: unknown) {
    console.error('Generate Image Error Detail:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
