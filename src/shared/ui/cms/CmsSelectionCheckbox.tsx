'use client';

import React, { useEffect, useRef } from 'react';

interface CmsSelectionCheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  'aria-label'?: string;
  indeterminate?: boolean;
  disabled?: boolean;
}

export const CmsSelectionCheckbox: React.FC<CmsSelectionCheckboxProps> = ({
  checked,
  onChange,
  label,
  'aria-label': ariaLabel,
  indeterminate = false,
  disabled = false,
}) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      aria-label={label ?? ariaLabel}
      className="size-4 shrink-0 cursor-pointer rounded border-slate-300 text-orange-600 accent-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600"
    />
  );
};
