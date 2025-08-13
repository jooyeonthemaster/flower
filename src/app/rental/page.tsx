'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function RentalContent() {
  const searchParams = useSearchParams()
  // const templateId = searchParams.get('template') // 현재 사용하지 않음
  
  const [selectedColor, setSelectedColor] = useState<'blue' | 'red'>('blue')
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')

  // 렌트 기간별 가격
  const rentalPrices = {
    daily: 120000,
    weekly: 700000,
    monthly: 2400000
  }

  const rentalPeriods = {
    daily: { label: '일간 렌트', desc: '단기 행사에 최적', price: rentalPrices.daily, discount: undefined },
    weekly: { label: '주간 렌트', desc: '주기간 행사용, 경제적', price: rentalPrices.weekly, discount: 100000 },
    monthly: { label: '월간 렌트', desc: '장기간 이용 시 최대 할인', price: rentalPrices.monthly, discount: 800000 }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900 text-center">RENTAL SERVICE</h1>
          <p className="text-sm text-gray-600 text-center mt-1">
            프리미엄 홀로그램 화환 렌탈 서비스를 특별한 순간을 더욱 빛나게 만들어보세요
          </p>
        </div>
      </div>

      <div className="max-w-md lg:max-w-4xl xl:max-w-6xl mx-auto bg-white lg:grid lg:grid-cols-2 lg:gap-8">
        {/* 왼쪽: 제품 이미지 및 특징 */}
        <div className="p-4 lg:p-6">
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-6">
            <img 
              src="/images/products/hologram-wreath-blue.jpg" 
              alt="홀로그램 화환"
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement
                target.style.display = 'none'
                const nextEl = target.nextElementSibling as HTMLDivElement
                if (nextEl) nextEl.style.display = 'flex'
              }}
            />
            <div className="hidden w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg items-center justify-center flex-col">
              <div className="text-6xl mb-4">🌸</div>
              <div className="text-lg font-medium text-gray-600">홀로그램 화환</div>
            </div>
          </div>

          {/* 제품 특징 */}
          <div className="space-y-3 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 lg:text-lg">제품 특징</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="flex items-center space-x-3 text-sm lg:text-base">
                <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="font-medium">8K Ultra HD 홀로그램 디스플레이</span>
              </div>
              <div className="flex items-center space-x-3 text-sm lg:text-base">
                <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="font-medium">무선 스마트 제어 시스템</span>
              </div>
              <div className="flex items-center space-x-3 text-sm lg:text-base">
                <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="font-medium">전용 스탠드 및 설치 키트 포함</span>
              </div>
              <div className="flex items-center space-x-3 text-sm lg:text-base">
                <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="font-medium">24시간 기술 지원 서비스</span>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 설정 및 옵션 */}
        <div className="lg:border-l lg:border-gray-200">
          {/* 색상 선택 */}
          <div className="px-4 lg:px-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 lg:text-lg">색상 선택</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedColor('blue')}
                className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                  selectedColor === 'blue'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="w-10 h-10 bg-blue-500 rounded mx-auto mb-3"></div>
                <div className="text-sm lg:text-base font-medium">블루 타입</div>
              </button>
              <button
                onClick={() => setSelectedColor('red')}
                className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                  selectedColor === 'red'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="w-10 h-10 bg-red-500 rounded mx-auto mb-3"></div>
                <div className="text-sm lg:text-base font-medium">레드 타입</div>
              </button>
            </div>
          </div>

          {/* 렌트 기간 선택 */}
          <div className="px-4 lg:px-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 lg:text-lg">렌트 기간 선택</h3>
            <div className="space-y-3">
              {Object.entries(rentalPeriods).map(([key, period]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPeriod(key as 'daily' | 'weekly' | 'monthly')}
                  className={`w-full p-4 lg:p-5 border-2 rounded-lg text-left transition-all duration-200 ${
                    selectedPeriod === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900 lg:text-lg">{period.label}</div>
                      <div className="text-sm lg:text-base text-gray-600">{period.desc}</div>
                      {period.discount && (
                        <div className="text-xs lg:text-sm text-green-600 font-medium mt-1">
                          할인 ₩{period.discount.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg lg:text-xl">₩{period.price.toLocaleString()}</div>
                      <div className="text-sm lg:text-base text-gray-500">
                        / {key === 'daily' ? '일' : key === 'weekly' ? '주' : '월'}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 선택된 옵션 */}
          <div className="px-4 lg:px-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 lg:p-5 border">
              <h3 className="font-bold text-gray-900 mb-4 lg:text-lg">선택된 옵션</h3>
              <div className="space-y-3 text-sm lg:text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600">제품</span>
                  <span className="font-medium">Digital Hologram Wreath</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">색상</span>
                  <span className="font-medium">{selectedColor === 'blue' ? '블루 타입' : '레드 타입'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">렌트 기간</span>
                  <span className="font-medium">{rentalPeriods[selectedPeriod].label}</span>
                </div>
                <div className="flex justify-between font-bold text-lg lg:text-xl pt-3 border-t">
                  <span>렌트 비용</span>
                  <span className="text-blue-600">₩{rentalPrices[selectedPeriod].toLocaleString()}/일</span>
                </div>
              </div>
            </div>
          </div>

          {/* 포함 서비스 */}
          <div className="px-4 lg:px-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 lg:text-lg">포함 서비스</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-base">✓</span>
                </div>
                <div>
                  <div className="font-medium text-sm lg:text-base">전국 무료 배송 및 설치</div>
                  <div className="text-xs lg:text-sm text-gray-500">무료</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-base">✓</span>
                </div>
                <div>
                  <div className="font-medium text-sm lg:text-base">24시간 기술 지원</div>
                  <div className="text-xs lg:text-sm text-gray-500">무료</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-base">✓</span>
                </div>
                <div>
                  <div className="font-medium text-sm lg:text-base">수거 및 반납 서비스</div>
                  <div className="text-xs lg:text-sm text-gray-500">무료</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-600 text-base">₩</span>
                </div>
                <div>
                  <div className="font-medium text-sm lg:text-base">보증금 (반납 시 환불)</div>
                  <div className="text-xs lg:text-sm text-gray-500">₩500,000</div>
                </div>
              </div>
            </div>
          </div>

          {/* 버튼들 */}
          <div className="p-4 lg:p-6 space-y-3 border-t bg-gray-50">
            <Link
              href={`/templates?rental=true&period=${selectedPeriod}&color=${selectedColor}&amount=${rentalPrices[selectedPeriod]}`}
              className="block w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center"
            >
              홀로그램 템플릿 선택하기
            </Link>
            
            <button className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200">
              전문 상담 문의
            </button>
            
            <div className="text-center text-xs text-gray-500 mt-4">
              ※ 최소 렌탈 기간 1일, 최대 6개월
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RentalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <RentalContent />
    </Suspense>
  )
} 