'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Testimonials from '@/components/home/Testimonials';
import { useState } from 'react';

// 전통 화환 vs 홀로그램 비교 데이터
const COMPARISON_DATA = [
    { feature: '지속 기간', traditional: '3-5일 후 시듦', hologram: '영구적 (72시간 연속 재생)' },
    { feature: '환경 영향', traditional: '꽃 폐기물 발생', hologram: '친환경 (폐기물 없음)' },
    { feature: '맞춤화', traditional: '리본 문구 정도', hologram: '메시지, 이미지, 영상 모두 가능' },
    { feature: '재사용', traditional: '불가능', hologram: '무제한 재사용' },
    { feature: '보관', traditional: '물주기, 온도 관리 필요', hologram: '별도 관리 불필요' },
    { feature: '가격 대비', traditional: '일회성 비용', hologram: '장기적으로 경제적' },
    { feature: '시각적 임팩트', traditional: '일반적', hologram: '3D 홀로그램으로 주목도 극대화' },
    { feature: '메시지 전달', traditional: '정적 리본', hologram: '동적 애니메이션 + 다중 메시지' },
];

// 서비스 모드 상세 데이터
const SERVICE_MODES_DETAILED = [
    {
        id: 'standard',
        title: '기본 템플릿',
        subtitle: 'Standard Mode',
        price: '무료',
        priceNote: 'Free',
        color: '#8A9A5B',
        bgColor: 'bg-[#8A9A5B]/10',
        borderColor: 'border-[#8A9A5B]/30',
        icon: '/icon-standard-template.png',
        bestFor: '빠른 제작이 필요하거나, 처음 서비스를 체험해보고 싶은 분',
        features: [
            { label: '제작 시간', value: '5-10분', detail: '템플릿 선택 후 바로 생성' },
            { label: '문구 개수', value: '6개', detail: '제목 + 본문 5개 구성' },
            { label: '템플릿', value: '사전 제작', detail: '웨딩/개업/행사별 최적화 디자인' },
            { label: '배경', value: '고정 템플릿', detail: '검증된 디자인 사용' },
            { label: '스타일 옵션', value: '2가지', detail: '심플 / 화려하게' },
            { label: '영상 길이', value: '30초', detail: '핵심 메시지 전달에 최적화' },
        ],
        useCases: [
            '급하게 화환이 필요한 경우',
            '홀로그램 화환을 처음 경험해보는 경우',
            '예산을 최소화하고 싶은 경우',
            '간단한 축하 메시지 전달',
        ],
        description: '검증된 템플릿을 활용하여 빠르고 안정적으로 홀로그램 영상을 제작합니다. 별도 비용 없이 서비스를 체험해볼 수 있습니다.',
        cta: '무료로 시작하기',
    },
    {
        id: 'premium',
        title: 'AI 프리미엄',
        subtitle: 'Premium Mode',
        price: '100,000원',
        priceNote: '1회 제작',
        color: '#E66B33',
        bgColor: 'bg-[#E66B33]/10',
        borderColor: 'border-[#E66B33]/30',
        icon: '/icon-premium-ai.png',
        bestFor: '특별한 날, 차별화된 고급스러운 결과물을 원하는 분',
        features: [
            { label: '제작 시간', value: '10-15분', detail: 'AI 이미지 생성 포함' },
            { label: '문구 개수', value: '3개', detail: '임팩트 있는 핵심 메시지' },
            { label: '배경 이미지', value: 'AI 생성', detail: '입력 정보 기반 맞춤 이미지' },
            { label: '커스터마이징', value: '완전 맞춤형', detail: '모든 요소 개인화 가능' },
            { label: '이미지 품질', value: '고해상도', detail: 'AI가 생성한 유니크한 아트' },
            { label: '영상 길이', value: '45초', detail: '스토리텔링 가능한 구성' },
        ],
        useCases: [
            '결혼식, VIP 고객 이벤트 등 중요한 행사',
            '기업 브랜딩이 필요한 공식 행사',
            '받는 분께 특별한 감동을 드리고 싶은 경우',
            '세상에 단 하나뿐인 유니크한 화환을 원하는 경우',
        ],
        description: 'Google Gemini AI가 입력된 정보를 분석하여 세상에 단 하나뿐인 배경 이미지를 생성합니다. 더욱 특별하고 고급스러운 결과물을 제공합니다.',
        cta: '프리미엄 시작하기',
        popular: true,
    },
];

