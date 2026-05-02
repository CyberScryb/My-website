import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-2 bg-surface border rounded-lg text-primary text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#34F5C5]/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            error ? "border-red-500/50 focus:ring-red-500/30" : "border-subtle focus:border-[#34F5C5]/50",
            className
          )}
          {...props}
        />
        {error && <span className="absolute -bottom-5 left-0 text-[10px] text-red-400 font-bold tracking-widest">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full h-full relative flex flex-col">
        <textarea
          ref={ref}
          className={cn(
            "flex-1 w-full p-4 bg-surface border rounded-lg text-primary text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#34F5C5]/50 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed",
            error ? "border-red-500/50 focus:ring-red-500/30" : "border-subtle focus:border-[#34F5C5]/50",
            className
          )}
          {...props}
        />
        {error && <span className="absolute -bottom-5 left-0 text-[10px] text-red-400 font-bold tracking-widest">{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
