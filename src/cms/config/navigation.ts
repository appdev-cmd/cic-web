import type { CmsMenuGroup } from '../types';
import { getCanonicalCmsPath, getCmsPermissionModuleKeys, resolveCmsModule } from '../routing';

const path = getCanonicalCmsPath;

export const cmsMenuGroups: CmsMenuGroup[] = [
  { id: 'grp_tong_quan', groupTitle: 'TỔNG QUAN', items: [
    { id: 'menu_dashboard', title: 'Tổng quan', iconName: 'LayoutDashboard', path: path('dashboard') },
  ] },
  { id: 'grp_noi_dung', groupTitle: 'NỘI DUNG', items: [
    { id: 'menu_news', title: 'Tin tức', iconName: 'Newspaper', path: path('news') },
    { id: 'menu_news_categories', title: 'Danh mục tin tức', iconName: 'FolderTree', path: `${path('news')}/categories` },
    { id: 'menu_static_pages', title: 'Trang nội dung', iconName: 'FileText', path: path('static_pages') },
    { id: 'menu_events', title: 'Sự kiện', iconName: 'CalendarEvent', path: path('events') },
    { id: 'menu_projects', title: 'Dự án', iconName: 'Building2', path: path('projects') },
    { id: 'menu_services', title: 'Dịch vụ', iconName: 'Layers', path: path('services') },
  ] },
  { id: 'grp_san_pham', groupTitle: 'SẢN PHẨM', items: [
    { id: 'menu_products_group', title: 'Sản phẩm', iconName: 'Package', path: path('products') },
    { id: 'menu_product_categories', title: 'Danh mục sản phẩm', iconName: 'FolderTree', path: `${path('product_settings')}/categories` },
    { id: 'menu_product_brands', title: 'Hãng sản xuất', iconName: 'Building2', path: `${path('product_settings')}/brands` },
    { id: 'menu_product_applications', title: 'Lĩnh vực ứng dụng', iconName: 'Cpu', path: `${path('product_settings')}/applications` },
    { id: 'menu_product_types', title: 'Loại sản phẩm', iconName: 'Layers', path: `${path('product_settings')}/product-types` },
    { id: 'menu_product_sales_staff', title: 'Người phụ trách kinh doanh', iconName: 'UserCheck', path: `${path('product_settings')}/sales-staff` },
  ] },
  { id: 'grp_website', groupTitle: 'WEBSITE', items: [
    { id: 'menu_navigation', title: 'Menu', iconName: 'Menu', path: path('menu') },
    { id: 'menu_media_library', title: 'Thư viện media', iconName: 'FolderImage', path: path('media') },
  ] },
  { id: 'grp_tuong_tac_khach_hang', groupTitle: 'TƯƠNG TÁC KHÁCH HÀNG', items: [
    { id: 'menu_cta', title: 'CTA', iconName: 'MousePointer2', path: path('cta') },
    { id: 'menu_forms', title: 'Biểu mẫu', iconName: 'FileCheck2', path: path('forms') },
    { id: 'menu_customer_requests', title: 'Yêu cầu khách hàng', iconName: 'MessageSquareText', path: path('customer_requests') },
    { id: 'menu_email_templates', title: 'Mẫu email', iconName: 'MailCheck', path: path('email_templates') },
  ] },
  { id: 'grp_quan_tri_he_thong', groupTitle: 'QUẢN TRỊ HỆ THỐNG', items: [
    { id: 'menu_users', title: 'Người dùng', iconName: 'UserCheck', path: path('users') },
    { id: 'menu_permissions', title: 'Vai trò & quyền', iconName: 'ShieldAlert', path: path('permissions') },
    { id: 'menu_system_settings', title: 'Cấu hình hệ thống', iconName: 'Settings', path: path('settings') },
    { id: 'menu_function_seo', title: 'SEO & URL', iconName: 'Search', path: path('function_seo') },
    { id: 'menu_translation_strings', title: 'Ngôn ngữ giao diện', iconName: 'Sparkles', path: path('localization') },
    { id: 'menu_activity_logs', title: 'Nhật ký hoạt động', iconName: 'History', path: path('activity_logs') },
    { id: 'menu_trash', title: 'Thùng rác', iconName: 'RotateCcw', path: path('trash') },
  ] },
];

export function getPermittedCmsMenuGroups(allowedModules: readonly string[] | null): CmsMenuGroup[] {
  if (allowedModules === null) return cmsMenuGroups;
  const allowed = new Set(allowedModules);
  return cmsMenuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const resolvedModule = resolveCmsModule(item.path ?? '');
        const permissionModules = getCmsPermissionModuleKeys(resolvedModule);
        return permissionModules.length === 0 || permissionModules.some((candidate) => allowed.has(candidate));
      }),
    }))
    .filter((group) => group.items.length > 0);
}
