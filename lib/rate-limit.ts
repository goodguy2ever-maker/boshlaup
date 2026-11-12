// In-memory sliding window rate limiter for Next.js API routes

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const trackers = new Map<string, RateLimitRecord>();

// Cleanup expired keys periodically every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    trackers.forEach((record, key) => {
      if (record.resetAt <= now) {
        trackers.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  intervalMs?: number; // Time window in ms (default: 60_000 = 1 min)
  max?: number;        // Max requests per window (default: 30)
}

/**
 * Check if an identifier (IP or user ID) has exceeded rate limit.
 * Returns { success: boolean, limit: number, remaining: number, resetInSeconds: number }
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): {
  success: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
} {
  const intervalMs = options.intervalMs || 60_000;
  const max = options.max || 30;
  const now = Date.now();

  const record = trackers.get(identifier);

  if (!record || record.resetAt <= now) {
    trackers.set(identifier, {
      count: 1,
      resetAt: now + intervalMs,
    });
    return {
      success: true,
      limit: max,
      remaining: max - 1,
      resetInSeconds: Math.ceil(intervalMs / 1000),
    };
  }

  if (record.count >= max) {
    return {
      success: false,
      limit: max,
      remaining: 0,
      resetInSeconds: Math.max(1, Math.ceil((record.resetAt - now) / 1000)),
    };
  }

  record.count += 1;
  return {
    success: true,
    limit: max,
    remaining: max - record.count,
    resetInSeconds: Math.max(1, Math.ceil((record.resetAt - now) / 1000)),
  };
}

/**
 * Extract client IP from Request headers
 */
export function getClientIp(request: Request): string {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  return '127.0.0.1';
}
