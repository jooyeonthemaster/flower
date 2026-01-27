'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const FEATURES = [
    {
        id: 1,
        title: '친환경적',
        desc: '실제 꽃을 사용하지 않아 환경을 보호하며, 지속 가능한 기념 방식입니다.',
        icon: '/assets/hologram-sprout.png'
    },
    {
        id: 2,
        title: '영구 보존',
        desc: '홀로그램 기술로 구현되어 시들지 않고 영원히 아름다움을 유지합니다.',
        icon: '/assets/hologram-diamond.png'
    },
    {
        id: 3,
        title: '맞춤 설정',
        desc: '개인의 취향과 의미에 맞춰 색상, 형태, 메시지를 자유롭게 설정할 수 있습니다.',
        icon: '/assets/hologram-gear.png'
    },
    {
        id: 4,
        title: '즉시 설치',
        desc: '복잡한 준비 과정 없이 즉시 설치하고 바로 사용할 수 있습니다.',
        icon: '/assets/hologram-bolt.png'
    }
];

const SPECS = [
    { label: '해상도', value: '8K UHD' },
    { label: '재생시간', value: '72시간' },
    { label: '제어방식', value: '무선' },
    { label: '설치시간', value: '5분' },
];

export default function WhyChoose() {
    return (
        <section className="w-full h-full flex items-center justify-center text-gray-900 overflow-hidden relative">
            <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-10 h-full flex flex-col justify-center max-h-[90vh]">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-8 lg:mb-10 flex-none"
                >
                    <span className="text-[#E66B33] font-bold tracking-wider text-sm uppercase mb-1 block">WHY CHOOSE US</span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                        왜 Digital Hologram<br />
                        <span className="text-gray-900">화환을 선택해야 할까요?</span>
                    </h2>
                    <p className="mt-4 text-base text-gray-600 max-w-2xl">
                        전통적인 화환의 한계를 뛰어넘는 혁신적인 기술로,<br className="hidden md:block" />
                        더욱 특별하고 의미있는 기념의 순간을 만들어드립니다.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 flex-1 min-h-0">
                    {/* Left: 2x2 Feature Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 overflow-y-auto pr-2 custom-scrollbar lg:overflow-visible">
                        {FEATURES.map((feature, idx) => (
                            <motion.div
                                key={feature.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                className="bg-gray-50 p-5 rounded-xl border border-gray-100 hover:shadow-lg hover:bg-white hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="relative w-14 h-14 mb-4 group-hover:scale-110 transition-transform duration-500">
                                    <Image
                                        src={feature.icon}
                                        alt={feature.title}
                                        fill
                                        className="object-contain"
                                        style={{ mixBlendMode: 'multiply' }}
                                    />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right: Technical Visuals */}
                    <div className="flex flex-col gap-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="flex-1 bg-blue-50 rounded-2xl flex items-center justify-center min-h-[300px] border border-blue-100 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-50" />
                            <div className="relative z-10 text-center">
                                <span className="w-20 h-20 bg-[#E66B33] text-white font-bold text-2xl flex items-center justify-center rounded-2xl shadow-xl mb-4 mx-auto rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                    DH
                                </span>
                                <p className="font-bold text-gray-700">Digital Hologram Technology</p>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-4">
                            {SPECS.map((spec, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 + (idx * 0.1) }}
                                    className="bg-white border border-gray-200 p-4 rounded-xl text-center shadow-sm hover:border-[#E66B33] transition-colors"
                                >
                                    <p className="text-xs text-gray-500 mb-1">{spec.label}</p>
                                    <p className="text-lg font-bold text-gray-900">{spec.value}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
