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
1. **Task 3.1: CSS Design Tokens & Typography (Single index.css Consolidation)**:
   - `frontend/src/styles/index.css`: Penyatuan penuh seluruh design system token (Light/Dark mode HSL, Glassmorphism, fluid typography, reader prose `.prose-reader`, dan micro-animations) ke dalam satu file tunggal (~190 LOC).
   - **Bugfix Stylesheet Conflict**: Menghapus file `reset.css` yang sebelumnya menabrak utility button Tailwind CSS v4, serta menghapus file modular terpisah (`variables.css`, `typography.css`, `animations.css`) demi zero-conflict arsitektur.
   - Upgrade halaman landing `HomePage` dengan ambient glow aura, proporsi hero fluid yang elegan, dan 3 kartu Bento Grid pilar fitur.
   - Verifikasi build `npm run build` lulus 100% dengan 0 error. Seluruh berkas CSS `< 200 LOC` (mematuhi `< 300 LOC`).

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

---

## 📌 [2026-08-28] - Phase 4: Frontend Auth Pages (Editorial Design & Friendly UX)

### ✅ Completed:
1. **Task 4.1 & 4.2: Login Page (`/login`) & Architecture MVP**:
   - `frontend/src/features/auth/types/auth.types.ts`: Model data contracts (`User`, `AuthResponse`, `ApiResponse`).
   - `frontend/src/features/auth/schemas/authValidation.ts`: Skema validasi Zod interaktif dengan pesan bahasa Indonesia ramah pengguna.
   - `frontend/src/features/auth/api/authApi.ts`: Endpoint wrapper Axios (`/auth/login`, `/auth/register`, `/auth/me`, `/auth/logout`).
   - `frontend/src/features/auth/presenters/useLoginPresenter.ts`: Presenter hook yang mengelola state form, error handling, notifikasi toast, dan redirect otomatis.
   - `frontend/src/features/auth/components/AuthBrandSide.tsx`: Komponen visual kiri editorial menampilkan filosofi ruang baca dan kartu kreator.
   - `frontend/src/features/auth/components/LoginFormView.tsx`: Form login modern dengan UX copy bersahabat (*"Senang melihatmu kembali"*, Remember Me 7 hari, show/hide password).
   - `frontend/src/features/auth/pages/LoginPage.tsx`: Master coordinator view.
   - Seluruh file `< 120 LOC` (mematuhi batasan ketat `< 300 LOC`).

2. **Task 4.3: Register Page (`/register`)**:
   - `frontend/src/features/auth/presenters/useRegisterPresenter.ts`: Presenter hook registrasi dengan real-time username slug generator.
   - `frontend/src/features/auth/components/RegisterFormView.tsx`: Form registrasi dengan live URL preview (`avianblog.com/@username`), tip keamanan sandi, dan validasi karakter.
   - `frontend/src/features/auth/pages/RegisterPage.tsx`: Master coordinator view.
   - `frontend/src/app/router.tsx`: Terkoneksi penuh ke rute publik terlindungi (`PublicOnlyRoute`).
   - Verifikasi build `npm run build` berhasil 100% dengan 0 error.

4. **Auth Pages Polish & Contextual UX Writing Refinement**:
   - `frontend/src/features/auth/components/LoginFormView.tsx` & `RegisterFormView.tsx`: Menambahkan **Fast Segmented Switcher Tab Pill** di header atas kartu form untuk navigasi instan antara Masuk dan Daftar tanpa harus scroll.
   - `frontend/src/features/auth/components/AuthBrandSide.tsx`: Mengganti slogan kaku menjadi label editorial puitis (`✦ Ruang Gagasan` di Login dan `✦ Lembaran Pertama` di Register) dengan diferensiasi quote dan subtext yang kontekstual.
   - Mengganti icon lambaian menjadi **`<PenNib />`** (Login) dan **`<Notebook />`** (Register).
   - Menghapus klaim klise *"30 detik"* dan menggantinya dengan kalimat ajakan yang tenang dan ramah: *"Dapatkan alamat blog pribadimu dan mulailah menerbitkan tulisan pertamamu hari ini."*
   - **Interactive Real-Time Password Checklist**: Menambahkan 3 indikator chips interaktif (`Min. 8 karakter`, `Ada huruf`, `Ada angka`) yang otomatis berubah hijau dan tercentang saat user mengetik password di Register page.
   - Verifikasi build `npm run build` lulus 100% dengan 0 error.

---

## 📌 [2026-08-28] - Phase 4.5: Design System Centralization & Component-First Integration (Zero-cssConflict)

### ✅ Completed:
1. **Design System Single Source of Truth (`frontend/src/styles/index.css`)**:
   - Seluruh controller tema tersentralisasi di `:root` (Warm Alabaster Light) dan `.dark, [data-theme='dark']` (Warm Obsidian Dark) tanpa perlu modifier manual `dark:bg-...` di setiap elemen JSX.
   - Mendaftarkan token semantik Tailwind CSS v4 `@theme` (`--color-canvas`, `--color-card`, `--color-muted`, `--color-glass`, `--color-ink`, `--color-line`, `--color-brand`, dll.) yang bebas dari tabrakan properti CSS (*zero cssConflict*).
   - Menambahkan aturan basis global untuk kursor `<button>` (`cursor: pointer`, disabled: `cursor: not-allowed`), warna teks input/textarea/select (`color: var(--text-ink)`), dan placeholder (`color: var(--text-ink-muted)`).

