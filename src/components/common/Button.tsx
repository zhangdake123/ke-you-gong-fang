/**
 * 通用按钮组件
 *
 * 支持 variant（样式变体）、size（尺寸）、loading（加载状态）。
 * 跨模块调用方：src/components/teacher/*.tsx、src/App.tsx
 */
import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 样式变体 */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 加载中状态 */
  loading?: boolean;
  children: ReactNode;
}

/** 各变体对应的 Tailwind 类名 */
const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500',
  secondary:
    'bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-400 border border-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400',
};

/** 各尺寸对应的 Tailwind 类名 */
const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

export default Button;
