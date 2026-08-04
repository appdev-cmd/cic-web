import { ProductItem, ProductCategory, ProductBrand, ProductActivityLog, ProductOwnerOption } from './types';

export const mockProductCategories: ProductCategory[] = [
  { id: 'cat_software_csi', name: 'Phần mềm CSI Structural', slug: 'phan-mem-csi', count: 18, description: 'Các giải pháp phân tích và thiết kế kết cấu hàng đầu thế giới từ Computers and Structures, Inc.' },
  { id: 'cat_software_cad', name: 'Giải pháp CAD/BIM', slug: 'giai-phap-cad-bim', count: 24, description: 'Phần mềm thiết kế bản vẽ và mô hình hóa thông tin công trình.' },
  { id: 'cat_geotech', name: 'Địa kỹ thuật & Môi trường', slug: 'dia-ky-thuat', count: 12, description: 'Mô phỏng ổn định mái dốc, xử lý nền móng và dòng thấm.' },
  { id: 'cat_cic_apps', name: 'Phần mềm thương hiệu CIC', slug: 'phan-mem-cic', count: 32, description: 'Các phần mềm lập dự toán, quản lý chi phí và nghiệm thu do CIC trực tiếp phát triển.' },
  { id: 'cat_hardware', name: 'Thiết bị thí nghiệm & Đo đạc', slug: 'thiet-bi-do-dac', count: 45, description: 'Máy thủy bình, máy toàn đạc, thiết bị đo ứng suất và siêu âm bê tông.' },
  { id: 'cat_training', name: 'Khóa đào tạo & Chuyển giao', slug: 'khoa-dao-tao', count: 15, description: 'Chương trình đào tạo chuyển giao công nghệ phần mềm chuyên ngành.' },
];

