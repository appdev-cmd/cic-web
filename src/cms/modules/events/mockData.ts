import { EventItem, RelatedProductItem } from './types';

export const mockEventProducts: RelatedProductItem[] = [
  {
    id: 'prod_sap2000',
    name: 'Phần mềm Phân tích Kết cấu CIC-SAP2000 v25',
    code: 'SAP2000-V25',
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'prod_etabs',
    name: 'Phần mềm Thiết kế Nhà cao tầng CIC-ETABS v21',
    code: 'ETABS-V21',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'prod_cubicost',
    name: 'Phần mềm Dự toán & Bóc tách Khối lượng Cubicost',
    code: 'CUBICOST-TAS',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&auto=format&fit=crop&q=80',
  },
];

export const mockEvents: EventItem[] = [
  {
    id: 'ev_smartport_2026',
    title: 'Hội thảo: “Đột phá ứng dụng AI trong vận hành cảng biển Việt Nam thập kỷ tới”',
    alias: 'dot-pha-ung-dung-ai-trong-van-hanh-cang-bien-viet-nam',
    summary: 'CIC phối hợp cùng ERIC C&C – Hàn Quốc tổ chức hội thảo trực tuyến chia sẻ xu hướng Smart Port, Digital Twin, AI và TOS trong vận hành cảng biển.',
    content: `<p style="text-align: center;"><img alt="Đột phá ứng dụng AI trong vận hành cảng biển Việt Nam" src="/upload_images/images/2026/STC/D%E1%BB%99t_pha_%E1%BB%A9ng_d%E1%BB%A5ng_AI_trong_v%E1%BA%ADn_hanh_c%E1%BA%A3ng_bi%E1%BB%83n_(1).png" style="width: 700px; height: 394px;" /></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Nhằm chia sẻ những xu hướng và giải pháp tiên tiến trong phát triển cảng thông minh, <strong>Công ty Cổ phần Công nghệ và Tư vấn CIC</strong> phối hợp cùng <strong>ERIC C&amp;C – Hàn Quốc</strong> tổ chức hội thảo trực tuyến với chủ đề:&nbsp;<strong>“Đột phá ứng dụng AI trong vận hành cảng biển Việt Nam thập kỷ tới”</strong></span></span></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Hội thảo là cơ hội để các cơ quan quản lý, chủ đầu tư và doanh nghiệp khai thác cảng cập nhật kinh nghiệm triển khai <strong>Smart Port</strong> trên thế giới; đồng thời tìm hiểu khả năng ứng dụng <strong>Digital Twin, AI và Terminal Operating System – TOS</strong> trong giám sát, mô phỏng và tối ưu hoạt động khai thác cảng biển.</span></span></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tại chương trình, <strong>Giám đốc kỹ thuật – Geon Lee&nbsp;</strong>và&nbsp;<strong>Chuyên gia kỹ thuật&nbsp;–&nbsp;</strong><strong>TS.&nbsp;Jun-Hee Cho</strong> của <strong>ERIC C&amp;C</strong> sẽ trực tiếp chia sẻ kinh nghiệm thực tiễn, các bài toán ứng dụng công nghệ và lộ trình triển khai phù hợp với điều kiện vận hành của các cảng biển tại Việt Nam.</span></span></p>

<h2><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Về ERIC C&amp;C – Hàn Quốc</span></span></strong></h2>

<p style="text-align: center;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><img alt="eric-c-c-smart-port" src="/upload_images/images/2026/STC/smartport_main_image-min.png" style="width: 700px; height: 350px;" /></span></span></strong></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>ERIC C&amp;C </strong>là doanh nghiệp công nghệ Hàn Quốc cung cấp các giải pháp Smart Port, hướng tới nâng cao hiệu suất khai thác, an toàn vận hành và năng suất tại các cảng biển.</span></span></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Các giải pháp của hãng tích hợp TOS, hệ thống điều khiển thiết bị, IoT, AI, dữ liệu lớn, giám sát thời gian thực và điều khiển từ xa, có khả năng tùy chỉnh theo nhiều mô hình cảng khác nhau. ERIC C&amp;C đã tham gia triển khai giải pháp tại một số cảng và terminal tiêu biểu như Cảng container tự động Qinzhou, Dongwon Global Terminal và BNCT – Cảng mới Busan.</span></span></p>

<p style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Thông qua các giải pháp này, ERIC C&amp;C tập trung vào bốn giá trị chính: <strong>nâng cao hiệu quả khai thác, tăng cường an toàn, hỗ trợ vận hành thông minh</strong> và <strong>mở rộng linh hoạt theo hạ tầng của từng cảng.</strong></span></span></p>

<h2 style="text-align: center;"><img alt="Giải pháp Smart Port ERIC C&C" src="/upload_images/images/2026/STC/Solution__(2).jpg" style="width: 700px; height: 394px;" /></h2>

<h2 style="text-align: justify;"><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Thông tin sự kiện</span></span></strong></h2>

<ul>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Thời gian:</strong> 08h30–10h00, Thứ Tư, ngày 19/08/2026</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Hình thức:</strong> Trực tuyến qua Zoom</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Chi phí tham dự:</strong> Miễn phí</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Link đăng ký:</strong>&nbsp;<a href="https://docs.google.com/forms/d/e/1FAIpQLSct1dkcn4KjwwxiEnTdc267C1ubcmkvbD75OqiLMT4xDGGH4g/viewform" target="_blank" rel="noopener noreferrer"><strong>Tại đây</strong></a></span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Diễn giả:</strong></span></span>
	<ul>
		<li><em><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Giám đốc kỹ thuật – Geon Lee, ERIC C&amp;C</span></span></em></li>
		<li><em><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Chuyên gia kỹ thuật – TS.&nbsp;Jun-Hee Cho,&nbsp;ERIC C&amp;C</span></span></em></li>
	</ul>
	</li>
</ul>

<h2 style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong>Nội dung chương trình</strong></span></span></h2>

<ul>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Cập nhật xu hướng chuyển đổi số và phát triển Smart Port trên thế giới;</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Ứng dụng Digital Twin kết hợp TOS trong xây dựng bản sao số, giám sát và mô phỏng vận hành cảng;</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Ứng dụng AI trong tối ưu bãi container, cầu bến, thiết bị xếp dỡ và luồng phương tiện;</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Giải pháp giám sát an toàn, cảnh báo va chạm và khu vực nguy hiểm;</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Khả năng tích hợp với TOS, STS, RTG/RMG, GPS/GNSS, IoT, CCTV, API, MQTT và hệ thống dữ liệu hiện có;</span></span></li>
	<li style="text-align: justify;"><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Lộ trình từ khảo sát, tư vấn, thử nghiệm PoC/Pilot đến triển khai trên quy mô toàn cảng.</span></span></li>
</ul>

<p style="text-align: justify;"><em><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">CIC trân trọng kính mời Quý Khách hàng, Quý Đối tác đăng ký tham dự để trao đổi trực tiếp với chuyên gia và tìm hiểu các giải pháp công nghệ phù hợp với nhu cầu thực tế của đơn vị.</span></span></em></p>

<p><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Mọi thắc mắc về thông tin hội thảo vui lòng liên hệ Ban tổ chức:</span></span></strong></p>

<p><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Công ty Cổ phần Công nghệ và Tư vấn CIC</span></span></strong></p>

<p><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Trụ sở chính:</span></span></strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"> Tầng 4, VG Building, Số 235 Nguyễn Trãi, Hà Nội</span></span></p>

<p><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Tel: &nbsp;</span></span></strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;"><strong><em>036 575 6854</em></strong> (Ms. Huyen)</span></span></p>

<p><strong><span style="font-size:18px;"><span style="font-family:Times New Roman,Times,serif;">Email: <a href="mailto:huyentran@cic.com.vn">huyentran@cic.com.vn</a></span></span></strong></p>`,
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80',
    time_event: '2026-08-19T08:30',
    end_time: '2026-08-19T10:00',
    place: 'Trực tuyến qua Zoom - CIC Tech & ERIC C&C',
    specific_time: '08:30 - 10:00, Thứ Tư, ngày 19/08/2026',
    chu_de: 'AI & Smart Port Operations Vietnam 2026-2036',
    link_dangky: 'https://docs.google.com/forms/d/e/1FAIpQLSct1dkcn4KjwwxiEnTdc267C1ubcmkvbD75OqiLMT4xDGGH4g/viewform',
    editorial_status: 'published',
    event_related: ['ev_1001'],
    news_related: ['news_1001'],
    products_related: ['prod_sap2000'],
    is_hot: true,
    show_in_home: true,
    published: true,
    ordering: 1,
    seo_title: 'Hội thảo Đột phá ứng dụng AI trong vận hành cảng biển Việt Nam - CIC & ERIC C&C',
    seo_keyword: 'Smart Port, AI Port, ERIC CC, Digital Twin, TOS, Cang bien thong minh, CIC Tech',
    seo_description: 'Hội thảo trực tuyến do CIC và ERIC C&C Hàn Quốc tổ chức về giải pháp Smart Port, AI, Digital Twin và TOS trong vận hành cảng biển Việt Nam.',
    created_by: 'Nguyễn Văn Minh (Editor)',
    created_time: '2026-08-01 08:30:00',
    updated_time: '2026-08-01 08:30:00',
  },
  {
    id: 'ev_1001',
    title: 'Hội thảo Chuyển đổi số & Ứng dụng Giải pháp Mô hình hóa BIM trong Xây dựng Đô thị 2026',
    alias: 'hoi-thao-chuyen-doi-so-va-ung-dung-mo-hinh-bim-2026',
    summary: 'Sự kiện thường niên lớn nhất của CIC quy tụ hơn 500 chuyên gia, kiến trúc sư và đại diện Ban Quản lý Dự án chia sẻ lộ trình áp dụng BIM bắt buộc.',
    content: `<p>Nhằm đáp ứng lộ trình áp dụng Mô hình thông tin công trình (BIM) bắt buộc cho các dự án đầu tư xây dựng công theo Nghị định của Chính phủ, <strong>Công ty Cổ phần Công nghệ và Tư vấn CIC</strong> phối hợp cùng Hiệp hội Xây dựng Việt Nam tổ chức Diễn đàn Chuyển đổi số 2026.</p><h3>Nội dung chương trình chi tiết:</h3><ul><li><strong>08:00 - 08:30:</strong> Đón tiếp đại biểu và đăng ký tham dự.</li><li><strong>08:30 - 09:30:</strong> Tham luận: Lộ trình triển khai CDE & BIM trong dự án hạ tầng giao thông trọng điểm.</li><li><strong>09:30 - 10:45:</strong> Demo thực tế giải pháp CIC-SAP2000 v25 & Cubicost TAS/TRB.</li><li><strong>10:45 - 11:45:</strong> Tọa đàm Q&A cùng đại diện Bộ Xây dựng và các chuyên gia hàng đầu.</li></ul><p>Quý đối tác và khách hàng tham dự sẽ nhận ngay tài liệu hướng dẫn chuẩn và voucher ưu đãi 20% khi mua bản quyền phần mềm CIC.</p>`,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    time_event: '2026-08-20T08:00',
    end_time: '2026-08-20T17:00',
    place: 'Trung tâm Hội nghị Quốc gia, Số 57 Phạm Hùng, Quận Nam Từ Liêm, Thành phố Hà Nội',
    specific_time: '08:00 - 17:00 ngày 20/08/2026',
    chu_de: 'BIM & Digital Transformation in Construction 2026',
    link_dangky: 'https://cic.com.vn/su-kien/dang-ky-hoi-thao-bim-2026',
    editorial_status: 'published',
    event_related: ['ev_1002'],
    news_related: ['news_1001', 'news_1002'],
    products_related: ['prod_sap2000', 'prod_cubicost'],
    is_hot: true,
    show_in_home: true,
    published: true,
    ordering: 1,
    seo_title: 'Hội thảo Chuyển đổi số & BIM 2026 - Công ty CIC Technology',
    seo_keyword: 'Hoi thao BIM 2026, Chuyen doi so xay dung, CIC conference, SAP2000 v25',
    seo_description: 'Tham gia Diễn đàn Chuyển đổi số và Ứng dụng BIM 2026 tại Hà Nội do CIC tổ chức với hơn 500 chuyên gia.',
    created_by: 'Nguyễn Văn Minh (Editor)',
    created_time: '2026-07-28 09:30:00',
    updated_time: '2026-07-29 14:15:00',
    activity_logs: [
      {
        id: 'log_ev_1',
        user: 'Lê Hoàng Nam',
        role: 'Content Manager',
        action: 'Xuất bản sự kiện & Đặt lịch quảng bá',
        previous_editorial_status: 'draft',
        new_editorial_status: 'published',
        timestamp: '2026-07-29 14:15:00',
        note: 'Kiểm tra thông tin địa điểm và danh sách diễn giả hoàn tất.'
      },
      {
        id: 'log_ev_2',
        user: 'Nguyễn Văn Minh',
        role: 'Editor',
        action: 'Tạo mới bản nháp sự kiện',
        previous_editorial_status: 'draft',
        new_editorial_status: 'draft',
        timestamp: '2026-07-28 09:30:00',
        note: 'Đã cập nhật nội dung hội thảo BIM 2026.'
      }
    ]
  },
  {
    id: 'ev_1002',
    title: 'Khóa Đào tạo Chuyên sâu Phân tích Kết cấu Phi tuyến với CIC-SAP2000 & ETABS v21',
    alias: 'khoa-dao-tao-chuyen-sau-phan-tich-ket-cau-phi-tuyen-sap2000-etabs',
    summary: 'Chương trình huấn luyện kỹ sư kết cấu thực hành giải bài toán động lực học, chịu tải trọng động đất và xuất kết quả thuyết minh đạt chuẩn TCVN.',
    content: `<p>Khóa đào tạo 3 ngày được giảng dạy trực tiếp bởi các Chuyên gia Kỹ thuật Kết cấu của CIC với hơn 15 năm kinh nghiệm thực chiến tại các dự án nhà cao tầng và cầu vượt biển.</p><h3>Đối tượng tham gia:</h3><p>Kỹ sư thiết kế kết cấu, chủ trì bộ môn, giảng viên các trường đại học khối kỹ thuật xây dựng.</p>`,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    time_event: '2026-09-05T08:30',
    end_time: '2026-09-07T16:30',
    place: 'Phòng Lab Kỹ thuật 402, Tòa nhà CIC Building, Số 37 Lê Thanh Nghị, Quận Hai Bà Trưng, Hà Nội',
    specific_time: '08:30 - 16:30 các ngày thứ 6, thứ 7 và Chủ Nhật',
    chu_de: 'Structural Nonlinear Analysis Training',
    link_dangky: 'https://cic.com.vn/dao-tao/khoa-hoc-sap2000-etabs-2026',
    editorial_status: 'published',
    event_related: ['ev_1001'],
    news_related: ['news_1001'],
    products_related: ['prod_sap2000', 'prod_etabs'],
    is_hot: false,
    show_in_home: true,
    published: true,
    ordering: 2,
    seo_title: 'Khóa đào tạo tính toán kết cấu phi tuyến SAP2000 & ETABS - CIC',
    seo_keyword: 'dao tao SAP2000, ETABS v21, ky su ket cau, TCVN 5574',
    seo_description: 'Khóa huấn luyện chuyên sâu thực hành phân tích kết cấu công trình chịu tải trọng động đất cùng chuyên gia CIC.',
    created_by: 'Nguyễn Văn Minh (Editor)',
    created_time: '2026-07-25 11:20:00',
    activity_logs: [
      {
        id: 'log_ev_3',
        user: 'Lê Hoàng Nam',
        role: 'Content Manager',
        action: 'Xuất bản khóa đào tạo',
        previous_editorial_status: 'draft',
        new_editorial_status: 'published',
        timestamp: '2026-07-25 11:20:00',
      }
    ]
  },
  {
    id: 'ev_1003',
    title: 'Webinar Trực tuyến: Tối ưu hóa Khối lượng và Dự toán Công trình Xây dựng với Cubicost',
    alias: 'webinar-truc-tuyen-toi-uu-hoa-khoi-luong-du-toan-cubicost',
    summary: 'Buổi chia sẻ trực tuyến qua Zoom hướng dẫn tự động hóa 80% thời gian bóc tách khối lượng bê tông, cốt thép và hoàn thiện từ mô hình 3D.',
    content: `<p>Bóc tách khối lượng luôn là khâu tốn nhiều thời gian và dễ phát sinh sai sót trong công tác lập dự toán. Webinar trực tuyến này sẽ trình bày giải pháp giải quyết triệt để bài toán này.</p>`,
    image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&auto=format&fit=crop&q=80',
    time_event: '2026-09-15T14:00',
    end_time: '2026-09-15T16:30',
    place: 'Trực tuyến qua Zoom Meeting & LiveStream Fanpage CIC Technology',
    specific_time: '14:00 - 16:30 Chiều Thứ Ba',
    chu_de: 'Automated Quantity Takeoff with Cubicost',
    link_dangky: 'https://zoom.us/webinar/register/cic-cubicost-2026',
    editorial_status: 'published',
    event_related: [],
    news_related: [],
    products_related: ['prod_cubicost'],
    is_hot: true,
    show_in_home: false,
    published: true,
    ordering: 3,
    seo_title: 'Webinar Tự động hóa bóc tách khối lượng công trình Cubicost',
    seo_keyword: 'Webinar Cubicost, boc tach khoi luong, du toan xay dung, CIC Zoom',
    seo_description: 'Đăng ký tham dự Webinar miễn phí tự động hóa bóc tách khối lượng bê tông cốt thép với Cubicost.',
    created_by: 'Trần Thị Thu (Marketing)',
    created_time: '2026-07-15 16:45:00',
    activity_logs: [
      {
        id: 'log_ev_4',
        user: 'Trần Thị Thu',
        role: 'Marketing',
        action: 'Tạo mới Webinar',
        previous_editorial_status: 'draft',
        new_editorial_status: 'published',
        timestamp: '2026-07-15 16:45:00',
      }
    ]
  },
];
