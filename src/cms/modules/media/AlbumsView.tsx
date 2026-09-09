import React, { useEffect, useState } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Grid,
  List,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  Layers,
  ArrowUpDown,
  Image as ImageIcon,
  GripVertical,
  ChevronUp,
  ChevronDown,
  X,
  Check,
} from 'lucide-react';
import { MediaAlbum, MediaAsset } from './types';
import { CmsPagination } from '../../components/ui/CmsPagination';
import { useDialogA11y } from '../activity_logs_trash/useDialogA11y';

interface AlbumsViewProps {
  albums: MediaAlbum[];
  assets: MediaAsset[];
  onUpdateAlbum: (album: MediaAlbum) => void;
  onCreateAlbum: (album: MediaAlbum) => void;
  onDeleteAlbum: (id: string) => void;
  onOpenPreviewAsset: (asset: MediaAsset) => void;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export const AlbumsView: React.FC<AlbumsViewProps> = ({
  albums,
  assets,
  onUpdateAlbum,
  onCreateAlbum,
  onDeleteAlbum,
  onOpenPreviewAsset,
  canCreate,
  canEdit,
  canDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingAlbum, setEditingAlbum] = useState<MediaAlbum | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const editorRef=useDialogA11y(isEditorOpen,()=>setIsEditorOpen(false));

  const filteredAlbums = albums.filter((alb) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      alb.title.toLowerCase().includes(q) ||
      alb.code_alias.toLowerCase().includes(q) ||
      alb.description.toLowerCase().includes(q)
    );
  });
  const paginatedAlbums = filteredAlbums.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  useEffect(() => {
    const lastPage = Math.max(1, Math.ceil(filteredAlbums.length / pageSize));
    if (currentPage > lastPage) setCurrentPage(lastPage);
  }, [currentPage, filteredAlbums.length, pageSize]);

  const handleEdit = (alb: MediaAlbum) => {
    setEditingAlbum({ ...alb });
    setIsEditorOpen(true);
  };
  const handleCreate = () => {
    const now=new Date().toISOString();
    setEditingAlbum({id:'',title:'',code_alias:'',description:'',asset_ids:[],item_count:0,display_order:albums.length+1,workflow_status:'draft',owner_name:'',created_at:now,updated_at:now});
    setIsEditorOpen(true);
  };

  const handleSaveEditor = () => {
    if (editingAlbum) {
      if(editingAlbum.id) onUpdateAlbum(editingAlbum); else onCreateAlbum(editingAlbum);
    }
    setIsEditorOpen(false);
  };

  const handleRemoveMediaFromAlbum = (assetId: string) => {
    if (!editingAlbum) return;
    const updatedIds = editingAlbum.asset_ids.filter((id) => id !== assetId);
    setEditingAlbum({
      ...editingAlbum,
      asset_ids: updatedIds,
      item_count: updatedIds.length,
    });
  };
  const handleMoveMedia = (index: number, direction: -1 | 1) => {
    if (!editingAlbum) return;
    const target = index + direction;
    if (target < 0 || target >= editingAlbum.asset_ids.length) return;
    const assetIds = [...editingAlbum.asset_ids];
    [assetIds[index], assetIds[target]] = [assetIds[target], assetIds[index]];
    setEditingAlbum({ ...editingAlbum, asset_ids: assetIds });
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex items-center flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder={`Tìm kiếm ${albums.length} Album theo tên, alias...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base focus:ring-2 focus:ring-orange-500 focus:outline-none sm:text-xs"
          />
        </div>

        <button
          type="button"
          onClick={handleCreate}
          disabled={!canCreate}
          className="min-h-11 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> + Tạo Album Mới
        </button>
      </div>

      {/* Album Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginatedAlbums.map((alb) => {
          return (
            <div
              key={alb.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              {/* Cover Image */}
              <div className="relative aspect-16/10 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {alb.cover_asset_url ? (
                  <img
                    src={alb.cover_asset_url}
                    alt={alb.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <FolderKanban className="w-10 h-10" />
                  </div>
                )}

                <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> {alb.asset_ids.length} tệp
                </div>

                <div className="absolute top-2 left-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      alb.workflow_status === 'published'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {alb.workflow_status === 'published' ? 'Đã xuất bản' : 'Bản thảo'}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1 mb-1">
                    {alb.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono mb-2">#{alb.code_alias}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                    {alb.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{alb.owner_name}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(alb)}
                      disabled={!canEdit}
                      className="flex min-h-11 min-w-11 items-center justify-center text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/40 rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                      title="Chỉnh sửa album & Sắp xếp media"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteAlbum(alb.id)}
                      disabled={!canDelete}
                      className="flex min-h-11 min-w-11 items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                      title="Xóa album"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {filteredAlbums.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <FolderKanban className="mx-auto size-10 text-slate-300 dark:text-slate-600" />
          <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">Không tìm thấy Album nào</h3>
          <p className="mx-auto mt-1 max-w-md text-xs text-slate-500">Thử đổi từ khóa tìm kiếm hoặc tạo Album mới để nhóm các tệp Media.</p>
        </div>
      )}
      {filteredAlbums.length > 0 && <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><CmsPagination currentPage={currentPage} pageSize={pageSize} totalCount={filteredAlbums.length} itemLabel="album" onPageChange={setCurrentPage} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} /></div>}

      {/* ALBUM EDITOR DRAWER */}
      {isEditorOpen && editingAlbum && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div ref={editorRef} role="dialog" aria-modal="true" aria-label="Biên tập Album Media" tabIndex={-1} className="w-full max-w-3xl bg-white dark:bg-slate-900 h-dvh flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-800">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-orange-600" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingAlbum.id ? `Chỉnh sửa Album: ${editingAlbum.title}` : 'Tạo Album mới'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="flex min-h-11 min-w-11 items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl"
                aria-label="Đóng trình biên tập Album"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form & Media Order List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
              {/* Basic Album Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tên Album *
                  </label>
                  <input
                    type="text"
                    value={editingAlbum.title}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, title: e.target.value })}
                    className="min-h-11 w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none sm:text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Mã Alias (URL Code)
                    </label>
                    <input
                      type="text"
                      value={editingAlbum.code_alias}
                      onChange={(e) => setEditingAlbum({ ...editingAlbum, code_alias: e.target.value })}
                      className="min-h-11 w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none sm:text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Trạng thái Xuất bản
                    </label>
                    <select
                      value={editingAlbum.workflow_status}
                      onChange={(e) => setEditingAlbum({ ...editingAlbum, workflow_status: e.target.value as any })}
                      className="min-h-11 w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base focus:ring-2 focus:ring-orange-500 focus:outline-none sm:text-xs"
                    >
                      <option value="draft">Bản thảo (Draft)</option>
                      <option value="published">Đã xuất bản (Published)</option>
                      <option value="archived">Lưu trữ (Archived)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mô tả nội dung Album
                  </label>
                  <textarea
                    rows={2}
                    value={editingAlbum.description}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, description: e.target.value })}
                    className="min-h-11 w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base focus:ring-2 focus:ring-orange-500 focus:outline-none sm:text-xs"
                  />
                </div>
              </div>

              {/* Media Ordering & Items in Album */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-orange-500" /> Các tệp thuộc Album ({editingAlbum.asset_ids.length})
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Dùng nút lên/xuống để sắp xếp; xóa khỏi Album không làm mất file gốc
                  </span>
                </div>

                <div className="space-y-2">
                  {editingAlbum.asset_ids.map((assetId, index) => {
                    const matchedAsset = assets.find((a) => a.id === assetId);
                    if (!matchedAsset) return null;

                    return (
                      <div
                        key={assetId}
                        className="flex flex-col items-stretch justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:flex-row sm:items-center"
                      >
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                          <span className="w-5 font-bold text-slate-400 text-[11px]">{index + 1}</span>
                          <img
                            src={matchedAsset.thumbnail_url || matchedAsset.url}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">{matchedAsset.title}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{matchedAsset.filename}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => handleMoveMedia(index, -1)} disabled={index === 0} className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800" aria-label={`Đưa ${matchedAsset.title} lên`}><ChevronUp className="size-4" /></button>
                          <button type="button" onClick={() => handleMoveMedia(index, 1)} disabled={index === editingAlbum.asset_ids.length - 1} className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800" aria-label={`Đưa ${matchedAsset.title} xuống`}><ChevronDown className="size-4" /></button>
                          {editingAlbum.cover_asset_id === assetId ? (
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-md">
                              Ảnh bìa (Cover)
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setEditingAlbum({
                                  ...editingAlbum,
                                  cover_asset_id: assetId,
                                  cover_asset_url: matchedAsset.url,
                                })
                              }
                              className="min-h-11 px-2 text-[11px] text-slate-500 hover:text-orange-600 font-medium"
                            >
                              Đặt làm ảnh bìa
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveMediaFromAlbum(assetId)}
                            className="flex min-h-11 min-w-11 items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                            title="Xóa khỏi album"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-end gap-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="min-h-11 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveEditor}
                className="min-h-11 px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Lưu Album
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
