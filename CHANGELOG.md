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

### 🎯 Next Steps:
- [ ] **Phase 1: Database Setup & Migration**:
  - [ ] Pastikan PostgreSQL lokal/cloud berjalan dan terhubung dengan file `backend/.env`.
  - [ ] Jalankan `npx prisma migrate dev --name init`.
- [ ] **Phase 2: Backend Feature Modules**:
  - [ ] **Task 2.1**: Auth Module (Register, Login dengan HttpOnly Cookie, Logout, Me).
  - [ ] **Task 2.2**: Media Upload Module (Multer disk storage & validation).
  - [ ] **Task 2.3**: User & Profile Settings Module.
  - [ ] **Task 2.4**: Posts Module (Drafting, Debounced auto-save, Reading time, Publishing, Multi-tenant slug).
  - [ ] **Task 2.5**: Smart Analytics Module (60m deduplication logic & Dashboard metrics).
