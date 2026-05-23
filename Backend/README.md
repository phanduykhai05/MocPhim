# MocPhim Project Documentation

<<<<<<< HEAD
> Nền tảng xem phim trực tuyến — REST API proxy qua OPhim Public API  
> **Stack:** Spring Boot 3.4.5 · PostgreSQL · Redis · Java 17 · Spring Security 6 · JWT · Google OAuth2
=======
## Tổng quan
Dự án MocPhim bao gồm hai phần chính: **Frontend** và **Backend**. Frontend được xây dựng bằng Next.js và TypeScript, trong khi Backend được phát triển bằng Java Spring Boot. Hai phần này giao tiếp với nhau thông qua các API RESTful để cung cấp trải nghiệm người dùng mượt mà và hiệu quả.
>>>>>>> 3418a81b3a7d808ed65364b7b6b848762d4414a7

## Cấu trúc chi tiết dự án

<<<<<<< HEAD
## Base URL

| Môi trường | URL |
|---|---|
| **Production** | `https://moc-phim-api.duckdns.org` |
| **Local dev** | `http://localhost:8080` |

---

## Response Format

Mọi response đều có cùng cấu trúc:
=======
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
>>>>>>> 3418a81b3a7d808ed65364b7b6b848762d4414a7

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
<<<<<<< HEAD
  "status": true,
  "message": "success",
  "data": { },
  "pagination": null
}
```

| Field | Kiểu | Mô tả |
|---|---|---|
| `status` | boolean | `true` = thành công, `false` = lỗi |
| `message` | string | Thông báo kết quả |
| `data` | any / null | Dữ liệu trả về (null nếu không có) |
| `pagination` | object / null | Thông tin phân trang (null nếu không có) |

**Pagination object** (chỉ xuất hiện ở endpoint có danh sách):
```json
{
  "currentPage": 1,
  "totalPages": 10,
  "totalItems": 240,
  "itemsPerPage": 24
}
```

---

## Xác thực (Authentication)

### Tổng quan luồng

```
┌─────────────────────────────────────────────────────────────┐
│                    ĐĂNG KÝ / LOGIN LOCAL                    │
│                                                             │
│  Register → Gửi email xác thực → Click link → Verified     │
│  Login    → Nhận accessToken + refreshToken                 │
│  accessToken hết hạn → Dùng refreshToken lấy token mới     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      GOOGLE OAUTH2                          │
│                                                             │
│  FE redirect → /oauth2/authorize/google                     │
│  Google xác thực → Backend tạo JWT                          │
│  Redirect về FE kèm ?accessToken=...&refreshToken=...       │
└─────────────────────────────────────────────────────────────┘
```

### Sử dụng token

Mọi request cần xác thực phải gửi kèm header:
```
Authorization: Bearer <accessToken>
```

| Token | TTL | Mục đích |
|---|---|---|
| `accessToken` | 30 phút | Gọi API |
| `refreshToken` | 7 ngày | Lấy accessToken mới khi hết hạn |

---

## Endpoints — Auth

### POST `/auth/register` — Đăng ký tài khoản

**Request:**
```json
{
  "email": "user@example.com",
  "password": "123456",
  "name": "Nguyễn Văn A"
}
```

| Field | Bắt buộc | Validation |
|---|---|---|
| `email` | Có | Đúng định dạng email, chưa được đăng ký |
| `password` | Có | Tối thiểu 6 ký tự |
| `name` | Có | Không được trống |

**Response thành công `200`:**
```json
{
  "status": true,
  "message": "Đăng ký thành công! Kiểm tra email để xác thực.",
  "data": null
}
```

**Response lỗi `400`:**
```json
{ "status": false, "message": "Email đã được sử dụng" }
```

> **Lưu ý FE:** Sau khi đăng ký, user nhận email xác thực. Nếu đăng ký lại cùng email chưa verify → hệ thống tự gửi lại email mới, response vẫn trả `200` với cùng message.

---

### GET `/auth/verify-email?token=xxx` — Xác thực email

Link này do **backend gửi trong email**, FE không cần tự tạo. Khi user click:

| Kết quả | Redirect về |
|---|---|
| Token hợp lệ, còn hạn | `{FRONTEND_URL}/login?verified=true` |
| Token không hợp lệ | `{FRONTEND_URL}/login?error=Token+xác+thực+không+hợp+lệ` |
| Token hết hạn (>24h) | `{FRONTEND_URL}/login?error=Token+xác+thực+đã+hết+hạn` |

**FE cần xử lý ở trang `/login`:**
```javascript
const params = new URLSearchParams(window.location.search)

