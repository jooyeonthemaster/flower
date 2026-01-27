'use client';

import { motion } from 'framer-motion';

const REVIEWS = [
    {
        id: 1,
        quote: "회사 창립 기념식에 사용했는데, 참석자들이 모두 감탄했습니다. 전통적인 화환과는 완전히 다른 차원의 경험이었어요.",
        author: "김민수",
        role: "기업 대표",
        company: "테크놀로지 그룹",
        rating: 5,
        color: "bg-blue-600"
    },
    {
        id: 2,
        quote: "고객들에게 제안할 때마다 큰 호응을 얻고 있습니다. 특히 친환경적인 측면과 독창성이 가장 큰 장점인 것 같아요.",
        author: "이지영",
        role: "이벤트 플래너",
        company: "프리미엄 이벤츠",
        rating: 5,
        color: "bg-[#E66B33]"
    },
    {
        id: 3,
        quote: "개원 기념으로 주문했는데, 화환의 품격이 정말 달랐습니다. 환자분들도 신기해하시고 화제가 되었어요.",
        author: "박준혁",
        role: "병원 원장",
        company: "서울대학교병원",
        rating: 5,
        color: "bg-purple-600"
    }
];

const STATS = [
    { label: '만족한 기업 고객', value: '500+' },
    { label: '재주문율', value: '98%' },
    { label: '전문 기술 지원', value: '24/7' },
    { label: '품질 보증 기간', value: '5년' }
];

export default function Testimonials() {
    return (
        <section className="w-full h-full flex items-center justify-center text-gray-900 overflow-hidden relative">
            <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-10 flex flex-col justify-center h-full max-h-[90vh]">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-8 lg:mb-10 text-center flex-none"
                >
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-bold mb-3">CUSTOMER TESTIMONIALS</span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                        고객들의 <span className="text-blue-600 relative inline-block">
                            생생한 후기
                            <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100 -z-10 opacity-50"></span>
                        </span>
                    </h2>
                    <p className="mt-2 text-gray-500 text-sm">실제 기업 고객분들이 경험한 Digital Hologram Wreaths의 전문성을 확인해보세요</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12 flex-1 min-h-0 overflow-y-auto custom-scrollbar md:overflow-visible p-2">
                    {REVIEWS.map((review, idx) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.6 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
                        >
                            <div className="mb-4">
                                <div className="flex gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className={`w-5 h-5 ${i < review.rating ? 'bg-blue-500' : 'bg-gray-200'} rounded-sm`} />
                                    ))}
                                </div>
                                <p className="text-gray-700 font-medium leading-relaxed keep-all text-sm">
                                    "{review.quote}"
                                </p>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                <div className={`w-10 h-10 ${review.color} rounded-lg flex items-center justify-center text-white font-bold text-base shadow-md`}>
                                    {review.author[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{review.author} <span className="text-xs font-normal text-gray-500 ml-1">{review.role}</span></p>
                                    <p className="text-xs text-[#E66B33] font-medium">{review.company}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#0a0a0a] rounded-2xl p-6 md:p-8 text-white shadow-xl flex-none"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center divide-x divide-gray-800">
                        {STATS.map((stat, idx) => (
                            <div key={idx} className="flex flex-col gap-1">
                                <span className="text-2xl md:text-3xl md:text-4xl font-black text-white">{stat.value}</span>
                                <span className="text-xs text-gray-400 font-medium">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
