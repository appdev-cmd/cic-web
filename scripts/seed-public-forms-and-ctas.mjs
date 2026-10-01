import { config } from 'dotenv';
import postgres from 'postgres';

// Auto-load .env.local and .env
config({ path: '.env.local', override: false, quiet: true });
config({ path: '.env', override: false, quiet: true });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.warn('⚠️ [SEED] DATABASE_URL is not set. Skipping Form & CTA database seeding.');
  process.exit(0);
}

const sql = postgres(DATABASE_URL, {
  max: 5,
  prepare: false,
  ssl: 'require',
  connect_timeout: 10,
});

// -----------------------------------------------------------------------------
// DEFINITION OF PUBLIC FORMS (VI & EN)
// -----------------------------------------------------------------------------
const PUBLIC_FORMS = [
  // 1. Consultation Modal / Global Popup
  {
    code: 'form_home_consultation',
    workspace: 'vi',
    is_system: true,
    admin_name: 'Biểu mẫu - Đăng ký tư vấn giải pháp',
    title: 'Đăng ký tư vấn giải pháp & phần mềm',
    description: 'Biểu mẫu tiếp nhận yêu cầu tư vấn sản phẩm, bản quyền phần mềm và giải pháp chuyển đổi số từ khách hàng.',
    submit_button_text: 'Gửi yêu cầu tư vấn',
    success_message: 'Cảm ơn bạn đã gửi yêu cầu tư vấn. Đội ngũ chuyên gia CIC sẽ liên hệ hỗ trợ trong vòng 24 giờ làm việc.',
    fields: [
      { field_key: 'name', field_type: 'text', role_type: 'customer_name', label: 'Họ và tên', placeholder: 'Nguyễn Văn A', is_required: true, is_locked: true, position: 1 },
      { field_key: 'phone', field_type: 'phone', role_type: 'phone', label: 'Số điện thoại', placeholder: '0912 345 678', is_required: true, is_locked: true, position: 2 },
      { field_key: 'email', field_type: 'email', role_type: 'email', label: 'Email liên hệ', placeholder: 'email@example.com', is_required: false, is_locked: true, position: 3 },
      {
        field_key: 'consultationNeed',
        field_type: 'select',
        role_type: 'service_interest',
        label: 'Nhu cầu tư vấn',
        is_required: true,
        is_locked: false,
        position: 4,
        options_config: [
          'Tư vấn báo giá sản phẩm & giải pháp',
          'Tải phần mềm & dùng thử',
          'Đăng ký mua bản quyền / thiết bị',
          'Tư vấn chuyển đổi số & BIM',
          'Đào tạo & Hỗ trợ kỹ thuật',
          'Nhu cầu khác',
        ],
      },
      { field_key: 'message', field_type: 'textarea', role_type: 'message', label: 'Nội dung yêu cầu chi tiết', placeholder: 'Mô tả ngắn gọn nhu cầu của bạn...', is_required: false, is_locked: false, position: 5 },
    ],
  },
  {
    code: 'form_home_consultation',
    workspace: 'en',
    is_system: true,
    admin_name: 'Form - Solution Consultation Request (EN)',
    title: 'Solution Consultation Request',
    description: 'Form for receiving software licensing, engineering products, and digital transformation consultation inquiries.',
    submit_button_text: 'Send Consultation Request',
    success_message: 'Thank you for your request. The CIC expert team will contact you within 24 working hours.',
    fields: [
      { field_key: 'name', field_type: 'text', role_type: 'customer_name', label: 'Full Name', placeholder: 'John Doe', is_required: true, is_locked: true, position: 1 },
      { field_key: 'phone', field_type: 'phone', role_type: 'phone', label: 'Phone Number', placeholder: '+84 912 345 678', is_required: true, is_locked: true, position: 2 },
      { field_key: 'email', field_type: 'email', role_type: 'email', label: 'Email Address', placeholder: 'john.doe@example.com', is_required: false, is_locked: true, position: 3 },
      {
        field_key: 'consultationNeed',
        field_type: 'select',
        role_type: 'service_interest',
        label: 'Consultation Need',
        is_required: true,
        is_locked: false,
        position: 4,
        options_config: [
          'Product & Solution Pricing Consultation',
          'Download Software & Request Trial',
          'Purchase Software License / Equipment',
          'Digital Transformation & BIM Consultation',
          'Training & Technical Support',
          'Other Inquiry',
        ],
      },
      { field_key: 'message', field_type: 'textarea', role_type: 'message', label: 'Inquiry Details', placeholder: 'Briefly describe your requirements...', is_required: false, is_locked: false, position: 5 },
    ],
  },

  // 2. Home Contact Section Form
  {
    code: 'form_home_contact',
    workspace: 'vi',
    is_system: true,
    admin_name: 'Biểu mẫu - Liên hệ Trang chủ',
    title: 'Tư vấn giải pháp trang chủ',
    description: 'Biểu mẫu liên hệ nhanh đặt tại phần chân trang chủ để khách hàng gửi nhu cầu tư vấn giải pháp số.',
    submit_button_text: 'Gửi thông tin',
    success_message: 'Cảm ơn bạn đã quan tâm. CIC sẽ liên hệ lại với bạn trong thời gian sớm nhất.',
    fields: [
      { field_key: 'fullName', field_type: 'text', role_type: 'customer_name', label: 'Họ và tên', placeholder: 'Nguyễn Văn A', is_required: true, is_locked: true, position: 1 },
      { field_key: 'phoneNumber', field_type: 'phone', role_type: 'phone', label: 'Số điện thoại', placeholder: '0912 345 678', is_required: true, is_locked: true, position: 2 },
      {
        field_key: 'interestService',
        field_type: 'select',
        role_type: 'service_interest',
        label: 'Dịch vụ quan tâm',
        is_required: true,
        is_locked: false,
        position: 3,
        options_config: [
          'Phần mềm kỹ thuật bản quyền',
          'Giải pháp BIM & Chuyển đổi số',
          'Tư vấn & Đào tạo chuyên ngành',
          'Thiết bị & Chuyển giao công nghệ',
        ],
      },
      { field_key: 'message', field_type: 'textarea', role_type: 'message', label: 'Nội dung cần tư vấn', placeholder: 'Mô tả nội dung cần tư vấn...', is_required: false, is_locked: false, position: 4 },
    ],
  },
  {
    code: 'form_home_contact',
    workspace: 'en',
    is_system: true,
    admin_name: 'Form - Home Contact (EN)',
    title: 'Home Consultation Request',
    description: 'Quick contact form located at the footer of the homepage for customer consultation requests.',
    submit_button_text: 'Submit Inquiry',
    success_message: 'Thank you for reaching out. CIC will contact you as soon as possible.',
    fields: [
      { field_key: 'fullName', field_type: 'text', role_type: 'customer_name', label: 'Full Name', placeholder: 'John Doe', is_required: true, is_locked: true, position: 1 },
      { field_key: 'phoneNumber', field_type: 'phone', role_type: 'phone', label: 'Phone Number', placeholder: '+84 912 345 678', is_required: true, is_locked: true, position: 2 },
      {
        field_key: 'interestService',
        field_type: 'select',
        role_type: 'service_interest',
        label: 'Service of Interest',
        is_required: true,
        is_locked: false,
        position: 3,
        options_config: [
          'Licensed Engineering Software',
          'BIM & Digital Transformation',
          'Consulting & Professional Training',
          'Hardware & Technology Transfer',
        ],
      },
      { field_key: 'message', field_type: 'textarea', role_type: 'message', label: 'Message', placeholder: 'Briefly describe your request...', is_required: false, is_locked: false, position: 4 },
    ],
  },

  // 3. Official Contact Form (/lien-he & /en/contact)
  {
    code: 'form_contact_request',
    workspace: 'vi',
    is_system: true,
    admin_name: 'Biểu mẫu - Liên hệ Trực tuyến',
    title: 'Gửi yêu cầu liên hệ',
    description: 'Biểu mẫu liên hệ chính thức tại trang Liên hệ của CIC Technology.',
    submit_button_text: 'Gửi tin nhắn liên hệ',
    success_message: 'Cảm ơn bạn đã liên hệ. Bộ phận tiếp nhận thông tin của CIC sẽ phản hồi sớm nhất.',
    fields: [
      { field_key: 'fullName', field_type: 'text', role_type: 'customer_name', label: 'Họ và tên', placeholder: 'Nguyễn Văn A', is_required: true, is_locked: true, position: 1 },
      { field_key: 'email', field_type: 'email', role_type: 'email', label: 'Email liên hệ', placeholder: 'email@example.com', is_required: true, is_locked: true, position: 2 },
      { field_key: 'phone', field_type: 'phone', role_type: 'phone', label: 'Số điện thoại', placeholder: '0912 345 678', is_required: true, is_locked: true, position: 3 },
      { field_key: 'subject', field_type: 'text', label: 'Tiêu đề yêu cầu', placeholder: 'Ví dụ: Tư vấn hợp tác dự án / Bản quyền phần mềm', is_required: false, is_locked: false, position: 4 },
      { field_key: 'note', field_type: 'textarea', role_type: 'message', label: 'Nội dung tin nhắn', placeholder: 'Chi tiết nội dung bạn muốn gửi tới CIC...', is_required: true, is_locked: false, position: 5 },
    ],
  },
  {
    code: 'form_contact_request',
    workspace: 'en',
    is_system: true,
    admin_name: 'Form - Online Contact (EN)',
    title: 'Send Contact Request',
    description: 'Official contact form on the CIC Technology Contact page.',
    submit_button_text: 'Send Contact Message',
    success_message: 'Thank you for contacting us. CIC team will get back to you shortly.',
    fields: [
      { field_key: 'fullName', field_type: 'text', role_type: 'customer_name', label: 'Full Name', placeholder: 'John Doe', is_required: true, is_locked: true, position: 1 },
      { field_key: 'email', field_type: 'email', role_type: 'email', label: 'Email Address', placeholder: 'john.doe@example.com', is_required: true, is_locked: true, position: 2 },
      { field_key: 'phone', field_type: 'phone', role_type: 'phone', label: 'Phone Number', placeholder: '+84 912 345 678', is_required: true, is_locked: true, position: 3 },
      { field_key: 'subject', field_type: 'text', label: 'Subject', placeholder: 'e.g. Partnership inquiry / Software licensing', is_required: false, is_locked: false, position: 4 },
      { field_key: 'note', field_type: 'textarea', role_type: 'message', label: 'Message', placeholder: 'Detailed message you would like to send...', is_required: true, is_locked: false, position: 5 },
    ],
  },

  // 4. Product Quotation Form (ProductDetailView Modal)
  {
    code: 'form_baogia_sanpham',
    workspace: 'vi',
    is_system: true,
    admin_name: 'Biểu mẫu - Báo giá Sản phẩm',
    title: 'Yêu cầu báo giá sản phẩm',
    description: 'Biểu mẫu yêu cầu cung cấp báo giá chi tiết cho các sản phẩm phần mềm và thiết bị công nghệ.',
    submit_button_text: 'Gửi yêu cầu báo giá',
    success_message: 'Yêu cầu báo giá đã được ghi nhận. Chuyên viên kinh doanh sẽ gửi báo giá chi tiết qua email/điện thoại cho bạn.',
    fields: [
      { field_key: 'name', field_type: 'text', role_type: 'customer_name', label: 'Họ và tên', placeholder: 'Nguyễn Văn A', is_required: true, is_locked: true, position: 1 },
      { field_key: 'phone', field_type: 'phone', role_type: 'phone', label: 'Số điện thoại', placeholder: '0912 345 678', is_required: true, is_locked: true, position: 2 },
      { field_key: 'email', field_type: 'email', role_type: 'email', label: 'Email nhận báo giá', placeholder: 'email@example.com', is_required: false, is_locked: true, position: 3 },
      { field_key: 'productName', field_type: 'text', label: 'Tên sản phẩm quan tâm', placeholder: 'Tên phần mềm / Thiết bị', is_required: false, is_locked: false, position: 4 },
      { field_key: 'notes', field_type: 'textarea', role_type: 'message', label: 'Ghi chú thêm', placeholder: 'Số lượng license, gói tính năng hoặc yêu cầu đặc thù...', is_required: false, is_locked: false, position: 5 },
    ],
  },
  {
    code: 'form_baogia_sanpham',
    workspace: 'en',
    is_system: true,
    admin_name: 'Form - Product Quotation (EN)',
    title: 'Product Quotation Request',
    description: 'Form for requesting pricing proposals for engineering software and hardware solutions.',
    submit_button_text: 'Request Quote',
    success_message: 'Quotation request received. Our sales specialist will send the quotation to you shortly.',
    fields: [
      { field_key: 'name', field_type: 'text', role_type: 'customer_name', label: 'Full Name', placeholder: 'John Doe', is_required: true, is_locked: true, position: 1 },
      { field_key: 'phone', field_type: 'phone', role_type: 'phone', label: 'Phone Number', placeholder: '+84 912 345 678', is_required: true, is_locked: true, position: 2 },
      { field_key: 'email', field_type: 'email', role_type: 'email', label: 'Email Address', placeholder: 'john.doe@example.com', is_required: false, is_locked: true, position: 3 },
      { field_key: 'productName', field_type: 'text', label: 'Product of Interest', placeholder: 'Software / Hardware product name', is_required: false, is_locked: false, position: 4 },
      { field_key: 'notes', field_type: 'textarea', role_type: 'message', label: 'Additional Notes', placeholder: 'Number of licenses, feature packages, or specific requirements...', is_required: false, is_locked: false, position: 5 },
    ],
  },

  // 5. Product License Purchase Form
  {
    code: 'form_dangky_mua',
    workspace: 'vi',
    is_system: false,
    admin_name: 'Biểu mẫu - Đăng ký Mua Sản phẩm',
    title: 'Đăng ký mua bản quyền sản phẩm',
    description: 'Biểu mẫu đăng ký đặt mua bản quyền phần mềm chính hãng từ các hãng công nghệ do CIC phân phối.',
    submit_button_text: 'Xác nhận đăng ký mua',
    success_message: 'Đăng ký mua hàng thành công. Bộ phận phụ trách sẽ liên hệ hoàn tất hợp đồng và kích hoạt bản quyền.',
    fields: [
      { field_key: 'name', field_type: 'text', role_type: 'customer_name', label: 'Họ và tên', placeholder: 'Nguyễn Văn A', is_required: true, is_locked: true, position: 1 },
      { field_key: 'phone', field_type: 'phone', role_type: 'phone', label: 'Số điện thoại', placeholder: '0912 345 678', is_required: true, is_locked: true, position: 2 },
      { field_key: 'email', field_type: 'email', role_type: 'email', label: 'Email liên hệ', placeholder: 'email@example.com', is_required: false, is_locked: true, position: 3 },
      { field_key: 'company', field_type: 'text', role_type: 'company', label: 'Tên đơn vị / Doanh nghiệp', placeholder: 'Công ty CP Xây dựng XYZ', is_required: false, is_locked: false, position: 4 },
      { field_key: 'notes', field_type: 'textarea', role_type: 'message', label: 'Ghi chú đơn hàng', placeholder: 'Hình thức thanh toán, thông tin xuất hóa đơn VAT...', is_required: false, is_locked: false, position: 5 },
    ],
  },
  {
    code: 'form_dangky_mua',
    workspace: 'en',
    is_system: false,
    admin_name: 'Form - Product Purchase (EN)',
    title: 'Product License Purchase Request',
    description: 'Form for purchasing official software licenses and hardware distributed by CIC.',
    submit_button_text: 'Submit Purchase Request',
    success_message: 'Purchase request submitted successfully. Our team will contact you for contract fulfillment.',
    fields: [
      { field_key: 'name', field_type: 'text', role_type: 'customer_name', label: 'Full Name', placeholder: 'John Doe', is_required: true, is_locked: true, position: 1 },
      { field_key: 'phone', field_type: 'phone', role_type: 'phone', label: 'Phone Number', placeholder: '+84 912 345 678', is_required: true, is_locked: true, position: 2 },
      { field_key: 'email', field_type: 'email', role_type: 'email', label: 'Email Address', placeholder: 'john.doe@example.com', is_required: false, is_locked: true, position: 3 },
      { field_key: 'company', field_type: 'text', role_type: 'company', label: 'Company Name', placeholder: 'XYZ Construction Corp', is_required: false, is_locked: false, position: 4 },
      { field_key: 'notes', field_type: 'textarea', role_type: 'message', label: 'Order Notes', placeholder: 'Payment terms, billing requirements...', is_required: false, is_locked: false, position: 5 },
    ],
  },

  // 6. Software Trial Download Form
  {
    code: 'form_taive_dungthu',
    workspace: 'vi',
    is_system: false,
    admin_name: 'Biểu mẫu - Tải bản dùng thử',
    title: 'Yêu cầu tải phần mềm & Dùng thử',
    description: 'Biểu mẫu đăng ký nhận bộ cài đặt và tài liệu hướng dẫn dùng thử phần mềm kỹ thuật.',
    submit_button_text: 'Tải về bản dùng thử',
    success_message: 'Link tải bộ cài và hướng dẫn kích hoạt bản quyền thử nghiệm đã được chuẩn bị.',
    fields: [
      { field_key: 'name', field_type: 'text', role_type: 'customer_name', label: 'Họ và tên', placeholder: 'Nguyễn Văn A', is_required: true, is_locked: true, position: 1 },
      { field_key: 'phone', field_type: 'phone', role_type: 'phone', label: 'Số điện thoại', placeholder: '0912 345 678', is_required: true, is_locked: true, position: 2 },
      { field_key: 'email', field_type: 'email', role_type: 'email', label: 'Email nhận link tải', placeholder: 'email@example.com', is_required: true, is_locked: true, position: 3 },
      { field_key: 'version', field_type: 'text', label: 'Phiên bản quan tâm', placeholder: 'Bản mới nhất / 64-bit', is_required: false, is_locked: false, position: 4 },
      { field_key: 'notes', field_type: 'textarea', role_type: 'message', label: 'Ghi chú hỗ trợ', placeholder: 'Yêu cầu tài liệu hướng dẫn hoặc tư vấn cài đặt...', is_required: false, is_locked: false, position: 5 },
    ],
  },
  {
    code: 'form_taive_dungthu',
    workspace: 'en',
    is_system: false,
    admin_name: 'Form - Software Trial Download (EN)',
    title: 'Software Download & Trial Request',
    description: 'Form for requesting software installer packages and evaluation trial guides.',
    submit_button_text: 'Download Trial',
    success_message: 'Download links and installation guides have been processed.',
    fields: [
      { field_key: 'name', field_type: 'text', role_type: 'customer_name', label: 'Full Name', placeholder: 'John Doe', is_required: true, is_locked: true, position: 1 },
      { field_key: 'phone', field_type: 'phone', role_type: 'phone', label: 'Phone Number', placeholder: '+84 912 345 678', is_required: true, is_locked: true, position: 2 },
      { field_key: 'email', field_type: 'email', role_type: 'email', label: 'Email for Download Link', placeholder: 'john.doe@example.com', is_required: true, is_locked: true, position: 3 },
      { field_key: 'version', field_type: 'text', label: 'Interested Version', placeholder: 'Latest Version / 64-bit', is_required: false, is_locked: false, position: 4 },
      { field_key: 'notes', field_type: 'textarea', role_type: 'message', label: 'Support Notes', placeholder: 'Technical support or installation assistance needed...', is_required: false, is_locked: false, position: 5 },
    ],
  },

  // 7. Services Consultation Form (/services)
  {
    code: 'form_tuvan_dichvu',
    workspace: 'vi',
    is_system: false,
    admin_name: 'Biểu mẫu - Tư vấn Dịch vụ BIM & Đào tạo',
    title: 'Đăng ký Tư vấn & Demo Dịch vụ',
    description: 'Biểu mẫu đăng ký tư vấn giải pháp dịch vụ chuyên ngành xây dựng, BIM, Digital Twin và đào tạo kỹ thuật.',
    submit_button_text: 'Gửi yêu cầu tư vấn dịch vụ',
    success_message: 'Yêu cầu tư vấn dịch vụ đã được gửi thành công. Đội ngũ tư vấn CIC sẽ liên hệ trong 24h làm việc.',
    fields: [
      { field_key: 'fullname', field_type: 'text', role_type: 'customer_name', label: 'Họ và tên', placeholder: 'Nguyễn Văn A', is_required: true, is_locked: true, position: 1 },
      { field_key: 'phone', field_type: 'phone', role_type: 'phone', label: 'Số điện thoại', placeholder: '0912 345 678', is_required: true, is_locked: true, position: 2 },
      { field_key: 'email', field_type: 'email', role_type: 'email', label: 'Email liên hệ', placeholder: 'email@example.com', is_required: false, is_locked: true, position: 3 },
      {
        field_key: 'service',
        field_type: 'select',
        role_type: 'service_interest',
        label: 'Dịch vụ quan tâm',
        is_required: true,
        is_locked: false,
        position: 4,
        options_config: [
          'Tư vấn BIM & Quản lý thông tin công trình',
          'Chuyển đổi số & Tích hợp hệ thống Digital Twins',
          'Đào tạo kỹ thuật chuyên ngành & Chuyển giao công nghệ',
          'Dịch vụ phân tích kết cấu & Mô phỏng công trình',
          'Khảo sát địa kỹ thuật & Thí nghiệm chuyên sâu',
        ],
      },
      { field_key: 'notes', field_type: 'textarea', role_type: 'message', label: 'Nội dung cần tư vấn', placeholder: 'Mô tả phạm vi dự án hoặc yêu cầu cụ thể...', is_required: false, is_locked: false, position: 5 },
    ],
  },
  {
    code: 'form_tuvan_dichvu',
    workspace: 'en',
    is_system: false,
    admin_name: 'Form - Service Consultation (EN)',
    title: 'Service Consultation & Demo Request',
    description: 'Consultation registration form for BIM services, Digital Twin integration, and professional training.',
    submit_button_text: 'Submit Service Inquiry',
    success_message: 'Service inquiry submitted successfully. The CIC consulting team will reach out within 24 working hours.',
    fields: [
      { field_key: 'fullname', field_type: 'text', role_type: 'customer_name', label: 'Full Name', placeholder: 'John Doe', is_required: true, is_locked: true, position: 1 },
      { field_key: 'phone', field_type: 'phone', role_type: 'phone', label: 'Phone Number', placeholder: '+84 912 345 678', is_required: true, is_locked: true, position: 2 },
      { field_key: 'email', field_type: 'email', role_type: 'email', label: 'Email Address', placeholder: 'john.doe@example.com', is_required: false, is_locked: true, position: 3 },
      {
        field_key: 'service',
        field_type: 'select',
        role_type: 'service_interest',
        label: 'Service of Interest',
        is_required: true,
        is_locked: false,
        position: 4,
        options_config: [
          'BIM Consulting & Information Management',
          'Digital Transformation & Digital Twins',
          'Professional Training & Tech Transfer',
          'Structural Analysis & Simulation',
          'Geotechnical Survey & Field Testing',
        ],
      },
      { field_key: 'notes', field_type: 'textarea', role_type: 'message', label: 'Consultation Notes', placeholder: 'Describe your project scope or specific requirements...', is_required: false, is_locked: false, position: 5 },
    ],
  },

  // 8. Event Registration Form (/events/[slug])
  {
    code: 'form_dangky_sukien',
    workspace: 'vi',
    is_system: false,
    admin_name: 'Biểu mẫu - Đăng ký Sự kiện & Hội thảo',
    title: 'Đăng ký tham gia sự kiện & Hội thảo',
    description: 'Biểu mẫu đăng ký tham dự hội thảo, workshop và các chương trình sự kiện chuyên đề của CIC.',
    submit_button_text: 'Xác nhận đăng ký tham dự',
    success_message: 'Đăng ký tham gia thành công! Vé tham dự và thông tin chi tiết sự kiện đã được ghi nhận.',
    fields: [
      { field_key: 'fullName', field_type: 'text', role_type: 'customer_name', label: 'Họ và tên', placeholder: 'Nguyễn Văn A', is_required: true, is_locked: true, position: 1 },
      { field_key: 'company', field_type: 'text', role_type: 'company', label: 'Đơn vị / Doanh nghiệp', placeholder: 'Công ty CP Xây dựng ABC', is_required: true, is_locked: false, position: 2 },
      { field_key: 'position', field_type: 'text', label: 'Chức danh / Vị trí công tác', placeholder: 'Kỹ sư trưởng / Giám đốc kỹ thuật...', is_required: true, is_locked: false, position: 3 },
      { field_key: 'email', field_type: 'email', role_type: 'email', label: 'Email nhận vé tham dự', placeholder: 'email@example.com', is_required: true, is_locked: true, position: 4 },
      { field_key: 'phone', field_type: 'phone', role_type: 'phone', label: 'Số điện thoại liên hệ', placeholder: '0912 345 678', is_required: true, is_locked: true, position: 5 },
      { field_key: 'attendeesCount', field_type: 'number', label: 'Số lượng đại biểu tham dự', placeholder: '1', is_required: true, is_locked: false, position: 6 },
      { field_key: 'note', field_type: 'textarea', role_type: 'message', label: 'Câu hỏi trao đổi cho diễn giả', placeholder: 'Câu hỏi hoặc chủ đề bạn muốn được giải đáp tại hội thảo...', is_required: false, is_locked: false, position: 7 },
    ],
  },
  {
    code: 'form_dangky_sukien',
    workspace: 'en',
    is_system: false,
    admin_name: 'Form - Event Registration (EN)',
    title: 'Event & Workshop Registration',
    description: 'Form for registering for seminars, webinars, and technical workshops organized by CIC.',
    submit_button_text: 'Confirm Registration',
    success_message: 'Registration successful! Your pass and event information have been registered.',
    fields: [
      { field_key: 'fullName', field_type: 'text', role_type: 'customer_name', label: 'Full Name', placeholder: 'John Doe', is_required: true, is_locked: true, position: 1 },
      { field_key: 'company', field_type: 'text', role_type: 'company', label: 'Organization / Company', placeholder: 'ABC Construction Corp', is_required: true, is_locked: false, position: 2 },
      { field_key: 'position', field_type: 'text', label: 'Job Title / Position', placeholder: 'Lead Engineer / Technical Director...', is_required: true, is_locked: false, position: 3 },
      { field_key: 'email', field_type: 'email', role_type: 'email', label: 'Ticket Email Address', placeholder: 'john.doe@example.com', is_required: true, is_locked: true, position: 4 },
      { field_key: 'phone', field_type: 'phone', role_type: 'phone', label: 'Contact Phone Number', placeholder: '+84 912 345 678', is_required: true, is_locked: true, position: 5 },
      { field_key: 'attendeesCount', field_type: 'number', label: 'Number of Attendees', placeholder: '1', is_required: true, is_locked: false, position: 6 },
      { field_key: 'note', field_type: 'textarea', role_type: 'message', label: 'Questions for Speakers', placeholder: 'Topics or questions you would like addressed at the workshop...', is_required: false, is_locked: false, position: 7 },
    ],
  },

  // 9. Article Consultation Form (/news/[slug])
  {
    code: 'form_tuvan_tintuc',
    workspace: 'vi',
    is_system: false,
    admin_name: 'Biểu mẫu - Tư vấn Tin tức & Công nghệ',
    title: 'Đăng ký nhận tư vấn chuyên sâu từ bài viết',
    description: 'Biểu mẫu tiếp nhận câu hỏi và nhu cầu tư vấn từ bạn đọc bài viết tin tức, công nghệ trên website.',
    submit_button_text: 'Gửi yêu cầu hỗ trợ',
    success_message: 'Cảm ơn bạn đã gửi thắc mắc! Đội ngũ tư vấn giải pháp CIC sẽ phản hồi qua email hoặc số điện thoại trong 24 giờ.',
    fields: [
      { field_key: 'fullname', field_type: 'text', role_type: 'customer_name', label: 'Họ và tên', placeholder: 'Nguyễn Văn A', is_required: true, is_locked: true, position: 1 },
      { field_key: 'email', field_type: 'email', role_type: 'email', label: 'Email liên hệ', placeholder: 'email@example.com', is_required: true, is_locked: true, position: 2 },
      { field_key: 'phone', field_type: 'phone', role_type: 'phone', label: 'Số điện thoại', placeholder: '0912 345 678', is_required: false, is_locked: true, position: 3 },
      { field_key: 'message', field_type: 'textarea', role_type: 'message', label: 'Nội dung thắc mắc', placeholder: 'Nội dung bạn muốn trao đổi thêm về giải pháp trong bài viết...', is_required: false, is_locked: false, position: 4 },
    ],
  },
  {
    code: 'form_tuvan_tintuc',
    workspace: 'en',
    is_system: false,
    admin_name: 'Form - News Article Consultation (EN)',
    title: 'Article In-depth Consultation Request',
    description: 'Form for readers to submit questions and consultation requests from technology articles.',
    submit_button_text: 'Send Question',
    success_message: 'Thank you for your inquiry! The CIC solution consulting team will respond within 24 hours.',
    fields: [
      { field_key: 'fullname', field_type: 'text', role_type: 'customer_name', label: 'Full Name', placeholder: 'John Doe', is_required: true, is_locked: true, position: 1 },
      { field_key: 'email', field_type: 'email', role_type: 'email', label: 'Email Address', placeholder: 'john.doe@example.com', is_required: true, is_locked: true, position: 2 },
      { field_key: 'phone', field_type: 'phone', role_type: 'phone', label: 'Phone Number', placeholder: '+84 912 345 678', is_required: false, is_locked: true, position: 3 },
      { field_key: 'message', field_type: 'textarea', role_type: 'message', label: 'Question / Inquiry Details', placeholder: 'Questions about the software or technology presented in this article...', is_required: false, is_locked: false, position: 4 },
    ],
  },
];

