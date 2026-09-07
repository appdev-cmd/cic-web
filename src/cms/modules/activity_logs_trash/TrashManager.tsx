import React, { useCallback, useRef, useState, useTransition } from 'react';
import { AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import type { TrashItemViewModel, TrashListPage, TrashListQuery, TrashRestoreMode } from '@/features/trash/types';
import {
  bulkPurgeTrashItemsAction,
  bulkRestoreTrashItemsAction,
  getTrashDetailAction,
  getTrashPageAction,
  purgeTrashItemAction,
  restoreTrashItemAction,
} from '@/features/trash/server/actions';
import { TrashTab } from './TrashTab';
import { TrashItemDetailDrawer } from './TrashItemDetailDrawer';
import { RestoreConflictModal } from './RestoreConflictModal';
import { PermanentDeleteModal } from './PermanentDeleteModal';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';

type Toast = { text: string; tone: 'success' | 'error' };

export const TrashManager: React.FC<{
  data: TrashListPage;
  capabilities: { restore: boolean; purge: boolean };
}> = ({ data, capabilities }) => {
  const [pageData, setPageData] = useState(data);
  const [query, setQuery] = useState<TrashListQuery>(data.query);
  const [selectedTrashItem, setSelectedTrashItem] = useState<TrashItemViewModel | null>(null);
  const [trashDetailOpen, setTrashDetailOpen] = useState(false);
  const [conflictItem, setConflictItem] = useState<TrashItemViewModel | null>(null);
  const [permDeleteItem, setPermDeleteItem] = useState<TrashItemViewModel | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [isLoading, startLoading] = useTransition();
  const [isMutating, startMutation] = useTransition();
  const requestSequence = useRef(0);

  const showToast = useCallback((text: string, tone: Toast['tone']) => {
    setToast({ text, tone });
    window.setTimeout(() => setToast(null), 5000);
  }, []);

  const loadPage = useCallback((nextQuery: TrashListQuery) => {
    setQuery(nextQuery);
    const sequence = ++requestSequence.current;
    startLoading(async () => {
      try {
        const nextPage = await getTrashPageAction(nextQuery);
        if (sequence === requestSequence.current) setPageData(nextPage);
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Không thể tải danh sách Thùng rác.', 'error');
      }
    });
  }, [showToast]);

  const reloadCurrentPage = useCallback(async () => {
    const nextPage = await getTrashPageAction(query);
    setPageData(nextPage);
  }, [query]);

  const openDetail = (item: TrashItemViewModel) => {
    setSelectedTrashItem(item);
    setTrashDetailOpen(true);
    startLoading(async () => {
      try { setSelectedTrashItem(await getTrashDetailAction(item.id)); }
      catch (error) { setTrashDetailOpen(false); showToast(error instanceof Error ? error.message : 'Không thể tải chi tiết mục đã xóa.', 'error'); }
    });
  };

  const restoreItem = (item: TrashItemViewModel, mode?: TrashRestoreMode) => {
    if (item.dependencyStatus !== 'clear' && !mode) {
      setConflictItem(item);
      return;
    }
    startMutation(async () => {
      try {
        const result = await restoreTrashItemAction({ id: item.id, mode: mode ?? 'as_draft' });
        if (!result.ok) { showToast(result.message, 'error'); return; }
        setConflictItem(null); setTrashDetailOpen(false); showToast(result.message, 'success'); await reloadCurrentPage();
      } catch (error) { showToast(error instanceof Error ? error.message : 'Không thể phục hồi mục đã chọn.', 'error'); }
    });
  };

  const purgeItem = (item: TrashItemViewModel, reason: string) => {
    startMutation(async () => {
      try {
        const result = await purgeTrashItemAction({ id: item.id, reason });
        if (!result.ok) { showToast(result.message, 'error'); return; }
        setPermDeleteItem(null); setTrashDetailOpen(false); showToast(result.message, 'success'); await reloadCurrentPage();
      } catch (error) { showToast(error instanceof Error ? error.message : 'Không thể xóa vĩnh viễn mục đã chọn.', 'error'); }
    });
  };

  const summarizeBulk = (results: Awaited<ReturnType<typeof bulkRestoreTrashItemsAction>>, action: string) => {
    const succeeded = results.filter((result) => result.ok).length;
    const failed = results.length - succeeded;
    showToast(`${action}: ${succeeded} thành công${failed ? `, ${failed} thất bại` : ''}.`, failed ? 'error' : 'success');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {toast && (
        <div className="fixed inset-x-3 bottom-4 z-[70] flex justify-end sm:inset-x-auto sm:right-6 sm:bottom-6" role="status" aria-live="polite">
          <div className="flex max-w-lg items-start gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl">
            {toast.tone === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" /> : <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />}
            <span className="min-w-0 break-words">{toast.text}</span>
            <button type="button" onClick={() => setToast(null)} className="ml-auto min-h-8 shrink-0 rounded-lg px-2 text-slate-300 hover:bg-slate-800 hover:text-white">Ẩn</button>
          </div>
        </div>
      )}

      <CmsPageHeader
        icon={<Trash2 />}
        title="Thùng rác"
        description="Khôi phục nội dung đã xóa hoặc xóa vĩnh viễn sau thời hạn lưu giữ."
        meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{pageData.total} mục</span>}
      />

      <TrashTab
        page={pageData}
        query={query}
        isLoading={isLoading || isMutating}
        capabilities={capabilities}
        onQueryChange={loadPage}
        onOpenItemDetail={openDetail}
        onQuickRestore={restoreItem}
        onOpenPermanentDelete={setPermDeleteItem}
        onBulkRestore={(ids) => startMutation(async () => { try { const results = await bulkRestoreTrashItemsAction(ids); summarizeBulk(results, 'Phục hồi hàng loạt'); await reloadCurrentPage(); } catch (error) { showToast(error instanceof Error ? error.message : 'Không thể phục hồi hàng loạt.', 'error'); } })}
        onBulkDelete={(ids) => startMutation(async () => { try { const results = await bulkPurgeTrashItemsAction({ ids, reason: 'Xóa vĩnh viễn hàng loạt từ CMS' }); summarizeBulk(results, 'Xóa vĩnh viễn hàng loạt'); await reloadCurrentPage(); } catch (error) { showToast(error instanceof Error ? error.message : 'Không thể xóa vĩnh viễn hàng loạt.', 'error'); } })}
      />

      <TrashItemDetailDrawer
        isOpen={trashDetailOpen}
        onClose={() => setTrashDetailOpen(false)}
        item={selectedTrashItem}
        onRestore={(item) => restoreItem(item)}
        onPermanentDelete={(item) => { setTrashDetailOpen(false); setPermDeleteItem(item); }}
        canRestore={capabilities.restore}
        canPurge={capabilities.purge && Boolean(selectedTrashItem?.supportsPurge)}
      />
      <RestoreConflictModal
        key={conflictItem?.id ?? 'closed-conflict'}
        isOpen={Boolean(conflictItem)}
        onClose={() => setConflictItem(null)}
        item={conflictItem}
        onConfirmRestore={(item, mode) => restoreItem(item, mode)}
      />
      <PermanentDeleteModal
        key={permDeleteItem?.id ?? 'closed-purge'}
        isOpen={Boolean(permDeleteItem)}
        onClose={() => setPermDeleteItem(null)}
        item={permDeleteItem}
        onConfirmDelete={purgeItem}
      />
    </div>
  );
};
