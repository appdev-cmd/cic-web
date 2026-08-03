export interface BannerItem {
  id: string;
  name: string;
  alias: string;
  description: string;
  image: string;
  width: number;
  height: number;
  link: string;
  category_id: string;
  category_name?: string;
  date_start: string; // YYYY-MM-DD
  date_end: string;   // YYYY-MM-DD
  is_use: boolean;
  status: 'running' | 'expired' | 'pending';
  link_video?: string;
  icon?: string;
  
  // Thông tin người đăng (Advertiser details)
  el_user_name?: string;
  el_info?: string;
  el_address?: string;
  el_mobilephone?: string;
  el_link_website?: string;
  el_link_facebook?: string;

  published: boolean;
  ordering: number;
  created_time?: string;
  updated_time?: string;
}

export type Banner = BannerItem;

export interface BannerCategoryOption {
  id: string;
  name: string;
  width: number;
  height: number;
}

export const BANNER_CATEGORIES: BannerCategoryOption[] = [
  { id: 'bcat_001', name: 'Banner Header Trang chủ (Super Top)', width: 1200, height: 300 },
  { id: 'bcat_002', name: 'Banner Sidebar Cột bên phải', width: 300, height: 250 },
  { id: 'bcat_003', name: 'Banner Xén giữa bài viết Tin tức', width: 728, height: 90 },
];

export interface BannerStatusOption {
  value: 'running' | 'expired' | 'pending';
  label: string;
  badgeClass: string;
  badgeDarkClass: string;
}

export const BANNER_STATUS_OPTIONS: BannerStatusOption[] = [
  {
    value: 'running',
    label: 'Đang chạy',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeDarkClass: 'dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  },
  {
    value: 'expired',
    label: 'Hết hạn',
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
    badgeDarkClass: 'dark:bg-red-950/40 dark:text-red-300 dark:border-red-800',
  },
  {
    value: 'pending',
    label: 'Chờ duyệt',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeDarkClass: 'dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  },
];
