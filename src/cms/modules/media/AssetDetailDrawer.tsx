import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Globe,
  Layers,
  FileText,
  Image as ImageIcon,
  Video,
  Download,
  Trash2,
  RefreshCw,
  Crop,
  History,
  Info,
  Tag,
  Folder,
  User,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { MediaAsset, AssetVariant } from './types';

interface AssetDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  asset: MediaAsset | null;
  onSaveAsset: (updatedAsset: MediaAsset) => void;
  onOpenReplaceModal: (asset: MediaAsset) => void;
  onDeleteAsset: (id: string) => void;
}

export const AssetDetailDrawer: React.FC<AssetDetailDrawerProps> = ({
  isOpen,
  onClose,
  asset,
  onSaveAsset,
  onOpenReplaceModal,
  onDeleteAsset,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'variants' | 'used_by' | 'versions' | 'activity'>('details');
  const [editedAsset, setEditedAsset] = useState<MediaAsset | null>(null);

  // Crop focal point simulation state
  const [focalPoint, setFocalPoint] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  useEffect(() => {
    if (asset) {
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
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-300 flex items-center justify-center font-bold">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white truncate max-w-md">
                {editedAsset.title}
              </h2>
              <p className="text-xs text-slate-400 font-mono">{editedAsset.filename}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenReplaceModal(editedAsset)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-orange-500" /> Replace File
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {/* Top Preview Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            {/* Left Preview Box */}
            <div className="md:col-span-6 aspect-16/10 bg-slate-900 rounded-xl overflow-hidden relative flex items-center justify-center group">
              {editedAsset.type === 'document' ? (
                <div className="text-center p-6 text-white">
                  <FileText className="w-16 h-16 text-rose-400 mx-auto mb-2" />
                  <p className="text-sm font-bold truncate max-w-xs">{editedAsset.filename}</p>
                  <p className="text-xs text-slate-400">{editedAsset.mime_type}</p>
                </div>
              ) : editedAsset.type === 'video' ? (
                <video
                  src={editedAsset.url}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={editedAsset.url}
                  alt={editedAsset.title}
                  className="w-full h-full object-contain"
                />
              )}

              <a
                href={editedAsset.url}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-3 right-3 px-2.5 py-1 bg-slate-900/80 text-white text-[11px] font-medium rounded-lg backdrop-blur-xs flex items-center gap-1 hover:bg-slate-900"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Mở gốc
              </a>
            </div>

            {/* Right Quick Summary */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Thông số kỹ thuật
                </span>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Dung lượng</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {(editedAsset.file_size_kb / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Độ phân giải</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {editedAsset.width && editedAsset.height ? `${editedAsset.width} x ${editedAsset.height}` : 'N/A'}
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 text-[11px] block">MIME Type</span>
                    <span className="font-mono text-[11px] font-medium text-slate-700 dark:text-slate-300">
                      {editedAsset.mime_type}
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Số nơi sử dụng</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {editedAsset.used_by_count} vị trí
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <img src={editedAsset.owner_avatar} className="w-5 h-5 rounded-full" alt="" />
                  <span>Đăng bởi {editedAsset.owner_name}</span>
                </div>
                <span>{new Date(editedAsset.created_at).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            {[
              { id: 'details', label: 'Metadata & Accessible Alt', icon: Info },
              { id: 'variants', label: 'Crop & Adaptive Variants', icon: Crop },
              { id: 'used_by', label: `Nơi sử dụng (${editedAsset.used_by_count})`, icon: Layers },
              { id: 'versions', label: `Lịch sử phiên bản (${editedAsset.versions.length})`, icon: History },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === t.id
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: DETAILS & ACCESSIBILITY */}
          {activeTab === 'details' && (
            <div className="space-y-5">
              {/* Title & Description */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tiêu đề hiển thị (Asset Title) *
                  </label>
                  <input
                    type="text"
                    value={editedAsset.title}
                    onChange={(e) => setEditedAsset({ ...editedAsset, title: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mô tả ghi chú (Internal Description)
                  </label>
                  <textarea
                    rows={2}
                    value={editedAsset.description || ''}
                    onChange={(e) => setEditedAsset({ ...editedAsset, description: e.target.value })}
                    placeholder="Ghi chú thêm về bối cảnh chụp hoặc mục đích sử dụng..."
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Multilingual Accessible Alt Text */}
              <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Văn bản thay thế cho Trình đọc màn hình & SEO (Alt Text)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">WCAG 2.2 AA Standard</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Tiếng Việt (VI) *
                    </label>
                    <input
                      type="text"
                      value={editedAsset.alt_text.vi}
                      onChange={(e) =>
                        setEditedAsset({
                          ...editedAsset,
                          alt_text: { ...editedAsset.alt_text, vi: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      English (EN)
                    </label>
                    <input
                      type="text"
                      value={editedAsset.alt_text.en}
                      onChange={(e) =>
                        setEditedAsset({
                          ...editedAsset,
                          alt_text: { ...editedAsset.alt_text, en: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      日本語 (JA)
                    </label>
                    <input
                      type="text"
                      value={editedAsset.alt_text.ja}
                      onChange={(e) =>
                        setEditedAsset({
                          ...editedAsset,
                          alt_text: { ...editedAsset.alt_text, ja: e.target.value },
                        })
                      }
                      placeholder="Thiếu bản dịch..."
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* License & Rights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tác giả / Nguồn ảnh (Credit)
                  </label>
                  <input
                    type="text"
                    value={editedAsset.credit_author || ''}
                    onChange={(e) => setEditedAsset({ ...editedAsset, credit_author: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bản quyền & License
                  </label>
                  <select
                    value={editedAsset.license_type || 'internal'}
                    onChange={(e) => setEditedAsset({ ...editedAsset, license_type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    <option value="internal">Sở hữu nội bộ (Internal Corporate)</option>
                    <option value="purchased">Bản quyền mua (Stock License)</option>
                    <option value="cc_by">Creative Commons (CC-BY)</option>
                    <option value="editorial">Dùng riêng cho báo chí (Editorial Only)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

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
                  {[
                    { preset: '16:9 Banner Desktop', ratio: '1920 x 1080', format: 'WebP', size: '480 KB', status: 'ready' },
                    { preset: '4:3 Card Thumbnail', ratio: '800 x 600', format: 'WebP', size: '210 KB', status: 'ready' },
                    { preset: '1:1 Square Mobile', ratio: '500 x 500', format: 'AVIF', size: '140 KB', status: 'ready' },
                  ].map((v, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{v.preset}</span>
                        <span className="font-mono text-slate-400 text-[11px]">{v.ratio}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                          {v.format}
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">{v.size}</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                          <Check className="w-3.5 h-3.5" /> Ready
                        </span>
                      </div>
                    </div>
                  ))}
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

                      <button
                        type="button"
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                      >
                        Rollback
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onDeleteAsset(editedAsset.id)}
            className="px-4 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Xóa tệp này
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Lưu Metadata
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
