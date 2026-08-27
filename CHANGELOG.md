# 🪵 Project Changelog & Progress Tracker

Dokumen ini melacak riwayat perubahan, fitur yang telah diselesaikan, dan rencana kerja langkah berikutnya (*Next Steps*).

---

## 📌 [2026-08-25] - Inisialisasi Fondasi, Arsitektur & Dokumentasi

### ✅ Completed:
1. **Master Documentation Suite (`docs/`)**:
   - `docs/README.md`: Master index dan navigasi seluruh dokumentasi.
   - `docs/01-PRD.md`: Rincian fungsionalitas produk (Auth, Dashboard Ghost-style, Personal Blog Substack-style, Reader Overreacted-style, Smart 60m Analytics).
   - `docs/02-ARCHITECTURE_AND_STANDARDS.md`: Aturan Clean Code `< 300 LOC`, pola MVP di Frontend, dan Modular Backend.
   - `docs/03-DATABASE.md`: Skema Prisma ORM PostgreSQL lengkap, ERD, dan logika deduplikasi 60 menit.
   - `docs/04-API_SPECS.md`: Kontrak endpoint REST API, validasi Zod, dan Cookie Auth.
   - `docs/05-DESIGN_AND_UIUX.md`: Token warna CSS, tipografi, Glassmorphism, dan panduan layout.
   - `docs/06-SETUP_AND_RUN.md`: Panduan instalasi lokal, konfigurasi `.env`, dan migration.
   - `docs/07-TASK_BREAKDOWN.md`: Breakdown task granular per halaman & fitur (< 300 LOC & MVP pattern).
2. **AI Protocol & Engineering Rules (`AGENTS.md`)**:
   - Menetapkan protokol baca `docs/` & `CHANGELOG.md` di awal setiap sesi chat.
   - Menetapkan aturan ketat batasan baris kode `< 300 LOC` dan pola arsitektur MVP.
   - Mengintegrasikan **Graphify Protocol** (Query di awal sesi & Sync Update di akhir task).
3. **Design Skills Suite (`.agents/skills/`)**:
   - Berhasil menginstal koleksi **`taste-skill`** (Anti-slop frontend & typography design guidance) beserta companion skills (`minimalist-skill`, `brutalist-skill`, `soft-skill`, `redesign-skill`, `brandkit`, dll) untuk menjaga cita rasa UI/UX tetap premium.

---

## 📌 [2026-08-26] - Phase 0: Project Setup & Monorepo Foundation

### ✅ Completed:
1. **Root Monorepo Setup**:
   - `package.json` root dengan script `concurrently` untuk menjalankan Backend & Frontend sekaligus (`npm run dev`).
   - `.gitignore` komprehensif (mengabaikan `node_modules`, `.env`, `dist`, `backend/uploads/`, dsb).
2. **Backend Express + TypeScript Setup (`backend/`)**:
   - Konfigurasi `package.json` (`type: module`), `tsconfig.json` (Strict ES2022).
   - Inisialisasi Express server di `src/index.ts` dengan middleware Helmet, CORS credentials, Cookie-Parser, express.json, static uploads, dan endpoint `/api/health`.
   - Setup `PrismaClient` singleton di `src/config/prisma.ts`.
   - Setup global error handler & `AppError` class di `src/middlewares/error.middleware.ts`.
   - Setup `prisma/schema.prisma` dan berhasil generate Prisma Client.
   - Mengadopsi standar resmi **Prisma 7.10.0** dengan file konfigurasi `backend/prisma.config.ts` dan Driver Adapter native `@prisma/adapter-pg` + `pg`.
3. **Frontend Vite + React + TypeScript Setup (`frontend/`)**:
   - Konfigurasi `vite.config.ts`, `tsconfig.json`, `index.html` dengan font *Outfit* & *Inter*.
   - Setup CSS Design Tokens & Reset di `src/styles/variables.css`, `reset.css`, dan `index.css`.
   - Setup `apiClient` fetch wrapper dengan dukungan HttpOnly credentials.
   - Setup `TanStack QueryClientProvider` di `src/app/providers.tsx`.
   - Setup App Router starter di `src/app/router.tsx`.
4. **Verifikasi Build & Standar Kualitas**:
   - Build backend (`tsc`) & frontend (`vite build`) berhasil 100% dengan 0 error.
   - Audit ukuran file: 100% file `.ts`, `.tsx`, `.css` berukuran `< 130 baris` (jauh di bawah batas `< 300 LOC`).

