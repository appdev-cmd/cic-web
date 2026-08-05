import {
  KpiStats,
  ContactMessage,
  ProductRegistration,
  PendingContent,
  ActivityLog,
  TrafficStat,
  WeeklyContentStat,
  NotificationItem,
  CmsMenuGroup,
  CmsUser,
} from '../types';

export const currentUserMock: CmsUser = {
  id: 'usr_001',
  username: 'admin_cic',
  full_name: 'Nguyễn Văn Quản Trị',
  email: 'admin@cic.com.vn',
  role: 'superadmin',
  user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  status: 'active',
  last_login_time: '2026-07-31 09:30:15',
};

export const kpiStatsMock: KpiStats = {
  published_products: 45,
  published_news: 128,
  static_pages: 16,
  published_members: 340,
  unprocessed_contacts: 3,
  unprocessed_registrations: 5,
};

export const contactMessagesMock: ContactMessage[] = [
  {
    id: 'msg_101',
    sender_name: 'Trần Hoài Nam',
    sender_email: 'nam.tran@vinaconex.vn',
    sender_phone: '0912 345 678',
    subject: 'Yêu cầu tư vấn giải pháp SAP2000 & ETABS cho dự án cao ốc',
    content: 'Kính gửi CIC, công ty chúng tôi đang chuẩn bị đấu thầu gói thiết kế kết cấu tòa nhà 35 tầng tại Hà Nội. Rất mong quý CIC hỗ trợ tư vấn bản quyền và báo giá phần mềm ETABS V21.',
    status: 'unread',
    created_time: '2026-07-31 08:45:22',
  },
  {
    id: 'msg_102',
    sender_name: 'Lê Minh Đức',
    sender_email: 'duc.lm@hoabinhcorp.com.vn',
    sender_phone: '0988 765 432',
    subject: 'Liên hệ khảo sát phần mềm mô phỏng địa chất GeoSlope',
    content: 'Đơn vị chúng tôi cần đào tạo và chuyển giao công nghệ phân tích ổn định mái dốc GeoStudio. Nhờ admin chuyển thông tin cho chuyên viên kỹ thuật tư vấn sớm.',
    status: 'unread',
    created_time: '2026-07-31 07:15:00',
  },
  {
    id: 'msg_103',
    sender_name: 'Nguyễn Thị Bích Ngọc',
    sender_email: 'ngoc.nguyen@cienco4.vn',
    sender_phone: '0903 112 233',
    subject: 'Đăng ký tham gia Hội thảo Công nghệ BIM/CDE 2026',
    content: 'Xin chào CIC, tập đoàn Cienco4 mong muốn đăng ký 5 suất tham dự trực tiếp hội thảo BIM và giải pháp quản lý dự án công trình cầu đường tuần tới.',
    status: 'unread',
    created_time: '2026-07-30 16:20:10',
  },
  {
    id: 'msg_104',
    sender_name: 'Phạm Quốc Bảo',
    sender_email: 'baopq@dutoan.vn',
    sender_phone: '0977 889 900',
    subject: 'Cập nhật khóa cứng phần mềm Dự toán ESCON 2026',
    content: 'Khóa USB Escon của bên tôi cắm vào máy báo lỗi License Not Found, nhờ bộ phận hỗ trợ kỹ thuật CIC hướng dẫn xử lý gấp.',
    status: 'processing',
    created_time: '2026-07-30 14:05:40',
  },
  {
    id: 'msg_105',
    sender_name: 'Đặng Vũ Hải',
    sender_email: 'haidv@thanglongcons.com',
    sender_phone: '0934 556 677',
    subject: 'Hỏi về tài liệu hướng dẫn EnjiCAD v2.5 Tiếng Việt',
    content: 'Chúng tôi vừa hoàn thành mua 20 slot EnjiCAD, xin gửi file PDF hướng dẫn sử dụng và thư viện lệnh tắt qua email.',
    status: 'processing',
    created_time: '2026-07-29 11:50:30',
  },
];

