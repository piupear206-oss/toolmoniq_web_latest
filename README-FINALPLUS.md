# toolmoniq_web_latest — FINAL+ (đã tích hợp E.164)

- Đăng nhập/Đăng ký/Quên mật khẩu: **số ĐT + OTP**, tự **chuẩn hoá E.164** (VD `0944...` -> `+84944...`).  
- Logo TOOLMONIQ, iframe biểu đồ Moniq (`VITE_MONIQ_CHART_URL`).  
- Dự đoán cố định 1 nến + thống kê đúng X/Y (%).  
- Hotfix Vercel: `vercel.json` + banner cảnh báo thiếu ENV.

## Cách dùng
1) Chép **toàn bộ** gói này đè lên `toolmoniq_web_latest`.
2) Tạo `.env` từ `.env.example` và điền biến `VITE_FIREBASE_*` + `VITE_MONIQ_CHART_URL`.
3) `npm i && npm run dev` (local) hoặc push lên Vercel.
