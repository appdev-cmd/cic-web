'use client';

import { useEffect } from 'react';

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
      <section className="foundation-content" role="alert">
        <h1>Không thể tải trang</h1>
        <p>Đã xảy ra lỗi ngoài dự kiến.</p>
        <button type="button" onClick={reset}>
          Thử lại
        </button>
      </section>
    </main>
  );
}
