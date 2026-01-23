import { generateColorPalette } from '../utils/colorPalette';

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
          className={`w-4 h-4 border ${currentColor === color ? 'border-blue-400 ring-1 ring-blue-400' : 'border-black/20 hover:border-white/60'}`}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  );
}
