import React, { useEffect, useRef, useState, useTransition } from 'react';
import {
  UploadCloud,
  Trash2,
  CheckCircle2,
  X,
  FolderKanban,
  Image as ImageIcon,
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
import type { MediaModuleData } from '../../data/MediaDataSource';
import { MediaGridView } from './MediaGridView';
import { MediaListView } from './MediaListView';
import { CmsBulkActionBar } from '../../components/ui/CmsBulkActionBar';
import { AssetDetailDrawer } from './AssetDetailDrawer';
import { AlbumsView } from './AlbumsView';
import { UploadQueueDrawer } from './UploadQueueDrawer';
import { ReplaceArchiveModal } from './ReplaceArchiveModal';
import { CmsButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { createMediaFolderAction, deleteMediaAlbumAction, refreshMediaAction, replaceMediaAssetAction, saveMediaAlbumAction, trashMediaAssetsAction, updateMediaMetadataAction, uploadMediaAction } from '@/features/media/server/actions';
import type { CmsLocale } from '../../data/CmsDataSource';
import { useDialogA11y } from '../activity_logs_trash/useDialogA11y';
import { filterMediaAssets } from './mediaFilters';
import { MediaNavigation } from './MediaNavigation';
import { MediaFolderPanel } from './MediaFolderPanel';
import { MediaFilterToolbar } from './MediaFilterToolbar';
import { MediaFolderDialog, MediaPreviewDialog } from './MediaDialogs';
import { CmsTrashConfirmDialog, sanitizeCmsErrorMessage } from '@/shared/ui/cms';

interface MediaManagerProps {
  data?: MediaModuleData;
  workspaceLocale: CmsLocale;
  capabilities: { create:boolean;edit:boolean;delete:boolean;replace:boolean };
}

export const MediaManager: React.FC<MediaManagerProps> = ({ data, workspaceLocale, capabilities }) => {
  // Main State
  const [assets, setAssets] = useState<MediaAsset[]>(data?.assets ?? []);
  const [albums, setAlbums] = useState<MediaAlbum[]>(data?.albums ?? []);
  const [folders, setFolders] = useState<MediaFolder[]>(data?.folders ?? []);
  const [issues, setIssues] = useState<MediaIssue[]>(data?.issues ?? []);

  const [activeTab, setActiveTab] = useState<MainTabType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [cardSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [savedFilter, setSavedFilter] = useState<SavedFilterView>('all');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('f_all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [trashTargets, setTrashTargets] = useState<MediaAsset[] | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Drawers & Modals State
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailAsset, setDetailAsset] = useState<MediaAsset | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

  const [isUploadQueueOpen, setIsUploadQueueOpen] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadFileItem[]>([]);

  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [replaceAssetItem, setReplaceAssetItem] = useState<MediaAsset | null>(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [, startTransition] = useTransition();
  const previewDialogRef = useDialogA11y(isPreviewOpen, () => setIsPreviewOpen(false));
  const folderDialogRef = useDialogA11y(isFolderModalOpen, () => setIsFolderModalOpen(false));
  const applyData = (next: MediaModuleData) => {
    setAssets(next.assets);
    setAlbums(next.albums);
    setFolders(next.folders);
    setIssues(next.issues);
    setSelectedAssetIds([]);
  };
  const reload = async () => applyData(await refreshMediaAction(workspaceLocale));

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // The data prop is the VI server snapshot; other workspaces intentionally reload on demand.
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (workspaceLocale === 'vi') {
      if (data) applyData(data);
      return;
    }
    void reload().catch(() => showToast('Không thể tải dữ liệu Media cho workspace này.'));
  }, [workspaceLocale]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const filteredAssets = filterMediaAssets(assets, issues, {
    activeTab,
    savedFilter,
    selectedFolderId,
    searchQuery,
  });

  // Handlers
  const handleOpenUpload = () => {
    uploadInputRef.current?.click();
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const selected = [...files];
    const items: UploadFileItem[] = selected.map((file, index) => ({
      id: `upload_${Date.now()}_${index}`,
      file_name: file.name,
      file_size_kb: Math.round(file.size / 1024),
      mime_type: file.type,
      progress: 5,
      status: 'uploading',
      title: file.name,
    }));
    setUploadQueue(items);
    setIsUploadQueueOpen(true);
    for (const [index, file] of selected.entries()) {
      const item = items[index];
      try {
        const form = new FormData();
        form.set('file', file);
        form.set('locale', workspaceLocale);
        form.set('title', file.name);
        await uploadMediaAction(form);
        setUploadQueue((current) => current.map((row) => row.id === item.id ? { ...row, progress: 100, status: 'completed' } : row));
      } catch (error) {
        setUploadQueue((current) => current.map((row) => row.id === item.id ? { ...row, progress: 100, status: 'error', error_message: sanitizeCmsErrorMessage(error, 'Tải lên thất bại') } : row));
      }
    }
    await reload();
    showToast('Đã xử lý hàng chờ tải lên.');
    if (uploadInputRef.current) uploadInputRef.current.value = '';
  };

  const handleSaveAssetDetail = (updatedAsset: MediaAsset) => {
    startTransition(async () => {
      try {
        await updateMediaMetadataAction(updatedAsset.id, { locale: workspaceLocale, title: updatedAsset.title, description: updatedAsset.description ?? null, altText: updatedAsset.alt_text, caption: updatedAsset.caption ?? null, creditAuthor: updatedAsset.credit_author ?? null, licenseType: updatedAsset.license_type ?? null, licenseExpiry: updatedAsset.license_expiry ?? null, tags: updatedAsset.tags, folderId: updatedAsset.folder_id || null });
        await reload();
        showToast(`Đã cập nhật metadata của "${updatedAsset.title}".`);
      } catch (error) {
        showToast(sanitizeCmsErrorMessage(error, 'Không thể cập nhật Media.'));
      }
    });
  };

  const handleDeleteAsset = (id: string) => {
    const target = assets.find((a) => a.id === id);
    if (target) {
      setTrashTargets([target]);
    }
  };

  const handleConfirmTrash = async () => {
    if (!trashTargets || trashTargets.length === 0) return;
    setIsDeleting(true);
    try {
      const ids = trashTargets.map((item) => item.id);
      await trashMediaAssetsAction(ids);
      await reload();
      if (detailAsset && ids.includes(detailAsset.id)) {
        setIsDetailOpen(false);
      }
      showToast(
        ids.length === 1
          ? 'Đã chuyển tệp Media vào Thùng rác.'
          : `Đã chuyển ${ids.length} tệp Media vào Thùng rác.`
      );
      setTrashTargets(null);
    } catch (error) {
      showToast(sanitizeCmsErrorMessage(error, 'Không thể chuyển tệp Media vào Thùng rác.'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmReplaceFile = (ast: MediaAsset, note: string, file: File) => {
    startTransition(async()=>{try{const form=new FormData();form.set('file',file);form.set('locale',workspaceLocale);form.set('note',note);await replaceMediaAssetAction(ast.id,form);await reload();showToast('Đã thay thế tệp và lưu phiên bản cũ.');}catch(error){showToast(sanitizeCmsErrorMessage(error, 'Không thể thay thế tệp.'));}});
  };

  const handleToggleSelectAll = (pageIds?: string[]) => {
    const targetIds = pageIds && pageIds.length > 0 ? pageIds : filteredAssets.map((a) => a.id);
    const allPageSelected = targetIds.length > 0 && targetIds.every((id) => selectedAssetIds.includes(id));
    if (allPageSelected) {
      setSelectedAssetIds((prev) => prev.filter((id) => !targetIds.includes(id)));
    } else {
      setSelectedAssetIds((prev) => Array.from(new Set([...prev, ...targetIds])));
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
    const targets = assets.filter((a) => selectedAssetIds.includes(a.id));
    if (targets.length > 0) {
      setTrashTargets(targets);
    }
  };
  const handleSubmitFolder=()=>{const name=folderName.trim();if(!name)return;const alias=name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');startTransition(async()=>{try{await createMediaFolderAction({workspace:workspaceLocale,name,alias});await reload();setFolderName('');setIsFolderModalOpen(false);showToast(`Đã tạo thư mục "${name}".`);}catch(error){showToast(sanitizeCmsErrorMessage(error, 'Không thể tạo thư mục.'));}});};

  return (
    <div className="space-y-6">
      <input ref={uploadInputRef} type="file" multiple className="sr-only" onChange={(event)=>void handleFiles(event.target.files)} accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml,video/mp4,video/webm,application/pdf,.doc,.docx,.xls,.xlsx" />
      {/* Toast Notification */}
      {toastMessage && (
        <div role="status" className="fixed inset-x-4 top-20 z-[100] bg-slate-900 text-white border border-slate-700 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200 sm:left-auto sm:right-6 sm:max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Module Header Bar */}
      <CmsPageHeader
        icon={<ImageIcon />}
        title="Thư viện tệp"
        description="Quản lý hình ảnh, video và tài liệu dùng chung trong toàn bộ CMS."
        meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{assets.filter((asset) => !asset.deleted_at).length} tệp</span>}
        actions={<>
          <CmsButton
            onClick={() => setActiveTab('albums')}
            variant="secondary"
            size="sm"
            leadingIcon={<FolderKanban />}
          >
            {albums.length} bộ sưu tập
          </CmsButton>

          <CmsButton
            onClick={handleOpenUpload}
            disabled={!capabilities.create}
            variant="primary"
            size="sm"
            leadingIcon={<UploadCloud />}
          >
            Tải tệp lên
          </CmsButton>
        </>}
      />

      <MediaNavigation
        activeTab={activeTab}
        viewMode={viewMode}
        assets={assets}
        albums={albums}
        issues={issues}
        onTabChange={setActiveTab}
        onViewModeChange={setViewMode}
      />

      {/* Main Content Area (Layout with Left Folder Sidebar & Asset View) */}
      {activeTab === 'albums' ? (
        <AlbumsView
          albums={albums}
          assets={assets}
          onUpdateAlbum={(updatedAlb) => {
            startTransition(async()=>{try{await saveMediaAlbumAction(updatedAlb.id,{workspace:workspaceLocale,title:updatedAlb.title,alias:updatedAlb.code_alias,description:updatedAlb.description||null,workflowStatus:updatedAlb.workflow_status,coverAssetId:updatedAlb.cover_asset_id||null,assetIds:updatedAlb.asset_ids});await reload();showToast(`Đã lưu Album "${updatedAlb.title}".`);}catch(error){showToast(error instanceof Error?error.message:'Không thể lưu Album.');}});
          }}
          onCreateAlbum={(album) => {
            startTransition(async()=>{try{await saveMediaAlbumAction(null,{workspace:workspaceLocale,title:album.title,alias:album.code_alias,description:album.description||null,workflowStatus:album.workflow_status,coverAssetId:album.cover_asset_id||null,assetIds:album.asset_ids});await reload();showToast(`Đã tạo Album "${album.title}".`);}catch(error){showToast(error instanceof Error?error.message:'Không thể tạo Album.');}});
          }}
          onDeleteAlbum={(id) => {
            startTransition(async()=>{try{await deleteMediaAlbumAction(id);await reload();showToast('Đã xóa Album.');}catch(error){showToast(error instanceof Error?error.message:'Không thể xóa Album.');}});
          }}
          onOpenPreviewAsset={(ast) => {
            setPreviewAsset(ast);
            setIsPreviewOpen(true);
          }}
          canCreate={capabilities.create}
          canEdit={capabilities.edit}
          canDelete={capabilities.delete}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <MediaFolderPanel
            folders={folders}
            assets={assets}
            selectedFolderId={selectedFolderId}
            canCreateFolder={capabilities.edit}
            onSelectFolder={setSelectedFolderId}
            onCreateFolder={() => setIsFolderModalOpen(true)}
          />

          {/* Right Main Assets Grid/List */}
          <div className="lg:col-span-9 space-y-4">
            <MediaFilterToolbar
              searchQuery={searchQuery}
              savedFilter={savedFilter}
              onSearchChange={setSearchQuery}
              onSavedFilterChange={setSavedFilter}
            />

            {/* Bulk Actions */}
            <CmsBulkActionBar selectedCount={capabilities.delete ? selectedAssetIds.length : 0} itemLabel="tệp media" onClear={() => setSelectedAssetIds([])} actions={[
              { label: 'Chuyển vào thùng rác', onClick: handleBulkDelete, icon: Trash2, variant: 'danger' },
            ]} />

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
                canEdit={capabilities.edit}
                canDelete={capabilities.delete}
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
                canEdit={capabilities.edit}
                canDelete={capabilities.delete}
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
        folders={folders}
        canEdit={capabilities.edit}
        canDelete={capabilities.delete}
        canReplace={capabilities.replace}
      />

      <UploadQueueDrawer
        isOpen={isUploadQueueOpen}
        onClose={() => setIsUploadQueueOpen(false)}
        queue={uploadQueue}
        onRemoveFromQueue={(id) => setUploadQueue(uploadQueue.filter((q) => q.id !== id))}
        onCompleteUpload={() => setIsUploadQueueOpen(false)}
      />

      <ReplaceArchiveModal
        isOpen={isReplaceModalOpen}
        onClose={() => setIsReplaceModalOpen(false)}
        asset={replaceAssetItem}
        onConfirmReplace={handleConfirmReplaceFile}
      />

      {isFolderModalOpen && (
        <MediaFolderDialog
          dialogRef={folderDialogRef}
          locale={workspaceLocale}
          folderName={folderName}
          onFolderNameChange={setFolderName}
          onClose={() => setIsFolderModalOpen(false)}
          onSubmit={handleSubmitFolder}
        />
      )}

      {/* Lightbox Quick Preview Modal */}
      {isPreviewOpen && previewAsset && (
        <MediaPreviewDialog
          dialogRef={previewDialogRef}
          asset={previewAsset}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}

      {/* Shared Trash Confirm Dialog */}
      <CmsTrashConfirmDialog
        open={Boolean(trashTargets && trashTargets.length > 0)}
        itemName={
          trashTargets && trashTargets.length > 1
            ? `${trashTargets.length} tệp Media đã chọn`
            : trashTargets?.[0]?.title || 'tệp Media'
        }
        busy={isDeleting}
        onClose={() => {
          if (!isDeleting) setTrashTargets(null);
        }}
        onConfirm={() => void handleConfirmTrash()}
      />
    </div>
  );
};
