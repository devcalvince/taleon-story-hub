/**
 * Minimal in-memory rate limiter for public POST endpoints.
 *
 * Per-instance (serverless) only — a soft abuse brake, not a hard guarantee.
 * No external service required. Keyed by client IP, fixed window.
 */

const WINDOW_MS = 60_000;
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  request: Request,
  name: string,
  maxPerMinute = 5,
): { ok: true } | { ok: false; retryAfter: number } {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const key = `${name}:${ip}`;
  const now = Date.now();

  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  entry.count += 1;
  if (entry.count > maxPerMinute) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true };
}

/** Periodic sweep so the map cannot grow unbounded. */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
}, 120_000).unref?.();
