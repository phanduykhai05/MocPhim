# MócPhim

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4-6DB33F?logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)

Ứng dụng xem phim trực tuyến full-stack với giao diện hiện đại, hỗ trợ tìm kiếm nâng cao, bookmark, theo dõi tiến độ xem, đăng nhập Google OAuth2 và đồng bộ dữ liệu phim tự động.

**Demo:** [PhimHayy](https://phimhayy.vercel.app/)

---

## Thông tin Server

> Chỉ dành cho thành viên nhóm — không chia sẻ công khai.

### VPS (Backend)

| | |
|---|---|
| IP | `103.229.***.** ` |
| SSH User | `root` |
| SSH Password | `Li601v57zTKAGKQ2` |

### PostgreSQL

| | |
|---|---|
| SSH Tunnel Host | `103.229.***.** ` |
| Tunnel Port | `22` |
| Tunnel User | `root` |
| Tunnel Password | `Li601v57zTKAGKQ2` |
| DB Host (qua tunnel) | `127.0.0.1` |
| DB Port | `5432` |
| Database | `mocphim` |
| Username | `postgres` |
| Password | `050623` |
| Connection String | `postgresql://postgres:050623@103.229.***.** :5433/mocphim` |

### Redis

| | |
|---|---|
| Host | `103.229.***.** ` |
| Port | `6379` |
| Password | `mocphimStrongPass@@` |
| Database | `0` |

### Email (Brevo SMTP)

| | |
|---|---|
| Server | `smtp-relay.brevo.com` |
| Port | `587` |
| Login | `ab03af001@smtp-brevo.com` |
| SMTP Key | `xsmtpsib-90403605439b844108f6ceba9ea49e9a2b48351ca5b36b51d51b8678570e100b-TK3ZNJe321OocX4l` |

---

## Thành viên nhóm

| Họ và tên | MSSV | Vai trò |
|---|---|---|
| Phan Duy Khải | N23DVCN026 | FullStack (Frontend + Backend) |
| Võ Hồ Vĩnh Khang | N23DVCN027 | Backend |
| Trần Bích Ngọc | N23DVCN040 | Báo cáo · Testing |
| Nguyễn Gia Huy | N23DVCN023 | Báo cáo · Testing |

---

## Phân công chi tiết

### Phan Duy Khải — FullStack

**Frontend:**
- Thiết kế & xây dựng toàn bộ giao diện người dùng (Next.js + TypeScript)
- Trang chủ: Banner, danh sách phim mới, Top 10 phim bộ hôm nay, phim nổi bật
- Trang chi tiết phim: Hero section, Sidebar, thông tin diễn viên, chọn tập
- Trang xem phim: Video player, chọn phiên bản (Vietsub / Thuyết minh / Lồng tiếng)
- Trang tìm kiếm, lọc theo thể loại / quốc gia / năm phát hành / phim bộ / phim lẻ
- Hệ thống xác thực: trang đăng nhập, đăng ký, quên mật khẩu, đặt lại mật khẩu
- Tính năng Dark/Light mode
- Hiệu ứng animation, Swiper carousel, Framer Motion
- Tích hợp toàn bộ API từ Backend

**Backend:**
- Triển khai hệ thống lên VPS Nginx
- Triển khai hệ thống SSL
---

### Võ Hồ Vĩnh Khang — Backend

**Backend:**
- Thiết kế kiến trúc API RESTful
- Tích hợp và đồng bộ dữ liệu từ OPhim API
- Hệ thống xác thực: JWT (access token 30 phút, refresh token 7 ngày), Google OAuth2
- Gửi email xác minh tài khoản & đặt lại mật khẩu
- Redis caching để tăng tốc độ phản hồi
- Triển khai hệ thống lên VPS với Docker + Nginx


- Xây dựng các API: Bookmark, Watch Progress, Search, Category, Country, Year
- Thiết kế database schema: Entity Bookmark, WatchProgress, SearchHistory, MovieViewCount
- Viết Repository & Service cho các tính năng cá nhân hóa người dùng
- Cấu hình CORS, Spring Security, bảo vệ các endpoint cần xác thực
- Xây dựng Scheduler tự động đồng bộ phim theo lịch định kỳ
- Viết Admin Controller & Cache Controller

---

### Trần Bích Ngọc — Báo cáo · Testing

- Soạn thảo báo cáo đồ án: phân tích yêu cầu, thiết kế hệ thống, use case diagram
- Kiểm thử chức năng: đăng ký, đăng nhập, tìm kiếm, bookmark, xem phim
- Kiểm thử tương thích giao diện trên các trình duyệt và thiết bị
- Viết test case, ghi nhận và báo cáo lỗi

---

### Nguyễn Gia Huy — Báo cáo · Testing

- Soạn thảo báo cáo đồ án: công nghệ sử dụng, hướng dẫn triển khai, kết quả đạt được
- Kiểm thử API với Postman: xác thực token, các trường hợp lỗi, edge case
- Kiểm thử hiệu năng và trải nghiệm người dùng
- Hỗ trợ chuẩn bị slide thuyết trình

---

## Tech Stack

### Frontend

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| Next.js | 15 | App Router, SSR, routing |
| React | 19 | UI framework |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Utility-first styling |
| Ant Design | 5.29 | UI component library |
| Shadcn UI | — | Headless components |
| Radix UI | 1.4 | Accessible primitives |
| Framer Motion | 12 | Animation |
| Swiper | 12 | Carousel / slider |
| pnpm | 10 | Package manager |

### Backend

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| Spring Boot | 3.4.5 | Application framework |
| Java | 17 | Ngôn ngữ lập trình |
| Maven | — | Build tool |
| Spring Security | — | Authentication & authorization |
| Spring Data JPA | — | ORM, database access |
| JJWT | 0.12.5 | JSON Web Token |
| Google OAuth2 | — | Social login |
| Spring Mail | — | Gửi email xác minh |
| Lombok | — | Giảm boilerplate code |

### Infrastructure

| Công nghệ | Mục đích |
|---|---|
| PostgreSQL 15 | Cơ sở dữ liệu chính |
| Redis 7 | Caching, tăng tốc API |
| Docker & Docker Compose | Container hóa dịch vụ |
| Nginx | Reverse proxy |
| Vercel | Deploy Frontend |
| Duckdns | Domain + Deploy Backend |

---

## Kiến trúc hệ thống

```
┌──────────────────────────────────────────────┐
│                  CLIENT                      │
│         Next.js (Vercel - Port 3000)         │
└─────────────────────┬────────────────────────┘
                      │ HTTPS / REST API
┌─────────────────────▼────────────────────────┐
│                   NGINX                      │
│              (Reverse Proxy)                 │
└─────────────────────┬────────────────────────┘
                      │
┌─────────────────────▼────────────────────────┐
│          Spring Boot API (Port 8080)         │
│   Auth · Movie · Bookmark · WatchProgress    │
│         Search · Sync · Admin                │
└──────┬──────────────┬───────────────┬────────┘
       │              │               │
┌──────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
│ PostgreSQL  │ │   Redis   │ │ OPhim API   │
│  (Port 5432)│ │(Port 6379)│ │ (Upstream)  │
└─────────────┘ └───────────┘ └─────────────┘
```

---

## Tính năng

### Duyệt & Tìm kiếm phim
- Trang chủ với banner phim nổi bật, phim mới cập nhật, Top 10 phim bộ hôm nay
- Tìm kiếm theo từ khóa (tên phim, diễn viên, đạo diễn)
- Lọc phim theo: thể loại, quốc gia, năm phát hành, phim bộ / phim lẻ
- Phân trang kết quả

### Chi tiết & Xem phim
- Thông tin đầy đủ: poster, mô tả, thể loại, quốc gia, năm, diễn viên, đạo diễn
- Danh sách tập phim với trạng thái cập nhật
- Hỗ trợ nhiều phiên bản: Vietsub, Thuyết minh, Lồng tiếng
- Video player tích hợp

### Xác thực người dùng
- Đăng ký tài khoản với xác minh email
- Đăng nhập bằng email/mật khẩu
- Đăng nhập nhanh bằng Google (OAuth2)
- Quên mật khẩu & đặt lại qua email
- JWT access token (30 phút) + refresh token (7 ngày)

### Cá nhân hóa
- Bookmark phim yêu thích
- Theo dõi tiến độ xem (tập đang xem, thời gian dừng)
- Lịch sử tìm kiếm

### Quản trị & Hệ thống
- Admin dashboard quản lý dữ liệu
- Đồng bộ phim tự động từ OPhim API theo lịch định kỳ
- Caching Redis giảm tải database
- Thống kê lượt xem phim
- Ghi log API request

---

## Cấu trúc dự án

```
MocPhim/
├── Frontend/               # Next.js application
├── Backend/                # Spring Boot application
└── README.md
```

### Frontend

```
Frontend/
├── public/                         # Static assets (logo, favicon, images)
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Redirect → /phimmoi
│   │   └── (default)/
│   │       ├── layout.tsx          # Default layout (Header + Footer)
│   │       ├── phimmoi/            # Trang chủ
│   │       │   ├── page.tsx
│   │       │   └── components/
│   │       │       ├── Banner/         # Hero banner
│   │       │       ├── MovieUpdate/    # Phim mới cập nhật
│   │       │       ├── TopseriCard/    # Top 10 phim bộ
│   │       │       ├── HappyMovie/     # Phim nổi bật
│   │       │       └── Topics/         # Chủ đề phim
│   │       ├── phim/[slug]/        # Chi tiết phim
│   │       │   ├── page.tsx
│   │       │   ├── loading.tsx
│   │       │   └── components/
│   │       │       ├── Hero/           # Poster + thông tin chính
│   │       │       ├── Sidebar/        # Thông tin phụ
│   │       │       ├── DetailInfo/     # Mô tả, cast, tags
│   │       │       ├── MovieActionBar/ # Nút bookmark, chia sẻ
│   │       │       └── AvailableVersions/ # Chọn phiên bản
│   │       ├── xem-phim/           # Trang phát phim
│   │       ├── phim-bo/            # Danh sách phim bộ
│   │       ├── phim-le/            # Danh sách phim lẻ
│   │       ├── the-loai/           # Lọc theo thể loại
│   │       ├── quoc-gia/           # Lọc theo quốc gia
│   │       ├── nam-phat-hanh/      # Lọc theo năm
│   │       ├── tim-kiem/           # Trang tìm kiếm
│   │       ├── login/              # Đăng nhập
│   │       ├── forgot-password/    # Quên mật khẩu
│   │       └── reset-password/     # Đặt lại mật khẩu
│   ├── components/
│   │   ├── ui/                     # Base UI components
│   │   ├── MoviePoster/            # Poster phim (lazy load, fallback)
│   │   ├── BookmarkButton/         # Nút bookmark
│   │   ├── Preloader/              # Loading screen
│   │   ├── ThemeInitializer/       # Khởi tạo dark/light mode
│   │   ├── SecurityGuard/          # Bảo vệ route cần đăng nhập
│   │   └── AntdProvider/           # Ant Design config
│   ├── layouts/
│   │   ├── Header/                 # Thanh điều hướng chính
│   │   ├── Footer/                 # Footer
│   │   └── Sidebar/                # Sidebar (mobile)
│   ├── lib/api/
│   │   ├── home.ts                 # API trang chủ
│   │   ├── movie.ts                # API phim
│   │   ├── auth.ts                 # API xác thực
│   │   ├── bookmarks.ts            # API bookmark
│   │   └── progress.ts             # API tiến độ xem (/api/v1/progress)
│   ├── contexts/
│   │   └── AuthContext/            # Quản lý trạng thái đăng nhập
│   ├── hooks/
│   │   └── useScrollPosition/      # Custom hook cuộn trang
│   ├── constants/                  # URL API, giá trị mặc định
│   ├── types/                      # TypeScript interfaces
│   ├── utils/                      # Hàm tiện ích
│   └── styles/
│       └── globals.css             # CSS toàn cục + Tailwind
├── next.config.ts                  # Next.js configuration
├── tailwind.config.js              # Tailwind CSS v4 config
├── tsconfig.json
└── package.json
```

### Backend

```
Backend/
├── src/
│   ├── main/
│   │   ├── java/mocphim/com/backend_web/
│   │   │   ├── BackendWebApplication.java  # Entry point
│   │   │   ├── config/
│   │   │   │   ├── AppConfig.java          # Bean cấu hình chung
│   │   │   │   ├── CorsConfig.java         # Cho phép cross-origin
│   │   │   │   ├── RedisConfig.java        # Kết nối & cấu hình Redis
│   │   │   │   ├── SecurityConfig.java     # Spring Security + OAuth2
│   │   │   │   └── DataInitializer.java    # Tạo admin mặc định khi khởi động
│   │   │   ├── controller/
│   │   │   │   ├── MovieController.java        # /api/v1/movies
│   │   │   │   ├── HomeController.java          # /api/v1/home
│   │   │   │   ├── SearchController.java        # /api/v1/search
│   │   │   │   ├── CategoryController.java      # /api/v1/categories
│   │   │   │   ├── CountryController.java       # /api/v1/countries
│   │   │   │   ├── YearController.java          # /api/v1/years
│   │   │   │   ├── AuthController.java          # /auth/*
│   │   │   │   ├── BookmarkController.java      # /api/bookmarks
│   │   │   │   ├── WatchProgressController.java # /api/v1/progress
│   │   │   │   ├── SyncController.java          # /api/sync
│   │   │   │   ├── CacheController.java         # /api/cache
│   │   │   │   └── AdminController.java         # /api/admin
│   │   │   ├── service/
│   │   │   │   ├── MovieService.java
│   │   │   │   ├── MovieSyncService.java        # Đồng bộ từ OPhim API
│   │   │   │   ├── OPhimService.java            # HTTP client gọi OPhim
│   │   │   │   ├── AuthService.java             # JWT, email verification
│   │   │   │   ├── EmailService.java            # Gửi email (Gmail SMTP)
│   │   │   │   ├── BookmarkService.java
│   │   │   │   ├── SearchService.java
│   │   │   │   └── WatchProgressService.java
│   │   │   ├── entity/
│   │   │   │   ├── Bookmark.java
│   │   │   │   ├── WatchProgress.java
│   │   │   │   ├── MovieSync.java
│   │   │   │   ├── SearchHistory.java
│   │   │   │   ├── MovieViewCount.java
│   │   │   │   └── ApiRequestLog.java
│   │   │   ├── dto/
│   │   │   │   ├── request/         # LoginRequest, RegisterRequest, BookmarkRequestDto ...
│   │   │   │   └── response/        # ApiResponse, TokenResponse, UserResponse, OPhimResponse ...
│   │   │   ├── repository/          # Spring Data JPA repositories
│   │   │   ├── scheduler/           # Tác vụ định kỳ đồng bộ phim
│   │   │   ├── security/            # JwtFilter, OAuth2SuccessHandler, UserDetailsImpl
│   │   │   └── exception/           # GlobalExceptionHandler
│   │   └── resources/
│   │       └── application.properties   # Cấu hình ứng dụng
│   └── test/
├── Dockerfile
├── docker-compose.yml
└── pom.xml
```

---

## Cài đặt & Chạy

### Yêu cầu hệ thống

- Node.js 20+ và pnpm
- Java 17+
- Docker & Docker Compose

---

### 1. Clone dự án

```bash
git clone https://github.com/khaicybers/MocPhim.git
cd MocPhim
```

---

### 2. Chạy Backend

**Bước 1 — Cấu hình môi trường**

Tạo hoặc chỉnh sửa `Backend/src/main/resources/application.properties`:

```properties
# ===== Database =====
spring.datasource.url=jdbc:postgresql://localhost:5432/mocphim
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

# ===== JWT =====
jwt.secret=your_256bit_secret_key_here
jwt.expiration=1800000
jwt.refresh-expiration=604800000

# ===== Google OAuth2 =====
spring.security.oauth2.client.registration.google.client-id=your_google_client_id
spring.security.oauth2.client.registration.google.client-secret=your_google_client_secret
app.oauth2.redirect-uri=http://localhost:8080/oauth2/callback/google

# ===== Frontend URL =====
app.frontend-url=http://localhost:3000

# ===== Redis =====
spring.data.redis.host=localhost
spring.data.redis.port=6379

# ===== Email =====
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password

# ===== Admin mặc định =====
app.admin.email=admin@mocphim.com
app.admin.password=Admin@123
```

**Bước 2 — Khởi động PostgreSQL & Redis**

```bash
cd Backend
docker-compose up -d postgres redis
```

**Bước 3 — Chạy Spring Boot**

```bash
./mvnw spring-boot:run
```

Backend chạy tại: `http://localhost:8080`

---

### 3. Chạy Frontend

**Bước 1 — Cấu hình môi trường**

Tạo file `Frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_AUTH_URL=http://localhost:8080
NEXT_PUBLIC_CDN_IMAGE=https://img.ophim.live
```

**Bước 2 — Cài dependencies**

```bash
cd Frontend
pnpm install
```

**Bước 3 — Chạy development server**

```bash
pnpm dev
```

Frontend chạy tại: `http://localhost:3000`

---

### 4. Chạy toàn bộ bằng Docker Compose

```bash
cd Backend
docker-compose up -d
```

| Service | Port | Địa chỉ |
|---|---|---|
| Frontend (Next.js) | 3000 | http://localhost:3000 |
| Backend (Spring Boot) | 8080 | http://localhost:8080 |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |

---

## API Endpoints

### Movies & Browse

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/v1/home` | Dữ liệu trang chủ (banner, phim mới, trending) |
| GET | `/api/v1/movies` | Danh sách phim (`?list=phim-moi&page=1&size=20`) |
| GET | `/api/v1/movies/{slug}` | Chi tiết phim theo slug |
| GET | `/api/v1/movies/{slug}/images` | Ảnh của phim |
| GET | `/api/v1/movies/{slug}/peoples` | Diễn viên & đạo diễn |
| GET | `/api/v1/search` | Tìm kiếm (`?keyword=x&page=1`) |
| GET | `/api/v1/categories` | Danh sách thể loại |
| GET | `/api/v1/countries` | Danh sách quốc gia |
| GET | `/api/v1/years` | Danh sách năm phát hành |

### Authentication

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/auth/register` | Đăng ký tài khoản mới |
| POST | `/auth/login` | Đăng nhập bằng email & mật khẩu |
| POST | `/auth/refresh` | Làm mới access token |
| GET | `/auth/me` | Thông tin user hiện tại *(cần Bearer token)* |
| POST | `/auth/logout` | Đăng xuất |
| GET | `/auth/verify-email?token=x` | Xác minh email sau đăng ký |
| POST | `/auth/forgot-password` | Gửi email đặt lại mật khẩu |
| POST | `/auth/reset-password` | Đặt lại mật khẩu với token |

### User (cần xác thực — Bearer Token)

#### Bookmark

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/bookmarks/{userId}` | Lấy danh sách phim đã bookmark |
| POST | `/api/bookmarks` | Thêm bookmark (`{ slug }`) |
| DELETE | `/api/bookmarks/{userId}/{movieId}` | Xoá bookmark |
| GET | `/api/bookmarks/isBookmarked/{userId}/{movieId}` | Kiểm tra đã bookmark chưa |

#### Watch Progress — `/api/v1/progress`

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/v1/progress/{userId}/{movieId}/{episodeNumber}` | Lấy tiến độ một tập cụ thể |
| GET | `/api/v1/progress/{userId}/{movieId}` | Lấy toàn bộ tiến độ của phim |
| GET | `/api/v1/progress/{userId}/resume/{slug}` | Lấy điểm tiếp tục xem mới nhất |
| PATCH | `/api/v1/progress/{userId}/{movieId}/{episodeNumber}` | Tạo / cập nhật tiến độ xem |

**Request body (PATCH):**
```json
{
  "slug": "one-piece",
  "positionSeconds": 120,
  "isCompleted": false
}
```

**Response:**
```json
{
  "status": true,
  "data": {
    "userId": 1,
    "movieId": "abc123",
    "slug": "one-piece",
    "episodeNumber": 5,
    "positionSeconds": 120,
    "isCompleted": false,
    "lastWatchedAt": "2026-05-30T10:00:00"
  }
}
```

**Luồng hoạt động trên Frontend:**
1. User vào trang xem phim → gọi PATCH với `positionSeconds=0, isCompleted=false`
2. Mỗi 60 giây → gọi PATCH với `positionSeconds` tăng dần (đếm thời gian xem tích lũy)
3. User bấm "Chuyển tập" → gọi PATCH với `isCompleted=true` trước khi redirect

### Response mẫu

```json
// GET /api/v1/movies/{slug}
{
  "status": 200,
  "message": "success",
  "data": {
    "slug": "one-piece",
    "name": "One Piece",
    "originName": "One Piece",
    "description": "...",
    "thumbUrl": "https://img.ophim.live/...",
    "posterUrl": "https://img.ophim.live/...",
    "year": 1999,
    "type": "series",
    "status": "ongoing",
    "categories": ["Hành động", "Phiêu lưu"],
    "countries": ["Nhật Bản"],
    "episodes": [
      {
        "name": "Tập 1157",
        "serverData": [...]
      }
    ]
  }
}
```

---

## Triển khai Production

### Frontend — Vercel

1. Push code lên GitHub
2. Import repository vào [vercel.com](https://vercel.com)
3. Đặt Environment Variables trong Vercel dashboard:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
NEXT_PUBLIC_AUTH_URL=https://your-api-domain.com
NEXT_PUBLIC_CDN_IMAGE=https://img.ophim.live
```

4. Deploy tự động khi push lên branch `main`

---

### Backend — Docker trên VPS

**Bước 1 — Build Docker image**

```bash
cd Backend
docker build -t mocphim-backend .
```

**Bước 2 — Chạy tất cả dịch vụ**

```bash
docker-compose up -d
```

**Bước 3 — Cấu hình Nginx reverse proxy**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Auth endpoints
    location /auth/ {
        proxy_pass http://localhost:8080/auth/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # OAuth2 callback
    location /oauth2/ {
        proxy_pass http://localhost:8080/oauth2/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Bước 4 — Cấp SSL với Let's Encrypt**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Nguồn dữ liệu

Dữ liệu phim được lấy từ **OPhim API** (`https://ophim1.com/v1/api`) và đồng bộ về database nội bộ thông qua:

- **Scheduler** chạy tự động theo lịch định kỳ (mỗi giờ)
- **Sync API** (`/api/sync`) cho phép đồng bộ thủ công
- Backend đóng vai trò **proxy + cache layer**: lưu dữ liệu vào PostgreSQL, cache hot data vào Redis — giảm phụ thuộc vào upstream và tăng tốc độ phản hồi đáng kể

---

## Giấy phép

[MIT](LICENSE)
