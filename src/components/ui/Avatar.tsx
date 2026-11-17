import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { getInitials } from '@/utils/helpers';
import type { UserStatus } from '@/features/chat/types';

export interface AvatarProps {
  readonly src?: string;
  readonly alt: string;
  readonly size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  readonly status?: UserStatus;
  readonly className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const statusSizeClasses = {
  xs: 'w-2 h-2 ring-1',
  sm: 'w-2.5 h-2.5 ring-2',
  md: 'w-3 h-3 ring-2',
  lg: 'w-3.5 h-3.5 ring-2',
  xl: 'w-4 h-4 ring-2',
};

const statusColors: Record<UserStatus, string> = {
  online: 'bg-emerald-500',
  offline: 'bg-slate-400',
  away: 'bg-amber-500',
  busy: 'bg-rose-500',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  status,
  className,
}) => {
  const [imageError, setImageError] = useState(false);
  const showFallback = !src || imageError;

  return (
    <div className={cn('relative inline-flex shrink-0 select-none', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full overflow-hidden font-medium text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700',
          sizeClasses[size]
        )}
      >
        {showFallback ? (
          <span>{getInitials(alt || 'U')}</span>
        ) : (
          <img
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-white dark:ring-slate-900',
            statusColors[status],
            statusSizeClasses[size]
          )}
          title={`Status: ${status}`}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};
