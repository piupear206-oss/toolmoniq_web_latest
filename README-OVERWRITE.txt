Cách ghi đè trực tiếp:

1) Giải nén gói này vào thư mục gốc dự án của bạn (toolmoniq_web_latest),
   cho phép REPLACE/OVERWRITE các file trùng tên.

   - vercel.json  (bắt buộc)
   - vite.config.js (khuyến nghị, nếu bạn chưa có config React chuẩn)
   - src/pages/Dashboard.jsx (đã fix JSX + bố cục)

2) Mở package.json của bạn:
   - Sửa/Thêm:
       "engines": { "node": "20.x" }
     và giữ scripts theo Vite:
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview"

3) Trên Vercel → Project → Settings → Environment Variables:
   Thêm biến client:
       VITE_MONIQ_CHART_URL = https://moniq3.com/user/trade
   (hoặc URL chart bạn muốn nhúng)

4) Redeploy.

Sau khi làm xong, truy cập domain Vercel sẽ không còn trắng trang.
