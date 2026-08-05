export type BannerItemType = 'banner' | 'slideshow';

export type SlideshowPurpose =
  | 'hero'
  | 'homepage'
  | 'landing_page'
  | 'advertising'
  | 'partners'
  | 'customers'
  | 'awards'
  | 'certificates'
  | 'projects'
  | 'testimonials'
  | 'logo_carousel'
  | 'timeline'
  | 'promotion'
  | 'featured_news'
  | 'custom';

export type SlideshowTemplate = 'visual' | 'editorial' | 'logo_wall' | 'testimonial' | 'timeline' | 'cards';

export type SlideshowLayout = 'full_width' | 'contained' | 'split' | 'carousel' | 'multi_item';

export const slideshowPurposeOptions: Array<{ value: SlideshowPurpose; label: string }> = [
  { value: 'hero', label: 'Hero banner' },
  { value: 'homepage', label: 'Slider trang chủ' },
  { value: 'landing_page', label: 'Banner landing page' },
  { value: 'advertising', label: 'Quảng cáo' },
  { value: 'partners', label: 'Đối tác' },
  { value: 'customers', label: 'Khách hàng' },
  { value: 'projects', label: 'Dự án' },
  { value: 'awards', label: 'Giải thưởng' },
  { value: 'certificates', label: 'Chứng nhận' },
  { value: 'logo_carousel', label: 'Băng chuyền logo' },
  { value: 'testimonials', label: 'Ý kiến khách hàng' },
  { value: 'promotion', label: 'Khuyến mại' },
  { value: 'featured_news', label: 'Tin nổi bật' },
  { value: 'timeline', label: 'Dòng thời gian' },
  { value: 'custom', label: 'Mục đích khác' },
];

export const slideshowTemplateOptions: Array<{ value: SlideshowTemplate; label: string }> = [
  { value: 'visual', label: 'Hình ảnh nổi bật' },
  { value: 'editorial', label: 'Nội dung biên tập' },
  { value: 'logo_wall', label: 'Logo và thương hiệu' },
  { value: 'testimonial', label: 'Ý kiến khách hàng' },
  { value: 'timeline', label: 'Dòng thời gian' },
  { value: 'cards', label: 'Thẻ nội dung' },
];

export const slideshowLayoutOptions: Array<{ value: SlideshowLayout; label: string }> = [
  { value: 'full_width', label: 'Toàn chiều rộng' },
  { value: 'contained', label: 'Trong khung nội dung' },
  { value: 'split', label: 'Chia đôi nội dung và hình ảnh' },
  { value: 'carousel', label: 'Băng chuyền ngang' },
  { value: 'multi_item', label: 'Nhiều mục cùng lúc' },
];

export type WorkflowStatus = 'draft' | 'pending_review' | 'approved' | 'published' | 'archived';

export type EffectiveStatus = 'upcoming' | 'running' | 'ended' | 'conflict';

export type AspectRatio = '21:9' | '16:9' | '4:3' | '1:1' | '3:4' | 'custom';

export interface BreakpointVariant {
  desktop_url: string;
  laptop_url: string;
  tablet_url: string;
  mobile_url: string;
  aspect_ratio: AspectRatio;
  recommended_dimensions: string;
}

export interface SlideItem {
  id: string;
  title: string;
  subtitle?: string;
  media_url: string;
  media_type: 'image' | 'video';
  link_url: string;
  link_target: '_self' | '_blank';
  duration_sec: number;
  transition_effect: 'fade' | 'slide' | 'zoom';
  display_order: number;
  caption?: string;
  focal_point: 'center' | 'top' | 'bottom' | 'custom';
}

export interface SlideshowConfig {
  auto_play: boolean;
  loop?: boolean;
  interval_ms: number;
  effect: 'fade' | 'slide' | 'zoom';
  pause_on_hover: boolean;
  show_dots: boolean;
  show_arrows: boolean;
  navigation?: 'arrows' | 'thumbnails' | 'none';
  pagination?: 'dots' | 'fraction' | 'progress' | 'none';
  slides_per_view?: number;
}

export interface BannerContent {
  id: string;
  type: BannerItemType;
  purpose?: SlideshowPurpose;
  template?: SlideshowTemplate;
  layout?: SlideshowLayout;
  title: string;
  alias: string;
  site_id: 'main_site' | 'en_site' | 'jp_site';
  placement_id: string;
  placement_name: string;
  media_url: string;
  media_type: 'image' | 'video';
  crop_focal_point: string;
  alt_text: string;
  caption: string;
  copy_text: string;
  cta_text: string;
  link_url: string;
  link_target: '_self' | '_blank' | '_modal';
  slides: SlideItem[];
  slideshow_config: SlideshowConfig;
  start_time: string; // ISO string or format 'YYYY-MM-DD HH:mm'
  end_time: string;   // ISO string or format 'YYYY-MM-DD HH:mm'
  timezone: string;   // e.g. 'Asia/Ho_Chi_Minh'
  display_order: number;
  priority_weight: number; // 1 to 10
  workflow_status: WorkflowStatus;
  effective_status: EffectiveStatus;
  live_version: string;
  draft_version: string;
  has_draft_changes: boolean;
  owner_name: string;
  owner_avatar: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface ScheduleConflict {
  id: string;
  placement_id: string;
  placement_name: string;
  conflicting_item_ids: string[];
  conflicting_item_titles: string[];
  severity: 'critical' | 'warning';
  description: string;
}

export interface BannerPlacementConfig {
  id: string;
  name: string;
  code: string;
  site_id: string;
  max_capacity: number;
  recommended_ratio: AspectRatio;
  recommended_resolution: string;
  description: string;
  active_count: number;
}

export interface BannerVersion {
  version_id: string;
  version_number: number;
  banner_id: string;
  published_at: string;
  published_by: string;
  change_summary: string;
  is_current_live: boolean;
}

export interface BannerActivityLog {
  id: string;
  timestamp: string;
  user_name: string;
  user_avatar: string;
  action_type: 'create' | 'update' | 'move_slide' | 'publish' | 'schedule_change' | 'duplicate' | 'archive';
  description: string;
}

export type MainTabType = 'all' | 'schedule' | 'placements' | 'my_tasks' | 'pending_queue' | 'trash';

export type SavedFilterView = 'all' | 'running' | 'upcoming' | 'pending' | 'conflicts' | 'ended';
