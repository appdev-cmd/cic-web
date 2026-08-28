import type { Instrumentation } from 'next';

export function register() {
  // Reserved for foundation-level server instrumentation initialization.
}

export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  const { logServerError } = await import('@/server/logging/logger');

  logServerError('Unhandled server request error', error, {
    path: request.path,
    method: request.method,
    routerKind: context.routerKind,
    routePath: context.routePath,
    routeType: context.routeType,
  });
};
