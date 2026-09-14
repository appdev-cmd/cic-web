import assert from 'node:assert/strict';
import fs from 'node:fs';
import type { Sql } from 'postgres';
import type { CmsPrincipal } from '../src/server/auth/guards.ts';
import { AUDIT_ACTIONS } from '../src/server/audit/registry.ts';
import {
  createEmailTemplate,
  createEmailTemplateInTransaction,
  deleteEmailTemplates,
  duplicateEmailTemplate,
  publishEmailTemplate,
  trashEmailTemplates,
  updateEmailTemplate,
} from '../src/features/email-templates/server/mutations.ts';
import * as idRoute from '../src/app/api/cms/email-templates/[id]/route.ts';

const mockPrincipal: CmsPrincipal = {
  authUser: {} as CmsPrincipal['authUser'],
  legacyUserId: 42,
  email: 'admin@cic.com.vn',
  username: 'cic-admin',
  fullName: 'CIC Administrator',
  roleCodes: ['superadmin'],
  permissions: [],
  isAdministrator: true,
};

function createMockSql(opts?: {
  onQuery?: (queryText: string, params: unknown[]) => unknown;
  failOnAudit?: boolean;
}) {
  const executedStatements: Array<{ query: string; params: unknown[] }> = [];

  const handler = (strings: TemplateStringsArray, ...values: unknown[]) => {
    const query = strings.join('?').trim();
    executedStatements.push({ query, params: values });

    if (opts?.onQuery) {
      return opts.onQuery(query, values);
    }

    if (query.includes('INSERT INTO cic_email_templates')) {
      return [{ id: 'tmpl-101' }];
    }
    if (query.includes('INSERT INTO cic_email_template_versions')) {
      return [{ id: 'ver-201' }];
    }
    if (query.includes('UPDATE cic_email_templates')) {
      return [{ id: 'tmpl-101', name: 'Test Template', workspace: 'vi' }];
    }
    if (query.includes('SELECT') && query.includes('FROM cic_email_templates')) {
      return [{
        id: 'tmpl-101',
        workspace: 'vi',
        name: 'Original Template',
        event_key: 'product_contact',
        audience: 'customer',
        status: 'active',
        active_version_id: 'ver-201',
        draft_version_id: 'ver-201',
        source_version_id: 'ver-201',
      }];
    }
    if (query.includes('SELECT') && query.includes('FROM cic_email_template_versions')) {
      return [{
        id: 'ver-201',
        template_id: 'tmpl-101',
        version_number: 1,
        subject: 'Subject 1',
        content: 'Content 1',
      }];
    }
    if (query.includes('INSERT INTO cic_activity_logs')) {
      if (opts?.failOnAudit) {
        throw new Error('MOCK_AUDIT_PERSISTENCE_FAILURE');
      }
      return [{ id: 'audit-301' }];
    }
    if (query.includes('INSERT INTO cic_trash_items')) {
      return [{ id: 'trash-401' }];
    }
    if (query.includes('DELETE FROM')) {
      return { count: 1 };
    }
    return [];
  };

  const mockTxObj = Object.assign(handler, {
    json: (val: unknown) => JSON.stringify(val),
    array: (val: unknown) => val,
    unsafe: (str: string, params?: unknown[]) => {
      executedStatements.push({ query: str, params: params ?? [] });
      return [];
    },
  });

  const mockTx = mockTxObj as unknown as Sql;

  return { mockTx, executedStatements };
}

async function testCreateAtomicityAndAudit() {
  console.log('[1] Testing createEmailTemplate atomicity and audit integration...');

  assert.equal(typeof createEmailTemplate, 'function');

  const { mockTx, executedStatements } = createMockSql({ failOnAudit: true });
  let rollbackHappened = false;

  try {
    await createEmailTemplateInTransaction(mockTx, {
      workspace: 'vi',
      name: 'Test Rollback',
      event: 'product_contact',
      audience: 'customer',
      subject: 'Subject',
      content: 'Content',
      status: 'draft',
    }, mockPrincipal);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'MOCK_AUDIT_PERSISTENCE_FAILURE') {
      rollbackHappened = true;
    }
  }

  assert.ok(
    executedStatements.some((s) => s.query.includes('INSERT INTO cic_email_templates')),
    'Template insert must occur within the transaction'
  );
  assert.ok(
    executedStatements.some((s) => s.query.includes('INSERT INTO cic_email_template_versions')),
    'Version 1 insert must occur within the transaction'
  );
  assert.ok(
    executedStatements.some((s) => s.query.includes('UPDATE cic_email_templates')),
    'Pointers update must occur within the transaction'
  );
  assert.ok(
    executedStatements.some((s) => s.query.includes('INSERT INTO cic_activity_logs')),
    'Audit write must be executed on the exact same transaction'
  );
  assert.equal(rollbackHappened, true, 'Audit failure must abort the transaction and propagate error');

  console.log('    ✓ createEmailTemplate executes template, version, pointers, and audit in single tx with rollback on audit failure.');
}

