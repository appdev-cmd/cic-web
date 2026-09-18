export default function EnNewsDetailLoading() {
  return (
    <div className="min-h-screen bg-white pt-8 pb-20 animate-pulse" aria-busy="true" aria-label="Loading article...">
      <div className="max-w-4xl mx-auto px-6 space-y-6">
        <div className="h-8 bg-slate-200 w-32 rounded-lg" />
        <div className="h-12 bg-slate-200 w-full rounded-lg" />
        <div className="h-72 bg-slate-100 rounded-xl" />
        <div className="space-y-3">
          <div className="h-4 bg-slate-100 rounded" />
          <div className="h-4 bg-slate-100 rounded" />
          <div className="h-4 bg-slate-100 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}
