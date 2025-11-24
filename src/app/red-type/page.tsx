import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PaymentButton from '@/components/payment/PaymentButton';

export default function RedTypePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* 헤더 섹션 */}
        <section className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                레드 타입 홀로그램 화환
              </h1>
              <p className="text-xl text-red-100 max-w-3xl mx-auto">
                화려하고 생동감 있는 레드 계열의 홀로그램 화환으로 축하와 경축의 의미를 전달하세요.
              </p>
            </div>
          </div>
        </section>

        {/* 제품 이미지 및 개요 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl p-8 h-96 flex items-center justify-center relative">
                  <Image
                    src="/images/products/hologram-wreath-red.jpg"
                    alt="레드 타입 홀로그램 화환"
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">레드 타입 홀로그램 화환</h2>
                <p className="text-gray-600 leading-relaxed">
                  레드 타입 홀로그램 화환은 생동감 있고 화려한 레드 계열의 색상으로 구성되어 있어 
                  축하와 경축의 의미를 담은 특별한 순간을 더욱 빛나게 만들어줍니다.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>화려하고 생동감 있는 레드 계열 디자인</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>축하 및 경축용 특별 애니메이션</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>고휘도 디스플레이로 선명한 색감</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>맞춤 메시지 및 로고 삽입 가능</span>
                  </div>
                </div>

                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-red-800 mb-3">가격 정보</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>기본형 (7일 대여)</span>
                      <span className="text-2xl font-bold text-red-600">₩680,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>프리미엄형 (7일 대여)</span>
                      <span className="text-2xl font-bold text-red-600">₩980,000</span>
                    </div>
                  </div>
                </div>

                <PaymentButton 
                  amount={680000}
                  orderName="레드 타입 홀로그램 화환 - 기본형"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 사용 시나리오 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">사용 시나리오</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-red-50 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-red-800 mb-4">축하 행사</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>개업식 및 오픈식</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>승진 및 취임식</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>기념행사 및 시상식</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>결혼식 및 돌잔치</span>
                  </li>
                </ul>
              </div>

              <div className="bg-pink-50 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-pink-800 mb-4">특별한 장점</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-pink-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>화려한 시각적 효과</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-pink-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>사진 및 영상 촬영에 최적화</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-pink-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>반영구적 사용 가능</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-pink-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>알레르기 및 냄새 없음</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
