export default function EnLoading() {
  return (
    <div className="min-h-screen bg-slate-50/50 pt-8 pb-20 animate-pulse" aria-busy="true" aria-label="Loading page...">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="h-10 bg-slate-200 w-1/3 rounded-lg" />
        <div className="h-64 bg-slate-200 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 bg-slate-200 rounded-xl" />
          <div className="h-48 bg-slate-200 rounded-xl" />
          <div className="h-48 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
