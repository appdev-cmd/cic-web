import assert from 'node:assert/strict';
import { getPostgresClient } from '../src/server/db/postgres.ts';
import {
  listEmailTemplates,
  getEmailTemplateDetail,
  getEmailTemplateForEvent,
} from '../src/features/email-templates/server/queries.ts';
import {
  createEmailTemplate,
  updateEmailTemplate,
  publishEmailTemplate,
  duplicateEmailTemplate,
  archiveEmailTemplates,
} from '../src/features/email-templates/server/mutations.ts';
import { interpolateTokens } from '../src/lib/email/tokens.ts';
import { dispatchTemplatedEmail } from '../src/lib/email/dispatcher.ts';

async function main() {
  console.log('=== START EMAIL TEMPLATES VERIFICATION ===');
  const sql = getPostgresClient();

  // 1. Check template count in DB
  const [tmplCount] = await sql`SELECT count(*)::int as count FROM cic_email_templates`;
  const [verCount] = await sql`SELECT count(*)::int as count FROM cic_email_template_versions`;
  console.log(`[1] Database check: ${tmplCount.count} templates, ${verCount.count} versions found.`);
  assert(tmplCount.count >= 10, 'Expected at least 10 seeded email templates in database.');
  assert(verCount.count >= 10, 'Expected at least 10 seeded email template versions in database.');

  // 2. Query list for VI and EN
  const viList = await listEmailTemplates({ workspace: 'vi' });
  const enList = await listEmailTemplates({ workspace: 'en' });
  console.log(`[2] Query list: VI has ${viList.length} templates, EN has ${enList.length} templates.`);
  assert(viList.length > 0, 'VI list should not be empty');
  assert(enList.length > 0, 'EN list should not be empty');

  // Verify first item structure
  const first = viList[0];
  assert(first.id, 'Template should have an ID');
  assert(first.name, 'Template should have a name');
  assert(first.subject, 'Template should have a subject from active/draft version');
  assert(first.content, 'Template should have content from active/draft version');
  console.log(`[2.1] First VI template: "${first.name}" (version: ${first.version}, status: ${first.status})`);

  // 3. Query template for event
  const contactTmpl = await getEmailTemplateForEvent('vi', 'product_contact', 'customer');
  console.log('[3] Query for product_contact event:', contactTmpl ? `Found (ID: ${contactTmpl.templateId})` : 'Not found');
  assert(contactTmpl, 'Expected active template for product_contact customer');

  // 4. Test Token Interpolation
  const rawText = 'Xin chào {{customer.full_name}}, bạn vừa quan tâm sản phẩm {{product.name}}!';
  const interpolated = interpolateTokens(rawText, {
    '{{customer.full_name}}': 'Nguyễn Văn An',
    '{{product.name}}': 'Phần mềm EnjiCAD',
  });
  console.log('[4] Token interpolation test:');
  console.log('    Raw:         ', rawText);
  console.log('    Interpolated:', interpolated);
  assert(interpolated === 'Xin chào Nguyễn Văn An, bạn vừa quan tâm sản phẩm Phần mềm EnjiCAD!');

  // Also test legacy {name} compatibility
  const legacyText = 'Kính gửi {name}! Cảm ơn bạn quan tâm {name1}. Link: {link1}';
  const legacyInterpolated = interpolateTokens(legacyText, {
    '{{customer.full_name}}': 'Trần Văn Bình',
    '{{product.name}}': 'Escon 15',
    '{{document.download_url}}': 'https://cic.com.vn/download/escon.zip',
  });
  console.log('    Legacy token test:', legacyInterpolated);
  assert(legacyInterpolated === 'Kính gửi Trần Văn Bình! Cảm ơn bạn quan tâm Escon 15. Link: https://cic.com.vn/download/escon.zip');

  // 5. Test CRUD & Versioning
  const [actor] = await sql`SELECT id FROM cic_users WHERE account_status = 'active' ORDER BY id LIMIT 1`;
  const actorId = actor ? Number(actor.id) : null;

  console.log('[5] Testing Create Email Template...');
  const createRes = await createEmailTemplate(
    {
      workspace: 'vi',
      name: '[VERIFY_TEST] Mẫu kiểm thử tự động',
      event: 'product_contact',
      audience: 'customer',
      subject: 'Tiêu đề bản nháp 1: {{request.reference}}',
      content: 'Nội dung bản nháp 1 gửi {{customer.full_name}}',
      status: 'draft',
    },
    actorId
  );
  console.log('    Created template ID:', createRes.id, 'version:', createRes.versionNumber);
  assert.equal(createRes.versionNumber, 1);

  // Read back detail
  const detail1 = await getEmailTemplateDetail(createRes.id);
  assert(detail1, 'Should find created template');
  assert.equal(detail1.name, '[VERIFY_TEST] Mẫu kiểm thử tự động');
  assert.equal(detail1.versions.length, 1);
  assert.equal(detail1.subject, 'Tiêu đề bản nháp 1: {{request.reference}}');

  // 6. Test Update (Version Increment)
  console.log('[6] Testing Update Email Template (new version)...');
  const updateRes = await updateEmailTemplate(
    createRes.id,
    {
      subject: 'Tiêu đề bản nháp 2 đã sửa: {{request.reference}}',
      content: 'Nội dung bản nháp 2 đã sửa cho {{customer.full_name}}',
    },
    actorId
  );
  console.log('    Updated to version:', updateRes.versionNumber);
  assert.equal(updateRes.versionNumber, 2);

  const detail2 = await getEmailTemplateDetail(createRes.id);
  assert(detail2, 'Should find updated template');
  assert.equal(detail2.versions.length, 2);
  assert.equal(detail2.subject, 'Tiêu đề bản nháp 2 đã sửa: {{request.reference}}');

  // 7. Test Publish
  console.log('[7] Testing Publish Template Version 2...');
  const pubRes = await publishEmailTemplate(createRes.id, updateRes.versionId, actorId);
  console.log('    Published status:', pubRes.status, 'activeVersionId:', pubRes.activeVersionId);
  assert.equal(pubRes.status, 'active');

  const detailPub = await getEmailTemplateDetail(createRes.id);
  assert.equal(detailPub?.status, 'active');
  assert.equal(detailPub?.activeVersionId, updateRes.versionId);

  // 8. Test Duplicate
  console.log('[8] Testing Duplicate Template...');
  const dupRes = await duplicateEmailTemplate(createRes.id, actorId);
  console.log('    Duplicated template ID:', dupRes.id);
  const dupDetail = await getEmailTemplateDetail(dupRes.id);
  assert(dupDetail, 'Should find duplicated template');
  assert(dupDetail.name.includes('(Bản sao)'), 'Duplicated template should have (Bản sao)');
  assert.equal(dupDetail.status, 'draft');

  // 9. Test Dispatch Email Simulation
  console.log('[9] Testing Dispatch Templated Email (Simulated)...');
  const dispatchRes = await dispatchTemplatedEmail({
    workspace: 'vi',
    eventKey: 'product_contact',
    audience: 'customer',
    to: 'test.customer@example.com',
    variables: {
      '{{customer.full_name}}': 'Nguyễn Văn Test',
      '{{product.name}}': 'EnjiCAD 2026',
      '{{request.reference}}': 'TEST-REF-999',
    },
  });
  console.log('    Dispatch result:', dispatchRes);
  assert(dispatchRes.success, 'Dispatch email should succeed');
  assert(dispatchRes.templateUsed, 'Dispatch email should use database template');

  // 10. Cleanup test templates
  console.log('[10] Cleaning up test templates...');
  await sql`UPDATE cic_email_templates SET active_version_id = NULL, draft_version_id = NULL WHERE id IN (${createRes.id}, ${dupRes.id})`;
  await sql`DELETE FROM cic_email_template_versions WHERE template_id IN (${createRes.id}, ${dupRes.id})`;
  await sql`DELETE FROM cic_email_templates WHERE id IN (${createRes.id}, ${dupRes.id})`;
  console.log('    Test records cleaned up.');

  console.log('=== ALL EMAIL TEMPLATES VERIFICATIONS PASSED SUCCESSFULLY! ===');
  process.exit(0);
}

main().catch((err) => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});