export const mockProductBrands: ProductBrand[] = [
  { id: 'brand_csi', name: 'Computers and Structures, Inc. (CSI)', logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=80', country: 'Mỹ', website: 'https://www.csiamerica.com' },
  { id: 'brand_cic', name: 'CIC Technology JSC', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&auto=format&fit=crop&q=80', country: 'Việt Nam', website: 'https://www.cic.com.vn' },
  { id: 'brand_bentley', name: 'Bentley Systems', logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80', country: 'Mỹ', website: 'https://www.bentley.com' },
  { id: 'brand_seequent', name: 'Seequent / GeoStudio', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80', country: 'New Zealand', website: 'https://www.geostudio.com' },
  { id: 'brand_enji', name: 'EnjiCAD Technology', logo: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=120&auto=format&fit=crop&q=80', country: 'Đài Loan', website: 'https://www.enjicad.com' },
];

export const mockProductOwners: ProductOwnerOption[] = [
  { id: 'usr_001', name: 'Nguyễn Văn Quản Trị', role: 'Superadmin / Product Director', department: 'Phòng Công nghệ', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'usr_002', name: 'Lê Hoàng Nam', role: 'Chuyên viên Bán hàng Phần mềm CSI', department: 'Trung tâm Bán hàng MB', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'usr_003', name: 'Trần Thị Thu Thảo', role: 'Trưởng nhóm Nội dung & SEO', department: 'Phòng Marketing', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: 'usr_004', name: 'Phạm Minh Tuấn', role: 'Kỹ sư Giải pháp Địa kỹ thuật', department: 'Phòng Kỹ thuật & Chuyển giao', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
];

export const mockProducts: ProductItem[] = [
  {
    id: 'prod_001',
    sku: 'CSI-ETABS-ULT-2026',
    title: 'CSI ETABS Ultimate v21 - Phần mềm Phân tích & Thiết kế Kết cấu Tòa nhà',
    alias: 'csi-etabs-ultimate-v21',
    tagline: 'Tiêu chuẩn vàng trong thiết kế kết cấu nhà cao tầng toàn cầu',
    short_description: 'CSI ETABS v21 cung cấp bộ công cụ phân tích tĩnh, phân tích động phi tuyến, thiết kế bê tông cốt thép và kết cấu thép nhà cao tầng theo các tiêu chuẩn TCVN 5574:2018 và ACI 318.',
    product_type: 'Phần mềm bản quyền',
    category_id: 'cat_software_csi',
    brand_id: 'brand_csi',
    brand_name: 'Computers and Structures, Inc. (CSI)',
    application_areas: ['Kết cấu Tòa nhà', 'Nhà cao tầng', 'Bê tông cốt thép', 'Kháng chấn'],
    price: 'Báo giá theo License',
    currency: 'VND',
    unit: 'License vĩnh viễn / Standalone / Network',
    origin: 'Mỹ (CSI)',
    warranty: '12 tháng bảo trì & cập nhật phiên bản',
    availability_signal: 'in_stock',
    content_html: `
      <h2>Tổng quan về ETABS Ultimate v21</h2>
      <p>ETABS là phần mềm chuyên dụng hàng đầu thế giới dành cho phân tích và thiết kế hệ thống kết cấu công trình xây dựng. Với hơn 40 năm phát triển, ETABS đã trở thành biểu tượng chuẩn mực cho các kỹ sư kết cấu tại Việt Nam và quốc tế.</p>
      <h3>Các tính năng đột phá trên bản Ultimate:</h3>
      <ul>
        <li><strong>Phân tích phi tuyến theo thời gian (Pushover & Time-History):</strong> Mô phỏng chính xác ứng xử động đất và tải trọng gió giật động.</li>
        <li><strong>Tự động hóa theo tiêu chuẩn TCVN 5574:2018 & TCVN 2737:2023:</strong> Tích hợp sẵn tải trọng gió và tổ hợp phụ thuộc theo quy chuẩn Việt Nam mới nhất.</li>
        <li><strong>Tương thích mô hình BIM:</strong> Kết nối 2 chiều linh hoạt với Autodesk Revit, Tekla Structures và IFC Format.</li>
      </ul>
    `,
    highlights: [
      'Giao diện dựng hình 3D trực quan, hỗ trợ lưới cong và vách cứng phức tạp',
      'Tích hợp đầy đủ tiêu chuẩn thiết kế Việt Nam TCVN và Quốc tế (ACI, Eurocode, BS)',
      'Thuật toán giải cực nhanh đa nhân GPU/CPU',
      'Xuất bản vẽ chi tiết bê tông cốt thép tự động sang AutoCAD/EnjiCAD'
    ],
    tech_specs: [
      { id: 'sp_1', key: 'Hệ điều hành hỗ trợ', value: 'Windows 11 / Windows 10 (64-bit)', group: 'Yêu cầu hệ thống' },
      { id: 'sp_2', key: 'Dung lượng RAM tối thiểu', value: '16 GB RAM (Khuyến nghị 32 GB RAM cho mô hình > 50 tầng)', group: 'Yêu cầu hệ thống' },
      { id: 'sp_3', key: 'Card đồ họa', value: 'NVIDIA / AMD 4GB VRAM OpenGL 4.0 trở lên', group: 'Yêu cầu hệ thống' },
      { id: 'sp_4', key: 'Hình thức cấp bản quyền', value: 'USB Dongle Hardware key hoặc Cloud License Server', group: 'Bản quyền & Giấy phép' },
      { id: 'sp_5', key: 'Tiêu chuẩn Việt Nam', value: 'TCVN 5574:2018, TCVN 2737:2023, TCVN 9386:2012', group: 'Tiêu chuẩn tích hợp' }
    ],
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80'
    ],
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    og_image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80',
    documents: [
      { id: 'doc_1', title: 'Brochure Tổng quan ETABS v21 Tiếng Việt (PDF)', file_url: '/files/ETABS_v21_Brochure_VI.pdf', file_type: 'PDF', file_size: '4.2 MB', version: '2026.1', access: 'public' },
      { id: 'doc_2', title: 'Tài liệu Hướng dẫn Thực hành Thiết kế TCVN 5574:2018', file_url: '/files/ETABS_TCVN5574_Guide.pdf', file_type: 'PDF', file_size: '8.7 MB', version: 'v2.0', access: 'require_email' }
    ],
    meta_title: 'Bảng giá & Bản quyền ETABS Ultimate v21 Chính hãng | CIC Technology',
    meta_description: 'Mua bản quyền phần mềm ETABS Ultimate v21 phân tích kết cấu nhà cao tầng chính hãng tại Việt Nam từ đại lý ủy quyền CIC. Hỗ trợ kỹ thuật 24/7.',
    meta_keywords: 'ETABS, CSI ETABS, bản quyền ETABS, TCVN 5574 2018, thiết kế nhà cao tầng',
    canonical_url: 'https://cic.com.vn/san-pham/csi-etabs-ultimate-v21',
    owner_id: 'usr_002',
    owner_name: 'Lê Hoàng Nam',
    owner_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    inquiry_routing: 'Phòng Kinh doanh Phần mềm CSI',
    translations: {
      EN: { locale: 'EN', locale_name: 'English', status: 'complete', progress: 100, title: 'CSI ETABS Ultimate v21 - Structural Analysis & Design' },
      JA: { locale: 'JA', locale_name: 'Japanese', status: 'in_progress', progress: 50, title: 'CSI ETABS Ultimate v21 構造解析ソフト' },
      KR: { locale: 'KR', locale_name: 'Korean', status: 'missing', progress: 0 }
    },
    editorial_status: 'published',
    catalog_status: 'active',
    published: true,
    is_hot: true,
    ordering: 1,
    site_placement: ['home_featured', 'catalog_grid', 'top_recommendation'],
    completeness_score: 95,
    missing_fields: ['Bản dịch Tiếng Hàn (KR)'],
    created_time: '2026-01-10 08:30:00',
    updated_time: '2026-07-30 14:20:00',
    published_time: '2026-01-12 10:00:00'
  },
  {
    id: 'prod_002',
    sku: 'CIC-ESCON-2026-ENT',
    title: 'Phần mềm Dự toán ESCON 2026 Enterprise Edition',
    alias: 'du-toan-escon-2026',
    tagline: 'Công cụ lập dự toán, quản lý chi phí đầu tư xây dựng nhanh nhất Việt Nam',
    short_description: 'ESCON 2026 tự động cập nhật đơn giá, định mức Thông tư mới nhất của Bộ Xây dựng, hỗ trợ lập dự toán công trình giao thông, thủy lợi, hạ tầng kỹ thuật và dân dụng.',
    product_type: 'Phần mềm thương hiệu CIC',
    category_id: 'cat_cic_apps',
    brand_id: 'brand_cic',
    brand_name: 'CIC Technology JSC',
    application_areas: ['Dự toán Chi phí', 'Bộ Xây dựng', 'Nghiệm thu công trình', 'Đơn giá ĐTXL'],
    price: '4.500.000 VNĐ / Khóa USB',
    currency: 'VND',
    unit: 'Khóa cứng USB Dongle',
    origin: 'Việt Nam (CIC)',
    warranty: 'Bảo hành khóa 24 tháng, cập nhật định mức trọn đời',
    availability_signal: 'in_stock',
    content_html: `
      <h2>Dự toán ESCON 2026 - Sự lựa chọn số 1 của các Ban QLDA & Chủ đầu tư</h2>
      <p>Với lịch sử phát triển hơn 25 năm, Dự toán ESCON của CIC luôn là kim chỉ nam cho công tác quản lý chi phí đầu tư xây dựng tại Việt Nam.</p>
      <h3>Tính năng nổi bật:</h3>
      <p>Cập nhật tự động bảng lương nhân công và giá ca máy theo định mức Thông tư 12/2021/TT-BXD, Thông tư 13/2021/TT-BXD và các hướng dẫn mới nhất năm 2026.</p>
    `,
    highlights: [
      'Giao diện gần gũi như Microsoft Excel 365',
      'Tra cứu định mức, đơn giá 63 tỉnh thành tức thì',
      'Tính bù giá nhiên liệu, ca máy tự động',
      'Xuất báo cáo thẩm định dự toán theo mẫu chuẩn Bộ Tài chính'
    ],
    tech_specs: [
      { id: 'sp_e1', key: 'Hệ điều hành', value: 'Windows 8.1 / 10 / 11', group: 'Cấu hình' },
      { id: 'sp_e2', key: 'Bộ nhớ RAM', value: 'Tối thiểu 4 GB', group: 'Cấu hình' },
      { id: 'sp_e3', key: 'Thiết bị đi kèm', value: 'Khóa cứng USB Dongle chống sao chép', group: 'Phần cứng' }
    ],
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
    ],
    documents: [
      { id: 'doc_e1', title: 'File Cài đặt ESCON 2026 Setup (EXE)', file_url: '/files/ESCON_2026_Setup.exe', file_type: 'EXE', file_size: '125 MB', version: '2026.0.4', access: 'public' }
    ],
    meta_title: 'Phần mềm Dự toán ESCON 2026 Cập nhật Định mức Mới nhất | CIC',
    meta_description: 'Tải và mua phần mềm lập dự toán công trình ESCON 2026 bản quyền giá tốt nhất từ CIC. Đầy đủ bộ đơn giá 63 tỉnh thành.',
    meta_keywords: 'dự toán escon, phần mềm dự toán, định mức xây dựng 2026, dự toán cic',
    canonical_url: 'https://cic.com.vn/san-pham/du-toan-escon-2026',
    owner_id: 'usr_001',
    owner_name: 'Nguyễn Văn Quản Trị',
    owner_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    inquiry_routing: 'Phòng Phần mềm Xây dựng CIC',
    translations: {
      EN: { locale: 'EN', locale_name: 'English', status: 'in_progress', progress: 40, title: 'ESCON Cost Estimation Software 2026' }
    },
    editorial_status: 'published',
    catalog_status: 'active',
    published: true,
    is_hot: true,
    ordering: 2,
    site_placement: ['home_featured', 'catalog_grid'],
    completeness_score: 90,
    created_time: '2026-02-01 09:00:00',
    updated_time: '2026-07-28 11:15:00',
    published_time: '2026-02-05 14:00:00'
  },
  {
    id: 'prod_003',
    sku: 'GEO-STUDIO-2026-SUITE',
    title: 'Seequent GeoStudio 2026 Suite - Mô phỏng Địa kỹ thuật & Mái dốc',
    alias: 'seequent-geostudio-2026',
    tagline: 'Phần mềm tính toán ổn định mái dốc và dòng thấm đất đá số 1 thế giới',
    short_description: 'Bao gồm SLOPE/W, SEEP/W, SIGMA/W và QUAKE/W. Giải pháp toàn diện cho khảo sát công trình kè thủy lợi, đê điều, mỏ khoáng sản và đường hầm.',
    product_type: 'Phần mềm bản quyền',
    category_id: 'cat_geotech',
    brand_id: 'brand_seequent',
    brand_name: 'Seequent / GeoStudio',
    application_areas: ['Địa kỹ thuật', 'Thủy lợi', 'Thảm họa thiên nhiên', 'Mái dốc'],
    price: 'Báo giá theo gói ứng dụng',
    currency: 'USD',
    unit: 'Annual License / Perpetual',
    origin: 'New Zealand / Canada',
    warranty: '12 tháng nâng cấp Seequent Subscription',
    availability_signal: 'pre_order',
    content_html: `<p>Mô phỏng chính xác áp lực nước lỗ rỗng, lực chấn động động đất tác động lên công trình đê đập và kè sông biển.</p>`,
    highlights: ['Liên kết SLOPE/W và SEEP/W tự động', 'Mô hình hóa phần tử hữu hạn 2D/3D'],
    tech_specs: [
      { id: 'sp_g1', key: 'Modun tích hợp', value: 'SLOPE/W, SEEP/W, SIGMA/W, QUAKE/W, TEMP/W', group: 'Gói sản phẩm' }
    ],
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80'],
    documents: [],
    meta_title: 'GeoStudio 2026 - Phân tích địa kỹ thuật chuyên sâu',
    meta_description: 'Mua GeoStudio chính hãng từ đại lý độc quyền Seequent tại Việt Nam - CIC Technology.',
    meta_keywords: 'GeoStudio, SLOPE/W, SEEP/W, phân tích mái dốc',
    canonical_url: 'https://cic.com.vn/san-pham/seequent-geostudio-2026',
    owner_id: 'usr_004',
    owner_name: 'Phạm Minh Tuấn',
    owner_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    inquiry_routing: 'Phòng Địa kỹ thuật & Hạ tầng',
    translations: {},
    editorial_status: 'pending_review',
    catalog_status: 'inactive',
    published: false,
    is_hot: false,
    ordering: 3,
    site_placement: ['catalog_grid'],
    completeness_score: 72,
    missing_fields: ['Chưa upload tài liệu Brochure', 'Chưa hoàn thiện SEO keywords'],
    created_time: '2026-07-20 10:30:00',
    updated_time: '2026-07-31 08:00:00'
  },
  {
    id: 'prod_004',
    sku: 'ENJI-CAD-PRO-2026',
    title: 'EnjiCAD Professional 2026 - Phần mềm Thiết kế CAD 2D/3D Tương thích DWG',
    alias: 'enjicad-professional-2026',
    tagline: 'Thay thế AutoCAD hoàn hảo với chi phí tiết kiệm đến 70%',
    short_description: 'EnjiCAD Pro 2026 đọc mở file DWG/DXF chuẩn, hỗ trợ đầy đủ lệnh tắt AutoCAD, LISP/VBA script và bản quyền vĩnh viễn không cần trả phí hàng năm.',
    product_type: 'Phần mềm bản quyền',
    category_id: 'cat_software_cad',
    brand_id: 'brand_enji',
    brand_name: 'EnjiCAD Technology',
    application_areas: ['Vẽ CAD 2D', 'Mô hình 3D', 'Bản vẽ Kỹ thuật', 'Cơ khí & Xây dựng'],
    price: '8.900.000 VNĐ / Bản quyền vĩnh viễn',
    currency: 'VND',
    unit: 'License Standalone vĩnh viễn',
    origin: 'Đài Loan',
    warranty: 'Nâng cấp miễn phí trong 1 năm',
    availability_signal: 'in_stock',
    content_html: `<p>Giải pháp tối ưu hóa chi phí phần mềm vẽ bản vẽ kỹ thuật cho các doanh nghiệp tư vấn thiết kế tại Việt Nam.</p>`,
    highlights: [
      '100% Tương thích định dạng DWG từ bản AutoCAD R14 đến 2026',
      'Tốc độ mở file dung lượng > 500MB siêu tốc',
      'Bản quyền vĩnh viễn, không lo phạt bản quyền'
    ],
    tech_specs: [
      { id: 'sp_c1', key: 'Định dạng file', value: 'DWG, DXF, DWF, DGN, PDF', group: 'Tương thích' }
    ],
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80'],
    documents: [],
    meta_title: 'EnjiCAD Professional 2026 - Bản quyền CAD Vĩnh viễn Giá rẻ',
    meta_description: 'Mua phần mềm thay thế AutoCAD EnjiCAD Pro 2026 chính hãng. Đọc mở DWG mượt mà, giấy phép vĩnh viễn.',
    meta_keywords: 'EnjiCAD, thay thế AutoCAD, CAD vĩnh viễn, phần mềm vẽ DWG',
    canonical_url: 'https://cic.com.vn/san-pham/enjicad-professional-2026',
    owner_id: 'usr_003',
    owner_name: 'Trần Thị Thu Thảo',
    owner_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    inquiry_routing: 'Phòng Kinh doanh CAD/BIM',
    translations: {},
    editorial_status: 'draft',
    catalog_status: 'inactive',
    published: false,
    is_hot: false,
    ordering: 4,
    site_placement: ['catalog_grid'],
    completeness_score: 58,
    missing_fields: ['Thiếu nội dung chi tiết', 'Thiếu tài liệu tải về', 'Chưa phê duyệt biên tập'],
    working_version_id: 'wv_004_draft',
    has_working_draft: true,
    created_time: '2026-07-25 15:45:00',
    updated_time: '2026-08-01 09:30:00'
  },
  {
    id: 'prod_005',
    sku: 'CSI-SAP2000-ADV-26',
    title: 'CSI SAP2000 Advanced v26 - Phân tích Kết cấu Tổng thể Đa năng',
    alias: 'csi-sap2000-advanced-v26',
    tagline: 'Phần mềm tính toán kết cấu cầu, tháp thép, bể chứa và công trình thủy lợi',
    short_description: 'SAP2000 v26 hỗ trợ mô phỏng kết cấu dạng khung, vỏ, tấm và phần tử khối 3D với khả năng tính toán giao động, mỏi và tải trọng sóng biển.',
    product_type: 'Phần mềm bản quyền',
    category_id: 'cat_software_csi',
    brand_id: 'brand_csi',
    brand_name: 'Computers and Structures, Inc. (CSI)',
    application_areas: ['Kết cấu Cầu', 'Tháp truyền hình', 'Bể chứa', 'Công trình biển'],
    price: 'Báo giá theo License',
    currency: 'USD',
    unit: 'License Standalone / Network',
    origin: 'Mỹ (CSI)',
    warranty: '12 tháng bảo trì',
    availability_signal: 'in_stock',
    content_html: `<p>SAP2000 là phần mềm phân tích kết cấu lâu đời và linh hoạt bậc nhất của hãng CSI.</p>`,
    highlights: ['Phần tử vỏ tĩnh và động phi tuyến', 'Tự động tính tải trọng sóng biển và động đất'],
    tech_specs: [],
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80'],
    documents: [],
    meta_title: 'CSI SAP2000 Advanced v26 Chính hãng | CIC',
    meta_description: 'Mua bản quyền SAP2000 v26 chính hãng bảo hành đầy đủ tại Việt Nam.',
    meta_keywords: 'SAP2000, CSI SAP2000, tính kết cấu cầu, phần mềm sap2000',
    canonical_url: 'https://cic.com.vn/san-pham/csi-sap2000-advanced-v26',
    owner_id: 'usr_002',
    owner_name: 'Lê Hoàng Nam',
    owner_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    inquiry_routing: 'Phòng Kinh doanh Phần mềm CSI',
    translations: {},
    editorial_status: 'published',
    catalog_status: 'active',
    published: true,
    is_hot: false,
    ordering: 5,
    site_placement: ['catalog_grid'],
    completeness_score: 82,
    created_time: '2026-03-12 11:00:00',
    updated_time: '2026-07-29 16:10:00',
    published_time: '2026-03-15 09:00:00'
  }
];

export const mockProductActivityLogs: ProductActivityLog[] = [
  {
    id: 'act_p101',
    product_id: 'prod_001',
    product_title: 'CSI ETABS Ultimate v21',
    user_name: 'Nguyễn Văn Quản Trị',
    user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    user_role: 'Superadmin',
    action: 'publish',
    details: 'Đã xuất bản phiên bản công khai sản phẩm v2026.2 và kích hoạt hiển thị Catalog.',
    timestamp: '2026-07-30 14:20:00',
    version_tag: 'v2026.2-FINAL'
  },
  {
    id: 'act_p102',
    product_id: 'prod_001',
    product_title: 'CSI ETABS Ultimate v21',
    user_name: 'Lê Hoàng Nam',
    user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    user_role: 'Editor',
    action: 'review_submit',
    details: 'Đã bổ sung tài liệu Hướng dẫn TCVN 5574:2018 và gửi yêu cầu phê duyệt.',
    timestamp: '2026-07-30 11:15:00',
    version_tag: 'wv_001_v2'
  },
  {
    id: 'act_p103',
    product_id: 'prod_002',
    product_title: 'Phần mềm Dự toán ESCON 2026',
    user_name: 'Trần Thị Thu Thảo',
    user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    user_role: 'Marketing',
    action: 'update',
    details: 'Cập nhật giá niêm yết khóa cứng USB và chương trình khuyến mãi tháng 8.',
    timestamp: '2026-07-28 11:15:00'
  },
  {
    id: 'act_p104',
    product_id: 'prod_003',
    product_title: 'Seequent GeoStudio 2026 Suite',
    user_name: 'Phạm Minh Tuấn',
    user_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    user_role: 'Editor',
    action: 'working_draft',
    details: 'Tạo bản nháp chỉnh sửa thông số kỹ thuật các gói ứng dụng SLOPE/W.',
    timestamp: '2026-07-31 08:00:00'
  }
];
