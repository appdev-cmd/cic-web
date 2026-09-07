'use client';

import React, { useEffect, useRef } from 'react';
import { Trash2, X } from 'lucide-react';
import { CmsButton, CmsIconButton } from './CmsButton';

interface CmsTrashConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  itemName: string;
  busy?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CmsTrashConfirmDialog({ open, title, description, itemName, busy = false, onClose, onConfirm }: CmsTrashConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) onClose();
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) return;
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKeyDown); };
  }, [busy, onClose, open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}>
      <div ref={dialogRef} role="alertdialog" aria-modal="true" aria-labelledby="cms-trash-confirm-title" aria-describedby="cms-trash-confirm-description" tabIndex={-1} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl outline-none dark:border-slate-800 dark:bg-slate-900">
        <header className="flex items-start gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300"><Trash2 className="size-5" /></span>
          <div className="min-w-0 flex-1"><h2 id="cms-trash-confirm-title" className="text-base font-bold text-slate-950 dark:text-white">{title}</h2><p id="cms-trash-confirm-description" className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{description}</p></div>
          <CmsIconButton aria-label="Đóng xác nhận xóa" icon={<X />} onClick={onClose} disabled={busy} />
        </header>
        <div className="p-4"><p className="break-words rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold text-slate-900 dark:bg-slate-800 dark:text-white">{itemName}</p><p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">Mục này sẽ xuất hiện trong Thùng rác và chỉ được phục hồi về trạng thái an toàn.</p></div>
        <footer className="flex flex-col-reverse gap-2 border-t border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:justify-end"><CmsButton onClick={onClose} disabled={busy}>Hủy</CmsButton><CmsButton variant="danger" leadingIcon={<Trash2 />} onClick={onConfirm} disabled={busy}>{busy ? 'Đang chuyển...' : 'Chuyển vào Thùng rác'}</CmsButton></footer>
      </div>
    </div>
  );
}
