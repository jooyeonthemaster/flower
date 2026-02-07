export interface HologramTextOverlayProps {
  videoSrc: string;
  imageSrc?: string;
  referenceImageSrc?: string; // Reference image (logo/portrait - background removed)
  texts: string[];
  fontFamily?: string;
  fontSize?: number;
  textColor?: string;
  glowColor?: string;
  effects?: string[]; // Effects array
  textPosition?: 'random' | 'top' | 'center' | 'bottom';
}
