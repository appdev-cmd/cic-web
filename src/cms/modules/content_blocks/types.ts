export type BlockType =
  | 'hero_cta'
  | 'feature_grid'
  | 'highlight_banner'
  | 'testimonial_slider'
  | 'announcement_bar'
  | 'rich_text'
  | 'faq_accordion'
  | 'module_embed';

export type WorkflowStatus = 'draft' | 'pending_review' | 'approved' | 'published' | 'archived';
export type EffectiveStatus = 'running' | 'upcoming' | 'ended' | 'conflict' | 'inactive';
export type MainTabType = 'all' | 'placement_view' | 'my_tasks' | 'pending_queue' | 'issues' | 'trash';
export type SavedFilterView = 'all' | 'high_usage' | 'pending' | 'unused' | 'conflicts';

export interface ScopeRule {
  site_id: string;
  apply_all_pages: boolean;
  included_pages: string[]; // Page paths or IDs e.g. ['/', '/products', '/services']
  excluded_pages: string[]; // Excluded page paths e.g. ['/checkout']
}

export interface PlacementZone {
  id: string;
  code: string;
  name: string;
  site_id: string;
  description: string;
  max_capacity: number;
  active_count: number;
  recommended_aspect_ratio: string;
}

export interface BlockContentData {
  headline?: string;
  subtitle?: string;
  body_html?: string;
  cta_text?: string;
  cta_url?: string;
  secondary_cta_text?: string;
  secondary_cta_url?: string;
  media_url?: string;
  media_type?: 'image' | 'video' | 'icon';
  icon_name?: string;
  embed_code?: string;
  items_list?: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
    media_url?: string;
    url?: string;
  }>;
}

export interface BlockItem {
  id: string;
  title: string; // Tên nhận diện khối
  code_alias: string; // Mã alias e.g. 'home-hero-cta-2026'
  type: BlockType;
  description?: string;
  tags?: string[];
  owner_name: string;
  owner_avatar: string;

  // Presentation & Styling
  show_title: boolean;
  layout_variant: 'standard' | 'centered' | 'grid_2col' | 'grid_3col' | 'compact_card' | 'fullwidth_dark' | 'light_neutral';
  custom_css_class?: string;

  // Placement & Scope
  site_id: 'main_site' | 'en_site' | 'jp_site';
  placement_id: string;
  placement_name: string;
  scope: ScopeRule;
  used_by_count: number;
  used_by_pages: Array<{ page_id: string; page_title: string; page_path: string }>;

  // Content Payload
  content: BlockContentData;

  // Order & Schedule
  display_order: number;
  priority_weight: number;
  start_time: string;
  end_time: string;
  auto_deactivate: boolean;

  // Workflow & Versioning
  workflow_status: WorkflowStatus;
  effective_status: EffectiveStatus;
  live_version: string;
  draft_version: string;
  has_draft_changes: boolean;

  // Meta
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface BlockVersion {
  version_id: string;
  block_id: string;
  version_number: number;
  published_at: string;
  published_by: string;
  change_summary: string;
  is_current_live: boolean;
  snapshot_data: Partial<BlockItem>;
}

export interface ConflictIssue {
  id: string;
  block_id: string;
  block_title: string;
  placement_id: string;
  placement_name: string;
  severity: 'high' | 'medium' | 'low';
  issue_type: 'capacity_exceeded' | 'schedule_overlap' | 'orphan_unused';
  description: string;
  affected_pages: string[];
}

export interface PageTreeNode {
  id: string;
  path: string;
  title: string;
  type: 'page' | 'category' | 'module';
  children?: PageTreeNode[];
}
