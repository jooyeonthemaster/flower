export interface AIImageRequest {
  prompt: string;
  category: string;
  style: string; // Added style
  referenceImage?: string;
}

export interface AIImageResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export interface AIVideoRequest {
  sourceImageUrl: string;
  prompt?: string;
}

export interface AIVideoResponse {
  success: boolean;
  videoUrl?: string;
  error?: string;
}

export const aiService = {
  async generateImage(data: AIImageRequest): Promise<AIImageResponse> {
    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch {
      return { success: false, error: 'Failed to generate image' };
    }
  },

  async generateVideo(data: AIVideoRequest): Promise<AIVideoResponse> {
    try {
      const response = await fetch('/api/ai/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch {
      return { success: false, error: 'Failed to generate video' };
    }
  },
};
