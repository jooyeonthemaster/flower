interface RentalOption {
  name: string
  price: number
  unit: string
  description: string
  minDays: number
  maxDays: number
  dailyPrice?: number
  note: string
}

interface PeriodStepProps {
  selectedPeriod: 'daily' | 'weekly' | 'monthly'
  onPeriodSelect: (period: 'daily' | 'weekly' | 'monthly') => void
}

export default function PeriodStep({ selectedPeriod, onPeriodSelect }: PeriodStepProps) {
  const productInfo = {
    rentalOptions: {
      daily: {
        name: "일간 렌트",
        price: 120000,
        unit: "일",
        description: "1일 단위 렌트",
        minDays: 1,
        maxDays: 6,
        note: "단기 행사에 최적"
      } as RentalOption,
      weekly: {
        name: "주간 렌트",
        price: 700000,
        unit: "주",
        description: "1주 단위 렌트 (7일)",
        minDays: 7,
        maxDays: 27,
        dailyPrice: 100000,
        note: "중기간 행사에 경제적"
      } as RentalOption,
      monthly: {
        name: "월간 렌트",
        price: 2400000,
        unit: "월",
        description: "1개월 단위 렌트 (30일)",
        minDays: 30,
        maxDays: 365,
        dailyPrice: 80000,
        note: "장기간 이용 시 최대 할인"
      } as RentalOption
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(productInfo.rentalOptions).map(([period, option]) => (
          <button
            key={period}
            onClick={() => onPeriodSelect(period as 'daily' | 'weekly' | 'monthly')}
            className={`p-5 border-2 rounded-2xl text-center transition-all duration-300 hover:scale-105 ${
              selectedPeriod === period
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg shadow-blue-500/20'
                : 'border-gray-200 bg-white/70 backdrop-blur-sm hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <div className={`w-10 h-10 mx-auto mb-3 rounded-xl flex items-center justify-center text-lg ${
              selectedPeriod === period 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {period === 'daily' ? '📅' : period === 'weekly' ? '📊' : '📈'}
            </div>
            <div className="text-xl font-bold text-gray-900 mb-1">{option.name}</div>
            <div className="text-sm text-gray-600 mb-3">{option.note}</div>
            {option.dailyPrice && (
              <div className="text-xs text-emerald-600 font-medium mb-2">
                일당 ₩{option.dailyPrice.toLocaleString()} ({Math.round((1 - option.dailyPrice / productInfo.rentalOptions.daily.price) * 100)}% 절약)
              </div>
            )}
            <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
              ₩{option.price.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">/ {option.unit}</div>
          </button>
        ))}
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
