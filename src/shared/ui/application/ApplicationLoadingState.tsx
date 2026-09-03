export interface ApplicationLoadingStateProps {
  label?: string;
  className?: string;
}

/** Lightweight server-renderable fallback; feature-specific skeletons remain feature-owned. */
export function ApplicationLoadingState({
  label = 'Đang tải…',
  className = '',
}: Readonly<ApplicationLoadingStateProps>) {
  return (
    <section className={`w-full animate-pulse space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs ${className}`.trim()} aria-busy="true" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div className="h-7 w-64 max-w-full rounded-lg bg-slate-200" />
      <div className="h-4 w-full max-w-xl rounded bg-slate-100" />
      <div className="h-24 rounded-xl bg-slate-100" />
    </section>
  );
}
