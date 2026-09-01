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

- [x] **Task 3.1: CSS Design Tokens & Typography (Single index.css Consolidation)**
  - `frontend/src/styles/index.css`: Penyatuan seluruh Design Tokens HSL (Light & Dark theme), Glassmorphism (`--bg-glass`), fluid typography scale, reader prose (`.prose-reader`), dan keyframes animasi dalam satu file tunggal (~190 LOC) tanpa file reset eksternal yang konflik.
- [x] **Task 3.2: API Client, Query Client & Auth Store**
  - `frontend/src/features/auth/types/auth.types.ts`: TypeScript interfaces (`User`, `AuthResponse`, `ApiResponse`).
  - `frontend/src/shared/api/apiClient.ts`: Axios instance dengan `withCredentials: true`, interceptors auto refresh token saat 401.
  - `frontend/src/features/auth/stores/authStore.ts`: Zustand global state management (`useAuthStore`).
  - `frontend/src/app/providers.tsx`: TanStack QueryClientProvider dengan 5m cache.
  - `frontend/src/app/App.tsx`: Provider wrapper dan inisialisasi sesi `checkAuth()`.
- [x] **Task 3.3: Pure Tailwind CSS v4 UI Atoms Suite (< 150 LOC per file - 25 Essential Components)**
  - Terintegrasi penuh dengan **Tailwind CSS v4** (`@tailwindcss/vite` & `@tailwindcss/typography`) di `vite.config.ts` dan `src/styles/index.css`.
  - **Form & Input (7)**: `Button.tsx` (variants, sizes, loading), `Input.tsx` (labels, error feedback, search/clear support), `Textarea.tsx`, `Select.tsx` (custom chevron), `Checkbox.tsx` (custom check toggle), `TagInput.tsx` (interactive chip tags), `ImageUpload.tsx` (dropzone cover & avatar uploader terintegrasi backend WebP).
  - **Data Display (7)**: `Card.tsx` (glass surface, hover lift), `Badge.tsx` (published, draft, tags), `Avatar.tsx` (smart initials & gradient fallback), `Tabs.tsx` (segmented pills), `Pagination.tsx` (page bar), `Divider.tsx` (labeled separator), `EmptyState.tsx` (rich empty view with action CTA), `ShareButtons.tsx` (copy link & social share).
  - **Overlays & Feedback (8)**: `Modal.tsx` (dialogs with backdrop blur), `Drawer.tsx` (sliding right settings drawer for editor), `Dropdown.tsx` (post action popover), `Tooltip.tsx` (editor toolbar hover tip), `Alert.tsx` (inline callouts), `Spinner.tsx` & `Skeleton.tsx` (loading states), `ReadingProgressBar.tsx` (top reading scroll indicator).
  - **Theme & Toast (3)**: `ThemeToggle.tsx` (Light/Dark mode switcher with class toggling & localStorage), `Toast.tsx` + `ToastContext.tsx` + `useToast.ts` (global floating notification system).
  - **Zero `.module.css`**: Seluruh 25 komponen berukuran 26 s.d. 114 LOC mandiri dalam satu berkas `.tsx`.
- [x] **Task 3.4: Layout Shells (Pure Tailwind CSS v4)**
  - `PublicNavbar.tsx`: Navbar publik global berbalut glassmorphism (Brand Logo, Explore link, ThemeToggle, dynamic guest/logged-in states dengan Avatar Dropdown).
  - `PublicFooter.tsx`: Footer minimalis dengan branding dan copyright.
  - `PublicLayout.tsx`: Container layout publik untuk seluruh halaman author dan pembaca.
  - `DashboardSidebar.tsx`: Ghost-style minimal sidebar (Logo studio, tombol cepat `+ Write New Post`, menu Artikel, Analitik, Pengaturan, mini user profile card).
  - `DashboardHeader.tsx`: Top bar studio dengan breadcrumb, link langsung ke blog publik Substack-style (`/@:username`), dan ThemeToggle.
  - `DashboardLayout.tsx`: Master layout studio responsif (fixed sidebar desktop, mobile drawer overlay).
- [x] **Task 3.5: App Router & Route Protection (React Router v6)**
  - `ProtectedRoute.tsx`: Guard autentikasi untuk memproteksi `/dashboard/*` dan `/editor/*` (redirect ke `/login` dengan preserve URL state).
  - `PublicOnlyRoute.tsx`: Guard khusus tamu untuk mencegah user yang sudah login mengakses `/login` dan `/register` (redirect otomatis ke `/dashboard/posts`).
  - `router.tsx`: Konfigurasi rute bersarang lengkap untuk seluruh 9 rute aplikasi dengan visual feedback dan layout wrapper yang tepat.