export const productRegistrationsMock: ProductRegistration[] = [
  {
    id: 'reg_201',
    customer_name: 'Công ty Cổ phần Tư vấn Xây dựng Tổng hợp',
    customer_phone: '024 3822 9988',
    customer_email: 'contact@nAG.com.vn',
    product_id: 'prod_etabs',
    product_name: 'CSI ETABS Ultimate v21',
    company_name: 'NAGECCO Hà Nội',
    status: 'pending',
    created_time: '2026-07-31 09:10:00',
  },
  {
    id: 'reg_202',
    customer_name: 'Viện Khoa học Công nghệ Xây dựng IBST',
    customer_phone: '024 3754 1234',
    customer_email: 'khoahoc@ibst.gov.vn',
    product_id: 'prod_plaxis',
    product_name: 'PLAXIS 3D Ultimate 2026',
    company_name: 'Bộ Xây Dựng - IBST',
    status: 'pending',
    created_time: '2026-07-31 08:30:15',
  },
  {
    id: 'reg_203',
    customer_name: 'Tổng Công ty Xây dựng Trường Sơn',
    customer_phone: '0913 221 445',
    customer_email: 'truongson_cons@vnn.vn',
    product_id: 'prod_escon',
    product_name: 'Dự toán ESCON Professional',
    company_name: 'Binh đoàn 12',
    status: 'pending',
    created_time: '2026-07-30 17:45:00',
  },
  {
    id: 'reg_204',
    customer_name: 'Công ty TNHH Kết cấu Thép ATAD',
    customer_phone: '028 3925 5888',
    customer_email: 'steel@atad.vn',
    product_id: 'prod_sap2000',
    product_name: 'CSI SAP2000 Advanced v25',
    company_name: 'ATAD Steel Structure Corp',
    status: 'pending',
    created_time: '2026-07-30 15:10:20',
  },
  {
    id: 'reg_205',
    customer_name: 'Ban Quản lý Dự án Đầu tư Xây dựng Hà Nội',
    customer_phone: '024 3933 6677',
    customer_email: 'bql_hanoi@hanoi.gov.vn',
    product_id: 'prod_enjicad',
    product_name: 'EnjiCAD Network Enterprise',
    company_name: 'BQLDA Hà Nội',
    status: 'pending',
    created_time: '2026-07-30 10:05:00',
  },
];

export const pendingContentsMock: PendingContent[] = [
  {
    id: 'draft_301',
    title: 'Giải pháp ứng dụng phần mềm MIDAS Civil trong thiết kế cầu dây văng lớn',
    content_type: 'news',
    author_name: 'Lê Hoàng Anh (Biên tập)',
    status: 'published',
    created_time: '2026-07-31 09:00:12',
  },
  {
    id: 'draft_302',
    title: 'Phần mềm tính toán móng cọc rời rạc PilesStudio 2026',
    content_type: 'product',
    author_name: 'Nguyễn Minh Quân (Kỹ thuật)',
    status: 'draft',
    created_time: '2026-07-30 18:30:00',
  },
  {
    id: 'draft_303',
    title: 'Chính sách bảo hành & nâng cấp phần mềm bản quyền năm 2026',
    content_type: 'static_page',
    author_name: 'Phạm Thị Hương (Quản lý nội dung)',
    status: 'published',
    created_time: '2026-07-30 13:15:44',
  },
  {
    id: 'draft_304',
    title: 'Thông cáo báo chí: CIC đạt danh hiệu Nhà phân phối xuất sắc của Bentley Systems',
    content_type: 'news',
    author_name: 'Trần Phương Thảo (Truyền thông)',
    status: 'draft',
    created_time: '2026-07-29 16:40:10',
  },
  {
    id: 'draft_305',
    title: 'CSI Bridge v25 - Tính năng tự động phân tích phổ phản ứng động đất',
    content_type: 'product',
    author_name: 'Vũ Quốc Huy (Chuyên gia kỹ thuật)',
    status: 'published',
    created_time: '2026-07-29 09:20:00',
  },
];