2. **Audit & Migrasi Menyeluruh 44 File TSX Frontend**:
   - Seluruh layout (`DashboardSidebar`, `DashboardHeader`, `DashboardLayout`, `PublicNavbar`, `PublicFooter`, `PublicLayout`), komponen Display, Feedback, Overlay, Form, Router, dan Auth pages berhasil dimigrasikan ke token semantik baru.
   - Menghilangkan 100% kelas warna hardcoded lawas (`slate-*`, `indigo-*`, `zinc-*`, `emerald-*`).

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
1. **Task 3.1: CSS Design Tokens & Typography (Single index.css Consolidation)**:
   - `frontend/src/styles/index.css`: Penyatuan penuh seluruh design system token (Light/Dark mode HSL, Glassmorphism, fluid typography, reader prose `.prose-reader`, dan micro-animations) ke dalam satu file tunggal (~190 LOC).
   - **Bugfix Stylesheet Conflict**: Menghapus file `reset.css` yang sebelumnya menabrak utility button Tailwind CSS v4, serta menghapus file modular terpisah (`variables.css`, `typography.css`, `animations.css`) demi zero-conflict arsitektur.
   - Upgrade halaman landing `HomePage` dengan ambient glow aura, proporsi hero fluid yang elegan, dan 3 kartu Bento Grid pilar fitur.
   - Verifikasi build `npm run build` lulus 100% dengan 0 error. Seluruh berkas CSS `< 200 LOC` (mematuhi `< 300 LOC`).

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

---

## 📌 [2026-08-28] - Phase 4: Frontend Auth Pages (Editorial Design & Friendly UX)

### ✅ Completed:
1. **Task 4.1 & 4.2: Login Page (`/login`) & Architecture MVP**:
   - `frontend/src/features/auth/types/auth.types.ts`: Model data contracts (`User`, `AuthResponse`, `ApiResponse`).
   - `frontend/src/features/auth/schemas/authValidation.ts`: Skema validasi Zod interaktif dengan pesan bahasa Indonesia ramah pengguna.
   - `frontend/src/features/auth/api/authApi.ts`: Endpoint wrapper Axios (`/auth/login`, `/auth/register`, `/auth/me`, `/auth/logout`).
   - `frontend/src/features/auth/presenters/useLoginPresenter.ts`: Presenter hook yang mengelola state form, error handling, notifikasi toast, dan redirect otomatis.
   - `frontend/src/features/auth/components/AuthBrandSide.tsx`: Komponen visual kiri editorial menampilkan filosofi ruang baca dan kartu kreator.
   - `frontend/src/features/auth/components/LoginFormView.tsx`: Form login modern dengan UX copy bersahabat (*"Senang melihatmu kembali"*, Remember Me 7 hari, show/hide password).
   - `frontend/src/features/auth/pages/LoginPage.tsx`: Master coordinator view.
   - Seluruh file `< 120 LOC` (mematuhi batasan ketat `< 300 LOC`).

2. **Task 4.3: Register Page (`/register`)**:
   - `frontend/src/features/auth/presenters/useRegisterPresenter.ts`: Presenter hook registrasi dengan real-time username slug generator.
   - `frontend/src/features/auth/components/RegisterFormView.tsx`: Form registrasi dengan live URL preview (`avianblog.com/@username`), tip keamanan sandi, dan validasi karakter.
   - `frontend/src/features/auth/pages/RegisterPage.tsx`: Master coordinator view.
   - `frontend/src/app/router.tsx`: Terkoneksi penuh ke rute publik terlindungi (`PublicOnlyRoute`).
   - Verifikasi build `npm run build` berhasil 100% dengan 0 error.

4. **Auth Pages Polish & Contextual UX Writing Refinement**:
   - `frontend/src/features/auth/components/LoginFormView.tsx` & `RegisterFormView.tsx`: Menambahkan **Fast Segmented Switcher Tab Pill** di header atas kartu form untuk navigasi instan antara Masuk dan Daftar tanpa harus scroll.
   - `frontend/src/features/auth/components/AuthBrandSide.tsx`: Mengganti slogan kaku menjadi label editorial puitis (`✦ Ruang Gagasan` di Login dan `✦ Lembaran Pertama` di Register) dengan diferensiasi quote dan subtext yang kontekstual.
   - Mengganti icon lambaian menjadi **`<PenNib />`** (Login) dan **`<Notebook />`** (Register).
   - Menghapus klaim klise *"30 detik"* dan menggantinya dengan kalimat ajakan yang tenang dan ramah: *"Dapatkan alamat blog pribadimu dan mulailah menerbitkan tulisan pertamamu hari ini."*
   - **Interactive Real-Time Password Checklist**: Menambahkan 3 indikator chips interaktif (`Min. 8 karakter`, `Ada huruf`, `Ada angka`) yang otomatis berubah hijau dan tercentang saat user mengetik password di Register page.
   - Verifikasi build `npm run build` lulus 100% dengan 0 error.

