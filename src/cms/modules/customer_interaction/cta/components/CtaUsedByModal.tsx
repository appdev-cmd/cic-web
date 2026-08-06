import React from 'react';
import { X, Layers, ExternalLink, Globe, AlertTriangle } from 'lucide-react';
import { CtaItem } from '../types';

interface CtaUsedByModalProps {
  isOpen: boolean;
  cta: CtaItem | null;
  onClose: () => void;
}

export const CtaUsedByModal: React.FC<CtaUsedByModalProps> = ({
  isOpen,
  cta,
  onClose,
}) => {
  if (!isOpen || !cta) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Vị trí đang nhúng CTA
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-3 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 rounded-xl text-xs text-orange-800 dark:text-orange-300">
            CTA <strong className="font-bold">"{cta.adminName}"</strong> hiện đang được nhúng tại{' '}
            <span className="font-extrabold underline">{cta.usedByCount} vị trí</span> trên website.
          </div>

          {cta.usedByPages.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Chưa có trang nào nhúng nút CTA này.
            </div>
          ) : (
            <div className="space-y-2">
              {cta.usedByPages.map((page, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {page.pageTitle}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Vị trí: {page.placementKey}
                    </span>
                  </div>

                  <a
                    href={page.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] font-semibold text-orange-600 hover:text-orange-500 dark:text-orange-400 cursor-pointer"
                  >
                    <span>Xem trang</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
