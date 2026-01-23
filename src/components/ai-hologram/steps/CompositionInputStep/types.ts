// 행사별 맞춤 정보 인터페이스
export interface EventInfo {
  // 결혼식
  groomName?: string;
  brideName?: string;
  weddingDate?: string;
  // 개업
  businessName?: string;
  openingDate?: string;
  // 행사
  eventName?: string;
  organizer?: string;
}

export interface CompositionData {
  messages: string[]; // 3개 멘트
  category: string;
  style: string;
  referenceImage?: string;
  eventInfo?: EventInfo;
}

export interface CompositionInputStepProps {
  onNext: (data: CompositionData) => void;
  initialData?: CompositionData;
  onBack?: () => void;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

export interface StyleOption {
  id: string;
  label: string;
  color: string;
  desc: string;
}

export interface SceneLabel {
  icon: string;
  label: string;
}
