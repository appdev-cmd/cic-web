export default function NewsDetailLoading() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-8 pb-20 animate-pulse" aria-busy="true" aria-label="Đang tải bài viết">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-3 bg-slate-200 rounded" />
          <div className="h-4 w-20 bg-slate-200 rounded" />
          <div className="h-4 w-3 bg-slate-200 rounded" />
          <div className="h-4 w-40 bg-slate-200 rounded" />
        </div>

        {/* Article Layout (8 cols + 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Article Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-3">
              <div className="h-5 w-24 bg-orange-100 rounded-full" />
              <div className="h-10 w-full bg-slate-200 rounded-lg" />
              <div className="h-8 w-4/5 bg-slate-200 rounded-lg" />
              <div className="flex gap-4 pt-2">
                <div className="h-4 w-28 bg-slate-200 rounded" />
                <div className="h-4 w-24 bg-slate-200 rounded" />
              </div>
            </div>

            {/* Featured Image */}
            <div className="aspect-[16/9] w-full bg-slate-200 rounded-[14px]" />

            {/* Article Content Paragraphs */}
            <div className="space-y-4 pt-4">
              <div className="h-4 w-full bg-slate-200 rounded" />
              <div className="h-4 w-full bg-slate-200 rounded" />
              <div className="h-4 w-5/6 bg-slate-200 rounded" />
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-4/5 bg-slate-100 rounded" />
              <div className="h-4 w-full bg-slate-100 rounded" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="h-6 w-36 bg-slate-200 rounded" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-20 h-16 bg-slate-200 rounded-[8px] shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-16 bg-slate-200 rounded" />
                    <div className="h-4 w-full bg-slate-200 rounded" />
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