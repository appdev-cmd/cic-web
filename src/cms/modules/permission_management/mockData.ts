import {
  PermissionTask,
  PermissionFunction,
  PermissionField,
  CmsUserPermissionTarget,
  UserPermissionState,
} from './types';

export const permissionUsersMock: CmsUserPermissionTarget[] = [
  {
    id: 'usr_001',
    username: 'admin_cic',
    fullName: 'Nguyễn Văn Quản Trị',
    email: 'admin@cic.com.vn',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Super Administrator',
    department: 'Ban Giám Đốc',
  },
  {
    id: 'usr_002',
    username: 'minh_bien',
    fullName: 'Trần Biên Minh',
    email: 'minh.bien@cic.com.vn',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Biên tập viên',
    department: 'Phòng Truyền thông',
  },
  {
    id: 'usr_003',
    username: 'hoang_kythuat',
    fullName: 'Lê Huy Hoàng',
    email: 'hoang.tech@cic.com.vn',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Quản lý Kỹ thuật',
    department: 'Phòng Giải pháp phần mềm',
  },
  {
    id: 'usr_004',
    username: 'phuong_kinhdoanh',
    fullName: 'Phạm Mai Phương',
    email: 'phuong.sales@cic.com.vn',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Chuyên viên Kinh doanh',
    department: 'Phòng Báo giá & Khách hàng',
  },
];

export const initialPermissionTasksMock: PermissionTask[] = [
  // PRODUCTS MODULE
  { id: 'tsk_prod_list', module: 'PRODUCTS', view: 'List', task: 'View Products List', description: 'Quyền xem danh sách tất cả sản phẩm phần mềm', published: true, ordering: 1 },
  { id: 'tsk_prod_add', module: 'PRODUCTS', view: 'List', task: 'Add New Product', description: 'Thêm mới thông tin sản phẩm phần mềm', published: true, ordering: 2 },
  { id: 'tsk_prod_edit', module: 'PRODUCTS', view: 'Detail', task: 'Edit Product Detail', description: 'Chỉnh sửa thông tin chi tiết sản phẩm', published: true, ordering: 3 },
  { id: 'tsk_prod_del', module: 'PRODUCTS', view: 'List', task: 'Delete Product', description: 'Xóa sản phẩm khỏi hệ thống', published: true, ordering: 4 },
  { id: 'tsk_prod_pub', module: 'PRODUCTS', view: 'List', task: 'Publish Product', description: 'Phê duyệt xuất bản sản phẩm ra website', published: true, ordering: 5 },

  // USERS MODULE
  { id: 'tsk_user_list', module: 'USERS', view: 'List', task: 'View Admin Users', description: 'Xem danh sách tài khoản người dùng quản trị', published: true, ordering: 6 },
  { id: 'tsk_user_add', module: 'USERS', view: 'Detail', task: 'Add Admin User', description: 'Tạo tài khoản quản trị mới', published: true, ordering: 7 },
  { id: 'tsk_user_edit', module: 'USERS', view: 'Detail', task: 'Edit Admin User', description: 'Sửa thông tin và phân quyền người dùng', published: true, ordering: 8 },
  { id: 'tsk_user_del', module: 'USERS', view: 'List', task: 'Delete Admin User', description: 'Xóa tài khoản khỏi CMS', published: true, ordering: 9 },

  // NEWS MODULE
  { id: 'tsk_news_list', module: 'NEWS', view: 'List', task: 'View Articles List', description: 'Xem danh sách bài viết & tin tức', published: true, ordering: 10 },
  { id: 'tsk_news_add', module: 'NEWS', view: 'Detail', task: 'Create Article', description: 'Soạn thảo bài viết tin tức mới', published: true, ordering: 11 },
  { id: 'tsk_news_edit', module: 'NEWS', view: 'Detail', task: 'Edit Article', description: 'Chỉnh sửa bài viết tin tức', published: true, ordering: 12 },
  { id: 'tsk_news_pub', module: 'NEWS', view: 'List', task: 'Publish Article', description: 'Đăng xuất bản bài viết tin tức', published: true, ordering: 13 },

  // BANNERS MODULE
  { id: 'tsk_banner_list', module: 'BANNERS', view: 'List', task: 'View Banners', description: 'Xem danh sách banner quảng cáo', published: true, ordering: 14 },
  { id: 'tsk_banner_edit', module: 'BANNERS', view: 'Detail', task: 'Manage Banners', description: 'Cấu hình và thêm mới slider banner', published: true, ordering: 15 },

  // SETTINGS MODULE
  { id: 'tsk_sett_view', module: 'SETTINGS', view: 'Global', task: 'View System Settings', description: 'Xem cấu hình chung hệ thống', published: true, ordering: 16 },
  { id: 'tsk_sett_edit', module: 'SETTINGS', view: 'Global', task: 'Update Configuration', description: 'Cập nhật tham số hệ thống & SEO', published: true, ordering: 17 },
];

