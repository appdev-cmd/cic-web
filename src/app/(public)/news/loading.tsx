export default function NewsLoading() {
  return <main className="mx-auto min-h-[60vh] max-w-7xl animate-pulse space-y-6 px-4 py-10 sm:px-6 lg:px-8" aria-label="Đang tải tin tức">
    <div className="h-10 w-64 rounded bg-slate-200" />
    <div className="grid gap-6 lg:grid-cols-3"><div className="h-80 rounded-2xl bg-slate-200 lg:col-span-2" /><div className="h-80 rounded-2xl bg-slate-200" /></div>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-64 rounded-2xl bg-slate-200" />)}</div>
  </main>;
}