if (params.get('verified') === 'true') {
  // Hiện toast: "Xác thực email thành công! Vui lòng đăng nhập."
}
if (params.get('error')) {
  // Hiện toast: decodeURIComponent(params.get('error'))
  // VD: "Link đã được dùng hoặc hết hạn, vui lòng đăng ký lại."
}
```

> **Lưu ý:** Token chỉ dùng được **1 lần**. Click lần 2 sẽ báo lỗi — đây là hành vi bình thường.

---

### POST `/auth/login` — Đăng nhập

**Request:**
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

**Response thành công `200`:**
```json
{
  "status": true,
  "message": "Đăng nhập thành công",
  "data": {
    "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
    "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
    "tokenType": "Bearer",
    "expiresIn": 1800000
  }
}
```

**Response lỗi `401`:**
```json
{ "status": false, "message": "Bad credentials" }
```

**FE lưu token:**
```javascript
const { accessToken, refreshToken } = response.data.data
localStorage.setItem('accessToken', accessToken)
localStorage.setItem('refreshToken', refreshToken)
```

---

### POST `/auth/refresh` — Làm mới access token

Gọi khi nhận lỗi `401` từ bất kỳ API nào.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9..."
}
```

**Response thành công `200`:**
```json
{
  "status": true,
  "data": {
    "accessToken": "eyJ...(mới)",
    "refreshToken": "eyJ...(cũ giữ nguyên)",
    "tokenType": "Bearer",
    "expiresIn": 1800000
  }
}
```

**Response lỗi `400`:**
```json
{ "status": false, "message": "Refresh token không hợp lệ" }
```

> Nếu refresh token cũng hết hạn → xóa token, redirect về `/login`.

**Ví dụ auto-refresh với Axios:**
```javascript
axios.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401 && !err.config._retry) {
      err.config._retry = true
      const refreshToken = localStorage.getItem('refreshToken')
      try {
        const { data } = await axios.post('/auth/refresh', { refreshToken })
        localStorage.setItem('accessToken', data.data.accessToken)
        err.config.headers['Authorization'] = `Bearer ${data.data.accessToken}`
        return axios(err.config)
      } catch {
        localStorage.clear()
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)
```

---

### POST `/auth/forgot-password` — Quên mật khẩu

**Request:**
```json
{ "email": "user@example.com" }
```

**Response `200` (luôn trả về cùng message):**
```json
{
  "status": true,
  "message": "Nếu email tồn tại, bạn sẽ nhận được hướng dẫn."
}
```

> Message không thay đổi dù email tồn tại hay không — bảo mật chống dò user.  
> Email chỉ được gửi nếu tài khoản tồn tại **và đã xác thực**. Link có hiệu lực **15 phút**.

**Luồng đầy đủ cho FE:**

```
Trang /forgot-password
        ↓
User nhập email → POST /auth/forgot-password
        ↓
Luôn hiển thị: "Nếu email tồn tại, bạn sẽ nhận được hướng dẫn."
(không phân biệt email đúng/sai để tránh lộ thông tin)
        ↓
User vào email → click link "Đặt lại mật khẩu"
        ↓
Link trỏ về: https://moc-phim.vercel.app/reset-password?token=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
        ↓
Trang /reset-password đọc token từ URL → hiện form nhập mật khẩu mới
```

**Code mẫu trang `/forgot-password`:**
```javascript
async function handleForgotPassword(email) {
  setLoading(true)
  try {
    const res = await axios.post('/auth/forgot-password', { email })
    // Luôn hiển thị cùng message — không cần check status
    setMessage(res.data.message)
    // "Nếu email tồn tại, bạn sẽ nhận được hướng dẫn."
  } catch (err) {
    // Chỉ lỗi 400 nếu email sai định dạng
    setError(err.response?.data?.message || 'Có lỗi xảy ra')
  } finally {
    setLoading(false)
=======
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
>>>>>>> 3418a81b3a7d808ed65364b7b6b848762d4414a7
  }
}
```

<<<<<<< HEAD
---

### POST `/auth/reset-password` — Đặt lại mật khẩu

User click link trong email → trình duyệt mở:
```
https://moc-phim.vercel.app/reset-password?token=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**FE đọc token từ URL:**
```javascript
// Trang /reset-password — đọc token ngay khi component mount
const token = new URLSearchParams(window.location.search).get('token')

