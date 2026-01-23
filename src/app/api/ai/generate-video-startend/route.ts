import { NextRequest, NextResponse } from 'next/server';

// Vercel Pro plan: 60초 (job 시작만 하고 즉시 반환)
export const maxDuration = 60;

// Higgsfield Cloud Platform API
const HIGGSFIELD_API_BASE = 'https://platform.higgsfield.ai';

// 지원 모델 목록 (실제 Higgsfield에서 지원하는 모델만)
const SUPPORTED_MODELS = {
  // DoP 시리즈 (Higgsfield 자체 모델)
  'dop-lite': 'higgsfield-ai/dop/lite',
  'dop-preview': 'higgsfield-ai/dop/preview',
  'dop-turbo': 'higgsfield-ai/dop/turbo',
  // Kling 시리즈 (Start/End Frame 최적화)
  'kling-2.5-turbo-pro': 'kling-video/v2.5-turbo/pro/image-to-video',
} as const;

type ModelKey = keyof typeof SUPPORTED_MODELS;

// 기본 모델 (Kling 2.5 Turbo Pro - Start/End Frame 최적화)
const DEFAULT_MODEL: ModelKey = 'kling-2.5-turbo-pro';

interface HiggsFieldQueuedResponse {
  status: 'queued';
  request_id: string;
  status_url: string;
  cancel_url: string;
}

