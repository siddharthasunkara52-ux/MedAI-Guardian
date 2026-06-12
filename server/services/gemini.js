/**
 * Gemini AI Service
 * -----------------
 * Provides structured medical-education analysis with explicit diagnostics.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

const SYSTEM_PROMPT =
  'You are a medical education assistant. You provide educational information only. ' +
  'Never provide diagnoses, treatment plans, or certainty claims. Explain information in simple language. ' +
  'Always encourage users to consult healthcare professionals. ' +
  'Highlight emergency situations when appropriate. Use a professional, calm, structured tone.';

function createClient() {
  return new GoogleGenerativeAI(config.GEMINI_API_KEY);
}

function createServiceError(message, status = 502, code = 'GEMINI_ERROR', cause) {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  error.cause = cause;
  return error;
}

function classifyGeminiError(error) {
  const text = [
    error?.message,
    error?.statusText,
    error?.response?.statusText,
    typeof error?.details === 'string' ? error.details : '',
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  const status = error?.status || error?.response?.status;

  if (!config.GEMINI_API_KEY) {
    return createServiceError(
      'Gemini API key is missing. Create server/.env and set GEMINI_API_KEY.',
      500,
      'GEMINI_API_KEY_MISSING',
      error
    );
  }

  if (status === 400 && text.includes('api key')) {
    return createServiceError('Gemini API key is invalid or malformed.', 502, 'GEMINI_API_KEY_INVALID', error);
  }

  if (status === 401 || status === 403 || text.includes('api key not valid') || text.includes('permission')) {
    return createServiceError('Gemini API key is invalid, expired, or not authorized for this model.', 502, 'GEMINI_API_KEY_INVALID', error);
  }

  if (status === 404 || text.includes('not found') || text.includes('model')) {
    return createServiceError(
      `Invalid Gemini model configuration: ${config.GEMINI_MODEL}. Check GEMINI_MODEL in server/.env.`,
      502,
      'GEMINI_MODEL_INVALID',
      error
    );
  }

  if (status === 429 || text.includes('quota') || text.includes('rate limit')) {
    return createServiceError('Gemini quota exceeded or rate limit reached. Try again later.', 429, 'GEMINI_QUOTA_EXCEEDED', error);
  }

  if (error?.code === 'ENOTFOUND' || error?.code === 'ECONNRESET' || error?.code === 'ETIMEDOUT' || text.includes('fetch failed')) {
    return createServiceError('Network connection to Gemini failed. Check internet access and firewall settings.', 502, 'GEMINI_NETWORK_ERROR', error);
  }

  return createServiceError('Gemini failed to generate a response. Check backend logs for details.', 502, 'GEMINI_UNKNOWN_ERROR', error);
}

function assertConfigured() {
  // In production we require a valid Gemini API key. In development, allow operation with a mocked response.
  if (process.env.NODE_ENV === 'production' && !config.GEMINI_API_KEY) {
    throw createServiceError(
      'Gemini API key is missing. Create server/.env and set GEMINI_API_KEY.',
      500,
      'GEMINI_API_KEY_MISSING'
    );
  }
}

function getModel() {
  if (!config.GEMINI_API_KEY) {
    // No real Gemini client configured; callers should handle mock behavior.
    return null;
  }

  const genAI = createClient();
  return genAI.getGenerativeModel({
    model: config.GEMINI_MODEL,
    systemInstruction: SYSTEM_PROMPT,
  });
}

function extractText(result) {
  const responseText = result?.response?.text?.();
  if (!responseText || !responseText.trim()) {
    throw createServiceError('Gemini returned an empty response.', 502, 'GEMINI_EMPTY_RESPONSE');
  }
  return responseText;
}

async function runGemini(promptOrParts) {
  // If no Gemini API key is configured (development), return a deterministic mock response
  // so that the server and client can be tested without external dependencies.
  if (!config.GEMINI_API_KEY) {
    const mockResponse = `## Mocked Gemini Response\n- This is a mock response used for local testing.\n\n## Disclaimer\n- This output is simulated and not medical advice.`;
    return mockResponse;
  }

  assertConfigured();
  const model = getModel();
  const result = await model.generateContent(promptOrParts);
  return extractText(result);
}

async function analyzeSymptoms(symptoms, language = 'en') {
  try {
    if (!symptoms || typeof symptoms !== 'string' || !symptoms.trim()) {
      throw createServiceError('Symptoms description is empty or invalid.', 400, 'INVALID_SYMPTOMS');
    }

    const langMap = { hi: 'Hindi', te: 'Telugu', en: 'English' };
    const targetLang = langMap[language] || 'English';

    const prompt =
      `A user describes the following symptoms: ${symptoms}. ` +
      'Return markdown using exactly these sections: ' +
      '## Symptoms Detected\n- Extract only symptoms the user described.\n' +
      '## Possible Explanations\n- Educational possibilities only. Clearly say these are not diagnoses.\n' +
      '## Risk Level\n- Low, Medium, High, or Emergency, with a brief reason.\n' +
      '## Self-Care Guidance\n- General, low-risk steps only.\n' +
      '## Doctor Consultation Advice\n- When and what to discuss with a clinician.\n' +
      '## Emergency Warnings\n- Red flags that require urgent care or local emergency services.\n' +
      '## Disclaimer\n- State this is educational and not medical diagnosis or treatment.\n\n' +
      `IMPORTANT: You must write the entire output in ${targetLang}.`;

    return await runGemini(prompt);
  } catch (error) {
    if (error.status && error.code) throw error;
    throw classifyGeminiError(error);
  }
}

async function analyzeReport(reportText, language = 'en') {
  try {
    if (!reportText || typeof reportText !== 'string' || !reportText.trim()) {
      throw createServiceError('Report text is empty or invalid.', 400, 'INVALID_REPORT_TEXT');
    }

    const langMap = { hi: 'Hindi', te: 'Telugu', en: 'English' };
    const targetLang = langMap[language] || 'English';

    const prompt =
      `A user has shared the following medical report text for educational understanding: ${reportText}. ` +
      'Do not diagnose. Return markdown using exactly these sections: ' +
      '## Executive Summary\n- Brief overview of the report\n' +
      '## Key Findings\n- List the main findings\n' +
      '## Abnormal Values\n- Highlight values that appear outside stated or common reference ranges; say if ranges are not visible\n' +
      '## Medical Term Explanations\n- Explain important terms in plain language\n' +
      '## Suggested Questions for Doctor\n- Practical questions the user can take to a clinician\n' +
      '## Disclaimer\n- State this is educational and not medical diagnosis or treatment.\n\n' +
      `IMPORTANT: You must write the entire output in ${targetLang}.`;

    return await runGemini(prompt);
  } catch (error) {
    if (error.status && error.code) throw error;
    throw classifyGeminiError(error);
  }
}

async function analyzeImage(base64Image, mimeType, language = 'en') {
  try {
    if (!base64Image || !mimeType) {
      throw createServiceError('Image payload is empty or invalid.', 400, 'INVALID_IMAGE_PAYLOAD');
    }

    const langMap = { hi: 'Hindi', te: 'Telugu', en: 'English' };
    const targetLang = langMap[language] || 'English';

    const prompt =
      'A user has shared a medical/health-related image for educational understanding. ' +
      'Do not identify a person and do not diagnose. Return markdown using exactly these sections: ' +
      '## Visual Observations\n- Describe visible, non-identifying observations only\n' +
      '## Possible Explanations\n- Educational possibilities only, not diagnoses\n' +
      '## Confidence Limitations\n- Explain limitations of AI image analysis and missing clinical context\n' +
      '## Safety Recommendations\n- General safety guidance and red flags\n' +
      '## Medical Consultation Advice\n- When to consult a qualified clinician\n' +
      '## Disclaimer\n- State this is educational and not medical diagnosis or treatment.\n\n' +
      `IMPORTANT: You must write the entire output in ${targetLang}.`;

    return await runGemini([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType,
        },
      },
    ]);
  } catch (error) {
    if (error.status && error.code) throw error;
    throw classifyGeminiError(error);
  }
}

module.exports = {
  analyzeSymptoms,
  analyzeReport,
  analyzeImage,
};
