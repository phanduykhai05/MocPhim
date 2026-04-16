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

---

## ⚡ Hướng Dẫn Push Code Nhanh Lên Dev

### Cách 1: Push nhanh (sau khi thay đổi code)
```bash
git add .
git commit -m "Update: [mô tả thay đổi]"
git push origin dev
```

### Cách 2: One-liner (gõ nhanh)
```bash
git add . && git commit -m "Update" && git push origin dev
```

### Cách 3: Push mà không cần commit message dài
```bash
git add .
git commit -m "."
git push origin dev
```

---

## 📚 Hướng Dẫn Git Cơ Bản Cho Người Mới Bắt Đầu

### 1️⃣ **Lần đầu: Clone Project**
```bash
git clone https://github.com/phanduykhai05/MocPhim.git
cd MocPhim/Frontend
```

### 2️⃣ **Check trạng thái trước khi làm việc**
```bash
git status
```
Xem những file nào đã thay đổi.

### 3️⃣ **Lưu thay đổi (Commit)**

**Bước 1**: Thêm file vào staging area
```bash
git add .
```
_(Dấu `.` có nghĩa là thêm tất cả file thay đổi)_

**Bước 2**: Commit (lưu thay đổi)
```bash
git commit -m "Mô tả thay đổi của bạn"
```

**Ví dụ**:
```bash
git commit -m "Fix footer logo display"
git commit -m "Add navigation menu"
git commit -m "Update API endpoint"
```

### 4️⃣ **Push lên GitHub (tải code lên server)**
```bash
git push origin dev
```

### 5️⃣ **Pull code từ GitHub (lấy code từ server)**
```bash
git pull origin dev
```
Chạy lệnh này trước khi bắt đầu làm việc để lấy code mới nhất.

### 6️⃣ **Tạo nhánh riêng (nếu cần)**
```bash
git checkout -b feature/ten-feature
```
Sau làm xong:
```bash
git push origin feature/ten-feature
```

---

## 🔄 **Quy Trình Làm Việc Hàng Ngày (Recommended)**

### Sáng - Bắt đầu làm việc:
```bash
git pull origin dev
```

### Giữa ngày - Lưu thay đổi:
```bash
git add .
git commit -m "Thay đổi gì vậy?"
git push origin dev
```

### Cuối ngày - Push cuối cùng:
```bash
git add .
git commit -m "Final update"
git push origin dev
```

---

## ⚠️ **Tình Huống Thường Gặp**

### ❌ Tôi commit sai rồi, phải làm sao?
```bash
git reset HEAD~1
```
(Hủy commit cuối cùng nhưng giữ code)

### ❌ Tôi làm sai rồi, muốn quay lại phiên bản cũ?
```bash
git checkout .
```
(Hủy tất cả thay đổi chưa commit)

### ❌ Conflict khi pull code
```bash
git status
```
Sửa file conflict, rồi:
```bash
git add .
git commit -m "Resolve conflict"
git push origin dev
```

---

## 🎯 **Commit Message Tips**
Viết message rõ ràng để bạn bè hiểu:

✅ **Tốt**:
- "Fix footer background opacity"
- "Add hero section animations"
- "Update API response handling"

❌ **Tệ**:
- "fix"
- "update"
