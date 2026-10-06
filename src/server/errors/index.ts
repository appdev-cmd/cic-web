import 'server-only';
import { NextResponse } from 'next/server';

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

export function createSafeErrorResponse(
  error: unknown,
  fallbackMessage = 'Có lỗi xảy ra trên hệ thống. Vui lòng thử lại sau.',
  defaultStatus = 500,
): NextResponse {
  console.error('[API Error]', error);

  const isProd = process.env.NODE_ENV === 'production';

  if (error instanceof AppError) {
    const status =
      error.code === 'UNAUTHENTICATED' ? 401 :
      error.code === 'FORBIDDEN' ? 403 :
      error.code === 'NOT_FOUND' ? 404 :
      error.code === 'CONFLICT' ? 409 :
      error.code === 'RATE_LIMITED' ? 429 :
      error.code === 'VALIDATION_ERROR' ? 400 :
      defaultStatus;

    const isSafeUserFacing = (
      error.code === 'UNAUTHENTICATED' ||
      error.code === 'FORBIDDEN' ||
      error.code === 'NOT_FOUND' ||
      error.code === 'CONFLICT' ||
      error.code === 'RATE_LIMITED' ||
      error.code === 'VALIDATION_ERROR'
    );

    return NextResponse.json(
      {
        success: false,
        error: isSafeUserFacing || !isProd ? error.message : fallbackMessage,
        code: error.code,
      },
      { status },
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: isProd ? fallbackMessage : (error instanceof Error ? error.message : fallbackMessage),
    },
    { status: defaultStatus },
  );
}

