'use client';

import React from 'react';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <head>
        <title>Đã xảy ra sự cố hệ thống | CIC Technology</title>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className="m-0 min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/90 p-8 text-center shadow-2xl backdrop-blur-md">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Đã xảy ra sự cố kết nối
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Hệ thống tạm thời gặp gián đoạn ngoài dự kiến. Vui lòng nhấn thử lại hoặc quay lại trang chủ.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full sm:w-auto px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              Thử lại
            </button>
            <a
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors text-center cursor-pointer"
            >
              Về trang chủ
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
