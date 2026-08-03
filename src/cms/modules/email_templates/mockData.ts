import { EmailTemplate } from './types';

export const mockEmailTemplates: EmailTemplate[] = [
  {
    id: 'tpl_001',
    name: 'Thông báo xác nhận Yêu cầu tư vấn & Báo giá phần mềm',
    types: 'quote_registration',
    products: ['CSI ETABS Ultimate v21', 'CSI SAP2000 Advanced v25'],
    content: `<p>Kính gửi <strong>{customer_name}</strong>,</p>
<p>Cảm ơn Quý công ty <strong>{company_name}</strong> đã quan tâm và gửi yêu cầu tư vấn báo giá bản quyền sản phẩm <strong>{product_name}</strong> tại CIC Technology.</p>
<p>Chuyên viên tư vấn giải pháp của chúng tôi đã ghi nhận thông tin và sẽ trực tiếp liên hệ lại với Quý khách trong vòng 24 giờ làm việc để cung cấp thông tin chi tiết về gói bản quyền & ưu đãi phù hợp nhất.</p>
<blockquote class="border-l-4 border-orange-500 pl-4 py-1 italic text-slate-600 dark:text-slate-300">
  Hotline hỗ trợ nhanh: 024.3822.9988 | Email: contact@cic.com.vn
</blockquote>
<p>Trân trọng cảm ơn,<br/><strong>Đội ngũ Kinh doanh & Phát triển Giải pháp CIC Technology</strong></p>`,
    lienhe_kd: `Gửi thông tin đơn báo giá mới đến Phòng Kinh doanh: Khách hàng {customer_name} ({customer_email} - {customer_phone}) yêu cầu tư vấn gói Ultimate cho sản phẩm {product_name}.`,
    lienhe_kt: `Gửi thông tin đến Phòng Kỹ thuật: Khách hàng cần hỗ trợ tư vấn thông số máy trạm khuyến nghị và khả năng tương thích với file ETABS v20 cũ.`,
    lienhe_kdmb: `Phụ trách kinh doanh khu vực Miền Bắc: Giao chuyên viên Nguyễn Văn Nam phụ trách theo dõi và lập báo giá chính thức trong ngày.`,
    lienhe_kdmn: `Phụ trách kinh doanh khu vực Miền Nam: Chuyển dữ liệu thông tin khách hàng vào cơ sở dữ liệu CRM để chăm sóc định kỳ.`,
    published: true,
    ordering: 1,
    created_time: '2026-07-25 10:15:00',
    updated_time: '2026-07-28 16:20:00',
  },
  {
    id: 'tpl_002',
    name: 'Thư xác nhận đăng ký tham dự Hội thảo BIM & Hạ tầng số 2026',
    types: 'event_registration',
    products: ['EnjiCAD Network Enterprise', 'Dự toán ESCON Professional'],
    content: `<p>Kính gửi Quý đại biểu <strong>{participant_name}</strong>,</p>
<p>Ban Tổ chức xin chân thành cảm ơn Quý vị đã đăng ký tham dự Hội thảo Chuyên đề: <strong>"Ứng dụng BIM & Hạ tầng số trong Quản lý Dự án Xây dựng 2026"</strong> do Công ty CIC hợp tác cùng Bộ Xây Dựng tổ chức.</p>
<p><strong>Thông tin chi tiết chương trình:</strong></p>
<ul>
  <li><strong>Thời gian:</strong> 08:30 - 12:00, Thứ Sáu ngày 15/08/2026</li>
  <li><strong>Địa điểm:</strong> Hội trường tầng 3, Trung tâm Hội nghị Quốc gia, Nam Từ Liêm, Hà Nội.</li>
  <li><strong>Mã vé điện tử check-in:</strong> <span class="text-orange-600 font-bold">{ticket_code}</span></li>
</ul>
<p>Vui lòng xuất trình email này hoặc mã QR kèm theo tại quầy đón tiếp để nhận thẻ đeo và tài liệu hội thảo.</p>
<p>Trân trọng,<br/><strong>Ban Tổ chức Hội thảo CIC Technology</strong></p>`,
    lienhe_kd: `Phòng Kinh doanh: Theo dõi danh sách đại biểu đăng ký tham dự để chuẩn bị catalog và quà tặng lưu niệm tại sự kiện.`,
    lienhe_kt: `Phòng Kỹ thuật: Chuẩn bị 05 máy tính trải nghiệm thực tế phần mềm EnjiCAD v2.5 và ESCON 2026 tại khu vực Demo.`,
    lienhe_kdmb: `KD Miền Bắc: Phụ trách đón tiếp và hướng dẫn vị trí chỗ ngồi cho đại biểu các Sở Xây dựng và Ban QLDA khu vực phía Bắc.`,
    lienhe_kdmn: `KD Miền Nam: Gửi đường dẫn xem phát sóng trực tiếp (Livestream) và bộ tài liệu số cho các đại biểu không thể tới tham dự trực tiếp.`,
    published: true,
    ordering: 2,
    created_time: '2026-07-28 14:30:00',
    updated_time: '2026-07-30 09:10:00',
  },
];
