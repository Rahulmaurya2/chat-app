import React from 'react';
import { cn } from '@/utils/cn';

export interface SkeletonProps {
  readonly className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-200 dark:bg-slate-700/60',
        className
      )}
    />
  );
};

export const ConversationSkeleton: React.FC = () => {
  return (
    <div className="flex items-center gap-3 p-3 w-full">
      <Skeleton className="w-12 h-12 rounded-full shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-28 rounded-sm" />
          <Skeleton className="h-3 w-10 rounded-sm" />
        </div>
        <Skeleton className="h-3 w-44 rounded-sm" />
      </div>
    </div>
  );
};

export const MessageSkeleton: React.FC<{ readonly isOwn?: boolean }> = ({
  isOwn = false,
}) => {
  return (
    <div
      className={cn(
        'flex items-end gap-2.5 my-2 max-w-[80%]',
        isOwn ? 'ml-auto flex-row-reverse' : 'mr-auto'
      )}
    >
      {!isOwn && <Skeleton className="w-8 h-8 rounded-full shrink-0" />}
      <div
        className={cn(
          'space-y-1.5 p-3 rounded-2xl w-56',
          isOwn ? 'bg-blue-200 dark:bg-blue-900/40' : 'bg-slate-200 dark:bg-slate-800'
        )}
      >
        <Skeleton className="h-3.5 w-full rounded-sm" />
        <Skeleton className="h-3.5 w-3/4 rounded-sm" />
        <div className="flex justify-end">
          <Skeleton className="h-2.5 w-8 rounded-xs" />
        </div>
      </div>
    </div>
  );
};
