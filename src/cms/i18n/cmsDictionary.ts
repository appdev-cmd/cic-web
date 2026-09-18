import type { CmsLocale } from '../data/CmsDataSource';

export interface CmsDictionary {
  dashboard: {
    pageTitle: string;
    pageDescription: string;
    customizeLayout: string;
    currentWork: string;
    currentWorkSubtitle: string;
    recentItems: string;
    noCurrentWork: string;
    draft: string;
    unread: string;
    processing: string;
    kpiProducts: string;
    kpiNews: string;
    kpiStaticPages: string;
    kpiEvents: string;
    kpiCustomerRequests: string;
    kpiActive: string;
    kpiPublished: string;
    kpiUpcoming: string;
    kpiActionRequired: string;
    kpiRequestsPending: string;
    customerRequests: string;
    customerRequestsSubtitle: string;
    pendingContent: string;
    pendingContentSubtitle: string;
    viewAll: string;
    activityCharts: string;
    activityChartsSubtitle: string;
    range7Days: string;
    range30Days: string;
    rangeThisMonth: string;
    rangeThisYear: string;
    systemPulse: string;
    systemPulseSubtitle: string;
    viewFullAudit: string;
    noDataEn: string;
    noDataEnDesc: string;
    customizerTitle: string;
    customizerSubtitle: string;
    customizerSave: string;
    customizerReset: string;
    densityComfortable: string;
    densityCompact: string;
  };
  header: {
    cmsSubtitle: string;
    searchPlaceholder: string;
    quickSearchShort: string;
    quickAction: string;
    newProduct: string;
    newNews: string;
    newService: string;
    newEvent: string;
    notifications: string;
    markAllRead: string;
    noNotifications: string;
    viewWebsite: string;
    myAccount: string;
    changePassword: string;
    logout: string;
    roleSuperAdmin: string;
    roleAdmin: string;
    roleEditor: string;
    roleViewer: string;
  };
  menu: {
    groups: Record<string, string>;
    items: Record<string, string>;
  };
}