export const activityLogsMock: ActivityLog[] = [
  {
    id: 'log_401',
    username: 'admin_cic',
    user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    activity_type: 'publish',
    description: 'Đã xuất bản bài viết "Xu hướng chuyển đổi số trong ngành Xây dựng 2026"',
    created_time: '2026-07-31 09:25:10',
  },
  {
    id: 'log_402',
    username: 'nguyen_editor',
    user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    activity_type: 'update',
    description: 'Cập nhật giá niêm yết và bộ lọc thuộc tính cho sản phẩm "EnjiCAD v2.5"',
    created_time: '2026-07-31 08:50:45',
  },
  {
    id: 'log_403',
    username: 'sys_backup',
    activity_type: 'system',
    description: 'Tự động sao lưu cơ sở dữ liệu hệ thống CMS (Backup_20260731_0300.sql.gz)',
    created_time: '2026-07-31 03:00:00',
  },
  {
    id: 'log_404',
    username: 'tran_sales',
    user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    activity_type: 'create',
    description: 'Chuyển trạng thái liên hệ "Trần Hoài Nam" sang "Đang xử lý báo giá"',
    created_time: '2026-07-30 17:10:05',
  },
  {
    id: 'log_405',
    username: 'admin_cic',
    user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    activity_type: 'auth',
    description: 'Đăng nhập hệ thống từ địa chỉ IP 118.70.182.95 (Hà Nội, Việt Nam)',
    created_time: '2026-07-30 14:00:12',
  },
  {
    id: 'log_406',
    username: 'pham_marketing',
    user_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    activity_type: 'create',
    description: 'Tạo mới Banner khuyến mãi "Chào hè 2026 - Giảm 15% EnjiCAD Network"',
    created_time: '2026-07-30 11:30:20',
  },
  {
    id: 'log_407',
    username: 'nguyen_editor',
    user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    activity_type: 'delete',
    description: 'Xóa bài viết nháp cũ "Thử nghiệm cấu hình tin tức tháng 5"',
    created_time: '2026-07-29 16:45:10',
  },
  {
    id: 'log_408',
    username: 'sys_security',
    activity_type: 'system',
    description: 'Quét bảo mật định kỳ: Không phát hiện lỗ hổng CSRF hoặc SQLi',
    created_time: '2026-07-29 02:00:00',
  },
  {
    id: 'log_409',
    username: 'vu_tech',
    user_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    activity_type: 'publish',
    description: 'Tải lên tài liệu kỹ thuật PDF "Hướng dẫn cắm khóa cứng ESCON 2026"',
    created_time: '2026-07-28 15:20:00',
  },
  {
    id: 'log_410',
    username: 'admin_cic',
    user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    activity_type: 'update',
    description: 'Cập nhật cấu hình SEO Meta Keywords và Google Analytics tracking ID',
    created_time: '2026-07-28 10:05:30',
  },
];

export const dailyTrafficMock: TrafficStat[] = [
  { date_label: '24/07', visits_count: 1240, page_views_count: 3890 },
  { date_label: '25/07', visits_count: 1450, page_views_count: 4210 },
  { date_label: '26/07', visits_count: 980,  page_views_count: 2840 },
  { date_label: '27/07', visits_count: 1890, page_views_count: 5620 },
  { date_label: '28/07', visits_count: 2100, page_views_count: 6450 },
  { date_label: '29/07', visits_count: 2350, page_views_count: 7100 },
  { date_label: '30/07', visits_count: 2480, page_views_count: 7590 },
];

export const monthlyTrafficMock: TrafficStat[] = [
  { date_label: 'Tuần 1 (01-07)', visits_count: 8500,  page_views_count: 25400 },
  { date_label: 'Tuần 2 (08-14)', visits_count: 11200, page_views_count: 34100 },
  { date_label: 'Tuần 3 (15-21)', visits_count: 13800, page_views_count: 41900 },
  { date_label: 'Tuần 4 (22-30)', visits_count: 16400, page_views_count: 49800 },
];

export const weeklyContentStatsMock: WeeklyContentStat[] = [
  { week_label: 'Tuần 27', news_count: 14, product_count: 3, static_page_count: 1 },
  { week_label: 'Tuần 28', news_count: 18, product_count: 5, static_page_count: 2 },
  { week_label: 'Tuần 29', news_count: 22, product_count: 8, static_page_count: 0 },
  { week_label: 'Tuần 30', news_count: 16, product_count: 4, static_page_count: 3 },
];

export const notificationsMock: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Tin nhắn liên hệ mới',
    description: 'Trần Hoài Nam (Vinaconex) gửi yêu cầu tư vấn ETABS v21',
    type: 'contact',
    unread: true,
    created_time: '15 phút trước',
  },
  {
    id: 'notif_2',
    title: 'Đăng ký sản phẩm mới',
    description: 'NAGECCO Hà Nội đăng ký mua CSI ETABS Ultimate',
    type: 'registration',
    unread: true,
    created_time: '35 phút trước',
  },
  {
    id: 'notif_3',
    title: 'Cảnh báo hệ thống',
    description: 'Dung lượng thư viện ảnh đã đạt 82% hạn ngạch bộ nhớ',
    type: 'system',
    unread: true,
    created_time: '2 giờ trước',
  },
  {
    id: 'notif_4',
    title: 'Sao lưu thành công',
    description: 'Cơ sở dữ liệu tự động sao lưu an toàn lúc 03:00 AM',
    type: 'backup',
    unread: false,
    created_time: '6 giờ trước',
  },
];

