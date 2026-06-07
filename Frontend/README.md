# MocPhim Frontend

## Tổng quan
MocPhim Frontend là một ứng dụng web hiện đại được xây dựng bằng Next.js và TypeScript. Đây là giao diện người dùng của nền tảng MocPhim, cung cấp trải nghiệm mượt mà để duyệt, xem và tương tác với các bộ phim và nội dung liên quan.

## Tính năng
- **Duyệt phim**: Khám phá danh sách phim với thông tin chi tiết.
- **Xem phim**: Phát trực tiếp các bộ phim trên nền tảng.
- **Thiết kế đáp ứng**: Tối ưu hóa cho cả thiết bị di động và máy tính.
- **Xác thực người dùng**: Đăng nhập và đăng ký an toàn.
- **Bảng điều khiển quản trị**: Quản lý phim, người dùng và cài đặt.
- **Routing động**: Các trang dành cho từng bộ phim, danh mục và nhiều hơn nữa.

## Công nghệ sử dụng
- **Framework**: Next.js
- **Ngôn ngữ**: TypeScript
- **CSS**: Tailwind CSS
- **Quản lý trạng thái**: React Context API
- **Tích hợp API**: Các endpoint tùy chỉnh để lấy dữ liệu phim

## Cấu trúc thư mục
```
Frontend/
├── public/                # Tài nguyên tĩnh (hình ảnh, font chữ, v.v.)
├── src/
│   ├── app/              # Các trang và layout của ứng dụng
│   ├── components/       # Các thành phần giao diện tái sử dụng
│   ├── constants/        # Các hằng số toàn cục
│   ├── hooks/            # Custom React hooks
│   ├── layouts/          # Các layout
│   ├── lib/              # Hàm tiện ích và tích hợp API
│   ├── styles/           # CSS toàn cục
│   ├── types/            # Định nghĩa kiểu TypeScript
│   └── utils/            # Các hàm hỗ trợ
├── package.json          # Metadata và dependencies của dự án
├── tsconfig.json         # Cấu hình TypeScript
├── tailwind.config.js    # Cấu hình Tailwind CSS
└── README.md             # Tài liệu dự án
```

## Cấu trúc API
### API Backend
Frontend giao tiếp với Backend thông qua các endpoint API. Dưới đây là một số endpoint chính:

#### 1. **Lấy danh sách phim**
- **URL**: `/api/movies`
- **Phương thức**: `GET`
- **Mô tả**: Lấy danh sách các bộ phim.
- **Tham số**:
  - `page` (tùy chọn): Số trang.
  - `limit` (tùy chọn): Số lượng phim trên mỗi trang.
- **Phản hồi**:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Tên phim",
      "description": "Mô tả phim",
      "poster": "URL hình ảnh",
      "rating": 8.5
    }
  ],
  "pagination": {
    "page": 1,
    "totalPages": 10
  }
}
```

#### 2. **Lấy chi tiết phim**
- **URL**: `/api/movies/:id`
- **Phương thức**: `GET`
- **Mô tả**: Lấy thông tin chi tiết của một bộ phim.
- **Tham số**:
  - `id` (bắt buộc): ID của bộ phim.
- **Phản hồi**:
```json
{
  "id": 1,
  "title": "Tên phim",
  "description": "Mô tả phim",
  "poster": "URL hình ảnh",
  "rating": 8.5,
  "episodes": [
    {
      "id": 101,
      "title": "Tập 1",
      "url": "URL phát phim"
    }
  ]
}
```

#### 3. **Xác thực người dùng**
- **URL**: `/api/auth/login`
- **Phương thức**: `POST`
- **Mô tả**: Đăng nhập người dùng.
- **Tham số**:
  - `email` (bắt buộc): Email của người dùng.
  - `password` (bắt buộc): Mật khẩu.
- **Phản hồi**:
```json
{
  "token": "JWT token",
  "user": {
    "id": 1,
    "name": "Tên người dùng",
    "email": "Email người dùng"
  }
}
```

## Hướng dẫn cài đặt

### Yêu cầu
- Node.js (v16 trở lên)
- pnpm (trình quản lý gói ưu tiên)

### Cài đặt
1. Clone repository:
   ```bash
   git clone https://github.com/your-repo/mocphim-frontend.git
   ```
2. Di chuyển vào thư mục dự án:
   ```bash
   cd mocphim-frontend
   ```
3. Cài đặt dependencies:
   ```bash
   pnpm install
   ```

### Phát triển
Khởi chạy server phát triển:
```bash
pnpm dev
```
Ứng dụng sẽ chạy tại `http://localhost:3000`.

### Build
Tạo bản build production:
```bash
pnpm build
```
Kết quả build sẽ nằm trong thư mục `.next`.

### Triển khai
Triển khai ứng dụng lên Vercel hoặc bất kỳ nền tảng nào hỗ trợ Next.js.

## Đóng góp
Mọi đóng góp đều được hoan nghênh! Vui lòng fork repository và tạo pull request cho các thay đổi.

## Phát Triển Bởi Sinh Viên
- FullStack Phan Duy Khai
- BackEnd Vo Ho Vinh Khang.
- TestTer Tran Thi Bich Ngoc
- BA Nguyen Gia Huy
