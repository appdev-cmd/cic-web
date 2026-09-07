import { Folder, FolderPlus } from 'lucide-react';

import type { MediaAsset, MediaFolder } from './types';

type MediaFolderPanelProps = {
  folders: readonly MediaFolder[];
  assets: readonly MediaAsset[];
  selectedFolderId: string;
  canCreateFolder: boolean;
  onSelectFolder: (folderId: string) => void;
  onCreateFolder: () => void;
};

export function MediaFolderPanel({ folders, assets, selectedFolderId, canCreateFolder, onSelectFolder, onCreateFolder }: MediaFolderPanelProps) {
  return (
    <div className="lg:col-span-3 space-y-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Thư mục & Phân loại</span>
          <button type="button" onClick={onCreateFolder} disabled={!canCreateFolder} className="flex min-h-11 min-w-11 items-center justify-center text-slate-400 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50" title="Thêm thư mục mới">
            <FolderPlus className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-1">
          {folders.map((folder) => (
            <button key={folder.id} onClick={() => onSelectFolder(folder.id)} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${selectedFolderId === folder.id ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 font-bold border border-orange-200 dark:border-orange-900' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              <div className="flex items-center gap-2 truncate"><Folder className="w-4 h-4 text-amber-500 shrink-0" /><span className="truncate">{folder.name}</span></div>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-mono">
                {folder.id === 'f_all' ? assets.filter((asset) => !asset.deleted_at).length : assets.filter((asset) => !asset.deleted_at && asset.folder_id === folder.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