export const cmsMenuGroupsMock: CmsMenuGroup[] = [
  {
    id: 'grp_tong_quan',
    groupTitle: 'TỔNG QUAN',
    items: [
      {
        id: 'menu_dashboard',
        title: 'Tổng quan',
        iconName: 'LayoutDashboard',
        path: '/cms/dashboard',
      },
    ],
  },
  {
    id: 'grp_noi_dung',
    groupTitle: 'NỘI DUNG',
    items: [
      {
        id: 'menu_news',
        title: 'Tin tức',
        iconName: 'Newspaper',
        path: '/cms/news',
        badgeCount: 12,
        badgeVariant: 'info',
      },
      {
        id: 'menu_static_pages',
        title: 'Trang nội dung',
        iconName: 'FileText',
        path: '/cms/static-pages',
      },
      {
        id: 'menu_events',
        title: 'Sự kiện',
        iconName: 'CalendarEvent',
        path: '/cms/events',
      },
    ],
  },
  {
    id: 'grp_danh_muc_kinh_doanh',
    groupTitle: 'DANH MỤC KINH DOANH',
    items: [
      {
        id: 'menu_products_group',
        title: 'Sản phẩm',
        iconName: 'Package',
        path: '/cms/products',
      },
      {
        id: 'menu_product_settings',
        title: 'Thiết lập sản phẩm',
        iconName: 'FolderTree',
        path: '/cms/product-settings',
      },
      {
        id: 'menu_services',
        title: 'Dịch vụ',
        iconName: 'Layers',
        path: '/cms/services',
      },
    ],
  },
  {
    id: 'grp_trinh_bay_website',
    groupTitle: 'TRÌNH BÀY WEBSITE',
    items: [
      {
        id: 'menu_navigation',
        title: 'Menu',
        iconName: 'Menu',
        path: '/cms/frontend-menus',
      },
      {
        id: 'menu_banners_slideshow',
        title: 'Banner & Slideshow',
        iconName: 'Image',
        path: '/cms/banners',
      },
      {
        id: 'menu_home_blocks',
        title: 'Khối nội dung',
        iconName: 'Grid',
        path: '/cms/home-blocks',
      },
    ],
  },
  {
    id: 'grp_media',
    groupTitle: 'MEDIA',
    items: [
      {
        id: 'menu_media_library',
        title: 'Thư viện media',
        iconName: 'FolderImage',
        path: '/cms/media',
      },
    ],
  },
  {
    id: 'grp_khach_hang',
    groupTitle: 'KHÁCH HÀNG',
    items: [
      {
        id: 'menu_all_requests',
        title: 'Yêu cầu khách hàng',
        iconName: 'Inbox',
        path: '/cms/contact-requests',
        badgeCount: 8,
        badgeVariant: 'warning',
      },
    ],
  },
  {
    id: 'grp_ban_dia_hoa',
    groupTitle: 'BẢN ĐỊA HÓA',
    items: [
      {
        id: 'menu_translation_strings',
        title: 'Chuỗi giao diện',
        iconName: 'Sparkles',
        path: '/cms/translation-strings',
      },
    ],
  },
  {
    id: 'grp_quan_tri',
    groupTitle: 'QUẢN TRỊ',
    items: [
      {
        id: 'menu_users',
        title: 'Người dùng',
        iconName: 'UserCheck',
        path: '/cms/users',
      },
      {
        id: 'menu_permissions',
        title: 'Vai trò & quyền',
        iconName: 'ShieldAlert',
        path: '/cms/permissions',
      },
      {
        id: 'menu_system_settings',
        title: 'Cấu hình hệ thống',
        iconName: 'Settings',
        path: '/cms/settings',
      },
      {
        id: 'menu_activity_logs',
        title: 'Nhật ký hoạt động',
        iconName: 'History',
        path: '/cms/activity-logs',
      },
      {
        id: 'menu_trash',
        title: 'Thùng rác',
        iconName: 'RotateCcw',
        path: '/cms/trash',
      },
    ],
  },
];
