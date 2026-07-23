/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BaseNewsItem {
  id: string;
  category: 'company' | 'specialty' | 'recruitment' | 'promotion' | 'shareholder';
  title: string;
  date: string;
  shortDesc: string;
  img: string;
  author?: string;
  views?: number;
  tags?: string[];
  contentMarkdown: string; // Chi tiết bài viết hỗ trợ Markdown
  gallery?: string[];
  video?: {
    title: string;
    embedUrl: string;
    thumbnail: string;
  };
  attachments?: {
    title: string;
    size: string;
    url: string;
  }[];
  // CMS Linked Content (Chủ động gắn bởi biên tập viên)
  relatedProductIds?: number[];
  relatedProjectIds?: string[];
  relatedEventIds?: string[];
  relatedArticleIds?: string[];
  // SEO Metadata
  seoTitle?: string;
  seoDesc?: string;
  seoKeywords?: string[];
}

// 1. Company News Extra Details
export interface CompanyNewsItem extends BaseNewsItem {
  category: 'company';
  subType: 'Hoạt động CIC' | 'Thông báo' | 'Văn hóa doanh nghiệp';
}

// 2. Specialty News Extra Details
export interface SpecialtyNewsItem extends BaseNewsItem {
  category: 'specialty';
  subType: 'Kiến thức' | 'Cập nhật công nghệ' | 'Chính sách' | 'Giải pháp';
}

// 3. Recruitment News Extra Details
export interface RecruitmentNewsItem extends BaseNewsItem {
  category: 'recruitment';
  position: string; // Vị trí tuyển dụng
  department: 'Khối Kỹ thuật' | 'Khối Kinh doanh' | 'Khối Hỗ trợ' | 'Khối Nghiên cứu & Phát triển'; // Phòng ban
  location: 'Hà Nội' | 'TP. Hồ Chí Minh' | 'Đà Nẵng'; // Địa điểm
  deadline: string; // Hạn nộp hồ sơ
  salary: string; // Mức lương
  jobType: 'Toàn thời gian' | 'Bán thời gian' | 'Thực tập';
  status: 'Đang tuyển' | 'Đã hết hạn'; // Trạng thái tuyển dụng
}

// 4. Promotion News Extra Details
export interface PromotionNewsItem extends BaseNewsItem {
  category: 'promotion';
  programName: string; // Chương trình khuyến mại
  timeFrame: string; // Thời gian diễn ra
  appliedTargets: string[]; // Sản phẩm/dịch vụ áp dụng
  status: 'Đang diễn ra' | 'Đã kết thúc'; // Trạng thái chương trình
}

// 5. Shareholder News Extra Details
export interface ShareholderNewsItem extends BaseNewsItem {
  category: 'shareholder';
  docType: 'Thông báo' | 'Báo cáo' | 'Nghị quyết' | 'Tài liệu cổ đông'; // Loại tài liệu cổ đông
  year: number; // Năm tài chính / công bố
  pdfUrl?: string; // Link file PDF
  pdfSize?: string; // Dung lượng file PDF
}

export type DetailedNewsItem = 
  | CompanyNewsItem
  | SpecialtyNewsItem
  | RecruitmentNewsItem
  | PromotionNewsItem
  | ShareholderNewsItem;

