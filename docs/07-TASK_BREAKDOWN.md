# 📋 Master Task Breakdown & Feature Roadmap

Dokumen ini memecah seluruh pengerjaan proyek **Multi-User PERN Blog Platform** menjadi tugas-tugas granular yang terstruktur per fitur dan per halaman, mematuhi batas ketat `< 300 LOC` dan pola **MVP (Model-View-Presenter)**.

---

## 🧭 Milestone Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           ROADMAP PENGERJAAN                             │
├──────────────────────────────────────────────────────────────────────────┤
│ Phase 0: Project Setup & Monorepo Foundation                             │
│ Phase 1: Database & Core Backend Infrastructure                          │
│ Phase 2: Backend Feature Modules (Auth, Posts, Analytics, Media)         │
│ Phase 3: Frontend Foundation & Shared Design System Tokens               │
│ Phase 4: Frontend Auth & User Profile Features                           │
│ Phase 5: Frontend Dashboard & Editor Studio (Ghost Style)                │
│ Phase 6: Frontend Analytics Dashboard (Ghost Style)                      │
│ Phase 7: Frontend Public Views (Substack Creator & Overreacted Reader)   │
│ Phase 8: E2E Integration, LOC Audit (<300 LOC) & Polish                  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 📌 Rincian Tugas Granular

### 🏗️ Phase 0: Project Setup & Monorepo Foundation

- [x] **Task 0.1: Root Workspace Setup**
  - Buat `package.json` di root dengan dependency `concurrently`.
  - Konfigurasi `.gitignore` untuk `node_modules`, `.env`, `dist`, `uploads/`.
- [x] **Task 0.2: Backend Initialization**
  - Inisialisasi `backend/` dengan TypeScript, `tsconfig.json`, `tsx` / `nodemon`.
  - Install dependencies: `express`, `cors`, `helmet`, `cookie-parser`, `dotenv`, `zod`, `bcryptjs`, `jsonwebtoken`, `multer`.
  - Install Prisma ORM: `prisma`, `@prisma/client`.
- [x] **Task 0.3: Frontend Initialization**
  - Inisialisasi `frontend/` menggunakan **Vite (React + TypeScript)**.
  - Install dependencies: `@tanstack/react-query`, `react-router-dom`, `lucide-react`, `recharts`, `react-hook-form`, `@hookform/resolvers`, `zod`, `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link`.

---

### 🗄️ Phase 1: Database & Core Backend Infrastructure

- [x] **Task 1.1: Prisma Schema & Migration**
  - Buat `backend/prisma/schema.prisma` dengan model: `User`, `Post`, `Tag`, `PostTag`, `PostViewLog`.
  - Tambahkan composite unique constraint `@@unique([authorId, slug])`.
  - Jalankan migrasi database awal `npx prisma migrate dev --name init`.
- [x] **Task 1.2: Global Express Server & Middlewares**
  - `backend/src/index.ts`: Entry point Express.
  - `backend/src/config/prisma.ts`: Inisialisasi singleton PrismaClient.
  - `backend/src/middlewares/error.middleware.ts`: Global error handler & AppError class.
  - `backend/src/middlewares/cors.middleware.ts`: CORS with `credentials: true`.
  - Static file serve untuk folder `backend/uploads/`.
- [x] **Task 1.3: Authentication Utilities & AuthGuard**
  - `backend/src/utils/jwt.ts`: Fungsi sign & verify Access Token (15m) & Refresh Token (7d).
  - `backend/src/middlewares/auth.middleware.ts`: Middleware `authGuard` untuk memproteksi private routes via HttpOnly cookie.

---

### ⚙️ Phase 2: Backend Feature Modules

- [x] **Task 2.1: Auth Module (`/api/auth`)**
  - `auth.schema.ts`: Validasi Zod register, login (support `rememberMe: boolean`), dan token refresh.
  - `auth.service.ts`: Logika hash password bcrypt, cek email/username unik, token generation (Access 15m & Refresh 7d / Session 30d).
  - `auth.controller.ts`: Set/clear HttpOnly cookies dengan kalkulasi `maxAge` berbasis `rememberMe`, return user session.
  - `auth.routes.ts`: `POST /register`, `POST /login`, `POST /refresh-token`, `POST /logout`, `GET /me`.
- [x] **Task 2.2: Media Upload Module (`/api/media`)**
  - `upload.middleware.ts`: Multer memory storage, MIME type validation (JPG, PNG, WEBP, GIF, maks 5MB).
  - `media.service.ts`: Konversi otomatis ke format **WebP** menggunakan library `sharp` (max-width 1600px, quality 80), sanitasi penamaan file unik, dan penyimpanan ke `backend/uploads/`.
  - `media.controller.ts` & `media.routes.ts`: `POST /api/media/upload` &rarr; Return URL `/uploads/{filename}.webp`.
