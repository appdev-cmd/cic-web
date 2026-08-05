export type NavigationTargetType =
  | 'static_page'
  | 'product_catalog'
  | 'service_catalog'
  | 'news_category'
  | 'external_link'
  | 'section_header'
  | 'anchor';

export type EditorialStatus = 'draft' | 'pending' | 'approved' | 'published';
export type LinkHealthStatus = 'valid' | 'warning' | 'broken' | 'unchecked';
export interface MenuItem {
  id: string;
  group_id: string;
  parent_id: string | null;
  depth: number; // 0 (root level 1), 1 (level 2), 2 (level 3)
  display_order: number;
  label: string;
  target_type: NavigationTargetType;
  target_content_id?: string;
  target_content_name?: string;
  url: string;
  open_in_new_tab: boolean;
  icon_name?: string;
  css_class?: string;
  is_visible: boolean;
  visibility_rule?: 'all' | 'logged_in' | 'guests' | 'campaign_only';
  schedule_start?: string;
  schedule_end?: string;
  link_health: LinkHealthStatus;
  link_health_message?: string;
  draft_status: 'unchanged' | 'added' | 'modified' | 'moved' | 'deleted';
  is_deleted?: boolean;
  children?: MenuItem[];
}

export interface MenuGroup {
  id: string;
  code: string;
  name: string;
  site: string; // e.g. cic.com.vn
  locale: string; // e.g. vi
  position_code: 'main_header' | 'footer_links' | 'mobile_drawer' | 'campaign_banner';
  max_depth: number; // e.g. 3 levels
  live_version: string;
  draft_version: string;
  editorial_status: EditorialStatus;
  has_draft_changes: boolean;
  item_count: number;
  issue_count: number;
  updated_at: string;
  updated_by: string;
}

export interface ValidationIssue {
  id: string;
  item_id: string;
  item_label: string;
  severity: 'critical' | 'warning' | 'info';
  code: 'loop' | 'orphan' | 'depth_exceeded' | 'broken_link' | 'label_too_long';
  message: string;
  suggested_action: string;
}

export interface MenuVersion {
  version_id: string;
  version_number: number;
  group_id: string;
  published_at: string;
  published_by: string;
  change_summary: string;
  item_count: number;
  is_current_live: boolean;
}

export interface DiffChange {
  id: string;
  item_id: string;
  label: string;
  change_type: 'added' | 'changed' | 'moved' | 'removed';
  old_path?: string;
  new_path?: string;
  details: string;
}

export interface MenuActivityLog {
  id: string;
  timestamp: string;
  user_name: string;
  user_avatar: string;
  action_type: 'save_draft' | 'move_item' | 'add_item' | 'delete_item' | 'validate' | 'publish' | 'restore';
  description: string;
}
