import { config } from 'dotenv';
import postgres from 'postgres';

config({ path: '.env.local', override: true, quiet: true });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('ERROR: DATABASE_URL environment variable is required.');
  process.exit(1);
}

const sql = postgres(databaseUrl, { max: 1, prepare: false });

export const CANONICAL_CMS_TASKS = [
  // 1. TỔNG QUAN
  {
    id: 101,
    groupId: 'grp_tong_quan',
    groupTitle: 'TỔNG QUAN',
    menuId: 'menu_dashboard',
    title: 'Tổng quan',
    iconName: 'LayoutDashboard',
    module: 'dashboard',
    _task: 'dashboard',
    description: 'Xem bảng thống kê tổng quan và chỉ số hoạt động của toàn bộ hệ thống',
    ordering: 100,
    list_function: 'view',
  },

  // 2. NỘI DUNG
  {
    id: 102,
    groupId: 'grp_noi_dung',
    groupTitle: 'NỘI DUNG',
    menuId: 'menu_news',
    title: 'Tin tức',
    iconName: 'Newspaper',
    module: 'news',
    _task: 'news',
    description: 'Xem, soạn thảo, chỉnh sửa, xuất bản và xóa bài viết tin tức',
    ordering: 200,
    list_function: 'view,create,edit,publish,delete',
  },
  {
    id: 103,
    groupId: 'grp_noi_dung',
    groupTitle: 'NỘI DUNG',
    menuId: 'menu_news_categories',
    title: 'Danh mục tin tức',
    iconName: 'FolderTree',
    module: 'news',
    _task: 'news_categories',
    description: 'Xem, tạo mới, chỉnh sửa và quản lý cây chuyên mục tin tức',
    ordering: 210,
    list_function: 'view,create,edit,delete',
  },
  {
    id: 104,
    groupId: 'grp_noi_dung',
    groupTitle: 'NỘI DUNG',
    menuId: 'menu_static_pages',
    title: 'Trang nội dung',
    iconName: 'FileText',
    module: 'static_pages',
    _task: 'static_pages',
    description: 'Xem, tạo mới, biên tập nội dung, xem trước và xuất bản trang tĩnh/chính sách',
    ordering: 220,
    list_function: 'view,create,edit,publish,delete',
  },
  {
    id: 105,
    groupId: 'grp_noi_dung',
    groupTitle: 'NỘI DUNG',
    menuId: 'menu_events',
    title: 'Sự kiện',
    iconName: 'CalendarEvent',
    module: 'events',
    _task: 'events',
    description: 'Xem, đăng tải, quản lý lịch trình và xuất bản các sự kiện, hội thảo',
    ordering: 230,
    list_function: 'view,create,edit,publish,delete',
  },
  {
    id: 106,
    groupId: 'grp_noi_dung',
    groupTitle: 'NỘI DUNG',
    menuId: 'menu_projects',
    title: 'Dự án',
    iconName: 'Building2',
    module: 'projects',
    _task: 'projects',
    description: 'Xem, thêm mới, cập nhật tiến độ và xuất bản các dự án tiêu biểu',
    ordering: 240,
    list_function: 'view,create,edit,publish,delete',
  },
  {
    id: 107,
    groupId: 'grp_noi_dung',
    groupTitle: 'NỘI DUNG',
    menuId: 'menu_services',
    title: 'Dịch vụ',
    iconName: 'Layers',
    module: 'services',
    _task: 'services',
    description: 'Xem, biên tập thông tin và xuất bản các gói dịch vụ kỹ thuật',
    ordering: 250,
    list_function: 'view,create,edit,publish,delete',
  },

  // 3. SẢN PHẨM
  {
    id: 108,
    groupId: 'grp_san_pham',
    groupTitle: 'SẢN PHẨM',
    menuId: 'menu_products_group',
    title: 'Sản phẩm',
    iconName: 'Package',
    module: 'products',
    _task: 'products',
    description: 'Xem danh sách, thêm mới, biên tập chi tiết, xuất bản, xóa và xuất dữ liệu sản phẩm phần mềm',
    ordering: 300,
    list_function: 'view,create,edit,publish,delete,export',
  },
  {
    id: 109,
    groupId: 'grp_san_pham',
    groupTitle: 'SẢN PHẨM',
    menuId: 'menu_product_categories',
    title: 'Danh mục sản phẩm',
    iconName: 'FolderTree',
    module: 'product_settings',
    _task: 'product_categories',
    description: 'Quản lý phân loại cây danh mục ngành hàng sản phẩm',
    ordering: 310,
    list_function: 'view,create,edit,delete',
  },
  {
    id: 110,
    groupId: 'grp_san_pham',
    groupTitle: 'SẢN PHẨM',
    menuId: 'menu_product_brands',
    title: 'Hãng sản xuất',
    iconName: 'Building2',
    module: 'product_settings',
    _task: 'product_brands',
    description: 'Quản lý thương hiệu, đối tác và các hãng sản xuất phần mềm',
    ordering: 320,
    list_function: 'view,create,edit,delete',
  },
  {
    id: 111,
    groupId: 'grp_san_pham',
    groupTitle: 'SẢN PHẨM',
    menuId: 'menu_product_applications',
    title: 'Lĩnh vực ứng dụng',
    iconName: 'Cpu',
    module: 'product_settings',
    _task: 'product_applications',
    description: 'Quản lý các lĩnh vực công nghệ và ứng dụng chuyên ngành',
    ordering: 330,
    list_function: 'view,create,edit,delete',
  },
  {
    id: 112,
    groupId: 'grp_san_pham',
    groupTitle: 'SẢN PHẨM',
    menuId: 'menu_product_types',
    title: 'Loại sản phẩm',
    iconName: 'Layers',
    module: 'product_settings',
    _task: 'product_types',
    description: 'Quản lý hình thức và loại hình bản quyền/sản phẩm',
    ordering: 340,
    list_function: 'view,create,edit,delete',
  },
  {
    id: 113,
    groupId: 'grp_san_pham',
    groupTitle: 'SẢN PHẨM',
    menuId: 'menu_product_sales_staff',
    title: 'Người phụ trách kinh doanh',
    iconName: 'UserCheck',
    module: 'product_settings',
    _task: 'sales_staff',
    description: 'Phân công và chỉ định nhân viên kinh doanh phụ trách dòng sản phẩm',
    ordering: 350,
    list_function: 'view,create,edit,delete',
  },

  // 4. WEBSITE
  {
    id: 114,
    groupId: 'grp_website',
    groupTitle: 'WEBSITE',
    menuId: 'menu_navigation',
    title: 'Menu',
    iconName: 'Menu',
    module: 'menu',
    _task: 'menu',
    description: 'Quản lý cây điều hướng Header và các cột Footer đa cấp đa ngôn ngữ',
    ordering: 400,
    list_function: 'view,create,edit,delete,publish',
  },
  {
    id: 115,
    groupId: 'grp_website',
    groupTitle: 'WEBSITE',
    menuId: 'menu_media_library',
    title: 'Thư viện media',
    iconName: 'FolderImage',
    module: 'media',
    _task: 'media',
    description: 'Tải lên, biên tập, quản lý album hình ảnh và tài nguyên tệp',
    ordering: 410,
    list_function: 'view,create,edit,delete',
  },

  // 5. TƯƠNG TÁC KHÁCH HÀNG
  {
    id: 116,
    groupId: 'grp_tuong_tac_khach_hang',
    groupTitle: 'TƯƠNG TÁC KHÁCH HÀNG',
    menuId: 'menu_cta',
    title: 'CTA',
    iconName: 'MousePointer2',
    module: 'cta',
    _task: 'cta',
    description: 'Quản lý các nút kêu gọi hành động, banner pop-up và điều hướng chuyển đổi',
    ordering: 500,
    list_function: 'view,create,edit,delete',
  },
  {
    id: 117,
    groupId: 'grp_tuong_tac_khach_hang',
    groupTitle: 'TƯƠNG TÁC KHÁCH HÀNG',
    menuId: 'menu_forms',
    title: 'Biểu mẫu',
    iconName: 'FileCheck2',
    module: 'forms',
    _task: 'forms',
    description: 'Thiết kế biểu mẫu khảo sát/thu thập thông tin và xuất dữ liệu phản hồi',
    ordering: 510,
    list_function: 'view,create,edit,delete,export',
  },
  {
    id: 118,
    groupId: 'grp_tuong_tac_khach_hang',
    groupTitle: 'TƯƠNG TÁC KHÁCH HÀNG',
    menuId: 'menu_customer_requests',
    title: 'Yêu cầu khách hàng',
    iconName: 'MessageSquareText',
    module: 'customer_requests',
    _task: 'customer_requests',
    description: 'Xem, phân loại, gán xử lý và theo dõi các yêu cầu liên hệ/báo giá từ khách hàng',
    ordering: 520,
    list_function: 'view,edit,delete,export',
  },
  {
    id: 119,
    groupId: 'grp_tuong_tac_khach_hang',
    groupTitle: 'TƯƠNG TÁC KHÁCH HÀNG',
    menuId: 'menu_email_templates',
    title: 'Mẫu email',
    iconName: 'MailCheck',
    module: 'email_templates',
    _task: 'email_templates',
    description: 'Soạn thảo và cấu hình các mẫu email thông báo/phản hồi tự động',
    ordering: 530,
    list_function: 'view,create,edit,delete,publish',
  },

  // 6. QUẢN TRỊ HỆ THỐNG
  {
    id: 120,
    groupId: 'grp_quan_tri_he_thong',
    groupTitle: 'QUẢN TRỊ HỆ THỐNG',
    menuId: 'menu_users',
    title: 'Người dùng',
    iconName: 'UserCheck',
    module: 'users',
    _task: 'users',
    description: 'Quản lý danh sách tài khoản, thông tin nhân sự và trạng thái truy cập CMS',
    ordering: 600,
    list_function: 'view,create,edit,delete',
  },
  {
    id: 121,
    groupId: 'grp_quan_tri_he_thong',
    groupTitle: 'QUẢN TRỊ HỆ THỐNG',
    menuId: 'menu_permissions',
    title: 'Vai trò & quyền',
    iconName: 'ShieldAlert',
    module: 'roles',
    _task: 'roles',
    description: 'Thiết lập các vai trò và cấu hình ma trận phân quyền chi tiết cho nhân sự',
    ordering: 610,
    list_function: 'view,create,edit,delete',
  },
  {
    id: 122,
    groupId: 'grp_quan_tri_he_thong',
    groupTitle: 'QUẢN TRỊ HỆ THỐNG',
    menuId: 'menu_system_settings',
    title: 'Cấu hình hệ thống',
    iconName: 'Settings',
    module: 'settings',
    _task: 'settings',
    description: 'Xem và thay đổi các tham số cấu hình chung, thông tin doanh nghiệp và SMTP',
    ordering: 620,
    list_function: 'view,edit,configure',
  },
  {
    id: 123,
    groupId: 'grp_quan_tri_he_thong',
    groupTitle: 'QUẢN TRỊ HỆ THỐNG',
    menuId: 'menu_function_seo',
    title: 'SEO & URL',
    iconName: 'Search',
    module: 'function_seo',
    _task: 'function_seo',
    description: 'Tối ưu hóa thẻ meta, từ khóa SEO và định tuyến đường dẫn tĩnh',
    ordering: 630,
    list_function: 'view,edit,configure',
  },
  {
    id: 124,
    groupId: 'grp_quan_tri_he_thong',
    groupTitle: 'QUẢN TRỊ HỆ THỐNG',
    menuId: 'menu_translation_strings',
    title: 'Ngôn ngữ giao diện',
    iconName: 'Sparkles',
    module: 'localization',
    _task: 'localization',
    description: 'Dịch thuật và tùy biến các chuỗi văn bản giao diện website đa ngôn ngữ',
    ordering: 640,
    list_function: 'view,edit',
  },
  {
    id: 125,
    groupId: 'grp_quan_tri_he_thong',
    groupTitle: 'QUẢN TRỊ HỆ THỐNG',
    menuId: 'menu_activity_logs',
    title: 'Nhật ký hoạt động',
    iconName: 'History',
    module: 'audit',
    _task: 'activity_logs',
    description: 'Truy vết toàn bộ nhật ký thao tác và xuất báo cáo kiểm toán bảo mật',
    ordering: 650,
    list_function: 'view,export',
  },
  {
    id: 126,
    groupId: 'grp_quan_tri_he_thong',
    groupTitle: 'QUẢN TRỊ HỆ THỐNG',
    menuId: 'menu_trash',
    title: 'Thùng rác',
    iconName: 'RotateCcw',
    module: 'trash',
    _task: 'trash',
    description: 'Xem, khôi phục hoặc xóa vĩnh viễn các bản ghi đã xóa tạm thời trong hệ thống',
    ordering: 660,
    list_function: 'view,edit,delete',
  },
];

