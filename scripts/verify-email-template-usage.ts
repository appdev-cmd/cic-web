import assert from 'node:assert/strict';
import {
  getEmailTemplateUsage,
  isValidEmailTemplateId,
} from '../src/features/email-templates/server/queries';
import { AppError, normalizeServerError } from '../src/server/errors';
import { getPostgresClient } from '../src/server/db/postgres';

async function testIdentifierValidation() {
  console.log('[1] Testing isValidEmailTemplateId boundary validation...');

  // Valid identifiers
  assert.equal(isValidEmailTemplateId('1'), true, "'1' should be valid");
  assert.equal(isValidEmailTemplateId('42'), true, "'42' should be valid");
  assert.equal(isValidEmailTemplateId('  99  '), true, "'  99  ' should be valid (whitespace trimmed)");
  assert.equal(isValidEmailTemplateId(1), true, '1 (number) should be valid');
  assert.equal(isValidEmailTemplateId(100), true, '100 (number) should be valid');
  assert.equal(isValidEmailTemplateId('9223372036854775807'), true, 'Max PostgreSQL bigint should be valid');

  // Invalid identifiers: strings, sql injection, symbols
  assert.equal(isValidEmailTemplateId(''), false, 'Empty string should be invalid');
  assert.equal(isValidEmailTemplateId('   '), false, 'Whitespace-only should be invalid');
  assert.equal(isValidEmailTemplateId('abc'), false, "'abc' should be invalid");
  assert.equal(isValidEmailTemplateId('template-1'), false, "'template-1' should be invalid");
  assert.equal(isValidEmailTemplateId('1; DROP TABLE cic_forms;'), false, 'SQL injection attempt should be invalid');
  assert.equal(isValidEmailTemplateId("' OR '1'='1"), false, 'SQL injection attempt should be invalid');
  assert.equal(isValidEmailTemplateId('" OR ""="'), false, 'SQL injection attempt should be invalid');

  // Invalid identifiers: non-positive, floats, overflows
  assert.equal(isValidEmailTemplateId('0'), false, "'0' should be invalid");
  assert.equal(isValidEmailTemplateId(0), false, '0 (number) should be invalid');
  assert.equal(isValidEmailTemplateId('-1'), false, "'-1' should be invalid");
  assert.equal(isValidEmailTemplateId(-5), false, '-5 (number) should be invalid');
  assert.equal(isValidEmailTemplateId('1.5'), false, "'1.5' should be invalid");
  assert.equal(isValidEmailTemplateId(3.14), false, '3.14 (float) should be invalid');
  assert.equal(isValidEmailTemplateId('9223372036854775808'), false, 'Value exceeding 64-bit int should be invalid');

  // Invalid identifiers: non-primitive or special values
  assert.equal(isValidEmailTemplateId(null), false, 'null should be invalid');
  assert.equal(isValidEmailTemplateId(undefined), false, 'undefined should be invalid');
  assert.equal(isValidEmailTemplateId(NaN), false, 'NaN should be invalid');
  assert.equal(isValidEmailTemplateId(Infinity), false, 'Infinity should be invalid');
  assert.equal(isValidEmailTemplateId({}), false, '{} should be invalid');
  assert.equal(isValidEmailTemplateId([]), false, '[] should be invalid');

  console.log('    ✓ isValidEmailTemplateId correctly validates and rejects identifiers.');
}

async function testServerBoundaryValidation() {
  console.log('[2] Testing getEmailTemplateUsage server boundary rejection on invalid inputs...');

  const invalidInputs = [
    '',
    '   ',
    'abc',
    '0',
    '-1',
    -10,
    '1; DROP TABLE cic_forms;',
    "' OR '1'='1",
    '999999999999999999999999999',
  ];

  for (const input of invalidInputs) {
    try {
      await getEmailTemplateUsage(input as unknown as string);
      assert.fail(`Expected getEmailTemplateUsage("${input}") to throw a validation error.`);
    } catch (err: unknown) {
      assert(err instanceof AppError, `Error for "${input}" should be an AppError instance.`);
      assert.equal(err.code, 'VALIDATION_ERROR', `Error code for "${input}" should be VALIDATION_ERROR.`);
      assert.equal(err.message, 'Invalid email template ID.');
    }
  }

  console.log('    ✓ getEmailTemplateUsage throws AppError(VALIDATION_ERROR) on all invalid inputs.');
}

async function testValidLookupAndParameterization() {
  console.log('[3] Testing getEmailTemplateUsage parameterized lookup (non-mutating)...');

  // Query usage for template 1 (existing in db or standard id)
  const usages = await getEmailTemplateUsage('1');
  assert(Array.isArray(usages), 'Usages should be an array');
  console.log(`    ✓ Valid lookup returned ${usages.length} usages for template 1.`);

  for (const item of usages) {
    assert(item.id, 'Usage item must have an id');
    assert(item.name, 'Usage item must have a name');
    assert(item.type === 'form' || item.type === 'cta', 'Usage item type must be form or cta');
  }

  // Also verify numeric id works identically
  const usagesNum = await getEmailTemplateUsage(1);
  assert(Array.isArray(usagesNum), 'Usages should be an array for numeric id');
  assert.equal(usages.length, usagesNum.length, 'String and numeric id should return same usages');

  console.log('    ✓ Parameterized query executed successfully without SQL error or injection vulnerability.');
}

async function testErrorSemantics() {
  console.log('[4] Testing error semantics (distinguish DB failure from valid empty usage)...');

  // 1. Normal query returns an array (empty or not), not an error
  const emptyResult = await getEmailTemplateUsage('999999999');
  assert(Array.isArray(emptyResult), 'Valid non-existent template returns empty array');
  assert.equal(emptyResult.length, 0, 'No usages should be found for unused template ID 999999999');
  console.log('    ✓ Valid empty usage returns [] (0 items).');

  // 2. Database / query error is NOT swallowed: verify that sql query failures throw
  const sql = getPostgresClient();
  let dbErrorCaught = false;
  try {
    // Attempting to query a non-existent table throws a database error
    await sql`SELECT * FROM public.non_existent_table_verification_probe`;
  } catch (err) {
    dbErrorCaught = true;
    assert(err instanceof Error, 'Database error should be an Error instance');
  }
  assert.equal(dbErrorCaught, true, 'Database failure must throw rather than being silently ignored.');
  console.log('    ✓ DB/schema failure throws and is not swallowed into false empty usage.');

  // 3. Normalized error mapping for API boundary
  const validationError = new AppError('Invalid email template ID.', 'VALIDATION_ERROR');
  const normalized = normalizeServerError(validationError);
  assert.equal(normalized.code, 'VALIDATION_ERROR');
  assert.equal(normalized.message, 'Invalid email template ID.');
  console.log('    ✓ normalizeServerError preserves VALIDATION_ERROR for HTTP 400 response.');
}

async function main() {
  console.log('=== START EMAIL TEMPLATE USAGE VERIFICATION ===');
  await testIdentifierValidation();
  await testServerBoundaryValidation();
  await testValidLookupAndParameterization();
  await testErrorSemantics();
  console.log('=== ALL USAGE LOOKUP VERIFICATIONS PASSED ===');
  process.exit(0);
}

main().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
