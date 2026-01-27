'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();

    // Parallax effects
    const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

    // Mouse parallax
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 50, damping: 30 }); // Softer movement
    const mouseY = useSpring(y, { stiffness: 50, damping: 30 });

    function handleMouseMove(event: React.MouseEvent) {
        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;
        x.set(clientX - innerWidth / 2);
        y.set(clientY - innerHeight / 2);
    }

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen bg-white text-gray-900 overflow-hidden flex flex-col items-center justify-center"
            onMouseMove={handleMouseMove}
        >
            {/* Static Background Image */}
            <div
                className="absolute inset-0 z-0 opacity-100"
                style={{
                    backgroundImage: 'url(/images/home-hero-bg.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'bottom center',
                    backgroundRepeat: 'no-repeat',
                }}
            />
            {/* Optional Overlay for text readability if needed */}
            {/* <div className="absolute inset-0 bg-white/30 z-0" /> */}

            {/* Main Typography */}
            <div className="relative z-10 text-center flex flex-col items-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-6"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full border border-[#E66B33]/30 bg-white/50 backdrop-blur-sm text-[#E66B33] text-sm font-bold tracking-wider shadow-sm">
                        ✨ Premium AI Hologram Service
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight text-gray-900"
                    style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                >
                    영원히 기억될
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E66B33] via-pink-500 to-purple-600 animate-gradient">
                        빛나는 순간
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="mt-8 text-lg md:text-2xl text-gray-600 max-w-2xl font-light leading-relaxed break-keep"
                    style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                >
                    당신의 소중한 이야기를 AI 홀로그램 아트로 완성해드립니다.
                    <br />
                    전통적인 화환을 넘어, 감동이 살아있는 새로운 기념 문화를 경험하세요.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-12 flex flex-col sm:flex-row gap-4"
                >
                    <Link
                        href="/ai-hologram"
                        className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-[#0a0a0a] rounded-full hover:bg-[#E66B33] transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                    >
                        홀로그램 만들기
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                    <Link
                        href="/products"
                        className="px-10 py-5 text-lg font-bold text-gray-700 bg-white border-2 border-gray-100 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
                    >
                        서비스 소개
                    </Link>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                style={{ opacity: useTransform(scrollY, [0, 200], [1, 0]) }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 text-sm"
            >
                <span className="font-medium">SCROLL</span>
                <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center p-1"
                >
                    <motion.div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                </motion.div>
            </motion.div>
        </div>
    );
}
