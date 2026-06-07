# MocPhim — Backend API

> Nền tảng xem phim trực tuyến — REST API proxy qua OPhim Public API  
> **Stack:** Spring Boot 3.4.5 · PostgreSQL · Redis · Java 17 · Spring Security 6 · JWT · Google OAuth2

---

## Base URL

| Môi trường | URL |
|---|---|
| **Production** | `https://moc-phim-api.duckdns.org` |
| **Local dev** | `http://localhost:8080` |

---

## Response Format

Mọi response đều có cùng cấu trúc:

```json
{
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
  }
}
```

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

## Endpoints — Bookmark

> Prefix: `/api/bookmarks`  
> Tất cả endpoint yêu cầu `Authorization: Bearer <accessToken>`. `userId` được lấy tự động từ token — không cần gửi trong request.

### Flow tổng quan

```
┌─────────────────────────────────────────────────────────────┐
│                        BOOKMARK FLOW                        │
│                                                             │
│  1. User bấm bookmark phim                                  │
│     POST /api/bookmarks                                     │
│     Body: { "slug": "ten-phim" }                            │
│                                                             │
│  2. User vào trang bookmark → danh sách kèm tiến trình      │
│     GET /api/bookmarks/{userId}                             │
│     → latestEpisode, positionSeconds, lastWatchedAt         │
│       (null nếu chưa xem lần nào)                           │
│                                                             │
│  3. Kiểm tra trạng thái nút bookmark                        │
│     GET /api/bookmarks/isBookmarked/{userId}/{movieId}      │
│                                                             │
│  4. Xóa bookmark                                            │
│     DELETE /api/bookmarks/{userId}/{movieId}                │
└─────────────────────────────────────────────────────────────┘
```

---

### POST `/api/bookmarks` — Thêm bookmark

**Header:** `Authorization: Bearer <accessToken>`

**Request:**
```json
{
  "slug": "nhip-dap-trai-tim-phan-5"
}
```

> Backend tự lấy `userId` từ token và tra cứu `movieId`, `movieTitle`, `posterUrl`, `mediaType` từ DB (đã sync từ OPhim). FE chỉ cần gửi `slug` của phim.

**Response `200`:**
```json
{
  "status": true,
  "data": {
    "id": 1,
    "userId": 3,
    "movieId": "69dfcfeb41d6bb2c315360fb",
    "slug": "nhip-dap-trai-tim-phan-5",
    "movieTitle": "Nhịp Đập Trái Tim (Phần 5)",
    "posterUrl": "nhip-dap-trai-tim-phan-5-poster.jpg",
    "mediaType": "series",
    "bookmarkDate": "2026-05-22T10:00:00",
    "latestEpisode": null,
    "positionSeconds": null,
    "episodeCompleted": null,
    "lastWatchedAt": null
  }
}
```

> `latestEpisode`, `positionSeconds`, `episodeCompleted`, `lastWatchedAt` — `null` khi user chưa xem tập nào của phim đó.

**Response lỗi `400`:**
```json
{ "status": false, "message": "Already bookmarked" }
{ "status": false, "message": "Phim chưa được đồng bộ, vui lòng thử lại sau" }
```

---

### GET `/api/bookmarks/{userId}` — Danh sách bookmark

**Header:** `Authorization: Bearer <accessToken>`

```
GET /api/bookmarks/3
```

> `userId` trong path phải khớp với token. Nếu không khớp → `403 Forbidden`.

**Response `200`:** Mảng bookmark sắp xếp theo `bookmarkDate` mới nhất, kèm tiến trình tập xem gần nhất (nếu có):

```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "userId": 3,
      "movieId": "69dfcfeb41d6bb2c315360fb",
      "slug": "nhip-dap-trai-tim-phan-5",
      "movieTitle": "Nhịp Đập Trái Tim (Phần 5)",
      "posterUrl": "nhip-dap-trai-tim-phan-5-poster.jpg",
      "mediaType": "series",
      "bookmarkDate": "2026-05-22T10:00:00",
      "latestEpisode": 4,
      "positionSeconds": 1234,
      "episodeCompleted": false,
      "lastWatchedAt": "2026-05-27T20:30:00"
    }
  ]
}
```