---

## 📌 [2026-08-26] - Phase 1: Database Setup & Core Backend Infrastructure
 
### ✅ Completed:
1. **Task 1.1: Database Infrastructure via Docker Compose & Migration**:
   - Dibuat `docker-compose.yml` dengan image `postgres:16-alpine`.
   - Konfigurasi kredensial seragam (`POSTGRES_USER: avianblog`, `POSTGRES_PASSWORD: avianblog123`, `POSTGRES_DB: avianblog_db`, Container: `avianblog_postgres`).
   - Persistensi volume data `avianblog_pgdata`.
   - Penambahan skrip npm root: `npm run docker:up`, `npm run docker:down`, `npm run docker:logs`.
   - Memperbarui `DATABASE_URL` di `.env` dan `.env.example`.
   - Eksekusi migrasi database `20260826063908_first_migrate` pada `avianblog_db` di container.
   - Sukses generate Prisma 7 Client.
2. **Task 1.2: Global Express Server & Middlewares**:
   - `backend/src/index.ts`: Inisialisasi Express server dengan Helmet, CORS credentials, Cookie-Parser, express.json, static uploads `/uploads`, dan endpoint `/api/health`.
   - `backend/src/config/prisma.ts`: Singleton PrismaClient dengan adapter native PostgreSQL `pg`.
   - `backend/src/middlewares/error.middleware.ts`: Global error handling, format error Zod otomatis, `AppError` class, dan 404 handler.
3. **Task 1.3: Authentication Utilities & AuthGuard**:
   - `backend/src/utils/jwt.ts`: Helper `generateAccessToken` (15m), `generateRefreshToken` (7d/custom), `verifyAccessToken`, dan `verifyRefreshToken`.
   - `backend/src/types/express.d.ts`: Deklarasi tipe global untuk `req.user` (`AuthUser`).
   - `backend/src/middlewares/auth.middleware.ts`: Middleware `authGuard` (wajib login) dan `optionalAuthGuard` (opsional untuk analytics view tracking).
4. **Verifikasi Build**:
   - Kompilasi TypeScript `npm --prefix backend run build` lulus 100% dengan 0 error.
   - Semua file mematuhi aturan ketat `< 300 LOC` (rata-rata `< 70 LOC`).

---

## 📌 [2026-08-27] - Phase 2: Backend Feature Modules

### ✅ Completed:
1. **Task 2.1: Authentication Module (`/api/auth`)**:
   - `backend/src/modules/auth/auth.schema.ts`: Skema validasi Zod ketat untuk pendaftaran (`registerSchema`) dan masuk akun (`loginSchema` dengan *Remember Me*).
   - `backend/src/modules/auth/auth.service.ts`: Logika bisnis hashing `bcryptjs` (salt 10), verifikasi identitas, penerbitan token JWT ganda (Access 15m & Refresh 7d/30d), dan profile resolver.
   - `backend/src/modules/auth/auth.controller.ts`: Pengaturan cookie HttpOnly SameSite (`accessToken`, `refreshToken`), refresh token rotation, logout, dan status response.
   - `backend/src/modules/auth/auth.routes.ts`: Rute `/register`, `/login`, `/refresh-token`, `/logout`, dan `/me` (dilindungi `authGuard`).
   - `backend/src/index.ts`: Mendaftarkan router `authRoutes` pada `/api/auth`.
   - Verifikasi build `npm run build` lulus 100% dengan 0 error TypeScript. Seluruh file `< 200 LOC`.

2. **Task 2.2: Media Upload Module (`/api/media`)**:
   - `backend/src/middlewares/upload.middleware.ts`: Multer memory storage dengan validasi MIME types (`JPG`, `PNG`, `WEBP`, `GIF`) dan batas 5MB.
   - `backend/src/modules/media/media.service.ts`: Pengolahan citra via `sharp`, kompresi otomatis ke WebP teroptimasi (max width 1600px, quality 80), sanitasi penamaan file unik `img-[timestamp]-[hash].webp`.
   - `backend/src/modules/media/media.controller.ts`: Handler HTTP untuk validasi `req.file` dan pengembalian metadata URL gambar.
   - `backend/src/modules/media/media.routes.ts`: Rute `POST /api/media/upload` dilindungi `authGuard`.
   - `backend/src/config/openapi.ts` & `src/index.ts`: Mendaftarkan endpoint upload multipart di Swagger Studio `/docs/` dan routing Express.
   - Verifikasi build `npm run build` lulus 100% dengan 0 error TypeScript. Seluruh file `< 100 LOC`.

