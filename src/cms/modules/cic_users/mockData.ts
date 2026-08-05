import { CicUser, AgencyOption, CategoryOption, RoleOption } from './types';

export const rolesMock: RoleOption[] = [
  {
    id: 'role_superadmin',
    name: 'Super Admin',
    description: 'Toàn quyền truy cập và cấu hình toàn bộ hệ thống CMS',
    permissions_count: 48,
    badge_color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  },
  {
    id: 'role_admin',
    name: 'User Administrator',
    description: 'Quản trị danh tính người dùng, gán role và theo dõi bảo mật',
    permissions_count: 32,
    badge_color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  },
  {
    id: 'role_editor',
    name: 'Content Editor',
    description: 'Biên tập, đăng bài tin tức, sản phẩm và quản lý bài viết',
    permissions_count: 24,
    badge_color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
  {
    id: 'role_sales',
    name: 'Sales Manager',
    description: 'Quản lý yêu cầu báo giá, thông tin tư vấn khách hàng',
    permissions_count: 18,
    badge_color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
  {
    id: 'role_translator',
    name: 'Localization Translator',
    description: 'Biên soạn và duyệt chuỗi giao diện website',
    permissions_count: 12,
    badge_color: 'bg-teal-100 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  },
];

export const agenciesMock: AgencyOption[] = [
  { id: 'agency_hn', name: 'Trụ sở chính Hà Nội (HQ)', code: 'HN' },
  { id: 'agency_hcm', name: 'Chi nhánh TP. Hồ Chí Minh', code: 'HCM' },
  { id: 'agency_dn', name: 'Văn phòng Đại diện Đà Nẵng', code: 'DN' },
  { id: 'agency_ct', name: 'Văn phòng Đại diện Cần Thơ', code: 'CT' },
];

export const productCategoriesMock: CategoryOption[] = [
  { id: 'cat_p1', name: 'Phần mềm Phân tích Kết cấu (SAP2000, ETABS, SAFE)' },
  { id: 'cat_p2', name: 'Giải pháp Mô hình hóa thông tin BIM (Revit, Tekla)' },
  { id: 'cat_p3', name: 'Phần mềm Địa kỹ thuật & Mái dốc (Plaxis, GeoStudio)' },
  { id: 'cat_p4', name: 'Hệ thống Quản lý Đô thị & CAD (EnjiCAD, GIS)' },
  { id: 'cat_p5', name: 'Thiết bị Đo đạc & Trắc địa Công trình' },
  { id: 'cat_p6', name: 'Giải pháp Quản lý Chi phí & Dự toán (CostX)' },
];

export const newsCategoriesMock: CategoryOption[] = [
  { id: 'cat_n1', name: 'Tin tức Doanh nghiệp CIC' },
  { id: 'cat_n2', name: 'Sự kiện & Hội thảo Công nghệ' },
  { id: 'cat_n3', name: 'Kiến thức Kỹ thuật & Hướng dẫn' },
  { id: 'cat_n4', name: 'Thông cáo Báo chí & Bản quyền' },
  { id: 'cat_n5', name: 'Dự án & Khách hàng Tiêu biểu' },
];

export const cicUsersMock: CicUser[] = [
  {
    id: 'usr_001',
    username: 'admin_cic',
    email: 'admin@cic.com.vn',
    fname: 'Quản Trị',
    lname: 'Nguyễn Văn',
    full_name: 'Nguyễn Văn Quản Trị',
    phone: '0912 345 678',
    country: 'Việt Nam',
    address: '37 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội',
    summary: 'Quản trị viên hệ thống cấp cao phụ trách toàn bộ hệ thống CMS.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    published: true,
    status: 'active',
    role_id: 'role_superadmin',
    role_name: 'Super Admin',
    ordering: 1,
    agencies: ['agency_hn'],
    products_categories: ['cat_p1', 'cat_p2', 'cat_p3', 'cat_p4'],
    news_categories: ['cat_n1', 'cat_n2', 'cat_n3', 'cat_n4'],
    two_factor_enabled: true,
    password_last_changed: '2026-06-12 10:00:00',
    failed_login_attempts: 0,
    status_online: true,
    created_time: '2025-01-15 08:30:00',
    updated_time: '2026-07-30 14:22:10',
    last_visit_time: '2026-08-02 09:15:00',
    nums_visit: 1240,
    security_logs: [
      {
        id: 'sec_101',
        timestamp: '2026-08-02 09:15:00',
        action: 'Đăng nhập thành công',
        ip_address: '118.70.124.89',
        user_agent: 'Chrome 126.0 (macOS)',
        status: 'success',
      },
      {
        id: 'sec_100',
        timestamp: '2026-07-30 14:22:10',
        action: 'Cập nhật phân quyền phụ trách danh mục',
        ip_address: '118.70.124.89',
        user_agent: 'Chrome 126.0 (macOS)',
        status: 'success',
      }
    ],
    status_history: [
      {
        id: 'sth_001',
        timestamp: '2025-01-15 08:30:00',
        previous_status: 'pending_invite',
        new_status: 'active',
        changed_by: 'system_bootstrap',
        reason: 'Khởi tạo tài khoản Quản trị hệ thống ban đầu',
      }
    ]
  },
  {
    id: 'usr_002',
    username: 'minh_bien',
    email: 'minh.bien@cic.com.vn',
    fname: 'Minh',
    lname: 'Trần Biên',
    full_name: 'Trần Biên Minh',
    phone: '0988 123 456',
    country: 'Việt Nam',
    address: '180 Cao Thắng, Phường 12, Quận 10, TP.HCM',
    summary: 'Biên tập viên phòng Truyền thông & Quảng bá giải pháp phần mềm.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    published: true,
    status: 'active',
    role_id: 'role_editor',
    role_name: 'Content Editor',
    ordering: 2,
    agencies: ['agency_hcm'],
    products_categories: ['cat_p1', 'cat_p2'],
    news_categories: ['cat_n1', 'cat_n2', 'cat_n5'],
    two_factor_enabled: true,
    password_last_changed: '2026-04-18 11:15:00',
    failed_login_attempts: 0,
    status_online: true,
    created_time: '2025-03-20 10:12:45',
    updated_time: '2026-07-28 16:05:00',
    last_visit_time: '2026-08-02 08:40:12',
    nums_visit: 580,
    security_logs: [
      {
        id: 'sec_102',
        timestamp: '2026-08-02 08:40:12',
        action: 'Đăng nhập thành công',
        ip_address: '14.232.112.45',
        user_agent: 'Firefox 125.0 (Windows 11)',
        status: 'success',
      }
    ],
    status_history: [
      {
        id: 'sth_002',
        timestamp: '2025-03-20 10:12:45',
        previous_status: 'pending_invite',
        new_status: 'active',
        changed_by: 'admin_cic',
        reason: 'Xác thực tài khoản nhân sự mới onboarding',
      }
    ]
  },
  {
    id: 'usr_003',
    username: 'hoang_kythuat',
    email: 'hoang.tech@cic.com.vn',
    fname: 'Hoàng',
    lname: 'Lê Huy',
    full_name: 'Lê Huy Hoàng',
    phone: '0903 888 999',
    country: 'Việt Nam',
    address: '25 Nguyễn Tri Phương, Thanh Khê, Đà Nẵng',
    summary: 'Chuyên gia hỗ trợ kỹ thuật và đào tạo chuyển giao phần mềm CSI & Plaxis.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    published: false,
    status: 'suspended',
    role_id: 'role_editor',
    role_name: 'Content Editor',
    ordering: 3,
    agencies: ['agency_dn'],
    products_categories: ['cat_p3', 'cat_p4', 'cat_p5'],
    news_categories: ['cat_n3'],
    two_factor_enabled: false,
    password_last_changed: '2025-11-05 14:20:00',
    failed_login_attempts: 3,
    status_online: false,
    created_time: '2025-06-10 15:45:12',
    updated_time: '2026-07-25 11:30:00',
    last_visit_time: '2026-08-01 17:20:00',
    nums_visit: 310,
    security_logs: [
      {
        id: 'sec_103',
        timestamp: '2026-08-01 17:20:00',
        action: 'Tạm khóa tài khoản do quá số lần đăng nhập sai',
        ip_address: '113.160.88.12',
        user_agent: 'Chrome 126.0 (Windows)',
        status: 'warning',
        details: 'Nhập sai mật khẩu 3 lần liên tiếp',
      }
    ],
    status_history: [
      {
        id: 'sth_003',
        timestamp: '2026-08-01 17:20:00',
        previous_status: 'active',
        new_status: 'suspended',
        changed_by: 'system_security',
        reason: 'Tạm khóa bảo mật do 3 lần nhập sai mật khẩu liên tiếp',
      }
    ]
  },
  {
    id: 'usr_004',
    username: 'phuong_kinhdoanh',
    email: 'phuong.sales@cic.com.vn',
    fname: 'Phương',
    lname: 'Phạm Mai',
    full_name: 'Phạm Mai Phương',
    phone: '0934 567 890',
    country: 'Việt Nam',
    address: 'Tòa nhà CIC, Phường 1, Cần Thơ',
    summary: 'Chuyên viên quản lý đăng ký báo giá và liên hệ khách hàng khu vực Miền Tây.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    published: false,
    status: 'deactivated',
    role_id: 'role_sales',
    role_name: 'Sales Manager',
    ordering: 4,
    agencies: ['agency_ct'],
    products_categories: ['cat_p1', 'cat_p6'],
    news_categories: ['cat_n4'],
    two_factor_enabled: false,
    password_last_changed: '2025-09-01 09:00:00',
    failed_login_attempts: 0,
    status_online: false,
    created_time: '2025-09-01 09:00:00',
    updated_time: '2026-06-15 14:00:00',
    last_visit_time: '2026-07-10 10:15:00',
    nums_visit: 142,
    security_logs: [
      {
        id: 'sec_104',
        timestamp: '2026-07-10 10:15:00',
        action: 'Ngừng sử dụng tài khoản nhân sự nghỉ việc',
        ip_address: '118.70.124.89',
        user_agent: 'Chrome 126.0 (macOS)',
        status: 'warning',
      }
    ],
    status_history: [
      {
        id: 'sth_004',
        timestamp: '2026-07-10 10:15:00',
        previous_status: 'active',
        new_status: 'deactivated',
        changed_by: 'admin_cic',
        reason: 'Nhân sự nghỉ việc - Ngừng sử dụng và chuyển giao dữ liệu',
      }
    ]
  },
  {
    id: 'usr_005',
    username: 'tuan_dichthuat',
    email: 'tuan.loc@cic.com.vn',
    fname: 'Tuấn',
    lname: 'Lê Anh',
    full_name: 'Lê Anh Tuấn',
    phone: '0977 444 333',
    country: 'Việt Nam',
    address: '37 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội',
    summary: 'Chuyên viên biên soạn chuỗi giao diện website.',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    published: true,
    status: 'pending_invite',
    role_id: 'role_translator',
    role_name: 'Localization Translator',
    ordering: 5,
    agencies: ['agency_hn', 'agency_hcm'],
    products_categories: ['cat_p1', 'cat_p2', 'cat_p3'],
    news_categories: ['cat_n1', 'cat_n2'],
    two_factor_enabled: false,
    failed_login_attempts: 0,
    status_online: false,
    created_time: '2026-08-03 14:00:00',
    updated_time: '2026-08-03 14:00:00',
    nums_visit: 0,
    security_logs: [
      {
        id: 'sec_105',
        timestamp: '2026-08-03 14:00:00',
        action: 'Gửi thư mời kích hoạt tài khoản',
        ip_address: '118.70.124.89',
        status: 'success',
        details: 'Đã gửi email kích hoạt tới tuan.loc@cic.com.vn',
      }
    ],
    status_history: [
      {
        id: 'sth_005',
        timestamp: '2026-08-03 14:00:00',
        previous_status: 'pending_invite',
        new_status: 'pending_invite',
        changed_by: 'admin_cic',
        reason: 'Khởi tạo tài khoản và gửi link kích hoạt cho nhân viên mới',
      }
    ]
  }
];
