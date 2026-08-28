import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface CmsTabItem<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  icon?: LucideIcon;
}

interface CmsTabsProps<T extends string> {
  items: Array<CmsTabItem<T>>;
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}

export function CmsTabs<T extends string>({ items, value, onChange, ariaLabel }: CmsTabsProps<T>) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 pb-1 dark:border-slate-800 [scrollbar-width:thin]">
      {items.map((item) => {
        const active = item.id === value;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={`-mb-px inline-flex min-h-9 shrink-0 items-center gap-2 rounded-t-lg border-b-2 px-3 text-[13px] font-semibold leading-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
              active
                ? 'border-orange-600 bg-orange-50/60 text-orange-700 dark:bg-orange-950/20 dark:text-orange-300'
                : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
          >
            {Icon && <Icon className="size-4" aria-hidden="true" />}
            <span>{item.label}</span>
            {typeof item.count === 'number' && (
              <span className={`min-w-5 rounded-full px-1.5 py-0.5 text-center font-mono text-xs leading-4 ${active ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
