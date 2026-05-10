# MocPhim — Backend API

> Nền tảng xem phim trực tuyến — REST API proxy qua OPhim Public API  
> **Stack:** Spring Boot 3.4.5 · PostgreSQL · Redis Cloud (Jedis) · Java 17 · Spring Security 6 · JWT (JJWT 0.12) · Google OAuth2 (OIDC)

---

## Khởi động nhanh

### 1. Yêu cầu
- Java 17+
- Maven 3.8+
- PostgreSQL đang chạy (local hoặc remote)
- Tạo database: `CREATE DATABASE mocphim_db;`

### 2. Cấu hình biến môi trường

Tạo file `.env` ở root project (đã có `.env` mẫu):

```env
# Database
DB_URL=jdbc:postgresql://localhost:5432/mocphim_db
DB_USERNAME=postgres
DB_PASSWORD=your_password

# Redis
REDIS_HOST=your_redis_host
REDIS_PORT=6379
REDIS_USER=default
REDIS_PASSWORD=your_redis_password

# JWT
JWT_SECRET=your_secret_key_min_64_chars_for_hs512

# Google OAuth2
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OAUTH2_REDIRECT_URI=http://localhost:3000/oauth2/callback/google

# Frontend
FRONTEND_URL=http://localhost:3000
```

