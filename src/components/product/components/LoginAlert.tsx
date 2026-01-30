'use client'

import { useAuth } from '@/contexts/AuthContext'

interface LoginAlertProps {
  show: boolean
  onClose: () => void
}

export default function LoginAlert({ show, onClose }: LoginAlertProps) {
  const { signInWithGoogle } = useAuth()

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">로그인이 필요합니다</h3>
          <p className="text-gray-600 mb-6">
            템플릿 선택을 위해서는 먼저 로그인을 해주세요.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={async () => {
                onClose()
                try {
                  await signInWithGoogle()
                } catch (error) {
                  console.error('로그인 실패:', error)
                }
              }}
              className="flex-1 px-4 py-2 bg-orange text-white rounded-lg hover:bg-[#d15a1f]"
            >
              로그인하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
