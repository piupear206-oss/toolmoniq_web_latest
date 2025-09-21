
// api/reset-password.js
import { admin } from './_firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  try {
    const { email, otp, newPassword } = JSON.parse(req.body || '{}');
    if (!email || !otp || !newPassword || newPassword.length < 6) {
      res.status(400).json({ error: 'Missing fields' }); return;
    }

    const db = admin.firestore();
    const docRef = db.collection('password_otps').doc(email.toLowerCase());
    const snap = await docRef.get();
    if (!snap.exists) { res.status(400).json({ error: 'OTP not found' }); return; }
    const data = snap.data();
    const now = Date.now();
    if (!data.expiresAt || now > data.expiresAt) {
      res.status(400).json({ error: 'OTP expired' }); return;
    }
    if (data.attempts >= 5) { res.status(429).json({ error: 'Too many attempts' }); return; }

    const ok = (data.otpHash === hash(otp));
    await docRef.set({ attempts: admin.firestore.FieldValue.increment(1) }, { merge: true });
    if (!ok) { res.status(400).json({ error: 'Invalid OTP' }); return; }

    // Update password using Firebase Admin
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, { password: newPassword });

    // Invalidate OTP
    await docRef.delete();

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Internal error' });
  }
}

function hash(s) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(s + (process.env.OTP_PEPPER || '')).digest('hex');
}
