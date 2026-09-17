-- Migration: 20260917_menu_canonical_seed.sql
-- Description: Seed canonical Menu groups and hierarchical items for both VI and EN,
--              clean up obsolete legacy menu data, ensure schema defaults and RBAC task 91.

BEGIN;

SELECT pg_advisory_xact_lock(hashtextextended('cic:menu:canonical-seed', 0));

-- 1. Ensure Task 91 for Menu exists in cic_permission_tasks
INSERT INTO cic_permission_tasks (
  id, module, view, _task, trigger, description, ordering, published, list_field, list_function, is_contents
) OVERRIDING SYSTEM VALUE
SELECT 91, 'menu', 'Quản lý Menu', 'menu', null, 'Xem, thêm, sửa, xóa, sắp xếp và xuất bản menu điều hướng', 860, true, null, 'view,create,edit,delete,reorder,publish', false
WHERE NOT EXISTS (SELECT 1 FROM cic_permission_tasks WHERE module = 'menu');

-- 2. Ensure schema defaults & delete old menu data
ALTER TABLE cic_menus_items ALTER COLUMN is_rewrite SET DEFAULT true;
ALTER TABLE cic_menus_items_en ALTER COLUMN is_rewrite SET DEFAULT true;

DELETE FROM cic_menus_items;
DELETE FROM cic_menus_groups;
DELETE FROM cic_menus_items_en;
DELETE FROM cic_menus_groups_en;

-- 3. Seed VI Menu Groups
INSERT INTO cic_menus_groups (id, group_name, published, ordering) OVERRIDING SYSTEM VALUE VALUES
  (1, 'Menu Chính (Header Navigation)', true, 1),
  (2, 'Liên Kết Chân Trang (Footer Quick Links)', true, 2),
  (3, 'Giải Pháp Chân Trang (Footer Solutions)', true, 3),
  (4, 'Dịch Vụ Chân Trang (Footer Services)', true, 4);

