export type DataResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: DataResultError };

export interface DataResultError {
  code: 'VALIDATION_ERROR' | 'UNAUTHENTICATED' | 'FORBIDDEN' | 'CONFLICT' | 'DATABASE_ERROR' | 'UNEXPECTED';
  message: string;
}

export function dataSuccess<T>(data: T): DataResult<T> {
  return { ok: true, data };
}

/** Use only at Server Action/Route Handler boundaries; query functions should throw typed server errors. */
export function dataFailure(error: DataResultError): DataResult<never> {
  return { ok: false, error };
}
