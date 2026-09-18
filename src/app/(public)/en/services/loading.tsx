export default function EnServicesLoading() {
  return (
    <div className="min-h-screen bg-slate-50/60 pt-8 pb-20 animate-pulse" aria-busy="true" aria-label="Loading consulting services...">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="h-10 bg-slate-200 w-1/4 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-72 bg-white border border-slate-200 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
