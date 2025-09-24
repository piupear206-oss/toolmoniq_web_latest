# MONIQ WS Integrated Pack

Hỗ trợ **2 đường**:
- **Socket.IO:** `wss://moniq3.com/socket.io/` (khuyến nghị)
- **Raw WS:** `wss://moniq3.com/user/ws/ws`

## Tích hợp
1) Chép:
   - `api/moniq-token.js`
   - `src/hooks/useMoniqStream.js`
2) ENV (Vercel):
   - `MONIQ_STATIC_TOKEN` = JWT token của bạn (giá trị sau `token=...`).
   - `VITE_MONIQ_MODE` = `socketio` hoặc `raw` (mặc định `socketio`).
   - `VITE_MONIQ_WS_URL` = `wss://moniq3.com/socket.io/`
   - `VITE_MONIQ_RAW_WS_URL` = `wss://moniq3.com/user/ws/ws`
3) Cài lib:
   ```
   npm i socket.io-client
   ```
4) Dùng:
   ```jsx
   import { useMoniqStream } from "@/hooks/useMoniqStream";
   // ...
   const { mode, socket, ws, status, lastError } = useMoniqStream();
   ```
