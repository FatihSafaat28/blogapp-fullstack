# 📚 Master Documentation Index

Selamat datang di repositori dokumentasi resmi untuk **Multi-User PERN Blog Platform**. Folder `docs/` ini adalah **Single Source of Truth (Kiblat Proyek)** yang wajib diacu oleh developer maupun AI Assistant pada sesi chat apapun untuk menjaga konsistensi arsitektur, standar clean code, dan fungsionalitas produk.

---

## 🗂️ Daftar Dokumen

| No | Dokumen | Deskripsi |
| :--- | :--- | :--- |
| **01** | [**01-PRD.md**](./01-PRD.md) | **Product Requirements Document**: Visi produk, persona pengguna, fungsionalitas sistem (Auth, Dashboard Ghost-style, Creator Page Substack-style, Reader Overreacted-style, Smart Analytics). |
| **02** | [**02-ARCHITECTURE_AND_STANDARDS.md**](./02-ARCHITECTURE_AND_STANDARDS.md) | **Standar Arsitektur & Clean Code**: Aturan batas ketat `< 300 baris per file`, pola **MVP (Model-View-Presenter)** di Frontend, Modular Architecture di Backend, konvensi penamaan, dan penanganan error. |
| **03** | [**03-DATABASE.md**](./03-DATABASE.md) | **Database & Data Modeling**: Skema PostgreSQL dengan Prisma ORM, relasi tabel, indexing composite, mekanisme deduplikasi 60-menit smart view, dan data dictionary. |
| **04** | [**04-API_SPECS.md**](./04-API_SPECS.md) | **Spesifikasi REST API**: Kontrak endpoint lengkap (Auth, Posts, Analytics, Users, Uploads), format request/response, validation rules (Zod), dan status HTTP. |
| **05** | [**05-DESIGN_AND_UIUX.md**](./05-DESIGN_AND_UIUX.md) | **Design System & UI/UX Guidelines**: CSS variables/tokens, typography (Inter & Outfit), Glassmorphism, layout reference breakdown (Ghost, Substack, Overreacted). |
| **06** | [**06-SETUP_AND_RUN.md**](./06-SETUP_AND_RUN.md) | **Panduan Setup & Menjalankan Proyek**: Prasyarat environment, konfigurasi file `.env`, migrasi database Prisma, dan perintah dev server. |
| **07** | [**07-TASK_BREAKDOWN.md**](./07-TASK_BREAKDOWN.md) | **Rincian Task & Roadmap Fitur**: Daftar tugas granular terstruktur per fitur dan per halaman (< 300 LOC & MVP pattern). |

---

## 🎯 Prinsip Utama Proyek
1. **Strict File Limit**: Maksimal **300 baris kode per file**. Jika mendekati batas, wajib di-refactor/dipecah menjadi sub-komponen atau sub-modul.
2. **Frontend MVP Pattern**: Pisahkan dengan jelas antara **Model** (data/API/query), **Presenter** (hooks/state/handlers), dan **View** (murni JSX + Tailwind CSS v4).
3. **Type-Safety End-to-End**: Menggunakan TypeScript secara ketat di Backend & Frontend dengan validasi runtime menggunakan Zod.
4. **Security by Default**: JWT disimpan dalam `httpOnly` secure cookies, sanitasi HTML, password hashing dengan `bcryptjs`, dan rate limiting.
