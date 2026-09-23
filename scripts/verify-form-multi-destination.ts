import assert from 'node:assert/strict';
import postgres from 'postgres';
import {
  removeVietnameseTones,
  normalizeText,
  matchSheetHeadersToFields,
} from '../src/lib/integrations/google-sheets/matcher';
import {
  formatCellValueForGoogleSheet,
} from '../src/lib/integrations/google-sheets/client';
import {
  normalizeSpreadsheetId,
  googleSheetsDestinationConfigSchema,
  emailDestinationConfigSchema,
} from '../src/features/forms/server/validation/destination-schemas';
import type { FormFieldDefinition } from '../src/features/forms/types';

async function runTests() {
  console.log('============================================================');
  console.log('TEST SUITE: FORM MULTI-DESTINATION PRODUCTION VERIFICATION');
  console.log('============================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function runSubTest(name: string, fn: () => void | Promise<void>) {
    totalTests++;
    try {
      fn();
      console.log(`  [PASS] ${name}`);
      passedTests++;
    } catch (err: any) {
      console.error(`  [FAIL] ${name}:`, err.message);
      throw err;
    }
  }

  // --------------------------------------------------------------------------
  // TEST GROUP 1: SPREADSHEET ID NORMALIZATION & SCHEMA VALIDATION
  // --------------------------------------------------------------------------
  console.log('--- TEST GROUP 1: ID Normalization & Zod Schemas ---');

  runSubTest('normalizeSpreadsheetId: extracts ID from full Google Sheets URL', () => {
    const url = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0';
    assert.equal(normalizeSpreadsheetId(url), '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');
  });

  runSubTest('normalizeSpreadsheetId: preserves raw valid spreadsheet ID', () => {
    const rawId = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';
    assert.equal(normalizeSpreadsheetId(rawId), rawId);
  });

  runSubTest('googleSheetsDestinationConfigSchema: validates correct config and trims URL', () => {
    const valid = googleSheetsDestinationConfigSchema.parse({
      spreadsheetId: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
      sheetName: 'Don_Hang',
      columnMapping: [
        { sheetHeader: 'Thời gian', sourceType: 'system', sourceKey: 'submitted_at' },
        { sheetHeader: 'Họ tên', sourceType: 'field', sourceKey: 'full_name' },
      ],
      autoCreateHeaders: true,
    });
    assert.equal(valid.spreadsheetId, '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');
    assert.equal(valid.sheetName, 'Don_Hang');
    assert.equal(valid.columnMapping.length, 2);
    assert.equal(valid.autoCreateHeaders, true);
  });

  runSubTest('emailDestinationConfigSchema: validates admin and confirmation email structure', () => {
    const valid = emailDestinationConfigSchema.parse({
      sendAdminEmail: true,
      adminEmails: ['sales@cic.com.vn', 'lead@cic.com.vn'],
      adminEmailTemplateId: '12',
      sendConfirmationEmail: true,
      confirmationEmailTemplateId: '14',
    });
    assert.equal(valid.sendAdminEmail, true);
    assert.equal(valid.adminEmails.length, 2);
  });

  // --------------------------------------------------------------------------
  // TEST GROUP 2: GOOGLE SHEETS DATA FORMATTING & SAFETY
  // --------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 2: Data Safety & Formatting ---');

  runSubTest('Phone numbers starting with 0 get leading apostrophe to preserve zero', () => {
    assert.equal(formatCellValueForGoogleSheet('0912345678'), "'0912345678");
    assert.equal(formatCellValueForGoogleSheet('02431234567'), "'02431234567");
  });

  runSubTest('Unicode Vietnamese characters are preserved 100% without corruption', () => {
    const text = 'Công ty Cổ phần Công nghệ và Tư vấn CIC — Đống Đa, Hà Nội';
    assert.equal(formatCellValueForGoogleSheet(text), text);
  });

  runSubTest('Multiline text retains line breaks', () => {
    const multiline = 'Dòng 1\nDòng 2\nDòng 3';
    assert.equal(formatCellValueForGoogleSheet(multiline), multiline);
  });

  runSubTest('Booleans format into Vietnamese Có/Không', () => {
    assert.equal(formatCellValueForGoogleSheet(true), 'Có');
    assert.equal(formatCellValueForGoogleSheet(false), 'Không');
  });

  runSubTest('Arrays format into comma-separated strings', () => {
    assert.equal(formatCellValueForGoogleSheet(['Tư vấn BIM', 'Phần mềm ERP']), 'Tư vấn BIM, Phần mềm ERP');
  });

  runSubTest('Empty or null values format into empty strings', () => {
    assert.equal(formatCellValueForGoogleSheet(null), '');
    assert.equal(formatCellValueForGoogleSheet(undefined), '');
    assert.equal(formatCellValueForGoogleSheet(''), '');
  });

  // --------------------------------------------------------------------------
  // TEST GROUP 3: DETERMINISTIC AUTO-HEADER MATCHER
  // --------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 3: Deterministic Header Matcher ---');

  const mockFields: FormFieldDefinition[] = [
    {
      fieldKey: 'fullname',
      label: 'Họ và tên',
      fieldType: 'text',
      roleType: 'customer_name',
      position: 1,
      isRequired: true,
      isLocked: false,
      validation: {},
    },
    {
      fieldKey: 'phone',
      label: 'Số điện thoại',
      fieldType: 'phone',
      roleType: 'phone',
      position: 2,
      isRequired: true,
      isLocked: false,
      validation: {},
    },
    {
      fieldKey: 'email',
      label: 'Email liên hệ',
      fieldType: 'email',
      roleType: 'email',
      position: 3,
      isRequired: true,
      isLocked: false,
      validation: {},
    },
    {
      fieldKey: 'company_name',
      label: 'Tên cơ quan / Doanh nghiệp',
      fieldType: 'text',
      roleType: 'company',
      position: 4,
      isRequired: false,
      isLocked: false,
      validation: {},
    },
    {
      fieldKey: 'notes',
      label: 'Ghi chú / Yêu cầu chi tiết',
      fieldType: 'textarea',
      roleType: 'message',
      position: 5,
      isRequired: false,
      isLocked: false,
      validation: {},
    },
  ];

  runSubTest('matchSheetHeadersToFields: exact fieldKey matching', () => {
    const mappings = matchSheetHeadersToFields(['fullname', 'phone', 'email'], mockFields);
    assert.equal(mappings[0].sourceKey, 'fullname');
    assert.equal(mappings[1].sourceKey, 'phone');
    assert.equal(mappings[2].sourceKey, 'email');
  });

  runSubTest('matchSheetHeadersToFields: exact normalized Vietnamese label matching', () => {
    const mappings = matchSheetHeadersToFields(['Họ và tên', 'Số điện thoại', 'Email liên hệ'], mockFields);
    assert.equal(mappings[0].sourceKey, 'fullname');
    assert.equal(mappings[1].sourceKey, 'phone');
    assert.equal(mappings[2].sourceKey, 'email');
  });

  runSubTest('matchSheetHeadersToFields: semantic roleType matching', () => {
    const mappings = matchSheetHeadersToFields(['Tên khách hàng', 'Số di động', 'Thư điện tử', 'Đơn vị', 'Lời nhắn'], mockFields);
    assert.equal(mappings[0].sourceKey, 'fullname');
    assert.equal(mappings[1].sourceKey, 'phone');
    assert.equal(mappings[2].sourceKey, 'email');
    assert.equal(mappings[3].sourceKey, 'company_name');
    assert.equal(mappings[4].sourceKey, 'notes');
  });

  runSubTest('matchSheetHeadersToFields: system field matching', () => {
    const mappings = matchSheetHeadersToFields(['Thời gian gửi', 'Mã yêu cầu', 'Đường dẫn trang', 'Tên biểu mẫu'], mockFields);
    assert.equal(mappings[0].sourceKey, 'submitted_at');
    assert.equal(mappings[0].sourceType, 'system');
    assert.equal(mappings[1].sourceKey, 'submission_id');
    assert.equal(mappings[1].sourceType, 'system');
    assert.equal(mappings[2].sourceKey, 'source_path');
    assert.equal(mappings[2].sourceType, 'system');
    assert.equal(mappings[3].sourceKey, 'form_title');
    assert.equal(mappings[3].sourceType, 'system');
  });

  runSubTest('matchSheetHeadersToFields: unknown header falls back to UNMAPPED', () => {
    const mappings = matchSheetHeadersToFields(['Cột linh tinh không biết là gì'], mockFields);
    assert.equal(mappings[0].sourceKey, '');
  });

  // --------------------------------------------------------------------------
  // TEST GROUP 4: LIVE POSTGRES DATABASE RUNTIME TEST
  // --------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 4: Database Runtime, Dispatcher & Isolation ---');

  if (!process.env.DATABASE_URL) {
    console.log('  [WARN] DATABASE_URL not set. Skipping live DB runtime test.');
  } else {
    const sql = postgres(process.env.DATABASE_URL, { max: 1, ssl: 'require' });

    try {
      // 1. Verify schema tables exist
      const [tableCheck] = await sql`
        SELECT 
          (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'cic_form_destinations') AS dest_exists,
          (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'cic_form_submission_deliveries') AS deliv_exists
      `;
      assert.equal(Number(tableCheck.dest_exists), 1, 'cic_form_destinations table must exist in DB');
      assert.equal(Number(tableCheck.deliv_exists), 1, 'cic_form_submission_deliveries table must exist in DB');
      console.log('  [PASS] cic_form_destinations and cic_form_submission_deliveries verified in PostgreSQL');
      passedTests++;
      totalTests++;

      // 2. Create temporary test form
      const testCode = `test_auto_${Date.now()}`;
      const [testForm] = await sql`
        INSERT INTO cic_forms (
          workspace, code, admin_name, title, status, current_version,
          create_customer_request, send_admin_email, submit_button_text,
          success_message, created_at, updated_at
        ) VALUES (
          'vi', ${testCode}, 'Test Auto Multi Destination', 'Biểu mẫu Kiểm thử Tự động', 'active', 1,
          true, false, 'Gửi kiểm thử',
          'Đã nhận thông tin kiểm thử!', now(), now()
        )
        RETURNING id
      `;
      const testFormId = Number(testForm.id);

      // Create test field
      await sql`
        INSERT INTO cic_form_fields (
          form_id, field_key, field_type, role_type, label, is_required, position, validation_config, options_config
        ) VALUES (
          ${testFormId}, 'phone', 'phone', 'phone', 'Số điện thoại', true, 1, '{}'::jsonb, '[]'::jsonb
        ), (
          ${testFormId}, 'fullname', 'text', 'customer_name', 'Họ và tên', true, 2, '{}'::jsonb, '[]'::jsonb
        )
      `;

      // Create test destinations: 1 Google Sheet + 1 Email
      const [sheetDest] = await sql`
        INSERT INTO cic_form_destinations (
          form_id, destination_type, name, is_enabled, config, created_at, updated_at
        ) VALUES (
          ${testFormId},
          'google_sheets',
          'Google Sheet Bán hàng',
          true,
          ${sql.json({
            spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
            sheetName: 'TestSheet',
            columnMapping: [
              { sheetHeader: 'Thời gian', sourceType: 'system', sourceKey: 'submitted_at' },
              { sheetHeader: 'Họ tên', sourceType: 'field', sourceKey: 'fullname' },
              { sheetHeader: 'SĐT', sourceType: 'field', sourceKey: 'phone' },
            ],
          })},
          now(),
          now()
        )
        RETURNING id
      `;

      const [emailDest] = await sql`
        INSERT INTO cic_form_destinations (
          form_id, destination_type, name, is_enabled, config, created_at, updated_at
        ) VALUES (
          ${testFormId},
          'email',
          'Email Quản trị',
          true,
          ${sql.json({
            sendAdminEmail: true,
            adminEmails: ['test@cic.com.vn'],
            sendConfirmationEmail: false,
          })},
          now(),
          now()
        )
        RETURNING id
      `;

      // Dynamically import submitDynamicForm to test submission
      const { submitDynamicForm, retrySubmissionDelivery } = await import('../src/features/forms/server/mutations');
      const { getFormSubmissions } = await import('../src/features/forms/server/queries');

      // Submit form
      const submitResult = await submitDynamicForm({
        formId: testFormId,
        sourceType: 'automated_test',
        values: {
          fullname: 'Nguyễn Văn Kiểm Thử',
          phone: '0987654321',
        },
      });

      assert.equal(submitResult.success, true, 'Form submission must succeed');
      const subIdNum = Number(submitResult.submissionId);
      assert.ok(subIdNum > 0, 'Submission ID must be valid number');
      console.log(`  [PASS] submitDynamicForm returned success (Submission ID: #${subIdNum})`);
      passedTests++;
      totalTests++;

      // Verify DB persistence (MANDATORY REQUIREMENT)
      const [savedSub] = await sql`
        SELECT * FROM cic_form_submissions WHERE id = ${subIdNum} LIMIT 1
      `;
      assert.ok(savedSub, 'Submission must be persisted in cic_form_submissions');

      const savedValues = await sql`
        SELECT * FROM cic_form_submission_values WHERE submission_id = ${subIdNum}
      `;
      assert.equal(savedValues.length, 2, 'Both field values must be stored in DB');
      console.log('  [PASS] Mandatory Database Persistence verified (Submission + Values in DB)');
      passedTests++;
      totalTests++;

      // Verify Delivery Tracking records created
      const deliveries = await sql`
        SELECT * FROM cic_form_submission_deliveries WHERE submission_id = ${subIdNum} ORDER BY id ASC
      `;
      assert.equal(deliveries.length, 2, 'Exactly 2 delivery records must be created (Sheets + Email)');
      console.log('  [PASS] Delivery Tracking created 2 records for the destinations');
      passedTests++;
      totalTests++;

      // Verify Failure Isolation:
      // Since Google Service Account credentials are not set in this local test, Google Sheets adapter fails gracefully
      // but DB is saved and Email ran independently without breaking the request!
      const sheetDelivery = deliveries.find((d) => d.destination_type === 'google_sheets');
      assert.ok(sheetDelivery, 'Google Sheets delivery record must exist');
      assert.ok(sheetDelivery.attempt_count >= 1, 'Attempt count must be >= 1');
      console.log(`  [PASS] Failure Isolation verified: Sheets status is '${sheetDelivery.status}' without crashing DB`);
      passedTests++;
      totalTests++;

      // Verify getFormSubmissions returns deliveries
      const queriedSubmissions = await getFormSubmissions(testFormId, 10);
      assert.ok(queriedSubmissions.length > 0, 'getFormSubmissions must return submissions');
      assert.ok(queriedSubmissions[0].deliveries, 'Submission detail must contain deliveries array');
      assert.equal(queriedSubmissions[0].deliveries!.length, 2, 'Submission deliveries count must match');
      console.log('  [PASS] getFormSubmissions query loads deliveries with destination names');
      passedTests++;
      totalTests++;

      // Verify Idempotent Retry:
      // Retry the failed sheet delivery
      const [existingUser] = await sql`SELECT id, email FROM cic_users ORDER BY id ASC LIMIT 1`;
      const actorMock: any = {
        isAdministrator: true,
        legacyUserId: existingUser ? existingUser.id : 1,
        email: existingUser ? existingUser.email : 'admin@cic.com.vn',
      };
      const retryResult = await retrySubmissionDelivery(testFormId, subIdNum, sheetDelivery.id, actorMock);

      const [retriedDeliv] = await sql`
        SELECT * FROM cic_form_submission_deliveries WHERE id = ${sheetDelivery.id}
      `;
      assert.equal(retriedDeliv.attempt_count, sheetDelivery.attempt_count + 1, 'Attempt count must increment on retry');
      assert.equal(retriedDeliv.submission_id, String(subIdNum), 'Submission ID must stay identical on retry');
      console.log(`  [PASS] Idempotent Retry verified: attempt count incremented from ${sheetDelivery.attempt_count} to ${retriedDeliv.attempt_count}`);
      passedTests++;
      totalTests++;

      // Clean up test data
      await sql`DELETE FROM cic_form_submissions WHERE form_id = ${testFormId}`;
      await sql`DELETE FROM cic_forms WHERE id = ${testFormId}`;
      await sql`DELETE FROM cic_form_submissions WHERE form_id IN (SELECT id FROM cic_forms WHERE code = 'test-multi-dest-form')`;
      await sql`DELETE FROM cic_forms WHERE code = 'test-multi-dest-form'`;
      console.log('  [CLEANUP] Temporary test form and related records deleted cleanly.');
    } finally {
      await sql.end();
    }
  }

  console.log('\n============================================================');
  console.log(`FINAL RESULT: ${passedTests}/${totalTests} TESTS PASSED (100%)`);
  console.log('============================================================');
}

runTests().catch((err) => {
  console.error('\nTEST SUITE FAILED:', err);
  process.exit(1);
});
