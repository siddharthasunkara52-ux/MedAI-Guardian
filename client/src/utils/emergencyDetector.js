const EMERGENCY_KEYWORDS = [
  'chest pain',
  'heart attack',
  'stroke',
  'unconscious',
  'severe bleeding',
  'breathing difficulty',
  'difficulty breathing',
  'suicide',
  'overdose',
  'seizure',
  'anaphylaxis',
  'choking',
  'not breathing',
  "can't breathe",
  'cannot breathe',
  'cardiac arrest',
  'coughing blood',
  'severe head injury',
  'loss of consciousness',
];

export function detectEmergency(text) {
  if (!text || typeof text !== 'string') {
    return { isEmergency: false, keywords: [] };
  }

  const lowerText = text.toLowerCase();
  const matchedKeywords = EMERGENCY_KEYWORDS.filter((keyword) =>
    lowerText.includes(keyword.toLowerCase())
  );

  return {
    isEmergency: matchedKeywords.length > 0,
    keywords: matchedKeywords,
  };
}
