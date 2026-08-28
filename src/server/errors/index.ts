import 'server-only';

export type ServerErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'EXTERNAL_SERVICE'
  | 'UNEXPECTED';

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: ServerErrorCode = 'UNEXPECTED',
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function normalizeServerError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  return new AppError('An unexpected server error occurred.', 'UNEXPECTED', error);
}