interface HiggsFieldCompletedResponse {
  status: 'completed';
  request_id: string;
  video: {
    url: string;
  };
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

/**
 * Start/End Frame 기반 영상 생성 API
 *
 * 두 개의 이미지(시작 프레임, 종료 프레임)를 입력받아
 * AI가 두 프레임 사이를 자연스럽게 보간하는 영상을 생성합니다.
 *
 * @param startImageUrl - 시작 프레임 이미지 URL (배경만)
 * @param endImageUrl - 종료 프레임 이미지 URL (배경 + 텍스트)
 * @param prompt - 영상 생성 프롬프트
 * @param model - 사용할 모델 (기본값: dop-lite)
 * @param motionStrength - 모션 강도 0-1 (기본값: 0.5)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      startImageUrl,
      endImageUrl,
      prompt,
      model = DEFAULT_MODEL,
      motionStrength = 0.5,
      duration = 10,  // 기본값 10초
      style = 'fancy', // 추가: 스타일 파라미터
      category = 'event', // 추가: 카테고리 파라미터
    } = body;

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

    if (!startImageUrl || !endImageUrl) {
      return NextResponse.json(
        { success: false, error: '시작 프레임과 종료 프레임 이미지가 필요합니다.' },
        { status: 400 }
      );
    }

    // 모델 ID 확인
    const modelId = SUPPORTED_MODELS[model as ModelKey] || SUPPORTED_MODELS[DEFAULT_MODEL];
    const actualModelKey = SUPPORTED_MODELS[model as ModelKey] ? model : DEFAULT_MODEL;

    // 이미지 URL 준비 (Data URL인 경우 Firebase에 업로드)
    const uploadImage = async (imageUrl: string, name: string): Promise<string> => {
      if (imageUrl.startsWith('data:')) {
        console.log(`Uploading ${name} to Firebase Storage...`);

        const uploadResponse = await fetch(new URL('/api/upload-image', req.url).toString(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataUrl: imageUrl,
            filename: `startend-${name}-${Date.now()}.png`,
          }),
        });

        if (!uploadResponse.ok) {
          throw new Error(`${name} 업로드 실패`);
        }

        const uploadResult = await uploadResponse.json();
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || `${name} 업로드 실패`);
        }

        return uploadResult.url;
      }
      return imageUrl;
    };

    const [startUrl, endUrl] = await Promise.all([
      uploadImage(startImageUrl, 'start-frame'),
      uploadImage(endImageUrl, 'end-frame'),
    ]);

    console.log('Starting Start/End Frame video generation:', {
      model: modelId,
      startUrl,
      endUrl,
      prompt,
      motionStrength,
    });

    // 텍스트 등장 효과 옵션 (랜덤 선택으로 다양성 확보)
    const textRevealEffects = [
      'luminous particles converge and form the text',
      'soft mist clears to reveal the text',
      'energy waves ripple outward as text appears',
      'gentle light blooms and the text emerges',
      'ethereal glow intensifies into clear text',
      'atmospheric haze parts to unveil the text',
    ];
    const randomEffect = textRevealEffects[Math.floor(Math.random() * textRevealEffects.length)];

    // 스타일별 분위기 (간결하게 - AI 창의성 존중)
    const videoStyleConfigs: Record<string, string> = {
      fancy: 'Dynamic, cinematic atmosphere with dramatic lighting and energetic motion.',
      simple: 'Elegant, refined atmosphere with smooth motion and subtle lighting.',
    };

    // 행사별 분위기 (간결하게)
    const videoCategoryConfigs: Record<string, string> = {
      wedding: 'Romantic and dreamy mood.',
      opening: 'Celebratory and grand mood.',
      event: 'Sophisticated and premium mood.',
    };

    // 6가지 조합별 색상 팔레트
    const videoColorPalettes: Record<string, string> = {
      'wedding-fancy': 'rose pink, magenta, soft coral, blush gold',
      'opening-fancy': 'rich gold, champagne, warm amber, bright white',
      'event-fancy': 'royal purple, deep violet, electric cyan, silver',
      'wedding-simple': 'soft pink, pearl white, gentle silver',
      'opening-simple': 'warm cream, soft gold, clean white',
      'event-simple': 'cool silver, soft blue-gray, elegant white',
    };

    const safeCategory = videoCategoryConfigs[category as string] ? category : 'event';
    const safeStyle = style === 'simple' ? 'simple' : 'fancy';
    const styleConfig = videoStyleConfigs[safeStyle];
    const categoryConfig = videoCategoryConfigs[safeCategory as string];
    const colorPalette = videoColorPalettes[`${safeCategory}-${safeStyle}`];

    // 동적 프롬프트 생성 (간결 + 핵심 규칙만)
    const defaultPrompt = `Cinematic transition from start to end frame.
${categoryConfig} ${styleConfig}
Color theme: ${colorPalette}

TEXT TIMING: Text should stay hidden for most of the video, then ${randomEffect} in the final moments.

AVOID: Do not include specific objects like coins, flowers, hearts, balloons, ribbons. Keep effects abstract.
IMPORTANT: Final text must appear sharp and clear, not distorted.

High-quality professional render.`;

    // API 요청 본문 구성
    // 모델별로 다른 파라미터 형식 사용
    const isKlingModel = actualModelKey.startsWith('kling');

    let requestBody: Record<string, unknown>;

    if (isKlingModel) {
      // Kling 2.5 Turbo Pro: 공식 API 문서 기반 파라미터
      // https://platform.higgsfield.ai - /kling-video/v2.5-turbo/pro/image-to-video
      requestBody = {
        image_url: startUrl,           // 시작 프레임 (required)
        last_image_url: endUrl,        // 종료 프레임 (End Frame) - 공식 문서 파라미터명
        prompt: prompt || defaultPrompt, // required
        duration: duration,            // 5 또는 10 (기본값 5)
        cfg_scale: motionStrength,     // 0~1 (기본값 0.5)
        negative_prompt: '',           // 원치 않는 요소 제외
        aspect_ratio: '1:1',           // LED 팬 홀로그램용 정사각형 비율
      };
    } else {
      // DoP 모델: input_images / input_images_end 형식
      requestBody = {
        input_images: [startUrl],
        input_images_end: [endUrl],
        prompt: prompt || defaultPrompt,
        motions_strength: motionStrength,
        enhance_prompt: true,
        duration: duration,
        // AERIAL PULLBACK 프리셋 적용
        preset: 'aerial_pullback',
        aspect_ratio: '1:1',           // LED 팬 홀로그램용 정사각형 비율
      };
    }

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    // 1. 영상 생성 요청 제출
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    let queuedResult: HiggsFieldQueuedResponse;

    try {
      const generateResponse = await fetch(`${HIGGSFIELD_API_BASE}/${modelId}`, {
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

      if (!generateResponse.ok) {
        const errorText = await generateResponse.text();
        console.error('Higgsfield API error:', {
          status: generateResponse.status,
          statusText: generateResponse.statusText,
          body: errorText.substring(0, 500),
        });

        // Start/End Frame이 지원되지 않는 경우, End Frame만 사용하여 재시도
        if (errorText.includes('tail_image_url') || errorText.includes('input_images_end') || errorText.includes('not supported')) {
          console.log('Start/End Frame not supported, falling back to single image mode...');

          // End Frame만 사용하여 단일 이미지 모드로 재시도
          const fallbackBody = {
            image_url: endUrl, // End Frame (텍스트가 있는 이미지) 사용
            prompt: prompt || defaultPrompt,
            duration: duration,
            cfg_scale: motionStrength,
            negative_prompt: '',
          };

          const fallbackResponse = await fetch(`${HIGGSFIELD_API_BASE}/${modelId}`, {
            method: 'POST',
            headers: {
              'hf-api-key': apiKey,
              'hf-secret': apiSecret,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(fallbackBody),
          });

          if (!fallbackResponse.ok) {
            const fallbackError = await fallbackResponse.text();
            throw new Error(`Higgsfield API 요청 실패 (${fallbackResponse.status}): ${fallbackError.substring(0, 200)}`);
          }

          queuedResult = await fallbackResponse.json() as HiggsFieldQueuedResponse;
          console.log('Fallback request queued (single image mode):', queuedResult);
        } else {
          throw new Error(`Higgsfield API 요청 실패 (${generateResponse.status}): ${errorText.substring(0, 200)}`);
        }
      } else {
        queuedResult = await generateResponse.json() as HiggsFieldQueuedResponse;
        console.log('Request queued:', queuedResult);
      }

      if (queuedResult.status !== 'queued') {
        throw new Error(`예상치 못한 응답 상태: ${queuedResult.status}`);
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error('Higgsfield API 요청 타임아웃 (60초 초과)');
      }
      throw fetchError;
    }

    // 즉시 job 정보 반환 (클라이언트가 직접 폴링)
    console.log('Job queued, returning immediately for client polling');

    return NextResponse.json({
      success: true,
      status: 'queued',
      jobId: queuedResult.request_id,
      statusUrl: queuedResult.status_url,
      model: actualModelKey,
    });

  } catch (error: unknown) {
    console.error('Start/End Frame Video Generation Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// GET: 지원 모델 목록 반환
export async function GET() {
  return NextResponse.json({
    models: Object.keys(SUPPORTED_MODELS),
    default: DEFAULT_MODEL,
    descriptions: {
      'dop-lite': 'Higgsfield DoP Lite - 빠르고 저렴',
      'dop-preview': 'Higgsfield DoP Preview - 중간 품질',
      'dop-turbo': 'Higgsfield DoP Turbo - 고품질',
      'kling-2.5-turbo-pro': 'Kling 2.5 Turbo Pro - Start/End Frame 최적화 (기본)',
    },
  });
}
