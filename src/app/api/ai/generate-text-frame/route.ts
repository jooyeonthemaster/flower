import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

// Vercel Pro plan: 최대 300초 (5분)
export const maxDuration = 300;

/**
 * 텍스트 프레임 생성 API (Google Gemini 사용)
 * 배경 이미지를 참조하여 동일한 배경에 3D 텍스트를 추가한 이미지 생성
 * 4분할 문제 해결을 위한 새 API
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, backgroundImage, category, style, referenceImage, testMode } = body;

    // 디버그 로그
    console.log('=== GENERATE TEXT FRAME (Google Gemini) ===');
    console.log('Text:', text);
    console.log('Category:', category);
    console.log('Style:', style);
    console.log('Background Image Provided:', !!backgroundImage);
    console.log('Reference Image (Logo) Provided:', !!referenceImage);
    console.log('Test Mode:', !!testMode);

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

    if (!backgroundImage) {
      return NextResponse.json(
        { success: false, error: '배경 이미지가 필요합니다.' },
        { status: 400 }
      );
    }

    // GoogleGenAI 클라이언트 초기화
    const ai = new GoogleGenAI({ apiKey });

    // 배경 이미지 Base64 준비
    let backgroundImageBase64: string | null = null;
    let backgroundImageMimeType = 'image/png';

    if (backgroundImage.startsWith('data:')) {
      const matches = backgroundImage.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        backgroundImageMimeType = matches[1];
        backgroundImageBase64 = matches[2];
        console.log('Background image extracted from Data URL, mime:', backgroundImageMimeType);
      }
    } else {
      // URL인 경우 다운로드 후 Base64 변환
      try {
        const response = await fetch(backgroundImage);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          backgroundImageBase64 = Buffer.from(arrayBuffer).toString('base64');
          const contentType = response.headers.get('content-type');
          if (contentType) {
            backgroundImageMimeType = contentType;
          }
          console.log('Background image downloaded and converted to Base64');
        }
      } catch (err) {
        console.error('Failed to download background image:', err);
        return NextResponse.json(
          { success: false, error: '배경 이미지 다운로드 실패' },
          { status: 400 }
        );
      }
    }

    if (!backgroundImageBase64) {
      return NextResponse.json(
        { success: false, error: '배경 이미지 처리 실패' },
        { status: 400 }
      );
    }

    // 참조 이미지(로고) Base64 준비 (선택사항)
    let referenceImageBase64: string | null = null;
    let referenceImageMimeType = 'image/png';

    if (referenceImage) {
      if (referenceImage.startsWith('data:')) {
        const matches = referenceImage.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          referenceImageMimeType = matches[1];
          referenceImageBase64 = matches[2];
          console.log('Reference image extracted from Data URL');
        }
      } else {
        try {
          const response = await fetch(referenceImage);
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            referenceImageBase64 = Buffer.from(arrayBuffer).toString('base64');
            const contentType = response.headers.get('content-type');
            if (contentType) {
              referenceImageMimeType = contentType;
            }
          }
        } catch (err) {
          console.error('Failed to download reference image:', err);
        }
      }
    }

    // 스타일별 텍스트 설정 (간결하게)
    const textStyleDescription = style === 'simple'
      ? 'Clean, elegant 3D text with subtle glow'
      : 'Bold, dramatic 3D text with strong glow and visual impact';

    // 참조 이미지(로고) 프롬프트 섹션 (조건부)
    const referenceImagePromptSection = referenceImageBase64
      ? `
=== LOGO/REFERENCE IMAGE - IMPORTANT ===
A SECOND image (logo/photo) has been provided. You MUST include it in the output:
- Place the logo/photo in the UPPER CENTER area of the image (above the text)
- The logo should occupy about 20-25% of the image width (not too large!)
- Keep the logo CLEAR and RECOGNIZABLE - do not distort or heavily modify it
- Add a subtle holographic glow or aura around the logo to integrate it with the scene
- The logo should appear to FLOAT like a holographic projection
- Visual hierarchy: Logo (top, within circle) → Text (center) → Effects (everywhere)
- The logo is the SECOND attached image - use it exactly as provided
- CRITICAL: Logo must stay INSIDE the circular safe zone (center 80% of image)
- Do NOT place logo near corners - it will be cut off on hologram display!
`
      : '';

    // 텍스트 프레임 프롬프트 (배경 참조 + 텍스트 추가) - 간결하게
    const textFramePrompt = `Generate a 1:1 SQUARE holographic image inspired by the provided background.

TEXT TO ADD: "${text}"
Text style: ${textStyleDescription}
Position: Centered, large and prominent
${referenceImagePromptSection}
CREATIVE DIRECTION:
- Use the reference for INSPIRATION (same mood/colors), but create something FRESH and DIFFERENT
- Add more visual effects than the reference - make it spectacular
- Fill the image with effects (particles, glow, light) - avoid empty black areas
- Text must be readable and glowing

CIRCULAR SAFE ZONE: Text and logo must stay within center 80% (corners get cut off on hologram display).

AVOID: Specific objects like coins, flowers, hearts, balloons. Keep effects abstract.
DO NOT add any text besides "${text}".

Quality: Ultra HD, professional CGI, cinematic lighting. For LED hologram fan display.`;

    console.log('=== PROMPT ===');
    console.log(textFramePrompt);
    console.log('==============');

    // 테스트 모드: API 호출 없이 프롬프트만 반환
    if (testMode) {
      console.log('TEST MODE: Returning prompt without API call');
      return NextResponse.json({
        success: true,
        testMode: true,
        prompt: textFramePrompt,
        textStyleDescription,
        hasReferenceImage: !!referenceImageBase64,
        message: 'Test mode - no API call made. Check server logs for full prompt.',
      });
    }

    console.log('Generating text frame with Google Gemini...');
    console.log('Text to add:', text);

    // Google Gemini API 요청 구성
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contents: any[] = [];

    // 텍스트 프롬프트 추가
    contents.push({ text: textFramePrompt });

    // 배경 이미지 추가 (필수 - 첫 번째 이미지로)
    contents.push({
      inlineData: {
        mimeType: backgroundImageMimeType,
        data: backgroundImageBase64,
      },
    });
    console.log('Background reference image added to request');

    // 참조 이미지(로고)가 있으면 추가 (두 번째 이미지로)
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
          aspectRatio: '1:1',  // 정사각형 비율
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
      throw new Error('텍스트 프레임 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }

    const imageDataUrl = `data:${imageMimeType};base64,${imageBase64}`;

    console.log('Text frame generated successfully (1:1 ratio, with text)');

    return NextResponse.json({
      success: true,
      imageUrl: imageDataUrl,
    });

  } catch (error: unknown) {
    console.error('Text Frame Generation Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
