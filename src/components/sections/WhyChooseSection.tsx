'use client'

export default function WhyChooseSection() {
  const features = [
    {
      icon: "🌱",
      title: "친환경적",
      description: "실제 꽃을 사용하지 않아 환경을 보호하며, 지속 가능한 기념 방식입니다."
    },
    {
      icon: "💎",
      title: "영구 보존",
      description: "홀로그램 기술로 구현되어 시들지 않고 영원히 아름다움을 유지합니다."
    },
    {
      icon: "⚙️",
      title: "맞춤 설정",
      description: "개인의 취향과 의미에 맞춰 색상, 형태, 메시지를 자유롭게 설정할 수 있습니다."
    },
    {
      icon: "⚡",
      title: "즉시 설치",
      description: "복잡한 준비 과정 없이 즉시 설치하고 바로 사용할 수 있습니다."
    }
  ]

  return (
    <section className="py-24 bg-gray-50">
      {/* 상단 구분선 */}
      <div className="border-t-2 border-gray-200"></div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* 왼쪽: 텍스트 콘텐츠 */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="px-4 py-2 bg-white text-gray-800 text-sm font-bold tracking-wider uppercase border-2 border-gray-300">
                  WHY CHOOSE US
                </span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
                왜 <span className="text-orange">Digital Hologram</span><br />
                화환을 선택해야 할까요?
              </h2>
              
              <div className="w-16 h-0.5 bg-orange"></div>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                전통적인 화환의 한계를 뛰어넘는 혁신적인 기술로,<br />
                더욱 특별하고 의미있는 기념의 순간을 만들어드립니다.
              </p>
            </div>

            {/* 특징 리스트 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-6 border-2 border-gray-200 hover:border-orange transition-colors duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-xl border border-gray-300">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 오른쪽: 시각적 요소 */}
          <div className="relative">
            <div className="bg-white p-12 border-2 border-gray-200">
              {/* 배경 이미지 영역 */}
              <div className="relative h-80 bg-gray-100 border-2 border-gray-300 mb-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange/10 to-orange/20 opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <div className="w-24 h-24 mx-auto bg-orange border-4 border-white flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-2xl">DH</span>
                    </div>
                    <p className="text-sm">기술 이미지</p>
                    <p className="text-xs text-gray-500 mt-1">/images/features/hologram-tech.jpg</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    혁신적인 홀로그램 기술
                  </h3>
                  <p className="text-gray-600">
                    8K 해상도의 초고화질 디스플레이로<br />
                    생생한 홀로그램을 구현합니다
                  </p>
                </div>
                
                {/* 기술 스펙 */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "해상도", value: "8K UHD" },
                    { label: "재생시간", value: "72시간" },
                    { label: "제어방식", value: "무선" },
                    { label: "설치시간", value: "5분" }
                  ].map((spec, index) => (
                    <div key={index} className="bg-gray-50 p-4 text-center border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{spec.label}</div>
                      <div className="font-bold text-gray-900">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 