import React, { useState } from 'react';
import {
  X,
  Search,
  Check,
  Folder,
  Image as ImageIcon,
  FileText,
  Video,
  Plus,
} from 'lucide-react';
import { MediaAsset } from './types';

interface AssetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: MediaAsset[];
  mode?: 'single' | 'multiple';
  onSelectAssets: (selectedAssets: MediaAsset[]) => void;
}

export const AssetPickerModal: React.FC<AssetPickerModalProps> = ({
  isOpen,
  onClose,
  assets,
  mode = 'single',
  onSelectAssets,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const filtered = assets.filter((b) => {
    if (!searchQuery.trim()) return true;
    return (
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.filename.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleToggleSelect = (asset: MediaAsset) => {
    if (mode === 'single') {
      onSelectAssets([asset]);
      onClose();
    } else {
      if (selectedIds.includes(asset.id)) {
        setSelectedIds(selectedIds.filter((id) => id !== asset.id));
      } else {
        setSelectedIds([...selectedIds, asset.id]);
      }
    }
  };

  const handleConfirmMulti = () => {
    const chosen = assets.filter((a) => selectedIds.includes(a.id));
    onSelectAssets(chosen);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Thư viện Asset Picker ({mode === 'single' ? 'Chọn 1 asset' : 'Chọn nhiều asset'})
            </h3>
            <p className="text-xs text-slate-500">
              Chọn media sẵn có để chèn vào nội dung bài viết, sản phẩm hoặc banner.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm file media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Grid Assets */}
        <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 scrollbar-thin">
          {filtered.map((asset) => {
            const isSelected = selectedIds.includes(asset.id);
            return (
              <div
                key={asset.id}
                onClick={() => handleToggleSelect(asset)}
                className={`group relative bg-slate-50 dark:bg-slate-850 border rounded-xl overflow-hidden cursor-pointer transition-all ${
                  isSelected
                    ? 'border-orange-500 ring-2 ring-orange-500/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="aspect-4/3 bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                  {asset.type === 'document' ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-10 h-10 text-rose-500" />
                    </div>
                  ) : (
                    <img
                      src={asset.thumbnail_url || asset.url}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  )}
                  {isSelected && (
                    <div className="absolute inset-0 bg-orange-600/30 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                        <Check className="w-5 h-5" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs font-bold truncate text-slate-800 dark:text-slate-200">
                    {asset.title}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{asset.filename}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {mode === 'multiple' && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Đã chọn {selectedIds.length} tệp
            </span>
            <button
              type="button"
              onClick={handleConfirmMulti}
              className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              Chèn {selectedIds.length} Asset Đã Chọn
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