if (!token) {
  // Không có token → redirect về /forgot-password
  router.push('/forgot-password')
}
```

**Request:**
```json
{
  "token": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "newPassword": "matkhaumoi123"
}
```

| Field | Validation |
|---|---|
| `token` | Không được trống |
| `newPassword` | Tối thiểu 6 ký tự |

**Response thành công `200`:**
```json
{ "status": true, "message": "Đặt lại mật khẩu thành công!" }
```

**Response lỗi `400`:**
```json
{ "status": false, "message": "Token không hợp lệ" }
{ "status": false, "message": "Token đặt lại mật khẩu đã hết hạn" }
```

**Code mẫu trang `/reset-password`:**
```javascript
async function handleResetPassword(newPassword) {
  const token = new URLSearchParams(window.location.search).get('token')

  if (!token) {
    router.push('/forgot-password')
    return
  }

  setLoading(true)
  try {
    const res = await axios.post('/auth/reset-password', { token, newPassword })
    // Thành công → redirect về login kèm thông báo
    router.push('/login?reset=success')
  } catch (err) {
    const msg = err.response?.data?.message || 'Có lỗi xảy ra'
    if (msg.includes('hết hạn')) {
      setError('Link đã hết hạn (15 phút). Vui lòng yêu cầu lại.')
    } else {
      setError('Link không hợp lệ. Vui lòng yêu cầu đặt lại mật khẩu mới.')
    }
  } finally {
    setLoading(false)
  }
}
```

**FE xử lý thêm ở trang `/login`:**
```javascript
const params = new URLSearchParams(window.location.search)

if (params.get('verified') === 'true') {
  setSuccessMsg('Xác thực email thành công! Vui lòng đăng nhập.')
}
if (params.get('reset') === 'success') {
  setSuccessMsg('Đặt lại mật khẩu thành công! Vui lòng đăng nhập.')
}
if (params.get('error')) {
  setErrorMsg(decodeURIComponent(params.get('error')))
}
```

**Luồng đầy đủ:**
```
/forgot-password  →  nhập email  →  POST /auth/forgot-password
                                           ↓
                                    Gửi email (nếu tồn tại)
                                           ↓
                              User click link trong email
                                           ↓
                        /reset-password?token=xxxxxxxx
                                           ↓
                              Nhập mật khẩu mới
                                           ↓
                         POST /auth/reset-password
                                           ↓
                          /login?reset=success  ✓
```

---

### POST `/auth/logout` — Đăng xuất

Không cần body. FE chỉ cần xóa token phía client.

**Response `200`:**
```json
{ "status": true, "message": "Đăng xuất thành công" }
```

```javascript
// FE xử lý logout
await axios.post('/auth/logout')
localStorage.removeItem('accessToken')
localStorage.removeItem('refreshToken')
window.location.href = '/login'
```

---

### GET `/auth/me` — Thông tin user hiện tại

Yêu cầu `Authorization: Bearer <accessToken>`.

**Response `200`:**
```json
{
  "status": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "Nguyễn Văn A",
    "avatar": null,
    "provider": "local",
    "roles": ["ROLE_USER"],
    "isVerified": true,
    "enabled": true,
    "createdAt": "2026-05-01T10:00:00",
    "updatedAt": "2026-05-10T15:30:00"
  }
}
```

| Field | Mô tả |
|---|---|
| `provider` | `"local"` hoặc `"google"` |
| `avatar` | URL ảnh (có giá trị với Google OAuth2, `null` với local) |
| `roles` | Mảng role — thường là `["ROLE_USER"]`, admin có thêm `"ROLE_ADMIN"` |
| `isVerified` | `true` nếu đã xác thực email |
| `enabled` | `true` nếu tài khoản đang hoạt động |
| `createdAt` | Thời điểm tạo tài khoản (ISO 8601) |
| `updatedAt` | Thời điểm cập nhật cuối (ISO 8601) |

---

## Đăng nhập Google OAuth2

### Luồng chi tiết

```
1. FE redirect browser đến:
   https://moc-phim-api.duckdns.org/oauth2/authorize/google

2. Google hiện trang chọn tài khoản → user chọn

3. Backend xác thực với Google, tạo JWT

4. Backend redirect về FE:
   https://moc-phim.vercel.app/oauth2/callback/google
     ?accessToken=eyJ...
     &refreshToken=eyJ...