export const permissionFunctionsMock: PermissionFunction[] = [
  // Products Functions
  { id: 'fn_p_v1', taskId: 'tsk_prod_list', code: 'FUN_PROD_FILTER', name: 'Sử dụng bộ lọc loại sản phẩm' },
  { id: 'fn_p_v2', taskId: 'tsk_prod_list', code: 'FUN_PROD_EXPORT', name: 'Xuất dữ liệu Excel / CSV' },
  { id: 'fn_p_a1', taskId: 'tsk_prod_add', code: 'FUN_PROD_DRAFT', name: 'Lưu bản nháp sản phẩm' },
  { id: 'fn_p_e1', taskId: 'tsk_prod_edit', code: 'FUN_PROD_QUICK_SAVE', name: 'Lưu thay đổi nhanh' },
  { id: 'fn_p_e2', taskId: 'tsk_prod_edit', code: 'FUN_PROD_DUPLICATE', name: 'Nhân bản dữ liệu sản phẩm' },
  { id: 'fn_p_p1', taskId: 'tsk_prod_pub', code: 'FUN_PROD_BATCH_PUB', name: 'Duyệt xuất bản hàng loạt' },

  // Users Functions
  { id: 'fn_u_v1', taskId: 'tsk_user_list', code: 'FUN_USER_SEARCH', name: 'Tìm kiếm người dùng nâng cao' },
  { id: 'fn_u_e1', taskId: 'tsk_user_edit', code: 'FUN_USER_PWD_RESET', name: 'Cấp lại mật khẩu tài khoản' },

  // News Functions
  { id: 'fn_n_a1', taskId: 'tsk_news_add', code: 'FUN_NEWS_IMAGE_UPLOAD', name: 'Tải ảnh bìa & media' },
  { id: 'fn_n_p1', taskId: 'tsk_news_pub', code: 'FUN_NEWS_SCHEDULE_PUB', name: 'Hẹn giờ xuất bản tự động' },
];

export const permissionFieldsMock: PermissionField[] = [
  // Products Fields
  { id: 'fld_p_name', moduleId: 'PRODUCTS', fieldCode: 'name', fieldName: 'Tên sản phẩm' },
  { id: 'fld_p_code', moduleId: 'PRODUCTS', fieldCode: 'code', fieldName: 'Mã phần mềm (SKU)' },
  { id: 'fld_p_price', moduleId: 'PRODUCTS', fieldCode: 'price', fieldName: 'Giá niêm yết / Báo giá' },
  { id: 'fld_p_desc', moduleId: 'PRODUCTS', fieldCode: 'description', fieldName: 'Mô tả chi tiết & Thông số' },
  { id: 'fld_p_thumb', moduleId: 'PRODUCTS', fieldCode: 'thumbnail', fieldName: 'Hình ảnh đại diện' },
  { id: 'fld_p_pub', moduleId: 'PRODUCTS', fieldCode: 'published', fieldName: 'Trạng thái Xuất bản' },
  { id: 'fld_p_ord', moduleId: 'PRODUCTS', fieldCode: 'ordering', fieldName: 'Thứ tự ưu tiên' },

  // Users Fields
  { id: 'fld_u_uname', moduleId: 'USERS', fieldCode: 'username', fieldName: 'Tên đăng nhập' },
  { id: 'fld_u_pwd', moduleId: 'USERS', fieldCode: 'password', fieldName: 'Mật khẩu' },
  { id: 'fld_u_email', moduleId: 'USERS', fieldCode: 'email', fieldName: 'Địa chỉ Email' },
  { id: 'fld_u_fname', moduleId: 'USERS', fieldCode: 'full_name', fieldName: 'Họ và tên' },
  { id: 'fld_u_phone', moduleId: 'USERS', fieldCode: 'phone', fieldName: 'Số điện thoại' },
  { id: 'fld_u_agency', moduleId: 'USERS', fieldCode: 'agencies', fieldName: 'Đơn vị phụ trách' },

  // News Fields
  { id: 'fld_n_title', moduleId: 'NEWS', fieldCode: 'title', fieldName: 'Tiêu đề bài viết' },
  { id: 'fld_n_content', moduleId: 'NEWS', fieldCode: 'content', fieldName: 'Nội dung HTML chi tiết' },
  { id: 'fld_n_seo', moduleId: 'NEWS', fieldCode: 'meta_seo', fieldName: 'Thẻ SEO Meta & Alt' },
];

export const initialUserPermissionsMock: Record<string, UserPermissionState> = {
  usr_001: {
    userId: 'usr_001',
    grantedTaskIds: initialPermissionTasksMock.map((t) => t.id),
    grantedFunctionIds: permissionFunctionsMock.map((f) => f.id),
    grantedFieldIds: permissionFieldsMock.map((f) => f.id),
  },
  usr_002: {
    userId: 'usr_002',
    grantedTaskIds: ['tsk_prod_list', 'tsk_prod_edit', 'tsk_news_list', 'tsk_news_add', 'tsk_news_edit', 'tsk_news_pub', 'tsk_banner_list', 'tsk_banner_edit'],
    grantedFunctionIds: ['fn_p_v1', 'fn_p_e1', 'fn_n_a1', 'fn_n_p1'],
    grantedFieldIds: ['fld_p_name', 'fld_p_desc', 'fld_p_thumb', 'fld_n_title', 'fld_n_content', 'fld_n_seo'],
  },
  usr_003: {
    userId: 'usr_003',
    grantedTaskIds: ['tsk_prod_list', 'tsk_prod_add', 'tsk_prod_edit', 'tsk_news_list'],
    grantedFunctionIds: ['fn_p_v1', 'fn_p_a1', 'fn_p_e1'],
    grantedFieldIds: ['fld_p_name', 'fld_p_code', 'fld_p_price', 'fld_p_desc', 'fld_p_thumb'],
  },
  usr_004: {
    userId: 'usr_004',
    grantedTaskIds: ['tsk_prod_list', 'tsk_news_list'],
    grantedFunctionIds: ['fn_p_v1'],
    grantedFieldIds: ['fld_p_name', 'fld_p_price'],
  },
};
