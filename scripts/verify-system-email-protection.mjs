import assert from 'node:assert/strict';
import postgres from 'postgres';
import { sendWelcomeUserEmail, sendPasswordResetEmail } from '../src/lib/email/templates/auth-emails.ts';
import { trashEmailTemplates, deleteEmailTemplates, updateEmailTemplate } from '../src/features/email-templates/server/mutations.ts';

const sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL);

async function main() {
  console.log('=== VERIFYING SYSTEM EMAIL TEMPLATE PROTECTION ===');

  // 1. Fetch system templates
  const systemTemplates = await sql`
    SELECT id::text, name, event_key, is_system, status 
    FROM cic_email_templates 
    WHERE is_system = true
  `;
  console.log('System templates found:', systemTemplates.length);
  assert(systemTemplates.length >= 2, 'Must have at least 2 system templates (welcome & forgot password)');

  const welcomeTemplate = systemTemplates.find(t => t.event_key === 'auth_activate');
  const forgotTemplate = systemTemplates.find(t => t.event_key === 'auth_forgot_password');
  assert(welcomeTemplate, 'Must have active auth_activate system template');
  assert(forgotTemplate, 'Must have active auth_forgot_password system template');

  const [actorRow] = await sql`
    SELECT id, email, username, full_name
    FROM cic_users
    WHERE account_status = 'active'
    ORDER BY id LIMIT 1
  `;
  const principal = {
    authUser: {},
    legacyUserId: Number(actorRow.id),
    email: String(actorRow.email || 'admin@cic.com.vn'),
    username: String(actorRow.username || 'admin'),
    fullName: String(actorRow.full_name || 'Admin'),
    roleCodes: ['superadmin'],
    permissions: [],
    isAdministrator: true,
  };

  // 2. Test: Cannot move system template to trash
  console.log('Test 1: Attempting to trash system template (MUST FAIL)...');
  await assert.rejects(
    () => trashEmailTemplates([welcomeTemplate.id], principal),
    (err) => {
      assert(err.message.includes('bảo vệ') || err.message.includes('hệ thống'), `Error message must explain protection: ${err.message}`);
      return true;
    },
    'Should not allow trashing system email templates'
  );
  console.log('✓ Successfully blocked trashing system email template.');

  // 3. Test: Cannot permanently delete system template
  console.log('Test 2: Attempting to delete system template (MUST FAIL)...');
  await assert.rejects(
    () => deleteEmailTemplates([welcomeTemplate.id]),
    (err) => {
      assert(err.message.includes('bảo vệ') || err.message.includes('hệ thống'), `Error message must explain protection: ${err.message}`);
      return true;
    },
    'Should not allow deleting system email templates'
  );
  console.log('✓ Successfully blocked deleting system email template.');

  // 4. Test: Updating content/subject is allowed (flexibility)
  console.log('Test 3: Updating system template subject & content (MUST SUCCEED)...');
  const updateResult = await updateEmailTemplate(
    welcomeTemplate.id,
    {
      subject: '[CIC Portal] Thông tin tài khoản quản trị hệ thống của bạn (Cập nhật)',
    },
    principal
  );
  assert(updateResult.versionNumber > 1, 'Version number should increment');
  console.log('✓ System template can be updated and versioned freely.');

  // 5. Test: Cannot change event of system template
  console.log('Test 4: Attempting to change event of system template (MUST FAIL)...');
  await assert.rejects(
    () => updateEmailTemplate(welcomeTemplate.id, { event: 'product_contact' }, principal),
    (err) => {
      assert(err.message.includes('sự kiện') || err.message.includes('hệ thống'), `Error: ${err.message}`);
      return true;
    },
    'Should block changing event key on system templates'
  );
  console.log('✓ Successfully blocked changing event on system template.');

  // Revert subject back
  await updateEmailTemplate(
    welcomeTemplate.id,
    {
      subject: '[CIC Portal] Thông tin tài khoản quản trị hệ thống của bạn',
    },
    principal
  );

  console.log('=== ALL SYSTEM EMAIL TEMPLATE CHECKS PASSED ===');
}

main().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
}).finally(() => {
  sql.end({ timeout: 2 });
});