---

## 📌 [2026-08-28] - Phase 4.5: Design System Centralization & Component-First Integration (Zero-cssConflict)

### ✅ Completed:
1. **Design System Single Source of Truth (`frontend/src/styles/index.css`)**:
   - Seluruh controller tema tersentralisasi di `:root` (Warm Alabaster Light) dan `.dark, [data-theme='dark']` (Warm Obsidian Dark) tanpa perlu modifier manual `dark:bg-...` di setiap elemen JSX.
   - Mendaftarkan token semantik Tailwind CSS v4 `@theme` (`--color-canvas`, `--color-card`, `--color-muted`, `--color-glass`, `--color-ink`, `--color-line`, `--color-brand`, dll.) yang bebas dari tabrakan properti CSS (*zero cssConflict*).
   - Menambahkan aturan basis global untuk kursor `<button>` (`cursor: pointer`, disabled: `cursor: not-allowed`), warna teks input/textarea/select (`color: var(--text-ink)`), dan placeholder (`color: var(--text-ink-muted)`).

2. **Audit & Migrasi Menyeluruh 44 File TSX Frontend**:
   - Seluruh layout (`DashboardSidebar`, `DashboardHeader`, `DashboardLayout`, `PublicNavbar`, `PublicFooter`, `PublicLayout`), komponen Display, Feedback, Overlay, Form, Router, dan Auth pages berhasil dimigrasikan ke token semantik baru.
   - Menghilangkan 100% kelas warna hardcoded lawas (`slate-*`, `indigo-*`, `zinc-*`, `emerald-*`).

3. **Refactoring Form Autentikasi ke Reusable UI Components**:
   - `LoginFormView.tsx`: Menggunakan `<Button>`, `<Input>`, `<Checkbox>`, `<Alert>`.
   - `RegisterFormView.tsx`: Menggunakan `<Button>`, `<Input>`, `<Alert>` dengan custom prefix field `avianblog.com/@` yang presisi.
   - `AuthBrandSide.tsx` & `router.tsx`: Menggunakan `<Avatar>` dan `<Badge>`.

4. **Pembaruan Protokol & Dokumentasi (`docs/05`, `docs/02`, `AGENTS.md`)**:
   - Menetapkan **Component-First Protocol**: Mewajibkan developer/agent untuk memeriksa katalog 25 komponen UI di `src/shared/components/ui/` sebelum membuat halaman/form baru untuk mencegah duplikasi markup HTML mentah.
   - Mendokumentasikan katalog lengkap 25 komponen UI di `docs/05-DESIGN_AND_UIUX.md`.

---

## 📌 [2026-08-28] - Phase 4: Task 4.4 Settings Page & 100% Phosphor Icons Migration

### ✅ Completed:
1. **Task 4.4: Profile & Blog Settings Page (`/dashboard/settings`)**:
   - `frontend/src/features/settings/types/settings.types.ts`: Data contract & DTOs untuk update profile dan upload avatar.
   - `frontend/src/features/settings/schemas/settingsValidation.ts`: Validasi Zod form setting (Nama, Bio, Avatar URL, Judul Blog, Twitter, GitHub, LinkedIn).
   - `frontend/src/features/settings/api/settingsApi.ts`: Model API client (`PATCH /api/users/profile`, `POST /api/media/upload`).
   - `frontend/src/features/settings/presenters/useSettingsPresenter.ts`: Presenter hook yang mengintegrasikan React Hook Form, Zustand `useAuthStore`, upload avatar teroptimasi WebP, dan toast feedback `useToast()`.
   - `frontend/src/features/settings/components/ProfileFormView.tsx`: Tab Profil Pribadi dengan avatar editor, input data terproteksi (email & username), textarea bio dengan counter karakter (0/500), dan status dirty tracking.
   - `frontend/src/features/settings/components/BlogIdentityView.tsx`: Tab Identitas Blog dengan input judul blog dan **Live Substack-Style Preview Card** yang menampilkan pratinjau instan tampilan hero publik `/@username`.
   - `frontend/src/features/settings/components/SocialLinksView.tsx`: Tab Tautan Sosial dengan input Twitter/X, GitHub, LinkedIn.
   - `frontend/src/features/settings/pages/SettingsPage.tsx`: Master coordinator view dengan navigasi pill `<Tabs>` dan container `<Card>`.
   - `frontend/src/app/router.tsx`: Terhubung langsung ke rute terlindungi `/dashboard/settings`.

2. **100% Phosphor Icons Migration (Zero Lucide-React)**:
   - Mengaudit seluruh repositori Frontend dan mengganti 100% impor `lucide-react` pada 10 komponen layout & UI (`DashboardHeader`, `DashboardSidebar`, `EmptyState`, `Pagination`, `ShareButtons`, `Alert`, `ImageUpload`, `Drawer`, `Modal`, `Toast`) ke `@phosphor-icons/react`.
   - Memastikan tidak ada lagi percampuran icon pack (*icon consistency enforcement*).

