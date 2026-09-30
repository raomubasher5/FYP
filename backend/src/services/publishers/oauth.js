'use strict';

const crypto = require('crypto');

/**
 * In-memory store for in-flight OAuth flows (PKCE verifiers + state).
 * Flows live for 10 minutes; a server restart simply invalidates any
 * in-progress authorization (the user reconnects — no data lost).
 */
const pending = new Map();
const TTL_MS = 10 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of pending) {
    if (now - entry.createdAt > TTL_MS) pending.delete(key);
  }
}, 60 * 1000).unref();

function pkce() {
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}

/**
 * Start a new OAuth flow for a platform.
 * @returns {{ state: string, verifier: string, challenge: string, createdAt: number }}
 */
function start(platform, meta = {}) {
  const state = crypto.randomBytes(24).toString('hex');
  const { verifier, challenge } = pkce();
  pending.set(state, { platform, meta, verifier, createdAt: Date.now() });
  return { state, verifier, challenge };
}

/** Consume a flow by its state (validates + removes it). */
function consume(state) {
  const entry = pending.get(state || '');
  if (!entry) return null;
  pending.delete(state);
  if (Date.now() - entry.createdAt > TTL_MS) return null;
  return entry;
}

module.exports = { start, consume };
