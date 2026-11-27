'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, CheckCircle2, Video, X } from 'lucide-react';
import {
  buildSafeVideoFigureHtml,
  resolveAllowedVideoEmbedSrc,
} from '@/shared/lib/rich-text-embeds';

export interface RichTextYoutubeModalProps {
  open: boolean;
  onClose: () => void;
  onInsertHtml: (htmlSnippet: string) => void;
}

export function RichTextYoutubeModal({
  open,
  onClose,
  onInsertHtml,
}: RichTextYoutubeModalProps) {
  const [rawInput, setRawInput] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!open) return;
    setRawInput('');
    setTitle('');
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  const resolvedEmbedSrc = useMemo(
    () => resolveAllowedVideoEmbedSrc(rawInput),
    [rawInput],
  );

  if (!open) return null;

  const handleInsert = () => {
    if (!resolvedEmbedSrc) return;
    const figureHtml = buildSafeVideoFigureHtml(
      resolvedEmbedSrc,
      title.trim() || 'Video giới thiệu CIC Technology',
    );
    if (!figureHtml) return;
    onInsertHtml(figureHtml);
    onClose();
  };

  // Render via Portal outside parent <form> so Enter/buttons never accidentally submit the outer CMS form
  const modalNode = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cic-rich-youtube-modal-title"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
              <Video className="h-5 w-5" />
            </span>
            <div>
              <h3 id="cic-rich-youtube-modal-title" className="text-sm font-bold text-slate-900 dark:text-white">
                Nhúng Video YouTube / Vimeo (Chuẩn 16:9)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Dán đường dẫn YouTube, Shorts, Vimeo hoặc mã &lt;iframe&gt; nhúng trực tiếp
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
            aria-label="Đóng cửa sổ"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Link YouTube / Vimeo hoặc mã &lt;iframe&gt; <span className="text-orange-600">*</span>
            </label>
            <textarea
              rows={3}
              autoFocus
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  handleInsert();
                }
              }}
              placeholder={'VD: https://www.youtube.com/watch?v=... hoặc https://youtu.be/... hoặc <iframe src="https://www.youtube.com/embed/..."></iframe>'}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-xs text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            {rawInput.trim() ? (
              resolvedEmbedSrc ? (
                <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">URL chuẩn an toàn: {resolvedEmbedSrc}</span>
                </p>
              ) : (
                <p className="flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>Chưa nhận diện được link YouTube hoặc Vimeo hợp lệ. Vui lòng kiểm tra lại.</span>
                </p>
              )
            ) : null}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Tiêu đề mô tả Video (Tùy chọn — tốt cho SEO &amp; trợ năng)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  handleInsert();
                }
              }}
              placeholder="VD: Giới thiệu giải pháp chuyển đổi số & BIM chuyên sâu tại CIC"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          {resolvedEmbedSrc ? (
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-950 dark:border-slate-800">
              <iframe
                src={resolvedEmbedSrc}
                title={title.trim() || 'Xem trước Video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-3 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              disabled={!resolvedEmbedSrc}
              onClick={handleInsert}
              className="rounded-xl bg-orange-600 px-5 py-2 text-xs font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              Chèn Video vào nội dung
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined' && document.body) {
    return createPortal(modalNode, document.body);
  }
  return modalNode;
}
