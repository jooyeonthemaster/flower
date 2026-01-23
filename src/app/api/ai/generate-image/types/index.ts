// Higgsfield API 응답 타입
export interface HiggsFieldQueuedResponse {
  status: 'queued';
  request_id: string;
  status_url: string;
  cancel_url: string;
}

export interface HiggsFieldCompletedResponse {
  status: 'completed';
  request_id: string;
  images: { url: string }[];
}

export interface HiggsFieldErrorResponse {
  status: 'failed' | 'nsfw';
  request_id: string;
  error?: string;
}

export type HiggsFieldStatusResponse =
  | HiggsFieldQueuedResponse
  | HiggsFieldCompletedResponse
  | HiggsFieldErrorResponse
  | { status: 'in_progress'; request_id: string };

export interface GenerateImageRequestBody {
  prompt?: string;
  category: string;
  style: string;
  referenceImage?: string;
  referenceImageMode?: 'center' | 'background';
  aspectRatio?: string;
}
