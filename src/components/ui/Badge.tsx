import React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps {
  readonly count: number;
  readonly max?: number;
  readonly className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  count,
  max = 99,
  className,
}) => {
  if (count <= 0) return null;

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-semibold text-white bg-blue-600 rounded-full select-none shadow-xs',
        className
      )}
      aria-label={`${count} unread messages`}
    >
      {displayCount}
    </span>
  );
};
