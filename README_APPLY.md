# Lockfiles pack for TOOLMONIQ
Mục đích: thêm `socket.io-client` vào dependencies để Vercel build thành công.

## Cách áp dụng
1) **Sao lưu `package.json` hiện tại của bạn.**
2) Chép **package.json** trong pack này đè file cũ (hoặc tự hợp nhất `socket.io-client` vào `dependencies`).
3) Chọn **1** trình quản lý gói bạn đang dùng (npm **hoặc** yarn **hoặc** pnpm):
   - Nếu dùng **npm**: chép `package-lock.json` đè.  
   - Nếu dùng **yarn**: chép `yarn.lock` đè.  
   - Nếu dùng **pnpm**: chép `pnpm-lock.yaml` đè.
4) Commit & push:
   ```bash
   git add package.json package-lock.json yarn.lock pnpm-lock.yaml 2>/dev/null || true
   git commit -m "chore: add socket.io-client + lockfile"
   git push
   ```
5) **Redeploy** trên Vercel. Nếu còn lỗi cache, chọn *Clear build cache* rồi redeploy lại.

> Lưu ý: lockfile trong pack là **tối thiểu** để un-block build. Sau lần `install` đầu trên CI/CD,
> trình quản lý gói sẽ resolve chính xác các phiên bản.
