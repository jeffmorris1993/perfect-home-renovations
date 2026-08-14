// Best-effort in-memory sliding window. On serverless this is per-instance,
// which is fine as cheap flood protection for a marketing form.
const hits = new Map<string, number[]>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const windowStart = now - windowMs;
  const list = (hits.get(key) ?? []).filter((t) => t > windowStart);
  if (list.length >= limit) {
    const retryAfter = Math.ceil((list[0] + windowMs - now) / 1000);
    return { ok: false, retryAfter };
  }
  list.push(now);
  hits.set(key, list);
  // Opportunistic cleanup so the map can't grow unbounded.
  if (hits.size > 1000) {
    for (const [k, v] of hits) {
      if (v.every((t) => t <= windowStart)) hits.delete(k);
    }
  }
  return { ok: true, retryAfter: 0 };
}
