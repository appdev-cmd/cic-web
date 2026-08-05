import React from 'react';

interface CmsPageHeaderProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
}

export const CmsPageHeader: React.FC<CmsPageHeaderProps> = ({ icon, title, description, meta, actions }) => (
  <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-5">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white shadow-sm shadow-orange-600/20 [&>svg]:size-5">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h1 className="min-w-0 text-xl font-bold leading-7 text-slate-900 dark:text-white sm:text-2xl">
              {title}
            </h1>
            {meta}
          </div>
          {description && (
            <p className="mt-1 max-w-3xl text-sm leading-5 text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  </section>
);
