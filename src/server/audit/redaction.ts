import 'server-only';

const SECRET_KEY = /(?:password|passwd|passphrase|secret|token|api[_-]?key|authorization|cookie|credential|private[_-]?key|otp|session)/i;
const SECRET_ASSIGNMENT = /\b(password|passwd|passphrase|secret|token|api[_-]?key|authorization|cookie|credential|private[_-]?key|otp|session)\b(\s*[:=]\s*)([^\s,;]+)/gi;
const BEARER_TOKEN = /\bBearer\s+[A-Za-z0-9._~+/=-]+/gi;
const JWT = /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g;
const MAX_DEPTH = 8;

export type RedactionResult = Readonly<{ value: unknown; redactedFields: readonly string[] }>;

export function redactAuditValue(input: unknown): RedactionResult {
  const redacted = new Set<string>();
  const visit = (value: unknown, path: string, depth: number): unknown => {
    if (depth > MAX_DEPTH) return '[TRUNCATED]';
    if (Array.isArray(value)) return value.slice(0, 200).map((item, index) => visit(item, `${path}[${index}]`, depth + 1));
    if (value && typeof value === 'object') {
      const output: Record<string, unknown> = {};
      for (const [key, child] of Object.entries(value as Record<string, unknown>).slice(0, 200)) {
        const childPath = path ? `${path}.${key}` : key;
        if (SECRET_KEY.test(key)) { output[key] = '[REDACTED]'; redacted.add(childPath); }
        else output[key] = visit(child, childPath, depth + 1);
      }
      return output;
    }
    if (typeof value === 'string') {
      const sanitized = value
        .replace(SECRET_ASSIGNMENT, (_match, key: string, delimiter: string) => `${key}${delimiter}[REDACTED]`)
        .replace(BEARER_TOKEN, 'Bearer [REDACTED]')
        .replace(JWT, '[REDACTED]');
      if (sanitized !== value) redacted.add(path || '$');
      return sanitized;
    }
    return typeof value === 'bigint' ? value.toString() : value;
  };
  return { value: visit(input, '', 0), redactedFields: [...redacted] };
}
