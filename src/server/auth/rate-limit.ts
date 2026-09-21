import 'server-only';
import { isIP } from 'node:net';

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory sliding window store
const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale keys every 5 minutes to prevent memory leak
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries(now: number, maxWindowMs: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of rateLimitStore.entries()) {
    const validTimestamps = record.timestamps.filter((ts) => now - ts < maxWindowMs);
    if (validTimestamps.length === 0) {
      rateLimitStore.delete(key);
    } else {
      record.timestamps = validTimestamps;
    }
  }
}

export interface RateLimitOptions {
  maxRequests: number;
  windowSeconds: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetSeconds: number;
}

/**
 * Checks and records an action under sliding-window rate limiting.
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;

  cleanupStaleEntries(now, windowMs);

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Retain only timestamps within the active sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= options.maxRequests) {
    const oldestTimestamp = record.timestamps[0];
    const resetSeconds = Math.max(1, Math.ceil((oldestTimestamp + windowMs - now) / 1000));
    return {
      success: false,
      remaining: 0,
      resetSeconds,
    };
  }

  record.timestamps.push(now);
  const remaining = options.maxRequests - record.timestamps.length;
  const oldestTimestamp = record.timestamps[0];
  const resetSeconds = Math.max(1, Math.ceil((oldestTimestamp + windowMs - now) / 1000));

  return {
    success: true,
    remaining,
    resetSeconds,
  };
}

/**
 * Helper to extract client IP from incoming Headers.
 * Validates IP format (IPv4 / IPv6) to prevent spoofing and header injection.
 * Prioritizes trusted edge headers (Cloudflare CF-Connecting-IP, then X-Real-IP)
 * before falling back to validated entries from X-Forwarded-For.
 */
export function getClientIp(headersList: { get(name: string): string | null }): string {
  // 1. Cloudflare connecting IP (validated by Cloudflare edge proxy)
  const cfConnectingIp = headersList.get('cf-connecting-ip')?.trim();
  if (cfConnectingIp && isIP(cfConnectingIp) !== 0) {
    return cfConnectingIp;
  }

  // 2. Direct upstream proxy single client IP (e.g. Nginx $remote_addr)
  const realIp = headersList.get('x-real-ip')?.trim();
  if (realIp && isIP(realIp) !== 0) {
    return realIp;
  }

  // 3. Fallback to X-Forwarded-For: validate IP format
  const forwarded = headersList.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded.split(',').map((p) => p.trim()).filter((p) => isIP(p) !== 0);
    if (parts.length > 0) {
      return parts[0];
    }
  }

  return '127.0.0.1';
}

/**
 * Reset rate limit for a specific key (useful for tests or successful actions)
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}
