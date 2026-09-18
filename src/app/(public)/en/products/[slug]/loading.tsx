export default function EnProductDetailLoading() {
  return (
    <div className="bg-white min-h-screen pt-8 pb-20 animate-pulse" aria-busy="true" aria-label="Loading product details...">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="h-8 bg-slate-200 w-36 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6 h-96 bg-slate-100 rounded-xl" />
          <div className="lg:col-span-6 space-y-4">
            <div className="h-10 bg-slate-200 w-3/4 rounded-lg" />
            <div className="h-6 bg-slate-100 w-1/3 rounded-lg" />
            <div className="h-32 bg-slate-50 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
