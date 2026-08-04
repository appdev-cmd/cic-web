import { StaticPageCategory, StaticPage } from './types';

export const staticPageCategoriesMock: StaticPageCategory[] = [
  {
    id: 'cat_gioi_thieu',
    name: 'Giới thiệu công ty',
    slug: 'gioi-thieu',
    description: 'Trang giới thiệu lịch sử, tầm nhìn, cơ cấu tổ chức và năng lực công ty',
    count: 3,
  },
  {
    id: 'cat_dich_vu',
    name: 'Dịch vụ & Tích hợp',
    slug: 'dich-vu-tich-hop',
    description: 'Quy trình tư vấn, chuyển giao công nghệ và chính sách hỗ trợ kỹ thuật',
    count: 2,
  },
  {
    id: 'cat_phap_ly',
    name: 'Chính sách & Pháp lý',
    slug: 'chinh-sach-phap-ly',
    description: 'Điều khoản sử dụng, chính sách bảo mật thông tin và bản quyền phần mềm',
    count: 2,
  },
  {
    id: 'cat_huong_dan',
    name: 'Hướng dẫn & Trợ giúp',
    slug: 'huong-dan-tro-giup',
    description: 'Cẩm nang sử dụng phần mềm, cài đặt license và hỗ trợ khách hàng',
    count: 1,
  },
];

