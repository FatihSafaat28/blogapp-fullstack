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

### 🎯 Next Steps (Phase 2: Backend Feature Modules):
- [ ] **Task 2.1**: Auth Module (`/api/auth` - Register, Login dengan Remember Me, Refresh Token, Logout, Me).
- [ ] **Task 2.2**: Media Upload Module (`/api/media` - Multer image upload maks 5MB).
- [ ] **Task 2.3**: User & Profile Settings Module (`/api/users` - Update profil, bio, custom blog title).
- [ ] **Task 2.4**: Posts Module (`/api/posts` - CRUD, Tiptap JSON/HTML, reading time, auto-slug, publish toggle).
- [ ] **Task 2.5**: Smart Analytics Module (`/api/analytics` - 60-min deduplication view counter, dashboard chart data).

