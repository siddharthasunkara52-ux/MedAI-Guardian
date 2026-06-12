/**
 * Rate Limiter Middleware
 * ----------------------
 * Two tiers of rate limiting:
 *   • generalLimiter – applied globally (100 req / 15 min per IP)
 *   • aiLimiter      – applied to AI-heavy endpoints (20 req / 15 min per IP)
 */

const rateLimit = require('express-rate-limit');

/** General-purpose limiter for all API requests. */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again after 15 minutes.',
  },
});

/** Stricter limiter for AI / Gemini endpoints. */
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'AI request limit reached. Please try again after 15 minutes.',
  },
});

module.exports = { generalLimiter, aiLimiter };
