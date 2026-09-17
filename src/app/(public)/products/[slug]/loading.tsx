export default function ProductDetailLoading() {
  return (
    <div className="bg-white min-h-screen pt-8 pb-20 animate-pulse" aria-busy="true" aria-label="Đang tải thông tin sản phẩm">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-3 bg-slate-200 rounded" />
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-4 w-3 bg-slate-200 rounded" />
          <div className="h-4 w-40 bg-slate-200 rounded" />
        </div>

        {/* Product Main Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Image Box (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="aspect-[4/3] bg-slate-100 border border-slate-200 rounded-[12px]" />
            <div className="flex gap-2">
              <div className="w-16 h-16 bg-slate-100 rounded-[8px]" />
              <div className="w-16 h-16 bg-slate-100 rounded-[8px]" />
              <div className="w-16 h-16 bg-slate-100 rounded-[8px]" />
            </div>
          </div>

          {/* Right: Info & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="h-5 w-20 bg-orange-100 rounded-full" />
                <div className="h-5 w-24 bg-slate-100 rounded-full" />
              </div>
              <div className="h-8 w-3/4 bg-slate-200 rounded" />
              <div className="h-6 w-32 bg-orange-200 rounded" />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-5/6 bg-slate-100 rounded" />
              <div className="h-4 w-2/3 bg-slate-100 rounded" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <div className="h-11 w-36 bg-orange-200 rounded-[8px]" />
              <div className="h-11 w-36 bg-slate-200 rounded-[8px]" />
              <div className="h-11 w-32 bg-slate-100 rounded-[8px]" />
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex gap-4 border-b border-slate-200 pb-3">
            <div className="h-6 w-28 bg-orange-200 rounded" />
            <div className="h-6 w-28 bg-slate-200 rounded" />
            <div className="h-6 w-28 bg-slate-200 rounded" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-4/5 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}