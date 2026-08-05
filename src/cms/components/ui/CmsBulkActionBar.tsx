import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { CheckSquare2, X } from 'lucide-react';
import { CmsButton } from './CmsButton';

export interface CmsBulkAction {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

interface CmsBulkActionBarProps {
  selectedCount: number;
  itemLabel: string;
  actions: CmsBulkAction[];
  onClear?: () => void;
}

export const CmsBulkActionBar: React.FC<CmsBulkActionBarProps> = ({ selectedCount, itemLabel, actions, onClear }) => {
  if (selectedCount === 0) return null;

  return (
    <div role="region" aria-label="Thao tác với các mục đã chọn" className="flex flex-col gap-3 rounded-xl border border-orange-200 bg-orange-50 p-3 text-xs shadow-xs dark:border-orange-900/60 dark:bg-orange-950/30 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 font-semibold text-orange-800 dark:text-orange-300" aria-live="polite">
        <CheckSquare2 className="size-4" aria-hidden="true" />
        <span>Đã chọn {selectedCount} {itemLabel}</span>
        {onClear && (
          <button type="button" onClick={onClear} className="ml-1 inline-flex size-7 items-center justify-center rounded-lg text-orange-700 hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:text-orange-300 dark:hover:bg-orange-900/40" aria-label="Bỏ chọn tất cả" title="Bỏ chọn tất cả">
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-0.5 sm:flex-wrap sm:justify-end">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <CmsButton key={action.label} size="sm" variant={action.variant || 'secondary'} onClick={action.onClick} leadingIcon={Icon ? <Icon /> : undefined}>
              {action.label}
            </CmsButton>
          );
        })}
      </div>
    </div>
  );
};
