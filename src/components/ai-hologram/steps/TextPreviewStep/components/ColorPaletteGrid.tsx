import { generateColorPalette } from '../utils/colorPalette';

// Standard 모드 색상
const STANDARD_COLOR = '#8A9A5B';

interface ColorPaletteGridProps {
  currentColor: string;
  onSelect: (color: string) => void;
}

export default function ColorPaletteGrid({ currentColor, onSelect }: ColorPaletteGridProps) {
  const colorPalette = generateColorPalette();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: '2px' }}>
      {colorPalette.map((color, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(color)}
          className={`w-4 h-4 border-2 rounded-sm transition-all ${
            currentColor === color
              ? 'border-[#8A9A5B] ring-2 ring-[#8A9A5B]/50 scale-110'
              : 'border-gray-300 hover:border-[#8A9A5B]/60 hover:scale-105'
          }`}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  );
}
