import type { MediaType } from './constants';

export type { MediaType } from './constants';
export type WorkflowStatus = 'processing' | 'ready' | 'restricted' | 'archived';
export type MetadataStatus = 'complete' | 'incomplete' | 'has_issues';

export interface ScopeUsageRef {
  id: string;
  entity_type: 'product' | 'static_page' | 'news' | 'banner' | 'content_block' | 'service' | 'cta' | 'form_submission';
  entity_title: string;
  path: string;
  updated_at: string;
}

export interface AssetVariant {
  id: string;
  preset_name: 'original' | '16:9' | '4:3' | '1:1' | '2:1' | 'mobile_header';
  width: number;
  height: number;
  format: 'webp' | 'avif' | 'jpeg' | 'png';
  file_size_kb: number;
  url: string;
  focal_point?: { x: number; y: number };
  status: 'ready' | 'processing' | 'failed';
}

export interface AssetVersion {
  version_number: number;
  filename: string;
  file_size_kb: number;
  replaced_by: string;
  replaced_at: string;
  note: string;
  url: string;
}

export interface MediaIssue {
  id: string;
  asset_id: string;
  asset_name: string;
  type: 'duplicate' | 'low_resolution' | 'missing_alt' | 'license_expired' | 'large_filesize';
  severity: 'high' | 'medium' | 'low';
  message: string;
  created_at: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  title: string;
  description?: string;
  type: MediaType;
  mime_type: string;
  url: string;
  thumbnail_url?: string;
  file_size_kb: number;
  width?: number;
  height?: number;
  duration_sec?: number;
  alt_text: string;
  caption?: string;
  credit_author?: string;
  license_type?: 'internal' | 'purchased' | 'cc_by' | 'editorial';
  license_expiry?: string;
  folder_id: string;
  folder_name: string;
  album_ids: string[];
  tags: string[];
  used_by_count: number;
  used_by_refs: ScopeUsageRef[];
  workflow_status: WorkflowStatus;
  metadata_status: MetadataStatus;
  variants: AssetVariant[];
  versions: AssetVersion[];
  owner_name: string;
  owner_avatar: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface MediaAlbum {
  id: string;
  title: string;
  code_alias: string;
  description: string;
  cover_asset_id?: string;
  cover_asset_url?: string;
  asset_ids: string[];
  item_count: number;
  display_order: number;
  workflow_status: 'draft' | 'published' | 'archived';
  owner_name: string;
  created_at: string;
  updated_at: string;
}

export interface MediaFolder { id: string; name: string; code_alias: string; icon: string; count: number }

export interface MediaModuleData {
  assets: MediaAsset[];
  albums: MediaAlbum[];
  folders: MediaFolder[];
  issues: MediaIssue[];
  currentUserName?: string;
}

export interface CmsMediaPickerItem {
  id: string;
  filename: string;
  title: string;
  url: string;
  thumbnail_url?: string;
}
