/**
 * Chat / Symptom Checker Routes
 * -----------------------------
 * POST   /symptom  – Analyse symptoms via Gemini (AI-rate-limited)
 * GET    /history  – List all chats for the authenticated user
 * GET    /:id      – Retrieve a single chat
 * DELETE /:id      – Delete a single chat
 */

const express = require('express');
const auth = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');
const { validateSymptomMiddleware } = require('../middleware/validate');
const gemini = require('../services/gemini');
const fileStore = require('../services/fileStore');

const router = express.Router();

// ── Emergency keyword list ──────────────────────────────────────────────────
const EMERGENCY_KEYWORDS = [
  'chest pain',
  'heart attack',
  'stroke',
  'unconscious',
  'severe bleeding',
  'breathing difficulty',
  'suicide',
  'overdose',
  'seizure',
  'anaphylaxis',
];

/**
 * Check whether the symptom text contains any emergency keywords.
 * @param {string} text
 * @returns {boolean}
 */
function detectEmergency(text) {
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some((kw) => lower.includes(kw));
}

// ── POST /symptom ───────────────────────────────────────────────────────────
router.post(
  '/symptom',
  auth,
  aiLimiter,
    validateSymptomMiddleware,
  async (req, res, next) => {
    try {
      const { symptoms } = req.body;
      const isEmergency = detectEmergency(symptoms);

      // Call Gemini for educational analysis
      const lang = req.headers['accept-language'] || 'en';
      const aiResponse = await gemini.analyzeSymptoms(symptoms, lang);

      // Persist chat
      const chat = fileStore.addChat({
        userId: req.user.id,
        userMessage: symptoms,
        aiResponse,
        isEmergency,
      });

      return res.status(200).json({
        success: true,
        chat,
        isEmergency,
        ...(isEmergency && {
          emergencyMessage:
            '⚠️ Your description mentions symptoms that may require immediate medical attention. ' +
            'Please call emergency services (911 / local number) or go to the nearest emergency room immediately.',
        }),
      });
    } catch (error) {
      if (error.status && error.code) {
        return res.status(error.status).json({
          success: false,
          code: error.code,
          message: error.message,
        });
      }

      next(error);
    }
  }
);

// ── GET /history ────────────────────────────────────────────────────────────
router.get('/history', auth, (req, res, next) => {
  try {
    const chats = fileStore.getChats(req.user.id);

    // Sort newest first
    chats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return res.status(200).json({ success: true, chats });
  } catch (error) {
    next(error);
  }
});

// ── GET /:id ────────────────────────────────────────────────────────────────
router.get('/:id', auth, (req, res, next) => {
  try {
    const chat = fileStore.getChatById(req.params.id);

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found.' });
    }

    // Ensure the chat belongs to the requesting user
    if (chat.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    return res.status(200).json({ success: true, chat });
  } catch (error) {
    next(error);
  }
});

// ── DELETE /:id ─────────────────────────────────────────────────────────────
router.delete('/:id', auth, (req, res, next) => {
  try {
    const chat = fileStore.getChatById(req.params.id);

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found.' });
    }

    // Ensure ownership
    if (chat.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    fileStore.deleteChat(req.params.id);

    return res.status(200).json({ success: true, message: 'Chat deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
