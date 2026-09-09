'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import type { RichTextEditorProps } from './RichTextEditorCore';

export type { RichTextEditorProps };

export const RichTextEditor = dynamic<RichTextEditorProps>(
  () => import('./RichTextEditorCore').then((mod) => mod.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div className="cms-ckeditor flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 min-h-[220px]">
        <p className="text-xs font-medium text-slate-400 animate-pulse">Đang nạp trình soạn thảo…</p>
      </div>
    ),
  },
);

export default RichTextEditor;