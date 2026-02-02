'use client'

import { EventInfo } from '../types';

// 공통 input 스타일
const inputClassName = "w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-sm focus:border-[#E66B33] focus:ring-2 focus:ring-[#E66B33]/20 outline-none transition-all placeholder:text-gray-400";

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
        <div className="grid grid-cols-2 gap-3 w-full">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">신랑 이름</label>
            <input
              type="text"
              value={eventInfo.groomName || ''}
              onChange={(e) => setEventInfo({ ...eventInfo, groomName: e.target.value })}
              onBlur={onBlur}
              placeholder="홍길동"
              className={inputClassName}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">신부 이름</label>
            <input
              type="text"
              value={eventInfo.brideName || ''}
              onChange={(e) => setEventInfo({ ...eventInfo, brideName: e.target.value })}
              onBlur={onBlur}
              placeholder="김영희"
              className={inputClassName}
            />
          </div>
        </div>
      );
    case 'opening':
      return (
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-600 mb-1.5">상호명</label>
          <input
            type="text"
            value={eventInfo.businessName || ''}
            onChange={(e) => setEventInfo({ ...eventInfo, businessName: e.target.value })}
            onBlur={onBlur}
            placeholder="OO카페"
            className={inputClassName}
          />
        </div>
      );
    case 'event':
      return (
        <div className="grid grid-cols-2 gap-3 w-full">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">행사명</label>
            <input
              type="text"
              value={eventInfo.eventName || ''}
              onChange={(e) => setEventInfo({ ...eventInfo, eventName: e.target.value })}
              onBlur={onBlur}
              placeholder="2026 신년 행사"
              className={inputClassName}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">주관 기관 (선택)</label>
            <input
              type="text"
              value={eventInfo.organizer || ''}
              onChange={(e) => setEventInfo({ ...eventInfo, organizer: e.target.value })}
              placeholder="주식회사 OOO"
              className={inputClassName}
            />
          </div>
        </div>
      );
    default:
      return null;
  }
}
