import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Search, Globe, ChevronDown, Check, Loader2, AlertCircle } from 'lucide-react';
import type { ProductAiActionType } from '@/features/ai-operator/types';
import { runProductAiAction } from '@/features/ai-operator/server/actions';

interface AiActionsDropdownProps {
  currentProduct: Record<string, unknown>;
  workspaceLocale: 'vi' | 'en';
  onApplyUpdates: (updates: Record<string, unknown>, explanation: string) => void;
}

export const AiActionsDropdown: React.FC<AiActionsDropdownProps> = ({
  currentProduct,
  workspaceLocale,
  onApplyUpdates,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelectAction = async (actionType: ProductAiActionType) => {
    setIsOpen(false);
    setIsLoading(true);
    setActiveAction(actionType);

    try {
      const result = await runProductAiAction({
        actionType,
        currentProduct,
        locale: workspaceLocale,
      });
      onApplyUpdates(result.updatedFields, result.explanation);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Có lỗi xảy ra khi thực hiện tác vụ AI.');
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  const isEn = workspaceLocale === 'en';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-200 dark:border-orange-800/60 bg-orange-50/60 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 text-xs font-semibold hover:bg-orange-100/70 transition-colors shadow-2xs cursor-pointer"
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
        )}
        <span>{isLoading ? 'Đang phân tích...' : '✦ AI Actions'}</span>
        <ChevronDown className="w-3 h-3 text-orange-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-60 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl z-50 py-1 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
            Tác vụ thông minh trên sản phẩm
          </div>

          <button
            type="button"
            onClick={() => handleSelectAction('optimize_seo')}
            className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-orange-500" />
            <div>
              <p className="font-semibold">Tạo / Tối ưu thẻ SEO</p>
              <p className="text-[10px] text-slate-400">Sinh lại Title & Description chuẩn Google</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectAction('complete_missing')}
            className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <div>
              <p className="font-semibold">Hoàn thiện phần còn thiếu</p>
              <p className="text-[10px] text-slate-400">Tự điền các ô trống từ dữ liệu hiện có</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectAction('sync_translation')}
            className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer border-t border-slate-100 dark:border-slate-800"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-500" />
            <div>
              <p className="font-semibold">
                {isEn ? 'Dịch sang Tiếng Việt (VI)' : 'Tạo bản dịch Tiếng Anh (EN)'}
              </p>
              <p className="text-[10px] text-slate-400">Giữ thuật ngữ chuyên ngành BIM/CAD</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
