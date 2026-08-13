import React, { useEffect, useState } from 'react';
import {
  FileText,
  Video,
  Image as ImageIcon,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers,
  Copy,
  Download,
} from 'lucide-react';
import { MediaAsset } from './types';
import { CmsSelectionCheckbox } from '../../components/ui/CmsSelectionCheckbox';
import { CmsPagination } from '../../components/ui/CmsPagination';

interface MediaGridViewProps {
  assets: MediaAsset[];
  selectedAssetIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectAsset: (id: string) => void;
  onOpenDetail: (asset: MediaAsset) => void;
  onOpenPreview: (asset: MediaAsset) => void;
  onDeleteAsset: (id: string) => void;
  cardSize?: 'sm' | 'md' | 'lg';
}

export const MediaGridView: React.FC<MediaGridViewProps> = ({
  assets,
  selectedAssetIds,
  onToggleSelectAll,
  onToggleSelectAsset,
  onOpenDetail,
  onOpenPreview,
  onDeleteAsset,
  cardSize = 'md',
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const paginatedAssets = assets.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  useEffect(() => {
    const lastPage = Math.max(1, Math.ceil(assets.length / pageSize));
    if (currentPage > lastPage) setCurrentPage(lastPage);
  }, [assets.length, currentPage, pageSize]);
  if (assets.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">
          Không tìm thấy tệp media nào
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt các bộ lọc để hiển thị kết quả.
        </p>
      </div>
    );
  }

  const gridColsClass =
    cardSize === 'sm'
      ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
      : cardSize === 'lg'
      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
      : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';

  return (
    <div className="space-y-4">
    <div className={`grid ${gridColsClass} gap-4`}>
      {paginatedAssets.map((asset) => {
        const isSelected = selectedAssetIds.includes(asset.id);
        const isDoc = asset.type === 'document';
        const isVid = asset.type === 'video';

        return (
          <div
            key={asset.id}
            className={`group relative bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-200 flex flex-col ${
              isSelected
                ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-md'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
            }`}
          >
            {/* Thumbnail Box */}
            <div className="relative aspect-4/3 bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
              {isDoc ? (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <FileText className="w-12 h-12 text-rose-500 mb-2" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {asset.mime_type.split('/')[1] || 'PDF'}
                  </span>
                </div>
              ) : (
                <img
                  src={asset.thumbnail_url || asset.url}
                  alt={asset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              )}

              {/* Video Badge */}
              {isVid && (
                <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 text-orange-600 flex items-center justify-center shadow-lg">
                    <Video className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                  {asset.duration_sec && (
                    <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {Math.floor(asset.duration_sec / 60)}:
                      {String(asset.duration_sec % 60).padStart(2, '0')}
                    </span>
                  )}
                </div>
              )}

              {/* Checkbox Overlay */}
              <div
                className={`absolute top-2 left-2 z-10 transition-opacity ${
                  isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                <CmsSelectionCheckbox
                  checked={isSelected}
                  onChange={() => onToggleSelectAsset(asset.id)}
                  label={`Chọn tệp ${asset.title}`}
                />
              </div>

              {/* Status & Usage Badges */}
              <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end">
                {asset.used_by_count > 0 ? (
                  <span
                    className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs"
                    title={`Đang dùng tại ${asset.used_by_count} nơi trong CMS`}
                  >
                    <Layers className="w-3 h-3" /> {asset.used_by_count}
                  </span>
                ) : (
                  <span
                    className="bg-slate-600/80 text-white text-[10px] font-medium px-2 py-0.5 rounded-md shadow-xs"
                    title="Chưa được sử dụng"
                  >
                    Chưa dùng
                  </span>
                )}

                {asset.metadata_status === 'incomplete' && (
                  <span
                    className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs"
                    title="Thiếu thông tin Alt Text tiếng Nhật/Mô tả"
                  >
                    <AlertTriangle className="w-3 h-3" /> Thiếu meta
                  </span>
                )}
              </div>

              {/* Hover Quick Action Toolbar Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-2.5 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => onOpenPreview(asset)}
                  className="p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  title="Xem trước media"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onOpenDetail(asset)}
                  className="p-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  title="Chỉnh sửa chi tiết & Variant"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteAsset(asset.id)}
                  className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  title="Xóa vào Thùng rác"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Info Footer */}
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <h4
                  className="text-xs font-bold text-slate-900 dark:text-white truncate mb-1 cursor-pointer hover:text-orange-600"
                  onClick={() => onOpenDetail(asset)}
                  title={asset.title}
                >
                  {asset.title}
                </h4>
                <p className="text-[11px] text-slate-400 font-mono truncate mb-2">
                  {asset.filename}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-2">
                <span>{(asset.file_size_kb / 1024).toFixed(1)} MB</span>
                {asset.width && asset.height && (
                  <span className="font-mono text-[10px]">
                    {asset.width}x{asset.height}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><CmsPagination currentPage={currentPage} pageSize={pageSize} totalCount={assets.length} itemLabel="tệp media" onPageChange={setCurrentPage} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} /></div>
    </div>
  );
};