// -----------------------------------------------------------------------------
// DEFINITION OF PUBLIC CTAs (VI & EN)
// -----------------------------------------------------------------------------
const PUBLIC_CTAS = [
  // 1. Explore Products CTA
  {
    code: 'cta_explore_products',
    workspace: 'vi',
    is_system: true,
    admin_name: 'CTA Hệ thống - Khám phá giải pháp',
    display_text: 'Khám phá giải pháp',
    description: 'Nút chuyển hướng chính trong Hero Carousel trang chủ và hệ sinh thái số.',
    icon: 'ArrowRight',
    style_variant: 'primary',
    action_type: 'redirect_internal',
    action_config: { url: '/products', openInNewTab: false },
    form_code: null,
  },
  {
    code: 'cta_explore_products',
    workspace: 'en',
    is_system: true,
    admin_name: 'CTA System - Explore Solutions (EN)',
    display_text: 'Explore Solutions',
    description: 'Primary action button in the homepage Hero Carousel leading to products catalog.',
    icon: 'ArrowRight',
    style_variant: 'primary',
    action_type: 'redirect_internal',
    action_config: { url: '/en/products', openInNewTab: false },
    form_code: null,
  },

  // 2. About CIC CTA
  {
    code: 'cta_about_cic',
    workspace: 'vi',
    is_system: true,
    admin_name: 'CTA Hệ thống - Về chúng tôi',
    display_text: 'Về chúng tôi',
    description: 'Nút phụ trong Hero Carousel dẫn đến trang Giới thiệu năng lực CIC.',
    icon: 'Building',
    style_variant: 'outline',
    action_type: 'redirect_internal',
    action_config: { url: '/about', openInNewTab: false },
    form_code: null,
  },
  {
    code: 'cta_about_cic',
    workspace: 'en',
    is_system: true,
    admin_name: 'CTA System - About CIC (EN)',
    display_text: 'About CIC',
    description: 'Secondary action button in the homepage Hero Carousel leading to company overview.',
    icon: 'Building',
    style_variant: 'outline',
    action_type: 'redirect_internal',
    action_config: { url: '/en/about', openInNewTab: false },
    form_code: null,
  },

  // 3. Home Intro Journey CTA
  {
    code: 'cta_home_intro',
    workspace: 'vi',
    is_system: false,
    admin_name: 'CTA - Khám phá hành trình CIC',
    display_text: 'Khám phá hành trình CIC',
    description: 'Nút dẫn đến trang Giới thiệu lịch sử và hành trình phát triển hơn 35 năm của CIC tại khối Home Intro.',
    icon: 'ArrowRight',
    style_variant: 'primary',
    action_type: 'redirect_internal',
    action_config: { url: '/about', openInNewTab: false },
    form_code: null,
  },
  {
    code: 'cta_home_intro',
    workspace: 'en',
    is_system: false,
    admin_name: 'CTA - Discover CIC Journey (EN)',
    display_text: 'Discover CIC Journey',
    description: 'Action button directing to company history and 35-year development milestones in Home Intro section.',
    icon: 'ArrowRight',
    style_variant: 'primary',
    action_type: 'redirect_internal',
    action_config: { url: '/en/about', openInNewTab: false },
    form_code: null,
  },

  // 4. Company Profile Download / Flipbook CTA
  {
    code: 'cta_profile_download',
    workspace: 'vi',
    is_system: false,
    admin_name: 'CTA - Xem & Tải Hồ sơ năng lực (Profile)',
    display_text: 'Hồ sơ năng lực',
    description: 'Mở xem trực tuyến cuốn Hồ sơ năng lực CIC (Flipbook / PDF) tại khối Giới thiệu trang chủ và trang Giới thiệu.',
    icon: 'ArrowUpRight',
    style_variant: 'outline',
    action_type: 'redirect_external',
    action_config: { url: 'https://www.cic.com.vn/flipbooks/index.html?pdf=CICProfile2024Final.pdf', openInNewTab: true },
    form_code: null,
  },
  {
    code: 'cta_profile_download',
    workspace: 'en',
    is_system: false,
    admin_name: 'CTA - View & Download Company Profile (EN)',
    display_text: 'Company Profile',
    description: 'Direct access to online interactive CIC Company Profile Flipbook / PDF.',
    icon: 'ArrowUpRight',
    style_variant: 'outline',
    action_type: 'redirect_external',
    action_config: { url: 'https://www.cic.com.vn/flipbooks/index.html?pdf=CICProfile2024Final.pdf', openInNewTab: true },
    form_code: null,
  },

  // 5. Consultation Request CTA (Global Modal)
  {
    code: 'cta_contact',
    workspace: 'vi',
    is_system: true,
    admin_name: 'CTA Hệ thống - Đăng ký tư vấn',
    display_text: 'Đăng ký tư vấn',
    description: 'Nút kích hoạt cửa sổ Đăng ký tư vấn tại Header góc trên bên phải, thanh công cụ nổi, chatbot và banner tư vấn tin tức/sự kiện.',
    icon: 'MessageSquare',
    style_variant: 'primary',
    action_type: 'open_form',
    action_config: {},
    form_code: 'form_home_consultation',
  },
  {
    code: 'cta_contact',
    workspace: 'en',
    is_system: true,
    admin_name: 'CTA System - Request Consultation (EN)',
    display_text: 'Request Consultation',
    description: 'Global button at top-right Header, floating toolbar, and consultation banners opening the consultation modal.',
    icon: 'MessageSquare',
    style_variant: 'primary',
    action_type: 'open_form',
    action_config: {},
    form_code: 'form_home_consultation',
  },

  // 6. View All Products CTA
  {
    code: 'cta_view_all_products',
    workspace: 'vi',
    is_system: false,
    admin_name: 'CTA - Xem tất cả sản phẩm & giải pháp',
    display_text: 'Xem tất cả sản phẩm',
    description: 'Nút xem toàn bộ danh mục sản phẩm và phần mềm bản quyền từ khối Giải pháp nổi bật trên trang chủ.',
    icon: 'Layers',
    style_variant: 'primary',
    action_type: 'redirect_internal',
    action_config: { url: '/products', openInNewTab: false },
    form_code: null,
  },
  {
    code: 'cta_view_all_products',
    workspace: 'en',
    is_system: false,
    admin_name: 'CTA - View All Products & Solutions (EN)',
    display_text: 'View All Products',
    description: 'Direct link to the full catalog of engineering software and technologies from homepage featured solutions.',
    icon: 'Layers',
    style_variant: 'primary',
    action_type: 'redirect_internal',
    action_config: { url: '/en/products', openInNewTab: false },
    form_code: null,
  },

  // 7. View All News CTA
  {
    code: 'cta_view_all_news',
    workspace: 'vi',
    is_system: false,
    admin_name: 'CTA - Xem tất cả tin tức',
    display_text: 'Xem tất cả tin tức',
    description: 'Nút điều hướng sang trang tin tức công nghệ và sự kiện từ khối Tin tức trên trang chủ.',
    icon: 'ArrowRight',
    style_variant: 'outline',
    action_type: 'redirect_internal',
    action_config: { url: '/news', openInNewTab: false },
    form_code: null,
  },
  {
    code: 'cta_view_all_news',
    workspace: 'en',
    is_system: false,
    admin_name: 'CTA - View All News (EN)',
    display_text: 'View All News',
    description: 'Direct button to all news and industry insights from the homepage news section.',
    icon: 'ArrowRight',
    style_variant: 'outline',
    action_type: 'redirect_internal',
    action_config: { url: '/en/news', openInNewTab: false },
    form_code: null,
  },

  // 8. View All Events CTA
  {
    code: 'cta_view_all_events',
    workspace: 'vi',
    is_system: false,
    admin_name: 'CTA - Xem tất cả sự kiện',
    display_text: 'Xem tất cả sự kiện',
    description: 'Nút điều hướng sang lịch sự kiện, hội thảo và webinar từ khối Sự kiện trên trang chủ.',
    icon: 'Calendar',
    style_variant: 'outline',
    action_type: 'redirect_internal',
    action_config: { url: '/events', openInNewTab: false },
    form_code: null,
  },
  {
    code: 'cta_view_all_events',
    workspace: 'en',
    is_system: false,
    admin_name: 'CTA - View All Events (EN)',
    display_text: 'View All Events',
    description: 'Direct button to technical seminars, workshops, and webinars from homepage events section.',
    icon: 'Calendar',
    style_variant: 'outline',
    action_type: 'redirect_internal',
    action_config: { url: '/en/events', openInNewTab: false },
    form_code: null,
  },

  // 9. View All Projects CTA
  {
    code: 'cta_view_all_projects',
    workspace: 'vi',
    is_system: false,
    admin_name: 'CTA - Xem tất cả dự án',
    display_text: 'Xem tất cả dự án',
    description: 'Nút điều hướng sang trang danh mục dự án trọng điểm từ khối Dự án trên trang chủ.',
    icon: 'ChevronRight',
    style_variant: 'outline',
    action_type: 'redirect_internal',
    action_config: { url: '/projects', openInNewTab: false },
    form_code: null,
  },
  {
    code: 'cta_view_all_projects',
    workspace: 'en',
    is_system: false,
    admin_name: 'CTA - View All Projects (EN)',
    display_text: 'View All Projects',
    description: 'Direct button to featured engineering and consulting projects from homepage projects section.',
    icon: 'ChevronRight',
    style_variant: 'outline',
    action_type: 'redirect_internal',
    action_config: { url: '/en/projects', openInNewTab: false },
    form_code: null,
  },

  // 10. Homepage Contact Form Submit CTA
  {
    code: 'cta_lienhe_trangchu',
    workspace: 'vi',
    is_system: false,
    admin_name: 'CTA - Gửi yêu cầu tư vấn chân trang chủ',
    display_text: 'Gửi thông tin ngay',
    description: 'Nút gửi form tiếp nhận thông tin khách hàng tại phần chân trang chủ (#contact).',
    icon: 'Send',
    style_variant: 'primary',
    action_type: 'open_form',
    action_config: {},
    form_code: 'form_home_contact',
  },
  {
    code: 'cta_lienhe_trangchu',
    workspace: 'en',
    is_system: false,
    admin_name: 'CTA - Submit Homepage Consultation (EN)',
    display_text: 'Submit Inquiry Now',
    description: 'Button submitting customer inquiry on the homepage contact section (#contact).',
    icon: 'Send',
    style_variant: 'primary',
    action_type: 'open_form',
    action_config: {},
    form_code: 'form_home_contact',
  },

  // 11. Service Consultation CTA
  {
    code: 'cta_tuvan_dichvu',
    workspace: 'vi',
    is_system: false,
    admin_name: 'CTA - Tư vấn dịch vụ BIM & Chuyển đổi số',
    display_text: 'Tư vấn dịch vụ',
    description: 'Kích hoạt form đăng ký tư vấn dịch vụ tại trang danh mục và chi tiết dịch vụ.',
    icon: 'Briefcase',
    style_variant: 'primary',
    action_type: 'open_form',
    action_config: {},
    form_code: 'form_tuvan_dichvu',
  },
  {
    code: 'cta_tuvan_dichvu',
    workspace: 'en',
    is_system: false,
    admin_name: 'CTA - Service Consultation (EN)',
    display_text: 'Consult Services',
    description: 'Triggers the service consultation form on the services catalog and detail pages.',
    icon: 'Briefcase',
    style_variant: 'primary',
    action_type: 'open_form',
    action_config: {},
    form_code: 'form_tuvan_dichvu',
  },

  // 12. Product Quotation CTA
  {
    code: 'cta_baogia_sanpham',
    workspace: 'vi',
    is_system: false,
    admin_name: 'CTA - Nhận báo giá sản phẩm',
    display_text: 'Nhận báo giá',
    description: 'Nút mở modal yêu cầu báo giá trên trang danh mục và chi tiết sản phẩm.',
    icon: 'Tag',
    style_variant: 'primary',
    action_type: 'open_form',
    action_config: {},
    form_code: 'form_baogia_sanpham',
  },
  {
    code: 'cta_baogia_sanpham',
    workspace: 'en',
    is_system: false,
    admin_name: 'CTA - Product Quotation (EN)',
    display_text: 'Get a Quote',
    description: 'Button opening the quotation modal on product catalog and detail pages.',
    icon: 'Tag',
    style_variant: 'primary',
    action_type: 'open_form',
    action_config: {},
    form_code: 'form_baogia_sanpham',
  },

  // 13. Product Purchase CTA
  {
    code: 'cta_mua_sanpham',
    workspace: 'vi',
    is_system: false,
    admin_name: 'CTA - Đăng ký mua bản quyền',
    display_text: 'Đăng ký mua',
    description: 'Nút đăng ký mua bản quyền phần mềm và thiết bị chính hãng trên trang chi tiết sản phẩm.',
    icon: 'ShoppingCart',
    style_variant: 'primary',
    action_type: 'open_form',
    action_config: {},
    form_code: 'form_dangky_mua',
  },
  {
    code: 'cta_mua_sanpham',
    workspace: 'en',
    is_system: false,
    admin_name: 'CTA - Purchase License (EN)',
    display_text: 'Buy License',
    description: 'Button for purchasing official licenses on product detail pages.',
    icon: 'ShoppingCart',
    style_variant: 'primary',
    action_type: 'open_form',
    action_config: {},
    form_code: 'form_dangky_mua',
  },

  // 14. Download Trial CTA
  {
    code: 'cta_taive_dungthu',
    workspace: 'vi',
    is_system: false,
    admin_name: 'CTA - Tải bản dùng thử',
    display_text: 'Tải bản dùng thử',
    description: 'Nút mở modal tải bản dùng thử và tài liệu kỹ thuật của sản phẩm.',
    icon: 'Download',
    style_variant: 'secondary',
    action_type: 'open_form',
    action_config: {},
    form_code: 'form_taive_dungthu',
  },
  {
    code: 'cta_taive_dungthu',
    workspace: 'en',
    is_system: false,
    admin_name: 'CTA - Download Trial (EN)',
    display_text: 'Download Trial',
    description: 'Button opening trial download modal on product detail pages.',
    icon: 'Download',
    style_variant: 'secondary',
    action_type: 'open_form',
    action_config: {},
    form_code: 'form_taive_dungthu',
  },

  // 15. Event Registration CTA
  {
    code: 'cta_dangky_sukien',
    workspace: 'vi',
    is_system: false,
    admin_name: 'CTA - Đăng ký tham gia sự kiện',
    display_text: 'Đăng ký tham gia',
    description: 'Nút chuyển đến form đăng ký tham dự hội thảo, webinar trên trang sự kiện.',
    icon: 'Calendar',
    style_variant: 'primary',
    action_type: 'open_form',
    action_config: {},
    form_code: 'form_dangky_sukien',
  },
  {
    code: 'cta_dangky_sukien',
    workspace: 'en',
    is_system: false,
    admin_name: 'CTA - Event Registration (EN)',
    display_text: 'Register Now',
    description: 'Registration action button on event catalog and detail pages.',
    icon: 'Calendar',
    style_variant: 'primary',
    action_type: 'open_form',
    action_config: {},
    form_code: 'form_dangky_sukien',
  },

  // 16. Article In-depth Inquiry CTA
  {
    code: 'cta_tuvan_tintuc',
    workspace: 'vi',
    is_system: false,
    admin_name: 'CTA - Gửi câu hỏi tư vấn bài viết',
    display_text: 'Gửi câu hỏi tư vấn',
    description: 'Form tiếp nhận câu hỏi và tư vấn chuyên sâu đặt tại cuối bài viết tin tức, công nghệ.',
    icon: 'HelpCircle',
    style_variant: 'secondary',
    action_type: 'open_form',
    action_config: {},
    form_code: 'form_tuvan_tintuc',
  },
  {
    code: 'cta_tuvan_tintuc',
    workspace: 'en',
    is_system: false,
    admin_name: 'CTA - Article In-depth Inquiry (EN)',
    display_text: 'Submit Inquiry',
    description: 'Form receiving questions and in-depth consulting requests from technology news articles.',
    icon: 'HelpCircle',
    style_variant: 'secondary',
    action_type: 'open_form',
    action_config: {},
    form_code: 'form_tuvan_tintuc',
  },

  // 17. Project Consultation Request CTA
  {
    code: 'cta_tuvan_duan',
    workspace: 'vi',
    is_system: false,
    admin_name: 'CTA - Yêu cầu tư vấn giải pháp dự án',
    display_text: 'Yêu cầu tư vấn ngay',
    description: 'Nút yêu cầu tư vấn kỹ thuật đặt tại thanh bên (sidebar) trang chi tiết dự án tiêu biểu.',
    icon: 'MessageSquare',
    style_variant: 'primary',
    action_type: 'open_form',
    action_config: {},
    form_code: 'form_home_consultation',
  },
  {
    code: 'cta_tuvan_duan',
    workspace: 'en',
    is_system: false,
    admin_name: 'CTA - Project Solution Consultation (EN)',
    display_text: 'Request Project Consultation',
    description: 'Direct consultation request button located in the project detail sidebar.',
    icon: 'MessageSquare',
    style_variant: 'primary',
    action_type: 'open_form',
    action_config: {},
    form_code: 'form_home_consultation',
  },

  // 18. Official Contact Page Redirect CTA
  {
    code: 'cta_lienhe_chinhthuc',
    workspace: 'vi',
    is_system: false,
    admin_name: 'CTA - Gửi yêu cầu liên hệ',
    display_text: 'Liên hệ với chúng tôi',
    description: 'Nút dẫn thẳng đến trang Liên hệ chính thức của CIC.',
    icon: 'Mail',
    style_variant: 'outline',
    action_type: 'redirect_internal',
    action_config: { url: '/contact', openInNewTab: false },
    form_code: null,
  },
  {
    code: 'cta_lienhe_chinhthuc',
    workspace: 'en',
    is_system: false,
    admin_name: 'CTA - Contact Us (EN)',
    display_text: 'Contact Us',
    description: 'Action button directing to the official Contact page.',
    icon: 'Mail',
    style_variant: 'outline',
    action_type: 'redirect_internal',
    action_config: { url: '/en/contact', openInNewTab: false },
    form_code: null,
  },

  // 19. Direct Hotline Call CTA
  {
    code: 'cta_goi_hotline',
    workspace: 'vi',
    is_system: true,
    admin_name: 'CTA Hệ thống - Gọi hotline tư vấn',
    display_text: 'Hotline: 024 3976 1381',
    description: 'Gọi trực tiếp đến số điện thoại tổng đài tư vấn của CIC.',
    icon: 'Phone',
    style_variant: 'primary',
    action_type: 'call_phone',
    action_config: { phoneNumber: '024 3976 1381' },
    form_code: null,
  },
  {
    code: 'cta_goi_hotline',
    workspace: 'en',
    is_system: true,
    admin_name: 'CTA System - Call Hotline (EN)',
    display_text: 'Hotline: +84 24 3976 1381',
    description: 'Direct call to CIC consultation hotline.',
    icon: 'Phone',
    style_variant: 'primary',
    action_type: 'call_phone',
    action_config: { phoneNumber: '024 3976 1381' },
    form_code: null,
  },

  // 20. Direct Email Inquiry CTA
  {
    code: 'cta_gui_email',
    workspace: 'vi',
    is_system: false,
    admin_name: 'CTA - Gửi email tới hòm thư CIC',
    display_text: 'Email: info@cic.com.vn',
    description: 'Gửi thư điện tử trực tiếp đến hộp thư tiếp nhận thông tin của CIC.',
    icon: 'Mail',
    style_variant: 'outline',
    action_type: 'send_email',
    action_config: { emailAddress: 'info@cic.com.vn' },
    form_code: null,
  },
  {
    code: 'cta_gui_email',
    workspace: 'en',
    is_system: false,
    admin_name: 'CTA - Send Email to CIC (EN)',
    display_text: 'Email: info@cic.com.vn',
    description: 'Direct email inquiry to CIC official inbox.',
    icon: 'Mail',
    style_variant: 'outline',
    action_type: 'send_email',
    action_config: { emailAddress: 'info@cic.com.vn' },
    form_code: null,
  },

  // 21. Zalo Official Support CTA
  {
    code: 'cta_chat_zalo',
    workspace: 'vi',
    is_system: false,
    admin_name: 'CTA - Hỗ trợ qua Zalo Official Account',
    display_text: 'Zalo: 024 3976 1381 / OA CIC',
    description: 'Mở ứng dụng Zalo để chat trực tiếp với chuyên viên tư vấn CIC.',
    icon: 'MessageCircle',
    style_variant: 'secondary',
    action_type: 'redirect_external',
    action_config: { url: 'https://zalo.me/1727624419140352798', openInNewTab: true },
    form_code: null,
  },
  {
    code: 'cta_chat_zalo',
    workspace: 'en',
    is_system: false,
    admin_name: 'CTA - Zalo OA Official Support (EN)',
    display_text: 'Zalo Support: +84 24 3976 1381',
    description: 'Open Zalo application for instant technical support from CIC team.',
    icon: 'MessageCircle',
    style_variant: 'secondary',
    action_type: 'redirect_external',
    action_config: { url: 'https://zalo.me/1727624419140352798', openInNewTab: true },
    form_code: null,
  },

  // 22. Facebook Fanpage CTA
  {
    code: 'cta_social_facebook',
    workspace: 'vi',
    is_system: false,
    admin_name: 'CTA - Fanpage Facebook CIC Technology',
    display_text: 'Fanpage Facebook CIC',
    description: 'Mở trang mạng xã hội Facebook chính thức của CIC.',
    icon: 'Facebook',
    style_variant: 'outline',
    action_type: 'redirect_external',
    action_config: { url: 'https://www.facebook.com/CICTechnologyandConsultancyVN', openInNewTab: true },
    form_code: null,
  },
  {
    code: 'cta_social_facebook',
    workspace: 'en',
    is_system: false,
    admin_name: 'CTA - CIC Facebook Official (EN)',
    display_text: 'CIC Facebook Official',
    description: 'Direct link to official CIC Facebook fanpage.',
    icon: 'Facebook',
    style_variant: 'outline',
    action_type: 'redirect_external',
    action_config: { url: 'https://www.facebook.com/CICTechnologyandConsultancyVN', openInNewTab: true },
    form_code: null,
  },

  // 23. LinkedIn Company Page CTA
  {
    code: 'cta_social_linkedin',
    workspace: 'vi',
    is_system: false,
    admin_name: 'CTA - Trang LinkedIn CIC Technology',
    display_text: 'LinkedIn CIC',
    description: 'Mở trang mạng lưới chuyên nghiệp LinkedIn của CIC.',
    icon: 'Linkedin',
    style_variant: 'outline',
    action_type: 'redirect_external',
    action_config: { url: 'https://www.linkedin.com/in/c%C3%B4ng-ty-cp-c%C3%B4ng-ngh%E1%BB%87-v%C3%A0-t%C6%B0-v%E1%BA%A5n-cic/', openInNewTab: true },
    form_code: null,
  },
  {
    code: 'cta_social_linkedin',
    workspace: 'en',
    is_system: false,
    admin_name: 'CTA - CIC LinkedIn Official (EN)',
    display_text: 'CIC LinkedIn Official',
    description: 'Official CIC LinkedIn profile for industry updates and career networking.',
    icon: 'Linkedin',
    style_variant: 'outline',
    action_type: 'redirect_external',
    action_config: { url: 'https://www.linkedin.com/in/c%C3%B4ng-ty-cp-c%C3%B4ng-ngh%E1%BB%87-v%C3%A0-t%C6%B0-v%E1%BA%A5n-cic/', openInNewTab: true },
    form_code: null,
  },

  // 24. Newsletter Subscription CTA
  {
    code: 'cta_dangky_bantin',
    workspace: 'vi',
    is_system: false,
    admin_name: 'CTA - Đăng ký nhận bản tin công nghệ',
    display_text: 'Đăng ký nhận tin',
    description: 'Đăng ký email để nhận bản tin công nghệ, thông báo hội thảo và cập nhật phần mềm định kỳ từ CIC.',
    icon: 'Send',
    style_variant: 'primary',
    action_type: 'scroll_to_section',
    action_config: { sectionId: 'contact' },
    form_code: null,
  },
  {
    code: 'cta_dangky_bantin',
    workspace: 'en',
    is_system: false,
    admin_name: 'CTA - Subscribe Newsletter (EN)',
    display_text: 'Subscribe Newsletter',
    description: 'Subscribe to newsletter for tech insights, webinar notices, and software releases.',
    icon: 'Send',
    style_variant: 'primary',
    action_type: 'scroll_to_section',
    action_config: { sectionId: 'contact' },
    form_code: null,
  },
];

