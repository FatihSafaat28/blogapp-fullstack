# 📄 Product Requirements Document (PRD)

## 1. 🌟 Visi Produk
Membangun platform blog multi-user modern, cepat, dan elegan berbasis **PERN Stack (PostgreSQL, Express, React, Node.js) + Prisma + TypeScript**. Platform ini memberikan ruang bagi setiap kreator/penulis untuk memiliki **blog pribadi profesional** dengan identitas unik (`/@:username`), didukung oleh **Creator Studio yang kaya fitur (Ghost-style)**, **Text Editor yang ramah pengguna (Tiptap Word-like)**, dan **Single Post Reader yang nyaman (Overreacted/Medium-style)**.

---

## 2. 👥 Persona Pengguna

1. **Penulis / Creator**:
   - Ingin menulis artikel dengan cepat dan mudah seperti di Microsoft Word/Google Docs tanpa harus memahami sintaks Markdown yang rumit.
   - Menginginkan landing page blog pribadi yang keren dan dapat dibagikan ke media sosial (`/@username`).
   - Ingin memantau statistik performa artikel (jumlah views yang akurat, pembaca aktif, artikel terpopuler).
2. **Pembaca (Reader)**:
   - Ingin membaca artikel tanpa distraksi (distraction-free typography).
   - Ingin menjelajahi artikel-artikel menarik dari berbagai topik dan kreator.
3. **Admin / Platform Owner**:
   - Membutuhkan sistem yang aman, modular, scalable, dan memiliki performa tinggi.

---

## 3. 🛣️ Spesifikasi Routing URL

Platform menggunakan format routing modern untuk mencegah bentrok dan memaksimalkan personal branding:

| Route Path | Tipe Halaman | Deskripsi |
| :--- | :--- | :--- |
| `/` | Public Global | Landing page platform, featured authors, trending posts, explore topics. |
| `/explore` | Public Global | Katalog artikel publik dengan filter tag/kategori dan pencarian. |
| `/login` & `/register` | Public Auth | Halaman masuk dan pendaftaran user baru. |
| `/dashboard` | Private Creator | Overview dashboard (statistik views, quick stats, post list). |
| `/dashboard/posts` | Private Creator | Manajemen daftar post (Tabs: All, Published, Drafts) & aksi edit/hapus. |
| `/dashboard/posts/new` | Private Creator | Editor studio untuk membuat artikel baru. |
| `/dashboard/posts/:id/edit` | Private Creator | Editor studio untuk mengubah artikel yang sudah ada. |
| `/dashboard/analytics` | Private Creator | Visualisasi grafik pembaca 7/30 hari, top posts, insight audiens. |
| `/dashboard/settings` | Private Creator | Pengaturan profil (Avatar, Bio, Social Links, Nama Blog). |
| `/@:username` | Public Creator | **Personal Blog Landing Page (Substack-style)**: Profil author & daftar post terbitan miliknya. |
| `/@:username/:postSlug` | Public Reader | **Single Post Reader (Overreacted-style)**: Halaman membaca artikel lengkap. |

---

## 4. 📦 Rincian Fitur Fungsional

### A. Modul Otentikasi & Profil (Auth & User)
* **Pendaftaran**: Registrasi dengan `fullName`, `email`, `username` unik (divalidasi alphanumeric & underscore), dan `password`.
* **Login & Logout**: Otentikasi berbasis JWT menggunakan **HttpOnly Secure Cookies** untuk Access Token & Refresh Token (bebas XSS).
* **Profil Kreator**: Kustomisasi avatar, bio singkat (1-2 baris), link media sosial (Twitter/X, GitHub, LinkedIn, Website), dan judul blog.

### B. Modul Dashboard & Creator Studio (Ghost CMS Style)
* **Post List Management**:
  * Filter tab: `Semua (All)`, `Terbit (Published)`, `Draf (Draft)`.
  * Filter pencarian judul dan filter berdasarkan Tag.
  * Status badge visual (`DRAFT` vs `PUBLISHED`).
  * Aksi cepat: Edit, Preview, Publish/Unpublish toggle, Hapus artikel.