3. **Hardening, Edge-Case Resilience & Web Accessibility (a11y)**:
   - Menambahkan proxy `/uploads` pada `frontend/vite.config.ts` untuk melayani file media yang diunggah backend pada port 5000 saat development lokal.
   - Menambahkan mekanisme fallback otomatis pada `<Avatar>` jika URL gambar mengalami kegagalan muat (onError fallback ke avatar inisial warna-warni).
   - **Full a11y & Form Best Practices**: Mengintegrasikan `React.useId()` untuk label association (`htmlFor` $\leftrightarrow$ `id`/`name`) di seluruh form controls (`Input`, `Textarea`, `Select`, `TagInput`, `ImageUpload`), menyematkan `aria-label` pada icon-only buttons, dan menambahkan WAI-ARIA semantics (`role="dialog"`, `role="tablist"`, `role="status"`).
   - **Deferred Avatar Upload Architecture & Anti-Duplicate Storage**:
     - *Frontend*: Mengadopsi `URL.createObjectURL(file)` untuk instant preview lokal tanpa mengirim file ke server sebelum tombol "Simpan Profil" ditekan (mencegah *orphan files* saat user refresh/batal).
     - *Backend*: Mengadopsi **Content Hashing SHA-256** (`img-${sha256}.webp`) pada `media.service.ts` untuk mencegah duplikasi storage pada gambar identik.
     - *Backend Auto-Cleanup*: Menambahkan `mediaService.deleteFileIfExists` pada `users.service.ts` untuk otomatis menghapus file foto avatar lama dari disk saat user mengganti atau menghapus fotonya.
   - Menyelaraskan aturan a11y ke dalam `AGENTS.md` (Section 2.H), `docs/02-ARCHITECTURE_AND_STANDARDS.md`, dan `docs/05-DESIGN_AND_UIUX.md`.
   - Build backend (`tsc`) & frontend (`vite build`) berhasil 100% dengan 0 error. Seluruh berkas berukuran `< 160 LOC`.

---

### 🎯 Next Steps:
- [x] **Phase 5: Frontend Dashboard & Editor Studio (Ghost Style)**:
  - [x] **Task 5.1**: Dashboard Posts Management Page (`/dashboard/posts`) dengan tab All, Published, Drafts, search bar debounced, pagination, dan modal konfirmasi hapus artikel.
  - [x] **Task 5.2**: Ghost-Style Fullscreen Editor Studio (`/editor/new` & `/editor/:id`) dengan Tiptap engine, auto-save debounce 2 detik, status pill, headline auto-resize, shortcut Ctrl+S, dan clipboard image paste.
  - [x] **Task 5.3**: Ghost-Style Sliding Settings Drawer (`PostSettingsDrawer`) dengan thumbnail WebP upload, live custom slug preview, tag topic chip selector, dan manual excerpt description.

---

## 📌 [2026-09-01] - Phase 5: Frontend Dashboard & Ghost Editor Studio (100% Complete)

### ✅ Completed:
1. **Task 5.1: Dashboard Posts Management Page (`/dashboard/posts`)**:
   - `frontend/src/features/dashboard/posts/types/post.types.ts`: Kontrak data TypeScript (`PostListItem`, `PostTagItem`, `DashboardPostsResponse`, `DashboardQueryParams`).
   - `frontend/src/features/dashboard/posts/api/postsApi.ts`: Model API client Axios (`GET /api/posts/dashboard`, `PATCH /api/posts/:id/publish`, `DELETE /api/posts/:id`, `POST /api/posts/draft`).
   - `frontend/src/features/dashboard/posts/api/postsQueries.ts`: TanStack Query hooks (`useDashboardPostsQuery`, `useTogglePublishMutation`, `useDeletePostMutation`, `useCreateDraftMutation`).
   - `frontend/src/features/dashboard/posts/hooks/usePostListPresenter.ts`: Presenter hook yang mengelola state filter tab (`all`, `published`, `draft`), search bar debounced 300ms, pagination, modal hapus, dan copy link publik.
   - `frontend/src/features/dashboard/posts/components/PostListHeader.tsx`: Header visual dengan counter jumlah artikel dan tombol CTA `+ Tulis Cerita Baru`.
   - `frontend/src/features/dashboard/posts/components/PostFilterBar.tsx`: Navigasi tab segmented pill (`<Tabs>`) dan search bar (`<Input>`) dengan clear button.
   - `frontend/src/features/dashboard/posts/components/PostItemCard.tsx`: Kartu artikel dengan preview cover thumbnail, status badge (`<Badge>`), excerpt ringkas, metrik baca (`<Clock />`, `<Eye />`), dan popover quick action `<Dropdown>` (*Edit*, *Lihat Publik*, *Ubah Status*, *Salin Tautan*, *Hapus*).
   - `frontend/src/features/dashboard/posts/components/DeletePostModal.tsx`: Dialog konfirmasi hapus permanen menggunakan atom `<Modal>`.
   - `frontend/src/features/dashboard/posts/pages/PostListPage.tsx`: Master coordinator view berbalut skeleton loading shimmer dan empty state ramah pengguna.
   - Seluruh berkas berukuran `< 130 LOC` (mematuhi batas `< 300 LOC`).

