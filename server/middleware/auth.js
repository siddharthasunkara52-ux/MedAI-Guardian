/**
 * Authentication Middleware
 * ------------------------
 * Verifies the JWT from the Authorization header and attaches
 * the decoded payload (user id, email) to `req.user`.
 */

const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Express middleware – protect a route with JWT authentication.
 */
function authMiddleware(req, res, next) {
  try {
    // Expect header format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Token is missing.',
      });
    }

    // Verify token and attach decoded payload to request
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
}

module.exports = authMiddleware;
