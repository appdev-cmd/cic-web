import { Globe } from 'lucide-react';

import type { MediaAsset, MediaFolder } from './types';

const plainInputClassName = 'min-h-11 w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base sm:text-xs';
const inputClassName = `${plainInputClassName} focus:ring-2 focus:ring-orange-500 focus:outline-none`;

export function AssetMetadataEditor({ asset, folders, onChange }: { asset: MediaAsset; folders: readonly MediaFolder[]; onChange: (asset: MediaAsset) => void }) {
  const patch = (values: Partial<MediaAsset>) => onChange({ ...asset, ...values });
  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <div><label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tiêu đề hiển thị (Asset Title) *</label><input type="text" value={asset.title} onChange={(event) => patch({ title: event.target.value })} className={`${inputClassName} font-medium`} /></div>
        <div><label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mô tả ghi chú (Internal Description)</label><textarea rows={2} value={asset.description || ''} onChange={(event) => patch({ description: event.target.value })} placeholder="Ghi chú thêm về bối cảnh chụp hoặc mục đích sử dụng..." className={inputClassName} /></div>
      </div>
      <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Globe className="w-4 h-4 text-orange-500" /><span className="text-xs font-bold text-slate-900 dark:text-white">Văn bản thay thế cho Trình đọc màn hình & SEO (Alt Text)</span></div><span className="text-[10px] text-slate-400">WCAG 2.2 AA Standard</span></div>
        <input type="text" value={asset.alt_text} onChange={(event) => patch({ alt_text: event.target.value })} placeholder="Mô tả ngắn nội dung hình ảnh" className={inputClassName} />
        <div><label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Chú thích hiển thị</label><input type="text" value={asset.caption || ''} onChange={(event) => patch({ caption: event.target.value })} className={inputClassName} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tác giả / Nguồn ảnh (Credit)</label><input type="text" value={asset.credit_author || ''} onChange={(event) => patch({ credit_author: event.target.value })} className={inputClassName} /></div>
        <div><label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Bản quyền & License</label><select value={asset.license_type || 'internal'} onChange={(event) => patch({ license_type: event.target.value as MediaAsset['license_type'] })} className={inputClassName}><option value="internal">Sở hữu nội bộ (Internal Corporate)</option><option value="purchased">Bản quyền mua (Stock License)</option><option value="cc_by">Creative Commons (CC-BY)</option><option value="editorial">Dùng riêng cho báo chí (Editorial Only)</option></select></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Ngày hết hạn bản quyền</label><input type="date" value={asset.license_expiry?.slice(0, 10) || ''} onChange={(event) => patch({ license_expiry: event.target.value || undefined })} className={plainInputClassName} /></div>
        <div><label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Thư mục</label><select value={asset.folder_id} onChange={(event) => patch({ folder_id: event.target.value, folder_name: folders.find((folder) => folder.id === event.target.value)?.name || 'Chưa phân loại' })} className={plainInputClassName}><option value="">Chưa phân loại</option>{folders.filter((folder) => folder.id !== 'f_all').map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}</select></div>
      </div>
      <div><label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Thẻ (phân cách bằng dấu phẩy)</label><input type="text" value={asset.tags.join(', ')} onChange={(event) => patch({ tags: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) })} className={plainInputClassName} /></div>
    </div>
  );
}