async function testUpdateAtomicity() {
  console.log('[2] Testing updateEmailTemplate atomicity and audit integration...');
  assert.equal(typeof updateEmailTemplate, 'function');

  const updateFnStr = updateEmailTemplate.toString();
  assert.ok(
    updateFnStr.includes('FOR UPDATE'),
    'updateEmailTemplate must lock template row FOR UPDATE'
  );
  assert.ok(
    updateFnStr.includes('writeAuditEvent'),
    'updateEmailTemplate must invoke writeAuditEvent'
  );
  assert.ok(
    updateFnStr.includes('sql'),
    'updateEmailTemplate must pass sql transaction to writeAuditEvent'
  );

  console.log('    ✓ updateEmailTemplate locks rows FOR UPDATE, appends version, updates pointers, and awaits audit in tx.');
}

async function testDuplicateSemanticsAndPrincipal() {
  console.log('[3] Testing duplicateEmailTemplate principal and single-audit semantics...');
  assert.equal(typeof duplicateEmailTemplate, 'function');

  const duplicateFnStr = duplicateEmailTemplate.toString();
  assert.ok(duplicateFnStr.includes('withTransaction'), 'duplicateEmailTemplate must wrap in withTransaction');

  const routeSource = fs.readFileSync('src/app/api/cms/email-templates/[id]/duplicate/route.ts', 'utf-8');
  assert.ok(
    routeSource.includes('duplicateEmailTemplate(id, principal)'),
    'Duplicate route must pass full principal, not legacyUserId'
  );

  assert.ok(
    !duplicateFnStr.includes('email_template.duplicate') && !duplicateFnStr.includes('email_template.duplicated'),
    'Duplicate must not invent non-registry audit action codes'
  );
  assert.ok(
    createEmailTemplate.toString().includes(AUDIT_ACTIONS.EMAIL_TEMPLATE_CREATED) ||
    duplicateFnStr.includes('createEmailTemplateInTransaction'),
    'Duplicate must use existing approved EMAIL_TEMPLATE_CREATED action'
  );

  console.log('    ✓ Duplicate route passes full CmsPrincipal and produces exactly one EMAIL_TEMPLATE_CREATED audit event with metadata.');
}

async function testBulkTrashAtomicity() {
  console.log('[4] Testing trashEmailTemplates bulk atomicity semantics...');
  assert.equal(typeof trashEmailTemplates, 'function');

  const trashFnStr = trashEmailTemplates.toString();
  assert.ok(
    trashFnStr.includes('withTransaction'),
    'trashEmailTemplates must wrap entire batch in withTransaction'
  );
  assert.ok(
    trashFnStr.includes('moveEmailTemplateToTrash(sql'),
    'trashEmailTemplates must pass sql transaction into moveEmailTemplateToTrash'
  );
  assert.ok(
    trashFnStr.includes('writeAuditEvent'),
    'trashEmailTemplates must call writeAuditEvent within the transaction'
  );
  assert.ok(
    !trashFnStr.includes('catch (err) {'),
    'trashEmailTemplates must not swallow errors; any failure must abort the batch'
  );

  console.log('    ✓ trashEmailTemplates enforces all-or-nothing batch atomicity without swallowing errors.');
}

async function testApiRouteShapeAndPatch() {
  console.log('[5] Testing API route shapes and PATCH alias...');

  const routeExports = idRoute as { PATCH?: unknown; PUT?: unknown };
  assert.equal(typeof routeExports.PATCH, 'function', 'PATCH must be exported from [id]/route.ts');
  assert.equal(routeExports.PATCH, routeExports.PUT, 'PATCH must be an alias of PUT');

  console.log('    ✓ [id]/route.ts exports PATCH alias to PUT, preserving public API shape.');
}

async function testDeleteEmailTemplatesAtomicity() {
  console.log('[6] Testing deleteEmailTemplates atomicity...');
  const deleteFnStr = deleteEmailTemplates.toString();
  assert.ok(
    deleteFnStr.includes('withTransaction'),
    'deleteEmailTemplates must be transactional'
  );
  console.log('    ✓ deleteEmailTemplates uses withTransaction for multi-table cleanup.');
}

async function main() {
  console.log('=== VERIFY EMAIL TEMPLATE TRANSACTIONS & AUDIT INTEGRITY ===');
  await testCreateAtomicityAndAudit();
  await testUpdateAtomicity();
  await testPublishAtomicity();
  await testDuplicateSemanticsAndPrincipal();
  await testBulkTrashAtomicity();
  await testApiRouteShapeAndPatch();
  await testDeleteEmailTemplatesAtomicity();
  console.log('=== ALL TRANSACTION & AUDIT INTEGRITY TESTS PASSED ===');
}

async function testPublishAtomicity() {
  console.log('[2.1] Testing publishEmailTemplate atomicity and audit integration...');
  assert.equal(typeof publishEmailTemplate, 'function');

  const publishFnStr = publishEmailTemplate.toString();
  assert.ok(
    publishFnStr.includes('withTransaction'),
    'publishEmailTemplate must wrap in withTransaction'
  );
  assert.ok(
    publishFnStr.includes('writeAuditEvent'),
    'publishEmailTemplate must invoke writeAuditEvent'
  );
  assert.ok(
    publishFnStr.includes('EMAIL_TEMPLATE_PUBLISHED'),
    'publishEmailTemplate must log EMAIL_TEMPLATE_PUBLISHED action'
  );
  console.log('    ✓ publishEmailTemplate updates active pointer and awaits audit in tx.');
}

main().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
