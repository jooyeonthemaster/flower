// 영상 합성 요청/응답 타입
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
  // 영상 합성
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

  // Higgsfield API로 영상 생성
  async generateVideoHiggsfield(data: {
    sourceImageUrl: string;
    prompt?: string;
    duration?: number;
  }): Promise<{ success: boolean; videoUrl?: string; error?: string }> {
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
  }): Promise<{ success: boolean; videoUrl?: string; error?: string; looped?: boolean; loopCount?: number; estimatedDuration?: number }> {
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
