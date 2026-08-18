import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Check, Search, X } from 'lucide-react';
import { CmsButton } from '../../components/ui/CmsButton';
import { entityTypeLabels } from './pageBuilderRegistry';
import type { PageBuilderEntityOption, PageBuilderEntityType } from './pageBuilderTypes';

interface PageEntityPickerModalProps {
  isOpen: boolean;
  entityType: PageBuilderEntityType;
  selectedIds: string[];
  limit: number;
  options: PageBuilderEntityOption[];
  onClose: () => void;
  onConfirm: (ids: string[]) => void;
}

export const PageEntityPickerModal: React.FC<PageEntityPickerModalProps> = ({
  isOpen,
  entityType,
  selectedIds,
  limit,
  options,
  onClose,
  onConfirm,
}) => {
  const [query, setQuery] = useState('');
  const [draftIds, setDraftIds] = useState<string[]>(selectedIds);

  React.useEffect(() => {
    if (isOpen) {
      setDraftIds(selectedIds);
      setQuery('');
    }
  }, [isOpen, selectedIds]);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return options.filter(
      (item) =>
        item.entityType === entityType &&
        (item.status ?? 'published') === 'published' &&
        (!normalizedQuery ||
          item.label.toLowerCase().includes(normalizedQuery) ||
          item.description.toLowerCase().includes(normalizedQuery)),
    );
  }, [entityType, options, query]);

  if (!isOpen) return null;

  const toggle = (id: string) => {
    if (draftIds.includes(id)) {
      setDraftIds(draftIds.filter((item) => item !== id));
      return;
    }
    if (draftIds.length < limit) setDraftIds([...draftIds, id]);
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= draftIds.length) return;
    const next = [...draftIds];
    [next[index], next[target]] = [next[target], next[index]];
    setDraftIds(next);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-xs" role="dialog" aria-modal="true">
      <button className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Đóng modal" />
      <div className="relative flex max-h-[86vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-950 dark:text-white">Chọn {entityTypeLabels[entityType]}</h2>
            <p className="mt-1 text-xs text-slate-500">Chọn thủ công tối đa {limit} mục. Không có chế độ tự động.</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800" aria-label="Đóng">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
          <div className="min-h-0 border-b border-slate-200 p-4 lg:border-b-0 lg:border-r dark:border-slate-800">
            <div className="relative mb-3 flex items-center">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Tìm ${entityTypeLabels[entityType].toLowerCase()}...`} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800" />
            </div>
            <div className="max-h-[48vh] space-y-2 overflow-y-auto pr-1">
              {filteredOptions.map((item) => {
                const checked = draftIds.includes(item.id);
                const disabled = !checked && draftIds.length >= limit;
                return (
                  <button key={item.id} type="button" disabled={disabled} onClick={() => toggle(item.id)} className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors ${checked ? 'border-orange-400 bg-orange-50 dark:bg-orange-950/20' : 'border-slate-200 hover:border-orange-300 dark:border-slate-700'} disabled:cursor-not-allowed disabled:opacity-45`}>
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${checked ? 'border-orange-600 bg-orange-600 text-white' : 'border-slate-300'}`}>{checked && <Check className="h-3.5 w-3.5" />}</span>
                    <span><span className="block text-sm font-semibold text-slate-900 dark:text-white">{item.label}</span><span className="mt-0.5 block text-xs text-slate-500">{item.description}</span></span>
                  </button>
                );
              })}
              {filteredOptions.length === 0 && <p className="py-10 text-center text-sm text-slate-500">Không tìm thấy dữ liệu phù hợp.</p>}
            </div>
          </div>

          <div className="min-h-0 p-4">
            <div className="mb-3 flex items-center justify-between"><h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Đã chọn và thứ tự hiển thị</h3><span className="text-xs font-semibold text-orange-600">{draftIds.length}/{limit}</span></div>
            <div className="max-h-[52vh] space-y-2 overflow-y-auto pr-1">
              {draftIds.map((id, index) => {
                const item = options.find((option) => option.id === id);
                return (
                  <div key={id} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-500 dark:bg-slate-900">{index + 1}</span>
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{item?.label ?? id}</span>
                    <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="rounded-lg p-1.5 text-slate-500 hover:bg-white disabled:opacity-25 dark:hover:bg-slate-900" aria-label="Di chuyển lên"><ArrowUp className="h-4 w-4" /></button>
                    <button type="button" onClick={() => move(index, 1)} disabled={index === draftIds.length - 1} className="rounded-lg p-1.5 text-slate-500 hover:bg-white disabled:opacity-25 dark:hover:bg-slate-900" aria-label="Di chuyển xuống"><ArrowDown className="h-4 w-4" /></button>
                    <button type="button" onClick={() => toggle(id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30" aria-label="Bỏ chọn"><X className="h-4 w-4" /></button>
                  </div>
                );
              })}
              {draftIds.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500 dark:border-slate-700">Chưa chọn mục nào.</p>}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <CmsButton variant="secondary" onClick={onClose}>Hủy</CmsButton>
          <CmsButton onClick={() => { onConfirm(draftIds); onClose(); }}>Xác nhận lựa chọn</CmsButton>
        </div>
      </div>
    </div>
  );
};
