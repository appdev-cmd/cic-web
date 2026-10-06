import React, { useState, useTransition } from 'react';
import { AlertTriangle, Edit3, ExternalLink, Link2, RotateCw, X } from 'lucide-react';
import { useCmsToast } from '@/cms/context/CmsToastContext';
import { CmsButton } from '@/shared/ui/cms/CmsButton';
import { CmsDeleteConfirmModal } from '@/shared/ui/cms/CmsDeleteConfirmModal';
import {
  saveRedirect,
  toggleRedirect,
  deleteRedirect,
} from '@/features/function-seo/server/actions';
import type { FunctionSeoRecord, RedirectRule } from '@/features/function-seo/types';
import { inputClass } from './functionSeoUtils';

export interface RedirectWorkspaceTabProps {
  records: FunctionSeoRecord[];
  initialRedirects?: RedirectRule[];
  canEdit?: boolean;
  onNotify?: (msg: string) => void;
}

export function RedirectWorkspaceTab({
  records,
  initialRedirects = [],
  canEdit = true,
  onNotify,
}: RedirectWorkspaceTabProps) {
  const { toast } = useCmsToast();
  const [redirects, setRedirects] = useState<RedirectRule[]>(initialRedirects);
  const [showForm, setShowForm] = useState(false);
  const [sourcePath, setSourcePath] = useState('');
  const [targetPath, setTargetPath] = useState('');
  const [redirectType, setRedirectType] = useState<'301' | '302'>('301');
  const [note, setNote] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const [deletingRedirect, setDeletingRedirect] = useState<RedirectRule | null>(null);

  const saveRedirectHandler = () => {
    const from = sourcePath.trim();
    const to = targetPath.trim();
    if (!from || !to) return setError('Vui lòng nhập đủ URL cũ và URL đích.');
    if (from === to) return setError('URL cũ và URL đích không được giống nhau.');
    if (from.startsWith('//') || to.startsWith('//')) {
      return setError('URL không được bắt đầu bằng // (protocol-relative URL).');
    }
    if (!from.startsWith('/') && !/^https?:\/\//i.test(from)) {
      return setError('URL cũ phải bắt đầu bằng / hoặc http(s)://');
    }
    if (!to.startsWith('/') && !/^https?:\/\//i.test(to)) {
      return setError('URL đích phải bắt đầu bằng / hoặc http(s)://');
    }

    setError('');
    startTransition(async () => {
      try {
        const res = await saveRedirect({
          id: editingId ?? undefined,
          sourcePath: from,
          targetPath: to,
          statusCode: redirectType === '302' ? 302 : 301,
          source: 'Thủ công',
          isActive: true,
          note: note || undefined,
        });

        if (editingId) {
          setRedirects((curr) =>
            curr.map((r) =>
              r.id === editingId
                ? { ...r, from, to, type: redirectType, note }
                : r
            )
          );
          onNotify?.('Cập nhật quy tắc chuyển hướng thành công.');
        } else {
          setRedirects((curr) => [
            {
              id: res.id ?? Date.now(),
              from,
              to,
              type: redirectType,
              source: 'Thủ công',
              active: true,
              hitCount: 0,
              note,
            },
            ...curr,
          ]);
          onNotify?.('Tạo quy tắc chuyển hướng thành công.');
        }

        setSourcePath('');
        setTargetPath('');
        setNote('');
        setEditingId(null);
        setShowForm(false);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Có lỗi khi lưu redirect.');
      }
    });
  };

  const handleToggle = (redirect: RedirectRule) => {
    startTransition(async () => {
      try {
        await toggleRedirect(redirect.id, !redirect.active);
        setRedirects((curr) =>
          curr.map((r) => (r.id === redirect.id ? { ...r, active: !r.active } : r))
        );
        onNotify?.(`Đã ${!redirect.active ? 'bật' : 'tắt'} chuyển hướng.`);
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Không thể thay đổi trạng thái.');
      }
    });
  };

  const handleDelete = (redirect: RedirectRule) => {
    setDeletingRedirect(redirect);
  };

  const handleConfirmDeleteRedirect = () => {
    if (!deletingRedirect) return;
    const id = deletingRedirect.id;
    startTransition(async () => {
      try {
        await deleteRedirect(id);
        setRedirects((curr) => curr.filter((r) => r.id !== id));
        onNotify?.('Đã xóa quy tắc chuyển hướng.');
        setDeletingRedirect(null);
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Không thể xóa redirect.');
      }
    });
  };

  const indexableCount = records.filter((record) => record.indexable).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-sm font-bold text-slate-950 dark:text-white">Danh sách Chuyển hướng URL (Redirects)</h2>
          <p className="mt-1 text-xs text-slate-500">
            Tự động chuyển hướng từ URL cũ sang URL mới. Tích hợp thuật toán chống vòng lặp (Redirect loop detection).
          </p>
        </div>
        {canEdit && (
          <CmsButton
            size="sm"
            leadingIcon={<Link2 className="size-4" />}
            onClick={() => {
              setEditingId(null);
              setSourcePath('');
              setTargetPath('');
              setNote('');
              setRedirectType('301');
              setError('');
              setShowForm((value) => !value);
            }}
          >
            Thêm redirect mới
          </CmsButton>
        )}
      </div>

      {showForm && (
        <div className="space-y-3 rounded-xl border border-orange-200 bg-orange-50/60 p-4 dark:border-orange-900/60 dark:bg-orange-950/20">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 sm:items-end">
            <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>URL cũ (Nguồn)</span>
              <input
                value={sourcePath}
                onChange={(e) => {
                  setSourcePath(e.target.value);
                  setError('');
                }}
                placeholder="/san-pham-cu.html"
                className={inputClass}
              />
            </label>
            <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>URL mới (Đích)</span>
              <input
                value={targetPath}
                onChange={(e) => {
                  setTargetPath(e.target.value);
                  setError('');
                }}
                placeholder="/products"
                className={inputClass}
              />
            </label>
            <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Loại mã HTTP</span>
              <select
                value={redirectType}
                onChange={(e) => setRedirectType(e.target.value as '301' | '302')}
                className={inputClass}
              >
                <option value="301">301 (Vĩnh viễn - Khuyên dùng)</option>
                <option value="302">302 (Tạm thời)</option>
              </select>
            </label>
            <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Ghi chú lý do</span>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="VD: Đổi cấu trúc link"
                className={inputClass}
              />
            </label>
          </div>

          {/^https?:\/\//i.test(targetPath.trim()) && (
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-2.5 text-xs font-medium text-amber-800 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/50 dark:text-amber-300">
              <ExternalLink className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                <strong>Cảnh báo External Redirect:</strong> URL đích đang trỏ ra ngoài tên miền website ({targetPath.trim()}). Vui lòng đảm bảo liên kết đích an toàn và chính xác.
              </span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-2 text-xs font-semibold text-rose-700 border border-rose-200">
              <AlertTriangle className="size-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <CmsButton
              size="sm"
              variant="secondary"
              onClick={() => {
                setShowForm(false);
                setError('');
              }}
            >
              Hủy
            </CmsButton>
            <CmsButton size="sm" onClick={saveRedirectHandler} disabled={isPending}>
              {isPending ? (
                <span className="flex items-center gap-1.5">
                  <RotateCw className="size-3.5 animate-spin" /> Đang lưu...
                </span>
              ) : editingId ? (
                'Cập nhật'
              ) : (
                'Lưu quy tắc'
              )}
            </CmsButton>
          </div>
        </div>
      )}

      {/* Redirects Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full min-w-[800px] text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/70">
            <tr>
              <th className="px-4 py-3">URL cũ (Nguồn)</th>
              <th className="px-4 py-3">URL mới (Đích)</th>
              <th className="px-4 py-3">Loại</th>
              <th className="px-4 py-3">Nguồn</th>
              <th className="px-4 py-3">Số lần chuyển</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {redirects.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  Chưa có quy tắc chuyển hướng nào trong cơ sở dữ liệu.
                </td>
              </tr>
            ) : (
              redirects.map((redirect) => (
                <tr key={redirect.id}>
                  <td className="px-4 py-3 font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {redirect.from}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate max-w-[280px]" title={redirect.to}>{redirect.to}</span>
                      {/^https?:\/\//i.test(redirect.to) && (
                        <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-sans text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 shrink-0" title="Chuyển hướng ra ngoài website (External Domain)">
                          <ExternalLink className="size-2.5" />
                          Ext
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-1.5 py-0.5 font-bold ${
                        redirect.type === '301'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                      }`}
                    >
                      {redirect.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{redirect.source}</td>
                  <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                    {redirect.hitCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-semibold ${
                        redirect.active
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {redirect.active ? 'Hoạt động' : 'Tạm tắt'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {canEdit && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(redirect.id);
                              setSourcePath(redirect.from);
                              setTargetPath(redirect.to);
                              setRedirectType(redirect.type);
                              setNote(redirect.note ?? '');
                              setShowForm(true);
                              setError('');
                            }}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-orange-600 dark:hover:bg-slate-800 cursor-pointer"
                            aria-label="Sửa redirect"
                          >
                            <Edit3 className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggle(redirect)}
                            className="rounded-lg px-2 py-1 font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            {redirect.active ? 'Tắt' : 'Bật'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(redirect)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 cursor-pointer"
                            aria-label="Xóa redirect"
                          >
                            <X className="size-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Dynamic Sitemap Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <p className="text-sm font-bold text-slate-950 dark:text-white">Sơ đồ trang web (Sitemap XML)</p>
          <p className="mt-1 text-xs text-slate-500">
            {indexableCount} module hệ thống và toàn bộ bài viết, sản phẩm, trang tĩnh đã xuất bản đủ điều kiện lập chỉ mục.
          </p>
        </div>
        <a
          href="/sitemap.xml"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 transition-colors"
        >
          <ExternalLink className="size-3.5" />
          <span>Mở sitemap.xml</span>
        </a>
      </div>

      <CmsDeleteConfirmModal
        isOpen={Boolean(deletingRedirect)}
        title="Xóa quy tắc chuyển hướng"
        itemName={deletingRedirect ? `${deletingRedirect.from} → ${deletingRedirect.to}` : ''}
        description="Bạn có chắc chắn muốn xóa quy tắc chuyển hướng URL này? URL cũ sẽ không còn tự động chuyển hướng sang URL mới."
        confirmLabel="Xóa quy tắc"
        cancelLabel="Hủy bỏ"
        isPending={isPending}
        onClose={() => setDeletingRedirect(null)}
        onConfirm={handleConfirmDeleteRedirect}
      />
    </div>
  );
}