async function seedCanonicalPermissions() {
  try {
    console.log('--- 1. Set old/legacy/empty tasks to published=false ---');
    await sql`
      UPDATE cic_permission_tasks 
      SET published = false 
      WHERE id < 100
    `;
    console.log('Legacy tasks marked published=false.');

    console.log('--- 2. Upsert 26 Canonical CMS Menu Tasks ---');
    for (const task of CANONICAL_CMS_TASKS) {
      await sql`
        INSERT INTO cic_permission_tasks (
          id, module, view, _task, trigger, description, ordering, published, list_field, list_function, is_contents
        ) OVERRIDING SYSTEM VALUE VALUES (
          ${task.id}, ${task.module}, ${task.title}, ${task._task}, null, ${task.description}, ${task.ordering}, true, null, ${task.list_function}, false
        )
        ON CONFLICT (id) DO UPDATE SET
          module = EXCLUDED.module,
          view = EXCLUDED.view,
          _task = EXCLUDED._task,
          description = EXCLUDED.description,
          ordering = EXCLUDED.ordering,
          published = true,
          list_function = EXCLUDED.list_function
      `;
    }
    console.log(`Successfully upserted ${CANONICAL_CMS_TASKS.length} canonical tasks.`);

    console.log('--- 3. Seed Default Permissions for Roles ---');
    const [adminUser] = await sql`SELECT id FROM cic_users WHERE account_status='active' ORDER BY id LIMIT 1`;
    const adminUserId = adminUser ? adminUser.id : null;
    await sql`
      INSERT INTO cic_role_permissions (role_id, permission_task_id, action, allowed, updated_by)
      SELECT r.id, t.id, a.action, true, ${adminUserId}
      FROM cic_roles r
      CROSS JOIN (SELECT id FROM cic_permission_tasks WHERE id >= 101 AND id <= 126) t
      CROSS JOIN (VALUES ('view'), ('create'), ('edit'), ('publish'), ('delete'), ('export'), ('configure')) AS a(action)
      WHERE r.code IN ('superadmin', 'admin')
      ON CONFLICT (role_id, permission_task_id, action) DO NOTHING
    `;
    console.log('Granted default role permissions for admin roles.');

    console.log('--- VERIFICATION ---');
    const activeTasks = await sql`SELECT id, view, module, _task, ordering FROM cic_permission_tasks WHERE published=true ORDER BY ordering`;
    console.log(`Total active tasks in DB: ${activeTasks.length}`);
    activeTasks.forEach(t => console.log(`  [${t.id}] ${t.view} (${t.module} / ${t._task})`));

    console.log('\n--- SEED COMPLETED SUCCESSFULLY! ---');
  } catch (err) {
    console.error('SEED FAILED:', err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

seedCanonicalPermissions();
