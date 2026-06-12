/**
 * File-Based Data Store
 * ---------------------
 * Persists users, chats, and analyses as JSON files inside server/data/.
 * Each public helper reads → mutates → writes atomically (single-process).
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// ── Paths ───────────────────────────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CHATS_FILE = path.join(DATA_DIR, 'chats.json');
const ANALYSES_FILE = path.join(DATA_DIR, 'analyses.json');

// ── Initialisation ──────────────────────────────────────────────────────────

/**
 * Ensure the data directory and all JSON files exist.
 * Safe to call multiple times (idempotent).
 */
function initStore() {
  // Create directory if missing
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('Created data directory:', DATA_DIR);
  }

  // Create each JSON file with an empty array if it doesn't exist
  const files = [USERS_FILE, CHATS_FILE, ANALYSES_FILE];
  for (const filePath of files) {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
      console.log('Created store file:', path.basename(filePath));
    }
  }
}

// ── Generic read / write ────────────────────────────────────────────────────

/**
 * Read and parse a JSON data file.
 * @param {string} filename - File name inside the data directory (e.g. "users.json").
 * @returns {Array} Parsed array.
 */
function readData(filename) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Error reading ${filename}:`, error.message);
    return [];
  }
}

/**
 * Write data to a JSON file (overwrites existing content).
 * @param {string} filename - File name inside the data directory.
 * @param {Array}  data     - Array to persist.
 */
function writeData(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  const tempPath = `${filePath}.tmp`;
  try {
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
  } catch (error) {
    console.error(`Error writing ${filename}:`, error.message);
    throw new Error(`Failed to write data to ${filename}`);
  }
}

// ── User helpers ────────────────────────────────────────────────────────────

/** Return all users. */
function getUsers() {
  return readData('users.json');
}

/**
 * Add a new user to the store.
 * Automatically assigns a uuid and createdAt timestamp.
 * @param {object} user - Must include name, email, password (hashed).
 * @returns {object} The saved user object (with id & createdAt).
 */
function addUser(user) {
  const users = getUsers();
  const newUser = {
    id: uuidv4(),
    name: user.name,
    email: user.email,
    password: user.password,
    settings: { darkMode: false },
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  writeData('users.json', users);
  return newUser;
}

/**
 * Find a user by email (case-insensitive).
 * @param {string} email
 * @returns {object|undefined}
 */
function findUserByEmail(email) {
  if (typeof email !== 'string') return undefined;
  const users = getUsers();
  const normalized = email.trim().toLowerCase();
  return users.find((u) => typeof u.email === 'string' && u.email.toLowerCase() === normalized);
}

/**
 * Find a user by ID.
 * @param {string} id
 * @returns {object|undefined}
 */
function findUserById(id) {
  const users = getUsers();
  return users.find((u) => u.id === id);
}

/**
 * Update an existing user's fields and persist.
 * @param {string} id      - User ID.
 * @param {object} updates - Key/value pairs to merge.
 * @returns {object|null}  The updated user or null if not found.
 */
function updateUser(id, updates) {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  users[index] = { ...users[index], ...updates };
  writeData('users.json', users);
  return users[index];
}

// ── Chat helpers ────────────────────────────────────────────────────────────

/**
 * Get all chats for a specific user.
 * @param {string} userId
 * @returns {Array}
 */
function getChats(userId) {
  const chats = readData('chats.json');
  return chats.filter((c) => c.userId === userId);
}

/**
 * Add a new chat entry.
 * @param {object} chat - Must include userId, userMessage, aiResponse, isEmergency.
 * @returns {object} The saved chat (with id & timestamp).
 */
function addChat(chat) {
  const chats = readData('chats.json');
  const newChat = {
    id: uuidv4(),
    userId: chat.userId,
    userMessage: chat.userMessage,
    aiResponse: chat.aiResponse,
    isEmergency: chat.isEmergency || false,
    timestamp: new Date().toISOString(),
  };
  chats.push(newChat);
  writeData('chats.json', chats);
  return newChat;
}

/**
 * Get a single chat by its ID.
 * @param {string} id
 * @returns {object|undefined}
 */
function getChatById(id) {
  const chats = readData('chats.json');
  return chats.find((c) => c.id === id);
}

/**
 * Delete a chat by ID.
 * @param {string} id
 * @returns {boolean} True if deleted, false if not found.
 */
function deleteChat(id) {
  const chats = readData('chats.json');
  const filtered = chats.filter((c) => c.id !== id);
  if (filtered.length === chats.length) return false;
  writeData('chats.json', filtered);
  return true;
}

// ── Analysis helpers ────────────────────────────────────────────────────────

/**
 * Get analyses for a user, optionally filtered by type.
 * @param {string}  userId
 * @param {string} [type] - "report" or "image" (omit for all).
 * @returns {Array}
 */
function getAnalyses(userId, type) {
  const analyses = readData('analyses.json');
  return analyses.filter((a) => {
    if (a.userId !== userId) return false;
    if (type && a.type !== type) return false;
    return true;
  });
}

/**
 * Add a new analysis entry.
 * @param {object} analysis - Must include userId, type, aiResponse, originalName.
 * @returns {object} The saved analysis (with id & timestamp).
 */
function addAnalysis(analysis) {
  const analyses = readData('analyses.json');
  const newAnalysis = {
    id: uuidv4(),
    userId: analysis.userId,
    type: analysis.type,
    originalName: analysis.originalName || 'unknown',
    aiResponse: analysis.aiResponse,
    timestamp: new Date().toISOString(),
  };
  analyses.push(newAnalysis);
  writeData('analyses.json', analyses);
  return newAnalysis;
}

/**
 * Delete all analyses belonging to a user.
 * @param {string} userId
 */
function deleteAnalysesByUser(userId) {
  const analyses = readData('analyses.json');
  const filtered = analyses.filter((a) => a.userId !== userId);
  writeData('analyses.json', filtered);
}

// ── Compound helpers ────────────────────────────────────────────────────────

/**
 * Clear all chats AND analyses for a user (history wipe).
 * @param {string} userId
 */
function clearUserHistory(userId) {
  // Remove chats
  const chats = readData('chats.json');
  writeData('chats.json', chats.filter((c) => c.userId !== userId));

  // Remove analyses
  deleteAnalysesByUser(userId);
}

module.exports = {
  initStore,
  readData,
  writeData,
  getUsers,
  addUser,
  findUserByEmail,
  findUserById,
  updateUser,
  getChats,
  addChat,
  getChatById,
  deleteChat,
  getAnalyses,
  addAnalysis,
  deleteAnalysesByUser,
  clearUserHistory,
};
