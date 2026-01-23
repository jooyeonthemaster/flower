import { styles } from '../constants/styles';

interface StyleSelectorProps {
  style: string;
  onStyleChange: (style: string) => void;
}

export default function StyleSelector({ style, onStyleChange }: StyleSelectorProps) {
  return (
    <div className="mb-4 flex-1 flex flex-col justify-center">
      <label className="block text-sm font-bold text-gray-300 mb-3">AI 스타일</label>
      <div className="grid grid-cols-1 gap-3 h-full">
        {styles.map((s) => (
          <button
            key={s.id}
            onClick={() => onStyleChange(s.id)}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left group h-full ${
              style === s.id
                ? 'border-amber-500 bg-amber-500/20 shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]'
                : 'border-slate-800 bg-slate-900/50 hover:border-amber-500/30'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${s.color} shadow-lg shrink-0 group-hover:scale-110 transition-transform`}
            ></div>
            <div>
              <div className={`text-base font-bold ${style === s.id ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>
                {s.label}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
