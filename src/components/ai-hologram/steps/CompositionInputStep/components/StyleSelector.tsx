'use client'

import { styles } from '../constants/styles';

interface StyleSelectorProps {
  style: string;
  onStyleChange: (style: string) => void;
}

export default function StyleSelector({ style, onStyleChange }: StyleSelectorProps) {
  return (
    <div className="flex flex-col">
      <label className="block text-sm font-bold text-gray-700 mb-2">AI 스타일</label>
      <div className="grid grid-cols-1 gap-2">
        {styles.map((s) => (
          <button
            key={s.id}
            onClick={() => onStyleChange(s.id)}
            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left group ${
              style === s.id
                ? 'border-[#E66B33] bg-[#E66B33]/10 shadow-md'
                : 'border-gray-200 bg-white hover:border-[#E66B33]/50 hover:bg-gray-50'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${s.color} shadow-md shrink-0 group-hover:scale-110 transition-transform`}
            ></div>
            <div className={`text-sm font-bold ${style === s.id ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
              {s.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
