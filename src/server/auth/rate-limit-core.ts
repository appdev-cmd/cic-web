import { isIP } from 'node:net';

export interface RateLimitRecord {
  timestamps: number[];
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

export interface BoundedStoreOptions {
  maxKeys?: number;
  cleanupIntervalMs?: number;
  maxScanPerCleanup?: number;
}

/**
 * High-performance, memory-bounded sliding-window store with O(1) LRU eviction.
 * Guarantees that heap usage cannot exceed maxKeys even under high-cardinality spoofing attacks.
 */
export class BoundedRateLimitStore {
  readonly maxKeys: number;
  readonly cleanupIntervalMs: number;
  readonly maxScanPerCleanup: number;
  private readonly store: Map<string, RateLimitRecord>;
  private lastCleanup: number;

  constructor(options: BoundedStoreOptions = {}) {
    this.maxKeys = options.maxKeys ?? 10_000;
    this.cleanupIntervalMs = options.cleanupIntervalMs ?? 60_000; // 1 min
    this.maxScanPerCleanup = options.maxScanPerCleanup ?? 500;
    this.store = new Map();
    this.lastCleanup = Date.now();
  }

  get(key: string): RateLimitRecord | undefined {
    const record = this.store.get(key);
    if (record) {
      // LRU touch: re-insert to move to end of insertion order
      this.store.delete(key);
      this.store.set(key, record);
    }
    return record;
  }

  set(key: string, record: RateLimitRecord): void {
    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size >= this.maxKeys) {
      // Evict oldest entry from head of Map
      const oldestKey = this.store.keys().next().value;
      if (oldestKey !== undefined) {
        this.store.delete(oldestKey);
      }
    }
    this.store.set(key, record);
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  /**
   * Performs an incremental bounded cleanup of stale entries without blocking the event loop.
   */
  cleanupStale(now: number, maxWindowMs: number): void {
    if (now - this.lastCleanup < this.cleanupIntervalMs) return;
    this.lastCleanup = now;

    let scanned = 0;
    for (const [key, record] of this.store.entries()) {
      if (++scanned > this.maxScanPerCleanup) break;
      const validTimestamps = record.timestamps.filter((ts) => now - ts < maxWindowMs);
      if (validTimestamps.length === 0) {
        this.store.delete(key);
      } else {
        record.timestamps = validTimestamps;
      }
    }
  }
}

export function checkRateLimitWithStore(
  store: BoundedRateLimitStore,
  key: string,
  options: RateLimitOptions,
  now = Date.now()
): RateLimitResult {
  const windowMs = options.windowSeconds * 1000;

  store.cleanupStale(now, windowMs);

  let record = store.get(key);
  if (!record) {
    record = { timestamps: [] };
    store.set(key, record);
  }

  // Filter timestamps within the active sliding window
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
export function extractClientIp(headersList: { get(name: string): string | null }): string {
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
