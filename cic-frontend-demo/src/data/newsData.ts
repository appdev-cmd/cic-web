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
  // SEO Metadata
  seoTitle?: string;
  seoDesc?: string;
  seoKeywords?: string[];
}

// 1. Company News Extra Details
export interface CompanyNewsItem extends BaseNewsItem {
  subType: 'Hoạt động CIC' | 'Thông báo' | 'Văn hóa doanh nghiệp';
}

// 2. Specialty News Extra Details
export interface SpecialtyNewsItem extends BaseNewsItem {
  subType: 'Kiến thức' | 'Cập nhật công nghệ' | 'Chính sách' | 'Giải pháp';
}

// 3. Recruitment News Extra Details
export interface RecruitmentNewsItem extends BaseNewsItem {
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
  programName: string; // Chương trình khuyến mại
  timeFrame: string; // Thời gian diễn ra
  appliedTargets: string[]; // Sản phẩm/dịch vụ áp dụng
  status: 'Đang diễn ra' | 'Đã kết thúc'; // Trạng thái chương trình
}

// 5. Shareholder News Extra Details
export interface ShareholderNewsItem extends BaseNewsItem {
  docType: 'Thông báo' | 'Báo cáo' | 'Nghị quyết' | 'Tài liệu cổ đông'; // Loại tài liệu cổ đông
  year: number; // Năm tài chính / công bố
  pdfUrl?: string; // Link file PDF
  pdfSize?: string; // Dung lượng file PDF
}

export type DetailedNewsItem = 
  | ({ category: 'company' } & CompanyNewsItem)
  | ({ category: 'specialty' } & SpecialtyNewsItem)
  | ({ category: 'recruitment' } & RecruitmentNewsItem)
  | ({ category: 'promotion' } & PromotionNewsItem)
  | ({ category: 'shareholder' } & ShareholderNewsItem);

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
    ]
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
    ]
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
  }
];
