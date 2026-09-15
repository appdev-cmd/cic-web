import React from 'react';
import { Building2, ChevronDown, ChevronUp, MapPin, Plus, Trash2 } from 'lucide-react';

export interface BranchSetting {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  fax?: string;
  workingHours: string;
  mapEmbedUrl: string;
  mapSearchQuery?: string;
  isHeadOffice: boolean;
  published: boolean;
  ordering: number;
}

interface Props {
  value: BranchSetting[] | unknown;
  disabled?: boolean;
  onChange: (branches: BranchSetting[]) => void;
}

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none transition focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white';

export const BranchesSettingsEditor: React.FC<Props> = ({ value, disabled, onChange }) => {
  const branches = Array.isArray(value) ? (value as BranchSetting[]) : [];

  const normalize = (items: BranchSetting[]) =>
    items.map((branch, index) => ({ ...branch, ordering: index }));

  const updateBranch = (id: string, patch: Partial<BranchSetting>) => {
    onChange(
      branches.map((branch) => {
        if (patch.isHeadOffice && branch.id !== id) return { ...branch, isHeadOffice: false };
        return branch.id === id ? { ...branch, ...patch } : branch;
      }),
    );
  };

  const addBranch = () => {
    const suffix = Date.now().toString().slice(-6);
    onChange([
      ...branches,
      {
        id: `branch_${suffix}`,
        code: `chi-nhanh-${branches.length + 1}`,
        name: `Chi nhánh ${branches.length + 1}`,
        address: '',
        phone: '',
        email: '',
        fax: '',
        workingHours: 'Thứ 2 - Thứ 6: 08:00 - 17:00',
        mapEmbedUrl: '',
        mapSearchQuery: '',
        isHeadOffice: branches.length === 0,
        published: true,
        ordering: branches.length,
      },
    ]);
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= branches.length) return;
    const next = [...branches];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(normalize(next));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <Building2 className="h-4 w-4 text-orange-500 shrink-0" />
          <span><strong>{branches.length}</strong> địa điểm trụ sở & chi nhánh</span>
        </div>
        <button
          type="button"
          onClick={addBranch}
          disabled={disabled}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-orange-700 disabled:opacity-50 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Thêm địa điểm mới
        </button>
      </div>

      {branches.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center text-xs text-slate-500 dark:border-slate-700">
          Chưa có địa điểm. Thêm chi nhánh đầu tiên để trang Liên hệ và Chân trang có dữ liệu hiển thị.
        </div>
      )}

      <div className="space-y-4">
        {branches.map((branch, index) => (
          <section
            key={branch.id}
            className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 sm:p-5 space-y-4 dark:border-slate-800 dark:bg-slate-900/60 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-orange-500" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {branch.name || 'Chi nhánh chưa đặt tên'}
                </span>
                {branch.isHeadOffice ? (
                  <span className="rounded-full bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-extrabold text-orange-600 border border-orange-500/20 dark:text-orange-400">
                    TRỤ SỞ CHÍNH
                  </span>
                ) : null}
                {branch.published ? (
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20 dark:text-emerald-400">
                    HIỂN THỊ CÔNG KHAI
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-200/80 px-2.5 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800">
                    ĐANG ẨN
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  aria-label="Đưa chi nhánh lên"
                  onClick={() => move(index, -1)}
                  disabled={disabled || index === 0}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-orange-500 hover:text-orange-600 disabled:opacity-30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                  title="Di chuyển lên"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Đưa chi nhánh xuống"
                  onClick={() => move(index, 1)}
                  disabled={disabled || index === branches.length - 1}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-orange-500 hover:text-orange-600 disabled:opacity-30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                  title="Di chuyển xuống"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Xóa chi nhánh"
                  onClick={() => onChange(normalize(branches.filter((item) => item.id !== branch.id)))}
                  disabled={disabled}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-red-500 transition hover:border-red-500 hover:bg-red-50 disabled:opacity-30 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-red-950/30 cursor-pointer"
                  title="Xóa địa điểm này"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Tên địa điểm *</span>
                <input
                  className={inputClass}
                  value={branch.name}
                  disabled={disabled}
                  onChange={(e) => updateBranch(branch.id, { name: e.target.value })}
                  placeholder="Ví dụ: Trụ sở chính Hà Nội"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Mã định danh *</span>
                <input
                  className={inputClass}
                  value={branch.code}
                  disabled={disabled}
                  onChange={(e) => updateBranch(branch.id, { code: e.target.value })}
                  placeholder="tru-so-ha-noi"
                />
              </label>
              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Địa chỉ chi tiết *</span>
                <input
                  className={inputClass}
                  value={branch.address}
                  disabled={disabled}
                  onChange={(e) => updateBranch(branch.id, { address: e.target.value })}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Số điện thoại</span>
                <input
                  className={inputClass}
                  value={branch.phone}
                  disabled={disabled}
                  onChange={(e) => updateBranch(branch.id, { phone: e.target.value })}
                  placeholder="024 3856 1796"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Email liên hệ</span>
                <input
                  type="email"
                  className={inputClass}
                  value={branch.email}
                  disabled={disabled}
                  onChange={(e) => updateBranch(branch.id, { email: e.target.value })}
                  placeholder="contact@cic.com.vn"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Số Fax</span>
                <input
                  className={inputClass}
                  value={branch.fax || ''}
                  disabled={disabled}
                  onChange={(e) => updateBranch(branch.id, { fax: e.target.value })}
                  placeholder="024 3856 1797"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Khung giờ làm việc</span>
                <input
                  className={inputClass}
                  value={branch.workingHours}
                  disabled={disabled}
                  onChange={(e) => updateBranch(branch.id, { workingHours: e.target.value })}
                  placeholder="Thứ 2 - Thứ 6: 08:00 - 17:00"
                />
              </label>
              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Từ khóa tìm kiếm trên bản đồ</span>
                <input
                  className={inputClass}
                  value={branch.mapSearchQuery || ''}
                  disabled={disabled}
                  onChange={(e) => updateBranch(branch.id, { mapSearchQuery: e.target.value })}
                  placeholder="Ví dụ: Công ty Cổ phần Công nghệ và Tư vấn CIC"
                />
              </label>
              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Mã nhúng Google Maps iframe (src URL)</span>
                <textarea
                  rows={2}
                  className={inputClass}
                  value={branch.mapEmbedUrl}
                  disabled={disabled}
                  onChange={(e) => updateBranch(branch.id, { mapEmbedUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs font-bold">
              <label className="flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200">
                <input
                  type="radio"
                  name="head-office"
                  checked={branch.isHeadOffice}
                  disabled={disabled}
                  onChange={() => updateBranch(branch.id, { isHeadOffice: true })}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                />
                <span>Đặt làm Trụ sở chính</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={branch.published}
                  disabled={disabled}
                  onChange={(e) => updateBranch(branch.id, { published: e.target.checked })}
                  className="h-4 w-4 rounded text-orange-600 focus:ring-orange-500"
                />
                <span>Hiển thị công khai trên Website</span>
              </label>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