---

### GET `/api/bookmarks/isBookmarked/{userId}/{movieId}` — Kiểm tra đã bookmark chưa

**Header:** `Authorization: Bearer <accessToken>`

```
GET /api/bookmarks/isBookmarked/3/69dfcfeb41d6bb2c315360fb
```

> `userId` trong path phải khớp với token. Nếu không khớp → `403 Forbidden`.

**Response `200`:**
```json
{ "status": true, "data": true }
```

Dùng để FE render nút bookmark (đã bookmark / chưa bookmark).

---

### DELETE `/api/bookmarks/{userId}/{movieId}` — Xóa bookmark

**Header:** `Authorization: Bearer <accessToken>`

```
DELETE /api/bookmarks/3/69dfcfeb41d6bb2c315360fb
```

> `userId` trong path phải khớp với token. Nếu không khớp → `403 Forbidden`.

**Response `200`:**
```json
{ "status": true, "data": "Xóa bookmark thành công" }
```

---

## Endpoints — WatchProgress (Tiến trình xem)

> Prefix: `/api/v1/progress`  
> Tất cả endpoint yêu cầu `Authorization: Bearer <accessToken>`. `userId` trong path phải khớp với token — nếu không khớp → `403 Forbidden`.

### Flow tổng quan

```
┌─────────────────────────────────────────────────────────────┐
│                     WATCH PROGRESS FLOW                      │
│                                                             │
│  1. User mở trang phim (không có tập trong URL)             │
│     GET /api/v1/progress/{userId}/resume/{slug}             │
│     → episodeNumber, positionSeconds của tập gần nhất       │
│     → null nếu chưa xem lần nào → FE load tập 1            │
│                                                             │
│  2. User đang xem — mỗi ~30s FE gọi để lưu vị trí          │
│     PATCH /api/v1/progress/{userId}/{movieId}/{episode}     │
│     Body: { "positionSeconds": 320 }                        │
│                                                             │
│  3. User mở lại player (click vào tập cụ thể)               │
│     GET /api/v1/progress/{userId}/{movieId}/{episode}       │
│     → positionSeconds để seek đúng vị trí                   │
└─────────────────────────────────────────────────────────────┘
```

> **movieId** là `_id` từ OPhim, lấy từ response của `GET /api/v1/movies/{slug}`.

---

### GET `/api/v1/progress/{userId}/resume/{slug}` — Lấy điểm tiếp tục

Gọi khi user mở trang phim để biết cần load tập mấy. Trả về tập có `lastWatchedAt` mới nhất.

```
GET /api/v1/progress/3/resume/rick-va-morty-phan-9
```

**Response `200` (đã xem):**
```json
{
  "status": true,
  "data": {
    "userId": 3,
    "movieId": "68a1b2c3d4e5f6",
    "slug": "rick-va-morty-phan-9",
    "episodeNumber": 5,
    "positionSeconds": 320,
    "isCompleted": false,
    "lastWatchedAt": "2026-05-28T20:30:00"
  }
}
```

**Response `200` (chưa xem lần nào):**
```json
{ "status": true, "data": null }
```

> Khi `data` là `null` → FE load tập 1, không cần seek.

---

### GET `/api/v1/progress/{userId}/{movieId}/{episodeNumber}` — Tiến trình 1 tập

Gọi khi user mở player để seek đúng vị trí đã xem trước đó.

```
GET /api/v1/progress/3/68a1b2c3d4e5f6/5
```

**Response `200`:**
```json
{
  "status": true,
  "data": {
    "userId": 3,
    "movieId": "68a1b2c3d4e5f6",
    "slug": "rick-va-morty-phan-9",
    "episodeNumber": 5,
    "positionSeconds": 320,
    "isCompleted": false,
    "lastWatchedAt": "2026-05-28T20:30:00"
  }
}
```

