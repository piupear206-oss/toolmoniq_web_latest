# MONIQ WS Pack (Serverless token + Hook)

Gói này giúp bạn không còn phụ thuộc token cũ mỗi lần reload:
- `/api/moniq-token.js` cấp **token tạm** từ ENV `MONIQ_STATIC_TOKEN` (5 phút).
- `useMoniqSocket.js` (React hook) **xin token mới** và tự **refresh** trước khi hết hạn, tự reconnect.

## Cài đặt (5 phút)
1) Sao chép thư mục trong gói vào project của bạn (giữ nguyên đường dẫn):
   - `api/moniq-token.js`
   - `src/hooks/useMoniqSocket.js`
2) Thêm ENV trên Vercel (Project → Settings → Environment Variables):
   - `MONIQ_STATIC_TOKEN` = token copy từ Network tab (request `socket.io/?token=...`).
   - `VITE_MONIQ_WS_URL` = `wss://moniq3.com/socket.io/` (hoặc proxy của bạn).
3) Đảm bảo đã cài lib client WS:
   ```bash
   npm i socket.io-client
   ```
   (Nếu dùng pack fix trước đó thì đã có rồi.)
4) Sử dụng trong Dashboard:
   ```jsx
   import { useMoniqSocket } from "@/hooks/useMoniqSocket";
   import { useEffect } from "react";

   export default function DashboardPanel() {
     const { socket, status, lastError } = useMoniqSocket();

     useEffect(() => {
       if (!socket) return;
       const onTick = (payload) => {
         // payload sẽ có { close, ... } -> cập nhật state dự đoán
       };
       socket.on("BTCUSDT", onTick);
       return () => socket.off("BTCUSDT", onTick);
     }, [socket]);

     return (
       <div>
         <div>WS: {status}{lastError ? " – " + lastError : ""}</div>
         {/* ...phần còn lại của panel */}
       </div>
     );
   }
   ```
5) Commit & deploy. Khi lên, hook sẽ tự xin token từ `/api/moniq-token` → mở WS.

## Nâng cấp bảo mật
- Thay `MONIQ_STATIC_TOKEN` bằng một **token provider** thực thụ (service đăng nhập/refresh).
- Nếu bị chặn CORS/Origin cho WS, dựng **proxy** (serverless/edge) để relay WebSocket.
