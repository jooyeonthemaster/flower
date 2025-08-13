'use client'

export default function TestimonialSection() {
  const testimonials = [
    {
      name: "김민수",
      role: "기업 대표",
      company: "테크놀로지 그룹",
      review: "회사 창립 기념식에 사용했는데, 참석자들이 모두 감탄했습니다. 전통적인 화환과는 완전히 다른 차원의 경험이었어요.",
      rating: 5
    },
    {
      name: "이지영", 
      role: "이벤트 플래너",
      company: "프리미엄 이벤츠",
      review: "고객들에게 제안할 때마다 큰 호응을 얻고 있습니다. 특히 친환경적인 측면과 독창성이 가장 큰 장점인 것 같아요.",
      rating: 5
    },
    {
      name: "박준혁",
      role: "병원 원장",
      company: "서울대학교병원",
      review: "개원 기념으로 주문했는데, 화환의 품격이 정말 달랐습니다. 환자분들도 신기해하시고 화제가 되었어요.",
      rating: 5
    }
  ]

  return (
    <section className="py-24 bg-white">
      {/* 상단 구분선 */}
      <div className="border-t-2 border-gray-200"></div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-gray-50 text-gray-800 text-sm font-bold tracking-wider uppercase border-2 border-gray-300">
              CUSTOMER TESTIMONIALS
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            고객들의 <span className="text-blue-600">생생한 후기</span>
          </h2>
          
          <div className="w-16 h-0.5 bg-blue-600 mx-auto mb-8"></div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            실제 기업 고객분들이 경험한 Digital Hologram Wreaths의 전문성을 확인해보세요
          </p>
        </div>

        {/* 후기 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-8 border-2 border-gray-200 hover:border-blue-600 transition-colors duration-300 group"
            >
              <div className="space-y-6">
                {/* 별점 */}
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-4 h-4 bg-blue-600 border border-blue-700"
                    ></div>
                  ))}
                </div>

                {/* 후기 내용 */}
                <p className="text-gray-700 leading-relaxed font-medium">
                  &quot;{testimonial.review}&quot;
                </p>

                {/* 구분선 */}
                <div className="h-0.5 bg-gray-300"></div>

                {/* 고객 정보 */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 border-2 border-blue-700 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 font-medium">{testimonial.role}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 통계 */}
        <div className="mt-16 pt-16 border-t-2 border-gray-200">
          <div className="bg-gray-900 p-12 border-2 border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "500+", label: "만족한 기업 고객" },
                { number: "98%", label: "재주문율" },
                { number: "24/7", label: "전문 기술 지원" },
                { number: "5년", label: "품질 보증 기간" }
              ].map((stat, index) => (
                <div key={index} className="space-y-3">
                  <div className="text-3xl font-bold text-white">{stat.number}</div>
                  <div className="h-0.5 bg-blue-600 mx-auto w-12"></div>
                  <div className="text-sm text-gray-300 uppercase tracking-wider font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 