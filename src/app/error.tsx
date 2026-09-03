'use client';

import { useEffect } from 'react';
import { ApplicationState } from '@/shared/ui/application';

export default function RootError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error('Route rendering error', { digest: error.digest });
  }, [error]);

  return (
    <main className="foundation-shell">
      <div className="foundation-content" role="alert">
        <ApplicationState
          title="Không thể tải trang"
          description="Đã xảy ra lỗi ngoài dự kiến."
          tone="danger"
          action={<button type="button" onClick={reset} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Thử lại</button>}
        />
      </div>
    </main>
  );
}
