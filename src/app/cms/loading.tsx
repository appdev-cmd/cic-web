export default function CmsLoading() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8 dark:bg-slate-950" aria-busy="true" aria-label="Đang tải CMS">
      <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="h-7 w-64 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="mt-5 h-14 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="h-32 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-32 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    </main>
  );
}
