/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Project, NewsItem, Partner, HeroSlide, NavLink } from '../types';

export const heroSlides: HeroSlide[] = [
  {
    img: "/banner_hero/doi_tac_cong_nghe_chien_luoc.png",
    title: 'Đối tác công nghệ <br /><span class="text-orange-600 whitespace-nowrap">chiến lược</span>',
    sub: "Hơn 35 năm tiên phong thúc đẩy số hóa toàn diện."
  },
  {
    img: "/banner_hero/He_sinh_thai_giai_phap_so.png",
    title: 'Hệ sinh thái <br /><span class="text-orange-600 whitespace-nowrap">giải pháp số</span>',
    sub: "Ứng dụng AI, BIM và Digital Twins vào quy trình vận hành, giúp tối ưu hóa hiệu suất và tiết kiệm tài nguyên cho doanh nghiệp."
  },
  {
    img: "/banner_hero/dan_dau_chuyen_doi_so.png",
    title: 'Dẫn đầu <br /><span class="text-orange-600 whitespace-nowrap">chuyển đổi số</span>',
    sub: "Hợp tác cùng các tập đoàn công nghệ hàng đầu thế giới mang lại những giải pháp đột phá cho tương lai hạ tầng Việt Nam."
  },
  {
    img: "/banner_hero/Phan_mem_ban_quyen_chinh_hang.jpg",
    title: 'Phần mềm bản quyền <br /><span class="text-orange-600 whitespace-nowrap">chính hãng</span>',
    sub: "Cung cấp hệ thống phần mềm bản quyền chính hãng, hỗ trợ kỹ thuật tận tâm, đảm bảo an toàn thông tin và tuân thủ pháp lý."
  }
];

export const projects: Project[] = [
  { 
    id: 1, 
    type: 'software', 
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80', 
    location: 'Hồ Chí Minh', 
    name: 'Landmark 81 - BIM Management', 
    tags: ['BIM', 'Digital Twins', 'CDE'], 
    size: 'full' 
  },
  { 
    id: 2, 
    type: 'equipment', 
    img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80', 
    location: 'Toàn quốc', 
    name: 'Trạm Quan Trắc Tự Động', 
    tags: ['IoT', 'Monitoring'], 
    size: 'small' 
  },
  { 
    id: 3, 
    type: 'services', 
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80', 
    location: 'Đồng Nai', 
    name: 'Tư vấn Chuyển đổi số Kỹ thuật', 
    tags: ['Consulting', 'AI'], 
    size: 'small' 
  },
  { 
    id: 4, 
    type: 'software', 
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80', 
    location: 'Hà Nội', 
    name: 'Hệ thống Quản lý Năng lượng Net Zero', 
    tags: ['AI', 'Net Zero'], 
    size: 'small' 
  }
];

export const newsItems: NewsItem[] = [
  {
    category: 'company',
    title: 'CIC Technology & Bentley Systems: Thúc đẩy hạ tầng số 2024',
    date: '10/05/2024',
    desc: 'Hợp tác chiến lược mang đến các giải pháp iTwin và Digital Twins tiên tiến cho các dự án trọng điểm tại Việt Nam.',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80'
  },
  {
    category: 'specialty',
    title: 'Ra mắt giải pháp AI trong quản lý năng lượng và Net Zero',
    date: '05/05/2024',
    desc: 'Giúp doanh nghiệp kiểm kê phát thải tự động và tối ưu hóa lộ trình giảm Carbon theo tiêu chuẩn quốc tế.',
    img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop'
  },
  {
    category: 'company',
    title: 'Sự kiện Bentley Innovation Day quy quy tụ hơn 500 chuyên gia',
    date: '28/04/2024',
    desc: 'Chia sẻ kinh nghiệm triển khai BIM và Digital Twins từ các tập đoàn lớn toàn cầu.',
    img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80'
  }
];

export const marqueeTexts: string[] = [
  "CIC Technology đồng hành cùng Bentley Systems thúc đẩy hạ tầng số tại Việt Nam",
  "Nền tảng kiểm kê khí nhà kính và quản lý Net Zero thông minh chuẩn bị ra mắt",
  "CIC vinh dự đón nhận giải thưởng Doanh nghiệp Công nghệ xuất sắc 2025"
];

export const partners: Partner[] = [
  { name: 'Autodesk', logo: 'https://www.cic.com.vn/images/banners/original/autodesk_1692843119.jpg' },
  { name: 'Bentley', logo: 'https://www.cic.com.vn/images/banners/original/bentley_1584073443.jpg' },
  { name: 'Graitec', logo: 'https://www.cic.com.vn/images/banners/original/graitec_1584074977.jpg' },
  { name: 'Instantel', logo: 'https://www.cic.com.vn/images/banners/original/instantel_1584075057.jpg' },
  { name: 'Lander', logo: 'https://www.cic.com.vn/images/banners/original/lander_1584075179.jpg' },
  { name: 'PTV Group', logo: 'https://www.cic.com.vn/images/banners/original/ptv-group_1584081558.jpg' },
  { name: 'RPS', logo: 'https://www.cic.com.vn/images/banners/original/rps_1584081695.jpg' },
  { name: 'Tecotec', logo: 'https://www.cic.com.vn/images/banners/original/tecotec_1584082139.jpg' },
  { name: 'Breeze', logo: 'https://www.cic.com.vn/images/banners/original/breeze_1584073488.jpg' },
  { name: 'Steel Builder', logo: 'https://www.cic.com.vn/images/banners/original/steel-builder_1584081972.jpg' },
  { name: 'VC Group', logo: 'https://www.cic.com.vn/images/banners/original/vc-group_1584082426.jpg' },
  { name: 'NDT System', logo: 'https://www.cic.com.vn/images/banners/original/ndt-system_1584081087.jpg' },
  { name: 'Enjicad', logo: 'https://www.cic.com.vn/images/banners/original/enjicad_1584074316.jpg' },
  { name: 'PEB Steel', logo: 'https://www.cic.com.vn/images/banners/original/peb-steel_1584081269.jpg' },
  { name: 'Shimz', logo: 'https://www.cic.com.vn/images/banners/original/shimz_1584081817.jpg' },
  { name: 'Atlas', logo: 'https://www.cic.com.vn/images/banners/original/atlas-_1584073344.jpg' }
];

export const navLinks: NavLink[] = [
  { 
    name: 'Giới thiệu', 
    href: '#about', 
    active: true,
    dropdown: [
      { name: 'Giới thiệu', href: '#about' },
      { name: 'Cơ cấu tổ chức', href: '#about' },
      { name: 'Năng lực và Kinh nghiệm', href: '#about' }
    ]
  },
  { 
    name: 'Sản phẩm', 
    href: '#solutions'
  },
  { 
    name: 'Dịch vụ', 
    href: '#services',
    dropdown: [
      { name: 'Tư vấn lập đơn giá, chỉ số giá', href: 'tu-van-lap-don-gia-chi-so-gia' },
      { name: 'Đánh giá sản lượng điện gió đạt chuẩn bankable', href: 'danh-gia-san-luong-dien-gio' },
      { name: 'Tư vấn BIM', href: 'tu-van-bim' },
      { name: 'Tư vấn xây dựng', href: 'tu-van-xay-dung' },
      { name: 'Tư vấn dự án', href: 'tu-van-du-an' },
      { name: 'Tư vấn giải pháp ngành thép', href: 'tu-van-giai-phap-nganh-thep' },
      { name: 'Web 360 tương tác thông minh', href: 'web-360-tuong-tac-thong-minh' },
      { name: 'Tư vấn Kiểm kê Khí nhà kính', href: 'tu-van-kiem-ke-khi-nha-kinh' }
    ]
  },
  { 
    name: 'Dự án', 
    href: '#projects'
  },
  { 
    name: 'Tin tức', 
    href: '#news',
    dropdown: [
      { name: 'Tin công ty', href: '#news' },
      { name: 'Tin chuyên ngành', href: '#news' },
      { name: 'Tin tuyển dụng', href: '#news' },
      { name: 'Tin khuyến mại', href: '#news' },
      { name: 'Quan hệ cổ đông', href: '#news' }
    ]
  },
  { 
    name: 'Sự kiện', 
    href: '#events'
  },
  { 
    name: 'Liên hệ', 
    href: '#contact' 
  }
];

