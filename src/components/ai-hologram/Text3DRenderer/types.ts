export interface StyleColors {
  primary: string;
  secondary: string;
  glow: string;
  background: string;
}

export interface Text3DLayerProps {
  text: string;
  font: string;
  color: string;
  position: [number, number, number];
  scale: number;
  opacity: number;
  outlineWidth?: number;
  outlineColor?: string;
}

export interface GlowPlaneProps {
  color: string;
  position: [number, number, number];
  scale: [number, number, number];
  opacity: number;
}

export interface Text3DSceneProps {
  text: string;
  style: string;
  customColors?: {
    primary?: string;
    secondary?: string;
    glow?: string;
  };
  animate?: boolean;
}

export interface LayerConfig {
  id: string;
  position: [number, number, number];
  color: string;
  opacity: number;
  scale: number;
  outlineWidth: number;
  outlineColor?: string;
}

export interface Text3DRendererProps {
  text: string;
  style: string;
  width?: number;
  height?: number;
  customColors?: {
    primary?: string;
    secondary?: string;
    glow?: string;
  };
  preview?: boolean;
  onImageGenerated?: (dataUrl: string) => void;
}

export interface Text3DRendererRef {
  capture: () => Promise<string>;
}
