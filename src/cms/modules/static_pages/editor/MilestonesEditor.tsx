import React, { useState } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import type { PageBuilderConfigValue } from '../pageBuilderTypes';

interface MilestonesEditorProps {
  milestones: Array<{ year?: string | number; title?: string; description?: string; [key: string]: unknown }>;
  path: Array<string | number>;
  onChange: (path: Array<string | number>, value: PageBuilderConfigValue) => void;
}

export function MilestonesEditor({
  milestones,
  path,
  onChange,
}: MilestonesEditorProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = milestones[activeIdx] ?? milestones[0] ?? { year: '2026', title: '', description: '' };

  const handleUpdateField = (field: string, val: unknown) => {
    const next = milestones.map((m, idx) => (idx === activeIdx ? { ...m, [field]: val } : m));
    onChange(path, next as any);
  };

  const handleAdd = () => {
    const next = [...milestones, { year: `${new Date().getFullYear()}`, title: 'Cột mốc phát triển mới', description: 'Mô tả chi tiết về sự kiện hoặc thành tựu nổi bật.' }];
    onChange(path, next as any);
    setActiveIdx(next.length - 1);
  };

  const handleDelete = (idx: number) => {
    if (milestones.length <= 1) return;
    const next = milestones.filter((_, i) => i !== idx);
    onChange(path, next as any);
    setActiveIdx(Math.max(0, idx - 1));
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50 md:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-orange-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Tiến trình lịch sử ({milestones.length} mốc)
          </h3>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-orange-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Thêm mốc lịch sử
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {milestones.map((m, idx) => (
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
            <span className="rounded bg-black/10 px-1 py-0.5 text-[10px]">{m.year || 'Năm'}</span>
            <span className="max-w-[120px] truncate">{m.title || `Mục ${idx + 1}`}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
          <span className="text-xs font-bold text-orange-700 dark:text-orange-400">
            Đang sửa: Mốc {activeIdx + 1} ({current.year})
          </span>
          <button
            type="button"
            onClick={() => handleDelete(activeIdx)}
            className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
          >
            <Trash2 className="h-3.5 w-3.5" /> Xóa mốc này
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block space-y-1 sm:col-span-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Năm mốc thời gian</span>
            <input
              type="text"
              value={String(current.year ?? '')}
              onChange={(e) => handleUpdateField('year', e.target.value)}
              placeholder="VD: 1990, 2006..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-orange-600 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tiêu đề cột mốc</span>
            <input
              type="text"
              value={String(current.title ?? '')}
              onChange={(e) => handleUpdateField('title', e.target.value)}
              placeholder="Nhập tên sự kiện cột mốc..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
        </div>
        <label className="block space-y-1">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Mô tả sự kiện</span>
          <textarea
            rows={3}
            value={String(current.description ?? '')}
            onChange={(e) => handleUpdateField('description', e.target.value)}
            placeholder="Mô tả chi tiết những bước ngoặt trong giai đoạn này..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
      </div>
    </div>
  );
}
