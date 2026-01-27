'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const EVENT_TYPES = [
    { id: 'wedding', label: '웨딩 (Wedding)', image: '/wedding.jpg' },
    { id: 'opening', label: '개업 (Opening)', image: '/opening.jpg' },
    { id: 'corporate', label: '기업 (Corporate)', image: '/corporate.jpg' },
];

const STYLES = [
    { id: 'simple', label: '심플하게' },
    { id: 'fancy', label: '화려하게' },
];

export default function ShowcaseGrid() {
    const [activeType, setActiveType] = useState(EVENT_TYPES[0]);
    const [activeStyle, setActiveStyle] = useState(STYLES[1]); // Default to 'Fancy' as the provided images are fancy

    return (
        <section className="w-full h-full flex items-center justify-center text-gray-900 overflow-hidden relative">
            <div className="container mx-auto px-4 lg:px-8 py-10 flex flex-col justify-center h-full max-w-6xl">
                {/* Header Section */}
                <div className="mb-8 flex items-end justify-between border-b border-gray-200 pb-6 flex-none">
                    <div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                            미리보기
                        </h2>
                        <p className="mt-2 text-base text-gray-500 font-light">
                            원하는 행사 유형과 스타일을 선택해 보세요
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center justify-center">
                    {/* Left: Control Panel */}
                    <div className="w-full md:w-1/3 flex flex-col gap-8">
                        {/* Event Type Selection */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">행사 유형</h3>
                            <div className="flex flex-col gap-2">
                                {EVENT_TYPES.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setActiveType(type)}
                                        className={`px-6 py-4 rounded-2xl text-left transition-all duration-300 border-2 font-bold ${activeType.id === type.id
                                            ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm'
                                            : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600'
                                            }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Style Selection */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">스타일 선택</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {STYLES.map((style) => (
                                    <button
                                        key={style.id}
                                        onClick={() => setActiveStyle(style)}
                                        className={`px-4 py-4 rounded-xl text-center transition-all duration-300 border-2 font-bold text-sm ${activeStyle.id === style.id
                                            ? 'bg-orange-50 border-[#E66B33] text-[#E66B33] shadow-sm'
                                            : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600'
                                            }`}
                                    >
                                        {style.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Preview Card */}
                    <div className="w-full md:w-2/3 h-[500px] lg:h-[600px] relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${activeType.id}-${activeStyle.id}`}
                                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="w-full h-full relative bg-[#E8E8EC] rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden"
                            >
                                {/* Showcase Image */}
                                <div className="absolute inset-8 lg:inset-12">
                                    <Image
                                        src={activeType.image}
                                        alt={activeType.label}
                                        fill
                                        className={`object-contain transition-opacity duration-700 ${activeStyle.id === 'simple' ? 'opacity-70' : 'opacity-100'}`}
                                        priority
                                    />
                                </div>

                                {/* Simple Mode Visual adjustment (Overlay) */}
                                {activeStyle.id === 'simple' && (
                                    <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] transition-all duration-500 pointer-events-none" />
                                )}

                                {/* Bottom Info Overlay */}
                                <div className="absolute inset-x-0 bottom-0 p-8 lg:p-10 bg-gradient-to-t from-white via-white/40 to-transparent">
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-3xl lg:text-4xl font-black text-gray-900">
                                            {activeType.label}
                                        </h4>
                                        <p className="text-gray-500 font-medium text-lg">
                                            {activeStyle.label} 스타일로 한눈에 보기
                                        </p>
                                    </div>

                                    <div className="mt-8">
                                        <Link href="/contact" className="inline-flex items-center gap-2 text-[#E66B33] font-bold text-lg cursor-pointer group">
                                            상세 제작 문의하기
                                            <div className="w-10 h-10 rounded-full border-2 border-[#E66B33] flex items-center justify-center group-hover:bg-[#E66B33] group-hover:text-white transition-all duration-300">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Floating Decoration */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-100/50 rounded-full blur-3xl" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-100/30 rounded-full blur-3xl" />
                    </div>
                </div>
            </div>
        </section>
    );
}
