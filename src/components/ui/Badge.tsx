import { ReactNode } from 'react';

export type BadgeVariant =
  | 'pending'    // 대기/미답변 - 노랑
  | 'success'    // 승인/답변완료/완료 - 초록
  | 'error'      // 거절/실패 - 빨강
  | 'warning'    // 검토중 - 파랑
  | 'neutral'    // 보관/취소 - 회색
  | 'info';      // 정보 - 하늘색

export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  success: 'bg-green-100 text-green-700 border-green-200',
  error: 'bg-red-100 text-red-700 border-red-200',
  warning: 'bg-blue-100 text-blue-700 border-blue-200',
  neutral: 'bg-gray-100 text-gray-700 border-gray-200',
  info: 'bg-sky-100 text-sky-700 border-sky-200',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className = ''
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center justify-center
        font-medium rounded-full border
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </span>
  );
}
