export default function NewsLoading() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 animate-pulse" aria-busy="true" aria-label="Đang tải tin tức & sự kiện">
      <div className="py-8 sm:py-12 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Main Title */}
          <div className="border-b border-slate-200 pb-6 space-y-2">
            <div className="h-9 w-64 bg-slate-200 rounded" />
            <div className="h-4 w-80 bg-slate-200 rounded" />
          </div>

          {/* Breaking news ticker skeleton */}
          <div className="h-10 bg-slate-100 rounded-[8px]" />

          {/* Hero editorial grid (3 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            <div className="lg:col-span-8 h-[360px] sm:h-[420px] bg-slate-200 rounded-[14px] p-6 flex flex-col justify-end">
              <div className="h-5 w-24 bg-slate-300 rounded mb-3" />
              <div className="h-8 w-4/5 bg-slate-300 rounded mb-2" />
              <div className="h-4 w-2/3 bg-slate-300 rounded" />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="flex-1 bg-slate-200 rounded-[14px] p-4 flex flex-col justify-end">
                <div className="h-4 w-20 bg-slate-300 rounded mb-2" />
                <div className="h-5 w-3/4 bg-slate-300 rounded" />
              </div>
              <div className="flex-1 bg-slate-200 rounded-[14px] p-4 flex flex-col justify-end">
                <div className="h-4 w-20 bg-slate-300 rounded mb-2" />
                <div className="h-5 w-3/4 bg-slate-300 rounded" />
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 pt-6 overflow-x-auto">
            <div className="h-9 w-24 bg-orange-200 rounded-[8px] shrink-0" />
            <div className="h-9 w-28 bg-slate-200 rounded-[8px] shrink-0" />
            <div className="h-9 w-32 bg-slate-200 rounded-[8px] shrink-0" />
            <div className="h-9 w-28 bg-slate-200 rounded-[8px] shrink-0" />
          </div>

          {/* News Grid (3 cols) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <div className="w-full h-52 lg:h-56 bg-slate-200 rounded-[14px]" />
                <div className="h-3 w-32 bg-slate-200 rounded" />
                <div className="h-5 w-full bg-slate-200 rounded" />
                <div className="h-3.5 w-4/5 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}