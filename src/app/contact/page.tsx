'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ContactPage() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    inquiryType: '일반문의',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const inquiryTypes = [
    '일반문의',
    '제품문의',
    '기술지원',
    '파트너십',
    '기타'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const loadingToast = toast.loading('문의를 접수하고 있습니다...');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user?.uid,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '문의 접수에 실패했습니다.');
      }

      toast.success('문의가 성공적으로 접수되었습니다. 빠른 시간 내에 연락드리겠습니다.', {
        id: loadingToast,
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        inquiryType: '일반문의',
        message: ''
      });
    } catch (error) {
      console.error('문의 접수 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '문의 접수 중 오류가 발생했습니다.';
      toast.error(errorMessage, {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* 헤더 섹션 */}
        <section className="bg-cream py-20 border-b-4 border-orange">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black">
                상담 문의
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                디지털화환에 대한 궁금한 점이나 상담이 필요하시면 언제든지 연락주세요.
                전문 상담사가 친절하게 안내해드리겠습니다.
              </p>
            </div>
          </div>
        </section>

        {/* 연락처 정보 섹션 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              
              {/* 전화 상담 */}
              <div className="text-center p-8 bg-gray-50 rounded-2xl">
                <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">전화 상담</h3>
                <p className="text-gray-600 mb-4">평일 09:00 - 18:00</p>
                <p className="text-2xl font-bold text-orange">02-336-0250</p>
              </div>

              {/* 이메일 문의 */}
              <div className="text-center p-8 bg-gray-50 rounded-2xl">
                <div className="w-16 h-16 bg-dusty-rose/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-dusty-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">이메일 문의</h3>
                <p className="text-gray-600 mb-4">24시간 접수 가능</p>
                <p className="text-lg font-semibold text-dusty-rose">baikal86@naver.com</p>
              </div>

              {/* 방문 상담 */}
              <div className="text-center p-8 bg-gray-50 rounded-2xl">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">방문 상담</h3>
                <p className="text-gray-600 mb-4">사전 예약 필수</p>
                <p className="text-sm text-green-600">서울시 중구 을지로 지하 220<br/>지하2층 청년창업소누리 A-8호</p>
              </div>
            </div>
          </div>
        </section>

        {/* 문의 폼 섹션 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">온라인 문의</h2>
              <p className="text-gray-600">
                아래 양식을 작성해 주시면 빠른 시간 내에 연락드리겠습니다.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      성함 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent"
                      placeholder="홍길동"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      이메일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      연락처
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent"
                      placeholder="010-0000-0000"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      회사명
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent"
                      placeholder="회사명을 입력해주세요"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
                    문의 유형 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent"
                  >
                    {inquiryTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    문의 내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent resize-none"
                    placeholder="문의하실 내용을 자세히 작성해 주세요."
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-orange hover:bg-[#d15a1f] text-white font-semibold rounded-full hover:shadow-xl hover-lift transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        문의 접수 중...
                      </div>
                    ) : (
                      '문의 접수하기'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* 추가 정보 섹션 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* 운영 시간 */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">운영 시간</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">평일</span>
                    <span className="font-semibold">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">토요일</span>
                    <span className="font-semibold">09:00 - 15:00</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">일요일 및 공휴일</span>
                    <span className="text-red-500 font-semibold">휴무</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  * 긴급 상황 시에는 이메일로 연락 주시면 최대한 빠르게 응답드리겠습니다.
                </p>
              </div>

              {/* 자주 묻는 질문 */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">자주 묻는 질문</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Q. 제품 설치는 어떻게 진행되나요?</h4>
                    <p className="text-gray-600 text-sm">전문 기술진이 직접 방문하여 설치 및 설정을 도와드립니다.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Q. A/S 기간은 얼마나 되나요?</h4>
                    <p className="text-gray-600 text-sm">제품 구매 후 1년간 무상 A/S를 제공합니다.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Q. 견적 문의는 어떻게 하나요?</h4>
                    <p className="text-gray-600 text-sm">위 문의 폼을 통해 상세한 요구사항을 알려주시면 맞춤 견적을 제공해드립니다.</p>
                  </div>
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