* **Auto-Save & Status Indicator**:
  * Indikator real-time: *"Menyimpan..." (Saving...)* &rarr; *"Semua perubahan tersimpan" (Saved)*.
  * Debounce auto-save ke server setiap 1.5 - 2 detik saat mengetik.

### C. Modul Rich Text Editor (Tiptap Word-like Experience)
* **Floating / Sticky Toolbar**:
  * Heading 1 (`H1`), Heading 2 (`H2`), Heading 3 (`H3`).
  * Formatting: **Bold**, *Italic*, ~~Strikethrough~~, `Inline Code`, Blockquote, Divider / Horizontal Rule.
  * List: Bullet list (`•`), Numbered list (`1. 2. 3.`), Task list / Checkbox.
* **Image Handling & WebP Optimization**:
  * Tombol upload gambar pada toolbar + dukungan Paste (Ctrl+V) & Drag-and-Drop.
  * Server otomatis mengonversi gambar (JPG, PNG) menjadi format **WebP teroptimasi** (max-width 1600px, quality 80) via `sharp` untuk kecepatan muat artikel maksimal.
  * Penempatan gambar langsung di posisi kursor aktif.
* **Ghost-style Sliding Settings Drawer**:
  * Drawer samping yang bisa dibuka/tutup saat menulis:
    * Custom URL Slug (auto-generated dari judul tapi bisa diubah).
    * Cover / Thumbnail Image Upload.
    * Tag selector (pilih tag yang sudah ada atau buat tag baru).
    * Ringkasan Excerpt (auto-generate dari paragraf pertama atau input manual).
    * Tombol Publish / Revert to Draft.

### D. Modul Personal Blog (Substack Style `/@:username`)
* **Hero Author Profile**:
  * Menampilkan Avatar, Nama Lengkap, `@username`, Bio, dan Link Sosial Media.
  * Statistik publik: Total artikel terbit, bergabung sejak kapan.
* **Article Feed**:
  * Kartu artikel elegan dengan: Thumbnail, Judul, Excerpt (maks 2-3 baris), Tanggal Terbit, Estimasi Waktu Baca (*X min read*), dan Tags.

### E. Modul Single Article Reader (Overreacted / Medium Style `/@:username/:postSlug`)
* **Distraction-Free Reading Container**:
  * Lebar teks optimal membaca (~720px), tipografi bersih (Inter / Outfit).
  * Header artikel: Judul besar, Author info card kecil, Tanggal rilis, Waktu baca.
  * Cover image hero dengan rasio aspek seimbang.
  * Konten artikel dengan styling tipografi HTML yang rapi (headings, blockquote bergaris samping, code block dengan kontras, gambar responsif).
  * Bagian footer: Author biography card dan tombol share artikel (Copy Link, Twitter, WhatsApp).

### F. Modul Landing Page & Explore Discovery Hub (`/` & `/explore`)
* **Landing Page (`/`)**:
  * Hero Section: Tagline platform, sub-heading inspiratif, dan CTA *"Mulai Menulis Gratis"* / *"Telusuri Cerita"*.
  * Featured Bento Grid: Sorotan artikel utama (*Featured*) & trending minggu ini.
  * Recent Stories Feed: Grid responsif kartu artikel terbaru dari berbagai kreator.
* **Explore Discovery Hub (`/explore`)**:
  * Layout 2 Kolom: Feed Artikel Utama (70%) + Discovery Sidebar (30%).
  * Pencarian Real-Time (judul, excerpt, author) + Multi-tag selector pills.
  * **3 Tab Feed Cerdas**:
    1. **🔥 Tab Trending**: Berdasarkan skor lonjakan pembaca & faktor peluruhan waktu ($Score = \frac{Views}{(Hours + 2)^{1.5}}$).
    2. **🎯 Tab Untuk Anda (For You)**: Personalisasi berbasis riwayat minat tag (*tag affinity*) dan kreator yang sering dikunjungi (*creator affinity*).
    3. **⚡ Tab Terbaru (Latest)**: Terurut murni dari detik terakhir dipublikasikan (`publishedAt desc`).
  * Discovery Sidebar: Rekomendasi penulis teraktif (*Top Writers*) dengan link `/@:username`, trending topics cloud, dan filter durasi baca (*Quick Reads* < 4 min vs *Deep Dives* > 8 min).

