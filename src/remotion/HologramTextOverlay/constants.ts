// Constants and configuration for HologramTextOverlay

export const DEFAULT_FONT_FAMILY = "'Noto Sans KR', sans-serif";
export const DEFAULT_FONT_SIZE = 65;
export const DEFAULT_TEXT_COLOR = '#ffffff';
export const DEFAULT_GLOW_COLOR = '#00ffff';
export const DEFAULT_TEXT_POSITION = 'random';

// Animation timing constants
export const SCENE_DURATION_SECONDS = 5;
export const ENTRANCE_DURATION_SECONDS = 0.8;
export const EXIT_DURATION_SECONDS = 0.5;
export const EFFECT_DURATION_SECONDS = 4;
export const FADEOUT_START_SECONDS = 3.5;

// Typewriter effect timing
export const TYPEWRITER_DURATION_SECONDS = 2;

// 3D effect timing
export const ZOOM_IN_DURATION_SECONDS = 2.5;
export const FLIP_UP_DURATION_SECONDS = 2;
export const ELASTIC_DURATION_SECONDS = 1.2;

// Position values (percentage based for different resolutions)
export const POSITION_VALUES = {
  top: '30%',
  center: '50%',
  bottom: '68%',
} as const;

// Extrude effect configuration
export const EXTRUDE_DEPTH = 10; // Optimized from 30
export const EXTRUDE_ANGLE_X = 135;
export const EXTRUDE_ANGLE_Y = 135;

// Movement constraints (base unit multipliers)
export const MAX_Y_UP_DEFAULT = -250;
export const MAX_Y_DOWN_DEFAULT = 250;
export const MAX_Y_UP_TOP = -120;
export const MAX_Y_DOWN_TOP = 200;
export const MAX_Y_UP_BOTTOM = -200;
export const MAX_Y_DOWN_BOTTOM = 120;
export const MAX_X_OFFSET = 150;

// Container configuration
export const CONTAINER_WIDTH = '90%';
export const CONTAINER_MAX_WIDTH = '90%';
export const CONTAINER_PADDING = '40px';
export const PERSPECTIVE = '1200px';

// Base resolution for scaling calculations
export const BASE_RESOLUTION_WIDTH = 1080;
