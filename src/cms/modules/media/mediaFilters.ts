import type { MediaAsset, MediaIssue, MainTabType, SavedFilterView } from './types';

export type MediaFilterCriteria = {
  activeTab: MainTabType;
  savedFilter: SavedFilterView;
  selectedFolderId: string;
  searchQuery: string;
};

export function filterMediaAssets(
  assets: readonly MediaAsset[],
  issues: readonly MediaIssue[],
  criteria: MediaFilterCriteria,
): MediaAsset[] {
  const normalizedQuery = criteria.searchQuery.trim().toLowerCase();
  const issueAssetIds = new Set(issues.map((issue) => issue.asset_id));

  return assets.filter((asset) => {
    if (asset.deleted_at) return false;
    if (criteria.activeTab === 'images' && asset.type !== 'image') return false;
    if (criteria.activeTab === 'videos' && asset.type !== 'video') return false;
    if (criteria.activeTab === 'documents' && asset.type !== 'document') return false;
    if (criteria.activeTab === 'incomplete_metadata' && asset.metadata_status !== 'incomplete') return false;
    if (criteria.activeTab === 'issues' && !issueAssetIds.has(asset.id)) return false;
    if (criteria.savedFilter === 'missing_alt' && asset.alt_text.trim()) return false;
    if (criteria.savedFilter === 'unused' && asset.used_by_count > 0) return false;
    if (criteria.savedFilter === 'issues' && !issueAssetIds.has(asset.id)) return false;
    if (criteria.selectedFolderId !== 'f_all' && asset.folder_id !== criteria.selectedFolderId) return false;
    if (!normalizedQuery) return true;

    return asset.title.toLowerCase().includes(normalizedQuery) ||
      asset.filename.toLowerCase().includes(normalizedQuery) ||
      asset.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)) ||
      asset.owner_name.toLowerCase().includes(normalizedQuery);
  });
}
