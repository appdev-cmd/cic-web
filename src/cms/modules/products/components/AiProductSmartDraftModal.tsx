import React, { useState } from 'react';
import { X, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { CmsButton } from '@/shared/ui/cms/CmsButton';
import type { AiProductDraftResult } from '@/features/ai-operator/types';
import { generateSmartProductDraftAction } from '@/features/ai-operator/server/actions';

interface AiProductSmartDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceLocale: 'vi' | 'en';
  onDraftGenerated: (result: AiProductDraftResult) => void;
}

export const AiProductSmartDraftModal: React.FC<AiProductSmartDraftModalProps> = ({
  isOpen,
  onClose,
  workspaceLocale,
  onDraftGenerated,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [locale, setLocale] = useState<'vi' | 'en'>(workspaceLocale);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);
    setCurrentStep('Đang khởi tạo kết nối...');

    try {
      setCurrentStep('Đang đối chiếu cơ sở dữ liệu CIC và phân tích dữ liệu...');
      const result = await generateSmartProductDraftAction(inputPrompt, locale);
      onDraftGenerated(result);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo bản nháp cùng AI.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200/60 dark:border-orange-800/40">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Khởi tạo Sản phẩm cùng Smart CMS Operator
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Nhập tên/model hoặc bất kỳ thông tin nào bạn đang có
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body: Single input area */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Tên / Model sản phẩm kỹ thuật hoặc ghi chú đầu vào *
            </label>
            <textarea
              rows={4}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Ví dụ: ZWCAD 2027 Professional&#10;hoặc dán vài gạch đầu dòng tính năng, ghi chú kỹ sư..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition resize-none font-sans"
              autoFocus
            />
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
              <span>Nhấn Ctrl + Enter để tạo nhanh</span>
              <span>Chỉ hoàn thiện các mục có căn cứ từ input & DB</span>
            </div>
          </div>

          {/* Language selector */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Ngôn ngữ soạn thảo:
            </span>
            <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setLocale('vi')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  locale === 'vi'
                    ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Tiếng Việt (VI)
              </button>
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  locale === 'en'
                    ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                English (EN)
              </button>
            </div>
          </div>

          {/* Real Backend Progress Indicator */}
          {isLoading && (
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 p-3 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <Loader2 className="w-4 h-4 text-orange-600 animate-spin shrink-0" />
                <span>{currentStep}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6">
                Đang nạp taxonomy CIC, kiểm tra trùng alias và yêu cầu Qwen 30B cấu trúc hóa...
              </p>
            </div>
          )}

          {/* Error display */}
          {errorMsg && (
            <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3 flex items-start gap-2 text-xs text-rose-800 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Không thể tạo bản nháp</p>
                <p className="mt-0.5 text-[11px] text-rose-600 dark:text-rose-400">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <CmsButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy bỏ
            </CmsButton>
            <CmsButton
              type="submit"
              variant="primary"
              size="sm"
              disabled={!inputPrompt.trim() || isLoading}
              leadingIcon={isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            >
              {isLoading ? 'Đang phân tích...' : 'Bắt đầu tạo'}
            </CmsButton>
          </div>
        </form>
      </div>
    </div>
  );
};
