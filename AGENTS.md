# 🤖 AGENTS.md — Protocol & Engineering Standards

Dokumen ini adalah **panduan wajib (instructional manual)** bagi setiap AI Agent / Developer yang bekerja pada repositori **Multi-User PERN Blog Platform**. 

---

## 🔄 1. Protokol Memulai Sesi Baru (New Session Protocol)

Setiap kali kamu berada pada sesi chat baru atau menerima tugas baru, kamu **WAJIB** mengikuti urutan langkah berikut sebelum menulis baris kode apapun:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PROTOKOL SESI KERJA                             │
├────────────────────────────────────────────────────────────────────────┤
│ 1. 📖 BACA DOKUMENTASI    👉 Baca docs/README.md & folder docs/        │
│ 2. 🪵 BACA CHANGELOG      👉 Baca CHANGELOG.md (Cek "Done" & "Next")   │
│ 3. 🌐 QUERY GRAPHIFY      👉 Gunakan graphify query jika butuh konteks │
│ 4. 🎯 BUAT RENCANA KERJA  👉 Susun step-by-step pengerjaan fitur       │
│ 5. ⚡ EKSEKUSI KODE       👉 Terapkan standar clean code (< 300 LOC)   │
│ 6. 🧪 VERIFIKASI / TEST   👉 Pastikan type-safe & build sukses         │
│ 7. 🌐 UPDATE GRAPHIFY     👉 Update knowledge graph (sync kode baru)   │
│ 8. 📝 UPDATE CHANGELOG    👉 Catat hasil di CHANGELOG.md & set "Next"  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📏 2. Aturan Rekayasa Perangkat Lunak (Engineering Guardrails)

### A. Golden Rule: Maksimal 300 Baris per File (< 300 LOC)
* **Dilarang keras** membuat file kode (`.ts`, `.tsx`, `.css`) melebihi **300 baris**.
* Jika sebuah file mencapai 250 baris, **segera pecah**:
  * Di Frontend: Pisahkan sub-komponen visual ke `components/` atau logic ke custom hook `hooks/`.
  * Di Backend: Pisahkan logic query atau helper ke file terpisah.

### B. Frontend MVP Pattern (Model-View-Presenter)
* **Model (`services/`, `types/`)**: Bertanggung jawab atas query data, Axios/Fetch API, tipe data TypeScript, dan cache TanStack Query.
* **Presenter (`hooks/`)**: Bertanggung jawab atas state lokal, form handling, event callbacks, dan logika navigasi.
* **View (`components/`, `pages/`)**: Murni representasi visual JSX + CSS Module. Dilarang menaruh logic query atau fetch data langsung di dalam JSX view.

### C. Backend Clean Modular Architecture
* **Routes (`*.routes.ts`)**: Mendaftarkan rute dan middleware validasi Zod + Auth.
* **Controller (`*.controller.ts`)**: Menerima request HTTP, memanggil service, mengembalikan format response seragam. Dilarang memanggil database Prisma secara langsung di controller.
* **Service (`*.service.ts`)**: Tempat logika bisnis dan query database Prisma.
* **Schema (`*.schema.ts`)**: Skema validasi Zod untuk request body, params, dan query.

### D. Zero-Placeholder & Strict Type-Safety
* Dilarang menulis komentar *stub* `// TODO: implement later` pada alur fungsional inti.
* Dilarang menggunakan tipe `any`. Gunakan interface/type eksplisit atau type narrowing.

### E. Sinkronisasi Dokumentasi (`docs/` Sync Rule)
* Jika tokomu mengubah skema database, perbarui `docs/03-DATABASE.md`.
* Jika tokomu menambahkan atau memodifikasi endpoint API, perbarui `docs/04-API_SPECS.md`.

---

## 🌐 3. Integrasi & Perawatan Graphify

Graphify digunakan sebagai peta topologi arsitektur kode (GraphRAG) untuk melacak relasi file, dependensi antar modul, dan mendeteksi God Nodes.

### A. Kapan Menggunakan Graphify:
1. **Mencari Konteks & Relasi**: Saat ingin mengetahui hubungan antar komponen/service yang rumit, jalankan query graf:
   * `/graphify query "<pertanyaan alur data>"`
   * `/graphify path "<Node Asal>" "<Node Tujuan>"`
2. **Pembaruan Graf (Sync-on-Complete)**: Setiap kali menyelesaikan satu fase atau fitur baru yang menambah/mengubah file kode:
   * Jalankan pembaruan graf: `/graphify . --update`

---

## 🪵 4. Standar Format `CHANGELOG.md`

Setiap kali menyelesaikan task, update file `CHANGELOG.md` dengan format berikut:

```markdown
### 📌 [YYYY-MM-DD] - <Nama Fitur / Milestone>
- **Completed**:
  - Ringkasan file yang dibuat/diubah.
  - Fitur yang berhasil bekerja dan teruji.
- **Next**:
  - [ ] Rencana aksi selanjutnya untuk sesi berikutnya.
```
