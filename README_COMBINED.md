# Combined fix pack (socket.io-client + Tailwind/PostCSS)

Mục tiêu: sửa triệt để lỗi build "Cannot find module 'tailwindcss'" và trước đó là 
"Rollup failed to resolve import 'socket.io-client'".

## 1) Sao lưu dự án
- Lưu lại `package.json`, `postcss.config.js`, `tailwind.config.js`, `src/index.css` hiện tại (nếu có).

## 2) Chép đè các file trong pack
- `package.json`
- `postcss.config.js`
- `tailwind.config.js`
- `src/index.css` (nếu bạn đã có CSS chính, bạn có thể `@import "./index.css";` vào nơi phù hợp)

## 3) Cài đặt & lock
Nếu build trên local: chạy
```bash
npm i
```
Nếu build chỉ trên Vercel, bạn có thể commit các file này (kể cả khi chưa run npm i local).

**Khuyến nghị:** commit cả lockfile hiện có của bạn (package-lock.json / yarn.lock / pnpm-lock.yaml). 
Nếu không có, Vercel sẽ tự sinh.

## 4) Đảm bảo import CSS trong entry
Trong `src/main.jsx` (hoặc file entry), thêm:
```js
import './index.css'
```

## 5) Redeploy & Clear Cache
Trên Vercel → Redeploy → tick **Clear build cache**.

---
Sau khi lên, lỗi tailwind sẽ hết, và `usePredictor` có thể import `socket.io-client` bình thường.
