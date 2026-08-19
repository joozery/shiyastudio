/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * Good enough for a single `next start` process (which is how this app is
 * deployed - see package.json). It resets if the process restarts and is
 * NOT shared across multiple instances/regions - if this app is ever moved
 * to a multi-instance or serverless/edge deployment, replace this with a
 * shared store (Redis, etc).
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Periodically sweep expired buckets so this Map can't grow unbounded.
let lastSweep = 0;
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Returns { allowed, remaining, retryAfterMs } for `key` given a limit of
 * `max` attempts per `windowMs` milliseconds.
 */
export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  sweep(now);

  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }

  bucket.count += 1;

  const allowed = bucket.count <= max;
  return {
    allowed,
    remaining: Math.max(0, max - bucket.count),
    retryAfterMs: allowed ? 0 : bucket.resetAt - now,
  };
}

/** Best-effort client IP extraction behind the nginx reverse proxy in front of this app. */
export function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return 'unknown';
}