---

### 👤 Phase 4: Frontend Auth & User Profile Features
 
- [x] **Task 4.1: Auth State & Context Integration**
  - Zustand auth store (`useAuthStore`) integrasi dengan form handler dan auto-refresh token.
- [x] **Task 4.2: Login Page (`/login`) - MVP Pattern**
  - Model: `authApi.ts`.
  - Presenter: `useLoginPresenter.ts` (React Hook Form + Zod).
  - View: `LoginPage.tsx` & `LoginFormView.tsx` (Pure Tailwind CSS v4 semantic tokens).
- [x] **Task 4.3: Register Page (`/register`) - MVP Pattern**
  - Presenter: `useRegisterPresenter.ts`.
  - View: `RegisterPage.tsx` & `RegisterFormView.tsx` (Pure Tailwind CSS v4 semantic tokens).
- [x] **Task 4.4: Profile & Blog Settings Page (`/dashboard/settings`) - MVP Pattern**
  - Model: `settingsApi.ts` (`PATCH /api/users/profile`, `POST /api/media/upload`).
  - Presenter: `useSettingsPresenter.ts` (React Hook Form, Zod validation, Deferred Avatar Upload via `URL.createObjectURL` instant preview, tab state, toast feedback).
  - Views: `SettingsPage.tsx`, `ProfileFormView.tsx`, `BlogIdentityView.tsx` (Substack Live Card Preview), `SocialLinksView.tsx` (100% konsumsi komponen UI Kit).
  - Storage Optimization & Auto-Cleanup: Content Hashing SHA-256 (`img-[sha256].webp`) anti-duplikasi dan otomatis menghapus foto avatar lama dari disk saat avatar baru disimpan/dihapus.
  - A11y & Form Standards: 100% Form binding `useId()`, `aria-label`, WAI-ARIA roles, dan migrasi menyeluruh ke `@phosphor-icons/react`.

---

### ✍️ Phase 5: Frontend Dashboard & Editor Studio (Ghost Style)

- [x] **Task 5.1: Dashboard Posts Management Page (`/dashboard/posts`)**
  - Model: `types/post.types.ts`, `api/postsApi.ts`, `api/postsQueries.ts` (TanStack Query hooks).
  - Presenter: `usePostListPresenter.ts` (Filter status All/Published/Draft, search debounced, delete handler, copy link).
  - Views (< 200 LOC each):
    - `PostListPage.tsx`: Container halaman.
    - `PostListHeader.tsx`: Header dan tombol buat tulisan baru.
    - `PostFilterBar.tsx`: Tab segmented pill `All`, `Published`, `Draft` dan search input.
    - `PostItemCard.tsx`: Tampilan kartu artikel dengan cover thumbnail, status badge, reading time, view count, dan dropdown menu aksi `[ ••• ]`.
    - `DeletePostModal.tsx`: Konfirmasi dialog hapus permanen.
- [x] **Task 5.2: Ghost-Style Fullscreen Editor Studio & Advanced Tiptap Engine (`/editor/new` & `/editor/:id`)**
  - Model: `types/editor.types.ts`, `api/editorApi.ts`, `api/editorQueries.ts`.
  - Presenter: `useEditorPresenter.ts` & `useAutoSave.ts` (Debounced 2s auto-save, status pill, dirty tracking, `Ctrl+S` instant save, emergency localStorage snapshot, headline auto-resize).
  - Ekstensi Tiptap Suite (12 Packages): `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-underline`, `@tiptap/extension-highlight`, `@tiptap/extension-text-align`, `@tiptap/extension-link`, `@tiptap/extension-image`, `@tiptap/extension-task-list`, `@tiptap/extension-task-item`, `@tiptap/extension-drag-handle-react`, `@tiptap/extension-placeholder`.
  - Arsitektur Tipografi & Vertical Rhythm:
    - Zero Layout Shift Padding Transfer: Buffer hit-area 64px (`px-4 sm:px-16 py-4`) pada `.tiptap.ProseMirror` agar handle stabil tanpa memicu `mouseleave`.
    - Aturan `:first-child` zero margin top pada editor.
    - Margin atas standar paragraf `margin-top: 0.75rem`, `margin-bottom: 0`.
    - Skala margin heading H1 (`2rem`), H2 (`1.5rem`), H3 (`1.15rem`), `margin-bottom: 0`.
    - Zero margin untuk list items `li` dan paragraf di dalam list (`margin: 0 !important`).
  - Views (< 250 LOC each):
    - `EditorPage.tsx`: Fullscreen layout orchestrator (distraction-free, zero sidebar).
    - `EditorHeader.tsx`: Back button, auto-save status pill, word & reading time counter, dan Single Primary Action Button ("Terbitkan Tulisan" / "Perbarui Tulisan").
    - `TiptapToolbar.tsx`: Centered top formatting bar (History, H1-H3 portal dropdown, B/I/S/Code/Underline/Highlight, Align, Image, Link popover, ThemeToggle).
    - `TiptapEditorCore.tsx`: Core editor body render dengan clipboard image paste handling dan auto-resizing headline textarea.
    - `DragContextMenu.tsx`: Floating drag-and-drop handle dengan alignment presisi `[3, 16]`, animasi `moveTransition`, dan dimensi fisik stabil (`opacity-0 pointer-events-none`).
    - `NodeActionMenu.tsx`: Menu aksi utama blok (Turn Into, Duplicate, Copy, Delete) dengan persistent scroll handling.
    - `TurnIntoSubmenu.tsx`: Submenu melayang cascading di samping kanan untuk migrasi tipe blok.
    - `SlashDropdownMenu.tsx` & `slashMenuItems.tsx`: Slash command palette `/` dengan filter pencarian dan navigasi keyboard penuh.
