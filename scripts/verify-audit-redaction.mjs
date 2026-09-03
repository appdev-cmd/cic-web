import assert from 'node:assert/strict';
import { redactAuditValue } from '../src/server/audit/redaction.ts';

const result = redactAuditValue({
  password: 'raw-password',
  nested: { api_key: 'raw-key' },
  message: 'token=raw-token',
  authorization: 'Bearer raw-bearer',
  jwt: 'eyJheader.payload.signature',
  safe: 'retained',
});

assert.deepEqual(result.value, {
  password: '[REDACTED]',
  nested: { api_key: '[REDACTED]' },
  message: 'token=[REDACTED]',
  authorization: '[REDACTED]',
  jwt: '[REDACTED]',
  safe: 'retained',
});
assert.deepEqual(result.redactedFields, ['password', 'nested.api_key', 'message', 'authorization', 'jwt']);
console.log(JSON.stringify({ redactionPolicy: true, redactedFields: result.redactedFields.length }));
