import React from 'react';
import { cn } from '../../lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[#34F5C5]/10", className)}
      {...props}
    />
  );
}

export function Badge({ className, variant = 'default', ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'ai' | 'error' }) {
  const variants = {
    default: 'bg-surface text-muted border-subtle',
    ai: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    error: 'bg-red-500/10 text-red-500 border-red-500/20',
  };
  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#34F5C5] focus:ring-offset-2", variants[variant], className)} {...props} />
  )
}
