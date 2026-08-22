import React, { useMemo, useState } from 'react';
import { Check, Image as ImageIcon, Search, Upload, X } from 'lucide-react';
import { CmsButton } from '../../components/ui/CmsButton';
import type { CmsMediaPickerItem } from '../../data/MediaPickerDataSource';
import { getDemoMediaPickerItems } from '../../data/demoMediaDataSource';


interface PageMediaPickerModalProps {
  currentId: string;
  onClose: () => void;
  onConfirm: (mediaId: string) => void;
  images?: CmsMediaPickerItem[];
  returnValue?: 'id' | 'url';
}

const legacyMockImageAliases: Record<string, string> = {
  media_home_social: 'ast_08',
  media_hero_01: 'ast_01',
  media_hero_02: 'ast_04',
  media_home_intro: 'ast_12',
  media_about_hero: 'ast_03',
  media_about_overview: 'ast_12',
  media_award_01: 'ast_06',
  media_award_02: 'ast_08',
  media_award_03: 'ast_10',
};

/** Compatibility default for modules not migrated to an injected Media data source yet. */
export const pageBuilderImages = getDemoMediaPickerItems('vi');

export function findPageBuilderImage(id: string, images: CmsMediaPickerItem[] = pageBuilderImages) {
  if (id.startsWith('data:image/')) return { id, filename: 'Ảnh tải từ máy', title: 'Ảnh tải từ máy', url: id };
  const resolvedId = legacyMockImageAliases[id] ?? id;
  return images.find((asset) => asset.id === resolvedId || asset.url === resolvedId);
}

export const PageMediaPickerModal: React.FC<PageMediaPickerModalProps> = ({
  currentId,
  onClose,
  onConfirm,
  images = pageBuilderImages,
  returnValue = 'id',
}) => {
  const [query, setQuery] = useState('');
  const [uploadedImages, setUploadedImages] = useState<CmsMediaPickerItem[]>([]);
  const [uploadError, setUploadError] = useState('');
  const allImages = [...uploadedImages, ...images];
  const initialAsset = images.find((asset) => asset.id === currentId || asset.url === currentId);
  const [selectedId, setSelectedId] = useState(initialAsset?.id ?? legacyMockImageAliases[currentId] ?? currentId);
  const options = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return allImages.filter((asset) => !normalized || asset.title.toLowerCase().includes(normalized) || asset.filename.toLowerCase().includes(normalized));
  }, [allImages, query]);
  const selectedAsset = allImages.find((asset) => asset.id === selectedId);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return setUploadError('Vui lòng chọn đúng định dạng ảnh.');
    if (file.size > 10 * 1024 * 1024) return setUploadError('Ảnh không được vượt quá 10 MB.');

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const asset = { id: `uploaded_${Date.now()}`, filename: file.name, title: file.name.replace(/\.[^.]+$/, ''), url: reader.result };
      setUploadedImages((current) => [asset, ...current]);
      setSelectedId(asset.id);
      setUploadError('');
    };
    reader.onerror = () => setUploadError('Không thể đọc tệp ảnh. Vui lòng chọn lại.');
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-xs" role="dialog" aria-modal="true" aria-label="Chọn ảnh">
      <button className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Đóng modal" />
      <div className="relative flex max-h-[86vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div><h2 className="text-base font-bold text-slate-950 dark:text-white">Chọn hoặc tải ảnh</h2><p className="mt-1 text-xs text-slate-500">Tải ảnh mới từ máy hoặc dùng lại ảnh trong Thư viện Media.</p></div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Đóng"><X className="h-5 w-5" /></button>
        </div>
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="flex flex-col gap-3 sm:flex-row"><label className="flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-700 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-orange-500"><Upload className="size-4" />Tải ảnh từ máy<input type="file" accept="image/*" onChange={handleUpload} className="sr-only" /></label><div className="relative flex flex-1 items-center"><div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Search className="h-4 w-4 text-slate-400" /></div><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên ảnh hoặc tên file..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800" /></div></div>
          {uploadError && <p className="mt-2 text-xs font-semibold text-red-600" role="alert">{uploadError}</p>}
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 overflow-y-auto p-4 sm:grid-cols-3 lg:grid-cols-4">
          {options.map((asset) => {
            const selected = selectedId === asset.id;
            return <button key={asset.id} type="button" onClick={() => setSelectedId(asset.id)} className={`overflow-hidden rounded-xl border-2 text-left ${selected ? 'border-orange-500 ring-2 ring-orange-100' : 'border-slate-200 dark:border-slate-700'}`}>
              <span className="relative block aspect-[4/3] bg-slate-100"><img src={asset.thumbnail_url ?? asset.url} alt="" className="h-full w-full object-cover" />{selected && <span className="absolute right-2 top-2 rounded-full bg-orange-600 p-1 text-white"><Check className="h-4 w-4" /></span>}</span>
              <span className="block p-3"><span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">{asset.title}</span><span className="mt-1 flex items-center gap-1 truncate text-[11px] text-slate-500"><ImageIcon className="h-3 w-3" />{asset.filename}</span></span>
            </button>;
          })}
          {options.length === 0 && <p className="col-span-full py-12 text-center text-sm text-slate-500">Không tìm thấy ảnh phù hợp.</p>}
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800"><CmsButton variant="secondary" onClick={onClose}>Hủy</CmsButton><CmsButton disabled={!selectedAsset} onClick={() => { if (selectedAsset) onConfirm(returnValue === 'url' || selectedAsset.id.startsWith('uploaded_') ? selectedAsset.url : selectedAsset.id); onClose(); }}>Dùng ảnh đã chọn</CmsButton></div>
      </div>
    </div>
  );
};