// 이벤트 카테고리 상세 데이터
const EVENT_CATEGORIES_DETAILED = [
    {
        id: 'wedding',
        title: '웨딩',
        subtitle: 'Wedding Celebration',
        description: '인생에서 가장 특별한 순간을 더욱 빛나게 만들어 드립니다.',
        image: '/wedding.jpg',
        longDescription: '결혼식장 입구, 포토존, 피로연장 등 다양한 공간에서 활용 가능합니다. 신랑신부의 이름과 축하 메시지가 아름다운 홀로그램으로 재탄생하여, 하객들에게 잊지 못할 인상을 남깁니다.',
        features: [
            { title: '맞춤 축하 메시지', desc: '축하하는 마음을 담은 개인화된 메시지' },
            { title: '신랑신부 이름 각인', desc: '두 분의 이름이 빛나는 홀로그램으로' },
            { title: '로맨틱한 배경 효과', desc: '꽃잎, 하트, 별빛 등 다양한 효과' },
            { title: '사진 통합 가능', desc: 'AI 프리미엄에서 커플 사진 활용' },
        ],
        templateOptions: ['클래식 화이트', '로맨틱 핑크', '엘레강스 골드', '모던 미니멀'],
        avgBudget: '10-20만원',
    },
    {
        id: 'opening',
        title: '개업',
        subtitle: 'Grand Opening',
        description: '새로운 시작을 축하하는 개업식, 전통 화환과는 차원이 다릅니다.',
        image: '/opening.jpg',
        longDescription: '매장 앞, 로비, 행사장 등에서 눈에 띄는 홀로그램으로 개업의 기쁨을 알립니다. 업체 로고와 브랜드 컬러를 적용하여 전문적인 이미지를 연출할 수 있습니다.',
        features: [
            { title: '업체명 & 로고 표시', desc: '브랜드 아이덴티티 적용 가능' },
            { title: '대박 기원 메시지', desc: '번창을 기원하는 축하 문구' },
            { title: '화려한 축하 효과', desc: '폭죽, 금빛 효과 등 축제 분위기' },
            { title: '보내는 분 정보', desc: '누가 보낸 화환인지 명확히 표시' },
        ],
        templateOptions: ['그랜드 오픈', '병원/의원 개원', '레스토랑 오픈', '오피스 이전'],
        avgBudget: '10-30만원',
    },
    {
        id: 'event',
        title: '행사',
        subtitle: 'Corporate Events',
        description: '기업 행사부터 기념일까지, 다양한 이벤트에 품격을 더합니다.',
        image: '/corporate.jpg',
        longDescription: '창립기념일, 시상식, 컨퍼런스, 전시회 등 기업의 중요한 순간에 홀로그램 화환이 격조를 높여드립니다. 기업 CI/BI를 적용한 맞춤형 제작이 가능합니다.',
        features: [
            { title: '다목적 활용', desc: '기념일, 시상식, 축하 행사 등' },
            { title: '기업 브랜딩 적용', desc: 'CI/BI 컬러와 로고 통합' },
            { title: '맞춤형 메시지', desc: '행사 성격에 맞는 문구 구성' },
            { title: '대량 주문 할인', desc: '기업 고객 특별 프로그램' },
        ],
        templateOptions: ['창립기념', '시상식', '컨퍼런스', '전시회/박람회'],
        avgBudget: '20-50만원',
    },
];

