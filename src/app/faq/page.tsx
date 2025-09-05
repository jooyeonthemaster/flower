'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const categories = ['전체', '제품', '설치', '결제', '배송', 'A/S'];

  const faqItems: FAQItem[] = [
    {
      category: '제품',
      question: '디지털화환은 어떤 원리로 작동하나요?',
      answer: '홀로그램 프로젝터를 이용하여 3차원 입체 영상을 공중에 투사하는 방식입니다. 특수한 투명 스크린과 고해상도 프로젝터를 통해 실제 화환처럼 보이는 입체적인 이미지를 구현합니다.'
    },
    {
      category: '제품',
      question: '블루 타입과 레드 타입의 차이점은 무엇인가요?',
      answer: '블루 타입은 차분하고 엄숙한 분위기의 조문용으로 적합하며, 레드 타입은 화려하고 축하의 의미를 담은 경축용으로 적합합니다. 기술적 사양은 동일하고 색상과 애니메이션 효과만 다릅니다.'
    },
    {
      category: '제품',
      question: '전력 소비량은 얼마나 되나요?',
      answer: '기본형은 약 200W, 프리미엄형은 약 300W의 전력을 소비합니다. 일반 가정용 전자제품과 비슷한 수준으로 경제적입니다.'
    },
    {
      category: '설치',
      question: '설치에 얼마나 시간이 걸리나요?',
      answer: '현장 조사부터 설치 완료까지 보통 2-3시간 정도 소요됩니다. 복잡한 환경이나 맞춤 설정이 필요한 경우 추가 시간이 필요할 수 있습니다.'
    },
    {
      category: '설치',
      question: '실내에서만 사용 가능한가요?',
      answer: '기본적으로 실내 사용을 권장하지만, 특수 제작된 야외용 모델도 있습니다. 야외 설치 시 방수, 방진 처리된 전용 하우징이 필요합니다.'
    },
    {
      category: '설치',
      question: '어떤 공간에 설치할 수 있나요?',
      answer: '최소 2m × 2m × 3m의 공간이 필요하며, 평평하고 안정적인 바닥, 220V 전원, 인터넷 연결이 가능한 곳이면 설치 가능합니다.'
    },
    {
      category: '결제',
      question: '어떤 결제 방법을 지원하나요?',
      answer: '신용카드, 계좌이체, 무통장입금을 지원합니다. 포트원 결제 시스템을 통해 안전하게 결제하실 수 있습니다.'
    },
    {
      category: '결제',
      question: '할부 결제가 가능한가요?',
      answer: '신용카드를 통한 할부 결제가 가능합니다. 2개월부터 24개월까지 할부 옵션을 선택하실 수 있습니다.'
    },
    {
      category: '배송',
      question: '배송 기간은 얼마나 걸리나요?',
      answer: '주문 확인 후 3-5일 내에 배송 및 설치가 완료됩니다. 서울/경기 지역은 더 빠른 배송이 가능합니다.'
    },
    {
      category: '배송',
      question: '배송비는 얼마인가요?',
      answer: '서울/경기 지역은 무료 배송이며, 수도권 인근은 5만원, 기타 지역은 별도 협의를 통해 배송비가 결정됩니다.'
    },
    {
      category: 'A/S',
      question: 'A/S 기간은 얼마나 되나요?',
      answer: '제품 구매 후 1년간 무상 A/S를 제공합니다. 연장 보증 서비스를 통해 추가 1-2년 연장도 가능합니다.'
    },
    {
      category: 'A/S',
      question: '고장 시 어떻게 연락하나요?',
      answer: '24시간 기술 지원 핫라인(02-336-0250)으로 연락주시거나, 이메일(baikal86@naver.com)로 문의하실 수 있습니다.'
    }
  ];

  const filteredFAQs = selectedCategory === '전체' 
    ? faqItems 
    : faqItems.filter(item => item.category === selectedCategory);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* 헤더 섹션 */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                자주 묻는 질문
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                디지털화환에 대해 고객들이 자주 묻는 질문들을 모았습니다.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ 섹션 */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
            
            {/* 카테고리 필터 */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQ 아이템들 */}
            <div className="space-y-4">
              {filteredFAQs.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                        {item.category}
                      </span>
                      <h3 className="font-semibold text-gray-900">{item.question}</h3>
                    </div>
                    <svg 
                      className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                        openItems.includes(index) ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {openItems.includes(index) && (
                    <div className="px-6 pb-4">
                      <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                        <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 추가 문의 */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-semibold mb-4">원하는 답변을 찾지 못하셨나요?</h3>
                <p className="text-blue-100 mb-6">
                  전문 상담사가 직접 답변해드리겠습니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
                  >
                    온라인 문의하기
                  </a>
                  <a
                    href="tel:02-336-0250"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    전화 상담
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
