import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  const currentDate = new Date().toLocaleDateString('ko-KR');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* 헤더 섹션 */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                이용약관
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                디지털화환 서비스 이용에 관한 약관입니다.
              </p>
            </div>
          </div>
        </section>

        {/* 이용약관 내용 */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
            
            {/* 기본 정보 */}
            <div className="mb-12 p-6 bg-blue-50 rounded-lg">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">이용약관 개요</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">회사명:</span> 디지털화환
                </div>
                <div>
                  <span className="font-semibold">대표자:</span> 조지형
                </div>
                <div>
                  <span className="font-semibold">사업자등록번호:</span> 411-39-01174
                </div>
                <div>
                  <span className="font-semibold">시행일자:</span> 2024년 06월 17일
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              
              {/* 제1조 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">제1조 (목적)</h3>
                <p className="text-gray-700 leading-relaxed">
                  이 약관은 디지털화환(이하 &quot;회사&quot;)이 제공하는 디지털 홀로그램 화환 서비스(이하 &quot;서비스&quot;)의 
                  이용과 관련하여 회사와 이용자간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>
              </div>

              {/* 제2조 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">제2조 (용어의 정의)</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-3 text-gray-700">
                    <li><strong>1. &quot;서비스&quot;</strong>란 회사가 제공하는 디지털 홀로그램 화환 제품 및 관련 서비스를 의미합니다.</li>
                    <li><strong>2. &quot;이용자&quot;</strong>란 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
                    <li><strong>3. &quot;회원&quot;</strong>이라 함은 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며, 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
                    <li><strong>4. &quot;비회원&quot;</strong>이라 함은 회원에 가입하지 않고 회사가 제공하는 서비스를 이용하는 자를 말합니다.</li>
                  </ul>
                </div>
              </div>

              {/* 제3조 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">제3조 (서비스의 제공)</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  회사는 다음과 같은 서비스를 제공합니다:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                  <li>디지털 홀로그램 화환 제품 판매 및 대여</li>
                  <li>제품 배송 및 설치 서비스</li>
                  <li>기술 지원 및 A/S 서비스</li>
                  <li>맞춤 콘텐츠 제작 서비스</li>
                  <li>기타 회사가 정하는 서비스</li>
                </ul>
              </div>

              {/* 제4조 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">제4조 (서비스 이용계약의 성립)</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  서비스 이용계약은 이용자의 이용신청에 대한 회사의 승낙으로 성립됩니다.
                </p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">계약 성립 절차:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>이용자의 서비스 이용 신청</li>
                    <li>회사의 신청 내용 검토</li>
                    <li>회사의 승낙 및 계약 성립 통지</li>
                    <li>결제 및 서비스 제공 시작</li>
                  </ol>
                </div>
              </div>

              {/* 제5조 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">제5조 (서비스의 중단)</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  회사는 다음의 경우에 서비스 제공을 중단할 수 있습니다:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>정기점검, 보수, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우</li>
                  <li>전기통신사업법에 규정된 기간통신사업자가 전기통신 서비스를 중지했을 경우</li>
                  <li>국가비상사태, 정전, 천재지변 등의 불가항력적 사유가 있는 경우</li>
                  <li>기타 중대한 사유로 인하여 회사가 서비스 제공을 지속하는 것이 부적당하다고 인정하는 경우</li>
                </ul>
              </div>

              {/* 제6조 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">제6조 (이용자의 의무)</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  이용자는 다음 사항을 준수해야 합니다:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">금지 사항</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      <li>제품의 임의 분해 또는 개조</li>
                      <li>저작권 침해 콘텐츠 사용</li>
                      <li>타인의 개인정보 도용</li>
                      <li>서비스 운영 방해 행위</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">준수 사항</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      <li>제품 사용법 준수</li>
                      <li>정기 점검 협조</li>
                      <li>안전 수칙 준수</li>
                      <li>적절한 사용 환경 유지</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 제7조 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">제7조 (손해배상)</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  회사 또는 이용자는 상대방의 귀책사유로 인하여 손해가 발생한 경우 손해배상을 청구할 수 있습니다. 
                  다만, 회사는 무료 서비스의 장애, 제3자가 제공하는 서비스의 장애, 천재지변 등 불가항력으로 인한 서비스 중단에 대해서는 책임지지 않습니다.
                </p>
              </div>

              {/* 제8조 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">제8조 (분쟁의 해결)</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  서비스 이용과 관련하여 회사와 이용자 사이에 분쟁이 발생한 경우, 
                  회사와 이용자는 분쟁의 해결을 위해 성실히 협의합니다. 
                  협의에도 불구하고 분쟁이 해결되지 않을 경우에는 민사소송법상의 관할법원에 소를 제기할 수 있습니다.
                </p>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-gray-700">
                    <strong>관할법원:</strong> 서울중앙지방법원<br/>
                    <strong>준거법:</strong> 대한민국 법률
                  </p>
                </div>
              </div>

              {/* 부칙 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">부칙</h3>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-gray-700">
                    <strong>시행일자:</strong> 2024년 06월 17일<br/>
                    <strong>최종 수정일:</strong> {currentDate}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    본 약관은 시행일자부터 적용되며, 약관의 변경이 있을 경우 
                    변경된 약관은 그 적용일자 7일 이전부터 공지합니다.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 연락처 섹션 */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
            <h2 className="text-3xl font-bold mb-6">약관 관련 문의</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              이용약관에 대한 문의사항이 있으시면 언제든지 연락주세요.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="tel:02-336-0250"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                02-336-0250
              </a>
              <a
                href="mailto:baikal86@naver.com"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                baikal86@naver.com
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
