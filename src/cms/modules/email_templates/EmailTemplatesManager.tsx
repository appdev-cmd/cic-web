import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Check, Copy, Edit, Eye, FileText, Link2, MailCheck, Plus, Search, Trash2, X } from 'lucide-react';
import { CmsButton, CmsIconButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsPagination } from '../../components/ui/CmsPagination';
import { CmsSelectionCheckbox } from '../../components/ui/CmsSelectionCheckbox';
import { CmsTrashConfirmDialog } from '@/shared/ui/cms/CmsTrashConfirmDialog';
import { EmailTemplatesFormView } from './EmailTemplatesFormView';
import {
  EmailAudience,
  EmailEvent,
  EmailTemplate,
  EmailTemplateStatus,
  EMAIL_EVENTS,
  SAMPLE_VALUES,
  TEMPLATE_STATUSES,
} from './types';
import type { EmailUsageItem } from '@/features/email-templates/types';

interface Props {
  workspaceLocale: 'vi' | 'en';
  initialTemplates?: EmailTemplate[];
  onRefresh?: () => void;
  data?: { templates: EmailTemplate[] };
}

const renderSample = (value: string) =>
  Object.entries(SAMPLE_VALUES).reduce((text, [token, sample]) => text.split(token).join(sample), value);

export const EmailTemplatesManager: React.FC<Props> = ({
  workspaceLocale,
  initialTemplates,
  onRefresh,
  data,
}) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates || data?.templates || []);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editing, setEditing] = useState<EmailTemplate | null>(null);
  const [previewing, setPreviewing] = useState<EmailTemplate | null>(null);
  const [usageTemplate, setUsageTemplate] = useState<EmailTemplate | null>(null);
  const [usages, setUsages] = useState<EmailUsageItem[]>([]);
  const [loadingUsage, setLoadingUsage] = useState(false);
  const [query, setQuery] = useState('');
  const [event, setEvent] = useState<'all' | EmailEvent | string>('all');
  const [audience, setAudience] = useState<'all' | EmailAudience>('all');
  const [status, setStatus] = useState<'all' | EmailTemplateStatus>('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; tone: 'success' | 'error' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteTargets, setDeleteTargets] = useState<EmailTemplate[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (initialTemplates) {
      setTemplates(initialTemplates);
    }
  }, [initialTemplates]);

  const notify = (message: string, tone: 'success' | 'error' = 'success') => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3500);
  };

  const sanitizeErrorMessage = (error: unknown, fallback: string): string => {
    if (!error) return fallback;
    const msg = typeof error === 'string' ? error : (error as any)?.message || '';
    if (!msg) return fallback;
    const lower = msg.toLowerCase();
    if (lower.includes('unique') || lower.includes('duplicate') || lower.includes('already exists') || lower.includes('tồn tại')) {
      return 'Mẫu email cho sự kiện và đối tượng này đã tồn tại trong workspace.';
    }
    if (lower.includes('missing') || lower.includes('bắt buộc') || lower.includes('required')) {
      return 'Vui lòng điền đầy đủ các thông tin bắt buộc.';
    }
    if (lower.includes('permission') || lower.includes('quyền') || lower.includes('forbidden') || lower.includes('unauthorized')) {
      return 'Bạn không có quyền thực hiện thao tác này.';
    }
    if (lower.includes('postgres') || lower.includes('syntax') || lower.includes('relation') || lower.includes('internal server error')) {
      return 'Hệ thống gặp sự cố khi lưu dữ liệu. Vui lòng thử lại sau.';
    }
    if (msg.length < 90 && !msg.includes(';') && !msg.includes('{') && !msg.includes('at ')) {
      return msg;
    }
    return fallback;
  };

  const rows = useMemo(
    () =>
      templates.filter(
        (item) =>
          (!query.trim() || `${item.name} ${item.subject}`.toLowerCase().includes(query.toLowerCase().trim())) &&
          (event === 'all' || item.event === event) &&
          (audience === 'all' || item.audience === audience) &&
          (status === 'all' || item.status === status)
      ),
    [templates, query, event, audience, status]
  );

  const paginatedRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    const lastPage = Math.max(1, Math.ceil(rows.length / pageSize));
    if (currentPage > lastPage) setCurrentPage(lastPage);
  }, [currentPage, pageSize, rows.length]);

  // Load usage when usage modal opens
  useEffect(() => {
    if (usageTemplate) {
      setLoadingUsage(true);
      fetch(`/api/cms/email-templates/${usageTemplate.id}/usage`)
        .then((res) => (res.ok ? res.json() : { usages: [] }))
        .then((json) => setUsages(json.usages || []))
        .catch(() => setUsages([]))
        .finally(() => setLoadingUsage(false));
    } else {
      setUsages([]);
    }
  }, [usageTemplate]);

  const save = async (formData: Partial<EmailTemplate> & { publishNow?: boolean }) => {
    try {
      setActionLoading(true);
      const isPublished = Boolean(formData.publishNow || formData.status === 'active');
      if (editing) {
        const res = await fetch(`/api/cms/email-templates/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(sanitizeErrorMessage(err.error, 'Lỗi lưu mẫu email'));
        }
        notify(isPublished ? 'Đã lưu và xuất bản mẫu email thành công.' : 'Đã lưu bản nháp mẫu email.');
      } else {
        const res = await fetch('/api/cms/email-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, workspace: workspaceLocale }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(sanitizeErrorMessage(err.error, 'Lỗi tạo mẫu email'));
        }
        notify(isPublished ? 'Đã tạo và xuất bản mẫu email thành công.' : 'Đã tạo bản nháp mẫu email.');
      }
      setEditing(null);
      setView('list');
      onRefresh?.();
    } catch (err: any) {
      const friendlyMessage = sanitizeErrorMessage(err?.message, 'Không thể lưu mẫu email. Vui lòng thử lại.');
      notify(`Lỗi: ${friendlyMessage}`, 'error');
      throw new Error(friendlyMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const publishItem = async (item: EmailTemplate) => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/cms/email-templates/${item.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(sanitizeErrorMessage(err.error, 'Lỗi xuất bản mẫu email'));
      }
      notify('Đã xuất bản mẫu email thành công.');
      onRefresh?.();
    } catch (err: any) {
      const friendly = sanitizeErrorMessage(err?.message, 'Xuất bản thất bại.');
      notify(`Lỗi: ${friendly}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const duplicateItem = async (item: EmailTemplate) => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/cms/email-templates/${item.id}/duplicate`, {
        method: 'POST',
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(sanitizeErrorMessage(err.error, 'Lỗi nhân bản mẫu email'));
      }
      notify('Đã nhân bản mẫu email thành công.');
      onRefresh?.();
    } catch (err: any) {
      const friendly = sanitizeErrorMessage(err?.message, 'Nhân bản thất bại.');
      notify(`Lỗi: ${friendly}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmTrash = async () => {
    if (!deleteTargets.length) return;
    try {
      setIsDeleting(true);
      const ids = deleteTargets.map((i) => i.id);
      const res = await fetch('/api/cms/email-templates/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(sanitizeErrorMessage(err.error, 'Lỗi chuyển mẫu email vào Thùng rác'));
      }
      const count = ids.length;
      setTemplates((prev) => prev.filter((t) => !ids.includes(t.id)));
      setSelected((prev) => prev.filter((id) => !ids.includes(id)));
      setDeleteTargets([]);
      notify(
        count === 1
          ? `Đã chuyển mẫu email "${deleteTargets[0].name}" vào Thùng rác.`
          : `Đã chuyển ${count} mẫu email vào Thùng rác.`
      );
      onRefresh?.();
    } catch (err: any) {
      const friendly = sanitizeErrorMessage(err?.message, 'Không thể chuyển vào Thùng rác. Vui lòng thử lại.');
      notify(`Lỗi: ${friendly}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const pageIds = useMemo(() => paginatedRows.map((item) => item.id), [paginatedRows]);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
  const isPageIndeterminate = pageIds.some((id) => selected.includes(id)) && !allPageSelected;

  const handleToggleSelectAllPage = () => {
    if (allPageSelected) {
      setSelected((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelected((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  return (
    <div className="space-y-5">
      {/* Global Toast with high z-index, never obscured by form or dialogs */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold text-white shadow-2xl animate-in fade-in slide-in-from-bottom-3 ${
            toast.tone === 'error' ? 'bg-red-600 dark:bg-red-700' : 'bg-slate-900 dark:bg-slate-100 dark:text-slate-900'
          }`}
        >
          {toast.tone === 'error' ? (
            <AlertCircle className="size-4 text-white shrink-0" />
          ) : (
            <Check className="size-4 text-emerald-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {view === 'form' ? (
        <EmailTemplatesFormView
          templateToEdit={editing}
          workspaceLocale={workspaceLocale}
          onSave={save}
          onCancel={() => {
            setEditing(null);
            setView('list');
          }}
        />
      ) : (
        <>

      <CmsPageHeader
        icon={<MailCheck />}
        title="Mẫu email"
        description="Soạn và quản lý nội dung email. Biểu mẫu chọn mẫu cần gửi và tổng hợp nơi đang sử dụng."
        actions={
          <CmsButton
            variant="primary"
            size="sm"
            leadingIcon={<Plus />}
            onClick={() => {
              setEditing(null);
              setView('form');
            }}
          >
            Thêm mẫu email
          </CmsButton>
        }
      />

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="relative flex items-center md:col-span-5">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="size-4 text-slate-400" />
            </div>
            <span className="sr-only">Tìm mẫu email</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo tên hoặc tiêu đề..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <select
            aria-label="Lọc sự kiện"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 md:col-span-3"
          >
            <option value="all">Tất cả sự kiện</option>
            {EMAIL_EVENTS.map((item) => (
              <option value={item.value} key={item.value}>
                {workspaceLocale === 'vi' ? item.label : item.labelEn}
              </option>
            ))}
          </select>
          <select
            aria-label="Lọc đối tượng"
            value={audience}
            onChange={(e) => setAudience(e.target.value as typeof audience)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 md:col-span-2"
          >
            <option value="all">Mọi đối tượng</option>
            <option value="customer">Khách hàng</option>
            <option value="internal">Nội bộ</option>
          </select>
          <select
            aria-label="Lọc trạng thái"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 md:col-span-2"
          >
            <option value="all">Mọi trạng thái</option>
            <option value="active">Đã xuất bản</option>
            <option value="draft">Bản nháp</option>
          </select>
        </div>

        {selected.length > 0 && (
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
            <span>
              <strong>{selected.length}</strong> mẫu đã chọn
            </span>
            <CmsButton
              size="sm"
              variant="danger"
              onClick={() => {
                const toDelete = templates.filter((t) => selected.includes(t.id));
                setDeleteTargets(toDelete);
              }}
              disabled={actionLoading || isDeleting}
              leadingIcon={<Trash2 />}
            >
              Chuyển vào thùng rác ({selected.length})
            </CmsButton>
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="cms-data-table min-w-[980px] text-left">
            <thead>
              <tr>
                <th className="w-10 p-3 text-center">
                  <CmsSelectionCheckbox
                    checked={allPageSelected}
                    indeterminate={isPageIndeterminate}
                    onChange={handleToggleSelectAllPage}
                    label="Chọn tất cả trong trang"
                  />
                </th>
                <th className="min-w-[300px] p-3">Tên mẫu</th>
                <th className="w-48 p-3">Sự kiện</th>
                <th className="w-28 p-3">Đối tượng</th>
                <th className="w-32 p-3">Trạng thái</th>
                <th className="w-24 p-3">Phiên bản</th>
                <th className="w-40 p-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-sm text-slate-500">
                    Không có mẫu email phù hợp trong workspace này.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((item) => {
                  const eventInfo = EMAIL_EVENTS.find((option) => option.value === item.event);
                  const state = TEMPLATE_STATUSES[item.status] || {
                    label: item.status,
                    className: 'bg-slate-100 text-slate-700',
                  };
                  return (
                    <tr key={item.id}>
                      <td className="p-3 text-center">
                        <CmsSelectionCheckbox
                          checked={selected.includes(item.id)}
                          onChange={() =>
                            setSelected((ids) =>
                              ids.includes(item.id) ? ids.filter((id) => id !== item.id) : [...ids, item.id]
                            )
                          }
                          label={`Chọn ${item.name}`}
                        />
                      </td>
                      <td className="p-3">
                        <button
                          className="max-w-[420px] truncate text-left font-semibold text-slate-900 hover:text-orange-600 dark:text-white"
                          onClick={() => {
                            setEditing(item);
                            setView('form');
                          }}
                        >
                          {item.name}
                        </button>
                        <p className="mt-1 max-w-[420px] truncate text-[11px] text-slate-500">{item.subject}</p>
                      </td>
                      <td className="p-3 text-xs">
                        {eventInfo ? (workspaceLocale === 'vi' ? eventInfo.label : eventInfo.labelEn) : item.event}
                      </td>
                      <td className="p-3 text-xs">{item.audience === 'customer' ? 'Khách hàng' : 'Nội bộ'}</td>
                      <td className="p-3">
                        <span className={`rounded-md px-2 py-1 text-[11px] font-semibold ${state.className}`}>
                          {state.label}
                        </span>
                      </td>
                      <td className="p-3 text-xs">
                        v{item.version}
                        <button
                          className="ml-2 font-semibold text-orange-600 hover:underline"
                          onClick={() => setUsageTemplate(item)}
                        >
                          Nơi dùng
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-1">
                          <CmsIconButton
                            size="sm"
                            aria-label="Xem trước"
                            title="Xem trước"
                            icon={<Eye />}
                            onClick={() => setPreviewing(item)}
                          />
                          <CmsIconButton
                            size="sm"
                            aria-label="Xem nơi sử dụng"
                            title="Xem nơi sử dụng"
                            icon={<Link2 />}
                            onClick={() => setUsageTemplate(item)}
                          />
                          <CmsIconButton
                            size="sm"
                            aria-label="Nhân bản"
                            title="Nhân bản"
                            icon={<Copy />}
                            onClick={() => duplicateItem(item)}
                          />
                          <CmsIconButton
                            size="sm"
                            aria-label="Sửa"
                            title="Sửa"
                            icon={<Edit />}
                            onClick={() => {
                              setEditing(item);
                              setView('form');
                            }}
                          />
                          {item.status === 'draft' && (
                            <CmsIconButton
                              size="sm"
                              aria-label="Xuất bản"
                              title="Xuất bản"
                              icon={<Check />}
                              onClick={() => publishItem(item)}
                            />
                          )}
                          <CmsIconButton
                            size="sm"
                            variant="danger"
                            aria-label="Xóa"
                            title="Xóa mẫu email"
                            icon={<Trash2 />}
                            onClick={() => setDeleteTargets([item])}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <CmsPagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={rows.length}
          itemLabel="mẫu email"
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </section>

      {/* Modal Xem trước */}
      {previewing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="email-preview-title"
        >
          <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
            <header className="sticky top-0 flex items-start justify-between border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div>
                <p className="text-xs font-semibold text-orange-600">Xem trước bằng dữ liệu mẫu</p>
                <h2 id="email-preview-title" className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                  {renderSample(previewing.subject)}
                </h2>
              </div>
              <CmsIconButton aria-label="Đóng xem trước" icon={<X />} onClick={() => setPreviewing(null)} />
            </header>
            <div className="p-6 text-sm leading-7 text-slate-700 dark:text-slate-300">
              {/<[a-z][\s\S]*>/i.test(previewing.content) ? (
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: renderSample(previewing.content) }}
                />
              ) : (
                <div className="whitespace-pre-wrap font-sans">{renderSample(previewing.content)}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Nơi sử dụng */}
      {usageTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="email-usage-title"
        >
          <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
            <header className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div>
                <p className="text-xs font-semibold text-orange-600">Nơi sử dụng</p>
                <h2 id="email-usage-title" className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                  {usageTemplate.name}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Biểu mẫu / Nút CTA đang cấu hình liên kết với mẫu email này
                </p>
              </div>
              <CmsIconButton
                aria-label="Đóng nơi sử dụng"
                icon={<X />}
                onClick={() => setUsageTemplate(null)}
              />
            </header>
            <div className="space-y-3 p-5">
              {loadingUsage ? (
                <div className="p-8 text-center text-sm text-slate-500">Đang tra cứu nơi sử dụng...</div>
              ) : usages.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">
                  Mẫu email này chưa được liên kết trực tiếp trong Biểu mẫu hoặc CTA nào.
                </div>
              ) : (
                usages.map((u) => (
                  <article
                    key={`${u.type}-${u.id}`}
                    className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/40">
                        <FileText className="size-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{u.name}</h3>
                        <p className="text-xs text-slate-500">
                          {u.type === 'form' ? 'Biểu mẫu tương tác' : 'Nút kêu gọi hành động (CTA)'}
                        </p>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác nhận chuyển vào Thùng rác dùng chung */}
      <CmsTrashConfirmDialog
        open={deleteTargets.length > 0}
        title={deleteTargets.length > 1 ? `Chuyển ${deleteTargets.length} mẫu email vào Thùng rác` : 'Chuyển mẫu email vào Thùng rác'}
        description="Mẫu email sẽ được chuyển vào Thùng rác và có thể khôi phục lại khi cần thiết."
        itemName={
          deleteTargets.length > 1
            ? `${deleteTargets.length} mẫu email đã chọn (${deleteTargets.slice(0, 2).map((i) => i.name).join(', ')}${deleteTargets.length > 2 ? '...' : ''})`
            : (deleteTargets[0]?.name ?? '')
        }
        busy={isDeleting}
        onClose={() => setDeleteTargets([])}
        onConfirm={() => void handleConfirmTrash()}
      />
        </>
      )}
    </div>
  );
};
