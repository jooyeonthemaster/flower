'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const FEATURES = [
    {
        title: '24시간 기업 전담팀',
        desc: '전문 B2B 상담사와 즉시 연결',
        icon: '/assets/hologram-support.png'
    },
    {
        title: '전국 당일 설치',
        desc: '기업 고객 전용 당일 설치 서비스',
        icon: '/assets/hologram-truck.png'
    },
    {
        title: '5년 기업 보증',
        desc: 'B2B 전용 연장 보증 프로그램',
        icon: '/assets/hologram-shield.png'
    }
];

const BENEFITS = [
    [
        '대량 주문 할인',
        '10개 이상 주문 시 특별 할인가'
    ],
    [
        '맞춤 솔루션 개발',
        '기업 요구사항 맞춤 제작'
    ],
    [
        '전담 매니저 배정',
        '기업 전용 계정 관리 서비스'
    ],
    [
        '연간 계약 혜택',
        '장기 계약 고객 특별 서비스'
    ]
];

export default function BottomCTA() {
    return (
        <section className="w-full h-full flex items-center justify-center text-gray-900 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[100px] translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-10 flex flex-col justify-center h-full max-w-5xl max-h-[90vh]">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-6 lg:mb-8 flex-none"
                >
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded mb-3">START NOW</span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                        지금 바로 전문 서비스를<br />
                        <span className="text-blue-600">경험하세요</span>
                    </h2>
                    <p className="text-gray-600 text-base max-w-2xl mx-auto">
                        기업 전용 Digital Hologram Wreaths 솔루션으로<br />
                        귀하의 비즈니스에 혁신을 더하십시오
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                        <Link
                            href="/contact"
                            className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors text-sm"
                        >
                            무료 상담 신청 <span className="text-lg">→</span>
                        </Link>
                        <Link
                            href="/products"
                            className="bg-transparent border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 hover:border-gray-300 transition-colors text-sm flex items-center justify-center"
                        >
                            서비스 소개 보기
                        </Link>
                    </div>
                </motion.div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 flex-none">
                    {FEATURES.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + (idx * 0.1) }}
                            className="bg-white p-6 rounded-2xl border border-gray-100 text-center hover:border-blue-500 hover:shadow-xl transition-all duration-500 group"
                        >
                            <div className="relative w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                                <Image
                                    src={feature.icon}
                                    alt={feature.title}
                                    fill
                                    className="object-contain"
                                    style={{ mixBlendMode: 'multiply' }}
                                />
                            </div>
                            <h3 className="text-base font-bold mb-1 text-gray-900">{feature.title}</h3>
                            <div className="w-8 h-1 bg-blue-100 mx-auto my-3 rounded-full group-hover:w-12 group-hover:bg-blue-400 transition-all duration-500"></div>
                            <p className="text-gray-500 text-xs leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Benefits List */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm flex-none"
                >
                    <h3 className="text-center font-bold text-base mb-6 text-gray-900">기업 고객 전용 혜택</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        {BENEFITS.map(([title, desc], idx) => (
                            <div key={idx} className="flex gap-3 items-start">
                                <div className="w-1.5 h-1.5 bg-blue-500 mt-2 rounded-full flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-0.5 text-sm">{title}</h4>
                                    <p className="text-xs text-gray-500">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Simple Footer Links for completeness */}
                <div className="mt-8 pt-4 border-t border-gray-800 text-center text-gray-500 text-xs flex-none">
                    &copy; 2024 Digital Wreaths. All rights reserved.
                </div>
            </div>
        </section>
    );
}
