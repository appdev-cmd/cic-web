/* eslint-disable @next/next/no-img-element */
import { Download, FileText, X } from 'lucide-react';
import type { RefObject } from 'react';

import type { CmsLocale } from '../../data/CmsDataSource';
import { CmsButton } from '../../components/ui/CmsButton';
import type { MediaAsset } from './types';

export function MediaFolderDialog({ dialogRef, locale, folderName, onFolderNameChange, onClose, onSubmit }: { dialogRef: RefObject<HTMLDivElement | null>; locale: CmsLocale; folderName: string; onFolderNameChange: (name: string) => void; onClose: () => void; onSubmit: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Đóng hộp thoại" />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="media-folder-title" tabIndex={-1} className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <form onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
          <div className="flex items-start justify-between gap-4">
            <div><h2 id="media-folder-title" className="text-base font-bold text-slate-950 dark:text-white">Tạo thư mục mới</h2><p className="mt-1 text-xs text-slate-500">Thư mục được tạo trong workspace {locale.toUpperCase()} hiện tại.</p></div>
            <button type="button" onClick={onClose} className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Đóng"><X className="size-5" /></button>
          </div>
          <label className="mt-5 block text-xs font-bold text-slate-700 dark:text-slate-300" htmlFor="media-folder-name">Tên thư mục</label>
          <input id="media-folder-name" autoFocus value={folderName} onChange={(event) => onFolderNameChange(event.target.value)} maxLength={120} className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-950 sm:text-sm" />
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><CmsButton className="min-h-11" type="button" variant="secondary" onClick={onClose}>Hủy</CmsButton><CmsButton className="min-h-11" type="submit" disabled={!folderName.trim()}>Tạo thư mục</CmsButton></div>
        </form>
      </div>
    </div>
  );
}

export function MediaPreviewDialog({ dialogRef, asset, onClose }: { dialogRef: RefObject<HTMLDivElement | null>; asset: MediaAsset; onClose: () => void }) {
  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Xem trước Media" tabIndex={-1} className="fixed inset-0 z-50 overflow-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <button type="button" onClick={onClose} className="absolute right-4 top-4 z-10 flex min-h-11 min-w-11 items-center justify-center rounded-full text-white hover:bg-white/10" aria-label="Đóng xem trước Media"><X className="w-6 h-6" /></button>
      <div className="max-w-4xl max-h-[calc(100dvh-3rem)] text-center space-y-3 min-w-0">
        {asset.type === 'document' ? (
          <div className="p-12 bg-white rounded-2xl text-slate-900 max-w-md mx-auto">
            <FileText className="w-16 h-16 text-rose-500 mx-auto mb-3" />
            <h3 className="font-bold text-base mb-1">{asset.title}</h3>
            <p className="text-xs text-slate-500 font-mono mb-4">{asset.filename}</p>
            <a href={asset.url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5"><Download className="w-4 h-4" /> Tải tài liệu PDF</a>
          </div>
        ) : asset.type === 'video' ? (
          <video src={asset.url} controls autoPlay className="mx-auto max-h-[75dvh] max-w-full rounded-xl shadow-2xl" />
        ) : (
          <img src={asset.url} alt={asset.alt_text || asset.title} className="max-h-[75dvh] max-w-full mx-auto rounded-xl object-contain shadow-2xl" />
        )}
        <p className="break-words text-sm font-bold text-white">{asset.title}</p>
      </div>
    </div>
  );
}
