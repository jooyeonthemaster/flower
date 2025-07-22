'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const [errorInfo, setErrorInfo] = useState<{
    code?: string;
    message?: string;
    orderId?: string;
  }>({});

  useEffect(() => {
    const code = searchParams.get('code');
    const message = searchParams.get('message');
    const orderId = searchParams.get('orderId');

    setErrorInfo({
      code: code || undefined,
      message: message || undefined,
      orderId: orderId || undefined,
    });
  }, [searchParams]);

  const getErrorMessage = (code?: string) => {
    const errorMessages: { [key: string]: string } = {
      'PAY_PROCESS_CANCELED': '사용자가 결제를 취소했습니다.',
      'PAY_PROCESS_ABORTED': '결제 진행 중 오류가 발생했습니다.',
      'REJECT_CARD_COMPANY': '카드사에서 결제를 거절했습니다.',
      'INVALID_CARD_COMPANY': '유효하지 않은 카드입니다.',
      'NOT_SUPPORTED_INSTALLMENT': '지원하지 않는 할부개월입니다.',
      'EXCEED_MAX_CARD_INSTALLMENT_PLAN': '최대 할부개월을 초과했습니다.',
      'INVALID_STOPPED_CARD': '정지된 카드입니다.',
      'EXCEED_MAX_DAILY_PAYMENT_COUNT': '일일 결제 한도를 초과했습니다.',
      'NOT_SUPPORTED_BANK': '지원하지 않는 은행입니다.',
      'INVALID_PASSWORD': '결제 비밀번호가 일치하지 않습니다.',
    };

    return errorMessages[code || ''] || '알 수 없는 오류가 발생했습니다.';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* 실패 아이콘 */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg 
              className="w-8 h-8 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </div>
        </div>

        {/* 제목 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          결제에 실패했습니다
        </h1>
        
        <p className="text-gray-600 mb-6">
          결제 처리 중 문제가 발생했습니다.
        </p>

        {/* 오류 정보 */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-red-900 mb-3">오류 정보</h3>
          
          <div className="space-y-2 text-sm">
            {errorInfo.orderId && (
              <div className="flex justify-between">
                <span className="text-red-600">주문번호:</span>
                <span className="font-medium">{errorInfo.orderId}</span>
              </div>
            )}
            
            {errorInfo.code && (
              <div className="flex justify-between">
                <span className="text-red-600">오류 코드:</span>
                <span className="font-medium">{errorInfo.code}</span>
              </div>
            )}
            
            <div className="mt-3">
              <span className="text-red-600 block mb-1">오류 메시지:</span>
              <p className="text-red-800 font-medium">
                {errorInfo.message || getErrorMessage(errorInfo.code)}
              </p>
            </div>
          </div>
        </div>

        {/* 도움말 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-2">해결 방법</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 카드 정보를 다시 확인해주세요</li>
            <li>• 결제 한도를 확인해주세요</li>
            <li>• 다른 카드로 시도해보세요</li>
            <li>• 문제가 지속되면 고객센터에 문의해주세요</li>
          </ul>
        </div>

        {/* 버튼들 */}
        <div className="space-y-3">
          <button 
            onClick={() => window.history.back()}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            다시 시도하기
          </button>
          
          <Link 
            href="/"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            홈으로 돌아가기
          </Link>
          
          <Link 
            href="/contact"
            className="block w-full text-blue-600 hover:text-blue-700 font-medium py-2 transition-colors duration-200"
          >
            고객센터 문의하기
          </Link>
        </div>
      </div>
    </div>
  );
} 