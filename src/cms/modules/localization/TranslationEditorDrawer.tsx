import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Save,
  Send,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  History,
  Info,
  Sparkles,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Lock,
  Eye,
} from 'lucide-react';

import { StaffUser, TranslationItem, TranslationStatus } from './types';
import { extractPlaceholders, validatePlaceholders } from './utils';
import { MOCK_LOCALIZATION_STAFF } from './mockData';

interface TranslationEditorDrawerProps {
  isOpen: boolean;
  item: TranslationItem | null;
  onClose: () => void;
  currentUserId: string;
  onSaveDraft: (itemId: string, targetText: string) => void;
  onSubmitReview: (itemId: string, targetText: string) => void;
  onComplete: (itemId: string, targetText: string) => void;
  onReturnReview: (itemId: string, reason: string) => void;
  onNavigateNextIncomplete: (direction: 'prev' | 'next') => void;
  onOpenSourceDiff: (item: TranslationItem) => void;
}

export const TranslationEditorDrawer: React.FC<TranslationEditorDrawerProps> = ({
  isOpen,
  item,
  onClose,
  currentUserId,
  onSaveDraft,
  onSubmitReview,
  onComplete,
  onReturnReview,
  onNavigateNextIncomplete,
  onOpenSourceDiff,
}) => {
  const [targetText, setTargetText] = useState<string>('');
  const [commentText, setCommentText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'editor' | 'context' | 'history'>('editor');
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('');

  useEffect(() => {
    if (item) {
      setTargetText(item.target_text || '');
      setCommentText('');
      setIsReturnModalOpen(false);
    }
  }, [item]);

  // Keyboard shortcut listener inside editor (Ctrl/Cmd+S for save draft)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !item) return;

      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        onSaveDraft(item.id, targetText);
      }
      if (e.altKey && e.key === 'ArrowDown') {
        e.preventDefault();
        onNavigateNextIncomplete('next');
      }
      if (e.altKey && e.key === 'ArrowUp') {
        e.preventDefault();
        onNavigateNextIncomplete('prev');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, item, targetText, onSaveDraft, onNavigateNextIncomplete]);

  if (!isOpen || !item) return null;

  const placeholders = extractPlaceholders(item.source_text);
  const { validations, hasIssue } = validatePlaceholders(item.source_text, targetText, item.placeholders);

  const handleInsertToken = (token: string) => {
    setTargetText((prev) => prev + ' ' + token);
  };

  const handleConfirmReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnReason.trim()) return;
    onReturnReview(item.id, returnReason);
    setIsReturnModalOpen(false);
    setReturnReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
        
        {/* 1. DRAWER HEADER */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-slate-900 dark:text-slate-100">
                  {item.key}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded">
                  {item.module_name}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                <span>Cặp ngôn ngữ: <b>VI (Tiếng Việt) → EN (English)</b></span>
                <span>•</span>
                <span>Phụ trách: <b>{item.assignee_name || 'Chưa phân công'}</b></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Previous / Next incomplete buttons */}
            <div className="flex items-center gap-1 border border-slate-300 dark:border-slate-700 rounded-xl p-0.5 bg-white dark:bg-slate-900">
              <button
                onClick={() => onNavigateNextIncomplete('prev')}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 cursor-pointer"
                title="Chuỗi chưa hoàn thành trước (Alt + Up)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigateNextIncomplete('next')}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 cursor-pointer"
                title="Chuỗi chưa hoàn thành tiếp theo (Alt + Down)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. TAB SUB-HEADER */}
        <div className="px-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 text-xs font-bold bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('editor')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'editor'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Trình biên soạn (Source - Target)
          </button>
          <button
            onClick={() => setActiveTab('context')}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'context'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Ngữ cảnh & Screenshot</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Lịch sử & Thảo luận ({item.comments.length})</span>
          </button>
        </div>

        {/* 3. MAIN EDITOR CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* OUTDATED WARNING BANNER */}
          {item.status === 'outdated' && (
            <div className="p-4 bg-orange-50 dark:bg-orange-950/40 border border-orange-300 dark:border-orange-800 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-orange-900 dark:text-orange-200">
                    Bản nguồn tiếng Việt vừa thay đổi!
                  </span>
                  <p className="text-orange-700 dark:text-orange-300 mt-0.5">
                    Hãy kiểm tra sự thay đổi giữa bản nguồn cũ và mới để rebase lại bản dịch tiếng Anh.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onOpenSourceDiff(item)}
                className="px-3 py-1.5 bg-orange-600 text-white font-bold text-xs rounded-xl hover:bg-orange-700 transition-colors cursor-pointer shrink-0"
              >
                So sánh Diff Nguồn
              </button>
            </div>
          )}

          {/* CONTENT ITEM SHARED FIELDS READ-ONLY NOTICE */}
          {item.is_shared_field && (
            <div className="p-4 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-2xl flex items-start gap-3 text-xs">
              <Lock className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sky-900 dark:text-sky-200">
                  Phân biệt Dữ liệu Dùng Chung (Shared) vs Localized Field:
                </span>
                <p className="text-sky-700 dark:text-sky-300 mt-1 leading-relaxed">
                  {item.shared_field_info ||
                    'Dữ liệu dùng chung (Tác giả, Ngày tạo, SKU, Giá, Danh mục) được sửa trực tiếp tại Module Nguồn. Form này bảo toàn cấu trúc dữ liệu chung và chỉ cho phép dịch các trường Localized (Tiêu đề, Tóm tắt, Nội dung EN).'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* SOURCE PANEL (VI - READ-ONLY) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Bản nguồn Tiếng Việt (VI Source - Read Only)
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Updated: {item.source_updated_at}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3 min-h-[220px]">
                  <p className="text-xs text-slate-900 dark:text-slate-100 font-medium leading-relaxed whitespace-pre-wrap">
                    {item.source_text}
                  </p>

                  {item.previous_source_text && item.status === 'outdated' && (
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 space-y-1">
                      <span className="font-bold text-amber-600 dark:text-amber-400">Nguồn cũ trước khi sửa:</span>
                      <p className="line-through italic text-slate-400">
                        {item.previous_source_text}
                      </p>
                    </div>
                  )}
                </div>

                {/* Token Checklist from Source */}
                {placeholders.length > 0 && (
                  <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl space-y-1.5 border border-slate-200 dark:border-slate-700">
                    <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center justify-between">
                      <span>Mẫu Token / Placeholder phát hiện trong Nguồn:</span>
                      <span className="text-[10px] text-slate-400">Nhấn để chèn nhanh</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {placeholders.map((token) => (
                        <button
                          key={token}
                          type="button"
                          onClick={() => handleInsertToken(token)}
                          className="px-2 py-1 text-xs font-mono font-bold bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 hover:bg-orange-200 rounded-lg transition-colors cursor-pointer"
                        >
                          + {token}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* TARGET PANEL (EN - EDITABLE) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Bản dịch Tiếng Anh (Target EN)
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {targetText.length} ký tự
                  </span>
                </div>

                <div className="space-y-2">
                  <textarea
                    rows={8}
                    value={targetText}
                    onChange={(e) => setTargetText(e.target.value)}
                    placeholder="Nhập nội dung bản dịch tiếng Anh chuẩn xác..."
                    className="w-full text-xs p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 outline-none leading-relaxed shadow-2xs font-sans"
                  />

                  {/* Real-time Token Validation Checklist */}
                  {validations.length > 0 && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                      <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        Kiểm tra bảo toàn Token Placeholder:
                      </div>
                      <div className="space-y-1">
                        {validations.map((v) => (
                          <div key={v.token} className="flex items-center justify-between text-xs font-mono">
                            <span className="text-slate-700 dark:text-slate-300">{v.token}</span>
                            {v.isPresent ? (
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                                <Check className="w-3.5 h-3.5" />
                                Đã có trong bản dịch
                              </span>
                            ) : (
                              <span className="text-rose-500 font-bold flex items-center gap-1 text-[11px]">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Thiếu trong bản dịch
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {hasIssue && (
                    <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Cảnh báo: Bản dịch đang thiếu token placeholder bắt buộc. Vui lòng bổ sung trước khi hoàn thành.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CONTEXT TAB */}
          {activeTab === 'context' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Thông tin ngữ cảnh hiển thị
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="font-bold text-slate-400 block mb-1">Module / Path:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                      {item.module_name} ({item.scope})
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 block mb-1">Màn hình / Vị trí UI:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      {item.screen_usage || 'Chưa khai báo chi tiết'}
                    </span>
                  </div>
                </div>

                {item.context_description && (
                  <div>
                    <span className="font-bold text-slate-400 block mb-1">Ghi chú ngữ cảnh dịch:</span>
                    <p className="text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      {item.context_description}
                    </p>
                  </div>
                )}
              </div>

              {item.screenshot_url && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">
                    Hình ảnh chụp màn hình giao diện (Screenshot Reference):
                  </span>
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-80 bg-slate-900">
                    <img
                      src={item.screenshot_url}
                      alt="UI Context"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HISTORY & DISCUSSIONS TAB */}
          {activeTab === 'history' && (
            <div className="space-y-6 text-xs">
              {/* Timeline Events */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider text-slate-400">
                  Lịch sử thay đổi bản dịch
                </h4>
                <div className="space-y-2 border-l-2 border-slate-200 dark:border-slate-800 pl-4 ml-2">
                  {item.history.map((h) => (
                    <div key={h.id} className="relative space-y-1 pb-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 absolute -left-[21px] top-1" />
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{h.actor_name}</span>
                        <span className="font-mono text-slate-400">{h.timestamp}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{h.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments Thread */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider text-slate-400">
                  Thảo luận nội bộ ({item.comments.length})
                </h4>

                <div className="space-y-3">
                  {item.comments.map((c) => (
                    <div key={c.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={c.author_avatar} alt={c.author_name} className="w-5 h-5 rounded-full" />
                          <span className="font-bold text-slate-800 dark:text-slate-200">{c.author_name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{c.created_at}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 pl-7">{c.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* 4. STICKY ACTIONS FOOTER */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              Mẹo: Phím <b>Ctrl + S</b> để lưu Nháp | <b>Alt + ↓/↑</b> để chuyển mục tiếp theo
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Save Draft Button */}
            <button
              onClick={() => onSaveDraft(item.id, targetText)}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4 text-slate-500" />
              <span>Lưu Nháp (Draft)</span>
            </button>

            {/* Submit Review Button */}
            <button
              onClick={() => onSubmitReview(item.id, targetText)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Gửi Review</span>
            </button>

            {/* Return Button (Reviewer Action) */}
            <button
              onClick={() => setIsReturnModalOpen(true)}
              className="px-4 py-2 bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 hover:bg-rose-200 font-bold rounded-xl transition-colors cursor-pointer"
            >
              Trả lại (Return)
            </button>

            {/* Approve & Complete Button */}
            <button
              onClick={() => onComplete(item.id, targetText)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Duyệt & Hoàn thành</span>
            </button>
          </div>
        </div>

        {/* RETURN REASON MODAL OVERLAY */}
        {isReturnModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Trả lại bản dịch yêu cầu chỉnh sửa</span>
                </h3>
                <button onClick={() => setIsReturnModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                Nhập lý do phản hồi bắt buộc gửi tới Translator để chỉnh sửa lại bản dịch:
              </p>

              <textarea
                rows={4}
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="Ví dụ: Bản dịch chưa chính xác thuật ngữ chuyên ngành CAD/BIM..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-rose-500"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsReturnModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmReturn}
                  className="px-4 py-1.5 bg-rose-600 text-white font-bold rounded-xl text-xs hover:bg-rose-700"
                >
                  Xác nhận Trả lại
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
