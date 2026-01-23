import { NextRequest, NextResponse } from 'next/server';
import { GenerateImageRequestBody } from './types';
import { buildSystemPrompt } from './prompts/systemPromptBuilder';
import { submitGenerateRequest, pollForCompletion, extractImageUrl } from './services/higgsfield';
import { downloadAndConvertToDataUrl } from './services/imageProcessor';
import { uploadReferenceImage } from './utils/referenceImageUploader';
import { transformErrorMessage } from './utils/errorHandler';

// Vercel Pro plan: 최대 300초 (5분)
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const body: GenerateImageRequestBody = await req.json();
    const { category, style, referenceImage, referenceImageMode } = body;

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

    // 비율 설정 - Nano Banana API 지원: auto, 1:1, 4:3, 3:4, 3:2
    const requestedRatio = body.aspectRatio || '1:1';
    const supportedRatios = ['auto', '1:1', '4:3', '3:4', '3:2'];
    const aspectRatio = supportedRatios.includes(requestedRatio) ? requestedRatio : '1:1';

    // 참조 이미지 URL 준비 (한 번만 업로드)
    const referenceImageUrl = await uploadReferenceImage(referenceImage || '', req.url);

    // 시스템 프롬프트 생성
    const systemPrompt = buildSystemPrompt({
      style,
      category,
      hasReferenceImage: !!referenceImageUrl,
      referenceImageMode,
    });

    console.log(`Requesting image generation with Higgsfield Nano Banana (Style: ${style})`);
    console.log('Has reference image:', !!referenceImageUrl);

    // 1. 이미지 생성 요청 제출
    const queuedResult = await submitGenerateRequest({
      prompt: systemPrompt,
      aspectRatio,
      referenceImageUrl,
      apiKey,
      apiSecret,
    });

    console.log('Processed queuedResult:', queuedResult);

    // 2. 폴링으로 완료 대기
    const statusResult = await pollForCompletion(
      queuedResult.status_url,
      apiKey,
      apiSecret
    );

    // 3. 완료된 이미지 URL에서 다운로드
    console.log('Final status result:', JSON.stringify(statusResult, null, 2).substring(0, 1000));

    const imageUrl = extractImageUrl(statusResult);
    const dataUrl = await downloadAndConvertToDataUrl(imageUrl);

    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
    });
  } catch (error: unknown) {
    console.error('Higgsfield Generate Image Error:', error);
    const message = transformErrorMessage(error);

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
