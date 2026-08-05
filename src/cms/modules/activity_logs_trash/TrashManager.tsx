import React, { useState } from 'react';
import {
  Trash2,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

import {
  TrashedItem,
} from './types';


import { TrashTab } from './TrashTab';
import { TrashItemDetailDrawer } from './TrashItemDetailDrawer';
import { RestoreConflictModal } from './RestoreConflictModal';
import { PermanentDeleteModal } from './PermanentDeleteModal';

export const TrashManager: React.FC<{ data: TrashedItem[] }> = ({ data }) => {
  // State lists
  const [trashedItems, setTrashedItems] = useState<TrashedItem[]>(data);

  // Drawer / Modal states
  const [selectedTrashItem, setSelectedTrashItem] = useState<TrashedItem | null>(null);
  const [trashDetailOpen, setTrashDetailOpen] = useState(false);

  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [conflictItem, setConflictItem] = useState<TrashedItem | null>(null);

  const [permDeleteModalOpen, setPermDeleteModalOpen] = useState(false);
  const [permDeleteItem, setPermDeleteItem] = useState<TrashedItem | null>(null);

  // Toast message with optional Undo callback
  const [toast, setToast] = useState<{
    text: string;
    undoItem?: TrashedItem;
  } | null>(null);

  const showToast = (
    text: string,
    undoItem?: TrashedItem
  ) => {
    setToast({ text, undoItem });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  // Restore logic
  const handleRestoreItem = (item: TrashedItem, mode?: string) => {
    // If conflict and mode not provided, open conflict modal
    if (item.dependencyStatus !== 'clear' && !mode) {
      setConflictItem(item);
      setConflictModalOpen(true);
      return;
    }

    // Perform restore
    setTrashedItems((prev) => prev.filter((i) => i.id !== item.id));

    showToast(`Đã phục hồi thành công "${item.title}" về Bản nháp (Draft)!`);
  };

  // Permanent delete logic
  const handlePermanentDelete = (item: TrashedItem, reason: string) => {
    setTrashedItems((prev) => prev.filter((i) => i.id !== item.id));
    showToast(`Đã tiêu hủy vĩnh viễn "${item.title}". (Đã ghi vết nhật ký audit log)`);
  };

  const handleBulkRestore = (selectedIds: string[]) => {
    const toRestore = trashedItems.filter((i) => selectedIds.includes(i.id));
    setTrashedItems((prev) => prev.filter((i) => !selectedIds.includes(i.id)));
    showToast(`Đã khôi phục thành công ${toRestore.length} mục chọn từ Thùng rác!`);
  };

  const handleBulkDelete = (selectedIds: string[]) => {
    const toDelete = trashedItems.filter((i) => selectedIds.includes(i.id) && !i.isLegalHold);
    setTrashedItems((prev) => prev.filter((i) => !selectedIds.includes(i.id) || i.isLegalHold));
    showToast(`Đã tiêu hủy vĩnh viễn ${toDelete.length} mục đã chọn!`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* TOAST WITH UNDO OPTION */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="px-4 py-3 bg-slate-900 text-white border border-slate-800 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
            <span>{toast.text}</span>

            {toast.undoItem && (
              <button
                onClick={() => {
                  handleRestoreItem(toast.undoItem!);
                  setToast(null);
                }}
                className="ml-2 px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-[11px] rounded-lg cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Hoàn tác (Undo)</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* MODULE HEADER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-2xl shadow-md shadow-red-600/20 shrink-0">
            <Trash2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                QUẢN TRỊ HỆ THỐNG — RECYCLE BIN
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              Thùng rác & Phục hồi Dữ liệu (Recycle Bin)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Xử lý dữ liệu xóa mềm, thời hạn tự động tiêu hủy 30 ngày, chính sách Legal Hold & Phục hồi an toàn
            </p>
          </div>
        </div>
      </div>

      {/* TRASH TAB VIEW */}
      <TrashTab
        items={trashedItems}
        onOpenItemDetail={(item) => {
          setSelectedTrashItem(item);
          setTrashDetailOpen(true);
        }}
        onQuickRestore={(item) => handleRestoreItem(item)}
        onOpenPermanentDelete={(item) => {
          setPermDeleteItem(item);
          setPermDeleteModalOpen(true);
        }}
        onBulkRestore={handleBulkRestore}
        onBulkDelete={handleBulkDelete}
      />

      {/* MODALS & DRAWERS */}
      <TrashItemDetailDrawer
        isOpen={trashDetailOpen}
        onClose={() => setTrashDetailOpen(false)}
        item={selectedTrashItem}
        onRestore={(item) => {
          setTrashDetailOpen(false);
          handleRestoreItem(item);
        }}
        onPermanentDelete={(item) => {
          setTrashDetailOpen(false);
          setPermDeleteItem(item);
          setPermDeleteModalOpen(true);
        }}
      />

      <RestoreConflictModal
        isOpen={conflictModalOpen}
        onClose={() => setConflictModalOpen(false)}
        item={conflictItem}
        onConfirmRestore={(item, mode) => {
          setConflictModalOpen(false);
          handleRestoreItem(item, mode);
        }}
      />

      <PermanentDeleteModal
        isOpen={permDeleteModalOpen}
        onClose={() => setPermDeleteModalOpen(false)}
        item={permDeleteItem}
        onConfirmDelete={(item, reason) => {
          handlePermanentDelete(item, reason);
        }}
      />
    </div>
  );
};
