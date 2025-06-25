import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';

const rateLimiter = new RateLimiterMemory({
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000, // Convert to seconds
});

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const key = req.ip || 'unknown';
    await rateLimiter.consume(key);
    next();
  } catch (rejRes: any) {
    const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
    res.set('Retry-After', String(secs));
    res.status(429).json({
      success: false,
      error: 'Too many requests',
      retryAfter: secs
    });
  }
};

// Export with alias for compatibility
export { rateLimiterMiddleware as rateLimiter }; 