export interface AIImageRequest {
  prompt: string;
  category: string;
  style: string;
  referenceImage?: string;
  aspectRatio?: '16:9' | '1:1'; // 추가: 홀로그램용 1:1 지원
}

export interface AIImageResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export interface AIVideoRequest {
  sourceImageUrl: string;
  prompt?: string;
  aspectRatio?: '16:9' | '1:1'; // 추가: 홀로그램용 1:1 지원
}

export interface AIVideoResponse {
  success: boolean;
  videoUrl?: string;
  error?: string;
}

// 새로 추가: 영상 합성 요청/응답 타입
export interface AIMergeVideosRequest {
  videoDataUrls: string[];
  outputRatio?: '16:9' | '1:1';
}

export interface AIMergeVideosResponse {
  success: boolean;
  videoUrl?: string;
  duration?: number;
  sceneCount?: number;
  warning?: string;
  error?: string;
}

// 새로 추가: 다중 장면 생성 진행 상태
export interface SceneGenerationProgress {
  sceneId: number;
  status: 'pending' | 'generating-image' | 'generating-video' | 'completed' | 'error';
  imageUrl?: string;
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

  // 새로 추가: 영상 합성
  async mergeVideos(data: AIMergeVideosRequest): Promise<AIMergeVideosResponse> {
    try {
      const response = await fetch('/api/ai/merge-videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch {
      return { success: false, error: 'Failed to merge videos' };
    }
  },

  // 새로 추가: 1:1 정사각형 이미지 생성 (홀로그램용)
  async generateSquareImage(data: Omit<AIImageRequest, 'aspectRatio'>): Promise<AIImageResponse> {
    return this.generateImage({ ...data, aspectRatio: '1:1' });
  },

  // 새로 추가: 1:1 정사각형 영상 생성 (홀로그램용)
  async generateSquareVideo(data: Omit<AIVideoRequest, 'aspectRatio'>): Promise<AIVideoResponse> {
    return this.generateVideo({ ...data, aspectRatio: '1:1' });
  },

  // Higgsfield API로 영상 생성
  async generateVideoHiggsfield(data: {
    sourceImageUrl: string;
    prompt?: string;
    duration?: number;
  }): Promise<AIVideoResponse> {
    try {
      const response = await fetch('/api/ai/generate-video-higgsfield', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch {
      return { success: false, error: 'Failed to generate video with Higgsfield' };
    }
  },

  // 영상 루프 (5초 영상을 N번 반복하여 30초 영상 생성)
  async loopVideo(data: {
    videoDataUrl: string;
    loopCount?: number;
    outputRatio?: '16:9' | '1:1';
  }): Promise<AIVideoResponse & { looped?: boolean; loopCount?: number; estimatedDuration?: number }> {
    try {
      const response = await fetch('/api/ai/loop-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch {
      return { success: false, error: 'Failed to loop video' };
    }
  },

  // 이미지 업로드 (Data URL → 외부 URL)
  async uploadImage(dataUrl: string, filename?: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl, filename }),
      });
      return await response.json();
    } catch {
      return { success: false, error: 'Failed to upload image' };
    }
  },
};
