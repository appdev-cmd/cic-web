import { Grid, List } from 'lucide-react';

import { CmsTabs } from '../../components/ui/CmsTabs';
import type { MainTabType, MediaAlbum, MediaAsset, MediaIssue, ViewMode } from './types';

type MediaNavigationProps = {
  activeTab: MainTabType;
  viewMode: ViewMode;
  assets: readonly MediaAsset[];
  albums: readonly MediaAlbum[];
  issues: readonly MediaIssue[];
  onTabChange: (tab: MainTabType) => void;
  onViewModeChange: (mode: ViewMode) => void;
};

export function MediaNavigation({ activeTab, viewMode, assets, albums, issues, onTabChange, onViewModeChange }: MediaNavigationProps) {
  const activeAssets = assets.filter((asset) => !asset.deleted_at);
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <CmsTabs
        ariaLabel="Phân loại tệp media"
        value={activeTab}
        onChange={(tab) => onTabChange(tab as MainTabType)}
        items={[
          { id: 'all', label: 'Tất cả media', count: activeAssets.length },
          { id: 'images', label: 'Ảnh', count: activeAssets.filter((asset) => asset.type === 'image').length },
          { id: 'videos', label: 'Video', count: activeAssets.filter((asset) => asset.type === 'video').length },
          { id: 'documents', label: 'Tài liệu PDF', count: activeAssets.filter((asset) => asset.type === 'document').length },
          { id: 'albums', label: 'Albums & Bộ sưu tập', count: albums.length },
          { id: 'incomplete_metadata', label: 'Cần bổ sung Meta', count: activeAssets.filter((asset) => asset.metadata_status === 'incomplete').length },
          { id: 'issues', label: 'Trùng / Vấn đề', count: issues.length },
        ]}
      />
      {activeTab !== 'albums' && (
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
          <button onClick={() => onViewModeChange('grid')} className={`flex min-h-11 min-w-11 items-center justify-center rounded-lg text-xs font-medium transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-400'}`} title="Dạng lưới ảnh (Grid View)"><Grid className="w-4 h-4" /></button>
          <button onClick={() => onViewModeChange('list')} className={`flex min-h-11 min-w-11 items-center justify-center rounded-lg text-xs font-medium transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-400'}`} title="Dạng danh sách bảng (List View)"><List className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  );
}
