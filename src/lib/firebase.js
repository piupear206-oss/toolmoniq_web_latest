import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
};

const missing = Object.entries(cfg).filter(([k,v]) => !v).map(([k])=>k);
if (missing.length) {
  console.error('[TOOLMONIQ] Missing env:', missing.join(', '));
  window.__TOOLMONIQ_ENV_ERROR__ = 'Thiếu biến môi trường: ' + missing.join(', ');
}

export const app = initializeApp(cfg);
export const auth = getAuth(app);

export const getInvisibleRecaptcha = (containerId = 'recaptcha-container') => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(getAuth(), containerId, { size: 'invisible' });
  }
  return window.recaptchaVerifier;
};
