import Image from 'next/image'

interface ColorStepProps {
  selectedColor: 'blue' | 'red'
  onColorSelect: (color: 'blue' | 'red') => void
}

export default function ColorStep({ selectedColor, onColorSelect }: ColorStepProps) {
  const productInfo = {
    colorOptions: {
      blue: { name: "블루 타입", desc: "신뢰와 안정감을 상징하는 블루 컬러" },
      red: { name: "레드 타입", desc: "열정과 에너지를 상징하는 레드 컬러" }
    }
  }

  const currentColor = productInfo.colorOptions[selectedColor]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center animate-fade-in">
      {/* 제품 이미지 */}
      <div className="lg:col-span-1">
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-2xl p-8 rounded-3xl">
          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 overflow-hidden rounded-2xl relative">
            <Image
              src={`/images/products/hologram-wreath-${selectedColor}.jpg`}
              alt={`${currentColor.name} 홀로그램 화환`}
              fill
              className="object-contain transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* 색상 선택 */}
      <div className="lg:col-span-2">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {Object.entries(productInfo.colorOptions).map(([color, option]) => (
              <button
                key={color}
                onClick={() => onColorSelect(color as 'blue' | 'red')}
                className={`group p-8 border-2 rounded-3xl text-center transition-all duration-500 transform hover:scale-105 ${
                  selectedColor === color
                    ? color === 'blue'
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl shadow-blue-500/25'
                      : 'border-red-500 bg-gradient-to-br from-red-50 to-red-100 shadow-2xl shadow-red-500/25'
                    : 'border-gray-200 bg-white/50 backdrop-blur-sm hover:border-gray-300 hover:shadow-xl'
                }`}
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl border-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                  color === 'blue' 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-800 border-blue-700 shadow-lg shadow-blue-500/50' 
                    : 'bg-gradient-to-br from-red-600 to-red-800 border-red-700 shadow-lg shadow-red-500/50'
                }`}>
                  <span className="text-2xl text-white">
                    {color === 'blue' ? '💙' : '❤️'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">{option.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
