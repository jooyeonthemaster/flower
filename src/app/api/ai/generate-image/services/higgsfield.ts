import { HiggsFieldQueuedResponse, HiggsFieldStatusResponse } from '../types';

const HIGGSFIELD_API_BASE = 'https://platform.higgsfield.ai';

interface HiggsFieldRequestParams {
  prompt: string;
  aspectRatio: string;
  referenceImageUrl: string | null;
  apiKey: string;
  apiSecret: string;
}

// 이미지 생성 요청 제출
export async function submitGenerateRequest({
  prompt,
  aspectRatio,
  referenceImageUrl,
  apiKey,
  apiSecret,
}: HiggsFieldRequestParams): Promise<HiggsFieldQueuedResponse> {
  // input_images 준비
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputImages: any[] = [];

  if (referenceImageUrl) {
    inputImages.push({
      type: 'image_url',
      image_url: referenceImageUrl,
    });
    console.log('input_images array:', JSON.stringify(inputImages));
  }

  // 요청 본문 구성
  const requestBody = {
    prompt,
    num_images: 1,
    aspect_ratio: aspectRatio,
    ...(inputImages.length > 0 && { input_images: inputImages }),
    output_format: 'png',
  };

  console.log('Request body keys:', Object.keys(requestBody));
  console.log('Prompt length:', prompt.length);
  if (inputImages.length > 0) {
    console.log('input_images included in request:', inputImages.length, 'images');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
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

    const responseText = await generateResponse.text();
    console.log('Higgsfield API Response Status:', generateResponse.status);
    console.log('Higgsfield API Response Body (raw):', responseText.substring(0, 500));

    if (!generateResponse.ok) {
      console.error('Higgsfield API error:', {
        status: generateResponse.status,
        statusText: generateResponse.statusText,
        body: responseText,
      });
      throw new Error(`Higgsfield API 요청 실패 (${generateResponse.status}): ${responseText.substring(0, 200)}`);
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON 파싱 실패:', parseError);
      throw new Error(`응답 JSON 파싱 실패: ${responseText.substring(0, 100)}`);
    }

    console.log('Parsed response structure:', JSON.stringify(parsedResponse, null, 2).substring(0, 1000));
    console.log('Response keys:', Object.keys(parsedResponse));

    let requestId: string;

    if (parsedResponse.status === 'queued' && parsedResponse.request_id) {
      return parsedResponse as HiggsFieldQueuedResponse;
    } else if (parsedResponse.id) {
      requestId = parsedResponse.id;
      const queuedResult: HiggsFieldQueuedResponse = {
        status: 'queued',
        request_id: requestId,
        status_url: `${HIGGSFIELD_API_BASE}/requests/${requestId}/status`,
        cancel_url: `${HIGGSFIELD_API_BASE}/requests/${requestId}/cancel`,
      };
      console.log('Nano Banana 응답에서 request_id 추출:', requestId);
      return queuedResult;
    } else {
      console.error('알 수 없는 응답 구조:', parsedResponse);
      throw new Error(`예상치 못한 응답 구조: ${JSON.stringify(parsedResponse).substring(0, 200)}`);
    }
  } catch (fetchError) {
    clearTimeout(timeoutId);

    if (fetchError instanceof Error && fetchError.name === 'AbortError') {
      throw new Error('Higgsfield API 요청 타임아웃 (60초 초과)');
    }
    throw fetchError;
  }
}

// 상태 폴링으로 완료 대기
export async function pollForCompletion(
  statusUrl: string,
  apiKey: string,
  apiSecret: string,
  maxWaitTime: number = 280000,
  pollInterval: number = 3000
): Promise<HiggsFieldStatusResponse> {
  const startTime = Date.now();

  while (true) {
    if (Date.now() - startTime > maxWaitTime) {
      throw new Error('이미지 생성 시간 초과');
    }

    await new Promise((resolve) => setTimeout(resolve, pollInterval));

    const statusResponse = await fetch(statusUrl, {
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
      return parsedStatus;
    } else if (currentStatus === 'failed' || currentStatus === 'error') {
      throw new Error(parsedStatus.error || parsedStatus.jobs?.[0]?.error || '이미지 생성 실패');
    } else if (currentStatus === 'nsfw') {
      throw new Error('콘텐츠 정책 위반으로 이미지 생성이 차단되었습니다.');
    }
    // queued, in_progress, pending 등이면 계속 대기
  }
}

// 이미지 URL 추출
export function extractImageUrl(statusResult: HiggsFieldStatusResponse): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalResult = statusResult as any;

  if (finalResult.images?.[0]?.url) {
    return finalResult.images[0].url;
  } else if (finalResult.jobs?.[0]?.result?.url) {
    return finalResult.jobs[0].result.url;
  } else if (finalResult.jobs?.[0]?.output?.url) {
    return finalResult.jobs[0].output.url;
  } else if (finalResult.jobs?.[0]?.images?.[0]?.url) {
    return finalResult.jobs[0].images[0].url;
  } else if (finalResult.result?.url) {
    return finalResult.result.url;
  } else if (finalResult.output?.url) {
    return finalResult.output.url;
  } else if (typeof finalResult.url === 'string') {
    return finalResult.url;
  }

  console.error('이미지 URL을 찾을 수 없음. 전체 응답:', JSON.stringify(finalResult, null, 2));
  throw new Error('이미지 URL이 응답에 없습니다. 응답 구조를 확인하세요.');
}