- [x] **Task 2.3: User & Settings Module (`/api/users`)**
  - `users.schema.ts`: Validasi Zod update profil dan parameter username publik.
  - `users.service.ts`: Query profil publik kreator (`/@:username`), update profil & kustomisasi judul blog, kalkulasi statistik postingan.
  - `users.controller.ts` & `users.routes.ts`: `GET /public/:username`, `PATCH /profile`, `GET /me/stats`.
- [x] **Task 2.4: Posts Module (`/api/posts`)**
  - `posts.schema.ts`: Validasi Zod ketat (panjang judul 3–200 char, excerpt maks 500 char, tags array, query tab enum `trending` | `latest` | `for-you`).
  - `posts.helper.ts`: Sanitasi HTML anti-XSS (`sanitize-html`), kalkulasi `readingTimeMinutes`, ekstraksi `excerpt`, generator slug unik.
  - `posts.service.ts`: Create draft, auto-save update, toggle publish/unpublish, delete, dashboard post list.
  - `posts-feed.service.ts`: 3 tab feed explore (`trending` score decay, `for-you`, `latest`), author articles list, single article.
  - `posts.controller.ts` & `posts.routes.ts`: Rate limit 10 post / 15m, routing public & private.
- [x] **Task 2.5: Smart Analytics Module (`/api/analytics`)**
  - `analytics.schema.ts` & `analytics.helper.ts`: Validasi UUID `postId`, hash SHA-256 pembaca anonim.
  - `analytics.service.ts`: Deduplikasi 60 menit via `PostViewLog`, atomic increment `viewCount`, agregasi grafik 7/30 hari dan top 5 artikel.
  - `analytics.controller.ts` & `analytics.routes.ts`: `POST /views/:postId`, `GET /dashboard`.
  - `openapi.ts` & Swagger UI: Live studio di `/docs/`.

---

### 🎨 Phase 3: Frontend Foundation & Shared Design Tokens

- [ ] **Task 3.1: CSS Design Tokens & Typography**
  - `frontend/src/styles/variables.css`: Palette warna (Light & Dark), Glassmorphism, Radii, Shadows, Spacing.
  - `frontend/src/styles/typography.css`: Font _Outfit_ / _Plus Jakarta Sans_ & _Inter_, line heights, heading scales.
  - `frontend/src/styles/reset.css`: Modern CSS reset.
- [ ] **Task 3.2: API Client, Query Client & Auth Store**
  - `frontend/src/shared/api/apiClient.ts`: Axios instance dengan `withCredentials: true`, interceptors auto refresh token saat 401.
  - `frontend/src/app/providers.tsx`: TanStack QueryClientProvider, Toast/Alert Provider.
  - `frontend/src/features/auth/stores/authStore.ts`: Zustand state management (`user`, `isAuthenticated`, `login`, `logout`, `checkAuth`).
- [ ] **Task 3.3: Shared UI Atoms (< 150 LOC per file)**
  - `Button.tsx`, `Input.tsx`, `Badge.tsx`, `Card.tsx`, `Modal.tsx`, `Dropdown.tsx`, `Spinner.tsx`, `Toast.tsx`.
- [ ] **Task 3.4: Layout Shells**
  - `Navbar.tsx`: Navbar publik global (Logo, Explore, Search, Login/Register / Avatar User).
  - `DashboardLayout.tsx`: Ghost-style layout dengan sidebar tetap dan top bar.
  - `PublicLayout.tsx`: Layout container untuk halaman author dan pembaca.
- [ ] **Task 3.5: App Router & Route Protection**
  - `frontend/src/app/router.tsx`: React Router v6 setup dengan `ProtectedRoute` dan `PublicOnlyRoute`.

---

### 👤 Phase 4: Frontend Auth & User Profile Features

- [ ] **Task 4.1: Auth State & Context**
  - `AuthContext.tsx` & `useAuth.ts`: Menyimpan user state, login method, logout method, check session.
- [ ] **Task 4.2: Login Page (`/login`) - MVP Pattern**
  - Model: `auth.api.ts`.
  - Presenter: `useLoginPresenter.ts` (React Hook Form + Zod).
  - View: `LoginPage.tsx` & `LoginFormView.tsx` + `Auth.module.css`.
- [ ] **Task 4.3: Register Page (`/register`) - MVP Pattern**
  - Presenter: `useRegisterPresenter.ts`.
  - View: `RegisterPage.tsx` & `RegisterFormView.tsx`.
- [ ] **Task 4.4: Profile & Blog Settings Page (`/dashboard/settings`)**
  - Presenter: `useSettingsPresenter.ts` (Update avatar, bio, custom blog title, social links).
  - View: `SettingsPage.tsx`, `ProfileFormView.tsx`, `BlogAppearanceView.tsx`.

---

### ✍️ Phase 5: Frontend Dashboard & Editor Studio (Ghost Style)

