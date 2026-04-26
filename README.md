# MocPhim Project Documentation

## Tổng quan
Dự án MocPhim bao gồm hai phần chính: **Frontend** và **Backend**. Frontend được xây dựng bằng Next.js và TypeScript, trong khi Backend được phát triển bằng Java Spring Boot. Hai phần này giao tiếp với nhau thông qua các API RESTful để cung cấp trải nghiệm người dùng mượt mà và hiệu quả.

## Cấu trúc chi tiết dự án

### Frontend
Frontend là giao diện người dùng của ứng dụng, chịu trách nhiệm hiển thị nội dung và xử lý tương tác của người dùng. Dưới đây là cấu trúc chi tiết của thư mục Frontend:

```
Frontend/
├── public/                # Tài nguyên tĩnh (hình ảnh, font chữ, favicon, v.v.)
├── src/
│   ├── app/              # Các trang chính và layout của ứng dụng
│   │   ├── (default)/    # Layout mặc định và các trang con
│   │   ├── phimmoi/      # Trang hiển thị danh sách phim mới
│   │   ├── xem-phim/     # Trang phát phim theo slug
│   │   ├── admin/        # Trang quản trị
│   ├── components/       # Các thành phần giao diện tái sử dụng (icon, UI, Preloader, v.v.)
│   ├── constants/        # Các hằng số toàn cục (ví dụ: URL API, giá trị mặc định)
│   ├── hooks/            # Custom React hooks (ví dụ: useScrollPosition)
│   ├── layouts/          # Các layout chính (Header, Footer, Sidebar)
│   ├── lib/              # Hàm tiện ích và tích hợp API (ví dụ: home.ts, movie.ts)
│   ├── styles/           # CSS toàn cục (globals.css)
│   ├── types/            # Định nghĩa kiểu TypeScript (ví dụ: MovieItem, Swiper CSS)
│   └── utils/            # Các hàm hỗ trợ (ví dụ: helpers.ts)
├── package.json          # Metadata và dependencies của dự án
├── tsconfig.json         # Cấu hình TypeScript
├── tailwind.config.js    # Cấu hình Tailwind CSS
└── README.md             # Tài liệu dự án
```

### Backend
Backend là API server, chịu trách nhiệm xử lý logic nghiệp vụ, quản lý dữ liệu và cung cấp API cho Frontend. Dưới đây là cấu trúc chi tiết của thư mục Backend:

```
Backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   ├── mocphim/com/backend_web/
│   │   │   │   ├── config/          # Cấu hình ứng dụng (CORS, Redis, v.v.)
│   │   │   │   ├── controller/      # Các controller xử lý request từ Frontend
│   │   │   │   ├── dto/             # Các lớp DTO (Data Transfer Object) để truyền dữ liệu
│   │   │   │   ├── entity/          # Các entity ánh xạ với database
│   │   │   │   ├── exception/       # Xử lý ngoại lệ toàn cục
│   │   │   │   ├── repository/      # Các interface làm việc với database
│   │   │   │   ├── scheduler/       # Các tác vụ định kỳ (ví dụ: đồng bộ dữ liệu phim)
│   │   │   │   └── service/         # Các lớp xử lý logic nghiệp vụ
│   │   ├── resources/               # File cấu hình ứng dụng (application.properties)
│   └── test/                        # Các bài kiểm thử
├── pom.xml                          # Cấu hình Maven
└── README.md                        # Tài liệu dự án
```

## Giao tiếp giữa Frontend và Backend
Frontend và Backend giao tiếp thông qua các API RESTful. Dưới đây là danh sách các API chính và cách sử dụng:

### 1. **Lấy danh sách phim**
- **URL**: `http://103.229.53.17/api/movies`
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

### 2. **Lấy chi tiết phim**
- **URL**: `http://103.229.53.17/api/movies/:id`
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

### 3. **Xác thực người dùng**
- **URL**: `http://103.229.53.17/api/auth/login`
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

## Hướng dẫn triển khai trên Ubuntu Server

### Cài đặt các yêu cầu
1. **Cài đặt Node.js và pnpm**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   npm install -g pnpm
   ```
2. **Cài đặt Java JDK 17**:
   ```bash
   sudo apt update
   sudo apt install openjdk-17-jdk
   ```
3. **Cài đặt Maven**:
   ```bash
   sudo apt install maven
   ```
4. **Cài đặt Nginx**:
   ```bash
   sudo apt install nginx
   ```

### Triển khai Frontend
1. Build ứng dụng:
   ```bash
   pnpm build
   ```
2. Copy thư mục `.next` lên server.
3. Cấu hình Nginx để phục vụ ứng dụng:
   - Tạo file cấu hình Nginx:
     ```bash
     sudo nano /etc/nginx/sites-available/mocphim-frontend
     ```
   - Thêm nội dung sau:
     ```nginx
     server {
         listen 80;
         server_name 103.229.53.17;

         root /path/to/frontend/.next;
         index index.html;

         location / {
             try_files $uri /index.html;
         }
     }
     ```
   - Kích hoạt cấu hình:
     ```bash
     sudo ln -s /etc/nginx/sites-available/mocphim-frontend /etc/nginx/sites-enabled/
     sudo systemctl restart nginx
     ```

### Triển khai Backend
1. Build ứng dụng:
   ```bash
   ./mvnw package
   ```
2. Chạy file JAR:
   ```bash
   java -jar target/backend-web-0.0.1-SNAPSHOT.jar
   ```
3. Cấu hình Nginx để reverse proxy đến cổng 8080:
   - Tạo file cấu hình Nginx:
     ```bash
     sudo nano /etc/nginx/sites-available/mocphim-backend
     ```
   - Thêm nội dung sau:
     ```nginx
     server {
         listen 80;
         server_name 103.229.53.17;

         location /api/ {
             proxy_pass http://localhost:8080/;
             proxy_set_header Host $host;
             proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
         }
     }
     ```
   - Kích hoạt cấu hình:
     ```bash
     sudo ln -s /etc/nginx/sites-available/mocphim-backend /etc/nginx/sites-enabled/
     sudo systemctl restart nginx
     ```

## Đóng góp
Mọi đóng góp đều được hoan nghênh! Vui lòng fork repository và tạo pull request cho các thay đổi.

## Giấy phép
Dự án này được cấp phép theo giấy phép MIT.
