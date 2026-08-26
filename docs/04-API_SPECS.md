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
* **Access**: Public
* **Query Params**: `page` (default 1), `limit` (default 10), `tag`, `search`
* **Response (200 OK)**: Array postingan berstatus `published: true` beserta author info.

### B. Dapatkan Artikel Milik Spesifik Author (`/@:username`)
* **Endpoint**: `GET /api/posts/public/author/:username`
* **Access**: Public
* **Response (200 OK)**: Profil author dan daftar artikel terbitannya.

### C. Dapatkan Detail Artikel Pembaca (`/@:username/:slug`)
* **Endpoint**: `GET /api/posts/public/author/:username/:slug`
* **Access**: Public
* **Response (200 OK)**: Detail artikel lengkap (HTML content, reading time, author card, tags).

### D. Dapatkan Daftar Post di Dashboard Creator
* **Endpoint**: `GET /api/posts/dashboard`
* **Access**: Private (Author)
* **Query Params**: `status` (`all` | `published` | `draft`), `search`
* **Response (200 OK)**: Daftar artikel milik user yang sedang login beserta `viewCount` dan `published` status.

### E. Buat Draf Baru (Create Draft)
* **Endpoint**: `POST /api/posts/draft`
* **Access**: Private (Author)
* **Request Body**:
  ```json
  {
    "title": "Draft Tanpa Judul"
  }
  ```
* **Response (201 Created)**: Mengembalikan `id` dan objek draft baru untuk diarahkan ke editor studio.

### F. Auto-Save Postingan (Debounced)
* **Endpoint**: `PUT /api/posts/:id/auto-save`
* **Access**: Private (Owner Post)
* **Request Body**:
  ```json
  {
    "title": "Tips Belajar React Modern",
    "slug": "tips-belajar-react-modern",
    "contentHtml": "<p>Isi artikel...</p>",
    "contentJson": { "type": "doc", "content": [...] },
    "excerpt": "Ringkasan artikel singkat...",
    "coverImage": "/uploads/image.webp",
    "tags": ["react", "frontend", "tips"]
  }
  ```
* **Response (200 OK)**: Status tersimpan, slug ter-update, dan kalkulasi `readingTimeMinutes`.

### G. Toggle Publish / Unpublish Post
* **Endpoint**: `PATCH /api/posts/:id/publish`
* **Access**: Private (Owner Post)
* **Request Body**: `{ "published": true }` atau `{ "published": false }`
* **Response (200 OK)**: Objek post dengan status terbaru.

### H. Hapus Postingan
* **Endpoint**: `DELETE /api/posts/:id`
* **Access**: Private (Owner Post)
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
* **Access**: Private (Multipart Form Data: `file`)
* **Validasi**: Mime types (`image/jpeg`, `image/png`, `image/webp`, `image/gif`), maks 5MB.
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "url": "/uploads/img-1724581234.webp",
      "filename": "img-1724581234.webp"
    }
  }
  ```
