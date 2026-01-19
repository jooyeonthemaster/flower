import { NextRequest, NextResponse } from 'next/server';

// Higgsfield Nano Banana API
const HIGGSFIELD_API_BASE = 'https://platform.higgsfield.ai';

// Higgsfield API 응답 타입
interface HiggsFieldQueuedResponse {
  status: 'queued';
  request_id: string;
  status_url: string;
  cancel_url: string;
}

interface HiggsFieldCompletedResponse {
  status: 'completed';
  request_id: string;
  images: { url: string }[];
}

interface HiggsFieldErrorResponse {
  status: 'failed' | 'nsfw';
  request_id: string;
  error?: string;
}

type HiggsFieldStatusResponse =
  | HiggsFieldQueuedResponse
  | HiggsFieldCompletedResponse
  | HiggsFieldErrorResponse
  | { status: 'in_progress'; request_id: string };

// Vercel Pro plan: 최대 300초 (5분)
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, category, style, referenceImage, referenceImageMode } = body;
    // referenceImageMode: 'center' | 'background' | undefined
    // 'center' (기본값): 참조 이미지를 중앙에 크게 배치 (단일 영상 생성 모드)
    // 'background': 참조 이미지를 배경에 은은하게 통합 (AI 영상 합성 모드)

    // Higgsfield API 키 확인
    const apiKey = process.env.HIGGSFIELD_API_KEY;
    const apiSecret = process.env.HIGGSFIELD_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.error('Higgsfield API credentials missing');
      return NextResponse.json(
        { success: false, error: 'Higgsfield API credentials not configured' },
        { status: 500 }
      );
    }

    // 스타일 정의 (프론트엔드에서 사용하는 2개 스타일만 정의)
    const stylePrompts: Record<string, string> = {
      fancy: "STYLE: Spectacular Celebration Explosion. MAXIMUM visual impact with multiple layered effects: Bright glowing neon lines AND golden sparkles AND colorful particle fountains ALL radiating outward from center. Combine cyberpunk neon beams with luxury gold dust and fantasy stardust. Electric sparks mixed with diamond glitter and aurora waves. Pulsating energy waves in pink/purple/gold/cyan spreading outward. Champagne splash effects with holographic flowers. This should be the MOST spectacular, eye-catching celebration effect possible - like fireworks, confetti, and magic combined.",
      simple: "STYLE: Elegant Minimalist Glow. Clean, sophisticated visual style with subtle elegance. Soft white/silver light rays gently radiating from center. Delicate sparkle particles floating gracefully. Subtle gradient aura in soft pastel tones. Thin elegant lines creating geometric patterns. Minimal but refined particle trails. Professional and modern aesthetic with understated luxury. Think: premium brand, sophisticated celebration, refined taste.",
    };

    const selectedStyle = stylePrompts[style] || stylePrompts['fancy'];

    // 비율 설정 - Nano Banana API 지원: auto, 1:1, 4:3, 3:4, 3:2
    // 기본값: 1:1 (홀로그램 팬 디스플레이용 정사각형)
    const requestedRatio = body.aspectRatio || '1:1';
    // 지원되지 않는 비율이면 1:1로 대체
    const supportedRatios = ['auto', '1:1', '4:3', '3:4', '3:2'];
    const aspectRatio = supportedRatios.includes(requestedRatio) ? requestedRatio : '1:1';
    const aspectRatioText = 'ASPECT RATIO: Square (1:1) composition for hologram fan display. Image must be perfectly square.';

    // 카테고리별 테마 정의 (프론트엔드에서 사용하는 3개 카테고리만 정의)
    const categoryThemes: Record<string, string> = {
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

    const selectedTheme = categoryThemes[category] || categoryThemes['wedding'];

    // 참조 이미지 URL 준비 (한 번만 업로드)
    let referenceImageUrl: string | null = null;

    if (referenceImage) {
      console.log('Reference image provided, preparing for upload...');

      if (referenceImage.startsWith('data:')) {
        try {
          const uploadResponse = await fetch(new URL('/api/upload-image', req.url).toString(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              dataUrl: referenceImage,
              filename: `nano-banana-ref-${Date.now()}.png`,
            }),
          });

          if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json();
            if (uploadResult.success && uploadResult.url) {
              referenceImageUrl = uploadResult.url;
              console.log('Reference image uploaded to Firebase:', referenceImageUrl);
            }
          }
        } catch (uploadError) {
          console.error('Reference image upload failed:', uploadError);
        }
      } else {
        // 이미 URL인 경우
        referenceImageUrl = referenceImage;
        console.log('Reference image is already a URL:', referenceImageUrl);
      }
    }

    // 참조 이미지 모드별 프롬프트 생성
    // 'center': 중앙에 크게 배치 (단일 영상 생성 모드, 기본값)
    // 'background': 배경에 은은하게 통합 (AI 영상 합성 모드)
    const referenceImagePrompt = referenceImageUrl ? (
      referenceImageMode === 'background'
        ? `
      *** BACKGROUND INTEGRATION INSTRUCTIONS ***

      An input image has been provided. IMPORTANT: Do NOT place it prominently.

      REQUIREMENTS:
      1. Subtly blend the input image INTO THE BACKGROUND as a faded, atmospheric element
      2. The input image should be barely noticeable - like a watermark or ghost image
      3. Apply heavy blur and reduce opacity to 10-20%
      4. The input image can be scaled down and placed in a corner or scattered as texture
      5. All holographic effects and particles should be IN FRONT of the faded reference
      6. The CENTER of the image should be COMPLETELY EMPTY for text overlay
      7. Think of the reference as "background texture inspiration" not a focal element

      CRITICAL PRIORITY: Leave the CENTER completely clear and empty. 3D text will be added separately.
      The reference image should NEVER be in the center - push it to edges or blend into particles.
    `
        : `
      *** CRITICAL: INPUT IMAGE COMPOSITING INSTRUCTIONS ***

      An input image (logo/photo) has been provided via input_images parameter.
      This is the MOST IMPORTANT element of the composition.

      MANDATORY REQUIREMENTS:
      1. The provided input image MUST appear in the EXACT CENTER of the generated image
      2. The input image should occupy approximately 35-45% of the total image area
      3. The input image must be rendered CLEARLY and FAITHFULLY - do not distort, modify, or add effects to it
      4. REMOVE any background from the input image - only the main subject/logo should be visible
      5. The input image should appear as if it's FLOATING in the center, like a holographic projection

      COMPOSITION RULES:
      - All holographic effects, particles, light rays must RADIATE OUTWARD from the input image
      - The input image is the FOCAL POINT - treat it as the "sun" with everything else orbiting around it
      - Create a subtle glow or aura directly behind the input image to make it stand out
      - DO NOT cover or obscure any part of the input image with effects
      - The input image should be the brightest, most prominent element

      VISUAL HIERARCHY:
      1st: Input image (center, largest, clearest)
      2nd: Inner glow/aura around input image
      3rd: Radial light effects spreading outward
      4th: Particle effects in the outer regions

      If you cannot properly composite the input image, at least leave a clear circular/square space in the exact center for it.
    `
    ) : '';

    const systemPrompt = `
      Task: Generate a high-quality 3D Hologram Wreath BACKGROUND image for video overlay.

      ${selectedStyle}
      ${selectedTheme}

      CRITICAL REQUIREMENTS:
      1. ABSOLUTELY NO TEXT - Do not generate any text, words, letters, numbers, or characters in the image. This is a BACKGROUND only.
      2. BACKGROUND: Pure Black (#000000). No studio lighting, no walls, no floor.
      3. ${aspectRatioText}
      4. This image will be used as a video background with text overlaid separately.

      DESIGN ELEMENTS - EXPLOSIVE RADIAL EFFECTS:
      - Create SPECTACULAR visual effects radiating FROM THE CENTER OUTWARD
      - Imagine energy/particles/light BURSTING from center and spreading in ALL DIRECTIONS
      - AVOID rotation effects - focus on RADIAL BURST and EXPLOSION patterns
      - Light rays, sparkles, and particles should SPREAD OUTWARD from center
      - Think: Fireworks, Explosions, Fountains, Starbursts - all radiating FROM CENTER
      - Multiple layers of particles at different speeds creating depth
      - The CENTER can have a glowing core/source of the burst
      - Add trailing particle effects following the outward motion
      - MAXIMUM visual spectacle - this should look like a celebration explosion
      ${referenceImagePrompt}
      REMEMBER: NO TEXT AT ALL. Text will be added as a separate overlay later.
    `;

    console.log(`Requesting image generation with Higgsfield Nano Banana (Style: ${style})`);
    console.log('Has reference image:', !!referenceImageUrl);

    // input_images 준비 - 이미 업로드된 referenceImageUrl 사용
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inputImages: any[] = [];

    if (referenceImageUrl) {
      // Nano Banana API input_images 구조 (Higgsfield 공식 문서 기준)
      // 문서: { type: 'image_url', image_url: '<url>' }
      inputImages.push({
        type: 'image_url',
        image_url: referenceImageUrl
      });
      console.log('input_images array:', JSON.stringify(inputImages));
    }

    // 요청 본문 구성
    const requestBody = {
      prompt: systemPrompt,
      num_images: 1,
      aspect_ratio: aspectRatio,
      ...(inputImages.length > 0 && { input_images: inputImages }),
      output_format: 'png',
    };

    console.log('Request body keys:', Object.keys(requestBody));
    console.log('Prompt length:', systemPrompt.length);
    if (inputImages.length > 0) {
      console.log('input_images included in request:', inputImages.length, 'images');
    }

    // 1. 이미지 생성 요청 제출
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    let queuedResult: HiggsFieldQueuedResponse;

    try {
      // /nano-banana 엔드포인트 사용 (참조 이미지 input_images 지원)
      const generateResponse = await fetch(`${HIGGSFIELD_API_BASE}/nano-banana`, {
        method: 'POST',
        headers: {
          'hf-api-key': apiKey,
          'hf-secret': apiSecret,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // 응답 텍스트를 먼저 읽어서 로깅
      const responseText = await generateResponse.text();
      console.log('Higgsfield API Response Status:', generateResponse.status);
      console.log('Higgsfield API Response Body (raw):', responseText.substring(0, 500));

      if (!generateResponse.ok) {
        console.error('Higgsfield API error:', {
          status: generateResponse.status,
          statusText: generateResponse.statusText,
          body: responseText
        });
        throw new Error(`Higgsfield API 요청 실패 (${generateResponse.status}): ${responseText.substring(0, 200)}`);
      }

      // JSON 파싱
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON 파싱 실패:', parseError);
        throw new Error(`응답 JSON 파싱 실패: ${responseText.substring(0, 100)}`);
      }

      console.log('Parsed response structure:', JSON.stringify(parsedResponse, null, 2).substring(0, 1000));
      console.log('Response keys:', Object.keys(parsedResponse));

      // 응답 구조 분석 - Nano Banana API 응답 형식
      // 실제 응답: { id, type, created_at, jobs: [{ id, status, ... }] }
      // 문서 응답: { status, request_id, status_url, cancel_url }

      let requestId: string;

      if (parsedResponse.status === 'queued' && parsedResponse.request_id) {
        // 문서대로 응답이 온 경우
        requestId = parsedResponse.request_id;
        queuedResult = parsedResponse as HiggsFieldQueuedResponse;
      } else if (parsedResponse.id) {
        // 실제 응답 형식: { id, type, jobs: [...] }
        requestId = parsedResponse.id;
        queuedResult = {
          status: 'queued',
          request_id: requestId,
          status_url: `${HIGGSFIELD_API_BASE}/requests/${requestId}/status`,
          cancel_url: `${HIGGSFIELD_API_BASE}/requests/${requestId}/cancel`
        };
        console.log('Nano Banana 응답에서 request_id 추출:', requestId);
      } else {
        console.error('알 수 없는 응답 구조:', parsedResponse);
        throw new Error(`예상치 못한 응답 구조: ${JSON.stringify(parsedResponse).substring(0, 200)}`);
      }

      console.log('Processed queuedResult:', queuedResult);
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error('Higgsfield API 요청 타임아웃 (60초 초과)');
      }
      throw fetchError;
    }

    // 2. 폴링으로 완료 대기
    const startTime = Date.now();
    const MAX_WAIT_TIME = 280000; // 280초 (Vercel 타임아웃 여유)
    const POLL_INTERVAL = 3000; // 3초마다 확인 (이미지는 빠름)

    let statusResult: HiggsFieldStatusResponse;

    while (true) {
      if (Date.now() - startTime > MAX_WAIT_TIME) {
        throw new Error('이미지 생성 시간 초과');
      }

      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));

      const statusResponse = await fetch(queuedResult.status_url, {
        headers: {
          'hf-api-key': apiKey,
          'hf-secret': apiSecret,
        },
      });

      if (!statusResponse.ok) {
        console.error('Status check failed:', statusResponse.status);
        const errorText = await statusResponse.text();
        console.error('Status check error body:', errorText);
        continue;
      }

      const statusText = await statusResponse.text();
      console.log('Status response (raw):', statusText.substring(0, 500));

      let parsedStatus;
      try {
        parsedStatus = JSON.parse(statusText);
      } catch {
        console.error('Status JSON 파싱 실패');
        continue;
      }

      console.log('Parsed status keys:', Object.keys(parsedStatus));

      // 상태 확인 - 여러 가능한 구조 처리
      // 문서: { status: 'completed', images: [...] }
      // 실제: { id, type, jobs: [{ status, ... }] } 또는 다른 구조
      let currentStatus: string;

      if (parsedStatus.status) {
        currentStatus = parsedStatus.status;
      } else if (parsedStatus.jobs?.[0]?.status) {
        currentStatus = parsedStatus.jobs[0].status;
      } else {
        console.log('상태 필드를 찾을 수 없음, 전체 응답:', JSON.stringify(parsedStatus).substring(0, 300));
        continue;
      }

      console.log('Current status:', currentStatus);

      if (currentStatus === 'completed' || currentStatus === 'success') {
        statusResult = parsedStatus;
        break;
      } else if (currentStatus === 'failed' || currentStatus === 'error') {
        throw new Error(parsedStatus.error || parsedStatus.jobs?.[0]?.error || '이미지 생성 실패');
      } else if (currentStatus === 'nsfw') {
        throw new Error('콘텐츠 정책 위반으로 이미지 생성이 차단되었습니다.');
      }
      // queued, in_progress, pending 등이면 계속 대기
    }

    // 3. 완료된 이미지 URL에서 다운로드
    console.log('Final status result:', JSON.stringify(statusResult, null, 2).substring(0, 1000));

    // 이미지 URL 추출 - 여러 가능한 구조 처리
    let imageUrl: string | undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalResult = statusResult as any;

    if (finalResult.images?.[0]?.url) {
      imageUrl = finalResult.images[0].url;
    } else if (finalResult.jobs?.[0]?.result?.url) {
      imageUrl = finalResult.jobs[0].result.url;
    } else if (finalResult.jobs?.[0]?.output?.url) {
      imageUrl = finalResult.jobs[0].output.url;
    } else if (finalResult.jobs?.[0]?.images?.[0]?.url) {
      imageUrl = finalResult.jobs[0].images[0].url;
    } else if (finalResult.result?.url) {
      imageUrl = finalResult.result.url;
    } else if (finalResult.output?.url) {
      imageUrl = finalResult.output.url;
    } else if (typeof finalResult.url === 'string') {
      imageUrl = finalResult.url;
    }

    if (!imageUrl) {
      console.error('이미지 URL을 찾을 수 없음. 전체 응답:', JSON.stringify(finalResult, null, 2));
      throw new Error('이미지 URL이 응답에 없습니다. 응답 구조를 확인하세요.');
    }

    console.log('Image URL found:', imageUrl);

    // 이미지를 다운로드하여 base64로 변환
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error('이미지 다운로드 실패');
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');
    const dataUrl = `data:image/png;base64,${imageBase64}`;

    console.log(`Image downloaded. Size: ${imageBuffer.byteLength} bytes`);

    return NextResponse.json({
      success: true,
      imageUrl: dataUrl
    });

  } catch (error: unknown) {
    console.error('Higgsfield Generate Image Error:', error);

    let message = 'Internal Server Error';

    if (error instanceof Error) {
      message = error.message;

      // Higgsfield API 관련 에러 메시지 변환
      if (message.includes('quota') || message.includes('Quota') || message.includes('rate limit')) {
        message = 'API 할당량 초과. 잠시 후 다시 시도해주세요.';
      } else if (message.includes('Invalid') || message.includes('unauthorized') || message.includes('401')) {
        message = 'API 키가 올바르지 않습니다. 관리자에게 문의하세요.';
      } else if (message.includes('nsfw') || message.includes('콘텐츠 정책')) {
        // 이미 한글 메시지면 그대로
      } else if (message.includes('timeout') || message.includes('타임아웃')) {
        message = '이미지 생성 시간이 초과되었습니다. 다시 시도해주세요.';
      }
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