- [ ] **Task 5.1: Dashboard Posts Management Page (`/dashboard/posts`)**
  - Model: `posts.queries.ts` (TanStack Query hooks).
  - Presenter: `usePostListPresenter.ts` (Filter status, search, delete handler).
  - Views (< 200 LOC each):
    - `PostListPage.tsx`: Container halaman.
    - `PostFilterTabs.tsx`: Tab `All`, `Published`, `Drafts`.
    - `PostListTable.tsx` / `PostCard.tsx`: Tampilan daftar artikel dengan status badge & dropdown aksi.
    - `DeletePostModal.tsx`: Konfirmasi dialog hapus.
- [ ] **Task 5.2: Tiptap Rich Text Editor Engine (`/dashboard/posts/:id/edit`)**
  - Presenter: `usePostEditorPresenter.ts` & `useAutoSave.ts` (Debounced 1.5s auto-save dengan status "Saving..." &rarr; "All changes saved").
  - Views (< 200 LOC each):
    - `PostEditorPage.tsx`: Main editor orchestrator.
    - `EditorHeader.tsx`: Back button, auto-save status indicator, preview toggle, settings toggle, publish button.
    - `TiptapToolbar.tsx`: Word-like formatting toolbar (H1-H3, Bold, Italic, Bullet/Number list, Quote, Image).
    - `TiptapEditorCore.tsx`: Core editor body render.
- [ ] **Task 5.3: Ghost-style Sliding Settings Drawer**
  - Views (< 200 LOC each):
    - `PostSettingsDrawer.tsx`: Slide-in drawer dari sisi kanan.
    - `CoverImageUploader.tsx`: Upload & preview thumbnail post.
    - `SlugEditor.tsx`: Input custom URL slug.
    - `TagSelector.tsx`: Multi-select tag input.
    - `ExcerptInput.tsx`: Input manual ringkasan artikel.

---

### 📊 Phase 6: Frontend Analytics Dashboard (Ghost Style)

- [ ] **Task 6.1: Analytics Overview Page (`/dashboard` & `/dashboard/analytics`)**
  - Model: `analytics.queries.ts`.
  - Presenter: `useAnalyticsPresenter.ts` (Timeframe switcher 7d/30d).
  - Views (< 200 LOC each):
    - `AnalyticsDashboardPage.tsx`: Container halaman.
    - `MetricCardsGrid.tsx`: Cards (Total Views, Published Posts, Drafts, Avg Read Time).
    - `ViewsChart.tsx`: Area/Line Chart interaktif menggunakan **Recharts**.
    - `TopPostsList.tsx`: Daftar 5 artikel paling populer beserta jumlah views.

---

### 📖 Phase 7: Frontend Public Views (Substack & Overreacted Style)

- [ ] **Task 7.1: Personal Creator Landing Page (`/@:username`) - Substack Style**
  - Model: `publicBlog.queries.ts`.
  - Presenter: `useAuthorBlogPresenter.ts`.
  - Views (< 200 LOC each):
    - `AuthorBlogPage.tsx`: Container halaman.
    - `AuthorHeroCard.tsx`: Avatar besar, nama author, bio, join date, social links.
    - `AuthorPostGrid.tsx` & `ArticleCard.tsx`: Grid/List artikel dengan thumbnail, reading time, excerpt, tags.
- [ ] **Task 7.2: Single Article Reader (`/@:username/:postSlug`) - Overreacted Style**
  - Presenter: `useArticleReaderPresenter.ts` (Trigger smart view tracking API on mount).
  - Views (< 200 LOC each):
    - `ArticleReaderPage.tsx`: Container pembaca distraction-free (~720px max width).
    - `ArticleHeader.tsx`: Judul besar, author card kecil, tanggal terbit, waktu baca.
    - `ArticleBody.tsx`: HTML typography view dengan blockquote, gambar, dan code block styling.
    - `ArticleFooterAuthor.tsx`: Bio card author di akhir artikel + tombol share sosial media.
- [ ] **Task 7.3: Global Landing & Explore Page (`/` & `/explore`)**
  - Presenter: `useExplorePresenter.ts` (Search keyword & tag filter).
  - Views: `HomePage.tsx`, `FeaturedAuthorsSection.tsx`, `ExplorePostsSection.tsx`.

---

### 🧪 Phase 8: E2E Integration, LOC Audit & Polish

- [ ] **Task 8.1: Full E2E Flow Testing**
  - Tes register user baru &rarr; login (cek HttpOnly cookie) &rarr; buat artikel di Tiptap editor &rarr; upload gambar &rarr; auto-save tersimpan &rarr; publish.
  - Buka halaman publik `/@:username` dan `/@:username/:postSlug`.
  - Verifikasi smart view counter bertambah 1 kali (dan tidak bertambah saat refresh dalam 60 menit).
  - Verifikasi grafik analytics di dashboard creator menampilkan data views.
- [ ] **Task 8.2: Strict LOC Audit (< 300 LOC)**
  - Script audit untuk memastikan 100% file `.ts`, `.tsx`, `.css` berukuran `< 300 baris`.
- [ ] **Task 8.3: Update Dokumentasi & CHANGELOG.md**
  - Update status milestone selesai di `CHANGELOG.md`.
