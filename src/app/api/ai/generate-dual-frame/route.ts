import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

/**
 * @deprecated 이 API는 더 이상 사용되지 않습니다.
 * 4분할 문제 해결을 위해 generate-background와 generate-text-frame API로 대체되었습니다.
 *
 * 새로운 플로우:
 * 1. /api/ai/generate-background - 1:1 배경 이미지 생성 (텍스트 없음)
 * 2. /api/ai/generate-text-frame - 배경 참조하여 텍스트 추가된 1:1 이미지 생성
 *
 * 이 API는 하위 호환성을 위해 유지되지만, 새 코드에서는 사용하지 마세요.
 */

// Vercel Pro plan: 최대 300초 (5분)
export const maxDuration = 300;

// 행사별 분위기 설정
const categoryConfigs: Record<string, {
  mood: string;
  elements: string;
  motion: string;
}> = {
  wedding: {
    mood: "romantic union, eternal love, blessed beginning",
    elements: "soft ring-shaped abstract halos, intertwining light ribbons, ethereal heart shapes",
    motion: "gentle swirling embrace pattern, rising updraft of light",
  },
  opening: {
    mood: "prosperous beginning, exciting launch, success",
    elements: "golden coins abstract flow, open door radiance, upward trending light paths",
    motion: "explosive outward expansion, welcoming energy waves",
  },
  event: {
    mood: "memorable highlight, special occasion, spotlight moment",
    elements: "spotlight beams, camera flash effects, VIP carpet radiance",
    motion: "harmonic convergence, climactic energy build",
  },
};

/**
 * 듀얼 프레임 이미지 생성 API (Google Gemini 사용)
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

    // 카테고리 설정 가져오기 (기본값 처리)
    const safeCategory = (categoryConfigs[category] ? category : 'event');
    const categoryConfig = categoryConfigs[safeCategory];

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

    // 참조 이미지 관련 프롬프트
    const referenceInstruction = referenceImageBase64
      ? `IMPORTANT: The attached image is a logo/reference image.
Remove its background and place it at the center-top area of the generated image.
The style and the attached image should blend harmoniously.
Position the text below the attached image.
The attached image must appear in BOTH the left and right halves.`
      : '';

    // 동적 프롬프트 생성 - 품질 섹션 복원
    const dualFramePrompt = `Generate a WIDE 16:9 horizontal image with the following structure:

IMAGE LAYOUT (THIS IS THE MOST IMPORTANT INSTRUCTION):
- Create ONE wide horizontal image (aspect ratio 16:9)
- Mentally divide this image into LEFT HALF and RIGHT HALF
- LEFT HALF: Shows the decorated background WITH the 3D text "${text}" in the center
- RIGHT HALF: Shows the EXACT SAME decorated background but WITHOUT any text (completely empty of text)
- Both halves share the same continuous background design
- If there is a visible vertical line in the middle, make it PURE BLACK (#000000) and very thin

VISUAL STYLE (${style.toUpperCase()}):
${style === 'simple'
        ? '- Clean, minimal, elegant design\n- Soft lighting, subtle sparkles\n- Modern and refined atmosphere'
        : '- Spectacular, grand, dramatic design\n- Intense lighting, rich particle effects\n- Celebration energy with visual impact'}

OCCASION (${category.toUpperCase()}):
- Mood: ${categoryConfig.mood}
- Elements: ${categoryConfig.elements}

3D TEXT STYLING:
- Text: "${text}"
- Style: ${style === 'simple' ? 'Clean modern 3D, matte or brushed metal finish' : 'Bold ornate 3D, glowing chrome or crystal finish'}
- Position: Centered in the left side only
- The right side must have NO TEXT at all

${referenceInstruction}

BACKGROUND:
- Base color: Pure black (#000000)
- Dynamic visual effects, light rays, particles
- The background decoration should be the same on both left and right sides

CRITICAL RULES:
1. Output must be 16:9 wide horizontal rectangle
2. LEFT half = background + text "${text}"
3. RIGHT half = same background, NO text
4. Do NOT create 4 panels or 2x2 grid
5. Do NOT repeat the text twice
6. The text "${text}" should appear ONLY ONCE, in the LEFT half
7. NEVER split TOP and BOTTOM - ONLY split LEFT and RIGHT (vertical dividing line)
8. The layout must be: [LEFT: with text] | [RIGHT: no text], NOT [TOP] / [BOTTOM]
9. Do NOT add any labels like "LEFT HALF", "RIGHT HALF", "LEFT", "RIGHT" to the image - these are instructions for you, not text to render

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

    // 이미지를 찾지 못한 경우 에러 반환 (fallback 제거 - 하위 모델은 원하는 품질의 텍스트를 생성하지 못함)
    if (!imageBase64) {
      console.error('No image found in response');
      console.error('Full response structure:', JSON.stringify(result, null, 2).substring(0, 2000));
      throw new Error('이미지 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
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
