'use client'

import { useState } from 'react'
import Link from 'next/link'

type RentalOption = {
  name: string
  price: number
  unit: string
  description: string
  minDays: number
  maxDays: number
  note: string
  dailyPrice?: number
}

export default function ProductSection() {
  const [selectedColor, setSelectedColor] = useState<'blue' | 'red'>('blue')
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')

  const productInfo = {
    name: "Digital Hologram Wreath",
    subtitle: "프리미엄 홀로그램 화환",
    description: "최첨단 8K 홀로그램 기술로 구현된 차세대 디지털 화환. 전통과 혁신이 만나는 특별한 경험을 선사합니다.",
    basePrice: 2400000,
    features: [
      "8K Ultra HD 홀로그램 디스플레이",
      "무선 스마트 제어 시스템",
      "전용 스탠드 및 설치 키트 포함",
      "24시간 기술 지원 서비스"
    ],
    colorOptions: {
      blue: {
        name: "블루 타입"
      },
      red: {
        name: "레드 타입"
      }
    },
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
    },
    baseServices: {
      deposit: 500000,
      delivery: 0,
      installation: 0,
      support: 0
    }
  }

  const currentColor = productInfo.colorOptions[selectedColor]
  const currentRental = productInfo.rentalOptions[selectedPeriod]

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* 섹션 헤더 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">RENTAL SERVICE</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            프리미엄 홀로그램 화환 렌탈 서비스로 특별한 순간을 더욱 빛나게 만들어보세요
          </p>
        </div>

        {/* 메인 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 제품 이미지 - 4칸 */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            <div className="bg-gray-50 border-2 border-gray-200 p-6">
              <div className="aspect-square bg-white border border-gray-200 overflow-hidden">
                <img 
                  src={`/images/products/hologram-wreath-${selectedColor}.jpg`}
                  alt={`${currentColor.name} 홀로그램 화환`}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* 제품 특징 */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                제품 특징
              </h3>
              <div className="space-y-2">
                {productInfo.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 옵션 선택 - 4칸 */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            
            {/* 색상 선택 */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                색상 선택
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(productInfo.colorOptions).map(([color, option]) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color as 'blue' | 'red')}
                    className={`p-4 border-2 text-center transition-all duration-300 ${
                      selectedColor === color
                        ? color === 'blue'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-red-600 bg-red-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className={`w-12 h-12 mx-auto mb-2 border-2 ${
                      color === 'blue' ? 'bg-blue-600 border-blue-700' : 'bg-red-600 border-red-700'
                    }`}></div>
                    <div className="font-medium text-gray-900">{option.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 렌트 기간 선택 */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                렌트 기간 선택
              </h3>
              <div className="space-y-3">
                {Object.entries(productInfo.rentalOptions).map(([period, option]) => (
                  <div
                    key={period}
                    onClick={() => setSelectedPeriod(period as 'daily' | 'weekly' | 'monthly')}
                    className={`p-4 border-2 cursor-pointer transition-all duration-300 ${
                      selectedPeriod === period
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-gray-900">{option.name}</div>
                        <div className="text-sm text-gray-600">{option.note}</div>
                        {option.dailyPrice && (
                          <div className="text-sm text-green-600 font-medium">
                            일당 ₩{option.dailyPrice.toLocaleString()}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          ₩{option.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">/ {option.unit}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 주문 정보 - 4칸 */}
          <div className="lg:col-span-4 flex flex-col">
            
            {/* 선택된 옵션 요약 */}
            <div className="bg-gray-50 border-2 border-gray-200 p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">선택된 옵션</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">제품</span>
                  <span className="font-medium">{productInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">색상</span>
                  <span className="font-medium">{currentColor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">렌트 기간</span>
                  <span className="font-medium">{currentRental.name}</span>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-gray-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold">렌트 비용</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₩{currentRental.price.toLocaleString()}/{currentRental.unit}
                  </span>
                </div>
                {currentRental.dailyPrice && (
                  <div className="text-sm text-green-600 text-right">
                    일당 ₩{currentRental.dailyPrice.toLocaleString()} (기본 대비 {Math.round((1 - currentRental.dailyPrice / productInfo.rentalOptions.daily.price) * 100)}% 절약)
                  </div>
                )}
              </div>
            </div>

            {/* 포함 서비스 */}
            <div className="bg-white border-2 border-gray-200 p-6 flex-1">
              <h4 className="text-lg font-bold text-gray-900 mb-4">포함 서비스</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">전국 무료 배송 및 설치</span>
                  <span className="text-green-600 font-medium">무료</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">24시간 기술 지원</span>
                  <span className="text-green-600 font-medium">무료</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">수거 및 반납 서비스</span>
                  <span className="text-green-600 font-medium">무료</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="text-gray-700 font-medium">보증금 (반납 시 환불)</span>
                  <span className="text-gray-900 font-bold">₩{productInfo.baseServices.deposit.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA 버튼 섹션 - 전체 하단 가운데 */}
        <div className="mt-12 pt-8 border-t-2 border-gray-200">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/templates"
                className="py-5 px-8 text-center text-lg font-bold bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-300"
              >
                홀로그램 템플릿 선택
              </Link>
              <Link
                href="/rental"
                className={`py-5 px-8 text-center text-lg font-bold text-white transition-colors duration-300 ${
                  selectedColor === 'blue'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {currentRental.name} 렌트 신청하기
              </Link>
              <Link
                href="/contact"
                className="py-5 px-8 text-center text-lg font-bold border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300"
              >
                전문 상담 문의
              </Link>
            </div>
            <div className="text-center text-sm text-gray-500 mt-4">
              ※ 최소 렌트 기간: {currentRental.minDays}일 | 최대: {currentRental.maxDays}일
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 