2. **Task 5.2: Ghost-Style Fullscreen Editor Studio & Advanced Tiptap Engine (`/editor/new` & `/editor/:id`)**:
   - `frontend/package.json`: Integrasi rangkaian pustaka resmi Tiptap (12 packages):
     - Core: `@tiptap/react` (^2.11.5), `@tiptap/pm` (^2.11.5), `@tiptap/starter-kit` (^2.11.5).
     - Formatting & Marks: `@tiptap/extension-underline`, `@tiptap/extension-highlight`, `@tiptap/extension-text-align`.
     - Lists: `@tiptap/extension-task-list`, `@tiptap/extension-task-item`.
     - Media & Link: `@tiptap/extension-image`, `@tiptap/extension-link`.
     - UX & Drag Utilities: `@tiptap/extension-drag-handle-react`, `@tiptap/extension-placeholder`.
   - `frontend/src/features/editor/types/editor.types.ts`: Kontrak data DTO editor (`PostDetail`, `AutoSavePayload`, `AutoSaveStatus`).
   - `frontend/src/features/editor/api/editorApi.ts` & `editorQueries.ts`: Integrasi TanStack Query & Axios endpoint editor (`GET /api/posts/dashboard/:id`, `PUT /api/posts/:id`, `PATCH /api/posts/:id/publish`, `POST /api/media/upload`).
   - `frontend/src/features/editor/hooks/useAutoSave.ts`: Mesin auto-save debounced 2 detik dengan dirty checking, snapshot darurat ke `localStorage` (`avian_backup_${id}`), shortcut keyboard `Ctrl+S` / `Cmd+S` instant save, dan native `beforeunload` tab guard.
   - `frontend/src/features/editor/hooks/useEditorPresenter.ts`: Presenter hook editor yang mengelola siklus hidup Tiptap ProseMirror, title auto-resize textarea, live word counter, estimasi waktu baca, upload inline image dari clipboard (`Ctrl+V`), dan atomic publish flush.
   - `frontend/src/features/editor/hooks/useEditorPresenter.ts` & `TiptapEditorCore.tsx`: Menerapkan arsitektur *Zero Layout Shift Padding Transfer* ala Tiptap Demo. Memindahkan jatah padding kontainer kertas luar ke dalam `.tiptap.ProseMirror` (`px-4 sm:px-16 py-4`) dan Judul Artikel, serta memperlebar kanvas dokumen menjadi `max-w-5xl`. Hal ini menghadirkan zona bantalan (*hit-area buffer*) hijau selebar 64px di sebelah kiri teks sehingga kursor mouse berada 100% di dalam editor saat mendekati drag handle tanpa memicu `mouseleave`.
   - `frontend/src/shared/components/ui/Overlay/Modal.tsx`: Memperbaiki arsitektur modal container dengan `max-h-[88vh]`, `flex flex-col`, sticky header & footer, serta body `flex-1 overflow-y-auto overscroll-contain`. Mencegah modal melebar keluar batas layar (*off-screen*) dan memastikan seluruh konten panjang dapat di-scroll dengan mulus di semua resolusi viewport.
   - `frontend/src/features/editor/components/PublishReviewModal.tsx`: Menempatkan tombol aksi penerbitan ("Kembalikan ke Draf", "Kembali Mengedit", "Konfirmasi & Terbitkan Sekarang") pada prop `footer` Modal yang sticky di bagian bawah dialog sehingga selalu terlihat dan siap diklik tanpa terdorong keluar layar.
   - `frontend/src/features/editor/components/EditorHeader.tsx`: Menyederhanakan tombol aksi di pojok kanan atas menjadi **hanya 1 button** ("Terbitkan Tulisan" / "Perbarui Tulisan"). Menghapus tombol "Pengaturan" yang redundan karena seluruh pengaturan publikasi (sampul, slug, tag, excerpt) sudah terintegrasi rapi di dalam modal pratinjau publikasi.
   - `frontend/src/features/editor/components/DragContextMenu.tsx` & `NodeActionMenu.tsx`: Memperbaiki perataan vertikal tombol drag handle (`offset: [3, 16]`), animasi luncur halus `moveTransition`, memecah menu aksi ke subkomponen modular `< 100 LOC`, dan mempertahankan dimensi DOM fisik stabil (`opacity-0 pointer-events-none`) agar pengukuran awal Tippy selalu akurat 100%.
   - `frontend/src/features/editor/components/TurnIntoSubmenu.tsx`: Submenu melayang cascading di sebelah kanan untuk mengubah format blok (Text, Heading 1-3, Bullet List, Numbered List, Task List, Quote, Code Block).
   - `frontend/src/features/editor/components/SlashDropdownMenu.tsx` & `slashMenuItems.tsx`: Command palette menu slash (`/`) dengan live search filtering, navigasi keyboard penuh, dan integrasi tombol `+` (*Insert block*).
   - `frontend/src/features/editor/components/TiptapToolbar.tsx`: Fixed Top Control Bar terpusat (*centered cluster*) sesuai standar Tiptap Simple Editor Template dengan pemisah vertikal rapi, kontrol History, Blockquote, Code Block, Formatting B/I/S/Code/Underline, Alignment, Image, Search & Replace Popover, dan ThemeToggle.
   - `frontend/src/features/editor/components/HeadingDropdown.tsx`: Dropdown Portal Heading H1-H3 sesuai standar SEO/Web editorial dengan status transparan saat tidak aktif (*clean default state*).
   - `frontend/src/features/editor/components/ListDropdown.tsx`: Dropdown Portal List dengan pergantian ikon dinamis (`Bullet`, `Numbered`, `Task List`) dan status transparan saat tidak aktif.
   - `frontend/src/features/editor/components/LinkPopover.tsx`: Floating interactive Link Popover sesuai standar Tiptap UI dengan input URL, toggle tab baru, navigasi kunjungi tautan, dan unlink.
   - `frontend/src/features/editor/components/HighlightPopover.tsx`: Floating color palette stabilo 5 warna lembut + tombol hapus stabilo.
   - `frontend/src/features/editor/components/SearchReplacePopover.tsx`: Floating Find & Replace dengan pencocokan kata, case sensitive, navigasi match `x / y`, Replace, dan Replace All.
   - `frontend/src/features/editor/components/TextBubbleMenu.tsx`: Floating selection menu yang muncul saat teks diblok (*Bold, Italic, Underline, Strike, Highlight, Link, H2, H3, Quote*).
   - `frontend/src/features/editor/components/ImageBubbleToolbar.tsx`: Controller melayang interaktif khusus gambar ala MS Word/Ghost (Preset ukuran: S/M/Full, perataan: Kiri/Tengah/Kanan, toggle outline garis tepi, toggle bayangan, dan hapus gambar 1-klik).
   - `frontend/src/styles/index.css`: Standar ritme vertikal tipografi editorial:
     - Aturan `:first-child` zero margin top pada editor.
     - Paragraf standar memiliki margin atas saja (`margin-top: 0.75rem`, `margin-bottom: 0`).
     - Skala margin heading H1 (`2rem`), H2 (`1.5rem`), H3 (`1.15rem`), `margin-bottom: 0`.
     - Zero margin untuk seluruh elemen list item `li` dan paragraf list `li p` (`margin: 0 !important`).
     - Penanganan warna seleksi `color: inherit !important` anti-teks gelap pasca drag-and-drop di dark mode.
   - Seluruh berkas berukuran `< 280 LOC` (mematuhi batas `< 300 LOC`).