> Nếu chưa có tiến trình cho tập đó → trả về `positionSeconds: 0`, `isCompleted: false`.

---

### GET `/api/v1/progress/{userId}/{movieId}` — Tất cả tập đã xem của 1 phim

Dùng cho trang chi tiết phim để đánh dấu tập nào đã xem.

```
GET /api/v1/progress/3/68a1b2c3d4e5f6
```

**Response `200`:**
```json
{
  "status": true,
  "data": [
    { "episodeNumber": 1, "positionSeconds": 1440, "isCompleted": true, "lastWatchedAt": "..." },
    { "episodeNumber": 5, "positionSeconds": 320, "isCompleted": false, "lastWatchedAt": "..." }
  ]
}
```

---

### PATCH `/api/v1/progress/{userId}/{movieId}/{episodeNumber}` — Lưu/cập nhật tiến trình

Gọi mỗi ~30s khi xem, khi pause, chuyển tập, hoặc đóng trang.

```
PATCH /api/v1/progress/3/68a1b2c3d4e5f6/5
```

**Request:**
```json
{
  "slug": "rick-va-morty-phan-9",
  "positionSeconds": 320,
  "isCompleted": false
}
```

| Field | Bắt buộc | Mô tả |
|---|---|---|
| `slug` | Chỉ lần đầu tiên | Bắt buộc khi record chưa tồn tại, bỏ qua được ở các lần sau |
| `positionSeconds` | Không | Vị trí hiện tại tính bằng giây |
| `isCompleted` | Không | `true` khi tập kết thúc |

**Response `200`:**
```json
{
  "status": true,
  "data": {
    "userId": 3,
    "movieId": "68a1b2c3d4e5f6",
    "slug": "rick-va-morty-phan-9",
    "episodeNumber": 5,
    "positionSeconds": 320,
    "isCompleted": false,
    "lastWatchedAt": "2026-05-28T20:35:00"
  }
}
```

---

### Flow Progress — Frontend

**1. Trang phim `/phim/{slug}`**
```
User mở trang → đã login?
  Có → GET /api/v1/progress/{userId}/resume/{slug}
        data.episodeNumber? → redirect /xem-phim/{slug}?tap=N&sv=0
        null?               → ở lại trang, user tự chọn tập
```

**2. Trang xem `/xem-phim/{slug}?tap=N` — Restore vị trí**
```
HLS MANIFEST_PARSED fired
  → đọc localStorage[progress_{slug}_{ep}]
  → có token? → GET /api/v1/progress/{userId}/{movieId}/{ep}
        server > 5s  → dùng server (server thắng)
        server = 0   → giữ localStorage (không override)
  → saved > 5s? → video.currentTime = saved
```

**3. Đang xem — Lưu tiến trình**

Trigger: mỗi 30s (nếu đang play) + pause + ended + pagehide
```
currentTime > 5s?
  → localStorage[progress_{slug}_{ep}] = seconds
  → PATCH /api/v1/progress/{userId}/{movieId}/{ep}
     { slug, positionSeconds, isCompleted }

isCompleted = true khi currentTime >= 90% tổng thời lượng
```

**4. Chuyển tập (không F5)**
```
Click tập khác
  → aborted = true        (chặn restoreProgress cũ)
  → cleanup HLS cũ        (remove listeners, clear interval, destroy)
  → HLS mới load tập mới → lặp lại bước 2
```

**Ghi chú kỹ thuật**

| | |
|---|---|
| `userRef` | Auth load chậm không ảnh hưởng — save/restore luôn thấy user mới nhất |
| `aborted` flag | Switch tập nhanh không bị race condition seek sai tập |
| Server vs localStorage | Server thắng chỉ khi > 5s, tránh `server=0` ghi đè localStorage |
| HLS deps | Không có user → HLS không restart khi auth state thay đổi |

