# 🚀 Panduan Setup & Menjalankan Proyek (Setup & Run Guide)

Dokumen ini menjelaskan langkah-langkah instalasi, konfigurasi database PostgreSQL, dan menjalankan aplikasi di lingkungan lokal.

---

## 1. 📋 Prasyarat Sistem

* **Node.js**: Versi `18.x` atau lebih baru (`node -v`).
* **Package Manager**: `npm` atau `pnpm`.
* **Database**: **PostgreSQL** berjalan di lokal (port 5432) atau URL database cloud (Supabase / Neon / Render Postgres).

---

## 2. ⚙️ Konfigurasi Environment Variables (Terpusat di Root)

Proyek ini menggunakan **1 file konfigurasi terpusat di root workspace (`.env`)**. Kamu tidak perlu lagi membuat file `.env` terpisah di dalam `backend/` dan `frontend/`.

Buat file `.env` di root project (`d:\devs\belajar-pern\.env`) berdasarkan template `.env.example`:

```env
# ==========================================
# 🌐 CENTRAL ENVIRONMENT CONFIGURATION
# ==========================================

# Server Settings
PORT=5000
NODE_ENV=development

# PostgreSQL Database Connection (Prisma)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/belajar_pern_blog?schema=public"

# JWT Security Secrets (Minimum 32 chars in production)
JWT_ACCESS_SECRET="default-dev-super-secret-access-token-key-min-32-chars"
JWT_REFRESH_SECRET="default-dev-super-secret-refresh-token-key-min-32-chars"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# Client Web Application URL (CORS)
CLIENT_URL="http://localhost:5173"

# Frontend API Base URL (Vite)
VITE_API_BASE_URL="http://localhost:5000/api"
```

---

## 3. 📦 Langkah Instalasi & Database Migration

### Langkah 1: Install Dependencies
```bash
# Di root project (atau masing-masing sub-folder)
cd backend && npm install
cd ../frontend && npm install
```

### Langkah 2: Prisma Migration (Setup Skema PostgreSQL)
```bash
cd backend

# Buat migration dan generate Prisma Client
npx prisma migrate dev --name init

# (Opsional) Buka Prisma Studio untuk melihat GUI database
npx prisma studio
```

---

## 4. 🏃 Menjalankan Aplikasi (Development Mode)

Buka 2 terminal terpisah:

### Terminal 1: Backend Server (Port 5000)
```bash
cd backend
npm run dev
```
* Backend akan berjalan di: `http://localhost:5000`
* Endpoint Health Check: `http://localhost:5000/api/health`

### Terminal 2: Frontend Client (Port 5173)
```bash
cd frontend
npm run dev
```
* Frontend akan berjalan di: `http://localhost:5173`

---

## 5. 🛠️ Skrip Berguna di Root

Pada root `package.json`, kamu dapat menjalankan kedua server secara bersamaan:
```bash
npm run dev # Menjalankan backend & frontend secara paralel via concurrently
```
