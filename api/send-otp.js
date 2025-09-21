
// api/send-otp.js
import { admin } from './_firebaseAdmin.js';
import fetch from 'node-fetch';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const BRAND = process.env.APP_BRAND || 'TOOLMONIQ';
const OTP_TTL_MIN = Number(process.env.OTP_TTL_MIN || 10);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' }); return;
  }
  try {
    const { email } = JSON.parse(req.body || '{}');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'Invalid email' }); return;
    }

    // Check user exists
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
    } catch {
      res.status(404).json({ error: 'Email not found' }); return;
    }

    // Generate 6-digit OTP
    const otp = (Math.floor(100000 + Math.random() * 900000)).toString();

    // Store hashed OTP with TTL in Firestore
    const db = admin.firestore();
    const docRef = db.collection('password_otps').doc(email.toLowerCase());
    const expiresAt = Date.now() + OTP_TTL_MIN * 60 * 1000;
    await docRef.set({
      email: email.toLowerCase(),
      otpHash: admin.firestore.FieldValue.serverTimestamp(), // placeholder to ensure doc exists before set
    }, { merge: true });
    // Save hash after we have the doc to avoid race—just write directly
    await docRef.set({
      otpHash: hash(otp),
      expiresAt,
      attempts: 0,
      createdAt: Date.now(),
    }, { merge: true });

    // Send email via Resend
    const subject = `OTP khôi phục mật khẩu - ${BRAND}`;
    const html = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial">
        <h2>${BRAND}</h2>
        <p>Mã OTP khôi phục mật khẩu của bạn là:</p>
        <div style="font-size:28px;font-weight:700;letter-spacing:3px">${otp}</div>
        <p>OTP có hiệu lực trong ${OTP_TTL_MIN} phút. Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
      </div>
    `;
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `TOOLMONIQ <noreply@resend.dev>`,
        to: [email],
        subject,
        html
      })
    });
    if (!resp.ok) {
      const msg = await resp.text();
      res.status(500).json({ error: 'Failed to send email', detail: msg }); return;
    }

    res.status(200).json({ ok: true, ttlMin: OTP_TTL_MIN });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Internal error' });
  }
}

function hash(s) {
  // simple sha256
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(s + (process.env.OTP_PEPPER || '')).digest('hex');
}