5. FE đọc token từ URL → lưu → dùng như login thường
```

### FE cần tạo route `/oauth2/callback/google`

```javascript
// pages/oauth2/callback/google.jsx (Next.js) hoặc tương đương
useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  const accessToken = params.get('accessToken')
  const refreshToken = params.get('refreshToken')
  const error = params.get('error')

  if (error) {
    // "email_conflict" → email đã đăng ký bằng local
    router.push(`/login?error=${error}`)
    return
  }

  if (accessToken && refreshToken) {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    router.push('/')
  }
}, [])
```

### Các trường hợp lỗi callback

| `?error=` | Ý nghĩa | FE hiển thị |
|---|---|---|
| `email_conflict` | Email đã đăng ký bằng email/password | "Email này đã đăng ký theo cách khác, vui lòng đăng nhập bằng email/password" |
| `oauth2_error` | Lỗi từ Google | "Đăng nhập Google thất bại, vui lòng thử lại" |

---

## Endpoints — Phim

> Tất cả endpoint phim đều **public** (không cần token).  
> Prefix: `/api/v1`

### GET `/api/v1/home` — Trang chủ

```
GET /api/v1/home
```

---

### GET `/api/v1/movies` — Danh sách phim

```
GET /api/v1/movies?list=phim-bo&page=1
```

| Param | Bắt buộc | Mô tả | Ví dụ |
|---|---|---|---|
| `list` | Có | Loại danh sách | `phim-bo`, `phim-le`, `hoat-hinh`, `tv-shows` |
| `page` | Không | Trang (default: 1) | `2` |
| `sort_field` | Không | Trường sắp xếp | `modified.time` |
| `sort_type` | Không | Thứ tự | `asc`, `desc` |
| `category` | Không | Slug thể loại | `hanh-dong` |
| `country` | Không | Slug quốc gia | `trung-quoc` |
| `year` | Không | Năm sản xuất | `2024` |
| `type` | Không | Kiểu phim | `series`, `single`, `hoathinh`, `tvshows` |

---

### GET `/api/v1/movies/{slug}` — Chi tiết phim

```
GET /api/v1/movies/ten-phim-slug
```

### GET `/api/v1/movies/{slug}/images` — Hình ảnh phim
### GET `/api/v1/movies/{slug}/peoples` — Diễn viên / đạo diễn
### GET `/api/v1/movies/{slug}/keywords` — Từ khóa phim

---

## Endpoints — Tìm kiếm

### GET `/api/v1/search` — Tìm kiếm phim

```
GET /api/v1/search?keyword=doraemon
```

Tự động lưu từ khóa vào DB để làm lịch sử.

### GET `/api/v1/search/history` — Top từ khóa

```
GET /api/v1/search/history?limit=10
```

---

## Endpoints — Thể loại / Quốc gia / Năm

```
GET /api/v1/categories                        → Danh sách thể loại
GET /api/v1/categories/{slug}/movies?page=1   → Phim theo thể loại

GET /api/v1/countries                         → Danh sách quốc gia
GET /api/v1/countries/{slug}/movies?page=1    → Phim theo quốc gia