3. **Task 5.3: Ghost-Style Sliding Settings Drawer**:
   - `frontend/src/features/editor/components/CoverImageUploader.tsx`: Upload & instant preview cover thumbnail terintegrasi backend Sharp WebP.
   - `frontend/src/features/editor/components/SlugEditor.tsx`: Input custom URL slug dengan live preview tautan publik `avianblog.com/@username/slug`.
   - `frontend/src/features/editor/components/PostSettingsDrawer.tsx`: Laci geser samping kanan menggunakan atom `<Drawer>` yang memadukan cover uploader, slug editor, `<TagInput>` topik multi-chip (maks 5 tag), dan `<Textarea>` excerpt ringkasan SEO (0/160 karakter).
   - Seluruh berkas berukuran `< 100 LOC`.

4. **Task 5.3 Enhancement: Editorial Split-Screen Launchpad (`PublishReviewModal.tsx`)**:
   - `frontend/src/features/editor/components/PublishCardPreview.tsx`: Komponen kartu pratinjau live feed Substack/Avian style (Cover WebP, Avatar & Nama Penulis, Reading Time, Headline serif Newsreader, Excerpt line-clamp, tag chips, dan live domain canonical link).
   - `frontend/src/features/editor/components/PublishSettingsForm.tsx`: Komponen formulir metadata (Editable title dengan two-way sync ke kanvas editor, SlugEditor, TagInput maks 5 tag, Excerpt SEO counter 160 karakter, dan CoverImageUploader).
   - `frontend/src/features/editor/components/PublishReviewModal.tsx`: Layout dialog split 2-kolom diperlebar ke `max-w-5xl` (Preview di kiri, Formulir di kanan), validasi proaktif judul (min. 3 karakter) sebelum publish, dan penyempurnaan copy tombol CTA ("Terbitkan Sekarang" & unpublish netral).
   - `frontend/src/features/editor/extensions/CustomImage.ts`: Modul ekstensi Tiptap terisolasi (< 40 LOC).
   - `frontend/src/features/editor/hooks/useEditorPresenter.ts`: Refactoring perampingan kode hingga 291 LOC (mematuhi batas ketat `< 300 LOC`).
   - Verifikasi build `npm run build` monorepo lulus 100% dengan 0 error.

