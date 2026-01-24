import { categories } from '../constants/categories';

// Premium 모드 색상
const PREMIUM_COLOR = '#E66B33';

interface CategorySelectorProps {
  category: string;
  onCategoryChange: (category: string) => void;
}

export default function CategorySelector({ category, onCategoryChange }: CategorySelectorProps) {
  return (
    <div className="flex flex-col">
      <label className="block text-sm font-bold text-gray-700 mb-2">행사 유형</label>
      <div className="grid grid-cols-3 gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 ${
              category === cat.id
                ? 'border-[#E66B33] bg-[#E66B33]/10 text-gray-900 shadow-md'
                : 'border-gray-200 bg-white text-gray-600 hover:border-[#E66B33]/50 hover:bg-gray-50'
            }`}
          >
            <span className="text-2xl mb-1">{cat.icon}</span>
            <span className="text-xs font-bold">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
