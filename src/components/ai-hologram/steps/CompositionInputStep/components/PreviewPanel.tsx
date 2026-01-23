import { useRef } from 'react';
import Image from 'next/image';
import { categoryPreviewImages } from '../constants/previewImages';

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
    <div className="flex flex-col gap-6 min-h-0 overflow-y-auto custom-scrollbar">
      {/* 미리보기 카드 */}
      <div className="bg-gradient-to-br from-slate-900/80 to-black/80 border border-amber-500/20 rounded-[1.5rem] p-5 backdrop-blur-md flex-1 flex flex-col justify-between shadow-[0_0_40px_-10px_rgba(251,191,36,0.05)]">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 self-start">
          <span className="w-8 h-8 rounded-full bg-amber-500/20 text-white flex items-center justify-center text-sm font-bold border border-amber-500/20">
            2
          </span>
          예시 미리보기
        </h3>

        <div className="flex-1 w-full flex flex-col items-center justify-center">
          <div className="relative w-full aspect-square max-w-[340px] mx-auto bg-black rounded-2xl border border-amber-500/10 overflow-hidden shadow-2xl flex-shrink-0 group">
            {currentPreviewImage ? (
              <Image
                src={currentPreviewImage}
                alt="Style Preview"
                fill
                className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 gap-2 p-4 text-center">
                <span className="text-xs">
                  AI가 생성할 영상의
                  <br />
                  분위기를 확인하세요
                </span>
              </div>
            )}
            {/* Premium Badge */}
            <div className="absolute top-3 right-3">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400 blur-md opacity-20 animate-pulse-slow"></div>
                <span className="relative px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <span>✨</span> AI Generate
                </span>
              </div>
            </div>
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-gray-300 border border-white/10">
              1:1 Preview
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">* 선택하신 스타일로 AI가 영상을 새롭게 창작합니다.</p>
      </div>

      {/* 로고 업로드 - 높이 고정 */}
      <div className="bg-black/60 border-2 border-dashed border-gray-800 rounded-2xl p-4 transition-all flex items-center gap-4 h-24">
        {previewUrl ? (
          <>
            <div className="w-14 h-14 relative rounded-lg overflow-hidden border border-amber-500/30 bg-black shrink-0">
              <Image src={previewUrl} alt="Logo" fill className="object-contain" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white">업로드 완료</div>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-amber-400 hover:text-amber-300 cursor-pointer mt-1"
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
                className="w-10 h-10 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 flex items-center justify-center shrink-0 transition-colors border border-red-500/20"
                title="이미지 삭제"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-4 flex-1 cursor-pointer group hover:opacity-80"
          >
            <div className="w-10 h-10 rounded-full bg-gray-900 text-gray-600 flex items-center justify-center shrink-0 group-hover:text-amber-500 transition-colors">
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
              <div className="text-sm font-bold text-gray-400 group-hover:text-gray-200">참조 이미지 추가</div>
              <div className="text-[10px] text-gray-600">(선택사항)</div>
            </div>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
      </div>
    </div>
  );
}
