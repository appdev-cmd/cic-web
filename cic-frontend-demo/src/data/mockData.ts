/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Project, NewsItem, Partner, HeroSlide, NavLink } from '../types';

export const heroSlides: HeroSlide[] = [
  {
    img: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80",
    title: 'Đối tác công nghệ <span class="text-orange-600 whitespace-nowrap">chiến lược</span>',
    sub: "Hơn 35 năm tiên phong thúc đẩy số hóa toàn diện."
  },
  {
    img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80",
    title: 'Hệ sinh thái <span class="text-orange-600 whitespace-nowrap">giải pháp số</span>',
    sub: "Ứng dụng AI, BIM và Digital Twins vào quy trình vận hành, giúp tối ưu hóa hiệu suất và tiết kiệm tài nguyên cho doanh nghiệp."
  },
  {
    img: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80",
    title: 'Dẫn đầu <span class="text-orange-600 whitespace-nowrap">chuyển đổi số</span>',
    sub: "Hợp tác cùng các tập đoàn công nghệ hàng đầu thế giới mang lại những giải pháp đột phá cho tương lai hạ tầng Việt Nam."
  },
  {
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80",
    title: 'Phần mềm bản quyền <span class="text-orange-600 whitespace-nowrap">chính hãng</span>',
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
    size: 'wide' 
  },
  { 
    id: 2, 
    type: 'equipment', 
    img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80', 
    location: 'Toàn quốc', 
    name: 'Trạm Quan Trắc Tự Động', 
    tags: ['IoT', 'Monitoring'], 
    size: 'tall' 
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
      { name: 'Tư vấn Kiểm kê Khí nhà kính', href: 'tu-van-kiem-ke-khi-nha-kinh' },
      { name: 'Hồ sơ năng lực Trung tâm BIM', href: 'ho-so-nang-luc-trung-tam-bim' }
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
    price: 'Liên hệ',
    description: 'enjiCAD là phần mềm CAD dành riêng cho người Việt với bản quyền vĩnh viễn. Giá mua hợp lý, hiệu năng cao, giao diện quen thuộc, hỗ trợ đầy đủ các tính năng vẽ kỹ thuật 2D/3D chuyên nghiệp.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'CIC Tech',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    name: 'OILMAP - Phần mềm mô hình hóa sự cố tràn dầu',
    price: 'Liên hệ',
    description: 'OILMAP là phần mềm dùng để mô phỏng sự cố tràn dầu và cung cấp những dự báo nhanh chóng, chính xác về hướng di chuyển và sự phân hủy của dầu trên bề mặt nước.',
    field: 'Môi trường & Năng lượng',
    brand: 'Bentley Systems',
    app: 'Mô phỏng & Dự báo',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    name: 'Prokon - Phần mềm Phân tích và Thiết kế Kỹ thuật Kết cấu',
    price: 'Liên hệ',
    description: 'Prokon là Phần mềm Phân tích và Thiết kế Kỹ thuật Kết cấu mạnh mẽ và toàn diện, được tin dùng bởi hàng ngàn kỹ sư kết cấu trên toàn thế giới cho các công trình từ đơn giản đến phức tạp.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'Bentley Systems',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    name: 'Summit X One - Thiết bị đo địa chấn đa kênh của hãng DMT (Đức)',
    price: 'Liên hệ',
    description: 'SUMMIT X One là hệ thống thu thập dữ liệu địa chấn linh hoạt, cung cấp giải pháp tối ưu cho khảo sát địa chất công trình, khai thác khoáng sản và nghiên cứu cấu trúc địa tầng sâu.',
    field: 'Khảo sát & Địa chất',
    brand: 'DMT (Đức)',
    app: 'Kiểm định chất lượng',
    img: 'https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&q=80'
  },
  {
    id: 5,
    name: 'RDW - Phần mềm bổ sung TCVN vào các chương trình tính kết cấu nước ngoài RDW',
    price: '3.000.000 VNĐ',
    description: 'Hiện nay các phần mềm SAP90/SAP2000, ETABS (công ty CSI Mỹ), STAADIII/STAADPRO (công ty REI Mỹ) được dùng rất rộng rãi tại Việt Nam. RDW giúp chuyển đổi và áp dụng các tiêu chuẩn Việt Nam (TCVN) tự động.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'CIC Tech',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80'
  },
  {
    id: 6,
    name: 'VinaSAS - Phần mềm tính toán thiết kế khung hỗn hợp',
    price: '10.000.000 VNĐ',
    description: 'Trong lĩnh vực tư vấn thiết kế xây dựng, vấn đề thiết kế công trình với sự tối ưu hóa hệ kết cấu khung dầm cột là tối quan trọng. VinaSAS đem lại giải pháp phân tích nội lực, tính toán cốt thép tối ưu.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'CIC Tech',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80'
  },
  {
    id: 7,
    name: 'MBW - Phần mềm phân tích, thiết kế móng băng',
    price: '2.000.000 VNĐ',
    description: 'MBW là phần mềm tự động hoá phân tích thiết kế kết cấu móng băng bê tông cốt thép dưới hệ tường hoặc cột, xuất thuyết minh tính toán và bản vẽ kỹ thuật chuyên nghiệp.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'CIC Tech',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80'
  },
  {
    id: 8,
    name: 'FIFISH V6 EXPERT - Rô bốt kiểm tra dưới nước',
    price: 'Liên hệ',
    description: 'FIFISH V6 EXPERT là rô bốt chuyên dụng phục vụ cho việc kiểm tra, đánh giá hiện trạng dưới nước, trang bị camera 4K sắc nét và hệ thống đèn LED siêu sáng lên đến 6000 lumens.',
    field: 'Thiết bị & IoT',
    brand: 'FIFISH',
    app: 'Quản lý & Giám sát',
    img: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80'
  },
  {
    id: 9,
    name: 'FIFISH E-GO - Rô bốt kiểm tra dưới nước',
    price: 'Liên hệ',
    description: 'FIFISH E-GO là thiết bị robot chuyên dụng cho khám phá và ghi hình dưới nước với động cơ mạnh mẽ, khả năng kháng dòng chảy tốt và mô đun mở rộng đa thiết bị đo đạc chuyên dụng.',
    field: 'Thiết bị & IoT',
    brand: 'FIFISH',
    app: 'Quản lý & Giám sát',
    img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80'
  },
  {
    id: 10,
    name: 'MCW - Phần mềm phân tích, thiết kế móng cọc',
    price: '2.000.000 VNĐ',
    description: 'MCW là chương trình tính toán thiết kế và kiểm tra đối với móng cọc đài thấp, tự động hóa toàn bộ quy trình từ tính sức chịu tải của cọc, phân bổ lực đến tính toán cốt thép đài móng.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'CIC Tech',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80'
  },
  {
    id: 11,
    name: 'FIFISH V-EVO - Rô bốt kiểm tra dưới nước',
    price: 'Liên hệ',
    description: 'FIFISH V-EVO là rô bốt chuyên dụng phục vụ cho việc chụp ảnh và quay phim dưới nước 360 độ góc siêu rộng, hỗ trợ lấy mẫu và khảo sát sinh vật biển, đập thủy điện.',
    field: 'Thiết bị & IoT',
    brand: 'FIFISH',
    app: 'Quản lý & Giám sát',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80'
  },
  {
    id: 12,
    name: 'stCAD - Phần mềm hỗ trợ vẽ thiết kế xây dựng và bóc tiên lượng',
    price: '1.500.000 VNĐ',
    description: 'stCAD là phần mềm hỗ trợ vẽ thiết kế xây dựng và tính tiên lượng dự toán công trình xây dựng, giúp tăng năng suất làm việc của kỹ sư thiết kế lên gấp nhiều lần.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'CIC Tech',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80'
  },
  {
    id: 13,
    name: 'FIFISH PRO V6 PLUS - Rô bốt kiểm tra dưới nước',
    price: 'Liên hệ',
    description: 'FIFISH PRO V6 PLUS là rô bốt chuyên dụng phục vụ cho việc kiểm tra, đánh giá sâu dưới đại dương, tích hợp GPS định vị dưới nước và cánh tay robot linh hoạt.',
    field: 'Thiết bị & IoT',
    brand: 'FIFISH',
    app: 'Quản lý & Giám sát',
    img: 'https://images.unsplash.com/photo-1504607798333-52a30db54a5d?auto=format&fit=crop&q=80'
  },
  {
    id: 14,
    name: 'Piletest CHUM - Máy siêu âm cọc khoan nhồi',
    price: 'Liên hệ',
    description: 'Thiết bị siêu âm cọc khoan nhồi CHUM của Piletest đáp ứng tiêu chuẩn TCVN 9396:2012. Xác định chính xác khuyết tật, bọng rỗng và chất lượng bê tông thân cọc nhanh chóng.',
    field: 'Khảo sát & Địa chất',
    brand: 'Piletest',
    app: 'Kiểm định chất lượng',
    img: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80'
  },
  {
    id: 15,
    name: 'PET - Thiết bị kiểm tra biến dạng nhỏ của cọc',
    price: 'Liên hệ',
    description: 'Thiết bị kiểm tra biến dạng nhỏ của cọc PET của Piletest đáp ứng TCVN 9397:2012 Cọc khoan nhồi và cọc đúc sẵn. Kiểm tra tính đồng nhất của cọc cực nhanh bằng phương pháp xung phản hồi.',
    field: 'Khảo sát & Địa chất',
    brand: 'Piletest',
    app: 'Kiểm định chất lượng',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80'
  },
  {
    id: 16,
    name: 'AutoCAD - Phần mềm thiết kế đồ họa 2D/3D chuyên nghiệp',
    price: 'Liên hệ',
    description: 'AutoCAD là giải pháp thiết kế bản vẽ hàng đầu thế giới của hãng Autodesk, hỗ trợ đắc lực cho kiến trúc sư, kỹ sư xây dựng, cơ khí trong việc thiết kế bản vẽ kỹ thuật chi tiết.',
    field: 'Giao thông & Cầu đường',
    brand: 'Autodesk (Mỹ)',
    app: 'Khảo sát địa hình',
    img: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80'
  },
  {
    id: 17,
    name: 'Trimble Business Center - Phần mềm xử lý dữ liệu trắc địa',
    price: 'Liên hệ',
    description: 'TBC là bộ phần mềm văn phòng toàn diện, tích hợp để xử lý dữ liệu đo đạc, khảo sát từ các thiết bị GNSS, trạm toàn đạc điện tử, máy quét laser 3D và máy bay không người lái.',
    field: 'Giao thông & Cầu đường',
    brand: 'Trimble (Mỹ)',
    app: 'Khảo sát địa hình',
    img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80'
  },
  {
    id: 18,
    name: 'Civil 3D - Phần mềm thiết kế hạ tầng giao thông',
    price: 'Liên hệ',
    description: 'Civil 3D của Autodesk hỗ trợ quy trình thiết kế và lập hồ sơ thông tin công trình (BIM) cho các dự án hạ tầng giao thông, cầu đường, quy hoạch đô thị và san nền.',
    field: 'Giao thông & Cầu đường',
    brand: 'Autodesk (Mỹ)',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1512418490979-917bd593a8ec?auto=format&fit=crop&q=80'
  },
  {
    id: 19,
    name: 'HEC-RAS - Phần mềm mô phỏng dòng chảy sông ngòi',
    price: 'Miễn phí',
    description: 'HEC-RAS là phần mềm tiêu chuẩn để mô hình hóa và phân tích thủy lực dòng chảy sông ngòi, tính toán ngập lụt, quy hoạch đê điều và thoát lũ đô thị.',
    field: 'Thủy lợi & Cấp thoát',
    brand: 'Trimble (Mỹ)',
    app: 'Mô phỏng & Dự báo',
    img: 'https://images.unsplash.com/photo-1468476775582-6bede20f356f?auto=format&fit=crop&q=80'
  },
  {
    id: 20,
    name: 'EPA-NET - Mô hình phân tích mạng lưới cấp nước',
    price: 'Miễn phí',
    description: 'EPANET là chương trình máy tính thực hiện mô phỏng thủy lực và chất lượng nước trong mạng lưới đường ống cấp nước có áp, hỗ trợ quản lý vận hành hiệu quả.',
    field: 'Thủy lợi & Cấp thoát',
    brand: 'Trimble (Mỹ)',
    app: 'Mô phỏng & Dự báo',
    img: 'https://images.unsplash.com/photo-1434064511983-18c6dae20ed5?auto=format&fit=crop&q=80'
  },
  {
    id: 21,
    name: 'CIC-Bill - Phần mềm đo bóc khối lượng và lập dự toán',
    price: '4.500.000 VNĐ',
    description: 'Phần mềm dự toán xây dựng chuyên nghiệp, cập nhật liên tục các đơn giá định mức của tất cả các tỉnh thành tại Việt Nam, lập hồ sơ thầu nhanh chóng, chính xác.',
    field: 'Thủy lợi & Cấp thoát',
    brand: 'CIC Tech',
    app: 'Dự toán công trình',
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80'
  },
  {
    id: 22,
    name: 'Plaxis 3D - Phân tích địa kỹ thuật và móng sâu',
    price: 'Liên hệ',
    description: 'Plaxis là phần mềm phần tử hữu hạn hàng đầu thế giới được tối ưu cho việc phân tích biến dạng, ổn định của đất đá và kết cấu tương tác với nền đất.',
    field: 'Khảo sát & Địa chất',
    brand: 'Bentley Systems',
    app: 'Mô phỏng & Dự báo',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80'
  },
  {
    id: 23,
    name: 'Revit - Phần mềm mô hình hóa thông tin công trình BIM',
    price: 'Liên hệ',
    description: 'Autodesk Revit hỗ trợ các kỹ sư kiến trúc, kết cấu và MEP xây dựng mô hình 3D thông minh, trích xuất bản vẽ và phối hợp dự án liền mạch.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'Autodesk (Mỹ)',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80'
  },
  {
    id: 24,
    name: 'GeoStudio - Phần mềm phân tích địa kỹ thuật đa mô hình',
    price: 'Liên hệ',
    description: 'GeoStudio là bộ phần mềm phân tích ổn định mái dốc, thấm nước, ứng suất biến dạng và truyền nhiệt trong đất đá của hãng Seequent (thuộc Bentley Systems).',
    field: 'Khảo sát & Địa chất',
    brand: 'Bentley Systems',
    app: 'Mô phỏng & Dự báo',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80'
  },
  {
    id: 25,
    name: 'SAP2000 - Giải pháp phân tích kết cấu 3D đa năng',
    price: 'Liên hệ',
    description: 'Phần mềm SAP2000 lý tưởng cho việc phân tích và thiết kế bất kỳ loại hệ thống kết cấu nào từ cầu đường, nhà cao tầng đến các công trình công nghiệp phức tạp.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'CSI (Mỹ)',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80'
  },
  {
    id: 26,
    name: 'ETABS - Phần mềm thiết kế nhà cao tầng chuyên dụng',
    price: 'Liên hệ',
    description: 'ETABS cung cấp bộ công cụ tối ưu cho việc mô hình hóa, phân tích phản ứng động đất, thiết kế kết cấu bê tông cốt thép và kết cấu thép cho nhà cao tầng.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'CSI (Mỹ)',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80'
  },
  {
    id: 27,
    name: 'Graitec Advance Design - Phần mềm phân tích FEM kết cấu thép & bê tông',
    price: 'Liên hệ',
    description: 'Advance Design là giải pháp phân tích phần tử hữu hạn FEM mạnh mẽ tích hợp thiết kế tối ưu hóa theo tiêu chuẩn Eurocode và TCVN.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'Graitec',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80'
  },
  {
    id: 28,
    name: 'Instantel Minimate Pro4 - Thiết bị đo rung chấn chuyên dụng',
    price: 'Liên hệ',
    description: 'Thiết bị giám sát và ghi đo độ rung chấn, áp lực sóng khí sinh ra từ hoạt động nổ mìn, đóng cọc xây dựng hoặc phương tiện giao thông.',
    field: 'Thiết bị & IoT',
    brand: 'Instantel',
    app: 'Kiểm định chất lượng',
    img: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80'
  },
  {
    id: 29,
    name: 'Lander Simulators - Hệ thống mô phỏng đào tạo lái tàu & xe chuyên dụng',
    price: 'Liên hệ',
    description: 'Hệ thống cabin mô phỏng thực tế ảo cao cấp giúp đào tạo kỹ năng vận hành tàu hỏa, tàu điện ngầm và các phương tiện hạng nặng an toàn và tiết kiệm.',
    field: 'Thiết bị & IoT',
    brand: 'Lander',
    app: 'Mô phỏng & Dự báo',
    img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80'
  },
  {
    id: 30,
    name: 'PTV Vissim - Phần mềm mô phỏng vi mô dòng giao thông',
    price: 'Liên hệ',
    description: 'Phần mềm hàng đầu thế giới về mô phỏng hành vi di chuyển của xe cộ, người đi bộ, đánh giá lưu lượng nút giao và tối ưu hóa đèn tín hiệu giao thông.',
    field: 'Giao thông & Cầu đường',
    brand: 'PTV Group',
    app: 'Mô phỏng & Dự báo',
    img: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80'
  },
  {
    id: 31,
    name: 'RPS Water - Giải pháp mô hình hóa hệ thống thoát nước và ngập lụt đô thị',
    price: 'Liên hệ',
    description: 'Mô hình hóa chuyên sâu mạng lưới thoát nước mưa, nước thải, dự báo các kịch bản ngập úng đô thị dưới tác động của biến đổi khí hậu.',
    field: 'Thủy lợi & Cấp thoát',
    brand: 'RPS',
    app: 'Mô phỏng & Dự báo',
    img: 'https://images.unsplash.com/photo-1468476775582-6bede20f356f?auto=format&fit=crop&q=80'
  },
  {
    id: 32,
    name: 'GstarCAD Professional - Phần mềm CAD 2D/3D bản quyền vĩnh viễn',
    price: '12.500.000 VNĐ',
    description: 'GstarCAD cung cấp giải pháp thiết kế thay thế hoàn hảo cho AutoCAD với tốc độ xử lý bản vẽ cực nhanh, tương thích hoàn toàn định dạng DWG.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'Gstarsoft',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80'
  },
  {
    id: 33,
    name: 'Midas Civil - Thiết kế phân tích kết cấu cầu tiên tiến',
    price: 'Liên hệ',
    description: 'Phần mềm chuyên nghiệp nhất cho việc phân tích và thiết kế cầu bê tông dự ứng lực, cầu dây văng, cầu vòm và các công trình hạ tầng phức tạp.',
    field: 'Giao thông & Cầu đường',
    brand: 'Midas',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1512418490979-917bd593a8ec?auto=format&fit=crop&q=80'
  },
  {
    id: 34,
    name: 'Breeze AERMOD - Mô hình mô phỏng lan truyền bụi và khí thải',
    price: 'Liên hệ',
    description: 'Mô hình tiêu chuẩn của EPA Mỹ dùng để tính toán phân tán ô nhiễm không khí từ các nhà máy, khu công nghiệp và nguồn thải giao thông.',
    field: 'Môi trường & Năng lượng',
    brand: 'Breeze',
    app: 'Mô phỏng & Dự báo',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80'
  },
  {
    id: 35,
    name: 'Slope/W - Phần mềm phân tích ổn định mái dốc và sạt lở đất',
    price: 'Liên hệ',
    description: 'Slope/W phân tích ổn định mái dốc đất đá bằng phương pháp cân bằng giới hạn, áp dụng cho đập đất, hố móng sâu và sạt lở mái đường.',
    field: 'Khảo sát & Địa chất',
    brand: 'Bentley Systems',
    app: 'Mô phỏng & Dự báo',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80'
  },
  {
    id: 36,
    name: 'SeisImager - Phần mềm xử lý số liệu địa chấn khúc xạ',
    price: 'Liên hệ',
    description: 'Phần mềm chuyên dụng xử lý dữ liệu địa chấn 2D/3D khúc xạ, phân tích sóng mặt MASW xác định vận tốc sóng cắt của đất nền.',
    field: 'Khảo sát & Địa chất',
    brand: 'Geometrics',
    app: 'Khảo sát địa hình',
    img: 'https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&q=80'
  },
  {
    id: 37,
    name: 'Trimble Access - Phần mềm đo đạc thực địa thông minh',
    price: 'Liên hệ',
    description: 'Phần mềm chạy trên bộ điều khiển cầm tay phục vụ định vị GNSS RTK, đo đạc toàn đạc điện tử, số hóa bản đồ thực địa thời gian thực.',
    field: 'Khảo sát & Địa chất',
    brand: 'Trimble (Mỹ)',
    app: 'Khảo sát địa hình',
    img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80'
  },
  {
    id: 38,
    name: 'Tekla Structures - Phần mềm chi tiết hóa kết cấu thép vạn năng',
    price: 'Liên hệ',
    description: 'Tekla dựng mô hình thông tin công trình BIM kết cấu thép chi tiết nhất, tự động xuất bản vẽ gia công shop drawing cực kỳ chính xác.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'Trimble (Mỹ)',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80'
  },
  {
    id: 39,
    name: 'Bentley MicroStation - Nền tảng CAD/BIM cho hạ tầng quy mô lớn',
    price: 'Liên hệ',
    description: 'MicroStation hỗ trợ lập bản đồ, vẽ thiết kế hạ tầng đô thị, đường cao tốc, nhà máy điện có dung lượng dữ liệu khổng lồ cực mượt mà.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'Bentley Systems',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80'
  },
  {
    id: 40,
    name: 'Allplan - Giải pháp BIM thiết kế kết cấu bê tông cốt thép',
    price: 'Liên hệ',
    description: 'Allplan kết hợp thiết kế kiến trúc 3D với mô hình thép gia cường tự động, tối ưu hóa vật liệu và quy trình thi công xây dựng hiện đại.',
    field: 'Xây dựng & Hạ tầng',
    brand: 'ALLPLAN',
    app: 'Thiết kế CAD & BIM',
    img: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80'
  },
  {
    id: 41,
    name: 'Ansys Mechanical - Phân tích phần tử hữu hạn cơ khí',
    price: 'Liên hệ',
    description: 'Ansys Mechanical cung cấp các công cụ phân tích cấu trúc, nhiệt, va đập độ bền mỏi chuyên sâu cho lĩnh vực cơ khí chế tạo máy.',
    field: 'Cơ khí & Chế tạo',
    brand: 'Ansys (Mỹ)',
    app: 'Phân tích ứng suất vật liệu',
    img: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?auto=format&fit=crop&q=80'
  },
  {
    id: 42,
    name: 'ArcGIS Enterprise - Hệ thống thông tin địa lý GIS chuyên sâu',
    price: 'Liên hệ',
    description: 'Nền tảng GIS mạnh mẽ giúp quản lý dữ liệu không gian, xây dựng bản đồ số và triển khai các giải pháp định vị quy mô lớn.',
    field: 'Viễn thông & CNTT',
    brand: 'Esri (Mỹ)',
    app: 'Hệ thống định vị thông minh',
    img: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80'
  },
  {
    id: 43,
    name: 'FARO Focus Premium - Máy quét laser 3D mặt đất tốc độ cao',
    price: 'Liên hệ',
    description: 'Máy quét laser 3D cung cấp các mô hình đám mây điểm siêu chính xác cho công trình kiến trúc, di sản và nông nghiệp công nghệ cao.',
    field: 'Nông nghiệp & Công nghệ cao',
    brand: 'FARO',
    app: 'Quét đám mây điểm 3D',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80'
  },
  {
    id: 44,
    name: 'CIC Greenhouse Monitor - Phần mềm báo cáo kiểm kê phát thải',
    price: 'Liên hệ',
    description: 'Phần mềm đáp ứng đầy đủ quy chuẩn ISO 14064-1 để tự động hóa hoạt động báo cáo kiểm kê phát thải khí nhà kính cho doanh nghiệp.',
    field: 'Giám sát An toàn & Cảnh báo',
    brand: 'CIC Tech',
    app: 'Báo cáo khí nhà kính',
    img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80'
  },
  {
    id: 45,
    name: 'MIKE 21 - Mô hình thủy động lực học sóng biển và cửa sông',
    price: 'Liên hệ',
    description: 'Bộ công cụ mô phỏng 2 chiều thủy động lực học của nước, bùn cát, chất lượng nước ở sông ngòi, cửa biển và công trình hàng hải.',
    field: 'Hàng hải & Cảng biển',
    brand: 'DHI (Đan Mạch)',
    app: 'Tính toán thủy lực dòng',
    img: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80'
  },
  {
    id: 46,
    name: 'VR Trainer Master - Thiết bị thực tế ảo đào tạo nghề cơ khí',
    price: 'Liên hệ',
    description: 'Hệ thống huấn luyện ảo mô phỏng quy trình bảo dưỡng động cơ và vận hành thiết bị công nghiệp an toàn tuyệt đối.',
    field: 'Hóa chất & Vật liệu mới',
    brand: 'Lander',
    app: 'Đào tạo mô phỏng thực tế ảo',
    img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80'
  },
  {
    id: 47,
    name: 'SmartPlant 3D - Phần mềm thiết kế nhà máy hóa chất chuyên sâu',
    price: 'Liên hệ',
    description: 'Giải pháp mô hình hóa 3D cho thiết kế đường ống, thiết bị công nghiệp trong các nhà máy lọc dầu, hóa chất, vật liệu quy mô lớn.',
    field: 'Hóa chất & Vật liệu mới',
    brand: 'Intergraph',
    app: 'Phân tích ứng suất vật liệu',
    img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80'
  },
  {
    id: 48,
    name: 'Agisoft Metashape - Phần mềm dựng mô hình 3D từ ảnh chụp UAV',
    price: 'Liên hệ',
    description: 'Xử lý hình ảnh từ máy bay không người lái để tạo ra các mô hình độ cao số hóa (DEM), chỉnh hình trực ảnh chính xác cho nông nghiệp.',
    field: 'Nông nghiệp & Công nghệ cao',
    brand: 'Agisoft',
    app: 'Quét đám mây điểm 3D',
    img: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80'
  },
  {
    id: 49,
    name: 'QGIS Enterprise Server - Quản lý bản đồ hạ tầng đô thị',
    price: 'Liên hệ',
    description: 'Cung cấp nền tảng bản đồ số mã nguồn mở tích hợp cơ sở dữ liệu hạ tầng, cho phép tìm kiếm định vị thông tin quy hoạch nhanh chóng.',
    field: 'Viễn thông & CNTT',
    brand: 'QGIS Group',
    app: 'Hệ thống định vị thông minh',
    img: 'https://images.unsplash.com/photo-1512418490979-917bd593a8ec?auto=format&fit=crop&q=80'
  },
  {
    id: 50,
    name: 'CAESAR II - Phần mềm phân tích ứng suất đường ống lò hơi',
    price: 'Liên hệ',
    description: 'CAESAR II là chuẩn mực phân tích ứng suất và dịch chuyển của hệ thống đường ống công nghiệp dưới tác động của nhiệt độ và áp suất.',
    field: 'Cơ khí & Chế tạo',
    brand: 'Hexagon',
    app: 'Phân tích ứng suất vật liệu',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80'
  },
  {
    id: 51,
    name: 'GasLeak Pro - Hệ thống cảm biến cảnh báo rò rỉ khí gas độc hại',
    price: 'Liên hệ',
    description: 'Hệ thống thiết bị IoT đo nồng độ và giám sát an toàn cháy nổ tự động tích hợp cảnh báo khẩn cấp thời gian thực qua đám mây.',
    field: 'Giám sát An toàn & Cảnh báo',
    brand: 'Instantel',
    app: 'Báo cáo khí nhà kính',
    img: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80'
  },
  {
    id: 52,
    name: 'ShipMotion Pro - Mô phỏng dao động tàu biển khi cập cảng',
    price: 'Liên hệ',
    description: 'Thiết kế thử nghiệm động học tàu biển tương tác với sóng gió dòng chảy tại cảng, hỗ trợ quy hoạch hạ tầng hàng hải tối ưu.',
    field: 'Hàng hải & Cảng biển',
    brand: 'DHI (Đan Mạch)',
    app: 'Tính toán thủy lực dòng',
    img: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80'
  }
];
