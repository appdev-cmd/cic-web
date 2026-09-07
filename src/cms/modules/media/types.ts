export type {
  AssetVariant,
  AssetVersion,
  MediaAlbum,
  MediaAsset,
  MediaFolder,
  MediaIssue,
  MediaType,
  MetadataStatus,
  ScopeUsageRef,
  WorkflowStatus,
} from '@/features/media/types';

// These types describe transient CMS presentation state, not Media domain data.
export type MainTabType =
  | 'all'
  | 'images'
  | 'videos'
  | 'documents'
  | 'albums'
  | 'incomplete_metadata'
  | 'issues';

export type ViewMode = 'grid' | 'list';

export type SavedFilterView =
  | 'all'
  | 'missing_alt'
  | 'unused'
  | 'processing'
  | 'issues';

export interface UploadFileItem {
  id: string;
  file_name: string;
  file_size_kb: number;
  mime_type: string;
  progress: number;
  status: 'queued' | 'preflight' | 'uploading' | 'processing' | 'completed' | 'error';
  error_message?: string;
  preview_url?: string;
  title?: string;
  alt_vi?: string;
  tags?: string[];
  folder_id?: string;
}
