/**
 * 通用卡片组件
 *
 * 白色卡片容器，用于包裹内容区块。
 * 跨模块调用方：src/components/teacher/*.tsx
 */
import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
