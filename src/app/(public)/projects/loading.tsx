export default function ProjectsLoading() {
  return (
    <div className="pt-8 pb-20 relative z-10 bg-slate-50/50 min-h-screen animate-pulse" aria-busy="true" aria-label="Đang tải danh sách dự án">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Header section */}
        <div className="border-l-4 border-orange-600 pl-6 space-y-2">
          <div className="h-9 w-64 bg-slate-200 rounded" />
          <div className="h-4 w-96 max-w-full bg-slate-200 rounded" />
        </div>

        {/* Filter Pills Bar */}
        <div className="space-y-6 pt-2 border-t border-slate-200/80">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <div className="h-9 w-24 bg-orange-200 rounded-[8px] shrink-0" />
            <div className="h-9 w-28 bg-slate-200 rounded-[8px] shrink-0" />
            <div className="h-9 w-32 bg-slate-200 rounded-[8px] shrink-0" />
            <div className="h-9 w-28 bg-slate-200 rounded-[8px] shrink-0" />
          </div>

          {/* Bento Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
            {/* Card 0: 7 cols */}
            <div className="col-span-12 md:col-span-7 h-[380px] lg:h-[440px] bg-slate-200 rounded-[14px] relative overflow-hidden flex flex-col justify-end p-6">
              <div className="h-5 w-24 bg-slate-300 rounded mb-2" />
              <div className="h-7 w-3/4 bg-slate-300 rounded" />
            </div>

            {/* Card 1: 5 cols */}
            <div className="col-span-12 md:col-span-5 h-[380px] lg:h-[440px] bg-slate-200 rounded-[14px] relative overflow-hidden flex flex-col justify-end p-6">
              <div className="h-5 w-20 bg-slate-300 rounded mb-2" />
              <div className="h-7 w-4/5 bg-slate-300 rounded" />
            </div>

            {/* Card 2: 5 cols */}
            <div className="col-span-12 md:col-span-5 h-[380px] lg:h-[440px] bg-slate-200 rounded-[14px] relative overflow-hidden flex flex-col justify-end p-6">
              <div className="h-5 w-20 bg-slate-300 rounded mb-2" />
              <div className="h-7 w-4/5 bg-slate-300 rounded" />
            </div>

            {/* Card 3: 7 cols */}
            <div className="col-span-12 md:col-span-7 h-[380px] lg:h-[440px] bg-slate-200 rounded-[14px] relative overflow-hidden flex flex-col justify-end p-6">
              <div className="h-5 w-24 bg-slate-300 rounded mb-2" />
              <div className="h-7 w-3/4 bg-slate-300 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}