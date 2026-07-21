import { EventItem } from '../types';

export const eventsData: EventItem[] = [
  {
    id: 'bim-digital-twins-2026',
    title: 'Hội thảo: Ứng dụng BIM & Digital Twins trong Quản lý Vận hành Đô thị thông minh',
    shortDesc: 'Hội thảo chia sẻ giải pháp công nghệ tiên phong của CIC kết hợp cùng Bentley Systems giúp tối ưu hóa chi phí vận hành đô thị và hạ tầng giao thông quy mô lớn.',
    longDesc: 'Trong bối cảnh đô thị hóa diễn ra mạnh mẽ, việc tối ưu hóa quản lý và vận hành hạ tầng kỹ thuật trở thành bài toán cấp thiết đối với mọi chính quyền đô thị và doanh nghiệp bất động sản. Mô hình thông tin công trình (BIM) kết hợp cùng công nghệ bản sao số (Digital Twins) đang tạo nên một cuộc cách mạng thực sự, cho phép số hóa toàn diện và giám sát thời gian thực các công trình xây dựng.\n\nHội thảo chuyên đề do CIC tổ chức phối hợp cùng đối tác chiến lược Bentley Systems sẽ mang đến cái nhìn toàn cảnh về xu hướng Digital Twins toàn cầu, giới thiệu các giải pháp đột phá giúp cắt giảm tới 25% chi phí bảo dưỡng vận hành, tối ưu hóa mức tiêu thụ năng lượng và tăng cường khả năng ứng phó với thiên tai, sự cố.\n\nĐến với hội thảo, quý khách hàng sẽ có cơ hội được trải nghiệm trực quan các công nghệ tương tác 3D WebGIS, hệ sinh thái CDE quản lý dự án tập trung, đồng thời kết nối trực tiếp với đội ngũ chuyên gia hàng đầu trong và ngoài nước.',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
    date: '22/07/2026',
    startDate: '2026-07-22T08:30:00',
    location: 'Hội trường Lớn, Khách sạn Sheraton, 88 Đồng Khởi, Quận 1, TP. Hồ Chí Minh',
    address: '88 Đồng Khởi, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Việt Nam',
    status: 'upcoming',
    isOpenRegistration: true,
    targetAudience: [
      'Chủ đầu tư các dự án bất động sản, khu đô thị',
      'Ban Quản lý Dự án Đầu tư Xây dựng công trình hạ tầng',
      'Giám đốc Kỹ thuật, Kỹ sư trưởng, Kiến trúc sư trưởng',
      'Các đơn vị tư vấn thiết kế, nhà thầu xây dựng hạ tầng giao thông',
      'Cán bộ chuyên trách quy hoạch đô thị và quản lý tài nguyên môi trường'
    ],
    agenda: [
      {
        time: '08:30 - 09:00',
        title: 'Đón tiếp đại biểu và Teabreak giao lưu',
        description: 'Đại biểu check-in nhận tài liệu, thưởng thức trà/cà phê và tham quan gian hàng trưng bày giải pháp số của CIC.'
      },
      {
        time: '09:00 - 09:15',
        title: 'Phát biểu khai mạc từ Đại diện Lãnh đạo CIC',
        description: 'Tuyên bố lý do, chào mừng các vị khách quý và chia sẻ định hướng thúc đẩy chuyển đổi số hạ tầng của CIC.'
      },
      {
        time: '09:15 - 10:15',
        title: 'Chuyên đề: Digital Twins - Xu hướng tất yếu của đô thị thông minh thế giới',
        description: 'Phân tích các mô hình thành công tại Singapore, London; cách xây dựng dữ liệu nền tảng 3DGIS kết hợp mô hình BIM.',
        speaker: 'TS. Nguyễn Minh Triết'
      },
      {
        time: '10:15 - 11:15',
        title: 'Demo thực tế: Quản lý vận hành hạ tầng bằng giải pháp Bentley Digital Twins',
        description: 'Trải nghiệm vận hành thử nghiệm trên bản sao số của hệ thống cầu đường và mạng lưới cấp thoát nước thực tế, kiểm soát rủi ro bằng AI.',
        speaker: 'ThS. Trần Hoàng Nam'
      },
      {
        time: '11:15 - 11:45',
        title: 'Tọa đàm bàn tròn & Giải đáp thắc mắc (Q&A)',
        description: 'Trao đổi thẳng thắn giữa chuyên gia và các khách mời về rào cản chi phí, nguồn nhân lực và tính tương thích pháp lý tại Việt Nam.'
      },
      {
        time: '11:45 - 12:00',
        title: 'Bế mạc, chụp hình lưu niệm & Trao quà tri ân',
        description: 'Đại diện Ban tổ chức phát biểu cảm ơn, khảo sát lấy ý kiến phản hồi và trao các phần quà công nghệ ý nghĩa.'
      }
    ],
    speakers: [
      {
        name: 'TS. Nguyễn Minh Triết',
        role: 'Giám đốc Công nghệ (CTO)',
        company: 'CIC Tech',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80',
        bio: 'Hơn 15 năm nghiên cứu và triển khai thực tế các hệ thống thông tin địa lý GIS, mô hình BIM cho các siêu dự án đô thị tại Singapore và Việt Nam. Thành viên Hội đồng Khoa học Chuyển đổi số quốc gia.'
      },
      {
        name: 'ThS. Trần Hoàng Nam',
        role: 'Trưởng phòng Giải pháp Hạ tầng',
        company: 'Bentley Systems Việt Nam',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80',
        bio: 'Chuyên gia tư vấn chuyển đổi số cao cấp được chứng nhận toàn cầu bởi Bentley Systems. Đã hỗ trợ thành công hơn 50 doanh nghiệp xây dựng lớn tối ưu hóa quy trình quản lý dự án bằng phần mềm CDE.'
      }
    ],
    media: {
      gallery: [
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80'
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    documents: [
      {
        name: 'Brochure Tổng quan Hội thảo BIM & Digital Twins 2026.pdf',
        size: '2.4 MB',
        url: '#'
      },
      {
        name: 'Tài liệu Giải pháp Đô thị thông minh Bentley OpenCities.pdf',
        size: '4.8 MB',
        url: '#'
      }
    ]
  },
  {
    id: 'enjicad-training-2026',
    title: 'Khóa đào tạo chuyên sâu: Ứng dụng enjiCAD trong thiết kế xây dựng tiêu chuẩn Việt Nam',
    shortDesc: 'Khóa học miễn phí giúp các kỹ sư xây dựng làm chủ công cụ vẽ CAD chuyên nghiệp enjiCAD, tối ưu tốc độ triển khai bản vẽ và tự động hóa bóc tách tiên lượng.',
    longDesc: 'Nhằm hỗ trợ cộng đồng kỹ sư xây dựng tối ưu hóa chi phí bản quyền phần mềm thiết kế mà vẫn đảm bảo tính năng vẽ kỹ thuật mạnh mẽ, CIC tổ chức khóa đào tạo chuyên sâu hướng dẫn sử dụng phần mềm enjiCAD.\n\nenjiCAD là giải pháp thiết kế CAD hàng đầu hiện nay với bản quyền vĩnh viễn, giao diện tiếng Việt thân thiện và tốc độ xử lý bản vẽ 2D/3D cực nhanh. Đặc biệt, khóa học này sẽ chia sẻ bí quyết kết hợp enjiCAD cùng phần mềm stCAD để tự động hóa toàn bộ quy trình bóc tách tiên lượng dầm, cột, sàn và lập bảng dự toán xây dựng chuẩn TCVN.\n\nKhóa đào tạo hoàn toàn miễn phí, được dẫn dắt trực tiếp bởi chuyên gia đào tạo kỹ thuật có hơn 10 năm kinh nghiệm thực chiến. Học viên tham dự trực tiếp tại văn phòng CIC hoặc online qua Zoom đều được hỗ trợ cài đặt phiên bản bản quyền dùng thử và cấp chứng nhận hoàn thành khóa đào tạo.',
    img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80',
    date: '05/08/2026',
    startDate: '2026-08-05T13:30:00',
    location: 'Trung tâm Đào tạo Kỹ thuật CIC, 37 Lê Đại Hành, Quận Hai Bà Trưng, Hà Nội',
    address: '37 Lê Đại Hành, Lê Đại Hành, Hai Bà Trưng, Hà Nội, Việt Nam',
    status: 'upcoming',
    isOpenRegistration: true,
    targetAudience: [
      'Kỹ sư xây dựng kết cấu, kỹ sư cầu đường',
      'Kiến trúc sư, nhà thiết kế kỹ thuật',
      'Kỹ sư QS/đo đạc, lập dự toán công trình',
      'Học viên, sinh viên ngành Kỹ thuật Xây dựng tại các trường Đại học'
    ],
    agenda: [
      {
        time: '13:30 - 14:00',
        title: 'Đăng ký & Nhận bộ cài đặt dùng thử bản quyền',
        description: 'Học viên ổn định vị trí, kỹ thuật viên hỗ trợ cài đặt enjiCAD bản quyền và bộ công cụ stCAD lên máy tính cá nhân.'
      },
      {
        time: '14:00 - 15:00',
        title: 'Phần 1: Làm quen giao diện và tối ưu cài đặt bản vẽ trên enjiCAD',
        description: 'Hướng dẫn thiết lập phím tắt quen thuộc, làm việc với các định dạng file DWG/DXF phức tạp, sử dụng tính năng tối ưu bộ nhớ khi mở file nặng.',
        speaker: 'KS. Lê Văn Bình'
      },
      {
        time: '15:00 - 15:30',
        title: 'Thực hành 1: Thiết kế kết cấu & Áp dụng thư viện cấu kiện TCVN',
        description: 'Học viên trực tiếp triển khai bản vẽ dầm bê tông cốt thép bằng các công cụ thông minh, chèn ghi chú kỹ thuật tự động.',
        speaker: 'KS. Lê Văn Bình'
      },
      {
        time: '15:30 - 15:45',
        title: 'Nghỉ giải lao & Thưởng thức trà chiều (Teabreak)',
        description: 'Teabreak nhẹ nhàng để học viên trao đổi, kết nối và nghỉ ngơi giữa giờ.'
      },
      {
        time: '15:45 - 16:45',
        title: 'Phần 2: Tự động hóa bóc tách tiên lượng và xuất dự toán với stCAD',
        description: 'Liên kết bản vẽ thiết kế trên enjiCAD với stCAD để tự động tính toán khối lượng sắt, bê tông dầm, xuất bảng thống kê chuẩn xác 100%.',
        speaker: 'KS. Lê Văn Bình'
      },
      {
        time: '16:45 - 17:15',
        title: 'Hỏi đáp & Trao chứng nhận tham dự khóa đào tạo',
        description: 'Giải quyết các vấn đề lỗi bản vẽ học viên gặp phải, trao tặng chứng nhận giấy và quà tặng lưu niệm từ CIC Tech.'
      }
    ],
    speakers: [
      {
        name: 'KS. Lê Văn Bình',
        role: 'Chuyên gia Kỹ thuật Phần mềm CAD/BIM',
        company: 'CIC Tech',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80',
        bio: 'Hơn 10 năm kinh nghiệm tư vấn kỹ thuật và đào tạo chuyển giao công nghệ cho các tổng công ty xây dựng lớn tại Việt Nam như Coteccons, Hoa Binh Group, CDC. Am hiểu sâu sắc hệ tiêu chuẩn kỹ thuật Việt Nam.'
      }
    ],
    media: {
      gallery: [
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80'
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    documents: [
      {
        name: 'Sách hướng dẫn sử dụng nhanh enjiCAD 2026.pdf',
        size: '5.6 MB',
        url: '#'
      },
      {
        name: 'Bản vẽ dầm cột mẫu thực hành (.dwg).zip',
        size: '8.4 MB',
        url: '#'
      }
    ]
  },
  {
    id: 'signing-ceremony-dmt-germany',
    title: 'Lễ ký kết hợp tác chiến lược giữa CIC và Tập đoàn Công nghệ DMT (Cộng hòa Liên bang Đức)',
    shortDesc: 'Sự kiện đánh dấu bước tiến quan trọng của CIC trong việc trở thành nhà phân phối độc quyền thiết bị đo địa chấn đa kênh Summit X One tại thị trường Việt Nam.',
    longDesc: 'Ngày 10 tháng 06 vừa qua, tại Trung tâm Hội nghị Quốc gia Hà Nội đã diễn ra Lễ ký kết biên bản hợp tác chiến lược (MOU) toàn diện giữa Công ty Cổ phần Công nghệ và Tư vấn CIC và Tập đoàn Công nghệ DMT GmbH & Co. KG - nhà cung cấp các dịch vụ địa chất và khai khoáng hàng đầu từ Cộng hòa Liên bang Đức.\n\nTheo nội dung thỏa thuận ký kết, CIC chính thức trở thành đơn vị nhập khẩu và phân phối độc quyền thiết bị địa chấn đa kênh thế hệ mới Summit X One tại thị trường Việt Nam, Lào và Campuchia. Đồng thời, DMT cam kết chuyển giao toàn bộ công nghệ vận hành, phần mềm xử lý dữ liệu chuyên sâu và hỗ trợ CIC đào tạo đội ngũ kỹ sư bảo dưỡng đạt chuẩn quốc tế.\n\nSự kiện ký kết này đánh dấu cột mốc 35 năm hình thành phát triển của CIC, tiếp tục khẳng định sứ mệnh đem các giải pháp phần cứng và phần mềm đo đạc tiên tiến bậc nhất thế giới về phục vụ công cuộc xây dựng hạ tầng bền vững tại Việt Nam.',
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
    date: '10/06/2026',
    startDate: '2026-06-10T09:00:00',
    location: 'Phòng VIP 3, Trung tâm Hội nghị Quốc gia, Đại lộ Thăng Long, Mễ Trì, Nam Từ Liêm, Hà Nội',
    address: 'Đại lộ Thăng Long, Mễ Trì, Nam Từ Liêm, Hà Nội, Việt Nam',
    status: 'past',
    isOpenRegistration: false,
    targetAudience: [
      'Đại diện Bộ Tài nguyên và Môi trường, Bộ Xây dựng',
      'Phóng viên báo chí, truyền hình chuyên ngành kỹ thuật xây dựng',
      'Các đối tác chiến lược và khách hàng truyền thống lâu năm của CIC',
      'Đội ngũ cán bộ quản lý cấp cao và kỹ sư nòng cốt của CIC Group'
    ],
    agenda: [
      {
        time: '09:00 - 09:30',
        title: 'Đón tiếp đại biểu cấp cao và cơ quan thông tấn báo chí',
        description: 'Đón khách, chụp hình check-in lưu niệm tại photobooth chính của buổi lễ và thưởng thức hòa tấu nhạc cụ dân tộc.'
      },
      {
        time: '09:30 - 09:45',
        title: 'Tuyên bố lý do & Giới thiệu đại biểu tham dự',
        description: 'Trình chiếu phim tư liệu ngắn giới thiệu hành trình hợp tác 3 năm qua giữa hai tập đoàn CIC và DMT.'
      },
      {
        time: '09:45 - 10:15',
        title: 'Phát biểu định hướng hợp tác lâu dài của Lãnh đạo hai Tập đoàn',
        description: 'Đại diện CIC chia sẻ về tầm quan trọng của việc làm chủ công nghệ địa chấn sâu trong khảo sát địa chất hầm và đập thủy điện; Đại diện DMT cam kết hỗ trợ tối đa kỹ thuật.'
      },
      {
        time: '10:15 - 10:30',
        title: 'Nghi thức Ký kết biên bản ghi nhớ hợp tác chiến lược (MOU)',
        description: 'Lãnh đạo hai bên tiến hành ký kết biên bản dưới sự chứng kiến của đại diện các cơ quan quản lý nhà nước.'
      },
      {
        time: '10:30 - 11:15',
        title: 'Họp báo trao đổi thông tin & Trải nghiệm thực tế thiết bị Summit X One',
        description: 'Giải đáp câu hỏi của báo chí về giá thành, tính ứng dụng tại vùng địa chất phức tạp miền Trung Việt Nam và chế độ bảo hành chuyên hãng.'
      },
      {
        time: '11:15 - 11:30',
        title: 'Tiệc rượu champagne khai xuân & Chúc mừng thành công',
        description: 'Tiệc đứng buffet nhẹ nhàng kết thúc thành công tốt đẹp lễ ký kết.'
      }
    ],
    speakers: [
      {
        name: 'TS. Nguyễn Ngọc Long',
        role: 'Chủ tịch Hội đồng Quản trị',
        company: 'CIC Group',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
        bio: 'Nhà sáng lập CIC Group với hơn 35 năm định hướng chiến lược đưa doanh nghiệp trở thành cầu nối công nghệ uy tín nhất Việt Nam trong mảng xây dựng hạ tầng, giao thông và tài nguyên.'
      },
      {
        name: 'Mr. Dieter Schmidt',
        role: 'Giám đốc Phát triển Thị trường Toàn cầu',
        company: 'DMT GmbH & Co. KG (Đức)',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80',
        bio: 'Hơn 20 năm điều hành các chương trình hợp tác quốc tế của Tập đoàn DMT Đức, chuyên gia hàng đầu châu Âu trong lĩnh vực phát triển thiết bị thăm dò khoáng sản và kỹ thuật an toàn mỏ.'
      }
    ],
    media: {
      gallery: [
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80'
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    documents: [
      {
        name: 'Thông cáo báo chí Lễ ký kết chiến lược CIC & DMT Germany.pdf',
        size: '1.2 MB',
        url: '#'
      },
      {
        name: 'Brochure giới thiệu thiết bị địa chấn đa kênh Summit X One (DMT).pdf',
        size: '3.5 MB',
        url: '#'
      }
    ]
  }
];