> **Google OAuth2**: vào [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → tạo OAuth 2.0 Client ID. Authorized redirect URI phải có: `http://localhost:8080/oauth2/callback/google`

### 3. Chạy app

```bash
# Maven
mvn spring-boot:run

# Hoặc JAR trực tiếp (load .env tự động)
./run.sh

# Hoặc Docker
docker build -t mocphim-backend .
docker run --env-file .env -p 8080:8080 mocphim-backend
```

Server khởi động tại: `http://localhost:8080`

---

## Cấu trúc thư mục

```
src/main/java/mocphim/com/backend_web/
├── config/
│   ├── AppConfig.java          # RestTemplate + ObjectMapper (JavaTimeModule)
│   ├── RedisConfig.java        # Jedis kết nối Redis Cloud + CacheManager TTL
│   ├── CorsConfig.java         # CORS cho /api/**
│   └── SecurityConfig.java     # Spring Security 6, JWT filter, OAuth2 OIDC
├── controller/
│   ├── AuthController.java     # /auth/** — đăng ký, đăng nhập, refresh, me, logout
│   ├── HomeController.java
│   ├── MovieController.java
│   ├── SearchController.java
│   ├── CategoryController.java
│   ├── CountryController.java
│   ├── YearController.java
│   └── SyncController.java     # Quản lý sync phim từ OPhim vào DB
├── service/
│   ├── AuthService.java        # Đăng ký, đăng nhập, refresh token, lấy thông tin user
│   ├── OPhimService.java       # HTTP proxy đến OPhim API
│   ├── HomeService.java
│   ├── MovieService.java
│   ├── SearchService.java      # Tìm kiếm + lưu/đọc lịch sử từ khóa
│   ├── MovieSyncService.java   # Đọc dữ liệu sync từ DB (có Redis cache)
│   ├── CategoryService.java
│   ├── CountryService.java
│   └── YearService.java
├── security/
│   ├── CustomUserDetails.java          # Implements UserDetails + OidcUser
│   ├── UserDetailsServiceImpl.java     # Load user by email từ DB
│   ├── jwt/
│   │   ├── JwtTokenProvider.java       # Tạo/validate JWT (HS512, JJWT 0.12)
│   │   └── JwtAuthenticationFilter.java # Đọc Bearer token từ header
│   └── oauth2/
│       ├── CustomOAuth2UserService.java # Extends OidcUserService — xử lý Google OIDC
│       ├── OAuth2SuccessHandler.java    # Redirect kèm accessToken + refreshToken
│       └── OAuth2FailureHandler.java
├── model/
│   └── User.java               # Bảng users (id, email, password, name, avatar, provider, roles)
├── scheduler/
│   └── MovieSyncScheduler.java # Tự động sync phim mới mỗi 1 phút
├── entity/
│   ├── MovieSync.java          # Bảng movie_sync
│   ├── SearchHistory.java      # Bảng search_history
│   ├── MovieViewCount.java     # Bảng movie_view_count
│   └── ApiRequestLog.java      # Bảng api_request_log
├── repository/                 # JPA Repositories
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java
│   │   └── RegisterRequest.java
│   └── response/
│       ├── ApiResponse.java    # Wrapper chuẩn cho mọi response
│       ├── TokenResponse.java  # accessToken, refreshToken, tokenType, expiresIn
│       └── UserResponse.java
└── exception/
    ├── OPhimApiException.java
    └── GlobalExceptionHandler.java
```

---

## API Endpoints

Base URL: `http://localhost:8080`

> Các endpoint phim dùng prefix `/api/v1`. Các endpoint auth dùng `/auth` trực tiếp.

Mọi response đều có format chuẩn:

```json
{
  "status": true,
  "message": "success",
  "data": { ... },
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 240,
    "itemsPerPage": 24
  }
}
```

> `pagination` = `null` với các endpoint không có phân trang.

---

### Xác thực (Auth)

Các endpoint public (không cần token):

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/auth/register` | Đăng ký tài khoản mới bằng email/password |
| POST | `/auth/login` | Đăng nhập bằng email/password |
| POST | `/auth/refresh` | Lấy access token mới từ refresh token |
| POST | `/auth/logout` | Đăng xuất (client xóa token phía mình) |
| GET | `/oauth2/authorize/google` | Bắt đầu luồng đăng nhập Google (mở trên browser) |

Endpoint cần token:

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/auth/me` | Lấy thông tin user đang đăng nhập |

---

#### Đăng ký tài khoản — `POST /auth/register`

```json
{
  "email": "user@example.com",
  "password": "123456",
  "name": "Tên hiển thị"
}
```

Validation:
- `email`: bắt buộc, định dạng email hợp lệ, chưa được đăng ký
- `password`: bắt buộc, tối thiểu 6 ký tự
- `name`: bắt buộc

Tài khoản mới mặc định nhận role `ROLE_USER`.

---

#### Đăng nhập bằng email/password — `POST /auth/login`

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

---

Response trả về (cả register và login):

```json
{
  "status": true,
  "message": "Đăng nhập thành công",
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "tokenType": "Bearer",
    "expiresIn": 1800000
  }
}
```

Dùng `accessToken` trong header cho các request cần xác thực:
```
Authorization: Bearer <accessToken>
```

---

#### Refresh token — `POST /auth/refresh`

```json
{
  "refreshToken": "eyJ..."
}
```

---

#### 


##### Luồng hoạt động (đơn giản)

```
User bấm "Đăng nhập Google"
        ↓
FE redirect browser đến URL backend:
https://moc-phim-api.duckdns.org/oauth2/authorize/google
        ↓
Google hiện trang chọn tài khoản → user chọn
        ↓
Backend nhận callback từ Google, tạo JWT
        ↓
Backend redirect về FE kèm token trong URL:
https://moc-phim.vercel.app/oauth2/callback/google?accessToken=eyJ...&refreshToken=eyJ...
        ↓
FE đọc token từ URL params → lưu vào localStorage → dùng như bình thường
```

---

##### URL FE cần dùng

| Môi trường | URL bắt đầu đăng nhập Google |
|---|---|
| Production (VPS) | `https://moc-phim-api.duckdns.org/oauth2/authorize/google` |
| Local dev | `http://localhost:8080/oauth2/authorize/google` |

> FE chỉ cần redirect browser đến URL trên. Không cần gọi API, không cần xử lý gì thêm ở bước này.

---

##### FE xử lý callback như thế nào?

Backend sẽ redirect về trang `/oauth2/callback/google` của FE kèm 2 param trong URL:

```
https://moc-phim.vercel.app/oauth2/callback/google?accessToken=eyJ...&refreshToken=eyJ...
```

FE tạo một trang/route `/oauth2/callback/google` để đọc token:

```javascript
// Ví dụ Next.js / React
const params = new URLSearchParams(window.location.search);
const accessToken = params.get('accessToken');
const refreshToken = params.get('refreshToken');

// Lưu vào localStorage
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);

// Redirect về trang chủ
window.location.href = '/';
```

Sau đó dùng `accessToken` như đăng nhập thường:
```
Authorization: Bearer <accessToken>
```

---

##### Lưu ý

- User Google lần đầu đăng nhập sẽ tự động tạo tài khoản (`provider=google`)
- Nếu email đã đăng ký bằng email/password → hệ thống trả lỗi `email_conflict`, FE nhận được `?error=email_conflict` trong URL callback
- Token Google login có cùng TTL với login thường (access: 30 phút, refresh: 7 ngày)

---

#### Hệ thống phân quyền (Role)

| Role | Ý nghĩa |
|---|---|
| `ROLE_USER` | Người dùng thường — mặc định khi đăng ký |
| `ROLE_ADMIN` | Quản trị viên — truy cập các endpoint sync, quản lý |

Response `GET /auth/me` trả về danh sách roles của user:
```json
{
  "status": true,
  "data": {
    "id": 1,
    "email": "admin@mocphim.com",
    "name": "Admin",
    "provider": "local",
    "roles": ["ROLE_USER", "ROLE_ADMIN"]
  }
}
```

---

#### Tài khoản Admin mặc định

Khi app khởi động, nếu chưa có tài khoản admin, hệ thống tự động tạo:

| Thông tin | Giá trị mặc định |
|---|---|
| Email | `admin@mocphim.com` |
| Password | `Admin@123` |
| Roles | `ROLE_USER`, `ROLE_ADMIN` |

> **Bắt buộc đổi password admin trong production.** Override bằng biến môi trường:
> ```env
> ADMIN_EMAIL=your-admin@domain.com
> ADMIN_PASSWORD=your-strong-password
> ```

Endpoint admin (yêu cầu `ROLE_ADMIN`):
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/v1/sync/movies/trigger` | Kích hoạt sync thủ công |
| POST | `/api/v1/sync/movies/resync` | Re-sync record cũ thiếu field |

---

**JWT config:**
| Param | Giá trị mặc định |
|---|---|
| Access token TTL | 30 phút |
| Refresh token TTL | 7 ngày |
| Algorithm | HS512 |

---

### Trang chủ

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/home` | Dữ liệu trang chủ (phim nổi bật, mới nhất...) |

---

### Phim

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/movies?list={list}` | Danh sách phim theo loại |
| GET | `/movies/{slug}` | Chi tiết 1 phim |
| GET | `/movies/{slug}/images` | Hình ảnh phim |
| GET | `/movies/{slug}/peoples` | Diễn viên / đạo diễn |
| GET | `/movies/{slug}/keywords` | Từ khóa phim |

**Query params cho `/movies?list=`:**

| Param | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| `list` | String | Có | Loại danh sách. VD: `phim-bo`, `phim-le`, `hoat-hinh`, `tv-shows` |
| `page` | int | Không | Trang (default: 1) |
| `sort_field` | String | Không | Trường sắp xếp |
| `sort_type` | String | Không | `asc` hoặc `desc` |
| `category` | String | Không | Slug thể loại |
| `country` | String | Không | Slug quốc gia |
| `year` | int | Không | Năm sản xuất |
| `type` | String | Không | `series`, `single`, `hoathinh`, `tvshows` |

> Phân biệt: `?list=` xác định **loại danh sách** (`/danh-sach/` trên OPhim), còn `/{slug}` là **ID định danh phim cụ thể**.

---

### Tìm kiếm

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/search?keyword={kw}` | Tìm kiếm phim, tự lưu từ khóa vào DB |
| GET | `/search/history?limit={n}` | Top từ khóa được tìm nhiều nhất |

**Query params cho `/search/history`:**

| Param | Kiểu | Mô tả |
|---|---|---|
| `limit` | int | Số từ khóa trả về (default: 20) |

---

### Thể loại

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/categories` | Danh sách tất cả thể loại |
| GET | `/categories/{slug}/movies` | Phim theo thể loại |

**Query params cho `/categories/{slug}/movies`:**

| Param | Kiểu | Mô tả |
|---|---|---|
| `page` | int | Trang (default: 1) |
| `sort_field` | String | Trường sắp xếp |
| `sort_type` | String | `asc` hoặc `desc` |

---

### Quốc gia

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/countries` | Danh sách quốc gia |
| GET | `/countries/{slug}/movies` | Phim theo quốc gia |

**Query params cho `/countries/{slug}/movies`:** tương tự `/categories/{slug}/movies`

---

### Năm phát hành

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/years` | Danh sách năm |
| GET | `/years/{year}/movies` | Phim theo năm |

**Query params cho `/years/{year}/movies`:** tương tự `/categories/{slug}/movies`

---

### Sync (quản trị)

Dùng để quản lý và theo dõi quá trình đồng bộ phim từ OPhim vào PostgreSQL.

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/sync/movies` | Danh sách phim đã sync (phân trang) |
| GET | `/sync/movies/all` | Danh sách phim đã sync (tối đa 500, mới nhất) |
| GET | `/sync/movies/count` | Tổng số phim đã sync |
| POST | `/sync/movies/trigger` | Kích hoạt sync thủ công |
| POST | `/sync/movies/resync` | Re-sync các record cũ còn thiếu field |

**Query params cho `GET /sync/movies`:**

| Param | Kiểu | Mô tả |
|---|---|---|
| `page` | int | Trang (default: 0) |
| `size` | int | Số phim mỗi trang (default: 20) |

**Query params cho `POST /sync/movies/trigger`:**

| Param | Kiểu | Mô tả |
|---|---|---|
| `startPage` | int | Trang bắt đầu lấy từ OPhim (default: 1) |
| `maxPages` | int | Số trang tối đa mỗi lần sync (default: 50) |

Response của trigger:
```json
{
  "status": true,
  "message": "success",
  "data": { "added": 12, "skipped": 238 },
  "pagination": null
}
```

**Query params cho `POST /sync/movies/resync`:**

| Param | Kiểu | Mô tả |
|---|---|---|
| `limit` | int | Số slug xử lý mỗi lần gọi (default: 100, tối đa: 500) |

Endpoint này dành cho các record trong `movie_sync` có `origin_name = null` (dữ liệu cũ chưa được sync đầy đủ metadata). Gọi lặp lại cho đến khi `remaining = 0`.

Response của resync:
```json
{
  "status": true,
  "message": "success",
  "data": {
    "updated": 95,
    "notFound": 2,
    "failed": 3,
    "remaining": 450
  },
  "pagination": null
}
```

| Field | Ý nghĩa |
|---|---|
| `updated` | Số phim đã được cập nhật đầy đủ field |
| `notFound` | Slug không còn tồn tại trên OPhim (đánh dấu bỏ qua) |
| `failed` | Lỗi không xác định khi gọi OPhim |
| `remaining` | Số record vẫn còn thiếu field, cần gọi thêm |

---

## Redis Cache TTL

| Cache | TTL | Ghi chú |
|---|---|---|
| `home` | 5 phút | |
| `movieDetail` | 10 phút | |
| `movieList` | 5 phút | |
| `categories` | 30 phút | |
| `countries` | 30 phút | |
| `years` | 60 phút | |
| `syncedMovies` | 2 phút | Tự evict khi có phim mới được sync |
| `searchHistory` | 5 phút | |
| `users` | 1 giờ | Cache thông tin user theo userId |

---

## Scheduler

`MovieSyncScheduler` chạy mỗi 1 phút (cấu hình qua `scheduler.movie-sync.cron`):
- Gọi OPhim `/danh-sach/phim-moi`, duyệt từng trang
- Với mỗi phim: kiểm tra `slug` trong bảng `movie_sync`
- Chỉ INSERT phim chưa có, bỏ qua phim trùng
- Khi INSERT: lưu đầy đủ metadata (title, origin_name, type, thumb_url, quality, lang, year, category, country, tmdb, imdb, ...)
- Dừng sớm nếu cả trang đều đã tồn tại trong DB
- Khi có phim mới: tự động xóa cache `syncedMovies`
- Lỗi OPhim → log WARN, không crash app

Tắt scheduler:
```properties
scheduler.movie-sync.enabled=false
```

### Luồng resync record cũ

Các record được sync trước khi có đầy đủ field sẽ có `origin_name = null`. Để cập nhật:

1. Gọi `POST /api/v1/sync/movies/resync` (không cần param, dùng mặc định `limit=100`)
2. Kiểm tra `remaining` trong response
3. Lặp lại cho đến khi `remaining = 0`

Mỗi slug sẽ được gọi trực tiếp vào `/phim/{slug}` trên OPhim để lấy chi tiết. Slug 404 sẽ bị đánh dấu `origin_name = ""` để bỏ qua ở lần resync sau.

---

## PostgreSQL — Các bảng

| Bảng | Mục đích |
|---|---|
| `users` | Tài khoản người dùng (email/password và Google OAuth2) |
| `user_roles` | Roles của user (nhiều-nhiều với `users`) |
| `movie_sync` | Track phim đã đồng bộ (`slug` unique) |
| `search_history` | Lịch sử từ khóa tìm kiếm + số lần tìm |
| `movie_view_count` | Lượt xem theo slug |
| `api_request_log` | Log request đến OPhim |

**Bảng `users` — các cột:**

| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | BIGINT | PK tự tăng |
| `email` | VARCHAR | Unique, bắt buộc |
| `password` | VARCHAR | BCrypt. `null` với user Google |
| `name` | VARCHAR | Tên hiển thị |
| `avatar` | VARCHAR | URL avatar (lấy từ Google nếu OAuth2) |
| `provider` | VARCHAR | `local` hoặc `google` |
| `provider_id` | VARCHAR | Google `sub`. `null` với user local |
| `enabled` | BOOLEAN | Tài khoản có hoạt động không |
| `created_at` | TIMESTAMP | Tự động gán khi tạo |
| `updated_at` | TIMESTAMP | Tự động cập nhật |

Schema tự động tạo khi khởi động (`spring.jpa.hibernate.ddl-auto=update`).

**Bảng `movie_sync` — các cột chính:**

| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | BIGINT | PK tự tăng |
| `slug` | VARCHAR | Unique key từ OPhim |
| `title` | VARCHAR | Tên phim (tiếng Việt) |
| `origin_name` | VARCHAR | Tên gốc. `null` = chưa sync đủ; `""` = slug không còn tồn tại trên OPhim |
| `alternative_names` | TEXT (JSON) | Tên thay thế |
| `type` | VARCHAR | Loại phim (`series`, `single`, `hoathinh`, `tvshows`) |
| `thumb_url` | VARCHAR | Ảnh thumbnail |
| `sub_docquyen` | BOOLEAN | Phim sub độc quyền |
| `duration` | VARCHAR | Thời lượng |
| `episode_current` | VARCHAR | Tập hiện tại |
| `quality` | VARCHAR | Chất lượng (`HD`, `FHD`, ...) |
| `lang` | VARCHAR | Ngôn ngữ |
| `year` | INT | Năm sản xuất |
| `category` | TEXT (JSON) | Thể loại |
| `country` | TEXT (JSON) | Quốc gia |
| `tmdb` | TEXT (JSON) | Thông tin TMDB |
| `imdb` | TEXT (JSON) | Thông tin IMDb |
| `created_at` | TIMESTAMP | Thời điểm INSERT |
| `modified_at` | TIMESTAMP | Thời điểm cập nhật gần nhất |

---

## Error Responses

| Lỗi | HTTP Status |
|---|---|
| Không có token / token không hợp lệ | `401 Unauthorized` |
| Token hết hạn | `401 Unauthorized` |
| Không đủ quyền | `403 Forbidden` |
| OPhim API lỗi / timeout | `502 Bad Gateway` |
| Param không hợp lệ | `400 Bad Request` |
| Lỗi server | `500 Internal Server Error` |

```json
{
  "status": false,
  "message": "OPhim API error: ...",
  "data": null,
  "pagination": null
}
```

---

## Lưu ý bảo mật

- File `.env` đã được **gitignore** — không commit credentials
- URL OPhim không expose ra client — mọi request đi qua backend
- CORS chỉ cho phép origin cấu hình trong `cors.allowed-origins`
- Password được hash bằng **BCrypt** trước khi lưu DB
- JWT dùng **HS512** — `JWT_SECRET` phải đủ dài (khuyến nghị 64+ ký tự)
- User Google OAuth2 không có password trong DB (`provider=google`)
- Email đã đăng ký bằng local không thể dùng Google login với cùng email (và ngược lại)
