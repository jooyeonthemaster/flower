// Standard 모드 색상
export const STANDARD_COLOR = '#8A9A5B';

// Firebase Storage 템플릿 영상 URL
const STORAGE_BASE_URL = `https://storage.googleapis.com/${(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'flower-63624.firebasestorage.app').trim()}`;

// 템플릿 이미지/영상 경로 생성 헬퍼 함수
export const getTemplateImagePath = (category: string, style: string): string => {
  return `/previews/${category}-${style}.png`;
};

export const getTemplateVideoPath = (category: string, style: string): string => {
  // Firebase Storage에서 템플릿 영상 로드
  return `${STORAGE_BASE_URL}/templates/videos/${category}-${style}.mp4`;
};

// 브라우저 렌더링 기반 진행 상태
export type GenerationPhase = 'idle' | 'loading-video' | 'rendering' | 'encoding' | 'uploading' | 'completed' | 'error';

// 시간 포맷 함수
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// 예상 소요 시간 (브라우저 렌더링 기준)
export const getEstimatedTime = (currentPhase: GenerationPhase): string => {
  switch (currentPhase) {
    case 'loading-video': return '약 2-3초';
    case 'rendering': return '약 5-10초';
    case 'encoding': return '약 3-5초';
    case 'uploading': return '약 2-3초';
    default: return '';
  }
};

export const getTotalEstimatedTime = (): string => {
  return '약 5~10분';
};

export const getPhaseLabel = (currentPhase: GenerationPhase) => {
  switch (currentPhase) {
    case 'idle': return '준비 중...';
    case 'loading-video': return '리소스 로드 중...';
    case 'rendering': return '프레임 렌더링 중...';
    case 'encoding': return 'MP4 인코딩 중...';
    case 'uploading': return '업로드 중...';
    case 'completed': return '완료!';
    case 'error': return '오류 발생';
  }
};

export const getPhaseDescription = (currentPhase: GenerationPhase) => {
  switch (currentPhase) {
    case 'idle': return '잠시만 기다려주세요...';
    case 'loading-video': return '템플릿 영상과 리소스를 불러오고 있습니다';
    case 'rendering': return '영상을 렌더링하고 있습니다';
    case 'encoding': return 'WebCodecs로 MP4 영상을 생성합니다';
    case 'uploading': return '완성된 영상을 업로드합니다';
    case 'completed': return '영상이 완성되었습니다!';
    case 'error': return '문제가 발생했습니다';
  }
};

export const isPhaseComplete = (currentPhase: GenerationPhase, phase: string) => {
  const phaseOrder = ['loading-video', 'rendering', 'encoding', 'uploading', 'completed'];
  const currentIndex = phaseOrder.indexOf(currentPhase);
  const phaseIndex = phaseOrder.indexOf(phase);
  return currentIndex > phaseIndex || currentPhase === 'completed';
};

export const isPhaseActive = (currentPhase: GenerationPhase, phase: string) => currentPhase === phase;

export const phases = [
  { id: 'loading-video', label: '리소스 로드', icon: '📥' },
  { id: 'rendering', label: '프레임 렌더링', icon: '🎨' },
  { id: 'encoding', label: 'MP4 인코딩', icon: '🎬' },
  { id: 'uploading', label: '업로드', icon: '☁️' },
];
