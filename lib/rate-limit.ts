// Simple in-memory rate limiter for serverless (per-instance, resets on cold start)
// For production, use Upstash Redis or similar distributed store

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5;

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const key = `enquiry:${ip}`;

  // Cleanup expired entries occasionally
  if (Math.random() < 0.01) {
    for (const [k, v] of store.entries()) {
      if (v.resetAt < now) store.delete(k);
    }
  }

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const real = request.headers.get("x-real-ip");
  const cfIP = request.headers.get("cf-connecting-ip");
  return cfIP || real || (forwarded ? forwarded.split(",")[0].trim() : "unknown");
}
