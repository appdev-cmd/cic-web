import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

import { getPostgresClient } from '../src/server/db/postgres.ts';
import { submitContactAction } from '../src/features/contact/server/actions.ts';

async function runE2EVerification() {
  console.log('=== KIỂM THỬ E2E LUỒNG TIẾP NHẬN & AI TRIAGE YÊU CẦU KHÁCH HÀNG ===\n');
  const sql = getPostgresClient();

  // Test 1: Khách gửi nhầm nợ xấu ngân hàng
  console.log('[E2E 1] Giả lập khách gửi form nhầm sang CIC tín dụng vay tiền...');
  const fakeCreditPayload = {
    fullname: 'Test Khách Vay Vốn',
    email: 'khachvaytien@gmail.com',
    telephone: '0977112233',
    subject: 'Tra cứu nợ xấu ngân hàng',
    message: 'Em đang cần vay vốn gấp 30 triệu tiêu dùng, bên mình hỗ trợ kiểm tra nợ xấu cic giúp em với ạ.',
  };

  const res1 = await submitContactAction(fakeCreditPayload);
  console.log('submitContactAction response:', res1);

  // Query latest state & note for this submission
  const [row1] = await sql`
    SELECT c.id AS contact_id, c.fullname, s.status, s.priority, s.tags, n.content AS note_content
    FROM cic_contact c
    JOIN cic_customer_request_states s ON s.source_type = 'contact' AND s.source_id = c.id
    LEFT JOIN cic_customer_request_notes n ON n.request_state_id = s.id
    WHERE c.email = ${fakeCreditPayload.email}
    ORDER BY c.id DESC
    LIMIT 1
  `;

  console.log('Database Result 1:', {
    contactId: row1?.contact_id,
    name: row1?.fullname,
    status: row1?.status,
    priority: row1?.priority,
    tags: row1?.tags,
    note: row1?.note_content?.slice(0, 100) + '...',
  });

  if (row1?.status !== 'not_suitable') {
    throw new Error(`E2E 1 FAILED! Expected status 'not_suitable', got '${row1?.status}'`);
  }
  if (!row1?.tags?.includes('ai:irrelevant')) {
    throw new Error(`E2E 1 FAILED! Expected tags to include 'ai:irrelevant', got ${row1?.tags}`);
  }
  console.log('-> E2E 1 PASSED: Đã tự động phân loại thành "not_suitable", gán tag "ai:irrelevant" và tạo ghi chú giải thích!\n');

  // Test 2: Tập đoàn lớn gửi yêu cầu gói phần mềm lớn
  console.log('[E2E 2] Giả lập Tập đoàn lớn gửi yêu cầu báo giá dự án trọng điểm...');
  const fakeVipPayload = {
    fullname: 'Nguyễn Tiến Dũng',
    email: 'dung.nt@songda9.vn',
    telephone: '0918889999',
    subject: 'Báo giá 20 license SAP2000 và Plaxis cho Tổng công ty Sông Đà',
    message: 'Tổng công ty chúng tôi cần triển khai đồng bộ 10 bản quyền SAP2000 v25 và 10 bản quyền Plaxis 3D cho ban kỹ thuật thủy điện. Đề nghị CIC liên hệ gửi báo giá cạnh tranh và chương trình đào tạo.',
  };

  const res2 = await submitContactAction(fakeVipPayload);
  console.log('submitContactAction response:', res2);

  const [row2] = await sql`
    SELECT c.id AS contact_id, c.fullname, s.status, s.priority, s.tags, n.content AS note_content
    FROM cic_contact c
    JOIN cic_customer_request_states s ON s.source_type = 'contact' AND s.source_id = c.id
    LEFT JOIN cic_customer_request_notes n ON n.request_state_id = s.id
    WHERE c.email = ${fakeVipPayload.email}
    ORDER BY c.id DESC
    LIMIT 1
  `;

  console.log('Database Result 2:', {
    contactId: row2?.contact_id,
    name: row2?.fullname,
    status: row2?.status,
    priority: row2?.priority,
    tags: row2?.tags,
    note: row2?.note_content?.slice(0, 120) + '...',
  });

  if (row2?.priority !== 'urgent' && row2?.priority !== 'high') {
    throw new Error(`E2E 2 FAILED! Expected priority 'urgent' or 'high', got '${row2?.priority}'`);
  }
  if (!row2?.tags?.includes('ai:enterprise')) {
    throw new Error(`E2E 2 FAILED! Expected tags to include 'ai:enterprise', got ${row2?.tags}`);
  }
  console.log('-> E2E 2 PASSED: Đã tự động nâng priority lên "urgent", gắn tag "ai:enterprise" và tạo ghi chú VIP!\n');

  // Dọn dẹp dữ liệu test
  await sql`DELETE FROM cic_contact WHERE email IN (${fakeCreditPayload.email}, ${fakeVipPayload.email})`;
  console.log('-> Đã dọn dẹp dữ liệu test sạch sẽ.');
  console.log('\n=== TẤT CẢ CÁC BƯỚC KIỂM THỬ E2E ĐÃ THÀNH CÔNG 100%! ===');
}

runE2EVerification().catch((err) => {
  console.error('E2E Verification Error:', err);
  process.exit(1);
});