### G. Modul Keamanan Postingan & Anti-Spam (Post Security)
* **Rate Limiting Pembuatan Post**:
  * Menggunakan `express-rate-limit`: Maksimal **10 pembuatan post baru per 15 menit** per akun/IP (mencegah bot spamming).
* **Validasi Zod Ketat**:
  * Panjang judul (3 - 200 karakter), batas excerpt (maks 500 karakter), validasi array tag.
* **Debounced Auto-Save**:
  * Editor Tiptap melakukan auto-save dengan debounce 1.5 - 2 detik ke `PUT /api/posts/:id` (mengupdate draft yang sama, bukan membuat duplikat).
* **Sanitasi Konten HTML**:
  * Sanitasi menyeluruh konten HTML artikel menggunakan `DOMPurify` / `sanitize-html` untuk membersihkan tag berbahaya (`<script>`, `onerror=`, `iframe` ilegal) demi mencegah celah XSS.

### H. Modul Smart View Analytics (1 View / 60 Menit)
* **Mekanisme Pencatatan**:
  * Saat artikel dibuka di `/@:username/:postSlug`, frontend memicu pencatatan view.
  * Backend membuat hash dari `(Reader Cookie / Session ID + IP Address + User-Agent)`.
  * Sistem memeriksa apakah `postId` + `readerHash` tersebut sudah pernah tercatat dalam **60 menit terakhir**.
  * Jika belum: Simpan log ke tabel `PostViewLog` dan tambahkan counter `post.viewCount + 1`.
  * Jika sudah: Lewati pencatatan (mencegah manipulasi F5 refresh).
* **Visualisasi di Dashboard**:
  * Total akumulasi views semua artikel.
  * Grafik performa harian (7 hari / 30 hari terakhir) menggunakan Recharts.
  * Daftar Top 5 Artikel dengan pembaca terbanyak.

---

## 5. 🛡️ Kebutuhan Non-Fungsional (NFR)

* **Performance**: Waktu load halaman awal `< 1.5s`, respons API endpoint `< 200ms`.
* **Security**:
  * Password di-hash menggunakan `bcryptjs` (salt rounds 10).
  * Perlindungan XSS dengan pembersihan input dan sanitasi HTML.
  * Proteksi CSRF & Cookie HttpOnly `SameSite: Lax` / `Strict`.
  * Rate limiting pada endpoint sensitif (Auth, Image Upload, dan Post Creation).
* **Maintainability & Clean Code**:
  * File size limit ketat: **Maksimal 300 lines of code (LOC)** per file.
  * Strict separation: Model, View, Presenter (FE) dan Controller, Service, Route (BE).
* **Responsive Design**: Tampilan mobile-first, tablet, dan desktop yang mulus.

---

## 6. 🚀 Roadmap Masa Depan (Future Enhancements - Post MVP)

Fitur-fitur berikut direncanakan untuk tahap pengembangan berikutnya setelah sistem publikasi inti dan deployment VPS berjalan stabil:

1. **❤️ Sistem Apresiasi (Clap / Like)**:
   * Fitur tepuk tangan (*claps*) ala Medium (pembaca bisa memberikan 1-50 tepukan per artikel).
2. **💬 Sistem Komentar & Diskusi (Threaded Comments)**:
   * Kolom komentar di bawah artikel dengan balasan bertingkat (*nested replies*) dan moderasi oleh author.
3. **🔔 Fitur Follow & Email Subscribe**:
   * Pembaca dapat mengikuti kreator favorit (*Follow Author*) dan menerima notifikasi artikel baru.
4. **🔖 Bookmarks & Reading List**:
   * Menyimpan artikel favorit ke daftar bacaan pribadi (*Save for later*).
