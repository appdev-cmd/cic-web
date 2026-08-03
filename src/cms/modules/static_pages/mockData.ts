import { StaticPageCategory, StaticPage } from './types';

export const staticPageCategoriesMock: StaticPageCategory[] = [
  {
    id: 'cat_gioi_thieu',
    name: 'Giới thiệu công ty',
    description: 'Trang giới thiệu lịch sử, tầm nhìn, cơ cấu tổ chức và năng lực công ty',
    count: 1,
  },
  {
    id: 'cat_dich_vu',
    name: 'Dịch vụ & Tích hợp',
    description: 'Quy trình tư vấn, chuyển giao công nghệ và chính sách hỗ trợ kỹ thuật',
    count: 1,
  },
  {
    id: 'cat_phap_ly',
    name: 'Chính sách & Pháp lý',
    description: 'Điều khoản sử dụng, chính sách bảo mật thông tin và bản quyền phần mềm',
    count: 1,
  },
  {
    id: 'cat_huong_dan',
    name: 'Hướng dẫn & Trợ giúp',
    description: 'Cẩm nang sử dụng phần mềm, cài đặt license và hỗ trợ khách hàng',
    count: 0,
  },
];

export const staticPagesMock: StaticPage[] = [
  {
    id: 'page_001',
    title: 'Tổng quan & Năng lực Công ty Cổ phần Công nghệ và Tư vấn CIC',
    alias: 'tong-quan-nang-luc-cong-ty-cic',
    category_id: 'cat_gioi_thieu',
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
    tags: ['CIC Technology', 'Giới thiệu', 'Năng lực công ty', 'Phần mềm xây dựng', 'BIM'],
    show_in_homepage: true,
    published: true,
    ordering: 1,
    seo_title: 'Giới thiệu về CIC Technology & Consultancy - Giải pháp phần mềm xây dựng',
    seo_keyword: 'CIC Technology, công ty CIC, phần mềm xây dựng, phần mềm kết cấu, BIM CDE',
    seo_description: 'Tìm hiểu tổng quan về CIC Technology & Consultancy - đơn vị cung cấp giải pháp bản quyền phần mềm xây dựng, kết cấu và tư vấn BIM uy tín tại Việt Nam.',
    created_time: '2026-07-15 09:30:00',
    updated_time: '2026-07-28 14:20:00',
  },
  {
    id: 'page_002',
    title: 'Chính sách Bảo mật Thông tin & An toàn Dữ liệu Khách hàng',
    alias: 'chinh-sach-bao-mat-thong-tin',
    category_id: 'cat_phap_ly',
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
    published: true,
    ordering: 2,
    seo_title: 'Chính sách bảo mật thông tin khách hàng - CIC Technology',
    seo_keyword: 'chính sách bảo mật, bảo mật dữ liệu, bản quyền CIC, quy định sử dụng',
    seo_description: 'Chi tiết chính sách bảo mật thông tin cá nhân và an toàn dữ liệu khách hàng khi đăng ký sử dụng phần mềm và dịch vụ tại CIC.',
    created_time: '2026-07-18 11:15:00',
    updated_time: '2026-07-20 16:00:00',
  },
  {
    id: 'page_003',
    title: 'Quy trình Tư vấn, Đặt hàng & Chuyển giao Phần mềm Bản quyền',
    alias: 'quy-trinh-tu-van-chuyen-giao-phan-mem',
    category_id: 'cat_dich_vu',
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
    published: false,
    ordering: 3,
    seo_title: 'Quy trình tư vấn & chuyển giao phần mềm bản quyền - CIC',
    seo_keyword: 'quy trình chuyển giao, mua phần mềm etabs, license network, hỗ trợ kỹ thuật cic',
    seo_description: 'Khám phá quy trình 5 bước đặt hàng, cấp phát license và bàn giao phần mềm bản quyền chuyên nghiệp tại CIC Technology.',
    created_time: '2026-07-25 15:45:00',
    updated_time: '2026-07-30 08:10:00',
  },
];
