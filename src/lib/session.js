
export const SESSION_KEY = 'tmq_session';
export const CREDS_KEY = 'tmq_saved_creds';
export const STATS_KEY = 'moniq_stats';

export function setSession(s) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
}
export function getSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); }
  catch { return null; }
}
export function clearSession() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch {}
  try { localStorage.removeItem(STATS_KEY); } catch {}
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
    try { localStorage.removeItem(STATS_KEY); } catch {}
  });
}