// 가격 상세 데이터
const PRICING_DETAILS = {
    basic: {
        title: '기본 서비스',
        items: [
            { name: '기본 템플릿 제작', price: '무료', note: '횟수 제한 없음' },
            { name: 'AI 프리미엄 제작', price: '100,000원', note: '1회당' },
        ],
    },
    options: {
        title: '추가 옵션',
        items: [
            { name: '급행 제작 (1시간 내)', price: '+30,000원', note: 'AI 프리미엄만' },
            { name: '추가 메시지 삽입', price: '+10,000원', note: '메시지당' },
            { name: '로고/이미지 삽입', price: '+20,000원', note: 'AI 프리미엄만' },
            { name: '영상 길이 연장 (30초)', price: '+15,000원', note: '구간당' },
        ],
    },
    hardware: {
        title: '하드웨어 (선택)',
        items: [
            { name: 'LED 홀로그램 팬 렌탈', price: '50,000원/일', note: '설치비 포함' },
            { name: 'LED 홀로그램 팬 구매', price: '문의', note: '기업 고객 전용' },
            { name: '전국 배송', price: '무료', note: '도서산간 제외' },
            { name: '현장 설치 지원', price: '무료', note: '수도권 기준' },
        ],
    },
};

// FAQ 데이터
const FAQ_DATA = [
    {
        category: '서비스 일반',
        questions: [
            {
                q: '홀로그램 화환은 어떻게 작동하나요?',
                a: 'LED 홀로그램 팬이 고속으로 회전하면서 LED 불빛이 잔상을 만들어 공중에 3D 이미지가 떠있는 것처럼 보이게 합니다. 8K UHD 해상도로 선명한 영상을 제공하며, 72시간 연속 재생이 가능합니다.',
            },
            {
                q: '기본 템플릿과 AI 프리미엄의 차이가 무엇인가요?',
                a: '기본 템플릿은 사전 제작된 디자인을 활용하여 무료로 빠르게 제작할 수 있습니다. AI 프리미엄은 Google Gemini AI가 입력된 정보를 바탕으로 세상에 단 하나뿐인 배경 이미지를 생성하여 더욱 특별한 결과물을 만들어냅니다.',
            },
            {
                q: '제작된 영상은 어떻게 받나요?',
                a: '제작 완료 후 바로 다운로드 링크가 제공됩니다. MP4 형식의 고화질 영상 파일을 받으실 수 있으며, 이메일로도 발송해드립니다.',
            },
        ],
    },
    {
        category: '주문 및 결제',
        questions: [
            {
                q: '주문 후 얼마나 걸리나요?',
                a: '기본 템플릿은 5-10분, AI 프리미엄은 10-15분 내에 제작됩니다. 급행 옵션 선택 시 1시간 이내 완성을 보장합니다.',
            },
            {
                q: '결제 방법은 어떤 것이 있나요?',
                a: '신용카드, 체크카드, 계좌이체, 네이버페이, 카카오페이 등 다양한 결제 수단을 지원합니다. 기업 고객의 경우 세금계산서 발행 및 후불 결제도 가능합니다.',
            },
            {
                q: '환불 정책은 어떻게 되나요?',
                a: '제작 시작 전에는 100% 환불이 가능합니다. 제작 완료 후에는 결과물에 심각한 오류가 있는 경우에 한해 재제작 또는 환불을 진행해드립니다.',
            },
        ],
    },
    {
        category: '설치 및 사용',
        questions: [
            {
                q: '설치 환경에 제한이 있나요?',
                a: '실내/실외 모두 사용 가능하지만, 직사광선이 강한 곳에서는 가시성이 떨어질 수 있습니다. 전원 연결(220V)이 필요하며, Wi-Fi 환경에서 무선 제어가 가능합니다.',
            },
            {
                q: '직접 설치할 수 있나요?',
                a: '네, 매우 간단합니다. 전원 연결 후 USB에 영상을 넣고 재생 버튼만 누르면 됩니다. 평균 5분 이내에 설치가 완료됩니다. 원하시면 전문 기사가 직접 방문 설치해드립니다.',
            },
            {
                q: '렌탈과 구매 중 어떤 것이 좋을까요?',
                a: '일회성 행사라면 렌탈(50,000원/일)이 경제적입니다. 여러 번 사용하거나 상시 전시가 필요한 기업이라면 구매를 권장드립니다. 기업 고객에게는 특별 할인이 적용됩니다.',
            },
        ],
    },
];

