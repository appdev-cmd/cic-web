'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export interface AiMagicWandProps {
  /** Optional button text label */
  label?: string;
  /** Hover tooltip */
  title?: string;
  /** Async trigger callback when clicked */
  onTrigger: () => Promise<void> | void;
  /** Disabled state */
  disabled?: boolean;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md';
  /** Visual variant */
  variant?: 'subtle' | 'ghost' | 'outline';
  /** Additional class names */
  className?: string;
}

export function AiMagicWand({
  label,
  title = 'Trợ lý AI hỗ trợ điền',
  onTrigger,
  disabled = false,
  size = 'xs',
  variant = 'subtle',
  className = '',
}: AiMagicWandProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || isLoading) return;

    try {
      setIsLoading(true);
      await onTrigger();
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[11px] gap-1 rounded-md h-6',
    sm: 'px-2.5 py-1 text-xs gap-1.5 rounded-lg h-7',
    md: 'px-3 py-1.5 text-sm gap-2 rounded-xl h-8',
  }[size];

  const variantClasses = {
    subtle:
      'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200/80 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60 dark:hover:bg-orange-950/60 shadow-2xs',
    ghost:
      'text-orange-600 hover:text-orange-700 hover:bg-orange-50/80 dark:text-orange-400 dark:hover:bg-orange-950/30',
    outline:
      'border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 shadow-2xs',
  }[variant];

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isLoading}
      title={title}
      className={`inline-flex items-center font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ${sizeClasses} ${variantClasses} ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-600 dark:text-orange-400" />
      ) : (
        <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
      )}
      {label && <span>{isLoading ? 'Đang tạo...' : label}</span>}
    </button>
  );
}
