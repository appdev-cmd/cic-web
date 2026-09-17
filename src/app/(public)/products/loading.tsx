export default function ProductsLoading() {
  return (
    <div className="bg-slate-50/50 min-h-screen pt-8 pb-20 animate-pulse" aria-busy="true" aria-label="Đang tải danh mục sản phẩm">
      <div className="max-w-7xl mx-auto px-6">
        {/* Banner Skeleton */}
        <div className="text-center mb-16 space-y-4">
          <div className="h-10 w-72 sm:w-96 bg-slate-200 mx-auto rounded-lg" />
          <div className="w-20 h-1 bg-orange-200 mx-auto" />
          <div className="h-4 w-64 sm:w-80 bg-slate-200 mx-auto rounded" />
        </div>

        {/* Layout: Sidebar + Grid */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Skeleton (3 cols) */}
          <div className="hidden lg:block lg:col-span-3 w-full bg-white border border-slate-200 p-5 rounded-[12px] space-y-6">
            <div className="h-10 bg-slate-100 rounded-[8px]" />
            <div className="space-y-3 pt-2">
              <div className="h-4 w-28 bg-slate-200 rounded" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-100 rounded" />
                <div className="h-4 w-4/5 bg-slate-100 rounded" />
                <div className="h-4 w-3/4 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <div className="h-4 w-32 bg-slate-200 rounded" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-100 rounded" />
                <div className="h-4 w-2/3 bg-slate-100 rounded" />
              </div>
            </div>
          </div>

          {/* Catalog Grid Skeleton (9 cols) */}
          <div className="w-full lg:col-span-9 flex flex-col gap-6">
            {/* Header bar */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div className="h-6 w-40 bg-slate-200 rounded" />
              <div className="h-8 w-32 bg-slate-200 rounded-[8px]" />
            </div>

            {/* 6 Product Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-[12px] min-h-[285px] sm:min-h-[300px] flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 bg-slate-200 rounded shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-4 w-full bg-slate-200 rounded" />
                        <div className="h-3 w-3/4 bg-slate-200 rounded" />
                      </div>
                    </div>
                    <div className="h-4 w-24 bg-orange-100 rounded" />
                    <div className="pt-3 border-t border-slate-100 space-y-1.5">
                      <div className="h-3 w-full bg-slate-100 rounded" />
                      <div className="h-3 w-4/5 bg-slate-100 rounded" />
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <div className="h-3 w-20 bg-slate-200 rounded" />
                    <div className="h-4 w-4 bg-slate-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