-- 4. Seed VI Menu Items
-- Group 1: Header Navigation (VI)
INSERT INTO cic_menus_items (id, group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin, is_rewrite) OVERRIDING SYSTEM VALUE VALUES
  (1, 1, null, 'Trang chủ', '/', '_self', 1, 0, true, 'Home', true, true),
  (2, 1, null, 'Giới thiệu', '/gioi-thieu', '_self', 2, 0, true, 'Building2', true, true),
  (3, 1, 2, 'Giới thiệu chung', '/gioi-thieu', '_self', 1, 1, true, null, true, true),
  (4, 1, 2, 'Cơ cấu tổ chức', '/gioi-thieu/co-cau-to-chuc', '_self', 2, 1, true, null, true, true),
  (5, 1, 2, 'Năng lực & Kinh nghiệm', '/gioi-thieu/nang-luc-kinh-nghiem', '_self', 3, 1, true, null, true, true),
  (6, 1, 2, 'Hồ sơ năng lực CIC', 'https://www.cic.com.vn/flipbooks/index.html?pdf=CICProfile2024Final.pdf', '_blank', 4, 1, true, null, true, true),
  (7, 1, null, 'Sản phẩm', '/products', '_self', 3, 0, true, 'Package', true, true),
  (8, 1, null, 'Dịch vụ', '/services', '_self', 4, 0, true, 'Layers', true, true),
  (9, 1, 8, 'Tư vấn BIM', '/services/tu-van-bim', '_self', 1, 1, true, null, true, true),
  (10, 1, 8, 'Tư vấn xây dựng', '/services/tu-van-xay-dung', '_self', 2, 1, true, null, true, true),
  (11, 1, 8, 'Tư vấn dự án', '/services/tu-van-du-an', '_self', 3, 1, true, null, true, true),
  (12, 1, 8, 'Tư vấn giải pháp ngành thép', '/services/tu-van-giai-phap-nganh-thep', '_self', 4, 1, true, null, true, true),
  (13, 1, 8, 'Tư vấn lập đơn giá, chỉ số giá', '/services/tu-van-lap-don-gia-chi-so-gia', '_self', 5, 1, true, null, true, true),
  (14, 1, 8, 'Đánh giá sản lượng điện gió đạt chuẩn bankable', '/services/danh-gia-san-luong-dien-gio', '_self', 6, 1, true, null, true, true),
  (15, 1, 8, 'Web 360 tương tác thông minh', '/services/web-360-tuong-tac-thong-minh', '_self', 7, 1, true, null, true, true),
  (16, 1, 8, 'Tư vấn Kiểm kê Khí nhà kính', '/services/tu-van-kiem-ke-khi-nha-kinh', '_self', 8, 1, true, null, true, true),
  (17, 1, null, 'Dự án', '/projects', '_self', 5, 0, true, 'Briefcase', true, true),
  (18, 1, null, 'Tin tức', '/news', '_self', 6, 0, true, 'Newspaper', true, true),
  (19, 1, 18, 'Tin công ty', '/news?category=company', '_self', 1, 1, true, null, true, true),
  (20, 1, 18, 'Tin chuyên ngành', '/news?category=specialty', '_self', 2, 1, true, null, true, true),
  (21, 1, 18, 'Hợp tác quốc tế', '/news?category=international', '_self', 3, 1, true, null, true, true),
  (22, 1, 18, 'Tin tuyển dụng', '/news?category=recruitment', '_self', 4, 1, true, null, true, true),
  (23, 1, 18, 'Tin khuyến mại', '/news?category=promotion', '_self', 5, 1, true, null, true, true),
  (24, 1, 18, 'Quan hệ cổ đông', '/news?category=shareholder', '_self', 6, 1, true, null, true, true),
  (25, 1, null, 'Sự kiện', '/events', '_self', 7, 0, true, 'Calendar', true, true),
  (26, 1, null, 'Liên hệ', '/contact', '_self', 8, 0, true, 'PhoneCall', true, true),

  -- Group 2: Footer Quick Links (VI)
  (27, 2, null, 'Trang chủ', '/', '_self', 1, 0, true, null, true, true),
  (28, 2, null, 'Giải pháp', '/products', '_self', 2, 0, true, null, true, true),
  (29, 2, null, 'Dịch vụ', '/services', '_self', 3, 0, true, null, true, true),
  (30, 2, null, 'Dự án', '/projects', '_self', 4, 0, true, null, true, true),
  (31, 2, null, 'Sự kiện', '/events', '_self', 5, 0, true, null, true, true),
  (32, 2, null, 'Tin tức', '/news', '_self', 6, 0, true, null, true, true),
  (33, 2, null, 'Liên hệ', '/contact', '_self', 7, 0, true, null, true, true),

  -- Group 3: Footer Solutions (VI)
  (34, 3, null, 'AI & Công nghệ thông minh', '/products?category=ai', '_self', 1, 0, true, null, true, true),
  (35, 3, null, 'BIM, Digital Twins & CDE', '/products?category=bim', '_self', 2, 0, true, null, true, true),
  (36, 3, null, 'Phần mềm kỹ thuật', '/products?category=software', '_self', 3, 0, true, null, true, true),
  (37, 3, null, 'Thiết bị khoa học', '/products?category=hardware', '_self', 4, 0, true, null, true, true),
  (38, 3, null, 'Net Zero & Bền vững', '/products?category=net-zero', '_self', 5, 0, true, null, true, true),

  -- Group 4: Footer Services (VI)
  (39, 4, null, 'Tư vấn chuyển đổi số', '/services?category=digital-transformation', '_self', 1, 0, true, null, true, true),
  (40, 4, null, 'Đào tạo & Chuyển giao', '/services?category=training', '_self', 2, 0, true, null, true, true),
  (41, 4, null, 'Tư vấn phát triển bền vững', '/services?category=sustainability', '_self', 3, 0, true, null, true, true),
  (42, 4, null, 'Phát triển phần mềm', '/services?category=custom-dev', '_self', 4, 0, true, null, true, true);

-- Reset sequence for cic_menus_items
SELECT setval(pg_get_serial_sequence('cic_menus_items', 'id'), COALESCE(MAX(id), 1)) FROM cic_menus_items;
SELECT setval(pg_get_serial_sequence('cic_menus_groups', 'id'), COALESCE(MAX(id), 1)) FROM cic_menus_groups;

-- 5. Seed EN Menu Groups
INSERT INTO cic_menus_groups_en (id, group_name, published, ordering) OVERRIDING SYSTEM VALUE VALUES
  (1, 'Main Menu (Header Navigation)', true, 1),
  (2, 'Footer Quick Links', true, 2),
  (3, 'Footer Solutions', true, 3),
  (4, 'Footer Services', true, 4);