GET /api/v1/years                             → Danh sách năm
GET /api/v1/years/{year}/movies?page=1        → Phim theo năm
```

Query params lọc/sắp xếp cho các endpoint `/movies`: `page`, `sort_field`, `sort_type` (giống `/api/v1/movies`).

---

## Xử lý lỗi phía Frontend

### HTTP Status codes

| Status | Ý nghĩa | FE xử lý |
|---|---|---|
| `400` | Request không hợp lệ | Hiển thị `message` từ response |
| `401` | Chưa đăng nhập / token hết hạn | Thử refresh token, nếu fail → redirect `/login` |
| `403` | Không có quyền | Hiển thị "Không có quyền truy cập" |
| `502` | OPhim API lỗi | Hiển thị "Không thể tải dữ liệu, thử lại sau" |
| `500` | Lỗi server | Hiển thị "Có lỗi xảy ra, thử lại sau" |

### Response lỗi chuẩn

```json
{
  "status": false,
  "message": "Mô tả lỗi cụ thể",
  "data": null,
  "pagination": null
}
```

### Kiểm tra response

```javascript
const res = await axios.post('/auth/login', body)
if (!res.data.status) {
  showError(res.data.message)
  return
}
// Xử lý thành công
const { accessToken } = res.data.data
```

---

## Phân quyền (Roles)

| Role | Mô tả |
|---|---|
| `ROLE_USER` | Mặc định khi đăng ký |
| `ROLE_ADMIN` | Truy cập được endpoint sync/admin |

```javascript
// Kiểm tra role phía FE
const user = await getMe()
const isAdmin = user.roles.includes('ROLE_ADMIN')
```

**Tài khoản admin mặc định:**
| | |
|---|---|
| Email | `admin@mocphim.com` |
| Password | `Admin@123` |

---

## Frontend — Pages cần tạo

| Route | Mục đích |
|---|---|
| `/login` | Đọc `?verified=true` hoặc `?error=...` |
| `/register` | Form đăng ký |
| `/forgot-password` | Form nhập email |
| `/reset-password` | Đọc `?token=...` từ URL, form nhập mật khẩu mới |
| `/oauth2/callback/google` | Đọc `?accessToken&refreshToken` từ URL |

---

## Admin Endpoints (yêu cầu ROLE_ADMIN)

Tất cả endpoint dưới đây yêu cầu header `Authorization: Bearer <accessToken>` của tài khoản có `ROLE_ADMIN`.

```
POST   /api/v1/sync/movies/trigger    → Sync thủ công phim từ OPhim
POST   /api/v1/sync/movies/resync     → Re-sync record thiếu metadata
GET    /api/v1/sync/movies            → Danh sách phim đã sync (phân trang)
GET    /api/v1/sync/movies/all        → Tối đa 500 phim mới nhất
GET    /api/v1/sync/movies/count      → Tổng số phim đã sync
DELETE /api/v1/admin/cache            → Xóa toàn bộ cache
DELETE /api/v1/admin/cache/{name}     → Xóa cache theo tên
GET    /api/v1/admin/cache            → Danh sách tên cache
GET    /api/v1/admin/users            → Danh sách tất cả user (phân trang)
```

---

### GET `/api/v1/admin/users` — Danh sách tất cả user

**Query params:**

| Param | Mặc định | Mô tả |
|---|---|---|
| `page` | `0` | Trang (bắt đầu từ 0) |
| `size` | `20` | Số user mỗi trang |

**Ví dụ:**
```
GET /api/v1/admin/users?page=0&size=20
```

**Response `200`:**
```json
{
  "status": true,
  "message": "success",
  "data": [
    {
      "id": 1,
      "email": "admin@mocphim.com",
      "name": "Admin",
      "avatar": null,
      "provider": "local",
      "roles": ["ROLE_USER", "ROLE_ADMIN"],
      "isVerified": true,
      "enabled": true,
      "createdAt": "2026-05-01T10:00:00",
      "updatedAt": "2026-05-10T15:30:00"
    },
    {
      "id": 2,
      "email": "user@example.com",
      "name": "Nguyễn Văn A",
      "avatar": "https://lh3.googleusercontent.com/...",
      "provider": "google",
      "roles": ["ROLE_USER"],
      "isVerified": true,
      "enabled": true,
      "createdAt": "2026-05-05T08:20:00",
      "updatedAt": "2026-05-05T08:20:00"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20
  }
}
```

Kết quả sắp xếp theo `createdAt` mới nhất trước.

**Response lỗi `401` / `403`:**
```json
{ "status": false, "message": "Vui lòng đăng nhập" }
{ "status": false, "message": "Không có quyền truy cập" }
```

---

## Cài đặt & Chạy (Backend Dev)

### Yêu cầu
- Java 17+, Maven 3.8+
- PostgreSQL, Redis

### Biến môi trường (`.env`)

```env
DB_URL=jdbc:postgresql://localhost:5432/mocphim
DB_USERNAME=postgres
DB_PASSWORD=your_password

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USER=default
REDIS_PASSWORD=your_redis_password

JWT_SECRET=your_secret_min_64_chars

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OAUTH2_REDIRECT_URI=http://localhost:3000/oauth2/callback/google
FRONTEND_URL=http://localhost:3000

# Email (Gmail App Password hoặc Brevo SMTP Key)
APP_URL=http://localhost:8080
```

### Chạy

```bash
./mvnw spring-boot:run

# Docker
docker compose up -d
```

---

## Redis Cache TTL

| Cache | TTL |
|---|---|
| `home` | 5 phút |
| `movieDetail` | 10 phút |
| `movieList` | 5 phút |
| `categories`, `countries` | 30 phút |
| `years` | 60 phút |
| `users` | 1 giờ |
| `searchHistory` | 5 phút |
| `syncedMovies` | 2 phút |

---

## Bảo mật

- Token xác thực & reset mật khẩu dùng UUID, **single-use**, xóa ngay sau khi dùng
- `forgot-password` luôn trả cùng message — chống dò email tồn tại
- Password hash BCrypt, JWT ký HS512
- CORS chỉ cho phép origin trong `cors.allowed-origins`
=======
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
>>>>>>> 3418a81b3a7d808ed65364b7b6b848762d4414a7
