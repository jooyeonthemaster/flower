import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

// Vercel Pro plan: 최대 300초 (5분)
export const maxDuration = 300;

// 행사별 분위기 설정 (간결하게 - AI 창의성 존중)
const categoryConfigs: Record<string, string> = {
  wedding: "romantic, dreamy, warm and intimate atmosphere",
  opening: "celebratory, energetic, grand and exciting atmosphere",
  event: "sophisticated, premium, dramatic spotlight atmosphere",
};

// 6가지 조합별 색상 팔레트 (category + style)
const colorPalettes: Record<string, string> = {
  // Fancy 스타일 - 각각 다른 색상
  'wedding-fancy': 'rose pink, magenta, soft coral, blush gold highlights',
  'opening-fancy': 'rich gold, champagne, warm amber, bright white accents',
  'event-fancy': 'royal purple, deep violet, electric cyan, silver highlights',

  // Simple 스타일 - 부드럽고 일부 겹침 허용
  'wedding-simple': 'soft pink, pearl white, gentle silver glow',
  'opening-simple': 'warm cream, soft gold, clean white',
  'event-simple': 'cool silver, soft blue-gray, elegant white',
};

/**
 * 배경 이미지 생성 API (Google Gemini 사용)
 * 1:1 비율, 텍스트 없음 - 4분할 문제 해결을 위한 새 API
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, style, referenceImage } = body;

    // 디버그 로그
    console.log('=== GENERATE BACKGROUND (Google Gemini) ===');
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

    // GoogleGenAI 클라이언트 초기화
    const ai = new GoogleGenAI({ apiKey });

    // 카테고리 분위기 가져오기 (기본값 처리)
    const safeCategory = categoryConfigs[category] ? category : 'event';
    const safeStyle = style === 'simple' ? 'simple' : 'fancy';
    const categoryMood = categoryConfigs[safeCategory];
    const colorPalette = colorPalettes[`${safeCategory}-${safeStyle}`] || colorPalettes['event-fancy'];

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

    // 배경 이미지 프롬프트 (텍스트 없음, 1:1 비율) - 간결하게
    const backgroundPrompt = `Generate a 1:1 SQUARE holographic background image.

MOOD: ${categoryMood}
STYLE: ${safeStyle === 'simple' ? 'Clean, elegant, minimal with soft lighting' : 'Spectacular, dramatic with rich visual effects'}
COLOR PALETTE: ${colorPalette}

REQUIREMENTS:
- Pure black (#000000) base
- Abstract visual effects (light, particles, glow, energy) using the color palette above
- Leave CENTER AREA clear for text overlay later
- NO TEXT or letters anywhere
- 1:1 square ratio

AVOID: Specific objects like coins, flowers, hearts, balloons, ribbons. Keep effects abstract.

${referenceInstruction}

Quality: Ultra HD, professional CGI, cinematic lighting. For LED hologram fan display.`;

    console.log('Generating background image with Google Gemini...');
    console.log('Prompt preview:', backgroundPrompt.substring(0, 300) + '...');

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
          aspectRatio: '1:1',  // 정사각형 비율로 변경
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
