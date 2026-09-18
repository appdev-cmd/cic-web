export default function EnProjectsLoading() {
  return (
    <div className="pt-8 pb-20 relative z-10 bg-slate-50/50 min-h-screen animate-pulse" aria-busy="true" aria-label="Loading project portfolio...">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="h-10 bg-slate-200 w-1/4 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 bg-white border border-slate-200 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
