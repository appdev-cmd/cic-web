import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

// Dynamic import of the typescript module or direct test of LLM call
import { analyzeCustomerRequestWithAi } from '../src/features/customer-requests/server/ai-triage.ts';

async function runTests() {
  console.log('--- BẮT ĐẦU KIỂM THỬ AI CUSTOMER REQUEST TRIAGE ---');

  // Test Case 1: Nhầm lẫn CIC Tín dụng / Nợ xấu ngân hàng
  console.log('\n[TEST 1] Khách hỏi vay tiền / kiểm tra nợ xấu ngân hàng:');
  const test1 = await analyzeCustomerRequestWithAi({
    fullname: 'Nguyễn Văn A',
    telephone: '0912345678',
    email: 'nguyenvana@gmail.com',
    subject: 'Kiểm tra điểm tín dụng',
    message: 'Chào cic, em muốn kiểm tra xem em có bị nợ xấu nhóm mấy ở ngân hàng không và vay được 50 triệu không ạ?',
  });
  console.log('Result 1:', JSON.stringify(test1, null, 2));
  if (test1.category !== 'irrelevant' || test1.suggestedStatus !== 'not_suitable') {
    throw new Error(`Test 1 FAILED! Expected category 'irrelevant' and status 'not_suitable', got ${test1.category}`);
  }
  console.log('-> TEST 1 PASSED! (Phát hiện chính xác nhầm lẫn tín dụng)');

  // Test Case 2: Tập đoàn lớn / Mua nhiều bản quyền / Dự án trọng điểm
  console.log('\n[TEST 2] Tập đoàn lớn cần báo giá gói 20 licenses phần mềm:');
  const test2 = await analyzeCustomerRequestWithAi({
    fullname: 'Trần Minh Đức',
    company: 'Tập đoàn Xây dựng Đèo Cả',
    telephone: '0988776655',
    email: 'ductm@deoca.vn',
    subject: 'Báo giá bản quyền Plaxis và SAP2000 cho dự án cao tốc',
    message: 'Chúng tôi đang chuẩn bị triển khai gói thầu hầm và nền đường cao tốc Bắc Nam, cần CIC cung cấp báo giá 15 license Plaxis 2D/3D Network và 10 license CSI SAP2000 v25 kèm khóa đào tạo chuyển giao cho 20 kỹ sư.',
  });
  console.log('Result 2:', JSON.stringify(test2, null, 2));
  if (test2.category !== 'enterprise' || (test2.priority !== 'urgent' && test2.priority !== 'high')) {
    throw new Error(`Test 2 FAILED! Expected category 'enterprise' and priority 'urgent'/'high', got ${test2.category}`);
  }
  console.log('-> TEST 2 PASSED! (Phát hiện chính xác Doanh nghiệp lớn / VIP)');

  // Test Case 3: Kỹ sư cá nhân hỏi mua 1 bản quyền ETABS
  console.log('\n[TEST 3] Kỹ sư cá nhân hỏi bản quyền thông thường:');
  const test3 = await analyzeCustomerRequestWithAi({
    fullname: 'Lê Hoàng Nam',
    company: 'Công ty TNHH Tư vấn Thiết kế Nam Phong',
    telephone: '0901234567',
    email: 'nam.le@namphong.vn',
    subject: 'Tư vấn phần mềm ETABS',
    message: 'Mình là kỹ sư kết cấu, đang muốn mua 1 license ETABS bản Standalone và hỏi về lịch thi chứng chỉ CSI của bên mình trong tháng tới.',
  });
  console.log('Result 3:', JSON.stringify(test3, null, 2));
  if (test3.category !== 'qualified' || test3.suggestedStatus !== 'new') {
    throw new Error(`Test 3 FAILED! Expected category 'qualified' and status 'new', got ${test3.category}`);
  }
  console.log('-> TEST 3 PASSED! (Phát hiện chính xác Khách tiềm năng chuẩn)');

  console.log('\n--- TẤT CẢ CÁC BÀI TEST ĐÃ VƯỢT QUA 100%! ---');
}

runTests().catch((err) => {
  console.error('Test suite encountered an error:', err);
  process.exit(1);
});
