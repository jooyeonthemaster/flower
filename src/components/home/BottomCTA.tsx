'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const FEATURES = [
    {
        title: '24시간 전담팀',
        titleEn: '24/7 Support',
        desc: '전문 상담사와 즉시 연결',
        icon: '/icons/icon-support.svg'
    },
    {
        title: '전국 당일 설치',
        titleEn: 'Same-day Setup',
        desc: '당일 설치 서비스 제공',
        icon: '/icons/icon-delivery.svg'
    },
    {
        title: '5년 품질 보증',
        titleEn: '5-Year Warranty',
        desc: '연장 보증 프로그램 운영',
        icon: '/icons/icon-warranty.svg'
    },
    {
        title: '맞춤형 제작',
        titleEn: 'Custom Design',
        desc: '고객 요구사항 맞춤 제작',
        icon: '/icons/icon-custom.svg'
    }
];

const BENEFITS = [
    { title: '대량 주문 할인', desc: '10개 이상 주문 시 특별 할인가' },
    { title: '전담 매니저 배정', desc: '고객 전용 계정 관리 서비스' },
    { title: '맞춤 솔루션 개발', desc: '요구사항 맞춤 제작 가능' },
    { title: '연간 계약 혜택', desc: '장기 계약 고객 특별 서비스' }
];

export default function BottomCTA() {
    return (
        <section className="w-full h-full flex flex-col">
            {/* Top Section - CTA */}
            <div
                className="flex-[50] relative px-4 lg:px-8 pt-14 lg:pt-20 pb-4 lg:pb-6 overflow-hidden flex items-center"
                style={{
                    background: '#A0D0C0',
                }}
            >
                <div className="container mx-auto max-w-6xl w-full">
                    <div className="flex flex-col md:flex-row gap-4 lg:gap-6 items-center">
                        {/* Left: Title & CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="w-full md:w-1/2 text-center md:text-left"
                        >
                            <span className="inline-block px-4 py-1.5 bg-white/80 text-gray-700 text-xs font-bold rounded-full mb-2 border border-gray-200">
                                START NOW
                            </span>
                            <h2
                                className="text-3xl md:text-4xl lg:text-5xl font-black mb-1 leading-tight text-gray-900"
                                style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                            >
                                지금 바로 전문 서비스를<br />
                                <span className="text-teal-600">경험하세요</span>
                            </h2>
                            <p className="text-gray-600 text-sm md:text-base mb-2">
                                Digital Hologram Wreaths 솔루션으로<br />
                                특별한 순간을 더욱 빛나게 만드세요
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                                <Link
                                    href="/contact"
                                    className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors text-sm shadow-lg"
                                >
                                    무료 상담 신청 <span className="text-lg">→</span>
                                </Link>
                                <Link
                                    href="/products"
                                    className="bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors text-sm flex items-center justify-center"
                                >
                                    서비스 소개 보기
                                </Link>
                            </div>
                        </motion.div>

                        {/* Right: Benefits List */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="w-full md:w-1/2"
                        >
                            <h3 className="font-black text-lg md:text-xl mb-4 text-gray-800">고객 전용 혜택</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                                {BENEFITS.map((benefit, idx) => (
                                    <div key={idx} className="flex gap-3 items-start">
                                        <div className="w-2 h-2 bg-gray-800 mt-1.5 rounded-full flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-gray-800 mb-0.5 text-base">{benefit.title}</h4>
                                            <p className="text-sm text-gray-700">{benefit.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Bottom Section - Feature Cards */}
            <div
                className="flex-[50] px-4 lg:px-8 pt-8 lg:pt-10 pb-6 lg:pb-8 flex items-center border-t-2 border-gray-400/30"
                style={{
                    background: '#88C8B8',
                }}
            >
                <div className="container mx-auto max-w-6xl w-full">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4"
                    >
                        {FEATURES.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex flex-col items-center text-center p-2 md:p-3"
                            >
                                {/* Icon */}
                                <div className="relative w-10 h-10 md:w-14 md:h-14 mb-2">
                                    <Image
                                        src={feature.icon}
                                        alt={feature.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                {/* Korean Title */}
                                <h3
                                    className="text-base md:text-lg font-black text-gray-800 mb-0.5"
                                    style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                                >
                                    {feature.title}
                                </h3>

                                {/* English Title */}
                                <div className="text-[10px] md:text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                                    {feature.titleEn}
                                </div>

                                {/* Description - Hidden on mobile */}
                                <p className="text-gray-700 text-sm leading-relaxed hidden md:block">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-white/30 text-center text-gray-700 text-xs">
                        &copy; 2024 Digital Wreaths. All rights reserved.
                    </div>
                </div>
            </div>
        </section>
    );
}
