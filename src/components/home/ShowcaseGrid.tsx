'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const EVENT_TYPES = [
    {
        id: 'wedding',
        label: '웨딩',
        labelEn: 'Wedding',
        desc: '결혼식을 빛내는 프리미엄 홀로그램',
        image: '/wedding.jpg',
        icon: '/icons/icon-wedding.svg'
    },
    {
        id: 'opening',
        label: '개업',
        labelEn: 'Opening',
        desc: '성공적인 시작을 알리는 특별한 축하',
        image: '/opening.jpg',
        icon: '/icons/icon-opening.svg'
    },
    {
        id: 'corporate',
        label: '기업',
        labelEn: 'Corporate',
        desc: '비즈니스 행사를 위한 격조 있는 연출',
        image: '/corporate.jpg',
        icon: '/icons/icon-corporate.svg'
    },
];

const STYLES = [
    { id: 'simple', label: '심플하게', labelEn: 'Simple' },
    { id: 'fancy', label: '화려하게', labelEn: 'Fancy' },
];

export default function ShowcaseGrid() {
    const [activeType, setActiveType] = useState(EVENT_TYPES[0]);
    const [activeStyle, setActiveStyle] = useState(STYLES[1]);

    return (
        <section className="w-full h-full flex flex-col">
            {/* Top Section - Preview Area */}
            <div
                className="flex-[60] relative px-4 lg:px-8 overflow-hidden flex items-center"
                style={{
                    background: '#F5EDE5',
                }}
            >
                <div className="container mx-auto max-w-6xl w-full">
                    <div className="flex flex-col md:flex-row gap-6 lg:gap-10 items-center">
                        {/* Left: Title & Style Selection */}
                        <div className="w-full md:w-2/5 flex flex-col gap-4">
                            <div>
                                <h2
                                    className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-3"
                                    style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                                >
                                    미리보기
                                </h2>
                                <p className="text-base md:text-lg text-gray-700 font-medium">
                                    원하는 행사 유형과 스타일을 선택해 보세요
                                </p>
                            </div>

                            {/* Style Toggle */}
                            <div className="flex gap-3 mt-2">
                                {STYLES.map((style) => (
                                    <button
                                        key={style.id}
                                        onClick={() => setActiveStyle(style)}
                                        className={`px-5 py-2.5 rounded-full text-base font-bold transition-all duration-300 ${
                                            activeStyle.id === style.id
                                                ? 'bg-gray-900 text-white shadow-lg'
                                                : 'bg-white/70 text-gray-600 hover:bg-white'
                                        }`}
                                    >
                                        {style.label}
                                    </button>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 mt-2 text-gray-900 font-bold text-base group w-fit"
                            >
                                상세 제작 문의하기
                                <div className="w-8 h-8 rounded-full border-2 border-gray-900 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-all duration-300">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </Link>
                        </div>

                        {/* Right: Preview Card */}
                        <div className="w-full md:w-3/5 h-[280px] md:h-[320px] lg:h-[380px] relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${activeType.id}-${activeStyle.id}`}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="w-full h-full relative bg-white rounded-3xl shadow-2xl overflow-hidden"
                                >
                                    <div className="absolute inset-4 lg:inset-6">
                                        <Image
                                            src={activeType.image}
                                            alt={activeType.label}
                                            fill
                                            className={`object-contain transition-opacity duration-700 ${activeStyle.id === 'simple' ? 'opacity-70' : 'opacity-100'}`}
                                            priority
                                        />
                                    </div>

                                    {activeStyle.id === 'simple' && (
                                        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] pointer-events-none" />
                                    )}

                                    {/* Label Badge */}
                                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-5 py-3 rounded-xl">
                                        <span className="font-black text-gray-900 text-lg">{activeType.label}</span>
                                        <span className="text-gray-500 text-base ml-2">{activeStyle.label}</span>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section - Event Type Cards */}
            <div
                className="flex-[40] px-4 lg:px-8 flex items-center border-t-2 border-gray-300/50"
                style={{
                    background: '#EAE2D6',
                }}
            >
                <div className="container mx-auto max-w-6xl w-full">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-3 gap-3 md:gap-6"
                    >
                        {EVENT_TYPES.map((type, idx) => (
                            <motion.button
                                key={type.id}
                                onClick={() => setActiveType(type)}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className={`flex flex-col items-center text-center p-4 md:p-6 rounded-2xl transition-all duration-300 ${
                                    activeType.id === type.id
                                        ? 'bg-white shadow-lg'
                                        : 'bg-transparent hover:bg-white/30'
                                }`}
                            >
                                {/* Icon */}
                                <div className={`relative w-14 h-14 md:w-20 md:h-20 mb-3 transition-transform duration-300 ${
                                    activeType.id === type.id ? 'scale-110' : ''
                                }`}>
                                    <Image
                                        src={type.icon}
                                        alt={type.label}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                {/* Korean Title */}
                                <h3
                                    className="text-lg md:text-xl font-bold text-gray-900 mb-0.5"
                                    style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                                >
                                    {type.label}
                                </h3>

                                {/* English Title */}
                                <div className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
                                    {type.labelEn}
                                </div>

                                {/* Description - Hidden on mobile */}
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed hidden md:block">
                                    {type.desc}
                                </p>

                                {/* Active Indicator */}
                                {activeType.id === type.id && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="w-10 h-1 bg-teal-500 rounded-full mt-3"
                                    />
                                )}
                            </motion.button>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