---

## Endpoints — Comments (Bình luận)

> Prefix: `/api/v1/comments`

### Flow tổng quan

```
┌─────────────────────────────────────────────────────────────┐
│                        COMMENT FLOW                          │
│                                                             │
│  1. Vào trang phim → load bình luận (public, không cần login)│
│     GET /api/v1/comments/{slug}?page=0&size=10              │
│     Có token → truyền Bearer → server trả thêm userVote     │
│                                                             │
│  2. Đăng bình luận (cần đăng nhập)                          │
│     POST /api/v1/comments/{slug}                            │
│     Top-level: không có parentId                            │
│     Reply: có parentId = id của comment cha                 │
│                                                             │
│  3. Vote bình luận (cần đăng nhập)                          │
│     POST /api/v1/comments/{id}/vote                         │
│     Gọi lại cùng loại vote → undo                           │
│     Gọi khác loại → đổi vote                                │
│                                                             │
│  4. Xóa bình luận (cần đăng nhập)                           │
│     DELETE /api/v1/comments/{id}                            │
│     Chỉ chủ comment hoặc Admin mới được xóa                 │
└─────────────────────────────────────────────────────────────┘
```

---

### GET `/api/v1/comments/{slug}` — Lấy bình luận theo phim

**Public** — không cần token. Nếu có token → server trả thêm `userVote` của người dùng đó.

```
GET /api/v1/comments/one-piece?page=0&size=10
Authorization: Bearer <accessToken>   (tuỳ chọn)
```

| Param | Mặc định | Mô tả |
|---|---|---|
| `page` | `0` | Trang (bắt đầu từ 0) |
| `size` | `10` | Số comment mỗi trang |

