'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

// Features 데이터 (중간 베이지 섹션)
const FEATURES = [
    {
        id: 'eco',
        title: '친환경적',
        titleEn: 'Eco-Friendly',
        desc: '일회용 화환 대신 지속 가능한 디지털 화환으로 환경을 보호합니다.',
        icon: '/icons/icon-leaf.svg',
    },
    {
        id: 'permanent',
        title: '영구적 보존',
        titleEn: 'Permanent Preservation',
        desc: '시들지 않는 아름다움으로 소중한 순간을 영구히 간직할 수 있습니다.',
        icon: '/icons/icon-diamond.svg',
    },
    {
        id: 'custom',
        title: '맞춤형 디자인',
        titleEn: 'Customizable',
        desc: '웨딩, 개업, 기업 행사 등 TPO에 맞춰 자유롭게 커스터마이징 가능합니다.',
        icon: '/icons/icon-palette.svg',
    },
    {
        id: 'setup',
        title: '즉시 설치',
        titleEn: 'Instant Setup',
        desc: '전원만 연결하면 즉시 작동합니다. 5분 이내 설치로 누구나 쉽게 운영 가능합니다.',
        icon: '/icons/icon-bolt.svg',
    },
];

// Specs 데이터 (하단 짙은 베이지 섹션)
const SPECS = [
    {
        id: 'resolution',
        title: '8K UHD 해상도',
        titleEn: '8K UHD Resolution',
        desc: '초고화질 해상도로 선명하고 생생한 홀로그램 디스플레이를 제공합니다.',
        icon: '/icons/icon-8k.svg',
    },
    {
        id: 'playback',
        title: '72시간 연속 재생',
        titleEn: '72-Hour Playback',
        desc: '무정전 장시간 운영으로 행사 내내 안정적인 디스플레이를 보장합니다.',
        icon: '/icons/icon-72hour.svg',
    },
    {
        id: 'wireless',
        title: '무선 컨트롤',
        titleEn: 'Wireless Control',
        desc: '와이파이 기반 원격 제어로 언제 어디서나 콘텐츠를 관리할 수 있습니다.',
        icon: '/icons/icon-wireless.svg',
    },
    {
        id: 'installation',
        title: '5분 설치',
        titleEn: '5-Minute Installation',
        desc: '간편한 즉시 설치로 복잡한 설정 없이 바로 사용할 수 있습니다.',
        icon: '/icons/icon-5minute.svg',
    },
];

export default function WhyChoose() {
    return (
        <section className="w-full h-full flex flex-col">

            {/* 섹션 1: Hero (베이지) */}
            <div
                className="flex-[45] relative px-6 lg:px-8 overflow-hidden flex items-center"
                style={{
                    background: '#E0D8CC',
                }}
            >
                <div className="container mx-auto max-w-7xl relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12">
                        {/* 좌측: 텍스트 콘텐츠 */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="flex-1 text-left max-w-xl"
                        >
                            <h2
                                className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-gray-900 mb-2 uppercase tracking-tight"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                                DIGITAL HOLOGRAM<br />
                                <span className="text-gray-500">WREATHS:</span>
                            </h2>
                            <p
                                className="text-lg md:text-xl text-gray-800 font-bold mb-3 leading-snug"
                                style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                            >
                                축하의 미래를 경험하세요.
                            </p>
                            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 max-w-md">
                                웨딩, 개업, 기업 행사를 위한 차세대 축하 솔루션.<br />
                                시들지 않는 아름다움과 첨단 기술의 완벽한 조화.
                            </p>

                            <button className="bg-gray-900 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg">
                                자세히 알아보기
                            </button>
                        </motion.div>

                        {/* 우측: 원형 제품 이미지 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="flex-1 flex items-center justify-center"
                        >
                            <div className="relative w-[180px] h-[180px] md:w-[220px] md:h-[220px] lg:w-[260px] lg:h-[260px]">
                                {/* 원형 마스크 이미지 */}
                                <div className="w-full h-full rounded-full overflow-hidden border-6 border-white shadow-2xl bg-white">
                                    <div className="relative w-full h-full hover:scale-110 transition-transform duration-700">
                                        <Image
                                            src="/images/products/hologram-wreath-blue.jpg"
                                            alt="디지털 홀로그램 화환"
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                </div>
                                {/* 데코레이션 블러 효과 */}
                                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/40 rounded-full blur-3xl" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* 섹션 2: Features (세이지) */}
            <div
                className="flex-[30] px-6 lg:px-8 flex items-center border-t-2 border-gray-400/30"
                style={{
                    background: '#D0DCD0',
                }}
            >
                <div className="container mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8"
                    >
                        {FEATURES.map((feature, idx) => (
                            <motion.div
                                key={feature.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className="flex flex-col items-center text-center group"
                            >
                                {/* 아이콘 */}
                                <div className="w-10 h-10 md:w-12 md:h-12 mb-2 relative text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                    <Image
                                        src={feature.icon}
                                        alt={feature.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                {/* 한글 타이틀 */}
                                <h3
                                    className="text-base md:text-lg font-bold text-gray-900 mb-0.5"
                                    style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                                >
                                    {feature.title}
                                </h3>

                                {/* 영문 타이틀 */}
                                <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                    {feature.titleEn}
                                </div>

                                {/* 설명 */}
                                <p className="text-gray-600 text-xs md:text-sm leading-relaxed max-w-[180px] break-keep hidden md:block">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* 섹션 3: Specs (민트) */}
            <div
                className="flex-[25] px-6 lg:px-8 flex items-center border-t-2 border-gray-400/30"
                style={{
                    background: '#B8D8C8',
                }}
            >
                <div className="container mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6"
                    >
                        {SPECS.map((spec, idx) => (
                            <motion.div
                                key={spec.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="flex flex-col items-center text-center group"
                            >
                                {/* 아이콘 */}
                                <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mb-1 relative text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                    <Image
                                        src={spec.icon}
                                        alt={spec.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                {/* 한글 타이틀 */}
                                <h3
                                    className="text-sm md:text-base font-bold text-gray-900 mb-0.5"
                                    style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                                >
                                    {spec.title}
                                </h3>

                                {/* 영문 타이틀 */}
                                <div className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                    {spec.titleEn}
                                </div>

                                {/* 설명 */}
                                <p className="text-gray-500 text-[11px] md:text-xs leading-relaxed max-w-[160px] break-keep hidden md:block">
                                    {spec.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

        </section>
    );
}