// 기술 사양 상세 데이터
const TECH_SPECS_DETAILED = [
    {
        category: '디스플레이',
        specs: [
            { label: '해상도', value: '8K UHD (7680 x 4320)' },
            { label: '색상', value: '16.7M 컬러 (24bit)' },
            { label: '밝기', value: '1800 nits' },
            { label: '시야각', value: '176도' },
        ],
    },
    {
        category: '성능',
        specs: [
            { label: '연속 재생', value: '72시간 이상' },
            { label: '회전 속도', value: '900 RPM' },
            { label: '프레임 레이트', value: '30 FPS' },
            { label: '소비 전력', value: '50W' },
        ],
    },
    {
        category: '연결',
        specs: [
            { label: '무선', value: 'Wi-Fi 6 (802.11ax)' },
            { label: '유선', value: 'USB 3.0' },
            { label: '제어', value: '전용 앱 / 리모컨' },
            { label: '전원', value: 'AC 220V' },
        ],
    },
    {
        category: '물리적 특성',
        specs: [
            { label: '크기', value: '직경 65cm' },
            { label: '무게', value: '2.5kg' },
            { label: '설치', value: '벽걸이 / 스탠드' },
            { label: '방수등급', value: 'IP54 (생활방수)' },
        ],
    },
];

export default function ProductsPage() {
    const [openFaqIndex, setOpenFaqIndex] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState(EVENT_CATEGORIES_DETAILED[0]);

    const toggleFaq = (id: string) => {
        setOpenFaqIndex(openFaqIndex === id ? null : id);
    };

    return (
        <div className="bg-white">
            <Header variant="transparent" />

            <main>
                {/* Section 1: Hero */}
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
                    {/* Background Effects */}
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#E66B33] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 pointer-events-none" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-15 pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[150px] opacity-20 pointer-events-none" />

                    <div className="relative z-10 container mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full border border-[#E66B33]/30 bg-white/50 backdrop-blur-sm text-[#E66B33] text-sm font-bold tracking-wider mb-6">
                                SERVICE GUIDE
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight text-gray-900 mb-6"
                            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                        >
                            서비스
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E66B33] via-pink-500 to-purple-600">
                                상세 안내
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-lg md:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed mb-8"
                        >
                            Digital Hologram Wreaths의 모든 것을 알려드립니다.
                            <br />
                            서비스 선택부터 설치까지, 궁금한 점을 해결하세요.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link
                                href="/ai-hologram"
                                className="group inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-[#0a0a0a] rounded-full hover:bg-[#E66B33] transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                            >
                                바로 시작하기
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link
                                href="#comparison"
                                className="px-10 py-5 text-lg font-bold text-gray-700 bg-white border-2 border-gray-100 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
                            >
                                자세히 알아보기
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* Section 2: Traditional vs Hologram Comparison */}
                <section id="comparison" className="bg-slate-50 py-20 lg:py-32">
                    <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-16"
                        >
                            <span className="text-[#E66B33] font-bold tracking-wider text-sm uppercase mb-2 block">WHY HOLOGRAM?</span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                                전통 화환 vs 홀로그램 화환
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                왜 많은 분들이 홀로그램 화환을 선택하는지 비교해보세요
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100"
                        >
                            {/* Table Header */}
                            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
                                <div className="p-6 text-center font-bold text-gray-500">비교 항목</div>
                                <div className="p-6 text-center font-bold text-gray-400 border-l border-gray-200">전통 화환</div>
                                <div className="p-6 text-center font-bold text-[#E66B33] border-l border-gray-200 bg-[#E66B33]/5">홀로그램 화환</div>
                            </div>

                            {/* Table Body */}
                            {COMPARISON_DATA.map((row, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05, duration: 0.4 }}
                                    className={`grid grid-cols-3 ${idx !== COMPARISON_DATA.length - 1 ? 'border-b border-gray-100' : ''}`}
                                >
                                    <div className="p-5 font-medium text-gray-900 flex items-center">{row.feature}</div>
                                    <div className="p-5 text-gray-500 border-l border-gray-100 flex items-center text-sm">{row.traditional}</div>
                                    <div className="p-5 text-gray-900 border-l border-gray-100 bg-[#E66B33]/5 flex items-center text-sm font-medium">
                                        <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {row.hologram}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Section 3: Service Modes Detailed */}
                <section className="bg-white py-20 lg:py-32">
                    <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-16"
                        >
                            <span className="text-[#E66B33] font-bold tracking-wider text-sm uppercase mb-2 block">SERVICE MODES</span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                                서비스 모드 상세 비교
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                상황과 목적에 맞는 최적의 서비스를 선택하세요
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {SERVICE_MODES_DETAILED.map((mode, idx) => (
                                <motion.div
                                    key={mode.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.2, duration: 0.6 }}
                                    className={`relative bg-white rounded-3xl p-8 border-2 ${mode.borderColor} hover:shadow-2xl transition-all duration-500`}
                                >
                                    {mode.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                            <span className="px-4 py-1.5 bg-[#E66B33] text-white text-xs font-bold rounded-full shadow-lg">
                                                MOST POPULAR
                                            </span>
                                        </div>
                                    )}

                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900">{mode.title}</h3>
                                            <p className="text-sm text-gray-500">{mode.subtitle}</p>
                                        </div>
                                        <div className={`relative w-16 h-16 rounded-2xl ${mode.bgColor} flex items-center justify-center overflow-hidden`}>
                                            <Image src={mode.icon} alt={mode.title} fill className="object-contain p-2" />
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-4 pb-4 border-b border-gray-100">
                                        <span className="text-4xl font-black text-gray-900">{mode.price}</span>
                                        <span className="text-sm text-gray-500 ml-2">{mode.priceNote}</span>
                                    </div>

                                    {/* Best For */}
                                    <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: `${mode.color}10` }}>
                                        <p className="text-sm font-medium" style={{ color: mode.color }}>
                                            <span className="font-bold">추천 대상:</span> {mode.bestFor}
                                        </p>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-3 mb-6">
                                        {mode.features.map((feature, fidx) => (
                                            <div key={fidx} className="flex justify-between items-start py-2 border-b border-gray-50">
                                                <div>
                                                    <span className="text-gray-700 font-medium">{feature.label}</span>
                                                    <p className="text-xs text-gray-400">{feature.detail}</p>
                                                </div>
                                                <span className="font-bold text-gray-900">{feature.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Use Cases */}
                                    <div className="mb-6">
                                        <h4 className="text-sm font-bold text-gray-700 mb-3">이런 경우에 추천해요</h4>
                                        <div className="space-y-2">
                                            {mode.useCases.map((useCase, uidx) => (
                                                <div key={uidx} className="flex items-start gap-2 text-sm text-gray-600">
                                                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: mode.color }} />
                                                    {useCase}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <Link
                                        href="/ai-hologram"
                                        className={`block w-full py-4 rounded-xl font-bold text-center transition-all duration-300 ${mode.popular
                                            ? 'bg-[#E66B33] text-white hover:bg-[#d45a28]'
                                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                            }`}
                                    >
                                        {mode.cta}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section 4: Event Categories Detailed */}
                <section className="bg-slate-50 py-20 lg:py-32">
                    <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-16"
                        >
                            <span className="text-[#E66B33] font-bold tracking-wider text-sm uppercase mb-2 block">EVENT TYPES</span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                                이벤트별 상세 안내
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                각 이벤트에 최적화된 템플릿과 옵션을 확인하세요
                            </p>
                        </motion.div>

                        {/* Category Tabs */}
                        <div className="flex justify-center gap-4 mb-12">
                            {EVENT_CATEGORIES_DETAILED.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${activeCategory.id === cat.id
                                        ? 'bg-[#E66B33] text-white shadow-lg'
                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {cat.title}
                                </button>
                            ))}
                        </div>

                        {/* Category Detail */}
                        <motion.div
                            key={activeCategory.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                {/* Image */}
                                <div className="relative h-64 lg:h-auto min-h-[400px]">
                                    <Image
                                        src={activeCategory.image}
                                        alt={activeCategory.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent lg:bg-gradient-to-t lg:from-black/50 lg:to-transparent" />
                                    <div className="absolute bottom-6 left-6 lg:bottom-8 lg:left-8">
                                        <h3 className="text-3xl lg:text-4xl font-black text-white mb-2">{activeCategory.title}</h3>
                                        <p className="text-white/80">{activeCategory.subtitle}</p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 lg:p-10">
                                    <p className="text-gray-600 mb-8 leading-relaxed">{activeCategory.longDescription}</p>

                                    {/* Features */}
                                    <h4 className="font-bold text-gray-900 mb-4">주요 기능</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                        {activeCategory.features.map((feature, idx) => (
                                            <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                                                <h5 className="font-bold text-gray-900 mb-1">{feature.title}</h5>
                                                <p className="text-sm text-gray-500">{feature.desc}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Template Options */}
                                    <h4 className="font-bold text-gray-900 mb-4">제공 템플릿</h4>
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {activeCategory.templateOptions.map((template, idx) => (
                                            <span key={idx} className="px-4 py-2 bg-[#E66B33]/10 text-[#E66B33] rounded-full text-sm font-medium">
                                                {template}
                                            </span>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                        <div>
                                            <p className="text-sm text-gray-500">평균 예산</p>
                                            <p className="text-2xl font-black text-gray-900">{activeCategory.avgBudget}</p>
                                        </div>
                                        <Link
                                            href="/ai-hologram"
                                            className="px-8 py-4 bg-[#E66B33] text-white font-bold rounded-xl hover:bg-[#d45a28] transition-colors"
                                        >
                                            지금 만들기
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Section 5: Pricing Details */}
                <section className="bg-white py-20 lg:py-32">
                    <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-16"
                        >
                            <span className="text-[#E66B33] font-bold tracking-wider text-sm uppercase mb-2 block">PRICING</span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                                상세 가격 안내
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                투명한 가격 정책으로 예산 계획을 도와드립니다
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {Object.entries(PRICING_DETAILS).map(([key, category], idx) => (
                                <motion.div
                                    key={key}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                                    className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                                >
                                    <h3 className="text-lg font-black text-gray-900 mb-6 pb-4 border-b border-gray-200">
                                        {category.title}
                                    </h3>
                                    <div className="space-y-4">
                                        {category.items.map((item, iidx) => (
                                            <div key={iidx} className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.name}</p>
                                                    <p className="text-xs text-gray-500">{item.note}</p>
                                                </div>
                                                <span className="font-bold text-[#E66B33] whitespace-nowrap ml-4">{item.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Enterprise Note */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-8 p-6 bg-[#E66B33]/5 rounded-2xl border border-[#E66B33]/20 text-center"
                        >
                            <p className="text-gray-700">
                                <span className="font-bold text-[#E66B33]">기업 고객 특별 프로그램:</span>{' '}
                                10개 이상 대량 주문 시 최대 30% 할인 | 연간 계약 시 추가 혜택 제공
                            </p>
                            <Link href="/contact" className="inline-block mt-4 text-[#E66B33] font-bold hover:underline">
                                기업 상담 문의하기 →
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* Section 6: Tech Specs Detailed */}
                <section className="bg-slate-900 text-white py-20 lg:py-32">
                    <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-16"
                        >
                            <span className="text-[#E66B33] font-bold tracking-wider text-sm uppercase mb-2 block">SPECIFICATIONS</span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                                기술 사양
                            </h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                LED 홀로그램 팬의 상세 스펙을 확인하세요
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {TECH_SPECS_DETAILED.map((category, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                                    className="bg-slate-800 rounded-2xl p-6 border border-slate-700"
                                >
                                    <h3 className="text-[#E66B33] font-bold mb-6 pb-4 border-b border-slate-700">
                                        {category.category}
                                    </h3>
                                    <div className="space-y-4">
                                        {category.specs.map((spec, sidx) => (
                                            <div key={sidx} className="flex justify-between">
                                                <span className="text-gray-400 text-sm">{spec.label}</span>
                                                <span className="text-white font-medium text-sm">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section 7.5: Testimonials (Moved from Home) */}
                <Testimonials />

                {/* Section 7: FAQ */}
                <section className="bg-white py-20 lg:py-32">
                    <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-16"
                        >
                            <span className="text-[#E66B33] font-bold tracking-wider text-sm uppercase mb-2 block">FAQ</span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                                자주 묻는 질문
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                궁금한 점이 있으신가요? 여기서 답을 찾아보세요.
                            </p>
                        </motion.div>

                        <div className="space-y-8">
                            {FAQ_DATA.map((category, cidx) => (
                                <div key={cidx}>
                                    <h3 className="text-lg font-bold text-[#E66B33] mb-4">{category.category}</h3>
                                    <div className="space-y-3">
                                        {category.questions.map((faq, fidx) => {
                                            const faqId = `${cidx}-${fidx}`;
                                            const isOpen = openFaqIndex === faqId;
                                            return (
                                                <motion.div
                                                    key={fidx}
                                                    initial={{ opacity: 0 }}
                                                    whileInView={{ opacity: 1 }}
                                                    viewport={{ once: true }}
                                                    className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100"
                                                >
                                                    <button
                                                        onClick={() => toggleFaq(faqId)}
                                                        className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                                                    >
                                                        <span className="font-bold text-gray-900 pr-4">{faq.q}</span>
                                                        <svg
                                                            className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </button>
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            className="px-6 pb-5"
                                                        >
                                                            <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* More Questions */}
                        <div className="mt-12 text-center">
                            <p className="text-gray-600 mb-4">원하는 답을 찾지 못하셨나요?</p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 text-[#E66B33] font-bold hover:gap-3 transition-all"
                            >
                                직접 문의하기
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Section 8: Final CTA */}
                <section className="bg-gradient-to-br from-[#E66B33] to-orange-600 py-20 lg:py-32 text-white relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                    </div>

                    <div className="container mx-auto px-4 lg:px-8 max-w-4xl relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center"
                        >
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                                이제 직접 경험해보세요
                            </h2>
                            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
                                기본 템플릿은 무료입니다.<br />
                                지금 바로 나만의 홀로그램 화환을 만들어보세요.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/ai-hologram"
                                    className="group inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-[#E66B33] bg-white rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                                >
                                    무료로 시작하기
                                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                                <Link
                                    href="/contact"
                                    className="px-10 py-5 text-lg font-bold text-white border-2 border-white/50 rounded-full hover:bg-white/10 transition-all duration-300"
                                >
                                    상담 문의
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Footer */}
                <Footer />
            </main>
        </div>
    );
}
