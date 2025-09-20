# toolmoniq_web_latest — FINAL_FREE (không tốn phí SMS)

✅ Không dùng Phone OTP → **không cần Billing**.  
- Đăng ký: **Số điện thoại + Email khôi phục + Mật khẩu**.  
- Đăng nhập: **Số điện thoại + Mật khẩu** (tra Firestore để lấy email rồi đăng nhập Email/Password).  
- Quên mật khẩu: nhập **Số điện thoại** → gửi **email reset** đến email đã đăng ký (miễn phí).

## Bật trong Firebase
- Authentication → **Sign-in method**: bật **Email/Password** (Phone có thể tắt).  
- Firestore Database: nhấn **Create database** (mode test hoặc rules an toàn).  
- Authorized domains: thêm domain Vercel của bạn.

## Biến môi trường
Điền `.env` theo `.env.example` (không thay đổi so với trước).

## Chạy
```
npm i
npm run dev
```

## Ghi chú
- Khi đăng ký, tạo document `phone_map/{phoneE164}` lưu `{uid, email, phone}`.  
- Khi đăng nhập/quên mật khẩu, lấy email từ `phone_map` bằng số điện thoại, sau đó dùng Email/Password hoặc gửi email reset.