5. **Task 5.4: Tiptap Official Table Node UI Controller**:
   - `frontend/src/features/editor/components/table/TableContextMenu.tsx`: Menu konteks klik kanan sel tabel dalam Bahasa Inggris lengkap dengan submenu Alignment, Insert, Delete, Merge/Split, Toggle Header Row, dan Delete Table dengan absolute document scroll anchoring (`position: absolute`, `e.clientY + scrollY`).
   - `frontend/src/features/editor/components/table/TableExtendButtons.tsx`: Batang tombol extend `+` di sisi kanan (tambah kolom) dan bawah tabel (tambah baris) ala Tiptap UI demo.
   - `frontend/src/features/editor/components/table/TableSelectionOverlay.tsx`: Border highlight ungu dengan titik corner dot handle di sudut kanan bawah sel aktif.
   - `frontend/src/features/editor/components/TableDropdown.tsx`: Dropdown toolbar atas dengan Interactive 8×8 Visual Grid Matrix Selector dan menu kelola tabel aktif.
   - `frontend/src/features/editor/hooks/useTableController.ts`: Hook pelacak koordinat `getBoundingClientRect()` dan status aktif tabel/sel.
   - `frontend/src/features/editor/extensions/editorExtensions.ts`: Pendaftaran ekstensi modular Table, TableRow, TableHeader, TableCell (resizable: true).

6. **Task 5.5: Symmetrical 4×2 Drag Context Menu, Slash Menu & Document Anchoring Suite**:
   - `frontend/src/features/editor/components/NodeActionMenu.tsx`: Menu konteks drag handle 2-kolom simetris (4 item Kiri: H1, H2, H3, Code Block vs 4 item Kanan: Bullet List, Numbered List, Task List, Blockquote) dengan smart toggle otomatis kembali ke default Paragraph bila item aktif diklik ulang.
   - `frontend/src/features/editor/components/DragContextMenu.tsx`: Pemisahan hover tracking dengan locked active menu state, penonaktifan overlay untuk node tabel (drag-only), perataan vertikal `translate-y-2` pas di tengah header baris tabel, perbaikan transform multi-arah via `.clearNodes()`, dan absolute document scroll anchoring.
   - `frontend/src/features/editor/components/SlashDropdownMenu.tsx`: Penguncian koordinat dokumen absolut (`cursorCoords.bottom + scrollY + 8`) dengan styling `position: absolute` sehingga menu slash tetap menempel presisi di bawah kursor teks saat layar di-scroll.

7. **Task 5.6: Codebase Architectural Audit & Strict LOC Clean-up (< 300 LOC & MVP Compliance)**:
   - `frontend/src/styles/index.css` (488 LOC &rarr; 180 LOC): Modularisasi CSS monolitik menjadi sub-modul terstandar `typography.css` (~234 LOC) dan `editor.css` (~95 LOC).
   - `frontend/src/features/editor/hooks/useDragContextMenu.ts` & `DragContextMenu.tsx` (371 LOC &rarr; 95 LOC): Ekstraksi presenter logic dan ProseMirror command chaining ke custom hook terpisah.
   - `frontend/src/features/editor/hooks/useSearchReplace.ts` & `SearchReplacePopover.tsx` (298 LOC &rarr; 170 LOC): Ekstraksi regex matching dan search/replace presenter hook.
   - `frontend/src/features/editor/hooks/useSlashMenu.ts` & `SlashDropdownMenu.tsx` (234 LOC &rarr; 110 LOC): Ekstraksi keyboard selection & transaction listener presenter hook.
   - `frontend/src/features/editor/hooks/useTableDropdown.ts` & `TableDropdown.tsx` (277 LOC &rarr; 185 LOC): Ekstraksi 8x8 matrix grid hover state dan action handler.
   - `frontend/src/shared/components/ui/Form/useImageUpload.ts` & `ImageUpload.tsx`: Ekstraksi upload logic ke presenter hook mandiri.
   - `TableContextMenu.tsx`: Perampingan flyout submenus hingga 242 LOC.
   - **Audit LOC Result**: 100% file di Frontend & Backend mematuhi batas ketat `< 300 LOC` (file terbesar hanya 277 LOC).

8. **Task 5.7: Media Storage Lifecycle & Automatic Cleanup System**:
   - `backend/src/modules/media/media-cleanup.service.ts`: Service pembersih otomatis file yatim (*orphaned media*) dengan deteksi disk vs database dan background scheduler otomatis (berjalan 5 detik pasca startup server, lalu berulang tiap 24 jam).
   - `backend/src/modules/posts/posts.service.ts`: Integrasi active cleanup pada `deletePost()` untuk menghapus cover image dan gambar di dalam isi artikel secara instan jika sudah tidak digunakan oleh post/user lain.
   - `backend/scripts/clean_media.ts`: Dedicated CLI command `npm run clean:media` untuk audit dan pembersihan media storage secara manual kapan pun dibutuhkan.
   - **Build & Type-Check**: Monorepo build `tsc` & `vite build` 100% lulus bebas error.
   - **Graphify**: Sinkronisasi knowledge graph ter-update (729 nodes, 1,265 edges, 50 communities).

---

## 📌 [2026-09-03] - Standardisasi Pembuatan Post Baru via WritePostButton & Hapus Total Rute /editor/new

