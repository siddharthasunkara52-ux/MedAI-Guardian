/**
 * Authentication Routes
 * ---------------------
 * POST /register  – Create a new account
 * POST /login     – Sign in and receive a JWT
 * GET  /me        – Return the authenticated user's profile
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const fileStore = require('../services/fileStore');
const auth = require('../middleware/auth');
const {
  validateRegisterMiddleware,
  validateLoginMiddleware,
} = require('../middleware/validate');

const router = express.Router();

// ── Helper: generate a signed JWT ───────────────────────────────────────────
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRE }
  );
}

// ── Helper: strip password from user object ─────────────────────────────────
function sanitiseUser(user) {
  const { password, ...safe } = user;
  return safe;
}

// ── POST /register ──────────────────────────────────────────────────────────
router.post('/register', validateRegisterMiddleware, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if email is already taken
    const existing = fileStore.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Hash the password (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Persist the new user
    const newUser = fileStore.addUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    // Generate JWT
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: sanitiseUser(newUser),
    });
  } catch (error) {
    next(error);
  }
});

// ── POST /login ─────────────────────────────────────────────────────────────
router.post('/login', validateLoginMiddleware, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Look up user
    const user = fileStore.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate JWT
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: sanitiseUser(user),
    });
  } catch (error) {
    next(error);
  }
});

// ── GET /me ─────────────────────────────────────────────────────────────────
router.get('/me', auth, (req, res, next) => {
  try {
    const user = fileStore.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      user: sanitiseUser(user),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