export const newsData: DetailedNewsItem[] = [
  // --- TIN TỨC CÔNG TY ---
  {
    id: 'cic-bentley-systems-cybersecurity-2026',
    category: 'company',
    subType: 'Hoạt động CIC',
    title: 'Hợp tác chiến lược giữa CIC và Bentley Systems nâng cao an toàn thông tin hạ tầng số',
    date: '15/07/2026',
    shortDesc: 'Đoàn đại diện cấp cao Bentley Systems đã có buổi làm việc chính thức tại văn phòng CIC Tech nhằm triển khai các gói giải pháp an toàn thông tin và bản sao số bảo mật cho doanh nghiệp Việt Nam.',
    img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80',
    author: 'Ban Truyền thông CIC',
    views: 1420,
    tags: ['Hợp tác chiến lược', 'Bentley Systems', 'An toàn thông tin'],
    contentMarkdown: `### Thúc đẩy hạ tầng số an toàn và bảo mật thông tin toàn diện

Vào ngày 15 tháng 7 năm 2026, tại trụ sở **Công ty Cổ phần Công nghệ và Tư vấn CIC (CIC Tech)**, ban lãnh đạo CIC đã có buổi tiếp đón và làm việc chiến lược cùng đoàn đại diện cấp cao của tập đoàn **Bentley Systems**. Hai bên đã tập trung thảo luận về lộ trình nâng cấp hệ thống an ninh dữ liệu trong các giải pháp Mô hình thông tin công trình (BIM) và Bản sao số (Digital Twins) đang được ứng dụng rộng rãi tại Việt Nam.

#### Nội dung chính của buổi làm việc bao gồm:
1. **Chuẩn hóa dữ liệu trên đám mây**: Tích hợp các giao thức bảo mật AES-256 đối với hệ thống Môi trường dữ liệu chung (CDE) trên Bentley ProjectWise và iTwin Platform.
2. **Đào tạo chuyển giao công nghệ**: Lên kế hoạch tổ chức 5 khóa đào tạo chuyên sâu về bảo mật thông tin hạ tầng cho hơn 200 kỹ sư nòng cốt thuộc các ban quản lý dự án lớn của Bộ Giao thông Vận tải và các chủ đầu tư tư nhân.
3. **Cung cấp giải pháp bản quyền xanh**: Tăng cường công tác kiểm tra bản quyền, cam kết hỗ trợ tối đa về giá thành cho các doanh nghiệp xây dựng Việt Nam chuyển dịch từ phần mềm không bản quyền sang phần mềm chính hãng để hạn chế rủi ro an ninh mạng.

Đại diện Bentley phát biểu tại sự kiện: *"CIC là đối tác có thâm niên và uy tín lớn nhất của chúng tôi tại khu vực Đông Nam Á. Chúng tôi tin tưởng việc thắt chặt hợp tác công nghệ bảo mật lần này sẽ giúp các dự án trọng điểm quốc gia của Việt Nam vận hành an toàn và bền vững trước mọi thách thức an ninh mạng toàn cầu."*`,
    gallery: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80'
    ],
    video: {
      title: 'Tóm tắt sự kiện ký kết hợp tác CIC - Bentley Systems 2026',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80'
    },
    relatedEventIds: ['bim-digital-twins-2026'],
    seoTitle: 'Hợp tác chiến lược CIC & Bentley Systems về an toàn thông tin hạ tầng số',
    seoDesc: 'CIC Tech phối hợp cùng Bentley Systems chuẩn hóa quy trình an ninh dữ liệu và bản sao số bảo mật cao cấp cho các doanh nghiệp hạ tầng tại Việt Nam.',
    seoKeywords: ['CIC Tech', 'Bentley Systems', 'An toàn thông tin', 'BIM', 'Digital Twins']
  },
  {
    id: 'thong-bao-nghi-le-quoc-khanh-2026',
    category: 'company',
    subType: 'Thông báo',
    title: 'Thông báo lịch nghỉ lễ Quốc Khánh 2/9 năm 2026',
    date: '10/08/2026',
    shortDesc: 'CIC Tech xin trân trọng thông báo đến Quý Khách hàng, Quý Đối tác và toàn thể Cán bộ nhân viên lịch nghỉ lễ Quốc Khánh mùng 2 tháng 9 năm 2026.',
    img: 'https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&q=80',
    author: 'Phòng Hành chính Nhân sự',
    views: 890,
    tags: ['Thông báo', 'Lịch nghỉ lễ', 'Quốc khánh 2/9'],
    contentMarkdown: `### THÔNG BÁO LỊCH NGHỈ LỄ QUỐC KHÁNH 2/9

Kính gửi: **Quý Khách hàng, Quý Đối tác và toàn thể Cán bộ nhân viên Công ty CIC**,

Để tạo điều kiện thuận lợi cho việc sắp xếp công việc và liên hệ công tác, CIC Tech xin trân trọng thông báo lịch nghỉ lễ Quốc Khánh mùng 2 tháng 9 năm 2026 như sau:

* **Thời gian nghỉ lễ**: Từ thứ Bảy ngày **05/09/2026** đến hết thứ Hai ngày **07/09/2026** (bao gồm ngày nghỉ bù theo quy định pháp luật).
* **Thời gian làm việc trở lại**: Thứ Ba ngày **08/09/2026**.

#### Kênh hỗ trợ khẩn cấp trong dịp nghỉ lễ:
Trong suốt thời gian nghỉ lễ, hệ thống hỗ trợ kỹ thuật và dịch vụ khẩn cấp của CIC vẫn hoạt động 24/7 đối với các khách hàng sử dụng dịch vụ lưu trữ dữ liệu CDE và quan trắc tự động.
* **Email hỗ trợ**: support@cic.com.vn
* **Hotline kỹ thuật**: 1900.xxxx

Kính chúc Quý Khách hàng, Quý Đối tác cùng toàn thể gia đình cán bộ nhân viên CIC có một kỳ nghỉ lễ tràn ngập niềm vui, hạnh phúc và an toàn!`,
    attachments: [
      { title: 'Công văn thông báo lịch nghỉ lễ chính thức có dấu đỏ.pdf', size: '1.2 MB', url: '#' }
    ],
    seoTitle: 'Thông báo lịch nghỉ lễ Quốc Khánh 2/9 năm 2026 - CIC Tech',
    seoDesc: 'Lịch nghỉ lễ Quốc Khánh 2/9 năm 2026 chi tiết của Công ty Cổ phần Công nghệ và Tư vấn CIC kèm thông tin liên hệ hỗ trợ khẩn cấp.',
    seoKeywords: ['Lịch nghỉ lễ', 'Quốc khánh 2/9', 'CIC thông báo']
  },
  {
    id: 'hanh-trinh-team-building-phu-quoc-2026',
    category: 'company',
    subType: 'Văn hóa doanh nghiệp',
    title: 'Rực lửa hành trình Team Building 2026 "Chung Sức Kiến Tạo Tương Lai"',
    date: '25/06/2026',
    shortDesc: 'Toàn thể đại gia đình CIC Tech ba miền Bắc - Trung - Nam đã có những giây phút bùng nổ năng lượng và thắt chặt tinh thần đoàn kết tại đảo ngọc Phú Quốc.',
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
    author: 'Ban Văn thể mỹ CIC',
    views: 1850,
    tags: ['Team Building', 'Văn hóa CIC', 'Gắn kết đồng đội'],
    contentMarkdown: `### HÀNH TRÌNH CHUNG SỨC KIẾN TẠO TƯƠNG LAI PHÚ QUỐC 2026

Văn hóa doanh nghiệp luôn là gốc rễ bền vững để xây dựng nên một tập thể CIC mạnh mẽ suốt hơn 35 năm qua. Nhằm tri ân những nỗ lực làm việc không ngừng nghỉ của tập thể cán bộ nhân viên, ban giám đốc công ty đã tổ chức chương trình **Team Building & Gala Dinner 2026** tại Phú Quốc từ ngày 20/06 đến ngày 23/06/2026.

Với khẩu hiệu **"Chung Sức Kiến Tạo Tương Lai"**, chương trình đã mang lại chuỗi thử thách vận động bãi biển vô cùng gay cấn, đòi hỏi sự phối hợp chiến thuật, lòng kiên trì và tinh thần đồng đội cực kỳ cao giữa các phòng ban: Khối Kỹ thuật, Khối Kinh doanh, Khối Văn phòng hỗ trợ.

#### Đêm Gala Dinner đầy cảm xúc:
Trọng tâm của chuyến đi là đêm Gala Dinner với các tiết mục văn nghệ tự biên tự diễn vô cùng đặc sắc và hài hước của chính các kỹ sư thường ngày vốn khô khan bên bản vẽ CAD/BIM. Tổng giám đốc CIC đã phát biểu vinh danh các cá nhân, tập thể có đóng góp xuất sắc trong nửa đầu năm tài chính 2026, tiếp thêm ngọn lửa nhiệt huyết để hoàn thành xuất sắc mục tiêu cuối năm.

Chuyến đi đã khép lại nhưng dư âm và ngọn lửa tinh thần gắn kết của đại gia đình CIC chắc chắn sẽ còn lan tỏa, tạo động lực to lớn cho những dự án chuyển đổi số công nghệ bứt phá sắp tới.`,
    gallery: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&q=80'
    ]
  },

  // --- TIN TỨC CHUYÊN NGÀNH ---
  {
    id: 'kien-thuc-digital-twin-ha-tang',
    category: 'specialty',
    subType: 'Kiến thức',
    title: 'Bản sao số (Digital Twin) là gì và ứng dụng thế nào trong hạ tầng giao thông?',
    date: '12/07/2026',
    shortDesc: 'Khám phá khái niệm Digital Twins, sự khác biệt so với mô hình 3D truyền thống và cuộc cách mạng quản lý vận hành cao tốc thông minh thời gian thực.',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
    author: 'ThS. Nguyễn Văn Hùng - Chuyên gia BIM/GIS CIC',
    views: 3100,
    tags: ['Digital Twins', 'Hạ tầng số', 'IoT', 'BIM'],
    contentMarkdown: `### BẢN SAO SỐ (DIGITAL TWINS) TRONG HẠ TẦNG GIAO THÔNG

Xu hướng số hóa hạ tầng giao thông đang diễn ra vô cùng mạnh mẽ trên toàn cầu. Một trong những công nghệ cốt lõi dẫn dắt sự thay đổi này chính là **Bản sao số (Digital Twin)**. Tuy nhiên, rất nhiều người vẫn nhầm lẫn giữa bản sao số và mô hình 3D CAD/BIM thông thường.

#### 1. Sự khác biệt cốt lõi giữa Mô hình 3D và Bản sao số
Mô hình 3D truyền thống chỉ hiển thị cấu trúc hình học tĩnh của công trình tại thời điểm thiết kế hoặc hoàn công. Trong khi đó, **Bản sao số** là một thực thể động, nó liên tục thu thập dữ liệu hiện trạng thực tế thông qua các cảm biến IoT, camera hành trình, dữ liệu thời tiết và phản hồi lại mô hình ảo theo thời gian thực (Real-time).

#### 2. Lợi ích vượt trội trong quản lý bảo trì đường cao tốc
* **Dự báo sạt lở tự động**: Bằng cách tích hợp dữ liệu trạm đo mưa và cảm biến đo độ dịch chuyển taluy đất, Digital Twin có thể tự động chạy mô phỏng sạt trượt và đưa ra cảnh báo sớm đến ban quản lý trước khi xảy ra sự cố sạt lở thực tế.
* **Theo dõi chất lượng mặt đường**: Các vết nứt, ổ gà được ghi nhận tự động bằng AI từ camera giám sát hành trình sẽ lập tức được đánh dấu tọa độ địa lý chính xác trên mô hình 3D ảo để đội bảo dưỡng sửa chữa kịp thời.
* **Mô phỏng phân luồng giao thông**: Tích hợp luồng dữ liệu đếm xe thực tế để giả lập phân luồng khi xảy ra tai nạn hoặc trùng tu đường, giảm thiểu tối đa ùn tắc cục bộ.

#### 3. Công nghệ triển khai phổ biến hiện nay
Hiện nay, CIC Tech đang đồng hành cùng các đơn vị giao thông ứng dụng nền tảng **Bentley iTwin** và **GIS Esri** để xây dựng các bản sao số chuẩn xác, mang lại giá trị quản trị to lớn vượt ngoài mong đợi của các chủ đầu tư.`,
    relatedProductIds: [1, 2],
    relatedProjectIds: ['landmark-81-bim'],
    relatedEventIds: ['bim-digital-twins-2026'],
    seoTitle: 'Bản sao số Digital Twin trong quản lý hạ tầng giao thông thông minh',
    seoDesc: 'Tìm hiểu chi tiết về công nghệ Bản sao số (Digital Twins), sự khác biệt với BIM tĩnh và ứng dụng thực tế trong quản lý bảo trì đường bộ hiện đại.',
    seoKeywords: ['Digital Twin', 'Bản sao số', 'iTwin Bentley', 'Quản lý đường cao tốc', 'IoT']
  },
  {
    id: 'cong-nghe-moi-enjicad-2026-v2',
    category: 'specialty',
    subType: 'Cập nhật công nghệ',
    title: 'enjiCAD 2026 ra mắt động cơ đồ họa đa nhân: Tốc độ mở file DWG nặng tăng 200%',
    date: '02/07/2026',
    shortDesc: 'Phiên bản enjiCAD 2026 chính thức thương mại hóa với lõi đồ họa thế hệ mới, tối ưu hóa phần cứng đa nhân giúp hiển thị mượt mà bản vẽ kiến trúc quy mô siêu lớn.',
    img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80',
    author: 'Phòng Phát triển sản phẩm CIC Tech',
    views: 2450,
    tags: ['enjiCAD 2026', 'Phần mềm CAD', 'DWG', 'Cập nhật công nghệ'],
    contentMarkdown: `### BƯỚC NHẢY VỌT VỀ HIỆU NĂNG CỦA ENJICAD 2026

Là giải pháp phần mềm CAD bản quyền Việt Nam hàng đầu, **enjiCAD** luôn không ngừng cải tiến để mang lại hiệu suất tối đa cho kỹ sư thiết kế. Phiên bản **enjiCAD 2026** vừa được ra mắt đánh dấu bước tiến công nghệ lớn nhất trong vòng 5 năm qua nhờ sự thay đổi triệt để về động cơ xử lý đồ họa (Graphic Engine Core).

#### Những cải tiến công nghệ đột phá bao gồm:

1. **Động cơ Multi-Core LTSC**: enjiCAD 2026 đã hỗ trợ phân phối tác vụ xử lý hiển thị bản vẽ lên toàn bộ số nhân của CPU (thay vì chỉ chạy đơn nhân như các phiên bản cũ). Nhờ đó, tốc độ mở và phóng to thu nhỏ (Zoom/Pan) các file DWG có dung lượng trên 100MB tăng gấp 2 lần.
2. **Quản lý bộ nhớ thông minh Smart-RAM**: Tự động giải phóng các phân vùng bộ nhớ đệm của các layer ẩn hoặc bản vẽ tham chiếu (XRef) không hoạt động, giảm thiểu 40% dung lượng RAM tiêu thụ, hạn chế tối đa lỗi sập ứng dụng (Crash) khi vẽ liên tục 8 tiếng.
3. **Tương thích hoàn hảo AutoCAD 2026**: Hỗ trợ mở trực tiếp, chỉnh sửa và ghi đè tất cả các định dạng thực thể mới nhất mà không xảy ra hiện tượng mất định dạng phông chữ (lỗi font), lỗi nét đứt hoặc hatch lỗi.

#### Chứng nhận an toàn thông tin
Đặc biệt, enjiCAD 2026 được số hóa chữ ký bảo mật số từ VeriSign, cam kết không chứa bất kỳ mã độc gián điệp, giúp doanh nghiệp yên tâm vượt qua các đợt kiểm toán khắt khe từ các khách hàng nước ngoài.`,
    attachments: [
      { title: 'Brochure giới thiệu tính năng chi tiết enjiCAD 2026.pdf', size: '3.5 MB', url: '#' }
    ],
    relatedProductIds: [1]
  },
  {
    id: 'chinh-sach-lo-trinh-ap-dung-bim-viet-nam',
    category: 'specialty',
    subType: 'Chính sách',
    title: 'Cập nhật chính sách: Lộ trình bắt buộc áp dụng mô hình BIM từ năm 2026',
    date: '18/06/2026',
    shortDesc: 'Theo quyết định mới nhất của Thủ tướng Chính phủ, kể từ năm 2026, tất cả các công trình xây dựng cấp I và cấp đặc biệt sử dụng vốn đầu tư công bắt buộc phải áp dụng BIM.',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80',
    author: 'Ban Tư vấn Pháp lý & BIM CIC',
    views: 4200,
    tags: ['Chính sách BIM', 'Đầu tư công', 'Pháp lý xây dựng'],
    contentMarkdown: `### LỘ TRÌNH BẮT BUỘC ÁP DỤNG BIM TẠI VIỆT NAM TỪ NĂM 2026

Chính phủ Việt Nam đã chính thức phê duyệt sửa đổi bổ sung về lộ trình áp dụng mô hình thông tin công trình (BIM). Đây là cú hích pháp lý cực kỳ mạnh mẽ, thúc đẩy toàn bộ thị trường xây dựng phải chuyển đổi số toàn diện.

#### Chi tiết các mốc lộ trình quan trọng:
* **Giai đoạn 1 (Áp dụng từ nay đến hết 2025)**: Bắt buộc áp dụng BIM đối với các công trình cấp đặc biệt và cấp I của các dự án đầu tư công, dự án sử dụng vốn nhà nước ngoài đầu tư công và dự án PPP.
* **Giai đoạn 2 (Bắt đầu từ 01/01/2026)**: Bắt buộc áp dụng BIM đối với toàn bộ các dự án đầu tư xây dựng mới sử dụng vốn đầu tư công, vốn nhà nước ngoài đầu tư công và dự án PPP có công trình từ cấp II trở lên.
* **Khuyến khích**: Các dự án sử dụng nguồn vốn khác (vốn tư nhân, FDI) được khuyến khích áp dụng BIM rộng rãi để tối ưu hóa chi phí và rút ngắn thời gian cấp phép xây dựng thông qua cổng dịch vụ công trực tuyến.

#### Vai trò hỗ trợ của CIC Tech:
Với hơn 10 năm kinh nghiệm tư vấn BIM chuyên sâu và là đơn vị đại diện phân phối chính hãng các giải pháp CDE của Autodesk, Bentley Systems, **CIC Tech** tự hào cung cấp dịch vụ trọn gói giúp các Ban Quản lý dự án xây dựng lộ trình đào tạo, xây dựng tiêu chuẩn BIM của đơn vị (EIR, BEP) phù hợp hoàn toàn với quy chuẩn pháp lý mới nhất.`,
    attachments: [
      { title: 'Tài liệu hướng dẫn triển khai BEP chuẩn Bộ Xây dựng.pdf', size: '4.8 MB', url: '#' }
    ],
    relatedProductIds: [1],
    relatedProjectIds: ['landmark-81-bim'],
    relatedEventIds: ['bim-digital-twins-2026']
  },

  // --- TIN TUYỂN DỤNG ---
  {
    id: 'tuyen-dung-ky-su-bim-mep-2026',
    category: 'recruitment',
    title: 'Tuyển dụng Kỹ sư Tư vấn BIM MEP (LOD 400) - Thu nhập hấp dẫn',
    date: '14/07/2026',
    shortDesc: 'CIC Tech tìm kiếm 03 Kỹ sư BIM MEP tài năng làm việc tại văn phòng Hà Nội và Hồ Chí Minh. Yêu cầu thành thạo Revit, Navisworks và có kinh nghiệm phối hợp xung đột hệ thống cơ điện tòa nhà cao tầng.',
    img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80',
    position: 'Kỹ sư Tư vấn BIM MEP',
    department: 'Khối Kỹ thuật',
    location: 'Hà Nội',
    deadline: '31/08/2026',
    salary: '18 - 28 triệu VNĐ',
    jobType: 'Toàn thời gian',
    status: 'Đang tuyển',
    author: 'Phòng Hành chính Nhân sự',
    views: 1240,
    tags: ['Tuyển dụng Kỹ sư', 'BIM MEP', 'Revit', 'Việc làm Hà Nội'],
    contentMarkdown: `### TUYỂN DỤNG KỸ SƯ TƯ VẤN BIM MEP

Do nhu cầu mở rộng quy mô các dự án tư vấn BIM cấp đặc biệt và hợp tác Digital Twins quốc tế, **CIC Tech** trân trọng kính mời các ứng viên xuất sắc ứng tuyển vào vị trí **Kỹ sư Tư vấn BIM MEP**:

#### 1. Mô tả công việc (JD):
* Xây dựng và kiểm soát mô hình 3D BIM MEP (Hệ thống điều hòa thông gió HVAC, điện nhẹ, cấp thoát nước, PCCC) đạt mức chi tiết LOD 400 bằng phần mềm Revit.
* Thực hiện kiểm tra xung đột tự động bằng Navisworks Manage, phân tích nguyên nhân và trực tiếp làm việc với các bên liên quan để tìm phương án điều chỉnh tối ưu.
* Thiết lập và quản lý dữ liệu trên hệ thống CDE (Autodesk Construction Cloud / ProjectWise).
* Hỗ trợ công tác đào tạo chuyển giao công nghệ BIM cho khách hàng khi có yêu cầu từ Trưởng bộ phận.

#### 2. Yêu cầu công việc (Requirements):
* Tốt nghiệp Đại học chuyên ngành Hệ thống kỹ thuật công trình, Cơ điện, Nhiệt lạnh hoặc Xây dựng.
* Có tối thiểu **02 năm kinh nghiệm** thiết kế cơ điện MEP hoặc trực tiếp triển khai mô hình BIM MEP cho dự án nhà cao tầng hoặc nhà xưởng công nghiệp quy mô lớn.
* Thành thạo các phần mềm: Revit, Navisworks. Biết sử dụng Dynamo hoặc lập trình API Revit là một lợi thế cực kỳ lớn.
* Có khả năng đọc hiểu tài liệu kỹ thuật bằng tiếng Anh chuyên ngành tốt.

#### 3. Quyền lợi được hưởng:
* Mức lương cứng hấp dẫn từ **18.000.000 đến 28.000.000 VNĐ** (Thỏa thuận thêm tùy theo năng lực thực tế).
* Thưởng dự án theo tiến độ bàn giao và kết quả đánh giá chất lượng mô hình từ khách hàng.
* Được tham gia các khóa đào tạo nâng cao chuyên môn trực tiếp từ các chuyên gia nước ngoài của hãng Autodesk và Bentley Systems cấp chứng chỉ quốc tế.
* Đầy đủ các chế độ BHXH, BHYT, nghỉ mát hàng năm cùng công ty, lương tháng thứ 13+.`,
    seoTitle: 'Tuyển dụng Kỹ sư Tư vấn BIM MEP tại Hà Nội - CIC Tech',
    seoDesc: 'CIC Tech tuyển dụng Kỹ sư BIM MEP lương cao từ 18-28 triệu, chế độ phúc lợi hấp dẫn, cơ hội tham gia các dự án trọng điểm quốc gia.',
    seoKeywords: ['Tuyển dụng BIM', 'Kỹ sư MEP', 'Việc làm Revit', 'CIC tuyển dụng']
  },
  {
    id: 'tuyen-dung-chuyen-vien-kinh-doanh-phan-mem',
    category: 'recruitment',
    title: 'Tuyển dụng Chuyên viên Kinh doanh Phần mềm Bản quyền (B2B SaaS)',
    date: '08/07/2026',
    shortDesc: 'Tìm kiếm 05 Chiến binh Kinh doanh phát triển thị trường giải pháp phần mềm kỹ thuật như enjiCAD, GstarCAD, Prokon tại thị trường Hồ Chí Minh và miền Nam.',
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
    position: 'Chuyên viên Kinh doanh phần mềm B2B',
    department: 'Khối Kinh doanh',
    location: 'TP. Hồ Chí Minh',
    deadline: '15/09/2026',
    salary: '12 - 20 triệu + Hoa hồng %',
    jobType: 'Toàn thời gian',
    status: 'Đang tuyển',
    author: 'Phòng Tuyển dụng CIC',
    views: 980,
    tags: ['Tuyển dụng sales', 'Phần mềm bản quyền', 'Việc làm HCM'],
    contentMarkdown: `### CHUYÊN VIÊN KINH DOANH PHẦN MỀM BẢN QUYỀN (B2B SALES)

Bạn đam mê công nghệ và mong muốn nâng tầm kỹ năng bán hàng trong phân khúc khách hàng doanh nghiệp xây dựng, cơ khí lớn? Hãy gia nhập đội ngũ kinh doanh đầy nhiệt huyết của **CIC Tech** tại TP. Hồ Chí Minh!

#### 1. Nhiệm vụ chính:
* Tìm kiếm, liên hệ và giới thiệu các gói giải pháp phần mềm bản quyền (enjiCAD, GstarCAD, Autodesk, Bentley) tới các công ty tư vấn thiết kế, nhà thầu xây dựng và nhà máy cơ khí chế tạo.
* Gặp gỡ khách hàng, tìm hiểu nhu cầu trang bị phần mềm, tư vấn giải pháp bản quyền tối ưu về chi phí và hợp pháp lý cho doanh nghiệp.
* Phối hợp chặt chẽ với bộ phận Kỹ thuật hỗ trợ của CIC để làm báo cáo kỹ thuật, chạy thử phần mềm demo cho khách hàng.
* Đàm phán ký kết hợp đồng, theo dõi tiến độ thanh toán và chăm sóc khách hàng sau bán hàng.

#### 2. Tiêu chuẩn tuyển dụng:
* Trình độ: Tốt nghiệp Cao đẳng, Đại học các ngành Quản trị kinh doanh, Marketing, Công nghệ thông tin hoặc Xây dựng.
* Có kinh nghiệm bán hàng B2B, telesales hoặc bán phần mềm tối thiểu 1 năm. Ưu tiên ứng viên có mạng lưới quan hệ rộng trong ngành xây dựng/thiết kế kỹ thuật.
* Giọng nói dễ nghe, tự tin giao tiếp và kỹ năng đàm phán, thuyết phục khách hàng xuất sắc.
* Khát khao chinh phục doanh số và tinh thần chủ động cao trong công việc.`
  },

  // --- TIN KHUYẾN MẠI ---
  {
    id: 'chuong-trinh-uu-dai-enjicad-he-2026',
    category: 'promotion',
    title: 'Siêu Ưu Đãi Mùa Hè 2026: Mua 3 tặng 1 Bản quyền vĩnh viễn enjiCAD Pro',
    date: '01/06/2026',
    shortDesc: 'Đồng hành cùng doanh nghiệp tối ưu chi phí thiết kế, CIC Tech triển khai chương trình khuyến mại lớn nhất năm dành cho phần mềm bản quyền vĩnh viễn enjiCAD Professional.',
    img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop',
    programName: 'Mùa Hè Công Nghệ - Mua 3 Tặng 1 enjiCAD',
    timeFrame: '01/06/2026 - 31/08/2026',
    appliedTargets: ['enjiCAD Professional 2D/3D', 'Hỗ trợ nâng cấp phần cứng'],
    status: 'Đang diễn ra',
    author: 'Phòng Phát triển Thị trường',
    relatedProductIds: [1],
    views: 1650,
    tags: ['Khuyến mại', 'enjiCAD Pro', 'Bản quyền vĩnh viễn', 'Ưu đãi hè 2026'],
    contentMarkdown: `### CHƯƠNG TRÌNH KHUYẾN MẠI LỚN NHẤT 2026: MUA 3 TẶNG 1 ENJICAD

Nhằm hỗ trợ các doanh nghiệp thiết kế kỹ thuật, chế tạo cơ điện và xây dựng chuyển dịch sang sử dụng phần mềm bản quyền hợp pháp với chi phí tiết kiệm nhất, **CIC Tech** trân trọng thông báo chương trình ưu đãi đặc quyền:

#### Nội dung chương trình chi tiết:
* **Thể lệ**: Khi khách hàng mua **03 giấy phép bản quyền vĩnh viễn** enjiCAD Professional 2026, sẽ được **tặng ngay 01 giấy phép** cùng loại hoàn toàn miễn phí.
* **Thời gian áp dụng**: Từ ngày **01/06/2026** đến hết ngày **31/08/2026**.
* **Đối tượng**: Áp dụng cho tất cả các khách hàng doanh nghiệp mua mới hoặc nâng cấp giấy phép enjiCAD trên toàn quốc.

#### Các quà tặng đi kèm đặc biệt:
1. Miễn phí gói **Đào tạo hướng dẫn sử dụng phần mềm trực tuyến** dành cho toàn thể đội ngũ kỹ sư của doanh nghiệp (trị giá 5.000.000đ).
2. Tặng kèm bộ tài liệu phông chữ tiếng Việt chuẩn hóa và 100+ template block CAD xây dựng thông dụng nhất hiện nay.
3. Cam kết hỗ trợ cài đặt kỹ thuật trực tiếp qua TeamViewer/UltraViewer trong vòng 1 giờ khi gặp sự cố bản vẽ.

Số lượng gói ưu đãi có hạn để đảm bảo chất lượng dịch vụ chăm sóc kỹ thuật tốt nhất. Hãy liên hệ ngay với CIC Tech hôm nay để nhận báo giá chi tiết và tải bản dùng thử miễn phí 30 ngày!`,
    seoTitle: 'Khuyến mại enjiCAD Bản quyền vĩnh viễn 2026 - CIC Tech',
    seoDesc: 'Mua 3 tặng 1 bản quyền phần mềm enjiCAD Pro vĩnh viễn từ CIC Tech. Tiết kiệm 25% chi phí hợp pháp hóa phần mềm CAD cho doanh nghiệp.',
    seoKeywords: ['Khuyến mại enjiCAD', 'Bản quyền CAD giá rẻ', 'Mua 3 tặng 1', 'CIC ưu đãi']
  },

  // --- QUAN HỆ CỔ ĐÔNG ---
  {
    id: 'nghi-quyet-dhcd-thuong-nien-2026',
    category: 'shareholder',
    title: 'Nghị quyết và Biên bản Đại hội đồng Cổ đông thường niên năm 2026',
    date: '28/04/2026',
    shortDesc: 'CIC Tech chính thức công bố Nghị quyết số 02/NQ-ĐHĐCĐ-CIC về việc thông qua kế hoạch doanh thu năm tài chính 2026 và phương án chi trả cổ tức bằng tiền mặt tỷ lệ 15%.',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
    docType: 'Nghị quyết',
    year: 2026,
    pdfUrl: '#',
    pdfSize: '2.8 MB',
    author: 'Hội đồng Quản trị CIC',
    views: 1120,
    tags: ['Quan hệ cổ đông', 'Đại hội cổ đông 2026', 'Cổ tức 15%'],
    contentMarkdown: `### NGHỊ QUYẾT ĐẠI HỘI ĐỒNG CỔ ĐÔNG THƯỜNG NIÊN NĂM 2026
#### CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TƯ VẤN CIC

Vào ngày 28 tháng 4 năm 2026, Đại hội đồng Cổ đông thường niên năm 2026 của Công ty Cổ phần Công nghệ và Tư vấn CIC đã được tiến hành hợp pháp và thành công rực rỡ tại Hà Nội. Đại hội đã thống nhất biểu quyết thông qua các nội dung quan trọng sau:

#### 1. Kết quả hoạt động kinh doanh năm 2025:
* Tổng doanh thu hợp nhất đạt **245 tỷ VNĐ** (Đạt 105% kế hoạch đề ra).
* Lợi nhuận sau thuế đạt **32 tỷ VNĐ** (Tăng trưởng 12% so với năm tài chính 2024).

#### 2. Kế hoạch kinh doanh và đầu tư năm 2026:
* Đẩy mạnh đầu tư nghiên cứu các giải pháp AI và Green-Tech (Kiểm kê khí nhà kính tự động Carbon-Tracker).
* Chỉ tiêu tổng doanh thu tăng trưởng tối thiểu **15%**, đạt mốc **280 tỷ VNĐ**.

#### 3. Phương án phân phối lợi nhuận và cổ tức:
* Biểu quyết thông qua mức chi trả cổ tức năm 2025 bằng tiền mặt với tỷ lệ **15% / cổ phiếu** (1.500 đồng cho mỗi cổ phần sở hữu).
* Thời gian dự kiến chốt danh sách cổ đông nhận cổ tức: Tháng 9/2026.

Hội đồng Quản trị kính gửi đến Quý cổ đông toàn bộ biên bản chi tiết họp đại hội đồng cổ đông và nghị quyết đã được ký phê duyệt ở phần tài liệu đính kèm bên dưới.`,
    attachments: [
      { title: 'Nghi quyet Dai hoi dong Co dong thuong nien CIC 2026.pdf', size: '2.8 MB', url: '#' },
      { title: 'Bien ban hop chi tiet DHDCD 2026 - Chu ky va Dau do.pdf', size: '4.5 MB', url: '#' }
    ],
    seoTitle: 'Nghị quyết Đại hội đồng Cổ đông thường niên năm 2026 - CIC Tech',
    seoDesc: 'Công bố chính thức Nghị quyết đại hội cổ đông CIC năm 2026. Kế hoạch kinh doanh, doanh thu dự kiến và chi tiết phương án chi trả cổ tức.',
    seoKeywords: ['Nghị quyết cổ đông', 'CIC Tech', 'Đại hội cổ đông 2026', 'Chi trả cổ tức']
  },
  {
    id: 'bao-cao-tai-chinh-hop-nhat-quas-1-2026',
    category: 'shareholder',
    title: 'Báo cáo tài chính hợp nhất Quý I năm tài chính 2026',
    date: '15/05/2026',
    shortDesc: 'Báo cáo tài chính hợp nhất Quý I/2026 ghi nhận mức tăng trưởng doanh thu ấn tượng từ mảng phần mềm bản quyền enjiCAD và dịch vụ tư vấn BIM hạ tầng số.',
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80',
    docType: 'Báo cáo',
    year: 2026,
    pdfUrl: '#',
    pdfSize: '3.1 MB',
    author: 'Ban Kiểm soát & Tài chính CIC',
    views: 750,
    tags: ['Báo cáo tài chính', 'Quý 1 2026', 'Tăng trưởng doanh thu'],
    contentMarkdown: `### BÁO CÁO TÀI CHÍNH HỢP NHẤT QUÝ I NĂM 2026

Công ty Cổ phần Công nghệ và Tư vấn CIC chính thức công bố Báo cáo tài chính hợp nhất Quý I năm 2026 đã được lập tuân thủ theo các chuẩn mực kế toán Việt Nam (VAS).

#### Tóm tắt các chỉ số tài chính trọng yếu:
* **Doanh thu thuần bán hàng & cung cấp dịch vụ**: Đạt **68.2 tỷ VNĐ** (Tăng trưởng 18.5% so với cùng kỳ năm ngoái). Trong đó doanh số từ mảng phần mềm CAD/BIM bản quyền chiếm tỷ trọng 55%, mảng thiết bị IoT đo đạc quan trắc chiếm 30% và mảng tư vấn chiếm 15%.
* **Lợi nhuận gộp**: Đạt **19.8 tỷ VNĐ**. Biên lợi nhuận gộp duy trì ổn định ở mức 29%.
* **Tổng tài sản hợp nhất**: Đạt **312 tỷ VNĐ** (Tăng 4.2% so với đầu năm tài chính).

Quý cổ đông và các nhà đầu tư có thể xem báo cáo chi tiết bao gồm Bảng cân đối kế toán, Báo cáo kết quả hoạt động kinh doanh và Báo cáo lưu chuyển tiền tệ ở tệp PDF đính kèm bên dưới.`
  },
  {
    id: 'thong-bao-phat-hanh-co-phieu-esop-2026',
    category: 'shareholder',
    title: 'Thông báo phát hành cổ phiếu theo chương trình lựa chọn cho người lao động (ESOP) năm 2026',
    date: '12/03/2026',
    shortDesc: 'Thông báo về việc phát hành cổ phiếu ESOP nhằm tri ân, gắn kết cán bộ nhân viên có thành tích xuất sắc và thâm niên cống hiến vượt trội tại CIC Tech.',
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
    docType: 'Thông báo',
    year: 2026,
    pdfUrl: '#',
    pdfSize: '1.5 MB',
    author: 'Ban Tổng Giám đốc CIC',
    views: 620,
    tags: ['ESOP 2026', 'Phát hành cổ phiếu', 'Gắn kết người lao động'],
    contentMarkdown: `### THÔNG BÁO PHÁT HÀNH CỔ PHIẾU ESOP NĂM 2026

Hội đồng quản trị Công ty Cổ phần Công nghệ và Tư vấn CIC xin thông báo phương án phát hành cổ phiếu cho người lao động có đóng góp đặc biệt trong năm tài chính vừa qua:

* **Mục đích**: Gắn kết lợi ích của người lao động nòng cốt với kết quả tăng trưởng dài hạn của CIC Tech, kiến tạo động lực cống hiến bền vững.
* **Số lượng phát hành dự kiến**: **250.000 cổ phần** (Tương đương 2.5% tổng số cổ phần đang lưu hành).
* **Giá bán ưu đãi**: 10.000đ / cổ phần.
* **Thời gian hạn chế chuyển nhượng**: 02 năm kể từ ngày hoàn tất đợt phát hành.`
  },

  // --- TIN TỨC CÔNG TY (BỔ SUNG ĐỦ 7 TIN) ---
  {
    id: 'cic-chuc-mung-35-nam-thanh-lap-2026',
    category: 'company',
    subType: 'Hoạt động CIC',
    title: 'Lễ kỷ niệm 35 năm thành lập CIC Tech: Vững vàng nền tảng - Sáng tạo tương lai',
    date: '18/05/2026',
    shortDesc: 'Hành trình 35 năm hình thành và phát triển của CIC Tech đánh dấu vị thế đơn vị tiên phong trong lĩnh vực phần mềm kỹ thuật, tư vấn BIM và giải pháp chuyển đổi số hạ tầng.',
    img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80',
    author: 'Ban Truyền thông CIC',
    views: 2100,
    tags: ['35 Năm CIC', 'Kỷ niệm thành lập', 'Lịch sử CIC'],
    contentMarkdown: `### 35 NĂM HÀNH TRÌNH KIẾN TẠO VÀ PHÁT TRIỂN

Ngày 18/05/2026, Công ty Cổ phần Công nghệ và Tư vấn CIC đã trọng thể tổ chức **Lễ Kỷ niệm 35 năm thành lập (1991 - 2026)**. Sự kiện có sự tham dự của đại diện lãnh đạo Bộ Xây dựng, các hội nghề nghiệp, đối tác chiến lược quốc tế cùng toàn thể cán bộ nhân viên CIC qua các thời kỳ.

#### Những cột mốc tự hào:
* **1991**: Thành lập Trung tâm Tin học Xây dựng - tiền thân của CIC ngày nay.
* **2005**: Tiên phong mang các giải pháp CAD/BIM bản quyền thế giới về thị trường Việt Nam.
* **2020**: Nghiên cứu và thương mại hóa thành công phần mềm **enjiCAD** - niềm tự hào phần mềm kỹ thuật Việt.
* **2026**: Khẳng định vị thế dẫn đầu trong hệ sinh thái giải pháp Bản sao số (Digital Twins) và Môi trường dữ liệu chung CDE.

Tổng Giám đốc CIC nhấn mạnh: *"35 năm là bước đệm vững chắc để CIC tiếp tục bứt phá trong kỷ nguyên số, mang công nghệ Việt vươn tầm khu vực."*`
  },
  {
    id: 'cic-khai-truong-van-phong-da-nang-2026',
    category: 'company',
    subType: 'Hoạt động CIC',
    title: 'CIC Tech chính thức khai trương văn phòng đại diện mới tại trung tâm TP. Đà Nẵng',
    date: '05/04/2026',
    shortDesc: 'Nhằm nâng cao chất lượng dịch vụ hỗ trợ kỹ thuật tại khu vực Miền Trung - Tây Nguyên, CIC Tech đã chính thức khánh thành chi nhánh văn phòng hiện đại tại Hải Châu, Đà Nẵng.',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
    author: 'Phòng Hành chính Nhân sự',
    views: 1350,
    tags: ['Chi nhánh Đà Nẵng', 'Mở rộng thị trường', 'CIC Miền Trung'],
    contentMarkdown: `### MỞ RỘNG MẠNG LƯỚI HỖ TRỢ KỸ THUẬT TẠI MIỀN TRUNG

Đà Nẵng đang vươn lên thành trung tâm công nghệ và đô thị thông minh hàng đầu Miền Trung. Để đáp ứng nhu cầu tư vấn BIM, GIS và cung cấp phần mềm bản quyền gia tăng nhanh chóng, **CIC Tech** đã đầu tư mở rộng văn phòng chi nhánh mới quy mô hơn 300m2 tại quận Hải Châu.

#### Chức năng trọng tâm của Chi nhánh Đà Nẵng:
1. **Trung tâm Đào tạo BIM/CAD**: Độc quyền tổ chức các khóa huấn luyện chuyên sâu cho kỹ sư khu vực miền Trung.
2. **Hỗ trợ Kỹ thuật On-site**: Đội ngũ chuyên gia ứng trực 24/7 hỗ trợ các dự án hạ tầng lớn như Sân bay, Cảng biển và Cao tốc Bắc - Nam.
3. **Showroom Công nghệ quan trắc**: Trưng bày trải nghiệm thực tế các thiết bị cảm biến quan trắc tự động GEO-CIC.`
  },
  {
    id: 'thong-bao-nang-cap-he-thong-cde-2026',
    category: 'company',
    subType: 'Thông báo',
    title: 'Thông báo bảo trì nâng cấp hạ tầng Môi trường Dữ liệu Chung CDE Quý III/2026',
    date: '20/07/2026',
    shortDesc: 'Thông báo lịch tạm ngưng dịch vụ ngắn hạn để nâng cấp cụm máy chủ CDE Cloud Server nhằm tăng tốc độ truyền tải file mô hình BIM 3D lên 50%.',
    img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80',
    author: 'Ban Quản trị Hạ tầng IT',
    views: 920,
    tags: ['Bảo trì CDE', 'Thông báo hạ tầng', 'Nâng cấp máy chủ'],
    contentMarkdown: `### THÔNG BÁO NÂNG CẤP HẠ TẦNG CDE CLOUD

Kính gửi Quý Khách hàng đang sử dụng dịch vụ lưu trữ dữ liệu dự án trên hệ thống **CIC-CDE Cloud**,

Nhằm cải thiện hiệu năng và mở rộng dung lượng băng thông phục vụ các dự án quy mô siêu lớn, CIC Tech xin thông báo lịch bảo trì nâng cấp định kỳ như sau:

* **Thời gian bảo trì**: Từ **23:00 thứ Bảy ngày 25/07/2026** đến **04:00 Chủ Nhật ngày 26/07/2026**.
* **Phạm vi ảnh hưởng**: Dịch vụ đồng bộ file trên ứng dụng CDE Desktop và Web portal sẽ tạm gián đoạn trong khoảng thời gian trên.
* **Lợi ích sau nâng cấp**: Tốc độ tải lên/tải xuống file bản vẽ DWG và mô hình Revit IFC sẽ tăng thêm 50%, bảo mật mã hóa SSL 256-bit mới nhất.`
  },
  {
    id: 'vinh-danh-top-10-doanh-nghiep-cntt-2026',
    category: 'company',
    subType: 'Văn hóa doanh nghiệp',
    title: 'CIC Tech tự hào nhận giải thưởng Top 10 Doanh nghiệp Công nghệ Xây dựng xuất sắc 2026',
    date: '10/03/2026',
    shortDesc: 'Giải thưởng ghi nhận những đóng góp vượt bậc của CIC Tech trong việc phát triển phần mềm nội enjiCAD và tư vấn chuyển đổi số cho ngành xây dựng Việt Nam.',
    img: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80',
    author: 'Ban Văn thể mỹ CIC',
    views: 1680,
    tags: ['Giải thưởng 2026', 'Top 10 Doanh nghiệp', 'Tự hào CIC'],
    contentMarkdown: `### VINH DANH TOP 10 DOANH NGHIỆP CÔNG NGHỆ XÂY DỰNG

Tại Lễ trao giải thưởng Công nghệ Quốc gia 2026, **Công ty Cổ phần Công nghệ và Tư vấn CIC** đã vinh dự được xướng tên trong danh sách **Top 10 Doanh nghiệp Công nghệ Xây dựng & Hạ tầng xuất sắc nhất**.

Đây là phần thưởng cao quý ghi nhận hành trình nỗ lực không ngừng của tập thể hơn 150 kỹ sư, chuyên gia công nghệ tại CIC trong suốt năm qua. Các giải pháp nổi bật như enjiCAD, phần mềm kiểm kê Carbon, giải pháp CDE đã và đang đóng góp trực tiếp vào mục tiêu chuyển đổi số xanh của đất nước.`
  },

  // --- TIN CHUYÊN NGÀNH (BỔ SUNG ĐỦ 7 TIN) ---
  {
    id: 'giai-phap-gis-3d-quan-ly-do-thi-thong-minh',
    category: 'specialty',
    subType: 'Giải pháp',
    title: 'Tích hợp 3D GIS & BIM trong quản lý quy hoạch đô thị thông minh hiện đại',
    date: '22/07/2026',
    shortDesc: 'Ứng dụng kết hợp giữa dữ liệu không gian 3D GIS và chi tiết công trình BIM giúp các nhà quản lý đô thị có cái nhìn toàn cảnh từ vĩ mô đến vi mô.',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
    author: 'ThS. Nguyễn Văn Hùng - Chuyên gia BIM/GIS CIC',
    views: 2890,
    tags: ['GIS 3D', 'BIM-GIS', 'Đô thị thông minh', 'Quy hoạch'],
    contentMarkdown: `### SỰ KẾT HỢP HOÀN HẢO GIỮA BIM VÀ 3D GIS

Nếu như **BIM** tập trung vào chi tiết hình học và thông tin phi hình học bên trong một công trình đơn lẻ, thì **GIS** lại cung cấp bối cảnh không gian địa lý bao quát toàn bộ đô thị xung quanh.

#### Lợi ích khi tích hợp BIM - GIS 3D:
1. **Mô phỏng ngập lụt đô thị**: Đặt mô hình 3D công trình vào không gian GIS để giả lập các kịch bản triều cường, mưa lớn và đưa ra phương án thoát nước tự động.
2. **Quản lý hạ tầng ngầm**: Số hóa toàn bộ mạng lưới đường ống cấp thoát nước, cáp điện ngầm dưới lòng đất bằng tọa độ VN-2000 chuẩn xác.
3. **Cấp phép xây dựng tự động**: Giúp cơ quan quản lý nhà nước tự động kiểm tra chiều cao tầng, mật độ xây dựng của file BIM nộp lên portal so với quy hoạch chung.`
  },
  {
    id: 'huong-dan-toi-uu-hoa-ban-ve-cad-lon',
    category: 'specialty',
    subType: 'Kiến thức',
    title: '10 Mẹo tối ưu hóa bản vẽ CAD dung lượng lớn giúp tăng tốc độ thiết kế gấp 3 lần',
    date: '05/06/2026',
    shortDesc: 'Tổng hợp các câu lệnh dọn dẹp bộ nhớ purge, audit, xref và thiết lập bộ đệm giúp bản vẽ CAD chạy mượt mà không lo giật lag.',
    img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80',
    author: 'Đội ngũ Kỹ thuật enjiCAD',
    views: 3500,
    tags: ['Mẹo CAD', 'Tối ưu bản vẽ', 'enjiCAD', 'AutoCAD'],
    contentMarkdown: `### BÍ QUYẾT TỐI ƯU BẢN VẼ CAD DUNG LƯỢNG LỚN

Các kỹ sư thiết kế thường xuyên gặp phải tình trạng bản vẽ CAD bị chậm, đơ hoặc dung lượng phình to bất thường lên tới hàng trăm MB. Dưới đây là 10 mẹo kỹ thuật được tổng hợp bởi các chuyên gia enjiCAD:

1. **Sử dụng lệnh PURGE (PU)**: Xóa bỏ toàn bộ các Layer, Block, TextStyle rác không sử dụng.
2. **Kiểm tra lỗi bằng AUDIT**: Sửa chữa các lỗi thực thể hỏng trong cấu trúc file DWG.
3. **Quản lý XREF thông minh**: Chuyển các bản vẽ tham chiếu sang dạng Overlay thay vì Attach.
4. **Giảm mật độ nét đứt và Hatch**: Tùy chỉnh HPMAXARRAY và LTSCALE hợp lý.
5. **Chuyển sang enjiCAD Pro 2026**: Tận dụng động cơ Multi-Core để xử lý mượt mà không lo hết RAM.`
  },
  {
    id: 'xu-huong-green-bim-khi-nha-kinh-2026',
    category: 'specialty',
    subType: 'Cập nhật công nghệ',
    title: 'Green BIM và xu hướng kiểm kê phát thải carbon tự động trong công trình xanh',
    date: '14/05/2026',
    shortDesc: 'Khám phá cách thức mô hình BIM hỗ trợ tính toán năng lượng tiêu thụ, dấu chân carbon của vật liệu xây dựng ngay từ giai đoạn ý tưởng.',
    img: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80',
    author: 'Viện Nghiên cứu Chuyển đổi Xanh CIC',
    views: 1950,
    tags: ['Green BIM', 'Công trình xanh', 'Kiểm kê Carbon', 'Net Zero'],
    contentMarkdown: `### GREEN BIM: CÔNG CỤ ĐẮC LỰC CHO MỤC TIÊU NET ZERO

Hướng tới cam kết Net Zero vào năm 2050, ngành xây dựng đang ráo riết ứng dụng **Green BIM** - giải pháp tích hợp dữ liệu môi trường vào mô hình thông tin công trình.

#### Ứng dụng nổi bật của Green BIM:
* **Mô phỏng ánh sáng & gió tự nhiên**: Tối ưu hóa hướng nhà và vị trí cửa sổ để giảm 30% chi phí điện điều hòa.
* **Đo lường Carbon tiềm ẩn (Embodied Carbon)**: Tự động xuất báo cáo tổng lượng khí thải từ quá trình sản xuất xi măng, thép, kính dựa trên khối lượng vật liệu trong mô hình BIM.`
  },
  {
    id: 'thong-tu-moi-chuan-dinh-dang-cde-2026',
    category: 'specialty',
    subType: 'Chính sách',
    title: 'Hướng dẫn thực thi chuẩn trao đổi dữ liệu CDE theo Bộ Tiêu chuẩn Quốc gia TCVN ISO 19650',
    date: '28/02/2026',
    shortDesc: 'Phân tích quy trình quản lý thông tin công trình TCVN ISO 19650 và các trạng thái dữ liệu WIP, Shared, Published, Archived trong môi trường CDE.',
    img: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80',
    author: 'Ban Tư vấn Pháp lý & BIM CIC',
    views: 2300,
    tags: ['ISO 19650', 'TCVN ISO', 'CDE', 'Chuẩn quản lý dữ liệu'],
    contentMarkdown: `### QUẢN LÝ DỮ LIỆU CÔNG TRÌNH THEO TCVN ISO 19650

Tiêu chuẩn ISO 19650 đã chính thức trở thành bộ quy chuẩn quốc gia TCVN tại Việt Nam. Việc tuân thủ quy trình quản lý thông tin trong Môi trường dữ liệu chung (CDE) là yêu cầu bắt buộc đối với tất cả các bên tham gia dự án.

#### 4 Trạng thái dữ liệu bắt buộc trong CDE:
1. **WIP (Work In Progress)**: Dữ liệu đang khởi tạo của từng bộ môn (Kiến trúc, Kết cấu, MEP).
2. **SHARED**: Dữ liệu đã kiểm tra và chia sẻ phối hợp giữa các bên.
3. **PUBLISHED**: Dữ liệu phê duyệt chính thức dùng để thi công hoặc nghiệm thu.
4. **ARCHIVED**: Dữ liệu lưu trữ lịch sử dự án phục vụ công tác vận hành bảo trì.`
  },

  // --- TIN TUYỂN DỤNG (BỔ SUNG ĐỦ 7 TIN) ---
  {
    id: 'tuyen-dung-chuyen-vien-tu-van-gis-2026',
    category: 'recruitment',
    title: 'Tuyển dụng Chuyên viên Tư vấn & Triển khai GIS 3D đô thị',
    date: '10/07/2026',
    shortDesc: 'CIC Đà Nẵng tuyển dụng 02 Chuyên viên GIS giàu kinh nghiệm làm việc trong các dự án quy hoạch đô thị thông minh và bản đồ số địa hình.',
    img: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80',
    position: 'Chuyên viên Tư vấn GIS 3D',
    department: 'Khối Kỹ thuật',
    location: 'Đà Nẵng',
    deadline: '15/09/2026',
    salary: '15 - 25 triệu VNĐ',
    jobType: 'Toàn thời gian',
    status: 'Đang tuyển',
    author: 'Phòng Nhân sự CIC',
    views: 890,
    tags: ['Tuyển dụng GIS', 'Việc làm Đà Nẵng', 'Bản đồ số'],
    contentMarkdown: `### TUYỂN DỤNG CHUYÊN VIÊN GIS 3D
* **Địa điểm**: Văn phòng CIC Đà Nẵng.
* **Yêu cầu**: Thành thạo ArcGIS, QGIS, có khả năng xử lý dữ liệu ảnh vệ tinh và mô hình 3D Mesh.
* **Quyền lợi**: Lương 15-25 triệu + Thưởng dự án, tham gia các khóa đào tạo quốc tế.`
  },
  {
    id: 'tuyen-dung-lap-trinh-vien-fullstack-2026',
    category: 'recruitment',
    title: 'Tuyển dụng Kỹ sư Lập trình Fullstack (React / Node.js / Python)',
    date: '05/07/2026',
    shortDesc: 'Tìm kiếm 03 Kỹ sư phần mềm xuất sắc tham gia phát triển core engine cho phần mềm enjiCAD và nền tảng CDE Cloud thế hệ mới.',
    img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80',
    position: 'Kỹ sư Lập trình Fullstack',
    department: 'Khối Nghiên cứu & Phát triển',
    location: 'Hà Nội',
    deadline: '20/09/2026',
    salary: '20 - 35 triệu VNĐ',
    jobType: 'Toàn thời gian',
    status: 'Đang tuyển',
    author: 'Phòng Tuyển dụng CIC',
    views: 1450,
    tags: ['Lập trình viên', 'ReactJS', 'NodeJS', 'Việc làm Hà Nội'],
    contentMarkdown: `### TUYỂN DỤNG KỸ SƯ FULLSTACK R&D
* **Vị trí**: Kỹ sư Lập trình Fullstack R&D.
* **Mô tả**: Phát triển giao diện web portal CDE, tích hợp bộ đọc viewer 3D BIM/CAD trên trình duyệt.
* **Yêu cầu**: Nắm vững TypeScript, React, Node.js, WebGL/Three.js là điểm cộng lớn.
* **Thu nhập**: 20 - 35 triệu VNĐ/tháng.`
  },
  {
    id: 'tuyen-dung-truong-nhom-marketing-digital',
    category: 'recruitment',
    title: 'Tuyển dụng Trưởng nhóm Digital Marketing phần mềm công nghệ B2B',
    date: '28/06/2026',
    shortDesc: 'CIC Tech tuyển dụng 01 Leader Marketing sáng tạo phụ trách chiến dịch quảng bá enjiCAD, phần mềm kết cấu và chuỗi hội thảo công nghệ BIM.',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
    position: 'Trưởng nhóm Digital Marketing',
    department: 'Khối Hỗ trợ',
    location: 'Hà Nội',
    deadline: '30/08/2026',
    salary: '18 - 25 triệu VNĐ',
    jobType: 'Toàn thời gian',
    status: 'Đang tuyển',
    author: 'Phòng Nhân sự CIC',
    views: 1120,
    tags: ['Marketing B2B', 'Leader Marketing', 'Công nghệ'],
    contentMarkdown: `### TUYỂN DỤNG TRƯỞNG NHÓM DIGITAL MARKETING
* **Mô tả**: Lập kế hoạch Marketing B2B, quản lý kênh Google Ads, Facebook Ads, SEO website và sự kiện Webinar.
* **Yêu cầu**: 2 năm kinh nghiệm Leader Marketing trong mảng công nghệ/B2B.`
  },
  {
    id: 'tuyen-dung-thuc-tap-sinh-ky-thuat-cad-bim',
    category: 'recruitment',
    title: 'Tuyển dụng Thực tập sinh Kỹ thuật BIM / CAD (Có hỗ trợ trợ cấp)',
    date: '15/06/2026',
    shortDesc: 'Cơ hội tuyệt vời cho sinh viên năm cuối ngành Xây dựng, Kiến trúc, Cơ điện thực tập thực tế trên các dự án lớn dưới sự dẫn dắt của chuyên gia CIC.',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80',
    position: 'Thực tập sinh BIM/CAD',
    department: 'Khối Kỹ thuật',
    location: 'TP. Hồ Chí Minh',
    deadline: '10/10/2026',
    salary: '4 - 7 triệu VNĐ',
    jobType: 'Thực tập',
    status: 'Đang tuyển',
    author: 'Phòng Tuyển dụng CIC',
    views: 1680,
    tags: ['Thực tập sinh', 'BIM CAD', 'Việc làm sinh viên'],
    contentMarkdown: `### CHƯƠNG TRÌNH THỰC TẬP TÀI NĂNG CIC 2026
* **Đối tượng**: Sinh viên năm 3, 4 các trường ĐH Bách Khoa, Kiến Trúc, Xây Dựng.
* **Quyền lợi**: Trợ cấp 4-7 triệu/tháng, đào tạo enjiCAD & Revit chuẩn quốc tế, cơ hội trở thành nhân viên chính thức.`
  },
  {
    id: 'tuyen-dung-chuyen-vien-cham-soc-khach-hang-software',
    category: 'recruitment',
    title: 'Tuyển dụng Chuyên viên Hỗ trợ Kỹ thuật & Chăm sóc Khách hàng phần mềm',
    date: '01/06/2026',
    shortDesc: 'Tuyển 02 Chuyên viên tư vấn giải đáp thắc mắc bản quyền, hướng dẫn kích hoạt phần mềm enjiCAD và hỗ trợ khách hàng doanh nghiệp.',
    img: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80',
    position: 'Chuyên viên Hỗ trợ Kỹ thuật',
    department: 'Khối Hỗ trợ',
    location: 'Hà Nội',
    deadline: '05/09/2026',
    salary: '12 - 16 triệu VNĐ',
    jobType: 'Toàn thời gian',
    status: 'Đang tuyển',
    author: 'Phòng Nhân sự CIC',
    views: 790,
    tags: ['Chăm sóc khách hàng', 'Support phần mềm', 'Việc làm Văn phòng'],
    contentMarkdown: `### TUYỂN DỤNG CHUYÊN VIÊN SUPPORT PHẦN MỀM
* **Mô tả**: Tiếp nhận hotline, hỗ trợ khách hàng cài đặt và kích hoạt bản quyền enjiCAD, GstarCAD qua Remote.
* **Yêu cầu**: Giao tiếp tốt, kiên nhẫn, sử dụng thành thạo máy tính.`
  },

  // --- TIN KHUYẾN MẠI (BỔ SUNG ĐỦ 7 TIN) ---
  {
    id: 'uu-dai-tri-an-khach-hang-than-thiet-2026',
    category: 'promotion',
    title: 'Ưu đãi tri ân: Giảm 30% chi phí nâng cấp lên enjiCAD Professional 2026',
    date: '01/07/2026',
    shortDesc: 'Chương trình tri ân dành riêng cho các khách hàng đang sở hữu bản quyền enjiCAD các phiên bản cũ đổi mới lên bản 2026 với động cơ đa nhân.',
    img: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80',
    programName: 'Tri ân Nâng cấp enjiCAD 2026',
    timeFrame: '01/07/2026 - 30/09/2026',
    appliedTargets: ['Khách hàng cũ nâng cấp enjiCAD 2026'],
    status: 'Đang diễn ra',
    author: 'Phòng Phát triển Thị trường',
    views: 1120,
    tags: ['Tri ân khách hàng', 'Giảm 30%', 'enjiCAD Pro 2026'],
    contentMarkdown: `### CHƯƠNG TRÌNH TRI ÂN NÂNG CẤP ENJICAD 2026
* **Nội dung**: Giảm trực tiếp 30% chi phí chuyển đổi giấy phép bản quyền cũ lên phiên bản enjiCAD 2026.
* **Quà tặng**: Đổi mới khóa cứng USB bản quyền miễn phí, tặng gói hỗ trợ kỹ thuật 24/7 trong 12 tháng.`
  },
  {
    id: 'tro-gia-giao-duc-truong-dai-hoc-2026',
    category: 'promotion',
    title: 'Chương trình Tài trợ 100% Bản quyền enjiCAD Edu cho các Trường Đại học',
    date: '15/06/2026',
    shortDesc: 'CIC Tech cam kết đồng hành cùng ngành giáo dục, tài trợ bản quyền phần mềm kỹ thuật cho các phòng máy tính thực hành của sinh viên.',
    img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80',
    programName: 'CIC Edu Care 2026',
    timeFrame: '15/06/2026 - 31/12/2026',
    appliedTargets: ['Các Trường Đại học, Cao đẳng Xây dựng & Kiến trúc'],
    status: 'Đang diễn ra',
    author: 'Ban Dự án Giáo dục CIC',
    views: 1420,
    tags: ['Tài trợ giáo dục', 'enjiCAD Edu', 'Bản quyền sinh viên'],
    contentMarkdown: `### CHƯƠNG TRÌNH TÀI TRỢ BẢN QUYỀN GIÁO DỤC CIC EDU CARE
* **Đối tượng**: Phòng máy tính giảng dạy thuộc các Trường ĐH Xây dựng, Bách khoa, Kiến trúc toàn quốc.
* **Hình thức**: Cấp giấy phép sử dụng enjiCAD Edu phiên bản giảng dạy miễn phí 100%.`
  },
  {
    id: 'combo-phan-mem-bim-gis-do-thi',
    category: 'promotion',
    title: 'Gói Combo Chuyển đổi số BIM & GIS: Tiết kiệm ngay 40 triệu đồng cho Doanh nghiệp',
    date: '20/05/2026',
    shortDesc: 'Ưu đãi trọn gói bao gồm phần mềm thiết kế enjiCAD Pro, giải pháp CDE Cloud và tư vấn chuẩn hóa ISO 19650.',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
    programName: 'Combo Chuyển đổi số BIM-GIS 2026',
    timeFrame: '01/05/2026 - 31/08/2026',
    appliedTargets: ['Gói bản quyền enjiCAD Pro + CDE Server'],
    status: 'Đang diễn ra',
    author: 'Phòng Kinh doanh B2B',
    views: 1300,
    tags: ['Combo giá rẻ', 'BIM GIS', 'Chuyển đổi số'],
    contentMarkdown: `### GÓI COMBO CHUYỂN ĐỔI SỐ BẮT BỘC CHO DOANH NGHIỆP
* **Nội dung**: Đăng ký trọn gói giải pháp phần mềm và tư vấn tiêu chuẩn BIM giúp doanh nghiệp sẵn sàng đấu thầu các dự án đầu tư công.`
  },
  {
    id: 'uu-dai-gstarcad-phien-ban-2026',
    category: 'promotion',
    title: 'Chương trình Đặt hàng sớm GstarCAD 2026 - Chiết khấu 20% bản quyền vĩnh viễn',
    date: '10/04/2026',
    shortDesc: 'Chương trình đặt mua trước phần mềm GstarCAD 2026 dành cho các nhà thầu cơ khí và xây dựng với mức giá ưu đãi đặc biệt.',
    img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80',
    programName: 'Pre-order GstarCAD 2026',
    timeFrame: '10/04/2026 - 31/05/2026',
    appliedTargets: ['GstarCAD 2026 Standard & Professional'],
    status: 'Đã kết thúc',
    author: 'Phòng Phát triển Thị trường',
    views: 950,
    tags: ['GstarCAD 2026', 'Giảm 20%', 'Đã kết thúc'],
    contentMarkdown: `### ĐẶT HÀNG SỚM GSTARCAD 2026
* Chương trình đã khép lại thành công với hơn 200 doanh nghiệp đăng ký đặt mua trước.`
  },
  {
    id: 'uu-dai-prokon-phan-tich-ket-cau',
    category: 'promotion',
    title: 'Tuần lễ Vàng Prokon: Tặng 1 năm bảo trì và bộ thư viện mẫu kết cấu bê tông cốt thép',
    date: '15/03/2026',
    shortDesc: 'Khuyến mại dành cho kỹ sư kết cấu khi mua bản quyền phần mềm phân tích Prokon chính hãng từ CIC Tech.',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80',
    programName: 'Tuần lễ Prokon 2026',
    timeFrame: '15/03/2026 - 31/03/2026',
    appliedTargets: ['Phần mềm phân tích kết cấu Prokon'],
    status: 'Đã kết thúc',
    author: 'Phòng Kinh doanh B2B',
    views: 870,
    tags: ['Prokon', 'Khuyến mại kết cấu', 'Đã kết thúc'],
    contentMarkdown: `### TẶNG 1 NĂM BẢO TRÌ PROKON CHÍNH HÃNG
* Khuyến mại đã kết thúc vào ngày 31/03/2026.`
  },
  {
    id: 'khuyen-mai-thiet-bi-quan-trac-tu-dong',
    category: 'promotion',
    title: 'Tài trợ 100% chi phí kiểm định thiết bị quan trắc đập thủy điện GEO-CIC',
    date: '01/02/2026',
    shortDesc: 'Ưu đãi cho các ban quản lý thủy điện và công trình cầu đường khi trang bị hệ thống quan trắc tự động.',
    img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80',
    programName: 'Đồng hành An toàn Công trình GEO-CIC',
    timeFrame: '01/02/2026 - 30/04/2026',
    appliedTargets: ['Cảm biến quan trắc nghiêng, lún GEO-CIC'],
    status: 'Đã kết thúc',
    author: 'Khối Dịch vụ Quan trắc',
    views: 1050,
    tags: ['GEO-CIC', 'Quan trắc tự động', 'Đã kết thúc'],
    contentMarkdown: `### TÀI TRỢ KIỂM ĐỊNH THIẾT BỊ QUAN TRẮC GEO-CIC
* Chương trình ưu đãi kiểm định thiết bị quan trắc đã kết thúc.`
  },

  // --- QUAN HỆ CỔ ĐÔNG (BỔ SUNG ĐỦ 7 TIN) ---
  {
    id: 'bao-cao-thuong-nien-2025-cic',
    category: 'shareholder',
    title: 'Báo cáo Thường niên năm 2025: Nâng tầm vị thế chuyển đổi số hạ tầng',
    date: '10/04/2026',
    shortDesc: 'Báo cáo tổng kết toàn bộ hoạt động quản trị, tài chính và định hướng chiến lược phát triển bền vững của CIC Tech.',
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80',
    docType: 'Báo cáo',
    year: 2025,
    pdfUrl: '#',
    pdfSize: '8.5 MB',
    author: 'Hội đồng Quản trị CIC',
    views: 980,
    tags: ['Báo cáo thường niên 2025', 'Tài liệu cổ đông', 'CIC Tech'],
    contentMarkdown: `### BÁO CÁO THƯỜNG NIÊN 2025
* Kính gửi Quý cổ đông tài liệu Báo cáo Thường niên năm tài chính 2025. Chi tiết xem tệp đính kèm.`
  },
  {
    id: 'thong-bao-chot-danh-sach-co-dong-nhan-co-tuc-2026',
    category: 'shareholder',
    title: 'Thông báo chốt danh sách cổ đông hưởng quyền nhận cổ tức năm 2025 bằng tiền mặt',
    date: '01/07/2026',
    shortDesc: 'Thông báo ngày đăng ký cuối cùng để thực hiện quyền nhận cổ tức tỷ lệ 15% bằng tiền mặt năm 2025.',
    img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80',
    docType: 'Thông báo',
    year: 2026,
    pdfUrl: '#',
    pdfSize: '1.1 MB',
    author: 'Ban Quan hệ Cổ đông CIC',
    views: 1250,
    tags: ['Chốt danh sách cổ đông', 'Cổ tức 15%', 'Thông báo'],
    contentMarkdown: `### THÔNG BÁO CHỐT DANH SÁCH CỔ ĐÔNG NHẬN CỔ TỨC
* **Ngày đăng ký cuối cùng**: 15/08/2026.
* **Tỷ lệ thực hiện**: 15%/cổ phiếu (1.500 VNĐ/cổ phiếu).
* **Ngày thanh toán dự kiến**: 05/09/2026.`
  },
  {
    id: 'tai-lieu-hop-dai-hoi-dong-co-dong-bat-thuong-2026',
    category: 'shareholder',
    title: 'Tài liệu họp Đại hội đồng Cổ đông bất thường năm 2026 thông qua dự án Trụ sở mới',
    date: '15/02/2026',
    shortDesc: 'Tờ trình và dự thảo Nghị quyết Đại hội cổ đông bất thường về việc phê duyệt phương án đầu tư xây dựng Tòa nhà Văn phòng CIC Tech.',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
    docType: 'Tài liệu cổ đông',
    year: 2026,
    pdfUrl: '#',
    pdfSize: '3.4 MB',
    author: 'Hội đồng Quản trị CIC',
    views: 840,
    tags: ['ĐHĐCĐ bất thường', 'Tài liệu họp', 'Trụ sở CIC'],
    contentMarkdown: `### TÀI LIỆU HỌP ĐẠI HỘI CỔ ĐÔNG BẤT THƯỜNG 2026
* Kính gửi Quý cổ đông bộ tài liệu phục vụ Đại hội đồng cổ đông bất thường năm 2026.`
  },
  {
    id: 'nghi-quyet-hdqt-phe-duyet-hop-tac-quoc-te',
    category: 'shareholder',
    title: 'Nghị quyết Hội đồng Quản trị về việc phê duyệt hợp tác liên doanh công nghệ quốc tế',
    date: '20/01/2026',
    shortDesc: 'Thông qua việc ký kết hợp tác thành lập liên doanh nghiên cứu phần mềm kiểm kê khí nhà kính tự động.',
    img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80',
    docType: 'Nghị quyết',
    year: 2026,
    pdfUrl: '#',
    pdfSize: '1.8 MB',
    author: 'Hội đồng Quản trị CIC',
    views: 910,
    tags: ['Nghị quyết HĐQT', 'Hợp tác quốc tế', 'Liên doanh công nghệ'],
    contentMarkdown: `### NGHỊ QUYẾT HỘI ĐỒNG QUẢN TRỊ VỀ HỢP TÁC LIÊN DOANH
* Phê duyệt phương án thành lập Liên doanh Công nghệ Xanh cùng đối tác Châu Âu.`
  }
];
