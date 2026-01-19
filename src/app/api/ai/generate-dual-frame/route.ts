import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

// Vercel Pro plan: 최대 300초 (5분)
export const maxDuration = 300;

// 스타일별 프롬프트 템플릿 (프론트엔드에서 사용하는 2개 스타일만 정의)
const stylePrompts: Record<string, string> = {
  fancy: `SPECTACULAR CELEBRATION EXPLOSION style:
    - Color palette: bright neon pink, electric purple, golden sparkles, cyan accents, vivid magenta
    - Light effects: MAXIMUM visual impact with layered explosions, multiple light bursts, dazzling flare cascades
    - Particles: golden confetti fountains, colorful fireworks bursts, stardust cascades, glitter showers, holographic sparkles
    - Texture: holographic shimmer, liquid gold surfaces, crystal reflections, iridescent glow
    - Atmosphere: ultimate celebration energy, like fireworks and magic combined, maximum festive impact`,

  simple: `ELEGANT MINIMALIST style:
    - Color palette: soft white, silver, subtle gold accents, muted pastels, gentle ivory
    - Light effects: gentle radiant glow, soft lens flares, understated brilliance, clean light rays
    - Particles: delicate floating sparkles, minimal dust motes, refined light trails, subtle shimmer
    - Texture: silk-like smooth gradients, clean geometric lines, premium matte finish
    - Atmosphere: sophisticated elegance, premium refinement, modern minimalism, understated luxury`,
};

// 행사별 프롬프트 템플릿 (프론트엔드에서 사용하는 3개 카테고리만 정의)
const categoryPrompts: Record<string, string> = {
  wedding: `WEDDING CELEBRATION atmosphere:
    - Emotion: eternal love, romantic union, blessed beginning
    - Symbols: intertwining light ribbons (unity), ascending heart particles, ring-shaped halos
    - Motion: gentle swirling embrace pattern, floating rose petal effect
    - Energy: warm loving radiance, soft romantic glow spreading outward`,

  opening: `GRAND OPENING atmosphere:
    - Emotion: exciting launch, prosperous beginning, success anticipation
    - Symbols: ribbon cutting light burst, door opening radiance, fortune flowing in
    - Motion: explosive outward expansion, welcoming energy waves
    - Energy: prosperity gold shower, success firework cascade`,

  event: `SPECIAL EVENT atmosphere:
    - Emotion: exciting anticipation, spectacular moment, memorable highlight
    - Symbols: spotlight burst, VIP carpet radiance, camera flash effects
    - Motion: dramatic reveal expansion, climactic energy build
    - Energy: show-stopping brilliance, headline-worthy spectacle`,
};

