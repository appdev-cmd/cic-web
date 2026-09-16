import React, { useState } from 'react';
import { Building2, MapPin, Plus, Trash2 } from 'lucide-react';
import type { PageBuilderConfigValue } from '../pageBuilderTypes';

interface BranchesEditorProps {
  branches: Array<{ name?: string; address?: string; phone?: string; email?: string; workingHours?: string; mapUrl?: string; [key: string]: unknown }>;
  path: Array<string | number>;
  onChange: (path: Array<string | number>, value: PageBuilderConfigValue) => void;
}

export function BranchesEditor({
  branches,
  path,
  onChange,
}: BranchesEditorProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = branches[activeIdx] ?? branches[0] ?? {};

  const handleUpdateField = (field: string, val: unknown) => {
    const next = branches.map((b, idx) => (idx === activeIdx ? { ...b, [field]: val } : b));
    onChange(path, next as any);
  };

  const handleAdd = () => {
    const next = [
      ...branches,
      {
        name: 'Văn phòng đại diện mới',
        address: 'Địa chỉ chi nhánh mới...',
        phone: '024 3974 1373',
        email: 'contact@cic.com.vn',
        workingHours: 'Thứ 2 - Thứ 6: 08:00 - 17:30',
        mapUrl: 'https://maps.google.com',
      },
    ];
    onChange(path, next as any);
    setActiveIdx(next.length - 1);
  };

  const handleDelete = (idx: number) => {
    if (branches.length <= 1) return;
    const next = branches.filter((_, i) => i !== idx);
    onChange(path, next as any);
    setActiveIdx(Math.max(0, idx - 1));
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50 md:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-orange-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Danh sách Chi nhánh & Trụ sở ({branches.length})
          </h3>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-orange-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Thêm chi nhánh
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {branches.map((b, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIdx(idx)}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold transition ${
              idx === activeIdx
                ? 'bg-orange-600 text-white shadow-xs'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <MapPin className="h-3.5 w-3.5" />
            <span className="max-w-[140px] truncate">{b.name || `Chi nhánh ${idx + 1}`}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
          <span className="text-xs font-bold text-orange-700 dark:text-orange-400">
            Đang sửa: {current.name || `Chi nhánh ${activeIdx + 1}`}
          </span>
          <button
            type="button"
            onClick={() => handleDelete(activeIdx)}
            className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
          >
            <Trash2 className="h-3.5 w-3.5" /> Xóa chi nhánh này
          </button>
        </div>
        <label className="block space-y-1">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tên chi nhánh / Văn phòng</span>
          <input
            type="text"
            value={String(current.name ?? '')}
            onChange={(e) => handleUpdateField('name', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Địa chỉ cụ thể</span>
          <textarea
            rows={2}
            value={String(current.address ?? '')}
            onChange={(e) => handleUpdateField('address', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Số điện thoại</span>
            <input
              type="text"
              value={String(current.phone ?? '')}
              onChange={(e) => handleUpdateField('phone', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email liên hệ</span>
            <input
              type="text"
              value={String(current.email ?? '')}
              onChange={(e) => handleUpdateField('email', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Giờ làm việc</span>
            <input
              type="text"
              value={String(current.workingHours ?? '')}
              onChange={(e) => handleUpdateField('workingHours', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Google Maps URL</span>
            <input
              type="text"
              value={String(current.mapUrl ?? '')}
              onChange={(e) => handleUpdateField('mapUrl', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
