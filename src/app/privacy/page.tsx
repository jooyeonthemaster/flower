import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
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
                개인정보처리방침
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                디지털화환은 고객의 개인정보를 소중히 여기며, 관련 법령에 따라 안전하게 보호하고 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* 개인정보처리방침 내용 */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
            
            {/* 기본 정보 */}
            <div className="mb-12 p-6 bg-blue-50 rounded-lg">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">개인정보처리방침 개요</h2>
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
                <h3 className="text-xl font-bold text-gray-900 mb-4">제1조 (개인정보의 처리목적)</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  디지털화환(이하 &quot;회사&quot;)은 다음의 목적을 위하여 개인정보를 처리합니다. 
                  처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 
                  이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산</li>
                  <li>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리</li>
                  <li>제품 또는 서비스 배송, 설치 및 A/S 서비스 제공</li>
                  <li>고객 상담 및 불만처리, 공지사항 전달</li>
                  <li>신규 서비스 개발 및 마케팅·광고에의 활용</li>
                </ul>
              </div>

              {/* 제2조 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">제2조 (개인정보의 처리 및 보유기간)</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 
                  동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>회원가입 및 관리:</strong> 회원 탈퇴 시까지 (단, 관계법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료시까지)</li>
                    <li><strong>재화 또는 서비스 제공:</strong> 재화·서비스 공급완료 및 요금결제·정산 완료시까지</li>
                    <li><strong>고객 상담 및 불만처리:</strong> 상담 완료 후 3년</li>
                    <li><strong>전자상거래법에 따른 기록:</strong> 5년 (계약 또는 청약철회 등에 관한 기록, 대금결제 및 재화 등의 공급에 관한 기록)</li>
                  </ul>
                </div>
              </div>

              {/* 제3조 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">제3조 (처리하는 개인정보의 항목)</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  회사는 다음의 개인정보 항목을 처리하고 있습니다.
                </p>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">필수항목</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>성명, 생년월일, 성별</li>
                      <li>휴대전화번호, 이메일주소</li>
                      <li>주소 (배송지 정보)</li>
                      <li>결제정보 (신용카드번호, 은행계좌정보 등)</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">선택항목</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>회사명, 부서명, 직책</li>
                      <li>추가 연락처 (일반전화번호, 팩스번호)</li>
                      <li>서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 제4조 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">제4조 (개인정보의 제3자 제공)</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  회사는 정보주체의 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 
                  정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">제3자 제공 현황</h4>
                  <p className="text-gray-700">
                    현재 회사는 고객의 개인정보를 제3자에게 제공하고 있지 않습니다. 
                    향후 제3자 제공이 필요한 경우, 사전에 고객의 동의를 받겠습니다.
                  </p>
                </div>
              </div>

              {/* 제5조 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">제5조 (개인정보처리의 위탁)</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">위탁업무 내용</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>결제처리:</strong> 포트원 (결제 대행 서비스)</li>
                    <li><strong>배송업무:</strong> 전문 배송업체 (제품 배송 및 설치)</li>
                    <li><strong>고객상담:</strong> 자체 운영 (고객 문의 및 A/S 접수)</li>
                  </ul>
                </div>
              </div>

              {/* 제6조 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">제6조 (정보주체의 권리·의무 및 행사방법)</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                  <li>개인정보 처리현황 통지요구</li>
                  <li>개인정보 처리정지 요구</li>
                  <li>개인정보의 정정·삭제 요구</li>
                  <li>손해배상 청구</li>
                </ul>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">권리 행사 방법</h4>
                  <p className="text-gray-700">
                    위의 권리 행사는 회사에 대해 서면, 전화, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 
                    회사는 이에 대해 지체없이 조치하겠습니다.
                  </p>
                </div>
              </div>

              {/* 제7조 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">제7조 (개인정보의 안전성 확보조치)</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">기술적 조치</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      <li>개인정보 암호화</li>
                      <li>해킹 등에 대비한 기술적 대책</li>
                      <li>보안프로그램 설치 및 갱신</li>
                      <li>접근통제시스템 설치</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-2">관리적 조치</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      <li>개인정보 취급직원의 최소화</li>
                      <li>정기적인 직원 교육</li>
                      <li>개인정보 보호책임자 지정</li>
                      <li>내부관리계획 수립 및 시행</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 제8조 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">제8조 (개인정보 보호책임자)</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 
                  피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">개인정보 보호책임자</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li><span className="font-medium">성명:</span> 조지형</li>
                        <li><span className="font-medium">직책:</span> 대표이사</li>
                        <li><span className="font-medium">연락처:</span> 02-336-0250</li>
                        <li><span className="font-medium">이메일:</span> baikal86@naver.com</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">개인정보 보호담당부서</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li><span className="font-medium">부서명:</span> 고객지원팀</li>
                        <li><span className="font-medium">담당자:</span> 조지형</li>
                        <li><span className="font-medium">연락처:</span> 02-336-0250</li>
                        <li><span className="font-medium">이메일:</span> baikal86@naver.com</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 제9조 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">제9조 (권익침해 구제방법)</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  정보주체는 아래의 기관에 대해 개인정보 침해에 대한 신고나 상담을 하실 수 있습니다.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <h4 className="font-semibold text-blue-800 mb-2">개인정보보호위원회</h4>
                    <p className="text-sm text-gray-700">privacy.go.kr</p>
                    <p className="text-sm text-gray-700">국번없이 182</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <h4 className="font-semibold text-green-800 mb-2">개인정보 침해신고센터</h4>
                    <p className="text-sm text-gray-700">privacy.kisa.or.kr</p>
                    <p className="text-sm text-gray-700">국번없이 118</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <h4 className="font-semibold text-purple-800 mb-2">대검찰청 사이버범죄수사단</h4>
                    <p className="text-sm text-gray-700">spo.go.kr</p>
                    <p className="text-sm text-gray-700">국번없이 1301</p>
                  </div>
                </div>
              </div>

              {/* 제10조 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">제10조 (개인정보처리방침 변경)</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 
                  변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
                </p>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-gray-700">
                    <strong>시행일자:</strong> 2024년 06월 17일<br/>
                    <strong>최종 수정일:</strong> {currentDate}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 연락처 섹션 */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
            <h2 className="text-3xl font-bold mb-6">개인정보 관련 문의</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              개인정보 처리에 관한 문의사항이 있으시면 언제든지 연락주세요.
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

