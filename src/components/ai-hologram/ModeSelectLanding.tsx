'use client';

import { useState } from 'react';

interface ModeSelectLandingProps {
  onSelectMode: (mode: 'single' | 'composition') => void;
}

export default function ModeSelectLanding({ onSelectMode }: ModeSelectLandingProps) {
  const [hoveredCard, setHoveredCard] = useState<'template' | 'ai' | null>(null);

  return (
    <div className="flex flex-col">
      {/* 헤더 영역 */}
      <div className="text-center py-8 sm:py-12 px-4 animate-fade-in-down">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 mb-4 tracking-tight filter drop-shadow-lg">
          나만의 홀로그램 영상 만들기
        </h1>
        <p className="text-gray-300 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          두 가지 방식 중 원하는 스타일을 선택해주세요.<br className="hidden sm:block" />
          <span className="text-blue-400 font-bold">쉽고 빠른 템플릿</span> 또는 <span className="text-amber-400 font-bold">세상에 하나뿐인 AI 제작</span>
        </p>
      </div>

      {/* 메인 선택 카드 영역 */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 h-full items-stretch">

          {/* =================================================================================
              옵션 1: 템플릿 방식 (Standard/Free)
              스타일: 깔끔함, 신뢰, 블루/그레이 톤, "기본에 충실"
             ================================================================================= */}
          <div
            className={`relative flex flex-col rounded-[2rem] border-2 transition-all duration-500 ease-out group overflow-hidden
              ${hoveredCard === 'template'
                ? 'border-blue-400 bg-slate-900/80 scale-[1.02] shadow-[0_0_50px_-12px_rgba(96,165,250,0.5)]'
                : 'border-slate-700 bg-slate-900/40 hover:border-slate-500'
              }`}
            onMouseEnter={() => setHoveredCard('template')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* 배경 장식 */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-transparent opacity-50"></div>

            {/* 뱃지 */}
            <div className="absolute top-6 left-6 z-20">
              <span className="px-4 py-2 rounded-full bg-slate-800/90 text-blue-400 text-sm font-bold border border-blue-500/30 shadow-lg backdrop-blur-md flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Basic
              </span>
            </div>

            {/* 카드 헤더 (이미지/아이콘) */}
            <div className="relative h-64 bg-gradient-to-b from-slate-800/50 to-transparent flex items-center justify-center p-8">
              <div className={`transition-transform duration-500 ${hoveredCard === 'template' ? 'scale-110' : 'scale-100'}`}>
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-1 shadow-2xl shadow-blue-900/50">
                  <div className="w-full h-full rounded-[1.3rem] bg-slate-900 flex items-center justify-center border border-white/10">
                    <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* 카드 내용 */}
            <div className="flex-1 p-8 pt-0 flex flex-col z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">템플릿 선택</h2>
                <div className="text-4xl font-extrabold text-blue-400 mb-2">무료 <span className="text-lg text-gray-400 font-normal">/ 건</span></div>
                <p className="text-gray-400 font-medium">
                  이미 완성된 디자인에 문구만 넣으세요!
                </p>
              </div>

              {/* 특징 리스트 */}
              <div className="space-y-4 mb-8 bg-slate-800/30 p-6 rounded-2xl border border-white/5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold mt-0.5">✓</div>
                  <div>
                    <span className="text-gray-200 font-bold block">검증된 디자인</span>
                    <span className="text-sm text-gray-400">전문가가 만든 고퀄리티 템플릿 사용</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold mt-0.5">✓</div>
                  <div>
                    <span className="text-gray-200 font-bold block">즉시 미리보기</span>
                    <span className="text-sm text-gray-400">입력한 문구가 즉시 적용되어 확인 가능</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold mt-0.5">✓</div>
                  <div>
                    <span className="text-gray-200 font-bold block">6개의 문구 가능</span>
                    <span className="text-sm text-gray-400">더 많은 내용을 담을 수 있어요</span>
                  </div>
                </div>
              </div>

              {/* 진행 과정 (Step) */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-700 pb-2">진행 과정</h4>
                <div className="relative flex justify-between items-center text-sm">
                  {/* 연결선 */}
                  <div className="absolute top-3 left-0 w-full h-0.5 bg-gray-700 -z-10"></div>

                  {['디자인 선택', '문구 입력', '영상 완성'].map((step, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 px-2">
                      <div className="w-6 h-6 rounded-full bg-gray-700 text-gray-300 flex items-center justify-center text-xs font-bold border-2 border-slate-900">
                        {i + 1}
                      </div>
                      <span className="text-gray-400 text-xs text-center font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <button
                  onClick={() => onSelectMode('single')}
                  className="w-full py-5 rounded-2xl font-bold text-xl bg-white text-slate-900 hover:bg-blue-50 transition-colors shadow-lg shadow-white/10 hover:shadow-white/20 transform active:scale-[0.98] duration-200 flex items-center justify-center gap-2 group-hover:gap-3"
                >
                  템플릿으로 시작하기
                  <svg className="w-5 h-5 transition-all text-slate-600 group-hover:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* =================================================================================
              옵션 2: AI 합성 방식 (Premium/Paid)
              스타일: 고급스러움, AI 기술, 골드/퍼플/블랙, "압도적 퀄리티"
             ================================================================================= */}
          <div
            className={`relative flex flex-col rounded-[2rem] border-2 transition-all duration-500 ease-out group overflow-hidden
              ${hoveredCard === 'ai'
                ? 'border-amber-400 bg-black scale-[1.02] shadow-[0_0_60px_-10px_rgba(251,191,36,0.6)]'
                : 'border-amber-900/50 bg-black/60 hover:border-amber-500/50'
              }`}
            onMouseEnter={() => setHoveredCard('ai')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* 배경 이펙트 (오로라) */}
            <div className="absolute -top-[50%] -right-[50%] w-[150%] h-[150%] bg-gradient-to-b from-amber-500/10 via-purple-500/10 to-transparent blur-3xl opacity-50 animate-pulse-slow pointer-events-none"></div>

            {/* 뱃지 */}
            <div className="absolute top-6 left-6 z-20 flex gap-2">
              <span className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-sm font-bold shadow-lg shadow-amber-500/40 flex items-center gap-2 animate-shimmer bg-[size:200%_auto]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                Premium
              </span>
              <span className="px-3 py-2 rounded-full bg-white/10 text-amber-200 text-xs font-medium border border-white/10 backdrop-blur-sm">
                AI Powered
              </span>
            </div>

            {/* 카드 헤더 */}
            <div className="relative h-64 bg-gradient-to-b from-amber-900/20 to-transparent flex items-center justify-center p-8">
              <div className={`transition-all duration-700 ${hoveredCard === 'ai' ? 'scale-110 drop-shadow-[0_0_25px_rgba(251,191,36,0.5)]' : 'scale-100'}`}>
                {/* 3D 느낌의 아이콘 컨테이너 */}
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-purple-600 rounded-full blur-xl opacity-40 animate-spin-slow"></div>
                  <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-amber-400 to-amber-700 p-[2px] shadow-2xl">
                    <div className="w-full h-full rounded-[1.3rem] bg-black flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-50"></div>
                      <svg className="w-16 h-16 text-amber-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 카드 내용 */}
            <div className="flex-1 p-8 pt-0 flex flex-col z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 mb-2">AI 맞춤 제작</h2>
                <div className="text-4xl font-extrabold text-amber-400 mb-2">100,000원 <span className="text-lg text-amber-500/70 font-normal">/ 건</span></div>
                <p className="text-amber-100/70 font-medium">
                  AI가 당신만을 위한 영상을 창조합니다
                </p>
              </div>

              {/* 특징 리스트 */}
              <div className="space-y-4 mb-8 bg-amber-950/20 p-6 rounded-2xl border border-amber-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 blur-2xl rounded-full pointer-events-none"></div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-black flex items-center justify-center text-sm font-bold mt-0.5 shadow-lg shadow-amber-500/20">✨</div>
                  <div>
                    <span className="text-amber-50 font-bold block">100% 유니크한 영상</span>
                    <span className="text-sm text-amber-200/60">세상에 똑같은 영상은 존재하지 않습니다</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-black flex items-center justify-center text-sm font-bold mt-0.5 shadow-lg shadow-amber-500/20">🤖</div>
                  <div>
                    <span className="text-amber-50 font-bold block">AI 풀 오토메이션</span>
                    <span className="text-sm text-amber-200/60">이미지부터 영상까지 AI가 알아서 생성</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-black flex items-center justify-center text-sm font-bold mt-0.5 shadow-lg shadow-amber-500/20">🎨</div>
                  <div>
                    <span className="text-amber-50 font-bold block">3가지 핵심 문구</span>
                    <span className="text-sm text-amber-200/60">가장 중요한 메시지에 집중한 임팩트</span>
                  </div>
                </div>
              </div>

              {/* 진행 과정 (Step) */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-4 border-b border-amber-900/50 pb-2">진행 과정</h4>
                <div className="relative flex justify-between items-center text-sm">
                  {/* 연결선 */}
                  <div className="absolute top-3 left-0 w-full h-0.5 bg-amber-900/50 -z-10"></div>

                  {[
                    { t: '문구 입력', i: '✍️' },
                    { t: 'AI 이미지 생성', i: '🖼️' },
                    { t: 'AI 영상 합성', i: '🎬' },
                    { t: '완성', i: '✨' }
                  ].map((step, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 px-1">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 border border-amber-500/30 text-xs flex items-center justify-center shadow-lg z-10">
                        {step.i}
                      </div>
                      <span className="text-amber-100/50 text-[10px] md:text-xs text-center font-medium leading-tight">{step.t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <button
                  onClick={() => onSelectMode('composition')}
                  className="w-full py-5 rounded-2xl font-bold text-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-400 hover:to-yellow-400 transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transform active:scale-[0.98] duration-200 flex items-center justify-center gap-2 group-hover:gap-3 relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    AI 프리미엄 시작
                    <svg className="w-5 h-5 transition-all text-black/70 group-hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
