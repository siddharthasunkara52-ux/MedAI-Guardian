/**
 * MedAI Guardian – Express Server Entry Point
 * --------------------------------------------
 * Bootstraps middleware, mounts route modules, and starts listening.
 */

// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const fileStore = require('./services/fileStore');
const { generalLimiter } = require('./middleware/rateLimiter');

// Route modules
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const reportRoutes = require('./routes/report');
const imageRoutes = require('./routes/image');
const userRoutes = require('./routes/user');

// ── Initialise data store ───────────────────────────────────────────────────
fileStore.initStore();

// ── Create Express app ──────────────────────────────────────────────────────
const app = express();

// ── Security headers ────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Body parsers ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ── Global rate limiter ─────────────────────────────────────────────────────
app.use(generalLimiter);

// ── Mount routes ────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/user', userRoutes);

// ── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// ── 404 catch-all ───────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
  });
});

// ── Global error handler ────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('Unhandled error:', err.message);
  }

  // Multer-specific errors (file too large, wrong type, etc.)
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    ...(err.code && { code: err.code }),
    message: err.message || 'Internal server error.',
  });
});

// ── Start server ────────────────────────────────────────────────────────────
app.listen(config.PORT, () => {
  console.log(`\n🩺 MedAI Guardian server running on port ${config.PORT}`);
  console.log(`   Health check: http://localhost:${config.PORT}/api/health`);
  console.log(`   Environment:  ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