3. **Task 2.3: User & Profile Settings Module (`/api/users`)**:
   - `backend/src/modules/users/users.schema.ts`: Skema validasi Zod untuk update profil (`updateProfileSchema`) dan parameter username publik (`usernameParamSchema`).
   - `backend/src/modules/users/users.service.ts`: Query profil publik kreator (dengan relasi count artikel terbit), update profil & kustomisasi judul blog, dan kalkulasi ringkasan statistik akun (total posts, published, drafts, views).
   - `backend/src/modules/users/users.controller.ts`: Handler HTTP untuk `getPublicProfile`, `updateProfile`, dan `getMyStats`.
   - `backend/src/modules/users/users.routes.ts`: Rute `GET /public/:username`, `PATCH /profile` (`authGuard`), dan `GET /me/stats` (`authGuard`).
   - `backend/src/config/openapi.ts` & `src/index.ts`: Mendaftarkan endpoint Users di Swagger Studio `/docs/` dan routing Express.
   - Verifikasi build `npm run build` lulus 100% dengan 0 error TypeScript. Seluruh file `< 120 LOC`.

4. **Task 2.4: Posts Module (`/api/posts`)**:
   - `backend/src/modules/posts/posts.schema.ts`: Skema validasi Zod untuk pembuatan draf, auto-save update, toggle publish, dan query parameter feed explore (3 tab).
   - `backend/src/modules/posts/posts.helper.ts`: Utilitas sanitasi HTML anti-XSS (`sanitize-html`), kalkulasi otomatis waktu baca (`readingTimeMinutes`), ekstraksi ringkasan `excerpt`, dan generator slug unik per author (`@@unique([authorId, slug])`).
   - `backend/src/modules/posts/posts.service.ts`: Logika CRUD artikel, debounced auto-save, manajemen sinkronisasi tags (`PostTag`), toggle publikasi (`publishedAt`), penghapusan permanen, dan query daftar dashboard posts.
   - `backend/src/modules/posts/posts-feed.service.ts`: Algoritma feed explore 3 tab (Trending score decay, For You, Latest), daftar artikel per kreator (`/@:username`), dan artikel tunggal untuk halaman pembaca (`/@:username/:slug`).
   - `backend/src/modules/posts/posts.controller.ts`: Handler HTTP untuk 9 endpoint posts publik dan privat.
   - `backend/src/modules/posts/posts.routes.ts`: Rute Express dengan rate limiter anti-spam (maks 10 post / 15m) dan proteksi `authGuard`.
   - `backend/src/config/openapi.ts` & `src/index.ts`: Mendaftarkan seluruh katalog endpoint Posts di Swagger Studio `/docs/` dan routing Express.
   - Verifikasi build `npm run build` lulus 100% dengan 0 error TypeScript. Seluruh file `< 240 LOC` (mematuhi `< 300 LOC`).

5. **Task 2.5: Smart Analytics Module (`/api/analytics`)**:
   - `backend/src/modules/analytics/analytics.schema.ts`: Skema validasi Zod untuk parameter UUID `postId` dan query `range` (`7d` | `30d`).
   - `backend/src/modules/analytics/analytics.helper.ts`: Generator hash SHA-256 fingerprint pembaca anonim dan deret tanggal harian.
   - `backend/src/modules/analytics/analytics.service.ts`: Deduplikasi 60 menit view counter (mencegah manipulasi F5 refresh), atomic increment `post.viewCount`, dan agregasi statistik grafik tren harian serta Top 5 artikel untuk Recharts.
   - `backend/src/modules/analytics/analytics.controller.ts`: Handler HTTP untuk `recordView` dan `getDashboardAnalytics`.
   - `backend/src/modules/analytics/analytics.routes.ts`: Rute `POST /views/:postId` (`optionalAuthGuard`) dan `GET /dashboard` (`authGuard`).
   - `backend/src/config/openapi.ts` & `src/index.ts`: Mendaftarkan endpoint Analytics di Swagger Studio `/docs/` dan routing Express.
   - Verifikasi build `npm run build` lulus 100% dengan 0 error TypeScript. Seluruh file `< 140 LOC` (mematuhi `< 300 LOC`).

---

