// /api/moniq-token.js
export default async function handler(req, res) {
  const staticToken = process.env.MONIQ_STATIC_TOKEN;
  if (!staticToken) {
    return res.status(500).json({ error: "Missing MONIQ_STATIC_TOKEN" });
  }
  const ttlSeconds = 300; // 5 minutes
  const expiresAt = Date.now() + ttlSeconds * 1000;
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ token: staticToken, expiresAt });
}
