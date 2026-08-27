# 📡 API Specifications (REST Contracts)

Dokumen ini mendefinisikan seluruh kontrak endpoint REST API, parameter, skema validasi Zod, dan format response.

**Base URL**: `http://localhost:5000/api`  
**Otentikasi**: JWT dikirim otomatis oleh browser melalui `httpOnly` secure cookies (`accessToken` & `refreshToken`).

---

## 1. 🔐 Modul Otentikasi (`/api/auth`)

### A. Register User Baru
* **Endpoint**: `POST /api/auth/register`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "Password123!"
  }
  ```
* **Validasi (Zod)**:
  * `username`: Min 3 karakter, regex `^[a-zA-Z0-9_]+$` (tidak boleh spasi / simbol aneh).
  * `email`: Valid email format.
  * `password`: Min 8 karakter, mengandung huruf & angka.
* **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Registrasi berhasil",
    "data": {
      "user": {
        "id": "uuid",
        "username": "johndoe",
        "email": "john@example.com",
        "fullName": "John Doe"
      }
    }
  }
  ```

### B. Login User
* **Endpoint**: `POST /api/auth/login`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "identifier": "johndoe atau john@example.com",
    "password": "Password123!",
    "rememberMe": true
  }
  ```
* **Validasi (Zod)**:
  * `identifier`: String non-kosong (bisa email atau username).
  * `password`: String non-kosong.
  * `rememberMe`: Boolean opsional (default: `false`).
* **Response (200 OK)**:
  * Header `Set-Cookie`: `accessToken=...; HttpOnly; SameSite=Lax; Path=/; Max-Age=900` (15 menit)
  * Header `Set-Cookie`: `refreshToken=...; HttpOnly; SameSite=Lax; Path=/api/auth` (Jika `rememberMe: true` -> `Max-Age=604800` / 7 hari, jika `false` -> Session Cookie yang hilang saat browser ditutup)
  ```json
  {
    "success": true,
    "message": "Login berhasil",
    "data": {
      "user": {
        "id": "uuid",
        "username": "johndoe",
        "email": "john@example.com",
        "fullName": "John Doe",
        "avatar": null
      }
    }
  }
  ```

### C. Refresh Session Token
* **Endpoint**: `POST /api/auth/refresh`
* **Access**: Public (Membaca HttpOnly Cookie `refreshToken`)
* **Response (200 OK)**: Menerbitkan `accessToken` baru (dan Refresh Token baru jika rotation aktif).

### D. Get Current User (`Me`)
* **Endpoint**: `GET /api/auth/me`
* **Access**: Private (Auth Cookie)
* **Response (200 OK)**: Data profil user yang sedang login.

### E. Logout
* **Endpoint**: `POST /api/auth/logout`
* **Access**: Private
* **Response (200 OK)**: Menghapus cookie `accessToken` dan `refreshToken`.

---

## 2. 📝 Modul Artikel & Postingan (`/api/posts`)

### A. Dapatkan Feed Artikel Publik (Explore / Landing Page)
* **Endpoint**: `GET /api/posts/public`
* **Access**: Public (`optionalAuthGuard` untuk personalisasi `for-you`)
* **Query Params**:
  * `tab`: `trending` (default - skor popularitas & waktu), `latest` (kronologis terbaru), `for-you` (personalisasi minat tag & kreator).
  * `tag`: Filter spesifik berdasarkan nama tag/topik (misal: `tech`, `design`).
  * `search`: Kata kunci pencarian pada judul, excerpt, atau author.
  * `page`: Nomor halaman (default: `1`).
  * `limit`: Jumlah artikel per halaman (default: `10`, maks: `50`).
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "title": "Membangun PERN Stack Modern",
        "slug": "membangun-pern-stack-modern",
        "excerpt": "Panduan lengkap...",
        "coverImage": "/uploads/img-1724581234-a1b2c3.webp",
        "readingTimeMinutes": 5,
        "viewCount": 142,
        "publishedAt": "2026-08-26T10:00:00.000Z",
        "author": {
          "id": "uuid",
          "fullName": "Fatih Safaat",
          "username": "fatih",
          "avatar": "/uploads/avatar.webp"
        },
        "tags": [{ "id": "uuid", "name": "Web Dev", "slug": "web-dev" }]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalPosts": 48,
      "totalPages": 5
    }
  }
  ```

### B. Dapatkan Artikel Milik Spesifik Author (`/@:username`)
* **Endpoint**: `GET /api/posts/public/author/:username`
* **Access**: Public
* **Query Params**: `page`, `limit`, `tag`, `search`
* **Response (200 OK)**: Profil publik author dan daftar artikel terbitannya.

### C. Dapatkan Detail Artikel Pembaca (`/@:username/:slug`)
* **Endpoint**: `GET /api/posts/public/author/:username/:slug`
* **Access**: Public
* **Response (200 OK)**: Detail artikel lengkap (HTML content tersanitasi, reading time, author card, tags).

