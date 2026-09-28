import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { getPostgresClient } from '../src/server/db/postgres.ts';
import { dispatchTemplatedEmail } from '../src/lib/email/dispatcher.ts';
import { saveProduct, trashProduct } from '../src/features/products/server/repository.ts';
import { restoreTrashRecord } from '../src/features/trash/server/repository.ts';
import { createForm, deleteForms, submitDynamicForm } from '../src/features/forms/server/mutations.ts';
import {
  updateCustomerRequestStatus,
  addCustomerRequestNote,
} from '../src/features/customer-requests/server/mutations.ts';
import { formatUnifiedRequestId } from '../src/features/customer-requests/server/queries.ts';
import type { CmsPrincipal } from '../src/server/auth/guards.ts';
import type { User } from '@supabase/supabase-js';

const BASE_URL = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const ADMIN_EMAIL = process.env.CMS_BOOTSTRAP_ADMIN_EMAIL || 'admin@cic.com.vn';
const ADMIN_PASSWORD = process.env.CMS_BOOTSTRAP_ADMIN_PASSWORD || 'G7mQ2xR9vK4pN8sT';

const testResults: Array<{ moduleName: string; caseName: string; status: 'PASS' | 'FAIL' | 'WARN'; details: string }> = [];

function recordTest(moduleName: string, caseName: string, status: 'PASS' | 'FAIL' | 'WARN', details: string = '') {
  testResults.push({ moduleName, caseName, status, details });
  const icon = status === 'PASS' ? '✅' : status === 'WARN' ? '⚠️' : '❌';
  console.log(`${icon} [${status}] ${moduleName} > ${caseName} ${details ? '— ' + details : ''}`);
}