- [x] **Task 5.3: Pre-Publish Review Modal & Single Action Workflow (Editorial Split-Screen Launchpad)**
  - Views & Primitives (< 150 LOC each):
    - `Modal.tsx`: Arsitektur dialog scrollable terstandar (`max-h-[88vh]`, `flex flex-col`, `max-w-5xl`, sticky header, sticky footer, body `flex-1 overflow-y-auto overscroll-contain`).
    - `PublishReviewModal.tsx`: Master modal publikasi split 2-kolom dengan pre-flight validation dan refined action buttons.
    - `PublishCardPreview.tsx`: Kartu pratinjau live feed Substack/Avian style (Cover WebP, Avatar, Reading Time, Headline serif, Excerpt line-clamp, tag chips, dan canonical link).
    - `PublishSettingsForm.tsx`: Kontrol formulir metadata (Editable title dengan two-way sync, SlugEditor, TagInput, Excerpt SEO, dan CoverImageUploader).
    - `CustomImage.ts`: Modul ekstensi Tiptap terisolasi untuk alignment & image resizing (< 40 LOC).
    - `PostSettingsDrawer.tsx`: Sliding drawer alternatif untuk pengaturan metadata artikel.
- [x] **Task 5.4: Tiptap Official Table Node UI Controller**
  - Controllers & Overlays (< 250 LOC each):
    - `TableContextMenu.tsx`: Right-click context menu (Alignment, Insert, Delete, Merge/Split, Toggle Header, Delete Table).
    - `TableExtendButtons.tsx`: Horizontal & vertical `+` extend button bars.
    - `TableSelectionOverlay.tsx`: Border highlight ungu dengan corner dot pada cell aktif.
    - `TableDropdown.tsx`: Toolbar matrix selector 8×8 visual grid.
    - `useTableController.ts`: Hook pelacak koordinat getBoundingClientRect().
- [x] **Task 5.5: Symmetrical 4×2 Drag Context Menu, Slash Menu & Document Anchoring Suite**
  - Controllers & Menus (< 280 LOC each):
    - `NodeActionMenu.tsx`: Menu konteks drag handle 2-kolom simetris (4 item Kiri: H1, H2, H3, Code Block vs 4 item Kanan: Bullet List, Numbered List, Task List, Blockquote) dengan smart toggle otomatis kembali ke default Paragraph bila item aktif diklik ulang.
- [x] **Task 5.6: Codebase Architectural Audit & Strict LOC Clean-up (< 300 LOC & MVP Compliance)**
  - Modular Stylesheets (< 240 LOC each):
    - `index.css`: Design tokens, dark mode, Tailwind theme, dan CSS imports (~180 LOC).
    - `typography.css`: Reader prose, headings, lists, blockquote, pre/code blocks (~234 LOC).
    - `editor.css`: Table styling, selection handles, placeholder, form inputs (~95 LOC).
  - MVP Presenter Hooks & Pure Views:
    - `useDragContextMenu.ts` & `DragContextMenu.tsx` (< 95 LOC view).
    - `useSearchReplace.ts` & `SearchReplacePopover.tsx` (< 170 LOC view).
    - `useSlashMenu.ts` & `SlashDropdownMenu.tsx` (< 110 LOC view).
    - `useTableDropdown.ts` & `TableDropdown.tsx` (< 185 LOC view).
    - `useImageUpload.ts` & `ImageUpload.tsx` (< 90 LOC view).
  - **Hasil Audit**: 100% file di codebase berukuran `< 280 LOC` dan build `npm run build` monorepo 100% bebas error.

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
