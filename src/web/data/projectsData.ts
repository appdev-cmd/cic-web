/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DetailedProject {
  id: string;
  name: string;
  tagline: string;
  shortDesc: string;
  htmlContent?: string;
  sector: string; // Lĩnh vực
  solution: string; // Giải pháp áp dụng
  customer: string; // Khách hàng
  location: string; // Địa điểm
  time: string; // Thời gian thực hiện
  img: string; // Ảnh đại diện chính
  featured: boolean; // Dự án nổi bật
  scope: string[]; // Phạm vi công việc
  appliedSolutions: string[]; // Giải pháp công nghệ sử dụng
  results: string[]; // Kết quả đạt được
  gallery: string[]; // Danh sách ảnh dự án
  video?: {
    title: string;
    embedUrl: string; // YouTube / mock URL
    thumbnail: string;
  };
  pdf?: {
    title: string;
    size: string;
    url: string;
  };
  relatedLinks?: {
    label: string;
    view: 'products' | 'services';
    id: string | number;
  }[];
}

export const projectsData: DetailedProject[] = [
  {
    id: 'landmark-81-bim',
    name: 'Áp Dụng Công Nghệ BIM 5D Cho Toà Siêu Nhà Cao Tầng Landmark 81',
    tagline: 'Số hóa toàn diện dữ liệu thiết kế, phát hiện xung đột và quản lý khối lượng vật tư chính xác hơn 98%.',
    shortDesc: 'Dự án landmark mang tính lịch sử tại Hồ Chí Minh, ứng dụng giải pháp CDE và BIM nhằm chuẩn hóa toàn bộ dữ liệu thiết kế kết cấu, cơ điện (MEP) và hỗ trợ quản lý vận hành tòa nhà thông minh.',
    htmlContent: `
      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-6 mb-3 border-b border-slate-100 pb-2">Áp dụng BIM 5D trong dự án Landmark 81</h2>
      
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Landmark 81 là một trong những công trình biểu tượng của Việt Nam với quy mô lớn, yêu cầu kỹ thuật phức tạp và tiến độ thi công nghiêm ngặt. Để tối ưu quá trình thiết kế, thi công và quản lý dự án, mô hình <strong>BIM 5D</strong> được triển khai xuyên suốt toàn bộ vòng đời công trình.
      </p>

      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Khác với BIM 3D chỉ tập trung vào mô hình hóa hình học hay BIM 4D bổ sung yếu tố tiến độ, BIM 5D tích hợp thêm dữ liệu về chi phí, giúp chủ đầu tư và nhà thầu có thể theo dõi ngân sách theo thời gian thực, kiểm soát khối lượng và tối ưu hiệu quả đầu tư.
      </p>

      <div class="my-6 rounded-[10px] overflow-hidden border border-slate-200 shadow-2xs">
        <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80" alt="Toàn cảnh Landmark 81 nhìn từ trên cao" class="w-full h-auto object-cover max-h-[420px]" />
        <p class="text-xs text-slate-500 italic p-2 bg-slate-50 text-center border-t border-slate-100">Toàn cảnh công trình Landmark 81 nhìn từ góc trên cao</p>
      </div>

      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-8 mb-3 border-b border-slate-100 pb-2">Tổng quan giải pháp BIM 5D</h2>

      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Trong dự án, toàn bộ kết cấu, kiến trúc và hệ thống MEP được mô hình hóa trên một nền tảng dữ liệu thống nhất. Mọi thay đổi trong thiết kế đều được đồng bộ ngay lập tức tới các bộ phận liên quan, giúp giảm sai sót và hạn chế xung đột giữa các hạng mục.
      </p>

      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Việc tích hợp dữ liệu chi phí vào mô hình cho phép đội ngũ quản lý theo dõi biến động ngân sách ngay khi có thay đổi về thiết kế hoặc khối lượng thi công. Điều này giúp các quyết định được đưa ra nhanh chóng và chính xác hơn.
      </p>

      <div class="my-6 rounded-[10px] overflow-hidden border border-slate-200 shadow-2xs">
        <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80" alt="Mô hình BIM 3D hiển thị kết cấu và hệ thống kỹ thuật" class="w-full h-auto object-cover max-h-[420px]" />
        <p class="text-xs text-slate-500 italic p-2 bg-slate-50 text-center border-t border-slate-100">Mô hình BIM 3D hiển thị chi tiết kết cấu và hệ thống kỹ thuật MEP</p>
      </div>

      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-8 mb-3 border-b border-slate-100 pb-2">Quy trình triển khai</h2>

      <h3 class="text-sm sm:text-base font-bold text-slate-900 mt-5 mb-2">1. Mô hình hóa dữ liệu công trình</h3>
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-3">Đội ngũ thiết kế xây dựng mô hình số hoàn chỉnh bao gồm:</p>
      <ul class="list-disc pl-5 text-slate-700 text-xs sm:text-sm space-y-1.5 mb-4">
        <li>Kiến trúc</li>
        <li>Kết cấu</li>
        <li>Hệ thống điện</li>
        <li>Hệ thống cấp thoát nước</li>
        <li>Điều hòa thông gió</li>
        <li>Phòng cháy chữa cháy</li>
      </ul>
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">Tất cả dữ liệu đều được liên kết trên cùng một mô hình nhằm đảm bảo tính nhất quán trong suốt dự án.</p>

      <h3 class="text-sm sm:text-base font-bold text-slate-900 mt-5 mb-2">2. Liên kết tiến độ thi công (4D)</h3>
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Mỗi hạng mục được gắn với kế hoạch thi công cụ thể, giúp mô phỏng quá trình xây dựng theo từng giai đoạn. Ban quản lý có thể quan sát trực quan trình tự thi công, phát hiện các điểm chồng chéo và điều chỉnh kế hoạch trước khi triển khai thực tế.
      </p>

      <div class="my-6 rounded-[10px] overflow-hidden border border-slate-200 shadow-2xs">
        <img src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80" alt="Timeline mô phỏng tiến độ thi công BIM 4D" class="w-full h-auto object-cover max-h-[420px]" />
        <p class="text-xs text-slate-500 italic p-2 bg-slate-50 text-center border-t border-slate-100">Mô phỏng tiến độ thi công và kế hoạch lắp đặt thiết bị theo mốc thời gian 4D</p>
      </div>

      <h3 class="text-sm sm:text-base font-bold text-slate-900 mt-5 mb-2">3. Quản lý chi phí (5D)</h3>
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-3">
        Dữ liệu dự toán và đơn giá được kết nối trực tiếp với mô hình BIM. Khi có thay đổi về kích thước, vật liệu hoặc thiết kế, hệ thống sẽ tự động cập nhật:
      </p>
      <ul class="list-disc pl-5 text-slate-700 text-xs sm:text-sm space-y-1.5 mb-4">
        <li>Khối lượng vật tư</li>
        <li>Chi phí vật liệu</li>
        <li>Chi phí nhân công</li>
        <li>Tổng ngân sách dự án</li>
      </ul>
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Nhờ đó, chủ đầu tư luôn nắm được tình hình tài chính của dự án mà không cần thực hiện bóc tách thủ công.
      </p>

      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-8 mb-3 border-b border-slate-100 pb-2">Những lợi ích nổi bật</h2>

      <ul class="list-disc pl-5 text-slate-700 text-xs sm:text-sm space-y-2 mb-6">
        <li><strong>Tăng độ chính xác:</strong> Việc sử dụng mô hình số giúp giảm đáng kể sai sót giữa hồ sơ thiết kế và quá trình thi công thực tế.</li>
        <li><strong>Kiểm soát ngân sách:</strong> Các khoản chi phí được cập nhật theo thời gian thực, hỗ trợ quản lý nguồn vốn hiệu quả hơn.</li>
        <li><strong>Rút ngắn tiến độ:</strong> Việc phát hiện sớm xung đột kỹ thuật giúp hạn chế sửa chữa trong quá trình thi công, tiết kiệm thời gian.</li>
        <li><strong>Tối ưu phối hợp:</strong> Kiến trúc sư, kỹ sư và nhà thầu cùng làm việc trên một nguồn dữ liệu duy nhất, giảm thiểu trao đổi rời rạc.</li>
      </ul>

      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-8 mb-3 border-b border-slate-100 pb-2">Kết quả triển khai dự án</h2>
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-3">Sau khi áp dụng giải pháp BIM 5D, dự án đạt được nhiều kết quả thực tế tích cực:</p>
      <ul class="list-disc pl-5 text-slate-700 text-xs sm:text-sm space-y-2 mb-6">
        <li>Giảm khoảng 35% xung đột giữa các bộ môn kỹ thuật.</li>
        <li>Tiết kiệm 12% chi phí phát sinh trong quá trình thi công.</li>
        <li>Rút ngắn khoảng 18% thời gian xử lý thay đổi thiết kế.</li>
        <li>Nâng cao hiệu quả phối hợp giữa các bên tham gia dự án.</li>
        <li>Tăng tính minh bạch trong quản lý khối lượng và ngân sách.</li>
      </ul>

      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-8 mb-3 border-b border-slate-100 pb-2">Kết luận</h2>
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        BIM 5D không chỉ là công cụ mô hình hóa mà còn là nền tảng quản lý toàn diện, giúp kết nối thiết kế, tiến độ và chi phí trên cùng một hệ thống dữ liệu. Với các công trình siêu cao tầng như Landmark 81, việc áp dụng BIM 5D mang lại khả năng kiểm soát tốt hơn về chất lượng, tiến độ và ngân sách, đồng thời tạo nền tảng cho quá trình vận hành và bảo trì công trình trong tương lai.
      </p>

      <div class="my-6 rounded-[10px] overflow-hidden border border-slate-200 shadow-2xs">
        <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80" alt="Landmark 81 hoàn thiện" class="w-full h-auto object-cover max-h-[420px]" />
        <p class="text-xs text-slate-500 italic p-2 bg-slate-50 text-center border-t border-slate-100">Landmark 81 - Biểu tượng kiến trúc hiện đại ứng dụng công nghệ BIM tiên tiến</p>
      </div>
    `,
    sector: 'Dân dụng & Công nghiệp',
    solution: 'Tư vấn BIM/Digital Twins',
    customer: 'Tập đoàn Vingroup',
    location: 'Bình Thạnh, TP. Hồ Chí Minh',
    time: '2016 - 2018',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
    featured: true,
    scope: [
      'Xây dựng mô hình 3D BIM (LOD 400) cho kết cấu, kiến trúc và hệ thống cơ điện (MEP).',
      'Thiết lập Môi trường dữ liệu chung (CDE) trên đám mây phục vụ phối hợp đa bên giữa Chủ đầu tư, Tư vấn và Nhà thầu.',
      'Kiểm tra xung đột tự động (Clash Detection), tối ưu hóa đường đi của đường ống MEP.',
      'Mô phỏng biện pháp thi công 4D đối với các khu vực kết cấu phức tạp (móng bè, nút khung cột siêu cường).'
    ],
    appliedSolutions: [
      'Autodesk Revit',
      'Navisworks Manage',
      'CDE Autodesk Construction Cloud (ACC)',
      'Phần mềm phân tích kết cấu Prokon'
    ],
    results: [
      'Phát hiện và xử lý sớm hơn 450 điểm giao cắt xung đột nghiêm trọng trước khi sản xuất lắp đặt thực tế.',
      'Rút ngắn 15 ngày trong việc phê duyệt bản vẽ kỹ thuật nhờ giải pháp CDE trực tuyến.',
      'Tối ưu hóa hao hụt vật liệu thép và bê tông xuống dưới mức 1.5%.',
      'Bàn giao mô hình As-Built (Hoàn công) chuẩn dữ liệu cho bộ phận quản lý vận hành Asset Management.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80'
    ],
    video: {
      title: 'Mô phỏng biện pháp thi công BIM 4D Landmark 81',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80'
    },
    pdf: {
      title: 'Báo cáo Điển hình (Case Study) Áp Dụng BIM tại Landmark 81.pdf',
      size: '4.8 MB',
      url: '#'
    },
    relatedLinks: [
      { label: 'Dịch vụ Tư vấn BIM toàn diện', view: 'services', id: 'tu-van-bim' },
      { label: 'Phần mềm kết cấu Prokon chính hãng', view: 'products', id: 3 }
    ]
  },
  {
    id: 'cao-toc-bac-nam-twin',
    name: 'Mô Hình Hóa Digital Twins Tuyến Cao Tốc Bắc - Nam (Đoạn Cam Lộ - La Sơn)',
    tagline: 'Ứng dụng công nghệ bản sao số iTwin và GIS để quản lý bảo trì hạ tầng giao thông thông minh.',
    shortDesc: 'Hợp tác cùng Bộ Giao thông Vận tải triển khai thí điểm số hóa 3D toàn tuyến cao tốc, tích hợp cảm biến IoT giám sát sạt lở và hiện trạng mặt đường thời gian thực.',
    htmlContent: `
      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-6 mb-3 border-b border-slate-100 pb-2">Bối cảnh & Thách thức Quản lý Hạ tầng</h2>
      
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Đoạn cao tốc Cam Lộ - La Sơn đi qua khu vực địa hình đồi núi phức tạp của tỉnh Quảng Trị và Thừa Thiên Huế, nơi thường xuyên chịu ảnh hưởng của bão lũ, mưa lớn gây sạt lở đất đá taluy âm/dương và hư hỏng mặt đường.
      </p>

      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Phương pháp tuần tra bảo dưỡng truyền thống bằng mắt thường tốn nhiều nhân lực, phản ứng chậm trước các nguy cơ tai nạn sạt lở. Bộ Giao thông Vận tải đã phối hợp cùng CIC Technology để ứng dụng nền tảng <strong>Digital Twins (Bản sao số)</strong> kết hợp hệ thống thông tin địa lý (GIS) và cảm biến IoT.
      </p>

      <div class="my-6 rounded-[10px] overflow-hidden border border-slate-200 shadow-2xs">
        <img src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80" alt="Mô hình Digital Twins đường cao tốc" class="w-full h-auto object-cover max-h-[420px]" />
        <p class="text-xs text-slate-500 italic p-2 bg-slate-50 text-center border-t border-slate-100">Bản sao số 3D toàn tuyến cao tốc Cam Lộ - La Sơn được dựng từ dữ liệu trắc địa UAV</p>
      </div>

      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-8 mb-3 border-b border-slate-100 pb-2">Giải pháp Kỹ thuật Triển khai</h2>

      <h3 class="text-sm sm:text-base font-bold text-slate-900 mt-5 mb-2">1. Khảo sát trắc địa hàng không UAV & Point Cloud</h3>
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Sử dụng máy bay không người lái (UAV) chụp ảnh đo vẽ hàng không độ phân giải cao, trích xuất dữ liệu mây điểm (Point Cloud) mật độ dày đặc để xây dựng mô hình địa hình số tự nhiên (DSM) chuẩn xác từng centi-mét.
      </p>

      <h3 class="text-sm sm:text-base font-bold text-slate-900 mt-5 mb-2">2. Số hóa 3D các công trình cầu hầm & Hạ tầng kỹ thuật</h3>
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Toàn bộ hệ thống cầu vượt, hầm chui, rãnh thoát nước và các mái taluy được mô hình hóa chi tiết bằng phần mềm Bentley OpenRoads Designer, tạo thành kho dữ liệu tài sản số tập trung.
      </p>

      <div class="my-6 rounded-[10px] overflow-hidden border border-slate-200 shadow-2xs">
        <img src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80" alt="Giám sát quan trắc sạt lở từ xa" class="w-full h-auto object-cover max-h-[420px]" />
        <p class="text-xs text-slate-500 italic p-2 bg-slate-50 text-center border-t border-slate-100">Giao diện Dashboard theo dõi dữ liệu quan trắc độ dịch chuyển mái taluy thời gian thực</p>
      </div>

      <h3 class="text-sm sm:text-base font-bold text-slate-900 mt-5 mb-2">3. Tích hợp trạm cảm biến IoT cảnh báo sạt lở tự động</h3>
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Lắp đặt hệ thống cảm biến đo độ nghiêng (Inclinometer), đo áp lực nước lỗ rỗng và trạm đo mưa tự động tại các điểm nguy cơ sạt lở cao. Dữ liệu truyền liên tục qua sóng 4G/vệ tinh về trung tâm điều hành.
      </p>

      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-8 mb-3 border-b border-slate-100 pb-2">Hiệu quả mang lại</h2>

      <ul class="list-disc pl-5 text-slate-700 text-xs sm:text-sm space-y-2 mb-6">
        <li><strong>Quản lý trực quan 98km:</strong> Xây dựng thành công hệ thống bản đồ số với sai số vị trí dưới 5cm trên toàn bộ chiều dài tuyến.</li>
        <li><strong>Cảnh báo sự cố nhanh gấp 3 lần:</strong> Phát hiện sớm nguy cơ sạt lở trước 24-48 giờ nhờ phân tích dữ liệu biến dạng đất tự động.</li>
      </ul>

      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-8 mb-3 border-b border-slate-100 pb-2">Kết luận</h2>
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Dự án Digital Twins cao tốc Cam Lộ - La Sơn đánh dấu bước tiến đột phá trong chiến lược chuyển đổi số ngành giao thông vận tải Việt Nam, làm tiền đề nhân rộng cho toàn bộ tuyến đường bộ cao tốc Bắc - Nam.
      </p>
    `,
    sector: 'Hạ tầng giao thông',
    solution: 'Tư vấn BIM/Digital Twins',
    customer: 'Bộ Giao thông Vận tải',
    location: 'Quảng Trị - Thừa Thiên Huế',
    time: '2022 - 2024',
    img: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80',
    featured: true,
    scope: [
      'Quét khảo sát bằng UAV (máy bay không người lái) và trích xuất đám mây điểm (Point Cloud) độ phân giải cao.',
      'Dựng mô hình địa hình số tự nhiên (DSM) và mô hình 3D cầu, cống, hầm dọc tuyến.',
      'Phát triển nền tảng Dashboard iTwin tích hợp bản đồ GIS phục vụ vận hành từ xa.',
      'Tích hợp dữ liệu đo độ nghiêng đất, lượng mưa tự động để đưa ra cảnh báo sớm sạt lở taluy.'
    ],
    appliedSolutions: [
      'Bentley OpenRoads Designer',
      'ContextCapture (Mô hình hóa thực tế)',
      'iTwin Platform',
      'Hệ thống trạm quan trắc địa kỹ thuật tự động'
    ],
    results: [
      'Xây dựng thành công bản đồ số dài 98km chuẩn sai số dưới 5cm.',
      'Hỗ trợ ra quyết định ứng phó sạt lở nhanh gấp 3 lần dựa trên phân tích dữ liệu cảm biến thời gian thực.',
      'Cung cấp hệ thống quản lý tài sản hạ tầng trực quan cho đơn vị vận hành đường cao tốc.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80'
    ],
    pdf: {
      title: 'Tài liệu giải pháp quản lý tài sản số iTwin cho đường bộ.pdf',
      size: '6.2 MB',
      url: '#'
    },
    relatedLinks: [
      { label: 'Dịch vụ Tư vấn dự án & xây dựng', view: 'services', id: 'tu-van-xay-dung' }
    ]
  },
  {
    id: 'dien-gio-mui-dinh',
    name: 'Đánh Giá Sản Lượng Điện Gió Đạt Chuẩn Bankable Dự Án Điện Gió Mũi Dinh',
    tagline: 'Thẩm định số liệu gió chi tiết, phục vụ mục đích gọi vốn đầu tư quốc tế thành công.',
    shortDesc: 'Đo đạc khí tượng và mô phỏng số sản lượng điện (AEP) áp dụng mô hình CFD tiên tiến nhất, đáp ứng các tiêu chuẩn khắt khe từ tổ chức tài chính Đức.',
    htmlContent: `
      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-6 mb-3 border-b border-slate-100 pb-2">Tầm quan trọng của Báo cáo Bankable</h2>
      
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Dự án điện gió Mũi Dinh tại Ninh Thuận có tổng công suất 37.6 MW. Để huy động nguồn vốn vay thương mại từ các tổ chức tài chính châu Âu, dự án đòi hỏi báo cáo đánh giá tiềm năng gió và dự báo sản lượng điện hàng năm (AEP) phải đạt chuẩn <strong>Bankable Report</strong> khắt khe nhất.
      </p>

      <div class="my-6 rounded-[10px] overflow-hidden border border-slate-200 shadow-2xs">
        <img src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80" alt="Cánh đồng điện gió Mũi Dinh" class="w-full h-auto object-cover max-h-[420px]" />
        <p class="text-xs text-slate-500 italic p-2 bg-slate-50 text-center border-t border-slate-100">Các trụ tua-bin gió tại khu vực Mũi Dinh - Ninh Thuận</p>
      </div>

      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-8 mb-3 border-b border-slate-100 pb-2">Quy trình Đo đạc & Mô phỏng Khí động học</h2>

      <h3 class="text-sm sm:text-base font-bold text-slate-900 mt-5 mb-2">1. Lắp đặt cột đo gió 120m đạt chuẩn MEASNET</h3>
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        CIC thực hiện khảo sát và lắp đặt hệ thống cột khí tượng cao 120m trang bị cảm biến đo gió siêu âm (Ultrasonic Anemometer) và đo hướng gió chính xác cao, thu thập chuỗi dữ liệu liên tục 12 tháng.
      </p>

      <h3 class="text-sm sm:text-base font-bold text-slate-900 mt-5 mb-2">2. Mô phỏng động lực học chất lưu CFD (WindSim CFD)</h3>
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Địa hình dốc ven biển Mũi Dinh tạo ra dòng nhiễu loạn phức tạp. Đội ngũ chuyên gia CIC sử dụng mô hình tính toán mô phỏng dòng chảy 3D WindSim CFD nhằm đánh giá chính xác sự thay đổi vận tốc gió theo độ cao và địa hình.
      </p>

      <div class="my-6 rounded-[10px] overflow-hidden border border-slate-200 shadow-2xs">
        <img src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop" alt="Mô phỏng trường gió 3D" class="w-full h-auto object-cover max-h-[420px]" />
        <p class="text-xs text-slate-500 italic p-2 bg-slate-50 text-center border-t border-slate-100">Biểu đồ phân bố mật độ năng lượng gió và dòng nhiễu loạn 3D quanh các trụ tua-bin</p>
      </div>

      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-8 mb-3 border-b border-slate-100 pb-2">Kết quả & Giá trị Đạt được</h2>

      <ul class="list-disc pl-5 text-slate-700 text-xs sm:text-sm space-y-2 mb-6">
        <li>Xác định sản lượng phát điện AEP với độ tin cậy P90 đạt tỷ lệ sai số dưới 3.5%.</li>
        <li>Tối ưu hóa vị trí móng của 16 tua-bin gió, giúp tăng 1.8% tổng lượng điện phát hàng năm.</li>
        <li>Báo cáo thẩm định kỹ thuật được tổ chức tài chính Đức phê duyệt trực tiếp mà không cần sửa đổi.</li>
      </ul>
    `,
    sector: 'Năng lượng tái tạo',
    solution: 'Đánh giá Điện gió đạt chuẩn Bankable',
    customer: 'Tập đoàn Điện lực Việt Nam (EVN)',
    location: 'Mũi Dinh, Ninh Thuận',
    time: '2021 - 2022',
    img: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80',
    featured: true,
    scope: [
      'Lắp đặt cột khí tượng cao 120m trang bị cảm biến đo gió siêu âm tiêu chuẩn MEASNET.',
      'Kiểm thử, chuẩn hóa chuỗi dữ liệu đo liên tục trong 12 tháng.',
      'Mô phỏng trường gió 3D bằng phương pháp động lực học chất lưu (CFD) qua địa hình phức tạp ven biển Mũi Dinh.',
      'Tính toán tổn thất sản lượng (Wake effects, tổn thất điện truyền tải, tổn thất bụi bẩn bám cánh).'
    ],
    appliedSolutions: [
      'Phần mềm mô phỏng trường gió WAsP',
      'WindSim CFD chuyên sâu',
      'Cảm biến khí tượng khí động học đạt chứng chỉ châu Âu'
    ],
    results: [
      'Xác định lượng điện phát hàng năm (AEP) với mức độ tin cậy P90 sai lệch cực thấp (< 3.5%).',
      'Báo cáo kỹ thuật được ngân hàng bảo lãnh tài chính quốc tế phê chuẩn không cần điều chỉnh lại.',
      'Hỗ trợ chủ đầu tư tối ưu hóa vị trí móng của 16 tua-bin gió giúp tăng 1.8% tổng sản lượng phát điện.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop'
    ],
    pdf: {
      title: 'Tóm tắt báo cáo năng lực thẩm định năng lượng gió CIC.pdf',
      size: '2.5 MB',
      url: '#'
    },
    relatedLinks: [
      { label: 'Dịch vụ Đánh giá điện gió đạt chuẩn', view: 'services', id: 'danh-gia-san-luong-dien-gio' }
    ]
  },
  {
    id: 'nha-may-thep-hoa-phat-bim',
    name: 'Ứng Dụng BIM & Tekla Cho Hệ Nhà Xưởng Thép Tổ Hợp Gang Thép Hòa Phát Dung Quất 2',
    tagline: 'Triển khai bản vẽ chi tiết gia công thép (Shop Drawing) tự động tránh sai sót lắp ghép tại công trường.',
    shortDesc: 'Ứng dụng mô hình hóa kết cấu thép khẩu độ siêu lớn cho các gian lò cao, nhà xưởng phụ trợ giúp kiểm soát tuyệt đối dung sai và lắp ghép an toàn.',
    htmlContent: `
      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-6 mb-3 border-b border-slate-100 pb-2">Quy mô Kết cấu Thép Tổ hợp Dung Quất 2</h2>
      
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Tổ hợp Gang thép Hòa Phát Dung Quất 2 có tổng khối lượng kết cấu thép hơn 12.000 tấn. Các gian nhà xưởng luyện thép và khu vực lò cao đòi hỏi các vì kèo thép khẩu độ lớn vượt nhịp 48m, chịu tải trọng va đập động của cầu trục 150 tấn.
      </p>

      <div class="my-6 rounded-[10px] overflow-hidden border border-slate-200 shadow-2xs">
        <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80" alt="Kết cấu thép nhà xưởng công nghiệp" class="w-full h-auto object-cover max-h-[420px]" />
        <p class="text-xs text-slate-500 italic p-2 bg-slate-50 text-center border-t border-slate-100">Khung kết cấu thép siêu trọng gian xưởng luyện thép Dung Quất 2</p>
      </div>

      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-8 mb-3 border-b border-slate-100 pb-2">Giải pháp Kỹ thuật Triển khai</h2>

      <h3 class="text-sm sm:text-base font-bold text-slate-900 mt-5 mb-2">1. Mô hình hóa chi tiết LOD 400 trên Tekla Structures</h3>
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Dựng mô hình chính xác tới từng vị trí lỗ bu-lông, bản mã, mối hàn nhà xưởng. Kiểm tra xung đột tự động giữa khung thép kết cấu với đường ống công nghệ và hệ thống điện mạ kẽm.
      </p>

      <h3 class="text-sm sm:text-base font-bold text-slate-900 mt-5 mb-2">2. Xuất bản vẽ gia công Workshop Drawing & file CNC</h3>
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Tự động trích xuất bản vẽ chế tạo cấu kiện, bản vẽ lắp dựng và bảng thống kê khối lượng thép phôi. Tối ưu sơ đồ cắt phôi thép bằng phần mềm enjiCAD giúp giảm thiểu tối đa thép vụn phế liệu.
      </p>

      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-8 mb-3 border-b border-slate-100 pb-2">Hiệu quả Triển khai</h2>

      <ul class="list-disc pl-5 text-slate-700 text-xs sm:text-sm space-y-2 mb-6">
        <li><strong>12.000+ tấn thép chuẩn xác:</strong> Không xảy ra bất kỳ sự cố lệch bu-lông móng hay sai khác kích thước cấu kiện khi lắp ráp ngoài công trường.</li>
        <li><strong>Tiết kiệm 8% vật liệu phôi:</strong> Tối ưu sơ đồ cắt thép CNC giảm chi phí hao hụt vật tư trực tiếp cho nhà máy gia công.</li>
      </ul>
    `,
    sector: 'Dân dụng & Công nghiệp',
    solution: 'Tư vấn giải pháp ngành thép',
    customer: 'Tổng thầu Coteccons',
    location: 'Dung Quất, Quảng Ngãi',
    time: '2023 - Hiện tại',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80',
    featured: false,
    scope: [
      'Mô hình hóa chi tiết (LOD 400) toàn bộ bu-lông, bản mã, mối hàn hệ vì kèo thép.',
      'Phát hiện xung đột kết cấu thép với hệ đường ống công nghệ lò cao sấy khí.',
      'Xuất bản vẽ chế tạo (Workshop Drawing) và danh sách cấu kiện CNC tự động cho nhà máy gia công kết cấu thép.'
    ],
    appliedSolutions: [
      'Tekla Structures',
      'enjiCAD Professional',
      'IDEA Statica (Tính toán chi tiết liên kết)'
    ],
    results: [
      'Hoàn thành hơn 12.000 tấn cấu kiện thép đạt chuẩn thiết kế không xảy ra lỗi lắp ghép lắp lệch trục.',
      'Tiết kiệm 8% hao hụt thép phế liệu nhờ tối ưu hóa sơ đồ cắt phôi trên enjiCAD.',
      'Rút ngắn 20% thời gian thiết kế kỹ thuật chế tạo.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80'
    ],
    relatedLinks: [
      { label: 'Phần mềm vẽ thiết kế enjiCAD', view: 'products', id: 1 },
      { label: 'Dịch vụ Tư vấn giải pháp kết cấu thép', view: 'services', id: 'tu-van-giai-phap-nganh-thep' }
    ]
  },
  {
    id: 'kiem-ke-khi-nha-kinh-vinhomes',
    name: 'Kiểm Kê Phát Thải Khí Nhà Kính Chuẩn ISO 14064 Cho Chuỗi Đô Thị Vinhomes',
    tagline: 'Số hóa lộ trình kiểm kê phát thải các tòa nhà cao tầng tiến tới mục tiêu Net Zero bền vững.',
    shortDesc: 'Triển khai giải pháp khảo sát lượng phát thải trực tiếp (Scope 1) và gián tiếp (Scope 2) cho toàn bộ trung tâm thương mại và tháp chung cư Vinhomes tại Hà Nội.',
    htmlContent: `
      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-6 mb-3 border-b border-slate-100 pb-2">Bối cảnh Kiểm kê Phát thải Đô thị</h2>
      
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Các đại đô thị Vinhomes với hàng chục tòa nhà cao tầng, trung tâm thương mại tiêu thụ lượng điện năng và năng lượng vận hành lớn. Để hướng tới tiêu chuẩn phát triển bền vững ESG và tuân thủ quy định pháp luật Việt Nam, Vinhomes đã hợp tác cùng CIC để thực hiện kiểm kê khí nhà kính toàn diện.
      </p>

      <div class="my-6 rounded-[10px] overflow-hidden border border-slate-200 shadow-2xs">
        <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80" alt="Đô thị thông minh xanh bền vững" class="w-full h-auto object-cover max-h-[420px]" />
        <p class="text-xs text-slate-500 italic p-2 bg-slate-50 text-center border-t border-slate-100">Kiểm kê phát thải Carbon chuẩn hóa cho toàn bộ các tòa nhà cao tầng thuộc hệ thống Vinhomes</p>
      </div>

      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-8 mb-3 border-b border-slate-100 pb-2">Phạm vi Thu thập & Công nghệ Số hóa</h2>

      <h3 class="text-sm sm:text-base font-bold text-slate-900 mt-5 mb-2">1. Khảo sát nguồn phát thải Scope 1 & Scope 2</h3>
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Thống kê nhiên liệu máy phát điện dự phòng, rò rỉ môi chất lạnh điều hòa Chiller (Scope 1) và tự động đồng bộ điện năng tiêu thụ từ hóa đơn EVN qua API (Scope 2).
      </p>

      <h3 class="text-sm sm:text-base font-bold text-slate-900 mt-5 mb-2">2. Sử dụng giải pháp phần mềm CIC Carbon-Tracker</h3>
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Ứng dụng nền tảng Carbon-Tracker tự động quy đổi dữ liệu năng lượng ra hệ số phát thải CO2 tương đương (tCO2e), xuất báo cáo tuân thủ tiêu chuẩn ISO 14064-1 và Bộ Tài nguyên & Môi trường.
      </p>

      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-8 mb-3 border-b border-slate-100 pb-2">Kết quả Đạt được</h2>
      <ul class="list-disc pl-5 text-slate-700 text-xs sm:text-sm space-y-2 mb-6">
        <li>Giảm 80% thời gian khảo sát thu thập dữ liệu thủ công nhờ hệ thống kết nối tự động.</li>
        <li>Báo cáo kết quả kiểm kê được tổ chức chứng nhận SGS thẩm tra đạt chuẩn quốc tế.</li>
        <li>Đề xuất các giải pháp kỹ thuật cắt giảm 12% điện năng tiêu thụ cho hệ thống điều hòa không khí.</li>
      </ul>
    `,
    sector: 'Kiểm kê phát thải',
    solution: 'Kiểm kê khí nhà kính',
    customer: 'Tập đoàn Vingroup',
    location: 'Hà Nội',
    time: '2023 - 2024',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
    featured: false,
    scope: [
      'Khảo sát nguồn phát thải nhiên liệu máy phát, môi chất lạnh điều hòa trung tâm (Scope 1).',
      'Tích hợp chỉ số tiêu thụ điện năng từ lưới điện số EVN thông qua API (Scope 2).',
      'Lập báo cáo kiểm kê phát thải khí nhà kính đáp ứng thông tư và quy định pháp luật Việt Nam.'
    ],
    appliedSolutions: [
      'Hệ thống thu thập dữ liệu phát thải tự động CIC Carbon-Tracker',
      'Nền tảng iTwin tích hợp thông số năng lượng xanh'
    ],
    results: [
      'Số hóa quy trình thu thập dữ liệu năng lượng giúp giảm 80% công sức khảo sát tay.',
      'Được tổ chức chứng nhận quốc tế SGS phê chuẩn đạt tiêu chuẩn ISO 14064-1.',
      'Đề xuất thành công 5 giải pháp cải tiến kỹ thuật giúp giảm 12% điện năng tiêu thụ điều hòa.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80'
    ],
    pdf: {
      title: 'Cẩm nang hướng dẫn kiểm kê khí nhà kính cho tòa nhà thương mại.pdf',
      size: '3.1 MB',
      url: '#'
    },
    relatedLinks: [
      { label: 'Dịch vụ Tư vấn Kiểm kê Khí nhà kính', view: 'services', id: 'tu-van-kiem-ke-khi-nha-kinh' }
    ]
  },
  {
    id: 'web360-kcn-long-thanh',
    name: 'Xây Dựng Hệ Thống Bản Đồ Tương Tác Web 360 Độ Cho Khu Công Nghiệp Amata Long Thành',
    tagline: 'Số hóa không gian 3D tương tác giúp thu hút vốn đầu tư nước ngoài FDI trực tuyến.',
    shortDesc: 'Phát triển mô hình không gian Web 360 độ tích hợp dữ liệu quy hoạch đất đai, hạ tầng kỹ thuật giúp các nhà đầu tư nước ngoài xem thực trạng trực quan không cần di chuyển.',
    htmlContent: `
      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-6 mb-3 border-b border-slate-100 pb-2">Thúc đẩy Thu hút Vốn FDI Số hóa</h2>
      
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Khu công nghiệp Amata Long Thành (Đồng Nai) cần một công cụ trực quan hóa hiện trạng hạ tầng giao thông, điện nước, ranh giới các lô đất công nghiệp để giới thiệu tới các nhà đầu tư FDI từ Nhật Bản, Hàn Quốc và Châu Âu mà không bắt buộc họ phải sang khảo sát trực tiếp.
      </p>

      <div class="my-6 rounded-[10px] overflow-hidden border border-slate-200 shadow-2xs">
        <img src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80" alt="Toàn cảnh Web360 KCN Amata Long Thành" class="w-full h-auto object-cover max-h-[420px]" />
        <p class="text-xs text-slate-500 italic p-2 bg-slate-50 text-center border-t border-slate-100">Hình ảnh Web 360 độ góc nhìn từ trên cao tích hợp các điểm tương tác thông tin quy hoạch</p>
      </div>

      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-8 mb-3 border-b border-slate-100 pb-2">Tính năng Tương tác Thông minh</h2>

      <ul class="list-disc pl-5 text-slate-700 text-xs sm:text-sm space-y-2 mb-6">
        <li>Chụp toàn cảnh 360 độ bằng UAV độ phân giải 8K, tích hợp mô hình 3D phối cảnh nhà xưởng tương lai.</li>
        <li>Tích hợp dữ liệu chi tiết từng lô đất: Diện tích, mật độ xây dựng, trạng thái sẵn sàng cho thuê, hạ tầng cấp thoát nước.</li>
        <li>Chạy mượt mà trực tiếp trên mọi trình duyệt web (Chrome, Safari, Edge) và điện thoại thông minh.</li>
      </ul>

      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-8 mb-3 border-b border-slate-100 pb-2">Kết quả Đạt được</h2>
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Dự án giúp KCN Amata Long Thành ký kết thành công 3 hợp đồng thuê đất quy mô lớn từ nhà đầu tư nước ngoài ngay trong năm 2023 thông qua trải nghiệm thực tế ảo trực tuyến.
      </p>
    `,
    sector: 'Hạ tầng & Đô thị',
    solution: 'Mô phỏng 3D Web360',
    customer: 'Tổng thầu Coteccons',
    location: 'Long Thành, Đồng Nai',
    time: '2023',
    img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80',
    featured: false,
    scope: [
      'Chụp ảnh không gian 360 độ trên cao bằng thiết bị chuyên dụng kết hợp render 3D phối cảnh tương lai.',
      'Tích hợp thông tin pháp lý đất đai, mật độ xây dựng, hệ thống cấp thoát nước vào từng lô đất tương tác.',
      'Tương thích mượt mà trên trình duyệt web máy tính, thiết bị di động thông minh không cần cài đặt app.'
    ],
    appliedSolutions: [
      'Giải pháp Web 360 tương tác thông minh của CIC',
      'Nền tảng lưu trữ đám mây tốc độ cao'
    ],
    results: [
      'Hỗ trợ chốt thành công 3 giao dịch thuê đất quy mô lớn từ nhà đầu tư Nhật Bản và Hàn Quốc qua mạng.',
      'Nâng tầm hình ảnh chuyên nghiệp số hóa của Khu công nghiệp trên trường quốc tế.',
      'Giảm thiểu chi phí in ấn tài liệu quảng cáo quy hoạch bằng giấy truyền thống.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80'
    ],
    relatedLinks: [
      { label: 'Dịch vụ Web 360 tương tác thông minh', view: 'services', id: 'web-360-tuong-tac-thong-minh' }
    ]
  },
  {
    id: 'tram-quan-trac-mui-ke-ga',
    name: 'Cung Cấp Thiết Bị Và Lắp Đặt Trạm Quan Trắc Hải Văn - Thủy Văn Tự Động Kê Gà',
    tagline: 'Hệ thống cảm biến đo sóng, triều ký tự động truyền dữ liệu vệ tinh về đất liền liên tục 24/7.',
    shortDesc: 'Phục vụ công tác dự báo bão, sạt lở bờ biển và tính toán phương án xây dựng đê chắn sóng cảng cá Bình Thuận.',
    htmlContent: `
      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-6 mb-3 border-b border-slate-100 pb-2">Khảo sát & Lắp đặt Thiết bị Biển khơi</h2>
      
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Vùng biển Mũi Kê Gà (Bình Thuận) có dòng chảy và sóng biển phức tạp. CIC triển khai cung cấp và lắp đặt thiết bị đo triều cường không tiếp xúc Radar, cảm biến đo độ cao sóng biển và tích hợp kết nối vệ tinh Iridium liên tục 24/7.
      </p>

      <div class="my-6 rounded-[10px] overflow-hidden border border-slate-200 shadow-2xs">
        <img src="https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&q=80" alt="Quan trắc hải văn biển Kê Gà" class="w-full h-auto object-cover max-h-[420px]" />
        <p class="text-xs text-slate-500 italic p-2 bg-slate-50 text-center border-t border-slate-100">Lắp đặt cụm cảm biến đo sóng và triều ký tự động tại khu vực Kê Gà</p>
      </div>

      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-8 mb-3 border-b border-slate-100 pb-2">Khám phá Dưới nước bằng Robot FIFISH V6 EXPERT</h2>
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Sử dụng Robot khảo sát dưới nước FIFISH V6 EXPERT lặn sâu kiểm tra móng bệ trạm quan trắc, chụp ảnh 4K kiểm tra hiện trạng chân móng định kỳ mà không cần thợ lặn mạo hiểm xuống vùng nước xiết.
      </p>

      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-8 mb-3 border-b border-slate-100 pb-2">Kết quả</h2>
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Trạm quan trắc vận hành ổn định qua 2 cơn bão lớn năm 2023, truyền dữ liệu chuẩn xác về Ban chỉ huy PCTT tỉnh Bình Thuận, phục vụ đắc lực công tác cảnh báo bão và thiết kế đê chắn sóng.
      </p>
    `,
    sector: 'Môi trường & Thiên tai',
    solution: 'Quản lý CDE',
    customer: 'Tổng Công ty Tư vấn Thiết kế GTVT (TEDI)',
    location: 'Mũi Kê Gà, Bình Thuận',
    time: '2022',
    img: 'https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&q=80',
    featured: false,
    scope: [
      'Cung cấp thiết bị robot đo trắc địa dưới nước FIFISH kiểm tra bệ móng trạm quan trắc.',
      'Lắp đặt cảm biến radar đo triều cường sóng biển không tiếp xúc.',
      'Thiết lập module kết nối vệ tinh Iridium bảo đảm thông tin thông suốt ngay cả khi mất sóng di động.'
    ],
    appliedSolutions: [
      'Thiết bị đo tự động hãng Instantel',
      'Robot kiểm tra dưới nước FIFISH V6 EXPERT'
    ],
    results: [
      'Vận hành trạm ổn định vượt qua 2 cơn bão lớn năm 2023 cung cấp dữ liệu kịp thời cho Ban chỉ huy PCTT.',
      'Độ sai lệch số đo triều cường dưới 1cm, được cơ quan khí tượng hải văn quốc gia kiểm định chuẩn xác.',
      'Robot FIFISH giúp thợ lặn giảm 90% tần suất kiểm tra chân đế dưới đáy biển sâu nguy hiểm.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&q=80'
    ],
    relatedLinks: [
      { label: 'Robot khám phá FIFISH V6 EXPERT', view: 'products', id: 8 }
    ]
  },
  {
    id: 'ham-duong-bo-deo-ca-pro',
    name: 'Giải Pháp Phần Mềm Bản Quyền Thiết Kế Hầm Đường Bộ Đèo Cả',
    tagline: 'Cung cấp hệ sinh thái phần mềm chính hãng cùng đội ngũ hỗ trợ kỹ thuật trực tiếp 24/7.',
    shortDesc: 'Bàn giao, tối ưu hóa quy trình tính toán địa chất đá yếu phức tạp bằng phần mềm bản quyền kết cấu và mô phỏng hầm hở tiên tiến.',
    htmlContent: `
      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-6 mb-3 border-b border-slate-100 pb-2">Bối cảnh Dự án Hầm Đường bộ Đèo Cả</h2>
      
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Tuyến hầm Đèo Cả nối liền hai tỉnh Phú Yên và Khánh Hòa là một trong những dự án hầm đường bộ xuyên núi quy mô nhất Việt Nam. Địa chất đá nứt nẻ phức tạp đòi hỏi các công cụ mô phỏng 3D phần tử hữu hạn cực kỳ chính xác để tính toán vỏ hầm và neo gia cường.
      </p>

      <div class="my-6 rounded-[10px] overflow-hidden border border-slate-200 shadow-2xs">
        <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80" alt="Hầm đường bộ Đèo Cả" class="w-full h-auto object-cover max-h-[420px]" />
        <p class="text-xs text-slate-500 italic p-2 bg-slate-50 text-center border-t border-slate-100">Thiết kế hầm xuyên núi Đèo Cả áp dụng các công cụ tính toán địa chất đá Plaxis 3D</p>
      </div>

      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-8 mb-3 border-b border-slate-100 pb-2">Chuyển giao Công nghệ & Đào tạo</h2>
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        CIC không chỉ bàn giao bản quyền phần mềm sạch chính hãng mà còn thực hiện đào tạo chuyển giao công nghệ trực tiếp cho 30 kỹ sư thiết kế cốt lõi của Tập đoàn Đèo Cả, tích hợp tiêu chuẩn thiết kế hầm Việt Nam TCVN vào hệ thống phần mềm.
      </p>

      <h2 class="text-lg font-bold text-slate-950 uppercase tracking-tight mt-8 mb-3 border-b border-slate-100 pb-2">Kết quả</h2>
      <p class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
        Giảm thời gian mô hình hóa cấu trúc hầm từ 3 tuần xuống còn 4 ngày, đồng bộ toàn bộ bản vẽ thiết kế 2D/3D trên phần mềm enjiCAD, đảm bảo tiến độ thông hầm an toàn tuyệt đối.
      </p>
    `,
    sector: 'Hạ tầng giao thông',
    solution: 'enjiCAD thay thế',
    customer: 'Tập đoàn Đèo Cả',
    location: 'Phú Yên - Khánh Hòa',
    time: '2019 - 2021',
    img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80',
    featured: false,
    scope: [
      'Cung cấp bản quyền phần mềm phân tích địa chất hầm Plaxis và Bentley OpenTunnel.',
      'Đào tạo chuyển giao công nghệ cho hơn 30 kỹ sư thiết kế cốt lõi của tập đoàn Đèo Cả.',
      'Hỗ trợ tích hợp tiêu chuẩn thiết kế Việt Nam vào cấu hình tính toán.'
    ],
    appliedSolutions: [
      'Bentley OpenTunnel Designer',
      'enjiCAD 2D/3D bản quyền vĩnh viễn',
      'Plaxis 3D'
    ],
    results: [
      'Đảm bảo 100% bản quyền phần mềm sạch không gặp rủi ro pháp lý hay mã độc gián đoạn thiết kế.',
      'Giảm thiểu thời gian dựng mô hình hầm từ 3 tuần xuống còn 4 ngày.',
      'Giải quyết triệt để vấn đề đồng bộ bản vẽ giữa phần mềm thiết kế hầm và các bộ phận kiến trúc cảnh quan.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80'
    ],
    relatedLinks: [
      { label: 'Phần mềm enjiCAD bản quyền Việt', view: 'products', id: 1 }
    ]
  }
];