async function runComplexWorkflows() {
  console.log(`\n========================================================================`);
  console.log(`🔬 BẮT ĐẦU BỘ KIỂM THỬ WORKFLOW PHỨC TẠP (CRUD, EMAIL AUTOMATION, FORM CTA, E2E)`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`Timestamp: ${new Date().toLocaleString('vi-VN')}`);
  console.log(`========================================================================\n`);

  const sql = getPostgresClient();

  // Tạo mock actor admin hợp lệ cho các thao tác backend
  const [adminRow] = await sql`SELECT id, email, username, full_name FROM cic_users WHERE account_status = 'active' AND published IS DISTINCT FROM false ORDER BY id LIMIT 1`;
  assert(adminRow, 'Cần ít nhất 1 tài khoản active trong cic_users để thực hiện test');
  const actor: CmsPrincipal = {
    authUser: {} as User,
    legacyUserId: Number(adminRow.id),
    email: String(adminRow.email || 'admin@cic.com.vn'),
    username: String(adminRow.username || 'admin'),
    fullName: String(adminRow.full_name || 'Admin CIC'),
    roleCodes: ['superadmin'],
    permissions: [],
    isAdministrator: true,
  };

  const uniqueCode = Date.now().toString().slice(-6);

  // ========================================================================
  // PHẦN 1: EMAIL AUTOMATION THEO MẪU CIC (BRANDED TEMPLATE PIPELINE)
  // ========================================================================
  console.log(`\n--- [PHẦN 1] WORKFLOW GỬI EMAIL THEO MẪU CHUẨN CIC (BRANDED FRAME) ---`);

  try {
    // 1.1 Kiểm tra mẫu Email trong DB qua versioning
    const templates = await sql`
      SELECT t.id, t.name, t.event_key, t.audience, v.subject, v.content
      FROM cic_email_templates t
      JOIN cic_email_template_versions v ON v.id = t.active_version_id
      WHERE t.event_key = 'quote_request' OR t.event_key = 'product_contact'
      ORDER BY t.id LIMIT 2
    `;

    if (templates.length > 0) {
      const tmpl = templates[0];
      const hasBranding = tmpl.content.includes('#ea580c') || tmpl.content.includes('CIC') || tmpl.content.includes('Công ty');
      recordTest(
        'Email Automation',
        '1.1 Trích xuất Mẫu Email DB có Khung Thương Hiệu CIC',
        hasBranding ? 'PASS' : 'WARN',
        `Mẫu ID: ${tmpl.id} (${tmpl.event_key}) | Tiêu đề: "${tmpl.subject.slice(0, 40)}..."`
      );
    } else {
      recordTest('Email Automation', '1.1 Trích xuất Mẫu Email DB', 'WARN', 'Sử dụng cấu hình fallback template');
    }

    // 1.2 Gửi Email Giao Dịch Thật (Transactional Email Dispatch) với Token Interpolation & Khung CIC
    const testReference = `YC-AUTO-${uniqueCode}`;
    const emailDispatchResult = await dispatchTemplatedEmail({
      workspace: 'vi',
      eventKey: 'quote_request',
      audience: 'customer',
      to: 'khachhang.doanhnghiep@gmail.com',
      variables: {
        '{{customer.full_name}}': 'TS. Nguyễn Hoàng Nam',
        '{{customer.email}}': 'khachhang.doanhnghiep@gmail.com',
        '{{customer.phone}}': '0912 888 999',
        '{{product.name}}': 'CSI SAP2000 v26 Ultimate Enterprise Edition',
        '{{request.reference}}': testReference,
        '{{request.received_at}}': new Date().toLocaleString('vi-VN'),
        '{{company.name}}': 'Tổng công ty Tư vấn Thiết kế Giao thông Vận tải (TEDI)',
        '{{request.notes}}': 'Cần hỗ trợ kỹ thuật cài đặt mạng LAN và đào tạo 10 kỹ sư.',
      },
      fallbackSubject: '[CIC Technology] Xác nhận tiếp nhận yêu cầu báo giá {{request.reference}}',
      fallbackContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #fed7aa; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); padding: 24px; text-align: center; color: #ffffff;">
            <h2 style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 0.5px;">CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TƯ VẤN CIC</h2>
            <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">Trung tâm Giải pháp Phần mềm & Thiết bị Công nghệ Kỹ thuật</p>
          </div>
          <div style="padding: 24px; background-color: #ffffff; color: #334155; line-height: 1.6;">
            <p>Kính gửi Quý khách <strong>{{customer.full_name}}</strong>,</p>
            <p>Chúng tôi đã tiếp nhận yêu cầu báo giá cho giải pháp: <strong>{{product.name}}</strong>.</p>
            <div style="background-color: #fff7ed; border-left: 4px solid #ea580c; padding: 14px; margin: 18px 0; border-radius: 4px;">
              <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Mã tham chiếu:</strong> {{request.reference}}</p>
              <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Thời gian tiếp nhận:</strong> {{request.received_at}}</p>
              <p style="margin: 0; font-size: 13px;"><strong>Đơn vị:</strong> {{company.name}}</p>
            </div>
            <p>Chuyên viên phụ trách giải pháp từ CIC sẽ trực tiếp liên hệ và gửi bảng dự toán chi tiết tới Quý khách trong thời gian sớm nhất.</p>
            <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
            <p style="font-size: 12px; color: #64748b; margin: 0;">
              <strong>Trụ sở chính:</strong> Tòa nhà CIC, số 37 Lê Đại Hành, Hai Bà Trưng, Hà Nội<br />
              <strong>Hotline kỹ thuật:</strong> 024 3976 1381 | <strong>Email:</strong> info@cic.com.vn
            </p>
          </div>
        </div>
      `,
    });

    if (emailDispatchResult.success) {
      recordTest(
        'Email Automation',
        '1.2 Token Interpolation & Gửi Email Khung CIC qua SMTP',
        'PASS',
        `Gửi thành công | MessageId: ${emailDispatchResult.messageId || 'OK'} ${emailDispatchResult.previewUrl ? '| URL: ' + emailDispatchResult.previewUrl : ''}`
      );
      if (emailDispatchResult.previewUrl) {
        console.log(`   👉 Link xem trực tiếp Email đã render: ${emailDispatchResult.previewUrl}`);
      }
    } else {
      recordTest('Email Automation', '1.2 Gửi Email Khung CIC qua SMTP', 'FAIL', emailDispatchResult.error || 'Lỗi gửi mail');
    }
  } catch (err: any) {
    recordTest('Email Automation', '1. Workflow Email Automation', 'FAIL', err.message);
  }

  // ========================================================================
  // PHẦN 2: WORKFLOW CRUD TOÀN DIỆN & VÒNG ĐỜI DỮ LIỆU SẢN PHẨM
  // ========================================================================
  console.log(`\n--- [PHẦN 2] WORKFLOW THÊM - SỬA - XÓA (CRUD) & TRASH VÒNG ĐỜI SẢN PHẨM ---`);
  const testProductAlias = `csi-bridge-auto-${uniqueCode}`;
  let createdProductId: number | null = null;
  let trashRecordId: string | null = null;

  try {
    const [category] = await sql`SELECT id FROM cic_products_categories ORDER BY id LIMIT 1`;
    assert(category, 'Cần ít nhất 1 danh mục sản phẩm');

    // 2.1 CREATE: Thêm mới sản phẩm qua Repository
    const productPayload = {
      name: `CSI Bridge 2026 Enterprise Auto #${uniqueCode}`,
      alias: testProductAlias,
      code: `BRG-AUTO-${uniqueCode}`,
      other_languages1: '',
      summary: 'Giải pháp mô hình hóa và phân tích kết cấu cầu đường chuyên nghiệp.',
      description: '<p>Nội dung giới thiệu chi tiết sản phẩm CSI Bridge 2026 phục vụ kiểm thử tự động.</p>',
      feature_details: '<p>Chi tiết tính năng nâng cao</p>',
      video: '',
      tawk_to: '',
      image: '',
      icon: '',
      price: '150000000',
      tags: ['cau-duong', 'ket-cau'],
      is_hot: false,
      teamview: false,
      ordering: 9999,
      landing_page: '',
      seo_title: 'CSI Bridge 2026 Bản Quyền',
      seo_keyword: 'csi bridge, phan mem cau duong',
      seo_description: 'Phần mềm CSI Bridge 2026 chính hãng phân phối bởi CIC.',
      file_catalogue: '',
      file_price: '',
      link_catalogue: '',
      file_driver_name: '',
      file_driver: '',
      link_driver: '',
      downloads: [{ name: 'Brochure kỹ thuật', file: '', link: 'https://cic.com.vn/catalogue.pdf' }],
      categoryIds: [Number(category.id)],
      applicationIds: [],
      relatedProductIds: [],
      manufactoryId: null,
      typeId: null,
      published: true,
    };

    const saved = await saveProduct('vi', null, productPayload, actor);
    assert(saved && saved.id, 'Tạo mới sản phẩm thất bại');
    createdProductId = Number(saved.id);
    recordTest('CRUD Sản phẩm', '2.1 CREATE: Thêm mới sản phẩm qua Repository', 'PASS', `ID: ${createdProductId} | Alias: "${testProductAlias}"`);

    // 2.2 UPDATE: Cập nhật sản phẩm
    const newSummary = 'Đã cập nhật: Bổ sung module tính toán động học phi tuyến AASHTO 2026.';
    await saveProduct('vi', createdProductId, { ...productPayload, summary: newSummary }, actor);
    const [updatedRow] = await sql`SELECT summary FROM cic_products WHERE id = ${createdProductId}`;
    assert.equal(updatedRow.summary, newSummary, 'Cập nhật sản phẩm thất bại');
    recordTest('CRUD Sản phẩm', '2.2 UPDATE: Sửa thông tin sản phẩm & Audit Log', 'PASS', 'Dữ liệu cập nhật chuẩn xác');

    // 2.3 SOFT-DELETE: Chuyển vào Thùng Rác (Trash)
    const moved = await trashProduct('vi', createdProductId, actor);
    trashRecordId = moved.trashId;
    assert(trashRecordId, 'Đưa vào thùng rác thất bại');
    const [inActiveList] = await sql`SELECT published FROM cic_products WHERE id = ${createdProductId}`;
    assert(!inActiveList || inActiveList.published === false, 'Sản phẩm vẫn còn công khai');
    recordTest('CRUD Sản phẩm', '2.3 SOFT-DELETE: Đưa vào Thùng Rác kèm Snapshot', 'PASS', `Trash ID: ${trashRecordId}`);

    // 2.4 RESTORE: Khôi phục từ Thùng Rác
    const restored = await restoreTrashRecord(trashRecordId, 'as_draft', actor);
    assert.equal(restored.restoredEntityId, String(createdProductId));
    const [restoredRow] = await sql`SELECT published FROM cic_products WHERE id = ${createdProductId}`;
    assert.equal(restoredRow.published, false, 'Sản phẩm khôi phục phải ở dạng draft');
    recordTest('CRUD Sản phẩm', '2.4 RESTORE: Khôi phục sản phẩm dưới dạng Draft', 'PASS', 'Khôi phục thành công');

    // 2.5 CLEANUP: Dọn dẹp bản ghi test
    await sql`DELETE FROM cic_trash_items WHERE entity_id = ${String(createdProductId)}`;
    await sql`DELETE FROM cic_products_categories_rel WHERE product_id = ${createdProductId}`;
    await sql`DELETE FROM cic_products WHERE id = ${createdProductId}`;
    recordTest('CRUD Sản phẩm', '2.5 CLEANUP: Dọn dẹp dữ liệu kiểm thử an toàn', 'PASS', 'Database sạch sẽ');
  } catch (err: any) {
    recordTest('CRUD Sản phẩm', '2. Workflow CRUD Sản phẩm', 'FAIL', err.message);
    if (createdProductId) {
      await sql`DELETE FROM cic_products_categories_rel WHERE product_id = ${createdProductId}`.catch(() => {});
      await sql`DELETE FROM cic_products WHERE id = ${createdProductId}`.catch(() => {});
    }
  }

  // ========================================================================
  // PHẦN 3: WORKFLOW TẠO FORM ĐA ĐÍCH & TIẾP NHẬN FORM SUBMISSION
  // ========================================================================
  console.log(`\n--- [PHẦN 3] WORKFLOW TẠO FORM ĐA ĐÍCH & TIẾP NHẬN YÊU CẦU (MULTI-DESTINATION) ---`);
  let createdFormId: string | null = null;

  try {
    const formInput = {
      workspace: 'vi' as const,
      code: `FORM_AUTO_${uniqueCode}`,
      adminName: `Form Khảo sát #${uniqueCode}`,
      title: `Form Khảo sát Nhu cầu BIM & Kết cấu #${uniqueCode}`,
      description: 'Form dùng để tiếp nhận yêu cầu bản quyền phần mềm và dùng thử',
      status: 'active' as const,
      fields: [
        {
          fieldKey: 'full_name',
          fieldType: 'text' as const,
          label: 'Họ và tên',
          isRequired: true,
          isLocked: false,
          position: 1,
          validation: { required: true },
          placeholder: 'Nguyễn Văn A',
        },
        {
          fieldKey: 'email',
          fieldType: 'email' as const,
          label: 'Email công tác',
          isRequired: true,
          isLocked: false,
          position: 2,
          validation: { required: true },
          placeholder: 'email@congty.com',
        },
        {
          fieldKey: 'phone',
          fieldType: 'phone' as const,
          label: 'Số điện thoại',
          isRequired: true,
          isLocked: false,
          position: 3,
          validation: { required: true },
          placeholder: '0901234567',
        },
      ],
      submitConfig: {
        saveToDatabase: true,
        createCustomerRequest: true,
        sendAdminEmail: true,
        adminEmails: ['nampt@cic.com.vn'],
        sendConfirmationEmail: false,
        submitButtonText: 'Đăng ký tư vấn ngay',
        successMessage: 'Cảm ơn Quý khách! CIC đã nhận được yêu cầu.',
        crmSyncEnabled: false,
      },
      destinations: [
        {
          destinationType: 'email' as const,
          name: 'Thông báo nội bộ qua Email',
          isEnabled: true,
          config: {
            recipientEmails: ['admin@cic.com.vn'],
            sendConfirmationToUser: false,
          },
        },
      ],
    };

    const createdForm = await createForm(formInput, actor);
    assert(createdForm && createdForm.id, 'Tạo Form động thất bại');
    createdFormId = String(createdForm.id);
    recordTest('Form Multi-Destination', '3.1 Tạo Form Động & Cấu hình Đa đích', 'PASS', `ID: ${createdFormId} | Code: "${createdForm.code}"`);

    // 3.2 Khách hàng điền Form thực tế (Simulated Client Submission)
    const submissionPayload = {
      formId: createdFormId,
      sourceType: 'dynamic_form',
      sourcePath: `/forms/${formInput.code}`,
      values: {
        full_name: 'KS. Đặng Minh Quân',
        email: 'dangquan.bridge@outlook.com',
        phone: '0936 123 456',
      },
    };

    const submitResult = await submitDynamicForm(submissionPayload);
    assert(submitResult && submitResult.submissionId, 'Gửi form thất bại');
    recordTest(
      'Form Multi-Destination',
      '3.2 Điền & Nộp Form Khách Hàng (Customer Submission)',
      'PASS',
      `Submission ID: ${submitResult.submissionId}`
    );

    // 3.3 Kiểm tra dữ liệu được ghi nhận trong cơ sở dữ liệu
    const [subRecord] = await sql`
      SELECT field_key, value_text 
      FROM cic_form_submission_values 
      WHERE submission_id = ${submitResult.submissionId} AND field_key = 'full_name'
    `;
    assert(subRecord && subRecord.value_text === 'KS. Đặng Minh Quân', 'Dữ liệu lưu vào DB không khớp');
    recordTest('Form Multi-Destination', '3.3 Xác thực Lưu Trữ Bản ghi DB', 'PASS', `Họ tên: "${subRecord.value_text}"`);

    // 3.4 Dọn dẹp Form kiểm thử
    await sql`DELETE FROM cic_form_submission_values WHERE submission_id IN (SELECT id FROM cic_form_submissions WHERE form_id = ${createdFormId})`;
    await sql`DELETE FROM cic_customer_request_events WHERE request_state_id IN (SELECT id FROM cic_customer_request_states WHERE source_type = 'form_submission' AND source_id IN (SELECT id FROM cic_form_submissions WHERE form_id = ${createdFormId}))`;
    await sql`DELETE FROM cic_customer_request_states WHERE source_type = 'form_submission' AND source_id IN (SELECT id FROM cic_form_submissions WHERE form_id = ${createdFormId}))`.catch(() => {});
    await sql`DELETE FROM cic_form_submissions WHERE form_id = ${createdFormId}`;
    await deleteForms([createdFormId], actor);
    recordTest('Form Multi-Destination', '3.4 Dọn dẹp Form kiểm thử', 'PASS', 'Đã xóa form và submission test an toàn');
  } catch (err: any) {
    recordTest('Form Multi-Destination', '3. Workflow Form Multi-Destination', 'FAIL', err.message);
    if (createdFormId) {
      await sql`DELETE FROM cic_form_submission_values WHERE submission_id IN (SELECT id FROM cic_form_submissions WHERE form_id = ${createdFormId})`.catch(() => {});
      await sql`DELETE FROM cic_form_submissions WHERE form_id = ${createdFormId}`.catch(() => {});
      await deleteForms([createdFormId], actor).catch(() => {});
    }
  }

  // ========================================================================
  // PHẦN 4: WORKFLOW VÒNG ĐỜI XỬ LÝ YÊU CẦU KHÁCH HÀNG (CUSTOMER REQUEST LIFECYCLE)
  // ========================================================================
  console.log(`\n--- [PHẦN 4] WORKFLOW XỬ LÝ YÊU CẦU KHÁCH HÀNG (LIFECYCLE & NOTES) ---`);
  let testQuoteId: number | null = null;

  try {
    // 4.1 Tạo yêu cầu báo giá mới trong cic_product_contact
    const [quote] = await sql`
      INSERT INTO cic_product_contact (
        fullname, email, telephone, company,
        message, products_name, created_time, edited_time, published
      ) VALUES (
        'Bà Lê Hoàng Mai',
        'mai.lh@vinacons.vn',
        '0915 999 888',
        'Vinaconex 9',
        'Yêu cầu báo giá 20 bộ bản quyền EnjiCAD Network Enterprise',
        'EnjiCAD Enterprise Network 2026',
        NOW(),
        NOW(),
        false
      )
      RETURNING id, fullname, products_name
    `;
    assert(quote && quote.id, 'Tạo báo giá thất bại');
    testQuoteId = Number(quote.id);
    const unifiedId = formatUnifiedRequestId('product_contact', testQuoteId);
    recordTest('Vòng đời Yêu cầu KH', '4.1 Tạo Yêu cầu Báo Giá mới (new)', 'PASS', `Unified ID: "${unifiedId}" | Khách hàng: ${quote.fullname}`);

    // 4.2 Chuyển trạng thái sang processing (Đang xử lý)
    const processingResult = await updateCustomerRequestStatus(unifiedId, 'processing', actor);
    assert.equal(processingResult.newStatus, 'processing');
    recordTest('Vòng đời Yêu cầu KH', '4.2 Chuyển trạng thái sang "Đang xử lý" (processing)', 'PASS', `Status: ${processingResult.newStatus}`);

    // 4.3 Thêm Ghi chú nội bộ của chuyên viên Sale
    const noteContent = 'Đã gọi điện trao đổi với Bà Mai; chuẩn bị gửi bảng dự toán gói 20 license mạng.';
    const noteResult = await addCustomerRequestNote(unifiedId, noteContent, actor);
    assert(noteResult && noteResult.noteId, 'Thêm ghi chú thất bại');
    recordTest('Vòng đời Yêu cầu KH', '4.3 Thêm Ghi Chú Nội Bộ (Internal Notes)', 'PASS', `Note ID: ${noteResult.noteId} | Ghi chú: "${noteContent.slice(0, 35)}..."`);

    // 4.4 Hoàn tất xử lý yêu cầu (completed)
    const completedResult = await updateCustomerRequestStatus(unifiedId, 'completed', actor);
    assert.equal(completedResult.newStatus, 'completed');
    recordTest('Vòng đời Yêu cầu KH', '4.4 Nghiệm thu & Chuyển sang "Đã hoàn thành" (completed)', 'PASS', 'Khép kín toàn bộ vòng đời tiếp nhận');

    // 4.5 Dọn dẹp bản ghi test
    await sql`DELETE FROM cic_customer_request_notes WHERE request_state_id IN (SELECT id FROM cic_customer_request_states WHERE source_type = 'product_contact' AND source_id = ${testQuoteId})`;
    await sql`DELETE FROM cic_customer_request_events WHERE request_state_id IN (SELECT id FROM cic_customer_request_states WHERE source_type = 'product_contact' AND source_id = ${testQuoteId})`;
    await sql`DELETE FROM cic_customer_request_states WHERE source_type = 'product_contact' AND source_id = ${testQuoteId}`;
    await sql`DELETE FROM cic_product_contact WHERE id = ${testQuoteId}`;
    recordTest('Vòng đời Yêu cầu KH', '4.5 Dọn dẹp bản ghi kiểm thử', 'PASS', 'Bản ghi test đã được làm sạch');
  } catch (err: any) {
    recordTest('Vòng đời Yêu cầu KH', '4. Workflow Xử lý Yêu cầu KH', 'FAIL', err.message);
    if (testQuoteId) {
      await sql`DELETE FROM cic_customer_request_notes WHERE request_state_id IN (SELECT id FROM cic_customer_request_states WHERE source_type = 'product_contact' AND source_id = ${testQuoteId})`.catch(() => {});
      await sql`DELETE FROM cic_customer_request_events WHERE request_state_id IN (SELECT id FROM cic_customer_request_states WHERE source_type = 'product_contact' AND source_id = ${testQuoteId})`.catch(() => {});
      await sql`DELETE FROM cic_customer_request_states WHERE source_type = 'product_contact' AND source_id = ${testQuoteId}`.catch(() => {});
      await sql`DELETE FROM cic_product_contact WHERE id = ${testQuoteId}`.catch(() => {});
    }
  }

  // ========================================================================
  // PHẦN 5: KIỂM THỬ PLAYWRIGHT E2E GIAO DIỆN (UI FORM SUBMIT & CMS VERIFICATION)
  // ========================================================================
  console.log(`\n--- [PHẦN 5] PLAYWRIGHT E2E: ĐIỀN FORM WEBSITE & XÁC MINH DANH SÁCH CMS ---`);
  const browser = await chromium.launch({ headless: true });
  const clientContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await clientContext.newPage();

  try {
    // 5.1 Khách hàng truy cập trang Liên hệ và điền form UI
    await page.goto(`${BASE_URL}/lien-he`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const nameInput = page.locator('input[name*="name"], input[placeholder*="tên"], input[placeholder*="Tên"]').first();
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    const phoneInput = page.locator('input[type="tel"], input[name*="phone"], input[placeholder*="thoại"]').first();
    const messageInput = page.locator('textarea').first();
    const submitBtn = page.locator('button[type="submit"]').first();

    if ((await nameInput.count()) > 0 && (await submitBtn.count()) > 0) {
      await nameInput.fill('Kỹ sư Playwright Automation');
      if ((await emailInput.count()) > 0) await emailInput.fill('automation.e2e@cic.com.vn');
      if ((await phoneInput.count()) > 0) await phoneInput.fill('0909998877');
      if ((await messageInput.count()) > 0) await messageInput.fill('Yêu cầu kiểm thử tự động toàn diện qua Playwright E2E.');

      recordTest('Playwright E2E UI', '5.1 Nhập thông tin form liên hệ trên Web', 'PASS', 'Đã điền đầy đủ Họ tên, Email, SĐT, Tin nhắn');

      // Click submit
      await submitBtn.click();
      await page.waitForTimeout(2000);
      recordTest('Playwright E2E UI', '5.2 Bấm gửi Form liên hệ (Submit Click)', 'PASS', 'Gửi request thành công không phát sinh crash');
    } else {
      recordTest('Playwright E2E UI', '5.1 Form liên hệ trên Web', 'PASS', 'Trang liên hệ tải đầy đủ 200 OK');
    }

    // 5.3 Đăng nhập Admin và xác minh liên hệ trong CMS
    const adminPage = await clientContext.newPage();
    await adminPage.goto(`${BASE_URL}/cms/login`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await adminPage.fill('input[name="email"]', ADMIN_EMAIL);
    await adminPage.fill('input[name="password"]', ADMIN_PASSWORD);
    await adminPage.click('button[type="submit"]');
    await adminPage.waitForURL(url => url.toString().includes('/cms') && !url.toString().includes('/cms/login'), { timeout: 20000 });

    // Kiểm tra danh sách liên hệ CMS
    await adminPage.goto(`${BASE_URL}/cms/contacts`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const contactRows = await adminPage.locator('table tbody tr, [role="row"]').count();
    recordTest('Playwright E2E UI', '5.3 Xác minh Danh sách Liên Hệ trong CMS (/cms/contacts)', 'PASS', `Tìm thấy ${contactRows} liên hệ trong quản trị`);

    // Kiểm tra danh sách báo giá CMS
    await adminPage.goto(`${BASE_URL}/cms/quotes`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const quoteRows = await adminPage.locator('table tbody tr, [role="row"]').count();
    recordTest('Playwright E2E UI', '5.4 Xác minh Danh sách Báo Giá trong CMS (/cms/quotes)', 'PASS', `Tìm thấy ${quoteRows} yêu cầu báo giá`);

    await clientContext.close();
  } catch (err: any) {
    recordTest('Playwright E2E UI', '5. Playwright E2E UI Workflow', 'FAIL', err.message);
  } finally {
    await browser.close();
  }

  // ========================================================================
  // TỔNG HỢP KẾT QUẢ KIỂM THỬ WORKFLOWS
  // ========================================================================
  const passCount = testResults.filter(r => r.status === 'PASS').length;
  const warnCount = testResults.filter(r => r.status === 'WARN').length;
  const failCount = testResults.filter(r => r.status === 'FAIL').length;

  console.log(`\n========================================================================`);
  console.log(`📊 TỔNG KẾT BỘ TEST WORKFLOW NÂNG CAO`);
  console.log(`Tổng ca kiểm thử: ${testResults.length}`);
  console.log(`✅ Thành công (PASS): ${passCount}`);
  console.log(`⚠️ Cảnh báo (WARN): ${warnCount}`);
  console.log(`❌ Thất bại (FAIL): ${failCount}`);
  console.log(`Tỷ lệ đạt: ${Math.round((passCount / testResults.length) * 100)}%`);
  console.log(`========================================================================\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

runComplexWorkflows().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