### D. Dapatkan Daftar Post di Dashboard Creator
* **Endpoint**: `GET /api/posts/dashboard`
* **Access**: Private (`authGuard`)
* **Query Params**: `status` (`all` | `published` | `draft`), `search`, `page`, `limit`
* **Response (200 OK)**: Daftar artikel milik user yang sedang login beserta `viewCount` dan `published` status.

### E. Buat Draf Baru (Create Draft)
* **Endpoint**: `POST /api/posts/draft`
* **Access**: Private (`authGuard`)
* **Security & Anti-Spam**:
  * **Rate Limit**: Maksimal **10 pembuatan draf per 15 menit** per akun/IP.
  * **Validasi Zod**: `title` opsional saat draf (default: *"Draf Tanpa Judul"*).
* **Request Body**: `{ "title": "Draf Judul Baru" }`
* **Response (201 Created)**: Mengembalikan objek draf baru dengan `id` unik.

### F. Auto-Save Postingan (Debounced)
* **Endpoint**: `PUT /api/posts/:id/auto-save`
* **Access**: Private (`authGuard` + Owner Verification)
* **Security & Anti-Spam**:
  * **Validasi Zod Ketat**:
    * `title`: String min 3, maks 200 karakter.
    * `excerpt`: String maks 500 karakter.
    * `tags`: Array of string maks 5 tag, per tag maks 30 karakter.
  * **Sanitasi HTML**: Server otomatis membersihkan `contentHtml` dari skrip berbahaya via sanitasi HTML sebelum disimpan ke PostgreSQL.
* **Request Body**:
  ```json
  {
    "title": "Tips Belajar React Modern",
    "slug": "tips-belajar-react-modern",
    "contentHtml": "<p>Isi artikel tersanitasi...</p>",
    "contentJson": { "type": "doc", "content": [] },
    "excerpt": "Ringkasan artikel singkat...",
    "coverImage": "/uploads/img-1724581234-a1b2c3.webp",
    "tags": ["react", "frontend", "tips"]
  }
  ```
* **Response (200 OK)**: Status tersimpan, slug ter-update, dan kalkulasi `readingTimeMinutes`.

### G. Toggle Publish / Unpublish Post
* **Endpoint**: `PATCH /api/posts/:id/publish`
* **Access**: Private (`authGuard` + Owner Verification)
* **Request Body**: `{ "published": true }` atau `{ "published": false }`
* **Response (200 OK)**: Objek post dengan status `published` dan `publishedAt` terbaru.

### H. Hapus Postingan
* **Endpoint**: `DELETE /api/posts/:id`
* **Access**: Private (`authGuard` + Owner Verification)
* **Response (200 OK)**: `{ "success": true, "message": "Postingan berhasil dihapus" }`

---

## 3. 📊 Modul Smart Analytics (`/api/analytics`)

### A. Trigger Smart View Counter
* **Endpoint**: `POST /api/analytics/view/:postId`
* **Access**: Public
* **Headers**: Menerima cookie / IP pembaca secara otomatis.
* **Logika**: Backend mengecek log 60 menit terakhir. Jika unik, naikkan `viewCount` + 1.
* **Response (200 OK)**: `{ "success": true, "recorded": true }` (atau `recorded: false` jika dalam cooldown).

### B. Dapatkan Dashboard Analytics Creator
* **Endpoint**: `GET /api/analytics/dashboard`
* **Access**: Private (Author)
* **Query Params**: `timeframe` (`7d` | `30d` | `all`)
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "totalViews": 1420,
      "totalPublishedPosts": 8,
      "totalDraftPosts": 2,
      "viewsHistory": [
        { "date": "2026-08-20", "views": 150 },
        { "date": "2026-08-21", "views": 220 }
      ],
      "topPosts": [
        { "id": "uuid", "title": "Tips Belajar React", "slug": "tips-belajar-react", "viewCount": 650 }
      ]
    }
  }
  ```

---

## 4. 🖼️ Modul Media Upload (`/api/media`)

### A. Upload Gambar (Artikel / Avatar / Cover)
* **Endpoint**: `POST /api/media/upload`
* **Access**: Private (`authGuard`, Multipart Form Data: `file`)
* **Validasi**: Mime types (`image/jpeg`, `image/png`, `image/webp`, `image/gif`), batas ukuran maksimal 5MB.
* **Auto-Conversion & Optimization**:
  * Menggunakan library **`sharp`** untuk mengonversi gambar (JPG, PNG) menjadi format **WebP** secara otomatis.
  * Optimasi dimensi: *Max width* 1600px (menjaga rasio aspek), *quality* 80.
  * File GIF tetap dipertahankan formatnya jika mengandung animasi.
  * Hasil file disimpan di direktori `backend/uploads/` dengan penamaan unik `img-[timestamp]-[random].webp`.
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "url": "/uploads/img-1724581234-a1b2c3.webp",
      "filename": "img-1724581234-a1b2c3.webp"
    }
  }
  ```