async function runSeed() {
  console.log('=================================================================');
  console.log('SEEDING GENUINE PUBLIC FORMS & CTAs FOR CIC TECHNOLOGY');
  console.log('=================================================================');

  // Step 1: Remove temporary test forms and test submissions
  console.log('\n[Step 1] Cleaning temporary test forms and submissions...');
  const testForms = await sql`
    SELECT id, code FROM cic_forms WHERE code LIKE 'test_auto_%' OR title LIKE '%Kiểm thử%'
  `;
  if (testForms.length > 0) {
    const testIds = testForms.map((f) => f.id);
    await sql`DELETE FROM cic_form_submissions WHERE form_id IN ${sql(testIds)}`;
    await sql`DELETE FROM cic_forms WHERE id IN ${sql(testIds)}`;
    console.log(`  -> Cleaned ${testForms.length} temporary test forms and their submissions.`);
  } else {
    console.log('  -> No temporary test forms found.');
  }

  // Step 2: Seed / Upsert Public Forms
  console.log('\n[Step 2] Seeding genuine Forms from public website...');
  const formIdMap = new Map(); // key: `${workspace}:${code}` -> id

  for (const formDef of PUBLIC_FORMS) {
    const existing = await sql`
      SELECT id FROM cic_forms 
      WHERE workspace = ${formDef.workspace} AND code = ${formDef.code}
    `;

    let formId;
    if (existing.length > 0) {
      formId = existing[0].id;
      await sql`
        UPDATE cic_forms SET
          admin_name = ${formDef.admin_name},
          title = ${formDef.title},
          description = ${formDef.description},
          is_system = ${formDef.is_system},
          status = 'active',
          submit_button_text = ${formDef.submit_button_text},
          success_message = ${formDef.success_message},
          create_customer_request = true,
          send_admin_email = true,
          admin_emails = ARRAY['nampt@cic.com.vn', 'info@cic.com.vn']::text[],
          send_confirmation_email = true,
          updated_at = NOW()
        WHERE id = ${formId}
      `;
      console.log(`  [UPDATED] Form: [${formDef.workspace.toUpperCase()}] ${formDef.admin_name} (#${formId})`);
    } else {
      const [inserted] = await sql`
        INSERT INTO cic_forms (
          workspace, code, is_system, admin_name, title, description,
          status, current_version, create_customer_request, send_admin_email,
          admin_emails, send_confirmation_email, submit_button_text, success_message,
          created_at, updated_at
        ) VALUES (
          ${formDef.workspace}, ${formDef.code}, ${formDef.is_system}, ${formDef.admin_name}, ${formDef.title}, ${formDef.description},
          'active', 1, true, true,
          ARRAY['nampt@cic.com.vn', 'info@cic.com.vn']::text[], true, ${formDef.submit_button_text}, ${formDef.success_message},
          NOW(), NOW()
        ) RETURNING id
      `;
      formId = inserted.id;
      console.log(`  [CREATED] Form: [${formDef.workspace.toUpperCase()}] ${formDef.admin_name} (#${formId})`);
    }

    formIdMap.set(`${formDef.workspace}:${formDef.code}`, formId);

    // Seed form fields
    await sql`DELETE FROM cic_form_fields WHERE form_id = ${formId}`;
    for (const f of formDef.fields) {
      await sql`
        INSERT INTO cic_form_fields (
          form_id, field_key, field_type, role_type, label, placeholder, help_text,
          is_required, is_locked, position, validation_config, options_config
        ) VALUES (
          ${formId}, ${f.field_key}, ${f.field_type}, ${f.role_type || null}, ${f.label}, ${f.placeholder || null}, null,
          ${f.is_required}, ${f.is_locked}, ${f.position},
          ${sql.json({ required: f.is_required })},
          ${sql.json(f.options_config || [])}
        )
      `;
    }

    // Seed default Email destination in cic_form_destinations if not present
    const existingEmailDest = await sql`
      SELECT id FROM cic_form_destinations 
      WHERE form_id = ${formId} AND destination_type = 'email'
    `;
    if (existingEmailDest.length === 0) {
      await sql`
        INSERT INTO cic_form_destinations (
          form_id, destination_type, name, is_enabled, config, created_at, updated_at
        ) VALUES (
          ${formId}, 'email', 'Thông báo Email', true,
          ${sql.json({
            sendAdminEmail: true,
            adminEmails: ['nampt@cic.com.vn', 'info@cic.com.vn'],
            sendConfirmationEmail: true,
          })},
          NOW(), NOW()
        )
      `;
    }
  }

  // Remove any legacy unused dummy forms that are not in PUBLIC_FORMS
  const validCodes = [...new Set(PUBLIC_FORMS.map((f) => f.code))];
  const oldDummyForms = await sql`
    SELECT id, code, admin_name FROM cic_forms 
    WHERE code NOT IN ${sql(validCodes)}
  `;
  if (oldDummyForms.length > 0) {
    for (const dummy of oldDummyForms) {
      // unlink any ctas pointing to this dummy form
      await sql`UPDATE cic_ctas SET form_id = NULL WHERE form_id = ${dummy.id}`;
      await sql`DELETE FROM cic_form_submissions WHERE form_id = ${dummy.id}`;
      await sql`DELETE FROM cic_forms WHERE id = ${dummy.id}`;
      console.log(`  [REMOVED] Legacy dummy form: ${dummy.admin_name} (${dummy.code} #${dummy.id})`);
    }
  }

  // Step 3: Seed / Upsert Public CTAs
  console.log('\n[Step 3] Seeding genuine CTAs from public website...');
  for (const ctaDef of PUBLIC_CTAS) {
    const existing = await sql`
      SELECT id FROM cic_ctas 
      WHERE workspace = ${ctaDef.workspace} AND code = ${ctaDef.code}
    `;

    // Resolve formId if applicable
    let linkedFormId = null;
    if (ctaDef.form_code) {
      linkedFormId = formIdMap.get(`${ctaDef.workspace}:${ctaDef.form_code}`) || null;
    }

    const actionConfig = {
      ...ctaDef.action_config,
      ...(linkedFormId ? { formId: String(linkedFormId) } : {}),
    };

    if (existing.length > 0) {
      const ctaId = existing[0].id;
      await sql`
        UPDATE cic_ctas SET
          admin_name = ${ctaDef.admin_name},
          display_text = ${ctaDef.display_text},
          description = ${ctaDef.description},
          icon = ${ctaDef.icon},
          style_variant = ${ctaDef.style_variant},
          action_type = ${ctaDef.action_type},
          action_config = ${sql.json(actionConfig)},
          form_id = ${linkedFormId},
          is_system = ${ctaDef.is_system},
          status = 'active',
          updated_at = NOW()
        WHERE id = ${ctaId}
      `;
      console.log(`  [UPDATED] CTA: [${ctaDef.workspace.toUpperCase()}] ${ctaDef.display_text} (${ctaDef.code}) -> Action: ${ctaDef.action_type}`);
    } else {
      await sql`
        INSERT INTO cic_ctas (
          workspace, code, is_system, admin_name, display_text, description,
          icon, style_variant, action_type, action_config, form_id,
          status, created_at, updated_at
        ) VALUES (
          ${ctaDef.workspace}, ${ctaDef.code}, ${ctaDef.is_system}, ${ctaDef.admin_name}, ${ctaDef.display_text}, ${ctaDef.description},
          ${ctaDef.icon}, ${ctaDef.style_variant}, ${ctaDef.action_type}, ${sql.json(actionConfig)}, ${linkedFormId},
          'active', NOW(), NOW()
        )
      `;
      console.log(`  [CREATED] CTA: [${ctaDef.workspace.toUpperCase()}] ${ctaDef.display_text} (${ctaDef.code}) -> Action: ${ctaDef.action_type}`);
    }
  }

  // Remove any legacy unused dummy CTAs that are not in PUBLIC_CTAS
  const validCtaCodes = [...new Set(PUBLIC_CTAS.map((c) => c.code))];
  const oldDummyCtas = await sql`
    SELECT id, code, admin_name FROM cic_ctas 
    WHERE code NOT IN ${sql(validCtaCodes)}
  `;
  if (oldDummyCtas.length > 0) {
    for (const dummy of oldDummyCtas) {
      await sql`DELETE FROM cic_ctas WHERE id = ${dummy.id}`;
      console.log(`  [REMOVED] Legacy dummy CTA: ${dummy.admin_name} (${dummy.code} #${dummy.id})`);
    }
  }

  console.log('\n=================================================================');
  console.log('SEEDING COMPLETED SUCCESSFULLY!');
  console.log('=================================================================');
}

runSeed()
  .then(() => {
    console.log('[SEED] Form & CTA seeding process finished.');
  })
  .catch((err) => {
    console.error('⚠️ [SEED] Seeding error:', err.message);
    if (process.env.REQUIRE_DB_SEED === 'true') {
      process.exit(1);
    } else {
      console.warn('⚠️ [SEED] Non-fatal seed error. Continuing build process.');
      process.exit(0);
    }
  })
  .finally(async () => {
    if (sql) {
      await sql.end({ timeout: 5 }).catch(() => {});
    }
  });
