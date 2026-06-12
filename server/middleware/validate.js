/**
 * Input Validation Middleware
 * --------------------------
 * Pure validation functions that return { valid, errors } plus
 * Express middleware wrappers that short-circuit with 400 on failure.
 */

// ── Validation Functions ────────────────────────────────────────────────────

/**
 * Validate registration input.
 * @param {{ name: string, email: string, password: string }} body
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateRegister(body) {
  const errors = [];
  const { name, email, password } = body || {};

  // Name: required, 2-50 characters
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long.');
  } else if (name.trim().length > 50) {
    errors.push('Name must not exceed 50 characters.');
  }

  // Email: required, basic format check
  if (!email || typeof email !== 'string') {
    errors.push('A valid email address is required.');
  } else {
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 254) {
      errors.push('Please provide a valid email address.');
    }
  }

  // Password: required, bounded to keep hashing work predictable.
  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  } else if (password.length > 128) {
    errors.push('Password must not exceed 128 characters.');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate login input.
 * @param {{ email: string, password: string }} body
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateLogin(body) {
  const errors = [];
  const { email, password } = body || {};

  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.push('Email is required.');
  } else if (email.trim().length > 254) {
    errors.push('Please provide a valid email address.');
  }

  if (!password || typeof password !== 'string' || !password.trim()) {
    errors.push('Password is required.');
  } else if (password.length > 128) {
    errors.push('Password must not exceed 128 characters.');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate symptom checker input.
 * @param {{ symptoms: string }} body
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateSymptomInput(body) {
  const errors = [];
  const { symptoms } = body || {};

  if (!symptoms || typeof symptoms !== 'string' || !symptoms.trim()) {
    errors.push('Symptoms description is required.');
  } else if (symptoms.trim().length < 3) {
    errors.push('Symptoms description must be at least 3 characters.');
  } else if (symptoms.trim().length > 2000) {
    errors.push('Symptoms description must be 2000 characters or fewer.');
  }

  return { valid: errors.length === 0, errors };
}

// ── Middleware Wrappers ─────────────────────────────────────────────────────

/** Middleware that validates registration fields. */
function validateRegisterMiddleware(req, res, next) {
  const { valid, errors } = validateRegister(req.body);
  if (!valid) {
    return res.status(400).json({ success: false, errors });
  }
  next();
}

/** Middleware that validates login fields. */
function validateLoginMiddleware(req, res, next) {
  const { valid, errors } = validateLogin(req.body);
  if (!valid) {
    return res.status(400).json({ success: false, errors });
  }
  next();
}

/** Middleware that validates symptom input fields. */
function validateSymptomMiddleware(req, res, next) {
  const { valid, errors } = validateSymptomInput(req.body);
  if (!valid) {
    return res.status(400).json({ success: false, errors });
  }
  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateSymptomInput,
  validateRegisterMiddleware,
  validateLoginMiddleware,
  validateSymptomMiddleware,
};
