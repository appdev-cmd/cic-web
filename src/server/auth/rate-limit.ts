import 'server-only';
import {
  BoundedRateLimitStore,
  checkRateLimitWithStore,
  extractClientIp,
  type RateLimitOptions,
  type RateLimitResult,
  type RateLimitRecord,
} from './rate-limit-core';

export type { RateLimitOptions, RateLimitResult, RateLimitRecord };

// Production singleton bounded store with max 10,000 keys and LRU eviction
const defaultRateLimitStore = new BoundedRateLimitStore({
  maxKeys: 10_000,
  cleanupIntervalMs: 60_000, // 1 minute incremental cleanup
  maxScanPerCleanup: 500,    // At most 500 entries scanned per interval
});

/**
 * Checks and records an action under sliding-window rate limiting.
 * Backed by a memory-bounded LRU store to prevent heap exhaustion.
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions
): RateLimitResult {
  return checkRateLimitWithStore(defaultRateLimitStore, key, options);
}

/**
 * Helper to extract client IP from incoming Headers.
 * Validates IP format (IPv4 / IPv6) to prevent spoofing and header injection.
 * Prioritizes trusted edge headers (Cloudflare CF-Connecting-IP, then X-Real-IP)
 * before falling back to validated entries from X-Forwarded-For.
 */
export function getClientIp(headersList: { get(name: string): string | null }): string {
  return extractClientIp(headersList);
}

/**
 * Reset rate limit for a specific key (useful for tests or successful actions)
 */
export function resetRateLimit(key: string): void {
  defaultRateLimitStore.delete(key);
}
