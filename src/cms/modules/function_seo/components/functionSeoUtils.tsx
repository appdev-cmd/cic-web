import React from 'react';

export const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400';

export function Field({
  label,
  count,
  children,
}: {
  label: string;
  count?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
        <span>{label}</span>
        {count && <span className="font-normal text-slate-400">{count}</span>}
      </span>
      {children}
    </label>
  );
}
