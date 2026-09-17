export default function ServicesLoading() {
  return (
    <div className="min-h-screen bg-slate-50/60 pt-8 pb-20 animate-pulse" aria-busy="true" aria-label="Đang tải danh mục dịch vụ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 space-y-12">
        {/* Header Skeleton */}
        <div className="border-l-4 border-orange-600 pl-6 space-y-2">
          <div className="h-9 w-72 sm:w-96 bg-slate-200 rounded" />
          <div className="h-4 w-64 sm:w-80 bg-slate-200 rounded" />
        </div>

        {/* Services Grid (3 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-[12px] p-6 space-y-4 flex flex-col justify-between min-h-[340px]"
            >
              <div className="space-y-4">
                <div className="aspect-[16/9] bg-slate-100 rounded-[8px]" />
                <div className="h-5 w-24 bg-orange-100 rounded-full" />
                <div className="h-6 w-4/5 bg-slate-200 rounded" />
                <div className="space-y-2">
                  <div className="h-3.5 w-full bg-slate-100 rounded" />
                  <div className="h-3.5 w-5/6 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="h-4 w-28 bg-slate-200 rounded" />
                <div className="h-4 w-4 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}