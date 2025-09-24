// /api/moniq-token.js
export default async function handler(req, res) {
  // Cách nhanh: dùng token tĩnh từ ENV để chạy thử.
  const staticToken = process.env.MONIQ_STATIC_TOKEN;
  if (!staticToken) {
    return res.status(500).json({ error: "Missing MONIQ_STATIC_TOKEN" });
  }
  // TTL ngắn để client refresh token tự động
  const ttlSeconds = 300; // 5 phút
  const expiresAt = Date.now() + ttlSeconds * 1000;
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ token: staticToken, expiresAt });
}
