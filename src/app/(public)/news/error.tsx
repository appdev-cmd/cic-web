'use client';

export default function NewsError({ reset }: { reset: () => void }) {
  return <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
    <h1 className="text-2xl font-black text-slate-900">Không thể tải Tin tức</h1>
    <p className="mt-3 text-sm leading-6 text-slate-600">Dữ liệu tạm thời chưa thể truy cập. Vui lòng thử lại.</p>
    <button type="button" onClick={reset} className="mt-6 min-h-11 rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white hover:bg-orange-700">Thử lại</button>
  </main>;
}
