/**
 * User / Settings Routes
 * ----------------------
 * PUT    /profile  – Update name and/or email
 * PUT    /settings – Update user settings (e.g. darkMode)
 * DELETE /history  – Clear all chats and analyses for the user
 */

const express = require('express');
const auth = require('../middleware/auth');
const fileStore = require('../services/fileStore');

const router = express.Router();

// ── Helper: strip password from user object ─────────────────────────────────
function sanitiseUser(user) {
  const { password, ...safe } = user;
  return safe;
}

// ── PUT /profile ────────────────────────────────────────────────────────────
router.put('/profile', auth, (req, res, next) => {
  try {
    const { name, email } = req.body;
    const updates = {};

    // Validate and collect updates
    if (name !== undefined) {
      const trimmed = String(name).trim();
      if (trimmed.length < 2 || trimmed.length > 50) {
        return res.status(400).json({
          success: false,
          message: 'Name must be between 2 and 50 characters.',
        });
      }
      updates.name = trimmed;
    }

    if (email !== undefined) {
      const trimmed = String(email).trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address.',
        });
      }

      // Make sure new email isn't already taken by another user
      const existing = fileStore.findUserByEmail(trimmed);
      if (existing && existing.id !== req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'This email is already in use by another account.',
        });
      }
      updates.email = trimmed;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided to update.',
      });
    }

    const updatedUser = fileStore.updateUser(req.user.id, updates);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: sanitiseUser(updatedUser),
    });
  } catch (error) {
    next(error);
  }
});

// ── PUT /settings ───────────────────────────────────────────────────────────
router.put('/settings', auth, (req, res, next) => {
  try {
    const { darkMode } = req.body;

    // Fetch current user
    const user = fileStore.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Build the updated settings object
    const currentSettings = user.settings || {};
    const newSettings = {
      ...currentSettings,
      ...(typeof darkMode === 'boolean' ? { darkMode } : {}),
    };

    const updatedUser = fileStore.updateUser(req.user.id, { settings: newSettings });

    return res.status(200).json({
      success: true,
      message: 'Settings updated successfully.',
      settings: updatedUser.settings,
    });
  } catch (error) {
    next(error);
  }
});

// ── DELETE /history ─────────────────────────────────────────────────────────
router.delete('/history', auth, (req, res, next) => {
  try {
    fileStore.clearUserHistory(req.user.id);

    return res.status(200).json({
      success: true,
      message: 'All history cleared successfully.',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
