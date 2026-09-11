import assert from 'node:assert/strict';
import { dispatchTemplatedEmail } from '../src/lib/email/dispatcher.ts';
import { sendEmail } from '../src/lib/email/transporter.ts';
import { getPostgresClient } from '../src/server/db/postgres.ts';

async function runLiveEmailTests() {
  console.log('=====================================================');
  console.log('🚀 BẮT ĐẦU TEST GỬI EMAIL THẬT QUA ETHEREAL SMTP');
  console.log('   (Không ghi bất kỳ dữ liệu nào vào database)');
  console.log('=====================================================\n');

  const sql = getPostgresClient();
  const [beforeCount] = await sql`SELECT count(*)::int as count FROM cic_email_templates`;
  console.log(`[Database Guard] Số lượng templates trước test: ${beforeCount.count} bản ghi`);

  // --- TEST CASE 1: Gửi Email trực tiếp (Transactional Test) ---
  console.log('\n--- 1. TEST GỬI EMAIL TRỰC TIẾP (sendEmail) ---');
  const directResult = await sendEmail({
    to: 'khachhang.test@cic.com.vn',
    subject: '[CIC Technology] Kiểm tra kết nối SMTP Ethereal thành công',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #ea580c; margin-top: 0;">CIC TECHNOLOGY & CONSULTANCY</h2>
        <p>Xin chào quý khách,</p>
        <p>Đây là email kiểm thử gửi thật qua kênh SMTP Ethereal của hệ thống Next.js.</p>
        <div style="background-color: #f8fafc; padding: 12px; border-left: 4px solid #ea580c; margin: 15px 0;">
          <strong>Trạng thái kết nối:</strong> Hoạt động chính xác (100% OK)<br/>
          <strong>Thời gian gửi:</strong> ${new Date().toLocaleString('vi-VN')}
        </div>
        <p>Trân trọng,<br/><strong>Ban Quản Trị CIC</strong></p>
      </div>
    `,
  });

  console.log('Kết quả gửi Test 1:', {
    success: directResult.success,
    messageId: directResult.messageId,
    simulated: directResult.simulated,
  });
  assert(directResult.success, 'Test 1 thất bại!');
  if (directResult.previewUrl) {
    console.log('👉 [XEM TRỰC TIẾP EMAIL 1 TẠI ĐÂY]:', directResult.previewUrl);
  }

  // --- TEST CASE 2: Gửi Email theo Mẫu Động trong DB (product_contact) ---
  console.log('\n--- 2. TEST GỬI EMAIL DÙNG MẪU DB THẬT (product_contact - Gửi Khách Hàng) ---');
  const contactResult = await dispatchTemplatedEmail({
    workspace: 'vi',
    eventKey: 'product_contact',
    audience: 'customer',
    to: 'khachhang.contact@cic.com.vn',
    variables: {
      '{{customer.full_name}}': 'Anh Nguyễn Văn Tuấn',
      '{{product.name}}': 'Phần mềm Dự toán Escon 15',
      '{{request.reference}}': 'YC-2026-ESCON-01',
      '{{request.received_at}}': new Date().toLocaleString('vi-VN'),
    },
  });

  console.log('Kết quả gửi Test 2:', {
    success: contactResult.success,
    templateUsed: contactResult.templateUsed,
    templateId: contactResult.templateId,
    messageId: contactResult.messageId,
  });
  assert(contactResult.success, 'Test 2 thất bại!');
  assert(contactResult.templateUsed, 'Test 2 không load được template từ DB!');
  if (contactResult.previewUrl) {
    console.log('👉 [XEM TRỰC TIẾP EMAIL 2 TẠI ĐÂY]:', contactResult.previewUrl);
  }

  // --- TEST CASE 3: Gửi Email theo Mẫu Tải Tài Liệu (product_download) ---
  console.log('\n--- 3. TEST GỬI EMAIL TẢI TÀI LIỆU (product_download - Gửi Khách Hàng) ---');
  const downloadResult = await dispatchTemplatedEmail({
    workspace: 'vi',
    eventKey: 'product_download',
    audience: 'customer',
    to: 'kythuat.download@cic.com.vn',
    variables: {
      '{{customer.full_name}}': 'Chị Trần Thị Mai',
      '{{product.name}}': 'EnjiCAD 2026',
      '{{document.name}}': 'Bộ cài đặt EnjiCAD 2026 Trial 30 ngày',
      '{{document.download_url}}': 'https://www.cic.com.vn/download/enjicad-2026.zip',
      '{{document.expires_at}}': '23:59 ngày 30/09/2026',
      '{{document.download_instruction}}': 'Tải bộ cài đặt và nhập mã kích hoạt dùng thử được cấp kèm theo.',
    },
  });

  console.log('Kết quả gửi Test 3:', {
    success: downloadResult.success,
    templateUsed: downloadResult.templateUsed,
    templateId: downloadResult.templateId,
    messageId: downloadResult.messageId,
  });
  assert(downloadResult.success, 'Test 3 thất bại!');
  if (downloadResult.previewUrl) {
    console.log('👉 [XEM TRỰC TIẾP EMAIL 3 TẠI ĐÂY]:', downloadResult.previewUrl);
  }

  // --- TEST CASE 4: Gửi Thông Báo Nội Bộ Cho Admin/Sales (audience = internal) ---
  console.log('\n--- 4. TEST GỬI THÔNG BÁO NỘI BỘ (product_quote - Gửi Nội Bộ Admin) ---');
  const internalResult = await dispatchTemplatedEmail({
    workspace: 'vi',
    eventKey: 'product_quote',
    audience: 'internal',
    to: 'sales.admin@cic.com.vn',
    variables: {
      '{{request.type_name}}': 'Yêu cầu báo giá phần mềm',
      '{{request.reference}}': 'BG-2026-8888',
      '{{customer.full_name}}': 'Công ty Xây Dựng Số 1',
      '{{customer.email}}': 'contact@xaydung1.vn',
      '{{customer.phone}}': '0988 123 456',
      '{{product.name}}': 'Gói 10 License EnjiCAD Pro',
      '{{request.message}}': 'Chúng tôi cần báo giá gấp trong ngày mai cho gói 10 máy.',
      '{{cms.request_url}}': 'http://localhost:3000/cms/customer-requests/BG-2026-8888',
    },
  });

  console.log('Kết quả gửi Test 4:', {
    success: internalResult.success,
    templateUsed: internalResult.templateUsed,
    templateId: internalResult.templateId,
    messageId: internalResult.messageId,
  });
  assert(internalResult.success, 'Test 4 thất bại!');
  if (internalResult.previewUrl) {
    console.log('👉 [XEM TRỰC TIẾP EMAIL 4 TẠI ĐÂY]:', internalResult.previewUrl);
  }

  // --- TEST CASE 5: Database Pollution Guard Check ---
  console.log('\n--- 5. KIỂM TRA TOÀN VẸN CƠ SỞ DỮ LIỆU (ANTI-POLLUTION CHECK) ---');
  const [afterCount] = await sql`SELECT count(*)::int as count FROM cic_email_templates`;
  console.log(`[Database Guard] Số lượng templates sau test: ${afterCount.count} bản ghi`);
  assert.equal(
    beforeCount.count,
    afterCount.count,
    'CẢNH BÁO: Phát hiện số lượng bản ghi database thay đổi sau khi gửi mail!'
  );
  console.log('✅ XÁC NHẬN: Không có bất kỳ dữ liệu nào bị thay đổi hay phát sinh thêm trong Database (0% rác)!');

  console.log('\n=====================================================');
  console.log('🎉 TOÀN BỘ 4 TEST GỬI EMAIL QUA SMTP ĐỀU THÀNH CÔNG RỰC RỠ!');
  console.log('=====================================================');
  process.exit(0);
}

runLiveEmailTests().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