export const staticPagesMock: StaticPage[] = [
  {
    id: 'page_001',
    title: 'Tổng quan & Năng lực Công ty Cổ phần Công nghệ và Tư vấn CIC',
    alias: 'tong-quan-nang-luc-cong-ty-cic',
    category_id: 'cat_gioi_thieu',
    parent_id: null,
    depth: 0,
    template: 'corporate_intro',
    summary: 'CIC Technology & Consultancy là đơn vị tiên phong cung cấp giải pháp phần mềm chuyên ngành xây dựng, địa kỹ thuật, kết cấu và BIM/CDE hàng đầu tại Việt Nam hơn 30 năm qua.',
    content: `<h2>1. Lịch sử hình thành và Phát triển</h2>
<p>Công ty Cổ phần Công nghệ và Tư vấn CIC (tiền thân là Trung tâm Tin học Xây dựng - Bộ Xây dựng) được thành lập từ năm 1990. Trải qua hơn 30 năm phát triển, CIC khẳng định vị thế là nhà cung cấp phần mềm kỹ thuật hàng đầu tại Việt Nam.</p>
<h3>1.1. Tầm nhìn & Sứ mệnh</h3>
<p>CIC cam kết mang đến những giải pháp công nghệ hiện đại nhất, giúp các doanh nghiệp tư vấn thiết kế, thi công và quản lý dự án tối ưu hóa chi phí và nâng cao năng suất lao động.</p>
<h2>2. Các mảng dịch vụ trọng tâm</h2>
<ul>
  <li>Cung cấp bản quyền phần mềm xây dựng quốc tế: CSI ETABS, SAP2000, SAFE, PLAXIS, GeoStudio...</li>
  <li>Phát triển các giải pháp phần mềm nội địa: Dự toán ESCON, EnjiCAD, Kiểm tra kết cấu...</li>
  <li>Tư vấn và triển khai Mô hình thông tin công trình (BIM/CDE).</li>
  <li>Đào tạo và chuyển giao công nghệ ứng dụng tin học trong công trình.</li>
</ul>
<p>Quý khách hàng có nhu cầu tư vấn giải pháp xin vui lòng liên hệ hotline: <strong>024 3976 1381</strong>.</p>`,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    image_alt: 'Tổng quan công ty CIC',
    banner_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80',
    tags: ['CIC Technology', 'Giới thiệu', 'Năng lực công ty', 'Phần mềm xây dựng', 'BIM'],
    show_in_homepage: true,
    show_in_header: true,
    show_in_footer: true,
    published: true,
    ordering: 1,
    seo_title: 'Giới thiệu về CIC Technology & Consultancy - Giải pháp phần mềm xây dựng',
    seo_keyword: 'CIC Technology, công ty CIC, phần mềm xây dựng, phần mềm kết cấu, BIM CDE',
    seo_description: 'Tìm hiểu tổng quan về CIC Technology & Consultancy - đơn vị cung cấp giải pháp bản quyền phần mềm xây dựng, kết cấu và tư vấn BIM uy tín tại Việt Nam.',
    created_time: '2026-07-15 09:30:00',
    updated_time: '2026-07-28 14:20:00',
    author: { name: 'Nguyễn Văn Nam' },
    reviewer: { name: 'Trần Thị Mai' },
    workflow_status: 'published',
    working_version_number: 1,
    published_version_number: 1,
    primary_locale: 'vi',
    translation_progress: { vi: 'complete', en: 'complete' },
    translations: {
      en: {
        title: 'Overview & Capabilities of CIC Technology & Consultancy JSC',
        summary: 'CIC Technology & Consultancy is a pioneer in providing specialized software solutions for construction, geotechnical, structural engineering and BIM/CDE in Vietnam for over 30 years.',
        content: '<h2>1. History and Development</h2><p>Established in 1990 under the Ministry of Construction, CIC is Vietnam leading provider of engineering software.</p>',
        seo_title: 'About CIC Technology & Consultancy - Construction Software Solutions',
        seo_description: 'Learn about CIC Technology & Consultancy - Vietnam premier software licensing and BIM consulting company.'
      }
    },
    used_by: [
      { id: 'u1', type: 'menu', location_name: 'Main Navigation Header -> Giới thiệu', link_url: '/gioi-thieu' },
      { id: 'u2', type: 'footer', location_name: 'Footer Column 1 -> Về CIC', link_url: '/gioi-thieu' },
      { id: 'u3', type: 'block', location_name: 'Homepage Banner Hero CTA', link_url: '/gioi-thieu' }
    ],
    quality_warnings: [],
    activities: [
      { id: 'a1', timestamp: '2026-07-15 09:30:00', actor_name: 'Nguyễn Văn Nam', action_type: 'create', details: 'Khởi tạo bài viết' },
      { id: 'a2', timestamp: '2026-07-28 14:20:00', actor_name: 'Trần Thị Mai', action_type: 'publish', details: 'Duyệt và xuất bản phiên bản v1.0' }
    ]
  },
  {
    id: 'page_001_sub1',
    title: 'Lịch sử hình thành & Các cột mốc phát triển 1990 - 2026',
    alias: 'lich-su-hinh-thanh-phat-trien',
    category_id: 'cat_gioi_thieu',
    parent_id: 'page_001',
    depth: 1,
    template: 'standard',
    summary: 'Chi tiết hành trình 36 năm hình thành và phát triển của CIC từ Trung tâm Tin học Xây dựng đến Công ty Cổ phần Công nghệ hàng đầu.',
    content: `<h2>Hành trình 36 năm đổi mới công nghệ</h2><p>Năm 1990: Thành lập Trung tâm Tin học Xây dựng theo Quyết định của Bộ Xây dựng...</p>`,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
    tags: ['Lịch sử CIC', 'Cột mốc', 'Thành tựu'],
    show_in_homepage: false,
    show_in_header: false,
    show_in_footer: true,
    published: true,
    ordering: 2,
    seo_title: 'Lịch sử phát triển CIC Technology qua các thời kỳ',
    seo_keyword: 'lich su cic, cot moc phat trien cic, bo xay dung',
    seo_description: 'Hành trình 36 năm đồng hành cùng ngành xây dựng Việt Nam của CIC Technology.',
    created_time: '2026-07-16 10:00:00',
    author: { name: 'Nguyễn Văn Nam' },
    workflow_status: 'published',
    working_version_number: 1,
    published_version_number: 1,
    primary_locale: 'vi',
    translation_progress: { vi: 'complete', en: 'in_progress' },
    used_by: [
      { id: 'u4', type: 'menu', location_name: 'Header Menu -> Về CIC -> Lịch sử phát triển', link_url: '/gioi-thieu/lich-su-hinh-thanh' }
    ]
  },
  {
    id: 'page_001_sub2',
    title: 'Ban Lãnh đạo & Hội đồng Quản trị CIC',
    alias: 'ban-lanh-dao-hoi-dong-quan-tri',
    category_id: 'cat_gioi_thieu',
    parent_id: 'page_001',
    depth: 1,
    template: 'standard',
    summary: 'Giới thiệu đội ngũ lãnh đạo tâm huyết, giàu kinh nghiệm và tầm nhìn chiến lược đưa CIC vươn tầm khu vực.',
    content: `<h2>Đội ngũ Lãnh đạo CIC</h2><p>Giới thiệu các thành viên Hội đồng Quản trị và Ban Giám đốc CIC...</p>`,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80',
    tags: ['Ban lãnh đạo', 'HĐQT', 'Đội ngũ CIC'],
    show_in_homepage: false,
    published: true,
    ordering: 3,
    seo_title: 'Ban Lãnh đạo & Hội đồng Quản trị CIC Technology',
    seo_keyword: 'ban lanh dao cic, hoi dong quan tri, giam doc cic',
    seo_description: 'Đội ngũ lãnh đạo dẫn dắt CIC Technology phát triển bền vững.',
    created_time: '2026-07-17 14:00:00',
    author: { name: 'Lê Hoàng Anh' },
    workflow_status: 'published',
    working_version_number: 1,
    published_version_number: 1,
    primary_locale: 'vi',
    translation_progress: { vi: 'complete', en: 'missing' },
    used_by: [
      { id: 'u5', type: 'menu', location_name: 'Header Menu -> Về CIC -> Ban Lãnh đạo', link_url: '/gioi-thieu/ban-lanh-dao' }
    ]
  },
  {
    id: 'page_002',
    title: 'Chính sách Bảo mật Thông tin & An toàn Dữ liệu Khách hàng',
    alias: 'chinh-sach-bao-mat-thong-tin',
    category_id: 'cat_phap_ly',
    parent_id: null,
    depth: 0,
    template: 'policy',
    summary: 'Cam kết của CIC về việc thu thập, lưu trữ, xử lý và bảo vệ thông tin cá nhân, tài khoản đăng ký phần mềm của khách hàng tuân thủ quy định pháp luật Việt Nam.',
    content: `<h2>1. Mục đích thu thập thông tin</h2>
<p>CIC thu thập thông tin cá nhân khách hàng (Họ tên, Email, Số điện thoại, Tên đơn vị) nhằm mục đích:</p>
<ul>
  <li>Xác thực bản quyền phần mềm và kích hoạt khóa cứng / Softkey.</li>
  <li>Cung cấp tài liệu hướng dẫn, hỗ trợ kỹ thuật và nâng cấp phần mềm.</li>
  <li>Gửi báo giá và thông báo chương trình hội thảo chuyên ngành.</li>
</ul>
<h2>2. Phạm vi sử dụng & Cam kết bảo mật</h2>
<p>CIC cam kết không bán, chia sẻ hoặc tiết lộ thông tin khách hàng cho bất kỳ bên thứ ba nào ngoại trừ các hãng sản xuất phần mềm đối tác (CSI, Bentley, GeoStudio) nhằm mục đích cấp chứng nhận bản quyền chính thức.</p>
<p>Dữ liệu được lưu trữ an toàn trên hệ thống máy chủ chứng nhận ISO/IEC 27001.</p>`,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    tags: ['Bảo mật', 'Chính sách', 'Quyền riêng tư', 'Bản quyền'],
    show_in_homepage: false,
    show_in_footer: true,
    published: true,
    ordering: 4,
    seo_title: 'Chính sách bảo mật thông tin khách hàng - CIC Technology',
    seo_keyword: 'chính sách bảo mật, bảo mật dữ liệu, bản quyền CIC, quy định sử dụng',
    seo_description: 'Chi tiết chính sách bảo mật thông tin cá nhân và an toàn dữ liệu khách hàng khi đăng ký sử dụng phần mềm và dịch vụ tại CIC.',
    created_time: '2026-07-18 11:15:00',
    updated_time: '2026-07-20 16:00:00',
    author: { name: 'Phạm Thị Thảo' },
    reviewer: { name: 'Trần Thị Mai' },
    workflow_status: 'published',
    working_version_number: 1,
    published_version_number: 1,
    primary_locale: 'vi',
    translation_progress: { vi: 'complete', en: 'complete' },
    translations: {
      en: {
        title: 'Information Security & Privacy Policy',
        summary: 'Commitment of CIC on collecting, storing, processing and protecting customer personal data in compliance with Vietnamese law.',
        content: '<h2>1. Purpose of Data Collection</h2><p>CIC collects customer info to activate software licenses and provide technical support.</p>',
        seo_title: 'Privacy Policy - CIC Technology',
        seo_description: 'Read CIC Technology privacy policy and data security guidelines.'
      }
    },
    used_by: [
      { id: 'u6', type: 'footer', location_name: 'Footer Bottom Legal Links -> Chính sách bảo mật', link_url: '/chinh-sach-bao-mat-thong-tin' }
    ]
  },
  {
    id: 'page_002_sub1',
    title: 'Điều khoản Sử dụng Website & Phần mềm Bản quyền',
    alias: 'dieu-khoan-su-dung-website',
    category_id: 'cat_phap_ly',
    parent_id: 'page_002',
    depth: 1,
    template: 'policy',
    summary: 'Quy định pháp lý về quyền sở hữu trí tuệ, phạm vi sử dụng nội dung website và điều kiện kích hoạt bản quyền phần mềm.',
    content: `<h2>1. Quyền sở hữu trí tuệ</h2><p>Toàn bộ tài nguyên trên website thuộc sở hữu bản quyền của CIC Technology...</p>`,
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    tags: ['Điều khoản', 'Pháp lý', 'Sở hữu trí tuệ'],
    show_in_homepage: false,
    show_in_footer: true,
    published: true,
    ordering: 5,
    seo_title: 'Điều khoản sử dụng website CIC Technology',
    seo_keyword: 'dieu khoan su dung, quy dinh website cic, so huu tri tue',
    seo_description: 'Các quy định và điều khoản áp dụng cho người dùng khi truy cập website và phần mềm của CIC.',
    created_time: '2026-07-19 08:30:00',
    author: { name: 'Phạm Thị Thảo' },
    workflow_status: 'published',
    working_version_number: 1,
    published_version_number: 1,
    primary_locale: 'vi',
    translation_progress: { vi: 'complete', en: 'in_progress' },
    used_by: [
      { id: 'u7', type: 'footer', location_name: 'Footer Bottom Legal Links -> Điều khoản sử dụng', link_url: '/dieu-khoan-su-dung-website' }
    ]
  },
  {
    id: 'page_003',
    title: 'Quy trình Tư vấn, Đặt hàng & Chuyển giao Phần mềm Bản quyền',
    alias: 'quy-trinh-tu-van-chuyen-giao-phan-mem',
    category_id: 'cat_dich_vu',
    parent_id: null,
    depth: 0,
    template: 'landing',
    summary: 'Hướng dẫn các bước từ khảo sát nhu cầu, cấp phép trải nghiệm Demo, thanh toán đến cài đặt, chuyển giao License khóa USB/Network và hỗ trợ kỹ thuật.',
    content: `<h2>Quy trình 5 bước tư vấn & chuyển giao phần mềm tại CIC</h2>
<ol>
  <li><strong>Bước 1: Tiếp nhận nhu cầu & Khảo sát kỹ thuật:</strong> Chuyên viên tư vấn ghi nhận yêu cầu quy mô dự án và loại phần mềm cần dùng (CSI ETABS, SAFE, PLAXIS, Escon...).</li>
  <li><strong>Bước 2: Dùng thử & Demo trực tiếp:</strong> Cấp bản Trial Demo trải nghiệm và tổ chức buổi làm việc trực tuyến/trực tiếp hướng dẫn thao tác.</li>
  <li><strong>Bước 3: Báo giá & Ký kết hợp đồng:</strong> Gửi báo giá chính hãng, bao gồm phí bản quyền, bảo trì và hỗ trợ nâng cấp định kỳ.</li>
  <li><strong>Bước 4: Bàn giao License & Kích hoạt:</strong> Gửi USB Key hoặc mã Kích hoạt License Network cùng Giấy chứng nhận bản quyền hãng.</li>
  <li><strong>Bước 5: Đào tạo & Hỗ trợ sau bán hàng:</strong> Đào tạo sử dụng cho kỹ sư, giải đáp thắc mắc kỹ thuật 24/7 qua Hotline/Zalo/Email.</li>
</ol>`,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80',
    tags: ['Quy trình tư vấn', 'Đặt hàng', 'Chuyển giao công nghệ', 'License bản quyền'],
    show_in_homepage: true,
    published: true,
    ordering: 6,
    seo_title: 'Quy trình tư vấn & chuyển giao phần mềm bản quyền - CIC',
    seo_keyword: 'quy trình chuyển giao, mua phần mềm etabs, license network, hỗ trợ kỹ thuật cic',
    seo_description: 'Khám phá quy trình 5 bước đặt hàng, cấp phát license và bàn giao phần mềm bản quyền chuyên nghiệp tại CIC Technology.',
    created_time: '2026-07-25 15:45:00',
    updated_time: '2026-07-30 08:10:00',
    author: { name: 'Vũ Quốc Khánh' },
    reviewer: { name: 'Trần Thị Mai' },
    workflow_status: 'pending',
    working_version_number: 2,
    published_version_number: 1,
    primary_locale: 'vi',
    translation_progress: { vi: 'complete', en: 'outdated' },
    used_by: [
      { id: 'u8', type: 'menu', location_name: 'Header Menu -> Dịch vụ -> Quy trình mua phần mềm', link_url: '/quy-trinh-tu-van-chuyen-giao-phan-mem' }
    ],
    quality_warnings: ['Bản dịch Tiếng Anh đã cũ (outdated) do bản tiếng Việt vừa sửa đổi'],
    activities: [
      { id: 'a3', timestamp: '2026-07-30 08:10:00', actor_name: 'Vũ Quốc Khánh', action_type: 'update', details: 'Sửa đổi làm việc với working version v2.0-draft' },
      { id: 'a4', timestamp: '2026-07-30 09:00:00', actor_name: 'Vũ Quốc Khánh', action_type: 'submit', details: 'Gửi duyệt phiên bản v2.0' }
    ]
  },
  {
    id: 'page_004',
    title: 'Landing Page: Giải pháp BIM & Môi trường Dữ liệu Chung (CDE) cho Doanh nghiệp',
    alias: 'giai-phap-bim-cde-doanh-nghiep',
    category_id: 'cat_dich_vu',
    parent_id: null,
    depth: 0,
    template: 'landing',
    sections: [
      { id: 'sec1', title: 'Tổng quan giải pháp BIM/CDE', type: 'hero', content: 'Tối ưu hóa quản lý dự án xây dựng với Mô hình thông tin công trình BIM và nền tảng CDE chuẩn quốc tế.', order: 1 },
      { id: 'sec2', title: 'Lợi ích cốt lõi', type: 'grid', content: 'Giảm 35% chi phí lãng phí, tăng 50% tốc độ phối hợp giữa các bộ môn Kế cấu, Kiến trúc, MEP.', order: 2 },
      { id: 'sec3', title: 'Đăng ký tư vấn ngay', type: 'cta', content: 'Nhận ngay tư vấn miễn phí lộ trình chuyển đổi số BIM từ chuyên gia CIC.', order: 3 }
    ],
    summary: 'Giải pháp tư vấn xây dựng quy trình BIM, lựa chọn phần mềm CDE và đào tạo chuyển giao cho các tổng thầu, chủ đầu tư và đơn vị tư vấn thiết kế.',
    content: `<h2>Giải pháp BIM / CDE toàn diện từ CIC</h2><p>Hỗ trợ doanh nghiệp ứng dụng thành công BIM ISO 19650 vào các dự án lớn tại Việt Nam.</p>`,
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80',
    tags: ['BIM', 'CDE', 'Landing page', 'Tư vấn chuyển đổi số'],
    show_in_homepage: true,
    published: false,
    ordering: 7,
    seo_title: 'Giải pháp tư vấn triển khai BIM CDE cho doanh nghiệp - CIC',
    seo_keyword: 'giai phap bim, nen tang cde, iso 19650, tu van bim cic',
    seo_description: 'Tư vấn và chuyển giao toàn diện mô hình BIM/CDE cho chủ đầu tư và nhà thầu.',
    created_time: '2026-08-01 11:20:00',
    author: { name: 'Vũ Quốc Khánh' },
    workflow_status: 'draft',
    working_version_number: 1,
    primary_locale: 'vi',
    translation_progress: { vi: 'complete', en: 'missing' },
    used_by: [], // Orphan page test
    quality_warnings: ['Chưa được liên kết từ bất kỳ Menu/Block nào (Trang mồ côi)', 'Thiếu bản dịch Tiếng Anh']
  },
  {
    id: 'page_005',
    title: 'Hướng dẫn Kích hoạt License Khóa Cứng (USB Key) & Softkey',
    alias: 'huong-dan-kich-hoat-license-khoa-cung',
    category_id: 'cat_huong_dan',
    parent_id: null,
    depth: 0,
    template: 'standard',
    summary: 'Chi tiết thao tác cắm USB Dongle, cài đặt Driver Sentinel/HASP và nhập mã mềm Softkey kích hoạt bản quyền phần mềm CSI ETABS, SAP2000, SAFE.',
    content: `<h2>1. Hướng dẫn sử dụng Khóa cứng USB Dongle</h2><p>Cắm USB Dongle vào cổng USB máy tính. Tải Sentinel Driver mới nhất từ trang hỗ trợ CIC...</p>`,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    tags: ['License USB', 'Cài đặt ETABS', 'Softkey', 'Sentinel Driver'],
    show_in_homepage: false,
    published: true,
    ordering: 8,
    seo_title: 'Hướng dẫn kích hoạt License khóa cứng USB & Softkey - CIC',
    seo_keyword: 'kich hoat license etabs, usb key sap2000, driver sentinel cic',
    seo_description: 'Các bước cài đặt driver và kích hoạt bản quyền phần mềm xây dựng CIC thành công 100%.',
    created_time: '2026-08-02 14:00:00',
    author: { name: 'Lê Hoàng Anh' },
    reviewer: { name: 'Trần Thị Mai' },
    workflow_status: 'returned',
    return_comment: 'Cần bổ sung thêm ảnh minh họa các bước thao tác trên phần mềm Sentinel Control Center.',
    working_version_number: 2,
    published_version_number: 1,
    primary_locale: 'vi',
    translation_progress: { vi: 'complete', en: 'missing' },
    used_by: [
      { id: 'u9', type: 'menu', location_name: 'Footer Menu -> Hỗ trợ kỹ thuật -> Kích hoạt License', link_url: '/huong-dan-kich-hoat-license-khoa-cung' }
    ],
    quality_warnings: ['Đã bị yêu cầu sửa đổi (Returned) bởi Người duyệt']
  }
];