export const productsData: Product[] = [
  {
    id: 1,
    name: 'enjiCAD - Phần mềm CAD thay thế',
    icon: 'https://www.cic.com.vn/upload_images/images/2022/07/13/Logo%20enjicad.png',
    img: 'https://www.cic.com.vn/upload_images/images/2022/07/13/Logo%20enjicad.png',
    price: 'Liên hệ',
    description: 'enjiCAD là phần mềm CAD dành riêng cho người Việt với bản quyền vĩnh viễn. Giá mua bản quyền vĩnh viễn của enjiCAD còn thấp hơn giá thuê bao 01 năm của phần mềm CAD nổi tiếng khác.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'CIC Tech',
    app: 'Thiết kế CAD & BIM',
    productType: 'Phần mềm',
    slides: [
      'https://www.cic.com.vn/images/products/2022/07/13/large/enjicad-3.jpg',
      'https://www.cic.com.vn/images/products/2022/07/13/large/enjicad-4.jpg',
      'https://www.cic.com.vn/images/products/2022/07/13/large/enjicad-2.jpg',
      'https://www.cic.com.vn/images/products/2022/07/13/large/enjicad-1.jpg'
    ],
    overviewHtml: `<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>enjiCAD - Giải pháp CAD thay thế, chi phí thấp, hiệu năng cao</strong></span></span></h2>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>enjiCAD</strong> là phần mềm CAD dành riêng cho người Việt do Công ty Cổ phần Công nghệ và Tư vấn CIC phát triển. enjiCAD là phần mềm bản quyền vĩnh viễn. enjiCAD sử dụng giao diện quen thuộc với người dùng AutoCAD,&nbsp;khả năng tương thích đa dạng ngôn ngữ, tối ưu hiệu suất phần cứng, ... enjiCAD có thể thay thế hoàn toàn cho AutoCAD nhưng TIẾT KIỆM HƠN 80% CHI PHÍ.</span></span></p>

<p style="text-align: center;"><img alt="enjicad-logo" src="https://www.cic.com.vn/upload_images/images/2022/07/13/Logo%20enjicad.png" style="width: 650px; max-width: 100%; height: auto;" /></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Hiện tại&nbsp;enjiCAD hiện có các phiên bản sau:</span></span></p>

<ul className="list-disc pl-5 space-y-1">
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">enjiCAD Standard Standalone</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">enjiCAD Professional Standalone</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">enjiCAD Professional Network</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">enjiCAD Education phục vụ cho đào tạo</span></span></li>
</ul>

<p style="text-align: center;"><img alt="uu-diem-enjiCAD" src="https://www.cic.com.vn/upload_images/images/2022/07/07/enjicad-cover.png" style="width: 600px; max-width: 100%; height: auto;" /></p>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Các ưu điểm của enjiCAD</strong></span></span></h2>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">1. Hiệu năng cao với chi phí đầu tư thấp: Giá rẻ là một trong những lợi ích lớn mà enjiCAD đem lại. Giá rẻ nhưng chất lượng sản phẩm không hề thua kém phần mềm đắt tiền khác có cùng tính năng.</span></span></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">2.&nbsp;Giao diện quen thuộc:&nbsp;Giao diện, tính năng hoàn toàn giống phần mềm CAD nổi tiếng khác. Bạn sẽ không phải làm quen lại mà có thể sử dụng thành thạo enjiCAD ngay lập tức.</span></span></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">3.&nbsp;Định dạng file theo chuẩn quốc tế:&nbsp;enjiCAD hoàn toàn tương thích với các định dạng file phổ biến như *.DWG, *.DXF,...</span></span></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">4.&nbsp;Yêu cầu cấu hình phần cứng thấp:&nbsp;Hệ điều hành: Windows 7 trở lên, RAM: 32 bit - 1GB (nên 3GB+), 64 bit - 2GB (nên 4GB+), Màn hình 1024x768 VGA, Ổ cứng trống 1GB.</span></span></p>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>So sánh chi phí</strong></span></span></h2>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">1.&nbsp;Bản đơn vs Bản đơn:&nbsp;Bằng cách thay đổi từ ACAD - phiên bản đơn (Standalone) sang enjiCAD - phiên bản đơn (Standalone), với số lượng giấy phép không thay đổi thì bạn có thể&nbsp;tiết kiệm chi phí lên đến 85%.</span></span></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">2.&nbsp;Bản mạng vs Bản mạng:&nbsp;Bằng cách thay đổi từ ACAD - phiên bản mạng (Network) sang enjiCAD - phiên bản mạng (Network), với số lượng giấy phép không thay đổi thì bạn có thể&nbsp;tiết kiệm chi phí lên đến 87%.</span></span></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">3.&nbsp;Bản đơn vs Bản mạng:&nbsp;Nếu thay đổi từ 100 giấy phép ACAD - phiên bản đơn (Standalone) sang 50 giấy phép enjiCAD - phiên bản mạng (Network) thì bạn có thể&nbsp;tiết kiệm chi phí lên đến 88%.</span></span></p>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Thư viện CAD</strong></span></span></h2>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">enjiCAD được chuẩn bị sẵn một thư viện gồm các tài liệu, video và file hỗ trợ nhằm giúp bạn có trải nghiệm sử dụng enjiCAD thuận tiện và dễ dàng hơn. Thư viện bao gồm LISP, Express Tools và Tips,tricks.</span></span></p>`,
    featuresHtml: `<table border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse: collapse;"><thead style="background:#f1f5f9;"><tr><th>Standard</th><th>Professional</th></tr></thead><tbody><tr><td>Giấy phép vĩnh viễn<br/>Hỗ trợ máy tính cấu hình thấp<br/>Sử dụng ngôn ngữ phát triển (LISP / ARX / .NET / VBA)<br/>So sánh bản vẽ và số liệu<br/>Hỗ trợ định dạng chuẩn quốc tế (.dwg / .dxf…)<br/>Giao diện Ribbon / Classic<br/>Hỗ trợ định dạng font .shx và .ttf<br/>Tính năng tự động Auto Layer<br/>Batch Print<br/>Tự động làm sạch bản vẽ</td><td>Bản quyền vĩnh viễn<br/>Vẽ Cơ Bản, Sửa Và In Ấn Bản Vẽ CAD<br/>Hình Thức Giấy Phép Bản Quyền (Standalone, Network)<br/>Bộ Công Cụ Mở Rộng & Nâng Cao<br/>Omni-Channel Real Time SLA<br/>Hỗ Trợ Ngôn Ngữ Lập Trình Nâng Cao (LISP/ARX/.NET/VBA)<br/>Tính Năng Vẽ 3D Và Tạo Khối Động (Block)</td></tr></tbody></table>`,
    videoUrl: 'https://www.youtube.com/embed/2afPg1SWIj4'
  },
  {
    id: 2,
    name: 'Prokon- Phần mềm Phân tích và Thiết kế Kỹ thuật Kết cấu',
    icon: 'https://www.cic.com.vn/upload_images/images/2026/DCS/phan-mem-prokon1.png',
    img: 'https://www.cic.com.vn/upload_images/images/2026/DCS/phan-mem-prokon1.png',
    price: 'Liên hệ',
    description: 'Prokon là Phần mềm Phân tích và Thiết kế Kỹ thuật Kết cấu mạnh mẽ và toàn diện trong lĩnh vực thiết kế và phân tích kết cấu, được phát triển bởi Prokon Software Consultants.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'Prokon Software Consultants',
    app: 'Phân tích & Thiết kế Kết cấu',
    productType: 'Phần mềm',
    slides: [
      'https://www.cic.com.vn/upload_images/images/2026/DCS/phan-mem-prokon1.png',
      'https://www.cic.com.vn/upload_images/images/2026/DCS/phan-mem-prokon2.png',
      'https://www.cic.com.vn/upload_images/images/2026/DCS/phan-mem-prokon3.png',
      'https://www.cic.com.vn/upload_images/images/2026/DCS/phan-mem-prokon4.png',
      'https://www.cic.com.vn/upload_images/images/2026/DCS/phan-mem-prokon5.png'
    ],
    overviewHtml: `<p style="text-align: center;"><img alt="prokon-1" src="https://www.cic.com.vn/upload_images/images/2026/DCS/phan-mem-prokon1.png" style="width: 650px; max-width: 100%; height: auto;" /></p>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Giới thiệu tổng quan</strong></span></span></h2>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Prokon là một bộ giải pháp phần mềm kỹ thuật hỗ trợ toàn diện cho quá trình thiết kế, phân tích và chi tiết hóa kết cấu bê tông cốt thép, kết cấu thép, kết cấu liên hợp, gỗ và nền móng. Và Prokon cho phép người dùng sử dụng lựa chọn từng module riêng lẻ cho từng chuyên môn, hoặc có thể kết hợp sử dụng cho những bài toán phức tạp.</span></span></h2>

<p style="text-align: center;"><em><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Video giới thiệu tính năng phiên bản Prokon 5.3</span></span></em></p>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Các gói phần mềm</strong></span></span></h2>

<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Bộ phần mềm được chia thành nhiều module nhỏ, có khả năng phân tích thiết kế độc lập, và có khả năng liên kết với các module khác để thiết kế. Trong version 5 mới nhất hỗ trợ các gói modules sau:</span></span></p>

<ul className="list-disc pl-5 space-y-1">
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Structural Analysis - phân tích kết cấu công trình</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Concrete Design - Thiết kế bê tông cốt thép</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Steel Design - Thiết kế kết cấu thép</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Composite Design - Thiết kế kết cấu Composite</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">General Design - Thiết kế tổng hợp</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Geotechnical Design - Thiết kế địa kỹ thuật công trình</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Detailing - Triển khai chi tiết kết cấu</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Structural Integration - Tương tác với các phần mềm kết cấu khác</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Civil Design - Phân tích đường ống áp lực trong Autodesk Civil 3D</span></span></li>
</ul>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Vì sao chọn Prokon?</strong></span></span></h2>

<p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong><img alt="prokon-4" src="https://www.cic.com.vn/upload_images/images/2026/DCS/phan-mem-prokon4.png" style="width: 500px; max-width: 100%; height: auto;" /></strong></span></span></p>

<h2><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><em>1. Giao diện trực quan</em></span></span></h2>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Khác với các phần mềm quá học thuật thì Prokon có giao diện trực quan và dễ sử dụng. Kỹ sư sẽ không mất nhiều thời gian để làm quen và thành thạo</span></span></h2>

<p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img alt="prokon-5" src="https://www.cic.com.vn/upload_images/images/2026/DCS/phan-mem-prokon5.png" style="width: 500px; max-width: 100%; height: auto;" /></span></span></p>

<h2 style="text-align: justify;"><em><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">2. Tiêu chuẩn thiết kế đa dạng</span></span></em></h2>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Prokon nay đã tích hợp đầy đủ tiêu chuẩn quốc tế như Eurocode, BS (Anh), ACI (Mỹ), AS (Úc)… giúp doanh nghiệp dễ thực hiện các dự án khác nhau</span></span></h2>

<h2 style="text-align: justify;"><em><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">3. Tương tác và tích hợp cao</span></span></em></h2>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Prokon có khả năng tương thích và kết nối mượt mà với các phần mềm BIM phổ biến như Revit, giúp tối ưu hóa công việc cũng như không gây gián đoạn trong phối hợp công việc.</span></span></h2>

<h2 style="text-align: justify;"><em><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">4. Độ tin cậy tuyệt đối</span></span></em></h2>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Qua hơn 30 năm phát triển và được kiểm chứng bởi hàng ngàn dự án chất lượng trên toàn cầu, kết quả tính toán từ Prokon luôn đạt độ chính xác và độ tin cậy cao nhất.</span></span></h2>`,
    featuresHtml: `<h2 style="text-align: justify;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tính năng kỹ thuật nổi bật</span></span></strong></h2>

<h3 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><em>1. Phân tích kết cấu dạng khung và phần tử hữu hạn FEA</em></span></span></h3>

<p style="text-align: center;"><img alt="prokon-2" src="https://www.cic.com.vn/upload_images/images/2026/DCS/phan-mem-prokon2.png" style="width: 500px; max-width: 100%; height: auto;" /></p>

<p>- Hỗ trợ phân tích tĩnh và động lực học (dao động, động đất) cho mô hình 2D và 3D<br/>- Công cụ Sumo và Frame giúp dựng mô hình và gán tải trọng nhanh chóng</p>

<h3 style="text-align: justify;"><em><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">2. Thiết kế bê tông cốt thép RC</span></span></em></h3>

<p>- Tính toán và thiết kế chi tiết cột, dầm, sàn, vách và bể chứa nước<br/>- Tự động xuất bản vẽ chi tiết cốt thép (rebar detailing) tương thích trực tiếp với AutoCAD hoặc Revit</p>

<h3 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><em>3. Thiết kế cấu kiện liên kết thép (Steel)</em></span></span></h3>

<p style="text-align: center;"><img alt="prokon-3" src="https://www.cic.com.vn/upload_images/images/2026/DCS/phan-mem-prokon3.png" style="width: 500px; max-width: 100%; height: auto;" /></p>

<p>- Thiết kế các cấu kiện thép chịu lực (dầm, cột, giàn thanh) theo nhiều tiêu chuẩn quốc tế.<br/>- Module thiết kế thép mạnh mẽ, cho phép kiểm tra chi tiết các mối nối bu lông, mối hàn từ đơn giản tới phức tạp</p>

<h3 style="text-align: justify;"><em><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">4. Phân tích về địa kỹ thuật (Geotechnical)</span></span></em></h3>

<p>- Tính toán móng đơn, móng băng, móng bè, móng cọc và tường chắn đất<br/>- Hỗ trợ phân tích độ ổn định mái dốc và áp lực đất</p>

<h2><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Các tính năng khác</span></span></strong></h2>

<h3><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Thiết kế kết cấu</strong></span></span></h3>

<p><em><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Prokon hỗ trợ thiết kế đa dạng các thành phần kết cấu như:</span></span></em></p>

<ul className="list-disc pl-5 space-y-1">
	<li>Concrete slabs - Sàn bê tông</li>
	<li>Punching shear - Tính toán chọc thủng</li>
	<li>Concrete columns and beams - Tính toán cột và dầm</li>
	<li>Prestressed beams - Tinh toán dầm ứng suất trước</li>
	<li>Composite columns and beams - Tính toán cột và dầm composite</li>
	<li>Timber beams - Tính toán dầm gỗ</li>
	<li>Masonry beams - Tính toán dầm xây</li>
	<li>Plate girders - Tính toán dầm dạng tấm</li>
	<li>Foundations - Tính toán móng</li>
	<li>Steel connections - Tính toán mối nối thép</li>
	<li>Concrete anchors - Tính toán neo bê tông</li>
	<li>Masonry walls - Tính toán tường chịu lực</li>
</ul>

<h3><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tích hợp và tương thích</span></span></strong></h3>

<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Phần mềm này tương thích với nhiều phần mềm CAD và BIM phổ biến như AutoCAD, Revit và Tekla Structures, giúp dễ dàng trao đổi dữ liệu và làm việc hiệu quả trong môi trường thiết kế đa nền tảng.</span></span></p>

<h3><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Báo cáo và tài liệu</span></span></strong></h3>

<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Prokon cung cấp các công cụ tạo báo cáo chi tiết và tài liệu thiết kế, giúp trình bày kết quả phân tích và thiết kế một cách rõ ràng và chuyên nghiệp.</span></span></p>

<h2><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Prokon hỗ trợ các tiêu chuẩn thiết kế sau</span></span></strong></h2>

<p><strong>Hỗ trợ các tiêu chuẩn thiết kế thép:</strong> AISC - 1989 ASD, AISC - 1993 LRFD, AS 4100 - 1998, BS5950 - 1990, BS5950 - 2000, CSA-S16.1 - 1994, CSA-S16 - 2001, CSA-S16 - 2009, CSA-S16 - 2014, Eurocode 3 - 2005, GBJ 17 - 1988, IS800 - 1984, IS800 - 2007, SABS0162 - 1984, SABS0162 - 1993, SANS10162 - 2005</p>

<p><strong>Hỗ trợ các tiêu chuẩn thiết kế bê tông:</strong> ACI 318-1989, ACI 318-2005, ACI 318-2011, ACI 318-2014, AS3600 - 2001, AS3600 - 2009, BS 8110 - 1985, BS 8110 - 1997, CP 65 - 1999, CSA-A23.3-2004 (R2010), CSA-A23.3-1994, Eurocode 2 - 1992, Eurocode 2 - 2004, HK Concrete - 2004, HK Concrete - 2013, IS:456 - 2000, NZS 3101 - 2006, SABS 0100 - 2000</p>

<p><strong>Hỗ trợ các tiêu chuẩn thiết kế gỗ:</strong> BS 5268 - 1991, SABS 0163 - 2001, SANS 10163-2 - 2003</p>

<p><strong>Masonry design codes:</strong> ACI 530 - 1999, BS5628 - 1985, SABS 0164 - 1992</p>

<p><strong>Seismic & Wind design codes:</strong> TMH 7, UBC 1994, SABS 0160 - 1989, IS1893 - 2002, SANS 10160, Eurocode 8 - 2003, CP3 - 1972, SANS 10160-3:2011, BS 12056-3 - 2000</p>

<p><strong>Reinforced concrete detailing codes:</strong> BS 4466 - 1989, BS 8666 - 2005, SANS 282 - 2004, SANS 282 - 2011</p>`,
    videoUrl: 'https://www.youtube.com/embed/HcM67QKTYXw'
  },
  {
    id: 3,
    name: 'AllPlan Engineering - Giải pháp BIM cho các kỹ sư kết cấu',
    icon: 'https://www.cic.com.vn/images/products/2022/07/18/original/allplan-icon_1658112091.jpg',
    img: 'https://www.cic.com.vn/images/products/2022/07/18/large/allplan-CD.jpg',
    price: 'Liên hệ',
    description: 'ALLPLAN là công cụ có thể làm việc được trên cả môi trường 2D và 3D, giao tiếp tốt với các phần mềm khác và đưa ra chất lượng tốt nhất, đáp ứng các dự án xây dựng phức tạp và yêu cầu cao về...',
    field: 'Xây dựng & Hạ tầng',
    brand: 'ALLPLAN (Nemetschek)',
    app: 'Giải pháp BIM & Kết cấu',
    productType: 'Phần mềm',
    slides: [
      'https://www.cic.com.vn/images/products/2022/07/18/large/allplan-CD.jpg'
    ],
    overviewHtml: `<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>ALLPLAN</strong> là một trong số ít giải pháp lý tưởng có thể thực hiện được những yêu cầu sau</span></span></p>

<ul className="list-disc pl-5 space-y-1">
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Giải pháp BIM và CAD trên cùng 1 nền tảng</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Mô hình, môi trường bản vẽ và chi tiết thép trong cùng 1 giải pháp phần mềm</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Nền tảng Open BIM giúp cho việc phối hợp các bộ môn thuận tiện hơn</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Lập mô hình cho các kết cấu có hình dạng phức tạp một cách nhanh chóng và chính xác</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Triển khai nhanh chi tiết thép 3D, bản vẽ shop và khối lượng</span></span></li>
</ul>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Thiết kế hỗ trợ BIM</strong></span></span></h2>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Phần mềm Allplan cho phép bạn xây dựng mô hình 3D trước khi đưa vào thực tế, điều này giúp chỉ ra những lỗi sai và xung đột trong giai đoạn thiết kế để tránh những trì hoãn khi thi công</span></span></p>

<p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img alt="allplan-2" src="https://www.cic.com.vn/upload_images/images/2022/07/13/allplan-2.jpg" style="width: 600px; max-width: 100%; height: auto;" /></span></span></p>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Thiết kế tự do và liền mạch</strong></span></span></h2>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Với lõi mô hình hóa Parasolid từ Siemens được tích hợp vào Allplan, giúp người dùng dựng các mô hình 3D dễ dàng hơn. Allplan hỗ trợ toàn bộ quá trình thiết kế trong một hệ thống duy nhất - từ bản thảo ban đầu cho đến bản vẽ gia cố và bố trí chung cuối cùng.</span></span></p>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Bản vẽ thiết kế có độ chuẩn xác cao</strong></span></span></h2>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Các bản vẽ 2D/3D luôn được cập nhật nhanh. Ngoài ra, các công cụ thiết kế và layout mạnh mẽ cung cấp độ chính xác tối ưu khi thiết kế bản vẽ kiến trúc.</span></span></p>

<p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img alt="allplan-4" src="https://www.cic.com.vn/upload_images/images/2022/07/13/allplan-4.jpg" style="width: 600px; max-width: 100%; height: auto;" /></span></span></p>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Bóc tách khối lượng chuẩn xác</strong></span></span></h2>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Với độ tin cậy tối đa cho việc bóc tách khối lượng, thống kê, tính toán trong mô hình 3D.</span></span></p>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Dễ dàng trao đổi thông tin</strong></span></span></h2>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Dễ dàng trao đổi dữ liệu với các đối tác, phần mềm hỗ trợ nhiều định dạng tập tin bao gồm DWG, DXF, DGN, IFC4 và PDF.</span></span></p>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Làm việc nhóm hiệu quả</strong></span></span></h2>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Với Allplan, bạn có thể cùng làm việc với nhóm ở nhiều địa điểm khác nhau. Cùng với Bimplus và AllplanShare dựa trên dịch vụ dữ liệu đám mây.</span></span></p>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Nền tảng 3D mạnh mẽ</strong></span></span></h2>

<ul className="list-disc pl-5 space-y-1">
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tạo mô hình nhanh chóng từ AutoCAD;</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Giao diện đa màn hình, 2D và 3D xuất hiện cùng lúc giúp cho người dùng thao tác trong môi trường 2D nhưng tạo ra mô hình 3D;</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tuỳ chỉnh cao độ các cấu kiện từ đơn giản tới nâng cao giúp cho việc tiết kiệm thời gian cho việc thay đổi thiết kế;</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Quản lý bản vẽ, cấu kiện khoa học giúp tăng tốc độ làm việc, tối ưu hoá mô hình và dung lượng file.</span></span></li>
</ul>

<p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img alt="allplan-3" src="https://www.cic.com.vn/upload_images/images/2022/07/13/allplan-3.jpg" style="width: 600px; max-width: 100%; height: auto;" /></span></span></p>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Mô hình thép và thống kê thép hiệu quả nhất</strong></span></span></h2>

<ul className="list-disc pl-5 space-y-1">
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Mô hình thép dễ dàng</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Thống kê tự động, nhanh chóng và chuẩn xác</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Hỗ trợ tự động nối thép, rải thép theo chuẩn Việt Nam</span></span></li>
</ul>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Tự động tạo, rải thép, thống kê cho dầm</strong></span></span></h2>

<ul className="list-disc pl-5 space-y-1">
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Thao tác quen thuộc, không mất thời gian tìm hiểu và học phần mềm</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Thực hiện trên từng khối một cách nhanh chóng</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Trình bày theo tiêu chuẩn Việt Nam</span></span></li>
</ul>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Xem trước các tệp nhập trực tiếp từ Revit</strong></span></span></h2>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Lần đầu tiên các tệp Revit có thể được nhập trực tiếp trong phạm vi chế độ xem trước về mặt kỹ thuật. Điều này có nghĩa là các mô hình Revit có thể được nhập vào Allplan và sử dụng mà không cần chuyển đổi chúng sang định dạng IFC trước. Trong quá trình nhập, các đối tượng Allplan nguyên bản như tường, cột, trần nhà, dầm, cửa sổ, cửa ra vào và mái nhà được tạo ra. Khi nhập tệp DWG / DXF, hiện có thể chuyển đổi tọa độ UTM ở chế độ chuyên gia, bao gồm việc lựa chọn trực tiếp tệp NTv2.</span></span></p>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Tương tác giữa Allplan và Allplan Bimplus</strong></span></span></h2>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Để tối ưu hóa sự tương tác giữa Allplan và Allplan Bimplus, bây giờ bạn có thể khởi động BIM Explorer trực tiếp từ Allplan mà không cần bất kỳ bước trung gian nào. Điều này giúp bạn có thể xem mô hình của chính mình cùng với các mô hình từ các ngành khác (ví dụ: MEP) và đặt chúng trong bối cảnh tổng thể. Ngoài ra, hiện đã hỗ trợ tải xuống phần gia cố từ Allplan Bimplus để thêm chi tiết trong Allplan.</span></span></p>`
  },
  {
    id: 4,
    name: 'KIW - Phần mềm tính toán, thiết kế khung thép tiền chế',
    icon: 'https://www.cic.com.vn/images/products/2019/11/01/original/kiwico_1572578836.jpg',
    img: 'https://www.cic.com.vn/images/products/2019/11/01/large/13_1572592543_1.png',
    price: '2.000.000 VNĐ',
    description: 'KIW là phần mềm tự động hoá phân tích thiết kế kết cấu khung thép tiền chế đưa ra kết quả cuối cùng là bản vẽ kỹ thuật thi công đối với khung thép có các cấu kiện thanh tiết diện chữ I. Đặc biệt...',
    field: 'Xây dựng & Hạ tầng',
    brand: 'CIC Tech',
    app: 'Thiết kế Khung thép',
    productType: 'Phần mềm',
    slides: [
      'https://www.cic.com.vn/images/products/2019/11/01/large/13_1572592543_1.png',
      'https://www.cic.com.vn/images/products/2019/11/01/large/18_1572592545_1.png',
      'https://www.cic.com.vn/images/products/2019/11/01/large/25_1572592545_1.png',
      'https://www.cic.com.vn/images/products/2019/11/01/large/27_1572592545_1.png',
      'https://www.cic.com.vn/images/products/2019/11/01/large/32_1572592546_1.png'
    ],
    overviewHtml: `<h2 style="text-align: justify;"><strong>GIỚI THIỆU PHẦN MỀM TÍNH TOÁN, THIẾT KẾ KHUNG THÉP TIỀN CHẾ (ZAMIL) - KIW</strong></h2>

<p style="text-align: justify;">KIW đã khẳng định được vị trí dẫn đầu của mình về giải pháp ứng dụng công nghệ thông tin trong lĩnh vực xây dựng kết cấu nhà thép. Sản phẩm đã dành được sự công nhận như là một chuẩn mực cho công nghệ phân tích tính toán và thiết kế kết cấu khung thép tiền chế tại Việt Nam. KIW là phần mềm tự động hoá phân tích thiết kế kết cấu khung thép tiền chế đưa ra kết quả cuối cùng là bản vẽ kỹ thuật thi công đối với khung thép có các cấu kiện thanh tiết diện chữ I. Đặc biệt, KIW có khả năng thiết kế tối ưu đảm bảo điều kiện chịu lực và tiết kiệm vật liệu nhất.</p>`,
    featuresHtml: `<h2 style="text-align: justify;"><strong>Nhập dữ liệu</strong></h2>

<p style="text-align: justify;">- Giao diện đồ hoạ tương tác với người sử dụng.<br/>
- Thư viện các sơ đồ kết cấu mẫu hay gặp trong thực tế như khung 1 hoặc nhiều nhịp, các nhịp có thể có độ dốc mái khác nhau.<br/>
- Xét tiết diện chữ I của cấu kiện thép, có dạng định hình theo tiêu chuẩn hoặc dạng tiết diện tổ hợp từ thép tấm.<br/>
- Đầy đủ các dạng tải trọng tác động trên cấu kiện thanh (tải trọng phân bố đều, tải trọng hình thang, tải trọng hình tam giác, tải trọng dọc trục) và tải trọng nút (tải trọng tập trung, chuyển vị cưỡng bức gối tựa). Tự động dồn một số dạng tải trọng như tải trọng gió theo TCVN 2737-95, tải trọng bản thân, tải trọng tường, tải trọng mái.<br/>
- Đầy đủ thông số thiết kế theo Tiêu chuẩn với các cấu kiện dầm, cột trong hệ kết cấu phẳng.<br/>
- Đối với bài toán kiểm tra, chương trình thực hiện kiểm tra cường độ và ổn định đối với các cấu kiện trên cơ sở tiết diện do người sử dụng xác định trước. Đối với bài toán thiết kế, chương trình tự động xác định tiết diện tối ưu cho các cấu kiện chịu lực chính, đảm bảo điều kiện bền và ổn định, đồng thời đảm bảo trọng lượng vật liệu là thấp nhất.</p>

<h2 style="text-align: justify;"><strong>Khả năng phân tích thiết kế</strong></h2>

<p style="text-align: justify;">- Sử dụng phương pháp phần tử hữu hạn để xác định nội lực.<br/>
- Tự động tổ hợp nội lực, xác định đường bao nội lực cho từng cấu kiện thanh.<br/>
- Thiết kế/kiểm tra các cấu kiện thanh theo tiêu chuẩn Việt Nam hoặc tiêu chuẩn Mỹ (AISC-ASD hoặc AISC-LRFD)<br/>
- Thiết kế các chi tiết liên kết theo tiêu chuẩn Việt Nam.<br/>
- Việc tính toán theo phương pháp lặp trong bài toán thiết kế cho phép xác định tiết diện tối ưu cho các phần tử kết cấu, dẫn tới tiết kiệm vật liệu một cách tối đa.</p>

<h2 style="text-align: justify;"><strong>Thể hiện kết quả</strong></h2>

<p style="text-align: justify;">- Môi trường đồ hoạ thể hiện các kết quả tính như sơ đồ kết cấu, tải trọng, chuyển vị, biểu đồ nội lực (mô men, lực cắt, lực dọc), biểu đồ bao nội lực, sơ đồ tiết diện các cấu kiện thanh.<br/>
- Xem và in chi tiết các kết quả tính cho từng nút và từng phần tử trong giao diện đồ hoạ.<br/>
- Đầy đủ các báo cáo về nội lực của các phần tử thanh, chuyển vị của các nút. Các kết quả thiết kế/kiểm tra cấu kiện thép, thiết kế chi tiết.<br/>
- Chuyển toàn bộ kết quả thiết kế dưới dạng bản vẽ thiết kế kỹ thuật (bao gồm bản vẽ khung, các mặt cắt tiết diện, các chi tiết liên kết, bảng thống kê vật liệu sử dụng) vào AutoCAD để thực hiện in ấn.</p>

<p style="text-align: center;"><img alt="kiw-tiet-dien" src="https://cic.com.vn/uploads/images/KIW/KIWTietDien.png" style="width: 337px; max-width: 100%; height: auto;" /></p>`,
    videoUrl: 'https://www.youtube.com/embed/f3sCVDyiSB8'
  },
  {
    id: 5,
    name: 'MagiCAD: Giải pháp BIM toàn diện cho Kỹ thuật Cơ khí, Điện, Đường ống (MEP)',
    icon: 'https://www.cic.com.vn/images/products/2024/08/20/large/MagiCAD01_1724146671_1.jpg',
    img: 'https://www.cic.com.vn/images/products/2024/08/20/large/MagiCAD01_1724146671_1.jpg',
    price: 'Liên hệ',
    description: 'MagiCAD là một giải pháp toàn diện cho thiết kế MEP (Mechanical, Electrical and Plumbing), được tích hợp chặt chẽ mượt mà với AutoCAD và Revit, mang đến một giải pháp toàn diện từ thiết kế đến quản lý dự án.',
    field: 'Cơ điện MEP & Hạ tầng',
    brand: 'MagiCAD Group',
    app: 'Thiết kế MEP & BIM',
    productType: 'Phần mềm',
    slides: [
      'https://www.cic.com.vn/images/products/2024/08/20/large/MagiCAD01_1724146671_1.jpg'
    ],
    overviewHtml: `<h2 style="text-align: justify;"><strong>MagiCAD là gì?</strong></h2>

<p style="text-align: justify;">MagiCAD là một giải pháp toàn diện cho thiết kế MEP (Mechanical, Electrical and Plumbing), được tích hợp chặt chẽ mượt mà với AutoCAD và Revit, mang đến một giải pháp toàn diện từ thiết kế đến quản lý dự án. Đặc biệt, để phục vụ riêng cho công việc MEP thì MagiCad còn tích hợp miễn phí một bộ thư viện tương đối lớn các thiết bị của các nhà sản xuất lớn trên thế giới.</p>

<h2 style="text-align: justify;"><strong>Tại sao nên chọn MagiCAD?</strong></h2>

<p style="text-align: justify;">MagiCAD giúp giải quyết các thách thức trong thiết kế MEP, bao gồm:</p>
<p style="text-align: justify;">- <strong>Các hoạt động phối hợp:</strong> Quản lý dữ liệu BIM, chia sẻ và trao đổi thông tin BIM giữa các kỹ sư MEP, kiểm tra xung đột.<br/>
- <strong>Điện:</strong> Quản lý hệ thống điện, giá cáp, đường dây, thiết bị và mô hình BIM với các bản vẽ chính xác hơn.<br/>
- <strong>Cơ khí:</strong> Thiết kế nhanh hệ thống thông gió, tính toán kích cỡ đường ống, cân bằng, áp suất rơi, xuất báo cáo.<br/>
- <strong>Đường ống:</strong> Tính toán ống (kích thước, cân bằng, mất áp, ...), thiết kế hệ thống đường ống, định vị thiết bị cần bảo dưỡng, bảo trì, nâng cấp.</p>

<p style="text-align: center;"><img alt="magicad-3" src="https://www.cic.com.vn/upload_images/images/2024/STC/MagiCAD-phan-mem3.jpg" style="width: 650px; max-width: 100%; height: auto;" /></p>

<h2 style="text-align: justify;"><strong>Các tính năng của MagiCAD</strong></h2>

<p style="text-align: justify;"><strong>1. Thiết kế 3D và 2D:</strong> Hỗ trợ thiết kế các hệ thống MEP trong cả không gian 2D và 3D, cung cấp công cụ tạo mô hình 3D chính xác.</p>

<p style="text-align: justify;"><strong>2. Tính toán và phân tích:</strong> Tính toán và phân tích cho hệ thống HVAC, chiếu sáng, cấp thoát nước, tải nhiệt, phân tích luồng không khí.</p>

<p style="text-align: justify;"><strong>3. Tự động hóa:</strong> Tự động hóa tạo và quản lý bản vẽ kỹ thuật, giảm thiểu công việc thủ công, tích hợp BIM.</p>

<p style="text-align: justify;"><strong>4. Thư viện thiết bị:</strong> Thư viện phong phú về các thiết bị, vật liệu MEP từ các nhà sản xuất lớn trên thế giới.</p>

<p style="text-align: center;"><img alt="magicad-2" src="https://www.cic.com.vn/upload_images/images/2024/STC/MagiCAD.jpg" style="width: 650px; max-width: 100%; height: auto;" /></p>

<table border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse: collapse; margin-top: 10px;"><thead style="background:#f1f5f9;"><tr><th>Dành cho nhà thiết kế</th><th>Dành cho nhà cung ứng</th></tr></thead><tbody><tr><td>► MagiCAD for AutoCAD<br/>► MagiCAD for Revit<br/>► Plugins<br/>► Selection and configuration tools<br/>► MagiCAD Cloud</td><td>► MagiCAD Cloud<br/>► Mô hình hóa thiết bị<br/>► Tích hợp cơ sở dữ liệu<br/>► Plugins & Selection Tools<br/>► Giải pháp tùy chỉnh</td></tr></tbody></table>

<p style="text-align: center; margin-top: 15px;"><img alt="magicad-4" src="https://www.cic.com.vn/upload_images/images/2024/STC/MagiCAD-phan-mem4.png.jpg" style="width: 650px; max-width: 100%; height: auto;" /></p>`
  },
  {
    id: 6,
    name: 'PRECISION TS2 - Máy cắt nhôm 2 đầu với lưỡi cắt mặt trước',
    icon: 'https://www.cic.com.vn/images/products/2022/09/27/original/emmegi-icon_1664252083.png',
    img: 'https://www.cic.com.vn/images/products/2022/09/27/large/PrecisionTS2.png',
    price: 'Liên hệ',
    description: 'Máy cắt nhôm 2 đầu điện tử PRECISION TS2 được phát triển bởi tập đoàn Emmegi- một hãng về công nghệ ngành nhôm hàng đầu thế giới',
    field: 'Cơ khí chế tạo & Thiết bị',
    brand: 'Emmegi (Italia)',
    app: 'Gia công Nhôm Kính',
    productType: 'Thiết bị',
    slides: [
      'https://www.cic.com.vn/images/products/2024/07/05/small/precisionts2_1720161021.png',
      'https://www.cic.com.vn/images/products/2022/09/27/large/PrecisionTS2.png'
    ],
    overviewHtml: `<h2 style="text-align: justify;"><strong>PRECISION TS2 - máy cắt nhôm hai đầu tốc độ cao và độ chính xác tuyệt vời</strong></h2>

<p style="text-align: justify;">Máy cắt nhôm 2 đầu điện tử PRECISION TS2 được phát triển bởi tập đoàn Emmegi - một hãng về công nghệ ngành nhôm hàng đầu thế giới.</p>

<p style="text-align: justify;">Các tính năng nổi bật:<br/>
- Trục nghiêng ảo thông minh của bộ phận cắt.<br/>
- Cơ chế kẹp phôi chính xác.<br/>
- Đầu bảo vệ tuyệt đối an toàn.<br/>
- Điều khiển hiện đại.<br/>
- Tải và dỡ phôi hiệu quả.</p>

<p style="text-align: justify;">PRECISION TS2 với 3 trục được điều khiển với hệ thống đầu di động và hệ thống quản lý điện tử tất cả các góc từ 45° (trong) đến 15°(ngoài), với độ chính xác đến từng phân độ tại 280 vị trí khác nhau. Khu vực làm việc của máy được dẫn động bằng một cặp xi lanh khí nén thủy lực. Bên cạnh đó là hệ thống trục quay ảo đi kèm với bộ phận cắt đã mang lại độ cứng tuyệt đối cho hệ thống, định vị và kẹp chặt profile một cách chính xác.</p>`,
    featuresHtml: `<p style="text-align: justify;"><strong>- Trục nghiêng ảo của bộ phận cắt:</strong> Độ nghiêng của mỗi đầu, lên đến 15°(ngoài) và 45° (trong) đối với cả nhôm và PVC, được thực hiện bằng hai thanh dẫn hướng tròn được đặt trên bốn cặp bánh thép. Định vị thông qua dải từ trường giúp tránh việc phải tham chiếu kích thước trục.</p>

<p style="text-align: justify;"><strong>- Kẹp phôi:</strong> Việc định vị phôi để cắt cực kỳ chính xác và an toàn bởi hai đầu kẹp ngang. Thiết bị kẹp ngang có rãnh cho phép chặn theo chiều dọc của thanh nhôm.</p>

<p style="text-align: justify;"><strong>- Đầu bảo vệ:</strong> Các đầu bảo vệ tự động polycarbonate chống trầy xước, dẫn động bởi xi lanh khí nén có thiết bị chống va đập giúp bảo vệ người vận hành trong quá trình gia công.</p>

<p style="text-align: justify;"><strong>- Điều khiển:</strong> Màn hình cảm ứng 10.4” và phần mềm được tùy biến trên Windows®, giảm hao phí và giảm thời gian tải - dỡ phôi.</p>

<p style="text-align: justify;"><strong>- Tải và dỡ phôi:</strong> Băng tải con lăn trên đầu di động để tải và dỡ phôi tiêu chuẩn hoặc trên đầu cố định cho tải từ phía bên trái.</p>`,
    videoUrl: 'https://www.youtube.com/embed/vF8k7AzEuCE'
  },
  {
    id: 7,
    name: 'Noggin 1000 - Radar xuyên đất kiểm tra, khảo sát chất lượng công trình giao thông',
    icon: 'https://www.cic.com.vn/images/products/2021/07/12/original/g8png_1626075680.png',
    img: 'https://www.cic.com.vn/images/products/2021/07/12/large/g2.PNG',
    price: 'Liên hệ',
    description: 'Hệ thống radar xuyên đất kiểm tra, khảo sát chất lượng công trình giao thông Noggin 1000 được sử dụng để phân tích, kiểm tra kết cấu mặt đường số lượng, chiều dày các phân lớp); xác định các điểm bất thường, cục bộ...',
    field: 'Khảo sát & Địa chất',
    brand: 'Sensor & Software (Canada)',
    app: 'Kiểm định & Khảo sát GPR',
    productType: 'Thiết bị',
    slides: [
      'https://www.cic.com.vn/images/products/2021/07/12/large/g2.PNG',
      'https://www.cic.com.vn/images/products/2021/07/12/large/g6.PNG',
      'https://www.cic.com.vn/images/products/2021/07/12/large/g3.PNG',
      'https://www.cic.com.vn/images/products/2021/07/12/large/g5.PNG',
      'https://www.cic.com.vn/images/products/2021/07/12/large/g1.PNG'
    ],
    overviewHtml: `<h2 class="MsoTitleCxSpFirst" style="margin:0in 0in 0.0001pt; text-align:justify"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><b id="docs-internal-guid-7c951b43-7fff-90e7-db57-4828829636f4">Công nghệ Radar xuyên đất</b></span></span></h2>

<p dir="ltr" style="text-align:justify"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Công nghệ Radar xuyên đất (GPR) là công nghệ tiên tiến nhất hiện nay, công nghệ ứng dụng với mục đích định vị các công trình ngầm tiện ích và kiểm tra các&nbsp;kết cấu bê tông. Sử dụng công nghệ radar xuyên đất để xuyên vào các lớp dưới mặt đất và bên trong các lớp bê tông để khảo sát và định vị tất cả các công trình tiện ích, các đối tượng, và các công trình ngầm khác. Đây là những rủi ro tiềm ẩn có thể ảnh hưởng trực tiếp và nghiêm trọng các dự án của khách hàng nếu chúng ta không phát hiện trước.</span></span></p>

<h2 dir="ltr" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><b id="docs-internal-guid-7c951b43-7fff-90e7-db57-4828829636f4">1. Khái niệm</b></span></span></h2>

<p dir="ltr" style="text-align:justify"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Radar xuyên đất là phương pháp địa vật lý hiện đại dựa trên cơ sở lý thuyết của trường sóng điện từ ở dải tần số từ 10 - 3.000 MHz để nghiên cứu cấu trúc và đặc tính của kết cấu vật chất nông với độ phân giải cao.</span></span></p>

<h2 dir="ltr" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><b id="docs-internal-guid-7c951b43-7fff-90e7-db57-4828829636f4">2. Nguyên lý hoạt động</b></span></span></h2>

<ul dir="ltr">
	<li style="text-align:justify"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Hệ thống thiết bị GPR gồm có các bộ phận chính: anten phát, anten thu, khối điều khiển, thiết bị hiển thị, nguồn điện.</span></span></li>
	<li style="text-align:justify"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Các xung sóng điện từ sẽ được truyền từ anten phát, lan truyền trong môi trường và phản xạ lại anten thu từ các mặt ranh giới hoặc các đối tượng có các thông số thuận lợi cho việc phản xạ sóng điện từ.</span></span></li>
	<li style="text-align:justify"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Thời gian lan truyền của sóng điện từ từ lúc phát đến lúc thu từ vài chục đến vài ngàn nano/giây. Thời gian trễ sẽ phản ánh chính xác thông tin về độ sâu của các đối tượng.</span></span></li>
	<li style="text-align:justify"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Độ sâu khảo sát, độ phân giải phụ thuộc lớn vào tần số của anten, năng lượng truyền và hằng số điện môi của đất.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></span></span></li>
</ul>

<h2 dir="ltr" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><b id="docs-internal-guid-7c951b43-7fff-90e7-db57-4828829636f4">3. Các ứng dụng tiêu biểu</b></span></span></h2>

<p dir="ltr" style="text-align:justify"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Công nghệ GPR được ứng dụng trong rất nhiều lĩnh vực: dò tìm và bản đồ hoá công trình ngầm, giao thông, xây dựng dân dụng, địa chất và môi trường, khảo cổ học, pháp lý và anh ninh, ...</span></span></p>

<h3 dir="ltr" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><b id="docs-internal-guid-7c951b43-7fff-90e7-db57-4828829636f4">3.1. Dò tìm &amp; bản đồ hoá công trình ngầm</b></span></span></h3>

<p style="margin:0in 0in 0.0001pt; text-align:justify"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Các hệ thống GPR có khả năng xác định được cả các vật thể kim loại và phi kim.Thiết bị cho phép dò tìm chính xác vị trí các công trình ngầm dưới lòng đất. Các hệ thống này thường sử dụng anten trong dải tần từ 210 – 1000 MHz, có phần mềm chuyên dụng hỗ trợ công tác bản đồ hoá công trình ngầm hoàn toàn tự động. Công nghệ thiết bị GPR có khả năng thu thập dữ liệu nhanh, chính xác hơn các công nghệ khác. Kết quả trực quan và không làm tổn hại đến hiện trạng bề mặt bên trên.</span></span></p>

<p style="margin:0in 0in 0.0001pt; text-align:justify">&nbsp;</p>

<p style="margin:0in 0in 0.0001pt; text-align:center"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span style="line-height:150%"><img alt="Underground-utility-mapping-market" src="https://www.cic.com.vn/upload_images/images/2020/03/25/Underground-utility-mapping-market.jpg" style="width:690px; height:300px" /></span></span></span></span></p>

<h4 style="margin:0in 0in 0.0001pt; text-align:justify">&nbsp;</h4>

<h4 style="margin:0in 0in 0.0001pt; text-align:justify">&nbsp;</h4>

<h4 style="margin:0in 0in 0.0001pt; text-align:justify">&nbsp;</h4>

<h3 dir="ltr" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><b id="docs-internal-guid-ab250925-7fff-c1a4-ccce-264dd99220ab">3.2. Ứng dụng trong giao thông</b></span></span></h3>

<p style="margin:0in 0in 0.0001pt; text-align:justify"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Radar xuyên đất giúp khảo sát nhanh và lập bản đồ chiều dày các phân lớp nền đường nhựa, nền đường băng sân bay, các lớp ba lát nền đường sắt, hoặc các hố sụt lún tiềm ẩn phục vụ công tác đánh giá chất lượng nền đường giao thông. Các hệ thống thường được gắn với xe kéo (ô tô, tàu hoả, ...) anten thường được sử dụng có tần số 1000MHz hoặc 2000 MHz.</span></span></p>

<h3 dir="ltr" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><b id="docs-internal-guid-5e907fe2-7fff-08bc-1331-d7e63d15af20">3.3. Ứng dụng trong xây dựng dân dụng</b></span></span></h3>

<p dir="ltr" style="text-align:justify"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Công nghệ GPR cũng là một trong những phương pháp kiểm tra không phá hủy (Non Destructive Testing – NDT). Trong ứng dụng này, các hệ thống GPR sử dụng anten tần số cao (khoảng 1,5 – 2 GHz) để định vị và bản đồ hoá lưới cốt thép, xác định chiều dày lớp bê tông phủ, và phát hiện khuyết tật nằm sâu trong các kết cấu bê tông cốt thép dày như tường, cột, sàn, cầu, ... mà không gây tổn hại đến kết cấu.</span></span></p>

<h3 dir="ltr" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><b id="docs-internal-guid-5e907fe2-7fff-08bc-1331-d7e63d15af20">3.4. Ứng dụng khảo sát địa chất và môi trường</b></span></span></h3>

<p dir="ltr" style="text-align:justify"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Hệ thống GPR có một dải nhiều sự lựa chọn anten với các tần số khác nhau. Thông thường từ 20 – 1.000 MHz, tùy theo mục đích sử dụng. Để khảo sát các lớp địa tầng hay dò tìm các khoảng trống dưới lòng đất, các khoáng sản, mạch nước ngầm - thường là ở vị trí khá sâu so với mặt đất, cần phải sử dụng những ăngten hoạt động ở tần số thấp (20 hoặc 50 MHz), biên độ lớn để sóng radar có thể đạt được đến độ sâu yêu cầu (lên tới vài chục mét tùy theo tần số anten và điều kiện địa chất).</span></span></p>

<p dir="ltr" style="text-align:justify"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Các hệ thống GPR có khả năng hoạt động ở những địa hình gồ ghề phức tạp. Đó cũng chính là một lợi thế nữa của công nghệ thiết bị GPR.</span></span></p>

<h3 dir="ltr" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><b id="docs-internal-guid-5e907fe2-7fff-08bc-1331-d7e63d15af20">3.5. Ứng dụng trong khảo cổ học</b></span></span></h3>

<p dir="ltr" style="text-align:justify"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Mục đích của việc sử dụng phương pháp GPR trong việc xác định các di tích cổ nằm sâu dưới lòng đất là nhằm tránh gây tổn hại các cổ vật, các di tích cổ trong quá trình khai quật. Thông thường, người ta sử dụng các anten trong dải tần từ 210 – 1000 MHz cho mục đích này. Có thể sử dụng hệ thống GPR với tần số cao, khoảng 1 – 2 GHz để kiểm tra, đánh giá tình trạng. Kiểm tra các hư hại bên trong các di tích cổ, cổ vật đang được lưu giữ.</span></span></p>

<h3 dir="ltr" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><b id="docs-internal-guid-5e907fe2-7fff-08bc-1331-d7e63d15af20">3.6. Ứng dụng trong pháp lý và an ninh</b></span></span></h3>

<p dir="ltr" style="text-align:justify"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Các hệ thống GPR sử dụng các anten có tần số khác nhau phục vụ trong nhiều mục đích khác nhau như: dò tìm công trình ngầm, xác người, vũ khí được cất giấu, bom, mìn,...</span></span></p>

<h2 dir="ltr" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><b>4. Các lợi ích khi sử dụng công nghệ Radar:</b></span></span></h2>

<ul dir="ltr">
	<li style="text-align:justify"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Cho phép xác định chính xác vị trí và chiều sâu đối tượng ngầm được cấu tạo từ mọi chất liệu: kim loại hoặc phi kim loại (nhựa, bê tông, ...), đồng thời phát hiện được các lớp địa tầng hoặc các bất thường trong cấu trúc ngầm dưới lòng đất.</span></span></li>
	<li style="text-align:justify"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Là một phương pháp kiểm tra không phá hủy giúp giảm thiểu các nguy cơ liên đới. Tuyệt đối không gây tổn hại đến kết cấu.</span></span></li>
	<li style="text-align:justify"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Hoàn toàn không bị ảnh hưởng bởi nhiễu điện từ khi sử dụng các anten có màn chắn.</span></span></li>
	<li style="text-align:justify"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Là phương pháp khảo sát phù hợp trong các khu đô thị, công nghiệp, kiến trúc, văn hóa. Ngay cả các khu vực nhạy cảm với môi trường.</span></span></li>
	<li style="text-align:justify"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Kết quả trực quan, sinh động, đáng tin cậy về kết cấu bên trong của các đối tượng.</span></span></li>
	<li style="text-align:justify"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tất cả các kết quả khảo sát&nbsp; thể được lưu lại trên bộ ghi dữ liệu để xử lý. Phân tích thêm bằng phần mềm chuyên dụng in ra như là một chứng nhận khảo sát.</span></span></li>
</ul>
`,
    featuresHtml: `<div>
<table align="center" hspace="0" style="border:undefined" vspace="0">
	<tbody>
		<tr>
			<td align="left" style="padding-top:0cm; padding-right:9.0pt; padding-bottom:0cm; padding-left:9.0pt" valign="top">
			<p style="margin: 0cm; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times=""><b><span style="line-height:150%">Hãng sản xuất:</span></b><span style="line-height:150%"> Sensor&amp;Software – Canada</span></span></span></span></span></p>

			<p style="margin: 0cm; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times=""><b><span style="line-height:150%">Model:</span></b><b> </b><span style="line-height:150%">Noggin 1000</span></span></span></span></span></p>

			<p style="margin: 0cm; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times=""><b><span style="line-height:150%">Ứng dụng:</span></b></span></span></span></span></p>

			<p style="margin: 0cm; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times="">- Phân tích, kiểm tra kết cấu mặt đường ( số lượng, chiều dày các phân lớp).</span></span></span></span></p>

			<p style="margin: 0cm; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times="">- Xác định các điểm bất thường, cục bộ như vết nứt, khoảng trống,…</span></span></span></span></p>

			<p style="margin: 0cm; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times="">- Định vị chính xác các đối tượng bên dưới bề mặt như: cốt thép, đường thoát nước,..</span></span></span></span></p>

			<p style="margin: 0cm; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times=""><b><span style="line-height:150%">Thông số kỹ thuật:</span></b></span></span></span></span></p>

			<p style="margin: 0cm; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times="">- Màn hình cảm ứng 8”, độ phân giải cao, hiển thị tốt dưới ánh sáng mặt trời.</span></span></span></span></p>

			<p style="margin: 0cm; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times="">- Mật độ điểm: 5000 points/trace.</span></span></span></span></p>

			<p style="margin: 0cm; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times="">- Tích hợp: Wifi, GPS</span></span></span></span></p>

			<p style="margin: 0cm; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times="">- Pin sạc Lithium.</span></span></span></span></p>

			<p style="margin: 0cm; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times="">- Bộ sạc: 100-240V AC</span></span></span></span></p>

			<p style="margin: 0cm; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times="">- Tần số Ăng ten: 1000 Mhz (125 – 375 MHz).</span></span></span></span></p>

			<p style="margin: 0cm; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times="">- Encoder tích hợp trên bánh xe, độ phân giải &lt; 0.05mm.</span></span></span></span></p>

			<p style="margin: 0cm; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times="">- Tùy chọn xe khảo sát theo địa hình.</span></span></span></span></p>

			<p style="margin: 0cm; text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times=""><img alt="" src="https://www.cic.com.vn/upload_images/images/2021/07/12/g1.PNG" style="width: 342px; height: 356px;" /></span></span></span></span></p>

			<p style="margin: 0cm; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times="">- Phần mềm phân tích dữ liệu 3D.</span></span></span></span></p>

			<p style="margin: 0cm; text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times=""><img alt="" src="https://www.cic.com.vn/upload_images/images/2021/07/12/g2.PNG" style="width: 446px; height: 210px;" /></span></span></span></span></p>

			<table class="MsoTableGrid" style="border-collapse:collapse; border:undefined">
				<tbody>
					<tr>
						<td style="width:106.2pt; padding:0cm 5.4pt 0cm 5.4pt" valign="top" width="142">
						<p style="margin: 0cm; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times="">- Kích thước:</span></span></span></span></p>
						</td>
						<td style="width:192.95pt; padding:0cm 5.4pt 0cm 5.4pt" valign="top" width="257">
						<p style="margin: 0cm; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times="">- Bộ điều khiển: 24 x 24 x 6.8 cm</span></span></span></span></p>
						</td>
					</tr>
					<tr>
						<td style="width:106.2pt; padding:0cm 5.4pt 0cm 5.4pt" valign="top" width="142">
						<p style="margin: 0cm; text-align: justify;">&nbsp;</p>
						</td>
						<td style="width:192.95pt; padding:0cm 5.4pt 0cm 5.4pt" valign="top" width="257">
						<p style="margin: 0cm; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times="">- Ăng ten: 30 x 15 x 11cm</span></span></span></span></p>
						</td>
					</tr>
					<tr>
						<td style="width:106.2pt; padding:0cm 5.4pt 0cm 5.4pt" valign="top" width="142">
						<p style="margin: 0cm; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times="">- Khối lượng:</span></span></span></span></p>
						</td>
						<td style="width:192.95pt; padding:0cm 5.4pt 0cm 5.4pt" valign="top" width="257">
						<p style="margin: 0cm; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times="">- Bộ điều khiển: 2.45 kg</span></span></span></span></p>
						</td>
					</tr>
					<tr>
						<td style="width:106.2pt; padding:0cm 5.4pt 0cm 5.4pt" valign="top" width="142">
						<p style="margin: 0cm; text-align: justify;">&nbsp;</p>
						</td>
						<td style="width:192.95pt; padding:0cm 5.4pt 0cm 5.4pt" valign="top" width="257">
						<p style="margin: 0cm; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:150%"><span new="" roman="" times="">- Ăng ten: 2.3 kg</span></span></span></span></p>
						</td>
					</tr>
				</tbody>
			</table>

			<p style="margin: 0cm; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><b><span style="line-height:150%"><span new="" roman="" times="">Bảo hành:</span></span></b><span style="line-height:150%"><span new="" roman="" times=""> 12 tháng</span></span></span></span></p>

			<p style="margin: 0cm; text-align: justify;">&nbsp;</p>
			</td>
		</tr>
	</tbody>
</table>
</div>
`,
    videoUrl: 'https://www.youtube.com/embed/3TTTwE7x6X8'
  },
  {
    id: 8,
    name: 'PLAXIS 3D - Phần mềm phân tích địa kỹ thuật và nền móng 3D',
    icon: 'https://www.cic.com.vn/images/products/2019/10/09/original/plaxis-3d_icon_1570610876.jpg',
    img: 'https://www.cic.com.vn/images/products/2019/10/09/large/Plaxis%203D_lon.jpg',
    price: 'Liên hệ',
    description: 'PLAXIS 3D | Giải pháp phần mềm 3D phần tử hữu hạn trong lĩnh vực địa kỹ thuật',
    field: 'Địa kỹ thuật & Địa vật lý',
    brand: 'Bentley Systems',
    app: 'Phân tích Địa kỹ thuật 3D',
    productType: 'Phần mềm',
    slides: [
      'https://www.cic.com.vn/images/products/2019/10/09/large/Plaxis%203D_icon.jpg',
      'https://www.cic.com.vn/images/products/2019/10/09/large/Plaxis%203D_lon.jpg',
      'https://www.cic.com.vn/images/products/2022/06/14/large/PLAXIS%203D%20Tunnel%20rock%20bolts.jpg'
    ],
    overviewHtml: `<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img src="https://www.cic.com.vn/upload_images/images/2019/10/09/Capture(2).JPG" style="margin-right: 10px; float: left; width: 200px; height: 200px;" /><strong>PLAXIS 3D</strong>&nbsp;bộ phần mềm 3D phần tử hữu hạn mạnh mẽ trong mô hình, phân tích ổn định và biến dạng của kết cấu đất, đá trong lĩnh vực địa kỹ thuật công trình. PLAXIS được sử dụng rộng rãi trên toàn cầu bởi các công ty hàng đầu về địa kỹ thuật, các viện nghiên cứu, các kỹ sư&nbsp;xây dựng và kỹ sư địa kỹ thuật trong ngành xây dựng và địa chất công trình. Ứng dụng trong các bài toán về đào đất, đắp đất, đào hầm, hố đào sâu, khai khoáng, năng lượng và môi trường...<br />
<br />
<img alt="PLAXIS 3D ban quyen, Gia phan mem PLAXIS 3D, phan mem PLAXIS 3D, Mua phan mem PLAXIS 3D" src="https://www.cic.com.vn/upload_images/images/2019/10/09/PLAXIS%203D%20ban%20quyen%2C%20Gia%20phan%20mem%20PLAXIS%203D%2C%20phan%20mem%20PLAXIS%203D%2C%20Mua%20phan%20mem%20PLAXIS%203D.jpg" style="width: 600px; height: 400px;" /></span></span><br />
&nbsp;</p>

<hr />
<h2 style="text-align: center;"><br />
<span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Các modules mở rộng</strong></span></span></h2>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>PLAXIS 3D PlaxFlow:</strong>&nbsp;3D PlaxFlow is an add-on module to PLAXIS 3D. Groundwater flow is an important issue in many engineering fields such as geotechnical, environmental and hydrological engineering. In order to take groundwater flow into ac in geotechnical software applications, advanced models for the simulation of the unsaturated, time-dependent and anisotropic behaviour of soil are required.<br />
<br />
<strong>PLAXIS 3D Dynamis: </strong>3D Dynamics is an add-on module to PLAXIS 3D. Soil and structures are often not only subjected to static loads due to construction in and on the ground surface but also to dynamic loads. When loads are powerful, like for example earthquakes, they may cause severe damages. Vibrations may occur either man-made or natural. In urban areas, vibrations can be generated due to pile driving, vehicle movement, heavy machinery or train travel. The source of natural vibrations in the subsoil is earthquakes. With the Dynamics module PLAXIS can analyse the effects of vibrations in the soil.</span></span></p>

<hr />
<h2 style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Modelling</strong></span></span></h2>

<ul>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Elastoplasticity for beams and plates</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Revolve around axis tool (VIP)</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">CAD export (VIP)</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Non-linear geogrids: Elastoplastic (N-ε)&amp;Viscoelastic (time-dependent)</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Cross and parallel permeability in interfaces</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Polar &amp; rectangular array (VIP)</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Easy definition of Rock bolts in Tunnel Designer (VIP)</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Define excavation sequence in the tunnel designer (VIP)</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Automatic generation of staged construction phases for tunnels (VIP)</span></span></li>
</ul>

<div style="text-align: center;">&nbsp;</div>

<h2 style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Material Models</strong></span></span></h2>

<div>
<ul>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">UBCSand (VIP)</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">User Defined Soil Models (VIP)</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Soft Soil (with and without creep)</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Sekiguchi-Ohta, Viscid &amp; Inviscid (VIP)</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">NGI-ADP model (VIP)</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Jointed Rock</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Hoek-Brown with Parameter Guide (VIP)</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">HS Small strain stiffness</span></span></li>
</ul>

<div>
<ul>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Hardening Soil</span></span></li>
</ul>

<hr />
<h2 style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Calculations&nbsp;</strong><img alt="" src="https://www.cic.com.vn/upload_images/images/2019/10/09/plaxis%203d%20caculate.jpg" style="width: 300px; height: 248px; float: right;" /></span></span></h2>

<ul>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Field stress initial calculation type (VIP)</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Full 64-bit Software</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Well-proven and robust calculation procedures</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Pseudo-static analysis</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Plastic calculation, consolidation analysis and safety analysis</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Multicore computing (VIP)</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Facilities for steady-state groundwater flow calculations, including flow-related material parameters, boundary conditions, drains and wells.</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Convenient and intuitive Phase explorer</span></span></li>
	<li><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Automatic regeneration of construction stages for geometric changes</span></span></li>
</ul>

<div>
<hr />
<h2 style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Results</strong></span></span></h2>

<ul>
	<li>
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Change the number of significant digits shown</span></span></p>
	</li>
	<li>
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Structural forces cylindrical and square volume piles</span></span></p>
	</li>
	<li>
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Realistic assessment of stresses and displacements</span></span></p>
	</li>
	<li>
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Output Model Explorer</span></span></p>
	</li>
	<li>
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Movable cross-sections</span></span></p>
	</li>
	<li>
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Extensive report and movie Generator</span></span></p>
	</li>
	<li>
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Contour, shading, iso-surface and vectors plots</span></span></p>
	</li>
	<li>
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Advanced data slicing</span></span></p>
	</li>
</ul>
</div>
</div>
</div>

<p style="text-align: center;">&nbsp;</p>
`,
    featuresHtml: `<div class="clearfix ma15 tinhnang text-center" id="detailFT0">
<h2 style="font-size: 40px; text-align: justify;" title="Lợi ích chính"><span style="font-family:Times New Roman,Times,serif;"><strong new="" roman="" style="font-family: " times="">Fast and efficient finite element model creation</strong></span><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img src="https://www.consoft.vn/uploads/Z1-4_fw_(1).png" style="margin-right: 10px; float: left; width: 550px; height: 350px;" /></span></span></h2>

<div class="ma15 text-left">
<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">The user-friendly interface guides the user to efficiently create models with a logical geotechnical workflow. Via Boreholes users can define complex soil profiles or geological cross-sections. In the Structures mode, structural elements, like piles, anchors, geotextiles, and prescribed loads and displacements can be defined. Geometry can also be imported from CAD-files. The automatic meshing procedure creates a&nbsp;With Staged Construction users can accurately model the construction process, by activating and deactivating soil clusters and structural elements in each calculation phase. With plastic, consolidation and safety analysis calculation type,&nbsp; a broad range of geotechnical problems can be analyzed. Constitutive models range from simple linear to advanced highly non-linear models&nbsp;wide range of soil and rock behaviour can be simulated. Well proven and robust calculation procedures ensure converging calculations and accurate results. With multi-core calculations and 64-bit architecture PLAXIS can deal with the largest and most complex models.finite element mesh almost immediately.</span></span><br />
&nbsp;</p>

<h3 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img src="https://www.consoft.vn/uploads/Z2-2_fw_.png" style="margin-right: 10px; float: right; width: 550px; height: 250px;" /></span></span></h3>

<p style="text-align: justify;">&nbsp;</p>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Realistic assessment of stresses and displacements</strong></span></span></h2>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">With Staged Construction users can accurately model the construction process, by activating and deactivating soil clusters and structural elements in each calculation phase. With plastic, consolidation and safety analysis calculation type,&nbsp; a broad range of geotechnical problems can be analyzed. Constitutive models range from simple linear to advanced highly non-linear&nbsp;models&nbsp;&nbsp;wide&nbsp;range of soil and rock behaviour can be simulated. Well proven and robust calculation procedures ensure converging calculations and accurate results. With multi-core calculations and 64-bit architecture PLAXIS can deal with the largest and most compl</span></span></p>

<h3 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img src="https://www.consoft.vn/uploads/Z3-4_fw_.png" style="margin-right: 10px; float: left; width: 500px; height: 300px;" /></span></span><br />
&nbsp;</h3>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Powerful and versatile&nbsp;post processing</strong></span></span></h2>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">The versatile Output program offers various ways to display forces, displacements, stresses, and flow data in contour, vector and iso-surface plots. Cross-section tools allow more detailed analysis of results. Data can be copied from tables or via&nbsp;Python based&nbsp;scripting for further processing purposes outside of PLAXIS. The Curve manager enables graph creation, plotting various results types from available calculation data.ex models.</span></span></p>
</div>

<div class="clear" style="height: 10px; text-align: justify;">&nbsp;</div>

<div class="ma15" id="content-tab" style="text-align: justify;">&nbsp;</div>

<div class="clear" style="height: 30px; text-align: justify;">&nbsp;</div>

<h2 style="text-align: justify;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Mô hình</span></span></strong></h2>
</div>

<ul>
	<li style="text-align: justify;">&nbsp;<span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Change the number of significant digits shown</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Structural forces from cylindrical volume piles</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Realistic assessment of stresses and displacements</span></span></li>
</ul>

<div class="clearfix ma15 tinhnang text-center" id="detailFT1">
<div class="ma15 text-left">
<ul>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Output Model Explorer</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Movable cross-sections</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Extensive report and movie Generator</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Contour, shading, iso-surface and vectors plots</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Advanced data slicing</span></span></li>
</ul>
</div>

<div class="clear" style="height: 10px; text-align: justify;">&nbsp;</div>

<h2 class="ma15" id="content-tab" style="text-align: justify;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Thiết kế</span></span></strong></h2>
</div>

<div class="clearfix ma15 tinhnang text-center" id="detailFT2">
<div class="ma15 text-left">
<ul>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">User Defined Soil Models (VIP)</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Soft Soil creep</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Soft soil</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Sekiguchi-Ohta, Viscid &amp; Inviscid (VIP)</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">NGI-ADP model (VIP)</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Mohr-Coulomb</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Modified Cam Clay</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Jointed Rock</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">HS Small strain stiffness</span></span></li>
</ul>
</div>

<div class="clear" style="height: 10px; text-align: justify;">&nbsp;</div>

<h2 class="ma15" id="content-tab" style="text-align: justify;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tính toán</span></span></strong></h2>
</div>

<div class="clearfix ma15 tinhnang text-center" id="detailFT3">
<div class="ma15 text-left">
<ul>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Reduce required project disk space by changing the saved step interval</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">New initial phase calculation type: Field Stress (VIP)</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Full 64-bit release with performance improvements</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Well-proven and robust calculation procedures</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Pseudo-static analysis</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Plastic calculation, consolidation analysis and safety analysis</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Multicore computing (VIP)</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Facilities for steady-state groundwater flow calculations, including flow-related material parameters, boundary conditions, drains and wells.</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Convenient and intuitive Phase explorer</span></span></li>
</ul>
</div>

<div class="clear" style="height: 10px; text-align: justify;">&nbsp;</div>

<h2 class="ma15" id="content-tab" style="text-align: justify;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Xuất kết quả</span></span></strong></h2>
</div>

<div class="clearfix ma15 tinhnang text-center" id="detailFT4">
<div class="ma15 text-left">
<ul>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Design of stable stope panels and pillars</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Wellbore stability analysis</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Stress changes and surface settlement due to reservoir depletion</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Trim and Extend functionality</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Python integration in Expert Menu (VIP)</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Polar Array (VIP)</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">New Embedded beam behavior type: Grout Body</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">More control over visualization of local axes</span></span></li>
	<li class="features__feature-block-list-item" style="margin: 0px; padding: 0px 0px 0.75rem; box-sizing: inherit; font-size: 1.125em; line-height: 1.5em; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Improved Import (VIP)</span></span></li>
</ul>
</div>

<div class="clear" style="height: 10px; text-align: justify;">&nbsp;</div>
</div>
`,
    videoUrl: 'https://www.youtube.com/embed/nxN7YFU2PVU'
  },
  {
    id: 9,
    name: 'CSiXRevit - Công cụ chuyển đổi từ mô hình Revit sang phần mềm CSI',
    icon: 'https://www.cic.com.vn/images/products/2019/10/09/large/CSiXRevit%20nho.jpg',
    img: 'https://www.cic.com.vn/images/products/2019/10/09/large/CSiXRevit%20lon.jpg',
    price: 'Liên hệ',
    description: 'CSiXRevit - công cụ link giữa Etabs, SAP2000, SAFE với phần mềm Autodesk Revit',
    field: 'Xây dựng & Hạ tầng',
    brand: 'Computers and Structures, Inc. (CSI)',
    app: 'Tương tác BIM & Revit',
    productType: 'Phần mềm',
    slides: [
      'https://www.cic.com.vn/images/products/2019/10/09/large/CSiXRevit%20nho.jpg',
      'https://www.cic.com.vn/images/products/2019/10/09/large/CSiXRevit%20lon.jpg'
    ],
    overviewHtml: `<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">CSiXRevit là&nbsp;công cụ link giữa <a href="https://www.consoft.vn/csi/etabs.html">Etabs</a>, <a href="https://www.consoft.vn/csi/sap2000.html">SAP2000</a>, <a href="https://www.consoft.vn/csi/safe.html">SAFE</a> với phần mềm Autodesk Revit</span></span><br />
<span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">CSiXRevit hỗ trợ 4 công tác chính chuyển đổi giữ liệu giữa phần mềm CSI với Autodesk Revit®:</span></span></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tạo mô hình CSI mới từ mô hình&nbsp; Revit®.</span></span></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Xuất từ Revit và cập nhật vào mô hình hiện có trong phần mềm CSI.</span></span></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tạo mô hình Revit mới từ CSI.</span></span></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Nhập mô hình CSi và cập nhật vào mô hình hiện có trong Revit®.</span></span><br />
<span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Users have full control over what model data gets transferred and how that data gets mapped to equivalent objects in either software.</span></span></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">CSiXRevit requires its own license to run.</span></span></p>

<p style="text-align: center;">&nbsp;</p>

<div class="row" style="box-sizing: border-box; margin-right: -15px; margin-left: -15px; color: rgba(0, 0, 0, 0.75); font-family: open-sans; font-size: 16px; background-color: rgb(237, 244, 248);">
<div class="col-md-12 highlight-header" style="box-sizing: border-box; position: relative; min-height: 1px; padding-right: 15px; padding-left: 15px; float: left; width: 1170px;">
<div class="panel-pane pane-fieldable-panels-pane pane-vuuid-16144b56-47d2-4c9a-93af-cf19eaac52a7  product-highlight  pane-bundle-text" style="box-sizing: border-box;">
<div class="pane-content" style="box-sizing: border-box;">
<div class="fieldable-panels-pane" style="box-sizing: border-box;">
<div class="field field-name-field-basic-text-text field-type-text-long field-label-hidden" style="box-sizing: border-box;">
<div class="field-items" style="box-sizing: border-box;">
<div class="field-item even" style="box-sizing: border-box;">
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

<div class="row" style="box-sizing: border-box; margin-right: -15px; margin-left: -15px; color: rgba(0, 0, 0, 0.75); font-family: open-sans; font-size: 16px; background-color: rgb(237, 244, 248);">
<div class="col-md-3 highlight-column highlight-column-1" style="box-sizing: border-box; position: relative; min-height: 1px; padding-right: 15px; padding-left: 15px; float: left; width: 292.5px;">
<div class="col-md-12 col-sm-6 highlight highlight-1-1" style="box-sizing: border-box; position: relative; min-height: 1px; padding-right: 15px; padding-left: 15px; float: left; width: 262.5px;">
<div class="text-align-center " style="box-sizing: border-box; text-align: center;">
<div class="panel-pane pane-fieldable-panels-pane pane-vuuid-500e5c3c-e593-41f8-b123-5049cfb7488c  product-highlight  text-align-center  pane-bundle-text" style="box-sizing: border-box;">
<div class="pane-content" style="box-sizing: border-box;">
<div class="fieldable-panels-pane" style="box-sizing: border-box;">
<div class="field field-name-field-basic-text-text field-type-text-long field-label-hidden" style="box-sizing: border-box;">
<div class="field-items" style="box-sizing: border-box;">
<div class="field-item even" style="box-sizing: border-box;">
<h4 style="box-sizing: border-box; font-family: myriad-pro-semi-condensed; font-weight: 400; line-height: 1.1; color: rgb(51, 51, 51); margin-top: 30px; margin-bottom: 15px; font-size: 24px;">Modeling</h4>

<div class="row" style="box-sizing: border-box; margin-right: -15px; margin-left: -15px;">
<div class="col-md-12" style="box-sizing: border-box; position: relative; min-height: 1px; padding-right: 15px; padding-left: 15px; float: left; width: 262.5px;"><img class="img-responsive" src="https://www.csiamerica.com/sites/default/files/product-features/csixrevit/modeling.png" style="box-sizing: border-box; border: 0px; vertical-align: middle; max-width: 100%; height: auto; display: block;" /></div>
</div>

<p style="box-sizing: border-box; margin: 0px 0px 10px; font-size: 14px;">Structural modeling can be done in ETABS<span style="box-sizing: border-box; font-size: 10.5px; line-height: 0; position: relative; vertical-align: baseline; top: -0.5em;">®</span>, SAP2000<span style="box-sizing: border-box; font-size: 10.5px; line-height: 0; position: relative; vertical-align: baseline; top: -0.5em;">®</span>; or SAFE<span style="box-sizing: border-box; font-size: 10.5px; line-height: 0; position: relative; vertical-align: baseline; top: -0.5em;">®</span>&nbsp;or in Autodesk Revit<span style="box-sizing: border-box; font-size: 10.5px; line-height: 0; position: relative; vertical-align: baseline; top: -0.5em;">®</span>&nbsp;and then later be synched up.</p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

<div class="col-md-12 col-sm-6  highlight highlight-1-2" style="box-sizing: border-box; position: relative; min-height: 1px; padding-right: 15px; padding-left: 15px; float: left; width: 262.5px;">
<div class="panel-pane pane-fieldable-panels-pane pane-vuuid-d84fe271-98c0-48f9-9434-78d509d4d1ac  product-highlight  pane-bundle-text" style="box-sizing: border-box;">
<div class="pane-content" style="box-sizing: border-box;">
<div class="fieldable-panels-pane" style="box-sizing: border-box;">
<div class="field field-name-field-basic-text-text field-type-text-long field-label-hidden" style="box-sizing: border-box;">
<div class="field-items" style="box-sizing: border-box;">
<div class="field-item even" style="box-sizing: border-box;">
<h4 style="box-sizing: border-box; font-family: myriad-pro-semi-condensed; font-weight: 400; line-height: 1.1; color: rgb(51, 51, 51); margin-top: 30px; margin-bottom: 15px; font-size: 24px; text-align: center;">Data Transfer</h4>

<div class="row" style="box-sizing: border-box; margin-right: -15px; margin-left: -15px;">
<div class="col-md-12" style="box-sizing: border-box; position: relative; min-height: 1px; padding-right: 15px; padding-left: 15px; float: left; width: 262.5px; text-align: center;"><img class="drop-shadow" src="https://www.csiamerica.com/sites/default/files/product-features/csixrevit/data-transfer-1.png" style="box-sizing: border-box; border: 0px; vertical-align: middle; max-width: 100%; height: auto; box-shadow: rgba(0, 0, 0, 0.45) 5px 5px 5px 0px; margin: 0px 0px 10px;" /></div>
</div>

<p style="box-sizing: border-box; margin: 0px 0px 10px; font-size: 14px; text-align: center;">The user has full control over what model information will be transferred between CSI Software models and Autodesk Revit® models.</p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

<div class="col-md-6 highlight-center-column" style="box-sizing: border-box; position: relative; min-height: 1px; padding-right: 15px; padding-left: 15px; float: left; width: 585px;">
<div class="row" style="box-sizing: border-box; margin-right: -15px; margin-left: -15px;">
<div class="col-md-12 highlight-main" style="box-sizing: border-box; position: relative; min-height: 1px; padding-right: 15px; padding-left: 15px; float: left; width: 585px;">
<div class="panel-pane pane-fieldable-panels-pane pane-vuuid-c5426cb9-2412-4891-8056-25bfd549b5e7  product-button-block  text-align-center  pane-bundle-text" style="box-sizing: border-box; text-align: center; margin-top: 75px;">
<div class="pane-content" style="box-sizing: border-box;">
<div class="fieldable-panels-pane" style="box-sizing: border-box;">
<div class="field field-name-field-basic-text-text field-type-text-long field-label-hidden" style="box-sizing: border-box;">
<div class="field-items" style="box-sizing: border-box;">
<div class="field-item even" style="box-sizing: border-box;">
<div class="row" style="box-sizing: border-box; margin-right: -15px; margin-left: -15px;">
<div class="col-md-10 col-md-offset-1" style="box-sizing: border-box; position: relative; min-height: 1px; padding-right: 15px; padding-left: 15px; float: left; width: 487.5px; margin-left: 48.75px;"><img class="wow animate fadeInLeft animated" id="etabs-model" src="https://www.csiamerica.com/sites/default/files/product-features/csixrevit/revit-model.png" style="box-sizing: border-box; border: 0px; vertical-align: middle; max-width: 100%; height: auto; animation-duration: 1s; animation-fill-mode: both; animation-name: fadeInLeft; visibility: visible;" /></div>

<div class="text-align-center col-md-10 col-md-offset-1" style="box-sizing: border-box; position: relative; min-height: 1px; padding-right: 15px; padding-left: 15px; float: left; width: 487.5px; margin-left: 48.75px;">&nbsp;</div>

<div class="col-md-10 col-md-offset-1" style="box-sizing: border-box; position: relative; min-height: 1px; padding-right: 15px; padding-left: 15px; float: left; width: 487.5px; margin-left: 48.75px;"><img class="wow animate fadeInRight animated" id="etabs-model" src="https://www.csiamerica.com/sites/default/files/product-features/csixrevit/etabs-model.png" style="box-sizing: border-box; border: 0px; vertical-align: middle; max-width: 100%; height: auto; animation-duration: 1s; animation-fill-mode: both; animation-name: fadeInRight; visibility: visible;" /></div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

<div class="col-md-3 highlight-column highlight-column-2" style="box-sizing: border-box; position: relative; min-height: 1px; padding-right: 15px; padding-left: 15px; float: left; width: 292.5px;">
<div class="col-md-12 col-sm-6 highlight highlight-2-1" style="box-sizing: border-box; position: relative; min-height: 1px; padding-right: 15px; padding-left: 15px; float: left; width: 262.5px;">
<div class="panel-pane pane-fieldable-panels-pane pane-vuuid-c39342b8-c25c-495d-bf10-563035fd5d85  product-highlight  pane-bundle-text" style="box-sizing: border-box;">
<div class="pane-content" style="box-sizing: border-box;">
<div class="fieldable-panels-pane" style="box-sizing: border-box;">
<div class="field field-name-field-basic-text-text field-type-text-long field-label-hidden" style="box-sizing: border-box;">
<div class="field-items" style="box-sizing: border-box;">
<div class="field-item even" style="box-sizing: border-box;">
<h4 style="box-sizing: border-box; font-family: myriad-pro-semi-condensed; font-weight: 400; line-height: 1.1; color: rgb(51, 51, 51); margin-top: 30px; margin-bottom: 15px; font-size: 24px; text-align: center;">Intermediate Data Exchange</h4>

<div class="row" style="box-sizing: border-box; margin-right: -15px; margin-left: -15px;">
<div class="col-md-12" style="box-sizing: border-box; position: relative; min-height: 1px; padding-right: 15px; padding-left: 15px; float: left; width: 262.5px; text-align: center;"><img src="https://www.csiamerica.com/sites/default/files/product-features/csixrevit/exr.png" style="box-sizing: border-box; border: 0px; vertical-align: middle; max-width: 100%; height: auto;" /></div>
</div>

<p style="box-sizing: border-box; margin: 0px 0px 10px; font-size: 14px; text-align: center;">All CSI Products use the same intermediate data exchange file (.EXR) to control model data exchange.</p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

<div class="col-md-12 col-sm-6 highlight highlight-2-1" style="box-sizing: border-box; position: relative; min-height: 1px; padding-right: 15px; padding-left: 15px; float: left; width: 262.5px;">
<div class="panel-pane pane-fieldable-panels-pane pane-vuuid-7b6aac92-73d5-423d-b681-11fa80f34db0  product-highlight  pane-bundle-text" style="box-sizing: border-box;">
<div class="pane-content" style="box-sizing: border-box;">
<div class="fieldable-panels-pane" style="box-sizing: border-box;">
<div class="field field-name-field-basic-text-text field-type-text-long field-label-hidden" style="box-sizing: border-box;">
<div class="field-items" style="box-sizing: border-box;">
<div class="field-item even" style="box-sizing: border-box;">
<h4 style="box-sizing: border-box; font-family: myriad-pro-semi-condensed; font-weight: 400; line-height: 1.1; color: rgb(51, 51, 51); margin-top: 30px; margin-bottom: 15px; font-size: 24px; text-align: center;">Parametric Mapping</h4>

<div class="row" style="box-sizing: border-box; margin-right: -15px; margin-left: -15px;">
<div class="col-md-12" style="box-sizing: border-box; position: relative; min-height: 1px; padding-right: 15px; padding-left: 15px; float: left; width: 262.5px; text-align: center;"><img class="drop-shadow" src="https://www.csiamerica.com/sites/default/files/product-features/csixrevit/parametric.png" style="box-sizing: border-box; border: 0px; vertical-align: middle; max-width: 100%; height: auto; box-shadow: rgba(0, 0, 0, 0.45) 5px 5px 5px 0px; margin: 0px 0px 10px;" /></div>
</div>

<p style="box-sizing: border-box; margin: 0px 0px 10px; font-size: 14px; text-align: center;">CSiXRevit will support both direct section mapping of standard steel sections and also parametric sections that have been defined in Revit®</p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
`,
    videoUrl: 'https://www.youtube.com/embed/KixxB70s9NU'
  },
  {
    id: 10,
    name: 'CSiPlant - Phần mềm phân tích đường ống',
    icon: 'https://www.cic.com.vn/images/products/2019/10/08/original/csiplant-icon_1570508283.png',
    img: 'https://www.cic.com.vn/images/products/2019/10/08/large/CSiPlant%20lon1.jpg',
    price: 'Liên hệ',
    description: 'CSiPlant - PHẦN MỀM MÔ HÌNH THIẾT KẾ HỆ THỐNG KẾT CẤU VÀ ĐƯỜNG ỐNG ÁP LỰC',
    field: 'Dầu khí & Đường ống',
    brand: 'Computers and Structures, Inc. (CSI)',
    app: 'Phân tích Đường ống Áp lực',
    productType: 'Phần mềm',
    slides: [
      'https://www.cic.com.vn/images/products/2019/10/08/large/CSiPlant%20lon1.jpg',
      'https://www.cic.com.vn/images/products/2019/10/08/large/CSiPlant%20nho.jpg'
    ],
    overviewHtml: `<h2><span style="font-size:16px;"><b id="docs-internal-guid-66566bc6-7fff-8ef9-8a33-6916ef9f3647">PHẦN MỀM MÔ HÌNH THIẾT KẾ HỆ THỐNG KẾT CẤU VÀ ĐƯỜNG ỐNG ÁP LỰC</b></span></h2>

<div style="text-align: center;">&nbsp;</div>

<div style="text-align: center;"><span style="font-size:16px;"><meta charset="utf-8" /></span>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">CSiPlant là một phần mềm kỹ thuật phục vụ mục đích phân tích và thiết kế hệ khung kết cấu và đường ống áp lực, bao gồm kiểm tra khả năng chịu áp lực theo tiêu chuẩn với các ảnh hưởng ứng xuất và các hệ số linh hoạt để tự động tính toán và áp dụng.</span></p>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">CSiPlant cung cấp công nghệ phân tích nâng cao cho kỹ sư đường ống và kỹ sư kết cấu làm việc trong lĩnh vực điện, đường ống áp lực và các công trình dầu khí ngoài khơi</span></p>

<p style="text-align: left;">&nbsp;</p>
</div>

<div><span style="font-size:16px;"><img alt="" src="https://www.csiamerica.com/sites/default/files/overview3.png" style="width: 500px; height: 307px;" /></span></div>

<div>&nbsp;</div>

<div>&nbsp;</div>

<div style="text-align: center;">
<div>
<div>
<div>
<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Khả năng tương tác của SAP2000</span></p>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Nhập khẩu và xuất khẩu</span></p>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">In hoặc lưu dữ liệu dạng bảng vào Access, Excel, Word, HTML hoặc TXT.</span></p>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Đầu ra dạng bảng</span></p>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Hình học biến dạng Lực lượng khung ống / ứng suất</span></p>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Tính toán trọng tâm (CG)</span></p>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Đầu ra và hiển thị</span></p>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">CSiPlant cung cấp trình tự tải phi tuyến không giới hạn. Xem xét thứ tự của tải. Do ma sát tác động theo các hướng khác nhau trong quá trình khởi động. Tắt máy và các trạng thái tải khác. Nên tải tuần tự, bao gồm tải và giải nhiệt tuần tự. Thường là cần thiết để xác định các phản ứng và căng thẳng tồi tệ nhất.</span></p>

<h3 dir="ltr" style="text-align: left;"><span style="font-size:16px;"><b id="docs-internal-guid-0483c0a0-7fff-50d9-13f9-ee9fd415ff82">Trình tự tải phi tuyến</b></span></h3>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">CSiPlant có sẵn nhiều yếu tố liên kết khác nhau để thể hiện chính xác hành vi cấu trúc. Các loại yếu tố liên kết. Gồm tuyến tính, đàn hồi đa tuyến tính, nhựa đa tuyến tính, khoảng trống, móc, bộ giảm chấn, bộ cách ly ma sát, bộ cách ly cao su và bộ cách ly T/C.</span></p>

<h3 dir="ltr" style="text-align: left;"><span style="font-size:16px;"><b id="docs-internal-guid-0483c0a0-7fff-50d9-13f9-ee9fd415ff82">&nbsp;Liên kết</b></span></h3>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Chọn từ thư viện cấu trúc AISC hoàn chỉnh của các phần để phân tích và thiết kế. Gồm Mặt bích rộng, Góc, Kênh và Ống.</span></p>

<h3 dir="ltr" style="text-align: justify;"><span style="font-size:16px;"><b id="docs-internal-guid-0483c0a0-7fff-50d9-13f9-ee9fd415ff82">&nbsp;Khung</b></span></h3>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Ống có thể được vẽ với nhiều loại khuỷu tay (thường xuyên và giảm nhẹ), giảm tốc và tees. Người dùng có khả năng thay đổi bán kính khuỷu tay. Loại bỏ / cập nhật bộ giảm tốc và thay đổi kích thước nhánh Tee.</span></p>

<h3 dir="ltr" style="text-align: justify;"><span style="font-size:16px;"><b id="docs-internal-guid-0483c0a0-7fff-50d9-13f9-ee9fd415ff82">Ống</b></span></h3>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Xác định các thuộc tính Thành phần bao gồm Van và Mặt bích.</span></p>

<h3 dir="ltr" style="text-align: justify;"><span style="font-size:16px;"><b id="docs-internal-guid-0483c0a0-7fff-50d9-13f9-ee9fd415ff82">Các thành phần</b></span></h3>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Nhiều hỗ trợ khác nhau có thể được xác định trong CSiPlant bao gồm Neo; Hướng dẫn; Dừng dòng; Dừng dọc; Thanh treo; Snubbers và Móc treo lò xo. Mỗi có thể được áp dụng như một hỗ trợ 1 điểm hoặc 2 điểm để kết nối với các phần khác. Người dùng có thể chỉ định các khoảng trống, ma sát, giảm xóc. Giảm độ cứng của lò xo tuyến tính hoặc phi tuyến.</span></p>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;"><b id="docs-internal-guid-0483c0a0-7fff-50d9-13f9-ee9fd415ff82">Hỗ trợ</b></span></p>

<h2 dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Loại đối tượng</span></h2>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Các công cụ Snap bao gồm các tùy chọn để chụp dọc theo chiều dài của đối tượng và khả năng chụp mở rộng trực giao.</span></p>

<h3 dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Công cụ Snap</span></h3>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Đồ họa Direct X với đồ họa được tăng tốc phần cứng cho phép điều hướng các mô hình có tốc độ quay nhanh và nhiều chế độ kết xuất bao gồm một dòng, hai dòng và đùn.</span></p>

<h3 dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Đồ họa</span></h3>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Áp dụng cơ hoành cứng hoặc các ràng buộc cơ thể trong đó các khớp dịch và xoay với nhau trong một kết nối cứng nhắc.</span></p>

<h3 dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Ràng buộc chung</span></h3>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Các kỹ sư có nhiều lựa chọn khi nói đến việc tạo lưới trong CSiPlant. Chỉ cần chọn đối tượng đường ống hoặc khung. Sau đó chọn quy tắc cho trình tạo lưới tự động để sử dụng.</span></p>

<h3 dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Công cụ chia lưới</span></h3>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Tạo mạng lưới đường ống dễ dàng với các công cụ vẽ CSiPlant. Đề án ghi nhãn hoàn toàn tùy biến cho mỗi đường ống.</span></p>

<h3 dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Đường ống</span></h3>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Nhiều thư viện bao gồm hàng trăm vật liệu / đường cong ASME B31.3, vật liệu / phần SAP2000, đường ống ASME B36.10 (w / m), mặt bích Texas và van Velan.</span></p>

<h3 dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Thư viện</span></h3>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Các khung nhìn và độ cao được tạo tự động tại mỗi đường lưới để cho phép điều hướng nhanh mô hình.</span></p>

<h3 dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Kế hoạch / Độ cao</span></h3>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Nhiều tiện ích vẽ và phác thảo được tích hợp vào CSiPlant để nâng cao trải nghiệm mô hình hóa của kỹ sư bao gồm tự động tạo khuỷu tay / giảm tốc / tees và tạo nhiều hỗ trợ / liên kết tại bất kỳ điểm nào.</span></p>

<h3 dir="ltr" style="text-align: left;"><span style="font-size:16px;"><b id="docs-internal-guid-0483c0a0-7fff-50d9-13f9-ee9fd415ff82">Soạn thảo</b></span></h3>

<p style="text-align: left;">&nbsp;</p>
</div>
</div>
</div>
</div>

<div style="text-align: center;">
<div>
<div>
<div>
<p style="text-align: left;"><span style="font-size:16px;"><meta charset="utf-8" /></span></p>

<p style="text-align: left;">&nbsp;</p>

<p style="text-align: left;"><span style="font-size:16px;"><img alt="image" src="https://www.csiamerica.com/sites/default/files/links-plant3.png" style="height: 556px; width: 500px;" /></span></p>

<p style="text-align: left;">&nbsp;</p>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">CSiPlant cung cấp nhiều loại phần tử liên kết để kết nối các điểm khác nhau như ứng xử kết cấu có thể được mô hình hóa.&nbsp; Thuộc tính tuyến tính và phi tuyến có thể được gán vào cho các thành phần 6 bậc tự do. Gíup xác định mối tương quan giữa ứng suất và biến dạng</span></p>

<h2 dir="ltr" style="text-align: justify;"><span style="font-size:16px;"><b id="docs-internal-guid-98c848f4-7fff-1ad2-0742-316acd8d302d">PHẦN TỬ LINK</b></span></h2>

<p style="text-align: left;">&nbsp;</p>
</div>
</div>
</div>
</div>

<div style="text-align: center;">
<div>
<div>
<div>
<p style="text-align: left;"><span style="font-size:16px;"><meta charset="utf-8" /></span></p>

<p style="text-align: left;">&nbsp;</p>

<p style="text-align: left;">&nbsp;</p>

<p style="text-align: left;">&nbsp;</p>

<p style="text-align: left;"><br />
<br />
<span style="font-size:16px;"><img alt="image" src="https://www.csiamerica.com/sites/default/files/supports2-plant.png" style="height: 443px; width: 500px;" /></span></p>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Bao gồm Anchors, Guides, Line Stops, Vertical Stops, Rod Hangers, Snubbers, và Spring Hangers</span></p>

<h3 dir="ltr" style="text-align: justify;"><span style="font-size:16px;"><b id="docs-internal-guid-19798a2e-7fff-d4d3-a4b2-8275d6df87d8">HỆ NÂNG ĐỠ ĐƯỜNG ỐNG</b></span></h3>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Mô hình đường ống và khung kết cấu có thể nhanh chóng được tạo và sửa đổi bằng cách sử dụng các công cụ soạn thảo giống như CAD để gắn vào các đối tượng, giao điểm lưới và trục tổng thể. Ngoài ra, CSiPlant tự động điền các nhãn, đánh dấu số hiệu phần tử. Các lệnh chèn và gán và các phím tắt. Cho phép kỹ sư nhiều tùy chọn để mô&nbsp; nhanh chóng xây dựng mô hình. Cho phép hiệu chỉnh, sửa đổi và xem lại mô hình phân tích.</span></p>

<h3 dir="ltr" style="text-align: justify;"><span style="font-size:16px;"><b id="docs-internal-guid-19798a2e-7fff-d4d3-a4b2-8275d6df87d8">DRAWING CAPABILITIES</b></span></h3>

<p style="text-align: left;">&nbsp;</p>
</div>
</div>
</div>
</div>

<div style="text-align: center;">
<div>
<div>
<div>
<p style="text-align: left;"><span style="font-size:16px;"><meta charset="utf-8" /></span></p>

<p style="text-align: left;">&nbsp;</p>

<p style="text-align: left;"><span style="font-size:16px;"><img alt="image" src="https://www.csiamerica.com/sites/default/files/import-plant.png" style="height: 357px; width: 500px;" /></span></p>

<p style="text-align: left;">&nbsp;</p>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Mô hình nhập từ SAP2000 sang CSiPLant. Tương thích toàn diện đã bao gồm tải trọng, khung kết cấu và tiết diện, hệ lưới. Các cấu kiện nâng đỡ, định nghĩa khối cho các trường hợp phân tích động đất. Các trường hợp tải trọng động, và các bậc tự do và các định nghĩa khác. Kết quả phân tích tại các vị trí nâng đỡ đường ống từ mô hình kết hợp CSiPlant. Xuất trở lại vào SAP2000 với các tùy chọn để lọc theo phần ống, các trường hợp tải. Kết quả từ SAP2000 có thể được xuất sang SAFE để thiết kế.</span></p>

<h3 dir="ltr" style="text-align: justify;"><span style="font-size:16px;"><b id="docs-internal-guid-bcb844aa-7fff-a0aa-0004-6764d803217d">&nbsp;TƯƠNG THÍCH VỚI SAP2000</b></span></h3>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">CSiPlant cho phép tương tác giữa đường ống và các chương trình kết cấu. Nhập chi tiết mô hình két cấu từ SAP2000 sang CSiPlant và tự động kết nối từ mô hình đường ống áp lực kết hợp phân tích phi tuyến và thiết kế. Nhập mô hình từ trung lập CII file.</span></p>

<h3 dir="ltr" style="text-align: justify;"><span style="font-size:16px;"><b id="docs-internal-guid-bcb844aa-7fff-a0aa-0004-6764d803217d">TƯƠNG THÍCH TOÀN DIỆN</b></span></h3>

<p style="text-align: left;">&nbsp;</p>
</div>
</div>
</div>
</div>

<div style="text-align: center;">
<div>
<div>
<div>
<p style="text-align: left;"><span style="font-size:16px;"><meta charset="utf-8" /></span></p>

<p style="text-align: left;">&nbsp;</p>

<p style="text-align: left;"><br />
<br />
<span style="font-size:16px;"><img alt="image" src="https://www.csiamerica.com/sites/default/files/time_history1.png" style="height: 479px; width: 500px;" /></span><br />
&nbsp;</p>
</div>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Phân tích động phi tuyến theo lịch sử thời gian sử dụng một trong hai phương pháp FNA (modal Fast Nonlinear Analysis) hoạc phương pháp Direct Integration áp dụng cho mọi loại tải trọng, bao gồm gia tốc, tải trọng điểm, chuyển vị và tải trọng do nhiệt độ. Các mô hình ứng suất đường ống thường bao gồm ma xát phi tuyến, các lỗ hở (gaps), hoạc đàn hồi đa tuyến tính để phân tích chính xác hơn. Sử dụng mô hình phân tích phi tuyến giúp loại bỏ sự cần thiết phải tuyến tính hóa và các điều kiện biên phi tuyến.</span></p>

<p style="text-align: justify;">&nbsp;</p>
</div>
</div>
</div>

<div style="text-align: center;">
<div>
<div>
<p style="text-align: justify;"><span style="font-size:16px;"><meta charset="utf-8" /></span></p>

<h3 style="text-align: justify;"><span style="font-size:16px;"><b id="docs-internal-guid-81e261a4-7fff-6d87-1953-0df97fb7a341">PHÂN TÍCH PHI TUYẾN LỊCH SỬ THỜI GIAN</b></span></h3>
</div>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Design Requests (DR) cho phép các trường hợp tải trọng được phân tích theo các tiêu chuẩn khác nhau. bao gồm các lựa chọn mà có thể thay đổi ma trận độ cứng, yêu cầu các phân tích riêng biệt. Các thành phần khác nhau của mạng lưới đường ống có thể được phân tích thiết kế sử dụng các phân tích, các tùy chọn liên quan tới thiết kế khác nhau. </span></p>

<h2 dir="ltr" style="text-align: justify;"><span style="font-size:16px;"><b id="docs-internal-guid-9fee004e-7fff-4e20-c317-d9d63b6dbd33">CÁC YÊU CẦU THIẾT KẾ</b></span></h2>

<p style="text-align: left;">&nbsp;</p>
</div>
</div>

<div style="text-align: center;">
<div>
<p style="text-align: left;"><span style="font-size:16px;"><meta charset="utf-8" /></span></p>

<p style="text-align: left;">&nbsp;</p>

<div style="text-align: left;"><br />
<span style="font-size:16px;"><img alt="image" src="https://www.csiamerica.com/sites/default/files/buckling2.png" style="height: 382px; width: 500px;" /></span></div>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">&nbsp;Phân tích oằn (Buckling) thường được kể đến trong một số trường hợp như đường ống có vỏ bọc, oàn do nhiệt độ, đường ống nhựa thủy tinh(GRP) và đường ống nhựa, sự đứt gãy giữa đường ống và các neo, tăng khả năng phân tích trong một số tình huống nâng cao khác. Sử dụng cả hai phương pháp Eigen buckling và nonlinear large displacement buckling analysis, CSiPlant giúp thuận tiện kiểm tra độ vênh trong quá trình thiết kế.</span></p>

<h3 dir="ltr" style="text-align: justify;"><span style="font-size:16px;"><b id="docs-internal-guid-c9b4f329-7fff-231b-5656-0bb2f71f58c3">PHÂN TÍCH OẰN</b></span></h3>

<p style="text-align: left;">&nbsp;</p>
</div>
</div>

<div style="text-align: center;">
<div>
<p style="text-align: left;"><span style="font-size:16px;"><meta charset="utf-8" /></span></p>
</div>

<div style="text-align: left;">&nbsp;</div>

<p style="text-align: left;"><span style="font-size:16px;"><img alt="image" src="https://www.csiamerica.com/sites/default/files/sequential%20loading2.png" style="height: 237px; width: 500px;" /></span></p>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">CSiPlant cung cấp không giới hạn trình tự tải phi tuyến, hay còn được gọi là tải phụ thuộc vào đường dẫn, kể đến thứ tự của tải trọng.&nbsp; Do ma xát tác động theo các hướng khác nhau trong quá trình khởi động với quá tình tắt và các trạng thái tải khác.&nbsp; Trình tự tải trọng bao gồm trình tự tải nhiệt độ và giảm tải ... cần thiết để xác định trạng thái ứng xuất phá hoại lớn nhất.</span></p>

<h3 dir="ltr" style="text-align: justify;"><span style="font-size:16px;"><b id="docs-internal-guid-0346d6d3-7fff-f825-4ba0-ccbbf9dc5ad3">TRÌNH TỰ TẢI PHI TUYẾN</b></span></h3>

<p style="text-align: left;">&nbsp;</p>
</div>

<div style="text-align: center;">
<p style="text-align: left;"><span style="font-size:16px;"><meta charset="utf-8" /></span></p>

<p style="text-align: left;">&nbsp;</p>

<p style="text-align: left;"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;"><img alt="" src="https://www.csiamerica.com/sites/default/files/p-delta-sap2000.png" style="width: 471px; height: 441px;" /></span></span><br />
&nbsp;</p>

<p style="text-align: left;"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;">&nbsp;</span></span></p>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">Phân tích P-Delta, hay còn được hiểu là phân tích hình học phi tuyến bậc hai, liên quan tới mối quan hệ giữa kết cấu và tải trọng bị đặt lệch tâm. Nó làm thay đổi độ cứng cũng như khả năng chịu lực của phần tử kết cấu theo phương dọc trục. P-Delta là phân tích bắt buộc trong nhiều tiêu chuẩn thiết kế. </span></p>

<p style="text-align: justify;">&nbsp;</p>
</div>

<div style="text-align: center;">
<p style="text-align: justify;"><span style="font-size:16px;"><meta charset="utf-8" /></span></p>

<h3 style="text-align: justify;"><span style="font-size:16px;"><b id="docs-internal-guid-43ffa324-7fff-d458-e7cb-82ad3c1d3905">PHÂN TÍCH P-DELTA&nbsp;</b></span></h3>

<p dir="ltr" style="text-align: justify;"><span style="font-size:16px;">CSiPlant mở ra một phương thức mới về khả năng phân tích và thiết kế độc đáo trong ngành công nghiệp.</span></p>

<h3 dir="ltr" style="text-align: justify;"><span style="font-size:16px;"><b id="docs-internal-guid-8c9ecf62-7fff-b177-cc8d-b0271073a81a">PHÂN TÍCH</b></span><span style="font-size:16px;"><meta charset="utf-8" /></span></h3>
</div>`,
    featuresHtml: `<div class="clearfix ma15 tinhnang text-center" id="detailFT0">
<h2 style="font-size: 40px;" title="Modeling"><span>Modeling</span></h2>

<div class="ma15 text-left">
<p style="text-align: center;"><span style="font-size:24px;"><span style="font-family:arial,helvetica,sans-serif;">Drafting</span></span></p>

<p style="text-align: center;"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;">Many drawing and drafting utilities are built into CSiPlant to enhance the engineer's modeling experience including automatically creating elbows/reducers/Tees and generating multiple supports/links at any given point.</span></span><br />
<br />
<span style="font-family: arial, helvetica, sans-serif; font-size: 24px;">Plans/Elevations</span></p>
</div>
</div>

<p style="text-align: center;"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;">Plans and elevations views are automatically generated at every grid line to allow for quick navigation of the model.</span></span><br />
<br />
<img src="https://www.csiamerica.com/sites/default/files/multiple_windows2.png" style="height: 456px; width: 1024px;" /></p>

<p style="text-align: center;">&nbsp;</p>

<p style="text-align: center;"><span style="font-size:24px;"><span style="font-family:arial,helvetica,sans-serif;">Libraries</span></span></p>

<p style="text-align: center;"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;">Many libraries including hundreds of ASME B31.3 materials/curves, SAP2000 materials/sections , piping ASME B36.10(w/m), Texas flanges and Velan valves.</span></span></p>

<p style="text-align: center;"><img src="https://www.csiamerica.com/sites/default/files/section_libraryb.png" style="height: 711px; width: 1024px;" /></p>

<p style="text-align: center;"><span style="font-family: arial, helvetica, sans-serif; font-size: 24px;">Pipelines</span></p>

<p style="text-align: center;"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;">Generate pipeline networks easily with CSiPlant drawing tools. Fully customizable labeling scheme for each pipeline.</span></span><br />
<br />
<img src="https://www.csiamerica.com/sites/default/files/pipelines3.png" style="height: 527px; width: 1020px;" /></p>

<p style="text-align: center;"><span style="font-family: arial, helvetica, sans-serif; font-size: 24px;">Meshing Tools</span></p>

<p style="text-align: center;"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;">Engineers have many options when it comes to mesh generation in CSiPlant. Simply select the pipe or frame object and then select the rules for the automatic mesh generator to use.</span></span></p>

<p style="text-align: center;"><span style="font-family: arial, helvetica, sans-serif; font-size: 24px;">Joint Constraints</span></p>

<p style="text-align: center;"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;">Apply rigid diaphragm or body constraints in which joints translate and rotate together in a rigid connection.</span></span></p>

<p style="text-align: center;"><span style="font-size:24px;"><span style="font-family: arial, helvetica, sans-serif;">Graphics</span></span></p>

<p style="text-align: center;"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;">Direct X graphics with hardware accelerated graphics allow for navigation of models with&nbsp; fast rotations and multiple render modes including single line, double line and extruded.</span></span><br />
&nbsp;
<video autoplay="autoplay" class="embed-responsive-item" loop="" style="width:80%;">&nbsp;</video>
<br />
<br />
<br />
&nbsp;</p>

<p style="text-align: center;"><span style="font-size:24px;"><span style="font-family: arial, helvetica, sans-serif;">Snap Tools</span></span></p>

<p style="text-align: center;"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;">Snap tools including options to snap along lengths of object and orthogonal extension snapping capabilities.</span></span><br />
<br />
<img src="https://www.csiamerica.com/sites/default/files/plant-snaps3.png" style="height: 558px; width: 1024px;" /></p>

<div>&nbsp;</div>

<div class="clear" style="height: 10px">&nbsp;</div>

<div class="ma15" id="content-tab">&nbsp;</div>

<div class="clear" style="height: 30px">&nbsp;</div>

<div class="clearfix ma15 tinhnang text-center" id="detailFT1">
<h2 style="font-size: 40px;" title="Object Type"><span>Object Type</span></h2>

<div class="ma15 text-left">
<div style="text-align: center;"><span style="font-size:24px;">Supports</span><br />
&nbsp;</div>

<div style="text-align: center;"><span style="font-size:16px;">Many different supports can be defined in CSiPlant including Anchors, Guides, Line Stops, Vertical Stops, Rod Hangers, Snubbers, and Spring Hangers. Each can be applied as a 1-point or 2-point support to connect to other parts of the model. Users can specify gaps, friction, damping, and linear or nonlinear spring stiffness in each acting direction, and create customized pipe support libraries for reuse and standardization.</span><br />
<br />
<img src="https://www.csiamerica.com/sites/default/files/supports.png" style="height: 518px; width: 900px;" /></div>

<div style="text-align: center;">&nbsp;</div>

<div style="text-align: center;"><span style="font-size: 24px;">Components</span></div>

<div style="text-align: center;"><span style="font-size:16px;">Define Component properties including Valves and Flanges.</span><br />
<br />
<img src="https://www.csiamerica.com/sites/default/files/components.png" style="height: 553px; width: 900px;" /></div>

<div style="text-align: center;">&nbsp;</div>

<div style="text-align: center;"><span style="font-size:24px;">Pipes</span></div>

<div style="text-align: center;"><span style="font-size:16px;">Pipes can be drawn with multiple elbow types (regular and mitered), reducers, and tees. Users have the ability to change elbow radius, remove/update reducers and change Tee branch size.</span><br />
<br />
<img src="https://www.csiamerica.com/sites/default/files/pipes-plant.png" style="height: 445px; width: 900px;" /></div>

<div style="text-align: center;">&nbsp;</div>

<div style="text-align: center;"><span style="font-size:24px;">Frames</span></div>

<div style="text-align: center;"><span style="font-size:16px;">Choose from the complete AISC structural library of sections for analysis and design including Wide Flange, Angles, Channels, and Tubes.</span><br />
<br />
<img src="https://www.csiamerica.com/sites/default/files/frames2.png" style="height: 470px; width: 900px;" /></div>

<div style="text-align: center;">&nbsp;</div>

<div style="text-align: center;"><span style="font-size: 24px;">Links</span></div>

<div style="text-align: center;"><span style="font-size:16px;">CSiPlant has a many different link elements available for users to accurately represent the behavior of a structure. Link elements types include Linear, Multi-linear Elastic, Multi-linear Plastic, Gaps, Hooks, Dampers, Friction Isolators, Rubber Isolators, and T/C Isolators.</span><br />
<br />
<img src="https://www.csiamerica.com/sites/default/files/links-plant3.png" style="height: 626px; width: 900px;" /></div>

<div style="text-align: center;">&nbsp;</div>

<div style="text-align: center;"><span style="font-size: 24px;">Pipe Properties</span></div>

<div style="text-align: center;"><span style="font-size:16px;">Pipe properties including Insulation, Cladding, Pipe Contents and Lining type can be defined in CSiPlant.</span><br />
<br />
<img src="https://www.csiamerica.com/sites/default/files/pipe_property2.png" style="height: 584px; width: 900px;" /></div>
</div>

<div class="clear" style="height: 10px">&nbsp;</div>

<div class="ma15" id="content-tab">&nbsp;</div>

<div class="clear" style="height: 30px">&nbsp;</div>
</div>

<div class="clearfix ma15 tinhnang text-center" id="detailFT2">
<h2 style="font-size: 40px;" title="Loading"><span>Loading</span></h2>

<div class="ma15 text-left">
<p style="text-align: center;"><span style="font-size:24px;"><span style="font-family:arial,helvetica,sans-serif;">Acceleration Loading</span></span></p>

<p style="text-align: center;"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;">Acceleration loading in CSiPlant can be applied in both translational and rotational directions. Acceleration loads can be applied as static or time history.</span></span></p>

<p style="text-align: center;">&nbsp;</p>

<p style="text-align: center;"><span style="font-size:24px;"><span style="font-family:arial,helvetica,sans-serif;">Automatic Code Based Loading</span></span></p>

<p style="text-align: center;"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;">CSiPlant will automatically generate and apply seismic and wind loads based on various domestic and international codes.</span></span></p>

<video autoplay="autoplay" class="embed-responsive-item" loop="" style="width:80%;">&nbsp;</video>
</div>
</div>

<p style="text-align: center;">&nbsp;</p>

<p style="text-align: center;"><span style="font-size:24px;"><span style="font-family:arial,helvetica,sans-serif;">User Loads</span></span></p>

<p style="text-align: center;"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;">CSiPlant is robust when it comes to load assignment. Uniform distributed line loads can be assigned in any direction, not just gravity. Thermal, strain and pressure loads can be assigned to frames or pipes. Point loads and ground displacement can be assigned any joint.</span></span></p>

<p style="text-align: center;">&nbsp;</p>

<p style="text-align: center;"><span style="font-size:24px;"><span style="font-family:arial,helvetica,sans-serif;">Pressure</span></span><br />
<br />
<img src="https://www.csiamerica.com/sites/default/files/temp_loading2_0.png" style="height: 537px; width: 900px;" /></p>

<p style="text-align: center;"><span style="font-size:24px;"><span style="font-family:arial,helvetica,sans-serif;">Temperature</span></span><br />
<br />
<img src="https://www.csiamerica.com/sites/default/files/pressure_loads4b.png" style="height: 470px; width: 900px;" /></p>

<p style="text-align: center;"><span style="font-size:24px;"><span style="font-family:arial,helvetica,sans-serif;">Point/Distributed</span></span><br />
<br />
<img src="https://www.csiamerica.com/sites/default/files/distributed_load.png" style="height: 559px; width: 900px;" /></p>

<div class="clear" style="height: 10px">&nbsp;</div>

<div class="ma15" id="content-tab">&nbsp;</div>

<div class="clear" style="height: 30px">&nbsp;</div>

<div class="clearfix ma15 tinhnang text-center" id="detailFT3">
<h2 style="font-size: 40px;" title="Analysis"><span>Analysis</span></h2>

<div class="ma15 text-left">
<p style="text-align: center;"><span style="font-size:24px;"><span style="font-family:arial,helvetica,sans-serif;">Dynamics</span></span></p>

<p style="text-align: center;"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:16px;">Dynamic analysis capabilities include the calculation of vibration modes using Ritz or Eigen vectors, response-spectrum analysis, and time-history analysis for both linear and nonlinear behavior.</span></span></p>

<p style="text-align: center;">&nbsp;</p>

<p style="text-align: center;"><span style="font-size:24px;"><span style="font-family:arial,helvetica,sans-serif;">Ritz Vector</span></span></p>

<p style="text-align: center;"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:16px;">Ritz vector modal analysis can provide a better basis than eigenvectors when used for response-spectrum or modal time-history analyses. Ritz vectors yield better results as they are generated by taking into account the spatial distribution of the dynamic loading, whereas natural mode shapes neglect this.</span></span></p>

<p style="text-align: center;"><img src="https://www.csiamerica.com/sites/default/files/ritz_vector.png" style="height: 557px; width: 900px;" /></p>

<p style="text-align: center;"><span style="font-size:24px;"><span style="font-family:arial,helvetica,sans-serif;">Response Spectrum</span></span></p>

<p style="text-align: center;"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:16px;">Response-spectrum analysis determines the statistically likely response of a structure to seismic loading. This linear type of analysis uses response-spectrum ground-acceleration records based on the seismic load and site conditions, rather than time-history ground motion records. This method is extremely efficient and takes into account the dynamical behavior of the structure.</span></span></p>

<p style="text-align: center;"><img src="https://www.csiamerica.com/sites/default/files/response_spectrum2.png" style="height: 441px; width: 900px;" /></p>

<p style="text-align: center;"><span style="font-size:24px;"><span style="font-family:arial,helvetica,sans-serif;">Time History</span></span></p>

<p style="text-align: center;"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:16px;">Time-history analysis captures the step-by-step response of structures to seismic ground motion and other types of loading such as blast, machinery, wind, waves, etc. Analysis can use modal superposition or direct-integration methods, and both can be linear or nonlinear. The nonlinear modal method, also called FNA for Fast Nonlinear Analysis, is extremely efficient and accurate for a wide class of problems. The direct-integration method is even more general, and can handle large deformations and other highly nonlinear behavior. Nonlinear time-history analyses can be chained together with other nonlinear cases (including staged construction) addressing a wide range of applications.</span></span></p>

<p style="text-align: center;"><img src="https://www.csiamerica.com/sites/default/files/time_history3.png" style="height: 539px; width: 900px;" /></p>

<p style="text-align: center;"><span style="font-size:24px;"><span style="font-family:arial,helvetica,sans-serif;">Buckling</span></span></p>

<p style="text-align: center;"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:16px;">Buckling can be a design concern in a number of different piping applications including jacketed piping analysis, bowing due to thermal gradient, GRP and plastic piping, rack piping with intermediate anchors, and tall vertical risers among other design scenarios. Using both Eigen buckling and nonlinear large displacement buckling analysis options, CSiPlant makes it convenient for engineers to check for buckling during design.</span></span></p>

<p style="text-align: center;"><img src="https://www.csiamerica.com/sites/default/files/buckling2b.png" style="height: 574px; width: 900px;" /></p>

<p style="text-align: center;"><span style="font-size:24px;"><span style="font-family:arial,helvetica,sans-serif;">Nonlinear Load Sequencing</span></span></p>

<p style="text-align: center;"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:16px;">CSiPlant offers unlimited nonlinear load sequencing, also known as path-dependent loading, which considers the order of the loading. Since friction acts in different directions during startup vs. shutdown and other load states, sequenced loading, including sequenced thermal loading and unloading, is often needed to determine worst case reactions and stresses.</span></span><br />
<br />
<img src="https://www.csiamerica.com/sites/default/files/sequential_loading2.png" style="height: 267px; width: 900px;" /></p>

<div>&nbsp;</div>
</div>

<div class="clear" style="height: 10px">&nbsp;</div>

<div class="ma15" id="content-tab">&nbsp;</div>

<div class="clear" style="height: 30px">&nbsp;</div>
</div>

<div class="clearfix ma15 tinhnang text-center" id="detailFT4">
<h2 style="font-size: 40px;" title="Output and Display"><span>Output and Display</span></h2>

<div class="ma15 text-left">
<p style="text-align: center;"><span style="font-size:24px;"><span style="font-family:arial,helvetica,sans-serif;">Center of Gravity (CG) Calculations</span></span></p>

<p style="text-align: center;"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:16px;">Weight of equipment, cable trays and other items may be assigned as a distributed load or concentrated point loads in the analysis model. CSiPlant enables users to select which loads to include in a Center of Gravity (CG) case and multiple CG cases can be defined and evaluated in the same analysis.</span></span></p>

<p style="text-align: center;">&nbsp;</p>

<p style="text-align: center;"><span style="font-family: arial, helvetica, sans-serif; font-size: 24px;">Deformed Geometry</span></p>

<p style="text-align: center;"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:16px;">Users can display deformed geometry based on any load or combination of loads, as well as animations of modes.</span></span></p>

<p style="text-align: center;"><img src="https://www.csiamerica.com/sites/default/files/deformed_shape2.png" style="height: 416px; width: 900px;" /></p>

<p style="text-align: center;"><span style="font-family: arial, helvetica, sans-serif; font-size: 24px;">Pipe Frame Forces/Stresses</span></p>

<p style="text-align: center;"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:16px;">Display of pipe/frame forces and stresses can be based on load case, load combination, or modal case. Users can show resultant forces and&nbsp; stresses on any component in any direction. Control the stress contour appearance by showing undeformed, deformed, or extruded shapes, with or without loading values.</span></span></p>

<p style="text-align: center;"><img src="https://www.csiamerica.com/sites/default/files/forces-stresses3.png" style="height: 386px; width: 900px;" /></p>

<p style="text-align: center;"><span style="font-size:24px;"><span style="font-family:arial,helvetica,sans-serif;">Tabular Output</span></span></p>

<p style="text-align: center;"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:16px;">CSiPlant has the ability to display&nbsp; tables for all input data, analysis results, and design results. Tables support sort, cut, copy, and paste for use in other programs. Print or save tabular data to Access, Excel, Word, HTML, or TXT.</span></span><br />
<br />
<img src="https://www.csiamerica.com/sites/default/files/tabular_output2.png" style="height: 594px; width: 900px;" /></p>
</div>

<div class="clear" style="height: 10px">&nbsp;</div>

<div class="ma15" id="content-tab">&nbsp;</div>

<div class="clear" style="height: 30px">&nbsp;</div>
</div>

<div class="clearfix ma15 tinhnang text-center" id="detailFT5">
<h2 style="font-size: 40px;" title="Import and Export"><span>Import and Export</span></h2>

<div class="ma15 text-left">
<p style="text-align: center;"><span style="font-size:24px;"><span style="font-family:arial,helvetica,sans-serif;">Comprehensive Integration</span></span></p>

<p style="text-align: center;"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;">CSiPlant allows for integration between piping stress and structural analysis programs. Import detailed SAP2000 structural analysis models into CSiPlant and auto-connect to the piping stress model for coupled nonlinear analysis and design. Import geometry from CII neutral file.</span></span></p>

<p style="text-align: center;">&nbsp;</p>

<p style="text-align: center;"><span style="font-size:24px;"><span style="font-family: arial, helvetica, sans-serif;">SAP2000 Interoperability</span></span></p>

<p style="text-align: center;"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:16px;">The model import from SAP2000 to CSiPlant is comprehensive and includes load assignments, frame sections and local axes, releases, grids, supports, mass definitions for static seismic and dynamic analysis cases, and other assignments and definitions. Reactions at pipe support locations from the coupled analysis in CSiPlant can be selectively exported back into SAP2000 with options to filter by pipe section and load case. Reactions from SAP2000 can then be automatically exported into SAFE for concrete foundation design to integrate foundation analysis and design with analysis of the structure and piping.</span></span><br />
<br />
<img src="https://www.csiamerica.com/sites/default/files/import-plant.png" style="height: 643px; width: 900px;" /></p>

<div>&nbsp;</div>
</div>
</div>
`,
    videoUrl: 'https://www.youtube.com/embed/f1amTKfod-o',
    documents: [
      { name: 'Bộ cài đặt phần mềm CSiPlant Evaluation', size: '150.0 MB', url: 'http://installs.csiamerica.com/software/csiplant/5/CSiPlantv511setup.exe' }
    ]
  },
  {
    id: 11,
    name: 'GeoStudio - Gói phần mềm phân tích ổn định mái dốc',
    icon: 'https://www.cic.com.vn/images/products/2019/10/23/original/slope-pfa_1571797775.jpg',
    img: 'https://www.cic.com.vn/images/products/2019/10/23/large/GeoStudio_1.jpg',
    price: 'Liên hệ',
    description: 'GeoStudio gói phần mềm mô hình hóa địa kỹ thuật dành cho các kỹ sư, chuyên gia địa kỹ thuật',
    field: 'Địa kỹ thuật & Địa vật lý',
    brand: 'Seequent / Bentley',
    app: 'Phân tích Mái dốc & Đất nền',
    productType: 'Phần mềm',
    slides: [
      'https://www.cic.com.vn/images/products/2019/10/23/large/GeoStudio_1.jpg',
      'https://www.cic.com.vn/images/products/2019/10/23/large/quake-pfa.jpg',
      'https://www.cic.com.vn/images/products/2019/10/23/large/slope-pfa.jpg',
      'https://www.cic.com.vn/images/products/2019/10/23/large/seep-pfa.jpg',
      'https://www.cic.com.vn/images/products/2024/08/16/large/geostudio0.jpg'
    ],
    overviewHtml: `<p><meta charset="utf-8" /></p>

<p dir="ltr"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><b id="docs-internal-guid-0c8a4343-7fff-338d-04e6-d27f4054b893">GeoStudio</b></span></span></p>

<p dir="ltr"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">GeoStudio gói phần mềm mô hình hóa địa kỹ thuật dành cho các kỹ sư, chuyên gia địa kỹ thuật nhằm giải quyết các bài toán:&nbsp;</span></span></p>

<p dir="ltr"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><b id="docs-internal-guid-0c8a4343-7fff-338d-04e6-d27f4054b893">Các tính năng chính</b></span></span></p>

<ul>
	<li dir="ltr">
	<p dir="ltr" role="presentation"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Các loại mô hình vật liệu thông thường và hiện đại:</span></span></p>

	<ul>
		<li dir="ltr">
		<p dir="ltr" role="presentation"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Mô hình Đàn hồi tuyến tính</span></span></p>
		</li>
		<li dir="ltr">
		<p dir="ltr" role="presentation"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Mô hình Đàn hồi điều chỉnh</span></span></p>
		</li>
		<li dir="ltr">
		<p dir="ltr" role="presentation"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Mô hình Mohr-Coulomb</span></span></p>
		</li>
		<li dir="ltr">
		<p dir="ltr" role="presentation"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Mô hình Mohr-Coulomb cải tiền với sự hóa cứng / hóa mềm</span></span></p>
		</li>
		<li dir="ltr">
		<p dir="ltr" role="presentation"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Mô hình Drucker-Prager</span></span></p>
		</li>
		<li dir="ltr">
		<p dir="ltr" role="presentation"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Mô hình Cam Clay</span></span></p>
		</li>
		<li dir="ltr">
		<p dir="ltr" role="presentation"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Mô hình Hypoplastic cho đất sét</span></span></p>
		</li>
	</ul>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Đa dạng các cấu kiện thông thường:</span></span></p>

	<ul>
		<li dir="ltr">
		<p dir="ltr" role="presentation"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tường bê tông, tường cọc, tường cọc chống (tường được tăng cứng). Lớp ốp hầm được mô hình hóa bởi các cấu kiện dầm với tiết diện và vật liệu được liệt kê thành danh mục</span></span></p>
		</li>
		<li dir="ltr">
		<p dir="ltr" role="presentation"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Neo</span></span></p>
		</li>
		<li dir="ltr">
		<p dir="ltr" role="presentation"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Chống</span></span></p>
		</li>
		<li dir="ltr">
		<p dir="ltr" role="presentation"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Gia cường (vải địa kỹ thuật, lưới địa kỹ thuật)</span></span></p>
		</li>
	</ul>
	</li>
</ul>

<p style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img alt="" src="https://www.cic.com.vn/upload_images/images/2024/DCS/Geoslope_Slope_W.png" style="width: 650px; height: 362px;" /></span></span></p>

<p>&nbsp;</p>

<p>&nbsp;</p>

<p>&nbsp;</p>

<p>&nbsp;</p>

<p><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><meta charset="utf-8" /></span></span></p>

<p dir="ltr"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><b id="docs-internal-guid-583607c3-7fff-5661-5565-2aab62a2a8c8">&nbsp;Tính năng mô hình GEOSTUDIO</b></span></span></p>

<ul>
	<li dir="ltr">
	<p dir="ltr" role="presentation"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Các phần tử tiếp xúc giữa đất và kết cấu với quan hệ ứng suất – biến dạng phi tuyến</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Phần mềm có kể đến các giai đoạn thi công trong quá trình xây dựng</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Số lượng bất kỳ của tải trọng phụ thêm (tải theo dải, hình thang, đường thẳng). Có thể thêm vào mô hình trong bất cứ giai đoạn thi công nào</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Các điều kiện biên có thể được phát sinh tự động. Được định nghĩa riêng cho các điểm hoặc các đường thẳng được chọn</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Mực nước ngầm có thể được định nghĩa bởi người dùng hoặc tính toán trong GEOSTUDIO&nbsp; – Dòng chảy của nước có được nhập vào qua bộ nhớ tạm Geo Clipboard</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Mỗi mô hình vật liệu có thể trong điều kiện thoát nước hoặc không thoát nước</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Phân tích ổn định có thể thực hiện trong mọi giai đoạn thi công với tải trọng tĩnh hoặc động đất đưa ra hệ số an toàn tương ứng</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Danh sách các biến số bao quát (lún, ứng suất, biến dạng, mềm dẻo, áp lực nước lỗ rỗng, v.v...). Được in ra trên mô hình biến dạng hoặc không biến dạng</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Sự phân phối nội lực và biến dạng của cấu kiện</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Sự thay đổi số lượng tại các điểm được chọn được quan sát bằng hình ảnh và biểu đồ</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Công cụ sinh lười phát các cảnh báo về các bộ phận địa hình có vấn đề</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Kích thước các phần tử có thể được điều chỉnh bằng điểm. Điều chỉnh đường thẳng và làm mịn tự do</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Chương trình có hỗ trợ nhập và xuất file DXF</span></span></p>
	</li>
</ul>

<p>&nbsp;</p>

<p style="text-align: center;"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><img alt="" src="https://www.cic.com.vn/upload_images/images/2024/DCS/Geoslope_Seep_W.png" style="width: 650px; height: 436px;" /></span></span></p>

<p>&nbsp;</p>

<p>&nbsp;</p>

<p><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><meta charset="utf-8" /></span></span></p>

<p dir="ltr"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><b id="docs-internal-guid-bd6232b6-7fff-82c9-8943-78c9859f1cdb">GeoStudio SLOPE/W - Phân tích ổn định mái dốc</b></span></span></p>

<p dir="ltr" style="text-align: justify;"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">SLOPE / W là phần mềm phân tích ổn định mái dốc hàng đầu cho đá và đất. SLOPE / W phân tích các vấn đề đơn giản và phức tạp đối với nhiều hình dạng bề mặt trượt, điều kiện áp lực nước lỗ rỗng, tính chất đất, và điều kiện tải.</span></span></p>

<p dir="ltr" style="text-align: justify;"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Với phạm vi các tính năng này, SLOPE / W có thể được sử dụng để phân tích hầu hết các vấn đề ổn định dốc bạn sẽ gặp phải trong các dự án địa kỹ thuật, dân dụng, cầu đường và khai thác mỏ.</span></span></p>

<p dir="ltr"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><b id="docs-internal-guid-bd6232b6-7fff-82c9-8943-78c9859f1cdb">GeoStudio SEEP/W Phân tích dòng chảy ngầm trong đất</b></span></span></p>

<p dir="ltr"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">SEEP / W là một sản phẩm phần mềm mạnh mẽ để mô phỏng lưu lượng nước ngầm trong môi trường đất xốp. SEEP / W có thể mô phỏng các vấn đề ổn định trạng thái bão hòa đơn giản hoặc phân tích phức tạp bão hòa / không bão hòa với sự ảnh hưởng không khí tại bề mặt đất.</span></span></p>

<p dir="ltr"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">SEEP / W có thể được áp dụng cho việc phân tích và thiết kế các công trình kỹ thuật địa chất, dân dụng, địa chất thủy văn và khai thác mỏ.</span></span></p>

<p dir="ltr"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><b id="docs-internal-guid-bd6232b6-7fff-82c9-8943-78c9859f1cdb">GeoStudio SIGMA/W Phân tích ứng suất và biến dạng</b></span></span></p>

<p dir="ltr"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">SIGMA / W là sản phẩm phần mềm mạnh để mô hình hóa ứng suất và biến dạng trong đất và các vật liệu kết cấu. Phân tích SIGMA / W có thể bao gồm từ mô phỏng hồi quy tuyến tính đơn giản đến các vấn đề tương tác cấu trúc đất với các mô hình vật liệu phi tuyến.</span></span></p>

<p dir="ltr"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Nhiều mô hình cấu thành đất cho phép bạn đại diện cho một loạt các loại đất hoặc vật liệu. Thêm vào đó, mô hình SIGMA / W tạo áp suất nước lỗ rỗng. Mô hình làm tiêu tán để đáp ứng với tải trọng bên ngoài. Với SIGMA/W bạn có thể phân tích gần như bất kỳ vấn đề nào.</span></span></p>

<p dir="ltr"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><b id="docs-internal-guid-bd6232b6-7fff-82c9-8943-78c9859f1cdb">GeoStudio QUAKE/W Phân tích động đất động</b></span></span></p>

<p dir="ltr"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">QUAKE/W là một sản phẩm phần mềm mạnh mẽ để mô hình hoá sự cố động đất và tải động. QUAKE/W xác định chuyển động; áp lực nước lỗ rỗng tăng lên do động đất; vụ nổ; hoặc các va chạm đột ngột</span></span></p>

<p dir="ltr"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><b id="docs-internal-guid-bd6232b6-7fff-82c9-8943-78c9859f1cdb">GeoStudio TEMP/W Phân tích truyền nhiệt</b></span></span></p>

<p dir="ltr"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">TEMP/W là sản phẩm phần mềm phần tử hữu hạn để mô phỏng sự truyền nhiệt. TEM/W thay đổi pha trong đất xốp. TEMP/W có thể phân tích các vấn đề từ đơn giản đến mô phỏng năng lượng bề mặt phức tạp. Phân tích với chu kỳ đông lạnh-tan băng.</span></span></p>

<p dir="ltr"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Phần mềm này có thể được sử dụng cho các phân tích địa nhiệt và thiết kế các công trình địa kỹ thuật, dân dụng và khai thác mỏ, bao gồm các hệ thống chịu lạnh và thay đổi nhiệt độ tan băng.</span></span></p>

<p dir="ltr"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><b id="docs-internal-guid-bd6232b6-7fff-82c9-8943-78c9859f1cdb">GeoStudio CTRAN/W Phân tích chuyển pha và khí</b></span></span></p>

<p dir="ltr"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">CTRAN / W là một sản phẩm phần mềm mạnh mẽ để mô hình hoá chất tan. Truyền khí trong môi trường xốp. CTRAN / W có thể được sử dụng để mô hình hóa các hệ thống phổ cập đơn giản thông qua các hệ thống phân tán va chạm phức tạp với các phản ứng bậc nhất.</span></span></p>

<p dir="ltr"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">CTRAN / W có thể được sử dụng để mô hình một loạt các vấn đề môi trường địa lý liên quan đến sự di chuyển của các loài hoặc khí tan được bắt nguồn từ nguồn nhân tạo hoặc tự nhiên.</span></span></p>

<p dir="ltr"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><b id="docs-internal-guid-bd6232b6-7fff-82c9-8943-78c9859f1cdb">GeoStudio AIR/W Phân tích chuyển tiếp không khí</b></span></span></p>

<p dir="ltr"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">AIR / W là một sản phẩm phần mềm mạnh mẽ để mô hình chuyển đổi không khí trong chất thải mỏ và các vật liệu xốp khác, AIR / W có thể được sử dụng để mô hình hóa một loạt các kịch bản, từ các vấn đề đơn giản về không khí chuyển pha cho đến các hệ thống nước không khí kết hợp.</span></span></p>

<p dir="ltr"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Sức mạnh của AIR / W khi kết hợp với TEMP / W để mô hình dòng nhiệt không khí đối lưu và lưu lượng không khí phụ thuộc vào mật độ. Loại phân tích này rất quan trọng cho việc nghiên cứu việc đóng cửa mỏ, thoát nước đá axit, hoặc chuyển khí. Vấn đề ứng suất hoặc biến dạng nào bạn sẽ gặp phải.</span></span></p>

<p style="text-align: center;"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><img alt="" src="https://www.cic.com.vn/upload_images/images/2024/DCS/BUILD3D_Tutorial_4_-_Swept_tunnel_and_imported_ground_surface.jpg" style="width: 650px; height: 346px;" /></span></span></p>

<p style="text-align: center;">&nbsp;</p>

<p>&nbsp;</p>

<p>&nbsp;</p>

<p>&nbsp;</p>

<p>&nbsp;</p>

<p>&nbsp;</p>`,
    featuresHtml: `<p style="text-align: justify;" title="Một dự án đơn lẻ hoạc phức hợp"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Một dự án đơn lẻ hoạc phức hợp</span></span></strong></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" text-align:="" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">The integrated GeoStudio software suite allows you to combine multiple analyses using different products into a single modelling project. You can then use the results from one analysis as the starting conditions for another one. New analyses can be easily created by cloning an existing analysis and adjusting its properties. When you are ready to analyze the model, GeoStudio solves the analyses in the appropriate order, taking advantage of parallel processing.</span></span></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" text-align:="" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">This unique and powerful feature greatly expands the types of problems you can analyze. Use this approach to model construction sequences, establish initial conditions, perform sensitivity analyses, model complex time sequences, or simply decompose a complex problem into a number of smaller, more manageable analyses.</span></span></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" text-align:="" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Included with the purchase of any&nbsp;GeoStudio single product or bundle is a free GeoStudio Basic license. Analyses created with a Geostudio Basic license&nbsp;can be included in the same file as the full-featured GeoStudio analysis, further unlocking the power of integration.</span></span></p>

<p style="text-align: justify;" title="Nhiều chế độ view"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Nhiều chế độ view</span></span></strong></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" text-align:="" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Docking windows in GeoStudio allow you to view information in multiple views so you can quickly access the data you need. You can customize the display of docking windows to suit your particular needs. A status bar provides both view information and quick access to commands such as zooming, and a progress bar during lengthy operations such as solving.</span></span></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" text-align:="" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Docking windows include an Analysis Explorer, Solve Manager, Result Times, Slip Surfaces, and Sensitivity Runs. The Analysis Explorer displays a tree view of the analyses in the project, allowing you to quickly change the analysis you are viewing. The Solve Manager allows you to solve one or more analyses and watch their progress even while continuing to work on another analysis. The Result Times window displays a list of time steps that have computed results. When you select a time step, all currently displayed views and dialog boxes show the results computed for the selected time.</span></span></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" text-align:="" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">The Slip Surfaces window displays a list of SLOPE/W computed trial slip surfaces. When you select a slip surface, the Results view will show the complete slip surface results. If detailed results are unavailable, GeoStudio will compute them on-emand, allowing you to view detailed forces or graphs on any particular slip surface without having to designate it as a "critical" slip surface.</span></span></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" text-align:="" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">The Sensitivity Runs window displays a list of runs performed for a sensitivity analysis. Each sensitivity run is now a complete slope stability analysis, allowing you to view all computed slip surface results for each individual run.</span></span></p>

<p style="text-align: justify;" title="Định nghĩa hình học"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Định nghĩa hình học</span></span></strong></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" text-align:="" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Define Geometry using Drawing Tools or by Importing CAD files<br />
<br />
Defining the geometry of the physical system is usually the first step in a numerical analysis. GeoStudio provides all the tools necessary to define the model domain including coordinate import, copy-paste geometric items, length and angle feedback, region merge, region split, and direct keyboard entry of coordinates, lengths, and angles. Otho-snapping to horizontal and vertical directions can be used to facilitate geometry definition.&nbsp;</span></span></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" text-align:="" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">AutoCAD DWG or DXF files can be imported directly into GeoStudio for the definition of domain geometry. In addition, image files can be imported, scaled, and the region geometry drawn directly over top.</span></span></p>

<p style="text-align: justify;" title="Áp vật liệu"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Áp vật liệu</span></span></strong></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" text-align:="" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Apply Materials to the Domain for each Analysis<br />
<br />
Once the domain regions are defined, you can apply material properties to each of the regions individually or as a group. Applying materials to individual regions allows you to model different materials in different analyses. You can also remove portions of the domain in different analysis by not applying materials to these regions; this allows each analysis to consider new regions added to the domain in stages.</span></span></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" text-align:="" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Material properties can also be applied globally to all analyses in the project or to individual analyses. Applying materials across all analyses makes it easy to change your material definition when you are using many analyses in a single project.</span></span></p>

<p style="text-align: justify;" title="Mô hình đất và đá"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Mô hình đất và đá</span></span></strong></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Define Soil and Rock Material Models using Flexible, Generalized Functions<br />
<br />
GeoStudio makes broad use of generalized functions for material property and boundary condition definition. Enter parameters for pre-defined functions, or create your own functions using your own data. You can even write your own Add-In functions or constitutive models to compute material property values while the analysis is being solved, allowing you to extend GeoStudio in nearly infinite ways.</span></span></p>

<p style="text-align: justify;" title="Chia lưới PTHH"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Chia lưới PTHH</span></span></strong></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Automated Finite Element Meshing of the Geometry</span></span></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">When materials are applied to the domain regions in a finite element analysis, a default finite element mesh is automatically generated. While in many cases the default mesh is adequate, you can adjust the mesh either globally or by applying constraints to specific locations. This allows you to keep a coarse mesh in most regions while applying a fine mesh within particular portions of the domain that may have highly nonlinear properties or boundary conditions. As you adjust the local constraints, GeoStudio re-generates the mesh over the entire domain, while still preserving your existing model definition.</span></span></p>

<p style="text-align: justify;" title="Nhập tọa độ "><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Nhập tọa độ</span></span></strong></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Use the Keyboard to Enter Coordinates While Drawing Objects</span></span><br />
<span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Coordinates can be entered using your keyboard while any drawing command is active. This keyboard input option allows you to enter Point coordinates using the x-y coordinates, length and angle input, offset lengths in the x-y directions, or simply the Point numbers. A tooltip displays this information while drawing points using drawing commands such as Draw Regions. Undo and Redo is supported while using the drawing commands.</span></span></p>

<p style="text-align: justify;" title="Công cụ lập trình"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Công cụ lập trình</span></span></strong></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" text-align:="" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">You can write supplemental programs called Add-Ins that will be called by the GeoStudio Solver when it solves your analyses. A Function Add-In takes the place of a function defined in GeoStudio, and offers the flexibility of computing function results that vary dynamically based on the current mesh state.</span></span></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" text-align:="" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">GeoStudio provides an Add-In API (“application programming interface”) that your Add-In can use to query parameter values while GeoStudio is solving the analysis. You can use these values to return the required function parameter value. You can also use the Add-In API to write out your own custom parameters for later viewing using the regular GeoStudio result visualization features.</span></span></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" text-align:="" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Each Add-In function is an object that GeoStudio associates with either a node or gauss point, depending on the kind of function that references the Add-In. Boundary condition functions are assigned at nodes, and Material property functions at gauss points. There are many instances of the function object created when the solver runs, one for each node or gauss point where the function is used.</span></span></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" text-align:="" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">In SLOPE/W, an Add-In can be written to access data that exists at the base of a slice where that slice contacts the failure plane (or slip circle).</span></span></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" text-align:="" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">GeoStudio Add-Ins are based on Microsoft .NET, allowing you to write your Add-In using languages such as C#, F#, or VB.NET.</span></span></p>

<p style="text-align: justify;" title="Hiệu quả"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Hiệu quả</span></span></strong></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" text-align:="" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Efficient, Parallel Solving of the Project Analyses<br />
GeoStudio runs each analysis solver in parallel, allowing multiple analyses to be solved efficiently on computers with modern, multi-core processors. When analysing a single problem, the appropriate GeoStudio solver will still perform much of the computations in parallel.</span></span></p>

<p style="text-align: justify;" title="Hiển thị kết quả"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Hiển thị kết quả</span></span></strong></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" text-align:="" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Interpret Results with Powerful Graphing, Visualization, and Data Management</strong><br />
<br />
Interpretation is one of the most difficult aspects of numerical modelling. GeoStudio provides powerful tools for visualizing and interpreting the results:</span></span></p>

<ul box-sizing:="" color:="" helvetica="" list-style:="" square="" vertical-align:="">
	<li style="text-align: justify;">
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Graphing tools let you plot almost any computed parameter</span></span></p>
	</li>
	<li style="text-align: justify;">
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Contour plots display computed parameters that vary spatially over the domain</span></span></p>
	</li>
	<li style="text-align: justify;">
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Isolines display a single parameter value as a line in the domain</span></span></p>
	</li>
	<li style="text-align: justify;">
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Isolines computed at different times can be shown simultaneously on the domain</span></span></p>
	</li>
	<li style="text-align: justify;">
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Computed results over time can be plotted or animated in a movie</span></span></p>
	</li>
	<li style="text-align: justify;">
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Data can be interactively queried at any location</span></span></p>
	</li>
	<li style="text-align: justify;">
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Data can be exported and taken directly into a spreadsheet for further analysis</span></span></p>
	</li>
	<li style="text-align: justify;">
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Each GeoStudio product provides additional ways of interpreting the analysis results</span></span></p>
	</li>
</ul>

<p style="text-align: justify;" title="Vật liệu &amp; bảng điều kiện biên"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Vật liệu &amp; bảng điều kiện biên</span></span></strong></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Display a material and/or boundary condition table on the drawing. Customize the parameters to display in each table.&nbsp;&nbsp;Legends can also be displayed for contour plots and other visualization tools like factor of safety color maps in SLOPE/W.</span></span></p>

<p style="text-align: justify;" title="Thêm nhãn, ghi chú &amp; kích thước"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Thêm nhãn, ghi chú &amp; kích thước</span></span></strong></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Add Notes, Labels, Pictures, and Dimensions on the Drawing<br />
<br />
Additional notes can be added as text to the drawing. Add any text you like, or use “dynamic” text that is connected to your model data. This allows you to place labels on the drawing that automatically update as the model changes.</span></span></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Add pictures to your drawing such as a drawing created in AutoCAD, a corporate logo, or a photo of the site.</span></span></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Dimension your drawing using aligned, linear, and angular dimension tools. The dimensions can lock to geometric objects, such as points or lines, and automatically resize if changes are made to the domain.</span></span></p>

<p style="text-align: justify;" title="In ấn"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">In ấn</span></span></strong></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" text-align:="" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Create a Printing Template in Page Layout Mode<br />
The Page Layout mode allows for improved presentation of models and results. After setting up an analysis, you can switch to Page Layout to specify the printing properties, including page size and orientation, and drawing scale. This configuration can be saved as a template or an existing Page Layout configuration can be imported into the current file for consistent presentation of model results in multiple project files.</span></span></p>

<p style="text-align: justify;" title="Công cụ Command Line"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Công cụ Command Line</span></span></strong></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Automate GeoStudio with the GeoCmd Command Line Interface</strong><br />
GeoCmd is a command-line utility that makes it more convenient to work with large numbers of data files. You can automate GeoStudio to solve, upgrade, or generate reports for many project files sequentially.</span></span></p>

<p style="text-align: justify;" title="Files"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Files</span></span></strong></p>

<p box-sizing:="" color:="" helvetica="" style="text-align: justify;" vertical-align:=""><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Upgrade Files from Older GeoStudio Versions and Save to Older Formats<br />
GeoStudio can read in files created by any earlier version of GeoStudio. GeoStudio can also save your current project file as an older version, allowing you to continue working with other members of your team who are not using the latest GeoStudio version.</span></span></p>

<p style="text-align: justify;" title="Đa ngôn ngữ"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Đa ngôn ngữ</span></span></strong></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">The GeoStudio user interface can be shown in multiple languages besides English, including Chinese, French and Spanish. When installing GeoStudio, you can select your preferred language or change it later.</span></span></p>
`,
    videoUrl: 'https://www.youtube.com/embed/OnwYkk9MKsc'
  },
  {
    id: 12,
    name: 'Sumac - Phần mềm tính toán san nền',
    icon: 'https://www.cic.com.vn/images/products/2019/11/01/original/sumacico_1572579417.jpg',
    img: 'https://www.cic.com.vn/images/products/2019/11/01/large/1_1572593329_1.png',
    price: '2.000.000 VNĐ',
    description: 'Trong lĩnh vực tư vấn thiết kế, quy hoạch xây dựng và giao thông... sự trợ giúp của máy tính với các phần mềm tính toán ngày càng trở nên thông dụng. Việc xây dựng một chương trình tính toán, mô hình hoá địa hình...',
    field: 'Xây dựng & Hạ tầng',
    brand: 'CIC Tech',
    app: 'Tính toán San nền',
    productType: 'Phần mềm',
    slides: [
      'https://www.cic.com.vn/images/products/2019/11/01/large/1_1572593329_1.png',
      'https://www.cic.com.vn/images/products/2019/11/01/large/6_1572593329_1.png',
      'https://www.cic.com.vn/images/products/2019/11/01/large/4_1572593329_1.png',
      'https://www.cic.com.vn/images/products/2019/11/01/large/8_1572593329_1.png',
      'https://www.cic.com.vn/images/products/2019/11/01/large/10_1572593329_1.png'
    ],
    overviewHtml: `<h2 style="text-align: justify;"><strong>Phần mềm tính toán, thiết kế san nền - Sumac</strong></h2>

<p style="text-align: justify;">Trong lĩnh vực tư vấn thiết kế, quy hoạch xây dựng và giao thông, phần mềm Sumac do Trung tâm Phần mềm Xây dựng (Công ty CP Công nghệ và Tư vấn CIC) phát triển giúp mô hình hóa chính xác bề mặt địa hình, tạo đường đồng mức và tính toán khối lượng đào đắp san lấp công trình. Sumac sở hữu giao diện đồ họa quen thuộc như AutoCAD, kết xuất bản vẽ định dạng DWG/DXF và bảng tính Excel.</p>

<h2 style="text-align: justify;"><strong>Các tính năng cốt lõi của Sumac</strong></h2>

<p style="text-align: justify;">1. <strong>Nhập dữ liệu địa hình:</strong> Nhập từ máy đo, nhập trực tiếp trên màn hình đồ họa, đọc file text hoặc file AutoCAD (*.dwg, *.dxf).<br/>
2. <strong>Mô hình hóa bề mặt:</strong> Mô tả bề mặt 3D dạng mặt cong hoặc lưới tam giác (TIN) trực quan.<br/>
3. <strong>Đường đồng mức & Bình đồ:</strong> Tự động tạo đường đồng mức tự nhiên và thiết kế dạng đường liền mạch, tùy chỉnh khoảng cao độ và màu sắc.<br/>
4. <strong>Mặt cắt địa hình:</strong> Tạo mặt cắt theo tuyến chỉ định, tự động chia bước cọc và gắn tên mặt cắt.<br/>
5. <strong>Tính toán san nền & Taluy:</strong> Tính đào đắp theo điểm khống chế cao độ, mặt phẳng thiết kế hoặc đường đồng mức thiết kế. Tính khối lượng công tác đất tại các taluy viền khu đất.<br/>
6. <strong>Xuất kết quả:</strong> Kết xuất bản vẽ AutoCAD (*.dwg) phân lớp rõ ràng và bảng tổng hợp khối lượng ra Excel.</p>

<p style="text-align: center;"><img alt="sumac-3d" src="https://cic.com.vn/uploads/images/Sumac/Bemat3dsumacRender.PNG" style="width: 580px; max-width: 100%; height: auto;" /></p>`,
    featuresHtml: `<h2 style="text-align: justify;"><strong>Hướng dẫn sử dụng nhanh phần mềm Sumac</strong></h2>

<p style="text-align: justify;">- <strong>Bước 1: Chuẩn bị số liệu hiện trạng:</strong> Mở bản vẽ hiện trạng AutoCAD, lọc giữ lại các điểm đo địa hình tự nhiên, vẽ Polyline khép kín xác định ranh giới lô đất và lưu dạng AutoCAD 2000.<br/>
- <strong>Bước 2: Nhập dữ liệu vào Sumac:</strong> Chọn menu <em>Tệp tin -> Nhập số liệu...</em> để tải file hiện trạng vào chương trình.<br/>
- <strong>Bước 3: Khai báo địa hình tự nhiên:</strong> Vào <em>Địa hình TN -> Chuyển Text thành cọc tự nhiên</em>.<br/>
- <strong>Bước 4: Khai báo thông số thiết kế:</strong> Khai báo lưới nội suy tam giác, kích thước ô lưới đào đắp (ví dụ: 50m) và chọn đường biên giới hạn lô đất.<br/>
- <strong>Bước 5: Khai báo địa hình thiết kế:</strong> Chêm các điểm khống chế cao độ thiết kế, chọn <em>Xây dựng đường đồng mức TK</em>.<br/>
- <strong>Bước 6: Mô hình hóa địa hình:</strong> Chọn <em>Bình đồ -> Mô hình hoá bề mặt</em> để xem mô hình 3D.<br/>
- <strong>Bước 7: Kết xuất kết quả:</strong> Chọn <em>San lấp -> Kết xuất kết quả ra bản vẽ</em> và xuất file DWG hoặc bảng khối lượng sang Excel.</p>

<p style="text-align: center;"><img alt="sumac-kq" src="https://cic.com.vn/uploads/images/Sumac/KQSanNen1.png" style="width: 480px; max-width: 100%; height: auto;" /></p>`,
    videoUrl: 'https://www.youtube.com/embed/2q7uLM-qqOA',
    documents: [
      { name: 'Bộ cài đặt Sumac Full Setup', size: '45.0 MB', url: 'https://dutoancic.vn/sanpham/BoCai/SumacFullSetup.exe' },
      { name: 'Bộ cài đặt Sumac Demo Setup', size: '28.0 MB', url: 'https://cic.com.vn/tienich/BoCai_KhoaCu/Sumac3.1.0.2208DemoSetup.exe' }
    ]
  },
  {
    id: 13,
    name: 'Summit X One - Thiết bị đo địa chấn đa kênh của hãng DMT (Đức)',
    icon: 'https://www.cic.com.vn/images/products/2020/04/24/original/d1.JPG',
    img: 'https://www.cic.com.vn/images/products/2020/04/24/original/d1.JPG',
    price: 'Liên hệ',
    description: 'SUMMIT X One là hệ thống thu thập dữ liệu địa chấn linh hoạt, cung cấp giải pháp tốt nhất cho các phép đo địa chấn 2D và 3D độ phân giải cao ở mọi địa hình.',
    field: 'Khảo sát & Địa chất',
    brand: 'DMT (Đức)',
    app: 'Kiểm định & Khảo sát GPR',
    productType: 'Thiết bị',
    slides: [
      'https://www.cic.com.vn/images/products/2020/04/24/large/d1.JPG',
      'https://www.cic.com.vn/images/products/2020/04/24/large/d2.JPG',
      'https://www.cic.com.vn/images/products/2020/04/24/large/d3.JPG',
      'https://www.cic.com.vn/images/products/2020/04/24/large/d5.JPG'
    ],
    overviewHtml: `<p style="text-align: justify;"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><b>Hãng sản xuất:&nbsp;</b>DMT<br />
<b>Model:&nbsp;</b>Summit X One</span></span><br />
&nbsp;</p>

<h2 style="text-align: justify;"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><b>Ứng dụng&nbsp;</b></span></span><strong><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">của thiết bị đo địa chấn Summit X One</span></span></strong></h2>

<p style="text-align: justify;"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><b>- </b>Khảo sát địa chất công trình.</span></span></p>

<p style="text-align: justify;"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">- Khảo sát địa chất môi trường.</span></span></p>

<p style="text-align: justify;"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">- Tìm kiếm thăm dò dầu khí.</span></span></p>

<p style="text-align: justify;"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">- Tìm kiếm thăm dò khoáng sản.</span></span></p>

<p style="text-align: justify;"><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">- Khảo cổ học.</span></span></p>

<p style="text-align: justify;">&nbsp;</p>

<h2 style="text-align: justify;"><strong><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Tính năng của thiết bị đo địa chấn Summit X One</span></span></strong></h2>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">SUMMIT X One là hệ thống được tối ưu hóa tốt nhất cho tất cả các ứng dụng địa chấn (ví dụ: địa chấn phản xạ, địa chấn khúc xạ, địa chấn độ phân giải cao, MASW, REMI,...) với tính linh hoạt và khả năng tương thích cao.</span></span></p>

<ul>
    <li>
        <h3 style="text-align: justify;"><span style="font-size:18px;"><strong><em><span style="font-family:Times New Roman,Times,serif;">Tương thích với tất cả các nguồn địa chấn:</span></em></strong></span></h3>
    </li>
</ul>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Nguồn búa đập</span></span></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Nguồn rung</span></span></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Nguồn nổ</span></span></p>

<p style="text-align: center;">
<img alt="thiet-bi-do-dia-chan-1" src="https://www.cic.com.vn/upload_images/images/2020/07/17/sum1.JPG" style="width:650px;height:436px;">
</p>

<p style="text-align:center;">&nbsp;</p>

<ul>
    <li style="text-align:justify;">
        <h3><strong><em><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tương thích với tất cả các loại geophone:</span></span></em></strong></h3>
    </li>
</ul>

<p style="text-align:justify;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Geophone 1C, 3C</p>

<p style="text-align:justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Borehole geophone, land geophone</span></span></p>

<p style="text-align:justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Hydrophone</span></span></p>

<p style="text-align:justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Các tần số tự nhiên khác nhau (ví dụ: 4,5 Hz, 10 Hz, 14 Hz, 28 Hz, 100 Hz,...)</span></span></p>

<p style="text-align:center;">
<img alt="thiet-bi-do-dia-chan-2" src="https://www.cic.com.vn/upload_images/images/2020/07/17/sum2.jpg" style="width:650px;height:228px;">
</p>

<p style="text-align:center;">&nbsp;</p>

<ul>
    <li style="text-align:justify;">
        <h3><strong><em><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tính linh hoạt cao nhờ công nghệ SNAP ON</span></span></em></strong></h3>
    </li>
</ul>

<p style="text-align:justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Các geophone có thể kết nối với cáp địa chấn ở bất kỳ vị trí nào. Điều này giúp SUMMIT X One trở thành một giải pháp tối ưu cho các khảo sát địa chấn 2D và 3D có độ phân giải cao trong các địa hình phức tạp.</span></span></p>

<p style="text-align:center;">
<img alt="thiet-bi-do-dia-chan-3" src="https://www.cic.com.vn/upload_images/images/2020/07/17/sum3.jpg" style="width:650px;height:264px;">
</p>

<p style="text-align:center;">&nbsp;</p>

<ul>
    <li style="text-align:justify;">
        <h3><strong><em><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Khả năng mở rộng kênh linh hoạt</span></span></em></strong></h3>
    </li>
</ul>

<p style="text-align:justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Hệ thống Summit X One có khả năng mở rộng kênh linh hoạt, phù hợp với nhiều loại hình khảo sát địa chấn 2D, 3D khác nhau.</span></span></p>

<p style="text-align:center;">
<img alt="thiet-bi-do-dia-chan-4" src="https://www.cic.com.vn/upload_images/images/2020/07/17/sum4.JPG" style="width:650px;height:422px;">
</p>

<p style="text-align:center;">&nbsp;</p>

<p style="text-align:center;">
<img alt="thiet-bi-do-dia-chan-4" src="https://www.cic.com.vn/upload_images/images/2020/07/17/sum5.JPG" style="width:650px;height:412px;">
</p>

<p style="text-align:center;">&nbsp;</p>

<p style="text-align:center;">
<img alt="thiet-bi-do-dia-chan-5" src="https://www.cic.com.vn/upload_images/images/2020/07/17/sum6.JPG" style="width:650px;height:413px;">
</p>

<p style="text-align:center;">&nbsp;</p>

<p style="text-align:center;">
<img alt="thiet-bi-do-dia-chan-6" src="https://www.cic.com.vn/upload_images/images/2020/07/17/sum7.JPG" style="width:650px;height:422px;">
</p>

<p style="text-align:justify;">&nbsp;</p>`
  },
  {
    id: 14,
    name: 'FIFISH E-GO - Rô bốt kiểm tra dưới nước',
    icon: 'https://www.cic.com.vn/upload_images/images/2024/STC/1(1).jpg',
    img: 'https://www.cic.com.vn/upload_images/images/2024/STC/1(1).jpg',
    price: 'Liên hệ',
    description: 'FIFISH E-GO là thiết bị robot chuyên dụng cho khám phá và ghi hình dưới nước với hiệu suất cao và thiết kế linh hoạt.',
    field: 'Thiết bị & IoT',
    brand: 'QYSEA',
    app: 'Quản lý & Giám sát',
    productType: 'Thiết bị',
    slides: [
      'https://www.cic.com.vn/images/products/2024/12/30/large/robot1.jpg',
      'https://www.cic.com.vn/images/products/2024/12/30/large/robot.jpg'
    ],
    videoUrl: 'https://www.youtube.com/embed/ubmXVWjJr7c',
    overviewHtml: `<p style="text-align: center;"><img alt="FIFISH E-GO" src="https://www.cic.com.vn/upload_images/images/2024/STC/1(1).jpg" style="width: 600px; max-width: 100%; height: auto;" /></p>
<p><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><strong>Hãng sản xuất: </strong>QYSEA</span></span></p>
<p><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><strong>Model:&nbsp;</strong>FIFISH E-GO</span></span></p>
<h2><strong><font face="Times New Roman, Times, serif"><span style="font-size: 18px;">Ứng dụng</span></font></strong></h2>
<p><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">- Kiểm tra và chụp ảnh các cơ sở hạ tầng ngoài khơi.</span></span></p>
<p><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">- Hỗ trợ các hoạt động tìm kiếm và cứu nạn.</span></span></p>
<p><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">- Điều tra tài nguyên biển</span></span></p>
<h2><strong><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Tính năng</span></span></strong></h2>
<p><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">- Hoạt động tốt ở độ sâu 100m (có tùy chọn lên đến 200m)</span></span></p>
<p><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">- Điều khiển và vận hành rô bốt từ xa</span></span></p>
<p><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">- Q-Steady 3.0 tự ổn định và khóa vị trí bằng AI</span></span></p>
<p><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">- Tính năng AI cải thiện hình ảnh, màu sắc và hỗ trợ phát hiện, đếm cá</span></span></p>
<p><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">- Tích hợp các phụ kiện mở rộng như: tay rô bốt, thiết bị quét sonar, máy dò kim loại, thước đo, thiết bị lấy mẫu nước, cảm biến chất lượng nước…</span></span></p>
<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><strong>Thông số kỹ thuật</strong></span></span></h3>
<p><strong>- ROV:</strong> Độ sâu tối đa 100m (tùy chọn lên đến 200m), Kích thước 430 x 345 x 170mm, Trọng lượng 5.1kg, 6 cánh quạt đa hướng 360°, Khóa tư thế ±0.1°, Sai số độ sâu ±1cm.<br/>
<strong>- Pin:</strong> Thời gian hoạt động 2.5 giờ, 72Wh x 2, sạc nhanh 90% trong 1 giờ.<br/>
<strong>- Camera:</strong> Cảm biến 1/1.8", 8MP, f/2.5, FOV 120°, Quay video 4K/1080p, hỗ trợ JPEG/DNG.<br/>
<strong>- Phụ kiện mở rộng:</strong> Tay rô bốt, Sonar, Thiết bị lấy mẫu nước/bùn, Cảm biến DO, pH, Laser đo khoảng cách, siêu âm kim loại.<br/>
<strong>- Bảo hành:</strong> 12 tháng.</p>`,
    featuresHtml: `<h2><strong><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">Tính năng</span></span></strong></h2>

<p><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">- Hoạt động tốt ở độ sâu 100m (có tùy chọn lên đến 200m)</span></span></p>

<p><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">- Điều khiển và vận hành rô bốt từ xa</span></span></p>

<p><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">- Q-Steady 3.0 tự ổn định và khóa vị trí bằng AI</span></span></p>

<p><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">- Tính năng AI cải thiện hình ảnh, màu sắc và hỗ trợ phát hiện, đếm cá</span></span></p>

<p><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">- Tích hợp các phụ kiện mở rộng như: tay rô bốt, thiết bị quét sonar, máy dò kim loại, thước đo, thiết bị lấy mẫu nước, cảm biến chất lượng nước…</span></span></p>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;"><strong>Thông số kỹ thuật</strong></span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">- ROV</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Độ sâu tối đa: 100m (tùy chọn lên đến 200m).</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Kích thước: 430 x 345 x 170mm.</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Trọng lượng: 5.1kg.</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Cánh quạt: 6 (động cơ FIFISH).</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Khả năng di chuyển: đa hướng 360°</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Khóa tư thế: ±0.1° và di chuyển theo &nbsp;mọi hướng.</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Độ sâu: Sai số ±1cm.</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Nhiệt độ hoạt động: -10°C đến 50°C.</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">- Pin</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Thời gian hoạt động: 2.5 giờ.</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Dung lượng pin: 72Wh x 2.</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Số lượng: 2 pin tháo lắp dễ dàng.</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Thay thế nhanh: Không cần tắt thiết bị.</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Quản lý thông minh: Theo dõi, phát hiện trạng thái pin.</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Sạc nhanh: 90% trong 1 giờ</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">- Camera</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Cảm biến: 1/1.8”</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Độ phân giải: 8MP</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Khẩu độ: f/2.5</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ FOV (dưới nước): H:120°; V: 70°; D: 146°</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Phạm vi lấy nét: Từ 0.1m</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Ảnh: Độ phân giải 3840 x 2160, hỗ trợ định dạng JPEG và DNG.</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Video: Độ phân giải 4K; 1080p, 720p</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Mã hóa video: H.264 , H.265</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">- Các thiết bị có thể gắn thêm:</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Tay rô bốt&nbsp;</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Sonar</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Thiết bị lấy mẫu nước, bùn, cảm biến đo DO, độ đục, pH,…</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">+ Laser đo khoảng cách, la bàn, thiết bị siêu âm đo chiều dày kim loại,…</span></span></h3>

<h3><span style="font-family:Times New Roman,Times,serif;"><span style="font-size:18px;">- Thời gian bảo hành: 12 tháng</span></span></h3>
`
  },
  {
    id: 15,
    name: 'Piletest CHUM - Máy siêu âm cọc khoan nhồi',
    icon: 'https://www.cic.com.vn/images/products/2023/05/05/large/4.png',
    img: 'https://www.cic.com.vn/images/products/2023/05/05/large/4.png',
    price: 'Liên hệ',
    description: 'Thiết bị siêu âm cọc khoan nhồi CHUM của Piletest đáp ứng TCVN 9396:2012 Cọc khoan nhồi - Xác định tính đồng nhất của bê tông - Phương pháp xung siêu âm',
    field: 'Khảo sát & Địa chất',
    brand: 'Piletest',
    app: 'Kiểm định chất lượng',
    productType: 'Thiết bị',
    slides: [
      'https://www.cic.com.vn/images/products/2023/05/05/large/4.png',
      'https://www.cic.com.vn/images/products/2023/05/05/large/3.jpg',
      'https://www.cic.com.vn/images/products/2023/05/05/large/1.png',
      'https://www.cic.com.vn/images/products/2023/05/05/large/2.png'
    ],
    overviewHtml: `<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><b id="docs-internal-guid-4011be98-7fff-921b-a31b-74174f2ba116">Về máy siêu âm cọc khoan nhồi CHUM (Piletest)</b></span></span></h2>

<p dir="ltr" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Được thành lập cách đây trên 10 năm, Piletest chuyên phát triển các hệ thống kiểm tra cọc nhằm đảm bảo chất lượng cọc, đồng thời cũng cung cấp các thiết bị thực hiện đánh giá chất lượng các hệ thống móng sâu như cọc, cừ, caissons barrettes....</span></span></p>

<p dir="ltr" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Thiết bị siêu âm cọc khoan nhồi CHUM (Cross Hole Ultrasonic Monitor): sử dụng phương pháp Crosshole Sonic Logging (CSL) để thực hiện việc kiểm tra chất lượng thi công cọc khoan nhồi. Hệ thống sử dụng sóng siêu âm được gửi đi từ đầu dò phát tới đầu thu nhận thông qua môi trường ống có đầy nước được nhúng vào trong lòng bê tông</span></span></p>

<p dir="ltr" style="text-align: justify;">&nbsp;</p>

<p dir="ltr" style="text-align: center;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img alt="may-sieu-am-coc-khoan-nhoi-CHUM-Piletest" src="https://www.cic.com.vn/upload_images/images/2022/09/28/may-sieu-am-coc-khoan-nhoi-CHUM-Piletest.jpg" style="width: 650px; height: 435px;" /></span></span></p>

<p dir="ltr" style="text-align: justify;">&nbsp;</p>

<h2 dir="ltr" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><b id="docs-internal-guid-4011be98-7fff-921b-a31b-74174f2ba116">Một số ưu điểm của máy siêu âm cọc khoan nhồi của hãng Piletest:</b></span></span></h2>

<ol>
	<li dir="ltr">
	<p dir="ltr" role="presentation" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Thiết kế sản phẩm rất thông minh, gọn nhẹ, dễ dàng vận chuyển và kiểm tra ngoài hiện trường. Thiết kế máy tính tách rời thiết bị (kết nối qua cổng USB hoặc Bluetooth) có nhiều ưu điểm hơn so với thiết bị cọc khoan nhồi của các hãng khác có máy tính gắn cố định với:</span></span></p>
	</li>
</ol>

<ul>
	<li dir="ltr">
	<p dir="ltr" role="presentation" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Các trục trặc liên quan tới máy tính không ảnh hưởng tới toàn bộ thiết bị, việc khắc phục các lỗi liên quan tới máy tính cũng đơn giản hơn rất nhiều, chi phí thấp.</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Việc nâng cấp phần cứng và phần mềm của máy tính hoàn toàn nằm trong sự chủ động của người sử dụng với chi phí thấp, tính linh hoạt cao, luôn đảm bảo cả hệ thống luôn hoạt động nhanh, hiệu quả.</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Cắt giảm được chi phí đầu tư do không không bắt buộc phải mua máy tính, Quý khách hàng hoàn toàn có thể sử dụng laptop (hay PC pocket) hiện có trong đơn vị mình để kết nối với thiết bị cọc khoan nhồi của hãng Piletest (qua cổng USB hoặc Bluetooth).</span></span></p>
	</li>
</ul>

<ol start="2">
	<li dir="ltr">
	<p dir="ltr" role="presentation" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Thiết bị bền, hoạt động ổn định, cho tín hiệu có độ chính xác cao, được nhiều đơn vị kiểm định chất lượng công trình tại Việt Nam tin dùng.</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Phần mềm được cập nhật miễn phí trong vòng 10 năm.</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Các sản phẩm của Piletest được bảo hành tới 03 năm (trong khi các hãng khác chỉ bảo hành trong vòng 01 năm).</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Piletest là hãng có chính sách sau bán hàng tốt nhất trên thị trường, các chuyên gia giàu kinh nghiệm của Piletest rất nhiệt tình, luôn sẵn sàng hỗ trợ trực tiếp tới người sử dụng.</span></span></p>
	</li>
</ol>

<p dir="ltr" role="presentation" style="text-align: justify;">&nbsp;</p>

<h2 dir="ltr" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><b id="docs-internal-guid-4011be98-7fff-921b-a31b-74174f2ba116">Thiết bị siêu âm cọc khoan nhồi có thể phát hiện và đánh giá</b></span></span></h2>

<ul dir="ltr">
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Vết nứt</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Các vật lạ</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Rỗ và rỗng</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Ngưng kết bê tông</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Phát hiện các dị thường (độ phân giải phụ thuộc vào điều kiện thử)</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Xác định chính xác độ sâu của các dị thường</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Cho ảnh thời gian thực về kích thước hình dạng, vị trí của dị thường.</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Thực hiện phép kiểm tra cho từng lỗ</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Có chiều sâu lớn, có tỷ số tín hiệu/tiếng ồn cao, và thuật toán xử lý số liệu cao cấp</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Khả năng lưu giữ số liệu không hạn chế</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Thoả mãn hoàn toàn tiêu chuẩn</span></span></li>
</ul>

<p dir="ltr" style="text-align: justify;">&nbsp;</p>

<h2 dir="ltr" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><b id="docs-internal-guid-4011be98-7fff-921b-a31b-74174f2ba116">Các bước thực hiện thí nghiệm siêu âm cọc khoan nhồi</b></span></span></h2>

<p dir="ltr" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Thí nghiệm siêu âm cọc khoan nhồi với mục đích xác định tính đồng nhất của cọc khoan nhồi/barrette/tường trong đất/bê tông liền khối lớn dựa trên biểu đồ phổ siêu âm và tốc độ sóng lan truyền.</span></span></p>

<ol>
	<li dir="ltr">
	<p dir="ltr" role="presentation" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Kiểm tra ống siêu âm xem có chứa đầy nước và đã được thông</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Thả đồng thời 2 đầu đo xuống tận đáy ống</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Bật máy vào các thông số cần thiết</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Chạy test kiểm tra tín hiệu thu</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Kéo đều 2 đầu đo lên theo một vận tốc nhất định</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Scan tín hiệu để có được phổ siêu âm và các biểu đồ cần thiết khác</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Kiểm tra kết quả thu được và đo lại những điểm nghi vấn khuyết tật nếu thấy cần thiết</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Làm tương tự với cặp ống siêu âm khác</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Chuyển sang cấu kiện thí nghiệm tiếp theo</span></span></p>
	</li>
</ol>

<p dir="ltr" style="text-align: justify;">&nbsp;</p>

<h2 dir="ltr" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><b id="docs-internal-guid-4011be98-7fff-921b-a31b-74174f2ba116">Báo cáo kết quả thí nghiệm của thiết bị CHUM Piletest:</b></span></span></h2>

<ol>
	<li dir="ltr">
	<p dir="ltr" role="presentation" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tên, vị trí công trình</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Chủ đầu tư, Tư vấn thiết kế/giám sát, Nhà thầu thi công cọc, Đơn vị thí nghiệm</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Các số liệu về thí nghiệm siêu âm cọc khoan nhồi như kích thước, ngày đổ bê tông, ngày thí nghiệm</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Bảng tổng hợp kết quả thí nghiệm</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Biểu đồ phổ siêu âm và biểu đồ vận tốc sóng theo chiều sâu cấu kiện</span></span></p>
	</li>
	<li dir="ltr">
	<p dir="ltr" role="presentation" style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Kết luận chung và khuyến nghị biện pháp xử lý trong trường hợp cấu kiện có khuyết tật</span></span></p>
	</li>
</ol>
`,
    featuresHtml: `<h2 style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Hệ thống CHUM Piletest bao gồm:</strong></span></span></h2>

<ul>
	<li style="margin: 0cm 0cm 0.0001pt; text-align: justify;">
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">Bộ điều khiển chính CHUM</span></span></span></p>
	</li>
	<li style="margin: 0cm 0cm 0.0001pt; text-align: justify;">
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">Bộ sạc pin 110/220.</span></span></span></p>
	</li>
	<li style="margin: 0cm 0cm 0.0001pt; text-align: justify;">
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">2 bộ tời + cáp 100m.</span></span></span></p>
	</li>
	<li style="margin: 0cm 0cm 0.0001pt; text-align: justify;">
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">2 cảm biến thu/nhận sóng siêu âm.</span></span></span></p>
	</li>
	<li style="margin: 0cm 0cm 0.0001pt; text-align: justify;">
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">2 bộ đếm đo độ sâu.</span></span></span></p>
	</li>
	<li style="margin: 0cm 0cm 0.0001pt; text-align: justify;">
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">2 bộ cáp đo sâu dùng cho CSL và chụp cắt lớp. </span></span></span></p>
	</li>
	<li style="margin: 0cm 0cm 0.0001pt; text-align: justify;">
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">Thiết kế thông minh với máy tính tách rời (kết nối qua cổng USB)</span></span></span></p>
	</li>
	<li style="margin: 0cm 0cm 0.0001pt; text-align: justify;">
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">Phần mềm CHUM</span></span></span></p>
	</li>
	<li style="margin: 0cm 0cm 0.0001pt; text-align: justify;">
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">Phần mềm quan sát kết quả dạng 3D: 3DT Viewer.</span></span></span></p>
	</li>
	<li style="margin: 0cm 0cm 0.0001pt; text-align: justify;">
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">Phần mềm được cập nhật miễn phí trong vòng 10 năm.</span></span></span></p>
	</li>
	<li style="margin: 0cm 0cm 0.0001pt; text-align: justify;">
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">Hỗ trợ trực tuyến qua Internet trong 1 năm đầu: Khách hàng có thể gửi trực tiếp dữ liệu kết quả đo cho Piletest. Kết quả đo được phân tích bằng phần mềm CHUM 3D Tomograph. Sau khi phân tích xong dữ liệu, Piletest sẽ gửi lại kết quả cho khách hàng. Dữ liệu kết quả sẽ được quan sát bằng phần mềm 3DT viewer. </span></span></span></p>
	</li>
	<li style="margin: 0cm 0cm 0.0001pt; text-align: justify;">
	<p><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">Bảo hành 03 năm.</span></span></span></p>
	</li>
</ul>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;">&nbsp;</p>

<h2 style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">Thông số vật lý:</span></span></span></strong></h2>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">- Kích thước: &nbsp;&nbsp;&nbsp;430x325x105</span></span></span></p>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">- Khối lượng: &nbsp;&nbsp;3,8kg</span></span></span></p>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">- Nhiệt độ khi: &nbsp;Sử dụng: -25<sup>0</sup>C – 60<sup>0</sup>C</span></span></span></p>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;Bảo quản: -40<sup>0</sup>C – 70<sup>0</sup>C</span></span></span></p>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">&nbsp;<b>Nguồn:</b></span></span></span></p>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">- Pin: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pin sạc Lithium Ion 11,1V/4,4Ah</span></span></span></p>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">- Nguồn sạc: &nbsp;&nbsp;&nbsp;100 – 240VAC</span></span></span></p>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;">&nbsp;</p>

<h2 style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times=""><b>Tiêu chuẩn của thiết bị CHUM Piletest:&nbsp;</b></span></span></span></h2>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">Đạt và vượt ASTM D6760 – 08</span></span></span></p>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;">&nbsp;</p>

<h2 style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times=""><b>Thông số kỹ thuật của thiết bị CHUM Piletest:</b></span></span></span></h2>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:normal"><span new="" roman="" times="">- Đầu dò: 2 đầu dò thu/phát tín hiệu, tần số 50 kHz, vỏ bọc chống áp lực, đường kính 25 mm</span></span></span></span></p>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:normal"><span new="" roman="" times="">- Dây cáp: Dây cáp chịu lực cao nối đầu dò với bộ xử lý tín hiệu, có thể tách rời khỏi cuộn cáp</span></span></span></span></p>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:normal"><span new="" roman="" times="">- Hệ số mẫu: 500 kHz (độ phân giải 2µS)</span></span></span></span></p>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:normal"><span new="" roman="" times="">- Độ khuếch đại tín hiệu của đầu dò: 8 mức khuếch đại tự động</span></span></span></span></p>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">- Bộ đo sâu: 2 bộ đo sâu 24-bit. Sai số &lt;0.1%</span></span></span></p>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;">&nbsp;</p>

<h2 style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times=""><b>Hiệu năng:</b></span></span></span></h2>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:normal"><span new="" roman="" times="">- Chiều dài cọc đo được: 1 – 145m</span></span></span></span></p>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:normal"><span new="" roman="" times="">- Khoảng cách các ống tối đa: Lên tới 4m với bê tông chất lượng tốt</span></span></span></span></p>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:normal"><span new="" roman="" times="">- Năng suất kiểm tra: Lên tới 3000m cọc/ngày</span></span></span></span></p>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">- Khả năng lưu trữ dữ liệu: không giới hạn (do thiết kế thông minh với máy tính tách rời)</span></span></span></p>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;">&nbsp;</p>

<h2 style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times=""><b>Yêu cầu máy tính: </b></span></span></span></h2>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">- Windows 2000/XP/Vista. </span></span></span></p>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">- Độ phân giải màn hình tối thiểu 800x600 dpi</span></span></span></p>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;">&nbsp;</p>

<h2 style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times=""><b>Dữ liệu đầu&nbsp;ra:</b></span></span></span></h2>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span style="line-height:normal"><span new="" roman="" times="">- Thời gian tới, đường cong năng lượng sóng truyền và vận tốc sóng, biểu đồ “thác nước”, logic mờ, mô phỏng 3D.</span></span></span></span></p>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">- Ngôn ngữ: Giao diện nhiều ngôn ngữ khác nhau</span></span></span></p>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;">&nbsp;</p>

<h2 style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times=""><b>Tùy chọn thêm:</b></span></span></span></h2>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">- Các loại cáp tời chiều dài khác nhau: 50m, 100m, 150m hoặc đặt hàng riêng</span></span></span></p>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">- Phần mềm tính toán mô phỏng 3D</span></span></span></p>

<p style="margin: 0cm 0cm 0.0001pt; text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><span new="" roman="" times="">- Adapter 12V DC nối với bộ nguồn ôtô</span></span></span></p>
`
  },
  {
    id: 16,
    name: 'VinaSAS - Phần mềm tính toán thiết kế khung hỗn hợp',
    price: '10.000.000 VNĐ',
    description: 'Trong lĩnh vực tư vấn thiết kế xây dựng, vấn đề thiết kế công trình với sự tối ưu hóa hệ kết cấu khung dầm cột là tối quan trọng. VinaSAS đem lại giải pháp phân tích nội lực, tính toán cốt thép tối ưu.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'CIC Tech',
    app: 'Thiết kế CAD & BIM',
    productType: 'Phần mềm',
    img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80'
  },
  {
    id: 17,
    name: 'MBW - Phần mềm phân tích, thiết kế móng băng',
    price: '2.000.000 VNĐ',
    description: 'MBW là phần mềm tự động hoá phân tích thiết kế kết cấu móng băng bê tông cốt thép dưới hệ tường hoặc cột, xuất thuyết minh tính toán và bản vẽ kỹ thuật chuyên nghiệp.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'CIC Tech',
    app: 'Thiết kế CAD & BIM',
    productType: 'Phần mềm',
    img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80'
  },
  {
    id: 18,
    name: 'FIFISH V6 EXPERT - Rô bốt kiểm tra dưới nước',
    price: 'Liên hệ',
    description: 'FIFISH V6 EXPERT là rô bốt chuyên dụng phục vụ cho việc kiểm tra, đánh giá hiện trạng dưới nước, trang bị camera 4K sắc nét và hệ thống đèn LED siêu sáng lên đến 6000 lumens.',
    field: 'Thiết bị & IoT',
    brand: 'FIFISH',
    app: 'Quản lý & Giám sát',
    productType: 'Thiết bị',
    img: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80'
  },
  {
    id: 19,
    name: 'MCW - Phần mềm phân tích, thiết kế móng cọc',
    price: '2.000.000 VNĐ',
    description: 'MCW là chương trình tính toán thiết kế và kiểm tra đối với móng cọc đài thấp, tự động hóa toàn bộ quy trình từ tính sức chịu tải của cọc, phân bổ lực đến tính toán cốt thép đài móng.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'CIC Tech',
    app: 'Thiết kế CAD & BIM',
    productType: 'Phần mềm',
    img: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80'
  },
  {
    id: 20,
    name: 'FIFISH V-EVO - Rô bốt kiểm tra dưới nước',
    price: 'Liên hệ',
    description: 'FIFISH V-EVO là rô bốt chuyên dụng phục vụ cho việc chụp ảnh và quay phim dưới nước 360 độ góc siêu rộng, hỗ trợ lấy mẫu và khảo sát sinh vật biển, đập thủy điện.',
    field: 'Thiết bị & IoT',
    brand: 'FIFISH',
    app: 'Quản lý & Giám sát',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80'
  },
  {
    id: 21,
    name: 'stCAD - Phần mềm hỗ trợ vẽ thiết kế xây dựng và bóc tiên lượng',
    price: '1.500.000 VNĐ',
    description: 'stCAD là phần mềm hỗ trợ vẽ thiết kế xây dựng và tính tiên lượng dự toán công trình xây dựng, giúp tăng năng suất làm việc của kỹ sư thiết kế lên gấp nhiều lần.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'CIC Tech',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80'
  },
  {
    id: 22,
    name: 'FIFISH PRO V6 PLUS - Rô bốt kiểm tra dưới nước',
    price: 'Liên hệ',
    description: 'FIFISH PRO V6 PLUS là rô bốt chuyên dụng phục vụ cho việc kiểm tra, đánh giá sâu dưới đại dương, tích hợp GPS định vị dưới nước và cánh tay robot linh hoạt.',
    field: 'Thiết bị & IoT',
    brand: 'FIFISH',
    app: 'Quản lý & Giám sát',
    img: 'https://images.unsplash.com/photo-1504607798333-52a30db54a5d?auto=format&fit=crop&q=80'
  },
  {
    id: 23,
    name: 'PET - Thiết bị kiểm tra biến dạng nhỏ của cọc',
    price: 'Liên hệ',
    description: 'Thiết bị kiểm tra biến dạng nhỏ của cọc PET của Piletest đáp ứng TCVN 9397:2012 Cọc khoan nhồi và cọc đúc sẵn. Kiểm tra tính đồng nhất của cọc cực nhanh bằng phương pháp xung phản hồi.',
    field: 'Khảo sát & Địa chất',
    brand: 'Piletest',
    app: 'Kiểm định chất lượng',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80'
  },
  {
    id: 24,
    name: 'AutoCAD - Phần mềm thiết kế đồ họa 2D/3D chuyên nghiệp',
    price: 'Liên hệ',
    description: 'AutoCAD là giải pháp thiết kế bản vẽ hàng đầu thế giới của hãng Autodesk, hỗ trợ đắc lực cho kiến trúc sư, kỹ sư xây dựng, cơ khí trong việc thiết kế bản vẽ kỹ thuật chi tiết.',
    field: 'Giao thông & Cầu đường',
    brand: 'Autodesk (Mỹ)',
    app: 'Khảo sát địa hình',
    img: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80'
  },
  {
    id: 25,
    name: 'Trimble Business Center - Phần mềm xử lý dữ liệu trắc địa',
    price: 'Liên hệ',
    description: 'TBC là bộ phần mềm văn phòng toàn diện, tích hợp để xử lý dữ liệu đo đạc, khảo sát từ các thiết bị GNSS, trạm toàn đạc điện tử, máy quét laser 3D và máy bay không người lái.',
    field: 'Giao thông & Cầu đường',
    brand: 'Trimble (Mỹ)',
    app: 'Khảo sát địa hình',
    img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80'
  },
  {
    id: 26,
    name: 'Civil 3D - Phần mềm thiết kế hạ tầng giao thông',
    price: 'Liên hệ',
    description: 'Civil 3D của Autodesk hỗ trợ quy trình thiết kế và lập hồ sơ thông tin công trình (BIM) cho các dự án hạ tầng giao thông, cầu đường, quy hoạch đô thị và san nền.',
    field: 'Giao thông & Cầu đường',
    brand: 'Autodesk (Mỹ)',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1512418490979-917bd593a8ec?auto=format&fit=crop&q=80'
  },
  {
    id: 27,
    name: 'HEC-RAS - Phần mềm mô phỏng dòng chảy sông ngòi',
    price: 'Miễn phí',
    description: 'HEC-RAS là phần mềm tiêu chuẩn để mô hình hóa và phân tích thủy lực dòng chảy sông ngòi, tính toán ngập lụt, quy hoạch đê điều và thoát lũ đô thị.',
    field: 'Thủy lợi & Cấp thoát',
    brand: 'Trimble (Mỹ)',
    app: 'Mô phỏng & Dự báo',
    img: 'https://images.unsplash.com/photo-1468476775582-6bede20f356f?auto=format&fit=crop&q=80'
  },
  {
    id: 28,
    name: 'EPA-NET - Mô hình phân tích mạng lưới cấp nước',
    price: 'Miễn phí',
    description: 'EPANET là chương trình máy tính thực hiện mô phỏng thủy lực và chất lượng nước trong mạng lưới đường ống cấp nước có áp, hỗ trợ quản lý vận hành hiệu quả.',
    field: 'Thủy lợi & Cấp thoát',
    brand: 'Trimble (Mỹ)',
    app: 'Mô phỏng & Dự báo',
    img: 'https://images.unsplash.com/photo-1434064511983-18c6dae20ed5?auto=format&fit=crop&q=80'
  },
  {
    id: 29,
    name: 'CIC-Bill - Phần mềm đo bóc khối lượng và lập dự toán',
    price: '4.500.000 VNĐ',
    description: 'Phần mềm dự toán xây dựng chuyên nghiệp, cập nhật liên tục các đơn giá định mức của tất cả các tỉnh thành tại Việt Nam, lập hồ sơ thầu nhanh chóng, chính xác.',
    field: 'Thủy lợi & Cấp thoát',
    brand: 'CIC Tech',
    app: 'Dự toán công trình',
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80'
  },
  {
    id: 30,
    name: 'Plaxis 3D - Phân tích địa kỹ thuật và móng sâu',
    price: 'Liên hệ',
    description: 'Plaxis là phần mềm phần tử hữu hạn hàng đầu thế giới được tối ưu cho việc phân tích biến dạng, ổn định của đất đá và kết cấu tương tác với nền đất.',
    field: 'Khảo sát & Địa chất',
    brand: 'Bentley Systems',
    app: 'Mô phỏng & Dự báo',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80'
  },
  {
    id: 31,
    name: 'Revit - Phần mềm mô hình hóa thông tin công trình BIM',
    price: 'Liên hệ',
    description: 'Autodesk Revit hỗ trợ các kỹ sư kiến trúc, kết cấu và MEP xây dựng mô hình 3D thông minh, trích xuất bản vẽ và phối hợp dự án liền mạch.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'Autodesk (Mỹ)',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80'
  },
  {
    id: 32,
    name: 'GeoStudio - Phần mềm phân tích địa kỹ thuật đa mô hình',
    price: 'Liên hệ',
    description: 'GeoStudio là bộ phần mềm phân tích ổn định mái dốc, thấm nước, ứng suất biến dạng và truyền nhiệt trong đất đá của hãng Seequent (thuộc Bentley Systems).',
    field: 'Khảo sát & Địa chất',
    brand: 'Bentley Systems',
    app: 'Mô phỏng & Dự báo',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80'
  },
  {
    id: 33,
    name: 'SAP2000 - Giải pháp phân tích kết cấu 3D đa năng',
    price: 'Liên hệ',
    description: 'Phần mềm SAP2000 lý tưởng cho việc phân tích và thiết kế bất kỳ loại hệ thống kết cấu nào từ cầu đường, nhà cao tầng đến các công trình công nghiệp phức tạp.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'CSI (Mỹ)',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80'
  },
  {
    id: 34,
    name: 'ETABS - Phần mềm thiết kế nhà cao tầng chuyên dụng',
    price: 'Liên hệ',
    description: 'ETABS cung cấp bộ công cụ tối ưu cho việc mô hình hóa, phân tích phản ứng động đất, thiết kế kết cấu bê tông cốt thép và kết cấu thép cho nhà cao tầng.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'CSI (Mỹ)',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80'
  },
  {
    id: 35,
    name: 'Graitec Advance Design - Phần mềm phân tích FEM kết cấu thép & bê tông',
    price: 'Liên hệ',
    description: 'Advance Design là giải pháp phân tích phần tử hữu hạn FEM mạnh mẽ tích hợp thiết kế tối ưu hóa theo tiêu chuẩn Eurocode và TCVN.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'Graitec',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80'
  },
  {
    id: 36,
    name: 'Instantel Minimate Pro4 - Thiết bị đo rung chấn chuyên dụng',
    price: 'Liên hệ',
    description: 'Thiết bị giám sát và ghi đo độ rung chấn, áp lực sóng khí sinh ra từ hoạt động nổ mìn, đóng cọc xây dựng hoặc phương tiện giao thông.',
    field: 'Thiết bị & IoT',
    brand: 'Instantel',
    app: 'Kiểm định chất lượng',
    img: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80'
  },
  {
    id: 37,
    name: 'Lander Simulators - Hệ thống mô phỏng đào tạo lái tàu & xe chuyên dụng',
    price: 'Liên hệ',
    description: 'Hệ thống cabin mô phỏng thực tế ảo cao cấp giúp đào tạo kỹ năng vận hành tàu hỏa, tàu điện ngầm và các phương tiện hạng nặng an toàn và tiết kiệm.',
    field: 'Thiết bị & IoT',
    brand: 'Lander',
    app: 'Mô phỏng & Dự báo',
    img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80'
  },
  {
    id: 38,
    name: 'PTV Vissim - Phần mềm mô phỏng vi mô dòng giao thông',
    price: 'Liên hệ',
    description: 'Phần mềm hàng đầu thế giới về mô phỏng hành vi di chuyển của xe cộ, người đi bộ, đánh giá lưu lượng nút giao và tối ưu hóa đèn tín hiệu giao thông.',
    field: 'Giao thông & Cầu đường',
    brand: 'PTV Group',
    app: 'Mô phỏng & Dự báo',
    img: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80'
  },
  {
    id: 39,
    name: 'RPS Water - Giải pháp mô hình hóa hệ thống thoát nước và ngập lụt đô thị',
    price: 'Liên hệ',
    description: 'Mô hình hóa chuyên sâu mạng lưới thoát nước mưa, nước thải, dự báo các kịch bản ngập úng đô thị dưới tác động của biến đổi khí hậu.',
    field: 'Thủy lợi & Cấp thoát',
    brand: 'RPS',
    app: 'Mô phỏng & Dự báo',
    img: 'https://images.unsplash.com/photo-1468476775582-6bede20f356f?auto=format&fit=crop&q=80'
  },
  {
    id: 40,
    name: 'GstarCAD Professional - Phần mềm CAD 2D/3D bản quyền vĩnh viễn',
    price: '12.500.000 VNĐ',
    description: 'GstarCAD cung cấp giải pháp thiết kế thay thế hoàn hảo cho AutoCAD với tốc độ xử lý bản vẽ cực nhanh, tương thích hoàn toàn định dạng DWG.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'Gstarsoft',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80'
  },
  {
    id: 41,
    name: 'Midas Civil - Thiết kế phân tích kết cấu cầu tiên tiến',
    price: 'Liên hệ',
    description: 'Phần mềm chuyên nghiệp nhất cho việc phân tích và thiết kế cầu bê tông dự ứng lực, cầu dây văng, cầu vòm và các công trình hạ tầng phức tạp.',
    field: 'Giao thông & Cầu đường',
    brand: 'Midas',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1512418490979-917bd593a8ec?auto=format&fit=crop&q=80'
  },
  {
    id: 42,
    name: 'Breeze AERMOD - Mô hình mô phỏng lan truyền bụi và khí thải',
    price: 'Liên hệ',
    description: 'Mô hình tiêu chuẩn của EPA Mỹ dùng để tính toán phân tán ô nhiễm không khí từ các nhà máy, khu công nghiệp và nguồn thải giao thông.',
    field: 'Môi trường & Năng lượng',
    brand: 'Breeze',
    app: 'Mô phỏng & Dự báo',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80'
  },
  {
    id: 43,
    name: 'Slope/W - Phần mềm phân tích ổn định mái dốc và sạt lở đất',
    price: 'Liên hệ',
    description: 'Slope/W phân tích ổn định mái dốc đất đá bằng phương pháp cân bằng giới hạn, áp dụng cho đập đất, hố móng sâu và sạt lở mái đường.',
    field: 'Khảo sát & Địa chất',
    brand: 'Bentley Systems',
    app: 'Mô phỏng & Dự báo',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80'
  },
  {
    id: 44,
    name: 'SeisImager - Phần mềm xử lý số liệu địa chấn khúc xạ',
    price: 'Liên hệ',
    description: 'Phần mềm chuyên dụng xử lý dữ liệu địa chấn 2D/3D khúc xạ, phân tích sóng mặt MASW xác định vận tốc sóng cắt của đất nền.',
    field: 'Khảo sát & Địa chất',
    brand: 'Geometrics',
    app: 'Khảo sát địa hình',
    img: 'https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&q=80'
  },
  {
    id: 45,
    name: 'Trimble Access - Phần mềm đo đạc thực địa thông minh',
    price: 'Liên hệ',
    description: 'Phần mềm chạy trên bộ điều khiển cầm tay phục vụ định vị GNSS RTK, đo đạc toàn đạc điện tử, số hóa bản đồ thực địa thời gian thực.',
    field: 'Khảo sát & Địa chất',
    brand: 'Trimble (Mỹ)',
    app: 'Khảo sát địa hình',
    img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80'
  },
  {
    id: 46,
    name: 'Tekla Structures - Phần mềm chi tiết hóa kết cấu thép vạn năng',
    price: 'Liên hệ',
    description: 'Tekla dựng mô hình thông tin công trình BIM kết cấu thép chi tiết nhất, tự động xuất bản vẽ gia công shop drawing cực kỳ chính xác.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'Trimble (Mỹ)',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80'
  },
  {
    id: 47,
    name: 'Bentley MicroStation - Nền tảng CAD/BIM cho hạ tầng quy mô lớn',
    price: 'Liên hệ',
    description: 'MicroStation hỗ trợ lập bản đồ, vẽ thiết kế hạ tầng đô thị, đường cao tốc, nhà máy điện có dung lượng dữ liệu khổng lồ cực mượt mà.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'Bentley Systems',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80'
  },
  {
    id: 48,
    name: 'Allplan - Giải pháp BIM thiết kế kết cấu bê tông cốt thép',
    price: 'Liên hệ',
    description: 'Allplan kết hợp thiết kế kiến trúc 3D với mô hình thép gia cường tự động, tối ưu hóa vật liệu và quy trình thi công xây dựng hiện đại.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'ALLPLAN',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80'
  },
  {
    id: 49,
    name: 'Ansys Mechanical - Phân tích phần tử hữu hạn cơ khí',
    price: 'Liên hệ',
    description: 'Ansys Mechanical cung cấp các công cụ phân tích cấu trúc, nhiệt, va đập độ bền mỏi chuyên sâu cho lĩnh vực cơ khí chế tạo máy.',
    field: 'Cơ khí & Chế tạo',
    brand: 'Ansys (Mỹ)',
    app: 'Phân tích ứng suất vật liệu',
    img: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?auto=format&fit=crop&q=80'
  },
  {
    id: 50,
    name: 'ArcGIS Enterprise - Hệ thống thông tin địa lý GIS chuyên sâu',
    price: 'Liên hệ',
    description: 'Nền tảng GIS mạnh mẽ giúp quản lý dữ liệu không gian, xây dựng bản đồ số và triển khai các giải pháp định vị quy mô lớn.',
    field: 'Viễn thông & CNTT',
    brand: 'Esri (Mỹ)',
    app: 'Hệ thống định vị thông minh',
    img: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80'
  },
  {
    id: 51,
    name: 'FARO Focus Premium - Máy quét laser 3D mặt đất tốc độ cao',
    price: 'Liên hệ',
    description: 'Máy quét laser 3D cung cấp các mô hình đám mây điểm siêu chính xác cho công trình kiến trúc, di sản và nông nghiệp công nghệ cao.',
    field: 'Nông nghiệp & Công nghệ cao',
    brand: 'FARO',
    app: 'Quét đám mây điểm 3D',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80'
  },
  {
    id: 52,
    name: 'CIC Greenhouse Monitor - Phần mềm báo cáo kiểm kê phát thải',
    price: 'Liên hệ',
    description: 'Phần mềm đáp ứng đầy đủ quy chuẩn ISO 14064-1 để tự động hóa hoạt động báo cáo kiểm kê phát thải khí nhà kính cho doanh nghiệp.',
    field: 'Giám sát An toàn & Cảnh báo',
    brand: 'CIC Tech',
    app: 'Báo cáo khí nhà kính',
    img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80'
  },
  {
    id: 53,
    name: 'MIKE 21 - Mô hình thủy động lực học sóng biển và cửa sông',
    price: 'Liên hệ',
    description: 'Bộ công cụ mô phỏng 2 chiều thủy động lực học của nước, bùn cát, chất lượng nước ở sông ngòi, cửa biển và công trình hàng hải.',
    field: 'Hàng hải & Cảng biển',
    brand: 'DHI (Đan Mạch)',
    app: 'Tính toán thủy lực dòng',
    img: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80'
  },
  {
    id: 54,
    name: 'VR Trainer Master - Thiết bị thực tế ảo đào tạo nghề cơ khí',
    price: 'Liên hệ',
    description: 'Hệ thống huấn luyện ảo mô phỏng quy trình bảo dưỡng động cơ và vận hành thiết bị công nghiệp an toàn tuyệt đối.',
    field: 'Hóa chất & Vật liệu mới',
    brand: 'Lander',
    app: 'Đào tạo mô phỏng thực tế ảo',
    img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80'
  },
  {
    id: 55,
    name: 'SmartPlant 3D - Phần mềm thiết kế nhà máy hóa chất chuyên sâu',
    price: 'Liên hệ',
    description: 'Giải pháp mô hình hóa 3D cho thiết kế đường ống, thiết bị công nghiệp trong các nhà máy lọc dầu, hóa chất, vật liệu quy mô lớn.',
    field: 'Hóa chất & Vật liệu mới',
    brand: 'Intergraph',
    app: 'Phân tích ứng suất vật liệu',
    img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80'
  },
  {
    id: 56,
    name: 'Agisoft Metashape - Phần mềm dựng mô hình 3D từ ảnh chụp UAV',
    price: 'Liên hệ',
    description: 'Xử lý hình ảnh từ máy bay không người lái để tạo ra các mô hình độ cao số hóa (DEM), chỉnh hình trực ảnh chính xác cho nông nghiệp.',
    field: 'Nông nghiệp & Công nghệ cao',
    brand: 'Agisoft',
    app: 'Quét đám mây điểm 3D',
    img: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80'
  },
  {
    id: 57,
    name: 'QGIS Enterprise Server - Quản lý bản đồ hạ tầng đô thị',
    price: 'Liên hệ',
    description: 'Cung cấp nền tảng bản đồ số mã nguồn mở tích hợp cơ sở dữ liệu hạ tầng, cho phép tìm kiếm định vị thông tin quy hoạch nhanh chóng.',
    field: 'Viễn thông & CNTT',
    brand: 'QGIS Group',
    app: 'Hệ thống định vị thông minh',
    img: 'https://images.unsplash.com/photo-1512418490979-917bd593a8ec?auto=format&fit=crop&q=80'
  },
  {
    id: 58,
    name: 'CAESAR II - Phần mềm phân tích ứng suất đường ống lò hơi',
    price: 'Liên hệ',
    description: 'CAESAR II là chuẩn mực phân tích ứng suất và dịch chuyển của hệ thống đường ống công nghiệp dưới tác động của nhiệt độ và áp suất.',
    field: 'Cơ khí & Chế tạo',
    brand: 'Hexagon',
    app: 'Phân tích ứng suất vật liệu',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80'
  },
  {
    id: 59,
    name: 'GasLeak Pro - Hệ thống cảm biến cảnh báo rò rỉ khí gas độc hại',
    price: 'Liên hệ',
    description: 'Hệ thống thiết bị IoT đo nồng độ và giám sát an toàn cháy nổ tự động tích hợp cảnh báo khẩn cấp thời gian thực qua đám mây.',
    field: 'Giám sát An toàn & Cảnh báo',
    brand: 'Instantel',
    app: 'Báo cáo khí nhà kính',
    img: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80'
  },
  {
    id: 60,
    name: 'ShipMotion Pro - Mô phỏng dao động tàu biển khi cập cảng',
    price: 'Liên hệ',
    description: 'Thiết kế thử nghiệm động học tàu biển tương tác với sóng gió dòng chảy tại cảng, hỗ trợ quy hoạch hạ tầng hàng hải tối ưu.',
    field: 'Hàng hải & Cảng biển',
    brand: 'DHI (Đan Mạch)',
    app: 'Tính toán thủy lực dòng',
    img: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80'
  }
];