## 📌 [2026-08-27] - Phase 3: Frontend Foundation & Shared Design Tokens

### ✅ Completed:
1. **Task 3.1: CSS Design Tokens & Typography**:
   - `frontend/src/styles/variables.css`: Sistem token warna HSL lengkap untuk Light & Dark mode, efek Glassmorphism (`--bg-glass`, `--border-glass`, `--backdrop-blur`), bayangan elevasi, dan kurva transisi *spring*.
   - `frontend/src/styles/typography.css`: Skala ukuran font *fluid* (menggunakan `clamp()`), hirarki heading tegas (*Outfit*), body teks nyaman (*Inter*), dan styling membaca artikel (*Overreacted / Substack style* `.prose-reader`).
   - `frontend/src/styles/reset.css`: Reset modern anti-glitch, smooth scroll, antialiased smoothing, dan custom selection highlight.
   - `frontend/src/styles/animations.css`: Micro-animations (`fadeIn`, `slideUp`, `scaleIn`), hover lift cards, dan skeleton loading shimmer.
   - `frontend/src/styles/index.css`: Penggabungan seluruh modular design tokens dan utilitas layout global (`.container`, `.reader-container`, `.card-glass`, `.badge`).
   - Verifikasi build `npm run build` lulus 100% dengan 0 error. Seluruh berkas CSS `< 190 LOC` (mematuhi `< 300 LOC`).

2. **Task 3.2: API Client, TanStack Query & Auth State**:
   - `frontend/src/features/auth/types/auth.types.ts`: Definisi tipe data TypeScript untuk `User`, `AuthResponse`, dan `ApiResponse`.
   - `frontend/src/shared/api/apiClient.ts`: Axios instance terpusat dengan `withCredentials: true` dan *silent refresh token interceptor* (menangani auto-refresh saat token kedaluwarsa 401 dan mengulang request transparan).
   - `frontend/src/features/auth/stores/authStore.ts`: Zustand global state store (`useAuthStore`) untuk mengelola sesi `user`, `isAuthenticated`, `isLoading`, `checkAuth`, dan `logout`.
   - `frontend/src/app/providers.tsx`: TanStack `QueryClientProvider` dengan konfigurasi caching performa tinggi (5m staleTime).
   - `frontend/src/app/App.tsx`: Integrasi wrapper `Providers` dan auto initialization `checkAuth()` saat mount.
   - Verifikasi build `npm run build` lulus 100% dengan 0 error. Seluruh berkas `< 80 LOC` (mematuhi `< 300 LOC`).

3. **Task 3.3: Shared UI Atoms & Tailwind CSS v4 Engine**:
   - Terintegrasi penuh dengan **Tailwind CSS v4** (`@tailwindcss/vite` & `@tailwindcss/typography`) di `vite.config.ts` dan `src/styles/index.css`.
   - `frontend/src/shared/components/ui/Form/`: `Button.tsx`, `Input.tsx` (dengan support icons & clear button), `Textarea.tsx`, `Select.tsx` (custom chevron), `Checkbox.tsx` (custom toggle), `TagInput.tsx` (interactive chip tags), `ImageUpload.tsx` (dropzone cover & avatar uploader terintegrasi backend).
   - `frontend/src/shared/components/ui/Display/`: `Card.tsx` (glass surface & hover lift), `Badge.tsx` (status tag chips), `Avatar.tsx` (smart initials & gradient fallback), `Tabs.tsx` (segmented pill tabs), `Pagination.tsx` (page bar), `Divider.tsx` (section separator), `EmptyState.tsx` (zero-data CTA), `ShareButtons.tsx` (copy link & social sharing).
   - `frontend/src/shared/components/ui/Overlay/`: `Modal.tsx` (dialog backdrop blur & escape listener), `Drawer.tsx` (sliding right post settings panel), `Dropdown.tsx` (popover action menu), `Tooltip.tsx` (editor toolbar hover helper).
   - `frontend/src/shared/components/ui/Feedback/`: `Spinner.tsx` (rotating SVG wheel), `Skeleton.tsx` (shimmer loading placeholder), `Alert.tsx` (inline callout), `ReadingProgressBar.tsx` (top scroll reader progress).
   - `frontend/src/shared/components/ui/Theme/`: `ThemeToggle.tsx` (Dark/Light switcher dengan localStorage).
   - `frontend/src/shared/components/ui/Toast/`: `Toast.tsx`, `ToastContext.tsx`, `useToast.ts` (global notification toast system terintegrasi di `providers.tsx`).
   - `frontend/src/shared/components/ui/index.ts`: Barrel export satu pintu untuk seluruh 25 komponen UI.
   - Verifikasi build `npm run build` lulus 100% dengan 0 error. Seluruh 25 berkas komponen `< 110 LOC` (mematuhi batas `< 150 LOC` dan `< 300 LOC`).

