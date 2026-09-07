/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import {
  Check,
  Crop,
  ExternalLink,
} from 'lucide-react';
import { MediaAsset, MediaFolder } from './types';
import { useDialogA11y } from '../activity_logs_trash/useDialogA11y';
import { AssetDetailFooter, AssetDetailHeader, AssetDetailNavigation, AssetPreviewSummary, type AssetDetailTab } from './AssetDetailChrome';
import { AssetMetadataEditor } from './AssetMetadataEditor';

interface AssetDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  asset: MediaAsset | null;
  onSaveAsset: (updatedAsset: MediaAsset) => void;
  onOpenReplaceModal: (asset: MediaAsset) => void;
  onDeleteAsset: (id: string) => void;
  folders: MediaFolder[];
  canEdit: boolean;
  canDelete: boolean;
  canReplace: boolean;
}

export const AssetDetailDrawer: React.FC<AssetDetailDrawerProps> = ({
  isOpen,
  onClose,
  asset,
  onSaveAsset,
  onOpenReplaceModal,
  onDeleteAsset,
  folders,
  canEdit,
  canDelete,
  canReplace,
}) => {
  const [activeTab, setActiveTab] = useState<AssetDetailTab>('details');
  const [editedAsset, setEditedAsset] = useState<MediaAsset | null>(null);

  // Crop focal point simulation state
  const [focalPoint, setFocalPoint] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const dialogRef=useDialogA11y(isOpen,onClose);

  useEffect(() => {
    if (asset) {
      // Synchronize the editable draft whenever the selected drawer asset changes.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditedAsset({ ...asset });
      if (asset.variants && asset.variants.length > 0 && asset.variants[0].focal_point) {
        setFocalPoint(asset.variants[0].focal_point);
      }
    }
  }, [asset]);

  if (!isOpen || !editedAsset) return null;

  const handleSave = () => {
    onSaveAsset(editedAsset);
    onClose();
  };

  const handleFocalPointClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setFocalPoint({ x, y });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Chi tiết tệp Media" tabIndex={-1} className="w-full max-w-4xl bg-white dark:bg-slate-900 h-dvh flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-800">
        <AssetDetailHeader asset={editedAsset} canReplace={canReplace} onReplace={() => onOpenReplaceModal(editedAsset)} onClose={onClose} />

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
          <AssetPreviewSummary asset={editedAsset} />

          <AssetDetailNavigation activeTab={activeTab} asset={editedAsset} onChange={setActiveTab} />

          {activeTab === 'details' && <AssetMetadataEditor asset={editedAsset} folders={folders} onChange={setEditedAsset} />}

          {/* TAB 2: CROP & ADAPTIVE VARIANTS */}
          {activeTab === 'variants' && (
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                  <Crop className="w-4 h-4 text-orange-500" /> Điểm hội tụ ảnh (Focal Point Selector)
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Bấm vào vị trí quan trọng nhất trên ảnh để hệ thống giữ khung hình khi crop tự động theo tỉ lệ màn hình mobile/desktop.
                </p>

                <div className="relative aspect-16/9 bg-slate-950 rounded-xl overflow-hidden cursor-crosshair max-w-xl mx-auto" onClick={handleFocalPointClick}>
                  <img src={editedAsset.url} alt="" className="w-full h-full object-contain" />

                  {/* Focal point indicator */}
                  <div
                    className="absolute w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-orange-500 bg-orange-500/30 flex items-center justify-center shadow-lg transition-all"
                    style={{ left: `${focalPoint.x}%`, top: `${focalPoint.y}%` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-orange-600" />
                  </div>
                </div>

                <div className="mt-3 text-center text-xs font-mono text-slate-400">
                  Focal Point: X={focalPoint.x}%, Y={focalPoint.y}%
                </div>
              </div>

              {/* Preset Variations Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-3">
                  Danh sách Biến thể Tự động (Presets & WebP)
                </h4>
                <div className="space-y-2">
                  {editedAsset.variants.map((v) => (
                    <div
                      key={v.id}
                      className="flex flex-col items-stretch justify-between gap-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:flex-row sm:items-center"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{v.preset_name}</span>
                        <span className="font-mono text-slate-400 text-[11px]">{v.width} x {v.height}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                          {v.format}
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">{v.file_size_kb} KB</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                          <Check className="w-3.5 h-3.5" /> {v.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {editedAsset.variants.length===0&&<div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500 dark:border-slate-700">Chưa có biến thể được xử lý cho tệp này.</div>}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: USED BY / REFERENCES */}
          {activeTab === 'used_by' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Danh sách các trang & module đang nhúng asset này
                </h4>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
                  {editedAsset.used_by_count} vị trí tham chiếu
                </span>
              </div>

              {editedAsset.used_by_refs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-850 rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
                  File chưa được nhúng ở bất kỳ nội dung nào. Bạn có thể thay thế hoặc xóa an toàn.
                </div>
              ) : (
                <div className="space-y-2">
                  {editedAsset.used_by_refs.map((ref) => (
                    <div
                      key={ref.id}
                      className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs hover:border-orange-500 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600">
                          {ref.entity_type}
                        </span>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{ref.entity_title}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{ref.path}</p>
                        </div>
                      </div>

                      <a
                        href={ref.path}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-medium flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Đến trang
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: VERSIONS */}
          {activeTab === 'versions' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Lịch sử thay thế và khôi phục phiên bản tệp gốc
              </h4>

              {editedAsset.versions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-850 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-xs">
                  File hiện tại là phiên bản gốc v1.0, chưa từng bị thay thế.
                </div>
              ) : (
                <div className="space-y-3">
                  {editedAsset.versions.map((ver) => (
                    <div
                      key={ver.version_number}
                      className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-orange-600">v{ver.version_number.toFixed(1)}</span>
                          <span className="text-slate-400 font-mono">{ver.filename}</span>
                        </div>
                        <p className="text-slate-500">{ver.note}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Thay thế bởi {ver.replaced_by} • {new Date(ver.replaced_at).toLocaleString('vi-VN')}
                        </p>
                      </div>

                      <span className="text-[11px] font-medium text-slate-400">Bản lưu chỉ đọc</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <AssetDetailFooter assetId={editedAsset.id} canEdit={canEdit} canDelete={canDelete} onClose={onClose} onDelete={onDeleteAsset} onSave={handleSave} />
      </div>
    </div>
  );
};
