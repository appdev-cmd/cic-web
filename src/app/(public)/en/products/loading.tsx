export default function EnProductsLoading() {
  return (
    <div className="bg-slate-50/50 min-h-screen pt-8 pb-20 animate-pulse" aria-busy="true" aria-label="Loading products catalog...">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-12 bg-slate-200 w-1/4 mx-auto rounded-lg mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 h-96 bg-white border border-slate-200 rounded-xl" />
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 bg-white border border-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
