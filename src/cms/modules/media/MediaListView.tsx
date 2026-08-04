import React from 'react';
import {
  FileText,
  Video,
  Image as ImageIcon,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Folder,
  Layers,
  MoreHorizontal,
  Download,
} from 'lucide-react';
import { MediaAsset } from './types';

interface MediaListViewProps {
  assets: MediaAsset[];
  selectedAssetIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectAsset: (id: string) => void;
  onOpenDetail: (asset: MediaAsset) => void;
  onOpenPreview: (asset: MediaAsset) => void;
  onDeleteAsset: (id: string) => void;
}

export const MediaListView: React.FC<MediaListViewProps> = ({
  assets,
  selectedAssetIds,
  onToggleSelectAll,
  onToggleSelectAsset,
  onOpenDetail,
  onOpenPreview,
  onDeleteAsset,
}) => {
  const isAllSelected = assets.length > 0 && selectedAssetIds.length === assets.length;

  if (assets.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">
          Không tìm thấy tệp media nào trong danh sách
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="p-3 w-10 text-center sticky left-0 bg-slate-50 dark:bg-slate-850 z-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                />
              </th>
              <th className="p-3 min-w-[220px]">Tệp Media & Tiêu đề</th>
              <th className="p-3">Loại tệp</th>
              <th className="p-3">Kích thước / Dung lượng</th>
              <th className="p-3">Metadata</th>
              <th className="p-3">Thư mục</th>
              <th className="p-3 text-center">Nơi sử dụng</th>
              <th className="p-3">Người đăng</th>
              <th className="p-3 text-right sticky right-0 bg-slate-50 dark:bg-slate-850 z-10">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {assets.map((asset) => {
              const isSelected = selectedAssetIds.includes(asset.id);
              const isDoc = asset.type === 'document';
              const isVid = asset.type === 'video';

              return (
                <tr
                  key={asset.id}
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                    isSelected ? 'bg-orange-50/40 dark:bg-orange-950/20' : ''
                  }`}
                >
                  {/* Selection */}
                  <td className="p-3 text-center sticky left-0 bg-white dark:bg-slate-900 z-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectAsset(asset.id)}
                      className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                    />
                  </td>

                  {/* Media Item & Title */}
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200/80 dark:border-slate-800 cursor-pointer relative group"
                        onClick={() => onOpenPreview(asset)}
                      >
                        {isDoc ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-6 h-6 text-rose-500" />
                          </div>
                        ) : (
                          <img
                            src={asset.thumbnail_url || asset.url}
                            alt={asset.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        {isVid && (
                          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                            <Video className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      <div className="min-w-0">
                        <h4
                          className="font-bold text-slate-900 dark:text-white truncate hover:text-orange-600 cursor-pointer max-w-[260px]"
                          onClick={() => onOpenDetail(asset)}
                          title={asset.title}
                        >
                          {asset.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-mono truncate max-w-[260px]">
                          {asset.filename}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="p-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                      {isDoc ? (
                        <>
                          <FileText className="w-3.5 h-3.5 text-rose-500" /> Document
                        </>
                      ) : isVid ? (
                        <>
                          <Video className="w-3.5 h-3.5 text-orange-500" /> Video
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-3.5 h-3.5 text-blue-500" /> Image
                        </>
                      )}
                    </span>
                  </td>

                  {/* Size */}
                  <td className="p-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                    <div>{(asset.file_size_kb / 1024).toFixed(1)} MB</div>
                    {asset.width && asset.height && (
                      <div className="text-[10px] text-slate-400 font-mono">
                        {asset.width}x{asset.height} px
                      </div>
                    )}
                  </td>

                  {/* Metadata Status */}
                  <td className="p-3 whitespace-nowrap">
                    {asset.metadata_status === 'complete' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                        <CheckCircle2 className="w-3 h-3" /> Chuẩn SEO
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
                        <AlertTriangle className="w-3 h-3" /> Thiếu meta
                      </span>
                    )}
                  </td>

                  {/* Folder */}
                  <td className="p-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
                      <Folder className="w-3.5 h-3.5 text-amber-500" /> {asset.folder_name}
                    </span>
                  </td>

                  {/* Used By */}
                  <td className="p-3 text-center whitespace-nowrap">
                    {asset.used_by_count > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <Layers className="w-3 h-3" /> {asset.used_by_count} nơi
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Chưa dùng</span>
                    )}
                  </td>

                  {/* Owner */}
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <img
                        src={asset.owner_avatar}
                        alt={asset.owner_name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {asset.owner_name}
                      </span>
                    </div>
                  </td>

                  {/* Action Sticky Right */}
                  <td className="p-3 text-right whitespace-nowrap sticky right-0 bg-white dark:bg-slate-900 z-10">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onOpenPreview(asset)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenDetail(asset)}
                        className="p-1.5 text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/40 rounded-lg transition-colors"
                        title="Chỉnh sửa metadata"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteAsset(asset.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Xóa tệp"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
