/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DetailedProject {
  id: string;
  name: string;
  tagline: string;
  shortDesc: string;
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
