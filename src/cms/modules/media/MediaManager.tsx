import React, { useState } from 'react';
import {
  UploadCloud,
  Plus,
  Search,
  Grid,
  List,
  Folder,
  FolderPlus,
  ShieldAlert,
  Trash2,
  CheckCircle2,
  Clock,
  Filter,
  Eye,
  X,
  SlidersHorizontal,
  FolderKanban,
  FileText,
  Image as ImageIcon,
  Video,
  Globe,
  Tag,
  Download,
  Check,
  Sparkles,
  HelpCircle,
  FileCode,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import {
  MediaAsset,
  MediaAlbum,
  MediaFolder,
  MediaIssue,
  MainTabType,
  ViewMode,
  SavedFilterView,
  UploadFileItem,
} from './types';
import type { CmsLocale } from '../../data/CmsDataSource';
import type { MediaModuleData } from '../../data/MediaDataSource';
import { MediaGridView } from './MediaGridView';
import { MediaListView } from './MediaListView';
import { AssetDetailDrawer } from './AssetDetailDrawer';
import { AlbumsView } from './AlbumsView';
import { UploadQueueDrawer } from './UploadQueueDrawer';
import { ReplaceArchiveModal } from './ReplaceArchiveModal';

interface MediaManagerProps {
  workspaceLocale: CmsLocale;
  data: MediaModuleData;
}

export const MediaManager: React.FC<MediaManagerProps> = ({ workspaceLocale, data }) => {
  // Main State
  const [assets, setAssets] = useState<MediaAsset[]>(data.assets);
  const [albums, setAlbums] = useState<MediaAlbum[]>(data.albums);
  const [folders, setFolders] = useState<MediaFolder[]>(data.folders);
  const [issues, setIssues] = useState<MediaIssue[]>(data.issues);

  const [activeTab, setActiveTab] = useState<MainTabType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [cardSize, setCardSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [savedFilter, setSavedFilter] = useState<SavedFilterView>('all');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('f_all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Drawers & Modals State
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailAsset, setDetailAsset] = useState<MediaAsset | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

  const [isUploadQueueOpen, setIsUploadQueueOpen] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadFileItem[]>([]);

  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [replaceAssetItem, setReplaceAssetItem] = useState<MediaAsset | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter Assets Logic
  const filteredAssets = assets.filter((ast) => {
    // Trash tab filter
    if (activeTab === 'trash') {
      if (!ast.deleted_at) return false;
    } else {
      if (ast.deleted_at) return false;
    }

    // Type Tabs
    if (activeTab === 'images' && ast.type !== 'image') return false;
    if (activeTab === 'videos' && ast.type !== 'video') return false;
    if (activeTab === 'documents' && ast.type !== 'document') return false;
    if (activeTab === 'my_uploads' && ast.owner_name !== data.currentUserName) return false;
    if (activeTab === 'incomplete_metadata' && ast.metadata_status !== 'incomplete') return false;
    if (activeTab === 'issues') {
      const hasIssue = issues.some((i) => i.asset_id === ast.id);
      if (!hasIssue) return false;
    }

    // Saved View Pills
    if (savedFilter === 'my_uploads' && ast.owner_name !== data.currentUserName) return false;
    if (savedFilter === 'missing_alt' && !Object.values(ast.alt_text).some((v) => !String(v || '').trim())) return false;
    if (savedFilter === 'unused' && ast.used_by_count > 0) return false;
    if (savedFilter === 'issues' && !issues.some((i) => i.asset_id === ast.id)) return false;

    // Folder Filter
    if (selectedFolderId !== 'f_all' && ast.folder_id !== selectedFolderId) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = ast.title.toLowerCase().includes(q);
      const matchFile = ast.filename.toLowerCase().includes(q);
      const matchTag = ast.tags.some((t) => t.toLowerCase().includes(q));
      const matchOwner = ast.owner_name.toLowerCase().includes(q);
      if (!matchTitle && !matchFile && !matchTag && !matchOwner) return false;
    }

    return true;
  });

  // Handlers
  const handleOpenUpload = () => {
    const newItems: UploadFileItem[] = [
      {
        id: `upl_${Date.now()}_1`,
        file_name: 'anh-cong-trinh-thi-cong-thuc-te-2025.jpg',
        file_size_kb: 2400,
        mime_type: 'image/jpeg',
        progress: 100,
        status: 'completed',
        title: 'Ảnh công trình thi công thực tế 2025',
      },
      {
        id: `upl_${Date.now()}_2`,
        file_name: 'catalog-giai-phap-chong-tham-cic.pdf',
        file_size_kb: 5800,
        mime_type: 'application/pdf',
        progress: 75,
        status: 'uploading',
        title: 'Catalog Giải pháp Chống thấm CIC',
      },
    ];
    setUploadQueue(newItems);
    setIsUploadQueueOpen(true);
  };

  const handleCompleteUploadQueue = (items: UploadFileItem[]) => {
    const created: MediaAsset[] = items.map((item, idx) => ({
      id: `ast_uploaded_${Date.now()}_${idx}`,
      filename: item.file_name,
      title: item.title || item.file_name,
      type: item.mime_type.startsWith('video') ? 'video' : item.mime_type.includes('pdf') ? 'document' : 'image',
      mime_type: item.mime_type,
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=1200&auto=format&fit=crop&q=80',
      thumbnail_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=400&auto=format&fit=crop&q=80',
      file_size_kb: item.file_size_kb,
      width: 1920,
      height: 1080,
      alt_text: { vi: item.title || item.file_name, en: '', ja: '' },
      folder_id: 'f_products',
      folder_name: 'Sản phẩm & Vật liệu',
      album_ids: [],
      tags: ['Tải lên mới', 'Media 2025'],
      used_by_count: 0,
      used_by_refs: [],
      workflow_status: 'ready',
      metadata_status: 'incomplete',
      variants: [],
      versions: [],
      owner_name: 'Nguyễn Văn Minh',
      owner_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    setAssets((prev) => [...created, ...prev]);
    setIsUploadQueueOpen(false);
    showToast(`Đã tải lên và bổ sung ${created.length} tệp media mới!`);
  };

  const handleSaveAssetDetail = (updatedAsset: MediaAsset) => {
    setAssets((prev) => prev.map((a) => (a.id === updatedAsset.id ? updatedAsset : a)));
    showToast(`Đã cập nhật thông tin metadata của "${updatedAsset.title}"!`);
  };

  const handleDeleteAsset = (id: string) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, deleted_at: new Date().toISOString() } : a))
    );
    if (detailAsset?.id === id) setIsDetailOpen(false);
    showToast(`Đã chuyển tệp media vào Thùng Rác`);
  };

  const handleConfirmReplaceFile = (ast: MediaAsset, note: string) => {
    const nextVersionNum = (ast.versions.length + 1).toFixed(1);
    setAssets((prev) =>
      prev.map((a) =>
        a.id === ast.id
          ? {
              ...a,
              versions: [
                {
                  version_number: parseFloat(nextVersionNum),
                  filename: `replaced-v${nextVersionNum}-${a.filename}`,
                  file_size_kb: a.file_size_kb,
                  replaced_by: 'Nguyễn Văn Minh',
                  replaced_at: new Date().toISOString(),
                  note: note || 'Cập nhật thay thế tệp gốc',
                  url: a.url,
                },
                ...a.versions,
              ],
              updated_at: new Date().toISOString(),
            }
          : a
      )
    );
    showToast(`Đã thay thế tệp gốc toàn cục và giữ nguyên ${ast.used_by_count} tham chiếu!`);
  };

  const handleToggleSelectAll = () => {
    if (selectedAssetIds.length === filteredAssets.length) {
      setSelectedAssetIds([]);
    } else {
      setSelectedAssetIds(filteredAssets.map((a) => a.id));
    }
  };

  const handleToggleSelectAsset = (id: string) => {
    if (selectedAssetIds.includes(id)) {
      setSelectedAssetIds(selectedAssetIds.filter((item) => item !== id));
    } else {
      setSelectedAssetIds([...selectedAssetIds, id]);
    }
  };

  const handleBulkDelete = () => {
    setAssets((prev) =>
      prev.map((a) =>
        selectedAssetIds.includes(a.id)
          ? { ...a, deleted_at: new Date().toISOString() }
          : a
      )
    );
    setSelectedAssetIds([]);
    showToast(`Đã chuyển ${selectedAssetIds.length} tệp media vào Thùng Rác`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white border border-slate-700 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Module Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Thư Viện Media · metadata {workspaceLocale.toUpperCase()}
            </h1>
            <span className="text-xs font-bold uppercase bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 px-2.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-900">
              THƯ VIỆN MEDIA
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Nguồn tài nguyên hình ảnh, video và tài liệu dùng chung toàn CMS; bảo toàn 14 Album khảo sát, hỗ trợ crop variant, used-by & thay thế tệp an toàn.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('albums')}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <FolderKanban className="w-4 h-4 text-orange-500" />
            <span>14 Albums Khảo Sát</span>
          </button>

          <button
            type="button"
            onClick={handleOpenUpload}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4" /> + Upload Media Mới
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1">
          {[
            { id: 'all', label: 'Tất cả media', count: assets.filter((a) => !a.deleted_at).length },
            { id: 'images', label: 'Ảnh', count: assets.filter((a) => !a.deleted_at && a.type === 'image').length },
            { id: 'videos', label: 'Video', count: assets.filter((a) => !a.deleted_at && a.type === 'video').length },
            { id: 'documents', label: 'Tài liệu PDF', count: assets.filter((a) => !a.deleted_at && a.type === 'document').length },
            { id: 'albums', label: 'Albums & Bộ sưu tập', count: albums.length },
            { id: 'my_uploads', label: 'Uploads của tôi', count: assets.filter((a) => !a.deleted_at && a.owner_name === 'Nguyễn Văn Minh').length },
            { id: 'incomplete_metadata', label: 'Cần bổ sung Meta', count: assets.filter((a) => !a.deleted_at && a.metadata_status === 'incomplete').length },
            { id: 'issues', label: 'Trùng / Vấn đề', count: issues.length },
            { id: 'trash', label: 'Thùng rác', count: assets.filter((a) => a.deleted_at).length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === tab.id ? 'bg-orange-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* View Mode Switcher (Grid / List) */}
        {activeTab !== 'albums' && (
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-400'
              }`}
              title="Dạng lưới ảnh (Grid View)"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-400'
              }`}
              title="Dạng danh sách bảng (List View)"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area (Layout with Left Folder Sidebar & Asset View) */}
      {activeTab === 'albums' ? (
        <AlbumsView
          albums={albums}
          assets={assets}
          onUpdateAlbum={(updatedAlb) => {
            setAlbums((prev) => prev.map((a) => (a.id === updatedAlb.id ? updatedAlb : a)));
            showToast(`Đã lưu thay đổi Album "${updatedAlb.title}"!`);
          }}
          onCreateAlbum={() => {
            const newAlb: MediaAlbum = {
              id: `alb_${Date.now()}`,
              title: 'Album Bộ Sưu Tập Mới 2025',
              code_alias: 'new-album-2025',
              description: 'Mô tả album mới tạo...',
              asset_ids: [],
              item_count: 0,
              display_order: albums.length + 1,
              workflow_status: 'draft',
              owner_name: 'Nguyễn Văn Minh',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            setAlbums([newAlb, ...albums]);
            showToast(`Đã tạo Album mới thành công!`);
          }}
          onDeleteAlbum={(id) => {
            setAlbums((prev) => prev.filter((a) => a.id !== id));
            showToast(`Đã xóa Album!`);
          }}
          onOpenPreviewAsset={(ast) => {
            setPreviewAsset(ast);
            setIsPreviewOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Folder Panel */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Thư mục & Phân loại
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const fName = prompt('Nhập tên thư mục mới:');
                    if (fName) {
                      setFolders([
                        ...folders,
                        { id: `f_${Date.now()}`, name: fName, code_alias: 'custom', icon: 'Folder', count: 0 },
                      ]);
                      showToast(`Đã tạo thư mục "${fName}"`);
                    }
                  }}
                  className="text-slate-400 hover:text-orange-600 p-1"
                  title="Thêm thư mục mới"
                >
                  <FolderPlus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                {folders.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFolderId(f.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      selectedFolderId === f.id
                        ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 font-bold border border-orange-200 dark:border-orange-900'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="truncate">{f.name}</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-mono">
                      {f.id === 'f_all'
                        ? assets.filter((a) => !a.deleted_at).length
                        : assets.filter((a) => !a.deleted_at && a.folder_id === f.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Main Assets Grid/List */}
          <div className="lg:col-span-9 space-y-4">
            {/* Filter Toolbar & Saved Views Pills */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-850 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên file, alt text, tag hoặc tác giả..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'my_uploads', label: 'Tệp của tôi' },
                  { id: 'missing_alt', label: 'Thiếu Alt' },
                  { id: 'unused', label: 'Chưa dùng (Unused)' },
                  { id: 'issues', label: 'Có xung đột' },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setSavedFilter(pill.id as any)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap ${
                      savedFilter === pill.id
                        ? 'bg-slate-800 text-white dark:bg-slate-700 font-bold'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedAssetIds.length > 0 && (
              <div className="bg-orange-950 text-white p-3 rounded-xl flex items-center justify-between animate-in fade-in duration-150">
                <span className="text-xs font-bold">
                  Đã chọn {selectedAssetIds.length} tệp media
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleBulkDelete}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Thùng Rác Hàng Loạt
                  </button>
                </div>
              </div>
            )}

            {/* View Render */}
            {viewMode === 'grid' ? (
              <MediaGridView
                assets={filteredAssets}
                selectedAssetIds={selectedAssetIds}
                onToggleSelectAll={handleToggleSelectAll}
                onToggleSelectAsset={handleToggleSelectAsset}
                onOpenDetail={(ast) => {
                  setDetailAsset(ast);
                  setIsDetailOpen(true);
                }}
                onOpenPreview={(ast) => {
                  setPreviewAsset(ast);
                  setIsPreviewOpen(true);
                }}
                onDeleteAsset={handleDeleteAsset}
                cardSize={cardSize}
              />
            ) : (
              <MediaListView
                assets={filteredAssets}
                selectedAssetIds={selectedAssetIds}
                onToggleSelectAll={handleToggleSelectAll}
                onToggleSelectAsset={handleToggleSelectAsset}
                onOpenDetail={(ast) => {
                  setDetailAsset(ast);
                  setIsDetailOpen(true);
                }}
                onOpenPreview={(ast) => {
                  setPreviewAsset(ast);
                  setIsPreviewOpen(true);
                }}
                onDeleteAsset={handleDeleteAsset}
              />
            )}
          </div>
        </div>
      )}

      {/* MODALS & DRAWERS */}
      <AssetDetailDrawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        asset={detailAsset}
        onSaveAsset={handleSaveAssetDetail}
        onOpenReplaceModal={(ast) => {
          setReplaceAssetItem(ast);
          setIsReplaceModalOpen(true);
        }}
        onDeleteAsset={handleDeleteAsset}
      />

      <UploadQueueDrawer
        isOpen={isUploadQueueOpen}
        onClose={() => setIsUploadQueueOpen(false)}
        queue={uploadQueue}
        onRemoveFromQueue={(id) => setUploadQueue(uploadQueue.filter((q) => q.id !== id))}
        onCompleteUpload={handleCompleteUploadQueue}
      />

      <ReplaceArchiveModal
        isOpen={isReplaceModalOpen}
        onClose={() => setIsReplaceModalOpen(false)}
        asset={replaceAssetItem}
        onConfirmReplace={handleConfirmReplaceFile}
      />

      {/* Lightbox Quick Preview Modal */}
      {isPreviewOpen && previewAsset && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[85vh] text-center space-y-3">
            {previewAsset.type === 'document' ? (
              <div className="p-12 bg-white rounded-2xl text-slate-900 max-w-md mx-auto">
                <FileText className="w-16 h-16 text-rose-500 mx-auto mb-3" />
                <h3 className="font-bold text-base mb-1">{previewAsset.title}</h3>
                <p className="text-xs text-slate-500 font-mono mb-4">{previewAsset.filename}</p>
                <a
                  href={previewAsset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Tải tài liệu PDF
                </a>
              </div>
            ) : previewAsset.type === 'video' ? (
              <video src={previewAsset.url} controls autoPlay className="max-h-[75vh] mx-auto rounded-xl shadow-2xl" />
            ) : (
              <img src={previewAsset.url} alt="" className="max-h-[75vh] mx-auto rounded-xl object-contain shadow-2xl" />
            )}
            <p className="text-sm font-bold text-white">{previewAsset.title}</p>
          </div>
        </div>
      )}
    </div>
  );
};
