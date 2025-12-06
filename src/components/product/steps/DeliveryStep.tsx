'use client'

import { useState } from 'react'
import { DeliveryInfo } from '../hooks/useProductWizard'

interface DeliveryStepProps {
  deliveryInfo: DeliveryInfo
  onUpdate: (info: DeliveryInfo) => void
  onNext: () => void
  onPrev: () => void
}

export default function DeliveryStep({ deliveryInfo, onUpdate, onNext, onPrev }: DeliveryStepProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryInfo, string>>>({})

  // 다음 영업일부터 선택 가능 (최소 2일 후)
  const getMinDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + 2)
    return date.toISOString().split('T')[0]
  }

  // 최대 3개월 후까지
  const getMaxDate = () => {
    const date = new Date()
    date.setMonth(date.getMonth() + 3)
    return date.toISOString().split('T')[0]
  }

  const handleChange = (field: keyof DeliveryInfo, value: string) => {
    onUpdate({ ...deliveryInfo, [field]: value })
    // 입력 시 에러 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof DeliveryInfo, string>> = {}

    if (!deliveryInfo.recipientName.trim()) {
      newErrors.recipientName = '수령인 이름을 입력해주세요'
    }

    if (!deliveryInfo.recipientPhone.trim()) {
      newErrors.recipientPhone = '연락처를 입력해주세요'
    } else if (!/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/.test(deliveryInfo.recipientPhone.replace(/-/g, ''))) {
      newErrors.recipientPhone = '올바른 휴대폰 번호를 입력해주세요'
    }

    if (!deliveryInfo.address.trim()) {
      newErrors.address = '주소를 입력해주세요'
    }

    if (!deliveryInfo.installationDate) {
      newErrors.installationDate = '설치 희망일을 선택해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) {
      onNext()
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">배송 및 설치 정보</h3>
        <p className="text-gray-600">화환 설치에 필요한 정보를 입력해주세요</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* 수령인 정보 */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">1</span>
            수령인 정보
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                수령인 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={deliveryInfo.recipientName}
                onChange={(e) => handleChange('recipientName', e.target.value)}
                placeholder="홍길동"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.recipientName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.recipientName && (
                <p className="mt-1 text-sm text-red-500">{errors.recipientName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={deliveryInfo.recipientPhone}
                onChange={(e) => handleChange('recipientPhone', e.target.value)}
                placeholder="010-1234-5678"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.recipientPhone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.recipientPhone && (
                <p className="mt-1 text-sm text-red-500">{errors.recipientPhone}</p>
              )}
            </div>
          </div>
        </div>

        {/* 설치 주소 */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">2</span>
            설치 주소
          </h4>

          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                type="text"
                value={deliveryInfo.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                placeholder="우편번호"
                className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                onClick={() => alert('주소 검색 기능은 추후 구현 예정입니다. 직접 입력해주세요.')}
              >
                주소 검색
              </button>
            </div>

            <div>
              <input
                type="text"
                value={deliveryInfo.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="기본 주소 *"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            <input
              type="text"
              value={deliveryInfo.addressDetail}
              onChange={(e) => handleChange('addressDetail', e.target.value)}
              placeholder="상세 주소 (건물명, 층, 호수 등)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* 설치 희망일 */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">3</span>
            설치 희망일
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                날짜 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={deliveryInfo.installationDate}
                onChange={(e) => handleChange('installationDate', e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.installationDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.installationDate && (
                <p className="mt-1 text-sm text-red-500">{errors.installationDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시간대
              </label>
              <select
                value={deliveryInfo.installationTime}
                onChange={(e) => handleChange('installationTime', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="오전">오전 (09:00 - 12:00)</option>
                <option value="오후">오후 (12:00 - 18:00)</option>
                <option value="저녁">저녁 (18:00 - 21:00)</option>
              </select>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            * 설치는 최소 2일 전에 예약해주세요. 정확한 시간은 설치 전날 연락드립니다.
          </p>
        </div>

        {/* 요청사항 */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">4</span>
            요청사항 (선택)
          </h4>

          <textarea
            value={deliveryInfo.installationNote}
            onChange={(e) => handleChange('installationNote', e.target.value)}
            placeholder="설치 시 참고사항이 있으면 입력해주세요. (예: 건물 입구 비밀번호, 주차 안내 등)"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>
      </div>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          이전으로
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          결제하기
        </button>
      </div>
    </div>
  )
}
