import React, { useState } from 'react';
import { X, Image as ImageIcon, CheckCircle2, Upload, Search } from 'lucide-react';

interface AssetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  assetType?: 'image' | 'file';
  onSelectAsset: (url: string) => void;
}

const mockMediaAssets = [
  {
    id: 'm1',
    name: 'logo_cic_primary_vector.png',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    type: 'image',
    size: '124 KB',
  },
  {
    id: 'm2',
    name: 'logo_cic_darkmode.png',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80',
    type: 'image',
    size: '142 KB',
  },
  {
    id: 'm3',
    name: 'og_share_cic_2026.png',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80',
    type: 'image',
    size: '420 KB',
  },
  {
    id: 'm4',
    name: 'enjicad_portal_hero_banner.jpg',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=400&auto=format&fit=crop&q=80',
    type: 'image',
    size: '512 KB',
  },
  {
    id: 'm5',
    name: 'cic_watermark_brand.png',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    type: 'image',
    size: '85 KB',
  },
  {
    id: 'm6',
    name: 'dieu_khoan_ban_quyen_cic_2026.pdf',
    url: 'https://cic.com.vn/docs/dieu_khoan_ban_quyen_cic_2026.pdf',
    type: 'file',
    size: '1.2 MB',
  },
];

export const AssetPickerModal: React.FC<AssetPickerModalProps> = ({
  isOpen,
  onClose,
  title,
  assetType = 'image',
  onSelectAsset,
}) => {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = mockMediaAssets.filter(
    (a) =>
      (assetType === 'file' ? a.type === 'file' : a.type === 'image') &&
      a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirm = () => {
    if (selectedUrl) {
      onSelectAsset(selectedUrl);
      setSelectedUrl(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
              <ImageIcon className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Thư viện Media & Tập tin ({title})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Chọn tài nguyên từ Thư viện Hệ thống hoặc tải file mới
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SEARCH & UPLOAD BAR */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tài nguyên media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
            />
          </div>

          <button
            type="button"
            onClick={() => alert('Mở giao diện Tải tệp mới lên Thư viện Media')}
            className="px-3.5 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold rounded-lg border border-orange-500/20 flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Tải tệp mới</span>
          </button>
        </div>

        {/* ASSETS GRID */}
        <div className="p-5 max-h-80 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map((asset) => {
            const isSelected = selectedUrl === asset.url;
            return (
              <div
                key={asset.id}
                onClick={() => setSelectedUrl(asset.url)}
                className={`p-2 rounded-xl border transition-all cursor-pointer relative group flex flex-col items-center justify-between ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 ring-2 ring-orange-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {asset.type === 'image' ? (
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                ) : (
                  <div className="w-full h-24 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center font-bold font-mono text-[11px] text-slate-600 dark:text-slate-300 mb-2">
                    📄 PDF File
                  </div>
                )}

                <div className="w-full text-left space-y-0.5">
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate">
                    {asset.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">{asset.size}</div>
                </div>

                {isSelected && (
                  <div className="absolute top-3 right-3 p-1 bg-orange-600 text-white rounded-full shadow-md">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 text-xs">
          <span className="text-slate-500">
            {selectedUrl ? 'Đã chọn 1 tài nguyên' : 'Hãy click chọn 1 tài nguyên'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold rounded-xl cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedUrl}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all"
            >
              Chọn tài nguyên này
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
