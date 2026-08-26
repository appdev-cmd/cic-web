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
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-700">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <Building2 className="h-4 w-4 text-orange-500" />
          <span><strong>{branches.length}</strong> địa điểm · kéo thứ tự bằng nút lên/xuống</span>
        </div>
        <button type="button" onClick={addBranch} disabled={disabled} className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-orange-700 disabled:opacity-50">
          <Plus className="h-3.5 w-3.5" /> Thêm chi nhánh
        </button>
      </div>

      {branches.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-xs text-slate-500 dark:border-slate-700">
          Chưa có địa điểm. Thêm chi nhánh đầu tiên để trang Liên hệ và Footer có dữ liệu hiển thị.
        </div>
      )}

      {branches.map((branch, index) => (
        <section key={branch.id} className="space-y-3 border-b border-slate-200 py-3 last:border-b-0 dark:border-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-orange-500" />
              <span className="truncate text-sm font-bold text-slate-900 dark:text-white">{branch.name || 'Chi nhánh chưa đặt tên'}</span>
              {branch.isHeadOffice && <span className="rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white dark:bg-white dark:text-slate-900">TRỤ SỞ CHÍNH</span>}
              {!branch.published && <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800">ĐANG ẨN</span>}
            </div>
            <div className="flex items-center gap-1">
              <button type="button" aria-label="Đưa chi nhánh lên" onClick={() => move(index, -1)} disabled={disabled || index === 0} className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:text-orange-600 disabled:opacity-30 dark:border-slate-700"><ChevronUp className="h-4 w-4" /></button>
              <button type="button" aria-label="Đưa chi nhánh xuống" onClick={() => move(index, 1)} disabled={disabled || index === branches.length - 1} className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:text-orange-600 disabled:opacity-30 dark:border-slate-700"><ChevronDown className="h-4 w-4" /></button>
              <button type="button" aria-label="Xóa chi nhánh" onClick={() => onChange(normalize(branches.filter((item) => item.id !== branch.id)))} disabled={disabled} className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:border-red-200 hover:text-red-600 disabled:opacity-30 dark:border-slate-700"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1"><span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Tên địa điểm *</span><input className={inputClass} value={branch.name} disabled={disabled} onChange={(e) => updateBranch(branch.id, { name: e.target.value })} /></label>
            <label className="space-y-1"><span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Mã ổn định *</span><input className={inputClass} value={branch.code} disabled={disabled} onChange={(e) => updateBranch(branch.id, { code: e.target.value })} /></label>
            <label className="space-y-1 sm:col-span-2"><span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Địa chỉ *</span><input className={inputClass} value={branch.address} disabled={disabled} onChange={(e) => updateBranch(branch.id, { address: e.target.value })} /></label>
            <label className="space-y-1"><span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Điện thoại</span><input className={inputClass} value={branch.phone} disabled={disabled} onChange={(e) => updateBranch(branch.id, { phone: e.target.value })} /></label>
            <label className="space-y-1"><span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Email</span><input type="email" className={inputClass} value={branch.email} disabled={disabled} onChange={(e) => updateBranch(branch.id, { email: e.target.value })} /></label>
            <label className="space-y-1"><span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Fax</span><input className={inputClass} value={branch.fax || ''} disabled={disabled} onChange={(e) => updateBranch(branch.id, { fax: e.target.value })} /></label>
            <label className="space-y-1"><span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Giờ làm việc</span><input className={inputClass} value={branch.workingHours} disabled={disabled} onChange={(e) => updateBranch(branch.id, { workingHours: e.target.value })} /></label>
            <label className="space-y-1 sm:col-span-2"><span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Từ khóa tìm trên bản đồ</span><input className={inputClass} value={branch.mapSearchQuery || ''} disabled={disabled} onChange={(e) => updateBranch(branch.id, { mapSearchQuery: e.target.value })} placeholder="Tên công ty + địa chỉ" /></label>
            <label className="space-y-1 sm:col-span-2"><span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">URL nhúng Google Maps</span><textarea rows={2} className={inputClass} value={branch.mapEmbedUrl} disabled={disabled} onChange={(e) => updateBranch(branch.id, { mapEmbedUrl: e.target.value })} /></label>
          </div>

          <div className="flex flex-wrap gap-5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <label className="flex items-center gap-2"><input type="radio" name="head-office" checked={branch.isHeadOffice} disabled={disabled} onChange={() => updateBranch(branch.id, { isHeadOffice: true })} /> Trụ sở chính</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={branch.published} disabled={disabled} onChange={(e) => updateBranch(branch.id, { published: e.target.checked })} /> Hiển thị công khai</label>
          </div>
        </section>
      ))}
    </div>
  );
};
