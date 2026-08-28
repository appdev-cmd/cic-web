'use client';

import { AlertCircle, RotateCcw } from 'lucide-react';

export default function CmsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <AlertCircle className="mx-auto h-9 w-9 text-orange-600" aria-hidden="true" />
        <h1 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Không thể tải dữ liệu CMS</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Vui lòng thử tải lại. Nếu lỗi tiếp diễn, hãy liên hệ quản trị hệ thống.</p>
        <button type="button" onClick={reset} className="mx-auto mt-5 flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Thử lại
        </button>
      </section>
    </main>
  );
}
