const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  limit = 10,
  windowMs = 60_000,
): { success: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true };
  }

  if (bucket.count >= limit) {
    return { success: false, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { success: true };
}

export function getRateLimitKey(prefix: string, identifier: string) {
  return `${prefix}:${identifier}`;
}
