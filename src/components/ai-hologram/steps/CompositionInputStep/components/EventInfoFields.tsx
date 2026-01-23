import { EventInfo } from '../types';

interface EventInfoFieldsProps {
  category: string;
  eventInfo: EventInfo;
  setEventInfo: (info: EventInfo) => void;
  onBlur: () => void;
}

export default function EventInfoFields({ category, eventInfo, setEventInfo, onBlur }: EventInfoFieldsProps) {
  switch (category) {
    case 'wedding':
      return (
        <div className="grid grid-cols-2 gap-4 w-full">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">신랑 이름</label>
            <input
              type="text"
              value={eventInfo.groomName || ''}
              onChange={(e) => setEventInfo({ ...eventInfo, groomName: e.target.value })}
              onBlur={onBlur}
              placeholder="홍길동"
              className="w-full bg-black/60 border border-amber-500/20 rounded-xl px-4 py-3 text-white text-base focus:border-amber-400 focus:bg-black/80 focus:shadow-[0_0_15px_rgba(251,191,36,0.1)] outline-none transition-all placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">신부 이름</label>
            <input
              type="text"
              value={eventInfo.brideName || ''}
              onChange={(e) => setEventInfo({ ...eventInfo, brideName: e.target.value })}
              onBlur={onBlur}
              placeholder="김영희"
              className="w-full bg-black/60 border border-amber-500/20 rounded-xl px-4 py-3 text-white text-base focus:border-amber-400 focus:bg-black/80 focus:shadow-[0_0_15px_rgba(251,191,36,0.1)] outline-none transition-all placeholder:text-gray-500"
            />
          </div>
        </div>
      );
    case 'opening':
      return (
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">상호명</label>
          <input
            type="text"
            value={eventInfo.businessName || ''}
            onChange={(e) => setEventInfo({ ...eventInfo, businessName: e.target.value })}
            onBlur={onBlur}
            placeholder="OO카페"
            className="w-full bg-black/60 border border-amber-500/20 rounded-xl px-4 py-3 text-white text-base focus:border-amber-400 focus:bg-black/80 focus:shadow-[0_0_15px_rgba(251,191,36,0.1)] outline-none transition-all placeholder:text-gray-500"
          />
        </div>
      );
    case 'event':
      return (
        <div className="grid grid-cols-2 gap-4 w-full">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">행사명</label>
            <input
              type="text"
              value={eventInfo.eventName || ''}
              onChange={(e) => setEventInfo({ ...eventInfo, eventName: e.target.value })}
              onBlur={onBlur}
              placeholder="2026 신년 행사"
              className="w-full bg-black/60 border border-amber-500/20 rounded-xl px-4 py-3 text-white text-base focus:border-amber-400 focus:bg-black/80 focus:shadow-[0_0_15px_rgba(251,191,36,0.1)] outline-none transition-all placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">주관 기관 (선택)</label>
            <input
              type="text"
              value={eventInfo.organizer || ''}
              onChange={(e) => setEventInfo({ ...eventInfo, organizer: e.target.value })}
              placeholder="주식회사 OOO"
              className="w-full bg-black/60 border border-amber-500/20 rounded-xl px-4 py-3 text-white text-base focus:border-amber-400 focus:bg-black/80 focus:shadow-[0_0_15px_rgba(251,191,36,0.1)] outline-none transition-all placeholder:text-gray-500"
            />
          </div>
        </div>
      );
    default:
      return null;
  }
}
