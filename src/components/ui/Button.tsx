import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ 
  className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center whitespace-nowrap rounded font-bold uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#34F5C5] disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-[#34F5C5]/20 text-[#34F5C5] hover:bg-[#34F5C5]/30 border border-[#34F5C5]/50 shadow-[0_0_10px_rgba(52,245,197,0)] hover:shadow-[0_0_10px_rgba(52,245,197,0.2)]',
    secondary: 'bg-elevated border border-strong text-muted hover:text-primary hover:border-subtle hover:bg-surface',
    ghost: 'hover:bg-surface hover:text-primary text-muted',
    destructive: 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20'
  };

  const sizes = {
    sm: 'h-8 px-3 text-[10px]',
    md: 'h-10 px-4 py-2 text-xs',
    lg: 'h-12 px-8 text-sm',
    icon: 'h-9 w-9 text-xs',
  };

  return (
    <button 
      ref={ref} 
      className={cn(baseStyles, variants[variant], sizes[size], className)} 
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