### ✅ Completed:
1. **Component-First Architecture `<WritePostButton />` & Presenter Hook `useCreatePost`**:
   - `frontend/src/features/dashboard/posts/hooks/useCreatePost.ts`: Hook sentral single source of truth dengan perlindungan *triple-layer race condition* (memory lock `useRef`, state React `isCreating`, dan atribut native `disabled`), memanggil `createDraftMutation.mutateAsync()`, dan menavigasi terarah ke `/editor/:id`.
   - `frontend/src/shared/components/common/WritePostButton.tsx`: Komponen composite reusable yang mengelola sendiri *loading spinner*, event click, ikon Phosphor (`NotePencil` sebagai standar default), dan callback *pre-navigation* (`onBeforeCreate`).
2. **Hapus Total Rute & Logika `/editor/new`**:
   - `frontend/src/app/router.tsx`: Menghapus rute `/editor/new`.
   - `frontend/src/features/editor/hooks/useEditorPresenter.ts`: Menghapus blok efek baris 36–52, menghapus `isCreatingNewDraftRef` yang macet di React StrictMode, menghapus impor mentah `postsApi`, dan menambahkan guard `isError` anti-infinite spinner (otomatis me-redirect jika post 404).
   - `frontend/src/features/editor/api/editorQueries.ts`: Menyederhanakan `enabled: !!id`.
3. **Pembersihan Layout & Post List (100% DRY & Valid Semantic HTML)**:
   - `frontend/src/shared/components/layout/DashboardSidebar.tsx`: Menghapus invalid HTML `<Link to="/editor/new"><Button ...></Link>`, menggantinya dengan `<WritePostButton size="md" fullWidth onBeforeCreate={onClose}>Tulis Cerita Baru</WritePostButton>`.
   - `frontend/src/shared/components/layout/PublicNavbar.tsx`: Menghapus `<Link to="/editor/new">`, menggantinya dengan `<WritePostButton size="sm">Tulis Cerita</WritePostButton>`.
   - `frontend/src/features/dashboard/posts/components/PostListHeader.tsx` & `PostListPage.tsx`: Menggunakan `<WritePostButton size="md">Tulis Cerita Baru</WritePostButton>` dan menghapus *prop drilling* `onCreateDraft` serta `isCreating`.
   - **Penyelarasan UX Copywriting & Iconography**: Menghilangkan istilah kaku *"Artikel"* dan menstandarisasikan frasa menjadi **"Tulis Cerita Baru"** (Sidebar & Header) serta **"Tulis Cerita"** (Navbar compact). Ikon aksi penulisan diseragamkan 100% menggunakan **`NotePencil`** di seluruh tombol.
   - `frontend/src/features/dashboard/posts/hooks/usePostListPresenter.ts`: Menghapus kode mutasi manual (~15 baris terpangkas).
4. **Hardening Aksesibilitas (a11y) & SEO**:
   - `frontend/src/shared/components/ui/Form/Button.tsx`: Menambahkan default prop `type = 'button'`, `aria-busy={isLoading}`, serta WAI-ARIA `role="status"` dan `aria-label="Memuat..."` pada `<CircleNotch>` spinner.
   - Melindungi *crawl budget* SEO dari rayapan link privat/mutasi.
5. **Verifikasi Build & LOC**:
   - Build frontend (`tsc && vite build`) & backend (`tsc`) 100% lulus bebas error.
   - 100% berkas berukuran `< 280 LOC` (mematuhi batas ketat `< 300 LOC`).

---

## 🐛 [2026-09-03] - Fix Cache Poisoning & Race Condition Hidrasi Editor Draf
- **Completed**:
  - `frontend/src/features/editor/api/editorQueries.ts`: Mengubah `staleTime: 0`, `gcTime: 0`, dan `refetchOnMount: 'always'` pada `usePostDetailQuery` agar workspace editor selalu meminta data paling segar dari database PostgreSQL dan tidak lagi terjebak menyajikan snapshot draf kosong dari memori cache.
  - `frontend/src/features/editor/hooks/useEditorPresenter.ts`:
    - Menghapus manual `editor?.destroy()` di dalam `useEffect([editor])` yang berpotensi mematikan instance Tiptap saat re-render/remount.
    - Menambahkan argumen `false` (`emitUpdate: false`) pada `editor.commands.setContent(content, false)` saat hidrasi awal data agar tidak memicu auto-save prematur.
    - Menambahkan *anti-wipeout guard* pada `buildCurrentPayload` dan `handleExitEditor` agar tidak pernah menimpa database jika editor belum selesai terhidrasi.
    - Menambahkan reset `isInitialHydratedRef.current = false` ketika berpindah ID draf.
  - **Verifikasi Build & LOC**: Build frontend (`tsc && vite build`) 100% lulus bebas error (11.4s), ukuran file 283 LOC (mematuhi batas ketat `< 300 LOC`).

---

### 🎯 Next Steps:
- [ ] **Phase 6: Frontend Analytics Dashboard (Ghost Style)**:
   - [ ] **Task 6.1**: Analytics Overview Page (`/dashboard/analytics`) dengan metric cards grid (Total Views, Published Posts, Drafts, Avg Read Time), interactive chart Recharts (7d/30d series), dan daftar Top 5 artikel paling populer.

