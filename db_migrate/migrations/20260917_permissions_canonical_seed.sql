-- Migration: 20260917_permissions_canonical_seed.sql
-- Description: Canonicalize cic_permission_tasks to map 1:1 with CMS navigation menus (26 canonical tasks)

BEGIN;

SELECT pg_advisory_xact_lock(hashtext('cic_canonical_permissions_seed'));

-- 1. Deprecate legacy/empty tasks
UPDATE cic_permission_tasks 
SET published = false 
WHERE id < 100;

-- 2. Upsert 26 Canonical CMS Menu Tasks
INSERT INTO cic_permission_tasks (
  id, module, view, _task, trigger, description, ordering, published, list_field, list_function, is_contents
) OVERRIDING SYSTEM VALUE VALUES
  (101, 'dashboard', 'Tổng quan', 'dashboard', null, 'Xem bảng thống kê tổng quan và chỉ số hoạt động của toàn bộ hệ thống', 100, true, null, 'view', false),
  (102, 'news', 'Tin tức', 'news', null, 'Xem, soạn thảo, chỉnh sửa, xuất bản và xóa bài viết tin tức', 200, true, null, 'view,create,edit,publish,delete', false),
  (103, 'news', 'Danh mục tin tức', 'news_categories', null, 'Xem, tạo mới, chỉnh sửa và quản lý cây chuyên mục tin tức', 210, true, null, 'view,create,edit,delete', false),
  (104, 'static_pages', 'Trang nội dung', 'static_pages', null, 'Xem, tạo mới, biên tập nội dung, xem trước và xuất bản trang tĩnh/chính sách', 220, true, null, 'view,create,edit,publish,delete', false),
  (105, 'events', 'Sự kiện', 'events', null, 'Xem, đăng tải, quản lý lịch trình và xuất bản các sự kiện, hội thảo', 230, true, null, 'view,create,edit,publish,delete', false),
  (106, 'projects', 'Dự án', 'projects', null, 'Xem, thêm mới, cập nhật tiến độ và xuất bản các dự án tiêu biểu', 240, true, null, 'view,create,edit,publish,delete', false),
  (107, 'services', 'Dịch vụ', 'services', null, 'Xem, biên tập thông tin và xuất bản các gói dịch vụ kỹ thuật', 250, true, null, 'view,create,edit,publish,delete', false),
  (108, 'products', 'Sản phẩm', 'products', null, 'Xem danh sách, thêm mới, biên tập chi tiết, xuất bản, xóa và xuất dữ liệu sản phẩm phần mềm', 300, true, null, 'view,create,edit,publish,delete,export', false),
  (109, 'product_settings', 'Danh mục sản phẩm', 'product_categories', null, 'Quản lý phân loại cây danh mục ngành hàng sản phẩm', 310, true, null, 'view,create,edit,delete', false),
  (110, 'product_settings', 'Hãng sản xuất', 'product_brands', null, 'Quản lý thương hiệu, đối tác và các hãng sản xuất phần mềm', 320, true, null, 'view,create,edit,delete', false),
  (111, 'product_settings', 'Lĩnh vực ứng dụng', 'product_applications', null, 'Quản lý các lĩnh vực công nghệ và ứng dụng chuyên ngành', 330, true, null, 'view,create,edit,delete', false),
  (112, 'product_settings', 'Loại sản phẩm', 'product_types', null, 'Quản lý hình thức và loại hình bản quyền/sản phẩm', 340, true, null, 'view,create,edit,delete', false),
  (113, 'product_settings', 'Người phụ trách kinh doanh', 'sales_staff', null, 'Phân công và chỉ định nhân viên kinh doanh phụ trách dòng sản phẩm', 350, true, null, 'view,create,edit,delete', false),
  (114, 'menu', 'Menu', 'menu', null, 'Quản lý cây điều hướng Header và các cột Footer đa cấp đa ngôn ngữ', 400, true, null, 'view,create,edit,delete,publish', false),
  (115, 'media', 'Thư viện media', 'media', null, 'Tải lên, biên tập, quản lý album hình ảnh và tài nguyên tệp', 410, true, null, 'view,create,edit,delete', false),
  (116, 'cta', 'CTA', 'cta', null, 'Quản lý các nút kêu gọi hành động, banner pop-up và điều hướng chuyển đổi', 500, true, null, 'view,create,edit,delete', false),
  (117, 'forms', 'Biểu mẫu', 'forms', null, 'Thiết kế biểu mẫu khảo sát/thu thập thông tin và xuất dữ liệu phản hồi', 510, true, null, 'view,create,edit,delete,export', false),
  (118, 'customer_requests', 'Yêu cầu khách hàng', 'customer_requests', null, 'Xem, phân loại, gán xử lý và theo dõi các yêu cầu liên hệ/báo giá từ khách hàng', 520, true, null, 'view,edit,delete,export', false),
  (119, 'email_templates', 'Mẫu email', 'email_templates', null, 'Soạn thảo và cấu hình các mẫu email thông báo/phản hồi tự động', 530, true, null, 'view,create,edit,delete,publish', false),
  (120, 'users', 'Người dùng', 'users', null, 'Quản lý danh sách tài khoản, thông tin nhân sự và trạng thái truy cập CMS', 600, true, null, 'view,create,edit,delete', false),
  (121, 'roles', 'Vai trò & quyền', 'roles', null, 'Thiết lập các vai trò và cấu hình ma trận phân quyền chi tiết cho nhân sự', 610, true, null, 'view,create,edit,delete', false),
  (122, 'settings', 'Cấu hình hệ thống', 'settings', null, 'Xem và thay đổi các tham số cấu hình chung, thông tin doanh nghiệp và SMTP', 620, true, null, 'view,edit,configure', false),
  (123, 'function_seo', 'SEO & URL', 'function_seo', null, 'Tối ưu hóa thẻ meta, từ khóa SEO và định tuyến đường dẫn tĩnh', 630, true, null, 'view,edit,configure', false),
  (124, 'localization', 'Ngôn ngữ giao diện', 'localization', null, 'Dịch thuật và tùy biến các chuỗi văn bản giao diện website đa ngôn ngữ', 640, true, null, 'view,edit', false),
  (125, 'audit', 'Nhật ký hoạt động', 'activity_logs', null, 'Truy vết toàn bộ nhật ký thao tác và xuất báo cáo kiểm toán bảo mật', 650, true, null, 'view,export', false),
  (126, 'trash', 'Thùng rác', 'trash', null, 'Xem, khôi phục hoặc xóa vĩnh viễn các bản ghi đã xóa tạm thời trong hệ thống', 660, true, null, 'view,edit,delete', false)
ON CONFLICT (id) DO UPDATE SET
  module = EXCLUDED.module,
  view = EXCLUDED.view,
  _task = EXCLUDED._task,
  description = EXCLUDED.description,
  ordering = EXCLUDED.ordering,
  published = true,
  list_function = EXCLUDED.list_function;

-- 3. Default role permissions for Admin/Superadmin
INSERT INTO cic_role_permissions (role_id, permission_task_id, action, allowed, updated_by)
SELECT r.id, t.id, a.action, true, NULL
FROM cic_roles r
CROSS JOIN (SELECT id FROM cic_permission_tasks WHERE id >= 101 AND id <= 126) t
CROSS JOIN (VALUES ('view'), ('create'), ('edit'), ('publish'), ('delete'), ('export'), ('configure')) AS a(action)
WHERE r.code IN ('superadmin', 'admin')
ON CONFLICT (role_id, permission_task_id, action) DO NOTHING;

COMMIT;
