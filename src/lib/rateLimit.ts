// Lightweight in-memory rate limiter, keyed by IP + action.
//
// This is intentionally simple (no Redis/DB) and is enough to stop casual
// spam/bot abuse on a low-traffic site. Caveat: on serverless platforms
// (e.g. Vercel) each function instance has its own memory, so the limit is
// "per warm instance" rather than truly global. If spam becomes a real
// problem at higher traffic, swap this for a shared store (Upstash Redis,
// Supabase table, etc).

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Periodically clear out stale buckets so memory doesn't grow unbounded.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}, 5 * 60 * 1000).unref?.();

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Allows `limit` requests per `windowMs` milliseconds for a given key.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      success: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  return { success: true, remaining: limit - existing.count, retryAfterSeconds: 0 };
}

/** Best-effort client IP extraction behind common proxies (Vercel, etc). */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return 'unknown';
}
