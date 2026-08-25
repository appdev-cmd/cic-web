import React, { useState } from 'react';
import { Check, Shield, X } from 'lucide-react';
import type { AgencyOption } from '../cic_users/types';
import type { CmsRole, MatrixAction, ModulePermissionMatrix, ScopeConstraint } from './types';
import { CmsButton } from '../../components/ui/CmsButton';

interface RoleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRole: (role: CmsRole, activateImmediately: boolean) => void;
  roleToEdit: CmsRole | null;
  existingRoles: CmsRole[];
  agencies: AgencyOption[];
}

const modules = [
  ['PRODUCTS', 'Sản phẩm'], ['NEWS', 'Tin tức'], ['PAGES', 'Trang nội dung'],
  ['CUSTOMERS', 'Yêu cầu khách hàng'], ['MEDIA', 'Thư viện media'],
  ['SETTINGS', 'Cấu hình hệ thống'], ['USERS', 'Người dùng & vai trò'],
] as const;

const actions: { code: MatrixAction; label: string }[] = [
  { code: 'view', label: 'Xem' }, { code: 'create', label: 'Tạo' },
  { code: 'edit', label: 'Sửa' }, { code: 'publish', label: 'Xuất bản' },
  { code: 'delete', label: 'Xóa' },
];

export const RoleEditorModal: React.FC<RoleEditorModalProps> = ({ isOpen, onClose, onSaveRole, roleToEdit, agencies }) => {
  if (!isOpen) return null;
  const [name, setName] = useState(roleToEdit?.name ?? '');
  const [description, setDescription] = useState(roleToEdit?.description ?? '');
  const [matrix, setMatrix] = useState<ModulePermissionMatrix>(roleToEdit?.matrix ?? {});
  const [scopeMode, setScopeMode] = useState<'global' | 'ownership' | 'site'>(() => {
    const current = roleToEdit?.scopes[0]?.type;
    return current === 'ownership' || current === 'site' ? current : 'global';
  });
  const [siteValues, setSiteValues] = useState<string[]>(roleToEdit?.scopes.find((scope) => scope.type === 'site')?.allowedValues ?? []);
  const [error, setError] = useState('');

  const togglePermission = (moduleCode: string, action: MatrixAction) => setMatrix((current) => ({
    ...current,
    [moduleCode]: { ...current[moduleCode], [action]: current[moduleCode]?.[action] === 'allowed' ? 'denied' : 'allowed' },
  }));

  const save = () => {
    if (!name.trim()) { setError('Vui lòng nhập tên vai trò.'); return; }
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const scopes: ScopeConstraint[] = scopeMode === 'site'
      ? [{ type: 'site', allowedValues: siteValues, description: siteValues.length ? `Chi nhánh: ${siteValues.join(', ')}` : 'Chưa chọn chi nhánh' }]
      : scopeMode === 'ownership'
        ? [{ type: 'ownership', allowedValues: ['SELF_ONLY'], description: 'Chỉ nội dung được phân công hoặc do người dùng tạo' }]
        : [{ type: 'global', allowedValues: ['ALL'], description: 'Toàn bộ nội dung' }];
    const saved: CmsRole = {
      id: roleToEdit?.id ?? `role_${Date.now()}`, name: name.trim(), category: roleToEdit?.category ?? 'custom',
      riskLevel: roleToEdit?.riskLevel ?? 'standard', status: 'active', purpose: roleToEdit?.purpose ?? name.trim(),
      description: description.trim() || 'Vai trò dùng trong CMS CIC.', owner: roleToEdit?.owner ?? 'Quản trị hệ thống',
      reviewer: roleToEdit?.reviewer ?? 'Quản trị hệ thống', activeVersion: roleToEdit?.activeVersion ?? 1, draftVersion: undefined,
      versions: roleToEdit?.versions ?? [],
      matrix, scopes, assignedUsersCount: roleToEdit?.assignedUsersCount ?? 0, assignedGroupCount: roleToEdit?.assignedGroupCount ?? 0,
      conflictIssuesCount: 0, updatedTime: now, updatedBy: 'admin_cic',
    };
    onSaveRole(saved, true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 sm:p-5" role="dialog" aria-modal="true" aria-labelledby="role-editor-title">
      <div className="my-auto flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/40"><Shield className="size-5" /></span><div><h2 id="role-editor-title" className="font-bold text-slate-950 dark:text-white">{roleToEdit ? 'Chỉnh sửa vai trò' : 'Thêm vai trò'}</h2><p className="text-xs text-slate-500 dark:text-slate-400">Chọn những thao tác người giữ vai trò này được phép thực hiện.</p></div></div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white" aria-label="Đóng"><X className="size-5" /></button>
        </header>
        <div className="overflow-y-auto p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"><span>Tên vai trò *</span><input value={name} onChange={(event) => { setName(event.target.value); setError(''); }} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" /></label>
            <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"><span>Mô tả</span><input value={description} onChange={(event) => setDescription(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" /></label>
          </div>
          {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
          <section className="mt-6"><h3 className="text-sm font-bold text-slate-950 dark:text-white">Quyền theo phân hệ</h3><p className="mb-3 mt-1 text-xs text-slate-500">Danh mục quyền do hệ thống định nghĩa. Ô trống có nghĩa là không được phép.</p>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800"><table className="w-full min-w-[620px] text-left text-xs"><thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/70 dark:text-slate-400"><tr><th className="px-4 py-3">Phân hệ</th>{actions.map((action) => <th key={action.code} className="px-3 py-3 text-center">{action.label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{modules.map(([code, label]) => <tr key={code}><th className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{label}</th>{actions.map((action) => { const checked = matrix[code]?.[action.code] === 'allowed'; return <td key={action.code} className="px-3 py-3 text-center"><button type="button" onClick={() => togglePermission(code, action.code)} aria-pressed={checked} aria-label={`${action.label} ${label}`} className={`inline-flex size-7 items-center justify-center rounded-md border transition-colors ${checked ? 'border-orange-600 bg-orange-600 text-white' : 'border-slate-300 bg-white text-transparent hover:border-orange-400 dark:border-slate-700 dark:bg-slate-950'}`}>{checked && <Check className="size-4" />}</button></td>; })}</tr>)}</tbody></table></div>
          </section>
          <details className="mt-5 rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-800"><summary className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-200">Phạm vi nội dung nâng cao</summary><div className="mt-4 grid gap-3 sm:grid-cols-3">{([['global', 'Toàn bộ'], ['ownership', 'Nội dung phụ trách'], ['site', 'Theo chi nhánh']] as const).map(([value, label]) => <label key={value} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300"><input type="radio" name="scope" checked={scopeMode === value} onChange={() => setScopeMode(value)} className="text-orange-600" />{label}</label>)}</div>{scopeMode === 'site' && <div className="mt-4 flex flex-wrap gap-2">{agencies.map((agency) => { const checked = siteValues.includes(agency.id); return <label key={agency.id} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs dark:border-slate-700"><input type="checkbox" checked={checked} onChange={() => setSiteValues((current) => checked ? current.filter((id) => id !== agency.id) : [...current, agency.id])} />{agency.name}</label>; })}</div>}</details>
        </div>
        <footer className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800"><CmsButton variant="secondary" size="sm" onClick={onClose}>Hủy</CmsButton><CmsButton size="sm" onClick={save}>Lưu vai trò</CmsButton></footer>
      </div>
    </div>
  );
};
