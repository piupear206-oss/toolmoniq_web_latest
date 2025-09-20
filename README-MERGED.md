# toolmoniq_web_latest (MERGED)

Đã ghi đè/ổn định cấu trúc theo yêu cầu:
- Cổng **Đăng nhập/Đăng ký/Quên mật khẩu** bằng **số điện thoại + OTP** và **mật khẩu** do người dùng đặt.
- **Logo TOOLMONIQ**.
- Trang chính có **iframe biểu đồ nến Moniq** lấy từ `VITE_MONIQ_CHART_URL`.
- **Dự đoán cố định theo 1 nến** + thống kê **Đã đúng X/Y (tỷ lệ %)**.

## Cách chạy
```
npm i
npm run dev
```
Tạo file `.env` từ `.env.example` và điền cấu hình Firebase + `VITE_MONIQ_CHART_URL`.

## Nối dữ liệu Moniq thật
Sửa 2 hàm trong `src/pages/Dashboard.jsx`:
- `getMoniqCandleState()` → `{ open, close, isClosed, id }`
- `getMoniqPrediction()` → `'BUY' | 'SELL'`
