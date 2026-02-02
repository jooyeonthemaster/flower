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
        icon: '/icons/icon-wedding.svg',
    },
    {
        id: 'opening',
        label: '개업',
        labelEn: 'Opening',
        desc: '성공적인 시작을 알리는 특별한 축하',
        image: '/opening.jpg',
        icon: '/icons/icon-opening.svg',
    },
    {
        id: 'corporate',
        label: '기업',
        labelEn: 'Corporate',
        desc: '비즈니스 행사를 위한 격조 있는 연출',
        image: '/corporate.jpg',
        icon: '/icons/icon-corporate.svg',
    },
];

export default function ShowcaseGrid() {
    const [activeType, setActiveType] = useState(EVENT_TYPES[0]);

    return (
        <section className="w-full h-full flex flex-col">
            {/* Top Section - Preview Area */}
            <div
                className="flex-[60] relative px-4 lg:px-8 pt-12 lg:pt-16 pb-3 lg:pb-4 overflow-hidden flex items-center"
                style={{
                    background: '#F5EDE5',
                }}
            >
                <div className="container mx-auto max-w-6xl w-full">
                    <div className="flex flex-col md:flex-row gap-4 lg:gap-6 items-center">
                        {/* Left: Title & Style Selection */}
                        <div className="w-full md:w-2/5 flex flex-col gap-4 lg:gap-5">
                            <div>
                                <h2
                                    className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-1"
                                    style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                                >
                                    미리보기
                                </h2>
                                <p className="text-base md:text-lg text-gray-700 font-medium">
                                    원하는 행사 유형을 선택해 보세요
                                </p>
                            </div>

                            {/* CTA Button */}
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 text-gray-900 font-bold text-base group w-fit"
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
                                    key={activeType.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="w-full h-full relative overflow-hidden rounded-2xl border-2 border-gray-300/50"
                                >
                                    <div className="absolute inset-0">
                                        <Image
                                            src={activeType.image}
                                            alt={activeType.label}
                                            fill
                                            className="object-contain"
                                            priority
                                        />
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section - Event Type Cards */}
            <div
                className="flex-[40] px-4 lg:px-8 pt-6 lg:pt-8 pb-4 lg:pb-6 flex items-center border-t-2 border-gray-300/50"
                style={{
                    background: '#EAE2D6',
                }}
            >
                <div className="container mx-auto max-w-6xl w-full">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-3 gap-2 md:gap-4"
                    >
                        {EVENT_TYPES.map((type, idx) => (
                            <motion.button
                                key={type.id}
                                onClick={() => setActiveType(type)}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className={`flex flex-col items-center text-center p-3 md:p-4 rounded-2xl transition-all duration-300 ${
                                    activeType.id === type.id
                                        ? 'bg-white shadow-lg'
                                        : 'bg-transparent hover:bg-white/30'
                                }`}
                            >
                                {/* Icon */}
                                <div className={`relative w-12 h-12 md:w-16 md:h-16 mb-2 transition-transform duration-300 ${
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
                                        className="w-10 h-1 bg-teal-500 rounded-full mt-2"
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
