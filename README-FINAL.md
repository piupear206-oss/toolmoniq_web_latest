# toolmoniq_web_latest — FINAL (tự ghi đè)

Đã tích hợp đầy đủ:
- Cổng **Đăng nhập/Đăng ký/Quên mật khẩu** bằng **số ĐT + OTP** và **mật khẩu** do người dùng đặt.
- **Logo TOOLMONIQ**.
- Trang chính có **iframe biểu đồ nến Moniq** (`VITE_MONIQ_CHART_URL`).
- **Dự đoán cố định 1 nến** + thống kê **Đã đúng X/Y (%)**.
- **Hotfix Vercel**: `vercel.json` (SPA rewrite) + kiểm tra thiếu ENV và hiển thị banner lỗi thay vì màn hình đen.

## Cách dùng
1) Chép **toàn bộ** gói này đè lên thư mục `toolmoniq_web_latest`.
2) Tạo `.env` từ `.env.example` và điền đủ biến `VITE_FIREBASE_*` + `VITE_MONIQ_CHART_URL`.
3) `npm i && npm run dev` (local) hoặc push lên Vercel.
