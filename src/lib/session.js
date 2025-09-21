
// src/lib/session.js
export const SESSION_KEY = 'tmq_session';
export const CREDS_KEY = 'tmq_saved_creds';

export function setSession(s) { sessionStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
export function getSession() { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; } }
