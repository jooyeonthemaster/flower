import { categories } from '../constants/categories';

interface CategorySelectorProps {
  category: string;
  onCategoryChange: (category: string) => void;
}

export default function CategorySelector({ category, onCategoryChange }: CategorySelectorProps) {
  return (
    <div className="mb-4 flex-1 flex flex-col justify-center">
      <label className="block text-sm font-bold text-gray-300 mb-3">행사 유형</label>
      <div className="grid grid-cols-3 gap-3 h-full">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-300 h-full ${
              category === cat.id
                ? 'border-amber-500 bg-amber-500/20 text-white shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]'
                : 'border-slate-800 bg-slate-900/50 text-gray-500 hover:border-amber-500/30 hover:text-white'
            }`}
          >
            <span className="text-3xl mb-2 filter drop-shadow-md">{cat.icon}</span>
            <span className="text-sm font-bold">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
