import 'server-only';

import type { PostgrestError } from '@supabase/supabase-js';

import { AppError } from '@/server/errors';

export type DataAccessErrorCode =
  | 'DATABASE_ERROR'
  | 'DATABASE_CONFLICT'
  | 'DATABASE_FORBIDDEN';

export class DataAccessError extends AppError {
  constructor(
    message: string,
    public readonly dataCode: DataAccessErrorCode = 'DATABASE_ERROR',
    cause?: unknown,
  ) {
    super(
      message,
      dataCode === 'DATABASE_CONFLICT'
        ? 'CONFLICT'
        : dataCode === 'DATABASE_FORBIDDEN'
          ? 'FORBIDDEN'
          : 'UNEXPECTED',
      cause,
    );
    this.name = 'DataAccessError';
  }
}

const CONFLICT_CODES = new Set(['23505', '23503', '23P01']);
const FORBIDDEN_CODES = new Set(['42501', 'PGRST301']);

/** Maps provider details to a safe server error without exposing SQL, hints or raw payloads. */
export function toDataAccessError(
  error: Pick<PostgrestError, 'code' | 'message' | 'details' | 'hint'> | Error,
  safeMessage = 'Database operation failed.',
): DataAccessError {
  const providerCode = 'code' in error ? error.code : undefined;
  const code = providerCode && CONFLICT_CODES.has(providerCode)
    ? 'DATABASE_CONFLICT'
    : providerCode && FORBIDDEN_CODES.has(providerCode)
      ? 'DATABASE_FORBIDDEN'
      : 'DATABASE_ERROR';
  return new DataAccessError(safeMessage, code, error);
}

export function throwIfDatabaseError(
  error: PostgrestError | null,
  safeMessage?: string,
): asserts error is null {
  if (error) throw toDataAccessError(error, safeMessage);
}
