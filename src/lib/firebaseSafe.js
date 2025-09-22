/**
 * Safe Firebase init:
 * - If VITE_FIREBASE_API_KEY is missing, this exports nulls so app still builds.
 * - When you add Firebase envs, it will initialize and export { app, auth }.
 */
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasConfig = Object.values(cfg).every(v => typeof v === 'string' && v.length > 0);

let app = null;
let auth = null;

if (hasConfig) {
  app = initializeApp(cfg);
  auth = getAuth(app);
}

export { app, auth };
