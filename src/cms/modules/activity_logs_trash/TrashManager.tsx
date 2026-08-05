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
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';

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
    <div className="space-y-5 animate-in fade-in duration-200">
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

      <CmsPageHeader
        icon={<Trash2 />}
        title="Thùng rác"
        description="Khôi phục nội dung đã xóa hoặc xóa vĩnh viễn sau thời hạn lưu giữ."
        meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{trashedItems.length} mục</span>}
      />

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