export const viCmsDictionary: CmsDictionary = {
  dashboard: {
    pageTitle: 'Tổng quan vận hành',
    pageDescription: 'Trung tâm giám sát thông số thời gian thực, tiếp nhận yêu cầu tư vấn và theo dõi nhật ký hoạt động CIC Technology',
    customizeLayout: 'Tùy chỉnh giao diện',
    currentWork: 'Công việc hiện tại',
    currentWorkSubtitle: 'Bản nháp và yêu cầu khách hàng cần tiếp tục xử lý',
    recentItems: 'việc gần nhất',
    noCurrentWork: 'Hiện không có công việc nào cần tiếp tục xử lý.',
    draft: 'Bản nháp',
    unread: 'Chưa đọc',
    processing: 'Đang xử lý',
    kpiProducts: 'Sản phẩm',
    kpiNews: 'Tin tức',
    kpiStaticPages: 'Trang nội dung',
    kpiEvents: 'Sự kiện',
    kpiCustomerRequests: 'Yêu cầu khách hàng',
    kpiActive: 'Đang hoạt động',
    kpiPublished: 'Đã xuất bản',
    kpiUpcoming: 'Sắp diễn ra',
    kpiActionRequired: 'Chưa xử lý!',
    kpiRequestsPending: 'Yêu cầu đang chờ xử lý',
    customerRequests: 'Yêu cầu khách hàng',
    customerRequestsSubtitle: 'Các yêu cầu mới nhất cần tiếp nhận và xử lý',
    pendingContent: 'Nội dung chờ duyệt',
    pendingContentSubtitle: 'Các bản ghi ở trạng thái nháp cần xuất bản',
    viewAll: 'Xem tất cả',
    activityCharts: 'Biểu đồ hoạt động và tiếp nhận yêu cầu',
    activityChartsSubtitle: 'Theo dõi xu hướng tương tác và xuất bản nội dung',
    range7Days: '7 ngày',
    range30Days: '30 ngày',
    rangeThisMonth: 'Tháng này',
    rangeThisYear: 'Năm nay',
    systemPulse: 'Nhật ký hệ thống gần đây',
    systemPulseSubtitle: 'Lịch sử thao tác của quản trị viên',
    viewFullAudit: 'Xem đầy đủ nhật ký',
    noDataEn: 'Chưa có dữ liệu Dashboard cho English',
    noDataEnDesc: 'Workspace EN là dataset độc lập và không sử dụng dữ liệu VI để thay thế.',
    customizerTitle: 'Tùy chỉnh Bảng điều khiển',
    customizerSubtitle: 'Cá nhân hóa Widget, mật độ hiển thị & phạm vi',
    customizerSave: 'Lưu thay đổi',
    customizerReset: 'Khôi phục mặc định',
    densityComfortable: 'Thoải mái',
    densityCompact: 'Thu gọn',
  },
  header: {
    cmsSubtitle: 'Hệ thống Quản trị Nội dung',
    searchPlaceholder: 'Tìm kiếm toàn bộ CMS (sản phẩm, tin tức, leads...)',
    quickSearchShort: 'Tìm kiếm CMS...',
    quickAction: 'Tạo mới',
    newProduct: 'Sản phẩm mới',
    newNews: 'Tin tức mới',
    newService: 'Dịch vụ mới',
    newEvent: 'Sự kiện mới',
    notifications: 'Thông báo hệ thống',
    markAllRead: 'Đánh dấu đã đọc',
    noNotifications: 'Chưa có thông báo.',
    viewWebsite: 'Xem trang web',
    myAccount: 'Tài khoản của tôi',
    changePassword: 'Đổi mật khẩu',
    logout: 'Đăng xuất',
    roleSuperAdmin: 'Quản trị viên cấp cao',
    roleAdmin: 'Quản trị viên',
    roleEditor: 'Biên tập viên',
    roleViewer: 'Người xem',
  },
  menu: {
    groups: {
      grp_tong_quan: 'TỔNG QUAN',
      grp_noi_dung: 'NỘI DUNG',
      grp_san_pham: 'SẢN PHẨM',
      grp_website: 'WEBSITE',
      grp_khach_hang: 'TƯƠNG TÁC KHÁCH HÀNG',
      grp_he_thong: 'HỆ THỐNG',
    },
    items: {
      menu_dashboard: 'Tổng quan',
      menu_news: 'Tin tức',
      menu_news_categories: 'Danh mục tin tức',
      menu_static_pages: 'Trang nội dung',
      menu_events: 'Sự kiện',
      menu_projects: 'Dự án',
      menu_services: 'Dịch vụ',
      menu_products_group: 'Sản phẩm',
      menu_product_categories: 'Danh mục sản phẩm',
      menu_product_brands: 'Hãng sản xuất',
      menu_product_applications: 'Lĩnh vực ứng dụng',
      menu_product_types: 'Loại sản phẩm',
      menu_product_sales_staff: 'Người phụ trách kinh doanh',
      menu_navigation: 'Menu điều hướng',
      menu_media: 'Thư viện Media',
      menu_system_config: 'Cấu hình hệ thống',
      menu_function_seo: 'Cấu hình SEO & URL',
      menu_customer_requests: 'Yêu cầu khách hàng',
      menu_email_templates: 'Mẫu email thông báo',
      menu_cic_users: 'Quản lý người dùng',
      menu_permission_management: 'Phân quyền & Vai trò',
      menu_activity_logs: 'Nhật ký hoạt động',
      menu_trash: 'Thùng rác hệ thống',
    },
  },
};