**Response `200`:**
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "movieSlug": "one-piece",
      "userId": 3,
      "userName": "Nguyễn Văn A",
      "userAvatar": "https://lh3.googleusercontent.com/...",
      "content": "Phim hay quá!",
      "isSpoiler": false,
      "parentId": null,
      "upvotes": 5,
      "downvotes": 1,
      "status": "approved",
      "createdAt": "2026-06-01T10:00:00",
      "updatedAt": "2026-06-01T10:00:00",
      "userVote": "up",
      "replies": [
        {
          "id": 2,
          "userId": 4,
          "userName": "Trần Thị B",
          "userAvatar": null,
          "content": "Đồng ý!",
          "isSpoiler": false,
          "parentId": 1,
          "upvotes": 2,
          "downvotes": 0,
          "status": "approved",
          "createdAt": "2026-06-01T10:05:00",
          "updatedAt": "2026-06-01T10:05:00",
          "userVote": null,
          "replies": []
        }
      ]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25,
    "itemsPerPage": 10
  }
}
```

| Field | Mô tả |
|---|---|
| `status` | `"approved"` — chỉ comment đã duyệt mới hiển thị |
| `userVote` | `"up"`, `"down"`, hoặc `null` — `null` nếu chưa vote hoặc chưa đăng nhập |
| `replies` | Tối đa **5 reply** đầu tiên, sắp xếp theo `createdAt` tăng dần |
| `parentId` | `null` = comment gốc; có giá trị = reply |

> **Lưu ý FE:** `replies` chỉ trả 5 cái đầu. Nếu muốn "Xem thêm reply" thì cần gọi riêng (hiện chưa có endpoint riêng — load thêm khi cần).

---

### POST `/api/v1/comments/{slug}` — Đăng bình luận

**Yêu cầu:** `Authorization: Bearer <accessToken>`

**Request (comment gốc):**
```json
{
  "content": "Phim hay lắm!",
  "isSpoiler": false
}
```

**Request (reply một comment):**
```json
{
  "content": "Mình đồng ý!",
  "isSpoiler": false,
  "parentId": 1
}
```

| Field | Bắt buộc | Mô tả |
|---|---|---|
| `content` | Có | Nội dung, tối đa 1000 ký tự |
| `isSpoiler` | Không | Mặc định `false` |
| `parentId` | Không | `null` = comment gốc; id comment cha = reply |

**Response `200`:**
```json
{
  "status": true,
  "message": "Bình luận đã được đăng",
  "data": {
    "id": 10,
    "movieSlug": "one-piece",
    "userId": 3,
    "userName": "Nguyễn Văn A",
    "userAvatar": null,
    "content": "Phim hay lắm!",
    "isSpoiler": false,
    "parentId": null,
    "upvotes": 0,
    "downvotes": 0,
    "status": "approved",
    "createdAt": "2026-06-07T09:00:00",
    "updatedAt": "2026-06-07T09:00:00",
    "userVote": null,
    "replies": []
  }
}
```

> Comment mới có `status: "approved"` ngay — không cần duyệt. Admin có thể đổi trạng thái sau.

---

### POST `/api/v1/comments/{id}/vote` — Vote bình luận

**Yêu cầu:** `Authorization: Bearer <accessToken>`

```
POST /api/v1/comments/10/vote
```

**Request:**
```json
{ "voteType": "up" }
```

| `voteType` | Mô tả |
|---|---|
| `"up"` | Upvote |
| `"down"` | Downvote |

**Hành vi:**

| Trạng thái hiện tại | Gửi lên | Kết quả |
|---|---|---|
| Chưa vote | `"up"` | +1 upvote, `userVote: "up"` |
| Đang `"up"` | `"up"` | Undo → upvote -1, `userVote: null` |
| Đang `"up"` | `"down"` | Đổi → upvote -1, downvote +1, `userVote: "down"` |

**Response `200`:** Trả về `CommentResponse` với `upvotes`, `downvotes`, `userVote` đã cập nhật.

---

### DELETE `/api/v1/comments/{id}` — Xóa bình luận

**Yêu cầu:** `Authorization: Bearer <accessToken>`

```
DELETE /api/v1/comments/10
```

| Người gọi | Kết quả |
|---|---|
| Chủ comment | Xóa thành công |
| Admin | Xóa thành công |
| User khác | `403 Forbidden` |
| Chưa đăng nhập | `401 Unauthorized` |

**Response `200`:**
```json
{ "status": true, "data": "Đã xóa bình luận" }
```

---

### Admin — GET `/api/v1/comments/admin/all` — Tất cả bình luận

**Yêu cầu:** `ROLE_ADMIN`

```
GET /api/v1/comments/admin/all?page=0&size=20&status=pending
```

| Param | Mô tả |
|---|---|
| `status` | Lọc theo trạng thái: `pending`, `approved`, `spam`. Bỏ trống = tất cả |

---

### Admin — PATCH `/api/v1/comments/admin/{id}/status` — Duyệt / xử lý bình luận

**Yêu cầu:** `ROLE_ADMIN`

```
PATCH /api/v1/comments/admin/10/status
```

**Request:**
```json
{ "status": "approved" }
```

| `status` | Ý nghĩa |
|---|---|
| `"approved"` | Hiển thị công khai |
| `"pending"` | Chờ duyệt (ẩn khỏi public) |
| `"spam"` | Đánh dấu spam (ẩn khỏi public) |

---

## Endpoints — Views (Lượt xem)

> Prefix: `/api/v1/views`  
> Tất cả endpoint đều **public**.

### Flow tổng quan

```
┌─────────────────────────────────────────────────────────────┐
│                         VIEW FLOW                            │
│                                                             │
│  1. User bắt đầu xem video → gọi 1 lần duy nhất            │
│     POST /api/v1/views/{slug}                               │
│     → Cộng 1 view (chỉ lần đầu trong 24h)                  │
│     → Thoát ra vào lại trong 24h: KHÔNG cộng thêm          │
│                                                             │
│  2. Lấy view count một phim                                  │
│     GET /api/v1/views/{slug}                                │
│                                                             │
│  3. Lấy view count nhiều phim cùng lúc (cho trang listing)  │
│     GET /api/v1/views/batch?slugs=one-piece,vincenzo        │
└─────────────────────────────────────────────────────────────┘
```

**Cơ chế chống buff view:**
- Đã đăng nhập → dedup theo `userId` (đổi IP vẫn không buff được)
- Chưa đăng nhập → dedup theo `IP address`
- Cooldown: **24 giờ** — sau 24h xem lại mới cộng thêm 1 view
- Lưu trữ trong Redis key: `view:{slug}:u:{userId}` hoặc `view:{slug}:ip:{ip}`

---

### POST `/api/v1/views/{slug}` — Ghi nhận lượt xem

Gọi **một lần duy nhất** khi user bắt đầu xem video (không cần auth).

```
POST /api/v1/views/one-piece
Authorization: Bearer <accessToken>   (tuỳ chọn — nếu có sẽ dedup theo userId)
```

**Response `200`:**
```json
{
  "status": true,
  "data": {
    "viewCount": 1024,
    "viewCountToday": 38
  }
}
```

> Nếu đã xem trong 24h → response vẫn trả `200` với count hiện tại, không tăng thêm.

**FE nên gọi khi:**
```javascript
// Gọi khi HLS bắt đầu phát (MANIFEST_PARSED hoặc playing event)
player.on('playing', () => {
  if (!viewRecorded) {
    viewRecorded = true
    axios.post(`/api/v1/views/${slug}`)
  }
})
```

---

### GET `/api/v1/views/{slug}` — Lấy view count một phim

```
GET /api/v1/views/one-piece
```

**Response `200`:**
```json
{
  "status": true,
  "data": {
    "viewCount": 1024,
    "viewCountToday": 38
  }
}
```

| Field | Mô tả |
|---|---|
| `viewCount` | Tổng view từ trước đến nay |
| `viewCountToday` | View trong ngày hôm nay (reset lúc 00:00 theo lần xem tiếp theo) |

---

### GET `/api/v1/views/batch` — Lấy view count nhiều phim

Dùng cho trang listing (homepage, thể loại, tìm kiếm) để lấy view count của nhiều phim trong 1 request.

```
GET /api/v1/views/batch?slugs=one-piece,vincenzo,naruto
```

**Response `200`:**
```json
{
  "status": true,
  "data": {
    "one-piece": 1024,
    "vincenzo": 5832,
    "naruto": 9201
  }
}
```

> Phim nào chưa có lượt xem sẽ không xuất hiện trong map — FE xử lý bằng `data[slug] ?? 0`.

**FE ví dụ:**
```javascript
const slugs = movies.map(m => m.slug).join(',')
const { data } = await axios.get(`/api/v1/views/batch?slugs=${slugs}`)
const viewCounts = data.data  // { [slug]: number }

movies.forEach(movie => {
  movie.viewCount = viewCounts[movie.slug] ?? 0
})
```

---

### GET `/api/v1/views/stats/today` — Tổng view toàn site hôm nay

```
GET /api/v1/views/stats/today
```

**Response `200`:**
```json
{ "status": true, "data": { "total": 4821 } }
```

---

### GET `/api/v1/views/top` — Top phim nhiều view nhất

```
GET /api/v1/views/top?limit=10
```

**Response `200`:**
```json
{
  "status": true,
  "data": [
    { "slug": "naruto", "viewCount": 9201, "viewCountToday": 120 },
    { "slug": "vincenzo", "viewCount": 5832, "viewCountToday": 88 }
  ]
}
```

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
| `watchProgress` (`wp:{userId}:{movieId}:{ep}`) | 2 giờ |

---

## Bảo mật

- Token xác thực & reset mật khẩu dùng UUID, **single-use**, xóa ngay sau khi dùng
- `forgot-password` luôn trả cùng message — chống dò email tồn tại
- Password hash BCrypt, JWT ký HS512
- CORS chỉ cho phép origin trong `cors.allowed-origins`
