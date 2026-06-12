/**
 * Centralized Configuration
 * -------------------------
 * Loads all environment variables and exports them as a single config object.
 * Defaults are provided for non-sensitive values; secrets must be set in .env.
 */

const config = {
  /** Server port */
  PORT: parseInt(process.env.PORT, 10) || 5000,

  /** Secret used to sign and verify JWT tokens */
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret-change-me',

  /** Google Gemini API key */
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',

  /** Gemini model used for text and multimodal requests */
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.5-flash',

  /** Allowed CORS origin (frontend URL) */
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  /** JWT token expiration duration */
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
};

if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'default-secret-change-me') {
    throw new Error('JWT_SECRET must be set to a strong secret in production.');
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY must be set in production.');
  }
}

module.exports = config;
