import 'server-only';

type LogContext = Record<string, string | number | boolean | null | undefined>;

function compactContext(context: LogContext) {
  return Object.fromEntries(Object.entries(context).filter(([, value]) => value !== undefined));
}

export function logServerError(message: string, error: unknown, context: LogContext = {}) {
  const normalizedError = error instanceof Error
    ? { name: error.name, message: error.message, stack: error.stack }
    : { name: 'UnknownError', message: String(error) };

  console.error(JSON.stringify({
    level: 'error',
    message,
    error: normalizedError,
    context: compactContext(context),
    timestamp: new Date().toISOString(),
  }));
}
