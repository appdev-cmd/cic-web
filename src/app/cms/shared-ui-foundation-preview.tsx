'use client';

import { LayoutGrid, Plus, Save } from 'lucide-react';
import { useState } from 'react';

import {
  CmsButton,
  CmsField,
  CmsInput,
  CmsPageHeader,
  CmsPagination,
  CmsSelect,
  CmsSelectionCheckbox,
  CmsTableEmptyState,
  CmsTableShell,
  CmsTabs,
  CmsTextarea,
  SearchableSelect,
} from '@/shared/ui/cms';

const selectOptions = [
  { id: 'published', label: 'Đã xuất bản' },
  { id: 'draft', label: 'Bản nháp' },
];

type PreviewTab = 'components' | 'states';

export function SharedUiFoundationPreview() {
  const [tab, setTab] = useState<PreviewTab>('components');
  const [selectedId, setSelectedId] = useState('published');
  const [checked, setChecked] = useState(false);
  const [page, setPage] = useState(1);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 p-4 sm:p-6 lg:p-8">
      <CmsPageHeader
        icon={<LayoutGrid />}
        title="Shared UI Foundation"
        description="Bề mặt kiểm tra tạm thời cho các primitive dùng chung; chưa phải màn hình CMS nghiệp vụ."
        actions={<CmsButton variant="primary" leadingIcon={<Plus />}>Tạo mới</CmsButton>}
      />

      <CmsTabs<PreviewTab>
        ariaLabel="Nhóm component nền"
        value={tab}
        onChange={setTab}
        items={[
          { id: 'components', label: 'Thành phần', count: 8 },
          { id: 'states', label: 'Trạng thái', count: 4 },
        ]}
      />

      <section className="grid gap-5 lg:grid-cols-2" aria-label="Form và action primitives">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
          <h2 className="text-base font-bold text-slate-900">Form controls</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CmsField id="shared-name" label="Tên hiển thị" required>
              <CmsInput id="shared-name" defaultValue="CIC Technology" required />
            </CmsField>
            <CmsField id="shared-status" label="Trạng thái">
              <CmsSelect id="shared-status" defaultValue="published">
                <option value="published">Đã xuất bản</option>
                <option value="draft">Bản nháp</option>
              </CmsSelect>
            </CmsField>
            <CmsField id="shared-summary" label="Mô tả" className="sm:col-span-2">
              <CmsTextarea id="shared-summary" rows={3} defaultValue="Nội dung mẫu để kiểm tra typography và spacing." />
            </CmsField>
            <CmsField id="shared-invalid" label="Trường lỗi" error="Vui lòng nhập nội dung hợp lệ." className="sm:col-span-2">
              <CmsInput id="shared-invalid" invalid aria-describedby="shared-invalid-help" defaultValue="Giá trị chưa hợp lệ" />
            </CmsField>
            <div className="sm:col-span-2">
              <SearchableSelect
                label="Bộ chọn tìm kiếm"
                options={selectOptions}
                selectedId={selectedId}
                onChange={setSelectedId}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
          <h2 className="text-base font-bold text-slate-900">Actions và states</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <CmsButton variant="primary" leadingIcon={<Save />}>Lưu thay đổi</CmsButton>
            <CmsButton variant="secondary">Nút phụ</CmsButton>
            <CmsButton variant="danger">Xóa</CmsButton>
            <CmsButton variant="ghost">Tác vụ nhẹ</CmsButton>
            <CmsButton disabled>Đang xử lý</CmsButton>
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <CmsSelectionCheckbox checked={checked} onChange={() => setChecked((value) => !value)} label="Chọn bản ghi mẫu" />
            <span className="text-sm font-medium text-slate-700">Selection checkbox</span>
          </div>
        </div>
      </section>

      <CmsTableShell footer={<CmsPagination currentPage={page} pageSize={10} totalCount={28} itemLabel="bản ghi" onPageChange={setPage} />}>
        <table className="cms-data-table min-w-[680px] text-left">
          <thead><tr><th>Tên</th><th>Mô tả</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
          <tbody>
            {tab === 'components' ? (
              <tr>
                <td className="font-semibold text-slate-900">Shared record</td>
                <td className="text-slate-500">Table structure không chứa data fetching.</td>
                <td><span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">Hoạt động</span></td>
                <td><CmsButton size="sm">Xem</CmsButton></td>
              </tr>
            ) : <CmsTableEmptyState colSpan={4} />}
          </tbody>
        </table>
      </CmsTableShell>
    </main>
  );
}
