# Frontend Setup (Next.js + pnpm)

## 📌 Requirements
Trước khi chạy project, hãy đảm bảo máy bạn đã cài:

- **Node.js** (khuyến nghị v18+ hoặc v20+)
- **pnpm**

Kiểm tra phiên bản:
```bash
node -v
pnpm -v
```
📥 Clone Project
```bash
git clone https://github.com/phanduykhai05/MocPhim.git
cd Frontend
```
📦 Install Dependencies

Cài đặt thư viện bằng pnpm:
```bash
pnpm install
```

▶️ Run Development Server

Chạy project ở môi trường dev:
```bash
pnpm dev
```
Sau đó mở trình duyệt tại:
```bash
http://localhost:3000
```
🏗 Build Production

Build project để deploy:
```bash
pnpm build
```
🚀 Start Production

Sau khi build xong, chạy production:
```bash
pnpm start
```
🧹 Fix lỗi thường gặp
❌ Lỗi: Cannot find module 'next/dist/bin/next'

Nguyên nhân: chưa cài dependency đầy đủ.

Fix:
```bash
rm -rf node_modules .next pnpm-lock.yaml
pnpm install
pnpm dev
```
(Windows CMD)
```bash
rmdir /s /q node_modules
rmdir /s /q .next
del pnpm-lock.yaml
pnpm install
pnpm dev
```