const rateLimit = require("express-rate-limit");
const env = require("./env");

/**
 * General rate limiter — applies to all API routes
 * Default: 100 requests per 15 minutes per IP
 */
const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again later.",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res, _next, options) => {
    res.status(429).json(options.message);
  },
});

/**
 * Strict rate limiter — for auth endpoints (login, forgot password, etc.)
 * Default: 5 requests per 15 minutes per IP
 */
const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.AUTH_RATE_LIMIT_MAX,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, _next, options) => {
    res.status(429).json(options.message);
  },
});

module.exports = { generalLimiter, authLimiter };