export const enCmsDictionary: CmsDictionary = {
  dashboard: {
    pageTitle: 'Operations Overview',
    pageDescription: 'Real-time monitoring hub, customer request processing, and operational activity audit for CIC Technology',
    customizeLayout: 'Customize Layout',
    currentWork: 'Current Tasks',
    currentWorkSubtitle: 'Drafts and customer inquiries requiring immediate attention',
    recentItems: 'recent items',
    noCurrentWork: 'No pending tasks at this moment.',
    draft: 'Draft',
    unread: 'Unread',
    processing: 'Processing',
    kpiProducts: 'Products',
    kpiNews: 'News',
    kpiStaticPages: 'Static Pages',
    kpiEvents: 'Events',
    kpiCustomerRequests: 'Customer Requests',
    kpiActive: 'Active',
    kpiPublished: 'Published',
    kpiUpcoming: 'Upcoming',
    kpiActionRequired: 'Pending!',
    kpiRequestsPending: 'Inquiries awaiting processing',
    customerRequests: 'Customer Inquiries',
    customerRequestsSubtitle: 'Latest incoming inquiries requiring processing',
    pendingContent: 'Pending Content',
    pendingContentSubtitle: 'Draft records awaiting publication',
    viewAll: 'View All',
    activityCharts: 'Activity & Inquiries Analytics',
    activityChartsSubtitle: 'Track interaction trends and content publication rate',
    range7Days: '7 Days',
    range30Days: '30 Days',
    rangeThisMonth: 'This Month',
    rangeThisYear: 'This Year',
    systemPulse: 'Recent System Audit',
    systemPulseSubtitle: 'Administrative action history and audit log',
    viewFullAudit: 'View Full Audit Log',
    noDataEn: 'No Dashboard Data for English',
    noDataEnDesc: 'The English workspace is an independent dataset and does not fall back to Vietnamese data.',
    customizerTitle: 'Customize Dashboard Layout',
    customizerSubtitle: 'Personalize widgets, density & display range',
    customizerSave: 'Save Changes',
    customizerReset: 'Reset to Default',
    densityComfortable: 'Comfortable',
    densityCompact: 'Compact',
  },
  header: {
    cmsSubtitle: 'Content Management System',
    searchPlaceholder: 'Search entire CMS (products, news, leads...)',
    quickSearchShort: 'Search CMS...',
    quickAction: 'New',
    newProduct: 'New Product',
    newNews: 'New Article',
    newService: 'New Service',
    newEvent: 'New Event',
    notifications: 'System Notifications',
    markAllRead: 'Mark all as read',
    noNotifications: 'No notifications.',
    viewWebsite: 'View Website',
    myAccount: 'My Account',
    changePassword: 'Change Password',
    logout: 'Sign Out',
    roleSuperAdmin: 'Super Administrator',
    roleAdmin: 'Administrator',
    roleEditor: 'Editor',
    roleViewer: 'Viewer',
  },
  menu: {
    groups: {
      grp_tong_quan: 'OVERVIEW',
      grp_noi_dung: 'CONTENT',
      grp_san_pham: 'PRODUCTS',
      grp_website: 'WEBSITE',
      grp_khach_hang: 'CUSTOMER ENGAGEMENT',
      grp_he_thong: 'SYSTEM',
    },
    items: {
      menu_dashboard: 'Overview',
      menu_news: 'News',
      menu_news_categories: 'News Categories',
      menu_static_pages: 'Static Pages',
      menu_events: 'Events',
      menu_projects: 'Projects',
      menu_services: 'Services',
      menu_products_group: 'Products',
      menu_product_categories: 'Product Categories',
      menu_product_brands: 'Manufacturers',
      menu_product_applications: 'Applications',
      menu_product_types: 'Product Types',
      menu_product_sales_staff: 'Sales Owners',
      menu_navigation: 'Navigation Menus',
      menu_media: 'Media Library',
      menu_system_config: 'System Settings',
      menu_function_seo: 'SEO & URL Settings',
      menu_customer_requests: 'Customer Requests',
      menu_email_templates: 'Email Templates',
      menu_cic_users: 'User Management',
      menu_permission_management: 'Permissions & Roles',
      menu_activity_logs: 'Activity Logs',
      menu_trash: 'System Trash',
    },
  },
};

export function getCmsDictionary(locale: CmsLocale): CmsDictionary {
  return locale === 'en' ? enCmsDictionary : viCmsDictionary;
}