-- 6. Seed EN Menu Items
INSERT INTO cic_menus_items_en (id, group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin, is_rewrite) OVERRIDING SYSTEM VALUE VALUES
  (1, 1, null, 'Home', '/en', '_self', 1, 0, true, 'Home', true, true),
  (2, 1, null, 'About Us', '/en/about', '_self', 2, 0, true, 'Building2', true, true),
  (3, 1, 2, 'Overview', '/en/about', '_self', 1, 1, true, null, true, true),
  (4, 1, 2, 'Organization Structure', '/en/about?tab=structure', '_self', 2, 1, true, null, true, true),
  (5, 1, 2, 'Competence & Experience', '/en/about?tab=experience', '_self', 3, 1, true, null, true, true),
  (6, 1, null, 'Products', '/en/products', '_self', 3, 0, true, 'Package', true, true),
  (7, 1, null, 'Services', '/en/services', '_self', 4, 0, true, 'Layers', true, true),
  (8, 1, 7, 'BIM Consultancy', '/en/services/bim-consultancy', '_self', 1, 1, true, null, true, true),
  (9, 1, 7, 'Construction Consultancy', '/en/services/construction-consultancy', '_self', 2, 1, true, null, true, true),
  (10, 1, 7, 'Project Consultancy', '/en/services/project-consultancy', '_self', 3, 1, true, null, true, true),
  (11, 1, 7, 'Steel Industry Solutions', '/en/services/steel-industry-solutions', '_self', 4, 1, true, null, true, true),
  (12, 1, 7, '360 Web Services', '/en/services/360-web-services', '_self', 5, 1, true, null, true, true),
  (13, 1, 7, 'Greenhouse Gas Inventory', '/en/services/greenhouse-gas-inventory', '_self', 6, 1, true, null, true, true),
  (14, 1, null, 'Projects', '/en/projects', '_self', 5, 0, true, 'Briefcase', true, true),
  (15, 1, null, 'News', '/en/news', '_self', 6, 0, true, 'Newspaper', true, true),
  (16, 1, 15, 'Company News', '/en/news?category=company', '_self', 1, 1, true, null, true, true),
  (17, 1, 15, 'Specialized News', '/en/news?category=specialty', '_self', 2, 1, true, null, true, true),
  (18, 1, 15, 'International Cooperation', '/en/news?category=international', '_self', 3, 1, true, null, true, true),
  (19, 1, 15, 'Recruitment', '/en/news?category=recruitment', '_self', 4, 1, true, null, true, true),
  (20, 1, null, 'Events', '/en/events', '_self', 7, 0, true, 'Calendar', true, true),
  (21, 1, null, 'Contact', '/en/contact', '_self', 8, 0, true, 'PhoneCall', true, true),

  -- Group 2 EN: Footer Quick Links
  (22, 2, null, 'Home', '/en', '_self', 1, 0, true, null, true, true),
  (23, 2, null, 'Solutions', '/en/products', '_self', 2, 0, true, null, true, true),
  (24, 2, null, 'Services', '/en/services', '_self', 3, 0, true, null, true, true),
  (25, 2, null, 'Projects', '/en/projects', '_self', 4, 0, true, null, true, true),
  (26, 2, null, 'Events', '/en/events', '_self', 5, 0, true, null, true, true),
  (27, 2, null, 'News', '/en/news', '_self', 6, 0, true, null, true, true),
  (28, 2, null, 'Contact', '/en/contact', '_self', 7, 0, true, null, true, true),

  -- Group 3 EN: Footer Solutions
  (29, 3, null, 'AI & Smart Tech', '/en/products?category=ai', '_self', 1, 0, true, null, true, true),
  (30, 3, null, 'BIM & Digital Twins', '/en/products?category=bim', '_self', 2, 0, true, null, true, true),
  (31, 3, null, 'Engineering Software', '/en/products?category=software', '_self', 3, 0, true, null, true, true),
  (32, 3, null, 'Scientific Equipment', '/en/products?category=hardware', '_self', 4, 0, true, null, true, true),
  (33, 3, null, 'Net Zero & Sustainability', '/en/products?category=net-zero', '_self', 5, 0, true, null, true, true),

  -- Group 4 EN: Footer Services
  (34, 4, null, 'Digital Transformation', '/en/services?category=digital-transformation', '_self', 1, 0, true, null, true, true),
  (35, 4, null, 'Training & Tech Transfer', '/en/services?category=training', '_self', 2, 0, true, null, true, true),
  (36, 4, null, 'Sustainability Consulting', '/en/services?category=sustainability', '_self', 3, 0, true, null, true, true),
  (37, 4, null, 'Custom Software Dev', '/en/services?category=custom-dev', '_self', 4, 0, true, null, true, true);

-- Reset sequence for cic_menus_items_en
SELECT setval(pg_get_serial_sequence('cic_menus_items_en', 'id'), COALESCE(MAX(id), 1)) FROM cic_menus_items_en;
SELECT setval(pg_get_serial_sequence('cic_menus_groups_en', 'id'), COALESCE(MAX(id), 1)) FROM cic_menus_groups_en;

COMMIT;
