// Rate Limiting Middleware - Per Org Limits
// 100 req/min for pilots, 10 req/min for Council advice

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  pilots: { windowMs: 60000, maxRequests: 100 },      // 100 req/min
  council: { windowMs: 60000, maxRequests: 10 },      // 10 req/min
  signals: { windowMs: 60000, maxRequests: 50 },      // 50 req/min
  default: { windowMs: 60000, maxRequests: 200 },     // 200 req/min
};

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  private cleanup() {
    const now = Date.now();
    const entries = Array.from(this.store.entries());
    for (const [key, entry] of entries) {
      if (entry.resetAt <= now) {
        this.store.delete(key);
      }
    }
  }

  check(key: string, config: RateLimitConfig): {
    allowed: boolean;
    remaining: number;
    resetAt: number;
    limit: number;
  } {
    const now = Date.now();
    let entry = this.store.get(key);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + config.windowMs };
      this.store.set(key, entry);
    }

    entry.count++;
    const allowed = entry.count <= config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - entry.count);

    return {
      allowed,
      remaining,
      resetAt: entry.resetAt,
      limit: config.maxRequests,
    };
  }

  getStats(): { totalKeys: number; entries: Array<{ key: string; count: number; resetAt: number }> } {
    const result: Array<{ key: string; count: number; resetAt: number }> = [];
    const storeEntries = Array.from(this.store.entries());
    for (const [key, entry] of storeEntries) {
      result.push({ key, count: entry.count, resetAt: entry.resetAt });
    }
    return { totalKeys: this.store.size, entries: result };
  }

  destroy() {
    clearInterval(this.cleanupInterval);
  }
}

export const rateLimiter = new RateLimiter();

export function createRateLimitMiddleware(limitType: keyof typeof RATE_LIMITS = "default") {
  const config = RATE_LIMITS[limitType] || RATE_LIMITS.default;

  return (req: any, res: any, next: any) => {
    // Get org identifier from pilot or user email
    const orgId = req.orgId || req.userEmail || req.ip || "anonymous";
    const key = `${limitType}:${orgId}`;

    const result = rateLimiter.check(key, config);

    // Set rate limit headers
    res.setHeader("X-RateLimit-Limit", result.limit);
    res.setHeader("X-RateLimit-Remaining", result.remaining);
    res.setHeader("X-RateLimit-Reset", Math.ceil(result.resetAt / 1000));

    if (!result.allowed) {
      res.setHeader("Retry-After", Math.ceil((result.resetAt - Date.now()) / 1000));
      return res.status(429).json({
        error: "Rate limit exceeded",
        message: `Too many requests. Limit: ${result.limit} per minute for ${limitType}.`,
        retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000),
      });
    }

    next();
  };
}

// Specific middleware exports for common endpoints
export const pilotRateLimit = createRateLimitMiddleware("pilots");
export const councilRateLimit = createRateLimitMiddleware("council");
export const signalRateLimit = createRateLimitMiddleware("signals");

// Stats endpoint for monitoring
export function getRateLimitStats() {
  return rateLimiter.getStats();
}
