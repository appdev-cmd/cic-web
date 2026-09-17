import { config } from 'dotenv';
import postgres from 'postgres';

// Load .env.local if present
config({ path: '.env.local', override: true, quiet: true });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('ERROR: DATABASE_URL environment variable is required.');
  process.exit(1);
}

const sql = postgres(databaseUrl, { max: 1, prepare: false });

async function seedCanonicalMenu() {
  try {
    console.log('--- 1. Seed Permission Task for Menu (Task 91) ---');
    const existingTask = await sql`SELECT id FROM cic_permission_tasks WHERE module = 'menu' LIMIT 1`;
    if (existingTask.length === 0) {
      await sql`
        INSERT INTO cic_permission_tasks (
          id, module, view, _task, trigger, description, ordering, published, list_field, list_function, is_contents
        ) OVERRIDING SYSTEM VALUE VALUES (
          91, 'menu', 'Quản lý Menu', 'menu', null, 'Xem, thêm, sửa, xóa, sắp xếp và xuất bản menu điều hướng', 860, true, null, 'view,create,edit,delete,reorder,publish', false
        )
      `;
      console.log('Task 91 inserted successfully.');
    } else {
      console.log('Task 91 already exists with id:', existingTask[0].id);
    }

    console.log('--- 2. Ensure schema defaults & clean obsolete menu data ---');
    await sql`ALTER TABLE cic_menus_items ALTER COLUMN is_rewrite SET DEFAULT true`;
    await sql`ALTER TABLE cic_menus_items_en ALTER COLUMN is_rewrite SET DEFAULT true`;
    await sql`DELETE FROM cic_menus_items`;
    await sql`DELETE FROM cic_menus_groups`;
    await sql`DELETE FROM cic_menus_items_en`;
    await sql`DELETE FROM cic_menus_groups_en`;
    console.log('Old menu tables cleared.');

    console.log('--- 3. Seed VI Menu Groups ---');
    const [g1VI] = await sql`
      INSERT INTO cic_menus_groups (group_name, published, ordering)
      VALUES ('Menu Chính (Header Navigation)', true, 1)
      RETURNING id
    `;
    const [g2VI] = await sql`
      INSERT INTO cic_menus_groups (group_name, published, ordering)
      VALUES ('Liên Kết Chân Trang (Footer Quick Links)', true, 2)
      RETURNING id
    `;
    const [g3VI] = await sql`
      INSERT INTO cic_menus_groups (group_name, published, ordering)
      VALUES ('Giải Pháp Chân Trang (Footer Solutions)', true, 3)
      RETURNING id
    `;
    const [g4VI] = await sql`
      INSERT INTO cic_menus_groups (group_name, published, ordering)
      VALUES ('Dịch Vụ Chân Trang (Footer Services)', true, 4)
      RETURNING id
    `;

    console.log('--- 4. Seed VI Menu Items ---');
    // Group 1: Header Navigation (VI)
    await sql`
      INSERT INTO cic_menus_items (group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin)
      VALUES (${g1VI.id}, null, 'Trang chủ', '/', '_self', 1, 0, true, 'Home', true)
    `;

    const [aboutVI] = await sql`
      INSERT INTO cic_menus_items (group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin)
      VALUES (${g1VI.id}, null, 'Giới thiệu', '/gioi-thieu', '_self', 2, 0, true, 'Building2', true)
      RETURNING id
    `;
    await sql`
      INSERT INTO cic_menus_items (group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin)
      VALUES
        (${g1VI.id}, ${aboutVI.id}, 'Giới thiệu chung', '/gioi-thieu', '_self', 1, 1, true, null, true),
        (${g1VI.id}, ${aboutVI.id}, 'Cơ cấu tổ chức', '/gioi-thieu/co-cau-to-chuc', '_self', 2, 1, true, null, true),
        (${g1VI.id}, ${aboutVI.id}, 'Năng lực & Kinh nghiệm', '/gioi-thieu/nang-luc-kinh-nghiem', '_self', 3, 1, true, null, true),
        (${g1VI.id}, ${aboutVI.id}, 'Hồ sơ năng lực CIC', 'https://www.cic.com.vn/flipbooks/index.html?pdf=CICProfile2024Final.pdf', '_blank', 4, 1, true, null, true)
    `;

    await sql`
      INSERT INTO cic_menus_items (group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin)
      VALUES (${g1VI.id}, null, 'Sản phẩm', '/products', '_self', 3, 0, true, 'Package', true)
    `;

    const [servVI] = await sql`
      INSERT INTO cic_menus_items (group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin)
      VALUES (${g1VI.id}, null, 'Dịch vụ', '/services', '_self', 4, 0, true, 'Layers', true)
      RETURNING id
    `;
    await sql`
      INSERT INTO cic_menus_items (group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin)
      VALUES
        (${g1VI.id}, ${servVI.id}, 'Tư vấn BIM', '/services/tu-van-bim', '_self', 1, 1, true, null, true),
        (${g1VI.id}, ${servVI.id}, 'Tư vấn xây dựng', '/services/tu-van-xay-dung', '_self', 2, 1, true, null, true),
        (${g1VI.id}, ${servVI.id}, 'Tư vấn dự án', '/services/tu-van-du-an', '_self', 3, 1, true, null, true),
        (${g1VI.id}, ${servVI.id}, 'Tư vấn giải pháp ngành thép', '/services/tu-van-giai-phap-nganh-thep', '_self', 4, 1, true, null, true),
        (${g1VI.id}, ${servVI.id}, 'Tư vấn lập đơn giá, chỉ số giá', '/services/tu-van-lap-don-gia-chi-so-gia', '_self', 5, 1, true, null, true),
        (${g1VI.id}, ${servVI.id}, 'Đánh giá sản lượng điện gió đạt chuẩn bankable', '/services/danh-gia-san-luong-dien-gio', '_self', 6, 1, true, null, true),
        (${g1VI.id}, ${servVI.id}, 'Web 360 tương tác thông minh', '/services/web-360-tuong-tac-thong-minh', '_self', 7, 1, true, null, true),
        (${g1VI.id}, ${servVI.id}, 'Tư vấn Kiểm kê Khí nhà kính', '/services/tu-van-kiem-ke-khi-nha-kinh', '_self', 8, 1, true, null, true)
    `;

    await sql`
      INSERT INTO cic_menus_items (group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin)
      VALUES (${g1VI.id}, null, 'Dự án', '/projects', '_self', 5, 0, true, 'Briefcase', true)
    `;

    const [newsVI] = await sql`
      INSERT INTO cic_menus_items (group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin)
      VALUES (${g1VI.id}, null, 'Tin tức', '/news', '_self', 6, 0, true, 'Newspaper', true)
      RETURNING id
    `;
    await sql`
      INSERT INTO cic_menus_items (group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin)
      VALUES
        (${g1VI.id}, ${newsVI.id}, 'Tin công ty', '/news?category=company', '_self', 1, 1, true, null, true),
        (${g1VI.id}, ${newsVI.id}, 'Tin chuyên ngành', '/news?category=specialty', '_self', 2, 1, true, null, true),
        (${g1VI.id}, ${newsVI.id}, 'Hợp tác quốc tế', '/news?category=international', '_self', 3, 1, true, null, true),
        (${g1VI.id}, ${newsVI.id}, 'Tin tuyển dụng', '/news?category=recruitment', '_self', 4, 1, true, null, true),
        (${g1VI.id}, ${newsVI.id}, 'Tin khuyến mại', '/news?category=promotion', '_self', 5, 1, true, null, true),
        (${g1VI.id}, ${newsVI.id}, 'Quan hệ cổ đông', '/news?category=shareholder', '_self', 6, 1, true, null, true)
    `;

    await sql`
      INSERT INTO cic_menus_items (group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin)
      VALUES (${g1VI.id}, null, 'Sự kiện', '/events', '_self', 7, 0, true, 'Calendar', true)
    `;

    await sql`
      INSERT INTO cic_menus_items (group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin)
      VALUES (${g1VI.id}, null, 'Liên hệ', '/contact', '_self', 8, 0, true, 'PhoneCall', true)
    `;

    // Group 2: Footer Quick Links (VI)
    await sql`
      INSERT INTO cic_menus_items (group_id, parent_id, name, link, target, ordering, level, published, show_admin)
      VALUES
        (${g2VI.id}, null, 'Trang chủ', '/', '_self', 1, 0, true, true),
        (${g2VI.id}, null, 'Giải pháp', '/products', '_self', 2, 0, true, true),
        (${g2VI.id}, null, 'Dịch vụ', '/services', '_self', 3, 0, true, true),
        (${g2VI.id}, null, 'Dự án', '/projects', '_self', 4, 0, true, true),
        (${g2VI.id}, null, 'Sự kiện', '/events', '_self', 5, 0, true, true),
        (${g2VI.id}, null, 'Tin tức', '/news', '_self', 6, 0, true, true),
        (${g2VI.id}, null, 'Liên hệ', '/contact', '_self', 7, 0, true, true)
    `;

    // Group 3: Footer Solutions (VI)
    await sql`
      INSERT INTO cic_menus_items (group_id, parent_id, name, link, target, ordering, level, published, show_admin)
      VALUES
        (${g3VI.id}, null, 'AI & Công nghệ thông minh', '/products?category=ai', '_self', 1, 0, true, true),
        (${g3VI.id}, null, 'BIM, Digital Twins & CDE', '/products?category=bim', '_self', 2, 0, true, true),
        (${g3VI.id}, null, 'Phần mềm kỹ thuật', '/products?category=software', '_self', 3, 0, true, true),
        (${g3VI.id}, null, 'Thiết bị khoa học', '/products?category=hardware', '_self', 4, 0, true, true),
        (${g3VI.id}, null, 'Net Zero & Bền vững', '/products?category=net-zero', '_self', 5, 0, true, true)
    `;

    // Group 4: Footer Services (VI)
    await sql`
      INSERT INTO cic_menus_items (group_id, parent_id, name, link, target, ordering, level, published, show_admin)
      VALUES
        (${g4VI.id}, null, 'Tư vấn chuyển đổi số', '/services?category=digital-transformation', '_self', 1, 0, true, true),
        (${g4VI.id}, null, 'Đào tạo & Chuyển giao', '/services?category=training', '_self', 2, 0, true, true),
        (${g4VI.id}, null, 'Tư vấn phát triển bền vững', '/services?category=sustainability', '_self', 3, 0, true, true),
        (${g4VI.id}, null, 'Phát triển phần mềm', '/services?category=custom-dev', '_self', 4, 0, true, true)
    `;
    console.log('VI Menu items seeded.');

    console.log('--- 5. Seed EN Menu Groups ---');
    const [g1EN] = await sql`
      INSERT INTO cic_menus_groups_en (group_name, published, ordering)
      VALUES ('Main Menu (Header Navigation)', true, 1)
      RETURNING id
    `;
    const [g2EN] = await sql`
      INSERT INTO cic_menus_groups_en (group_name, published, ordering)
      VALUES ('Footer Quick Links', true, 2)
      RETURNING id
    `;
    const [g3EN] = await sql`
      INSERT INTO cic_menus_groups_en (group_name, published, ordering)
      VALUES ('Footer Solutions', true, 3)
      RETURNING id
    `;
    const [g4EN] = await sql`
      INSERT INTO cic_menus_groups_en (group_name, published, ordering)
      VALUES ('Footer Services', true, 4)
      RETURNING id
    `;

    console.log('--- 6. Seed EN Menu Items ---');
    // Group 1 EN: Header
    await sql`
      INSERT INTO cic_menus_items_en (group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin)
      VALUES (${g1EN.id}, null, 'Home', '/en', '_self', 1, 0, true, 'Home', true)
    `;
    const [aboutEN] = await sql`
      INSERT INTO cic_menus_items_en (group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin)
      VALUES (${g1EN.id}, null, 'About Us', '/en/about', '_self', 2, 0, true, 'Building2', true)
      RETURNING id
    `;
    await sql`
      INSERT INTO cic_menus_items_en (group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin)
      VALUES
        (${g1EN.id}, ${aboutEN.id}, 'Overview', '/en/about', '_self', 1, 1, true, null, true),
        (${g1EN.id}, ${aboutEN.id}, 'Organization Structure', '/en/about?tab=structure', '_self', 2, 1, true, null, true),
        (${g1EN.id}, ${aboutEN.id}, 'Competence & Experience', '/en/about?tab=experience', '_self', 3, 1, true, null, true)
    `;

    await sql`
      INSERT INTO cic_menus_items_en (group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin)
      VALUES (${g1EN.id}, null, 'Products', '/en/products', '_self', 3, 0, true, 'Package', true)
    `;

    const [servEN] = await sql`
      INSERT INTO cic_menus_items_en (group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin)
      VALUES (${g1EN.id}, null, 'Services', '/en/services', '_self', 4, 0, true, 'Layers', true)
      RETURNING id
    `;
    await sql`
      INSERT INTO cic_menus_items_en (group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin)
      VALUES
        (${g1EN.id}, ${servEN.id}, 'BIM Consultancy', '/en/services/bim-consultancy', '_self', 1, 1, true, null, true),
        (${g1EN.id}, ${servEN.id}, 'Construction Consultancy', '/en/services/construction-consultancy', '_self', 2, 1, true, null, true),
        (${g1EN.id}, ${servEN.id}, 'Project Consultancy', '/en/services/project-consultancy', '_self', 3, 1, true, null, true),
        (${g1EN.id}, ${servEN.id}, 'Steel Industry Solutions', '/en/services/steel-industry-solutions', '_self', 4, 1, true, null, true),
        (${g1EN.id}, ${servEN.id}, '360 Web Services', '/en/services/360-web-services', '_self', 5, 1, true, null, true),
        (${g1EN.id}, ${servEN.id}, 'Greenhouse Gas Inventory', '/en/services/greenhouse-gas-inventory', '_self', 6, 1, true, null, true)
    `;

    await sql`
      INSERT INTO cic_menus_items_en (group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin)
      VALUES (${g1EN.id}, null, 'Projects', '/en/projects', '_self', 5, 0, true, 'Briefcase', true)
    `;

    const [newsEN] = await sql`
      INSERT INTO cic_menus_items_en (group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin)
      VALUES (${g1EN.id}, null, 'News', '/en/news', '_self', 6, 0, true, 'Newspaper', true)
      RETURNING id
    `;
    await sql`
      INSERT INTO cic_menus_items_en (group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin)
      VALUES
        (${g1EN.id}, ${newsEN.id}, 'Company News', '/en/news?category=company', '_self', 1, 1, true, null, true),
        (${g1EN.id}, ${newsEN.id}, 'Specialized News', '/en/news?category=specialty', '_self', 2, 1, true, null, true),
        (${g1EN.id}, ${newsEN.id}, 'International Cooperation', '/en/news?category=international', '_self', 3, 1, true, null, true),
        (${g1EN.id}, ${newsEN.id}, 'Recruitment', '/en/news?category=recruitment', '_self', 4, 1, true, null, true)
    `;

    await sql`
      INSERT INTO cic_menus_items_en (group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin)
      VALUES (${g1EN.id}, null, 'Events', '/en/events', '_self', 7, 0, true, 'Calendar', true)
    `;

    await sql`
      INSERT INTO cic_menus_items_en (group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin)
      VALUES (${g1EN.id}, null, 'Contact', '/en/contact', '_self', 8, 0, true, 'PhoneCall', true)
    `;

    // Group 2 EN: Footer Quick Links
    await sql`
      INSERT INTO cic_menus_items_en (group_id, parent_id, name, link, target, ordering, level, published, show_admin)
      VALUES
        (${g2EN.id}, null, 'Home', '/en', '_self', 1, 0, true, true),
        (${g2EN.id}, null, 'Solutions', '/en/products', '_self', 2, 0, true, true),
        (${g2EN.id}, null, 'Services', '/en/services', '_self', 3, 0, true, true),
        (${g2EN.id}, null, 'Projects', '/en/projects', '_self', 4, 0, true, true),
        (${g2EN.id}, null, 'Events', '/en/events', '_self', 5, 0, true, true),
        (${g2EN.id}, null, 'News', '/en/news', '_self', 6, 0, true, true),
        (${g2EN.id}, null, 'Contact', '/en/contact', '_self', 7, 0, true, true)
    `;

    // Group 3 EN: Footer Solutions
    await sql`
      INSERT INTO cic_menus_items_en (group_id, parent_id, name, link, target, ordering, level, published, show_admin)
      VALUES
        (${g3EN.id}, null, 'AI & Smart Tech', '/en/products?category=ai', '_self', 1, 0, true, true),
        (${g3EN.id}, null, 'BIM & Digital Twins', '/en/products?category=bim', '_self', 2, 0, true, true),
        (${g3EN.id}, null, 'Engineering Software', '/en/products?category=software', '_self', 3, 0, true, true),
        (${g3EN.id}, null, 'Scientific Equipment', '/en/products?category=hardware', '_self', 4, 0, true, true),
        (${g3EN.id}, null, 'Net Zero & Sustainability', '/en/products?category=net-zero', '_self', 5, 0, true, true)
    `;

    // Group 4 EN: Footer Services
    await sql`
      INSERT INTO cic_menus_items_en (group_id, parent_id, name, link, target, ordering, level, published, show_admin)
      VALUES
        (${g4EN.id}, null, 'Digital Transformation', '/en/services?category=digital-transformation', '_self', 1, 0, true, true),
        (${g4EN.id}, null, 'Training & Tech Transfer', '/en/services?category=training', '_self', 2, 0, true, true),
        (${g4EN.id}, null, 'Sustainability Consulting', '/en/services?category=sustainability', '_self', 3, 0, true, true),
        (${g4EN.id}, null, 'Custom Software Dev', '/en/services?category=custom-dev', '_self', 4, 0, true, true)
    `;
    console.log('EN Menu items seeded.');

    // Count verification
    const countVI = await sql`SELECT count(*)::int as count FROM cic_menus_items`;
    const countEN = await sql`SELECT count(*)::int as count FROM cic_menus_items_en`;
    console.log(`\nVerification successful: VI items = ${countVI[0].count}, EN items = ${countEN[0].count}`);
    console.log('=== CANONICAL MENU SEED COMPLETED SUCCESSFULLY ===');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 2 });
  }
}

seedCanonicalMenu();