/**
 * 듀얼 프레임 이미지 생성 API (Google Gemini 사용)
 *
 * 공식 문서 기반:
 * - 모델: gemini-3-pro-image-preview (Nano Banana Pro)
 * - 참조 이미지: inlineData로 전달
 * - 16:9 비율, 최대 4K 해상도 지원
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, category, style, referenceImage } = body;

    // 디버그 로그
    console.log('=== GENERATE DUAL FRAME (Google Gemini) ===');
    console.log('Text:', text);
    console.log('Category:', category);
    console.log('Style:', style);
    console.log('Reference Image Provided:', !!referenceImage);

    // Google Gemini API 키 확인
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Google Gemini API key not configured (GOOGLE_GENAI_API_KEY)' },
        { status: 500 }
      );
    }

    if (!text) {
      return NextResponse.json(
        { success: false, error: '텍스트가 필요합니다.' },
        { status: 400 }
      );
    }

    // GoogleGenAI 클라이언트 초기화
    const ai = new GoogleGenAI({ apiKey });

    const styleDesc = stylePrompts[style] || stylePrompts.elegant;
    const categoryMood = categoryPrompts[category] || categoryPrompts.other;

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

    // 참조 이미지 관련 프롬프트 생성
    const referenceInstruction = referenceImageBase64
      ? `IMPORTANT: The attached image is a logo/reference image.
Remove its background and place it at the center-top area of the generated image.
The style and the attached image should blend harmoniously together.
Position the text below the attached image so they don't overlap.
The attached image must appear in BOTH the left and right halves of the final image.`
      : '';

    // 듀얼 프레임 프롬프트 생성 (16:9 비율, 영어로 작성)
    // 스타일+카테고리 조합에 맞는 고유한 이미지 생성 + 다양성 확보
    const dualFramePrompt = `Create a UNIQUE and VISUALLY SPECTACULAR image.

=== VISUAL STYLE ===
${styleDesc}

=== OCCASION MOOD ===
${categoryMood}

=== CRITICAL: DIVERSITY REQUIREMENT ===
- Generate a COMPLETELY UNIQUE composition - avoid generic or repetitive layouts
- Creatively interpret the style and occasion combination
- Use UNEXPECTED and CREATIVE arrangements of visual elements
- Each generation should feel fresh and distinctive

=== BACKGROUND DESIGN ===
- Fill the entire background with DYNAMIC, EXCITING visual effects
- Light rays, particles, and energy effects should feel ALIVE and in MOTION
- Create DEPTH with layered foreground/midground/background elements
- The background should tell a visual story matching the occasion

=== 3D TEXT: "${text}" ===
- BOLD, DRAMATIC 3D typography that commands attention
- Apply the ${style} style effects to the text
- Glowing edges, metallic reflections, strong dimensional presence
- Text should harmonize with but stand out from the background

${referenceInstruction}

=== IMAGE STRUCTURE (ABSOLUTELY CRITICAL - READ CAREFULLY) ===

*** SPLIT RULES - MUST FOLLOW EXACTLY ***
- The image is divided by ONE SINGLE VERTICAL LINE running down the EXACT CENTER
- This creates exactly TWO halves: LEFT and RIGHT
- There is ABSOLUTELY NO horizontal division - the image is NOT split top/bottom
- DO NOT create 4 quadrants - only 2 vertical halves exist
- The dividing line is INVISIBLE - it's conceptual for layout purposes only

*** VISUAL DIAGRAM ***
The final 16:9 image should look like this:
┌─────────────────────┬─────────────────────┐
│                     │                     │
│     LEFT HALF       │     RIGHT HALF      │
│   (with 3D text)    │   (NO text)         │
│                     │                     │
│   Background fills  │   IDENTICAL         │
│   entire left half  │   background        │
│                     │                     │
│   Text: "${text}"   │   (empty of text)   │
│                     │                     │
└─────────────────────┴─────────────────────┘

*** LEFT HALF SPECIFICATIONS ***
- Contains: Full background effects + 3D text "${text}"${referenceImageBase64 ? ' + reference image' : ''}
- Background fills the ENTIRE left half from top to bottom
- Text positioned aesthetically within the left half

*** RIGHT HALF SPECIFICATIONS ***
- Contains: IDENTICAL background effects${referenceImageBase64 ? ' + same reference image' : ''} - NO text whatsoever
- Must be a perfect mirror of the left half's background
- The ONLY difference is the absence of text

*** ABSOLUTE PROHIBITIONS ***
- NO horizontal lines dividing the image
- NO 4-quadrant layouts
- NO top/bottom separation
- NO grid patterns
- ONLY vertical split at center

*** BASE REQUIREMENTS ***
- Aspect ratio: EXACTLY 16:9 (wide horizontal format)
- Base color: Pure black (#000000) filled with spectacular light effects
- Both halves share ONE continuous background design

=== QUALITY ===
Ultra HD resolution, professional CGI quality, cinematic lighting, maximum visual impact, breathtaking artistry.
The two halves must be seamlessly part of ONE unified image composition.`;

    console.log('Generating dual-frame image with Google Gemini...');
    console.log('Prompt preview:', dualFramePrompt.substring(0, 300) + '...');

    // Google Gemini API 요청 구성 (공식 문서 기반)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contents: any[] = [];

    // 텍스트 프롬프트 추가
    contents.push({ text: dualFramePrompt });

    // 참조 이미지가 있으면 추가 (공식 문서 형식)
    if (referenceImageBase64) {
      contents.push({
        inlineData: {
          mimeType: referenceImageMimeType,
          data: referenceImageBase64,
        },
      });
      console.log('Reference image added to request');
    }

    // Gemini 3 Pro Image Preview 모델 사용 (Nano Banana Pro)
    // 공식 문서 기반 API 호출
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: contents,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: {
          aspectRatio: '16:9',
          imageSize: '2K',
        },
      },
    });

    console.log('Gemini response received');

    // 응답에서 이미지 추출 (공식 문서 기반)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = response as any;
    let imageBase64: string | null = null;
    let imageMimeType = 'image/png';

    // 공식 문서 형식: response.candidates[0].content.parts
    if (result.candidates?.[0]?.content?.parts) {
      for (const part of result.candidates[0].content.parts) {
        // 텍스트 파트 로깅
        if (part.text) {
          console.log('Response text:', part.text.substring(0, 200));
        }
        // 이미지 파트 추출
        if (part.inlineData?.data) {
          imageBase64 = part.inlineData.data;
          imageMimeType = part.inlineData.mimeType || 'image/png';
          console.log('Image extracted from response, mime:', imageMimeType);
          break;
        }
      }
    }

    // 이미지를 찾지 못한 경우 - Gemini 2.5 Flash Image로 폴백
    if (!imageBase64) {
      console.log('No image from gemini-3-pro-image-preview, trying gemini-2.5-flash-image...');

      try {
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: contents,
          config: {
            responseModalities: ['TEXT', 'IMAGE'],
            imageConfig: {
              aspectRatio: '16:9',
            },
          },
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fallbackResult = fallbackResponse as any;

        if (fallbackResult.candidates?.[0]?.content?.parts) {
          for (const part of fallbackResult.candidates[0].content.parts) {
            if (part.inlineData?.data) {
              imageBase64 = part.inlineData.data;
              imageMimeType = part.inlineData.mimeType || 'image/png';
              console.log('Image extracted from fallback response');
              break;
            }
          }
        }
      } catch (fallbackError) {
        console.error('Fallback model failed:', fallbackError);
      }
    }

    // 여전히 이미지가 없으면 Imagen 3 시도
    if (!imageBase64) {
      console.log('Trying Imagen 3 as final fallback...');

      try {
        // Imagen은 참조 이미지 없이 텍스트만 사용
        const imagenResponse = await ai.models.generateImages({
          model: 'imagen-3.0-generate-001',
          prompt: dualFramePrompt,
          config: {
            numberOfImages: 1,
            aspectRatio: '16:9',
          },
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const imagenResult = imagenResponse as any;
        console.log('Imagen response keys:', Object.keys(imagenResult || {}));

        if (imagenResult.generatedImages?.[0]?.image?.imageBytes) {
          imageBase64 = imagenResult.generatedImages[0].image.imageBytes;
          console.log('Image extracted from Imagen response');
        } else if (imagenResult.images?.[0]?.imageBytes) {
          imageBase64 = imagenResult.images[0].imageBytes;
          console.log('Image extracted from Imagen images array');
        }
      } catch (imagenError) {
        console.error('Imagen fallback failed:', imagenError);
      }
    }

    if (!imageBase64) {
      // 전체 응답 로깅 (디버깅용)
      console.error('No image found in any response');
      console.error('Full response structure:', JSON.stringify(result, null, 2).substring(0, 2000));
      throw new Error('이미지 생성에 실패했습니다. 응답에 이미지가 없습니다.');
    }

    const fullImageDataUrl = `data:${imageMimeType};base64,${imageBase64}`;

    console.log('Dual-frame image generated successfully');

    return NextResponse.json({
      success: true,
      fullImageUrl: fullImageDataUrl,
      // 분할 정보 제공
      splitInfo: {
        // 좌측이 End Frame (텍스트 있음)
        endFramePosition: 'left',
        // 우측이 Start Frame (텍스트 없음)
        startFramePosition: 'right',
      },
    });

  } catch (error: unknown) {
    console.error('Dual Frame Image Generation Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
