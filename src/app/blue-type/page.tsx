import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PaymentButton from '@/components/payment/PaymentButton';

export default function BlueTypePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* 헤더 섹션 */}
        <section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                블루 타입 홀로그램 화환
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                차분하고 고급스러운 블루 계열의 홀로그램 화환으로 품격있는 조문 문화를 만들어보세요.
              </p>
            </div>
          </div>
        </section>

        {/* 제품 이미지 및 개요 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-8 h-96 flex items-center justify-center">
                  <img 
                    src="/images/products/hologram-wreath-blue.jpg" 
                    alt="블루 타입 홀로그램 화환"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">블루 타입 홀로그램 화환</h2>
                <p className="text-gray-600 leading-relaxed">
                  블루 타입 홀로그램 화환은 차분하고 우아한 블루 계열의 색상으로 구성되어 있어 
                  엄숙한 분위기에 적합하며, 고인에 대한 깊은 애도와 존경의 마음을 표현할 수 있습니다.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>차분하고 고급스러운 블루 계열 디자인</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>3D 홀로그램 기술로 구현된 입체적 화환</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>24시간 연속 작동 가능</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>친환경 소재 및 에너지 효율적 설계</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">가격 정보</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>기본형 (7일 대여)</span>
                      <span className="text-2xl font-bold text-blue-600">₩580,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>프리미엄형 (7일 대여)</span>
                      <span className="text-2xl font-bold text-blue-600">₩880,000</span>
                    </div>
                  </div>
                </div>

                <PaymentButton 
                  amount={580000}
                  orderName="블루 타입 홀로그램 화환 - 기본형"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 제품 특징 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">제품 특징</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 13h4a2 2 0 012 2v4a2 2 0 01-2 2h-4m-6-6V9a2 2 0 012-2h2m5 0h2a2 2 0 012 2v2m-7 4v2a2 2 0 002 2h2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">고해상도 디스플레이</h3>
                <p className="text-gray-600 text-center">4K 해상도의 선명한 홀로그램 이미지로 생동감 있는 화환을 구현합니다.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">저전력 설계</h3>
                <p className="text-gray-600 text-center">LED 기술을 활용한 저전력 설계로 경제적이고 환경 친화적입니다.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">맞춤 설정</h3>
                <p className="text-gray-600 text-center">고객의 요구에 맞춰 색상, 크기, 애니메이션을 맞춤 설정할 수 있습니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 기술 사양 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">기술 사양</h2>
            
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">디스플레이 사양</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-gray-600">해상도</span>
                      <span className="font-semibold">4K (3840 × 2160)</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">밝기</span>
                      <span className="font-semibold">3000 nits</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">시야각</span>
                      <span className="font-semibold">180°</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">색상 범위</span>
                      <span className="font-semibold">sRGB 100%</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">물리적 사양</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-gray-600">크기</span>
                      <span className="font-semibold">2m × 2m × 3m</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">무게</span>
                      <span className="font-semibold">45kg</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">소비전력</span>
                      <span className="font-semibold">200W</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">작동온도</span>
                      <span className="font-semibold">15°C ~ 30°C</span>
                    </li>
                  </ul>
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
