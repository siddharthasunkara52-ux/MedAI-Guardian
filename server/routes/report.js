/**
 * Report Analysis Routes
 * ----------------------
 * POST /analyze  – Upload a PDF/text report and get AI analysis
 * GET  /history  – List all report analyses for the authenticated user
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const auth = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');
const { reportUpload } = require('../middleware/upload');
const gemini = require('../services/gemini');
const fileStore = require('../services/fileStore');

const router = express.Router();

// ── POST /analyze ───────────────────────────────────────────────────────────
router.post(
  '/analyze',
  auth,
  aiLimiter,
  (req, res, next) => {
    // Handle multer upload; catch file-filter / size errors
    reportUpload.single('report')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  async (req, res, next) => {
    let filePath = null;

    try {
      // Validate that a file was actually uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a report file (PDF or text).',
        });
      }

      filePath = req.file.path;
      let reportText = '';

      // Extract text based on MIME type
      if (req.file.mimetype === 'application/pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        reportText = pdfData.text;
      } else {
        // Plain text
        reportText = fs.readFileSync(filePath, 'utf-8');
      }

      // Guard against empty content
      if (!reportText || !reportText.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Could not extract any text from the uploaded file.',
        });
      }

      // Call Gemini for analysis
      const lang = req.headers['accept-language'] || 'en';
      const aiResponse = await gemini.analyzeReport(reportText, lang);

      // Persist analysis record
      const analysis = fileStore.addAnalysis({
        userId: req.user.id,
        type: 'report',
        originalName: req.file.originalname,
        aiResponse,
      });

      return res.status(200).json({ success: true, analysis });
    } catch (error) {
      next(error);
    } finally {
      // Clean up uploaded file regardless of outcome
      if (filePath && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          console.error('Failed to delete uploaded file:', unlinkErr.message);
        }
      }
    }
  }
);

// ── GET /history ────────────────────────────────────────────────────────────
router.get('/history', auth, (req, res, next) => {
  try {
    const analyses = fileStore.getAnalyses(req.user.id, 'report');

    // Sort newest first
    analyses.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return res.status(200).json({ success: true, analyses });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
