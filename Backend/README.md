# MocPhim — Backend API

> Nền tảng xem phim trực tuyến — REST API proxy qua OPhim Public API  
> **Stack:** Spring Boot 3.4.5 · PostgreSQL · Redis Cloud (Jedis) · Java 17

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
DB_URL=jdbc:postgresql://localhost:5432/mocphim_db
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

### 3. Chạy app

```bash
mvn spring-boot:run
```

Server khởi động tại: `http://localhost:8080`

---

## Cấu trúc thư mục

```
src/main/java/mocphim/com/backend_web/
├── config/
│   ├── AppConfig.java          # RestTemplate + ObjectMapper
│   ├── RedisConfig.java        # Jedis kết nối Redis Cloud + CacheManager TTL
│   └── CorsConfig.java         # CORS cho /api/**
├── controller/
│   ├── HomeController.java
│   ├── MovieController.java
│   ├── SearchController.java
│   ├── CategoryController.java
│   ├── CountryController.java
│   ├── YearController.java
│   └── SyncController.java     # Xem phim đã sync từ DB
├── service/
│   ├── OPhimService.java       # HTTP proxy đến OPhim API
│   ├── HomeService.java
│   ├── MovieService.java
│   ├── SearchService.java
│   ├── CategoryService.java
│   ├── CountryService.java
│   └── YearService.java
├── scheduler/
│   └── MovieSyncScheduler.java # Tự động sync phim mới mỗi 1 phút
├── entity/
│   ├── MovieSync.java          # Bảng movie_sync
│   ├── SearchHistory.java      # Bảng search_history
│   ├── MovieViewCount.java     # Bảng movie_view_count
│   └── ApiRequestLog.java      # Bảng api_request_log
├── repository/                 # JPA Repositories
├── dto/response/
│   └── ApiResponse.java        # Wrapper chuẩn cho mọi response
└── exception/
    ├── OPhimApiException.java
    └── GlobalExceptionHandler.java
```

---

## API Endpoints

Base URL: `http://localhost:8080/api/v1`

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

### Trang chủ

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/home` | Dữ liệu trang chủ (phim nổi bật, mới nhất...) |

---

### Phim

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/movies?slug={slug}` | Danh sách phim theo bộ lọc |
| GET | `/movies/{slug}` | Chi tiết 1 phim |
| GET | `/movies/{slug}/images` | Hình ảnh phim |
| GET | `/movies/{slug}/peoples` | Diễn viên / đạo diễn |
| GET | `/movies/{slug}/keywords` | Từ khóa phim |

**Query params cho `/movies?slug=`:**

| Param | Kiểu | Mô tả |
|---|---|---|
| `slug` | String | **Bắt buộc.** VD: `phim-moi`, `phim-bo`, `phim-le` |
| `page` | int | Trang (default: 1) |
| `sort_field` | String | Trường sắp xếp |
| `sort_type` | String | `asc` hoặc `desc` |
| `category` | String | Slug thể loại |
| `country` | String | Slug quốc gia |
| `year` | int | Năm sản xuất |
| `type` | String | `series`, `single`, `hoathinh`, `tvshows` |

---

### Tìm kiếm

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/search?keyword={kw}` | Tìm kiếm phim, tự lưu lịch sử vào DB |

---

### Thể loại

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/categories` | Danh sách tất cả thể loại |
| GET | `/categories/{slug}/movies` | Phim theo thể loại |

---

### Quốc gia

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/countries` | Danh sách quốc gia |
| GET | `/countries/{slug}/movies` | Phim theo quốc gia |

---

### Năm phát hành

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/years` | Danh sách năm |
| GET | `/years/{year}/movies` | Phim theo năm |

---

### Sync (nội bộ)

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/sync/movies` | Danh sách phim đã sync vào PostgreSQL |
| GET | `/sync/movies/count` | Tổng số phim đã sync |

---

## Redis Cache TTL

| Cache | TTL |
|---|---|
| `home` | 5 phút |
| `movieDetail` | 10 phút |
| `movieList` | 5 phút |
| `categories` | 30 phút |
| `countries` | 30 phút |
| `years` | 60 phút |

---

## Scheduler

`MovieSyncScheduler` chạy mỗi 1 phút (cấu hình qua `scheduler.movie-sync.cron`):
- Gọi OPhim `/danh-sach/phim-moi`
- Với mỗi phim: kiểm tra `slug` trong bảng `movie_sync`
- Chỉ INSERT phim chưa có, bỏ qua phim trùng
- Lỗi OPhim → log WARN, không crash app

---

## PostgreSQL — Các bảng

| Bảng | Mục đích |
|---|---|
| `movie_sync` | Track phim đã đồng bộ (`slug` unique) |
| `search_history` | Lịch sử từ khóa tìm kiếm + đếm |
| `movie_view_count` | Lượt xem theo slug |
| `api_request_log` | Log request đến OPhim |

Schema tự động tạo khi khởi động (`spring.jpa.hibernate.ddl-auto=update`).

---

## Error Responses

| Lỗi | HTTP Status |
|---|---|
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