4. **Task 3.4: Layout Shells (Pure Tailwind CSS v4)**:
   - `frontend/src/shared/components/layout/PublicNavbar.tsx`: Navbar publik global berbalut glassmorphism (Brand Logo, Explore link, ThemeToggle, dynamic guest/logged-in states dengan Avatar Dropdown).
   - `frontend/src/shared/components/layout/PublicFooter.tsx`: Footer minimalis dengan branding dan copyright.
   - `frontend/src/shared/components/layout/PublicLayout.tsx`: Container layout publik untuk seluruh halaman author dan pembaca.
   - `frontend/src/shared/components/layout/DashboardSidebar.tsx`: Ghost-style minimal sidebar (Logo studio, tombol cepat `+ Write New Post`, menu Artikel, Analitik, Pengaturan, mini user profile card).
   - `frontend/src/shared/components/layout/DashboardHeader.tsx`: Top bar studio dengan breadcrumb, link langsung ke blog publik Substack-style (`/@:username`), dan ThemeToggle.
   - `frontend/src/shared/components/layout/DashboardLayout.tsx`: Master layout studio responsif (fixed sidebar desktop, mobile drawer overlay).
   - `frontend/src/shared/components/layout/index.ts`: Barrel export layout.

5. **Task 3.5: App Router & Route Protection (React Router v6)**:
   - `frontend/src/app/ProtectedRoute.tsx`: Guard autentikasi untuk memproteksi `/dashboard/*` dan `/editor/*` (redirect ke `/login` dengan preserve URL state).
   - `frontend/src/app/PublicOnlyRoute.tsx`: Guard khusus tamu untuk mencegah user yang sudah login mengakses `/login` dan `/register` (redirect otomatis ke `/dashboard/posts`).
   - `frontend/src/app/router.tsx`: Konfigurasi rute bersarang lengkap untuk seluruh 9 rute aplikasi dengan visual feedback dan layout wrapper yang tepat.
   - Verifikasi build `npm run build` lulus 100% dengan 0 error. Seluruh berkas `< 130 LOC` (mematuhi batas `< 150 LOC` dan `< 300 LOC`).

6. **Phase 1–3 Codebase Audit & Hardening**:
   - `frontend/src/app/ProtectedRoute.tsx` & `PublicOnlyRoute.tsx`: Menambahkan guard `!isInitialized` untuk mencegah *false-negative redirect* saat user me-refresh halaman dashboard.
   - `backend/src/modules/posts/posts-feed.service.ts` & `posts.service.ts`: Mengganti tipe query `any` dengan `Prisma.PostWhereInput` untuk strict type-safety.
   - `backend/src/middlewares/auth.middleware.ts`: Memperbarui catch block menjadi `catch (error: unknown)` dengan type narrowing eksplisit.
   - `backend/src/modules/auth/auth.routes.ts`: Menambahkan `authLimiter` (15 req / 15 min) untuk proteksi brute-force login & register.
   - `backend/src/config/openapi/`: Memecah file `openapi.ts` (559 LOC) menjadi modul terpisah (`auth.docs.ts`, `posts.docs.ts`, `analytics.docs.ts`, `users.docs.ts`), menjadikan 100% file di monorepo `< 240 LOC`.
   - Verifikasi build `npm run build` monorepo lulus 100% dengan 0 error.

---

### 🎯 Next Steps:
- [ ] **Phase 4: Frontend Auth & User Profile Features**:
  - [ ] **Task 4.1 & 4.2**: Login Page (`/login`) dengan MVP Pattern (Model: `auth.api.ts`, Presenter: `useLoginPresenter.ts`, View: `LoginPage.tsx` & `LoginFormView.tsx`).
  - [ ] **Task 4.3**: Register Page (`/register`) dengan MVP Pattern (`useRegisterPresenter.ts`, `RegisterPage.tsx`, `RegisterFormView.tsx`).
  - [ ] **Task 4.4**: Profile & Blog Settings Page (`/dashboard/settings`).



