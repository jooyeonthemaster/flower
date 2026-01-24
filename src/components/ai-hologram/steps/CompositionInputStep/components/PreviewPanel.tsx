import { useRef } from 'react';
import Image from 'next/image';
import { categoryPreviewImages } from '../constants/previewImages';

// Premium 모드 색상
const PREMIUM_COLOR = '#E66B33';

interface PreviewPanelProps {
  category: string;
  style: string;
  previewUrl: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete?: () => void;
}

export default function PreviewPanel({ category, style, previewUrl, onFileChange, onDelete }: PreviewPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentPreviewImage = categoryPreviewImages[category]?.[style as 'fancy' | 'simple'] || '';

  return (
    <div className="h-full bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex flex-col">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
          style={{ backgroundColor: PREMIUM_COLOR }}
        >
          2
        </span>
        <h3 className="text-xl font-bold text-gray-900">예시 미리보기</h3>
      </div>

      {/* 미리보기 이미지 */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-full aspect-square max-w-[300px] mx-auto bg-gray-100 rounded-2xl border-2 border-gray-200 overflow-hidden shadow-inner group">
          {currentPreviewImage ? (
            <Image
              src={currentPreviewImage}
              alt="Style Preview"
              fill
              className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2 p-4 text-center">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs">
                AI가 생성할 영상의
                <br />
                분위기를 확인하세요
              </span>
            </div>
          )}
          {/* Premium Badge */}
          <div className="absolute top-3 right-3">
            <span
              className="px-2.5 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 shadow-md"
              style={{ backgroundColor: PREMIUM_COLOR }}
            >
              <span>✨</span> AI
            </span>
          </div>
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold text-gray-600 border border-gray-200">
            1:1 Preview
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        * 선택하신 스타일로 AI가 영상을 새롭게 창작합니다.
      </p>

      {/* 로고 업로드 */}
      <div className="mt-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-3 transition-all hover:border-[#E66B33]/50 flex items-center gap-3">
        {previewUrl ? (
          <>
            <div className="w-12 h-12 relative rounded-lg overflow-hidden border-2 border-[#E66B33]/30 bg-white shrink-0">
              <Image src={previewUrl} alt="Logo" fill className="object-contain" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-gray-900">업로드 완료</div>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-[#E66B33] hover:underline cursor-pointer mt-0.5"
              >
                클릭하여 변경
              </div>
            </div>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 flex items-center justify-center shrink-0 transition-colors border border-red-200"
                title="이미지 삭제"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-3 flex-1 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center shrink-0 group-hover:text-[#E66B33] group-hover:bg-[#E66B33]/10 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-gray-600 group-hover:text-gray-900">참조 이미지 추가</div>
              <div className="text-[10px] text-gray-400">(선택사항)</div>
            </div>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
      </div>
    </div>
  );
}
