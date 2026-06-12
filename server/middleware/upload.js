/**
 * File Upload Middleware (Multer)
 * ------------------------------
 * Two pre-configured upload handlers:
 *   • reportUpload – PDFs and plain-text files (max 10 MB)
 *   • imageUpload  – JPEG, PNG, WebP images   (max 5 MB)
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ── Ensure uploads directory exists ─────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ── Disk storage: timestamp-prefixed original name ──────────────────────────
const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename(_req, file, cb) {
    const safeName = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueName = `${Date.now()}-${safeName}`;
    cb(null, uniqueName);
  },
});

// ── Allowed MIME types ──────────────────────────────────────────────────────
const REPORT_MIMES = ['application/pdf', 'text/plain'];
const REPORT_EXTS = ['.pdf', '.txt', '.text'];

const IMAGE_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];

// ── File filter factories ───────────────────────────────────────────────────

/**
 * Creates a Multer fileFilter that accepts only the specified MIME types.
 * @param {string[]} allowedMimes - Array of allowed MIME type strings.
 * @param {string}   label        - Human-readable label for error messages.
 * @returns {Function} Multer-compatible fileFilter.
 */
function createFileFilter(allowedMimes, allowedExts, label) {
  return function fileFilter(_req, file, cb) {
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Only ${label} files are allowed.`), false);
    }
  };
}

// ── Export two upload instances ──────────────────────────────────────────────

/** Accepts PDF and text files up to 10 MB. */
const reportUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: createFileFilter(REPORT_MIMES, REPORT_EXTS, 'PDF and text'),
});

/** Accepts JPEG, PNG, and WebP images up to 5 MB. */
const imageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: createFileFilter(IMAGE_MIMES, IMAGE_EXTS, 'image (JPEG, PNG, WebP)'),
});

module.exports = { reportUpload, imageUpload };
